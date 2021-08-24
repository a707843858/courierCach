import { CacheType, CCache } from './cach';
import {convertToPostRequest} from '../utils'
// import cryptoJs from 'crypto-js';

export class CCacheStorage implements CCache {
	readonly type: CacheType = 'cacheStorage';
	readonly cachesName = 'apiCache';

	async clear() {
		await caches.delete(this.cachesName);
		await caches.open(this.cachesName);
		return true;
	}

	async get(key: Request,body?:BodyInit) {
		return caches.open(this.cachesName).then((res) => {
			const request = key.method === 'GET' ? key : convertToPostRequest(key,{body});
			return res
				.match(request)
				.then((response) => {
					return response;
				})
				.catch(() => undefined);
		});
	}

	async set(key: Request, value: Response,body?:BodyInit) {
		return caches
			.open(this.cachesName)
			.then((res) => {
				const request = key.method === 'GET' ? key : convertToPostRequest(key, { body });
				res.put(request, value);
				return true;
			})
			.catch(() => false);
	}

	async has(key: Request) {
		return caches
			.open(this.cachesName)
			.then((res) => {
				return res.match(key).then((response) => {
					return response ? true : false;
				});
			})
			.catch(() => false);
	}

	async delete(key: Request) {
		return caches.open(this.cachesName).then((res) => {
			return res
				.delete(key)
				.then((response) => {
					return response;
				})
				.catch(() => false);
		});
	}

	// forEach(callback: (value: any, key: Request, map: readonly Request[]) => void): void {
	// 	caches.open(this.cachesName).then((res) => {
	// 		console.log(res, 'res');
	// 		res.keys().then((list) => {
	// 			list.forEach((item) => {
	// 				callback(res.match(item), item, []);
	// 			});
	// 		});
	// 	});
	// }
}


