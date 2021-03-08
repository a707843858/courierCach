function formatQuery(data: any) {
  const params:any[] = [];
  if (data) {
    Object.keys(data).map((v) => {
      params.push(`${v}=${data[v]}`);
    });
  }
  return params.length ? '?' + params.join('&') : ''
}
function checkType(data: any, type?: string) {
  return data !== null && typeof data === type;
}
function isUndefined(data?: any) {
  return typeof data === 'undefined';
}
function isObject(data?: any) {
  return data !== null && typeof data === 'object';
}


export default {
  formatQuery,
  isUndefined,
  isObject,
  checkType,
};
