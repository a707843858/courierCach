// import 'whatwg-fetch';
// import tasks from './task';
// import cacheControl from './mapCache';
import { tuple, formatQuery } from './utils';
import { Config } from './config';
import { Task } from './tasks';
import { createCache, CacheType, CCache } from './cach';
import { CHeaders, CResponse, CRequest } from './polyfill';
import { supported } from './utils';

// const Headers = 'Headers' in window ? window.Headers : CHeaders,
// 	Request = 'Request' in window ? window.Request : CRequest,
// 	Response = 'Response' in window ? window.Response : CResponse,
// 	fetch = 'fetch' in window ? window.fetch : CFetch;
// window.Headers = CHeaders;

// if (!('Headers' in  globalThis)) {
// 	window.Headers = CHeaders;
// }

if (!supported.headers) {
	globalThis.Headers = CHeaders;
}
if (!supported.request) {
	globalThis.Request = CRequest;
}
if (!supported.response) {
	globalThis.Response = CResponse;
}

const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];
const methodsTypes = tuple(methods.join(','));

export type methodsType = typeof methodsTypes[number];

export interface fetchConfig extends RequestInit {
	expires?: number;
	responseType?: string;
	params?: any;
	signal?: AbortSignal;
}

// interface ResponseData extends Response {
// 	data?: any;
// }

class CourierCach<T extends keyof Config> {
	readonly cacheType: CacheType;
	defaults: Config;
	task: Task;
	cache: CCache;

	constructor(config?: { [T: string]: Config[T] }) {
		this.defaults = new Config(config || {});
		this.task = new Task();
		this.cache = createCache(this.defaults.cacheType);
		this.cacheType = this.cache.type;
	}

	async useFetch(url: string, config: fetchConfig) {
		/** Base Data */
		const defaults = this.defaults,
			cache = this.cache;
		const expires = config.expires || defaults.expires || 0,
			requestInterceptorResolve = (defaults.requestInterceptor && defaults.requestInterceptor[0]) || null,
			requestInterceptorReject = (defaults.requestInterceptor && defaults.requestInterceptor[1]) || null,
			responseInterceptorResolve = (defaults.responseInterceptor && defaults.responseInterceptor[0]) || null,
			responseInterceptorReject = (defaults.responseInterceptor && defaults.responseInterceptor[1]) || null;

		/** Before fetch */
		Object.keys(defaults).forEach((name) => {
			const unlessKeys: string[] = ['headers', 'requestInterceptor', 'responseInterceptor'];
			if (!unlessKeys.includes(name)) {
				config[name] = config[name] === undefined ? defaults[name] : config[name];
			}
		});
		!config.method && (config.method = 'GET');
		config = requestInterceptorResolve ? requestInterceptorResolve(config) || null : config;
		if (!config) {
			return Promise.reject((requestInterceptorReject && requestInterceptorReject('RequestInterceptor should return config !')) || '');
		}

		if (requestInterceptorReject) {
			let errMsg: string | undefined;
			if (!config) {
				errMsg = await requestInterceptorReject('RequestInterceptor should return config !');
			}
			if (errMsg) {
				return Promise.reject(errMsg);
			}
		}

		//Headers
		config.headers = mergerHeaders(config.headers, [defaults.headers['common'] || {}, defaults.headers[config.method || 'get'] || {}]);

		//Signal
		if (!config.signal) {
			const { signal } = new AbortController();
			config.signal = signal;
		}

		//Body
		if (['GET', 'get'].includes(config.method || 'get')) {
			url = formatQuery(defaults.baseUrl + url, config.params);
		} else {
			config.body = config.params;
		}

		//Request
		const request = new Request(url, config);
		
		//Cache Item
		const timestamp = new Date().getTime(),
			cacheItem = await cache.get(request);
		const expirationTime = cacheItem?.headers?.get('_expirationTime') || 0;
		const sendReqest = timestamp >= expirationTime;
		const fecthPromise: Promise<Response> = sendReqest || !cacheItem ? fetch(request) : Promise.resolve(cacheItem),
			//@ts-ignore
			abortPromise: Promise<void> = new Promise((res, rej): any => {
				if (defaults.timeout) {
					let timer = setTimeout(() => {
						rej('The request has timed out !');
						clearTimeout(timer);
					}, defaults.timeout);
				}
			});

		this.task.set(request, config.signal);
		console.log(sendReqest, 'jjj');

		//Fetch
		let response = await Promise.race([fecthPromise, abortPromise])
			.catch((err) => {
				responseInterceptorReject && (err = responseInterceptorReject(err) || null);
				return new Error(err);
			})
			.finally(() => {
				this.task.delete(request);
			});

		if (!response || response instanceof Error) {
			const errMsg = response instanceof Error ? response.message : 'The Response body should be of type Response';
			return Promise.reject(errMsg);
		}

		/** updateCache */
		if (response && expires > 0 && sendReqest) {
			const newResponse = new Response(response.body, {
				headers: { ...config.headers, _url: url || '', _expires: `${expires}`, _expirationTime: `${new Date().getTime() + Math.abs(expires)}` },
				status: response.status,
				statusText: response.statusText,
			});
			const saveResult = await cache.set(request, newResponse);
			if (!saveResult) {
				Promise.reject('Failed to save cache');
			}
			response = (await cache.get(request)) as Response;
		}

		/** Structural response body  */
		// let response = structuralResponse(res);
		responseInterceptorResolve && (response = responseInterceptorResolve(response) || response);

		return response as Response;
	}

	useRequestIntercept(resolve?: ((res: { [k: string]: any }) => { [k: string]: any }) | null, reject?: ((err: string) => string) | null) {
		this.defaults.requestInterceptor = [resolve || null, reject || null];
	}

	useResponseIntercept(resolve?: ((res: Response) => Response) | null, reject?: ((err: string) => string) | null) {
		this.defaults.responseInterceptor = [resolve || null, reject || null];
	}
}

const mergerHeaders = function (input: HeadersInit | undefined, props: { [k: string]: any }[] = []) {
	const headers = input instanceof Headers ? input : new Headers(input);
	console.log(props, 'p');
	props.forEach((col) => {
		Object.getOwnPropertyNames(col).forEach((name) => {
			console.log(name, col[name]);
			headers.set(name, col[name] || undefined);
		});
	});
	return headers;
};

export { Config, CourierCach };
export default CourierCach;
