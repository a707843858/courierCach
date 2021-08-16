import { CCache, CacheType } from './cach';

export class MapCache implements CCache {
	readonly type: CacheType = 'map';
	static _cache: Map<Request, Response>;

	constructor() {
		this.clear();
	}

	get cache() {
		return MapCache._cache;
	}

	set cache(val: any) {
		throw Error(`Disallow set value to ${val} !`);
	}

	async clear() {
		MapCache._cache = new Map();
		return true;
	}

	async get(key: Request) {
		return MapCache._cache.get(key);
	}

	async set(key: Request, value: Response) {
		MapCache._cache.set(key, value);
		return true;
	}

	async has(key: Request) {
		return MapCache._cache.has(key);
	}

	async delete(key: Request) {
		return MapCache._cache.delete(key);
	}

	// forEach(callback: (value: Response,key: Request, map: Map<Request, Response>) => void): void {
	// 	MapCache._cache.forEach(callback);
	// }
}
