const axios = require('axios'),
  qs = require('qs');
const tasks = [];

const tasksProxy = new Proxy(tasks, {
  get: function(target, key) {
    return target[key];
  },
  set: function(target, key, value) {
    if (key !== 'length') {
      tasks[key] = value;
    }
    return Reflect.set(target, key, value);
  },
});

/**
 *
 * @param {*} url
 * @param {*} config
 */
const createKey = function(url, config) {
  let key = `url:${url},method:${config.method},data:`;
  key += ['GET'].indexOf(config.method) > -1 ? qs.stringify(config.params) : JSON.stringify(config.data);
  return key;
};

/**
 *
 * @param {*} original
 * @param {*} cancel
 */
const addTask = function(original, controller) {
  tasksProxy.push({
    original,
    controller,
  });
};

/**
 *
 * @param {*} original
 * @param {*} start
 */
const deleteTask = function(original, start) {
  for (let i = 0; i < tasksProxy.length; i++) {
    if (tasksProxy[i].original === original) {
      if (start) {
        tasksProxy[i].controller.abort();
      }
      tasksProxy.splice(i, 1);
      break;
    }
  }
};

module.exports = {
  tasksProxy,
  createKey,
  addTask,
  deleteTask,
};
