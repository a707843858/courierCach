const cach: { [k: string]: any } = {};

const cachProxy = new Proxy(cach, {
  get(target, prop) {
    return target.get(prop);
  },
  set(target, prop, value) {
    return Reflect.set(target, prop, value);
  }
});

const addCach = function (key: string, expirationTime: number, data: any) {
  if (expirationTime) {
    const cachItem = Object.prototype.hasOwnProperty.call(cachProxy, key) ? cachProxy.get(key) : '';
    if (cachItem) {
      updateCachData(key, data);
    } else {
      cachProxy[key] = {
        expirationTime,
        data,
        deadline: new Date().getTime() + expirationTime,
      };
    }
  }
};

const updateCachData = function (key: string, data: any) {
  let cachItem = cachProxy.get(key);
  if (cachItem && cachItem.deadline < new Date().getTime()) {
    cachItem.data = data;
    cachProxy.set(key, cachItem);
  }
};

export default { addCach, updateCachData, cachProxy };