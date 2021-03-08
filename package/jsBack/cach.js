const cach = new Map();

const cachProxy = new Proxy(cach, {
  get(target, prop) {
    // console.log(`Proxy 捕获了对象的 ${prop} 属性`);
    return target.get(prop);
  },
  set(target, prop, value) {
    // console.log(`Proxy 设置了对象的 ${prop} 属性`);
    target.set(prop, value);
    return true;
  },
});

const addCach = function(key, expirationTime, data) {
  if (expirationTime) {
    const cachItem = cachProxy[key] || '';
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

const updateCachData = function(key, data) {
  let cachItem = cachProxy[key];
  if (cachItem && cachItem.deadline < new Date().getTime()) {
    cachItem.data = data;
    cachProxy[key] = cachItem;
  }
};

module.exports = { addCach, updateCachData,cachProxy };
