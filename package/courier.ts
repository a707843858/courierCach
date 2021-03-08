import tasks from './core/task';
import cach from './core/cach';
import utils from './utils/utils';
// import mergeConfig from './u';

type MethodType = 'get' | 'GET' | 'delete' | 'DELETE' | 'head' | 'HEAD' | 'options' | 'OPTIONS' | 'post' | 'POST' | 'put' | 'PUT' | 'patch' | 'PATCH' | 'purge' | 'PURGE' | 'link' | 'LINK' | 'unlink' | 'UNLINK';
const methods: string[] = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options'];
const env = window ? 'window' : this === 'node' ? 'node' : '';
const f = function (url: string, config: any): Promise<Response> {
  return window.fetch(url, config);
};





export interface ConfigProps {
  body?: any;
  expirationTime?: number;
  responseType?: string;
  headers?: headersType | { [k: string]: any };
  signal?: any;
  params?: any;
  credentials?: string;
  [k: string]: any;
}

export interface fetchConfigProps extends ConfigProps{
  method?: string;
}


class Courier {
  public defaults: DefautsConfig;
  public tasks: any[];
  public cach: object;

  /** Nomral constructor */
  public constructor(config: DefautsConfig) {
    config = config || {};
    config.headers = config.headers || {};
    this.defaults = mergeConfig(config);
    this.tasks = tasks.tasksProxy;
    this.cach = cach.cachProxy;
  }

  /** methods fetch */
  fetch(url: string, data?: any, config: fetchConfigProps = { method: 'get' }): Promise<Response> {
    // const fetchPromise = new Promise(); 
    let cachKey = '';
    const defaultConfig = this.defaults,
      expirationTime = config.expirationTime || defaultConfig.expirationTime || 0,
      controller = new AbortController(),
      signal = controller.signal;
    config.method = config.method ? config.method.toLowerCase() : 'get'; /** method */
    config.signal = signal;/** Cancel */
    defaultConfig.baseUrl && (url = defaultConfig + url); /** baseUrl */
    config = defineConfig(defaultConfig, config);/** headers */
    /** Data */
    if (data) {
      if (config.method === 'get') {
        const params = utils.formatQuery(data);
        url += params;
        config.params = data;
      } else {
        config.body = data;
      }
    }
    /** Task | Cach */
    if (expirationTime) {
      cachKey = defineCachKey({ url, config, expirationTime, controller });
    }
    /** beforeFetch */
    if (defaultConfig.beforeFetch) {
      config = defaultConfig.beforeFetch(config) || config;
    }
    config.method = config.method ? config.method.toUpperCase() : 'GET'; /** method */
    /** fetch */
    return new Promise((resolve, reject) => {
      const fecthPromise = f(url, config),
        abortPromise = new Promise((res, rej) => {
          if (defaultConfig.timeout) {
            let timer = setTimeout(() => {
              controller.abort();
              rej({
                status: 504,
              });
              clearTimeout(timer);
            }, defaultConfig.timeout);
          }
        });
      Promise.race([fecthPromise, abortPromise])
        .then(async (res: any) => {
          console.log(res, 'anm');
          tasks.deleteTask(cachKey, false);
          return false;
          const data = res ? (await defineResponse(res, config.responseType || defaultConfig.responseType || 'json')) : '';
          res.data = data ? (utils.checkType(data, 'object') ? data.data : data) : '';
          /** updateCach */
          cach.addCach(cachKey, expirationTime, data && data.data ? data.data : '');
          /** afterFetch Resolve */
          res = defineAfterFetch(res, 'resolve');
          console.log(res, 'data1');
          resolve(res);
        })
        .catch((err) => {
          console.log(err, 'err');
          tasks.deleteTask(cachKey, false);
          let error = { status: 400 };
          if (err.status) {
            error.status = err.status;
          }
          /** afterFetch Resolve */
          error = defineAfterFetch(error, 'reject');
          reject(error);
        });
    });
  }

  get(url: string, data?: any, config: fetchConfigProps = {}) {
    config.method = 'get';
    return this.fetch(url, data ,config);
  };

  post(url: string, data?: any, config: fetchConfigProps = {}) {
    config.method = 'post';
    return this.fetch(url, data, config);
  };

  put(url: string, data?: any, config: fetchConfigProps = {}) {
    config.method = 'put';
    return this.fetch(url, data, config);
  };

  patch(url: string, data?: any, config: fetchConfigProps = {}) {
    config.method = 'patch';
    return this.fetch(url, data, config);
  };

  delete(url: string, data?: any, config: fetchConfigProps = {}) {
    config.method = 'delete';
    return this.fetch(url, data, config);
  };

  heade(url: string, data?: any, config: fetchConfigProps = {}) {
    config.method = 'head';
    return this.fetch(url, data, config);
  };

  options(url: string, data?: any, config: fetchConfigProps = {}) {
    config.method = 'options';
    return this.fetch(url, data, config);
  };


  /**
   *
   * @param value
   */
  _afeterFetchResolve(value: any) {
    return value;
  }

  /**
   *
   * @param value
   */
  _afeterFetchReject(value: any) {
    return value;
  }
};

/**
 *
 * @param {*} defauts
 * @param {*} config
 */
function defineConfig(defaultConfig: DefautsConfig, config: fetchConfigProps) {
  const method: string = config.method || 'get',
    defaultHeaders: headersType = defaultConfig.headers || {},
    headerTags = [method, 'common'],
    res: fetchConfigProps = config || { headers: {} },
    headers = res.headers || {};
  headerTags.forEach((tag) => {
    if (defaultHeaders[tag]) {
      const header = defaultHeaders[tag];
      if (header) {
        Object.keys(header).map((key) => {
          if (!Object.prototype.hasOwnProperty.call(headers, key)) {
            headers[key] = header[key];
          }
        });
      }
    }
  });
  /** Credentials */
  res.headers = headers;
  res.credentials = config.credentials || defaultConfig.credentials || '';
  return res;
}

/**
 *
 * @param {*} param0
 */
function defineCachKey(x: { url: string; config: any; expirationTime: number; controller: any }): string {
  const cachKey = tasks.createKey(x.url, x.config);
  tasks.deleteTask(cachKey, true);
  tasks.addTask(cachKey, x.controller);
  cach.addCach(cachKey, x.expirationTime, '');
  return cachKey;
}


/**
 *
 * @param {*} value
 * @param {*} type
 */
function defineAfterFetch(value: any, type: string) {
  const fn = type === 'resolve' ? Courier.prototype._afeterFetchResolve : Courier.prototype._afeterFetchReject;
  if (fn) {
    if (utils.checkType(fn, 'function')) {
      const res = fn(value);
      return res || value;
    } else {
      return value;
    }
  } else {
    return value;
  }
}

/**
 *
 * @param {*} value
 */
function defineResponse(value: any, type?: string): any {
  console.log(value, 'value');
  let res: any = {};
  switch (type) {
    case 'json':
      res = value.json();
    case 'text':
      res = value.text();
      break;
    case 'arrayBuffer':
      res = value.arrayBuffer();
      break;
    case 'blob':
      res = value.blob();
      break;
    case 'formData':
      res = value.formData();
      break;
    default:
      res = {};
  }
  return res || value;
}

export default Courier;
