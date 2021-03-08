import qs from 'qs';
const tasks: any[] = [];


const tasksProxy = new Proxy(tasks, {
  get: function (target: any, key: any) {
    return target[key];
  },
  set: function (target: any, key: any, value: any) {
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
const createKey = function (url: string, config: any) {
  let key = `url:${url},method:${config.method},data:`;
  key += ['get'].indexOf(config.method) > -1 ? qs.stringify(config.params) : JSON.stringify(config.body || "");
  return key;
};

/**
 *
 * @param {*} original
 * @param {*} cancel
 */
const addTask = function (original: string, controller: any) {
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
const deleteTask = function (original: string, start: boolean) {
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

export default {
  tasksProxy,
  createKey,
  addTask,
  deleteTask,
};
