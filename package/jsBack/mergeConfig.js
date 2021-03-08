const utils = require('../utils');

module.exports = function(configProps = {}) {
	configProps = utils.isObject(configProps) ? configProps : {};

	/**
	 * base Config
	 */
	const config = {
		baseUrl: null,
		timeout: null,
		credentials: 'same-origin',
		responseEncoding: 'utf8',
		responseType: 'json',
		xsrfCookieName: '',
		xsrfHeaderName: '',
		expirationTime: '',
	};
	Object.keys(config).map((key) => {
		if (Object.prototype.hasOwnProperty.call(configProps, key)) {
			config[key] = configProps[key];
		}
	});

	/** headers */
	const headers = {
		common: {
			Accept: 'application/json, text/plain, */*',
		},
		delete: {},
		get: {},
		post: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		pust: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		patch: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		head: {},
	};
	if (configProps['headers'] && utils.isObject(configProps['headers'])) {
		Object.keys(headers).map((key) => {
			if (Object.hasOwnProperty.call(configProps['headers'], key) && utils.isObject()) {
				Object.keys(configProps['headers'][key]).map((keyItem) => {
					if (Object.hasOwnProperty.call(configProps['headers'][key], keyItem)) {
						headers[key][keyItem] = configProps['headers'][key][keyItem];
					}
				});
			}
		});
		Object.keys(configProps['headers']).map((key) => {
			if (Object.hasOwnProperty.call(configProps['headers'], key) && utils.isUndefined(headers[key])) {
				headers[key] = configProps['headers'][key];
			}
		});
	}
	config.headers = headers;

	/** Other Keys */
	Object.keys(configProps).map((key) => {
		if (Object.prototype.hasOwnProperty.call(configProps, key) && utils.isUndefined(config[key])) {
			config[key] = configProps[key];
		}
	});

	return config;
};
