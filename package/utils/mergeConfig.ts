import { headersType, DefautsConfig } from './../core/courier/courier';
import utils from './utils';
const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];

export interface headersType {
  common?: { [k: string]: any };
  delete?: { [k: string]: any };
  get?: { [k: string]: any };
  post?: { [k: string]: any };
  put?: { [k: string]: any };
  patch?: { [k: string]: any };
  options?: { [k: string]: any };
  [k: string]: any;
}

export default function <T>(configProps: T) {
  const config = {
    baseUrl: '',
    timeout: 0,
    headers: {},
    responseType: 'json',
    credentials: 'same-origin',
    responseEncoding: 'utf8',
    xsrfCookieName: '',
    xsrfHeaderName: '',
    expirationTime: 0,
    beforeFetch: (val: any) => val,
    afterFetch: (val: any) => val,
  };

  /** baseConfig */
  Object.keys(config).map((key: string) => {
    if (Object.prototype.hasOwnProperty.call(configProps, key)) {
      config[key] = configProps[key];
    }
  });

  /** headers */
  const headers: headersType = {
    common: {
      Accept: 'application/json, text/plain, */*',
    },
    delete: {},
    get: {},
    post: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    put: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    patch: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    head: {},
    options: {},
  };


  const configHeaders: headersType = configProps && configProps['headers'] ? configProps['headers'] : {};


  Object.keys(configHeaders).map((key) => {
    if (headers[key]) {
      const item = headers[key];
      Object.keys(item).map(keyItem => {
        headers[key][keyItem] = item[keyItem];
      });
    } else {
      headers[key] = configHeaders[key];
    }
  });
  console.log(headers);
  config.headers = headers;

  return config;
}

