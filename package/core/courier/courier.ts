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