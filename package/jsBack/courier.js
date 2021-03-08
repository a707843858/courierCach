const env = window ? 'window' : this === 'node' ? 'node' : '';
const f = env === 'window' ? window.fetch : '';
const utils = require('../utils');
const mergeConfig = require('../mergeConfig');
const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];
const tasks = require('../task'),
  cach = require('../cach');

/**
 *
 * @param {*} config
 */
function Courier(config = {}) {
  this.defaults = mergeConfig(config);
  config.headers = config.headers || {};
}

/**
 *
 * @param {*} url
 * @param {*} data
 * @param {*} config
 */
Courier.prototype.FETCH = function(url, data, config = {}) {
  const defaultConfig = this.defaults,
    expirationTime = config.expirationTime || defaultConfig.expirationTime;
  let cachKey = '';
  config.method = config.method.toUpperCase() || 'GET'; /** Method */
  defaultConfig.baseUrl && (url = defaultConfig + url); /** baseUrl */
  /** Cancel */
  const controller = new AbortController(),
    signal = controller.signal;
  config.signal = signal;
  /** headers */
  config.headers = utils.checkType(config['headers'], 'object') ? config['headers'] : {};
  config = defineConfig(defaultConfig, config);
  /** Data */
  if (data) {
    if (config.method === 'GET') {
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
  config = defineBeforeFetch(config);
  console.log(config, 'c');
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
    // tasks.add(fecthPromise);
    Promise.race([fecthPromise, abortPromise])
      .then(async (res) => {
        // console.log(res, 'anm');
        tasks.deleteTask(cachKey);
        const data = (await defineResponse(res, config.responseType || defaultConfig.responseType)) || '';
        res.data = data ? (utils.checkType(data, 'object') ? data.data : data) : '';
        /** updateCach */
        cach.addCach(cachKey, expirationTime, data && data.data ? data.data : '');
        /** afterFetch Resolve */
        res = defineAfterFetch(res, 'resolve');
        console.log(res, 'data1');
        resolve(res);
      })
      .catch((err) => {
        tasks.deleteTask(cachKey);
        let error = { status: 400 };
        if (err.status) {
          error.status = err.status;
        }
        /** afterFetch Resolve */
        error = defineAfterFetch(error, 'reject');
        reject(error);
      });
  });
};

/** Other Methods */
methods.forEach((item) => {
  Courier.prototype[item] = function(url, data, config = {}) {
    config.method = item;
    return this.FETCH(url, data, config);
  };
});

/**
 *
 * @param {*} fn
 * @param {*} config
 */
Courier.prototype.beforeFetch = function(fn) {
  if (fn) {
    if (utils.checkType(fn, 'function')) {
      Courier.prototype._beforeFetch = fn;
    } else {
      throw new Error('beforeFetch must be function');
    }
  }
};

/**
 *
 * @param {*} resolve
 * @param {*} reject
 */
Courier.prototype.afterFetch = function(resolve, reject) {
  if (resolve) {
    if (utils.checkType(resolve, 'function')) {
      Courier.prototype._afeterFetchResolve = resolve;
    } else {
      throw new Error('The first argument to afterFetch function must be a function ');
    }
  }
  if (reject) {
    if (utils.checkType(resolve, 'function')) {
      Courier.prototype._afeterFetchReject = reject;
    } else {
      throw new Error('The sencond argument to afterFetch function must be a function ');
    }
  }
};

/**
 *
 * @param {*} defauts
 * @param {*} config
 */
function defineConfig(defaultConfig, config) {
  const method = config['method'],
    defaultHeaders = defaultConfig.headers,
    headerTags = [method, 'common'];
  headerTags.forEach((tag) => {
    if (defaultHeaders[tag]) {
      const header = defaultHeaders[tag];
      Object.keys(header).map((key) => {
        if (utils.checkType(config.headers[key], 'udefined')) {
          config.headers[key] = headers[key];
        }
      });
    }
  });
  /** Credentials */
  config.credentials = config.credentials || defaultConfig.credentials || '';
  return config;
}

/**
 *
 * @param {*} param0
 */
function defineCachKey({ url, config, expirationTime, controller }) {
  const cachKey = tasks.createKey(url, config);
  tasks.deleteTask(cachKey, true);
  tasks.addTask(cachKey, controller);
  cach.addCach(cachKey, expirationTime, '');
  return cachKey;
}

/**
 *
 * @param {*} config
 */
function defineBeforeFetch(config) {
  const fn = Courier.prototype._beforeFetch;
  if (fn && utils.checkType(fn, 'function')) {
    const resConfig = fn(config);
    if (!resConfig) {
      throw new Error('beforeFetch must return an config object that is not empty ');
    }
    return resConfig || config;
  }
  return config;
}

/**
 *
 * @param {*} value
 * @param {*} type
 */
function defineAfterFetch(value, type) {
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
function defineResponse(value, type) {
  let res = '';
  switch (type) {
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
      res = value.json();
  }
  return res || value;
}

module.exports = Courier;
