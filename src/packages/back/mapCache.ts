//@ts-nocheck
export interface responseType extends Response {
	expires: number;
	expirationTime: number | Date;
}

export interface cacheControlType {
	type: string;
	cacheProxy?: Map<any, any>;
	size: () => Promise<number>;
	get: (key: string, url: string, config: any) => Promise<responseType>;
	set: (key: string, response: Response) => Promise<boolean | void>;
	has: (key: string, url: string, config: any) => Promise<boolean>;
	delete: (key: string) => Promise<boolean>;
	clear: () => Promise<boolean>;
}

const Cache = (function () {
	let type = 'custom',
		cachesName = 'apiCache',
		cache: Map<any, any> = new Map(),
		caches: Map<any, any>,
		cacheStorage: Cache;
	if ('caches' in window) {
		// CachStorage
		type = 'cacheStorage';
	} else {
		// cache
		type = 'custom';
		cache = new Map();
		caches = new Proxy(cache, {
			get(target, prop): responseType {
				return target[prop].bind(target);
			},
			set(target, prop, value) {
				target.set(prop, value);
				return true;
			},
		});
	}

	const cacheControl: cacheControlType = {
		type: type,
		cacheProxy: cache,
		size: async function () {
			let size = 0;
			if (type === 'cachesStorage') {
				const value = await cacheStorage.keys();
				size = value.length || 0;
			} else {
				size = cache.size || 0;
			}
			return size;
		},
		get: async function (key, url, config) {
			let value;
			if (type === 'cacheStorage') {
				const cachesControl = await window.caches.open(cachesName);
				// @ts-ignore
				value = await cachesControl.match(key);
			} else {
				value = caches.get(key) || '';
			}
			console.log(value,'f');
			return value;
		},
		set: async function (key, response) {
			console.log(response,'a');
			let isOk = false;
			if (type === 'cacheStorage') {
				const cachesControl = await window.caches.open(cachesName);
				await cachesControl.put(key, response);
				isOk = true;
			} else {
				caches[key] = response;
				isOk = true;
			}
			return isOk;
		},
		has: async function (key, url, config) {
			const cacheItem = (await this.get(key, url, config)) || '';
			const isExpirse: boolean = cacheItem ? (new Date().getTime() >= cacheItem.expirationTime ? true : false) : false;
			return isExpirse;
		},
		delete: async function (key) {
			let cacheItem: Response | boolean = false;
			if (type === 'cacheStorage') {
				const cachesControl = await window.caches.open(cachesName);
				cacheItem = await cachesControl.delete(key);
			} else {
				caches.delete(key);
				cacheItem = caches[key] || '';
			}
			return cacheItem ? false : true;
		},
		clear: async function () {
			let isOk: boolean = false;
			if (type === 'cacheStorage') {
				isOk = await window.caches.delete(cachesName);
			} else {
				caches.clear();
				isOk = caches.size > 0 ? false : true;
			}
			return isOk;
		},
	};

	return cacheControl;
})();

export default Cache;
