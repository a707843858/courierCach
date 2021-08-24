import { tuple, formatQuery, supported } from './utils';
import { Config } from './config';
import { Task } from './tasks';
import { createCache, CacheType, CCache } from './cach';
import { CHeaders, CResponse, CRequest, CFetch } from './polyfill';

if (!supported.fetch) {
  globalThis.Headers = CHeaders;
  globalThis.Request = CRequest;
  globalThis.Response = CResponse;
}

const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];
const methodsTypes = tuple(methods.join(','));

export type methodsType = typeof methodsTypes[number];

export interface fetchConfig extends RequestInit {
  expires?: number;
  responseType?: string;
  params?: any;
  signal?: AbortSignal;
}

class courierCach<T extends keyof Config> {
  readonly cacheType: CacheType;

  defaults: Config;

  task: Task;

  cache: CCache;

  constructor(config?: { [T: string]: Config[T] }) {
    this.defaults = new Config(config || {});
    this.task = new Task();
    this.cache = createCache(this.defaults.cacheType);
    this.cacheType = this.cache.type;
    methods.forEach(item => {
      if (item !== 'GET') {
        courierCach.prototype[item.toLowerCase()] = function (url: string, config: fetchConfig = {}) {
          config.method = item;
          return fetch(url, config);
        };
      }
    });
  }

  async fetch(url: string, config: fetchConfig = {}) {
    /** Base Data */
    const { defaults } = this;
    const { cache } = this;
    const expires = config.expires || defaults.expires || 0;
    const requestInterceptorResolve =
      (defaults.requestInterceptor && defaults.requestInterceptor[0]) || null;
    const requestInterceptorReject =
      (defaults.requestInterceptor && defaults.requestInterceptor[1]) || null;
    const responseInterceptorResolve =
      (defaults.responseInterceptor && defaults.responseInterceptor[0]) || null;
    const responseInterceptorReject =
      (defaults.responseInterceptor && defaults.responseInterceptor[1]) || null;

    /** Before fetch */
    Object.keys(defaults).forEach((name: string) => {
      const unlessKeys: string[] = [
        'headers',
        'requestInterceptor',
        'responseInterceptor',
      ];
      if (!unlessKeys.includes(name)) {
        config[name] =
          config[name] === undefined ? defaults[name] : config[name];
      }
    });
    config.method = config.method?.toUpperCase() || 'GET';
    config = requestInterceptorResolve
      ? requestInterceptorResolve(config) || null
      : config;
    if (!config) {
      return Promise.reject(
        (requestInterceptorReject &&
          requestInterceptorReject(
            'RequestInterceptor should return config !'
          )) ||
          ''
      );
    }

    if (requestInterceptorReject) {
      let errMsg: string | undefined;
      if (!config) {
        errMsg = await requestInterceptorReject(
          'RequestInterceptor should return config !'
        );
      }
      if (errMsg) {
        return Promise.reject(errMsg);
      }
    }

    // Headers
    config.headers = mergerHeaders(config.headers, [
      defaults.headers.common || {},
      defaults.headers[config.method || 'GET'] || {},
    ]);

    // Signal
    if (!config.signal) {
      const { signal } = new AbortController();
      config.signal = signal;
    }

    // Body
    if (['GET', 'get'].includes(config.method || 'GET')) {
      url = formatQuery(defaults.baseUrl + url, config.params);
    } else {
      config.body = config.params;
    }

    // Request
    const request = new Request(url, config);

    // Cache Item
    const timestamp = new Date().getTime();
    const cacheItem = await cache.get(request);
    const expirationTime = cacheItem?.headers?.get('_expirationTime') || 0;
    const sendReqest = timestamp >= expirationTime;
    const fecthPromise: Promise<Response> =
      sendReqest || !cacheItem ? (!supported.fetch ? fetch(request) : CFetch(request))  : Promise.resolve(cacheItem);
    const abortPromise: Promise<Error> = new Promise((resolve) => {
      if (defaults.timeout) {
        const timer = setTimeout(() => {
          resolve(new Error('The request has timed out !'));
          clearTimeout(timer);
        }, defaults.timeout);
      }
    });

    this.task.set(request, config.signal);

    // Fetch
    let response = await Promise.race([fecthPromise, abortPromise])
      .catch((err) => {
        return new Error(err);
      })
      .finally(() => {
        this.task.delete(request);
      });

    if (!response || response instanceof Error) {
      let errMsg: any =
        response instanceof Error
          ? response.message
          : 'The Response body should be of type Response';
      responseInterceptorReject &&
        (errMsg = responseInterceptorReject(errMsg) || null);
      return Promise.reject(errMsg);
    }

    /** updateCache */
    if (response && expires > 0 && sendReqest) {
      const newResponse = new Response(response.body || undefined, {
        headers: {
          ...config.headers,
          _url: url || '',
          _expires: `${expires}`,
          _expirationTime: `${new Date().getTime() + Math.abs(expires)}`,
        },
        status: response.status,
        statusText: response.statusText,
      });
      const saveResult = await cache.set(request, newResponse);
      if (!saveResult) {
        Promise.reject('Failed to save cache');
      }
      response = (await cache.get(request)) as Response;
    }

    /** Structural response body  */
    // let response = structuralResponse(res);
    responseInterceptorResolve &&
      (response = responseInterceptorResolve(response) || response);

    return response as Response;
  }

  useRequestIntercept(
    resolve?: ((res: { [k: string]: any }) => { [k: string]: any }) | null,
    reject?: ((err: string) => string) | null
  ) {
    this.defaults.requestInterceptor = [resolve || null, reject || null];
  }

  useResponseIntercept(
    resolve?: ((res: Response) => Response) | null,
    reject?: ((err: string) => string) | null
  ) {
    this.defaults.responseInterceptor = [resolve || null, reject || null];
  }
}

const mergerHeaders = function (
  input: HeadersInit | undefined,
  props: { [k: string]: any }[] = []
) {
  const headers = input instanceof Headers ? input : new Headers(input);
  console.log(props, 'p');
  props.forEach((col) => {
    Object.getOwnPropertyNames(col).forEach((name) => {
      headers.set(name, col[name] || undefined);
    });
  });
  return headers;
};



export { courierCach, Config };
  
export default courierCach; 
