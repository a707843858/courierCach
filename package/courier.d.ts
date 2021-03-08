export interface DefautsConfig {
  baseUrl?: string;
  timeout?: number;
  headers?: headersType | { [k: string]: any };
  responseType?: string;
  credentials?: string;
  responseEncoding?: string;
  xsrfCookieName?: string;
  xsrfHeaderName?: string;
  expirationTime?: number;
  beforeFetch?: Function;
  afterFetch?: Function;
  [k: string]: any;
}

export interface courierStatic {
  [k: number]: any;
}

declare  var courier: number;

export default courier;