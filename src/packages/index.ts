import tasks from './task';
import cacheControl from './mapCache';
import { tuple, formatQuery, checkType } from './utils';
import mergeConfig, { DefautsConfigType } from './mergeConfig';
import fetch, { Headers, Response } from 'node-fetch';
// import 'core-js';
// import "babel-polyfill";

const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];
const methodsTypes = tuple(methods.join(','));
export type methodsType = typeof methodsTypes[number];
// const env = window ? 'window' : this === 'node' ? 'node' : '';
const f = function (url: string, config: any) {
	return window ? window.fetch(url, config) : fetch;
};
let requestInterceptorChain: any[] = [],
	responseInterceptorChain: any[] = [];

export interface fetchProps {
	method?: string;
	body?: any;
	timeout?: number;
	expires?: number;
	headers?: { [k: string]: any };
	signal?: any;
	params?: any;
	cache?: string;
	responseType?: string;
	credentials?: string;
	mode?: string;
	redirect?: string;
	referrer?: string;
	integrity?: string;
	keepalive?: boolean;
	isHistoryNavigation?: boolean;
}

export interface interceptRequestResponse {
	errorResponse: any;
	config: fetchProps;
}

class CourierCach {
	readonly cacheType: string;
	defaults;
	task: any[] = tasks.tasksProxy;
	// cache: { [k: string]: any } = {};

	constructor(config: { [k: string]: any } = {}) {
		this.cacheType = cacheControl.type;
		this.defaults = mergeConfig(config);
	}

	fetch(url: string, config: fetchProps = { method: 'GET' }): Promise<Response> {
		/**
		 * Init
		 */
		const defaults = this.defaults,
			expires = config.expires || defaults.expires || 0,
			controller = new AbortController(),
			signal = controller.signal,
			timestamp: number = new Date().getTime();
		let cacheKey = '',
			sendReqest = true;
		config.method = config.method ? config.method.toUpperCase() : 'GET';
		url = defaults.baseUrl + url;
		config.signal = signal;
		/**
		 * Headers
		 */
		config = mergeConfigAction(defaults, config);
		/**
		 * Body
		 */
		if (config.body) {
			if (config.method === 'GET') {
				const params = formatQuery(config.body);
				url += params;
				config.body = undefined;
			}
		}
		/**
		 * Fetch Task Promise
		 */
		return new Promise(async (resolve, reject) => {
			/** beforeFetch */
			const interceptRequestResponse = interceptRequestAction(config);
			if (interceptRequestResponse.errorResponse) {
				reject(interceptRequestResponse.errorResponse);
			}
			config = interceptRequestResponse.config;
			/** Task | Cache */
			cacheKey = createCacheKey({ url, config, expires, controller });
			sendReqest = await isSendRequest(this.cacheType, cacheKey, url, config, expires);
			/** Fetch */
			const fecthPromise = sendReqest ? f(url, config) : cacheControl.get(cacheKey, url, config),
				abortPromise = new Promise((res, rej) => {
					if (defaults.timeout) {
						let timer = setTimeout(() => {
							controller.abort();
							rej('The request has timed out !');
							clearTimeout(timer);
						}, defaults.timeout);
					}
				});
			Promise.race([fecthPromise, abortPromise])
				.then(async (res: any) => {
					/** updateCache */
					if (res && expires > 0 && sendReqest) {
						if (res.body) {
							const newResponse = new Response(res.body || null, { headers: config.headers });
							newResponse.headers.set('_expires', expires + '');
							newResponse.headers.set('_expirationTime', timestamp + Math.abs(expires) + '');
							// @ts-ignore
							const saveCache = await cacheControl.set(cacheKey, newResponse);
							if (!saveCache) {
								reject(`The request (${url}) result cache failed !`);
							}
							res = (await cacheControl.get(cacheKey, url, config)) || '';
						}
					}
					const data = (await convertResponse(res, config && config.responseType ? config.responseType : 'json')) || '';
					res.data = data ? (checkType(data, 'object') ? data.data : data) : '';
					res = interceptResponseAction(res, 'resolve');
					resolve(res);
				})
				.catch((err) => {
					let error = { status: 400 };
					if (err.status) {
						error.status = err.status;
					}
					/** afterFetch Resolve */
					error = interceptResponseAction(error, 'reject');
					reject(error);
				})
				.finally(() => {
					tasks.deleteTask(cacheKey, false);
				});
		});
	}

	post(url: string, config: fetchProps = { method: 'POST', responseType: 'json' }): Promise<Response> {
		const configProps: fetchProps = { method: 'POST', responseType: '' };
		Object.keys(config).forEach((key) => {
			configProps[key] = config[key];
		});
		return this.fetch(url, configProps);
	}

	get(url: string, config: fetchProps = { method: 'GET', responseType: 'json' }): Promise<Response> {
		const configProps: fetchProps = { method: 'GET', responseType: '' };
		Object.keys(config).forEach((key) => {
			configProps[key] = config[key];
		});
		return this.fetch(url, configProps);
	}

	put(url: string, config: fetchProps = { method: 'PUT', responseType: 'json' }): Promise<Response> {
		const configProps: fetchProps = { method: 'PUT', responseType: '' };
		Object.keys(config).forEach((key) => {
			configProps[key] = config[key];
		});
		return this.fetch(url, configProps);
	}

