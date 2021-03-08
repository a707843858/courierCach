function checkStatus(status) {
  let success = true;
  let statusText = 'unknow';
  switch (status) {
    /**
     * 1xx
     */
    case 100:
      statusText = 'Continue';
      success = false;
      break;
    case 101:
      statusText = 'Switching Protocols';
      success = false;
      break;
    case 102:
      statusText = 'Processing';
      success = false;
      break;
    /**
     * 2xx
     */
    case 200:
      statusText = 'OK';
      break;
    case 201:
      statusText = 'Created';
      break;
    case 202:
      statusText = 'Accepted';
      break;
    case 203:
      statusText = 'Non-Authoritative Information';
      break;
    case 204:
      statusText = 'No Content';
      break;
    case 205:
      statusText = 'Reset Content';
      break;
    case 206:
      statusText = 'Partial Content';
      break;
    case 207:
      statusText = 'Multi-Status';
      break;
    /**
     * 3xx
     */
    case 300:
      statusText = 'Multiple Choices';
      success = false;
      break;
    case 301:
      statusText = 'Moved Permanently';
      success = false;
      break;
    case 302:
      statusText = 'Move Temporarily';
      success = false;
      break;
    case 303:
      statusText = 'See Other';
      success = false;
      break;
    case 304:
      statusText = 'Not Modified';
      success = false;
      break;
    case 305:
      statusText = 'Use Proxy';
      success = false;
      break;
    case 307:
      statusText = 'Temporary Redirect';
      success = false;
      break;
    /**
     * 4xx
     */
    case 400:
      statusText = 'Bad Request';
      success = false;
      break;
    case 401:
      statusText = 'Unauthorized';
      success = false;
      break;
    case 402:
      statusText = 'Payment Required';
      success = false;
      break;
    case 403:
      statusText = 'Forbidden';
      success = false;
      break;
    case 404:
      statusText = 'Not Found';
      success = false;
      break;
    case 405:
      statusText = 'Method Not Allowed';
      success = false;
      break;
    case 406:
      statusText = 'Not Acceptable';
      success = false;
      break;
    case 407:
      statusText = 'Proxy Authentication Required';
      success = false;
      break;
    case 408:
      statusText = 'Request Timeout';
      success = false;
      break;
    case 409:
      statusText = 'Conflict';
      success = false;
      break;
    case 410:
      statusText = 'Gone';
      success = false;
      break;
    case 411:
      statusText = 'Length Required';
      success = false;
      break;
    case 412:
      statusText = 'Precondition Failed';
      success = false;
      break;
    case 413:
      statusText = 'Request Entity Too Large';
      success = false;
      break;
    case 414:
      statusText = 'Request-URI Too Long';
      success = false;
      break;
    case 415:
      statusText = 'Unsupported Media Type';
      success = false;
      break;
    case 416:
      statusText = 'Requested Range Not Satisfiable';
      success = false;
      break;
    case 417:
      statusText = 'Expectation Failed';
      success = false;
      break;
    case 418:
      statusText = "I'm a teapot";
      success = false;
      break;
    case 421:
      statusText = 'Misdirected Request';
      success = false;
      break;
    case 422:
      statusText = 'Unprocessable Entity';
      success = false;
      break;
    case 423:
      statusText = 'Locked';
      success = false;
      break;
    case 424:
      statusText = 'Failed Dependency';
      success = false;
      break;
    case 425:
      statusText = 'Too Early';
      success = false;
      break;
    case 426:
      statusText = 'Upgrade Required';
      success = false;
      break;
    case 449:
      statusText = 'Retry With';
      success = false;
      break;
    case 451:
      statusText = 'Unavailable For Legal Reasons';
      success = false;
      break;
    /**
     * 5xx
     */
    case 500:
      statusText = 'Internal Server Error';
      success = false;
      break;
    case 501:
      statusText = 'Not Implemented';
      success = false;
      break;
    case 502:
      statusText = 'Bad Gateway';
      success = false;
      break;
    case 503:
      statusText = 'Service Unavailable';
      success = false;
      break;
    case 504:
      statusText = 'Gateway Timeout';
      success = false;
      break;
    case 505:
      statusText = 'HTTP Version Not Supported';
      success = false;
      break;
    case 506:
      statusText = 'Variant Also Negotiates';
      success = false;
      break;
    case 507:
      statusText = 'Insufficient Storage';
      success = false;
      break;
    case 509:
      statusText = 'Bandwidth Limit Exceeded';
      success = false;
      break;
    case 510:
      statusText = 'Not Extended';
      success = false;
      break;
    /**
     * 6xx
     */
    case 600:
      statusText = 'Unparseable Response Headers';
      success = false;
      break;
  }
  return {
    success,
    statusText,
  };
}
function formatQuery(data) {
  const params = [];
  if (data) {
    Object.keys(data).map((v) => {
      params.push(`${v}=${data[v]}`);
    });
  }
  return params.length ? '?'+params.join('&'):''
}
function checkType ( data, type ) {
  return data !== null && typeof data === type;
}
function isUndefined(data) {
  return typeof data === 'undefined';
}
function isObject(data) {
  return data !== null && typeof data === 'object';
}


module.exports = {
  checkStatus,
  formatQuery,
  isUndefined,
  isObject,
  checkType,
};
