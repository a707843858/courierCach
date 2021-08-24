export type CacheType = 'map' | 'cacheStorage' | 'indexDB';

export interface CCache {
	readonly type: CacheType;
	clear: () => Promise<boolean>;
	get: (key: Request,body?:BodyInit) => Promise<Response | undefined>;
	set: (key: Request, value: Response,body?:BodyInit) => Promise<boolean>;
	has: (key: Request) => Promise<boolean>;
	delete: (key: Request) => Promise<boolean>;
	// forEach: (CallableFunction: (value: Response, key: Request, map: any) => void) => void;
}