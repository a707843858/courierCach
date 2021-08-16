export function formatQuery(url:string,data: any) {
	const params: any[] = [];
	if (data) {
		Object.keys(data).forEach((v) => {
			params.push(`${v}=${data[v]}`);
		});
	}
	if (url.search(/\?/) === -1) {
		url += '?' + params.join('&');
	} else {
		url += '&' + params.join('&');
	}
	return url;
}
export function isUndefined(data?: any) {
	return typeof data === 'undefined';
}
export function isObject(data?: any) {
	return data !== null && typeof data === 'object';
}

export function deepClone(obj: { [k: string]: any } | any[]) {
	let result = typeof obj.splice === 'function' ? [] : {};
	if (obj && typeof obj === 'object') {
		for (let key in obj) {
			if (obj[key] && typeof obj[key] === 'object') {
				result[key] = deepClone(obj[key]);
			} else {
				result[key] = obj[key];
			}
		}
		return result;
	}
	return obj;
}

export const supported = {
	blob: 'Blob' in globalThis,
	formData: 'FormData' in globalThis,
	arrayBuffer: 'ArrayBuffer' in globalThis,
	fileReader: 'FileReader' in globalThis,
	urlSearchParams: 'URLSearchParams' in globalThis,
	uint8Array: 'Uint8Array' in globalThis,
	readableStream: 'ReadableStream' in globalThis,
	headers: 'Headers' in globalThis,
	request: 'Request' in globalThis,
	response: 'Response' in globalThis,
	fetch: 'fetch' in globalThis,
	caches: 'caches' in globalThis,
};

export const createKey = function (params: Request) {
	// const url = formatQuery(url,params);
	// const fixed = `${params.url},methods:${params.method},data:${params.body}`;
};

export const tuple = <T extends string[]>(...args: T) => args;

