import { MapCache } from './mapCache';
import { CacheType, CCache } from './cach';
import { CCacheStorage } from './cacheStorage';
import { supported } from '../utils';
// import { supported } from '../utils';

export const createCache = function name(type: CacheType) {
	if (type === 'cacheStorage' && supported.caches && supported.fetch) {
		return new CCacheStorage();
	} else {
		return new MapCache();
	}
};

export { MapCache };
export type { CacheType, CCache };
