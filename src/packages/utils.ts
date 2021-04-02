export function formatQuery(data: any) {
	const params: any[] = [];
	if (data) {
		Object.keys(data).forEach((v) => {
			params.push(`${v}=${data[v]}`);
		});
	}
	return params.length ? '?' + params.join('&') : '';
}
export function checkType(data?: any, type?: string) {
	return data !== null && typeof data === type;
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

export const tuple = <T extends string[]>(...args: T) => args;

