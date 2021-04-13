export = CourierCach;
export as namespace CourierCach;

declare const methodsTypes: [string];
type methodsType = typeof methodsTypes[number];
interface fetchProps {
	method?: string;
	body?: any;
	timeout?: number;
	expires?: number;
	headers?: {
		[k: string]: any;
	};
	cache?: string;
	signal?: any;
	params?: any;
	responseType?: string;
	credentials?: string;
	mode?: string;
	redirect?: string;
	referrer?: string;
	integrity?: string;
	keepalive?: boolean;
	isHistoryNavigation?: boolean;
}
declare class CourierCach {
	readonly cacheType: string;
	defaults: any;
	task: any[];
	cache: {
		[k: string]: any;
	};
	constructor(config?: { [k: string]: any });
	fetch(url: string, config?: fetchProps): Promise<Response>;
	post(url: string, config?: fetchProps): Promise<Response>;
	get(url: string, config?: fetchProps): Promise<Response>;
	put(url: string, config?: fetchProps): Promise<Response>;
	patch(url: string, config?: fetchProps): Promise<Response>;
	delete(url: string, config?: fetchProps): Promise<Response>;
	heade(url: string, config?: fetchProps): Promise<Response>;
	options(url: string, config?: fetchProps): Promise<Response>;
	interceptRequest(resolve?: Function, reject?: Function): void;
	interceptResponse(resolve?: Function, reject?: Function): void;
}
