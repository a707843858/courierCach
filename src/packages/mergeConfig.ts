import { isObject, isUndefined } from './utils';

export interface DefautsConfig {
	baseUrl: string;
	expires: number;
	timeout: number;
	headers: { [k: string]: any };
	responseType: string;
	credentials?: string;
	responseEncoding: string;
	xsrfCookieName: string;
	xsrfHeaderName: string;
}

export default function mergeConfig(configProps: { [k: string]: any }): DefautsConfig {
	const config: DefautsConfig = {
		baseUrl: '',
		expires: 0,
		timeout: 0,
		headers: {},
		responseType: 'json',
		credentials: 'include',
		responseEncoding: 'utf8',
		xsrfCookieName: '',
		xsrfHeaderName: '',
	};

	/** baseConfig */
	Object.keys(config).forEach((key) => {
		if (Object.prototype.hasOwnProperty.call(configProps, key)) {
			config[key] = configProps[key];
		}
	});

	/** headers */
	const headers: { [k: string]: any } = {
		COMMON: {
			Accept: 'application/json, text/plain, */*',
		},
		DELETE: {},
		GET: {},
		POST: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		PUT: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		PATCH: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		HEAD: {},
	};

	if (configProps['headers'] && isObject(configProps['headers'])) {
		Object.keys(headers).forEach((key) => {
			if (Object.hasOwnProperty.call(configProps['headers'], key) && isObject()) {
				Object.keys(configProps['headers'][key]).forEach((keyItem) => {
					if (Object.hasOwnProperty.call(configProps['headers'][key], keyItem)) {
						headers[key][keyItem] = configProps['headers'][key][keyItem];
					}
				});
			}
		});
		Object.keys(configProps['headers']).forEach((key) => {
			if (Object.hasOwnProperty.call(configProps['headers'], key) && isUndefined(headers[key])) {
				headers[key] = configProps['headers'][key];
			}
		});
	}
	config.headers = headers;

	/** Other Keys */
	Object.keys(configProps).forEach((key) => {
		if (Object.prototype.hasOwnProperty.call(configProps, key) && isUndefined(config[key])) {
			config[key] = configProps[key];
		}
	});


	return config;
}
