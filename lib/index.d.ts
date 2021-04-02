export = courierCach;
export as namespace courierCach;

declare namespace courierCach {
	let methodsTypes: [string];
	type methodsType = typeof methodsTypes[number];

	interface fetchBaseProps {
		method?: string;
		body?: any;
		timeout?: number;
		expires?: number;
		headers?: {
			[k: string]: any;
		};
		signal?: any;
		params?: any;
	}

	interface fetchOtherProps extends fetchBaseProps {
		responseType?: string;
	}

	interface fetchProps extends fetchBaseProps {
		responseType: string;
	}

	interface interceptRequestResponse {
		errorResponse: any;
		config: fetchProps;
	}

	class Courier {
		defaults: any;
		task: any[];
		constructor(config?: { [k: string]: any });
		fetch(url: string, config: fetchProps): Promise<unknown>;
		post(url: string, config: fetchOtherProps): Promise<unknown>;
		get(url: string, config: fetchOtherProps): Promise<unknown>;
		put(url: string, config: fetchOtherProps): Promise<unknown>;
		patch(url: string, config: fetchOtherProps): Promise<unknown>;
		delete(url: string, config: fetchOtherProps): Promise<unknown>;
		heade(url: string, config: fetchOtherProps): Promise<unknown>;
		options(url: string, config: fetchOtherProps): Promise<unknown>;
		interceptRequest(resolve: void, reject: void): void;
		interceptResponse(resolve: void, reject: void): void;
	}

	//cach
	interface responseType extends Response {
		expires: number;
		expirationTime: number | Date;
	}

	const Cach: {
		list: () => Promise<unknown>;
		get: (key: string) => Promise<responseType>;
		set: (key: string, response: responseType) => Promise<boolean>;
		has: (key: string) => Promise<boolean>;
		delete: (key: string) => Promise<boolean>;
		clear: () => Promise<boolean>;
	};

	//mergeConfig
	interface DefautsConfig {
		baseUrl: string;
		expires: number;
		timeout: number;
		headers: {
			[k: string]: any;
		};
		responseType: string;
		credentials?: string;
		responseEncoding: string;
		xsrfCookieName: string;
		xsrfHeaderName: string;
	}

	function mergeConfig(configProps: { [k: string]: any }): DefautsConfig;

	//task
	const taskModule: {
		tasksProxy: any;
		createKey: (url: string, config: any) => string;
		addTask: (original: string, controller: any) => void;
		deleteTask: (original: string, start: boolean) => void;
	};

	//utils
	function formatQuery(data: any): string;
	function checkType(data?: any, type?: string): boolean;
	function isUndefined(data?: any): boolean;
	function isObject(data?: any): boolean;
	function deepClone(
		obj:
			| {
					[k: string]: any;
			  }
			| any[]
	): {
		[k: string]: any;
	};
	const tuple: <T extends string[]>(...args: T) => T;
}

// export default Courier;
