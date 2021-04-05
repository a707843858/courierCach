import tasks from './task';
import cache from './cache';
import { tuple, formatQuery, checkType } from './utils';
import mergeConfig from './mergeConfig';
import fetch from 'node-fetch';
// import 'core-js';
// import "babel-polyfill";

const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];
const methodsTypes = tuple(methods.join(','));
export type methodsType = typeof methodsTypes[number];
const env = window ? 'window' : this === 'node' ? 'node' : '';
const f = function (url: string, config: any) {
	console.log('a');
	return window ? window.fetch(url, config) : fetch;
};
let requestInterceptorChain: any[] = [],
	responseInterceptorChain: any[] = [];

export interface fetchBaseProps {
	method?: string;
	body?: any;
	timeout?: number;
	expires?: number;
	headers?: { [k: string]: any };
	signal?: any;
	params?: any;
}

export interface fetchOtherProps extends fetchBaseProps {
	responseType?: string;
}

export interface fetchProps extends fetchBaseProps {
	responseType: string;
}

export interface interceptRequestResponse {
	errorResponse: any;
	config: fetchProps;
}

class Courier {
	defaults;
	task: any[] = tasks.tasksProxy;
	// cache: { [k: string]: any } = cache.cacheProxy;

	constructor(config: { [k: string]: any } = {}) {
		this.defaults = mergeConfig(config);
	}

	fetch(url: string, config: fetchProps) {
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
		config = defineConfig(defaults, config);
		/**
		 * Body
		 */
		if (config.body) {
			if (config.method === 'GET') {
				const params = formatQuery(config.body);
				url += params;
				config.body = null;
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
				return false;
			}

			config = interceptRequestResponse.config;
			/** Task | Cache */
			cacheKey = defineCacheKey({ url, config, expires, controller });
			const cacheItem = cacheKey ? await cache.get(cacheKey) : '';
			sendReqest = cacheItem && timestamp < cacheItem.expirationTime ? false : true;
			/** Fetch */
			const fecthPromise = sendReqest ? f(url, config) : cache.get(cacheKey),
				abortPromise = new Promise((res, rej) => {
					if (defaults.timeout) {
						let timer = setTimeout(() => {
							controller.abort();
							rej({
								status: 504,
							});
							clearTimeout(timer);
						}, defaults.timeout);
					}
				});
			Promise.race([fecthPromise, abortPromise])
				.then(async (res: any) => {
					/** updateCache */
					if (res && expires > 0 && (!cacheItem || timestamp > cacheItem.expirationTime)) {
						const data = (await convertResponse(res, config.responseType)) || '';
						res.data = data ? (checkType(data, 'object') ? data.data : data) : '';
						if (data) {
							res.expires = expires;
							res.expirationTime = timestamp + Math.abs(expires);
							const saveCache = await cache.set(cacheKey, res);
							if (!saveCache) {
								console.error(`The request (${url}) result cache failed !`);
							}
						}
					}
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

	post(url: string, config: fetchOtherProps) {
		const configProps: fetchProps = { method: 'POST', responseType: '' };
		Object.keys(config).forEach((key) => {
			configProps[key] = config[key];
		});
		return this.fetch(url, configProps);
	}

	get(url: string, config: fetchOtherProps) {
		const configProps: fetchProps = { method: 'GET', responseType: '' };
		Object.keys(config).forEach((key) => {
			configProps[key] = config[key];
		});
		return this.fetch(url, configProps);
	}

	put(url: string, config: fetchOtherProps) {
		const configProps: fetchProps = { method: 'PUT', responseType: '' };
		Object.keys(config).forEach((key) => {
			configProps[key] = config[key];
		});
		return this.fetch(url, configProps);
	}

	patch(url: string, config: fetchOtherProps) {
		const configProps: fetchProps = { method: 'PATCH', responseType: '' };
		Object.keys(config).forEach((key) => {
			configProps[key] = config[key];
		});
		return this.fetch(url, configProps);
	}

	delete(url: string, config: fetchOtherProps) {
		const configProps: fetchProps = { method: 'DELETE', responseType: '' };
		Object.keys(config).forEach((key) => {
			configProps[key] = config[key];
		});
		return this.fetch(url, configProps);
	}

	heade(url: string, config: fetchOtherProps) {
		const configProps: fetchProps = { method: 'HEAD', responseType: '' };
		Object.keys(config).forEach((key) => {
			configProps[key] = config[key];
		});
		return this.fetch(url, configProps);
	}

	options(url: string, config: fetchOtherProps) {
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

function defineConfig(defaultConfig: any, config: any) {
	const method = config.method,
		defaultHeaders = defaultConfig.headers,
		headerTags = [method, 'COMMON'];
	config.headers = config.headers && typeof config.headers === 'object' ? config.headers : {};
	/** Headers */
	headerTags.forEach((tag) => {
		if (defaultHeaders[tag]) {
			const header = defaultHeaders[tag];
			Object.keys(header).forEach((key) => {
				config.headers[key] = config.headers[key] === undefined ? header[key] : config.headers[key];
			});
		}
	});
	/** Credentials */
	config.credentials = config.credentials || defaultConfig.credentials || '';
	return config;
}

function defineCacheKey(x: { url: string; config: any; expires: number; controller: any }): string {
	const cacheKey = tasks.createKey(x.url, x.config);
	tasks.deleteTask(cacheKey, true);
	tasks.addTask(cacheKey, x.controller);
	// cache.addCach(cachKey, x.expires, '');
	return cacheKey;
}

function interceptRequestAction(config: fetchProps) {
	let errorResponse: any = '';
	const _config: fetchProps = requestInterceptorChain[0] ? requestInterceptorChain[0](config) : config;
	let errMsg = "";
	if (!_config) {
		errMsg = 'Missing return value !';
		errorResponse = requestInterceptorChain[1] ? requestInterceptorChain[1](errMsg) || 'No custom error message was returned !' : errMsg;
	}
	return { errorResponse, config: _config };
}

function interceptResponseAction(res: any, type: string) {
	let _res: any = '';
	if (type === 'resolve') {
		_res = responseInterceptorChain[0] ? responseInterceptorChain[0](res) : res;
	} else {
		_res = responseInterceptorChain[1] ? responseInterceptorChain[1](res) : res;
	}
	return _res;
}

function convertResponse(value: any, type: string): any {
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
}

export default Courier;
