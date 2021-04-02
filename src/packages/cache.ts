interface responseType extends Response {
	expires: number;
	expirationTime: number | Date;
}


const Cache = (function () {
	let type: string = 'custom',
		cache = new Map(),
		caches = new Proxy(cache, {
			get(target, prop): responseType {
				return target[prop].bind(target);
			},
			set(target, prop, value) {
				target.set(prop, value);
				return true;
			},
		});
	// if ('caches' in window) {
	// 	caches = window.caches.open('/ApiCache');
	// }

	return {
		// cacheProxy: caches,
		list: function () {
			return new Promise((resolve) => {
				resolve(caches);
			});
		},
		get: function (key: string): Promise<responseType> {
			return new Promise((resolve) => {
				const value = caches.get(key) || '';
				resolve(value);
			});
		},
		set: function (key: string, response: responseType): Promise<boolean> {
			return new Promise((resolve, reject) => {
				if (response.expires) {
					const cacheItem = caches.get(key) || '';
					if (!cacheItem || new Date().getTime() >= cacheItem.expirationTime) {
						caches[key] = response;
						resolve(true);
					} else {
						resolve(false);
					}
				} else {
					resolve(false)
				}
			});
		},
		has: function (key: string):Promise<boolean> {
			return new Promise((resolve) => {
				const cacheItem = caches.get(key) || '';
				const isExpirse = cacheItem ? (new Date().getTime() >= cacheItem.expirationTime ? true : false) : false;
				resolve(isExpirse);
			});
		},
		delete: function (key: string):Promise<boolean> {
			return new Promise((resolve) => {
				caches.delete(key);
				const cacheItem = caches[key] || '';
				resolve(cacheItem ? false : true);
			});
		},
		clear: function ():Promise<boolean> {
			return new Promise((resolve) => {
				caches.clear();
				const isOk = caches.size > 0 ? false : true;
				resolve(isOk);
			});
		},
	};
})();

export default Cache;