	patch(url: string, config: fetchProps = { method: 'PATCH', responseType: 'json' }): Promise<Response> {
		const configProps: fetchProps = { method: 'PATCH', responseType: '' };
		Object.keys(config).forEach((key) => {
			configProps[key] = config[key];
		});
		return this.fetch(url, configProps);
	}

	delete(url: string, config: fetchProps = { method: 'DELETE', responseType: 'json' }): Promise<Response> {
		const configProps: fetchProps = { method: 'DELETE', responseType: '' };
		Object.keys(config).forEach((key) => {
			configProps[key] = config[key];
		});
		return this.fetch(url, configProps);
	}

	heade(url: string, config: fetchProps = { method: 'HEAD', responseType: 'json' }): Promise<Response> {
		const configProps: fetchProps = { method: 'HEAD', responseType: '' };
		Object.keys(config).forEach((key) => {
			configProps[key] = config[key];
		});
		return this.fetch(url, configProps);
	}

	options(url: string, config: fetchProps = { method: 'OPTIONS', responseType: 'json' }): Promise<Response> {
		const configProps: fetchProps = { method: 'OPTIONS', responseType: '' };
		Object.keys(config).forEach((key) => {
			configProps[key] = config[key];
		});
		return this.fetch(url, configProps);
	}

	interceptRequest(resolve?: Function, reject?: Function) {
		requestInterceptorChain = [resolve, reject];
	}

	interceptResponse(resolve?: Function, reject?: Function) {
		responseInterceptorChain = [resolve, reject];
	}
}

const mergeConfigAction = function (defaultConfig: DefautsConfigType, config: fetchProps) {
	config = mergeHeaderAction(defaultConfig, config);
	Object.keys(defaultConfig).forEach((key) => {
		const mustHaveListList: string[] = ['method', 'headers', 'body', 'mode', 'credentials', 'cache', 'redirect', 'referrer', 'integrity', 'keepalive', 'isHistoryNavigation'];
		if (key && mustHaveListList.indexOf(key) > -1 && config[key] === undefined) {
			config[key] = defaultConfig[key];
		}
	});
	return config;
};

const mergeHeaderAction = function (defaultConfig: DefautsConfigType, config: fetchProps) {
	const method = config.method,
		defaultHeaders = defaultConfig.headers,
		headerTags = [method, 'COMMON'];
	const headers: { [k: string]: any } = config.headers && typeof config.headers === 'object' ? config.headers : {};
	/** Merge Headers */
	headerTags.forEach((tag) => {
		if (tag && defaultHeaders[tag]) {
			const header = defaultHeaders[tag];
			Object.keys(header).forEach((key) => {
				headers[key] = headers[key] === undefined ? header[key] : headers[key];
			});
		}
	});
	// headers['Expires'] = new Date().toJSON();
	config.headers = new Headers(headers);
	return config;
};

const createCacheKey = function (x: { url: string; config: any; expires: number; controller: any }): string {
	const cacheKey = tasks.createKey(x.url, x.config);
	tasks.deleteTask(cacheKey, true);
	tasks.addTask(cacheKey, x.controller);
	return cacheKey;
};

const interceptRequestAction = function (config: fetchProps) {
	let errorResponse: any = '';
	const _config: fetchProps = requestInterceptorChain[0] ? requestInterceptorChain[0](config) : config;
	let errMsg = '';
	if (!_config) {
		errMsg = 'Missing return value !';
		errorResponse = requestInterceptorChain[1] ? requestInterceptorChain[1](errMsg) || 'No custom error message was returned !' : errMsg;
	}
	return { errorResponse, config: _config };
};

const interceptResponseAction = function (res: any, type: string) {
	let _res: any = '';
	if (type === 'resolve') {
		_res = responseInterceptorChain[0] ? responseInterceptorChain[0](res) : res;
	} else {
		_res = responseInterceptorChain[1] ? responseInterceptorChain[1](res) : res;
	}
	return _res;
};

const convertResponse = function (value: any, type: string): Promise<any> {
	let res: any = '';
	switch (type) {
		case 'text':
			res = value.text();
			break;
		case 'arrayBuffer':
			res = value.arrayBuffer();
			break;
		case 'blob':
			res = value.blob();
			break;
		case 'formData':
			res = value.formData();
			break;
		default:
			res = value.json();
	}
	return res;
};

const isSendRequest = async function (type: string, cacheKey: string, url: string, config: fetchProps, expires: number): Promise<boolean> {
	let isSend = true;
	const timestamp = new Date().getTime();
	const cacheItem = (await cacheControl.get(cacheKey, url, config)) || '';
	const headers = cacheItem && cacheItem.headers ? cacheItem.headers : '';
	if (!config.headers || !headers || (config.cache && ['no-cache', 'reload'].indexOf(config.cache) > -1)) {
		return true;
	}
	const expirationTime = headers.get('_expirationTime') || 0;
	if (config.cache === 'force-cache' || (expirationTime && timestamp < parseInt(expirationTime))) {
		isSend = false;
	}
	return isSend;
};

export default CourierCach;
