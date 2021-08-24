import { CacheType } from './cach';

export type ResponseType =
  | 'json'
  | 'text'
  | 'arrayBuffer'
  | 'blob'
  | 'formData';

export class Config {
  baseUrl = '';
  expires = 0;
  timeout = 1000 * 60;
  headers: { [k: string]: any } = {
    common: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
  };
  responseType: ResponseType = 'json';
  credentials: RequestCredentials = 'include';
  responseEncoding = 'utf-8';
  xsrfCookieName = '';
  xsrfHeaderName = '';
  mode: RequestMode = 'cors';
  redirect: RequestRedirect = 'follow';
  referrer = 'client';
  integrity = '';
  readonly cacheType: CacheType = 'map';
  cach: RequestCache = 'default';
  keepalive = false;
  isHistoryNavigation = false;
  requestInterceptor: [
    ((config: { [k: string]: any }) => any) | null,
    ((err: string) => string) | null
  ] = [null, null];
  responseInterceptor: [
    ((config: Response) => Response) | null,
    ((config: string) => string) | null
  ] = [null, null];

  constructor(config: { [k: string]: any } | Config = {}) {
    Object.keys(config).map((key) => {
      if (key === 'headers') {
        Object.getOwnPropertyNames(config[key]).forEach((name) => {
          this['headers'][name] = config[name];
        });
      } else {
        this[key] = config[key];
      }
    });
  }

  merge(dispatchProps: { [k: string]: any }) {
    Object.keys(dispatchProps).map((item) => {
      this[item] = dispatchProps[item];
    });
  }

  mergeRequest(config: RequestInit) {
    const source = {
      cach: this.cach,
      integrity: this.integrity,
      keepalive: this.keepalive,
      mode: this.mode,
      redirect: this.redirect,
      referrer: this.referrer,
      isHistoryNavigation: this.isHistoryNavigation,
    };
    return Object.assign(source, config);
  }

  toObject() {
    const obj: { [k: string]: any } = {};
    Object.keys(this).map((key) => {
      obj[key] = this[key];
    });
    return obj;
  }

  clone() {
    const res = new Config(this);
    return res;
  }
}
