/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/axios/index.js":
/*!*************************************!*\
  !*** ./node_modules/axios/index.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(/*! ./lib/axios */ "./node_modules/axios/lib/axios.js");

/***/ }),

/***/ "./node_modules/axios/lib/adapters/xhr.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/adapters/xhr.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var settle = __webpack_require__(/*! ./../core/settle */ "./node_modules/axios/lib/core/settle.js");
var cookies = __webpack_require__(/*! ./../helpers/cookies */ "./node_modules/axios/lib/helpers/cookies.js");
var buildURL = __webpack_require__(/*! ./../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");
var buildFullPath = __webpack_require__(/*! ../core/buildFullPath */ "./node_modules/axios/lib/core/buildFullPath.js");
var parseHeaders = __webpack_require__(/*! ./../helpers/parseHeaders */ "./node_modules/axios/lib/helpers/parseHeaders.js");
var isURLSameOrigin = __webpack_require__(/*! ./../helpers/isURLSameOrigin */ "./node_modules/axios/lib/helpers/isURLSameOrigin.js");
var transitionalDefaults = __webpack_require__(/*! ../defaults/transitional */ "./node_modules/axios/lib/defaults/transitional.js");
var AxiosError = __webpack_require__(/*! ../core/AxiosError */ "./node_modules/axios/lib/core/AxiosError.js");
var CanceledError = __webpack_require__(/*! ../cancel/CanceledError */ "./node_modules/axios/lib/cancel/CanceledError.js");
var parseProtocol = __webpack_require__(/*! ../helpers/parseProtocol */ "./node_modules/axios/lib/helpers/parseProtocol.js");

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;
    var responseType = config.responseType;
    var onCanceled;
    function done() {
      if (config.cancelToken) {
        config.cancelToken.unsubscribe(onCanceled);
      }

      if (config.signal) {
        config.signal.removeEventListener('abort', onCanceled);
      }
    }

    if (utils.isFormData(requestData) && utils.isStandardBrowserEnv()) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);

    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    function onloadend() {
      if (!request) {
        return;
      }
      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !responseType || responseType === 'text' ||  responseType === 'json' ?
        request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(function _resolve(value) {
        resolve(value);
        done();
      }, function _reject(err) {
        reject(err);
        done();
      }, response);

      // Clean up request
      request = null;
    }

    if ('onloadend' in request) {
      // Use onloadend if available
      request.onloadend = onloadend;
    } else {
      // Listen for ready state to emulate onloadend
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }

        // The request errored out and we didn't get a response, this will be
        // handled by onerror instead
        // With one exception: request that using file: protocol, most browsers
        // will return status as 0 even though it's a successful request
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
          return;
        }
        // readystate handler is calling before onerror or ontimeout handlers,
        // so we should call onloadend on the next 'tick'
        setTimeout(onloadend);
      };
    }

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(new AxiosError('Request aborted', AxiosError.ECONNABORTED, config, request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(new AxiosError('Network Error', AxiosError.ERR_NETWORK, config, request, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = config.timeout ? 'timeout of ' + config.timeout + 'ms exceeded' : 'timeout exceeded';
      var transitional = config.transitional || transitionalDefaults;
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(new AxiosError(
        timeoutErrorMessage,
        transitional.clarifyTimeoutError ? AxiosError.ETIMEDOUT : AxiosError.ECONNABORTED,
        config,
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (responseType && responseType !== 'json') {
      request.responseType = config.responseType;
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken || config.signal) {
      // Handle cancellation
      // eslint-disable-next-line func-names
      onCanceled = function(cancel) {
        if (!request) {
          return;
        }
        reject(!cancel || (cancel && cancel.type) ? new CanceledError() : cancel);
        request.abort();
        request = null;
      };

      config.cancelToken && config.cancelToken.subscribe(onCanceled);
      if (config.signal) {
        config.signal.aborted ? onCanceled() : config.signal.addEventListener('abort', onCanceled);
      }
    }

    if (!requestData) {
      requestData = null;
    }

    var protocol = parseProtocol(fullPath);

    if (protocol && [ 'http', 'https', 'file' ].indexOf(protocol) === -1) {
      reject(new AxiosError('Unsupported protocol ' + protocol + ':', AxiosError.ERR_BAD_REQUEST, config));
      return;
    }


    // Send the request
    request.send(requestData);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/axios.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/axios.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");
var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");
var Axios = __webpack_require__(/*! ./core/Axios */ "./node_modules/axios/lib/core/Axios.js");
var mergeConfig = __webpack_require__(/*! ./core/mergeConfig */ "./node_modules/axios/lib/core/mergeConfig.js");
var defaults = __webpack_require__(/*! ./defaults */ "./node_modules/axios/lib/defaults/index.js");

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  // Factory for creating new instances
  instance.create = function create(instanceConfig) {
    return createInstance(mergeConfig(defaultConfig, instanceConfig));
  };

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Expose Cancel & CancelToken
axios.CanceledError = __webpack_require__(/*! ./cancel/CanceledError */ "./node_modules/axios/lib/cancel/CanceledError.js");
axios.CancelToken = __webpack_require__(/*! ./cancel/CancelToken */ "./node_modules/axios/lib/cancel/CancelToken.js");
axios.isCancel = __webpack_require__(/*! ./cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");
axios.VERSION = (__webpack_require__(/*! ./env/data */ "./node_modules/axios/lib/env/data.js").version);
axios.toFormData = __webpack_require__(/*! ./helpers/toFormData */ "./node_modules/axios/lib/helpers/toFormData.js");

// Expose AxiosError class
axios.AxiosError = __webpack_require__(/*! ../lib/core/AxiosError */ "./node_modules/axios/lib/core/AxiosError.js");

// alias for CanceledError for backward compatibility
axios.Cancel = axios.CanceledError;

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__(/*! ./helpers/spread */ "./node_modules/axios/lib/helpers/spread.js");

// Expose isAxiosError
axios.isAxiosError = __webpack_require__(/*! ./helpers/isAxiosError */ "./node_modules/axios/lib/helpers/isAxiosError.js");

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports["default"] = axios;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/CancelToken.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/cancel/CancelToken.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var CanceledError = __webpack_require__(/*! ./CanceledError */ "./node_modules/axios/lib/cancel/CanceledError.js");

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;

  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;

  // eslint-disable-next-line func-names
  this.promise.then(function(cancel) {
    if (!token._listeners) return;

    var i;
    var l = token._listeners.length;

    for (i = 0; i < l; i++) {
      token._listeners[i](cancel);
    }
    token._listeners = null;
  });

  // eslint-disable-next-line func-names
  this.promise.then = function(onfulfilled) {
    var _resolve;
    // eslint-disable-next-line func-names
    var promise = new Promise(function(resolve) {
      token.subscribe(resolve);
      _resolve = resolve;
    }).then(onfulfilled);

    promise.cancel = function reject() {
      token.unsubscribe(_resolve);
    };

    return promise;
  };

  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new CanceledError(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `CanceledError` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Subscribe to the cancel signal
 */

CancelToken.prototype.subscribe = function subscribe(listener) {
  if (this.reason) {
    listener(this.reason);
    return;
  }

  if (this._listeners) {
    this._listeners.push(listener);
  } else {
    this._listeners = [listener];
  }
};

/**
 * Unsubscribe from the cancel signal
 */

CancelToken.prototype.unsubscribe = function unsubscribe(listener) {
  if (!this._listeners) {
    return;
  }
  var index = this._listeners.indexOf(listener);
  if (index !== -1) {
    this._listeners.splice(index, 1);
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/CanceledError.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/cancel/CanceledError.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var AxiosError = __webpack_require__(/*! ../core/AxiosError */ "./node_modules/axios/lib/core/AxiosError.js");
var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

/**
 * A `CanceledError` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function CanceledError(message) {
  // eslint-disable-next-line no-eq-null,eqeqeq
  AxiosError.call(this, message == null ? 'canceled' : message, AxiosError.ERR_CANCELED);
  this.name = 'CanceledError';
}

utils.inherits(CanceledError, AxiosError, {
  __CANCEL__: true
});

module.exports = CanceledError;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/isCancel.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/cancel/isCancel.js ***!
  \***************************************************/
/***/ ((module) => {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/Axios.js":
/*!**********************************************!*\
  !*** ./node_modules/axios/lib/core/Axios.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var buildURL = __webpack_require__(/*! ../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");
var InterceptorManager = __webpack_require__(/*! ./InterceptorManager */ "./node_modules/axios/lib/core/InterceptorManager.js");
var dispatchRequest = __webpack_require__(/*! ./dispatchRequest */ "./node_modules/axios/lib/core/dispatchRequest.js");
var mergeConfig = __webpack_require__(/*! ./mergeConfig */ "./node_modules/axios/lib/core/mergeConfig.js");
var buildFullPath = __webpack_require__(/*! ./buildFullPath */ "./node_modules/axios/lib/core/buildFullPath.js");
var validator = __webpack_require__(/*! ../helpers/validator */ "./node_modules/axios/lib/helpers/validator.js");

var validators = validator.validators;
/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(configOrUrl, config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof configOrUrl === 'string') {
    config = config || {};
    config.url = configOrUrl;
  } else {
    config = configOrUrl || {};
  }

  config = mergeConfig(this.defaults, config);

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  var transitional = config.transitional;

  if (transitional !== undefined) {
    validator.assertOptions(transitional, {
      silentJSONParsing: validators.transitional(validators.boolean),
      forcedJSONParsing: validators.transitional(validators.boolean),
      clarifyTimeoutError: validators.transitional(validators.boolean)
    }, false);
  }

  // filter out skipped interceptors
  var requestInterceptorChain = [];
  var synchronousRequestInterceptors = true;
  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
      return;
    }

    synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

    requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  var responseInterceptorChain = [];
  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
  });

  var promise;

  if (!synchronousRequestInterceptors) {
    var chain = [dispatchRequest, undefined];

    Array.prototype.unshift.apply(chain, requestInterceptorChain);
    chain = chain.concat(responseInterceptorChain);

    promise = Promise.resolve(config);
    while (chain.length) {
      promise = promise.then(chain.shift(), chain.shift());
    }

    return promise;
  }


  var newConfig = config;
  while (requestInterceptorChain.length) {
    var onFulfilled = requestInterceptorChain.shift();
    var onRejected = requestInterceptorChain.shift();
    try {
      newConfig = onFulfilled(newConfig);
    } catch (error) {
      onRejected(error);
      break;
    }
  }

  try {
    promise = dispatchRequest(newConfig);
  } catch (error) {
    return Promise.reject(error);
  }

  while (responseInterceptorChain.length) {
    promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  var fullPath = buildFullPath(config.baseURL, config.url);
  return buildURL(fullPath, config.params, config.paramsSerializer);
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: (config || {}).data
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/

  function generateHTTPMethod(isForm) {
    return function httpMethod(url, data, config) {
      return this.request(mergeConfig(config || {}, {
        method: method,
        headers: isForm ? {
          'Content-Type': 'multipart/form-data'
        } : {},
        url: url,
        data: data
      }));
    };
  }

  Axios.prototype[method] = generateHTTPMethod();

  Axios.prototype[method + 'Form'] = generateHTTPMethod(true);
});

module.exports = Axios;


/***/ }),

/***/ "./node_modules/axios/lib/core/AxiosError.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/core/AxiosError.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [config] The config.
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
function AxiosError(message, code, config, request, response) {
  Error.call(this);
  this.message = message;
  this.name = 'AxiosError';
  code && (this.code = code);
  config && (this.config = config);
  request && (this.request = request);
  response && (this.response = response);
}

utils.inherits(AxiosError, Error, {
  toJSON: function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code,
      status: this.response && this.response.status ? this.response.status : null
    };
  }
});

var prototype = AxiosError.prototype;
var descriptors = {};

[
  'ERR_BAD_OPTION_VALUE',
  'ERR_BAD_OPTION',
  'ECONNABORTED',
  'ETIMEDOUT',
  'ERR_NETWORK',
  'ERR_FR_TOO_MANY_REDIRECTS',
  'ERR_DEPRECATED',
  'ERR_BAD_RESPONSE',
  'ERR_BAD_REQUEST',
  'ERR_CANCELED'
// eslint-disable-next-line func-names
].forEach(function(code) {
  descriptors[code] = {value: code};
});

Object.defineProperties(AxiosError, descriptors);
Object.defineProperty(prototype, 'isAxiosError', {value: true});

// eslint-disable-next-line func-names
AxiosError.from = function(error, code, config, request, response, customProps) {
  var axiosError = Object.create(prototype);

  utils.toFlatObject(error, axiosError, function filter(obj) {
    return obj !== Error.prototype;
  });

  AxiosError.call(axiosError, error.message, code, config, request, response);

  axiosError.name = error.name;

  customProps && Object.assign(axiosError, customProps);

  return axiosError;
};

module.exports = AxiosError;


/***/ }),

/***/ "./node_modules/axios/lib/core/InterceptorManager.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/core/InterceptorManager.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected, options) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected,
    synchronous: options ? options.synchronous : false,
    runWhen: options ? options.runWhen : null
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;


/***/ }),

/***/ "./node_modules/axios/lib/core/buildFullPath.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/buildFullPath.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var isAbsoluteURL = __webpack_require__(/*! ../helpers/isAbsoluteURL */ "./node_modules/axios/lib/helpers/isAbsoluteURL.js");
var combineURLs = __webpack_require__(/*! ../helpers/combineURLs */ "./node_modules/axios/lib/helpers/combineURLs.js");

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
module.exports = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/dispatchRequest.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/core/dispatchRequest.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var transformData = __webpack_require__(/*! ./transformData */ "./node_modules/axios/lib/core/transformData.js");
var isCancel = __webpack_require__(/*! ../cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");
var defaults = __webpack_require__(/*! ../defaults */ "./node_modules/axios/lib/defaults/index.js");
var CanceledError = __webpack_require__(/*! ../cancel/CanceledError */ "./node_modules/axios/lib/cancel/CanceledError.js");

/**
 * Throws a `CanceledError` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }

  if (config.signal && config.signal.aborted) {
    throw new CanceledError();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData.call(
    config,
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData.call(
      config,
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData.call(
          config,
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/core/mergeConfig.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/mergeConfig.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  function getMergedValue(target, source) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge(target, source);
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  // eslint-disable-next-line consistent-return
  function mergeDeepProperties(prop) {
    if (!utils.isUndefined(config2[prop])) {
      return getMergedValue(config1[prop], config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      return getMergedValue(undefined, config1[prop]);
    }
  }

  // eslint-disable-next-line consistent-return
  function valueFromConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      return getMergedValue(undefined, config2[prop]);
    }
  }

  // eslint-disable-next-line consistent-return
  function defaultToConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      return getMergedValue(undefined, config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      return getMergedValue(undefined, config1[prop]);
    }
  }

  // eslint-disable-next-line consistent-return
  function mergeDirectKeys(prop) {
    if (prop in config2) {
      return getMergedValue(config1[prop], config2[prop]);
    } else if (prop in config1) {
      return getMergedValue(undefined, config1[prop]);
    }
  }

  var mergeMap = {
    'url': valueFromConfig2,
    'method': valueFromConfig2,
    'data': valueFromConfig2,
    'baseURL': defaultToConfig2,
    'transformRequest': defaultToConfig2,
    'transformResponse': defaultToConfig2,
    'paramsSerializer': defaultToConfig2,
    'timeout': defaultToConfig2,
    'timeoutMessage': defaultToConfig2,
    'withCredentials': defaultToConfig2,
    'adapter': defaultToConfig2,
    'responseType': defaultToConfig2,
    'xsrfCookieName': defaultToConfig2,
    'xsrfHeaderName': defaultToConfig2,
    'onUploadProgress': defaultToConfig2,
    'onDownloadProgress': defaultToConfig2,
    'decompress': defaultToConfig2,
    'maxContentLength': defaultToConfig2,
    'maxBodyLength': defaultToConfig2,
    'beforeRedirect': defaultToConfig2,
    'transport': defaultToConfig2,
    'httpAgent': defaultToConfig2,
    'httpsAgent': defaultToConfig2,
    'cancelToken': defaultToConfig2,
    'socketPath': defaultToConfig2,
    'responseEncoding': defaultToConfig2,
    'validateStatus': mergeDirectKeys
  };

  utils.forEach(Object.keys(config1).concat(Object.keys(config2)), function computeConfigValue(prop) {
    var merge = mergeMap[prop] || mergeDeepProperties;
    var configValue = merge(prop);
    (utils.isUndefined(configValue) && merge !== mergeDirectKeys) || (config[prop] = configValue);
  });

  return config;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/settle.js":
/*!***********************************************!*\
  !*** ./node_modules/axios/lib/core/settle.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var AxiosError = __webpack_require__(/*! ./AxiosError */ "./node_modules/axios/lib/core/AxiosError.js");

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(new AxiosError(
      'Request failed with status code ' + response.status,
      [AxiosError.ERR_BAD_REQUEST, AxiosError.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
      response.config,
      response.request,
      response
    ));
  }
};


/***/ }),

/***/ "./node_modules/axios/lib/core/transformData.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/transformData.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var defaults = __webpack_require__(/*! ../defaults */ "./node_modules/axios/lib/defaults/index.js");

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  var context = this || defaults;
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn.call(context, data, headers);
  });

  return data;
};


/***/ }),

/***/ "./node_modules/axios/lib/defaults/index.js":
/*!**************************************************!*\
  !*** ./node_modules/axios/lib/defaults/index.js ***!
  \**************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");
var normalizeHeaderName = __webpack_require__(/*! ../helpers/normalizeHeaderName */ "./node_modules/axios/lib/helpers/normalizeHeaderName.js");
var AxiosError = __webpack_require__(/*! ../core/AxiosError */ "./node_modules/axios/lib/core/AxiosError.js");
var transitionalDefaults = __webpack_require__(/*! ./transitional */ "./node_modules/axios/lib/defaults/transitional.js");
var toFormData = __webpack_require__(/*! ../helpers/toFormData */ "./node_modules/axios/lib/helpers/toFormData.js");

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__(/*! ../adapters/xhr */ "./node_modules/axios/lib/adapters/xhr.js");
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = __webpack_require__(/*! ../adapters/http */ "./node_modules/axios/lib/adapters/xhr.js");
  }
  return adapter;
}

function stringifySafely(rawValue, parser, encoder) {
  if (utils.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils.trim(rawValue);
    } catch (e) {
      if (e.name !== 'SyntaxError') {
        throw e;
      }
    }
  }

  return (encoder || JSON.stringify)(rawValue);
}

var defaults = {

  transitional: transitionalDefaults,

  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');

    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }

    var isObjectPayload = utils.isObject(data);
    var contentType = headers && headers['Content-Type'];

    var isFileList;

    if ((isFileList = utils.isFileList(data)) || (isObjectPayload && contentType === 'multipart/form-data')) {
      var _FormData = this.env && this.env.FormData;
      return toFormData(isFileList ? {'files[]': data} : data, _FormData && new _FormData());
    } else if (isObjectPayload || contentType === 'application/json') {
      setContentTypeIfUnset(headers, 'application/json');
      return stringifySafely(data);
    }

    return data;
  }],

  transformResponse: [function transformResponse(data) {
    var transitional = this.transitional || defaults.transitional;
    var silentJSONParsing = transitional && transitional.silentJSONParsing;
    var forcedJSONParsing = transitional && transitional.forcedJSONParsing;
    var strictJSONParsing = !silentJSONParsing && this.responseType === 'json';

    if (strictJSONParsing || (forcedJSONParsing && utils.isString(data) && data.length)) {
      try {
        return JSON.parse(data);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === 'SyntaxError') {
            throw AxiosError.from(e, AxiosError.ERR_BAD_RESPONSE, this, null, this.response);
          }
          throw e;
        }
      }
    }

    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  env: {
    FormData: __webpack_require__(/*! ./env/FormData */ "./node_modules/axios/lib/helpers/null.js")
  },

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  },

  headers: {
    common: {
      'Accept': 'application/json, text/plain, */*'
    }
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;


/***/ }),

/***/ "./node_modules/axios/lib/defaults/transitional.js":
/*!*********************************************************!*\
  !*** ./node_modules/axios/lib/defaults/transitional.js ***!
  \*********************************************************/
/***/ ((module) => {

"use strict";


module.exports = {
  silentJSONParsing: true,
  forcedJSONParsing: true,
  clarifyTimeoutError: false
};


/***/ }),

/***/ "./node_modules/axios/lib/env/data.js":
/*!********************************************!*\
  !*** ./node_modules/axios/lib/env/data.js ***!
  \********************************************/
/***/ ((module) => {

module.exports = {
  "version": "0.27.2"
};

/***/ }),

/***/ "./node_modules/axios/lib/helpers/bind.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/helpers/bind.js ***!
  \************************************************/
/***/ ((module) => {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/buildURL.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/buildURL.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/combineURLs.js":
/*!*******************************************************!*\
  !*** ./node_modules/axios/lib/helpers/combineURLs.js ***!
  \*******************************************************/
/***/ ((module) => {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/cookies.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/helpers/cookies.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAbsoluteURL.js":
/*!*********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAbsoluteURL.js ***!
  \*********************************************************/
/***/ ((module) => {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAxiosError.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAxiosError.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
module.exports = function isAxiosError(payload) {
  return utils.isObject(payload) && (payload.isAxiosError === true);
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isURLSameOrigin.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isURLSameOrigin.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/normalizeHeaderName.js":
/*!***************************************************************!*\
  !*** ./node_modules/axios/lib/helpers/normalizeHeaderName.js ***!
  \***************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/null.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/helpers/null.js ***!
  \************************************************/
/***/ ((module) => {

// eslint-disable-next-line strict
module.exports = null;


/***/ }),

/***/ "./node_modules/axios/lib/helpers/parseHeaders.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/parseHeaders.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/parseProtocol.js":
/*!*********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/parseProtocol.js ***!
  \*********************************************************/
/***/ ((module) => {

"use strict";


module.exports = function parseProtocol(url) {
  var match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
  return match && match[1] || '';
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/spread.js":
/*!**************************************************!*\
  !*** ./node_modules/axios/lib/helpers/spread.js ***!
  \**************************************************/
/***/ ((module) => {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/toFormData.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/helpers/toFormData.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

/**
 * Convert a data object to FormData
 * @param {Object} obj
 * @param {?Object} [formData]
 * @returns {Object}
 **/

function toFormData(obj, formData) {
  // eslint-disable-next-line no-param-reassign
  formData = formData || new FormData();

  var stack = [];

  function convertValue(value) {
    if (value === null) return '';

    if (utils.isDate(value)) {
      return value.toISOString();
    }

    if (utils.isArrayBuffer(value) || utils.isTypedArray(value)) {
      return typeof Blob === 'function' ? new Blob([value]) : Buffer.from(value);
    }

    return value;
  }

  function build(data, parentKey) {
    if (utils.isPlainObject(data) || utils.isArray(data)) {
      if (stack.indexOf(data) !== -1) {
        throw Error('Circular reference detected in ' + parentKey);
      }

      stack.push(data);

      utils.forEach(data, function each(value, key) {
        if (utils.isUndefined(value)) return;
        var fullKey = parentKey ? parentKey + '.' + key : key;
        var arr;

        if (value && !parentKey && typeof value === 'object') {
          if (utils.endsWith(key, '{}')) {
            // eslint-disable-next-line no-param-reassign
            value = JSON.stringify(value);
          } else if (utils.endsWith(key, '[]') && (arr = utils.toArray(value))) {
            // eslint-disable-next-line func-names
            arr.forEach(function(el) {
              !utils.isUndefined(el) && formData.append(fullKey, convertValue(el));
            });
            return;
          }
        }

        build(value, fullKey);
      });

      stack.pop();
    } else {
      formData.append(parentKey, convertValue(data));
    }
  }

  build(obj);

  return formData;
}

module.exports = toFormData;


/***/ }),

/***/ "./node_modules/axios/lib/helpers/validator.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/validator.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var VERSION = (__webpack_require__(/*! ../env/data */ "./node_modules/axios/lib/env/data.js").version);
var AxiosError = __webpack_require__(/*! ../core/AxiosError */ "./node_modules/axios/lib/core/AxiosError.js");

var validators = {};

// eslint-disable-next-line func-names
['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach(function(type, i) {
  validators[type] = function validator(thing) {
    return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
  };
});

var deprecatedWarnings = {};

/**
 * Transitional option validator
 * @param {function|boolean?} validator - set to false if the transitional option has been removed
 * @param {string?} version - deprecated version / removed since version
 * @param {string?} message - some message with additional info
 * @returns {function}
 */
validators.transitional = function transitional(validator, version, message) {
  function formatMessage(opt, desc) {
    return '[Axios v' + VERSION + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
  }

  // eslint-disable-next-line func-names
  return function(value, opt, opts) {
    if (validator === false) {
      throw new AxiosError(
        formatMessage(opt, ' has been removed' + (version ? ' in ' + version : '')),
        AxiosError.ERR_DEPRECATED
      );
    }

    if (version && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      // eslint-disable-next-line no-console
      console.warn(
        formatMessage(
          opt,
          ' has been deprecated since v' + version + ' and will be removed in the near future'
        )
      );
    }

    return validator ? validator(value, opt, opts) : true;
  };
};

/**
 * Assert object's properties type
 * @param {object} options
 * @param {object} schema
 * @param {boolean?} allowUnknown
 */

function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== 'object') {
    throw new AxiosError('options must be an object', AxiosError.ERR_BAD_OPTION_VALUE);
  }
  var keys = Object.keys(options);
  var i = keys.length;
  while (i-- > 0) {
    var opt = keys[i];
    var validator = schema[opt];
    if (validator) {
      var value = options[opt];
      var result = value === undefined || validator(value, opt, options);
      if (result !== true) {
        throw new AxiosError('option ' + opt + ' must be ' + result, AxiosError.ERR_BAD_OPTION_VALUE);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw new AxiosError('Unknown option ' + opt, AxiosError.ERR_BAD_OPTION);
    }
  }
}

module.exports = {
  assertOptions: assertOptions,
  validators: validators
};


/***/ }),

/***/ "./node_modules/axios/lib/utils.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/utils.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

// eslint-disable-next-line func-names
var kindOf = (function(cache) {
  // eslint-disable-next-line func-names
  return function(thing) {
    var str = toString.call(thing);
    return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
  };
})(Object.create(null));

function kindOfTest(type) {
  type = type.toLowerCase();
  return function isKindOf(thing) {
    return kindOf(thing) === type;
  };
}

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return Array.isArray(val);
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @function
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
var isArrayBuffer = kindOfTest('ArrayBuffer');


/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (isArrayBuffer(val.buffer));
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a plain Object
 *
 * @param {Object} val The value to test
 * @return {boolean} True if value is a plain Object, otherwise false
 */
function isPlainObject(val) {
  if (kindOf(val) !== 'object') {
    return false;
  }

  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

/**
 * Determine if a value is a Date
 *
 * @function
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
var isDate = kindOfTest('Date');

/**
 * Determine if a value is a File
 *
 * @function
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
var isFile = kindOfTest('File');

/**
 * Determine if a value is a Blob
 *
 * @function
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
var isBlob = kindOfTest('Blob');

/**
 * Determine if a value is a FileList
 *
 * @function
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
var isFileList = kindOfTest('FileList');

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} thing The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(thing) {
  var pattern = '[object FormData]';
  return thing && (
    (typeof FormData === 'function' && thing instanceof FormData) ||
    toString.call(thing) === pattern ||
    (isFunction(thing.toString) && thing.toString() === pattern)
  );
}

/**
 * Determine if a value is a URLSearchParams object
 * @function
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
var isURLSearchParams = kindOfTest('URLSearchParams');

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 * @return {string} content value without BOM
 */
function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

/**
 * Inherit the prototype methods from one constructor into another
 * @param {function} constructor
 * @param {function} superConstructor
 * @param {object} [props]
 * @param {object} [descriptors]
 */

function inherits(constructor, superConstructor, props, descriptors) {
  constructor.prototype = Object.create(superConstructor.prototype, descriptors);
  constructor.prototype.constructor = constructor;
  props && Object.assign(constructor.prototype, props);
}

/**
 * Resolve object with deep prototype chain to a flat object
 * @param {Object} sourceObj source object
 * @param {Object} [destObj]
 * @param {Function} [filter]
 * @returns {Object}
 */

function toFlatObject(sourceObj, destObj, filter) {
  var props;
  var i;
  var prop;
  var merged = {};

  destObj = destObj || {};

  do {
    props = Object.getOwnPropertyNames(sourceObj);
    i = props.length;
    while (i-- > 0) {
      prop = props[i];
      if (!merged[prop]) {
        destObj[prop] = sourceObj[prop];
        merged[prop] = true;
      }
    }
    sourceObj = Object.getPrototypeOf(sourceObj);
  } while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);

  return destObj;
}

/*
 * determines whether a string ends with the characters of a specified string
 * @param {String} str
 * @param {String} searchString
 * @param {Number} [position= 0]
 * @returns {boolean}
 */
function endsWith(str, searchString, position) {
  str = String(str);
  if (position === undefined || position > str.length) {
    position = str.length;
  }
  position -= searchString.length;
  var lastIndex = str.indexOf(searchString, position);
  return lastIndex !== -1 && lastIndex === position;
}


/**
 * Returns new array from array like object
 * @param {*} [thing]
 * @returns {Array}
 */
function toArray(thing) {
  if (!thing) return null;
  var i = thing.length;
  if (isUndefined(i)) return null;
  var arr = new Array(i);
  while (i-- > 0) {
    arr[i] = thing[i];
  }
  return arr;
}

// eslint-disable-next-line func-names
var isTypedArray = (function(TypedArray) {
  // eslint-disable-next-line func-names
  return function(thing) {
    return TypedArray && thing instanceof TypedArray;
  };
})(typeof Uint8Array !== 'undefined' && Object.getPrototypeOf(Uint8Array));

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isPlainObject: isPlainObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim,
  stripBOM: stripBOM,
  inherits: inherits,
  toFlatObject: toFlatObject,
  kindOf: kindOf,
  kindOfTest: kindOfTest,
  endsWith: endsWith,
  toArray: toArray,
  isTypedArray: isTypedArray,
  isFileList: isFileList
};


/***/ }),

/***/ "./node_modules/sweetalert2/dist/sweetalert2.all.js":
/*!**********************************************************!*\
  !*** ./node_modules/sweetalert2/dist/sweetalert2.all.js ***!
  \**********************************************************/
/***/ (function(module) {

/*!
* sweetalert2 v11.6.1
* Released under the MIT License.
*/
(function (global, factory) {
   true ? module.exports = factory() :
  0;
}(this, function () { 'use strict';

  /**
   * This module contains `WeakMap`s for each effectively-"private  property" that a `Swal` has.
   * For example, to set the private property "foo" of `this` to "bar", you can `privateProps.foo.set(this, 'bar')`
   * This is the approach that Babel will probably take to implement private methods/fields
   *   https://github.com/tc39/proposal-private-methods
   *   https://github.com/babel/babel/pull/7555
   * Once we have the changes from that PR in Babel, and our core class fits reasonable in *one module*
   *   then we can use that language feature.
   */

  var privateProps = {
    awaitingPromise: new WeakMap(),
    promise: new WeakMap(),
    innerParams: new WeakMap(),
    domCache: new WeakMap()
  };

  const swalPrefix = 'swal2-';

  /**
   * @param {string[]} items
   * @returns {object}
   */
  const prefix = items => {
    const result = {};
    for (const i in items) {
      result[items[i]] = swalPrefix + items[i];
    }
    return result;
  };
  const swalClasses = prefix(['container', 'shown', 'height-auto', 'iosfix', 'popup', 'modal', 'no-backdrop', 'no-transition', 'toast', 'toast-shown', 'show', 'hide', 'close', 'title', 'html-container', 'actions', 'confirm', 'deny', 'cancel', 'default-outline', 'footer', 'icon', 'icon-content', 'image', 'input', 'file', 'range', 'select', 'radio', 'checkbox', 'label', 'textarea', 'inputerror', 'input-label', 'validation-message', 'progress-steps', 'active-progress-step', 'progress-step', 'progress-step-line', 'loader', 'loading', 'styled', 'top', 'top-start', 'top-end', 'top-left', 'top-right', 'center', 'center-start', 'center-end', 'center-left', 'center-right', 'bottom', 'bottom-start', 'bottom-end', 'bottom-left', 'bottom-right', 'grow-row', 'grow-column', 'grow-fullscreen', 'rtl', 'timer-progress-bar', 'timer-progress-bar-container', 'scrollbar-measure', 'icon-success', 'icon-warning', 'icon-info', 'icon-question', 'icon-error', 'no-war']);
  const iconTypes = prefix(['success', 'warning', 'info', 'question', 'error']);

  const consolePrefix = 'SweetAlert2:';

  /**
   * Filter the unique values into a new array
   *
   * @param {Array} arr
   * @returns {Array}
   */
  const uniqueArray = arr => {
    const result = [];
    for (let i = 0; i < arr.length; i++) {
      if (result.indexOf(arr[i]) === -1) {
        result.push(arr[i]);
      }
    }
    return result;
  };

  /**
   * Capitalize the first letter of a string
   *
   * @param {string} str
   * @returns {string}
   */
  const capitalizeFirstLetter = str => str.charAt(0).toUpperCase() + str.slice(1);

  /**
   * Standardize console warnings
   *
   * @param {string | Array} message
   */
  const warn = message => {
    console.warn("".concat(consolePrefix, " ").concat(typeof message === 'object' ? message.join(' ') : message));
  };

  /**
   * Standardize console errors
   *
   * @param {string} message
   */
  const error = message => {
    console.error("".concat(consolePrefix, " ").concat(message));
  };

  /**
   * Private global state for `warnOnce`
   *
   * @type {Array}
   * @private
   */
  const previousWarnOnceMessages = [];

  /**
   * Show a console warning, but only if it hasn't already been shown
   *
   * @param {string} message
   */
  const warnOnce = message => {
    if (!previousWarnOnceMessages.includes(message)) {
      previousWarnOnceMessages.push(message);
      warn(message);
    }
  };

  /**
   * Show a one-time console warning about deprecated params/methods
   *
   * @param {string} deprecatedParam
   * @param {string} useInstead
   */
  const warnAboutDeprecation = (deprecatedParam, useInstead) => {
    warnOnce("\"".concat(deprecatedParam, "\" is deprecated and will be removed in the next major release. Please use \"").concat(useInstead, "\" instead."));
  };

  /**
   * If `arg` is a function, call it (with no arguments or context) and return the result.
   * Otherwise, just pass the value through
   *
   * @param {Function | any} arg
   * @returns {any}
   */
  const callIfFunction = arg => typeof arg === 'function' ? arg() : arg;

  /**
   * @param {any} arg
   * @returns {boolean}
   */
  const hasToPromiseFn = arg => arg && typeof arg.toPromise === 'function';

  /**
   * @param {any} arg
   * @returns {Promise}
   */
  const asPromise = arg => hasToPromiseFn(arg) ? arg.toPromise() : Promise.resolve(arg);

  /**
   * @param {any} arg
   * @returns {boolean}
   */
  const isPromise = arg => arg && Promise.resolve(arg) === arg;

  /**
   * Gets the popup container which contains the backdrop and the popup itself.
   *
   * @returns {HTMLElement | null}
   */
  const getContainer = () => document.body.querySelector(".".concat(swalClasses.container));

  /**
   * @param {string} selectorString
   * @returns {HTMLElement | null}
   */
  const elementBySelector = selectorString => {
    const container = getContainer();
    return container ? container.querySelector(selectorString) : null;
  };

  /**
   * @param {string} className
   * @returns {HTMLElement | null}
   */
  const elementByClass = className => {
    return elementBySelector(".".concat(className));
  };

  /**
   * @returns {HTMLElement | null}
   */
  const getPopup = () => elementByClass(swalClasses.popup);

  /**
   * @returns {HTMLElement | null}
   */
  const getIcon = () => elementByClass(swalClasses.icon);

  /**
   * @returns {HTMLElement | null}
   */
  const getIconContent = () => elementByClass(swalClasses['icon-content']);

  /**
   * @returns {HTMLElement | null}
   */
  const getTitle = () => elementByClass(swalClasses.title);

  /**
   * @returns {HTMLElement | null}
   */
  const getHtmlContainer = () => elementByClass(swalClasses['html-container']);

  /**
   * @returns {HTMLElement | null}
   */
  const getImage = () => elementByClass(swalClasses.image);

  /**
   * @returns {HTMLElement | null}
   */
  const getProgressSteps = () => elementByClass(swalClasses['progress-steps']);

  /**
   * @returns {HTMLElement | null}
   */
  const getValidationMessage = () => elementByClass(swalClasses['validation-message']);

  /**
   * @returns {HTMLElement | null}
   */
  const getConfirmButton = () => elementBySelector(".".concat(swalClasses.actions, " .").concat(swalClasses.confirm));

  /**
   * @returns {HTMLElement | null}
   */
  const getDenyButton = () => elementBySelector(".".concat(swalClasses.actions, " .").concat(swalClasses.deny));

  /**
   * @returns {HTMLElement | null}
   */
  const getInputLabel = () => elementByClass(swalClasses['input-label']);

  /**
   * @returns {HTMLElement | null}
   */
  const getLoader = () => elementBySelector(".".concat(swalClasses.loader));

  /**
   * @returns {HTMLElement | null}
   */
  const getCancelButton = () => elementBySelector(".".concat(swalClasses.actions, " .").concat(swalClasses.cancel));

  /**
   * @returns {HTMLElement | null}
   */
  const getActions = () => elementByClass(swalClasses.actions);

  /**
   * @returns {HTMLElement | null}
   */
  const getFooter = () => elementByClass(swalClasses.footer);

  /**
   * @returns {HTMLElement | null}
   */
  const getTimerProgressBar = () => elementByClass(swalClasses['timer-progress-bar']);

  /**
   * @returns {HTMLElement | null}
   */
  const getCloseButton = () => elementByClass(swalClasses.close);

  // https://github.com/jkup/focusable/blob/master/index.js
  const focusable = "\n  a[href],\n  area[href],\n  input:not([disabled]),\n  select:not([disabled]),\n  textarea:not([disabled]),\n  button:not([disabled]),\n  iframe,\n  object,\n  embed,\n  [tabindex=\"0\"],\n  [contenteditable],\n  audio[controls],\n  video[controls],\n  summary\n";
  /**
   * @returns {HTMLElement[]}
   */
  const getFocusableElements = () => {
    const focusableElementsWithTabindex = Array.from(getPopup().querySelectorAll('[tabindex]:not([tabindex="-1"]):not([tabindex="0"])'))
    // sort according to tabindex
    .sort((a, b) => {
      const tabindexA = parseInt(a.getAttribute('tabindex'));
      const tabindexB = parseInt(b.getAttribute('tabindex'));
      if (tabindexA > tabindexB) {
        return 1;
      } else if (tabindexA < tabindexB) {
        return -1;
      }
      return 0;
    });
    const otherFocusableElements = Array.from(getPopup().querySelectorAll(focusable)).filter(el => el.getAttribute('tabindex') !== '-1');
    return uniqueArray(focusableElementsWithTabindex.concat(otherFocusableElements)).filter(el => isVisible(el));
  };

  /**
   * @returns {boolean}
   */
  const isModal = () => {
    return hasClass(document.body, swalClasses.shown) && !hasClass(document.body, swalClasses['toast-shown']) && !hasClass(document.body, swalClasses['no-backdrop']);
  };

  /**
   * @returns {boolean}
   */
  const isToast = () => {
    return getPopup() && hasClass(getPopup(), swalClasses.toast);
  };

  /**
   * @returns {boolean}
   */
  const isLoading = () => {
    return getPopup().hasAttribute('data-loading');
  };

  // Remember state in cases where opening and handling a modal will fiddle with it.
  const states = {
    previousBodyPadding: null
  };

  /**
   * Securely set innerHTML of an element
   * https://github.com/sweetalert2/sweetalert2/issues/1926
   *
   * @param {HTMLElement} elem
   * @param {string} html
   */
  const setInnerHtml = (elem, html) => {
    elem.textContent = '';
    if (html) {
      const parser = new DOMParser();
      const parsed = parser.parseFromString(html, "text/html");
      Array.from(parsed.querySelector('head').childNodes).forEach(child => {
        elem.appendChild(child);
      });
      Array.from(parsed.querySelector('body').childNodes).forEach(child => {
        if (child instanceof HTMLVideoElement || child instanceof HTMLAudioElement) {
          elem.appendChild(child.cloneNode(true)); // https://github.com/sweetalert2/sweetalert2/issues/2507
        } else {
          elem.appendChild(child);
        }
      });
    }
  };

  /**
   * @param {HTMLElement} elem
   * @param {string} className
   * @returns {boolean}
   */
  const hasClass = (elem, className) => {
    if (!className) {
      return false;
    }
    const classList = className.split(/\s+/);
    for (let i = 0; i < classList.length; i++) {
      if (!elem.classList.contains(classList[i])) {
        return false;
      }
    }
    return true;
  };

  /**
   * @param {HTMLElement} elem
   * @param {SweetAlertOptions} params
   */
  const removeCustomClasses = (elem, params) => {
    Array.from(elem.classList).forEach(className => {
      if (!Object.values(swalClasses).includes(className) && !Object.values(iconTypes).includes(className) && !Object.values(params.showClass).includes(className)) {
        elem.classList.remove(className);
      }
    });
  };

  /**
   * @param {HTMLElement} elem
   * @param {SweetAlertOptions} params
   * @param {string} className
   */
  const applyCustomClass = (elem, params, className) => {
    removeCustomClasses(elem, params);
    if (params.customClass && params.customClass[className]) {
      if (typeof params.customClass[className] !== 'string' && !params.customClass[className].forEach) {
        warn("Invalid type of customClass.".concat(className, "! Expected string or iterable object, got \"").concat(typeof params.customClass[className], "\""));
        return;
      }
      addClass(elem, params.customClass[className]);
    }
  };

  /**
   * @param {HTMLElement} popup
   * @param {import('./renderers/renderInput').InputClass} inputClass
   * @returns {HTMLInputElement | null}
   */
  const getInput = (popup, inputClass) => {
    if (!inputClass) {
      return null;
    }
    switch (inputClass) {
      case 'select':
      case 'textarea':
      case 'file':
        return popup.querySelector(".".concat(swalClasses.popup, " > .").concat(swalClasses[inputClass]));
      case 'checkbox':
        return popup.querySelector(".".concat(swalClasses.popup, " > .").concat(swalClasses.checkbox, " input"));
      case 'radio':
        return popup.querySelector(".".concat(swalClasses.popup, " > .").concat(swalClasses.radio, " input:checked")) || popup.querySelector(".".concat(swalClasses.popup, " > .").concat(swalClasses.radio, " input:first-child"));
      case 'range':
        return popup.querySelector(".".concat(swalClasses.popup, " > .").concat(swalClasses.range, " input"));
      default:
        return popup.querySelector(".".concat(swalClasses.popup, " > .").concat(swalClasses.input));
    }
  };

  /**
   * @param {HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement} input
   */
  const focusInput = input => {
    input.focus();

    // place cursor at end of text in text input
    if (input.type !== 'file') {
      // http://stackoverflow.com/a/2345915
      const val = input.value;
      input.value = '';
      input.value = val;
    }
  };

  /**
   * @param {HTMLElement | HTMLElement[] | null} target
   * @param {string | string[] | readonly string[]} classList
   * @param {boolean} condition
   */
  const toggleClass = (target, classList, condition) => {
    if (!target || !classList) {
      return;
    }
    if (typeof classList === 'string') {
      classList = classList.split(/\s+/).filter(Boolean);
    }
    classList.forEach(className => {
      if (Array.isArray(target)) {
        target.forEach(elem => {
          condition ? elem.classList.add(className) : elem.classList.remove(className);
        });
      } else {
        condition ? target.classList.add(className) : target.classList.remove(className);
      }
    });
  };

  /**
   * @param {HTMLElement | HTMLElement[] | null} target
   * @param {string | string[] | readonly string[]} classList
   */
  const addClass = (target, classList) => {
    toggleClass(target, classList, true);
  };

  /**
   * @param {HTMLElement | HTMLElement[] | null} target
   * @param {string | string[] | readonly string[]} classList
   */
  const removeClass = (target, classList) => {
    toggleClass(target, classList, false);
  };

  /**
   * Get direct child of an element by class name
   *
   * @param {HTMLElement} elem
   * @param {string} className
   * @returns {HTMLElement | null}
   */
  const getDirectChildByClass = (elem, className) => {
    const children = Array.from(elem.children);
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (child instanceof HTMLElement && hasClass(child, className)) {
        return child;
      }
    }
  };

  /**
   * @param {HTMLElement} elem
   * @param {string} property
   * @param {*} value
   */
  const applyNumericalStyle = (elem, property, value) => {
    if (value === "".concat(parseInt(value))) {
      value = parseInt(value);
    }
    if (value || parseInt(value) === 0) {
      elem.style[property] = typeof value === 'number' ? "".concat(value, "px") : value;
    } else {
      elem.style.removeProperty(property);
    }
  };

  /**
   * @param {HTMLElement} elem
   * @param {string} display
   */
  const show = function (elem) {
    let display = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'flex';
    elem.style.display = display;
  };

  /**
   * @param {HTMLElement} elem
   */
  const hide = elem => {
    elem.style.display = 'none';
  };

  /**
   * @param {HTMLElement} parent
   * @param {string} selector
   * @param {string} property
   * @param {string} value
   */
  const setStyle = (parent, selector, property, value) => {
    /** @type {HTMLElement} */
    const el = parent.querySelector(selector);
    if (el) {
      el.style[property] = value;
    }
  };

  /**
   * @param {HTMLElement} elem
   * @param {any} condition
   * @param {string} display
   */
  const toggle = function (elem, condition) {
    let display = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'flex';
    condition ? show(elem, display) : hide(elem);
  };

  /**
   * borrowed from jquery $(elem).is(':visible') implementation
   *
   * @param {HTMLElement} elem
   * @returns {boolean}
   */
  const isVisible = elem => !!(elem && (elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length));

  /**
   * @returns {boolean}
   */
  const allButtonsAreHidden = () => !isVisible(getConfirmButton()) && !isVisible(getDenyButton()) && !isVisible(getCancelButton());

  /**
   * @param {HTMLElement} elem
   * @returns {boolean}
   */
  const isScrollable = elem => !!(elem.scrollHeight > elem.clientHeight);

  /**
   * borrowed from https://stackoverflow.com/a/46352119
   *
   * @param {HTMLElement} elem
   * @returns {boolean}
   */
  const hasCssAnimation = elem => {
    const style = window.getComputedStyle(elem);
    const animDuration = parseFloat(style.getPropertyValue('animation-duration') || '0');
    const transDuration = parseFloat(style.getPropertyValue('transition-duration') || '0');
    return animDuration > 0 || transDuration > 0;
  };

  /**
   * @param {number} timer
   * @param {boolean} reset
   */
  const animateTimerProgressBar = function (timer) {
    let reset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    const timerProgressBar = getTimerProgressBar();
    if (isVisible(timerProgressBar)) {
      if (reset) {
        timerProgressBar.style.transition = 'none';
        timerProgressBar.style.width = '100%';
      }
      setTimeout(() => {
        timerProgressBar.style.transition = "width ".concat(timer / 1000, "s linear");
        timerProgressBar.style.width = '0%';
      }, 10);
    }
  };
  const stopTimerProgressBar = () => {
    const timerProgressBar = getTimerProgressBar();
    const timerProgressBarWidth = parseInt(window.getComputedStyle(timerProgressBar).width);
    timerProgressBar.style.removeProperty('transition');
    timerProgressBar.style.width = '100%';
    const timerProgressBarFullWidth = parseInt(window.getComputedStyle(timerProgressBar).width);
    const timerProgressBarPercent = timerProgressBarWidth / timerProgressBarFullWidth * 100;
    timerProgressBar.style.removeProperty('transition');
    timerProgressBar.style.width = "".concat(timerProgressBarPercent, "%");
  };

  const RESTORE_FOCUS_TIMEOUT = 100;

  /** @type {GlobalState} */
  const globalState = {};
  const focusPreviousActiveElement = () => {
    if (globalState.previousActiveElement instanceof HTMLElement) {
      globalState.previousActiveElement.focus();
      globalState.previousActiveElement = null;
    } else if (document.body) {
      document.body.focus();
    }
  };

  /**
   * Restore previous active (focused) element
   *
   * @param {boolean} returnFocus
   * @returns {Promise}
   */
  const restoreActiveElement = returnFocus => {
    return new Promise(resolve => {
      if (!returnFocus) {
        return resolve();
      }
      const x = window.scrollX;
      const y = window.scrollY;
      globalState.restoreFocusTimeout = setTimeout(() => {
        focusPreviousActiveElement();
        resolve();
      }, RESTORE_FOCUS_TIMEOUT); // issues/900

      window.scrollTo(x, y);
    });
  };

  /**
   * Detect Node env
   *
   * @returns {boolean}
   */
  const isNodeEnv = () => typeof window === 'undefined' || typeof document === 'undefined';

  const sweetHTML = "\n <div aria-labelledby=\"".concat(swalClasses.title, "\" aria-describedby=\"").concat(swalClasses['html-container'], "\" class=\"").concat(swalClasses.popup, "\" tabindex=\"-1\">\n   <button type=\"button\" class=\"").concat(swalClasses.close, "\"></button>\n   <ul class=\"").concat(swalClasses['progress-steps'], "\"></ul>\n   <div class=\"").concat(swalClasses.icon, "\"></div>\n   <img class=\"").concat(swalClasses.image, "\" />\n   <h2 class=\"").concat(swalClasses.title, "\" id=\"").concat(swalClasses.title, "\"></h2>\n   <div class=\"").concat(swalClasses['html-container'], "\" id=\"").concat(swalClasses['html-container'], "\"></div>\n   <input class=\"").concat(swalClasses.input, "\" />\n   <input type=\"file\" class=\"").concat(swalClasses.file, "\" />\n   <div class=\"").concat(swalClasses.range, "\">\n     <input type=\"range\" />\n     <output></output>\n   </div>\n   <select class=\"").concat(swalClasses.select, "\"></select>\n   <div class=\"").concat(swalClasses.radio, "\"></div>\n   <label for=\"").concat(swalClasses.checkbox, "\" class=\"").concat(swalClasses.checkbox, "\">\n     <input type=\"checkbox\" />\n     <span class=\"").concat(swalClasses.label, "\"></span>\n   </label>\n   <textarea class=\"").concat(swalClasses.textarea, "\"></textarea>\n   <div class=\"").concat(swalClasses['validation-message'], "\" id=\"").concat(swalClasses['validation-message'], "\"></div>\n   <div class=\"").concat(swalClasses.actions, "\">\n     <div class=\"").concat(swalClasses.loader, "\"></div>\n     <button type=\"button\" class=\"").concat(swalClasses.confirm, "\"></button>\n     <button type=\"button\" class=\"").concat(swalClasses.deny, "\"></button>\n     <button type=\"button\" class=\"").concat(swalClasses.cancel, "\"></button>\n   </div>\n   <div class=\"").concat(swalClasses.footer, "\"></div>\n   <div class=\"").concat(swalClasses['timer-progress-bar-container'], "\">\n     <div class=\"").concat(swalClasses['timer-progress-bar'], "\"></div>\n   </div>\n </div>\n").replace(/(^|\n)\s*/g, '');

  /**
   * @returns {boolean}
   */
  const resetOldContainer = () => {
    const oldContainer = getContainer();
    if (!oldContainer) {
      return false;
    }
    oldContainer.remove();
    removeClass([document.documentElement, document.body], [swalClasses['no-backdrop'], swalClasses['toast-shown'], swalClasses['has-column']]);
    return true;
  };
  const resetValidationMessage = () => {
    globalState.currentInstance.resetValidationMessage();
  };
  const addInputChangeListeners = () => {
    const popup = getPopup();
    const input = getDirectChildByClass(popup, swalClasses.input);
    const file = getDirectChildByClass(popup, swalClasses.file);
    /** @type {HTMLInputElement} */
    const range = popup.querySelector(".".concat(swalClasses.range, " input"));
    /** @type {HTMLOutputElement} */
    const rangeOutput = popup.querySelector(".".concat(swalClasses.range, " output"));
    const select = getDirectChildByClass(popup, swalClasses.select);
    /** @type {HTMLInputElement} */
    const checkbox = popup.querySelector(".".concat(swalClasses.checkbox, " input"));
    const textarea = getDirectChildByClass(popup, swalClasses.textarea);
    input.oninput = resetValidationMessage;
    file.onchange = resetValidationMessage;
    select.onchange = resetValidationMessage;
    checkbox.onchange = resetValidationMessage;
    textarea.oninput = resetValidationMessage;
    range.oninput = () => {
      resetValidationMessage();
      rangeOutput.value = range.value;
    };
    range.onchange = () => {
      resetValidationMessage();
      rangeOutput.value = range.value;
    };
  };

  /**
   * @param {string | HTMLElement} target
   * @returns {HTMLElement}
   */
  const getTarget = target => typeof target === 'string' ? document.querySelector(target) : target;

  /**
   * @param {SweetAlertOptions} params
   */
  const setupAccessibility = params => {
    const popup = getPopup();
    popup.setAttribute('role', params.toast ? 'alert' : 'dialog');
    popup.setAttribute('aria-live', params.toast ? 'polite' : 'assertive');
    if (!params.toast) {
      popup.setAttribute('aria-modal', 'true');
    }
  };

  /**
   * @param {HTMLElement} targetElement
   */
  const setupRTL = targetElement => {
    if (window.getComputedStyle(targetElement).direction === 'rtl') {
      addClass(getContainer(), swalClasses.rtl);
    }
  };

  /**
   * Add modal + backdrop + no-war message for Russians to DOM
   *
   * @param {SweetAlertOptions} params
   */
  const init = params => {
    // Clean up the old popup container if it exists
    const oldContainerExisted = resetOldContainer();

    /* istanbul ignore if */
    if (isNodeEnv()) {
      error('SweetAlert2 requires document to initialize');
      return;
    }
    const container = document.createElement('div');
    container.className = swalClasses.container;
    if (oldContainerExisted) {
      addClass(container, swalClasses['no-transition']);
    }
    setInnerHtml(container, sweetHTML);
    const targetElement = getTarget(params.target);
    targetElement.appendChild(container);
    setupAccessibility(params);
    setupRTL(targetElement);
    addInputChangeListeners();
  };

  /**
   * @param {HTMLElement | object | string} param
   * @param {HTMLElement} target
   */
  const parseHtmlToContainer = (param, target) => {
    // DOM element
    if (param instanceof HTMLElement) {
      target.appendChild(param);
    }

    // Object
    else if (typeof param === 'object') {
      handleObject(param, target);
    }

    // Plain string
    else if (param) {
      setInnerHtml(target, param);
    }
  };

  /**
   * @param {object} param
   * @param {HTMLElement} target
   */
  const handleObject = (param, target) => {
    // JQuery element(s)
    if (param.jquery) {
      handleJqueryElem(target, param);
    }

    // For other objects use their string representation
    else {
      setInnerHtml(target, param.toString());
    }
  };

  /**
   * @param {HTMLElement} target
   * @param {HTMLElement} elem
   */
  const handleJqueryElem = (target, elem) => {
    target.textContent = '';
    if (0 in elem) {
      for (let i = 0; (i in elem); i++) {
        target.appendChild(elem[i].cloneNode(true));
      }
    } else {
      target.appendChild(elem.cloneNode(true));
    }
  };

  /**
   * @returns {'webkitAnimationEnd' | 'animationend' | false}
   */
  const animationEndEvent = (() => {
    // Prevent run in Node env
    /* istanbul ignore if */
    if (isNodeEnv()) {
      return false;
    }
    const testEl = document.createElement('div');
    const transEndEventNames = {
      WebkitAnimation: 'webkitAnimationEnd',
      // Chrome, Safari and Opera
      animation: 'animationend' // Standard syntax
    };

    for (const i in transEndEventNames) {
      if (Object.prototype.hasOwnProperty.call(transEndEventNames, i) && typeof testEl.style[i] !== 'undefined') {
        return transEndEventNames[i];
      }
    }
    return false;
  })();

  /**
   * Measure scrollbar width for padding body during modal show/hide
   * https://github.com/twbs/bootstrap/blob/master/js/src/modal.js
   *
   * @returns {number}
   */
  const measureScrollbar = () => {
    const scrollDiv = document.createElement('div');
    scrollDiv.className = swalClasses['scrollbar-measure'];
    document.body.appendChild(scrollDiv);
    const scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth;
    document.body.removeChild(scrollDiv);
    return scrollbarWidth;
  };

  /**
   * @param {SweetAlert2} instance
   * @param {SweetAlertOptions} params
   */
  const renderActions = (instance, params) => {
    const actions = getActions();
    const loader = getLoader();

    // Actions (buttons) wrapper
    if (!params.showConfirmButton && !params.showDenyButton && !params.showCancelButton) {
      hide(actions);
    } else {
      show(actions);
    }

    // Custom class
    applyCustomClass(actions, params, 'actions');

    // Render all the buttons
    renderButtons(actions, loader, params);

    // Loader
    setInnerHtml(loader, params.loaderHtml);
    applyCustomClass(loader, params, 'loader');
  };

  /**
   * @param {HTMLElement} actions
   * @param {HTMLElement} loader
   * @param {SweetAlertOptions} params
   */
  function renderButtons(actions, loader, params) {
    const confirmButton = getConfirmButton();
    const denyButton = getDenyButton();
    const cancelButton = getCancelButton();

    // Render buttons
    renderButton(confirmButton, 'confirm', params);
    renderButton(denyButton, 'deny', params);
    renderButton(cancelButton, 'cancel', params);
    handleButtonsStyling(confirmButton, denyButton, cancelButton, params);
    if (params.reverseButtons) {
      if (params.toast) {
        actions.insertBefore(cancelButton, confirmButton);
        actions.insertBefore(denyButton, confirmButton);
      } else {
        actions.insertBefore(cancelButton, loader);
        actions.insertBefore(denyButton, loader);
        actions.insertBefore(confirmButton, loader);
      }
    }
  }

  /**
   * @param {HTMLElement} confirmButton
   * @param {HTMLElement} denyButton
   * @param {HTMLElement} cancelButton
   * @param {SweetAlertOptions} params
   */
  function handleButtonsStyling(confirmButton, denyButton, cancelButton, params) {
    if (!params.buttonsStyling) {
      removeClass([confirmButton, denyButton, cancelButton], swalClasses.styled);
      return;
    }
    addClass([confirmButton, denyButton, cancelButton], swalClasses.styled);

    // Buttons background colors
    if (params.confirmButtonColor) {
      confirmButton.style.backgroundColor = params.confirmButtonColor;
      addClass(confirmButton, swalClasses['default-outline']);
    }
    if (params.denyButtonColor) {
      denyButton.style.backgroundColor = params.denyButtonColor;
      addClass(denyButton, swalClasses['default-outline']);
    }
    if (params.cancelButtonColor) {
      cancelButton.style.backgroundColor = params.cancelButtonColor;
      addClass(cancelButton, swalClasses['default-outline']);
    }
  }

  /**
   * @param {HTMLElement} button
   * @param {'confirm' | 'deny' | 'cancel'} buttonType
   * @param {SweetAlertOptions} params
   */
  function renderButton(button, buttonType, params) {
    toggle(button, params["show".concat(capitalizeFirstLetter(buttonType), "Button")], 'inline-block');
    setInnerHtml(button, params["".concat(buttonType, "ButtonText")]); // Set caption text
    button.setAttribute('aria-label', params["".concat(buttonType, "ButtonAriaLabel")]); // ARIA label

    // Add buttons custom classes
    button.className = swalClasses[buttonType];
    applyCustomClass(button, params, "".concat(buttonType, "Button"));
    addClass(button, params["".concat(buttonType, "ButtonClass")]);
  }

  /**
   * @param {SweetAlert2} instance
   * @param {SweetAlertOptions} params
   */
  const renderCloseButton = (instance, params) => {
    const closeButton = getCloseButton();
    setInnerHtml(closeButton, params.closeButtonHtml);

    // Custom class
    applyCustomClass(closeButton, params, 'closeButton');
    toggle(closeButton, params.showCloseButton);
    closeButton.setAttribute('aria-label', params.closeButtonAriaLabel);
  };

  /**
   * @param {SweetAlert2} instance
   * @param {SweetAlertOptions} params
   */
  const renderContainer = (instance, params) => {
    const container = getContainer();
    if (!container) {
      return;
    }
    handleBackdropParam(container, params.backdrop);
    handlePositionParam(container, params.position);
    handleGrowParam(container, params.grow);

    // Custom class
    applyCustomClass(container, params, 'container');
  };

  /**
   * @param {HTMLElement} container
   * @param {SweetAlertOptions['backdrop']} backdrop
   */
  function handleBackdropParam(container, backdrop) {
    if (typeof backdrop === 'string') {
      container.style.background = backdrop;
    } else if (!backdrop) {
      addClass([document.documentElement, document.body], swalClasses['no-backdrop']);
    }
  }

  /**
   * @param {HTMLElement} container
   * @param {SweetAlertOptions['position']} position
   */
  function handlePositionParam(container, position) {
    if (position in swalClasses) {
      addClass(container, swalClasses[position]);
    } else {
      warn('The "position" parameter is not valid, defaulting to "center"');
      addClass(container, swalClasses.center);
    }
  }

  /**
   * @param {HTMLElement} container
   * @param {SweetAlertOptions['grow']} grow
   */
  function handleGrowParam(container, grow) {
    if (grow && typeof grow === 'string') {
      const growClass = "grow-".concat(grow);
      if (growClass in swalClasses) {
        addClass(container, swalClasses[growClass]);
      }
    }
  }

  /// <reference path="../../../../sweetalert2.d.ts"/>

  /** @type {InputClass[]} */
  const inputClasses = ['input', 'file', 'range', 'select', 'radio', 'checkbox', 'textarea'];

  /**
   * @param {SweetAlert2} instance
   * @param {SweetAlertOptions} params
   */
  const renderInput = (instance, params) => {
    const popup = getPopup();
    const innerParams = privateProps.innerParams.get(instance);
    const rerender = !innerParams || params.input !== innerParams.input;
    inputClasses.forEach(inputClass => {
      const inputContainer = getDirectChildByClass(popup, swalClasses[inputClass]);

      // set attributes
      setAttributes(inputClass, params.inputAttributes);

      // set class
      inputContainer.className = swalClasses[inputClass];
      if (rerender) {
        hide(inputContainer);
      }
    });
    if (params.input) {
      if (rerender) {
        showInput(params);
      }
      // set custom class
      setCustomClass(params);
    }
  };

  /**
   * @param {SweetAlertOptions} params
   */
  const showInput = params => {
    if (!renderInputType[params.input]) {
      error("Unexpected type of input! Expected \"text\", \"email\", \"password\", \"number\", \"tel\", \"select\", \"radio\", \"checkbox\", \"textarea\", \"file\" or \"url\", got \"".concat(params.input, "\""));
      return;
    }
    const inputContainer = getInputContainer(params.input);
    const input = renderInputType[params.input](inputContainer, params);
    show(inputContainer);

    // input autofocus
    setTimeout(() => {
      focusInput(input);
    });
  };

  /**
   * @param {HTMLInputElement} input
   */
  const removeAttributes = input => {
    for (let i = 0; i < input.attributes.length; i++) {
      const attrName = input.attributes[i].name;
      if (!['type', 'value', 'style'].includes(attrName)) {
        input.removeAttribute(attrName);
      }
    }
  };

  /**
   * @param {InputClass} inputClass
   * @param {SweetAlertOptions['inputAttributes']} inputAttributes
   */
  const setAttributes = (inputClass, inputAttributes) => {
    const input = getInput(getPopup(), inputClass);
    if (!input) {
      return;
    }
    removeAttributes(input);
    for (const attr in inputAttributes) {
      input.setAttribute(attr, inputAttributes[attr]);
    }
  };

  /**
   * @param {SweetAlertOptions} params
   */
  const setCustomClass = params => {
    const inputContainer = getInputContainer(params.input);
    if (typeof params.customClass === 'object') {
      addClass(inputContainer, params.customClass.input);
    }
  };

  /**
   * @param {HTMLInputElement | HTMLTextAreaElement} input
   * @param {SweetAlertOptions} params
   */
  const setInputPlaceholder = (input, params) => {
    if (!input.placeholder || params.inputPlaceholder) {
      input.placeholder = params.inputPlaceholder;
    }
  };

  /**
   * @param {Input} input
   * @param {Input} prependTo
   * @param {SweetAlertOptions} params
   */
  const setInputLabel = (input, prependTo, params) => {
    if (params.inputLabel) {
      input.id = swalClasses.input;
      const label = document.createElement('label');
      const labelClass = swalClasses['input-label'];
      label.setAttribute('for', input.id);
      label.className = labelClass;
      if (typeof params.customClass === 'object') {
        addClass(label, params.customClass.inputLabel);
      }
      label.innerText = params.inputLabel;
      prependTo.insertAdjacentElement('beforebegin', label);
    }
  };

  /**
   * @param {SweetAlertOptions['input']} inputType
   * @returns {HTMLElement}
   */
  const getInputContainer = inputType => {
    return getDirectChildByClass(getPopup(), swalClasses[inputType] || swalClasses.input);
  };

  /**
   * @param {HTMLInputElement | HTMLOutputElement | HTMLTextAreaElement} input
   * @param {SweetAlertOptions['inputValue']} inputValue
   */
  const checkAndSetInputValue = (input, inputValue) => {
    if (['string', 'number'].includes(typeof inputValue)) {
      input.value = "".concat(inputValue);
    } else if (!isPromise(inputValue)) {
      warn("Unexpected type of inputValue! Expected \"string\", \"number\" or \"Promise\", got \"".concat(typeof inputValue, "\""));
    }
  };

  /** @type {Record<string, (input: Input | HTMLElement, params: SweetAlertOptions) => Input>} */
  const renderInputType = {};

  /**
   * @param {HTMLInputElement} input
   * @param {SweetAlertOptions} params
   * @returns {HTMLInputElement}
   */
  renderInputType.text = renderInputType.email = renderInputType.password = renderInputType.number = renderInputType.tel = renderInputType.url = (input, params) => {
    checkAndSetInputValue(input, params.inputValue);
    setInputLabel(input, input, params);
    setInputPlaceholder(input, params);
    input.type = params.input;
    return input;
  };

  /**
   * @param {HTMLInputElement} input
   * @param {SweetAlertOptions} params
   * @returns {HTMLInputElement}
   */
  renderInputType.file = (input, params) => {
    setInputLabel(input, input, params);
    setInputPlaceholder(input, params);
    return input;
  };

  /**
   * @param {HTMLInputElement} range
   * @param {SweetAlertOptions} params
   * @returns {HTMLInputElement}
   */
  renderInputType.range = (range, params) => {
    const rangeInput = range.querySelector('input');
    const rangeOutput = range.querySelector('output');
    checkAndSetInputValue(rangeInput, params.inputValue);
    rangeInput.type = params.input;
    checkAndSetInputValue(rangeOutput, params.inputValue);
    setInputLabel(rangeInput, range, params);
    return range;
  };

  /**
   * @param {HTMLSelectElement} select
   * @param {SweetAlertOptions} params
   * @returns {HTMLSelectElement}
   */
  renderInputType.select = (select, params) => {
    select.textContent = '';
    if (params.inputPlaceholder) {
      const placeholder = document.createElement('option');
      setInnerHtml(placeholder, params.inputPlaceholder);
      placeholder.value = '';
      placeholder.disabled = true;
      placeholder.selected = true;
      select.appendChild(placeholder);
    }
    setInputLabel(select, select, params);
    return select;
  };

  /**
   * @param {HTMLInputElement} radio
   * @returns {HTMLInputElement}
   */
  renderInputType.radio = radio => {
    radio.textContent = '';
    return radio;
  };

  /**
   * @param {HTMLLabelElement} checkboxContainer
   * @param {SweetAlertOptions} params
   * @returns {HTMLInputElement}
   */
  renderInputType.checkbox = (checkboxContainer, params) => {
    const checkbox = getInput(getPopup(), 'checkbox');
    checkbox.value = '1';
    checkbox.id = swalClasses.checkbox;
    checkbox.checked = Boolean(params.inputValue);
    const label = checkboxContainer.querySelector('span');
    setInnerHtml(label, params.inputPlaceholder);
    return checkbox;
  };

  /**
   * @param {HTMLTextAreaElement} textarea
   * @param {SweetAlertOptions} params
   * @returns {HTMLTextAreaElement}
   */
  renderInputType.textarea = (textarea, params) => {
    checkAndSetInputValue(textarea, params.inputValue);
    setInputPlaceholder(textarea, params);
    setInputLabel(textarea, textarea, params);

    /**
     * @param {HTMLElement} el
     * @returns {number}
     */
    const getMargin = el => parseInt(window.getComputedStyle(el).marginLeft) + parseInt(window.getComputedStyle(el).marginRight);

    // https://github.com/sweetalert2/sweetalert2/issues/2291
    setTimeout(() => {
      // https://github.com/sweetalert2/sweetalert2/issues/1699
      if ('MutationObserver' in window) {
        const initialPopupWidth = parseInt(window.getComputedStyle(getPopup()).width);
        const textareaResizeHandler = () => {
          const textareaWidth = textarea.offsetWidth + getMargin(textarea);
          if (textareaWidth > initialPopupWidth) {
            getPopup().style.width = "".concat(textareaWidth, "px");
          } else {
            getPopup().style.width = null;
          }
        };
        new MutationObserver(textareaResizeHandler).observe(textarea, {
          attributes: true,
          attributeFilter: ['style']
        });
      }
    });
    return textarea;
  };

  /**
   * @param {SweetAlert2} instance
   * @param {SweetAlertOptions} params
   */
  const renderContent = (instance, params) => {
    const htmlContainer = getHtmlContainer();
    applyCustomClass(htmlContainer, params, 'htmlContainer');

    // Content as HTML
    if (params.html) {
      parseHtmlToContainer(params.html, htmlContainer);
      show(htmlContainer, 'block');
    }

    // Content as plain text
    else if (params.text) {
      htmlContainer.textContent = params.text;
      show(htmlContainer, 'block');
    }

    // No content
    else {
      hide(htmlContainer);
    }
    renderInput(instance, params);
  };

  /**
   * @param {SweetAlert2} instance
   * @param {SweetAlertOptions} params
   */
  const renderFooter = (instance, params) => {
    const footer = getFooter();
    toggle(footer, params.footer);
    if (params.footer) {
      parseHtmlToContainer(params.footer, footer);
    }

    // Custom class
    applyCustomClass(footer, params, 'footer');
  };

  /**
   * @param {SweetAlert2} instance
   * @param {SweetAlertOptions} params
   */
  const renderIcon = (instance, params) => {
    const innerParams = privateProps.innerParams.get(instance);
    const icon = getIcon();

    // if the given icon already rendered, apply the styling without re-rendering the icon
    if (innerParams && params.icon === innerParams.icon) {
      // Custom or default content
      setContent(icon, params);
      applyStyles(icon, params);
      return;
    }
    if (!params.icon && !params.iconHtml) {
      hide(icon);
      return;
    }
    if (params.icon && Object.keys(iconTypes).indexOf(params.icon) === -1) {
      error("Unknown icon! Expected \"success\", \"error\", \"warning\", \"info\" or \"question\", got \"".concat(params.icon, "\""));
      hide(icon);
      return;
    }
    show(icon);

    // Custom or default content
    setContent(icon, params);
    applyStyles(icon, params);

    // Animate icon
    addClass(icon, params.showClass.icon);
  };

  /**
   * @param {HTMLElement} icon
   * @param {SweetAlertOptions} params
   */
  const applyStyles = (icon, params) => {
    for (const iconType in iconTypes) {
      if (params.icon !== iconType) {
        removeClass(icon, iconTypes[iconType]);
      }
    }
    addClass(icon, iconTypes[params.icon]);

    // Icon color
    setColor(icon, params);

    // Success icon background color
    adjustSuccessIconBackgroundColor();

    // Custom class
    applyCustomClass(icon, params, 'icon');
  };

  // Adjust success icon background color to match the popup background color
  const adjustSuccessIconBackgroundColor = () => {
    const popup = getPopup();
    const popupBackgroundColor = window.getComputedStyle(popup).getPropertyValue('background-color');
    /** @type {NodeListOf<HTMLElement>} */
    const successIconParts = popup.querySelectorAll('[class^=swal2-success-circular-line], .swal2-success-fix');
    for (let i = 0; i < successIconParts.length; i++) {
      successIconParts[i].style.backgroundColor = popupBackgroundColor;
    }
  };
  const successIconHtml = "\n  <div class=\"swal2-success-circular-line-left\"></div>\n  <span class=\"swal2-success-line-tip\"></span> <span class=\"swal2-success-line-long\"></span>\n  <div class=\"swal2-success-ring\"></div> <div class=\"swal2-success-fix\"></div>\n  <div class=\"swal2-success-circular-line-right\"></div>\n";
  const errorIconHtml = "\n  <span class=\"swal2-x-mark\">\n    <span class=\"swal2-x-mark-line-left\"></span>\n    <span class=\"swal2-x-mark-line-right\"></span>\n  </span>\n";

  /**
   * @param {HTMLElement} icon
   * @param {SweetAlertOptions} params
   */
  const setContent = (icon, params) => {
    let oldContent = icon.innerHTML;
    let newContent;
    if (params.iconHtml) {
      newContent = iconContent(params.iconHtml);
    } else if (params.icon === 'success') {
      newContent = successIconHtml;
      oldContent = oldContent.replace(/ style=".*?"/g, ''); // undo adjustSuccessIconBackgroundColor()
    } else if (params.icon === 'error') {
      newContent = errorIconHtml;
    } else {
      const defaultIconHtml = {
        question: '?',
        warning: '!',
        info: 'i'
      };
      newContent = iconContent(defaultIconHtml[params.icon]);
    }
    if (oldContent.trim() !== newContent.trim()) {
      setInnerHtml(icon, newContent);
    }
  };

  /**
   * @param {HTMLElement} icon
   * @param {SweetAlertOptions} params
   */
  const setColor = (icon, params) => {
    if (!params.iconColor) {
      return;
    }
    icon.style.color = params.iconColor;
    icon.style.borderColor = params.iconColor;
    for (const sel of ['.swal2-success-line-tip', '.swal2-success-line-long', '.swal2-x-mark-line-left', '.swal2-x-mark-line-right']) {
      setStyle(icon, sel, 'backgroundColor', params.iconColor);
    }
    setStyle(icon, '.swal2-success-ring', 'borderColor', params.iconColor);
  };

  /**
   * @param {string} content
   * @returns {string}
   */
  const iconContent = content => "<div class=\"".concat(swalClasses['icon-content'], "\">").concat(content, "</div>");

  /**
   * @param {SweetAlert2} instance
   * @param {SweetAlertOptions} params
   */
  const renderImage = (instance, params) => {
    const image = getImage();
    if (!params.imageUrl) {
      hide(image);
      return;
    }
    show(image, '');

    // Src, alt
    image.setAttribute('src', params.imageUrl);
    image.setAttribute('alt', params.imageAlt);

    // Width, height
    applyNumericalStyle(image, 'width', params.imageWidth);
    applyNumericalStyle(image, 'height', params.imageHeight);

    // Class
    image.className = swalClasses.image;
    applyCustomClass(image, params, 'image');
  };

  /**
   * @param {SweetAlert2} instance
   * @param {SweetAlertOptions} params
   */
  const renderPopup = (instance, params) => {
    const container = getContainer();
    const popup = getPopup();

    // Width
    // https://github.com/sweetalert2/sweetalert2/issues/2170
    if (params.toast) {
      applyNumericalStyle(container, 'width', params.width);
      popup.style.width = '100%';
      popup.insertBefore(getLoader(), getIcon());
    } else {
      applyNumericalStyle(popup, 'width', params.width);
    }

    // Padding
    applyNumericalStyle(popup, 'padding', params.padding);

    // Color
    if (params.color) {
      popup.style.color = params.color;
    }

    // Background
    if (params.background) {
      popup.style.background = params.background;
    }
    hide(getValidationMessage());

    // Classes
    addClasses(popup, params);
  };

  /**
   * @param {HTMLElement} popup
   * @param {SweetAlertOptions} params
   */
  const addClasses = (popup, params) => {
    // Default Class + showClass when updating Swal.update({})
    popup.className = "".concat(swalClasses.popup, " ").concat(isVisible(popup) ? params.showClass.popup : '');
    if (params.toast) {
      addClass([document.documentElement, document.body], swalClasses['toast-shown']);
      addClass(popup, swalClasses.toast);
    } else {
      addClass(popup, swalClasses.modal);
    }

    // Custom class
    applyCustomClass(popup, params, 'popup');
    if (typeof params.customClass === 'string') {
      addClass(popup, params.customClass);
    }

    // Icon class (#1842)
    if (params.icon) {
      addClass(popup, swalClasses["icon-".concat(params.icon)]);
    }
  };

  /**
   * @param {SweetAlert2} instance
   * @param {SweetAlertOptions} params
   */
  const renderProgressSteps = (instance, params) => {
    const progressStepsContainer = getProgressSteps();
    if (!params.progressSteps || params.progressSteps.length === 0) {
      hide(progressStepsContainer);
      return;
    }
    show(progressStepsContainer);
    progressStepsContainer.textContent = '';
    if (params.currentProgressStep >= params.progressSteps.length) {
      warn('Invalid currentProgressStep parameter, it should be less than progressSteps.length ' + '(currentProgressStep like JS arrays starts from 0)');
    }
    params.progressSteps.forEach((step, index) => {
      const stepEl = createStepElement(step);
      progressStepsContainer.appendChild(stepEl);
      if (index === params.currentProgressStep) {
        addClass(stepEl, swalClasses['active-progress-step']);
      }
      if (index !== params.progressSteps.length - 1) {
        const lineEl = createLineElement(params);
        progressStepsContainer.appendChild(lineEl);
      }
    });
  };

  /**
   * @param {string} step
   * @returns {HTMLLIElement}
   */
  const createStepElement = step => {
    const stepEl = document.createElement('li');
    addClass(stepEl, swalClasses['progress-step']);
    setInnerHtml(stepEl, step);
    return stepEl;
  };

  /**
   * @param {SweetAlertOptions} params
   * @returns {HTMLLIElement}
   */
  const createLineElement = params => {
    const lineEl = document.createElement('li');
    addClass(lineEl, swalClasses['progress-step-line']);
    if (params.progressStepsDistance) {
      applyNumericalStyle(lineEl, 'width', params.progressStepsDistance);
    }
    return lineEl;
  };

  /**
   * @param {SweetAlert2} instance
   * @param {SweetAlertOptions} params
   */
  const renderTitle = (instance, params) => {
    const title = getTitle();
    toggle(title, params.title || params.titleText, 'block');
    if (params.title) {
      parseHtmlToContainer(params.title, title);
    }
    if (params.titleText) {
      title.innerText = params.titleText;
    }

    // Custom class
    applyCustomClass(title, params, 'title');
  };

  /**
   * @param {SweetAlert2} instance
   * @param {SweetAlertOptions} params
   */
  const render = (instance, params) => {
    renderPopup(instance, params);
    renderContainer(instance, params);
    renderProgressSteps(instance, params);
    renderIcon(instance, params);
    renderImage(instance, params);
    renderTitle(instance, params);
    renderCloseButton(instance, params);
    renderContent(instance, params);
    renderActions(instance, params);
    renderFooter(instance, params);
    if (typeof params.didRender === 'function') {
      params.didRender(getPopup());
    }
  };

  /**
   * Hides loader and shows back the button which was hidden by .showLoading()
   */
  function hideLoading() {
    // do nothing if popup is closed
    const innerParams = privateProps.innerParams.get(this);
    if (!innerParams) {
      return;
    }
    const domCache = privateProps.domCache.get(this);
    hide(domCache.loader);
    if (isToast()) {
      if (innerParams.icon) {
        show(getIcon());
      }
    } else {
      showRelatedButton(domCache);
    }
    removeClass([domCache.popup, domCache.actions], swalClasses.loading);
    domCache.popup.removeAttribute('aria-busy');
    domCache.popup.removeAttribute('data-loading');
    domCache.confirmButton.disabled = false;
    domCache.denyButton.disabled = false;
    domCache.cancelButton.disabled = false;
  }
  const showRelatedButton = domCache => {
    const buttonToReplace = domCache.popup.getElementsByClassName(domCache.loader.getAttribute('data-button-to-replace'));
    if (buttonToReplace.length) {
      show(buttonToReplace[0], 'inline-block');
    } else if (allButtonsAreHidden()) {
      hide(domCache.actions);
    }
  };

  /**
   * Gets the input DOM node, this method works with input parameter.
   * @returns {HTMLElement | null}
   */
  function getInput$1(instance) {
    const innerParams = privateProps.innerParams.get(instance || this);
    const domCache = privateProps.domCache.get(instance || this);
    if (!domCache) {
      return null;
    }
    return getInput(domCache.popup, innerParams.input);
  }

  /*
   * Global function to determine if SweetAlert2 popup is shown
   */
  const isVisible$1 = () => {
    return isVisible(getPopup());
  };

  /*
   * Global function to click 'Confirm' button
   */
  const clickConfirm = () => getConfirmButton() && getConfirmButton().click();

  /*
   * Global function to click 'Deny' button
   */
  const clickDeny = () => getDenyButton() && getDenyButton().click();

  /*
   * Global function to click 'Cancel' button
   */
  const clickCancel = () => getCancelButton() && getCancelButton().click();

  const DismissReason = Object.freeze({
    cancel: 'cancel',
    backdrop: 'backdrop',
    close: 'close',
    esc: 'esc',
    timer: 'timer'
  });

  /**
   * @param {GlobalState} globalState
   */
  const removeKeydownHandler = globalState => {
    if (globalState.keydownTarget && globalState.keydownHandlerAdded) {
      globalState.keydownTarget.removeEventListener('keydown', globalState.keydownHandler, {
        capture: globalState.keydownListenerCapture
      });
      globalState.keydownHandlerAdded = false;
    }
  };

  /**
   * @param {SweetAlert2} instance
   * @param {GlobalState} globalState
   * @param {SweetAlertOptions} innerParams
   * @param {*} dismissWith
   */
  const addKeydownHandler = (instance, globalState, innerParams, dismissWith) => {
    removeKeydownHandler(globalState);
    if (!innerParams.toast) {
      globalState.keydownHandler = e => keydownHandler(instance, e, dismissWith);
      globalState.keydownTarget = innerParams.keydownListenerCapture ? window : getPopup();
      globalState.keydownListenerCapture = innerParams.keydownListenerCapture;
      globalState.keydownTarget.addEventListener('keydown', globalState.keydownHandler, {
        capture: globalState.keydownListenerCapture
      });
      globalState.keydownHandlerAdded = true;
    }
  };

  /**
   * @param {SweetAlertOptions} innerParams
   * @param {number} index
   * @param {number} increment
   */
  const setFocus = (innerParams, index, increment) => {
    const focusableElements = getFocusableElements();
    // search for visible elements and select the next possible match
    if (focusableElements.length) {
      index = index + increment;

      // rollover to first item
      if (index === focusableElements.length) {
        index = 0;

        // go to last item
      } else if (index === -1) {
        index = focusableElements.length - 1;
      }
      return focusableElements[index].focus();
    }
    // no visible focusable elements, focus the popup
    getPopup().focus();
  };
  const arrowKeysNextButton = ['ArrowRight', 'ArrowDown'];
  const arrowKeysPreviousButton = ['ArrowLeft', 'ArrowUp'];

  /**
   * @param {SweetAlert2} instance
   * @param {KeyboardEvent} e
   * @param {function} dismissWith
   */
  const keydownHandler = (instance, e, dismissWith) => {
    const innerParams = privateProps.innerParams.get(instance);
    if (!innerParams) {
      return; // This instance has already been destroyed
    }

    // Ignore keydown during IME composition
    // https://developer.mozilla.org/en-US/docs/Web/API/Document/keydown_event#ignoring_keydown_during_ime_composition
    // https://github.com/sweetalert2/sweetalert2/issues/720
    // https://github.com/sweetalert2/sweetalert2/issues/2406
    if (e.isComposing || e.keyCode === 229) {
      return;
    }
    if (innerParams.stopKeydownPropagation) {
      e.stopPropagation();
    }

    // ENTER
    if (e.key === 'Enter') {
      handleEnter(instance, e, innerParams);
    }

    // TAB
    else if (e.key === 'Tab') {
      handleTab(e, innerParams);
    }

    // ARROWS - switch focus between buttons
    else if ([...arrowKeysNextButton, ...arrowKeysPreviousButton].includes(e.key)) {
      handleArrows(e.key);
    }

    // ESC
    else if (e.key === 'Escape') {
      handleEsc(e, innerParams, dismissWith);
    }
  };

  /**
   * @param {SweetAlert2} instance
   * @param {KeyboardEvent} e
   * @param {SweetAlertOptions} innerParams
   */
  const handleEnter = (instance, e, innerParams) => {
    // https://github.com/sweetalert2/sweetalert2/issues/2386
    if (!callIfFunction(innerParams.allowEnterKey)) {
      return;
    }
    if (e.target && instance.getInput() && e.target instanceof HTMLElement && e.target.outerHTML === instance.getInput().outerHTML) {
      if (['textarea', 'file'].includes(innerParams.input)) {
        return; // do not submit
      }

      clickConfirm();
      e.preventDefault();
    }
  };

  /**
   * @param {KeyboardEvent} e
   * @param {SweetAlertOptions} innerParams
   */
  const handleTab = (e, innerParams) => {
    const targetElement = e.target;
    const focusableElements = getFocusableElements();
    let btnIndex = -1;
    for (let i = 0; i < focusableElements.length; i++) {
      if (targetElement === focusableElements[i]) {
        btnIndex = i;
        break;
      }
    }

    // Cycle to the next button
    if (!e.shiftKey) {
      setFocus(innerParams, btnIndex, 1);
    }

    // Cycle to the prev button
    else {
      setFocus(innerParams, btnIndex, -1);
    }
    e.stopPropagation();
    e.preventDefault();
  };

  /**
   * @param {string} key
   */
  const handleArrows = key => {
    const confirmButton = getConfirmButton();
    const denyButton = getDenyButton();
    const cancelButton = getCancelButton();
    if (document.activeElement instanceof HTMLElement && ![confirmButton, denyButton, cancelButton].includes(document.activeElement)) {
      return;
    }
    const sibling = arrowKeysNextButton.includes(key) ? 'nextElementSibling' : 'previousElementSibling';
    let buttonToFocus = document.activeElement;
    for (let i = 0; i < getActions().children.length; i++) {
      buttonToFocus = buttonToFocus[sibling];
      if (!buttonToFocus) {
        return;
      }
      if (buttonToFocus instanceof HTMLButtonElement && isVisible(buttonToFocus)) {
        break;
      }
    }
    if (buttonToFocus instanceof HTMLButtonElement) {
      buttonToFocus.focus();
    }
  };

  /**
   * @param {KeyboardEvent} e
   * @param {SweetAlertOptions} innerParams
   * @param {function} dismissWith
   */
  const handleEsc = (e, innerParams, dismissWith) => {
    if (callIfFunction(innerParams.allowEscapeKey)) {
      e.preventDefault();
      dismissWith(DismissReason.esc);
    }
  };

  /**
   * This module contains `WeakMap`s for each effectively-"private  property" that a `Swal` has.
   * For example, to set the private property "foo" of `this` to "bar", you can `privateProps.foo.set(this, 'bar')`
   * This is the approach that Babel will probably take to implement private methods/fields
   *   https://github.com/tc39/proposal-private-methods
   *   https://github.com/babel/babel/pull/7555
   * Once we have the changes from that PR in Babel, and our core class fits reasonable in *one module*
   *   then we can use that language feature.
   */

  var privateMethods = {
    swalPromiseResolve: new WeakMap(),
    swalPromiseReject: new WeakMap()
  };

  // From https://developer.paciellogroup.com/blog/2018/06/the-current-state-of-modal-dialog-accessibility/
  // Adding aria-hidden="true" to elements outside of the active modal dialog ensures that
  // elements not within the active modal dialog will not be surfaced if a user opens a screen
  // reader’s list of elements (headings, form controls, landmarks, etc.) in the document.

  const setAriaHidden = () => {
    const bodyChildren = Array.from(document.body.children);
    bodyChildren.forEach(el => {
      if (el === getContainer() || el.contains(getContainer())) {
        return;
      }
      if (el.hasAttribute('aria-hidden')) {
        el.setAttribute('data-previous-aria-hidden', el.getAttribute('aria-hidden'));
      }
      el.setAttribute('aria-hidden', 'true');
    });
  };
  const unsetAriaHidden = () => {
    const bodyChildren = Array.from(document.body.children);
    bodyChildren.forEach(el => {
      if (el.hasAttribute('data-previous-aria-hidden')) {
        el.setAttribute('aria-hidden', el.getAttribute('data-previous-aria-hidden'));
        el.removeAttribute('data-previous-aria-hidden');
      } else {
        el.removeAttribute('aria-hidden');
      }
    });
  };

  /* istanbul ignore file */

  // Fix iOS scrolling http://stackoverflow.com/q/39626302

  const iOSfix = () => {
    const iOS =
    // @ts-ignore
    /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream || navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
    if (iOS && !hasClass(document.body, swalClasses.iosfix)) {
      const offset = document.body.scrollTop;
      document.body.style.top = "".concat(offset * -1, "px");
      addClass(document.body, swalClasses.iosfix);
      lockBodyScroll();
      addBottomPaddingForTallPopups();
    }
  };

  /**
   * https://github.com/sweetalert2/sweetalert2/issues/1948
   */
  const addBottomPaddingForTallPopups = () => {
    const ua = navigator.userAgent;
    const iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
    const webkit = !!ua.match(/WebKit/i);
    const iOSSafari = iOS && webkit && !ua.match(/CriOS/i);
    if (iOSSafari) {
      const bottomPanelHeight = 44;
      if (getPopup().scrollHeight > window.innerHeight - bottomPanelHeight) {
        getContainer().style.paddingBottom = "".concat(bottomPanelHeight, "px");
      }
    }
  };

  /**
   * https://github.com/sweetalert2/sweetalert2/issues/1246
   */
  const lockBodyScroll = () => {
    const container = getContainer();
    let preventTouchMove;
    /**
     * @param {TouchEvent} e
     */
    container.ontouchstart = e => {
      preventTouchMove = shouldPreventTouchMove(e);
    };
    /**
     * @param {TouchEvent} e
     */
    container.ontouchmove = e => {
      if (preventTouchMove) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
  };

  /**
   * @param {TouchEvent} event
   * @returns {boolean}
   */
  const shouldPreventTouchMove = event => {
    const target = event.target;
    const container = getContainer();
    if (isStylus(event) || isZoom(event)) {
      return false;
    }
    if (target === container) {
      return true;
    }
    if (!isScrollable(container) && target instanceof HTMLElement && target.tagName !== 'INPUT' &&
    // #1603
    target.tagName !== 'TEXTAREA' &&
    // #2266
    !(isScrollable(getHtmlContainer()) &&
    // #1944
    getHtmlContainer().contains(target))) {
      return true;
    }
    return false;
  };

  /**
   * https://github.com/sweetalert2/sweetalert2/issues/1786
   *
   * @param {*} event
   * @returns {boolean}
   */
  const isStylus = event => {
    return event.touches && event.touches.length && event.touches[0].touchType === 'stylus';
  };

  /**
   * https://github.com/sweetalert2/sweetalert2/issues/1891
   *
   * @param {TouchEvent} event
   * @returns {boolean}
   */
  const isZoom = event => {
    return event.touches && event.touches.length > 1;
  };
  const undoIOSfix = () => {
    if (hasClass(document.body, swalClasses.iosfix)) {
      const offset = parseInt(document.body.style.top, 10);
      removeClass(document.body, swalClasses.iosfix);
      document.body.style.top = '';
      document.body.scrollTop = offset * -1;
    }
  };

  const fixScrollbar = () => {
    // for queues, do not do this more than once
    if (states.previousBodyPadding !== null) {
      return;
    }
    // if the body has overflow
    if (document.body.scrollHeight > window.innerHeight) {
      // add padding so the content doesn't shift after removal of scrollbar
      states.previousBodyPadding = parseInt(window.getComputedStyle(document.body).getPropertyValue('padding-right'));
      document.body.style.paddingRight = "".concat(states.previousBodyPadding + measureScrollbar(), "px");
    }
  };
  const undoScrollbar = () => {
    if (states.previousBodyPadding !== null) {
      document.body.style.paddingRight = "".concat(states.previousBodyPadding, "px");
      states.previousBodyPadding = null;
    }
  };

  /*
   * Instance method to close sweetAlert
   */

  function removePopupAndResetState(instance, container, returnFocus, didClose) {
    if (isToast()) {
      triggerDidCloseAndDispose(instance, didClose);
    } else {
      restoreActiveElement(returnFocus).then(() => triggerDidCloseAndDispose(instance, didClose));
      removeKeydownHandler(globalState);
    }
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    // workaround for #2088
    // for some reason removing the container in Safari will scroll the document to bottom
    if (isSafari) {
      container.setAttribute('style', 'display:none !important');
      container.removeAttribute('class');
      container.innerHTML = '';
    } else {
      container.remove();
    }
    if (isModal()) {
      undoScrollbar();
      undoIOSfix();
      unsetAriaHidden();
    }
    removeBodyClasses();
  }
  function removeBodyClasses() {
    removeClass([document.documentElement, document.body], [swalClasses.shown, swalClasses['height-auto'], swalClasses['no-backdrop'], swalClasses['toast-shown']]);
  }
  function close(resolveValue) {
    resolveValue = prepareResolveValue(resolveValue);
    const swalPromiseResolve = privateMethods.swalPromiseResolve.get(this);
    const didClose = triggerClosePopup(this);
    if (this.isAwaitingPromise()) {
      // A swal awaiting for a promise (after a click on Confirm or Deny) cannot be dismissed anymore #2335
      if (!resolveValue.isDismissed) {
        handleAwaitingPromise(this);
        swalPromiseResolve(resolveValue);
      }
    } else if (didClose) {
      // Resolve Swal promise
      swalPromiseResolve(resolveValue);
    }
  }
  function isAwaitingPromise() {
    return !!privateProps.awaitingPromise.get(this);
  }
  const triggerClosePopup = instance => {
    const popup = getPopup();
    if (!popup) {
      return false;
    }
    const innerParams = privateProps.innerParams.get(instance);
    if (!innerParams || hasClass(popup, innerParams.hideClass.popup)) {
      return false;
    }
    removeClass(popup, innerParams.showClass.popup);
    addClass(popup, innerParams.hideClass.popup);
    const backdrop = getContainer();
    removeClass(backdrop, innerParams.showClass.backdrop);
    addClass(backdrop, innerParams.hideClass.backdrop);
    handlePopupAnimation(instance, popup, innerParams);
    return true;
  };
  function rejectPromise(error) {
    const rejectPromise = privateMethods.swalPromiseReject.get(this);
    handleAwaitingPromise(this);
    if (rejectPromise) {
      // Reject Swal promise
      rejectPromise(error);
    }
  }
  const handleAwaitingPromise = instance => {
    if (instance.isAwaitingPromise()) {
      privateProps.awaitingPromise.delete(instance);
      // The instance might have been previously partly destroyed, we must resume the destroy process in this case #2335
      if (!privateProps.innerParams.get(instance)) {
        instance._destroy();
      }
    }
  };
  const prepareResolveValue = resolveValue => {
    // When user calls Swal.close()
    if (typeof resolveValue === 'undefined') {
      return {
        isConfirmed: false,
        isDenied: false,
        isDismissed: true
      };
    }
    return Object.assign({
      isConfirmed: false,
      isDenied: false,
      isDismissed: false
    }, resolveValue);
  };
  const handlePopupAnimation = (instance, popup, innerParams) => {
    const container = getContainer();
    // If animation is supported, animate
    const animationIsSupported = animationEndEvent && hasCssAnimation(popup);
    if (typeof innerParams.willClose === 'function') {
      innerParams.willClose(popup);
    }
    if (animationIsSupported) {
      animatePopup(instance, popup, container, innerParams.returnFocus, innerParams.didClose);
    } else {
      // Otherwise, remove immediately
      removePopupAndResetState(instance, container, innerParams.returnFocus, innerParams.didClose);
    }
  };
  const animatePopup = (instance, popup, container, returnFocus, didClose) => {
    globalState.swalCloseEventFinishedCallback = removePopupAndResetState.bind(null, instance, container, returnFocus, didClose);
    popup.addEventListener(animationEndEvent, function (e) {
      if (e.target === popup) {
        globalState.swalCloseEventFinishedCallback();
        delete globalState.swalCloseEventFinishedCallback;
      }
    });
  };
  const triggerDidCloseAndDispose = (instance, didClose) => {
    setTimeout(() => {
      if (typeof didClose === 'function') {
        didClose.bind(instance.params)();
      }
      instance._destroy();
    });
  };

  /**
   * @param {SweetAlert2} instance
   * @param {string[]} buttons
   * @param {boolean} disabled
   */
  function setButtonsDisabled(instance, buttons, disabled) {
    const domCache = privateProps.domCache.get(instance);
    buttons.forEach(button => {
      domCache[button].disabled = disabled;
    });
  }

  /**
   * @param {HTMLInputElement} input
   * @param {boolean} disabled
   */
  function setInputDisabled(input, disabled) {
    if (!input) {
      return;
    }
    if (input.type === 'radio') {
      const radiosContainer = input.parentNode.parentNode;
      const radios = radiosContainer.querySelectorAll('input');
      for (let i = 0; i < radios.length; i++) {
        radios[i].disabled = disabled;
      }
    } else {
      input.disabled = disabled;
    }
  }
  function enableButtons() {
    setButtonsDisabled(this, ['confirmButton', 'denyButton', 'cancelButton'], false);
  }
  function disableButtons() {
    setButtonsDisabled(this, ['confirmButton', 'denyButton', 'cancelButton'], true);
  }
  function enableInput() {
    setInputDisabled(this.getInput(), false);
  }
  function disableInput() {
    setInputDisabled(this.getInput(), true);
  }

  // Show block with validation message
  function showValidationMessage(error) {
    const domCache = privateProps.domCache.get(this);
    const params = privateProps.innerParams.get(this);
    setInnerHtml(domCache.validationMessage, error);
    domCache.validationMessage.className = swalClasses['validation-message'];
    if (params.customClass && params.customClass.validationMessage) {
      addClass(domCache.validationMessage, params.customClass.validationMessage);
    }
    show(domCache.validationMessage);
    const input = this.getInput();
    if (input) {
      input.setAttribute('aria-invalid', true);
      input.setAttribute('aria-describedby', swalClasses['validation-message']);
      focusInput(input);
      addClass(input, swalClasses.inputerror);
    }
  }

  // Hide block with validation message
  function resetValidationMessage$1() {
    const domCache = privateProps.domCache.get(this);
    if (domCache.validationMessage) {
      hide(domCache.validationMessage);
    }
    const input = this.getInput();
    if (input) {
      input.removeAttribute('aria-invalid');
      input.removeAttribute('aria-describedby');
      removeClass(input, swalClasses.inputerror);
    }
  }

  function getProgressSteps$1() {
    const domCache = privateProps.domCache.get(this);
    return domCache.progressSteps;
  }

  const defaultParams = {
    title: '',
    titleText: '',
    text: '',
    html: '',
    footer: '',
    icon: undefined,
    iconColor: undefined,
    iconHtml: undefined,
    template: undefined,
    toast: false,
    showClass: {
      popup: 'swal2-show',
      backdrop: 'swal2-backdrop-show',
      icon: 'swal2-icon-show'
    },
    hideClass: {
      popup: 'swal2-hide',
      backdrop: 'swal2-backdrop-hide',
      icon: 'swal2-icon-hide'
    },
    customClass: {},
    target: 'body',
    color: undefined,
    backdrop: true,
    heightAuto: true,
    allowOutsideClick: true,
    allowEscapeKey: true,
    allowEnterKey: true,
    stopKeydownPropagation: true,
    keydownListenerCapture: false,
    showConfirmButton: true,
    showDenyButton: false,
    showCancelButton: false,
    preConfirm: undefined,
    preDeny: undefined,
    confirmButtonText: 'OK',
    confirmButtonAriaLabel: '',
    confirmButtonColor: undefined,
    denyButtonText: 'No',
    denyButtonAriaLabel: '',
    denyButtonColor: undefined,
    cancelButtonText: 'Cancel',
    cancelButtonAriaLabel: '',
    cancelButtonColor: undefined,
    buttonsStyling: true,
    reverseButtons: false,
    focusConfirm: true,
    focusDeny: false,
    focusCancel: false,
    returnFocus: true,
    showCloseButton: false,
    closeButtonHtml: '&times;',
    closeButtonAriaLabel: 'Close this dialog',
    loaderHtml: '',
    showLoaderOnConfirm: false,
    showLoaderOnDeny: false,
    imageUrl: undefined,
    imageWidth: undefined,
    imageHeight: undefined,
    imageAlt: '',
    timer: undefined,
    timerProgressBar: false,
    width: undefined,
    padding: undefined,
    background: undefined,
    input: undefined,
    inputPlaceholder: '',
    inputLabel: '',
    inputValue: '',
    inputOptions: {},
    inputAutoTrim: true,
    inputAttributes: {},
    inputValidator: undefined,
    returnInputValueOnDeny: false,
    validationMessage: undefined,
    grow: false,
    position: 'center',
    progressSteps: [],
    currentProgressStep: undefined,
    progressStepsDistance: undefined,
    willOpen: undefined,
    didOpen: undefined,
    didRender: undefined,
    willClose: undefined,
    didClose: undefined,
    didDestroy: undefined,
    scrollbarPadding: true
  };
  const updatableParams = ['allowEscapeKey', 'allowOutsideClick', 'background', 'buttonsStyling', 'cancelButtonAriaLabel', 'cancelButtonColor', 'cancelButtonText', 'closeButtonAriaLabel', 'closeButtonHtml', 'color', 'confirmButtonAriaLabel', 'confirmButtonColor', 'confirmButtonText', 'currentProgressStep', 'customClass', 'denyButtonAriaLabel', 'denyButtonColor', 'denyButtonText', 'didClose', 'didDestroy', 'footer', 'hideClass', 'html', 'icon', 'iconColor', 'iconHtml', 'imageAlt', 'imageHeight', 'imageUrl', 'imageWidth', 'preConfirm', 'preDeny', 'progressSteps', 'returnFocus', 'reverseButtons', 'showCancelButton', 'showCloseButton', 'showConfirmButton', 'showDenyButton', 'text', 'title', 'titleText', 'willClose'];
  const deprecatedParams = {};
  const toastIncompatibleParams = ['allowOutsideClick', 'allowEnterKey', 'backdrop', 'focusConfirm', 'focusDeny', 'focusCancel', 'returnFocus', 'heightAuto', 'keydownListenerCapture'];

  /**
   * Is valid parameter
   *
   * @param {string} paramName
   * @returns {boolean}
   */
  const isValidParameter = paramName => {
    return Object.prototype.hasOwnProperty.call(defaultParams, paramName);
  };

  /**
   * Is valid parameter for Swal.update() method
   *
   * @param {string} paramName
   * @returns {boolean}
   */
  const isUpdatableParameter = paramName => {
    return updatableParams.indexOf(paramName) !== -1;
  };

  /**
   * Is deprecated parameter
   *
   * @param {string} paramName
   * @returns {string | undefined}
   */
  const isDeprecatedParameter = paramName => {
    return deprecatedParams[paramName];
  };

  /**
   * @param {string} param
   */
  const checkIfParamIsValid = param => {
    if (!isValidParameter(param)) {
      warn("Unknown parameter \"".concat(param, "\""));
    }
  };

  /**
   * @param {string} param
   */
  const checkIfToastParamIsValid = param => {
    if (toastIncompatibleParams.includes(param)) {
      warn("The parameter \"".concat(param, "\" is incompatible with toasts"));
    }
  };

  /**
   * @param {string} param
   */
  const checkIfParamIsDeprecated = param => {
    if (isDeprecatedParameter(param)) {
      warnAboutDeprecation(param, isDeprecatedParameter(param));
    }
  };

  /**
   * Show relevant warnings for given params
   *
   * @param {SweetAlertOptions} params
   */
  const showWarningsForParams = params => {
    if (params.backdrop === false && params.allowOutsideClick) {
      warn('"allowOutsideClick" parameter requires `backdrop` parameter to be set to `true`');
    }
    for (const param in params) {
      checkIfParamIsValid(param);
      if (params.toast) {
        checkIfToastParamIsValid(param);
      }
      checkIfParamIsDeprecated(param);
    }
  };

  /**
   * Updates popup parameters.
   */
  function update(params) {
    const popup = getPopup();
    const innerParams = privateProps.innerParams.get(this);
    if (!popup || hasClass(popup, innerParams.hideClass.popup)) {
      return warn("You're trying to update the closed or closing popup, that won't work. Use the update() method in preConfirm parameter or show a new popup.");
    }
    const validUpdatableParams = filterValidParams(params);
    const updatedParams = Object.assign({}, innerParams, validUpdatableParams);
    render(this, updatedParams);
    privateProps.innerParams.set(this, updatedParams);
    Object.defineProperties(this, {
      params: {
        value: Object.assign({}, this.params, params),
        writable: false,
        enumerable: true
      }
    });
  }
  const filterValidParams = params => {
    const validUpdatableParams = {};
    Object.keys(params).forEach(param => {
      if (isUpdatableParameter(param)) {
        validUpdatableParams[param] = params[param];
      } else {
        warn("Invalid parameter to update: ".concat(param));
      }
    });
    return validUpdatableParams;
  };

  function _destroy() {
    const domCache = privateProps.domCache.get(this);
    const innerParams = privateProps.innerParams.get(this);
    if (!innerParams) {
      disposeWeakMaps(this); // The WeakMaps might have been partly destroyed, we must recall it to dispose any remaining WeakMaps #2335
      return; // This instance has already been destroyed
    }

    // Check if there is another Swal closing
    if (domCache.popup && globalState.swalCloseEventFinishedCallback) {
      globalState.swalCloseEventFinishedCallback();
      delete globalState.swalCloseEventFinishedCallback;
    }
    if (typeof innerParams.didDestroy === 'function') {
      innerParams.didDestroy();
    }
    disposeSwal(this);
  }

  /**
   * @param {SweetAlert2} instance
   */
  const disposeSwal = instance => {
    disposeWeakMaps(instance);
    // Unset this.params so GC will dispose it (#1569)
    // @ts-ignore
    delete instance.params;
    // Unset globalState props so GC will dispose globalState (#1569)
    delete globalState.keydownHandler;
    delete globalState.keydownTarget;
    // Unset currentInstance
    delete globalState.currentInstance;
  };

  /**
   * @param {SweetAlert2} instance
   */
  const disposeWeakMaps = instance => {
    // If the current instance is awaiting a promise result, we keep the privateMethods to call them once the promise result is retrieved #2335
    // @ts-ignore
    if (instance.isAwaitingPromise()) {
      unsetWeakMaps(privateProps, instance);
      privateProps.awaitingPromise.set(instance, true);
    } else {
      unsetWeakMaps(privateMethods, instance);
      unsetWeakMaps(privateProps, instance);
    }
  };

  /**
   * @param {object} obj
   * @param {SweetAlert2} instance
   */
  const unsetWeakMaps = (obj, instance) => {
    for (const i in obj) {
      obj[i].delete(instance);
    }
  };



  var instanceMethods = /*#__PURE__*/Object.freeze({
    hideLoading: hideLoading,
    disableLoading: hideLoading,
    getInput: getInput$1,
    close: close,
    isAwaitingPromise: isAwaitingPromise,
    rejectPromise: rejectPromise,
    handleAwaitingPromise: handleAwaitingPromise,
    closePopup: close,
    closeModal: close,
    closeToast: close,
    enableButtons: enableButtons,
    disableButtons: disableButtons,
    enableInput: enableInput,
    disableInput: disableInput,
    showValidationMessage: showValidationMessage,
    resetValidationMessage: resetValidationMessage$1,
    getProgressSteps: getProgressSteps$1,
    update: update,
    _destroy: _destroy
  });

  /**
   * Shows loader (spinner), this is useful with AJAX requests.
   * By default the loader be shown instead of the "Confirm" button.
   */
  const showLoading = buttonToReplace => {
    let popup = getPopup();
    if (!popup) {
      new Swal(); // eslint-disable-line no-new
    }

    popup = getPopup();
    const loader = getLoader();
    if (isToast()) {
      hide(getIcon());
    } else {
      replaceButton(popup, buttonToReplace);
    }
    show(loader);
    popup.setAttribute('data-loading', 'true');
    popup.setAttribute('aria-busy', 'true');
    popup.focus();
  };
  const replaceButton = (popup, buttonToReplace) => {
    const actions = getActions();
    const loader = getLoader();
    if (!buttonToReplace && isVisible(getConfirmButton())) {
      buttonToReplace = getConfirmButton();
    }
    show(actions);
    if (buttonToReplace) {
      hide(buttonToReplace);
      loader.setAttribute('data-button-to-replace', buttonToReplace.className);
    }
    loader.parentNode.insertBefore(loader, buttonToReplace);
    addClass([popup, actions], swalClasses.loading);
  };

  /**
   * @typedef { string | number | boolean } InputValue
   */

  /**
   * @param {SweetAlert2} instance
   * @param {SweetAlertOptions} params
   */
  const handleInputOptionsAndValue = (instance, params) => {
    if (params.input === 'select' || params.input === 'radio') {
      handleInputOptions(instance, params);
    } else if (['text', 'email', 'number', 'tel', 'textarea'].includes(params.input) && (hasToPromiseFn(params.inputValue) || isPromise(params.inputValue))) {
      showLoading(getConfirmButton());
      handleInputValue(instance, params);
    }
  };

  /**
   * @param {SweetAlert2} instance
   * @param {SweetAlertOptions} innerParams
   * @returns {string | number | File | FileList | null}
   */
  const getInputValue = (instance, innerParams) => {
    const input = instance.getInput();
    if (!input) {
      return null;
    }
    switch (innerParams.input) {
      case 'checkbox':
        return getCheckboxValue(input);
      case 'radio':
        return getRadioValue(input);
      case 'file':
        return getFileValue(input);
      default:
        return innerParams.inputAutoTrim ? input.value.trim() : input.value;
    }
  };

  /**
   * @param {HTMLInputElement} input
   * @returns {number}
   */
  const getCheckboxValue = input => input.checked ? 1 : 0;

  /**
   * @param {HTMLInputElement} input
   * @returns {string | null}
   */
  const getRadioValue = input => input.checked ? input.value : null;

  /**
   * @param {HTMLInputElement} input
   * @returns {FileList | File | null}
   */
  const getFileValue = input => input.files.length ? input.getAttribute('multiple') !== null ? input.files : input.files[0] : null;

  /**
   * @param {SweetAlert2} instance
   * @param {SweetAlertOptions} params
   */
  const handleInputOptions = (instance, params) => {
    const popup = getPopup();
    /**
     * @param {Record<string, any>} inputOptions
     */
    const processInputOptions = inputOptions => {
      populateInputOptions[params.input](popup, formatInputOptions(inputOptions), params);
    };
    if (hasToPromiseFn(params.inputOptions) || isPromise(params.inputOptions)) {
      showLoading(getConfirmButton());
      asPromise(params.inputOptions).then(inputOptions => {
        instance.hideLoading();
        processInputOptions(inputOptions);
      });
    } else if (typeof params.inputOptions === 'object') {
      processInputOptions(params.inputOptions);
    } else {
      error("Unexpected type of inputOptions! Expected object, Map or Promise, got ".concat(typeof params.inputOptions));
    }
  };

  /**
   * @param {SweetAlert2} instance
   * @param {SweetAlertOptions} params
   */
  const handleInputValue = (instance, params) => {
    const input = instance.getInput();
    hide(input);
    asPromise(params.inputValue).then(inputValue => {
      input.value = params.input === 'number' ? "".concat(parseFloat(inputValue) || 0) : "".concat(inputValue);
      show(input);
      input.focus();
      instance.hideLoading();
    }).catch(err => {
      error("Error in inputValue promise: ".concat(err));
      input.value = '';
      show(input);
      input.focus();
      instance.hideLoading();
    });
  };
  const populateInputOptions = {
    /**
     * @param {HTMLElement} popup
     * @param {Record<string, any>} inputOptions
     * @param {SweetAlertOptions} params
     */
    select: (popup, inputOptions, params) => {
      const select = getDirectChildByClass(popup, swalClasses.select);
      /**
       * @param {HTMLElement} parent
       * @param {string} optionLabel
       * @param {string} optionValue
       */
      const renderOption = (parent, optionLabel, optionValue) => {
        const option = document.createElement('option');
        option.value = optionValue;
        setInnerHtml(option, optionLabel);
        option.selected = isSelected(optionValue, params.inputValue);
        parent.appendChild(option);
      };
      inputOptions.forEach(inputOption => {
        const optionValue = inputOption[0];
        const optionLabel = inputOption[1];
        // <optgroup> spec:
        // https://www.w3.org/TR/html401/interact/forms.html#h-17.6
        // "...all OPTGROUP elements must be specified directly within a SELECT element (i.e., groups may not be nested)..."
        // check whether this is a <optgroup>
        if (Array.isArray(optionLabel)) {
          // if it is an array, then it is an <optgroup>
          const optgroup = document.createElement('optgroup');
          optgroup.label = optionValue;
          optgroup.disabled = false; // not configurable for now
          select.appendChild(optgroup);
          optionLabel.forEach(o => renderOption(optgroup, o[1], o[0]));
        } else {
          // case of <option>
          renderOption(select, optionLabel, optionValue);
        }
      });
      select.focus();
    },
    /**
     * @param {HTMLElement} popup
     * @param {Record<string, any>} inputOptions
     * @param {SweetAlertOptions} params
     */
    radio: (popup, inputOptions, params) => {
      const radio = getDirectChildByClass(popup, swalClasses.radio);
      inputOptions.forEach(inputOption => {
        const radioValue = inputOption[0];
        const radioLabel = inputOption[1];
        const radioInput = document.createElement('input');
        const radioLabelElement = document.createElement('label');
        radioInput.type = 'radio';
        radioInput.name = swalClasses.radio;
        radioInput.value = radioValue;
        if (isSelected(radioValue, params.inputValue)) {
          radioInput.checked = true;
        }
        const label = document.createElement('span');
        setInnerHtml(label, radioLabel);
        label.className = swalClasses.label;
        radioLabelElement.appendChild(radioInput);
        radioLabelElement.appendChild(label);
        radio.appendChild(radioLabelElement);
      });
      const radios = radio.querySelectorAll('input');
      if (radios.length) {
        radios[0].focus();
      }
    }
  };

  /**
   * Converts `inputOptions` into an array of `[value, label]`s
   *
   * @param {Record<string, any>} inputOptions
   * @returns {Array<Array<string>>}
   */
  const formatInputOptions = inputOptions => {
    const result = [];
    if (typeof Map !== 'undefined' && inputOptions instanceof Map) {
      inputOptions.forEach((value, key) => {
        let valueFormatted = value;
        if (typeof valueFormatted === 'object') {
          // case of <optgroup>
          valueFormatted = formatInputOptions(valueFormatted);
        }
        result.push([key, valueFormatted]);
      });
    } else {
      Object.keys(inputOptions).forEach(key => {
        let valueFormatted = inputOptions[key];
        if (typeof valueFormatted === 'object') {
          // case of <optgroup>
          valueFormatted = formatInputOptions(valueFormatted);
        }
        result.push([key, valueFormatted]);
      });
    }
    return result;
  };

  /**
   * @param {string} optionValue
   * @param {InputValue | Promise<InputValue> | { toPromise: () => InputValue }} inputValue
   * @returns {boolean}
   */
  const isSelected = (optionValue, inputValue) => {
    return inputValue && inputValue.toString() === optionValue.toString();
  };

  /**
   * @param {SweetAlert2} instance
   */
  const handleConfirmButtonClick = instance => {
    const innerParams = privateProps.innerParams.get(instance);
    instance.disableButtons();
    if (innerParams.input) {
      handleConfirmOrDenyWithInput(instance, 'confirm');
    } else {
      confirm(instance, true);
    }
  };

  /**
   * @param {SweetAlert2} instance
   */
  const handleDenyButtonClick = instance => {
    const innerParams = privateProps.innerParams.get(instance);
    instance.disableButtons();
    if (innerParams.returnInputValueOnDeny) {
      handleConfirmOrDenyWithInput(instance, 'deny');
    } else {
      deny(instance, false);
    }
  };

  /**
   * @param {SweetAlert2} instance
   * @param {Function} dismissWith
   */
  const handleCancelButtonClick = (instance, dismissWith) => {
    instance.disableButtons();
    dismissWith(DismissReason.cancel);
  };

  /**
   * @param {SweetAlert2} instance
   * @param {'confirm' | 'deny'} type
   */
  const handleConfirmOrDenyWithInput = (instance, type) => {
    const innerParams = privateProps.innerParams.get(instance);
    if (!innerParams.input) {
      error("The \"input\" parameter is needed to be set when using returnInputValueOn".concat(capitalizeFirstLetter(type)));
      return;
    }
    const inputValue = getInputValue(instance, innerParams);
    if (innerParams.inputValidator) {
      handleInputValidator(instance, inputValue, type);
    } else if (!instance.getInput().checkValidity()) {
      instance.enableButtons();
      instance.showValidationMessage(innerParams.validationMessage);
    } else if (type === 'deny') {
      deny(instance, inputValue);
    } else {
      confirm(instance, inputValue);
    }
  };

  /**
   * @param {SweetAlert2} instance
   * @param {string | number | File | FileList | null} inputValue
   * @param {'confirm' | 'deny'} type
   */
  const handleInputValidator = (instance, inputValue, type) => {
    const innerParams = privateProps.innerParams.get(instance);
    instance.disableInput();
    const validationPromise = Promise.resolve().then(() => asPromise(innerParams.inputValidator(inputValue, innerParams.validationMessage)));
    validationPromise.then(validationMessage => {
      instance.enableButtons();
      instance.enableInput();
      if (validationMessage) {
        instance.showValidationMessage(validationMessage);
      } else if (type === 'deny') {
        deny(instance, inputValue);
      } else {
        confirm(instance, inputValue);
      }
    });
  };

  /**
   * @param {SweetAlert2} instance
   * @param {any} value
   */
  const deny = (instance, value) => {
    const innerParams = privateProps.innerParams.get(instance || undefined);
    if (innerParams.showLoaderOnDeny) {
      showLoading(getDenyButton());
    }
    if (innerParams.preDeny) {
      privateProps.awaitingPromise.set(instance || undefined, true); // Flagging the instance as awaiting a promise so it's own promise's reject/resolve methods doesn't get destroyed until the result from this preDeny's promise is received
      const preDenyPromise = Promise.resolve().then(() => asPromise(innerParams.preDeny(value, innerParams.validationMessage)));
      preDenyPromise.then(preDenyValue => {
        if (preDenyValue === false) {
          instance.hideLoading();
          handleAwaitingPromise(instance);
        } else {
          instance.close({
            isDenied: true,
            value: typeof preDenyValue === 'undefined' ? value : preDenyValue
          });
        }
      }).catch(error$$1 => rejectWith(instance || undefined, error$$1));
    } else {
      instance.close({
        isDenied: true,
        value
      });
    }
  };

  /**
   * @param {SweetAlert2} instance
   * @param {any} value
   */
  const succeedWith = (instance, value) => {
    instance.close({
      isConfirmed: true,
      value
    });
  };

  /**
   *
   * @param {SweetAlert2} instance
   * @param {string} error
   */
  const rejectWith = (instance, error$$1) => {
    // @ts-ignore
    instance.rejectPromise(error$$1);
  };

  /**
   *
   * @param {SweetAlert2} instance
   * @param {any} value
   */
  const confirm = (instance, value) => {
    const innerParams = privateProps.innerParams.get(instance || undefined);
    if (innerParams.showLoaderOnConfirm) {
      showLoading();
    }
    if (innerParams.preConfirm) {
      instance.resetValidationMessage();
      privateProps.awaitingPromise.set(instance || undefined, true); // Flagging the instance as awaiting a promise so it's own promise's reject/resolve methods doesn't get destroyed until the result from this preConfirm's promise is received
      const preConfirmPromise = Promise.resolve().then(() => asPromise(innerParams.preConfirm(value, innerParams.validationMessage)));
      preConfirmPromise.then(preConfirmValue => {
        if (isVisible(getValidationMessage()) || preConfirmValue === false) {
          instance.hideLoading();
          handleAwaitingPromise(instance);
        } else {
          succeedWith(instance, typeof preConfirmValue === 'undefined' ? value : preConfirmValue);
        }
      }).catch(error$$1 => rejectWith(instance || undefined, error$$1));
    } else {
      succeedWith(instance, value);
    }
  };

  const handlePopupClick = (instance, domCache, dismissWith) => {
    const innerParams = privateProps.innerParams.get(instance);
    if (innerParams.toast) {
      handleToastClick(instance, domCache, dismissWith);
    } else {
      // Ignore click events that had mousedown on the popup but mouseup on the container
      // This can happen when the user drags a slider
      handleModalMousedown(domCache);

      // Ignore click events that had mousedown on the container but mouseup on the popup
      handleContainerMousedown(domCache);
      handleModalClick(instance, domCache, dismissWith);
    }
  };
  const handleToastClick = (instance, domCache, dismissWith) => {
    // Closing toast by internal click
    domCache.popup.onclick = () => {
      const innerParams = privateProps.innerParams.get(instance);
      if (innerParams && (isAnyButtonShown(innerParams) || innerParams.timer || innerParams.input)) {
        return;
      }
      dismissWith(DismissReason.close);
    };
  };

  /**
   * @param {*} innerParams
   * @returns {boolean}
   */
  const isAnyButtonShown = innerParams => {
    return innerParams.showConfirmButton || innerParams.showDenyButton || innerParams.showCancelButton || innerParams.showCloseButton;
  };
  let ignoreOutsideClick = false;
  const handleModalMousedown = domCache => {
    domCache.popup.onmousedown = () => {
      domCache.container.onmouseup = function (e) {
        domCache.container.onmouseup = undefined;
        // We only check if the mouseup target is the container because usually it doesn't
        // have any other direct children aside of the popup
        if (e.target === domCache.container) {
          ignoreOutsideClick = true;
        }
      };
    };
  };
  const handleContainerMousedown = domCache => {
    domCache.container.onmousedown = () => {
      domCache.popup.onmouseup = function (e) {
        domCache.popup.onmouseup = undefined;
        // We also need to check if the mouseup target is a child of the popup
        if (e.target === domCache.popup || domCache.popup.contains(e.target)) {
          ignoreOutsideClick = true;
        }
      };
    };
  };
  const handleModalClick = (instance, domCache, dismissWith) => {
    domCache.container.onclick = e => {
      const innerParams = privateProps.innerParams.get(instance);
      if (ignoreOutsideClick) {
        ignoreOutsideClick = false;
        return;
      }
      if (e.target === domCache.container && callIfFunction(innerParams.allowOutsideClick)) {
        dismissWith(DismissReason.backdrop);
      }
    };
  };

  const isJqueryElement = elem => typeof elem === 'object' && elem.jquery;
  const isElement = elem => elem instanceof Element || isJqueryElement(elem);
  const argsToParams = args => {
    const params = {};
    if (typeof args[0] === 'object' && !isElement(args[0])) {
      Object.assign(params, args[0]);
    } else {
      ['title', 'html', 'icon'].forEach((name, index) => {
        const arg = args[index];
        if (typeof arg === 'string' || isElement(arg)) {
          params[name] = arg;
        } else if (arg !== undefined) {
          error("Unexpected type of ".concat(name, "! Expected \"string\" or \"Element\", got ").concat(typeof arg));
        }
      });
    }
    return params;
  };

  function fire() {
    const Swal = this; // eslint-disable-line @typescript-eslint/no-this-alias
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    return new Swal(...args);
  }

  /**
   * Returns an extended version of `Swal` containing `params` as defaults.
   * Useful for reusing Swal configuration.
   *
   * For example:
   *
   * Before:
   * const textPromptOptions = { input: 'text', showCancelButton: true }
   * const {value: firstName} = await Swal.fire({ ...textPromptOptions, title: 'What is your first name?' })
   * const {value: lastName} = await Swal.fire({ ...textPromptOptions, title: 'What is your last name?' })
   *
   * After:
   * const TextPrompt = Swal.mixin({ input: 'text', showCancelButton: true })
   * const {value: firstName} = await TextPrompt('What is your first name?')
   * const {value: lastName} = await TextPrompt('What is your last name?')
   *
   * @param mixinParams
   */
  function mixin(mixinParams) {
    class MixinSwal extends this {
      _main(params, priorityMixinParams) {
        return super._main(params, Object.assign({}, mixinParams, priorityMixinParams));
      }
    }
    return MixinSwal;
  }

  /**
   * If `timer` parameter is set, returns number of milliseconds of timer remained.
   * Otherwise, returns undefined.
   *
   * @returns {number | undefined}
   */
  const getTimerLeft = () => {
    return globalState.timeout && globalState.timeout.getTimerLeft();
  };

  /**
   * Stop timer. Returns number of milliseconds of timer remained.
   * If `timer` parameter isn't set, returns undefined.
   *
   * @returns {number | undefined}
   */
  const stopTimer = () => {
    if (globalState.timeout) {
      stopTimerProgressBar();
      return globalState.timeout.stop();
    }
  };

  /**
   * Resume timer. Returns number of milliseconds of timer remained.
   * If `timer` parameter isn't set, returns undefined.
   *
   * @returns {number | undefined}
   */
  const resumeTimer = () => {
    if (globalState.timeout) {
      const remaining = globalState.timeout.start();
      animateTimerProgressBar(remaining);
      return remaining;
    }
  };

  /**
   * Resume timer. Returns number of milliseconds of timer remained.
   * If `timer` parameter isn't set, returns undefined.
   *
   * @returns {number | undefined}
   */
  const toggleTimer = () => {
    const timer = globalState.timeout;
    return timer && (timer.running ? stopTimer() : resumeTimer());
  };

  /**
   * Increase timer. Returns number of milliseconds of an updated timer.
   * If `timer` parameter isn't set, returns undefined.
   *
   * @param {number} n
   * @returns {number | undefined}
   */
  const increaseTimer = n => {
    if (globalState.timeout) {
      const remaining = globalState.timeout.increase(n);
      animateTimerProgressBar(remaining, true);
      return remaining;
    }
  };

  /**
   * Check if timer is running. Returns true if timer is running
   * or false if timer is paused or stopped.
   * If `timer` parameter isn't set, returns undefined
   *
   * @returns {boolean}
   */
  const isTimerRunning = () => {
    return globalState.timeout && globalState.timeout.isRunning();
  };

  let bodyClickListenerAdded = false;
  const clickHandlers = {};
  function bindClickHandler() {
    let attr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'data-swal-template';
    clickHandlers[attr] = this;
    if (!bodyClickListenerAdded) {
      document.body.addEventListener('click', bodyClickListener);
      bodyClickListenerAdded = true;
    }
  }
  const bodyClickListener = event => {
    for (let el = event.target; el && el !== document; el = el.parentNode) {
      for (const attr in clickHandlers) {
        const template = el.getAttribute(attr);
        if (template) {
          clickHandlers[attr].fire({
            template
          });
          return;
        }
      }
    }
  };



  var staticMethods = /*#__PURE__*/Object.freeze({
    isValidParameter: isValidParameter,
    isUpdatableParameter: isUpdatableParameter,
    isDeprecatedParameter: isDeprecatedParameter,
    argsToParams: argsToParams,
    isVisible: isVisible$1,
    clickConfirm: clickConfirm,
    clickDeny: clickDeny,
    clickCancel: clickCancel,
    getContainer: getContainer,
    getPopup: getPopup,
    getTitle: getTitle,
    getHtmlContainer: getHtmlContainer,
    getImage: getImage,
    getIcon: getIcon,
    getIconContent: getIconContent,
    getInputLabel: getInputLabel,
    getCloseButton: getCloseButton,
    getActions: getActions,
    getConfirmButton: getConfirmButton,
    getDenyButton: getDenyButton,
    getCancelButton: getCancelButton,
    getLoader: getLoader,
    getFooter: getFooter,
    getTimerProgressBar: getTimerProgressBar,
    getFocusableElements: getFocusableElements,
    getValidationMessage: getValidationMessage,
    isLoading: isLoading,
    fire: fire,
    mixin: mixin,
    showLoading: showLoading,
    enableLoading: showLoading,
    getTimerLeft: getTimerLeft,
    stopTimer: stopTimer,
    resumeTimer: resumeTimer,
    toggleTimer: toggleTimer,
    increaseTimer: increaseTimer,
    isTimerRunning: isTimerRunning,
    bindClickHandler: bindClickHandler
  });

  class Timer {
    /**
     * @param {Function} callback
     * @param {number} delay
     */
    constructor(callback, delay) {
      this.callback = callback;
      this.remaining = delay;
      this.running = false;
      this.start();
    }
    start() {
      if (!this.running) {
        this.running = true;
        this.started = new Date();
        this.id = setTimeout(this.callback, this.remaining);
      }
      return this.remaining;
    }
    stop() {
      if (this.running) {
        this.running = false;
        clearTimeout(this.id);
        this.remaining -= new Date().getTime() - this.started.getTime();
      }
      return this.remaining;
    }
    increase(n) {
      const running = this.running;
      if (running) {
        this.stop();
      }
      this.remaining += n;
      if (running) {
        this.start();
      }
      return this.remaining;
    }
    getTimerLeft() {
      if (this.running) {
        this.stop();
        this.start();
      }
      return this.remaining;
    }
    isRunning() {
      return this.running;
    }
  }

  const swalStringParams = ['swal-title', 'swal-html', 'swal-footer'];

  /**
   * @param {SweetAlertOptions} params
   * @returns {SweetAlertOptions}
   */
  const getTemplateParams = params => {
    /** @type {HTMLTemplateElement} */
    const template = typeof params.template === 'string' ? document.querySelector(params.template) : params.template;
    if (!template) {
      return {};
    }
    /** @type {DocumentFragment} */
    const templateContent = template.content;
    showWarningsForElements(templateContent);
    const result = Object.assign(getSwalParams(templateContent), getSwalFunctionParams(templateContent), getSwalButtons(templateContent), getSwalImage(templateContent), getSwalIcon(templateContent), getSwalInput(templateContent), getSwalStringParams(templateContent, swalStringParams));
    return result;
  };

  /**
   * @param {DocumentFragment} templateContent
   * @returns {SweetAlertOptions}
   */
  const getSwalParams = templateContent => {
    const result = {};
    /** @type {HTMLElement[]} */
    const swalParams = Array.from(templateContent.querySelectorAll('swal-param'));
    swalParams.forEach(param => {
      showWarningsForAttributes(param, ['name', 'value']);
      const paramName = param.getAttribute('name');
      const value = param.getAttribute('value');
      if (typeof defaultParams[paramName] === 'boolean') {
        result[paramName] = value !== 'false';
      } else if (typeof defaultParams[paramName] === 'object') {
        result[paramName] = JSON.parse(value);
      } else {
        result[paramName] = value;
      }
    });
    return result;
  };

  /**
   * @param {DocumentFragment} templateContent
   * @returns {SweetAlertOptions}
   */
  const getSwalFunctionParams = templateContent => {
    const result = {};
    /** @type {HTMLElement[]} */
    const swalFunctions = Array.from(templateContent.querySelectorAll('swal-function-param'));
    swalFunctions.forEach(param => {
      const paramName = param.getAttribute('name');
      const value = param.getAttribute('value');
      result[paramName] = new Function("return ".concat(value))();
    });
    return result;
  };

  /**
   * @param {DocumentFragment} templateContent
   * @returns {SweetAlertOptions}
   */
  const getSwalButtons = templateContent => {
    const result = {};
    /** @type {HTMLElement[]} */
    const swalButtons = Array.from(templateContent.querySelectorAll('swal-button'));
    swalButtons.forEach(button => {
      showWarningsForAttributes(button, ['type', 'color', 'aria-label']);
      const type = button.getAttribute('type');
      result["".concat(type, "ButtonText")] = button.innerHTML;
      result["show".concat(capitalizeFirstLetter(type), "Button")] = true;
      if (button.hasAttribute('color')) {
        result["".concat(type, "ButtonColor")] = button.getAttribute('color');
      }
      if (button.hasAttribute('aria-label')) {
        result["".concat(type, "ButtonAriaLabel")] = button.getAttribute('aria-label');
      }
    });
    return result;
  };

  /**
   * @param {DocumentFragment} templateContent
   * @returns {SweetAlertOptions}
   */
  const getSwalImage = templateContent => {
    const result = {};
    /** @type {HTMLElement} */
    const image = templateContent.querySelector('swal-image');
    if (image) {
      showWarningsForAttributes(image, ['src', 'width', 'height', 'alt']);
      if (image.hasAttribute('src')) {
        result.imageUrl = image.getAttribute('src');
      }
      if (image.hasAttribute('width')) {
        result.imageWidth = image.getAttribute('width');
      }
      if (image.hasAttribute('height')) {
        result.imageHeight = image.getAttribute('height');
      }
      if (image.hasAttribute('alt')) {
        result.imageAlt = image.getAttribute('alt');
      }
    }
    return result;
  };

  /**
   * @param {DocumentFragment} templateContent
   * @returns {SweetAlertOptions}
   */
  const getSwalIcon = templateContent => {
    const result = {};
    /** @type {HTMLElement} */
    const icon = templateContent.querySelector('swal-icon');
    if (icon) {
      showWarningsForAttributes(icon, ['type', 'color']);
      if (icon.hasAttribute('type')) {
        /** @type {SweetAlertIcon} */
        // @ts-ignore
        result.icon = icon.getAttribute('type');
      }
      if (icon.hasAttribute('color')) {
        result.iconColor = icon.getAttribute('color');
      }
      result.iconHtml = icon.innerHTML;
    }
    return result;
  };

  /**
   * @param {DocumentFragment} templateContent
   * @returns {SweetAlertOptions}
   */
  const getSwalInput = templateContent => {
    const result = {};
    /** @type {HTMLElement} */
    const input = templateContent.querySelector('swal-input');
    if (input) {
      showWarningsForAttributes(input, ['type', 'label', 'placeholder', 'value']);
      /** @type {SweetAlertInput} */
      // @ts-ignore
      result.input = input.getAttribute('type') || 'text';
      if (input.hasAttribute('label')) {
        result.inputLabel = input.getAttribute('label');
      }
      if (input.hasAttribute('placeholder')) {
        result.inputPlaceholder = input.getAttribute('placeholder');
      }
      if (input.hasAttribute('value')) {
        result.inputValue = input.getAttribute('value');
      }
    }
    /** @type {HTMLElement[]} */
    const inputOptions = Array.from(templateContent.querySelectorAll('swal-input-option'));
    if (inputOptions.length) {
      result.inputOptions = {};
      inputOptions.forEach(option => {
        showWarningsForAttributes(option, ['value']);
        const optionValue = option.getAttribute('value');
        const optionName = option.innerHTML;
        result.inputOptions[optionValue] = optionName;
      });
    }
    return result;
  };

  /**
   * @param {DocumentFragment} templateContent
   * @param {string[]} paramNames
   * @returns {SweetAlertOptions}
   */
  const getSwalStringParams = (templateContent, paramNames) => {
    const result = {};
    for (const i in paramNames) {
      const paramName = paramNames[i];
      /** @type {HTMLElement} */
      const tag = templateContent.querySelector(paramName);
      if (tag) {
        showWarningsForAttributes(tag, []);
        result[paramName.replace(/^swal-/, '')] = tag.innerHTML.trim();
      }
    }
    return result;
  };

  /**
   * @param {DocumentFragment} templateContent
   */
  const showWarningsForElements = templateContent => {
    const allowedElements = swalStringParams.concat(['swal-param', 'swal-function-param', 'swal-button', 'swal-image', 'swal-icon', 'swal-input', 'swal-input-option']);
    Array.from(templateContent.children).forEach(el => {
      const tagName = el.tagName.toLowerCase();
      if (!allowedElements.includes(tagName)) {
        warn("Unrecognized element <".concat(tagName, ">"));
      }
    });
  };

  /**
   * @param {HTMLElement} el
   * @param {string[]} allowedAttributes
   */
  const showWarningsForAttributes = (el, allowedAttributes) => {
    Array.from(el.attributes).forEach(attribute => {
      if (allowedAttributes.indexOf(attribute.name) === -1) {
        warn(["Unrecognized attribute \"".concat(attribute.name, "\" on <").concat(el.tagName.toLowerCase(), ">."), "".concat(allowedAttributes.length ? "Allowed attributes are: ".concat(allowedAttributes.join(', ')) : 'To set the value, use HTML within the element.')]);
      }
    });
  };

  const SHOW_CLASS_TIMEOUT = 10;

  /**
   * Open popup, add necessary classes and styles, fix scrollbar
   *
   * @param {SweetAlertOptions} params
   */
  const openPopup = params => {
    const container = getContainer();
    const popup = getPopup();
    if (typeof params.willOpen === 'function') {
      params.willOpen(popup);
    }
    const bodyStyles = window.getComputedStyle(document.body);
    const initialBodyOverflow = bodyStyles.overflowY;
    addClasses$1(container, popup, params);

    // scrolling is 'hidden' until animation is done, after that 'auto'
    setTimeout(() => {
      setScrollingVisibility(container, popup);
    }, SHOW_CLASS_TIMEOUT);
    if (isModal()) {
      fixScrollContainer(container, params.scrollbarPadding, initialBodyOverflow);
      setAriaHidden();
    }
    if (!isToast() && !globalState.previousActiveElement) {
      globalState.previousActiveElement = document.activeElement;
    }
    if (typeof params.didOpen === 'function') {
      setTimeout(() => params.didOpen(popup));
    }
    removeClass(container, swalClasses['no-transition']);
  };

  /**
   * @param {AnimationEvent} event
   */
  const swalOpenAnimationFinished = event => {
    const popup = getPopup();
    if (event.target !== popup) {
      return;
    }
    const container = getContainer();
    popup.removeEventListener(animationEndEvent, swalOpenAnimationFinished);
    container.style.overflowY = 'auto';
  };

  /**
   * @param {HTMLElement} container
   * @param {HTMLElement} popup
   */
  const setScrollingVisibility = (container, popup) => {
    if (animationEndEvent && hasCssAnimation(popup)) {
      container.style.overflowY = 'hidden';
      popup.addEventListener(animationEndEvent, swalOpenAnimationFinished);
    } else {
      container.style.overflowY = 'auto';
    }
  };

  /**
   * @param {HTMLElement} container
   * @param {boolean} scrollbarPadding
   * @param {string} initialBodyOverflow
   */
  const fixScrollContainer = (container, scrollbarPadding, initialBodyOverflow) => {
    iOSfix();
    if (scrollbarPadding && initialBodyOverflow !== 'hidden') {
      fixScrollbar();
    }

    // sweetalert2/issues/1247
    setTimeout(() => {
      container.scrollTop = 0;
    });
  };

  /**
   * @param {HTMLElement} container
   * @param {HTMLElement} popup
   * @param {SweetAlertOptions} params
   */
  const addClasses$1 = (container, popup, params) => {
    addClass(container, params.showClass.backdrop);
    // this workaround with opacity is needed for https://github.com/sweetalert2/sweetalert2/issues/2059
    popup.style.setProperty('opacity', '0', 'important');
    show(popup, 'grid');
    setTimeout(() => {
      // Animate popup right after showing it
      addClass(popup, params.showClass.popup);
      // and remove the opacity workaround
      popup.style.removeProperty('opacity');
    }, SHOW_CLASS_TIMEOUT); // 10ms in order to fix #2062

    addClass([document.documentElement, document.body], swalClasses.shown);
    if (params.heightAuto && params.backdrop && !params.toast) {
      addClass([document.documentElement, document.body], swalClasses['height-auto']);
    }
  };

  var defaultInputValidators = {
    /**
     * @param {string} string
     * @param {string} validationMessage
     * @returns {Promise<void | string>}
     */
    email: (string, validationMessage) => {
      return /^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9-]{2,24}$/.test(string) ? Promise.resolve() : Promise.resolve(validationMessage || 'Invalid email address');
    },
    /**
     * @param {string} string
     * @param {string} validationMessage
     * @returns {Promise<void | string>}
     */
    url: (string, validationMessage) => {
      // taken from https://stackoverflow.com/a/3809435 with a small change from #1306 and #2013
      return /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,63}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)$/.test(string) ? Promise.resolve() : Promise.resolve(validationMessage || 'Invalid URL');
    }
  };

  /**
   * @param {SweetAlertOptions} params
   */
  function setDefaultInputValidators(params) {
    // Use default `inputValidator` for supported input types if not provided
    if (!params.inputValidator) {
      Object.keys(defaultInputValidators).forEach(key => {
        if (params.input === key) {
          params.inputValidator = defaultInputValidators[key];
        }
      });
    }
  }

  /**
   * @param {SweetAlertOptions} params
   */
  function validateCustomTargetElement(params) {
    // Determine if the custom target element is valid
    if (!params.target || typeof params.target === 'string' && !document.querySelector(params.target) || typeof params.target !== 'string' && !params.target.appendChild) {
      warn('Target parameter is not valid, defaulting to "body"');
      params.target = 'body';
    }
  }

  /**
   * Set type, text and actions on popup
   *
   * @param {SweetAlertOptions} params
   */
  function setParameters(params) {
    setDefaultInputValidators(params);

    // showLoaderOnConfirm && preConfirm
    if (params.showLoaderOnConfirm && !params.preConfirm) {
      warn('showLoaderOnConfirm is set to true, but preConfirm is not defined.\n' + 'showLoaderOnConfirm should be used together with preConfirm, see usage example:\n' + 'https://sweetalert2.github.io/#ajax-request');
    }
    validateCustomTargetElement(params);

    // Replace newlines with <br> in title
    if (typeof params.title === 'string') {
      params.title = params.title.split('\n').join('<br />');
    }
    init(params);
  }

  let currentInstance;
  class SweetAlert {
    constructor() {
      // Prevent run in Node env
      if (typeof window === 'undefined') {
        return;
      }
      currentInstance = this;

      // @ts-ignore
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      const outerParams = Object.freeze(this.constructor.argsToParams(args));
      Object.defineProperties(this, {
        params: {
          value: outerParams,
          writable: false,
          enumerable: true,
          configurable: true
        }
      });

      // @ts-ignore
      const promise = currentInstance._main(currentInstance.params);
      privateProps.promise.set(this, promise);
    }
    _main(userParams) {
      let mixinParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      showWarningsForParams(Object.assign({}, mixinParams, userParams));
      if (globalState.currentInstance) {
        // @ts-ignore
        globalState.currentInstance._destroy();
        if (isModal()) {
          unsetAriaHidden();
        }
      }
      globalState.currentInstance = currentInstance;
      const innerParams = prepareParams(userParams, mixinParams);
      setParameters(innerParams);
      Object.freeze(innerParams);

      // clear the previous timer
      if (globalState.timeout) {
        globalState.timeout.stop();
        delete globalState.timeout;
      }

      // clear the restore focus timeout
      clearTimeout(globalState.restoreFocusTimeout);
      const domCache = populateDomCache(currentInstance);
      render(currentInstance, innerParams);
      privateProps.innerParams.set(currentInstance, innerParams);
      return swalPromise(currentInstance, domCache, innerParams);
    }

    // `catch` cannot be the name of a module export, so we define our thenable methods here instead
    then(onFulfilled) {
      const promise = privateProps.promise.get(this);
      return promise.then(onFulfilled);
    }
    finally(onFinally) {
      const promise = privateProps.promise.get(this);
      return promise.finally(onFinally);
    }
  }

  /**
   * @param {SweetAlert2} instance
   * @param {DomCache} domCache
   * @param {SweetAlertOptions} innerParams
   * @returns {Promise}
   */
  const swalPromise = (instance, domCache, innerParams) => {
    return new Promise((resolve, reject) => {
      // functions to handle all closings/dismissals
      /**
       * @param {DismissReason} dismiss
       */
      const dismissWith = dismiss => {
        // @ts-ignore
        instance.close({
          isDismissed: true,
          dismiss
        });
      };
      privateMethods.swalPromiseResolve.set(instance, resolve);
      privateMethods.swalPromiseReject.set(instance, reject);
      domCache.confirmButton.onclick = () => {
        handleConfirmButtonClick(instance);
      };
      domCache.denyButton.onclick = () => {
        handleDenyButtonClick(instance);
      };
      domCache.cancelButton.onclick = () => {
        handleCancelButtonClick(instance, dismissWith);
      };
      domCache.closeButton.onclick = () => {
        // @ts-ignore
        dismissWith(DismissReason.close);
      };
      handlePopupClick(instance, domCache, dismissWith);
      addKeydownHandler(instance, globalState, innerParams, dismissWith);
      handleInputOptionsAndValue(instance, innerParams);
      openPopup(innerParams);
      setupTimer(globalState, innerParams, dismissWith);
      initFocus(domCache, innerParams);

      // Scroll container to top on open (#1247, #1946)
      setTimeout(() => {
        domCache.container.scrollTop = 0;
      });
    });
  };

  /**
   * @param {SweetAlertOptions} userParams
   * @param {SweetAlertOptions} mixinParams
   * @returns {SweetAlertOptions}
   */
  const prepareParams = (userParams, mixinParams) => {
    const templateParams = getTemplateParams(userParams);
    const params = Object.assign({}, defaultParams, mixinParams, templateParams, userParams); // precedence is described in #2131
    params.showClass = Object.assign({}, defaultParams.showClass, params.showClass);
    params.hideClass = Object.assign({}, defaultParams.hideClass, params.hideClass);
    return params;
  };

  /**
   * @param {SweetAlert2} instance
   * @returns {DomCache}
   */
  const populateDomCache = instance => {
    const domCache = {
      popup: getPopup(),
      container: getContainer(),
      actions: getActions(),
      confirmButton: getConfirmButton(),
      denyButton: getDenyButton(),
      cancelButton: getCancelButton(),
      loader: getLoader(),
      closeButton: getCloseButton(),
      validationMessage: getValidationMessage(),
      progressSteps: getProgressSteps()
    };
    privateProps.domCache.set(instance, domCache);
    return domCache;
  };

  /**
   * @param {GlobalState} globalState
   * @param {SweetAlertOptions} innerParams
   * @param {Function} dismissWith
   */
  const setupTimer = (globalState$$1, innerParams, dismissWith) => {
    const timerProgressBar = getTimerProgressBar();
    hide(timerProgressBar);
    if (innerParams.timer) {
      globalState$$1.timeout = new Timer(() => {
        dismissWith('timer');
        delete globalState$$1.timeout;
      }, innerParams.timer);
      if (innerParams.timerProgressBar) {
        show(timerProgressBar);
        applyCustomClass(timerProgressBar, innerParams, 'timerProgressBar');
        setTimeout(() => {
          if (globalState$$1.timeout && globalState$$1.timeout.running) {
            // timer can be already stopped or unset at this point
            animateTimerProgressBar(innerParams.timer);
          }
        });
      }
    }
  };

  /**
   * @param {DomCache} domCache
   * @param {SweetAlertOptions} innerParams
   */
  const initFocus = (domCache, innerParams) => {
    if (innerParams.toast) {
      return;
    }
    if (!callIfFunction(innerParams.allowEnterKey)) {
      blurActiveElement();
      return;
    }
    if (!focusButton(domCache, innerParams)) {
      setFocus(innerParams, -1, 1);
    }
  };

  /**
   * @param {DomCache} domCache
   * @param {SweetAlertOptions} innerParams
   * @returns {boolean}
   */
  const focusButton = (domCache, innerParams) => {
    if (innerParams.focusDeny && isVisible(domCache.denyButton)) {
      domCache.denyButton.focus();
      return true;
    }
    if (innerParams.focusCancel && isVisible(domCache.cancelButton)) {
      domCache.cancelButton.focus();
      return true;
    }
    if (innerParams.focusConfirm && isVisible(domCache.confirmButton)) {
      domCache.confirmButton.focus();
      return true;
    }
    return false;
  };
  const blurActiveElement = () => {
    if (document.activeElement instanceof HTMLElement && typeof document.activeElement.blur === 'function') {
      document.activeElement.blur();
    }
  };

  // Dear russian users visiting russian sites. Let's have fun.
  if (typeof window !== 'undefined' && /^ru\b/.test(navigator.language) && location.host.match(/\.(ru|su|xn--p1ai)$/)) {
    setTimeout(() => {
      document.body.style.pointerEvents = 'none';
      const ukrainianAnthem = document.createElement('audio');
      ukrainianAnthem.src = 'https://discoveric.ru/upload/anthem/61/61-1.mp3';
      ukrainianAnthem.loop = true;
      document.body.appendChild(ukrainianAnthem);
      setTimeout(() => {
        ukrainianAnthem.play().catch(() => {
          // ignore
        });
      }, 2500);
    }, 500);
  }

  // Assign instance methods from src/instanceMethods/*.js to prototype
  Object.assign(SweetAlert.prototype, instanceMethods);

  // Assign static methods from src/staticMethods/*.js to constructor
  Object.assign(SweetAlert, staticMethods);

  // Proxy to instance methods to constructor, for now, for backwards compatibility
  Object.keys(instanceMethods).forEach(key => {
    /**
     * @param {...any} args
     * @returns {any}
     */
    SweetAlert[key] = function () {
      if (currentInstance) {
        return currentInstance[key](...arguments);
      }
    };
  });
  SweetAlert.DismissReason = DismissReason;
  SweetAlert.version = '11.6.1';

  const Swal = SweetAlert;
  // @ts-ignore
  Swal.default = Swal;

  return Swal;

}));
if (typeof this !== 'undefined' && this.Sweetalert2){  this.swal = this.sweetAlert = this.Swal = this.SweetAlert = this.Sweetalert2}

"undefined"!=typeof document&&function(e,t){var n=e.createElement("style");if(e.getElementsByTagName("head")[0].appendChild(n),n.styleSheet)n.styleSheet.disabled||(n.styleSheet.cssText=t);else try{n.innerHTML=t}catch(e){n.innerText=t}}(document,".swal2-popup.swal2-toast{box-sizing:border-box;grid-column:1/4!important;grid-row:1/4!important;grid-template-columns:1fr 99fr 1fr;padding:1em;overflow-y:hidden;background:#fff;box-shadow:0 0 1px hsla(0deg,0%,0%,.075),0 1px 2px hsla(0deg,0%,0%,.075),1px 2px 4px hsla(0deg,0%,0%,.075),1px 3px 8px hsla(0deg,0%,0%,.075),2px 4px 16px hsla(0deg,0%,0%,.075);pointer-events:all}.swal2-popup.swal2-toast>*{grid-column:2}.swal2-popup.swal2-toast .swal2-title{margin:.5em 1em;padding:0;font-size:1em;text-align:initial}.swal2-popup.swal2-toast .swal2-loading{justify-content:center}.swal2-popup.swal2-toast .swal2-input{height:2em;margin:.5em;font-size:1em}.swal2-popup.swal2-toast .swal2-validation-message{font-size:1em}.swal2-popup.swal2-toast .swal2-footer{margin:.5em 0 0;padding:.5em 0 0;font-size:.8em}.swal2-popup.swal2-toast .swal2-close{grid-column:3/3;grid-row:1/99;align-self:center;width:.8em;height:.8em;margin:0;font-size:2em}.swal2-popup.swal2-toast .swal2-html-container{margin:.5em 1em;padding:0;overflow:initial;font-size:1em;text-align:initial}.swal2-popup.swal2-toast .swal2-html-container:empty{padding:0}.swal2-popup.swal2-toast .swal2-loader{grid-column:1;grid-row:1/99;align-self:center;width:2em;height:2em;margin:.25em}.swal2-popup.swal2-toast .swal2-icon{grid-column:1;grid-row:1/99;align-self:center;width:2em;min-width:2em;height:2em;margin:0 .5em 0 0}.swal2-popup.swal2-toast .swal2-icon .swal2-icon-content{display:flex;align-items:center;font-size:1.8em;font-weight:700}.swal2-popup.swal2-toast .swal2-icon.swal2-success .swal2-success-ring{width:2em;height:2em}.swal2-popup.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line]{top:.875em;width:1.375em}.swal2-popup.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=left]{left:.3125em}.swal2-popup.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=right]{right:.3125em}.swal2-popup.swal2-toast .swal2-actions{justify-content:flex-start;height:auto;margin:0;margin-top:.5em;padding:0 .5em}.swal2-popup.swal2-toast .swal2-styled{margin:.25em .5em;padding:.4em .6em;font-size:1em}.swal2-popup.swal2-toast .swal2-success{border-color:#a5dc86}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-circular-line]{position:absolute;width:1.6em;height:3em;transform:rotate(45deg);border-radius:50%}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-circular-line][class$=left]{top:-.8em;left:-.5em;transform:rotate(-45deg);transform-origin:2em 2em;border-radius:4em 0 0 4em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-circular-line][class$=right]{top:-.25em;left:.9375em;transform-origin:0 1.5em;border-radius:0 4em 4em 0}.swal2-popup.swal2-toast .swal2-success .swal2-success-ring{width:2em;height:2em}.swal2-popup.swal2-toast .swal2-success .swal2-success-fix{top:0;left:.4375em;width:.4375em;height:2.6875em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-line]{height:.3125em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-line][class$=tip]{top:1.125em;left:.1875em;width:.75em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-line][class$=long]{top:.9375em;right:.1875em;width:1.375em}.swal2-popup.swal2-toast .swal2-success.swal2-icon-show .swal2-success-line-tip{animation:swal2-toast-animate-success-line-tip .75s}.swal2-popup.swal2-toast .swal2-success.swal2-icon-show .swal2-success-line-long{animation:swal2-toast-animate-success-line-long .75s}.swal2-popup.swal2-toast.swal2-show{animation:swal2-toast-show .5s}.swal2-popup.swal2-toast.swal2-hide{animation:swal2-toast-hide .1s forwards}.swal2-container{display:grid;position:fixed;z-index:1060;top:0;right:0;bottom:0;left:0;box-sizing:border-box;grid-template-areas:\"top-start     top            top-end\" \"center-start  center         center-end\" \"bottom-start  bottom-center  bottom-end\";grid-template-rows:minmax(min-content,auto) minmax(min-content,auto) minmax(min-content,auto);height:100%;padding:.625em;overflow-x:hidden;transition:background-color .1s;-webkit-overflow-scrolling:touch}.swal2-container.swal2-backdrop-show,.swal2-container.swal2-noanimation{background:rgba(0,0,0,.4)}.swal2-container.swal2-backdrop-hide{background:0 0!important}.swal2-container.swal2-bottom-start,.swal2-container.swal2-center-start,.swal2-container.swal2-top-start{grid-template-columns:minmax(0,1fr) auto auto}.swal2-container.swal2-bottom,.swal2-container.swal2-center,.swal2-container.swal2-top{grid-template-columns:auto minmax(0,1fr) auto}.swal2-container.swal2-bottom-end,.swal2-container.swal2-center-end,.swal2-container.swal2-top-end{grid-template-columns:auto auto minmax(0,1fr)}.swal2-container.swal2-top-start>.swal2-popup{align-self:start}.swal2-container.swal2-top>.swal2-popup{grid-column:2;align-self:start;justify-self:center}.swal2-container.swal2-top-end>.swal2-popup,.swal2-container.swal2-top-right>.swal2-popup{grid-column:3;align-self:start;justify-self:end}.swal2-container.swal2-center-left>.swal2-popup,.swal2-container.swal2-center-start>.swal2-popup{grid-row:2;align-self:center}.swal2-container.swal2-center>.swal2-popup{grid-column:2;grid-row:2;align-self:center;justify-self:center}.swal2-container.swal2-center-end>.swal2-popup,.swal2-container.swal2-center-right>.swal2-popup{grid-column:3;grid-row:2;align-self:center;justify-self:end}.swal2-container.swal2-bottom-left>.swal2-popup,.swal2-container.swal2-bottom-start>.swal2-popup{grid-column:1;grid-row:3;align-self:end}.swal2-container.swal2-bottom>.swal2-popup{grid-column:2;grid-row:3;justify-self:center;align-self:end}.swal2-container.swal2-bottom-end>.swal2-popup,.swal2-container.swal2-bottom-right>.swal2-popup{grid-column:3;grid-row:3;align-self:end;justify-self:end}.swal2-container.swal2-grow-fullscreen>.swal2-popup,.swal2-container.swal2-grow-row>.swal2-popup{grid-column:1/4;width:100%}.swal2-container.swal2-grow-column>.swal2-popup,.swal2-container.swal2-grow-fullscreen>.swal2-popup{grid-row:1/4;align-self:stretch}.swal2-container.swal2-no-transition{transition:none!important}.swal2-popup{display:none;position:relative;box-sizing:border-box;grid-template-columns:minmax(0,100%);width:32em;max-width:100%;padding:0 0 1.25em;border:none;border-radius:5px;background:#fff;color:#545454;font-family:inherit;font-size:1rem}.swal2-popup:focus{outline:0}.swal2-popup.swal2-loading{overflow-y:hidden}.swal2-title{position:relative;max-width:100%;margin:0;padding:.8em 1em 0;color:inherit;font-size:1.875em;font-weight:600;text-align:center;text-transform:none;word-wrap:break-word}.swal2-actions{display:flex;z-index:1;box-sizing:border-box;flex-wrap:wrap;align-items:center;justify-content:center;width:auto;margin:1.25em auto 0;padding:0}.swal2-actions:not(.swal2-loading) .swal2-styled[disabled]{opacity:.4}.swal2-actions:not(.swal2-loading) .swal2-styled:hover{background-image:linear-gradient(rgba(0,0,0,.1),rgba(0,0,0,.1))}.swal2-actions:not(.swal2-loading) .swal2-styled:active{background-image:linear-gradient(rgba(0,0,0,.2),rgba(0,0,0,.2))}.swal2-loader{display:none;align-items:center;justify-content:center;width:2.2em;height:2.2em;margin:0 1.875em;animation:swal2-rotate-loading 1.5s linear 0s infinite normal;border-width:.25em;border-style:solid;border-radius:100%;border-color:#2778c4 transparent #2778c4 transparent}.swal2-styled{margin:.3125em;padding:.625em 1.1em;transition:box-shadow .1s;box-shadow:0 0 0 3px transparent;font-weight:500}.swal2-styled:not([disabled]){cursor:pointer}.swal2-styled.swal2-confirm{border:0;border-radius:.25em;background:initial;background-color:#7066e0;color:#fff;font-size:1em}.swal2-styled.swal2-confirm:focus{box-shadow:0 0 0 3px rgba(112,102,224,.5)}.swal2-styled.swal2-deny{border:0;border-radius:.25em;background:initial;background-color:#dc3741;color:#fff;font-size:1em}.swal2-styled.swal2-deny:focus{box-shadow:0 0 0 3px rgba(220,55,65,.5)}.swal2-styled.swal2-cancel{border:0;border-radius:.25em;background:initial;background-color:#6e7881;color:#fff;font-size:1em}.swal2-styled.swal2-cancel:focus{box-shadow:0 0 0 3px rgba(110,120,129,.5)}.swal2-styled.swal2-default-outline:focus{box-shadow:0 0 0 3px rgba(100,150,200,.5)}.swal2-styled:focus{outline:0}.swal2-styled::-moz-focus-inner{border:0}.swal2-footer{justify-content:center;margin:1em 0 0;padding:1em 1em 0;border-top:1px solid #eee;color:inherit;font-size:1em}.swal2-timer-progress-bar-container{position:absolute;right:0;bottom:0;left:0;grid-column:auto!important;overflow:hidden;border-bottom-right-radius:5px;border-bottom-left-radius:5px}.swal2-timer-progress-bar{width:100%;height:.25em;background:rgba(0,0,0,.2)}.swal2-image{max-width:100%;margin:2em auto 1em}.swal2-close{z-index:2;align-items:center;justify-content:center;width:1.2em;height:1.2em;margin-top:0;margin-right:0;margin-bottom:-1.2em;padding:0;overflow:hidden;transition:color .1s,box-shadow .1s;border:none;border-radius:5px;background:0 0;color:#ccc;font-family:serif;font-family:monospace;font-size:2.5em;cursor:pointer;justify-self:end}.swal2-close:hover{transform:none;background:0 0;color:#f27474}.swal2-close:focus{outline:0;box-shadow:inset 0 0 0 3px rgba(100,150,200,.5)}.swal2-close::-moz-focus-inner{border:0}.swal2-html-container{z-index:1;justify-content:center;margin:1em 1.6em .3em;padding:0;overflow:auto;color:inherit;font-size:1.125em;font-weight:400;line-height:normal;text-align:center;word-wrap:break-word;word-break:break-word}.swal2-checkbox,.swal2-file,.swal2-input,.swal2-radio,.swal2-select,.swal2-textarea{margin:1em 2em 3px}.swal2-file,.swal2-input,.swal2-textarea{box-sizing:border-box;width:auto;transition:border-color .1s,box-shadow .1s;border:1px solid #d9d9d9;border-radius:.1875em;background:0 0;box-shadow:inset 0 1px 1px rgba(0,0,0,.06),0 0 0 3px transparent;color:inherit;font-size:1.125em}.swal2-file.swal2-inputerror,.swal2-input.swal2-inputerror,.swal2-textarea.swal2-inputerror{border-color:#f27474!important;box-shadow:0 0 2px #f27474!important}.swal2-file:focus,.swal2-input:focus,.swal2-textarea:focus{border:1px solid #b4dbed;outline:0;box-shadow:inset 0 1px 1px rgba(0,0,0,.06),0 0 0 3px rgba(100,150,200,.5)}.swal2-file::-moz-placeholder,.swal2-input::-moz-placeholder,.swal2-textarea::-moz-placeholder{color:#ccc}.swal2-file::placeholder,.swal2-input::placeholder,.swal2-textarea::placeholder{color:#ccc}.swal2-range{margin:1em 2em 3px;background:#fff}.swal2-range input{width:80%}.swal2-range output{width:20%;color:inherit;font-weight:600;text-align:center}.swal2-range input,.swal2-range output{height:2.625em;padding:0;font-size:1.125em;line-height:2.625em}.swal2-input{height:2.625em;padding:0 .75em}.swal2-file{width:75%;margin-right:auto;margin-left:auto;background:0 0;font-size:1.125em}.swal2-textarea{height:6.75em;padding:.75em}.swal2-select{min-width:50%;max-width:100%;padding:.375em .625em;background:0 0;color:inherit;font-size:1.125em}.swal2-checkbox,.swal2-radio{align-items:center;justify-content:center;background:#fff;color:inherit}.swal2-checkbox label,.swal2-radio label{margin:0 .6em;font-size:1.125em}.swal2-checkbox input,.swal2-radio input{flex-shrink:0;margin:0 .4em}.swal2-input-label{display:flex;justify-content:center;margin:1em auto 0}.swal2-validation-message{align-items:center;justify-content:center;margin:1em 0 0;padding:.625em;overflow:hidden;background:#f0f0f0;color:#666;font-size:1em;font-weight:300}.swal2-validation-message::before{content:\"!\";display:inline-block;width:1.5em;min-width:1.5em;height:1.5em;margin:0 .625em;border-radius:50%;background-color:#f27474;color:#fff;font-weight:600;line-height:1.5em;text-align:center}.swal2-icon{position:relative;box-sizing:content-box;justify-content:center;width:5em;height:5em;margin:2.5em auto .6em;border:.25em solid transparent;border-radius:50%;border-color:#000;font-family:inherit;line-height:5em;cursor:default;-webkit-user-select:none;-moz-user-select:none;user-select:none}.swal2-icon .swal2-icon-content{display:flex;align-items:center;font-size:3.75em}.swal2-icon.swal2-error{border-color:#f27474;color:#f27474}.swal2-icon.swal2-error .swal2-x-mark{position:relative;flex-grow:1}.swal2-icon.swal2-error [class^=swal2-x-mark-line]{display:block;position:absolute;top:2.3125em;width:2.9375em;height:.3125em;border-radius:.125em;background-color:#f27474}.swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=left]{left:1.0625em;transform:rotate(45deg)}.swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=right]{right:1em;transform:rotate(-45deg)}.swal2-icon.swal2-error.swal2-icon-show{animation:swal2-animate-error-icon .5s}.swal2-icon.swal2-error.swal2-icon-show .swal2-x-mark{animation:swal2-animate-error-x-mark .5s}.swal2-icon.swal2-warning{border-color:#facea8;color:#f8bb86}.swal2-icon.swal2-warning.swal2-icon-show{animation:swal2-animate-error-icon .5s}.swal2-icon.swal2-warning.swal2-icon-show .swal2-icon-content{animation:swal2-animate-i-mark .5s}.swal2-icon.swal2-info{border-color:#9de0f6;color:#3fc3ee}.swal2-icon.swal2-info.swal2-icon-show{animation:swal2-animate-error-icon .5s}.swal2-icon.swal2-info.swal2-icon-show .swal2-icon-content{animation:swal2-animate-i-mark .8s}.swal2-icon.swal2-question{border-color:#c9dae1;color:#87adbd}.swal2-icon.swal2-question.swal2-icon-show{animation:swal2-animate-error-icon .5s}.swal2-icon.swal2-question.swal2-icon-show .swal2-icon-content{animation:swal2-animate-question-mark .8s}.swal2-icon.swal2-success{border-color:#a5dc86;color:#a5dc86}.swal2-icon.swal2-success [class^=swal2-success-circular-line]{position:absolute;width:3.75em;height:7.5em;transform:rotate(45deg);border-radius:50%}.swal2-icon.swal2-success [class^=swal2-success-circular-line][class$=left]{top:-.4375em;left:-2.0635em;transform:rotate(-45deg);transform-origin:3.75em 3.75em;border-radius:7.5em 0 0 7.5em}.swal2-icon.swal2-success [class^=swal2-success-circular-line][class$=right]{top:-.6875em;left:1.875em;transform:rotate(-45deg);transform-origin:0 3.75em;border-radius:0 7.5em 7.5em 0}.swal2-icon.swal2-success .swal2-success-ring{position:absolute;z-index:2;top:-.25em;left:-.25em;box-sizing:content-box;width:100%;height:100%;border:.25em solid rgba(165,220,134,.3);border-radius:50%}.swal2-icon.swal2-success .swal2-success-fix{position:absolute;z-index:1;top:.5em;left:1.625em;width:.4375em;height:5.625em;transform:rotate(-45deg)}.swal2-icon.swal2-success [class^=swal2-success-line]{display:block;position:absolute;z-index:2;height:.3125em;border-radius:.125em;background-color:#a5dc86}.swal2-icon.swal2-success [class^=swal2-success-line][class$=tip]{top:2.875em;left:.8125em;width:1.5625em;transform:rotate(45deg)}.swal2-icon.swal2-success [class^=swal2-success-line][class$=long]{top:2.375em;right:.5em;width:2.9375em;transform:rotate(-45deg)}.swal2-icon.swal2-success.swal2-icon-show .swal2-success-line-tip{animation:swal2-animate-success-line-tip .75s}.swal2-icon.swal2-success.swal2-icon-show .swal2-success-line-long{animation:swal2-animate-success-line-long .75s}.swal2-icon.swal2-success.swal2-icon-show .swal2-success-circular-line-right{animation:swal2-rotate-success-circular-line 4.25s ease-in}.swal2-progress-steps{flex-wrap:wrap;align-items:center;max-width:100%;margin:1.25em auto;padding:0;background:0 0;font-weight:600}.swal2-progress-steps li{display:inline-block;position:relative}.swal2-progress-steps .swal2-progress-step{z-index:20;flex-shrink:0;width:2em;height:2em;border-radius:2em;background:#2778c4;color:#fff;line-height:2em;text-align:center}.swal2-progress-steps .swal2-progress-step.swal2-active-progress-step{background:#2778c4}.swal2-progress-steps .swal2-progress-step.swal2-active-progress-step~.swal2-progress-step{background:#add8e6;color:#fff}.swal2-progress-steps .swal2-progress-step.swal2-active-progress-step~.swal2-progress-step-line{background:#add8e6}.swal2-progress-steps .swal2-progress-step-line{z-index:10;flex-shrink:0;width:2.5em;height:.4em;margin:0 -1px;background:#2778c4}[class^=swal2]{-webkit-tap-highlight-color:transparent}.swal2-show{animation:swal2-show .3s}.swal2-hide{animation:swal2-hide .15s forwards}.swal2-noanimation{transition:none}.swal2-scrollbar-measure{position:absolute;top:-9999px;width:50px;height:50px;overflow:scroll}.swal2-rtl .swal2-close{margin-right:initial;margin-left:0}.swal2-rtl .swal2-timer-progress-bar{right:0;left:auto}@keyframes swal2-toast-show{0%{transform:translateY(-.625em) rotateZ(2deg)}33%{transform:translateY(0) rotateZ(-2deg)}66%{transform:translateY(.3125em) rotateZ(2deg)}100%{transform:translateY(0) rotateZ(0)}}@keyframes swal2-toast-hide{100%{transform:rotateZ(1deg);opacity:0}}@keyframes swal2-toast-animate-success-line-tip{0%{top:.5625em;left:.0625em;width:0}54%{top:.125em;left:.125em;width:0}70%{top:.625em;left:-.25em;width:1.625em}84%{top:1.0625em;left:.75em;width:.5em}100%{top:1.125em;left:.1875em;width:.75em}}@keyframes swal2-toast-animate-success-line-long{0%{top:1.625em;right:1.375em;width:0}65%{top:1.25em;right:.9375em;width:0}84%{top:.9375em;right:0;width:1.125em}100%{top:.9375em;right:.1875em;width:1.375em}}@keyframes swal2-show{0%{transform:scale(.7)}45%{transform:scale(1.05)}80%{transform:scale(.95)}100%{transform:scale(1)}}@keyframes swal2-hide{0%{transform:scale(1);opacity:1}100%{transform:scale(.5);opacity:0}}@keyframes swal2-animate-success-line-tip{0%{top:1.1875em;left:.0625em;width:0}54%{top:1.0625em;left:.125em;width:0}70%{top:2.1875em;left:-.375em;width:3.125em}84%{top:3em;left:1.3125em;width:1.0625em}100%{top:2.8125em;left:.8125em;width:1.5625em}}@keyframes swal2-animate-success-line-long{0%{top:3.375em;right:2.875em;width:0}65%{top:3.375em;right:2.875em;width:0}84%{top:2.1875em;right:0;width:3.4375em}100%{top:2.375em;right:.5em;width:2.9375em}}@keyframes swal2-rotate-success-circular-line{0%{transform:rotate(-45deg)}5%{transform:rotate(-45deg)}12%{transform:rotate(-405deg)}100%{transform:rotate(-405deg)}}@keyframes swal2-animate-error-x-mark{0%{margin-top:1.625em;transform:scale(.4);opacity:0}50%{margin-top:1.625em;transform:scale(.4);opacity:0}80%{margin-top:-.375em;transform:scale(1.15)}100%{margin-top:0;transform:scale(1);opacity:1}}@keyframes swal2-animate-error-icon{0%{transform:rotateX(100deg);opacity:0}100%{transform:rotateX(0);opacity:1}}@keyframes swal2-rotate-loading{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}@keyframes swal2-animate-question-mark{0%{transform:rotateY(-360deg)}100%{transform:rotateY(0)}}@keyframes swal2-animate-i-mark{0%{transform:rotateZ(45deg);opacity:0}25%{transform:rotateZ(-25deg);opacity:.4}50%{transform:rotateZ(15deg);opacity:.8}75%{transform:rotateZ(-5deg);opacity:1}100%{transform:rotateX(0);opacity:1}}body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown){overflow:hidden}body.swal2-height-auto{height:auto!important}body.swal2-no-backdrop .swal2-container{background-color:transparent!important;pointer-events:none}body.swal2-no-backdrop .swal2-container .swal2-popup{pointer-events:all}body.swal2-no-backdrop .swal2-container .swal2-modal{box-shadow:0 0 10px rgba(0,0,0,.4)}@media print{body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown){overflow-y:scroll!important}body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown)>[aria-hidden=true]{display:none}body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown) .swal2-container{position:static!important}}body.swal2-toast-shown .swal2-container{box-sizing:border-box;width:360px;max-width:100%;background-color:transparent;pointer-events:none}body.swal2-toast-shown .swal2-container.swal2-top{top:0;right:auto;bottom:auto;left:50%;transform:translateX(-50%)}body.swal2-toast-shown .swal2-container.swal2-top-end,body.swal2-toast-shown .swal2-container.swal2-top-right{top:0;right:0;bottom:auto;left:auto}body.swal2-toast-shown .swal2-container.swal2-top-left,body.swal2-toast-shown .swal2-container.swal2-top-start{top:0;right:auto;bottom:auto;left:0}body.swal2-toast-shown .swal2-container.swal2-center-left,body.swal2-toast-shown .swal2-container.swal2-center-start{top:50%;right:auto;bottom:auto;left:0;transform:translateY(-50%)}body.swal2-toast-shown .swal2-container.swal2-center{top:50%;right:auto;bottom:auto;left:50%;transform:translate(-50%,-50%)}body.swal2-toast-shown .swal2-container.swal2-center-end,body.swal2-toast-shown .swal2-container.swal2-center-right{top:50%;right:0;bottom:auto;left:auto;transform:translateY(-50%)}body.swal2-toast-shown .swal2-container.swal2-bottom-left,body.swal2-toast-shown .swal2-container.swal2-bottom-start{top:auto;right:auto;bottom:0;left:0}body.swal2-toast-shown .swal2-container.swal2-bottom{top:auto;right:auto;bottom:0;left:50%;transform:translateX(-50%)}body.swal2-toast-shown .swal2-container.swal2-bottom-end,body.swal2-toast-shown .swal2-container.swal2-bottom-right{top:auto;right:0;bottom:0;left:auto}");

/***/ }),

/***/ "./node_modules/tom-select/dist/js/tom-select.complete.js":
/*!****************************************************************!*\
  !*** ./node_modules/tom-select/dist/js/tom-select.complete.js ***!
  \****************************************************************/
/***/ (function(module) {

/**
* Tom Select v2.2.2
* Licensed under the Apache License, Version 2.0 (the "License");
*/

(function (global, factory) {
	 true ? module.exports = factory() :
	0;
})(this, (function () { 'use strict';

	/**
	 * MicroEvent - to make any js object an event emitter
	 *
	 * - pure javascript - server compatible, browser compatible
	 * - dont rely on the browser doms
	 * - super simple - you get it immediatly, no mistery, no magic involved
	 *
	 * @author Jerome Etienne (https://github.com/jeromeetienne)
	 */

	/**
	 * Execute callback for each event in space separated list of event names
	 *
	 */
	function forEvents(events, callback) {
	  events.split(/\s+/).forEach(event => {
	    callback(event);
	  });
	}

	class MicroEvent {
	  constructor() {
	    this._events = void 0;
	    this._events = {};
	  }

	  on(events, fct) {
	    forEvents(events, event => {
	      const event_array = this._events[event] || [];
	      event_array.push(fct);
	      this._events[event] = event_array;
	    });
	  }

	  off(events, fct) {
	    var n = arguments.length;

	    if (n === 0) {
	      this._events = {};
	      return;
	    }

	    forEvents(events, event => {
	      if (n === 1) {
	        delete this._events[event];
	        return;
	      }

	      const event_array = this._events[event];
	      if (event_array === undefined) return;
	      event_array.splice(event_array.indexOf(fct), 1);
	      this._events[event] = event_array;
	    });
	  }

	  trigger(events, ...args) {
	    var self = this;
	    forEvents(events, event => {
	      const event_array = self._events[event];
	      if (event_array === undefined) return;
	      event_array.forEach(fct => {
	        fct.apply(self, args);
	      });
	    });
	  }

	}

	/**
	 * microplugin.js
	 * Copyright (c) 2013 Brian Reavis & contributors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
	 * file except in compliance with the License. You may obtain a copy of the License at:
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software distributed under
	 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
	 * ANY KIND, either express or implied. See the License for the specific language
	 * governing permissions and limitations under the License.
	 *
	 * @author Brian Reavis <brian@thirdroute.com>
	 */
	function MicroPlugin(Interface) {
	  Interface.plugins = {};
	  return class extends Interface {
	    constructor(...args) {
	      super(...args);
	      this.plugins = {
	        names: [],
	        settings: {},
	        requested: {},
	        loaded: {}
	      };
	    }

	    /**
	     * Registers a plugin.
	     *
	     * @param {function} fn
	     */
	    static define(name, fn) {
	      Interface.plugins[name] = {
	        'name': name,
	        'fn': fn
	      };
	    }
	    /**
	     * Initializes the listed plugins (with options).
	     * Acceptable formats:
	     *
	     * List (without options):
	     *   ['a', 'b', 'c']
	     *
	     * List (with options):
	     *   [{'name': 'a', options: {}}, {'name': 'b', options: {}}]
	     *
	     * Hash (with options):
	     *   {'a': { ... }, 'b': { ... }, 'c': { ... }}
	     *
	     * @param {array|object} plugins
	     */


	    initializePlugins(plugins) {
	      var key, name;
	      const self = this;
	      const queue = [];

	      if (Array.isArray(plugins)) {
	        plugins.forEach(plugin => {
	          if (typeof plugin === 'string') {
	            queue.push(plugin);
	          } else {
	            self.plugins.settings[plugin.name] = plugin.options;
	            queue.push(plugin.name);
	          }
	        });
	      } else if (plugins) {
	        for (key in plugins) {
	          if (plugins.hasOwnProperty(key)) {
	            self.plugins.settings[key] = plugins[key];
	            queue.push(key);
	          }
	        }
	      }

	      while (name = queue.shift()) {
	        self.require(name);
	      }
	    }

	    loadPlugin(name) {
	      var self = this;
	      var plugins = self.plugins;
	      var plugin = Interface.plugins[name];

	      if (!Interface.plugins.hasOwnProperty(name)) {
	        throw new Error('Unable to find "' + name + '" plugin');
	      }

	      plugins.requested[name] = true;
	      plugins.loaded[name] = plugin.fn.apply(self, [self.plugins.settings[name] || {}]);
	      plugins.names.push(name);
	    }
	    /**
	     * Initializes a plugin.
	     *
	     */


	    require(name) {
	      var self = this;
	      var plugins = self.plugins;

	      if (!self.plugins.loaded.hasOwnProperty(name)) {
	        if (plugins.requested[name]) {
	          throw new Error('Plugin has circular dependency ("' + name + '")');
	        }

	        self.loadPlugin(name);
	      }

	      return plugins.loaded[name];
	    }

	  };
	}

	/*! @orchidjs/unicode-variants | https://github.com/orchidjs/unicode-variants | Apache License (v2) */
	/**
	 * Convert array of strings to a regular expression
	 *	ex ['ab','a'] => (?:ab|a)
	 * 	ex ['a','b'] => [ab]
	 * @param {string[]} chars
	 * @return {string}
	 */
	const arrayToPattern = chars => {
	  chars = chars.filter(Boolean);

	  if (chars.length < 2) {
	    return chars[0] || '';
	  }

	  return maxValueLength(chars) == 1 ? '[' + chars.join('') + ']' : '(?:' + chars.join('|') + ')';
	};
	/**
	 * @param {string[]} array
	 * @return {string}
	 */

	const sequencePattern = array => {
	  if (!hasDuplicates(array)) {
	    return array.join('');
	  }

	  let pattern = '';
	  let prev_char_count = 0;

	  const prev_pattern = () => {
	    if (prev_char_count > 1) {
	      pattern += '{' + prev_char_count + '}';
	    }
	  };

	  array.forEach((char, i) => {
	    if (char === array[i - 1]) {
	      prev_char_count++;
	      return;
	    }

	    prev_pattern();
	    pattern += char;
	    prev_char_count = 1;
	  });
	  prev_pattern();
	  return pattern;
	};
	/**
	 * Convert array of strings to a regular expression
	 *	ex ['ab','a'] => (?:ab|a)
	 * 	ex ['a','b'] => [ab]
	 * @param {Set<string>} chars
	 * @return {string}
	 */

	const setToPattern = chars => {
	  let array = toArray(chars);
	  return arrayToPattern(array);
	};
	/**
	 *
	 * https://stackoverflow.com/questions/7376598/in-javascript-how-do-i-check-if-an-array-has-duplicate-values
	 * @param {any[]} array
	 */

	const hasDuplicates = array => {
	  return new Set(array).size !== array.length;
	};
	/**
	 * https://stackoverflow.com/questions/63006601/why-does-u-throw-an-invalid-escape-error
	 * @param {string} str
	 * @return {string}
	 */

	const escape_regex = str => {
	  return (str + '').replace(/([\$\(\)\*\+\.\?\[\]\^\{\|\}\\])/gu, '\\$1');
	};
	/**
	 * Return the max length of array values
	 * @param {string[]} array
	 *
	 */

	const maxValueLength = array => {
	  return array.reduce((longest, value) => Math.max(longest, unicodeLength(value)), 0);
	};
	/**
	 * @param {string} str
	 */

	const unicodeLength = str => {
	  return toArray(str).length;
	};
	/**
	 * @param {any} p
	 * @return {any[]}
	 */

	const toArray = p => Array.from(p);

	/*! @orchidjs/unicode-variants | https://github.com/orchidjs/unicode-variants | Apache License (v2) */
	/**
	 * Get all possible combinations of substrings that add up to the given string
	 * https://stackoverflow.com/questions/30169587/find-all-the-combination-of-substrings-that-add-up-to-the-given-string
	 * @param {string} input
	 * @return {string[][]}
	 */
	const allSubstrings = input => {
	  if (input.length === 1) return [[input]];
	  /** @type {string[][]} */

	  let result = [];
	  const start = input.substring(1);
	  const suba = allSubstrings(start);
	  suba.forEach(function (subresult) {
	    let tmp = subresult.slice(0);
	    tmp[0] = input.charAt(0) + tmp[0];
	    result.push(tmp);
	    tmp = subresult.slice(0);
	    tmp.unshift(input.charAt(0));
	    result.push(tmp);
	  });
	  return result;
	};

	/*! @orchidjs/unicode-variants | https://github.com/orchidjs/unicode-variants | Apache License (v2) */

	/**
	 * @typedef {{[key:string]:string}} TUnicodeMap
	 * @typedef {{[key:string]:Set<string>}} TUnicodeSets
	 * @typedef {[[number,number]]} TCodePoints
	 * @typedef {{folded:string,composed:string,code_point:number}} TCodePointObj
	 * @typedef {{start:number,end:number,length:number,substr:string}} TSequencePart
	 */
	/** @type {TCodePoints} */

	const code_points = [[0, 65535]];
	const accent_pat = '[\u0300-\u036F\u{b7}\u{2be}\u{2bc}]';
	/** @type {TUnicodeMap} */

	let unicode_map;
	/** @type {RegExp} */

	let multi_char_reg;
	const max_char_length = 3;
	/** @type {TUnicodeMap} */

	const latin_convert = {};
	/** @type {TUnicodeMap} */

	const latin_condensed = {
	  '/': '⁄∕',
	  '0': '߀',
	  "a": "ⱥɐɑ",
	  "aa": "ꜳ",
	  "ae": "æǽǣ",
	  "ao": "ꜵ",
	  "au": "ꜷ",
	  "av": "ꜹꜻ",
	  "ay": "ꜽ",
	  "b": "ƀɓƃ",
	  "c": "ꜿƈȼↄ",
	  "d": "đɗɖᴅƌꮷԁɦ",
	  "e": "ɛǝᴇɇ",
	  "f": "ꝼƒ",
	  "g": "ǥɠꞡᵹꝿɢ",
	  "h": "ħⱨⱶɥ",
	  "i": "ɨı",
	  "j": "ɉȷ",
	  "k": "ƙⱪꝁꝃꝅꞣ",
	  "l": "łƚɫⱡꝉꝇꞁɭ",
	  "m": "ɱɯϻ",
	  "n": "ꞥƞɲꞑᴎлԉ",
	  "o": "øǿɔɵꝋꝍᴑ",
	  "oe": "œ",
	  "oi": "ƣ",
	  "oo": "ꝏ",
	  "ou": "ȣ",
	  "p": "ƥᵽꝑꝓꝕρ",
	  "q": "ꝗꝙɋ",
	  "r": "ɍɽꝛꞧꞃ",
	  "s": "ßȿꞩꞅʂ",
	  "t": "ŧƭʈⱦꞇ",
	  "th": "þ",
	  "tz": "ꜩ",
	  "u": "ʉ",
	  "v": "ʋꝟʌ",
	  "vy": "ꝡ",
	  "w": "ⱳ",
	  "y": "ƴɏỿ",
	  "z": "ƶȥɀⱬꝣ",
	  "hv": "ƕ"
	};

	for (let latin in latin_condensed) {
	  let unicode = latin_condensed[latin] || '';

	  for (let i = 0; i < unicode.length; i++) {
	    let char = unicode.substring(i, i + 1);
	    latin_convert[char] = latin;
	  }
	}

	const convert_pat = new RegExp(Object.keys(latin_convert).join('|') + '|' + accent_pat, 'gu');
	/**
	 * Initialize the unicode_map from the give code point ranges
	 *
	 * @param {TCodePoints=} _code_points
	 */

	const initialize = _code_points => {
	  if (unicode_map !== undefined) return;
	  unicode_map = generateMap(_code_points || code_points);
	};
	/**
	 * Helper method for normalize a string
	 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize
	 * @param {string} str
	 * @param {string} form
	 */

	const normalize = (str, form = 'NFKD') => str.normalize(form);
	/**
	 * Remove accents without reordering string
	 * calling str.normalize('NFKD') on \u{594}\u{595}\u{596} becomes \u{596}\u{594}\u{595}
	 * via https://github.com/krisk/Fuse/issues/133#issuecomment-318692703
	 * @param {string} str
	 * @return {string}
	 */

	const asciifold = str => {
	  return toArray(str).reduce(
	  /**
	   * @param {string} result
	   * @param {string} char
	   */
	  (result, char) => {
	    return result + _asciifold(char);
	  }, '');
	};
	/**
	 * @param {string} str
	 * @return {string}
	 */

	const _asciifold = str => {
	  str = normalize(str).toLowerCase().replace(convert_pat, (
	  /** @type {string} */
	  char) => {
	    return latin_convert[char] || '';
	  }); //return str;

	  return normalize(str, 'NFC');
	};
	/**
	 * Generate a list of unicode variants from the list of code points
	 * @param {TCodePoints} code_points
	 * @yield {TCodePointObj}
	 */

	function* generator(code_points) {
	  for (const [code_point_min, code_point_max] of code_points) {
	    for (let i = code_point_min; i <= code_point_max; i++) {
	      let composed = String.fromCharCode(i);
	      let folded = asciifold(composed);

	      if (folded == composed.toLowerCase()) {
	        continue;
	      } // skip when folded is a string longer than 3 characters long
	      // bc the resulting regex patterns will be long
	      // eg:
	      // folded صلى الله عليه وسلم length 18 code point 65018
	      // folded جل جلاله length 8 code point 65019


	      if (folded.length > max_char_length) {
	        continue;
	      }

	      if (folded.length == 0) {
	        continue;
	      }

	      yield {
	        folded: folded,
	        composed: composed,
	        code_point: i
	      };
	    }
	  }
	}
	/**
	 * Generate a unicode map from the list of code points
	 * @param {TCodePoints} code_points
	 * @return {TUnicodeSets}
	 */

	const generateSets = code_points => {
	  /** @type {{[key:string]:Set<string>}} */
	  const unicode_sets = {};
	  /**
	   * @param {string} folded
	   * @param {string} to_add
	   */

	  const addMatching = (folded, to_add) => {
	    /** @type {Set<string>} */
	    const folded_set = unicode_sets[folded] || new Set();
	    const patt = new RegExp('^' + setToPattern(folded_set) + '$', 'iu');

	    if (to_add.match(patt)) {
	      return;
	    }

	    folded_set.add(escape_regex(to_add));
	    unicode_sets[folded] = folded_set;
	  };

	  for (let value of generator(code_points)) {
	    addMatching(value.folded, value.folded);
	    addMatching(value.folded, value.composed);
	  }

	  return unicode_sets;
	};
	/**
	 * Generate a unicode map from the list of code points
	 * ae => (?:(?:ae|Æ|Ǽ|Ǣ)|(?:A|Ⓐ|Ａ...)(?:E|ɛ|Ⓔ...))
	 *
	 * @param {TCodePoints} code_points
	 * @return {TUnicodeMap}
	 */

	const generateMap = code_points => {
	  /** @type {TUnicodeSets} */
	  const unicode_sets = generateSets(code_points);
	  /** @type {TUnicodeMap} */

	  const unicode_map = {};
	  /** @type {string[]} */

	  let multi_char = [];

	  for (let folded in unicode_sets) {
	    let set = unicode_sets[folded];

	    if (set) {
	      unicode_map[folded] = setToPattern(set);
	    }

	    if (folded.length > 1) {
	      multi_char.push(escape_regex(folded));
	    }
	  }

	  multi_char.sort((a, b) => b.length - a.length);
	  const multi_char_patt = arrayToPattern(multi_char);
	  multi_char_reg = new RegExp('^' + multi_char_patt, 'u');
	  return unicode_map;
	};
	/**
	 * Map each element of an array from it's folded value to all possible unicode matches
	 * @param {string[]} strings
	 * @param {number} min_replacement
	 * @return {string}
	 */

	const mapSequence = (strings, min_replacement = 1) => {
	  let chars_replaced = 0;
	  strings = strings.map(str => {
	    if (unicode_map[str]) {
	      chars_replaced += str.length;
	    }

	    return unicode_map[str] || str;
	  });

	  if (chars_replaced >= min_replacement) {
	    return sequencePattern(strings);
	  }

	  return '';
	};
	/**
	 * Convert a short string and split it into all possible patterns
	 * Keep a pattern only if min_replacement is met
	 *
	 * 'abc'
	 * 		=> [['abc'],['ab','c'],['a','bc'],['a','b','c']]
	 *		=> ['abc-pattern','ab-c-pattern'...]
	 *
	 *
	 * @param {string} str
	 * @param {number} min_replacement
	 * @return {string}
	 */

	const substringsToPattern = (str, min_replacement = 1) => {
	  min_replacement = Math.max(min_replacement, str.length - 1);
	  return arrayToPattern(allSubstrings(str).map(sub_pat => {
	    return mapSequence(sub_pat, min_replacement);
	  }));
	};
	/**
	 * Convert an array of sequences into a pattern
	 * [{start:0,end:3,length:3,substr:'iii'}...] => (?:iii...)
	 *
	 * @param {Sequence[]} sequences
	 * @param {boolean} all
	 */

	const sequencesToPattern = (sequences, all = true) => {
	  let min_replacement = sequences.length > 1 ? 1 : 0;
	  return arrayToPattern(sequences.map(sequence => {
	    let seq = [];
	    const len = all ? sequence.length() : sequence.length() - 1;

	    for (let j = 0; j < len; j++) {
	      seq.push(substringsToPattern(sequence.substrs[j] || '', min_replacement));
	    }

	    return sequencePattern(seq);
	  }));
	};
	/**
	 * Return true if the sequence is already in the sequences
	 * @param {Sequence} needle_seq
	 * @param {Sequence[]} sequences
	 */


	const inSequences = (needle_seq, sequences) => {
	  for (const seq of sequences) {
	    if (seq.start != needle_seq.start || seq.end != needle_seq.end) {
	      continue;
	    }

	    if (seq.substrs.join('') !== needle_seq.substrs.join('')) {
	      continue;
	    }

	    let needle_parts = needle_seq.parts;
	    /**
	     * @param {TSequencePart} part
	     */

	    const filter = part => {
	      for (const needle_part of needle_parts) {
	        if (needle_part.start === part.start && needle_part.substr === part.substr) {
	          return false;
	        }

	        if (part.length == 1 || needle_part.length == 1) {
	          continue;
	        } // check for overlapping parts
	        // a = ['::=','==']
	        // b = ['::','===']
	        // a = ['r','sm']
	        // b = ['rs','m']


	        if (part.start < needle_part.start && part.end > needle_part.start) {
	          return true;
	        }

	        if (needle_part.start < part.start && needle_part.end > part.start) {
	          return true;
	        }
	      }

	      return false;
	    };

	    let filtered = seq.parts.filter(filter);

	    if (filtered.length > 0) {
	      continue;
	    }

	    return true;
	  }

	  return false;
	};

	class Sequence {
	  constructor() {
	    /** @type {TSequencePart[]} */
	    this.parts = [];
	    /** @type {string[]} */

	    this.substrs = [];
	    this.start = 0;
	    this.end = 0;
	  }
	  /**
	   * @param {TSequencePart|undefined} part
	   */


	  add(part) {
	    if (part) {
	      this.parts.push(part);
	      this.substrs.push(part.substr);
	      this.start = Math.min(part.start, this.start);
	      this.end = Math.max(part.end, this.end);
	    }
	  }

	  last() {
	    return this.parts[this.parts.length - 1];
	  }

	  length() {
	    return this.parts.length;
	  }
	  /**
	   * @param {number} position
	   * @param {TSequencePart} last_piece
	   */


	  clone(position, last_piece) {
	    let clone = new Sequence();
	    let parts = JSON.parse(JSON.stringify(this.parts));
	    let last_part = parts.pop();

	    for (const part of parts) {
	      clone.add(part);
	    }

	    let last_substr = last_piece.substr.substring(0, position - last_part.start);
	    let clone_last_len = last_substr.length;
	    clone.add({
	      start: last_part.start,
	      end: last_part.start + clone_last_len,
	      length: clone_last_len,
	      substr: last_substr
	    });
	    return clone;
	  }

	}
	/**
	 * Expand a regular expression pattern to include unicode variants
	 * 	eg /a/ becomes /aⓐａẚàáâầấẫẩãāăằắẵẳȧǡäǟảåǻǎȁȃạậặḁąⱥɐɑAⒶＡÀÁÂẦẤẪẨÃĀĂẰẮẴẲȦǠÄǞẢÅǺǍȀȂẠẬẶḀĄȺⱯ/
	 *
	 * Issue:
	 *  ﺊﺋ [ 'ﺊ = \\u{fe8a}', 'ﺋ = \\u{fe8b}' ]
	 *	becomes:	ئئ [ 'ي = \\u{64a}', 'ٔ = \\u{654}', 'ي = \\u{64a}', 'ٔ = \\u{654}' ]
	 *
	 *	İĲ = IIJ = ⅡJ
	 *
	 * 	1/2/4
	 *
	 * @param {string} str
	 * @return {string|undefined}
	 */


	const getPattern = str => {
	  initialize();
	  str = asciifold(str);
	  let pattern = '';
	  let sequences = [new Sequence()];

	  for (let i = 0; i < str.length; i++) {
	    let substr = str.substring(i);
	    let match = substr.match(multi_char_reg);
	    const char = str.substring(i, i + 1);
	    const match_str = match ? match[0] : null; // loop through sequences
	    // add either the char or multi_match

	    let overlapping = [];
	    let added_types = new Set();

	    for (const sequence of sequences) {
	      const last_piece = sequence.last();

	      if (!last_piece || last_piece.length == 1 || last_piece.end <= i) {
	        // if we have a multi match
	        if (match_str) {
	          const len = match_str.length;
	          sequence.add({
	            start: i,
	            end: i + len,
	            length: len,
	            substr: match_str
	          });
	          added_types.add('1');
	        } else {
	          sequence.add({
	            start: i,
	            end: i + 1,
	            length: 1,
	            substr: char
	          });
	          added_types.add('2');
	        }
	      } else if (match_str) {
	        let clone = sequence.clone(i, last_piece);
	        const len = match_str.length;
	        clone.add({
	          start: i,
	          end: i + len,
	          length: len,
	          substr: match_str
	        });
	        overlapping.push(clone);
	      } else {
	        // don't add char
	        // adding would create invalid patterns: 234 => [2,34,4]
	        added_types.add('3');
	      }
	    } // if we have overlapping


	    if (overlapping.length > 0) {
	      // ['ii','iii'] before ['i','i','iii']
	      overlapping = overlapping.sort((a, b) => {
	        return a.length() - b.length();
	      });

	      for (let clone of overlapping) {
	        // don't add if we already have an equivalent sequence
	        if (inSequences(clone, sequences)) {
	          continue;
	        }

	        sequences.push(clone);
	      }

	      continue;
	    } // if we haven't done anything unique
	    // clean up the patterns
	    // helps keep patterns smaller
	    // if str = 'r₨㎧aarss', pattern will be 446 instead of 655


	    if (i > 0 && added_types.size == 1 && !added_types.has('3')) {
	      pattern += sequencesToPattern(sequences, false);
	      let new_seq = new Sequence();
	      const old_seq = sequences[0];

	      if (old_seq) {
	        new_seq.add(old_seq.last());
	      }

	      sequences = [new_seq];
	    }
	  }

	  pattern += sequencesToPattern(sequences, true);
	  return pattern;
	};

	/*! sifter.js | https://github.com/orchidjs/sifter.js | Apache License (v2) */

	/**
	 * A property getter resolving dot-notation
	 * @param  {Object}  obj     The root object to fetch property on
	 * @param  {String}  name    The optionally dotted property name to fetch
	 * @return {Object}          The resolved property value
	 */
	const getAttr = (obj, name) => {
	  if (!obj) return;
	  return obj[name];
	};
	/**
	 * A property getter resolving dot-notation
	 * @param  {Object}  obj     The root object to fetch property on
	 * @param  {String}  name    The optionally dotted property name to fetch
	 * @return {Object}          The resolved property value
	 */

	const getAttrNesting = (obj, name) => {
	  if (!obj) return;
	  var part,
	      names = name.split(".");

	  while ((part = names.shift()) && (obj = obj[part]));

	  return obj;
	};
	/**
	 * Calculates how close of a match the
	 * given value is against a search token.
	 *
	 */

	const scoreValue = (value, token, weight) => {
	  var score, pos;
	  if (!value) return 0;
	  value = value + '';
	  if (token.regex == null) return 0;
	  pos = value.search(token.regex);
	  if (pos === -1) return 0;
	  score = token.string.length / value.length;
	  if (pos === 0) score += 0.5;
	  return score * weight;
	};
	/**
	 * Cast object property to an array if it exists and has a value
	 *
	 */

	const propToArray = (obj, key) => {
	  var value = obj[key];
	  if (typeof value == 'function') return value;

	  if (value && !Array.isArray(value)) {
	    obj[key] = [value];
	  }
	};
	/**
	 * Iterates over arrays and hashes.
	 *
	 * ```
	 * iterate(this.items, function(item, id) {
	 *    // invoked for each item
	 * });
	 * ```
	 *
	 */

	const iterate$1 = (object, callback) => {
	  if (Array.isArray(object)) {
	    object.forEach(callback);
	  } else {
	    for (var key in object) {
	      if (object.hasOwnProperty(key)) {
	        callback(object[key], key);
	      }
	    }
	  }
	};
	const cmp = (a, b) => {
	  if (typeof a === 'number' && typeof b === 'number') {
	    return a > b ? 1 : a < b ? -1 : 0;
	  }

	  a = asciifold(a + '').toLowerCase();
	  b = asciifold(b + '').toLowerCase();
	  if (a > b) return 1;
	  if (b > a) return -1;
	  return 0;
	};

	/*! sifter.js | https://github.com/orchidjs/sifter.js | Apache License (v2) */

	/**
	 * sifter.js
	 * Copyright (c) 2013–2020 Brian Reavis & contributors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
	 * file except in compliance with the License. You may obtain a copy of the License at:
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software distributed under
	 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
	 * ANY KIND, either express or implied. See the License for the specific language
	 * governing permissions and limitations under the License.
	 *
	 * @author Brian Reavis <brian@thirdroute.com>
	 */

	class Sifter {
	  // []|{};

	  /**
	   * Textually searches arrays and hashes of objects
	   * by property (or multiple properties). Designed
	   * specifically for autocomplete.
	   *
	   */
	  constructor(items, settings) {
	    this.items = void 0;
	    this.settings = void 0;
	    this.items = items;
	    this.settings = settings || {
	      diacritics: true
	    };
	  }

	  /**
	   * Splits a search string into an array of individual
	   * regexps to be used to match results.
	   *
	   */
	  tokenize(query, respect_word_boundaries, weights) {
	    if (!query || !query.length) return [];
	    const tokens = [];
	    const words = query.split(/\s+/);
	    var field_regex;

	    if (weights) {
	      field_regex = new RegExp('^(' + Object.keys(weights).map(escape_regex).join('|') + ')\:(.*)$');
	    }

	    words.forEach(word => {
	      let field_match;
	      let field = null;
	      let regex = null; // look for "field:query" tokens

	      if (field_regex && (field_match = word.match(field_regex))) {
	        field = field_match[1];
	        word = field_match[2];
	      }

	      if (word.length > 0) {
	        if (this.settings.diacritics) {
	          regex = getPattern(word) || null;
	        } else {
	          regex = escape_regex(word);
	        }

	        if (regex && respect_word_boundaries) regex = "\\b" + regex;
	      }

	      tokens.push({
	        string: word,
	        regex: regex ? new RegExp(regex, 'iu') : null,
	        field: field
	      });
	    });
	    return tokens;
	  }

	  /**
	   * Returns a function to be used to score individual results.
	   *
	   * Good matches will have a higher score than poor matches.
	   * If an item is not a match, 0 will be returned by the function.
	   *
	   * @returns {T.ScoreFn}
	   */
	  getScoreFunction(query, options) {
	    var search = this.prepareSearch(query, options);
	    return this._getScoreFunction(search);
	  }
	  /**
	   * @returns {T.ScoreFn}
	   *
	   */


	  _getScoreFunction(search) {
	    const tokens = search.tokens,
	          token_count = tokens.length;

	    if (!token_count) {
	      return function () {
	        return 0;
	      };
	    }

	    const fields = search.options.fields,
	          weights = search.weights,
	          field_count = fields.length,
	          getAttrFn = search.getAttrFn;

	    if (!field_count) {
	      return function () {
	        return 1;
	      };
	    }
	    /**
	     * Calculates the score of an object
	     * against the search query.
	     *
	     */


	    const scoreObject = function () {
	      if (field_count === 1) {
	        return function (token, data) {
	          const field = fields[0].field;
	          return scoreValue(getAttrFn(data, field), token, weights[field] || 1);
	        };
	      }

	      return function (token, data) {
	        var sum = 0; // is the token specific to a field?

	        if (token.field) {
	          const value = getAttrFn(data, token.field);

	          if (!token.regex && value) {
	            sum += 1 / field_count;
	          } else {
	            sum += scoreValue(value, token, 1);
	          }
	        } else {
	          iterate$1(weights, (weight, field) => {
	            sum += scoreValue(getAttrFn(data, field), token, weight);
	          });
	        }

	        return sum / field_count;
	      };
	    }();

	    if (token_count === 1) {
	      return function (data) {
	        return scoreObject(tokens[0], data);
	      };
	    }

	    if (search.options.conjunction === 'and') {
	      return function (data) {
	        var score,
	            sum = 0;

	        for (let token of tokens) {
	          score = scoreObject(token, data);
	          if (score <= 0) return 0;
	          sum += score;
	        }

	        return sum / token_count;
	      };
	    } else {
	      return function (data) {
	        var sum = 0;
	        iterate$1(tokens, token => {
	          sum += scoreObject(token, data);
	        });
	        return sum / token_count;
	      };
	    }
	  }

	  /**
	   * Returns a function that can be used to compare two
	   * results, for sorting purposes. If no sorting should
	   * be performed, `null` will be returned.
	   *
	   * @return function(a,b)
	   */
	  getSortFunction(query, options) {
	    var search = this.prepareSearch(query, options);
	    return this._getSortFunction(search);
	  }

	  _getSortFunction(search) {
	    var implicit_score,
	        sort_flds = [];
	    const self = this,
	          options = search.options,
	          sort = !search.query && options.sort_empty ? options.sort_empty : options.sort;

	    if (typeof sort == 'function') {
	      return sort.bind(this);
	    }
	    /**
	     * Fetches the specified sort field value
	     * from a search result item.
	     *
	     */


	    const get_field = function get_field(name, result) {
	      if (name === '$score') return result.score;
	      return search.getAttrFn(self.items[result.id], name);
	    }; // parse options


	    if (sort) {
	      for (let s of sort) {
	        if (search.query || s.field !== '$score') {
	          sort_flds.push(s);
	        }
	      }
	    } // the "$score" field is implied to be the primary
	    // sort field, unless it's manually specified


	    if (search.query) {
	      implicit_score = true;

	      for (let fld of sort_flds) {
	        if (fld.field === '$score') {
	          implicit_score = false;
	          break;
	        }
	      }

	      if (implicit_score) {
	        sort_flds.unshift({
	          field: '$score',
	          direction: 'desc'
	        });
	      } // without a search.query, all items will have the same score

	    } else {
	      sort_flds = sort_flds.filter(fld => fld.field !== '$score');
	    } // build function


	    const sort_flds_count = sort_flds.length;

	    if (!sort_flds_count) {
	      return null;
	    }

	    return function (a, b) {
	      var result, field;

	      for (let sort_fld of sort_flds) {
	        field = sort_fld.field;
	        let multiplier = sort_fld.direction === 'desc' ? -1 : 1;
	        result = multiplier * cmp(get_field(field, a), get_field(field, b));
	        if (result) return result;
	      }

	      return 0;
	    };
	  }

	  /**
	   * Parses a search query and returns an object
	   * with tokens and fields ready to be populated
	   * with results.
	   *
	   */
	  prepareSearch(query, optsUser) {
	    const weights = {};
	    var options = Object.assign({}, optsUser);
	    propToArray(options, 'sort');
	    propToArray(options, 'sort_empty'); // convert fields to new format

	    if (options.fields) {
	      propToArray(options, 'fields');
	      const fields = [];
	      options.fields.forEach(field => {
	        if (typeof field == 'string') {
	          field = {
	            field: field,
	            weight: 1
	          };
	        }

	        fields.push(field);
	        weights[field.field] = 'weight' in field ? field.weight : 1;
	      });
	      options.fields = fields;
	    }

	    return {
	      options: options,
	      query: query.toLowerCase().trim(),
	      tokens: this.tokenize(query, options.respect_word_boundaries, weights),
	      total: 0,
	      items: [],
	      weights: weights,
	      getAttrFn: options.nesting ? getAttrNesting : getAttr
	    };
	  }

	  /**
	   * Searches through all items and returns a sorted array of matches.
	   *
	   */
	  search(query, options) {
	    var self = this,
	        score,
	        search;
	    search = this.prepareSearch(query, options);
	    options = search.options;
	    query = search.query; // generate result scoring function

	    const fn_score = options.score || self._getScoreFunction(search); // perform search and sort


	    if (query.length) {
	      iterate$1(self.items, (item, id) => {
	        score = fn_score(item);

	        if (options.filter === false || score > 0) {
	          search.items.push({
	            'score': score,
	            'id': id
	          });
	        }
	      });
	    } else {
	      iterate$1(self.items, (_, id) => {
	        search.items.push({
	          'score': 1,
	          'id': id
	        });
	      });
	    }

	    const fn_sort = self._getSortFunction(search);

	    if (fn_sort) search.items.sort(fn_sort); // apply limits

	    search.total = search.items.length;

	    if (typeof options.limit === 'number') {
	      search.items = search.items.slice(0, options.limit);
	    }

	    return search;
	  }

	}

	/**
	 * Iterates over arrays and hashes.
	 *
	 * ```
	 * iterate(this.items, function(item, id) {
	 *    // invoked for each item
	 * });
	 * ```
	 *
	 */

	const iterate = (object, callback) => {
	  if (Array.isArray(object)) {
	    object.forEach(callback);
	  } else {
	    for (var key in object) {
	      if (object.hasOwnProperty(key)) {
	        callback(object[key], key);
	      }
	    }
	  }
	};

	/**
	 * Return a dom element from either a dom query string, jQuery object, a dom element or html string
	 * https://stackoverflow.com/questions/494143/creating-a-new-dom-element-from-an-html-string-using-built-in-dom-methods-or-pro/35385518#35385518
	 *
	 * param query should be {}
	 */

	const getDom = query => {
	  if (query.jquery) {
	    return query[0];
	  }

	  if (query instanceof HTMLElement) {
	    return query;
	  }

	  if (isHtmlString(query)) {
	    var tpl = document.createElement('template');
	    tpl.innerHTML = query.trim(); // Never return a text node of whitespace as the result

	    return tpl.content.firstChild;
	  }

	  return document.querySelector(query);
	};
	const isHtmlString = arg => {
	  if (typeof arg === 'string' && arg.indexOf('<') > -1) {
	    return true;
	  }

	  return false;
	};
	const escapeQuery = query => {
	  return query.replace(/['"\\]/g, '\\$&');
	};
	/**
	 * Dispatch an event
	 *
	 */

	const triggerEvent = (dom_el, event_name) => {
	  var event = document.createEvent('HTMLEvents');
	  event.initEvent(event_name, true, false);
	  dom_el.dispatchEvent(event);
	};
	/**
	 * Apply CSS rules to a dom element
	 *
	 */

	const applyCSS = (dom_el, css) => {
	  Object.assign(dom_el.style, css);
	};
	/**
	 * Add css classes
	 *
	 */

	const addClasses = (elmts, ...classes) => {
	  var norm_classes = classesArray(classes);
	  elmts = castAsArray(elmts);
	  elmts.map(el => {
	    norm_classes.map(cls => {
	      el.classList.add(cls);
	    });
	  });
	};
	/**
	 * Remove css classes
	 *
	 */

	const removeClasses = (elmts, ...classes) => {
	  var norm_classes = classesArray(classes);
	  elmts = castAsArray(elmts);
	  elmts.map(el => {
	    norm_classes.map(cls => {
	      el.classList.remove(cls);
	    });
	  });
	};
	/**
	 * Return arguments
	 *
	 */

	const classesArray = args => {
	  var classes = [];
	  iterate(args, _classes => {
	    if (typeof _classes === 'string') {
	      _classes = _classes.trim().split(/[\11\12\14\15\40]/);
	    }

	    if (Array.isArray(_classes)) {
	      classes = classes.concat(_classes);
	    }
	  });
	  return classes.filter(Boolean);
	};
	/**
	 * Create an array from arg if it's not already an array
	 *
	 */

	const castAsArray = arg => {
	  if (!Array.isArray(arg)) {
	    arg = [arg];
	  }

	  return arg;
	};
	/**
	 * Get the closest node to the evt.target matching the selector
	 * Stops at wrapper
	 *
	 */

	const parentMatch = (target, selector, wrapper) => {
	  if (wrapper && !wrapper.contains(target)) {
	    return;
	  }

	  while (target && target.matches) {
	    if (target.matches(selector)) {
	      return target;
	    }

	    target = target.parentNode;
	  }
	};
	/**
	 * Get the first or last item from an array
	 *
	 * > 0 - right (last)
	 * <= 0 - left (first)
	 *
	 */

	const getTail = (list, direction = 0) => {
	  if (direction > 0) {
	    return list[list.length - 1];
	  }

	  return list[0];
	};
	/**
	 * Return true if an object is empty
	 *
	 */

	const isEmptyObject = obj => {
	  return Object.keys(obj).length === 0;
	};
	/**
	 * Get the index of an element amongst sibling nodes of the same type
	 *
	 */

	const nodeIndex = (el, amongst) => {
	  if (!el) return -1;
	  amongst = amongst || el.nodeName;
	  var i = 0;

	  while (el = el.previousElementSibling) {
	    if (el.matches(amongst)) {
	      i++;
	    }
	  }

	  return i;
	};
	/**
	 * Set attributes of an element
	 *
	 */

	const setAttr = (el, attrs) => {
	  iterate(attrs, (val, attr) => {
	    if (val == null) {
	      el.removeAttribute(attr);
	    } else {
	      el.setAttribute(attr, '' + val);
	    }
	  });
	};
	/**
	 * Replace a node
	 */

	const replaceNode = (existing, replacement) => {
	  if (existing.parentNode) existing.parentNode.replaceChild(replacement, existing);
	};

	/**
	 * highlight v3 | MIT license | Johann Burkard <jb@eaio.com>
	 * Highlights arbitrary terms in a node.
	 *
	 * - Modified by Marshal <beatgates@gmail.com> 2011-6-24 (added regex)
	 * - Modified by Brian Reavis <brian@thirdroute.com> 2012-8-27 (cleanup)
	 */
	const highlight = (element, regex) => {
	  if (regex === null) return; // convet string to regex

	  if (typeof regex === 'string') {
	    if (!regex.length) return;
	    regex = new RegExp(regex, 'i');
	  } // Wrap matching part of text node with highlighting <span>, e.g.
	  // Soccer  ->  <span class="highlight">Soc</span>cer  for regex = /soc/i


	  const highlightText = node => {
	    var match = node.data.match(regex);

	    if (match && node.data.length > 0) {
	      var spannode = document.createElement('span');
	      spannode.className = 'highlight';
	      var middlebit = node.splitText(match.index);
	      middlebit.splitText(match[0].length);
	      var middleclone = middlebit.cloneNode(true);
	      spannode.appendChild(middleclone);
	      replaceNode(middlebit, spannode);
	      return 1;
	    }

	    return 0;
	  }; // Recurse element node, looking for child text nodes to highlight, unless element
	  // is childless, <script>, <style>, or already highlighted: <span class="hightlight">


	  const highlightChildren = node => {
	    if (node.nodeType === 1 && node.childNodes && !/(script|style)/i.test(node.tagName) && (node.className !== 'highlight' || node.tagName !== 'SPAN')) {
	      Array.from(node.childNodes).forEach(element => {
	        highlightRecursive(element);
	      });
	    }
	  };

	  const highlightRecursive = node => {
	    if (node.nodeType === 3) {
	      return highlightText(node);
	    }

	    highlightChildren(node);
	    return 0;
	  };

	  highlightRecursive(element);
	};
	/**
	 * removeHighlight fn copied from highlight v5 and
	 * edited to remove with(), pass js strict mode, and use without jquery
	 */

	const removeHighlight = el => {
	  var elements = el.querySelectorAll("span.highlight");
	  Array.prototype.forEach.call(elements, function (el) {
	    var parent = el.parentNode;
	    parent.replaceChild(el.firstChild, el);
	    parent.normalize();
	  });
	};

	const KEY_A = 65;
	const KEY_RETURN = 13;
	const KEY_ESC = 27;
	const KEY_LEFT = 37;
	const KEY_UP = 38;
	const KEY_RIGHT = 39;
	const KEY_DOWN = 40;
	const KEY_BACKSPACE = 8;
	const KEY_DELETE = 46;
	const KEY_TAB = 9;
	const IS_MAC = typeof navigator === 'undefined' ? false : /Mac/.test(navigator.userAgent);
	const KEY_SHORTCUT = IS_MAC ? 'metaKey' : 'ctrlKey'; // ctrl key or apple key for ma

	var defaults = {
	  options: [],
	  optgroups: [],
	  plugins: [],
	  delimiter: ',',
	  splitOn: null,
	  // regexp or string for splitting up values from a paste command
	  persist: true,
	  diacritics: true,
	  create: null,
	  createOnBlur: false,
	  createFilter: null,
	  highlight: true,
	  openOnFocus: true,
	  shouldOpen: null,
	  maxOptions: 50,
	  maxItems: null,
	  hideSelected: null,
	  duplicates: false,
	  addPrecedence: false,
	  selectOnTab: false,
	  preload: null,
	  allowEmptyOption: false,
	  //closeAfterSelect: false,
	  loadThrottle: 300,
	  loadingClass: 'loading',
	  dataAttr: null,
	  //'data-data',
	  optgroupField: 'optgroup',
	  valueField: 'value',
	  labelField: 'text',
	  disabledField: 'disabled',
	  optgroupLabelField: 'label',
	  optgroupValueField: 'value',
	  lockOptgroupOrder: false,
	  sortField: '$order',
	  searchField: ['text'],
	  searchConjunction: 'and',
	  mode: null,
	  wrapperClass: 'ts-wrapper',
	  controlClass: 'ts-control',
	  dropdownClass: 'ts-dropdown',
	  dropdownContentClass: 'ts-dropdown-content',
	  itemClass: 'item',
	  optionClass: 'option',
	  dropdownParent: null,
	  controlInput: '<input type="text" autocomplete="off" size="1" />',
	  copyClassesToDropdown: false,
	  placeholder: null,
	  hidePlaceholder: null,
	  shouldLoad: function (query) {
	    return query.length > 0;
	  },

	  /*
	  load                 : null, // function(query, callback) { ... }
	  score                : null, // function(search) { ... }
	  onInitialize         : null, // function() { ... }
	  onChange             : null, // function(value) { ... }
	  onItemAdd            : null, // function(value, $item) { ... }
	  onItemRemove         : null, // function(value) { ... }
	  onClear              : null, // function() { ... }
	  onOptionAdd          : null, // function(value, data) { ... }
	  onOptionRemove       : null, // function(value) { ... }
	  onOptionClear        : null, // function() { ... }
	  onOptionGroupAdd     : null, // function(id, data) { ... }
	  onOptionGroupRemove  : null, // function(id) { ... }
	  onOptionGroupClear   : null, // function() { ... }
	  onDropdownOpen       : null, // function(dropdown) { ... }
	  onDropdownClose      : null, // function(dropdown) { ... }
	  onType               : null, // function(str) { ... }
	  onDelete             : null, // function(values) { ... }
	  */
	  render: {
	    /*
	    item: null,
	    optgroup: null,
	    optgroup_header: null,
	    option: null,
	    option_create: null
	    */
	  }
	};

	/**
	 * Converts a scalar to its best string representation
	 * for hash keys and HTML attribute values.
	 *
	 * Transformations:
	 *   'str'     -> 'str'
	 *   null      -> ''
	 *   undefined -> ''
	 *   true      -> '1'
	 *   false     -> '0'
	 *   0         -> '0'
	 *   1         -> '1'
	 *
	 */
	const hash_key = value => {
	  if (typeof value === 'undefined' || value === null) return null;
	  return get_hash(value);
	};
	const get_hash = value => {
	  if (typeof value === 'boolean') return value ? '1' : '0';
	  return value + '';
	};
	/**
	 * Escapes a string for use within HTML.
	 *
	 */

	const escape_html = str => {
	  return (str + '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
	};
	/**
	 * Debounce the user provided load function
	 *
	 */

	const loadDebounce = (fn, delay) => {
	  var timeout;
	  return function (value, callback) {
	    var self = this;

	    if (timeout) {
	      self.loading = Math.max(self.loading - 1, 0);
	      clearTimeout(timeout);
	    }

	    timeout = setTimeout(function () {
	      timeout = null;
	      self.loadedSearches[value] = true;
	      fn.call(self, value, callback);
	    }, delay);
	  };
	};
	/**
	 * Debounce all fired events types listed in `types`
	 * while executing the provided `fn`.
	 *
	 */

	const debounce_events = (self, types, fn) => {
	  var type;
	  var trigger = self.trigger;
	  var event_args = {}; // override trigger method

	  self.trigger = function () {
	    var type = arguments[0];

	    if (types.indexOf(type) !== -1) {
	      event_args[type] = arguments;
	    } else {
	      return trigger.apply(self, arguments);
	    }
	  }; // invoke provided function


	  fn.apply(self, []);
	  self.trigger = trigger; // trigger queued events

	  for (type of types) {
	    if (type in event_args) {
	      trigger.apply(self, event_args[type]);
	    }
	  }
	};
	/**
	 * Determines the current selection within a text input control.
	 * Returns an object containing:
	 *   - start
	 *   - length
	 *
	 */

	const getSelection = input => {
	  return {
	    start: input.selectionStart || 0,
	    length: (input.selectionEnd || 0) - (input.selectionStart || 0)
	  };
	};
	/**
	 * Prevent default
	 *
	 */

	const preventDefault = (evt, stop = false) => {
	  if (evt) {
	    evt.preventDefault();

	    if (stop) {
	      evt.stopPropagation();
	    }
	  }
	};
	/**
	 * Add event helper
	 *
	 */

	const addEvent = (target, type, callback, options) => {
	  target.addEventListener(type, callback, options);
	};
	/**
	 * Return true if the requested key is down
	 * Will return false if more than one control character is pressed ( when [ctrl+shift+a] != [ctrl+a] )
	 * The current evt may not always set ( eg calling advanceSelection() )
	 *
	 */

	const isKeyDown = (key_name, evt) => {
	  if (!evt) {
	    return false;
	  }

	  if (!evt[key_name]) {
	    return false;
	  }

	  var count = (evt.altKey ? 1 : 0) + (evt.ctrlKey ? 1 : 0) + (evt.shiftKey ? 1 : 0) + (evt.metaKey ? 1 : 0);

	  if (count === 1) {
	    return true;
	  }

	  return false;
	};
	/**
	 * Get the id of an element
	 * If the id attribute is not set, set the attribute with the given id
	 *
	 */

	const getId = (el, id) => {
	  const existing_id = el.getAttribute('id');

	  if (existing_id) {
	    return existing_id;
	  }

	  el.setAttribute('id', id);
	  return id;
	};
	/**
	 * Returns a string with backslashes added before characters that need to be escaped.
	 */

	const addSlashes = str => {
	  return str.replace(/[\\"']/g, '\\$&');
	};
	/**
	 *
	 */

	const append = (parent, node) => {
	  if (node) parent.append(node);
	};

	function getSettings(input, settings_user) {
	  var settings = Object.assign({}, defaults, settings_user);
	  var attr_data = settings.dataAttr;
	  var field_label = settings.labelField;
	  var field_value = settings.valueField;
	  var field_disabled = settings.disabledField;
	  var field_optgroup = settings.optgroupField;
	  var field_optgroup_label = settings.optgroupLabelField;
	  var field_optgroup_value = settings.optgroupValueField;
	  var tag_name = input.tagName.toLowerCase();
	  var placeholder = input.getAttribute('placeholder') || input.getAttribute('data-placeholder');

	  if (!placeholder && !settings.allowEmptyOption) {
	    let option = input.querySelector('option[value=""]');

	    if (option) {
	      placeholder = option.textContent;
	    }
	  }

	  var settings_element = {
	    placeholder: placeholder,
	    options: [],
	    optgroups: [],
	    items: [],
	    maxItems: null
	  };
	  /**
	   * Initialize from a <select> element.
	   *
	   */

	  var init_select = () => {
	    var tagName;
	    var options = settings_element.options;
	    var optionsMap = {};
	    var group_count = 1;

	    var readData = el => {
	      var data = Object.assign({}, el.dataset); // get plain object from DOMStringMap

	      var json = attr_data && data[attr_data];

	      if (typeof json === 'string' && json.length) {
	        data = Object.assign(data, JSON.parse(json));
	      }

	      return data;
	    };

	    var addOption = (option, group) => {
	      var value = hash_key(option.value);
	      if (value == null) return;
	      if (!value && !settings.allowEmptyOption) return; // if the option already exists, it's probably been
	      // duplicated in another optgroup. in this case, push
	      // the current group to the "optgroup" property on the
	      // existing option so that it's rendered in both places.

	      if (optionsMap.hasOwnProperty(value)) {
	        if (group) {
	          var arr = optionsMap[value][field_optgroup];

	          if (!arr) {
	            optionsMap[value][field_optgroup] = group;
	          } else if (!Array.isArray(arr)) {
	            optionsMap[value][field_optgroup] = [arr, group];
	          } else {
	            arr.push(group);
	          }
	        }
	      } else {
	        var option_data = readData(option);
	        option_data[field_label] = option_data[field_label] || option.textContent;
	        option_data[field_value] = option_data[field_value] || value;
	        option_data[field_disabled] = option_data[field_disabled] || option.disabled;
	        option_data[field_optgroup] = option_data[field_optgroup] || group;
	        option_data.$option = option;
	        optionsMap[value] = option_data;
	        options.push(option_data);
	      }

	      if (option.selected) {
	        settings_element.items.push(value);
	      }
	    };

	    var addGroup = optgroup => {
	      var id, optgroup_data;
	      optgroup_data = readData(optgroup);
	      optgroup_data[field_optgroup_label] = optgroup_data[field_optgroup_label] || optgroup.getAttribute('label') || '';
	      optgroup_data[field_optgroup_value] = optgroup_data[field_optgroup_value] || group_count++;
	      optgroup_data[field_disabled] = optgroup_data[field_disabled] || optgroup.disabled;
	      settings_element.optgroups.push(optgroup_data);
	      id = optgroup_data[field_optgroup_value];
	      iterate(optgroup.children, option => {
	        addOption(option, id);
	      });
	    };

	    settings_element.maxItems = input.hasAttribute('multiple') ? null : 1;
	    iterate(input.children, child => {
	      tagName = child.tagName.toLowerCase();

	      if (tagName === 'optgroup') {
	        addGroup(child);
	      } else if (tagName === 'option') {
	        addOption(child);
	      }
	    });
	  };
	  /**
	   * Initialize from a <input type="text"> element.
	   *
	   */


	  var init_textbox = () => {
	    const data_raw = input.getAttribute(attr_data);

	    if (!data_raw) {
	      var value = input.value.trim() || '';
	      if (!settings.allowEmptyOption && !value.length) return;
	      const values = value.split(settings.delimiter);
	      iterate(values, value => {
	        const option = {};
	        option[field_label] = value;
	        option[field_value] = value;
	        settings_element.options.push(option);
	      });
	      settings_element.items = values;
	    } else {
	      settings_element.options = JSON.parse(data_raw);
	      iterate(settings_element.options, opt => {
	        settings_element.items.push(opt[field_value]);
	      });
	    }
	  };

	  if (tag_name === 'select') {
	    init_select();
	  } else {
	    init_textbox();
	  }

	  return Object.assign({}, defaults, settings_element, settings_user);
	}

	var instance_i = 0;
	class TomSelect extends MicroPlugin(MicroEvent) {
	  // @deprecated 1.8
	  constructor(input_arg, user_settings) {
	    super();
	    this.control_input = void 0;
	    this.wrapper = void 0;
	    this.dropdown = void 0;
	    this.control = void 0;
	    this.dropdown_content = void 0;
	    this.focus_node = void 0;
	    this.order = 0;
	    this.settings = void 0;
	    this.input = void 0;
	    this.tabIndex = void 0;
	    this.is_select_tag = void 0;
	    this.rtl = void 0;
	    this.inputId = void 0;
	    this._destroy = void 0;
	    this.sifter = void 0;
	    this.isOpen = false;
	    this.isDisabled = false;
	    this.isRequired = void 0;
	    this.isInvalid = false;
	    this.isValid = true;
	    this.isLocked = false;
	    this.isFocused = false;
	    this.isInputHidden = false;
	    this.isSetup = false;
	    this.ignoreFocus = false;
	    this.ignoreHover = false;
	    this.hasOptions = false;
	    this.currentResults = void 0;
	    this.lastValue = '';
	    this.caretPos = 0;
	    this.loading = 0;
	    this.loadedSearches = {};
	    this.activeOption = null;
	    this.activeItems = [];
	    this.optgroups = {};
	    this.options = {};
	    this.userOptions = {};
	    this.items = [];
	    instance_i++;
	    var dir;
	    var input = getDom(input_arg);

	    if (input.tomselect) {
	      throw new Error('Tom Select already initialized on this element');
	    }

	    input.tomselect = this; // detect rtl environment

	    var computedStyle = window.getComputedStyle && window.getComputedStyle(input, null);
	    dir = computedStyle.getPropertyValue('direction'); // setup default state

	    const settings = getSettings(input, user_settings);
	    this.settings = settings;
	    this.input = input;
	    this.tabIndex = input.tabIndex || 0;
	    this.is_select_tag = input.tagName.toLowerCase() === 'select';
	    this.rtl = /rtl/i.test(dir);
	    this.inputId = getId(input, 'tomselect-' + instance_i);
	    this.isRequired = input.required; // search system

	    this.sifter = new Sifter(this.options, {
	      diacritics: settings.diacritics
	    }); // option-dependent defaults

	    settings.mode = settings.mode || (settings.maxItems === 1 ? 'single' : 'multi');

	    if (typeof settings.hideSelected !== 'boolean') {
	      settings.hideSelected = settings.mode === 'multi';
	    }

	    if (typeof settings.hidePlaceholder !== 'boolean') {
	      settings.hidePlaceholder = settings.mode !== 'multi';
	    } // set up createFilter callback


	    var filter = settings.createFilter;

	    if (typeof filter !== 'function') {
	      if (typeof filter === 'string') {
	        filter = new RegExp(filter);
	      }

	      if (filter instanceof RegExp) {
	        settings.createFilter = input => filter.test(input);
	      } else {
	        settings.createFilter = value => {
	          return this.settings.duplicates || !this.options[value];
	        };
	      }
	    }

	    this.initializePlugins(settings.plugins);
	    this.setupCallbacks();
	    this.setupTemplates(); // Create all elements

	    const wrapper = getDom('<div>');
	    const control = getDom('<div>');

	    const dropdown = this._render('dropdown');

	    const dropdown_content = getDom(`<div role="listbox" tabindex="-1">`);
	    const classes = this.input.getAttribute('class') || '';
	    const inputMode = settings.mode;
	    var control_input;
	    addClasses(wrapper, settings.wrapperClass, classes, inputMode);
	    addClasses(control, settings.controlClass);
	    append(wrapper, control);
	    addClasses(dropdown, settings.dropdownClass, inputMode);

	    if (settings.copyClassesToDropdown) {
	      addClasses(dropdown, classes);
	    }

	    addClasses(dropdown_content, settings.dropdownContentClass);
	    append(dropdown, dropdown_content);
	    getDom(settings.dropdownParent || wrapper).appendChild(dropdown); // default controlInput

	    if (isHtmlString(settings.controlInput)) {
	      control_input = getDom(settings.controlInput); // set attributes

	      var attrs = ['autocorrect', 'autocapitalize', 'autocomplete'];
	      iterate$1(attrs, attr => {
	        if (input.getAttribute(attr)) {
	          setAttr(control_input, {
	            [attr]: input.getAttribute(attr)
	          });
	        }
	      });
	      control_input.tabIndex = -1;
	      control.appendChild(control_input);
	      this.focus_node = control_input; // dom element
	    } else if (settings.controlInput) {
	      control_input = getDom(settings.controlInput);
	      this.focus_node = control_input;
	    } else {
	      control_input = getDom('<input/>');
	      this.focus_node = control;
	    }

	    this.wrapper = wrapper;
	    this.dropdown = dropdown;
	    this.dropdown_content = dropdown_content;
	    this.control = control;
	    this.control_input = control_input;
	    this.setup();
	  }
	  /**
	   * set up event bindings.
	   *
	   */


	  setup() {
	    const self = this;
	    const settings = self.settings;
	    const control_input = self.control_input;
	    const dropdown = self.dropdown;
	    const dropdown_content = self.dropdown_content;
	    const wrapper = self.wrapper;
	    const control = self.control;
	    const input = self.input;
	    const focus_node = self.focus_node;
	    const passive_event = {
	      passive: true
	    };
	    const listboxId = self.inputId + '-ts-dropdown';
	    setAttr(dropdown_content, {
	      id: listboxId
	    });
	    setAttr(focus_node, {
	      role: 'combobox',
	      'aria-haspopup': 'listbox',
	      'aria-expanded': 'false',
	      'aria-controls': listboxId
	    });
	    const control_id = getId(focus_node, self.inputId + '-ts-control');
	    const query = "label[for='" + escapeQuery(self.inputId) + "']";
	    const label = document.querySelector(query);
	    const label_click = self.focus.bind(self);

	    if (label) {
	      addEvent(label, 'click', label_click);
	      setAttr(label, {
	        for: control_id
	      });
	      const label_id = getId(label, self.inputId + '-ts-label');
	      setAttr(focus_node, {
	        'aria-labelledby': label_id
	      });
	      setAttr(dropdown_content, {
	        'aria-labelledby': label_id
	      });
	    }

	    wrapper.style.width = input.style.width;

	    if (self.plugins.names.length) {
	      const classes_plugins = 'plugin-' + self.plugins.names.join(' plugin-');
	      addClasses([wrapper, dropdown], classes_plugins);
	    }

	    if ((settings.maxItems === null || settings.maxItems > 1) && self.is_select_tag) {
	      setAttr(input, {
	        multiple: 'multiple'
	      });
	    }

	    if (settings.placeholder) {
	      setAttr(control_input, {
	        placeholder: settings.placeholder
	      });
	    } // if splitOn was not passed in, construct it from the delimiter to allow pasting universally


	    if (!settings.splitOn && settings.delimiter) {
	      settings.splitOn = new RegExp('\\s*' + escape_regex(settings.delimiter) + '+\\s*');
	    } // debounce user defined load() if loadThrottle > 0
	    // after initializePlugins() so plugins can create/modify user defined loaders


	    if (settings.load && settings.loadThrottle) {
	      settings.load = loadDebounce(settings.load, settings.loadThrottle);
	    }

	    self.control_input.type = input.type;
	    addEvent(dropdown, 'mousemove', () => {
	      self.ignoreHover = false;
	    });
	    addEvent(dropdown, 'mouseenter', e => {
	      var target_match = parentMatch(e.target, '[data-selectable]', dropdown);
	      if (target_match) self.onOptionHover(e, target_match);
	    }, {
	      capture: true
	    }); // clicking on an option should select it

	    addEvent(dropdown, 'click', evt => {
	      const option = parentMatch(evt.target, '[data-selectable]');

	      if (option) {
	        self.onOptionSelect(evt, option);
	        preventDefault(evt, true);
	      }
	    });
	    addEvent(control, 'click', evt => {
	      var target_match = parentMatch(evt.target, '[data-ts-item]', control);

	      if (target_match && self.onItemSelect(evt, target_match)) {
	        preventDefault(evt, true);
	        return;
	      } // retain focus (see control_input mousedown)


	      if (control_input.value != '') {
	        return;
	      }

	      self.onClick();
	      preventDefault(evt, true);
	    }); // keydown on focus_node for arrow_down/arrow_up

	    addEvent(focus_node, 'keydown', e => self.onKeyDown(e)); // keypress and input/keyup

	    addEvent(control_input, 'keypress', e => self.onKeyPress(e));
	    addEvent(control_input, 'input', e => self.onInput(e));
	    addEvent(focus_node, 'blur', e => self.onBlur(e));
	    addEvent(focus_node, 'focus', e => self.onFocus(e));
	    addEvent(control_input, 'paste', e => self.onPaste(e));

	    const doc_mousedown = evt => {
	      // blur if target is outside of this instance
	      // dropdown is not always inside wrapper
	      const target = evt.composedPath()[0];

	      if (!wrapper.contains(target) && !dropdown.contains(target)) {
	        if (self.isFocused) {
	          self.blur();
	        }

	        self.inputState();
	        return;
	      } // retain focus by preventing native handling. if the
	      // event target is the input it should not be modified.
	      // otherwise, text selection within the input won't work.
	      // Fixes bug #212 which is no covered by tests


	      if (target == control_input && self.isOpen) {
	        evt.stopPropagation(); // clicking anywhere in the control should not blur the control_input (which would close the dropdown)
	      } else {
	        preventDefault(evt, true);
	      }
	    };

	    const win_scroll = () => {
	      if (self.isOpen) {
	        self.positionDropdown();
	      }
	    };

	    addEvent(document, 'mousedown', doc_mousedown);
	    addEvent(window, 'scroll', win_scroll, passive_event);
	    addEvent(window, 'resize', win_scroll, passive_event);

	    this._destroy = () => {
	      document.removeEventListener('mousedown', doc_mousedown);
	      window.removeEventListener('scroll', win_scroll);
	      window.removeEventListener('resize', win_scroll);
	      if (label) label.removeEventListener('click', label_click);
	    }; // store original html and tab index so that they can be
	    // restored when the destroy() method is called.


	    this.revertSettings = {
	      innerHTML: input.innerHTML,
	      tabIndex: input.tabIndex
	    };
	    input.tabIndex = -1;
	    input.insertAdjacentElement('afterend', self.wrapper);
	    self.sync(false);
	    settings.items = [];
	    delete settings.optgroups;
	    delete settings.options;
	    addEvent(input, 'invalid', () => {
	      if (self.isValid) {
	        self.isValid = false;
	        self.isInvalid = true;
	        self.refreshState();
	      }
	    });
	    self.updateOriginalInput();
	    self.refreshItems();
	    self.close(false);
	    self.inputState();
	    self.isSetup = true;

	    if (input.disabled) {
	      self.disable();
	    } else {
	      self.enable(); //sets tabIndex
	    }

	    self.on('change', this.onChange);
	    addClasses(input, 'tomselected', 'ts-hidden-accessible');
	    self.trigger('initialize'); // preload options

	    if (settings.preload === true) {
	      self.preload();
	    }
	  }
	  /**
	   * Register options and optgroups
	   *
	   */


	  setupOptions(options = [], optgroups = []) {
	    // build options table
	    this.addOptions(options); // build optgroup table

	    iterate$1(optgroups, optgroup => {
	      this.registerOptionGroup(optgroup);
	    });
	  }
	  /**
	   * Sets up default rendering functions.
	   */


	  setupTemplates() {
	    var self = this;
	    var field_label = self.settings.labelField;
	    var field_optgroup = self.settings.optgroupLabelField;
	    var templates = {
	      'optgroup': data => {
	        let optgroup = document.createElement('div');
	        optgroup.className = 'optgroup';
	        optgroup.appendChild(data.options);
	        return optgroup;
	      },
	      'optgroup_header': (data, escape) => {
	        return '<div class="optgroup-header">' + escape(data[field_optgroup]) + '</div>';
	      },
	      'option': (data, escape) => {
	        return '<div>' + escape(data[field_label]) + '</div>';
	      },
	      'item': (data, escape) => {
	        return '<div>' + escape(data[field_label]) + '</div>';
	      },
	      'option_create': (data, escape) => {
	        return '<div class="create">Add <strong>' + escape(data.input) + '</strong>&hellip;</div>';
	      },
	      'no_results': () => {
	        return '<div class="no-results">No results found</div>';
	      },
	      'loading': () => {
	        return '<div class="spinner"></div>';
	      },
	      'not_loading': () => {},
	      'dropdown': () => {
	        return '<div></div>';
	      }
	    };
	    self.settings.render = Object.assign({}, templates, self.settings.render);
	  }
	  /**
	   * Maps fired events to callbacks provided
	   * in the settings used when creating the control.
	   */


	  setupCallbacks() {
	    var key, fn;
	    var callbacks = {
	      'initialize': 'onInitialize',
	      'change': 'onChange',
	      'item_add': 'onItemAdd',
	      'item_remove': 'onItemRemove',
	      'item_select': 'onItemSelect',
	      'clear': 'onClear',
	      'option_add': 'onOptionAdd',
	      'option_remove': 'onOptionRemove',
	      'option_clear': 'onOptionClear',
	      'optgroup_add': 'onOptionGroupAdd',
	      'optgroup_remove': 'onOptionGroupRemove',
	      'optgroup_clear': 'onOptionGroupClear',
	      'dropdown_open': 'onDropdownOpen',
	      'dropdown_close': 'onDropdownClose',
	      'type': 'onType',
	      'load': 'onLoad',
	      'focus': 'onFocus',
	      'blur': 'onBlur'
	    };

	    for (key in callbacks) {
	      fn = this.settings[callbacks[key]];
	      if (fn) this.on(key, fn);
	    }
	  }
	  /**
	   * Sync the Tom Select instance with the original input or select
	   *
	   */


	  sync(get_settings = true) {
	    const self = this;
	    const settings = get_settings ? getSettings(self.input, {
	      delimiter: self.settings.delimiter
	    }) : self.settings;
	    self.setupOptions(settings.options, settings.optgroups);
	    self.setValue(settings.items || [], true); // silent prevents recursion

	    self.lastQuery = null; // so updated options will be displayed in dropdown
	  }
	  /**
	   * Triggered when the main control element
	   * has a click event.
	   *
	   */


	  onClick() {
	    var self = this;

	    if (self.activeItems.length > 0) {
	      self.clearActiveItems();
	      self.focus();
	      return;
	    }

	    if (self.isFocused && self.isOpen) {
	      self.blur();
	    } else {
	      self.focus();
	    }
	  }
	  /**
	   * @deprecated v1.7
	   *
	   */


	  onMouseDown() {}
	  /**
	   * Triggered when the value of the control has been changed.
	   * This should propagate the event to the original DOM
	   * input / select element.
	   */


	  onChange() {
	    triggerEvent(this.input, 'input');
	    triggerEvent(this.input, 'change');
	  }
	  /**
	   * Triggered on <input> paste.
	   *
	   */


	  onPaste(e) {
	    var self = this;

	    if (self.isInputHidden || self.isLocked) {
	      preventDefault(e);
	      return;
	    } // If a regex or string is included, this will split the pasted
	    // input and create Items for each separate value


	    if (!self.settings.splitOn) {
	      return;
	    } // Wait for pasted text to be recognized in value


	    setTimeout(() => {
	      var pastedText = self.inputValue();

	      if (!pastedText.match(self.settings.splitOn)) {
	        return;
	      }

	      var splitInput = pastedText.trim().split(self.settings.splitOn);
	      iterate$1(splitInput, piece => {
	        const hash = hash_key(piece);

	        if (hash) {
	          if (this.options[piece]) {
	            self.addItem(piece);
	          } else {
	            self.createItem(piece);
	          }
	        }
	      });
	    }, 0);
	  }
	  /**
	   * Triggered on <input> keypress.
	   *
	   */


	  onKeyPress(e) {
	    var self = this;

	    if (self.isLocked) {
	      preventDefault(e);
	      return;
	    }

	    var character = String.fromCharCode(e.keyCode || e.which);

	    if (self.settings.create && self.settings.mode === 'multi' && character === self.settings.delimiter) {
	      self.createItem();
	      preventDefault(e);
	      return;
	    }
	  }
	  /**
	   * Triggered on <input> keydown.
	   *
	   */


	  onKeyDown(e) {
	    var self = this;
	    self.ignoreHover = true;

	    if (self.isLocked) {
	      if (e.keyCode !== KEY_TAB) {
	        preventDefault(e);
	      }

	      return;
	    }

	    switch (e.keyCode) {
	      // ctrl+A: select all
	      case KEY_A:
	        if (isKeyDown(KEY_SHORTCUT, e)) {
	          if (self.control_input.value == '') {
	            preventDefault(e);
	            self.selectAll();
	            return;
	          }
	        }

	        break;
	      // esc: close dropdown

	      case KEY_ESC:
	        if (self.isOpen) {
	          preventDefault(e, true);
	          self.close();
	        }

	        self.clearActiveItems();
	        return;
	      // down: open dropdown or move selection down

	      case KEY_DOWN:
	        if (!self.isOpen && self.hasOptions) {
	          self.open();
	        } else if (self.activeOption) {
	          let next = self.getAdjacent(self.activeOption, 1);
	          if (next) self.setActiveOption(next);
	        }

	        preventDefault(e);
	        return;
	      // up: move selection up

	      case KEY_UP:
	        if (self.activeOption) {
	          let prev = self.getAdjacent(self.activeOption, -1);
	          if (prev) self.setActiveOption(prev);
	        }

	        preventDefault(e);
	        return;
	      // return: select active option

	      case KEY_RETURN:
	        if (self.canSelect(self.activeOption)) {
	          self.onOptionSelect(e, self.activeOption);
	          preventDefault(e); // if the option_create=null, the dropdown might be closed
	        } else if (self.settings.create && self.createItem()) {
	          preventDefault(e); // don't submit form when searching for a value
	        } else if (document.activeElement == self.control_input && self.isOpen) {
	          preventDefault(e);
	        }

	        return;
	      // left: modifiy item selection to the left

	      case KEY_LEFT:
	        self.advanceSelection(-1, e);
	        return;
	      // right: modifiy item selection to the right

	      case KEY_RIGHT:
	        self.advanceSelection(1, e);
	        return;
	      // tab: select active option and/or create item

	      case KEY_TAB:
	        if (self.settings.selectOnTab) {
	          if (self.canSelect(self.activeOption)) {
	            self.onOptionSelect(e, self.activeOption); // prevent default [tab] behaviour of jump to the next field
	            // if select isFull, then the dropdown won't be open and [tab] will work normally

	            preventDefault(e);
	          }

	          if (self.settings.create && self.createItem()) {
	            preventDefault(e);
	          }
	        }

	        return;
	      // delete|backspace: delete items

	      case KEY_BACKSPACE:
	      case KEY_DELETE:
	        self.deleteSelection(e);
	        return;
	    } // don't enter text in the control_input when active items are selected


	    if (self.isInputHidden && !isKeyDown(KEY_SHORTCUT, e)) {
	      preventDefault(e);
	    }
	  }
	  /**
	   * Triggered on <input> keyup.
	   *
	   */


	  onInput(e) {
	    var self = this;

	    if (self.isLocked) {
	      return;
	    }

	    var value = self.inputValue();

	    if (self.lastValue !== value) {
	      self.lastValue = value;

	      if (self.settings.shouldLoad.call(self, value)) {
	        self.load(value);
	      }

	      self.refreshOptions();
	      self.trigger('type', value);
	    }
	  }
	  /**
	   * Triggered when the user rolls over
	   * an option in the autocomplete dropdown menu.
	   *
	   */


	  onOptionHover(evt, option) {
	    if (this.ignoreHover) return;
	    this.setActiveOption(option, false);
	  }
	  /**
	   * Triggered on <input> focus.
	   *
	   */


	  onFocus(e) {
	    var self = this;
	    var wasFocused = self.isFocused;

	    if (self.isDisabled) {
	      self.blur();
	      preventDefault(e);
	      return;
	    }

	    if (self.ignoreFocus) return;
	    self.isFocused = true;
	    if (self.settings.preload === 'focus') self.preload();
	    if (!wasFocused) self.trigger('focus');

	    if (!self.activeItems.length) {
	      self.showInput();
	      self.refreshOptions(!!self.settings.openOnFocus);
	    }

	    self.refreshState();
	  }
	  /**
	   * Triggered on <input> blur.
	   *
	   */


	  onBlur(e) {
	    if (document.hasFocus() === false) return;
	    var self = this;
	    if (!self.isFocused) return;
	    self.isFocused = false;
	    self.ignoreFocus = false;

	    var deactivate = () => {
	      self.close();
	      self.setActiveItem();
	      self.setCaret(self.items.length);
	      self.trigger('blur');
	    };

	    if (self.settings.create && self.settings.createOnBlur) {
	      self.createItem(null, deactivate);
	    } else {
	      deactivate();
	    }
	  }
	  /**
	   * Triggered when the user clicks on an option
	   * in the autocomplete dropdown menu.
	   *
	   */


	  onOptionSelect(evt, option) {
	    var value,
	        self = this; // should not be possible to trigger a option under a disabled optgroup

	    if (option.parentElement && option.parentElement.matches('[data-disabled]')) {
	      return;
	    }

	    if (option.classList.contains('create')) {
	      self.createItem(null, () => {
	        if (self.settings.closeAfterSelect) {
	          self.close();
	        }
	      });
	    } else {
	      value = option.dataset.value;

	      if (typeof value !== 'undefined') {
	        self.lastQuery = null;
	        self.addItem(value);

	        if (self.settings.closeAfterSelect) {
	          self.close();
	        }

	        if (!self.settings.hideSelected && evt.type && /click/.test(evt.type)) {
	          self.setActiveOption(option);
	        }
	      }
	    }
	  }
	  /**
	   * Return true if the given option can be selected
	   *
	   */


	  canSelect(option) {
	    if (this.isOpen && option && this.dropdown_content.contains(option)) {
	      return true;
	    }

	    return false;
	  }
	  /**
	   * Triggered when the user clicks on an item
	   * that has been selected.
	   *
	   */


	  onItemSelect(evt, item) {
	    var self = this;

	    if (!self.isLocked && self.settings.mode === 'multi') {
	      preventDefault(evt);
	      self.setActiveItem(item, evt);
	      return true;
	    }

	    return false;
	  }
	  /**
	   * Determines whether or not to invoke
	   * the user-provided option provider / loader
	   *
	   * Note, there is a subtle difference between
	   * this.canLoad() and this.settings.shouldLoad();
	   *
	   *	- settings.shouldLoad() is a user-input validator.
	   *	When false is returned, the not_loading template
	   *	will be added to the dropdown
	   *
	   *	- canLoad() is lower level validator that checks
	   * 	the Tom Select instance. There is no inherent user
	   *	feedback when canLoad returns false
	   *
	   */


	  canLoad(value) {
	    if (!this.settings.load) return false;
	    if (this.loadedSearches.hasOwnProperty(value)) return false;
	    return true;
	  }
	  /**
	   * Invokes the user-provided option provider / loader.
	   *
	   */


	  load(value) {
	    const self = this;
	    if (!self.canLoad(value)) return;
	    addClasses(self.wrapper, self.settings.loadingClass);
	    self.loading++;
	    const callback = self.loadCallback.bind(self);
	    self.settings.load.call(self, value, callback);
	  }
	  /**
	   * Invoked by the user-provided option provider
	   *
	   */


	  loadCallback(options, optgroups) {
	    const self = this;
	    self.loading = Math.max(self.loading - 1, 0);
	    self.lastQuery = null;
	    self.clearActiveOption(); // when new results load, focus should be on first option

	    self.setupOptions(options, optgroups);
	    self.refreshOptions(self.isFocused && !self.isInputHidden);

	    if (!self.loading) {
	      removeClasses(self.wrapper, self.settings.loadingClass);
	    }

	    self.trigger('load', options, optgroups);
	  }

	  preload() {
	    var classList = this.wrapper.classList;
	    if (classList.contains('preloaded')) return;
	    classList.add('preloaded');
	    this.load('');
	  }
	  /**
	   * Sets the input field of the control to the specified value.
	   *
	   */


	  setTextboxValue(value = '') {
	    var input = this.control_input;
	    var changed = input.value !== value;

	    if (changed) {
	      input.value = value;
	      triggerEvent(input, 'update');
	      this.lastValue = value;
	    }
	  }
	  /**
	   * Returns the value of the control. If multiple items
	   * can be selected (e.g. <select multiple>), this returns
	   * an array. If only one item can be selected, this
	   * returns a string.
	   *
	   */


	  getValue() {
	    if (this.is_select_tag && this.input.hasAttribute('multiple')) {
	      return this.items;
	    }

	    return this.items.join(this.settings.delimiter);
	  }
	  /**
	   * Resets the selected items to the given value.
	   *
	   */


	  setValue(value, silent) {
	    var events = silent ? [] : ['change'];
	    debounce_events(this, events, () => {
	      this.clear(silent);
	      this.addItems(value, silent);
	    });
	  }
	  /**
	   * Resets the number of max items to the given value
	   *
	   */


	  setMaxItems(value) {
	    if (value === 0) value = null; //reset to unlimited items.

	    this.settings.maxItems = value;
	    this.refreshState();
	  }
	  /**
	   * Sets the selected item.
	   *
	   */


	  setActiveItem(item, e) {
	    var self = this;
	    var eventName;
	    var i, begin, end, swap;
	    var last;
	    if (self.settings.mode === 'single') return; // clear the active selection

	    if (!item) {
	      self.clearActiveItems();

	      if (self.isFocused) {
	        self.showInput();
	      }

	      return;
	    } // modify selection


	    eventName = e && e.type.toLowerCase();

	    if (eventName === 'click' && isKeyDown('shiftKey', e) && self.activeItems.length) {
	      last = self.getLastActive();
	      begin = Array.prototype.indexOf.call(self.control.children, last);
	      end = Array.prototype.indexOf.call(self.control.children, item);

	      if (begin > end) {
	        swap = begin;
	        begin = end;
	        end = swap;
	      }

	      for (i = begin; i <= end; i++) {
	        item = self.control.children[i];

	        if (self.activeItems.indexOf(item) === -1) {
	          self.setActiveItemClass(item);
	        }
	      }

	      preventDefault(e);
	    } else if (eventName === 'click' && isKeyDown(KEY_SHORTCUT, e) || eventName === 'keydown' && isKeyDown('shiftKey', e)) {
	      if (item.classList.contains('active')) {
	        self.removeActiveItem(item);
	      } else {
	        self.setActiveItemClass(item);
	      }
	    } else {
	      self.clearActiveItems();
	      self.setActiveItemClass(item);
	    } // ensure control has focus


	    self.hideInput();

	    if (!self.isFocused) {
	      self.focus();
	    }
	  }
	  /**
	   * Set the active and last-active classes
	   *
	   */


	  setActiveItemClass(item) {
	    const self = this;
	    const last_active = self.control.querySelector('.last-active');
	    if (last_active) removeClasses(last_active, 'last-active');
	    addClasses(item, 'active last-active');
	    self.trigger('item_select', item);

	    if (self.activeItems.indexOf(item) == -1) {
	      self.activeItems.push(item);
	    }
	  }
	  /**
	   * Remove active item
	   *
	   */


	  removeActiveItem(item) {
	    var idx = this.activeItems.indexOf(item);
	    this.activeItems.splice(idx, 1);
	    removeClasses(item, 'active');
	  }
	  /**
	   * Clears all the active items
	   *
	   */


	  clearActiveItems() {
	    removeClasses(this.activeItems, 'active');
	    this.activeItems = [];
	  }
	  /**
	   * Sets the selected item in the dropdown menu
	   * of available options.
	   *
	   */


	  setActiveOption(option, scroll = true) {
	    if (option === this.activeOption) {
	      return;
	    }

	    this.clearActiveOption();
	    if (!option) return;
	    this.activeOption = option;
	    setAttr(this.focus_node, {
	      'aria-activedescendant': option.getAttribute('id')
	    });
	    setAttr(option, {
	      'aria-selected': 'true'
	    });
	    addClasses(option, 'active');
	    if (scroll) this.scrollToOption(option);
	  }
	  /**
	   * Sets the dropdown_content scrollTop to display the option
	   *
	   */


	  scrollToOption(option, behavior) {
	    if (!option) return;
	    const content = this.dropdown_content;
	    const height_menu = content.clientHeight;
	    const scrollTop = content.scrollTop || 0;
	    const height_item = option.offsetHeight;
	    const y = option.getBoundingClientRect().top - content.getBoundingClientRect().top + scrollTop;

	    if (y + height_item > height_menu + scrollTop) {
	      this.scroll(y - height_menu + height_item, behavior);
	    } else if (y < scrollTop) {
	      this.scroll(y, behavior);
	    }
	  }
	  /**
	   * Scroll the dropdown to the given position
	   *
	   */


	  scroll(scrollTop, behavior) {
	    const content = this.dropdown_content;

	    if (behavior) {
	      content.style.scrollBehavior = behavior;
	    }

	    content.scrollTop = scrollTop;
	    content.style.scrollBehavior = '';
	  }
	  /**
	   * Clears the active option
	   *
	   */


	  clearActiveOption() {
	    if (this.activeOption) {
	      removeClasses(this.activeOption, 'active');
	      setAttr(this.activeOption, {
	        'aria-selected': null
	      });
	    }

	    this.activeOption = null;
	    setAttr(this.focus_node, {
	      'aria-activedescendant': null
	    });
	  }
	  /**
	   * Selects all items (CTRL + A).
	   */


	  selectAll() {
	    const self = this;
	    if (self.settings.mode === 'single') return;
	    const activeItems = self.controlChildren();
	    if (!activeItems.length) return;
	    self.hideInput();
	    self.close();
	    self.activeItems = activeItems;
	    iterate$1(activeItems, item => {
	      self.setActiveItemClass(item);
	    });
	  }
	  /**
	   * Determines if the control_input should be in a hidden or visible state
	   *
	   */


	  inputState() {
	    var self = this;
	    if (!self.control.contains(self.control_input)) return;
	    setAttr(self.control_input, {
	      placeholder: self.settings.placeholder
	    });

	    if (self.activeItems.length > 0 || !self.isFocused && self.settings.hidePlaceholder && self.items.length > 0) {
	      self.setTextboxValue();
	      self.isInputHidden = true;
	    } else {
	      if (self.settings.hidePlaceholder && self.items.length > 0) {
	        setAttr(self.control_input, {
	          placeholder: ''
	        });
	      }

	      self.isInputHidden = false;
	    }

	    self.wrapper.classList.toggle('input-hidden', self.isInputHidden);
	  }
	  /**
	   * Hides the input element out of view, while
	   * retaining its focus.
	   * @deprecated 1.3
	   */


	  hideInput() {
	    this.inputState();
	  }
	  /**
	   * Restores input visibility.
	   * @deprecated 1.3
	   */


	  showInput() {
	    this.inputState();
	  }
	  /**
	   * Get the input value
	   */


	  inputValue() {
	    return this.control_input.value.trim();
	  }
	  /**
	   * Gives the control focus.
	   */


	  focus() {
	    var self = this;
	    if (self.isDisabled) return;
	    self.ignoreFocus = true;

	    if (self.control_input.offsetWidth) {
	      self.control_input.focus();
	    } else {
	      self.focus_node.focus();
	    }

	    setTimeout(() => {
	      self.ignoreFocus = false;
	      self.onFocus();
	    }, 0);
	  }
	  /**
	   * Forces the control out of focus.
	   *
	   */


	  blur() {
	    this.focus_node.blur();
	    this.onBlur();
	  }
	  /**
	   * Returns a function that scores an object
	   * to show how good of a match it is to the
	   * provided query.
	   *
	   * @return {function}
	   */


	  getScoreFunction(query) {
	    return this.sifter.getScoreFunction(query, this.getSearchOptions());
	  }
	  /**
	   * Returns search options for sifter (the system
	   * for scoring and sorting results).
	   *
	   * @see https://github.com/orchidjs/sifter.js
	   * @return {object}
	   */


	  getSearchOptions() {
	    var settings = this.settings;
	    var sort = settings.sortField;

	    if (typeof settings.sortField === 'string') {
	      sort = [{
	        field: settings.sortField
	      }];
	    }

	    return {
	      fields: settings.searchField,
	      conjunction: settings.searchConjunction,
	      sort: sort,
	      nesting: settings.nesting
	    };
	  }
	  /**
	   * Searches through available options and returns
	   * a sorted array of matches.
	   *
	   */


	  search(query) {
	    var result, calculateScore;
	    var self = this;
	    var options = this.getSearchOptions(); // validate user-provided result scoring function

	    if (self.settings.score) {
	      calculateScore = self.settings.score.call(self, query);

	      if (typeof calculateScore !== 'function') {
	        throw new Error('Tom Select "score" setting must be a function that returns a function');
	      }
	    } // perform search


	    if (query !== self.lastQuery) {
	      self.lastQuery = query;
	      result = self.sifter.search(query, Object.assign(options, {
	        score: calculateScore
	      }));
	      self.currentResults = result;
	    } else {
	      result = Object.assign({}, self.currentResults);
	    } // filter out selected items


	    if (self.settings.hideSelected) {
	      result.items = result.items.filter(item => {
	        let hashed = hash_key(item.id);
	        return !(hashed && self.items.indexOf(hashed) !== -1);
	      });
	    }

	    return result;
	  }
	  /**
	   * Refreshes the list of available options shown
	   * in the autocomplete dropdown menu.
	   *
	   */


	  refreshOptions(triggerDropdown = true) {
	    var i, j, k, n, optgroup, optgroups, html, has_create_option, active_group;
	    var create;
	    const groups = {};
	    const groups_order = [];
	    var self = this;
	    var query = self.inputValue();
	    const same_query = query === self.lastQuery || query == '' && self.lastQuery == null;
	    var results = self.search(query);
	    var active_option = null;
	    var show_dropdown = self.settings.shouldOpen || false;
	    var dropdown_content = self.dropdown_content;

	    if (same_query) {
	      active_option = self.activeOption;

	      if (active_option) {
	        active_group = active_option.closest('[data-group]');
	      }
	    } // build markup


	    n = results.items.length;

	    if (typeof self.settings.maxOptions === 'number') {
	      n = Math.min(n, self.settings.maxOptions);
	    }

	    if (n > 0) {
	      show_dropdown = true;
	    } // render and group available options individually


	    for (i = 0; i < n; i++) {
	      // get option dom element
	      let item = results.items[i];
	      if (!item) continue;
	      let opt_value = item.id;
	      let option = self.options[opt_value];
	      if (option === undefined) continue;
	      let opt_hash = get_hash(opt_value);
	      let option_el = self.getOption(opt_hash, true); // toggle 'selected' class

	      if (!self.settings.hideSelected) {
	        option_el.classList.toggle('selected', self.items.includes(opt_hash));
	      }

	      optgroup = option[self.settings.optgroupField] || '';
	      optgroups = Array.isArray(optgroup) ? optgroup : [optgroup];

	      for (j = 0, k = optgroups && optgroups.length; j < k; j++) {
	        optgroup = optgroups[j];

	        if (!self.optgroups.hasOwnProperty(optgroup)) {
	          optgroup = '';
	        }

	        let group_fragment = groups[optgroup];

	        if (group_fragment === undefined) {
	          group_fragment = document.createDocumentFragment();
	          groups_order.push(optgroup);
	        } // nodes can only have one parent, so if the option is in mutple groups, we need a clone


	        if (j > 0) {
	          option_el = option_el.cloneNode(true);
	          setAttr(option_el, {
	            id: option.$id + '-clone-' + j,
	            'aria-selected': null
	          });
	          option_el.classList.add('ts-cloned');
	          removeClasses(option_el, 'active'); // make sure we keep the activeOption in the same group

	          if (self.activeOption && self.activeOption.dataset.value == opt_value) {
	            if (active_group && active_group.dataset.group === optgroup.toString()) {
	              active_option = option_el;
	            }
	          }
	        }

	        group_fragment.appendChild(option_el);
	        groups[optgroup] = group_fragment;
	      }
	    } // sort optgroups


	    if (self.settings.lockOptgroupOrder) {
	      groups_order.sort((a, b) => {
	        const grp_a = self.optgroups[a];
	        const grp_b = self.optgroups[b];
	        const a_order = grp_a && grp_a.$order || 0;
	        const b_order = grp_b && grp_b.$order || 0;
	        return a_order - b_order;
	      });
	    } // render optgroup headers & join groups


	    html = document.createDocumentFragment();
	    iterate$1(groups_order, optgroup => {
	      let group_fragment = groups[optgroup];
	      if (!group_fragment || !group_fragment.children.length) return;
	      let group_heading = self.optgroups[optgroup];

	      if (group_heading !== undefined) {
	        let group_options = document.createDocumentFragment();
	        let header = self.render('optgroup_header', group_heading);
	        append(group_options, header);
	        append(group_options, group_fragment);
	        let group_html = self.render('optgroup', {
	          group: group_heading,
	          options: group_options
	        });
	        append(html, group_html);
	      } else {
	        append(html, group_fragment);
	      }
	    });
	    dropdown_content.innerHTML = '';
	    append(dropdown_content, html); // highlight matching terms inline

	    if (self.settings.highlight) {
	      removeHighlight(dropdown_content);

	      if (results.query.length && results.tokens.length) {
	        iterate$1(results.tokens, tok => {
	          highlight(dropdown_content, tok.regex);
	        });
	      }
	    } // helper method for adding templates to dropdown


	    var add_template = template => {
	      let content = self.render(template, {
	        input: query
	      });

	      if (content) {
	        show_dropdown = true;
	        dropdown_content.insertBefore(content, dropdown_content.firstChild);
	      }

	      return content;
	    }; // add loading message


	    if (self.loading) {
	      add_template('loading'); // invalid query
	    } else if (!self.settings.shouldLoad.call(self, query)) {
	      add_template('not_loading'); // add no_results message
	    } else if (results.items.length === 0) {
	      add_template('no_results');
	    } // add create option


	    has_create_option = self.canCreate(query);

	    if (has_create_option) {
	      create = add_template('option_create');
	    } // activate


	    self.hasOptions = results.items.length > 0 || has_create_option;

	    if (show_dropdown) {
	      if (results.items.length > 0) {
	        if (!active_option && self.settings.mode === 'single' && self.items[0] != undefined) {
	          active_option = self.getOption(self.items[0]);
	        }

	        if (!dropdown_content.contains(active_option)) {
	          let active_index = 0;

	          if (create && !self.settings.addPrecedence) {
	            active_index = 1;
	          }

	          active_option = self.selectable()[active_index];
	        }
	      } else if (create) {
	        active_option = create;
	      }

	      if (triggerDropdown && !self.isOpen) {
	        self.open();
	        self.scrollToOption(active_option, 'auto');
	      }

	      self.setActiveOption(active_option);
	    } else {
	      self.clearActiveOption();

	      if (triggerDropdown && self.isOpen) {
	        self.close(false); // if create_option=null, we want the dropdown to close but not reset the textbox value
	      }
	    }
	  }
	  /**
	   * Return list of selectable options
	   *
	   */


	  selectable() {
	    return this.dropdown_content.querySelectorAll('[data-selectable]');
	  }
	  /**
	   * Adds an available option. If it already exists,
	   * nothing will happen. Note: this does not refresh
	   * the options list dropdown (use `refreshOptions`
	   * for that).
	   *
	   * Usage:
	   *
	   *   this.addOption(data)
	   *
	   */


	  addOption(data, user_created = false) {
	    const self = this; // @deprecated 1.7.7
	    // use addOptions( array, user_created ) for adding multiple options

	    if (Array.isArray(data)) {
	      self.addOptions(data, user_created);
	      return false;
	    }

	    const key = hash_key(data[self.settings.valueField]);

	    if (key === null || self.options.hasOwnProperty(key)) {
	      return false;
	    }

	    data.$order = data.$order || ++self.order;
	    data.$id = self.inputId + '-opt-' + data.$order;
	    self.options[key] = data;
	    self.lastQuery = null;

	    if (user_created) {
	      self.userOptions[key] = user_created;
	      self.trigger('option_add', key, data);
	    }

	    return key;
	  }
	  /**
	   * Add multiple options
	   *
	   */


	  addOptions(data, user_created = false) {
	    iterate$1(data, dat => {
	      this.addOption(dat, user_created);
	    });
	  }
	  /**
	   * @deprecated 1.7.7
	   */


	  registerOption(data) {
	    return this.addOption(data);
	  }
	  /**
	   * Registers an option group to the pool of option groups.
	   *
	   * @return {boolean|string}
	   */


	  registerOptionGroup(data) {
	    var key = hash_key(data[this.settings.optgroupValueField]);
	    if (key === null) return false;
	    data.$order = data.$order || ++this.order;
	    this.optgroups[key] = data;
	    return key;
	  }
	  /**
	   * Registers a new optgroup for options
	   * to be bucketed into.
	   *
	   */


	  addOptionGroup(id, data) {
	    var hashed_id;
	    data[this.settings.optgroupValueField] = id;

	    if (hashed_id = this.registerOptionGroup(data)) {
	      this.trigger('optgroup_add', hashed_id, data);
	    }
	  }
	  /**
	   * Removes an existing option group.
	   *
	   */


	  removeOptionGroup(id) {
	    if (this.optgroups.hasOwnProperty(id)) {
	      delete this.optgroups[id];
	      this.clearCache();
	      this.trigger('optgroup_remove', id);
	    }
	  }
	  /**
	   * Clears all existing option groups.
	   */


	  clearOptionGroups() {
	    this.optgroups = {};
	    this.clearCache();
	    this.trigger('optgroup_clear');
	  }
	  /**
	   * Updates an option available for selection. If
	   * it is visible in the selected items or options
	   * dropdown, it will be re-rendered automatically.
	   *
	   */


	  updateOption(value, data) {
	    const self = this;
	    var item_new;
	    var index_item;
	    const value_old = hash_key(value);
	    const value_new = hash_key(data[self.settings.valueField]); // sanity checks

	    if (value_old === null) return;
	    const data_old = self.options[value_old];
	    if (data_old == undefined) return;
	    if (typeof value_new !== 'string') throw new Error('Value must be set in option data');
	    const option = self.getOption(value_old);
	    const item = self.getItem(value_old);
	    data.$order = data.$order || data_old.$order;
	    delete self.options[value_old]; // invalidate render cache
	    // don't remove existing node yet, we'll remove it after replacing it

	    self.uncacheValue(value_new);
	    self.options[value_new] = data; // update the option if it's in the dropdown

	    if (option) {
	      if (self.dropdown_content.contains(option)) {
	        const option_new = self._render('option', data);

	        replaceNode(option, option_new);

	        if (self.activeOption === option) {
	          self.setActiveOption(option_new);
	        }
	      }

	      option.remove();
	    } // update the item if we have one


	    if (item) {
	      index_item = self.items.indexOf(value_old);

	      if (index_item !== -1) {
	        self.items.splice(index_item, 1, value_new);
	      }

	      item_new = self._render('item', data);
	      if (item.classList.contains('active')) addClasses(item_new, 'active');
	      replaceNode(item, item_new);
	    } // invalidate last query because we might have updated the sortField


	    self.lastQuery = null;
	  }
	  /**
	   * Removes a single option.
	   *
	   */


	  removeOption(value, silent) {
	    const self = this;
	    value = get_hash(value);
	    self.uncacheValue(value);
	    delete self.userOptions[value];
	    delete self.options[value];
	    self.lastQuery = null;
	    self.trigger('option_remove', value);
	    self.removeItem(value, silent);
	  }
	  /**
	   * Clears all options.
	   */


	  clearOptions(filter) {
	    const boundFilter = (filter || this.clearFilter).bind(this);
	    this.loadedSearches = {};
	    this.userOptions = {};
	    this.clearCache();
	    const selected = {};
	    iterate$1(this.options, (option, key) => {
	      if (boundFilter(option, key)) {
	        selected[key] = option;
	      }
	    });
	    this.options = this.sifter.items = selected;
	    this.lastQuery = null;
	    this.trigger('option_clear');
	  }
	  /**
	   * Used by clearOptions() to decide whether or not an option should be removed
	   * Return true to keep an option, false to remove
	   *
	   */


	  clearFilter(option, value) {
	    if (this.items.indexOf(value) >= 0) {
	      return true;
	    }

	    return false;
	  }
	  /**
	   * Returns the dom element of the option
	   * matching the given value.
	   *
	   */


	  getOption(value, create = false) {
	    const hashed = hash_key(value);
	    if (hashed === null) return null;
	    const option = this.options[hashed];

	    if (option != undefined) {
	      if (option.$div) {
	        return option.$div;
	      }

	      if (create) {
	        return this._render('option', option);
	      }
	    }

	    return null;
	  }
	  /**
	   * Returns the dom element of the next or previous dom element of the same type
	   * Note: adjacent options may not be adjacent DOM elements (optgroups)
	   *
	   */


	  getAdjacent(option, direction, type = 'option') {
	    var self = this,
	        all;

	    if (!option) {
	      return null;
	    }

	    if (type == 'item') {
	      all = self.controlChildren();
	    } else {
	      all = self.dropdown_content.querySelectorAll('[data-selectable]');
	    }

	    for (let i = 0; i < all.length; i++) {
	      if (all[i] != option) {
	        continue;
	      }

	      if (direction > 0) {
	        return all[i + 1];
	      }

	      return all[i - 1];
	    }

	    return null;
	  }
	  /**
	   * Returns the dom element of the item
	   * matching the given value.
	   *
	   */


	  getItem(item) {
	    if (typeof item == 'object') {
	      return item;
	    }

	    var value = hash_key(item);
	    return value !== null ? this.control.querySelector(`[data-value="${addSlashes(value)}"]`) : null;
	  }
	  /**
	   * "Selects" multiple items at once. Adds them to the list
	   * at the current caret position.
	   *
	   */


	  addItems(values, silent) {
	    var self = this;
	    var items = Array.isArray(values) ? values : [values];
	    items = items.filter(x => self.items.indexOf(x) === -1);
	    const last_item = items[items.length - 1];
	    items.forEach(item => {
	      self.isPending = item !== last_item;
	      self.addItem(item, silent);
	    });
	  }
	  /**
	   * "Selects" an item. Adds it to the list
	   * at the current caret position.
	   *
	   */


	  addItem(value, silent) {
	    var events = silent ? [] : ['change', 'dropdown_close'];
	    debounce_events(this, events, () => {
	      var item, wasFull;
	      const self = this;
	      const inputMode = self.settings.mode;
	      const hashed = hash_key(value);

	      if (hashed && self.items.indexOf(hashed) !== -1) {
	        if (inputMode === 'single') {
	          self.close();
	        }

	        if (inputMode === 'single' || !self.settings.duplicates) {
	          return;
	        }
	      }

	      if (hashed === null || !self.options.hasOwnProperty(hashed)) return;
	      if (inputMode === 'single') self.clear(silent);
	      if (inputMode === 'multi' && self.isFull()) return;
	      item = self._render('item', self.options[hashed]);

	      if (self.control.contains(item)) {
	        // duplicates
	        item = item.cloneNode(true);
	      }

	      wasFull = self.isFull();
	      self.items.splice(self.caretPos, 0, hashed);
	      self.insertAtCaret(item);

	      if (self.isSetup) {
	        // update menu / remove the option (if this is not one item being added as part of series)
	        if (!self.isPending && self.settings.hideSelected) {
	          let option = self.getOption(hashed);
	          let next = self.getAdjacent(option, 1);

	          if (next) {
	            self.setActiveOption(next);
	          }
	        } // refreshOptions after setActiveOption(),
	        // otherwise setActiveOption() will be called by refreshOptions() with the wrong value


	        if (!self.isPending && !self.settings.closeAfterSelect) {
	          self.refreshOptions(self.isFocused && inputMode !== 'single');
	        } // hide the menu if the maximum number of items have been selected or no options are left


	        if (self.settings.closeAfterSelect != false && self.isFull()) {
	          self.close();
	        } else if (!self.isPending) {
	          self.positionDropdown();
	        }

	        self.trigger('item_add', hashed, item);

	        if (!self.isPending) {
	          self.updateOriginalInput({
	            silent: silent
	          });
	        }
	      }

	      if (!self.isPending || !wasFull && self.isFull()) {
	        self.inputState();
	        self.refreshState();
	      }
	    });
	  }
	  /**
	   * Removes the selected item matching
	   * the provided value.
	   *
	   */


	  removeItem(item = null, silent) {
	    const self = this;
	    item = self.getItem(item);
	    if (!item) return;
	    var i, idx;
	    const value = item.dataset.value;
	    i = nodeIndex(item);
	    item.remove();

	    if (item.classList.contains('active')) {
	      idx = self.activeItems.indexOf(item);
	      self.activeItems.splice(idx, 1);
	      removeClasses(item, 'active');
	    }

	    self.items.splice(i, 1);
	    self.lastQuery = null;

	    if (!self.settings.persist && self.userOptions.hasOwnProperty(value)) {
	      self.removeOption(value, silent);
	    }

	    if (i < self.caretPos) {
	      self.setCaret(self.caretPos - 1);
	    }

	    self.updateOriginalInput({
	      silent: silent
	    });
	    self.refreshState();
	    self.positionDropdown();
	    self.trigger('item_remove', value, item);
	  }
	  /**
	   * Invokes the `create` method provided in the
	   * TomSelect options that should provide the data
	   * for the new item, given the user input.
	   *
	   * Once this completes, it will be added
	   * to the item list.
	   *
	   */


	  createItem(input = null, callback = () => {}) {
	    // triggerDropdown parameter @deprecated 2.1.1
	    if (arguments.length === 3) {
	      callback = arguments[2];
	    }

	    if (typeof callback != 'function') {
	      callback = () => {};
	    }

	    var self = this;
	    var caret = self.caretPos;
	    var output;
	    input = input || self.inputValue();

	    if (!self.canCreate(input)) {
	      callback();
	      return false;
	    }

	    self.lock();
	    var created = false;

	    var create = data => {
	      self.unlock();
	      if (!data || typeof data !== 'object') return callback();
	      var value = hash_key(data[self.settings.valueField]);

	      if (typeof value !== 'string') {
	        return callback();
	      }

	      self.setTextboxValue();
	      self.addOption(data, true);
	      self.setCaret(caret);
	      self.addItem(value);
	      callback(data);
	      created = true;
	    };

	    if (typeof self.settings.create === 'function') {
	      output = self.settings.create.call(this, input, create);
	    } else {
	      output = {
	        [self.settings.labelField]: input,
	        [self.settings.valueField]: input
	      };
	    }

	    if (!created) {
	      create(output);
	    }

	    return true;
	  }
	  /**
	   * Re-renders the selected item lists.
	   */


	  refreshItems() {
	    var self = this;
	    self.lastQuery = null;

	    if (self.isSetup) {
	      self.addItems(self.items);
	    }

	    self.updateOriginalInput();
	    self.refreshState();
	  }
	  /**
	   * Updates all state-dependent attributes
	   * and CSS classes.
	   */


	  refreshState() {
	    const self = this;
	    self.refreshValidityState();
	    const isFull = self.isFull();
	    const isLocked = self.isLocked;
	    self.wrapper.classList.toggle('rtl', self.rtl);
	    const wrap_classList = self.wrapper.classList;
	    wrap_classList.toggle('focus', self.isFocused);
	    wrap_classList.toggle('disabled', self.isDisabled);
	    wrap_classList.toggle('required', self.isRequired);
	    wrap_classList.toggle('invalid', !self.isValid);
	    wrap_classList.toggle('locked', isLocked);
	    wrap_classList.toggle('full', isFull);
	    wrap_classList.toggle('input-active', self.isFocused && !self.isInputHidden);
	    wrap_classList.toggle('dropdown-active', self.isOpen);
	    wrap_classList.toggle('has-options', isEmptyObject(self.options));
	    wrap_classList.toggle('has-items', self.items.length > 0);
	  }
	  /**
	   * Update the `required` attribute of both input and control input.
	   *
	   * The `required` property needs to be activated on the control input
	   * for the error to be displayed at the right place. `required` also
	   * needs to be temporarily deactivated on the input since the input is
	   * hidden and can't show errors.
	   */


	  refreshValidityState() {
	    var self = this;

	    if (!self.input.validity) {
	      return;
	    }

	    self.isValid = self.input.validity.valid;
	    self.isInvalid = !self.isValid;
	  }
	  /**
	   * Determines whether or not more items can be added
	   * to the control without exceeding the user-defined maximum.
	   *
	   * @returns {boolean}
	   */


	  isFull() {
	    return this.settings.maxItems !== null && this.items.length >= this.settings.maxItems;
	  }
	  /**
	   * Refreshes the original <select> or <input>
	   * element to reflect the current state.
	   *
	   */


	  updateOriginalInput(opts = {}) {
	    const self = this;
	    var option, label;
	    const empty_option = self.input.querySelector('option[value=""]');

	    if (self.is_select_tag) {
	      const selected = [];
	      const has_selected = self.input.querySelectorAll('option:checked').length;

	      function AddSelected(option_el, value, label) {
	        if (!option_el) {
	          option_el = getDom('<option value="' + escape_html(value) + '">' + escape_html(label) + '</option>');
	        } // don't move empty option from top of list
	        // fixes bug in firefox https://bugzilla.mozilla.org/show_bug.cgi?id=1725293


	        if (option_el != empty_option) {
	          self.input.append(option_el);
	        }

	        selected.push(option_el); // marking empty option as selected can break validation
	        // fixes https://github.com/orchidjs/tom-select/issues/303

	        if (option_el != empty_option || has_selected > 0) {
	          option_el.selected = true;
	        }

	        return option_el;
	      } // unselect all selected options


	      self.input.querySelectorAll('option:checked').forEach(option_el => {
	        option_el.selected = false;
	      }); // nothing selected?

	      if (self.items.length == 0 && self.settings.mode == 'single') {
	        AddSelected(empty_option, "", ""); // order selected <option> tags for values in self.items
	      } else {
	        self.items.forEach(value => {
	          option = self.options[value];
	          label = option[self.settings.labelField] || '';

	          if (selected.includes(option.$option)) {
	            const reuse_opt = self.input.querySelector(`option[value="${addSlashes(value)}"]:not(:checked)`);
	            AddSelected(reuse_opt, value, label);
	          } else {
	            option.$option = AddSelected(option.$option, value, label);
	          }
	        });
	      }
	    } else {
	      self.input.value = self.getValue();
	    }

	    if (self.isSetup) {
	      if (!opts.silent) {
	        self.trigger('change', self.getValue());
	      }
	    }
	  }
	  /**
	   * Shows the autocomplete dropdown containing
	   * the available options.
	   */


	  open() {
	    var self = this;
	    if (self.isLocked || self.isOpen || self.settings.mode === 'multi' && self.isFull()) return;
	    self.isOpen = true;
	    setAttr(self.focus_node, {
	      'aria-expanded': 'true'
	    });
	    self.refreshState();
	    applyCSS(self.dropdown, {
	      visibility: 'hidden',
	      display: 'block'
	    });
	    self.positionDropdown();
	    applyCSS(self.dropdown, {
	      visibility: 'visible',
	      display: 'block'
	    });
	    self.focus();
	    self.trigger('dropdown_open', self.dropdown);
	  }
	  /**
	   * Closes the autocomplete dropdown menu.
	   */


	  close(setTextboxValue = true) {
	    var self = this;
	    var trigger = self.isOpen;

	    if (setTextboxValue) {
	      // before blur() to prevent form onchange event
	      self.setTextboxValue();

	      if (self.settings.mode === 'single' && self.items.length) {
	        self.hideInput();
	      }
	    }

	    self.isOpen = false;
	    setAttr(self.focus_node, {
	      'aria-expanded': 'false'
	    });
	    applyCSS(self.dropdown, {
	      display: 'none'
	    });

	    if (self.settings.hideSelected) {
	      self.clearActiveOption();
	    }

	    self.refreshState();
	    if (trigger) self.trigger('dropdown_close', self.dropdown);
	  }
	  /**
	   * Calculates and applies the appropriate
	   * position of the dropdown if dropdownParent = 'body'.
	   * Otherwise, position is determined by css
	   */


	  positionDropdown() {
	    if (this.settings.dropdownParent !== 'body') {
	      return;
	    }

	    var context = this.control;
	    var rect = context.getBoundingClientRect();
	    var top = context.offsetHeight + rect.top + window.scrollY;
	    var left = rect.left + window.scrollX;
	    applyCSS(this.dropdown, {
	      width: rect.width + 'px',
	      top: top + 'px',
	      left: left + 'px'
	    });
	  }
	  /**
	   * Resets / clears all selected items
	   * from the control.
	   *
	   */


	  clear(silent) {
	    var self = this;
	    if (!self.items.length) return;
	    var items = self.controlChildren();
	    iterate$1(items, item => {
	      self.removeItem(item, true);
	    });
	    self.showInput();
	    if (!silent) self.updateOriginalInput();
	    self.trigger('clear');
	  }
	  /**
	   * A helper method for inserting an element
	   * at the current caret position.
	   *
	   */


	  insertAtCaret(el) {
	    const self = this;
	    const caret = self.caretPos;
	    const target = self.control;
	    target.insertBefore(el, target.children[caret] || null);
	    self.setCaret(caret + 1);
	  }
	  /**
	   * Removes the current selected item(s).
	   *
	   */


	  deleteSelection(e) {
	    var direction, selection, caret, tail;
	    var self = this;
	    direction = e && e.keyCode === KEY_BACKSPACE ? -1 : 1;
	    selection = getSelection(self.control_input); // determine items that will be removed

	    const rm_items = [];

	    if (self.activeItems.length) {
	      tail = getTail(self.activeItems, direction);
	      caret = nodeIndex(tail);

	      if (direction > 0) {
	        caret++;
	      }

	      iterate$1(self.activeItems, item => rm_items.push(item));
	    } else if ((self.isFocused || self.settings.mode === 'single') && self.items.length) {
	      const items = self.controlChildren();
	      let rm_item;

	      if (direction < 0 && selection.start === 0 && selection.length === 0) {
	        rm_item = items[self.caretPos - 1];
	      } else if (direction > 0 && selection.start === self.inputValue().length) {
	        rm_item = items[self.caretPos];
	      }

	      if (rm_item !== undefined) {
	        rm_items.push(rm_item);
	      }
	    }

	    if (!self.shouldDelete(rm_items, e)) {
	      return false;
	    }

	    preventDefault(e, true); // perform removal

	    if (typeof caret !== 'undefined') {
	      self.setCaret(caret);
	    }

	    while (rm_items.length) {
	      self.removeItem(rm_items.pop());
	    }

	    self.showInput();
	    self.positionDropdown();
	    self.refreshOptions(false);
	    return true;
	  }
	  /**
	   * Return true if the items should be deleted
	   */


	  shouldDelete(items, evt) {
	    const values = items.map(item => item.dataset.value); // allow the callback to abort

	    if (!values.length || typeof this.settings.onDelete === 'function' && this.settings.onDelete(values, evt) === false) {
	      return false;
	    }

	    return true;
	  }
	  /**
	   * Selects the previous / next item (depending on the `direction` argument).
	   *
	   * > 0 - right
	   * < 0 - left
	   *
	   */


	  advanceSelection(direction, e) {
	    var last_active,
	        adjacent,
	        self = this;
	    if (self.rtl) direction *= -1;
	    if (self.inputValue().length) return; // add or remove to active items

	    if (isKeyDown(KEY_SHORTCUT, e) || isKeyDown('shiftKey', e)) {
	      last_active = self.getLastActive(direction);

	      if (last_active) {
	        if (!last_active.classList.contains('active')) {
	          adjacent = last_active;
	        } else {
	          adjacent = self.getAdjacent(last_active, direction, 'item');
	        } // if no active item, get items adjacent to the control input

	      } else if (direction > 0) {
	        adjacent = self.control_input.nextElementSibling;
	      } else {
	        adjacent = self.control_input.previousElementSibling;
	      }

	      if (adjacent) {
	        if (adjacent.classList.contains('active')) {
	          self.removeActiveItem(last_active);
	        }

	        self.setActiveItemClass(adjacent); // mark as last_active !! after removeActiveItem() on last_active
	      } // move caret to the left or right

	    } else {
	      self.moveCaret(direction);
	    }
	  }

	  moveCaret(direction) {}
	  /**
	   * Get the last active item
	   *
	   */


	  getLastActive(direction) {
	    let last_active = this.control.querySelector('.last-active');

	    if (last_active) {
	      return last_active;
	    }

	    var result = this.control.querySelectorAll('.active');

	    if (result) {
	      return getTail(result, direction);
	    }
	  }
	  /**
	   * Moves the caret to the specified index.
	   *
	   * The input must be moved by leaving it in place and moving the
	   * siblings, due to the fact that focus cannot be restored once lost
	   * on mobile webkit devices
	   *
	   */


	  setCaret(new_pos) {
	    this.caretPos = this.items.length;
	  }
	  /**
	   * Return list of item dom elements
	   *
	   */


	  controlChildren() {
	    return Array.from(this.control.querySelectorAll('[data-ts-item]'));
	  }
	  /**
	   * Disables user input on the control. Used while
	   * items are being asynchronously created.
	   */


	  lock() {
	    this.isLocked = true;
	    this.refreshState();
	  }
	  /**
	   * Re-enables user input on the control.
	   */


	  unlock() {
	    this.isLocked = false;
	    this.refreshState();
	  }
	  /**
	   * Disables user input on the control completely.
	   * While disabled, it cannot receive focus.
	   */


	  disable() {
	    var self = this;
	    self.input.disabled = true;
	    self.control_input.disabled = true;
	    self.focus_node.tabIndex = -1;
	    self.isDisabled = true;
	    this.close();
	    self.lock();
	  }
	  /**
	   * Enables the control so that it can respond
	   * to focus and user input.
	   */


	  enable() {
	    var self = this;
	    self.input.disabled = false;
	    self.control_input.disabled = false;
	    self.focus_node.tabIndex = self.tabIndex;
	    self.isDisabled = false;
	    self.unlock();
	  }
	  /**
	   * Completely destroys the control and
	   * unbinds all event listeners so that it can
	   * be garbage collected.
	   */


	  destroy() {
	    var self = this;
	    var revertSettings = self.revertSettings;
	    self.trigger('destroy');
	    self.off();
	    self.wrapper.remove();
	    self.dropdown.remove();
	    self.input.innerHTML = revertSettings.innerHTML;
	    self.input.tabIndex = revertSettings.tabIndex;
	    removeClasses(self.input, 'tomselected', 'ts-hidden-accessible');

	    self._destroy();

	    delete self.input.tomselect;
	  }
	  /**
	   * A helper method for rendering "item" and
	   * "option" templates, given the data.
	   *
	   */


	  render(templateName, data) {
	    var id, html;
	    const self = this;

	    if (typeof this.settings.render[templateName] !== 'function') {
	      return null;
	    } // render markup


	    html = self.settings.render[templateName].call(this, data, escape_html);

	    if (!html) {
	      return null;
	    }

	    html = getDom(html); // add mandatory attributes

	    if (templateName === 'option' || templateName === 'option_create') {
	      if (data[self.settings.disabledField]) {
	        setAttr(html, {
	          'aria-disabled': 'true'
	        });
	      } else {
	        setAttr(html, {
	          'data-selectable': ''
	        });
	      }
	    } else if (templateName === 'optgroup') {
	      id = data.group[self.settings.optgroupValueField];
	      setAttr(html, {
	        'data-group': id
	      });

	      if (data.group[self.settings.disabledField]) {
	        setAttr(html, {
	          'data-disabled': ''
	        });
	      }
	    }

	    if (templateName === 'option' || templateName === 'item') {
	      const value = get_hash(data[self.settings.valueField]);
	      setAttr(html, {
	        'data-value': value
	      }); // make sure we have some classes if a template is overwritten

	      if (templateName === 'item') {
	        addClasses(html, self.settings.itemClass);
	        setAttr(html, {
	          'data-ts-item': ''
	        });
	      } else {
	        addClasses(html, self.settings.optionClass);
	        setAttr(html, {
	          role: 'option',
	          id: data.$id
	        }); // update cache

	        data.$div = html;
	        self.options[value] = data;
	      }
	    }

	    return html;
	  }
	  /**
	   * Type guarded rendering
	   *
	   */


	  _render(templateName, data) {
	    const html = this.render(templateName, data);

	    if (html == null) {
	      throw 'HTMLElement expected';
	    }

	    return html;
	  }
	  /**
	   * Clears the render cache for a template. If
	   * no template is given, clears all render
	   * caches.
	   *
	   */


	  clearCache() {
	    iterate$1(this.options, option => {
	      if (option.$div) {
	        option.$div.remove();
	        delete option.$div;
	      }
	    });
	  }
	  /**
	   * Removes a value from item and option caches
	   *
	   */


	  uncacheValue(value) {
	    const option_el = this.getOption(value);
	    if (option_el) option_el.remove();
	  }
	  /**
	   * Determines whether or not to display the
	   * create item prompt, given a user input.
	   *
	   */


	  canCreate(input) {
	    return this.settings.create && input.length > 0 && this.settings.createFilter.call(this, input);
	  }
	  /**
	   * Wraps this.`method` so that `new_fn` can be invoked 'before', 'after', or 'instead' of the original method
	   *
	   * this.hook('instead','onKeyDown',function( arg1, arg2 ...){
	   *
	   * });
	   */


	  hook(when, method, new_fn) {
	    var self = this;
	    var orig_method = self[method];

	    self[method] = function () {
	      var result, result_new;

	      if (when === 'after') {
	        result = orig_method.apply(self, arguments);
	      }

	      result_new = new_fn.apply(self, arguments);

	      if (when === 'instead') {
	        return result_new;
	      }

	      if (when === 'before') {
	        result = orig_method.apply(self, arguments);
	      }

	      return result;
	    };
	  }

	}

	/**
	 * Plugin: "change_listener" (Tom Select)
	 * Copyright (c) contributors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
	 * file except in compliance with the License. You may obtain a copy of the License at:
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software distributed under
	 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
	 * ANY KIND, either express or implied. See the License for the specific language
	 * governing permissions and limitations under the License.
	 *
	 */
	function change_listener () {
	  addEvent(this.input, 'change', () => {
	    this.sync();
	  });
	}

	/**
	 * Plugin: "restore_on_backspace" (Tom Select)
	 * Copyright (c) contributors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
	 * file except in compliance with the License. You may obtain a copy of the License at:
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software distributed under
	 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
	 * ANY KIND, either express or implied. See the License for the specific language
	 * governing permissions and limitations under the License.
	 *
	 */
	function checkbox_options () {
	  var self = this;
	  var orig_onOptionSelect = self.onOptionSelect;
	  self.settings.hideSelected = false; // update the checkbox for an option

	  var UpdateCheckbox = function UpdateCheckbox(option) {
	    setTimeout(() => {
	      var checkbox = option.querySelector('input');

	      if (checkbox instanceof HTMLInputElement) {
	        if (option.classList.contains('selected')) {
	          checkbox.checked = true;
	        } else {
	          checkbox.checked = false;
	        }
	      }
	    }, 1);
	  }; // add checkbox to option template


	  self.hook('after', 'setupTemplates', () => {
	    var orig_render_option = self.settings.render.option;

	    self.settings.render.option = (data, escape_html) => {
	      var rendered = getDom(orig_render_option.call(self, data, escape_html));
	      var checkbox = document.createElement('input');
	      checkbox.addEventListener('click', function (evt) {
	        preventDefault(evt);
	      });
	      checkbox.type = 'checkbox';
	      const hashed = hash_key(data[self.settings.valueField]);

	      if (hashed && self.items.indexOf(hashed) > -1) {
	        checkbox.checked = true;
	      }

	      rendered.prepend(checkbox);
	      return rendered;
	    };
	  }); // uncheck when item removed

	  self.on('item_remove', value => {
	    var option = self.getOption(value);

	    if (option) {
	      // if dropdown hasn't been opened yet, the option won't exist
	      option.classList.remove('selected'); // selected class won't be removed yet

	      UpdateCheckbox(option);
	    }
	  }); // check when item added

	  self.on('item_add', value => {
	    var option = self.getOption(value);

	    if (option) {
	      // if dropdown hasn't been opened yet, the option won't exist
	      UpdateCheckbox(option);
	    }
	  }); // remove items when selected option is clicked

	  self.hook('instead', 'onOptionSelect', (evt, option) => {
	    if (option.classList.contains('selected')) {
	      option.classList.remove('selected');
	      self.removeItem(option.dataset.value);
	      self.refreshOptions();
	      preventDefault(evt, true);
	      return;
	    }

	    orig_onOptionSelect.call(self, evt, option);
	    UpdateCheckbox(option);
	  });
	}

	/**
	 * Plugin: "dropdown_header" (Tom Select)
	 * Copyright (c) contributors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
	 * file except in compliance with the License. You may obtain a copy of the License at:
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software distributed under
	 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
	 * ANY KIND, either express or implied. See the License for the specific language
	 * governing permissions and limitations under the License.
	 *
	 */
	function clear_button (userOptions) {
	  const self = this;
	  const options = Object.assign({
	    className: 'clear-button',
	    title: 'Clear All',
	    html: data => {
	      return `<div class="${data.className}" title="${data.title}">&#10799;</div>`;
	    }
	  }, userOptions);
	  self.on('initialize', () => {
	    var button = getDom(options.html(options));
	    button.addEventListener('click', evt => {
	      if (self.isDisabled) {
	        return;
	      }

	      self.clear();

	      if (self.settings.mode === 'single' && self.settings.allowEmptyOption) {
	        self.addItem('');
	      }

	      evt.preventDefault();
	      evt.stopPropagation();
	    });
	    self.control.appendChild(button);
	  });
	}

	/**
	 * Plugin: "drag_drop" (Tom Select)
	 * Copyright (c) contributors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
	 * file except in compliance with the License. You may obtain a copy of the License at:
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software distributed under
	 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
	 * ANY KIND, either express or implied. See the License for the specific language
	 * governing permissions and limitations under the License.
	 *
	 */
	function drag_drop () {
	  var self = this;
	  if (!$.fn.sortable) throw new Error('The "drag_drop" plugin requires jQuery UI "sortable".');
	  if (self.settings.mode !== 'multi') return;
	  var orig_lock = self.lock;
	  var orig_unlock = self.unlock;
	  self.hook('instead', 'lock', () => {
	    var sortable = $(self.control).data('sortable');
	    if (sortable) sortable.disable();
	    return orig_lock.call(self);
	  });
	  self.hook('instead', 'unlock', () => {
	    var sortable = $(self.control).data('sortable');
	    if (sortable) sortable.enable();
	    return orig_unlock.call(self);
	  });
	  self.on('initialize', () => {
	    var $control = $(self.control).sortable({
	      items: '[data-value]',
	      forcePlaceholderSize: true,
	      disabled: self.isLocked,
	      start: (e, ui) => {
	        ui.placeholder.css('width', ui.helper.css('width'));
	        $control.css({
	          overflow: 'visible'
	        });
	      },
	      stop: () => {
	        $control.css({
	          overflow: 'hidden'
	        });
	        var values = [];
	        $control.children('[data-value]').each(function () {
	          if (this.dataset.value) values.push(this.dataset.value);
	        });
	        self.setValue(values);
	      }
	    });
	  });
	}

	/**
	 * Plugin: "dropdown_header" (Tom Select)
	 * Copyright (c) contributors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
	 * file except in compliance with the License. You may obtain a copy of the License at:
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software distributed under
	 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
	 * ANY KIND, either express or implied. See the License for the specific language
	 * governing permissions and limitations under the License.
	 *
	 */
	function dropdown_header (userOptions) {
	  const self = this;
	  const options = Object.assign({
	    title: 'Untitled',
	    headerClass: 'dropdown-header',
	    titleRowClass: 'dropdown-header-title',
	    labelClass: 'dropdown-header-label',
	    closeClass: 'dropdown-header-close',
	    html: data => {
	      return '<div class="' + data.headerClass + '">' + '<div class="' + data.titleRowClass + '">' + '<span class="' + data.labelClass + '">' + data.title + '</span>' + '<a class="' + data.closeClass + '">&times;</a>' + '</div>' + '</div>';
	    }
	  }, userOptions);
	  self.on('initialize', () => {
	    var header = getDom(options.html(options));
	    var close_link = header.querySelector('.' + options.closeClass);

	    if (close_link) {
	      close_link.addEventListener('click', evt => {
	        preventDefault(evt, true);
	        self.close();
	      });
	    }

	    self.dropdown.insertBefore(header, self.dropdown.firstChild);
	  });
	}

	/**
	 * Plugin: "dropdown_input" (Tom Select)
	 * Copyright (c) contributors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
	 * file except in compliance with the License. You may obtain a copy of the License at:
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software distributed under
	 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
	 * ANY KIND, either express or implied. See the License for the specific language
	 * governing permissions and limitations under the License.
	 *
	 */
	function caret_position () {
	  var self = this;
	  /**
	   * Moves the caret to the specified index.
	   *
	   * The input must be moved by leaving it in place and moving the
	   * siblings, due to the fact that focus cannot be restored once lost
	   * on mobile webkit devices
	   *
	   */

	  self.hook('instead', 'setCaret', new_pos => {
	    if (self.settings.mode === 'single' || !self.control.contains(self.control_input)) {
	      new_pos = self.items.length;
	    } else {
	      new_pos = Math.max(0, Math.min(self.items.length, new_pos));

	      if (new_pos != self.caretPos && !self.isPending) {
	        self.controlChildren().forEach((child, j) => {
	          if (j < new_pos) {
	            self.control_input.insertAdjacentElement('beforebegin', child);
	          } else {
	            self.control.appendChild(child);
	          }
	        });
	      }
	    }

	    self.caretPos = new_pos;
	  });
	  self.hook('instead', 'moveCaret', direction => {
	    if (!self.isFocused) return; // move caret before or after selected items

	    const last_active = self.getLastActive(direction);

	    if (last_active) {
	      const idx = nodeIndex(last_active);
	      self.setCaret(direction > 0 ? idx + 1 : idx);
	      self.setActiveItem();
	      removeClasses(last_active, 'last-active'); // move caret left or right of current position
	    } else {
	      self.setCaret(self.caretPos + direction);
	    }
	  });
	}

	/**
	 * Plugin: "dropdown_input" (Tom Select)
	 * Copyright (c) contributors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
	 * file except in compliance with the License. You may obtain a copy of the License at:
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software distributed under
	 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
	 * ANY KIND, either express or implied. See the License for the specific language
	 * governing permissions and limitations under the License.
	 *
	 */
	function dropdown_input () {
	  const self = this;
	  self.settings.shouldOpen = true; // make sure the input is shown even if there are no options to display in the dropdown

	  self.hook('before', 'setup', () => {
	    self.focus_node = self.control;
	    addClasses(self.control_input, 'dropdown-input');
	    const div = getDom('<div class="dropdown-input-wrap">');
	    div.append(self.control_input);
	    self.dropdown.insertBefore(div, self.dropdown.firstChild); // set a placeholder in the select control

	    const placeholder = getDom('<input class="items-placeholder" tabindex="-1" />');
	    placeholder.placeholder = self.settings.placeholder || '';
	    self.control.append(placeholder);
	  });
	  self.on('initialize', () => {
	    // set tabIndex on control to -1, otherwise [shift+tab] will put focus right back on control_input
	    self.control_input.addEventListener('keydown', evt => {
	      //addEvent(self.control_input,'keydown' as const,(evt:KeyboardEvent) =>{
	      switch (evt.keyCode) {
	        case KEY_ESC:
	          if (self.isOpen) {
	            preventDefault(evt, true);
	            self.close();
	          }

	          self.clearActiveItems();
	          return;

	        case KEY_TAB:
	          self.focus_node.tabIndex = -1;
	          break;
	      }

	      return self.onKeyDown.call(self, evt);
	    });
	    self.on('blur', () => {
	      self.focus_node.tabIndex = self.isDisabled ? -1 : self.tabIndex;
	    }); // give the control_input focus when the dropdown is open

	    self.on('dropdown_open', () => {
	      self.control_input.focus();
	    }); // prevent onBlur from closing when focus is on the control_input

	    const orig_onBlur = self.onBlur;
	    self.hook('instead', 'onBlur', evt => {
	      if (evt && evt.relatedTarget == self.control_input) return;
	      return orig_onBlur.call(self);
	    });
	    addEvent(self.control_input, 'blur', () => self.onBlur()); // return focus to control to allow further keyboard input

	    self.hook('before', 'close', () => {
	      if (!self.isOpen) return;
	      self.focus_node.focus({
	        preventScroll: true
	      });
	    });
	  });
	}

	/**
	 * Plugin: "input_autogrow" (Tom Select)
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
	 * file except in compliance with the License. You may obtain a copy of the License at:
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software distributed under
	 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
	 * ANY KIND, either express or implied. See the License for the specific language
	 * governing permissions and limitations under the License.
	 *
	 */
	function input_autogrow () {
	  var self = this;
	  self.on('initialize', () => {
	    var test_input = document.createElement('span');
	    var control = self.control_input;
	    test_input.style.cssText = 'position:absolute; top:-99999px; left:-99999px; width:auto; padding:0; white-space:pre; ';
	    self.wrapper.appendChild(test_input);
	    var transfer_styles = ['letterSpacing', 'fontSize', 'fontFamily', 'fontWeight', 'textTransform'];

	    for (const style_name of transfer_styles) {
	      // @ts-ignore TS7015 https://stackoverflow.com/a/50506154/697576
	      test_input.style[style_name] = control.style[style_name];
	    }
	    /**
	     * Set the control width
	     *
	     */


	    var resize = () => {
	      test_input.textContent = control.value;
	      control.style.width = test_input.clientWidth + 'px';
	    };

	    resize();
	    self.on('update item_add item_remove', resize);
	    addEvent(control, 'input', resize);
	    addEvent(control, 'keyup', resize);
	    addEvent(control, 'blur', resize);
	    addEvent(control, 'update', resize);
	  });
	}

	/**
	 * Plugin: "input_autogrow" (Tom Select)
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
	 * file except in compliance with the License. You may obtain a copy of the License at:
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software distributed under
	 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
	 * ANY KIND, either express or implied. See the License for the specific language
	 * governing permissions and limitations under the License.
	 *
	 */
	function no_backspace_delete () {
	  var self = this;
	  var orig_deleteSelection = self.deleteSelection;
	  this.hook('instead', 'deleteSelection', evt => {
	    if (self.activeItems.length) {
	      return orig_deleteSelection.call(self, evt);
	    }

	    return false;
	  });
	}

	/**
	 * Plugin: "no_active_items" (Tom Select)
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
	 * file except in compliance with the License. You may obtain a copy of the License at:
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software distributed under
	 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
	 * ANY KIND, either express or implied. See the License for the specific language
	 * governing permissions and limitations under the License.
	 *
	 */
	function no_active_items () {
	  this.hook('instead', 'setActiveItem', () => {});
	  this.hook('instead', 'selectAll', () => {});
	}

	/**
	 * Plugin: "optgroup_columns" (Tom Select.js)
	 * Copyright (c) contributors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
	 * file except in compliance with the License. You may obtain a copy of the License at:
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software distributed under
	 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
	 * ANY KIND, either express or implied. See the License for the specific language
	 * governing permissions and limitations under the License.
	 *
	 */
	function optgroup_columns () {
	  var self = this;
	  var orig_keydown = self.onKeyDown;
	  self.hook('instead', 'onKeyDown', evt => {
	    var index, option, options, optgroup;

	    if (!self.isOpen || !(evt.keyCode === KEY_LEFT || evt.keyCode === KEY_RIGHT)) {
	      return orig_keydown.call(self, evt);
	    }

	    self.ignoreHover = true;
	    optgroup = parentMatch(self.activeOption, '[data-group]');
	    index = nodeIndex(self.activeOption, '[data-selectable]');

	    if (!optgroup) {
	      return;
	    }

	    if (evt.keyCode === KEY_LEFT) {
	      optgroup = optgroup.previousSibling;
	    } else {
	      optgroup = optgroup.nextSibling;
	    }

	    if (!optgroup) {
	      return;
	    }

	    options = optgroup.querySelectorAll('[data-selectable]');
	    option = options[Math.min(options.length - 1, index)];

	    if (option) {
	      self.setActiveOption(option);
	    }
	  });
	}

	/**
	 * Plugin: "remove_button" (Tom Select)
	 * Copyright (c) contributors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
	 * file except in compliance with the License. You may obtain a copy of the License at:
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software distributed under
	 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
	 * ANY KIND, either express or implied. See the License for the specific language
	 * governing permissions and limitations under the License.
	 *
	 */
	function remove_button (userOptions) {
	  const options = Object.assign({
	    label: '&times;',
	    title: 'Remove',
	    className: 'remove',
	    append: true
	  }, userOptions); //options.className = 'remove-single';

	  var self = this; // override the render method to add remove button to each item

	  if (!options.append) {
	    return;
	  }

	  var html = '<a href="javascript:void(0)" class="' + options.className + '" tabindex="-1" title="' + escape_html(options.title) + '">' + options.label + '</a>';
	  self.hook('after', 'setupTemplates', () => {
	    var orig_render_item = self.settings.render.item;

	    self.settings.render.item = (data, escape) => {
	      var item = getDom(orig_render_item.call(self, data, escape));
	      var close_button = getDom(html);
	      item.appendChild(close_button);
	      addEvent(close_button, 'mousedown', evt => {
	        preventDefault(evt, true);
	      });
	      addEvent(close_button, 'click', evt => {
	        // propagating will trigger the dropdown to show for single mode
	        preventDefault(evt, true);
	        if (self.isLocked) return;
	        if (!self.shouldDelete([item], evt)) return;
	        self.removeItem(item);
	        self.refreshOptions(false);
	        self.inputState();
	      });
	      return item;
	    };
	  });
	}

	/**
	 * Plugin: "restore_on_backspace" (Tom Select)
	 * Copyright (c) contributors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
	 * file except in compliance with the License. You may obtain a copy of the License at:
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software distributed under
	 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
	 * ANY KIND, either express or implied. See the License for the specific language
	 * governing permissions and limitations under the License.
	 *
	 */
	function restore_on_backspace (userOptions) {
	  const self = this;
	  const options = Object.assign({
	    text: option => {
	      return option[self.settings.labelField];
	    }
	  }, userOptions);
	  self.on('item_remove', function (value) {
	    if (!self.isFocused) {
	      return;
	    }

	    if (self.control_input.value.trim() === '') {
	      var option = self.options[value];

	      if (option) {
	        self.setTextboxValue(options.text.call(self, option));
	      }
	    }
	  });
	}

	/**
	 * Plugin: "restore_on_backspace" (Tom Select)
	 * Copyright (c) contributors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
	 * file except in compliance with the License. You may obtain a copy of the License at:
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software distributed under
	 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
	 * ANY KIND, either express or implied. See the License for the specific language
	 * governing permissions and limitations under the License.
	 *
	 */
	function virtual_scroll () {
	  const self = this;
	  const orig_canLoad = self.canLoad;
	  const orig_clearActiveOption = self.clearActiveOption;
	  const orig_loadCallback = self.loadCallback;
	  var pagination = {};
	  var dropdown_content;
	  var loading_more = false;
	  var load_more_opt;
	  var default_values = [];

	  if (!self.settings.shouldLoadMore) {
	    // return true if additional results should be loaded
	    self.settings.shouldLoadMore = () => {
	      const scroll_percent = dropdown_content.clientHeight / (dropdown_content.scrollHeight - dropdown_content.scrollTop);

	      if (scroll_percent > 0.9) {
	        return true;
	      }

	      if (self.activeOption) {
	        var selectable = self.selectable();
	        var index = Array.from(selectable).indexOf(self.activeOption);

	        if (index >= selectable.length - 2) {
	          return true;
	        }
	      }

	      return false;
	    };
	  }

	  if (!self.settings.firstUrl) {
	    throw 'virtual_scroll plugin requires a firstUrl() method';
	  } // in order for virtual scrolling to work,
	  // options need to be ordered the same way they're returned from the remote data source


	  self.settings.sortField = [{
	    field: '$order'
	  }, {
	    field: '$score'
	  }]; // can we load more results for given query?

	  const canLoadMore = query => {
	    if (typeof self.settings.maxOptions === 'number' && dropdown_content.children.length >= self.settings.maxOptions) {
	      return false;
	    }

	    if (query in pagination && pagination[query]) {
	      return true;
	    }

	    return false;
	  };

	  const clearFilter = (option, value) => {
	    if (self.items.indexOf(value) >= 0 || default_values.indexOf(value) >= 0) {
	      return true;
	    }

	    return false;
	  }; // set the next url that will be


	  self.setNextUrl = (value, next_url) => {
	    pagination[value] = next_url;
	  }; // getUrl() to be used in settings.load()


	  self.getUrl = query => {
	    if (query in pagination) {
	      const next_url = pagination[query];
	      pagination[query] = false;
	      return next_url;
	    } // if the user goes back to a previous query
	    // we need to load the first page again


	    pagination = {};
	    return self.settings.firstUrl.call(self, query);
	  }; // don't clear the active option (and cause unwanted dropdown scroll)
	  // while loading more results


	  self.hook('instead', 'clearActiveOption', () => {
	    if (loading_more) {
	      return;
	    }

	    return orig_clearActiveOption.call(self);
	  }); // override the canLoad method

	  self.hook('instead', 'canLoad', query => {
	    // first time the query has been seen
	    if (!(query in pagination)) {
	      return orig_canLoad.call(self, query);
	    }

	    return canLoadMore(query);
	  }); // wrap the load

	  self.hook('instead', 'loadCallback', (options, optgroups) => {
	    if (!loading_more) {
	      self.clearOptions(clearFilter);
	    } else if (load_more_opt) {
	      const first_option = options[0];

	      if (first_option !== undefined) {
	        load_more_opt.dataset.value = first_option[self.settings.valueField];
	      }
	    }

	    orig_loadCallback.call(self, options, optgroups);
	    loading_more = false;
	  }); // add templates to dropdown
	  //	loading_more if we have another url in the queue
	  //	no_more_results if we don't have another url in the queue

	  self.hook('after', 'refreshOptions', () => {
	    const query = self.lastValue;
	    var option;

	    if (canLoadMore(query)) {
	      option = self.render('loading_more', {
	        query: query
	      });

	      if (option) {
	        option.setAttribute('data-selectable', ''); // so that navigating dropdown with [down] keypresses can navigate to this node

	        load_more_opt = option;
	      }
	    } else if (query in pagination && !dropdown_content.querySelector('.no-results')) {
	      option = self.render('no_more_results', {
	        query: query
	      });
	    }

	    if (option) {
	      addClasses(option, self.settings.optionClass);
	      dropdown_content.append(option);
	    }
	  }); // add scroll listener and default templates

	  self.on('initialize', () => {
	    default_values = Object.keys(self.options);
	    dropdown_content = self.dropdown_content; // default templates

	    self.settings.render = Object.assign({}, {
	      loading_more: () => {
	        return `<div class="loading-more-results">Loading more results ... </div>`;
	      },
	      no_more_results: () => {
	        return `<div class="no-more-results">No more results</div>`;
	      }
	    }, self.settings.render); // watch dropdown content scroll position

	    dropdown_content.addEventListener('scroll', () => {
	      if (!self.settings.shouldLoadMore.call(self)) {
	        return;
	      } // !important: this will get checked again in load() but we still need to check here otherwise loading_more will be set to true


	      if (!canLoadMore(self.lastValue)) {
	        return;
	      } // don't call load() too much


	      if (loading_more) return;
	      loading_more = true;
	      self.load.call(self, self.lastValue);
	    });
	  });
	}

	TomSelect.define('change_listener', change_listener);
	TomSelect.define('checkbox_options', checkbox_options);
	TomSelect.define('clear_button', clear_button);
	TomSelect.define('drag_drop', drag_drop);
	TomSelect.define('dropdown_header', dropdown_header);
	TomSelect.define('caret_position', caret_position);
	TomSelect.define('dropdown_input', dropdown_input);
	TomSelect.define('input_autogrow', input_autogrow);
	TomSelect.define('no_backspace_delete', no_backspace_delete);
	TomSelect.define('no_active_items', no_active_items);
	TomSelect.define('optgroup_columns', optgroup_columns);
	TomSelect.define('remove_button', remove_button);
	TomSelect.define('restore_on_backspace', restore_on_backspace);
	TomSelect.define('virtual_scroll', virtual_scroll);

	return TomSelect;

}));
var tomSelect=function(el,opts){return new TomSelect(el,opts);} 
//# sourceMappingURL=tom-select.complete.js.map


/***/ }),

/***/ "./Scripts/common/disp_common.ts":
/*!***************************************!*\
  !*** ./Scripts/common/disp_common.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "common": () => (/* binding */ common)
/* harmony export */ });
/* harmony import */ var tom_select__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tom-select */ "./node_modules/tom-select/dist/js/tom-select.complete.js");
/* harmony import */ var tom_select__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(tom_select__WEBPACK_IMPORTED_MODULE_0__);

document.addEventListener('DOMContentLoaded', function () {
    //.tom-selectがあればTomSelect要素(コンボボックス)に置き換える
    document.querySelectorAll('.tom-select').forEach(function (el) {
        new (tom_select__WEBPACK_IMPORTED_MODULE_0___default())(el, {});
    });
});
var common = /** @class */ (function () {
    function common() {
        this.replaceTomSelect();
    }
    /**
     * .tom-selectの要素をTomSelect要素(コンボボックス)に置き換える
     * */
    common.prototype.replaceTomSelect = function () {
        document.addEventListener('DOMContentLoaded', function () {
            //.tom-selectがあればTomSelect要素(コンボボックス)に置き換える
            document.querySelectorAll('.tom-select').forEach(function (el) {
                new (tom_select__WEBPACK_IMPORTED_MODULE_0___default())(el, {});
            });
        });
    };
    return common;
}());

;


/***/ }),

/***/ "./Scripts/common/spinnerUtil.ts":
/*!***************************************!*\
  !*** ./Scripts/common/spinnerUtil.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "spinnerUtil": () => (/* binding */ spinnerUtil)
/* harmony export */ });
/* harmony import */ var spin_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! spin.js */ "./node_modules/spin.js/spin.js");

var opts = {
    lines: 13 // The number of lines to draw
    ,
    length: 28 // The length of each line
    ,
    width: 14 // The line thickness
    ,
    radius: 42 // The radius of the inner circle
    ,
    scale: 1 // Scales overall size of the spinner
    ,
    corners: 1 // Corner roundness (0..1)
    ,
    color: '#000' // #rgb or #rrggbb or array of colors
    ,
    opacity: 0.25 // Opacity of the lines
    ,
    rotate: 0 // The rotation offset
    ,
    direction: 1 // 1: clockwise, -1: counterclockwise
    ,
    speed: 1 // Rounds per second
    ,
    trail: 60 // Afterglow percentage
    ,
    fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
    ,
    zIndex: 2e9 // The z-index (defaults to 2000000000)
    ,
    className: 'spinner' // The CSS class to assign to the spinner
    ,
    top: '50%' // Top position relative to parent
    ,
    left: '50%' // Left position relative to parent
    ,
    shadow: false // Whether to render a shadow
    ,
    hwaccel: false // Whether to use hardware acceleration
    ,
    position: 'absolute' // Element positioning
};
//描画先の親要素
var spin_target = document.getElementById('spin-area');
//スピナーオブジェクト
var spinner = new spin_js__WEBPACK_IMPORTED_MODULE_0__.Spinner(opts).spin();
var spinnerLayer = document.getElementById('layer');
if (spin_target != null && spinnerLayer != null && spinner.el) {
    spinnerLayer.hidden = true;
    spin_target.hidden = true;
    spinner.spin(spin_target);
    spin_target.appendChild(spinner.el);
}
var spinnerUtil = {
    startSpinner: function () {
        var allInput = document.querySelectorAll('input');
        allInput.forEach(function (inputElement) {
            inputElement.disabled = true;
        });
        if (spin_target != null && spinnerLayer != null) {
            spinner.stop;
            spinner.spin(spin_target);
            spinnerLayer.hidden = false;
            spin_target.hidden = false;
        }
    },
    stopSpinner: function () {
        var allInput = document.querySelectorAll('input');
        allInput.forEach(function (inputElement) {
            inputElement.disabled = false;
        });
        if (spin_target != null && spinnerLayer != null) {
            spinner.stop;
            spinnerLayer.hidden = true;
            spin_target.hidden = true;
        }
    }
};


/***/ }),

/***/ "./node_modules/spin.js/spin.js":
/*!**************************************!*\
  !*** ./node_modules/spin.js/spin.js ***!
  \**************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Spinner": () => (/* binding */ Spinner)
/* harmony export */ });
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var defaults = {
    lines: 12,
    length: 7,
    width: 5,
    radius: 10,
    scale: 1.0,
    corners: 1,
    color: '#000',
    fadeColor: 'transparent',
    animation: 'spinner-line-fade-default',
    rotate: 0,
    direction: 1,
    speed: 1,
    zIndex: 2e9,
    className: 'spinner',
    top: '50%',
    left: '50%',
    shadow: '0 0 1px transparent',
    position: 'absolute',
};
var Spinner = /** @class */ (function () {
    function Spinner(opts) {
        if (opts === void 0) { opts = {}; }
        this.opts = __assign(__assign({}, defaults), opts);
    }
    /**
     * Adds the spinner to the given target element. If this instance is already
     * spinning, it is automatically removed from its previous target by calling
     * stop() internally.
     */
    Spinner.prototype.spin = function (target) {
        this.stop();
        this.el = document.createElement('div');
        this.el.className = this.opts.className;
        this.el.setAttribute('role', 'progressbar');
        css(this.el, {
            position: this.opts.position,
            width: 0,
            zIndex: this.opts.zIndex,
            left: this.opts.left,
            top: this.opts.top,
            transform: "scale(" + this.opts.scale + ")",
        });
        if (target) {
            target.insertBefore(this.el, target.firstChild || null);
        }
        drawLines(this.el, this.opts);
        return this;
    };
    /**
     * Stops and removes the Spinner.
     * Stopped spinners may be reused by calling spin() again.
     */
    Spinner.prototype.stop = function () {
        if (this.el) {
            if (typeof requestAnimationFrame !== 'undefined') {
                cancelAnimationFrame(this.animateId);
            }
            else {
                clearTimeout(this.animateId);
            }
            if (this.el.parentNode) {
                this.el.parentNode.removeChild(this.el);
            }
            this.el = undefined;
        }
        return this;
    };
    return Spinner;
}());

/**
 * Sets multiple style properties at once.
 */
function css(el, props) {
    for (var prop in props) {
        el.style[prop] = props[prop];
    }
    return el;
}
/**
 * Returns the line color from the given string or array.
 */
function getColor(color, idx) {
    return typeof color == 'string' ? color : color[idx % color.length];
}
/**
 * Internal method that draws the individual lines.
 */
function drawLines(el, opts) {
    var borderRadius = (Math.round(opts.corners * opts.width * 500) / 1000) + 'px';
    var shadow = 'none';
    if (opts.shadow === true) {
        shadow = '0 2px 4px #000'; // default shadow
    }
    else if (typeof opts.shadow === 'string') {
        shadow = opts.shadow;
    }
    var shadows = parseBoxShadow(shadow);
    for (var i = 0; i < opts.lines; i++) {
        var degrees = ~~(360 / opts.lines * i + opts.rotate);
        var backgroundLine = css(document.createElement('div'), {
            position: 'absolute',
            top: -opts.width / 2 + "px",
            width: (opts.length + opts.width) + 'px',
            height: opts.width + 'px',
            background: getColor(opts.fadeColor, i),
            borderRadius: borderRadius,
            transformOrigin: 'left',
            transform: "rotate(" + degrees + "deg) translateX(" + opts.radius + "px)",
        });
        var delay = i * opts.direction / opts.lines / opts.speed;
        delay -= 1 / opts.speed; // so initial animation state will include trail
        var line = css(document.createElement('div'), {
            width: '100%',
            height: '100%',
            background: getColor(opts.color, i),
            borderRadius: borderRadius,
            boxShadow: normalizeShadow(shadows, degrees),
            animation: 1 / opts.speed + "s linear " + delay + "s infinite " + opts.animation,
        });
        backgroundLine.appendChild(line);
        el.appendChild(backgroundLine);
    }
}
function parseBoxShadow(boxShadow) {
    var regex = /^\s*([a-zA-Z]+\s+)?(-?\d+(\.\d+)?)([a-zA-Z]*)\s+(-?\d+(\.\d+)?)([a-zA-Z]*)(.*)$/;
    var shadows = [];
    for (var _i = 0, _a = boxShadow.split(','); _i < _a.length; _i++) {
        var shadow = _a[_i];
        var matches = shadow.match(regex);
        if (matches === null) {
            continue; // invalid syntax
        }
        var x = +matches[2];
        var y = +matches[5];
        var xUnits = matches[4];
        var yUnits = matches[7];
        if (x === 0 && !xUnits) {
            xUnits = yUnits;
        }
        if (y === 0 && !yUnits) {
            yUnits = xUnits;
        }
        if (xUnits !== yUnits) {
            continue; // units must match to use as coordinates
        }
        shadows.push({
            prefix: matches[1] || '',
            x: x,
            y: y,
            xUnits: xUnits,
            yUnits: yUnits,
            end: matches[8],
        });
    }
    return shadows;
}
/**
 * Modify box-shadow x/y offsets to counteract rotation
 */
function normalizeShadow(shadows, degrees) {
    var normalized = [];
    for (var _i = 0, shadows_1 = shadows; _i < shadows_1.length; _i++) {
        var shadow = shadows_1[_i];
        var xy = convertOffset(shadow.x, shadow.y, degrees);
        normalized.push(shadow.prefix + xy[0] + shadow.xUnits + ' ' + xy[1] + shadow.yUnits + shadow.end);
    }
    return normalized.join(', ');
}
function convertOffset(x, y, degrees) {
    var radians = degrees * Math.PI / 180;
    var sin = Math.sin(radians);
    var cos = Math.cos(radians);
    return [
        Math.round((x * cos + y * sin) * 1000) / 1000,
        Math.round((-x * sin + y * cos) * 1000) / 1000,
    ];
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!*******************************************************!*\
  !*** ./Scripts/entries/disp_MstKintoneEnviroments.ts ***!
  \*******************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _common_spinnerUtil__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/spinnerUtil */ "./Scripts/common/spinnerUtil.ts");
/* harmony import */ var _common_disp_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/disp_common */ "./Scripts/common/disp_common.ts");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var sweetalert2__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! sweetalert2 */ "./node_modules/sweetalert2/dist/sweetalert2.all.js");
/* harmony import */ var sweetalert2__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(sweetalert2__WEBPACK_IMPORTED_MODULE_3__);
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};




new _common_disp_common__WEBPACK_IMPORTED_MODULE_1__.common();
document.addEventListener('DOMContentLoaded', function () {
    var syncBtn = document.getElementById('env_sync_btn');
    syncBtn === null || syncBtn === void 0 ? void 0 : syncBtn.addEventListener('click', function (ev) { return __awaiter(void 0, void 0, void 0, function () {
        var envSyncUrl;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _common_spinnerUtil__WEBPACK_IMPORTED_MODULE_0__.spinnerUtil.startSpinner();
                    envSyncUrl = document.querySelector('#env_sync_url').value;
                    return [4 /*yield*/, axios__WEBPACK_IMPORTED_MODULE_2___default().get(envSyncUrl, {
                            'headers': {
                                'Content-Type': 'application/json'
                            }
                        }).then(function (resp) {
                            _common_spinnerUtil__WEBPACK_IMPORTED_MODULE_0__.spinnerUtil.stopSpinner();
                            // 成功の処理
                            sweetalert2__WEBPACK_IMPORTED_MODULE_3___default().fire({
                                icon: 'success',
                                title: '成功'
                            });
                        }).catch(function (err) {
                            console.error(err);
                            _common_spinnerUtil__WEBPACK_IMPORTED_MODULE_0__.spinnerUtil.stopSpinner();
                            var errorMsg = err.response.data.param[0];
                            var errorDetails = errorMsg.split('{"code"');
                            if (errorDetails.length >= 2) {
                                sweetalert2__WEBPACK_IMPORTED_MODULE_3___default().fire({
                                    icon: 'error',
                                    title: 'エラー',
                                    html: '{"code"' + errorDetails[1]
                                });
                            }
                            else {
                                sweetalert2__WEBPACK_IMPORTED_MODULE_3___default().fire({
                                    icon: 'error',
                                    title: 'エラー',
                                    html: errorMsg
                                });
                            }
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QWE7QUFDMUIsYUFBYSxtQkFBbUI7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQSxhQUFhLFFBQVE7QUFDckIsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsYUFBYSxtQkFBbUI7QUFDaEMsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGFBQWEsYUFBYTtBQUMxQixhQUFhLG1CQUFtQjtBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhLGFBQWE7QUFDMUIsYUFBYSxtQkFBbUI7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBLGFBQWEsYUFBYTtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGFBQWEsYUFBYTtBQUMxQixhQUFhLGFBQWE7QUFDMUIsYUFBYSxtQkFBbUI7QUFDaEMsYUFBYSxHQUFHO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhLG1CQUFtQjtBQUNoQyxhQUFhLFFBQVE7QUFDckIsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsYUFBYSxhQUFhO0FBQzFCLGFBQWEsZUFBZTtBQUM1QixhQUFhLFVBQVU7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGFBQWEsYUFBYTtBQUMxQixhQUFhLGVBQWU7QUFDNUIsYUFBYSxtQkFBbUI7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGFBQWEsZUFBZTtBQUM1QixhQUFhLG1CQUFtQjtBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLDhCQUE4QjtBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLGtDQUFrQztBQUN0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhLGVBQWU7QUFDNUIsYUFBYSxtQkFBbUI7QUFDaEMsYUFBYSxVQUFVO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLFlBQVk7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsWUFBWTtBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsYUFBYSxZQUFZO0FBQ3pCLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsYUFBYSxHQUFHO0FBQ2hCLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLFlBQVk7QUFDekIsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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QTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG1DQUFtQzs7QUFFbkM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ04sSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStC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O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esa0NBQWtDLGVBQWU7O0FBRWpEOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHlEQUF5RDtBQUN6RDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQSwwQkFBMEI7QUFDMUI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7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QTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0EsUUFBUTtBQUNSLDhCQUE4QjtBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRDQUE0QztBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0EsZ0RBQWdEOztBQUVoRCw0QkFBNEI7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDs7O0FBR0E7QUFDQTtBQUNBLE9BQU87OztBQUdQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLDhCQUE4QjtBQUM5QixXQUFXO0FBQ1gsOEJBQThCO0FBQzlCLFdBQVc7QUFDWDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esd0RBQXdEO0FBQ3hEOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87OztBQUdQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBLHNCQUFzQjs7QUFFdEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1IsT0FBTztBQUNQOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0I7O0FBRS9CO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0Esb0NBQW9DOztBQUVwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtEQUFrRDs7QUFFbEQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxPQUFPOzs7QUFHUDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHVCQUF1QixVQUFVO0FBQ2pDOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsT0FBTzs7O0FBR1A7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07O0FBRU47QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmOzs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0EsNENBQTRDOztBQUU1QztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE9BQU87OztBQUdQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0EsT0FBTztBQUNQLGdDQUFnQztBQUNoQyxPQUFPOzs7QUFHUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTzs7O0FBR1A7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxPQUFPOzs7QUFHUCxpQkFBaUIsT0FBTztBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVEQUF1RDs7QUFFdkQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsc0RBQXNELE9BQU87QUFDN0Q7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7OztBQUdYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQSwrQ0FBK0M7O0FBRS9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxPQUFPOzs7QUFHUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUixPQUFPOzs7QUFHUDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBLHFDQUFxQzs7QUFFckM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQSxPQUFPOzs7QUFHUDtBQUNBO0FBQ0E7QUFDQSxRQUFROztBQUVSO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsUUFBUTs7O0FBR1I7QUFDQSxnQ0FBZ0M7QUFDaEMsT0FBTztBQUNQLG9DQUFvQztBQUNwQyxPQUFPO0FBQ1A7QUFDQSxPQUFPOzs7QUFHUDs7QUFFQTtBQUNBO0FBQ0EsT0FBTzs7O0FBR1A7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxPQUFPO0FBQ1A7O0FBRUE7QUFDQSw0QkFBNEI7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0Esd0JBQXdCO0FBQ3hCOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlFQUFpRTs7QUFFakU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUM7QUFDckM7O0FBRUE7QUFDQSxxQ0FBcUM7O0FBRXJDO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLE9BQU87OztBQUdQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE9BQU87OztBQUdQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQSxxQkFBcUIsZ0JBQWdCO0FBQ3JDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx3RUFBd0Usa0JBQWtCO0FBQzFGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDs7O0FBR0E7QUFDQTtBQUNBLFdBQVc7OztBQUdYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0EsK0NBQStDO0FBQy9DO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQSxnQ0FBZ0M7QUFDaEM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7OztBQUdBO0FBQ0E7QUFDQTs7QUFFQSxtQ0FBbUM7QUFDbkM7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsU0FBUzs7O0FBR1Q7QUFDQTtBQUNBLFFBQVEsR0FBRzs7QUFFWDtBQUNBLDRDQUE0QztBQUM1QyxTQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBO0FBQ0EseUVBQXlFLGtCQUFrQjtBQUMzRjtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0EsT0FBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxNQUFNOztBQUVOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtREFBbUQ7O0FBRW5EOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLDhCQUE4Qjs7QUFFOUI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBLDJEQUEyRDs7QUFFM0Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJDQUEyQzs7QUFFM0M7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQSxXQUFXOztBQUVYLFNBQVM7QUFDVDtBQUNBLFNBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDRDQUE0QztBQUM1QyxTQUFTOztBQUVULE9BQU87QUFDUDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE9BQU87OztBQUdQOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSwwQkFBMEI7O0FBRTFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWLFNBQVM7QUFDVDtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLFFBQVE7O0FBRVI7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRLEdBQUc7O0FBRVg7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1YsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVSxHQUFHOztBQUViO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDs7O0FBR0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0VBQW9FO0FBQ3BFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9FQUFvRTtBQUNwRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7O0FBRXZDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOLE1BQU07OztBQUdOO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLEdBQUc7O0FBRVA7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsNENBQTRDOztBQUU1QztBQUNBO0FBQ0EsSUFBSSxHQUFHOztBQUVQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLEdBQUc7O0FBRVA7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsSUFBSTtBQUNKOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0VBQW9FO0FBQ3BFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QixlQUFlLFdBQVcsV0FBVyxVQUFVO0FBQzVFO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBLElBQUk7QUFDSjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9FQUFvRTtBQUNwRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1YsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBLE1BQU07QUFDTixJQUFJO0FBQ0o7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvRUFBb0U7QUFDcEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscU5BQXFOO0FBQ3JOO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjs7QUFFQTtBQUNBLElBQUk7QUFDSjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9FQUFvRTtBQUNwRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBOztBQUVBO0FBQ0EsSUFBSTtBQUNKO0FBQ0Esa0NBQWtDOztBQUVsQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtEQUFrRDtBQUNsRCxPQUFPO0FBQ1A7QUFDQTtBQUNBLElBQUk7QUFDSjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9FQUFvRTtBQUNwRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DOztBQUVwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0VBQWdFOztBQUVoRTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0EsTUFBTSxHQUFHOztBQUVUO0FBQ0E7QUFDQSxNQUFNLEdBQUc7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ04sZ0VBQWdFOztBQUVoRTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUixNQUFNO0FBQ04sSUFBSTtBQUNKOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG9FQUFvRTtBQUNwRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0RBQW9ELGNBQWMsZUFBZSxZQUFZLFdBQVcsaUJBQWlCO0FBQ3pIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG9FQUFvRTtBQUNwRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLElBQUk7QUFDSjs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxvRUFBb0U7QUFDcEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBaUQ7QUFDakQsNkNBQTZDO0FBQzdDOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0VBQW9FO0FBQ3BFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9FQUFvRTtBQUNwRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBLElBQUksZ0JBQWdCOztBQUVwQixvQkFBb0I7O0FBRXBCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBLElBQUk7QUFDSjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9FQUFvRTtBQUNwRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9FQUFvRTtBQUNwRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSztBQUNMOzs7QUFHQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0EsSUFBSSxHQUFHOztBQUVQO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsTUFBTTs7O0FBR047QUFDQTtBQUNBLE1BQU07OztBQUdOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7OztBQUdBO0FBQ0E7QUFDQSxNQUFNO0FBQ047OztBQUdBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsSUFBSSxHQUFHOztBQUVQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxJQUFJLEdBQUc7O0FBRVA7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxJQUFJLEdBQUc7QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxRQUFROztBQUVSO0FBQ0EscURBQXFEOztBQUVyRDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLEdBQUc7O0FBRVA7QUFDQTtBQUNBLCtDQUErQzs7QUFFL0MsNENBQTRDO0FBQzVDO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0EsTUFBTSx5QkFBeUI7O0FBRS9CO0FBQ0E7QUFDQTtBQUNBLFNBQVM7OztBQUdUO0FBQ0E7QUFDQSxTQUFTOzs7QUFHVDtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ04sSUFBSTtBQUNKOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsQ0FBQztBQUNELGdDQUFnQztBQUNoQzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDLzNLa0M7QUFHbEMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFO0lBQzFDLDJDQUEyQztJQUMzQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsRUFBRTtRQUNoRCxJQUFJLG1EQUFTLENBQUMsRUFBYyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ3RDLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDLENBQUM7QUFFSDtJQUNJO1FBQ0ksSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7SUFDNUIsQ0FBQztJQUVEOztTQUVLO0lBQ0wsaUNBQWdCLEdBQWhCO1FBQ0ksUUFBUSxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFO1lBQzFDLDJDQUEyQztZQUMzQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsRUFBRTtnQkFDaEQsSUFBSSxtREFBUyxDQUFDLEVBQWMsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUN0QyxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUdMLGFBQUM7QUFBRCxDQUFDOztBQUFBLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDNUJnQztBQUlsQyxJQUFJLElBQUksR0FBRztJQUNQLEtBQUssRUFBRSxFQUFFLENBQUMsOEJBQThCOztJQUN0QyxNQUFNLEVBQUUsRUFBRSxDQUFDLDBCQUEwQjs7SUFDckMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxxQkFBcUI7O0lBQy9CLE1BQU0sRUFBRSxFQUFFLENBQUMsaUNBQWlDOztJQUM1QyxLQUFLLEVBQUUsQ0FBQyxDQUFDLHFDQUFxQzs7SUFDOUMsT0FBTyxFQUFFLENBQUMsQ0FBQywwQkFBMEI7O0lBQ3JDLEtBQUssRUFBRSxNQUFNLENBQUMscUNBQXFDOztJQUNuRCxPQUFPLEVBQUUsSUFBSSxDQUFDLHVCQUF1Qjs7SUFDckMsTUFBTSxFQUFFLENBQUMsQ0FBQyxzQkFBc0I7O0lBQ2hDLFNBQVMsRUFBRSxDQUFDLENBQUMscUNBQXFDOztJQUNsRCxLQUFLLEVBQUUsQ0FBQyxDQUFDLG9CQUFvQjs7SUFDN0IsS0FBSyxFQUFFLEVBQUUsQ0FBQyx1QkFBdUI7O0lBQ2pDLEdBQUcsRUFBRSxFQUFFLENBQUMsa0VBQWtFOztJQUMxRSxNQUFNLEVBQUUsR0FBRyxDQUFDLHVDQUF1Qzs7SUFDbkQsU0FBUyxFQUFFLFNBQVMsQ0FBQyx5Q0FBeUM7O0lBQzlELEdBQUcsRUFBRSxLQUFLLENBQUMsa0NBQWtDOztJQUM3QyxJQUFJLEVBQUUsS0FBSyxDQUFDLG1DQUFtQzs7SUFDL0MsTUFBTSxFQUFFLEtBQUssQ0FBQyw2QkFBNkI7O0lBQzNDLE9BQU8sRUFBRSxLQUFLLENBQUMsdUNBQXVDOztJQUN0RCxRQUFRLEVBQUUsVUFBVSxDQUFDLHNCQUFzQjtDQUNoRCxDQUFDO0FBQ0YsU0FBUztBQUNULElBQUksV0FBVyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDdkQsWUFBWTtBQUNaLElBQUksT0FBTyxHQUFHLElBQUksNENBQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUV2QyxJQUFJLFlBQVksR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3BELElBQUksV0FBVyxJQUFJLElBQUksSUFBSSxZQUFZLElBQUksSUFBSSxJQUFJLE9BQU8sQ0FBQyxFQUFFLEVBQUU7SUFDM0QsWUFBWSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7SUFDM0IsV0FBVyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7SUFDMUIsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUMxQixXQUFXLENBQUMsV0FBVyxDQUFjLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztDQUNwRDtBQUVNLElBQU0sV0FBVyxHQUFHO0lBRXZCLFlBQVksRUFBRztRQUNYLElBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNsRCxRQUFRLENBQUMsT0FBTyxDQUFDLHNCQUFZO1lBQ3pCLFlBQVksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1FBQ2pDLENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxXQUFXLElBQUksSUFBSSxJQUFJLFlBQVksSUFBSSxJQUFJLEVBQUU7WUFDN0MsT0FBTyxDQUFDLElBQUksQ0FBQztZQUNiLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDMUIsWUFBWSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7WUFDNUIsV0FBVyxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7U0FDOUI7SUFDTCxDQUFDO0lBRUQsV0FBVyxFQUFFO1FBQ1QsSUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2xELFFBQVEsQ0FBQyxPQUFPLENBQUMsc0JBQVk7WUFDekIsWUFBWSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7UUFDbEMsQ0FBQyxDQUFDLENBQUM7UUFDSCxJQUFJLFdBQVcsSUFBSSxJQUFJLElBQUksWUFBWSxJQUFJLElBQUksRUFBRTtZQUM3QyxPQUFPLENBQUMsSUFBSSxDQUFDO1lBQ2IsWUFBWSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7WUFDM0IsV0FBVyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7U0FDN0I7SUFDTCxDQUFDO0NBRUosQ0FBQzs7Ozs7Ozs7Ozs7Ozs7OztBQ2xFRixnQkFBZ0IsU0FBSSxJQUFJLFNBQUk7QUFDNUI7QUFDQSxpREFBaUQsT0FBTztBQUN4RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0I7QUFDL0Isd0NBQXdDO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNrQjtBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQztBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLGdCQUFnQjtBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLGlDQUFpQztBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdEQUFnRCxnQkFBZ0I7QUFDaEU7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQjtBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQ0FBMEMsdUJBQXVCO0FBQ2pFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztVQzdMQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsaUNBQWlDLFdBQVc7V0FDNUM7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDTm9EO0FBQ0w7QUFDckI7QUFDSztBQUUvQixJQUFJLHVEQUFNLEVBQUUsQ0FBQztBQUViLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsRUFBRTtJQUUxQyxJQUFJLE9BQU8sR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQ3RELE9BQU8sYUFBUCxPQUFPLHVCQUFQLE9BQU8sQ0FBRSxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsVUFBTyxFQUFFOzs7OztvQkFDeEMseUVBQXdCLEVBQUUsQ0FBQztvQkFFdkIsVUFBVSxHQUFJLFFBQVEsQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFzQixDQUFDLEtBQUssQ0FBQztvQkFFckYscUJBQU0sZ0RBQVMsQ0FBQyxVQUFVLEVBQUU7NEJBQ3hCLFNBQVMsRUFBRTtnQ0FDUCxjQUFjLEVBQUUsa0JBQWtCOzZCQUNyQzt5QkFDSixDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsSUFBSTs0QkFDVCx3RUFBdUIsRUFBRSxDQUFDOzRCQUMxQixRQUFROzRCQUNSLHVEQUFTLENBQUM7Z0NBQ04sSUFBSSxFQUFFLFNBQVM7Z0NBQ2YsS0FBSyxFQUFFLElBQUk7NkJBQ2QsQ0FBQyxDQUFDO3dCQUNQLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFDLEdBQUc7NEJBQ1QsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQzs0QkFDbkIsd0VBQXVCLEVBQUUsQ0FBQzs0QkFFMUIsSUFBSSxRQUFRLEdBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBVyxDQUFDOzRCQUNwRCxJQUFJLFlBQVksR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDOzRCQUM3QyxJQUFJLFlBQVksQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO2dDQUMxQix1REFBUyxDQUFDO29DQUNOLElBQUksRUFBRSxPQUFPO29DQUNiLEtBQUssRUFBRSxLQUFLO29DQUNaLElBQUksRUFBRSxTQUFTLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQztpQ0FDcEMsQ0FBQyxDQUFDOzZCQUNOO2lDQUFNO2dDQUNILHVEQUFTLENBQUM7b0NBQ04sSUFBSSxFQUFFLE9BQU87b0NBQ2IsS0FBSyxFQUFFLEtBQUs7b0NBQ1osSUFBSSxFQUFFLFFBQVE7aUNBQ2pCLENBQUMsQ0FBQzs2QkFDTjt3QkFDTCxDQUFDLENBQUM7O29CQTlCRixTQThCRSxDQUFDOzs7O1NBRU4sQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9hc3AubmV0Ly4vbm9kZV9tb2R1bGVzL2F4aW9zL2luZGV4LmpzIiwid2VicGFjazovL2FzcC5uZXQvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2FkYXB0ZXJzL3hoci5qcyIsIndlYnBhY2s6Ly9hc3AubmV0Ly4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9heGlvcy5qcyIsIndlYnBhY2s6Ly9hc3AubmV0Ly4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jYW5jZWwvQ2FuY2VsVG9rZW4uanMiLCJ3ZWJwYWNrOi8vYXNwLm5ldC8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY2FuY2VsL0NhbmNlbGVkRXJyb3IuanMiLCJ3ZWJwYWNrOi8vYXNwLm5ldC8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY2FuY2VsL2lzQ2FuY2VsLmpzIiwid2VicGFjazovL2FzcC5uZXQvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvQXhpb3MuanMiLCJ3ZWJwYWNrOi8vYXNwLm5ldC8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9BeGlvc0Vycm9yLmpzIiwid2VicGFjazovL2FzcC5uZXQvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvSW50ZXJjZXB0b3JNYW5hZ2VyLmpzIiwid2VicGFjazovL2FzcC5uZXQvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvYnVpbGRGdWxsUGF0aC5qcyIsIndlYnBhY2s6Ly9hc3AubmV0Ly4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL2Rpc3BhdGNoUmVxdWVzdC5qcyIsIndlYnBhY2s6Ly9hc3AubmV0Ly4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL21lcmdlQ29uZmlnLmpzIiwid2VicGFjazovL2FzcC5uZXQvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvc2V0dGxlLmpzIiwid2VicGFjazovL2FzcC5uZXQvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvdHJhbnNmb3JtRGF0YS5qcyIsIndlYnBhY2s6Ly9hc3AubmV0Ly4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9kZWZhdWx0cy9pbmRleC5qcyIsIndlYnBhY2s6Ly9hc3AubmV0Ly4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9kZWZhdWx0cy90cmFuc2l0aW9uYWwuanMiLCJ3ZWJwYWNrOi8vYXNwLm5ldC8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvZW52L2RhdGEuanMiLCJ3ZWJwYWNrOi8vYXNwLm5ldC8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9iaW5kLmpzIiwid2VicGFjazovL2FzcC5uZXQvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvYnVpbGRVUkwuanMiLCJ3ZWJwYWNrOi8vYXNwLm5ldC8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9jb21iaW5lVVJMcy5qcyIsIndlYnBhY2s6Ly9hc3AubmV0Ly4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2Nvb2tpZXMuanMiLCJ3ZWJwYWNrOi8vYXNwLm5ldC8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9pc0Fic29sdXRlVVJMLmpzIiwid2VicGFjazovL2FzcC5uZXQvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvaXNBeGlvc0Vycm9yLmpzIiwid2VicGFjazovL2FzcC5uZXQvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvaXNVUkxTYW1lT3JpZ2luLmpzIiwid2VicGFjazovL2FzcC5uZXQvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvbm9ybWFsaXplSGVhZGVyTmFtZS5qcyIsIndlYnBhY2s6Ly9hc3AubmV0Ly4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL251bGwuanMiLCJ3ZWJwYWNrOi8vYXNwLm5ldC8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9wYXJzZUhlYWRlcnMuanMiLCJ3ZWJwYWNrOi8vYXNwLm5ldC8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9wYXJzZVByb3RvY29sLmpzIiwid2VicGFjazovL2FzcC5uZXQvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvc3ByZWFkLmpzIiwid2VicGFjazovL2FzcC5uZXQvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvdG9Gb3JtRGF0YS5qcyIsIndlYnBhY2s6Ly9hc3AubmV0Ly4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL3ZhbGlkYXRvci5qcyIsIndlYnBhY2s6Ly9hc3AubmV0Ly4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi91dGlscy5qcyIsIndlYnBhY2s6Ly9hc3AubmV0Ly4vbm9kZV9tb2R1bGVzL3N3ZWV0YWxlcnQyL2Rpc3Qvc3dlZXRhbGVydDIuYWxsLmpzIiwid2VicGFjazovL2FzcC5uZXQvLi9ub2RlX21vZHVsZXMvdG9tLXNlbGVjdC9kaXN0L2pzL3RvbS1zZWxlY3QuY29tcGxldGUuanMiLCJ3ZWJwYWNrOi8vYXNwLm5ldC8uL1NjcmlwdHMvY29tbW9uL2Rpc3BfY29tbW9uLnRzIiwid2VicGFjazovL2FzcC5uZXQvLi9TY3JpcHRzL2NvbW1vbi9zcGlubmVyVXRpbC50cyIsIndlYnBhY2s6Ly9hc3AubmV0Ly4vbm9kZV9tb2R1bGVzL3NwaW4uanMvc3Bpbi5qcyIsIndlYnBhY2s6Ly9hc3AubmV0L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2FzcC5uZXQvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vYXNwLm5ldC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYXNwLm5ldC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2FzcC5uZXQvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9hc3AubmV0Ly4vU2NyaXB0cy9lbnRyaWVzL2Rpc3BfTXN0S2ludG9uZUVudmlyb21lbnRzLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9saWIvYXhpb3MnKTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcbnZhciBzZXR0bGUgPSByZXF1aXJlKCcuLy4uL2NvcmUvc2V0dGxlJyk7XG52YXIgY29va2llcyA9IHJlcXVpcmUoJy4vLi4vaGVscGVycy9jb29raWVzJyk7XG52YXIgYnVpbGRVUkwgPSByZXF1aXJlKCcuLy4uL2hlbHBlcnMvYnVpbGRVUkwnKTtcbnZhciBidWlsZEZ1bGxQYXRoID0gcmVxdWlyZSgnLi4vY29yZS9idWlsZEZ1bGxQYXRoJyk7XG52YXIgcGFyc2VIZWFkZXJzID0gcmVxdWlyZSgnLi8uLi9oZWxwZXJzL3BhcnNlSGVhZGVycycpO1xudmFyIGlzVVJMU2FtZU9yaWdpbiA9IHJlcXVpcmUoJy4vLi4vaGVscGVycy9pc1VSTFNhbWVPcmlnaW4nKTtcbnZhciB0cmFuc2l0aW9uYWxEZWZhdWx0cyA9IHJlcXVpcmUoJy4uL2RlZmF1bHRzL3RyYW5zaXRpb25hbCcpO1xudmFyIEF4aW9zRXJyb3IgPSByZXF1aXJlKCcuLi9jb3JlL0F4aW9zRXJyb3InKTtcbnZhciBDYW5jZWxlZEVycm9yID0gcmVxdWlyZSgnLi4vY2FuY2VsL0NhbmNlbGVkRXJyb3InKTtcbnZhciBwYXJzZVByb3RvY29sID0gcmVxdWlyZSgnLi4vaGVscGVycy9wYXJzZVByb3RvY29sJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24geGhyQWRhcHRlcihjb25maWcpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIGRpc3BhdGNoWGhyUmVxdWVzdChyZXNvbHZlLCByZWplY3QpIHtcbiAgICB2YXIgcmVxdWVzdERhdGEgPSBjb25maWcuZGF0YTtcbiAgICB2YXIgcmVxdWVzdEhlYWRlcnMgPSBjb25maWcuaGVhZGVycztcbiAgICB2YXIgcmVzcG9uc2VUeXBlID0gY29uZmlnLnJlc3BvbnNlVHlwZTtcbiAgICB2YXIgb25DYW5jZWxlZDtcbiAgICBmdW5jdGlvbiBkb25lKCkge1xuICAgICAgaWYgKGNvbmZpZy5jYW5jZWxUb2tlbikge1xuICAgICAgICBjb25maWcuY2FuY2VsVG9rZW4udW5zdWJzY3JpYmUob25DYW5jZWxlZCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChjb25maWcuc2lnbmFsKSB7XG4gICAgICAgIGNvbmZpZy5zaWduYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignYWJvcnQnLCBvbkNhbmNlbGVkKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodXRpbHMuaXNGb3JtRGF0YShyZXF1ZXN0RGF0YSkgJiYgdXRpbHMuaXNTdGFuZGFyZEJyb3dzZXJFbnYoKSkge1xuICAgICAgZGVsZXRlIHJlcXVlc3RIZWFkZXJzWydDb250ZW50LVR5cGUnXTsgLy8gTGV0IHRoZSBicm93c2VyIHNldCBpdFxuICAgIH1cblxuICAgIHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cbiAgICAvLyBIVFRQIGJhc2ljIGF1dGhlbnRpY2F0aW9uXG4gICAgaWYgKGNvbmZpZy5hdXRoKSB7XG4gICAgICB2YXIgdXNlcm5hbWUgPSBjb25maWcuYXV0aC51c2VybmFtZSB8fCAnJztcbiAgICAgIHZhciBwYXNzd29yZCA9IGNvbmZpZy5hdXRoLnBhc3N3b3JkID8gdW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KGNvbmZpZy5hdXRoLnBhc3N3b3JkKSkgOiAnJztcbiAgICAgIHJlcXVlc3RIZWFkZXJzLkF1dGhvcml6YXRpb24gPSAnQmFzaWMgJyArIGJ0b2EodXNlcm5hbWUgKyAnOicgKyBwYXNzd29yZCk7XG4gICAgfVxuXG4gICAgdmFyIGZ1bGxQYXRoID0gYnVpbGRGdWxsUGF0aChjb25maWcuYmFzZVVSTCwgY29uZmlnLnVybCk7XG5cbiAgICByZXF1ZXN0Lm9wZW4oY29uZmlnLm1ldGhvZC50b1VwcGVyQ2FzZSgpLCBidWlsZFVSTChmdWxsUGF0aCwgY29uZmlnLnBhcmFtcywgY29uZmlnLnBhcmFtc1NlcmlhbGl6ZXIpLCB0cnVlKTtcblxuICAgIC8vIFNldCB0aGUgcmVxdWVzdCB0aW1lb3V0IGluIE1TXG4gICAgcmVxdWVzdC50aW1lb3V0ID0gY29uZmlnLnRpbWVvdXQ7XG5cbiAgICBmdW5jdGlvbiBvbmxvYWRlbmQoKSB7XG4gICAgICBpZiAoIXJlcXVlc3QpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgLy8gUHJlcGFyZSB0aGUgcmVzcG9uc2VcbiAgICAgIHZhciByZXNwb25zZUhlYWRlcnMgPSAnZ2V0QWxsUmVzcG9uc2VIZWFkZXJzJyBpbiByZXF1ZXN0ID8gcGFyc2VIZWFkZXJzKHJlcXVlc3QuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCkpIDogbnVsbDtcbiAgICAgIHZhciByZXNwb25zZURhdGEgPSAhcmVzcG9uc2VUeXBlIHx8IHJlc3BvbnNlVHlwZSA9PT0gJ3RleHQnIHx8ICByZXNwb25zZVR5cGUgPT09ICdqc29uJyA/XG4gICAgICAgIHJlcXVlc3QucmVzcG9uc2VUZXh0IDogcmVxdWVzdC5yZXNwb25zZTtcbiAgICAgIHZhciByZXNwb25zZSA9IHtcbiAgICAgICAgZGF0YTogcmVzcG9uc2VEYXRhLFxuICAgICAgICBzdGF0dXM6IHJlcXVlc3Quc3RhdHVzLFxuICAgICAgICBzdGF0dXNUZXh0OiByZXF1ZXN0LnN0YXR1c1RleHQsXG4gICAgICAgIGhlYWRlcnM6IHJlc3BvbnNlSGVhZGVycyxcbiAgICAgICAgY29uZmlnOiBjb25maWcsXG4gICAgICAgIHJlcXVlc3Q6IHJlcXVlc3RcbiAgICAgIH07XG5cbiAgICAgIHNldHRsZShmdW5jdGlvbiBfcmVzb2x2ZSh2YWx1ZSkge1xuICAgICAgICByZXNvbHZlKHZhbHVlKTtcbiAgICAgICAgZG9uZSgpO1xuICAgICAgfSwgZnVuY3Rpb24gX3JlamVjdChlcnIpIHtcbiAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgIGRvbmUoKTtcbiAgICAgIH0sIHJlc3BvbnNlKTtcblxuICAgICAgLy8gQ2xlYW4gdXAgcmVxdWVzdFxuICAgICAgcmVxdWVzdCA9IG51bGw7XG4gICAgfVxuXG4gICAgaWYgKCdvbmxvYWRlbmQnIGluIHJlcXVlc3QpIHtcbiAgICAgIC8vIFVzZSBvbmxvYWRlbmQgaWYgYXZhaWxhYmxlXG4gICAgICByZXF1ZXN0Lm9ubG9hZGVuZCA9IG9ubG9hZGVuZDtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gTGlzdGVuIGZvciByZWFkeSBzdGF0ZSB0byBlbXVsYXRlIG9ubG9hZGVuZFxuICAgICAgcmVxdWVzdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiBoYW5kbGVMb2FkKCkge1xuICAgICAgICBpZiAoIXJlcXVlc3QgfHwgcmVxdWVzdC5yZWFkeVN0YXRlICE9PSA0KSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVGhlIHJlcXVlc3QgZXJyb3JlZCBvdXQgYW5kIHdlIGRpZG4ndCBnZXQgYSByZXNwb25zZSwgdGhpcyB3aWxsIGJlXG4gICAgICAgIC8vIGhhbmRsZWQgYnkgb25lcnJvciBpbnN0ZWFkXG4gICAgICAgIC8vIFdpdGggb25lIGV4Y2VwdGlvbjogcmVxdWVzdCB0aGF0IHVzaW5nIGZpbGU6IHByb3RvY29sLCBtb3N0IGJyb3dzZXJzXG4gICAgICAgIC8vIHdpbGwgcmV0dXJuIHN0YXR1cyBhcyAwIGV2ZW4gdGhvdWdoIGl0J3MgYSBzdWNjZXNzZnVsIHJlcXVlc3RcbiAgICAgICAgaWYgKHJlcXVlc3Quc3RhdHVzID09PSAwICYmICEocmVxdWVzdC5yZXNwb25zZVVSTCAmJiByZXF1ZXN0LnJlc3BvbnNlVVJMLmluZGV4T2YoJ2ZpbGU6JykgPT09IDApKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIHJlYWR5c3RhdGUgaGFuZGxlciBpcyBjYWxsaW5nIGJlZm9yZSBvbmVycm9yIG9yIG9udGltZW91dCBoYW5kbGVycyxcbiAgICAgICAgLy8gc28gd2Ugc2hvdWxkIGNhbGwgb25sb2FkZW5kIG9uIHRoZSBuZXh0ICd0aWNrJ1xuICAgICAgICBzZXRUaW1lb3V0KG9ubG9hZGVuZCk7XG4gICAgICB9O1xuICAgIH1cblxuICAgIC8vIEhhbmRsZSBicm93c2VyIHJlcXVlc3QgY2FuY2VsbGF0aW9uIChhcyBvcHBvc2VkIHRvIGEgbWFudWFsIGNhbmNlbGxhdGlvbilcbiAgICByZXF1ZXN0Lm9uYWJvcnQgPSBmdW5jdGlvbiBoYW5kbGVBYm9ydCgpIHtcbiAgICAgIGlmICghcmVxdWVzdCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHJlamVjdChuZXcgQXhpb3NFcnJvcignUmVxdWVzdCBhYm9ydGVkJywgQXhpb3NFcnJvci5FQ09OTkFCT1JURUQsIGNvbmZpZywgcmVxdWVzdCkpO1xuXG4gICAgICAvLyBDbGVhbiB1cCByZXF1ZXN0XG4gICAgICByZXF1ZXN0ID0gbnVsbDtcbiAgICB9O1xuXG4gICAgLy8gSGFuZGxlIGxvdyBsZXZlbCBuZXR3b3JrIGVycm9yc1xuICAgIHJlcXVlc3Qub25lcnJvciA9IGZ1bmN0aW9uIGhhbmRsZUVycm9yKCkge1xuICAgICAgLy8gUmVhbCBlcnJvcnMgYXJlIGhpZGRlbiBmcm9tIHVzIGJ5IHRoZSBicm93c2VyXG4gICAgICAvLyBvbmVycm9yIHNob3VsZCBvbmx5IGZpcmUgaWYgaXQncyBhIG5ldHdvcmsgZXJyb3JcbiAgICAgIHJlamVjdChuZXcgQXhpb3NFcnJvcignTmV0d29yayBFcnJvcicsIEF4aW9zRXJyb3IuRVJSX05FVFdPUkssIGNvbmZpZywgcmVxdWVzdCwgcmVxdWVzdCkpO1xuXG4gICAgICAvLyBDbGVhbiB1cCByZXF1ZXN0XG4gICAgICByZXF1ZXN0ID0gbnVsbDtcbiAgICB9O1xuXG4gICAgLy8gSGFuZGxlIHRpbWVvdXRcbiAgICByZXF1ZXN0Lm9udGltZW91dCA9IGZ1bmN0aW9uIGhhbmRsZVRpbWVvdXQoKSB7XG4gICAgICB2YXIgdGltZW91dEVycm9yTWVzc2FnZSA9IGNvbmZpZy50aW1lb3V0ID8gJ3RpbWVvdXQgb2YgJyArIGNvbmZpZy50aW1lb3V0ICsgJ21zIGV4Y2VlZGVkJyA6ICd0aW1lb3V0IGV4Y2VlZGVkJztcbiAgICAgIHZhciB0cmFuc2l0aW9uYWwgPSBjb25maWcudHJhbnNpdGlvbmFsIHx8IHRyYW5zaXRpb25hbERlZmF1bHRzO1xuICAgICAgaWYgKGNvbmZpZy50aW1lb3V0RXJyb3JNZXNzYWdlKSB7XG4gICAgICAgIHRpbWVvdXRFcnJvck1lc3NhZ2UgPSBjb25maWcudGltZW91dEVycm9yTWVzc2FnZTtcbiAgICAgIH1cbiAgICAgIHJlamVjdChuZXcgQXhpb3NFcnJvcihcbiAgICAgICAgdGltZW91dEVycm9yTWVzc2FnZSxcbiAgICAgICAgdHJhbnNpdGlvbmFsLmNsYXJpZnlUaW1lb3V0RXJyb3IgPyBBeGlvc0Vycm9yLkVUSU1FRE9VVCA6IEF4aW9zRXJyb3IuRUNPTk5BQk9SVEVELFxuICAgICAgICBjb25maWcsXG4gICAgICAgIHJlcXVlc3QpKTtcblxuICAgICAgLy8gQ2xlYW4gdXAgcmVxdWVzdFxuICAgICAgcmVxdWVzdCA9IG51bGw7XG4gICAgfTtcblxuICAgIC8vIEFkZCB4c3JmIGhlYWRlclxuICAgIC8vIFRoaXMgaXMgb25seSBkb25lIGlmIHJ1bm5pbmcgaW4gYSBzdGFuZGFyZCBicm93c2VyIGVudmlyb25tZW50LlxuICAgIC8vIFNwZWNpZmljYWxseSBub3QgaWYgd2UncmUgaW4gYSB3ZWIgd29ya2VyLCBvciByZWFjdC1uYXRpdmUuXG4gICAgaWYgKHV0aWxzLmlzU3RhbmRhcmRCcm93c2VyRW52KCkpIHtcbiAgICAgIC8vIEFkZCB4c3JmIGhlYWRlclxuICAgICAgdmFyIHhzcmZWYWx1ZSA9IChjb25maWcud2l0aENyZWRlbnRpYWxzIHx8IGlzVVJMU2FtZU9yaWdpbihmdWxsUGF0aCkpICYmIGNvbmZpZy54c3JmQ29va2llTmFtZSA/XG4gICAgICAgIGNvb2tpZXMucmVhZChjb25maWcueHNyZkNvb2tpZU5hbWUpIDpcbiAgICAgICAgdW5kZWZpbmVkO1xuXG4gICAgICBpZiAoeHNyZlZhbHVlKSB7XG4gICAgICAgIHJlcXVlc3RIZWFkZXJzW2NvbmZpZy54c3JmSGVhZGVyTmFtZV0gPSB4c3JmVmFsdWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gQWRkIGhlYWRlcnMgdG8gdGhlIHJlcXVlc3RcbiAgICBpZiAoJ3NldFJlcXVlc3RIZWFkZXInIGluIHJlcXVlc3QpIHtcbiAgICAgIHV0aWxzLmZvckVhY2gocmVxdWVzdEhlYWRlcnMsIGZ1bmN0aW9uIHNldFJlcXVlc3RIZWFkZXIodmFsLCBrZXkpIHtcbiAgICAgICAgaWYgKHR5cGVvZiByZXF1ZXN0RGF0YSA9PT0gJ3VuZGVmaW5lZCcgJiYga2V5LnRvTG93ZXJDYXNlKCkgPT09ICdjb250ZW50LXR5cGUnKSB7XG4gICAgICAgICAgLy8gUmVtb3ZlIENvbnRlbnQtVHlwZSBpZiBkYXRhIGlzIHVuZGVmaW5lZFxuICAgICAgICAgIGRlbGV0ZSByZXF1ZXN0SGVhZGVyc1trZXldO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIE90aGVyd2lzZSBhZGQgaGVhZGVyIHRvIHRoZSByZXF1ZXN0XG4gICAgICAgICAgcmVxdWVzdC5zZXRSZXF1ZXN0SGVhZGVyKGtleSwgdmFsKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gQWRkIHdpdGhDcmVkZW50aWFscyB0byByZXF1ZXN0IGlmIG5lZWRlZFxuICAgIGlmICghdXRpbHMuaXNVbmRlZmluZWQoY29uZmlnLndpdGhDcmVkZW50aWFscykpIHtcbiAgICAgIHJlcXVlc3Qud2l0aENyZWRlbnRpYWxzID0gISFjb25maWcud2l0aENyZWRlbnRpYWxzO1xuICAgIH1cblxuICAgIC8vIEFkZCByZXNwb25zZVR5cGUgdG8gcmVxdWVzdCBpZiBuZWVkZWRcbiAgICBpZiAocmVzcG9uc2VUeXBlICYmIHJlc3BvbnNlVHlwZSAhPT0gJ2pzb24nKSB7XG4gICAgICByZXF1ZXN0LnJlc3BvbnNlVHlwZSA9IGNvbmZpZy5yZXNwb25zZVR5cGU7XG4gICAgfVxuXG4gICAgLy8gSGFuZGxlIHByb2dyZXNzIGlmIG5lZWRlZFxuICAgIGlmICh0eXBlb2YgY29uZmlnLm9uRG93bmxvYWRQcm9ncmVzcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmVxdWVzdC5hZGRFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsIGNvbmZpZy5vbkRvd25sb2FkUHJvZ3Jlc3MpO1xuICAgIH1cblxuICAgIC8vIE5vdCBhbGwgYnJvd3NlcnMgc3VwcG9ydCB1cGxvYWQgZXZlbnRzXG4gICAgaWYgKHR5cGVvZiBjb25maWcub25VcGxvYWRQcm9ncmVzcyA9PT0gJ2Z1bmN0aW9uJyAmJiByZXF1ZXN0LnVwbG9hZCkge1xuICAgICAgcmVxdWVzdC51cGxvYWQuYWRkRXZlbnRMaXN0ZW5lcigncHJvZ3Jlc3MnLCBjb25maWcub25VcGxvYWRQcm9ncmVzcyk7XG4gICAgfVxuXG4gICAgaWYgKGNvbmZpZy5jYW5jZWxUb2tlbiB8fCBjb25maWcuc2lnbmFsKSB7XG4gICAgICAvLyBIYW5kbGUgY2FuY2VsbGF0aW9uXG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZnVuYy1uYW1lc1xuICAgICAgb25DYW5jZWxlZCA9IGZ1bmN0aW9uKGNhbmNlbCkge1xuICAgICAgICBpZiAoIXJlcXVlc3QpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgcmVqZWN0KCFjYW5jZWwgfHwgKGNhbmNlbCAmJiBjYW5jZWwudHlwZSkgPyBuZXcgQ2FuY2VsZWRFcnJvcigpIDogY2FuY2VsKTtcbiAgICAgICAgcmVxdWVzdC5hYm9ydCgpO1xuICAgICAgICByZXF1ZXN0ID0gbnVsbDtcbiAgICAgIH07XG5cbiAgICAgIGNvbmZpZy5jYW5jZWxUb2tlbiAmJiBjb25maWcuY2FuY2VsVG9rZW4uc3Vic2NyaWJlKG9uQ2FuY2VsZWQpO1xuICAgICAgaWYgKGNvbmZpZy5zaWduYWwpIHtcbiAgICAgICAgY29uZmlnLnNpZ25hbC5hYm9ydGVkID8gb25DYW5jZWxlZCgpIDogY29uZmlnLnNpZ25hbC5hZGRFdmVudExpc3RlbmVyKCdhYm9ydCcsIG9uQ2FuY2VsZWQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghcmVxdWVzdERhdGEpIHtcbiAgICAgIHJlcXVlc3REYXRhID0gbnVsbDtcbiAgICB9XG5cbiAgICB2YXIgcHJvdG9jb2wgPSBwYXJzZVByb3RvY29sKGZ1bGxQYXRoKTtcblxuICAgIGlmIChwcm90b2NvbCAmJiBbICdodHRwJywgJ2h0dHBzJywgJ2ZpbGUnIF0uaW5kZXhPZihwcm90b2NvbCkgPT09IC0xKSB7XG4gICAgICByZWplY3QobmV3IEF4aW9zRXJyb3IoJ1Vuc3VwcG9ydGVkIHByb3RvY29sICcgKyBwcm90b2NvbCArICc6JywgQXhpb3NFcnJvci5FUlJfQkFEX1JFUVVFU1QsIGNvbmZpZykpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuXG4gICAgLy8gU2VuZCB0aGUgcmVxdWVzdFxuICAgIHJlcXVlc3Quc2VuZChyZXF1ZXN0RGF0YSk7XG4gIH0pO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xudmFyIGJpbmQgPSByZXF1aXJlKCcuL2hlbHBlcnMvYmluZCcpO1xudmFyIEF4aW9zID0gcmVxdWlyZSgnLi9jb3JlL0F4aW9zJyk7XG52YXIgbWVyZ2VDb25maWcgPSByZXF1aXJlKCcuL2NvcmUvbWVyZ2VDb25maWcnKTtcbnZhciBkZWZhdWx0cyA9IHJlcXVpcmUoJy4vZGVmYXVsdHMnKTtcblxuLyoqXG4gKiBDcmVhdGUgYW4gaW5zdGFuY2Ugb2YgQXhpb3NcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gZGVmYXVsdENvbmZpZyBUaGUgZGVmYXVsdCBjb25maWcgZm9yIHRoZSBpbnN0YW5jZVxuICogQHJldHVybiB7QXhpb3N9IEEgbmV3IGluc3RhbmNlIG9mIEF4aW9zXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUluc3RhbmNlKGRlZmF1bHRDb25maWcpIHtcbiAgdmFyIGNvbnRleHQgPSBuZXcgQXhpb3MoZGVmYXVsdENvbmZpZyk7XG4gIHZhciBpbnN0YW5jZSA9IGJpbmQoQXhpb3MucHJvdG90eXBlLnJlcXVlc3QsIGNvbnRleHQpO1xuXG4gIC8vIENvcHkgYXhpb3MucHJvdG90eXBlIHRvIGluc3RhbmNlXG4gIHV0aWxzLmV4dGVuZChpbnN0YW5jZSwgQXhpb3MucHJvdG90eXBlLCBjb250ZXh0KTtcblxuICAvLyBDb3B5IGNvbnRleHQgdG8gaW5zdGFuY2VcbiAgdXRpbHMuZXh0ZW5kKGluc3RhbmNlLCBjb250ZXh0KTtcblxuICAvLyBGYWN0b3J5IGZvciBjcmVhdGluZyBuZXcgaW5zdGFuY2VzXG4gIGluc3RhbmNlLmNyZWF0ZSA9IGZ1bmN0aW9uIGNyZWF0ZShpbnN0YW5jZUNvbmZpZykge1xuICAgIHJldHVybiBjcmVhdGVJbnN0YW5jZShtZXJnZUNvbmZpZyhkZWZhdWx0Q29uZmlnLCBpbnN0YW5jZUNvbmZpZykpO1xuICB9O1xuXG4gIHJldHVybiBpbnN0YW5jZTtcbn1cblxuLy8gQ3JlYXRlIHRoZSBkZWZhdWx0IGluc3RhbmNlIHRvIGJlIGV4cG9ydGVkXG52YXIgYXhpb3MgPSBjcmVhdGVJbnN0YW5jZShkZWZhdWx0cyk7XG5cbi8vIEV4cG9zZSBBeGlvcyBjbGFzcyB0byBhbGxvdyBjbGFzcyBpbmhlcml0YW5jZVxuYXhpb3MuQXhpb3MgPSBBeGlvcztcblxuLy8gRXhwb3NlIENhbmNlbCAmIENhbmNlbFRva2VuXG5heGlvcy5DYW5jZWxlZEVycm9yID0gcmVxdWlyZSgnLi9jYW5jZWwvQ2FuY2VsZWRFcnJvcicpO1xuYXhpb3MuQ2FuY2VsVG9rZW4gPSByZXF1aXJlKCcuL2NhbmNlbC9DYW5jZWxUb2tlbicpO1xuYXhpb3MuaXNDYW5jZWwgPSByZXF1aXJlKCcuL2NhbmNlbC9pc0NhbmNlbCcpO1xuYXhpb3MuVkVSU0lPTiA9IHJlcXVpcmUoJy4vZW52L2RhdGEnKS52ZXJzaW9uO1xuYXhpb3MudG9Gb3JtRGF0YSA9IHJlcXVpcmUoJy4vaGVscGVycy90b0Zvcm1EYXRhJyk7XG5cbi8vIEV4cG9zZSBBeGlvc0Vycm9yIGNsYXNzXG5heGlvcy5BeGlvc0Vycm9yID0gcmVxdWlyZSgnLi4vbGliL2NvcmUvQXhpb3NFcnJvcicpO1xuXG4vLyBhbGlhcyBmb3IgQ2FuY2VsZWRFcnJvciBmb3IgYmFja3dhcmQgY29tcGF0aWJpbGl0eVxuYXhpb3MuQ2FuY2VsID0gYXhpb3MuQ2FuY2VsZWRFcnJvcjtcblxuLy8gRXhwb3NlIGFsbC9zcHJlYWRcbmF4aW9zLmFsbCA9IGZ1bmN0aW9uIGFsbChwcm9taXNlcykge1xuICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xufTtcbmF4aW9zLnNwcmVhZCA9IHJlcXVpcmUoJy4vaGVscGVycy9zcHJlYWQnKTtcblxuLy8gRXhwb3NlIGlzQXhpb3NFcnJvclxuYXhpb3MuaXNBeGlvc0Vycm9yID0gcmVxdWlyZSgnLi9oZWxwZXJzL2lzQXhpb3NFcnJvcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGF4aW9zO1xuXG4vLyBBbGxvdyB1c2Ugb2YgZGVmYXVsdCBpbXBvcnQgc3ludGF4IGluIFR5cGVTY3JpcHRcbm1vZHVsZS5leHBvcnRzLmRlZmF1bHQgPSBheGlvcztcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIENhbmNlbGVkRXJyb3IgPSByZXF1aXJlKCcuL0NhbmNlbGVkRXJyb3InKTtcblxuLyoqXG4gKiBBIGBDYW5jZWxUb2tlbmAgaXMgYW4gb2JqZWN0IHRoYXQgY2FuIGJlIHVzZWQgdG8gcmVxdWVzdCBjYW5jZWxsYXRpb24gb2YgYW4gb3BlcmF0aW9uLlxuICpcbiAqIEBjbGFzc1xuICogQHBhcmFtIHtGdW5jdGlvbn0gZXhlY3V0b3IgVGhlIGV4ZWN1dG9yIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBDYW5jZWxUb2tlbihleGVjdXRvcikge1xuICBpZiAodHlwZW9mIGV4ZWN1dG9yICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignZXhlY3V0b3IgbXVzdCBiZSBhIGZ1bmN0aW9uLicpO1xuICB9XG5cbiAgdmFyIHJlc29sdmVQcm9taXNlO1xuXG4gIHRoaXMucHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uIHByb21pc2VFeGVjdXRvcihyZXNvbHZlKSB7XG4gICAgcmVzb2x2ZVByb21pc2UgPSByZXNvbHZlO1xuICB9KTtcblxuICB2YXIgdG9rZW4gPSB0aGlzO1xuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBmdW5jLW5hbWVzXG4gIHRoaXMucHJvbWlzZS50aGVuKGZ1bmN0aW9uKGNhbmNlbCkge1xuICAgIGlmICghdG9rZW4uX2xpc3RlbmVycykgcmV0dXJuO1xuXG4gICAgdmFyIGk7XG4gICAgdmFyIGwgPSB0b2tlbi5fbGlzdGVuZXJzLmxlbmd0aDtcblxuICAgIGZvciAoaSA9IDA7IGkgPCBsOyBpKyspIHtcbiAgICAgIHRva2VuLl9saXN0ZW5lcnNbaV0oY2FuY2VsKTtcbiAgICB9XG4gICAgdG9rZW4uX2xpc3RlbmVycyA9IG51bGw7XG4gIH0pO1xuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBmdW5jLW5hbWVzXG4gIHRoaXMucHJvbWlzZS50aGVuID0gZnVuY3Rpb24ob25mdWxmaWxsZWQpIHtcbiAgICB2YXIgX3Jlc29sdmU7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGZ1bmMtbmFtZXNcbiAgICB2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpIHtcbiAgICAgIHRva2VuLnN1YnNjcmliZShyZXNvbHZlKTtcbiAgICAgIF9yZXNvbHZlID0gcmVzb2x2ZTtcbiAgICB9KS50aGVuKG9uZnVsZmlsbGVkKTtcblxuICAgIHByb21pc2UuY2FuY2VsID0gZnVuY3Rpb24gcmVqZWN0KCkge1xuICAgICAgdG9rZW4udW5zdWJzY3JpYmUoX3Jlc29sdmUpO1xuICAgIH07XG5cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfTtcblxuICBleGVjdXRvcihmdW5jdGlvbiBjYW5jZWwobWVzc2FnZSkge1xuICAgIGlmICh0b2tlbi5yZWFzb24pIHtcbiAgICAgIC8vIENhbmNlbGxhdGlvbiBoYXMgYWxyZWFkeSBiZWVuIHJlcXVlc3RlZFxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRva2VuLnJlYXNvbiA9IG5ldyBDYW5jZWxlZEVycm9yKG1lc3NhZ2UpO1xuICAgIHJlc29sdmVQcm9taXNlKHRva2VuLnJlYXNvbik7XG4gIH0pO1xufVxuXG4vKipcbiAqIFRocm93cyBhIGBDYW5jZWxlZEVycm9yYCBpZiBjYW5jZWxsYXRpb24gaGFzIGJlZW4gcmVxdWVzdGVkLlxuICovXG5DYW5jZWxUb2tlbi5wcm90b3R5cGUudGhyb3dJZlJlcXVlc3RlZCA9IGZ1bmN0aW9uIHRocm93SWZSZXF1ZXN0ZWQoKSB7XG4gIGlmICh0aGlzLnJlYXNvbikge1xuICAgIHRocm93IHRoaXMucmVhc29uO1xuICB9XG59O1xuXG4vKipcbiAqIFN1YnNjcmliZSB0byB0aGUgY2FuY2VsIHNpZ25hbFxuICovXG5cbkNhbmNlbFRva2VuLnByb3RvdHlwZS5zdWJzY3JpYmUgPSBmdW5jdGlvbiBzdWJzY3JpYmUobGlzdGVuZXIpIHtcbiAgaWYgKHRoaXMucmVhc29uKSB7XG4gICAgbGlzdGVuZXIodGhpcy5yZWFzb24pO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmICh0aGlzLl9saXN0ZW5lcnMpIHtcbiAgICB0aGlzLl9saXN0ZW5lcnMucHVzaChsaXN0ZW5lcik7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5fbGlzdGVuZXJzID0gW2xpc3RlbmVyXTtcbiAgfVxufTtcblxuLyoqXG4gKiBVbnN1YnNjcmliZSBmcm9tIHRoZSBjYW5jZWwgc2lnbmFsXG4gKi9cblxuQ2FuY2VsVG9rZW4ucHJvdG90eXBlLnVuc3Vic2NyaWJlID0gZnVuY3Rpb24gdW5zdWJzY3JpYmUobGlzdGVuZXIpIHtcbiAgaWYgKCF0aGlzLl9saXN0ZW5lcnMpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdmFyIGluZGV4ID0gdGhpcy5fbGlzdGVuZXJzLmluZGV4T2YobGlzdGVuZXIpO1xuICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgdGhpcy5fbGlzdGVuZXJzLnNwbGljZShpbmRleCwgMSk7XG4gIH1cbn07XG5cbi8qKlxuICogUmV0dXJucyBhbiBvYmplY3QgdGhhdCBjb250YWlucyBhIG5ldyBgQ2FuY2VsVG9rZW5gIGFuZCBhIGZ1bmN0aW9uIHRoYXQsIHdoZW4gY2FsbGVkLFxuICogY2FuY2VscyB0aGUgYENhbmNlbFRva2VuYC5cbiAqL1xuQ2FuY2VsVG9rZW4uc291cmNlID0gZnVuY3Rpb24gc291cmNlKCkge1xuICB2YXIgY2FuY2VsO1xuICB2YXIgdG9rZW4gPSBuZXcgQ2FuY2VsVG9rZW4oZnVuY3Rpb24gZXhlY3V0b3IoYykge1xuICAgIGNhbmNlbCA9IGM7XG4gIH0pO1xuICByZXR1cm4ge1xuICAgIHRva2VuOiB0b2tlbixcbiAgICBjYW5jZWw6IGNhbmNlbFxuICB9O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDYW5jZWxUb2tlbjtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIEF4aW9zRXJyb3IgPSByZXF1aXJlKCcuLi9jb3JlL0F4aW9zRXJyb3InKTtcbnZhciB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzJyk7XG5cbi8qKlxuICogQSBgQ2FuY2VsZWRFcnJvcmAgaXMgYW4gb2JqZWN0IHRoYXQgaXMgdGhyb3duIHdoZW4gYW4gb3BlcmF0aW9uIGlzIGNhbmNlbGVkLlxuICpcbiAqIEBjbGFzc1xuICogQHBhcmFtIHtzdHJpbmc9fSBtZXNzYWdlIFRoZSBtZXNzYWdlLlxuICovXG5mdW5jdGlvbiBDYW5jZWxlZEVycm9yKG1lc3NhZ2UpIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWVxLW51bGwsZXFlcWVxXG4gIEF4aW9zRXJyb3IuY2FsbCh0aGlzLCBtZXNzYWdlID09IG51bGwgPyAnY2FuY2VsZWQnIDogbWVzc2FnZSwgQXhpb3NFcnJvci5FUlJfQ0FOQ0VMRUQpO1xuICB0aGlzLm5hbWUgPSAnQ2FuY2VsZWRFcnJvcic7XG59XG5cbnV0aWxzLmluaGVyaXRzKENhbmNlbGVkRXJyb3IsIEF4aW9zRXJyb3IsIHtcbiAgX19DQU5DRUxfXzogdHJ1ZVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gQ2FuY2VsZWRFcnJvcjtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0NhbmNlbCh2YWx1ZSkge1xuICByZXR1cm4gISEodmFsdWUgJiYgdmFsdWUuX19DQU5DRUxfXyk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG52YXIgYnVpbGRVUkwgPSByZXF1aXJlKCcuLi9oZWxwZXJzL2J1aWxkVVJMJyk7XG52YXIgSW50ZXJjZXB0b3JNYW5hZ2VyID0gcmVxdWlyZSgnLi9JbnRlcmNlcHRvck1hbmFnZXInKTtcbnZhciBkaXNwYXRjaFJlcXVlc3QgPSByZXF1aXJlKCcuL2Rpc3BhdGNoUmVxdWVzdCcpO1xudmFyIG1lcmdlQ29uZmlnID0gcmVxdWlyZSgnLi9tZXJnZUNvbmZpZycpO1xudmFyIGJ1aWxkRnVsbFBhdGggPSByZXF1aXJlKCcuL2J1aWxkRnVsbFBhdGgnKTtcbnZhciB2YWxpZGF0b3IgPSByZXF1aXJlKCcuLi9oZWxwZXJzL3ZhbGlkYXRvcicpO1xuXG52YXIgdmFsaWRhdG9ycyA9IHZhbGlkYXRvci52YWxpZGF0b3JzO1xuLyoqXG4gKiBDcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb2YgQXhpb3NcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gaW5zdGFuY2VDb25maWcgVGhlIGRlZmF1bHQgY29uZmlnIGZvciB0aGUgaW5zdGFuY2VcbiAqL1xuZnVuY3Rpb24gQXhpb3MoaW5zdGFuY2VDb25maWcpIHtcbiAgdGhpcy5kZWZhdWx0cyA9IGluc3RhbmNlQ29uZmlnO1xuICB0aGlzLmludGVyY2VwdG9ycyA9IHtcbiAgICByZXF1ZXN0OiBuZXcgSW50ZXJjZXB0b3JNYW5hZ2VyKCksXG4gICAgcmVzcG9uc2U6IG5ldyBJbnRlcmNlcHRvck1hbmFnZXIoKVxuICB9O1xufVxuXG4vKipcbiAqIERpc3BhdGNoIGEgcmVxdWVzdFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgVGhlIGNvbmZpZyBzcGVjaWZpYyBmb3IgdGhpcyByZXF1ZXN0IChtZXJnZWQgd2l0aCB0aGlzLmRlZmF1bHRzKVxuICovXG5BeGlvcy5wcm90b3R5cGUucmVxdWVzdCA9IGZ1bmN0aW9uIHJlcXVlc3QoY29uZmlnT3JVcmwsIGNvbmZpZykge1xuICAvKmVzbGludCBuby1wYXJhbS1yZWFzc2lnbjowKi9cbiAgLy8gQWxsb3cgZm9yIGF4aW9zKCdleGFtcGxlL3VybCdbLCBjb25maWddKSBhIGxhIGZldGNoIEFQSVxuICBpZiAodHlwZW9mIGNvbmZpZ09yVXJsID09PSAnc3RyaW5nJykge1xuICAgIGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcbiAgICBjb25maWcudXJsID0gY29uZmlnT3JVcmw7XG4gIH0gZWxzZSB7XG4gICAgY29uZmlnID0gY29uZmlnT3JVcmwgfHwge307XG4gIH1cblxuICBjb25maWcgPSBtZXJnZUNvbmZpZyh0aGlzLmRlZmF1bHRzLCBjb25maWcpO1xuXG4gIC8vIFNldCBjb25maWcubWV0aG9kXG4gIGlmIChjb25maWcubWV0aG9kKSB7XG4gICAgY29uZmlnLm1ldGhvZCA9IGNvbmZpZy5tZXRob2QudG9Mb3dlckNhc2UoKTtcbiAgfSBlbHNlIGlmICh0aGlzLmRlZmF1bHRzLm1ldGhvZCkge1xuICAgIGNvbmZpZy5tZXRob2QgPSB0aGlzLmRlZmF1bHRzLm1ldGhvZC50b0xvd2VyQ2FzZSgpO1xuICB9IGVsc2Uge1xuICAgIGNvbmZpZy5tZXRob2QgPSAnZ2V0JztcbiAgfVxuXG4gIHZhciB0cmFuc2l0aW9uYWwgPSBjb25maWcudHJhbnNpdGlvbmFsO1xuXG4gIGlmICh0cmFuc2l0aW9uYWwgIT09IHVuZGVmaW5lZCkge1xuICAgIHZhbGlkYXRvci5hc3NlcnRPcHRpb25zKHRyYW5zaXRpb25hbCwge1xuICAgICAgc2lsZW50SlNPTlBhcnNpbmc6IHZhbGlkYXRvcnMudHJhbnNpdGlvbmFsKHZhbGlkYXRvcnMuYm9vbGVhbiksXG4gICAgICBmb3JjZWRKU09OUGFyc2luZzogdmFsaWRhdG9ycy50cmFuc2l0aW9uYWwodmFsaWRhdG9ycy5ib29sZWFuKSxcbiAgICAgIGNsYXJpZnlUaW1lb3V0RXJyb3I6IHZhbGlkYXRvcnMudHJhbnNpdGlvbmFsKHZhbGlkYXRvcnMuYm9vbGVhbilcbiAgICB9LCBmYWxzZSk7XG4gIH1cblxuICAvLyBmaWx0ZXIgb3V0IHNraXBwZWQgaW50ZXJjZXB0b3JzXG4gIHZhciByZXF1ZXN0SW50ZXJjZXB0b3JDaGFpbiA9IFtdO1xuICB2YXIgc3luY2hyb25vdXNSZXF1ZXN0SW50ZXJjZXB0b3JzID0gdHJ1ZTtcbiAgdGhpcy5pbnRlcmNlcHRvcnMucmVxdWVzdC5mb3JFYWNoKGZ1bmN0aW9uIHVuc2hpZnRSZXF1ZXN0SW50ZXJjZXB0b3JzKGludGVyY2VwdG9yKSB7XG4gICAgaWYgKHR5cGVvZiBpbnRlcmNlcHRvci5ydW5XaGVuID09PSAnZnVuY3Rpb24nICYmIGludGVyY2VwdG9yLnJ1bldoZW4oY29uZmlnKSA9PT0gZmFsc2UpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBzeW5jaHJvbm91c1JlcXVlc3RJbnRlcmNlcHRvcnMgPSBzeW5jaHJvbm91c1JlcXVlc3RJbnRlcmNlcHRvcnMgJiYgaW50ZXJjZXB0b3Iuc3luY2hyb25vdXM7XG5cbiAgICByZXF1ZXN0SW50ZXJjZXB0b3JDaGFpbi51bnNoaWZ0KGludGVyY2VwdG9yLmZ1bGZpbGxlZCwgaW50ZXJjZXB0b3IucmVqZWN0ZWQpO1xuICB9KTtcblxuICB2YXIgcmVzcG9uc2VJbnRlcmNlcHRvckNoYWluID0gW107XG4gIHRoaXMuaW50ZXJjZXB0b3JzLnJlc3BvbnNlLmZvckVhY2goZnVuY3Rpb24gcHVzaFJlc3BvbnNlSW50ZXJjZXB0b3JzKGludGVyY2VwdG9yKSB7XG4gICAgcmVzcG9uc2VJbnRlcmNlcHRvckNoYWluLnB1c2goaW50ZXJjZXB0b3IuZnVsZmlsbGVkLCBpbnRlcmNlcHRvci5yZWplY3RlZCk7XG4gIH0pO1xuXG4gIHZhciBwcm9taXNlO1xuXG4gIGlmICghc3luY2hyb25vdXNSZXF1ZXN0SW50ZXJjZXB0b3JzKSB7XG4gICAgdmFyIGNoYWluID0gW2Rpc3BhdGNoUmVxdWVzdCwgdW5kZWZpbmVkXTtcblxuICAgIEFycmF5LnByb3RvdHlwZS51bnNoaWZ0LmFwcGx5KGNoYWluLCByZXF1ZXN0SW50ZXJjZXB0b3JDaGFpbik7XG4gICAgY2hhaW4gPSBjaGFpbi5jb25jYXQocmVzcG9uc2VJbnRlcmNlcHRvckNoYWluKTtcblxuICAgIHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoY29uZmlnKTtcbiAgICB3aGlsZSAoY2hhaW4ubGVuZ3RoKSB7XG4gICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKGNoYWluLnNoaWZ0KCksIGNoYWluLnNoaWZ0KCkpO1xuICAgIH1cblxuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG5cblxuICB2YXIgbmV3Q29uZmlnID0gY29uZmlnO1xuICB3aGlsZSAocmVxdWVzdEludGVyY2VwdG9yQ2hhaW4ubGVuZ3RoKSB7XG4gICAgdmFyIG9uRnVsZmlsbGVkID0gcmVxdWVzdEludGVyY2VwdG9yQ2hhaW4uc2hpZnQoKTtcbiAgICB2YXIgb25SZWplY3RlZCA9IHJlcXVlc3RJbnRlcmNlcHRvckNoYWluLnNoaWZ0KCk7XG4gICAgdHJ5IHtcbiAgICAgIG5ld0NvbmZpZyA9IG9uRnVsZmlsbGVkKG5ld0NvbmZpZyk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIG9uUmVqZWN0ZWQoZXJyb3IpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgdHJ5IHtcbiAgICBwcm9taXNlID0gZGlzcGF0Y2hSZXF1ZXN0KG5ld0NvbmZpZyk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGVycm9yKTtcbiAgfVxuXG4gIHdoaWxlIChyZXNwb25zZUludGVyY2VwdG9yQ2hhaW4ubGVuZ3RoKSB7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbihyZXNwb25zZUludGVyY2VwdG9yQ2hhaW4uc2hpZnQoKSwgcmVzcG9uc2VJbnRlcmNlcHRvckNoYWluLnNoaWZ0KCkpO1xuICB9XG5cbiAgcmV0dXJuIHByb21pc2U7XG59O1xuXG5BeGlvcy5wcm90b3R5cGUuZ2V0VXJpID0gZnVuY3Rpb24gZ2V0VXJpKGNvbmZpZykge1xuICBjb25maWcgPSBtZXJnZUNvbmZpZyh0aGlzLmRlZmF1bHRzLCBjb25maWcpO1xuICB2YXIgZnVsbFBhdGggPSBidWlsZEZ1bGxQYXRoKGNvbmZpZy5iYXNlVVJMLCBjb25maWcudXJsKTtcbiAgcmV0dXJuIGJ1aWxkVVJMKGZ1bGxQYXRoLCBjb25maWcucGFyYW1zLCBjb25maWcucGFyYW1zU2VyaWFsaXplcik7XG59O1xuXG4vLyBQcm92aWRlIGFsaWFzZXMgZm9yIHN1cHBvcnRlZCByZXF1ZXN0IG1ldGhvZHNcbnV0aWxzLmZvckVhY2goWydkZWxldGUnLCAnZ2V0JywgJ2hlYWQnLCAnb3B0aW9ucyddLCBmdW5jdGlvbiBmb3JFYWNoTWV0aG9kTm9EYXRhKG1ldGhvZCkge1xuICAvKmVzbGludCBmdW5jLW5hbWVzOjAqL1xuICBBeGlvcy5wcm90b3R5cGVbbWV0aG9kXSA9IGZ1bmN0aW9uKHVybCwgY29uZmlnKSB7XG4gICAgcmV0dXJuIHRoaXMucmVxdWVzdChtZXJnZUNvbmZpZyhjb25maWcgfHwge30sIHtcbiAgICAgIG1ldGhvZDogbWV0aG9kLFxuICAgICAgdXJsOiB1cmwsXG4gICAgICBkYXRhOiAoY29uZmlnIHx8IHt9KS5kYXRhXG4gICAgfSkpO1xuICB9O1xufSk7XG5cbnV0aWxzLmZvckVhY2goWydwb3N0JywgJ3B1dCcsICdwYXRjaCddLCBmdW5jdGlvbiBmb3JFYWNoTWV0aG9kV2l0aERhdGEobWV0aG9kKSB7XG4gIC8qZXNsaW50IGZ1bmMtbmFtZXM6MCovXG5cbiAgZnVuY3Rpb24gZ2VuZXJhdGVIVFRQTWV0aG9kKGlzRm9ybSkge1xuICAgIHJldHVybiBmdW5jdGlvbiBodHRwTWV0aG9kKHVybCwgZGF0YSwgY29uZmlnKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KG1lcmdlQ29uZmlnKGNvbmZpZyB8fCB7fSwge1xuICAgICAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICAgICAgaGVhZGVyczogaXNGb3JtID8ge1xuICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnbXVsdGlwYXJ0L2Zvcm0tZGF0YSdcbiAgICAgICAgfSA6IHt9LFxuICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgZGF0YTogZGF0YVxuICAgICAgfSkpO1xuICAgIH07XG4gIH1cblxuICBBeGlvcy5wcm90b3R5cGVbbWV0aG9kXSA9IGdlbmVyYXRlSFRUUE1ldGhvZCgpO1xuXG4gIEF4aW9zLnByb3RvdHlwZVttZXRob2QgKyAnRm9ybSddID0gZ2VuZXJhdGVIVFRQTWV0aG9kKHRydWUpO1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gQXhpb3M7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzJyk7XG5cbi8qKlxuICogQ3JlYXRlIGFuIEVycm9yIHdpdGggdGhlIHNwZWNpZmllZCBtZXNzYWdlLCBjb25maWcsIGVycm9yIGNvZGUsIHJlcXVlc3QgYW5kIHJlc3BvbnNlLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlIFRoZSBlcnJvciBtZXNzYWdlLlxuICogQHBhcmFtIHtzdHJpbmd9IFtjb2RlXSBUaGUgZXJyb3IgY29kZSAoZm9yIGV4YW1wbGUsICdFQ09OTkFCT1JURUQnKS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbY29uZmlnXSBUaGUgY29uZmlnLlxuICogQHBhcmFtIHtPYmplY3R9IFtyZXF1ZXN0XSBUaGUgcmVxdWVzdC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbcmVzcG9uc2VdIFRoZSByZXNwb25zZS5cbiAqIEByZXR1cm5zIHtFcnJvcn0gVGhlIGNyZWF0ZWQgZXJyb3IuXG4gKi9cbmZ1bmN0aW9uIEF4aW9zRXJyb3IobWVzc2FnZSwgY29kZSwgY29uZmlnLCByZXF1ZXN0LCByZXNwb25zZSkge1xuICBFcnJvci5jYWxsKHRoaXMpO1xuICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuICB0aGlzLm5hbWUgPSAnQXhpb3NFcnJvcic7XG4gIGNvZGUgJiYgKHRoaXMuY29kZSA9IGNvZGUpO1xuICBjb25maWcgJiYgKHRoaXMuY29uZmlnID0gY29uZmlnKTtcbiAgcmVxdWVzdCAmJiAodGhpcy5yZXF1ZXN0ID0gcmVxdWVzdCk7XG4gIHJlc3BvbnNlICYmICh0aGlzLnJlc3BvbnNlID0gcmVzcG9uc2UpO1xufVxuXG51dGlscy5pbmhlcml0cyhBeGlvc0Vycm9yLCBFcnJvciwge1xuICB0b0pTT046IGZ1bmN0aW9uIHRvSlNPTigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgLy8gU3RhbmRhcmRcbiAgICAgIG1lc3NhZ2U6IHRoaXMubWVzc2FnZSxcbiAgICAgIG5hbWU6IHRoaXMubmFtZSxcbiAgICAgIC8vIE1pY3Jvc29mdFxuICAgICAgZGVzY3JpcHRpb246IHRoaXMuZGVzY3JpcHRpb24sXG4gICAgICBudW1iZXI6IHRoaXMubnVtYmVyLFxuICAgICAgLy8gTW96aWxsYVxuICAgICAgZmlsZU5hbWU6IHRoaXMuZmlsZU5hbWUsXG4gICAgICBsaW5lTnVtYmVyOiB0aGlzLmxpbmVOdW1iZXIsXG4gICAgICBjb2x1bW5OdW1iZXI6IHRoaXMuY29sdW1uTnVtYmVyLFxuICAgICAgc3RhY2s6IHRoaXMuc3RhY2ssXG4gICAgICAvLyBBeGlvc1xuICAgICAgY29uZmlnOiB0aGlzLmNvbmZpZyxcbiAgICAgIGNvZGU6IHRoaXMuY29kZSxcbiAgICAgIHN0YXR1czogdGhpcy5yZXNwb25zZSAmJiB0aGlzLnJlc3BvbnNlLnN0YXR1cyA/IHRoaXMucmVzcG9uc2Uuc3RhdHVzIDogbnVsbFxuICAgIH07XG4gIH1cbn0pO1xuXG52YXIgcHJvdG90eXBlID0gQXhpb3NFcnJvci5wcm90b3R5cGU7XG52YXIgZGVzY3JpcHRvcnMgPSB7fTtcblxuW1xuICAnRVJSX0JBRF9PUFRJT05fVkFMVUUnLFxuICAnRVJSX0JBRF9PUFRJT04nLFxuICAnRUNPTk5BQk9SVEVEJyxcbiAgJ0VUSU1FRE9VVCcsXG4gICdFUlJfTkVUV09SSycsXG4gICdFUlJfRlJfVE9PX01BTllfUkVESVJFQ1RTJyxcbiAgJ0VSUl9ERVBSRUNBVEVEJyxcbiAgJ0VSUl9CQURfUkVTUE9OU0UnLFxuICAnRVJSX0JBRF9SRVFVRVNUJyxcbiAgJ0VSUl9DQU5DRUxFRCdcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBmdW5jLW5hbWVzXG5dLmZvckVhY2goZnVuY3Rpb24oY29kZSkge1xuICBkZXNjcmlwdG9yc1tjb2RlXSA9IHt2YWx1ZTogY29kZX07XG59KTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoQXhpb3NFcnJvciwgZGVzY3JpcHRvcnMpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KHByb3RvdHlwZSwgJ2lzQXhpb3NFcnJvcicsIHt2YWx1ZTogdHJ1ZX0pO1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZnVuYy1uYW1lc1xuQXhpb3NFcnJvci5mcm9tID0gZnVuY3Rpb24oZXJyb3IsIGNvZGUsIGNvbmZpZywgcmVxdWVzdCwgcmVzcG9uc2UsIGN1c3RvbVByb3BzKSB7XG4gIHZhciBheGlvc0Vycm9yID0gT2JqZWN0LmNyZWF0ZShwcm90b3R5cGUpO1xuXG4gIHV0aWxzLnRvRmxhdE9iamVjdChlcnJvciwgYXhpb3NFcnJvciwgZnVuY3Rpb24gZmlsdGVyKG9iaikge1xuICAgIHJldHVybiBvYmogIT09IEVycm9yLnByb3RvdHlwZTtcbiAgfSk7XG5cbiAgQXhpb3NFcnJvci5jYWxsKGF4aW9zRXJyb3IsIGVycm9yLm1lc3NhZ2UsIGNvZGUsIGNvbmZpZywgcmVxdWVzdCwgcmVzcG9uc2UpO1xuXG4gIGF4aW9zRXJyb3IubmFtZSA9IGVycm9yLm5hbWU7XG5cbiAgY3VzdG9tUHJvcHMgJiYgT2JqZWN0LmFzc2lnbihheGlvc0Vycm9yLCBjdXN0b21Qcm9wcyk7XG5cbiAgcmV0dXJuIGF4aW9zRXJyb3I7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEF4aW9zRXJyb3I7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcblxuZnVuY3Rpb24gSW50ZXJjZXB0b3JNYW5hZ2VyKCkge1xuICB0aGlzLmhhbmRsZXJzID0gW107XG59XG5cbi8qKlxuICogQWRkIGEgbmV3IGludGVyY2VwdG9yIHRvIHRoZSBzdGFja1xuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bGZpbGxlZCBUaGUgZnVuY3Rpb24gdG8gaGFuZGxlIGB0aGVuYCBmb3IgYSBgUHJvbWlzZWBcbiAqIEBwYXJhbSB7RnVuY3Rpb259IHJlamVjdGVkIFRoZSBmdW5jdGlvbiB0byBoYW5kbGUgYHJlamVjdGAgZm9yIGEgYFByb21pc2VgXG4gKlxuICogQHJldHVybiB7TnVtYmVyfSBBbiBJRCB1c2VkIHRvIHJlbW92ZSBpbnRlcmNlcHRvciBsYXRlclxuICovXG5JbnRlcmNlcHRvck1hbmFnZXIucHJvdG90eXBlLnVzZSA9IGZ1bmN0aW9uIHVzZShmdWxmaWxsZWQsIHJlamVjdGVkLCBvcHRpb25zKSB7XG4gIHRoaXMuaGFuZGxlcnMucHVzaCh7XG4gICAgZnVsZmlsbGVkOiBmdWxmaWxsZWQsXG4gICAgcmVqZWN0ZWQ6IHJlamVjdGVkLFxuICAgIHN5bmNocm9ub3VzOiBvcHRpb25zID8gb3B0aW9ucy5zeW5jaHJvbm91cyA6IGZhbHNlLFxuICAgIHJ1bldoZW46IG9wdGlvbnMgPyBvcHRpb25zLnJ1bldoZW4gOiBudWxsXG4gIH0pO1xuICByZXR1cm4gdGhpcy5oYW5kbGVycy5sZW5ndGggLSAxO1xufTtcblxuLyoqXG4gKiBSZW1vdmUgYW4gaW50ZXJjZXB0b3IgZnJvbSB0aGUgc3RhY2tcbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gaWQgVGhlIElEIHRoYXQgd2FzIHJldHVybmVkIGJ5IGB1c2VgXG4gKi9cbkludGVyY2VwdG9yTWFuYWdlci5wcm90b3R5cGUuZWplY3QgPSBmdW5jdGlvbiBlamVjdChpZCkge1xuICBpZiAodGhpcy5oYW5kbGVyc1tpZF0pIHtcbiAgICB0aGlzLmhhbmRsZXJzW2lkXSA9IG51bGw7XG4gIH1cbn07XG5cbi8qKlxuICogSXRlcmF0ZSBvdmVyIGFsbCB0aGUgcmVnaXN0ZXJlZCBpbnRlcmNlcHRvcnNcbiAqXG4gKiBUaGlzIG1ldGhvZCBpcyBwYXJ0aWN1bGFybHkgdXNlZnVsIGZvciBza2lwcGluZyBvdmVyIGFueVxuICogaW50ZXJjZXB0b3JzIHRoYXQgbWF5IGhhdmUgYmVjb21lIGBudWxsYCBjYWxsaW5nIGBlamVjdGAuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIHRvIGNhbGwgZm9yIGVhY2ggaW50ZXJjZXB0b3JcbiAqL1xuSW50ZXJjZXB0b3JNYW5hZ2VyLnByb3RvdHlwZS5mb3JFYWNoID0gZnVuY3Rpb24gZm9yRWFjaChmbikge1xuICB1dGlscy5mb3JFYWNoKHRoaXMuaGFuZGxlcnMsIGZ1bmN0aW9uIGZvckVhY2hIYW5kbGVyKGgpIHtcbiAgICBpZiAoaCAhPT0gbnVsbCkge1xuICAgICAgZm4oaCk7XG4gICAgfVxuICB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gSW50ZXJjZXB0b3JNYW5hZ2VyO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaXNBYnNvbHV0ZVVSTCA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvaXNBYnNvbHV0ZVVSTCcpO1xudmFyIGNvbWJpbmVVUkxzID0gcmVxdWlyZSgnLi4vaGVscGVycy9jb21iaW5lVVJMcycpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgVVJMIGJ5IGNvbWJpbmluZyB0aGUgYmFzZVVSTCB3aXRoIHRoZSByZXF1ZXN0ZWRVUkwsXG4gKiBvbmx5IHdoZW4gdGhlIHJlcXVlc3RlZFVSTCBpcyBub3QgYWxyZWFkeSBhbiBhYnNvbHV0ZSBVUkwuXG4gKiBJZiB0aGUgcmVxdWVzdFVSTCBpcyBhYnNvbHV0ZSwgdGhpcyBmdW5jdGlvbiByZXR1cm5zIHRoZSByZXF1ZXN0ZWRVUkwgdW50b3VjaGVkLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBiYXNlVVJMIFRoZSBiYXNlIFVSTFxuICogQHBhcmFtIHtzdHJpbmd9IHJlcXVlc3RlZFVSTCBBYnNvbHV0ZSBvciByZWxhdGl2ZSBVUkwgdG8gY29tYmluZVxuICogQHJldHVybnMge3N0cmluZ30gVGhlIGNvbWJpbmVkIGZ1bGwgcGF0aFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJ1aWxkRnVsbFBhdGgoYmFzZVVSTCwgcmVxdWVzdGVkVVJMKSB7XG4gIGlmIChiYXNlVVJMICYmICFpc0Fic29sdXRlVVJMKHJlcXVlc3RlZFVSTCkpIHtcbiAgICByZXR1cm4gY29tYmluZVVSTHMoYmFzZVVSTCwgcmVxdWVzdGVkVVJMKTtcbiAgfVxuICByZXR1cm4gcmVxdWVzdGVkVVJMO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xudmFyIHRyYW5zZm9ybURhdGEgPSByZXF1aXJlKCcuL3RyYW5zZm9ybURhdGEnKTtcbnZhciBpc0NhbmNlbCA9IHJlcXVpcmUoJy4uL2NhbmNlbC9pc0NhbmNlbCcpO1xudmFyIGRlZmF1bHRzID0gcmVxdWlyZSgnLi4vZGVmYXVsdHMnKTtcbnZhciBDYW5jZWxlZEVycm9yID0gcmVxdWlyZSgnLi4vY2FuY2VsL0NhbmNlbGVkRXJyb3InKTtcblxuLyoqXG4gKiBUaHJvd3MgYSBgQ2FuY2VsZWRFcnJvcmAgaWYgY2FuY2VsbGF0aW9uIGhhcyBiZWVuIHJlcXVlc3RlZC5cbiAqL1xuZnVuY3Rpb24gdGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZChjb25maWcpIHtcbiAgaWYgKGNvbmZpZy5jYW5jZWxUb2tlbikge1xuICAgIGNvbmZpZy5jYW5jZWxUb2tlbi50aHJvd0lmUmVxdWVzdGVkKCk7XG4gIH1cblxuICBpZiAoY29uZmlnLnNpZ25hbCAmJiBjb25maWcuc2lnbmFsLmFib3J0ZWQpIHtcbiAgICB0aHJvdyBuZXcgQ2FuY2VsZWRFcnJvcigpO1xuICB9XG59XG5cbi8qKlxuICogRGlzcGF0Y2ggYSByZXF1ZXN0IHRvIHRoZSBzZXJ2ZXIgdXNpbmcgdGhlIGNvbmZpZ3VyZWQgYWRhcHRlci5cbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gY29uZmlnIFRoZSBjb25maWcgdGhhdCBpcyB0byBiZSB1c2VkIGZvciB0aGUgcmVxdWVzdFxuICogQHJldHVybnMge1Byb21pc2V9IFRoZSBQcm9taXNlIHRvIGJlIGZ1bGZpbGxlZFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGRpc3BhdGNoUmVxdWVzdChjb25maWcpIHtcbiAgdGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZChjb25maWcpO1xuXG4gIC8vIEVuc3VyZSBoZWFkZXJzIGV4aXN0XG4gIGNvbmZpZy5oZWFkZXJzID0gY29uZmlnLmhlYWRlcnMgfHwge307XG5cbiAgLy8gVHJhbnNmb3JtIHJlcXVlc3QgZGF0YVxuICBjb25maWcuZGF0YSA9IHRyYW5zZm9ybURhdGEuY2FsbChcbiAgICBjb25maWcsXG4gICAgY29uZmlnLmRhdGEsXG4gICAgY29uZmlnLmhlYWRlcnMsXG4gICAgY29uZmlnLnRyYW5zZm9ybVJlcXVlc3RcbiAgKTtcblxuICAvLyBGbGF0dGVuIGhlYWRlcnNcbiAgY29uZmlnLmhlYWRlcnMgPSB1dGlscy5tZXJnZShcbiAgICBjb25maWcuaGVhZGVycy5jb21tb24gfHwge30sXG4gICAgY29uZmlnLmhlYWRlcnNbY29uZmlnLm1ldGhvZF0gfHwge30sXG4gICAgY29uZmlnLmhlYWRlcnNcbiAgKTtcblxuICB1dGlscy5mb3JFYWNoKFxuICAgIFsnZGVsZXRlJywgJ2dldCcsICdoZWFkJywgJ3Bvc3QnLCAncHV0JywgJ3BhdGNoJywgJ2NvbW1vbiddLFxuICAgIGZ1bmN0aW9uIGNsZWFuSGVhZGVyQ29uZmlnKG1ldGhvZCkge1xuICAgICAgZGVsZXRlIGNvbmZpZy5oZWFkZXJzW21ldGhvZF07XG4gICAgfVxuICApO1xuXG4gIHZhciBhZGFwdGVyID0gY29uZmlnLmFkYXB0ZXIgfHwgZGVmYXVsdHMuYWRhcHRlcjtcblxuICByZXR1cm4gYWRhcHRlcihjb25maWcpLnRoZW4oZnVuY3Rpb24gb25BZGFwdGVyUmVzb2x1dGlvbihyZXNwb25zZSkge1xuICAgIHRocm93SWZDYW5jZWxsYXRpb25SZXF1ZXN0ZWQoY29uZmlnKTtcblxuICAgIC8vIFRyYW5zZm9ybSByZXNwb25zZSBkYXRhXG4gICAgcmVzcG9uc2UuZGF0YSA9IHRyYW5zZm9ybURhdGEuY2FsbChcbiAgICAgIGNvbmZpZyxcbiAgICAgIHJlc3BvbnNlLmRhdGEsXG4gICAgICByZXNwb25zZS5oZWFkZXJzLFxuICAgICAgY29uZmlnLnRyYW5zZm9ybVJlc3BvbnNlXG4gICAgKTtcblxuICAgIHJldHVybiByZXNwb25zZTtcbiAgfSwgZnVuY3Rpb24gb25BZGFwdGVyUmVqZWN0aW9uKHJlYXNvbikge1xuICAgIGlmICghaXNDYW5jZWwocmVhc29uKSkge1xuICAgICAgdGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZChjb25maWcpO1xuXG4gICAgICAvLyBUcmFuc2Zvcm0gcmVzcG9uc2UgZGF0YVxuICAgICAgaWYgKHJlYXNvbiAmJiByZWFzb24ucmVzcG9uc2UpIHtcbiAgICAgICAgcmVhc29uLnJlc3BvbnNlLmRhdGEgPSB0cmFuc2Zvcm1EYXRhLmNhbGwoXG4gICAgICAgICAgY29uZmlnLFxuICAgICAgICAgIHJlYXNvbi5yZXNwb25zZS5kYXRhLFxuICAgICAgICAgIHJlYXNvbi5yZXNwb25zZS5oZWFkZXJzLFxuICAgICAgICAgIGNvbmZpZy50cmFuc2Zvcm1SZXNwb25zZVxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChyZWFzb24pO1xuICB9KTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzJyk7XG5cbi8qKlxuICogQ29uZmlnLXNwZWNpZmljIG1lcmdlLWZ1bmN0aW9uIHdoaWNoIGNyZWF0ZXMgYSBuZXcgY29uZmlnLW9iamVjdFxuICogYnkgbWVyZ2luZyB0d28gY29uZmlndXJhdGlvbiBvYmplY3RzIHRvZ2V0aGVyLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcxXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnMlxuICogQHJldHVybnMge09iamVjdH0gTmV3IG9iamVjdCByZXN1bHRpbmcgZnJvbSBtZXJnaW5nIGNvbmZpZzIgdG8gY29uZmlnMVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG1lcmdlQ29uZmlnKGNvbmZpZzEsIGNvbmZpZzIpIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXBhcmFtLXJlYXNzaWduXG4gIGNvbmZpZzIgPSBjb25maWcyIHx8IHt9O1xuICB2YXIgY29uZmlnID0ge307XG5cbiAgZnVuY3Rpb24gZ2V0TWVyZ2VkVmFsdWUodGFyZ2V0LCBzb3VyY2UpIHtcbiAgICBpZiAodXRpbHMuaXNQbGFpbk9iamVjdCh0YXJnZXQpICYmIHV0aWxzLmlzUGxhaW5PYmplY3Qoc291cmNlKSkge1xuICAgICAgcmV0dXJuIHV0aWxzLm1lcmdlKHRhcmdldCwgc291cmNlKTtcbiAgICB9IGVsc2UgaWYgKHV0aWxzLmlzUGxhaW5PYmplY3Qoc291cmNlKSkge1xuICAgICAgcmV0dXJuIHV0aWxzLm1lcmdlKHt9LCBzb3VyY2UpO1xuICAgIH0gZWxzZSBpZiAodXRpbHMuaXNBcnJheShzb3VyY2UpKSB7XG4gICAgICByZXR1cm4gc291cmNlLnNsaWNlKCk7XG4gICAgfVxuICAgIHJldHVybiBzb3VyY2U7XG4gIH1cblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgY29uc2lzdGVudC1yZXR1cm5cbiAgZnVuY3Rpb24gbWVyZ2VEZWVwUHJvcGVydGllcyhwcm9wKSB7XG4gICAgaWYgKCF1dGlscy5pc1VuZGVmaW5lZChjb25maWcyW3Byb3BdKSkge1xuICAgICAgcmV0dXJuIGdldE1lcmdlZFZhbHVlKGNvbmZpZzFbcHJvcF0sIGNvbmZpZzJbcHJvcF0pO1xuICAgIH0gZWxzZSBpZiAoIXV0aWxzLmlzVW5kZWZpbmVkKGNvbmZpZzFbcHJvcF0pKSB7XG4gICAgICByZXR1cm4gZ2V0TWVyZ2VkVmFsdWUodW5kZWZpbmVkLCBjb25maWcxW3Byb3BdKTtcbiAgICB9XG4gIH1cblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgY29uc2lzdGVudC1yZXR1cm5cbiAgZnVuY3Rpb24gdmFsdWVGcm9tQ29uZmlnMihwcm9wKSB7XG4gICAgaWYgKCF1dGlscy5pc1VuZGVmaW5lZChjb25maWcyW3Byb3BdKSkge1xuICAgICAgcmV0dXJuIGdldE1lcmdlZFZhbHVlKHVuZGVmaW5lZCwgY29uZmlnMltwcm9wXSk7XG4gICAgfVxuICB9XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNvbnNpc3RlbnQtcmV0dXJuXG4gIGZ1bmN0aW9uIGRlZmF1bHRUb0NvbmZpZzIocHJvcCkge1xuICAgIGlmICghdXRpbHMuaXNVbmRlZmluZWQoY29uZmlnMltwcm9wXSkpIHtcbiAgICAgIHJldHVybiBnZXRNZXJnZWRWYWx1ZSh1bmRlZmluZWQsIGNvbmZpZzJbcHJvcF0pO1xuICAgIH0gZWxzZSBpZiAoIXV0aWxzLmlzVW5kZWZpbmVkKGNvbmZpZzFbcHJvcF0pKSB7XG4gICAgICByZXR1cm4gZ2V0TWVyZ2VkVmFsdWUodW5kZWZpbmVkLCBjb25maWcxW3Byb3BdKTtcbiAgICB9XG4gIH1cblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgY29uc2lzdGVudC1yZXR1cm5cbiAgZnVuY3Rpb24gbWVyZ2VEaXJlY3RLZXlzKHByb3ApIHtcbiAgICBpZiAocHJvcCBpbiBjb25maWcyKSB7XG4gICAgICByZXR1cm4gZ2V0TWVyZ2VkVmFsdWUoY29uZmlnMVtwcm9wXSwgY29uZmlnMltwcm9wXSk7XG4gICAgfSBlbHNlIGlmIChwcm9wIGluIGNvbmZpZzEpIHtcbiAgICAgIHJldHVybiBnZXRNZXJnZWRWYWx1ZSh1bmRlZmluZWQsIGNvbmZpZzFbcHJvcF0pO1xuICAgIH1cbiAgfVxuXG4gIHZhciBtZXJnZU1hcCA9IHtcbiAgICAndXJsJzogdmFsdWVGcm9tQ29uZmlnMixcbiAgICAnbWV0aG9kJzogdmFsdWVGcm9tQ29uZmlnMixcbiAgICAnZGF0YSc6IHZhbHVlRnJvbUNvbmZpZzIsXG4gICAgJ2Jhc2VVUkwnOiBkZWZhdWx0VG9Db25maWcyLFxuICAgICd0cmFuc2Zvcm1SZXF1ZXN0JzogZGVmYXVsdFRvQ29uZmlnMixcbiAgICAndHJhbnNmb3JtUmVzcG9uc2UnOiBkZWZhdWx0VG9Db25maWcyLFxuICAgICdwYXJhbXNTZXJpYWxpemVyJzogZGVmYXVsdFRvQ29uZmlnMixcbiAgICAndGltZW91dCc6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgJ3RpbWVvdXRNZXNzYWdlJzogZGVmYXVsdFRvQ29uZmlnMixcbiAgICAnd2l0aENyZWRlbnRpYWxzJzogZGVmYXVsdFRvQ29uZmlnMixcbiAgICAnYWRhcHRlcic6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgJ3Jlc3BvbnNlVHlwZSc6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgJ3hzcmZDb29raWVOYW1lJzogZGVmYXVsdFRvQ29uZmlnMixcbiAgICAneHNyZkhlYWRlck5hbWUnOiBkZWZhdWx0VG9Db25maWcyLFxuICAgICdvblVwbG9hZFByb2dyZXNzJzogZGVmYXVsdFRvQ29uZmlnMixcbiAgICAnb25Eb3dubG9hZFByb2dyZXNzJzogZGVmYXVsdFRvQ29uZmlnMixcbiAgICAnZGVjb21wcmVzcyc6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgJ21heENvbnRlbnRMZW5ndGgnOiBkZWZhdWx0VG9Db25maWcyLFxuICAgICdtYXhCb2R5TGVuZ3RoJzogZGVmYXVsdFRvQ29uZmlnMixcbiAgICAnYmVmb3JlUmVkaXJlY3QnOiBkZWZhdWx0VG9Db25maWcyLFxuICAgICd0cmFuc3BvcnQnOiBkZWZhdWx0VG9Db25maWcyLFxuICAgICdodHRwQWdlbnQnOiBkZWZhdWx0VG9Db25maWcyLFxuICAgICdodHRwc0FnZW50JzogZGVmYXVsdFRvQ29uZmlnMixcbiAgICAnY2FuY2VsVG9rZW4nOiBkZWZhdWx0VG9Db25maWcyLFxuICAgICdzb2NrZXRQYXRoJzogZGVmYXVsdFRvQ29uZmlnMixcbiAgICAncmVzcG9uc2VFbmNvZGluZyc6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgJ3ZhbGlkYXRlU3RhdHVzJzogbWVyZ2VEaXJlY3RLZXlzXG4gIH07XG5cbiAgdXRpbHMuZm9yRWFjaChPYmplY3Qua2V5cyhjb25maWcxKS5jb25jYXQoT2JqZWN0LmtleXMoY29uZmlnMikpLCBmdW5jdGlvbiBjb21wdXRlQ29uZmlnVmFsdWUocHJvcCkge1xuICAgIHZhciBtZXJnZSA9IG1lcmdlTWFwW3Byb3BdIHx8IG1lcmdlRGVlcFByb3BlcnRpZXM7XG4gICAgdmFyIGNvbmZpZ1ZhbHVlID0gbWVyZ2UocHJvcCk7XG4gICAgKHV0aWxzLmlzVW5kZWZpbmVkKGNvbmZpZ1ZhbHVlKSAmJiBtZXJnZSAhPT0gbWVyZ2VEaXJlY3RLZXlzKSB8fCAoY29uZmlnW3Byb3BdID0gY29uZmlnVmFsdWUpO1xuICB9KTtcblxuICByZXR1cm4gY29uZmlnO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIEF4aW9zRXJyb3IgPSByZXF1aXJlKCcuL0F4aW9zRXJyb3InKTtcblxuLyoqXG4gKiBSZXNvbHZlIG9yIHJlamVjdCBhIFByb21pc2UgYmFzZWQgb24gcmVzcG9uc2Ugc3RhdHVzLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IHJlc29sdmUgQSBmdW5jdGlvbiB0aGF0IHJlc29sdmVzIHRoZSBwcm9taXNlLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gcmVqZWN0IEEgZnVuY3Rpb24gdGhhdCByZWplY3RzIHRoZSBwcm9taXNlLlxuICogQHBhcmFtIHtvYmplY3R9IHJlc3BvbnNlIFRoZSByZXNwb25zZS5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCByZXNwb25zZSkge1xuICB2YXIgdmFsaWRhdGVTdGF0dXMgPSByZXNwb25zZS5jb25maWcudmFsaWRhdGVTdGF0dXM7XG4gIGlmICghcmVzcG9uc2Uuc3RhdHVzIHx8ICF2YWxpZGF0ZVN0YXR1cyB8fCB2YWxpZGF0ZVN0YXR1cyhyZXNwb25zZS5zdGF0dXMpKSB7XG4gICAgcmVzb2x2ZShyZXNwb25zZSk7XG4gIH0gZWxzZSB7XG4gICAgcmVqZWN0KG5ldyBBeGlvc0Vycm9yKFxuICAgICAgJ1JlcXVlc3QgZmFpbGVkIHdpdGggc3RhdHVzIGNvZGUgJyArIHJlc3BvbnNlLnN0YXR1cyxcbiAgICAgIFtBeGlvc0Vycm9yLkVSUl9CQURfUkVRVUVTVCwgQXhpb3NFcnJvci5FUlJfQkFEX1JFU1BPTlNFXVtNYXRoLmZsb29yKHJlc3BvbnNlLnN0YXR1cyAvIDEwMCkgLSA0XSxcbiAgICAgIHJlc3BvbnNlLmNvbmZpZyxcbiAgICAgIHJlc3BvbnNlLnJlcXVlc3QsXG4gICAgICByZXNwb25zZVxuICAgICkpO1xuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG52YXIgZGVmYXVsdHMgPSByZXF1aXJlKCcuLi9kZWZhdWx0cycpO1xuXG4vKipcbiAqIFRyYW5zZm9ybSB0aGUgZGF0YSBmb3IgYSByZXF1ZXN0IG9yIGEgcmVzcG9uc2VcbiAqXG4gKiBAcGFyYW0ge09iamVjdHxTdHJpbmd9IGRhdGEgVGhlIGRhdGEgdG8gYmUgdHJhbnNmb3JtZWRcbiAqIEBwYXJhbSB7QXJyYXl9IGhlYWRlcnMgVGhlIGhlYWRlcnMgZm9yIHRoZSByZXF1ZXN0IG9yIHJlc3BvbnNlXG4gKiBAcGFyYW0ge0FycmF5fEZ1bmN0aW9ufSBmbnMgQSBzaW5nbGUgZnVuY3Rpb24gb3IgQXJyYXkgb2YgZnVuY3Rpb25zXG4gKiBAcmV0dXJucyB7Kn0gVGhlIHJlc3VsdGluZyB0cmFuc2Zvcm1lZCBkYXRhXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdHJhbnNmb3JtRGF0YShkYXRhLCBoZWFkZXJzLCBmbnMpIHtcbiAgdmFyIGNvbnRleHQgPSB0aGlzIHx8IGRlZmF1bHRzO1xuICAvKmVzbGludCBuby1wYXJhbS1yZWFzc2lnbjowKi9cbiAgdXRpbHMuZm9yRWFjaChmbnMsIGZ1bmN0aW9uIHRyYW5zZm9ybShmbikge1xuICAgIGRhdGEgPSBmbi5jYWxsKGNvbnRleHQsIGRhdGEsIGhlYWRlcnMpO1xuICB9KTtcblxuICByZXR1cm4gZGF0YTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzJyk7XG52YXIgbm9ybWFsaXplSGVhZGVyTmFtZSA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvbm9ybWFsaXplSGVhZGVyTmFtZScpO1xudmFyIEF4aW9zRXJyb3IgPSByZXF1aXJlKCcuLi9jb3JlL0F4aW9zRXJyb3InKTtcbnZhciB0cmFuc2l0aW9uYWxEZWZhdWx0cyA9IHJlcXVpcmUoJy4vdHJhbnNpdGlvbmFsJyk7XG52YXIgdG9Gb3JtRGF0YSA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvdG9Gb3JtRGF0YScpO1xuXG52YXIgREVGQVVMVF9DT05URU5UX1RZUEUgPSB7XG4gICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJ1xufTtcblxuZnVuY3Rpb24gc2V0Q29udGVudFR5cGVJZlVuc2V0KGhlYWRlcnMsIHZhbHVlKSB7XG4gIGlmICghdXRpbHMuaXNVbmRlZmluZWQoaGVhZGVycykgJiYgdXRpbHMuaXNVbmRlZmluZWQoaGVhZGVyc1snQ29udGVudC1UeXBlJ10pKSB7XG4gICAgaGVhZGVyc1snQ29udGVudC1UeXBlJ10gPSB2YWx1ZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXREZWZhdWx0QWRhcHRlcigpIHtcbiAgdmFyIGFkYXB0ZXI7XG4gIGlmICh0eXBlb2YgWE1MSHR0cFJlcXVlc3QgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgLy8gRm9yIGJyb3dzZXJzIHVzZSBYSFIgYWRhcHRlclxuICAgIGFkYXB0ZXIgPSByZXF1aXJlKCcuLi9hZGFwdGVycy94aHInKTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHByb2Nlc3MpID09PSAnW29iamVjdCBwcm9jZXNzXScpIHtcbiAgICAvLyBGb3Igbm9kZSB1c2UgSFRUUCBhZGFwdGVyXG4gICAgYWRhcHRlciA9IHJlcXVpcmUoJy4uL2FkYXB0ZXJzL2h0dHAnKTtcbiAgfVxuICByZXR1cm4gYWRhcHRlcjtcbn1cblxuZnVuY3Rpb24gc3RyaW5naWZ5U2FmZWx5KHJhd1ZhbHVlLCBwYXJzZXIsIGVuY29kZXIpIHtcbiAgaWYgKHV0aWxzLmlzU3RyaW5nKHJhd1ZhbHVlKSkge1xuICAgIHRyeSB7XG4gICAgICAocGFyc2VyIHx8IEpTT04ucGFyc2UpKHJhd1ZhbHVlKTtcbiAgICAgIHJldHVybiB1dGlscy50cmltKHJhd1ZhbHVlKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBpZiAoZS5uYW1lICE9PSAnU3ludGF4RXJyb3InKSB7XG4gICAgICAgIHRocm93IGU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIChlbmNvZGVyIHx8IEpTT04uc3RyaW5naWZ5KShyYXdWYWx1ZSk7XG59XG5cbnZhciBkZWZhdWx0cyA9IHtcblxuICB0cmFuc2l0aW9uYWw6IHRyYW5zaXRpb25hbERlZmF1bHRzLFxuXG4gIGFkYXB0ZXI6IGdldERlZmF1bHRBZGFwdGVyKCksXG5cbiAgdHJhbnNmb3JtUmVxdWVzdDogW2Z1bmN0aW9uIHRyYW5zZm9ybVJlcXVlc3QoZGF0YSwgaGVhZGVycykge1xuICAgIG5vcm1hbGl6ZUhlYWRlck5hbWUoaGVhZGVycywgJ0FjY2VwdCcpO1xuICAgIG5vcm1hbGl6ZUhlYWRlck5hbWUoaGVhZGVycywgJ0NvbnRlbnQtVHlwZScpO1xuXG4gICAgaWYgKHV0aWxzLmlzRm9ybURhdGEoZGF0YSkgfHxcbiAgICAgIHV0aWxzLmlzQXJyYXlCdWZmZXIoZGF0YSkgfHxcbiAgICAgIHV0aWxzLmlzQnVmZmVyKGRhdGEpIHx8XG4gICAgICB1dGlscy5pc1N0cmVhbShkYXRhKSB8fFxuICAgICAgdXRpbHMuaXNGaWxlKGRhdGEpIHx8XG4gICAgICB1dGlscy5pc0Jsb2IoZGF0YSlcbiAgICApIHtcbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cbiAgICBpZiAodXRpbHMuaXNBcnJheUJ1ZmZlclZpZXcoZGF0YSkpIHtcbiAgICAgIHJldHVybiBkYXRhLmJ1ZmZlcjtcbiAgICB9XG4gICAgaWYgKHV0aWxzLmlzVVJMU2VhcmNoUGFyYW1zKGRhdGEpKSB7XG4gICAgICBzZXRDb250ZW50VHlwZUlmVW5zZXQoaGVhZGVycywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDtjaGFyc2V0PXV0Zi04Jyk7XG4gICAgICByZXR1cm4gZGF0YS50b1N0cmluZygpO1xuICAgIH1cblxuICAgIHZhciBpc09iamVjdFBheWxvYWQgPSB1dGlscy5pc09iamVjdChkYXRhKTtcbiAgICB2YXIgY29udGVudFR5cGUgPSBoZWFkZXJzICYmIGhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddO1xuXG4gICAgdmFyIGlzRmlsZUxpc3Q7XG5cbiAgICBpZiAoKGlzRmlsZUxpc3QgPSB1dGlscy5pc0ZpbGVMaXN0KGRhdGEpKSB8fCAoaXNPYmplY3RQYXlsb2FkICYmIGNvbnRlbnRUeXBlID09PSAnbXVsdGlwYXJ0L2Zvcm0tZGF0YScpKSB7XG4gICAgICB2YXIgX0Zvcm1EYXRhID0gdGhpcy5lbnYgJiYgdGhpcy5lbnYuRm9ybURhdGE7XG4gICAgICByZXR1cm4gdG9Gb3JtRGF0YShpc0ZpbGVMaXN0ID8geydmaWxlc1tdJzogZGF0YX0gOiBkYXRhLCBfRm9ybURhdGEgJiYgbmV3IF9Gb3JtRGF0YSgpKTtcbiAgICB9IGVsc2UgaWYgKGlzT2JqZWN0UGF5bG9hZCB8fCBjb250ZW50VHlwZSA9PT0gJ2FwcGxpY2F0aW9uL2pzb24nKSB7XG4gICAgICBzZXRDb250ZW50VHlwZUlmVW5zZXQoaGVhZGVycywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICAgIHJldHVybiBzdHJpbmdpZnlTYWZlbHkoZGF0YSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRhdGE7XG4gIH1dLFxuXG4gIHRyYW5zZm9ybVJlc3BvbnNlOiBbZnVuY3Rpb24gdHJhbnNmb3JtUmVzcG9uc2UoZGF0YSkge1xuICAgIHZhciB0cmFuc2l0aW9uYWwgPSB0aGlzLnRyYW5zaXRpb25hbCB8fCBkZWZhdWx0cy50cmFuc2l0aW9uYWw7XG4gICAgdmFyIHNpbGVudEpTT05QYXJzaW5nID0gdHJhbnNpdGlvbmFsICYmIHRyYW5zaXRpb25hbC5zaWxlbnRKU09OUGFyc2luZztcbiAgICB2YXIgZm9yY2VkSlNPTlBhcnNpbmcgPSB0cmFuc2l0aW9uYWwgJiYgdHJhbnNpdGlvbmFsLmZvcmNlZEpTT05QYXJzaW5nO1xuICAgIHZhciBzdHJpY3RKU09OUGFyc2luZyA9ICFzaWxlbnRKU09OUGFyc2luZyAmJiB0aGlzLnJlc3BvbnNlVHlwZSA9PT0gJ2pzb24nO1xuXG4gICAgaWYgKHN0cmljdEpTT05QYXJzaW5nIHx8IChmb3JjZWRKU09OUGFyc2luZyAmJiB1dGlscy5pc1N0cmluZyhkYXRhKSAmJiBkYXRhLmxlbmd0aCkpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKGRhdGEpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBpZiAoc3RyaWN0SlNPTlBhcnNpbmcpIHtcbiAgICAgICAgICBpZiAoZS5uYW1lID09PSAnU3ludGF4RXJyb3InKSB7XG4gICAgICAgICAgICB0aHJvdyBBeGlvc0Vycm9yLmZyb20oZSwgQXhpb3NFcnJvci5FUlJfQkFEX1JFU1BPTlNFLCB0aGlzLCBudWxsLCB0aGlzLnJlc3BvbnNlKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBkYXRhO1xuICB9XSxcblxuICAvKipcbiAgICogQSB0aW1lb3V0IGluIG1pbGxpc2Vjb25kcyB0byBhYm9ydCBhIHJlcXVlc3QuIElmIHNldCB0byAwIChkZWZhdWx0KSBhXG4gICAqIHRpbWVvdXQgaXMgbm90IGNyZWF0ZWQuXG4gICAqL1xuICB0aW1lb3V0OiAwLFxuXG4gIHhzcmZDb29raWVOYW1lOiAnWFNSRi1UT0tFTicsXG4gIHhzcmZIZWFkZXJOYW1lOiAnWC1YU1JGLVRPS0VOJyxcblxuICBtYXhDb250ZW50TGVuZ3RoOiAtMSxcbiAgbWF4Qm9keUxlbmd0aDogLTEsXG5cbiAgZW52OiB7XG4gICAgRm9ybURhdGE6IHJlcXVpcmUoJy4vZW52L0Zvcm1EYXRhJylcbiAgfSxcblxuICB2YWxpZGF0ZVN0YXR1czogZnVuY3Rpb24gdmFsaWRhdGVTdGF0dXMoc3RhdHVzKSB7XG4gICAgcmV0dXJuIHN0YXR1cyA+PSAyMDAgJiYgc3RhdHVzIDwgMzAwO1xuICB9LFxuXG4gIGhlYWRlcnM6IHtcbiAgICBjb21tb246IHtcbiAgICAgICdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbiwgdGV4dC9wbGFpbiwgKi8qJ1xuICAgIH1cbiAgfVxufTtcblxudXRpbHMuZm9yRWFjaChbJ2RlbGV0ZScsICdnZXQnLCAnaGVhZCddLCBmdW5jdGlvbiBmb3JFYWNoTWV0aG9kTm9EYXRhKG1ldGhvZCkge1xuICBkZWZhdWx0cy5oZWFkZXJzW21ldGhvZF0gPSB7fTtcbn0pO1xuXG51dGlscy5mb3JFYWNoKFsncG9zdCcsICdwdXQnLCAncGF0Y2gnXSwgZnVuY3Rpb24gZm9yRWFjaE1ldGhvZFdpdGhEYXRhKG1ldGhvZCkge1xuICBkZWZhdWx0cy5oZWFkZXJzW21ldGhvZF0gPSB1dGlscy5tZXJnZShERUZBVUxUX0NPTlRFTlRfVFlQRSk7XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBkZWZhdWx0cztcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHNpbGVudEpTT05QYXJzaW5nOiB0cnVlLFxuICBmb3JjZWRKU09OUGFyc2luZzogdHJ1ZSxcbiAgY2xhcmlmeVRpbWVvdXRFcnJvcjogZmFsc2Vcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgXCJ2ZXJzaW9uXCI6IFwiMC4yNy4yXCJcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJpbmQoZm4sIHRoaXNBcmcpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIHdyYXAoKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBhcmdzW2ldID0gYXJndW1lbnRzW2ldO1xuICAgIH1cbiAgICByZXR1cm4gZm4uYXBwbHkodGhpc0FyZywgYXJncyk7XG4gIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbmZ1bmN0aW9uIGVuY29kZSh2YWwpIHtcbiAgcmV0dXJuIGVuY29kZVVSSUNvbXBvbmVudCh2YWwpLlxuICAgIHJlcGxhY2UoLyUzQS9naSwgJzonKS5cbiAgICByZXBsYWNlKC8lMjQvZywgJyQnKS5cbiAgICByZXBsYWNlKC8lMkMvZ2ksICcsJykuXG4gICAgcmVwbGFjZSgvJTIwL2csICcrJykuXG4gICAgcmVwbGFjZSgvJTVCL2dpLCAnWycpLlxuICAgIHJlcGxhY2UoLyU1RC9naSwgJ10nKTtcbn1cblxuLyoqXG4gKiBCdWlsZCBhIFVSTCBieSBhcHBlbmRpbmcgcGFyYW1zIHRvIHRoZSBlbmRcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsIFRoZSBiYXNlIG9mIHRoZSB1cmwgKGUuZy4sIGh0dHA6Ly93d3cuZ29vZ2xlLmNvbSlcbiAqIEBwYXJhbSB7b2JqZWN0fSBbcGFyYW1zXSBUaGUgcGFyYW1zIHRvIGJlIGFwcGVuZGVkXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgZm9ybWF0dGVkIHVybFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJ1aWxkVVJMKHVybCwgcGFyYW1zLCBwYXJhbXNTZXJpYWxpemVyKSB7XG4gIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuICBpZiAoIXBhcmFtcykge1xuICAgIHJldHVybiB1cmw7XG4gIH1cblxuICB2YXIgc2VyaWFsaXplZFBhcmFtcztcbiAgaWYgKHBhcmFtc1NlcmlhbGl6ZXIpIHtcbiAgICBzZXJpYWxpemVkUGFyYW1zID0gcGFyYW1zU2VyaWFsaXplcihwYXJhbXMpO1xuICB9IGVsc2UgaWYgKHV0aWxzLmlzVVJMU2VhcmNoUGFyYW1zKHBhcmFtcykpIHtcbiAgICBzZXJpYWxpemVkUGFyYW1zID0gcGFyYW1zLnRvU3RyaW5nKCk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIHBhcnRzID0gW107XG5cbiAgICB1dGlscy5mb3JFYWNoKHBhcmFtcywgZnVuY3Rpb24gc2VyaWFsaXplKHZhbCwga2V5KSB7XG4gICAgICBpZiAodmFsID09PSBudWxsIHx8IHR5cGVvZiB2YWwgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKHV0aWxzLmlzQXJyYXkodmFsKSkge1xuICAgICAgICBrZXkgPSBrZXkgKyAnW10nO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFsID0gW3ZhbF07XG4gICAgICB9XG5cbiAgICAgIHV0aWxzLmZvckVhY2godmFsLCBmdW5jdGlvbiBwYXJzZVZhbHVlKHYpIHtcbiAgICAgICAgaWYgKHV0aWxzLmlzRGF0ZSh2KSkge1xuICAgICAgICAgIHYgPSB2LnRvSVNPU3RyaW5nKCk7XG4gICAgICAgIH0gZWxzZSBpZiAodXRpbHMuaXNPYmplY3QodikpIHtcbiAgICAgICAgICB2ID0gSlNPTi5zdHJpbmdpZnkodik7XG4gICAgICAgIH1cbiAgICAgICAgcGFydHMucHVzaChlbmNvZGUoa2V5KSArICc9JyArIGVuY29kZSh2KSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHNlcmlhbGl6ZWRQYXJhbXMgPSBwYXJ0cy5qb2luKCcmJyk7XG4gIH1cblxuICBpZiAoc2VyaWFsaXplZFBhcmFtcykge1xuICAgIHZhciBoYXNobWFya0luZGV4ID0gdXJsLmluZGV4T2YoJyMnKTtcbiAgICBpZiAoaGFzaG1hcmtJbmRleCAhPT0gLTEpIHtcbiAgICAgIHVybCA9IHVybC5zbGljZSgwLCBoYXNobWFya0luZGV4KTtcbiAgICB9XG5cbiAgICB1cmwgKz0gKHVybC5pbmRleE9mKCc/JykgPT09IC0xID8gJz8nIDogJyYnKSArIHNlcmlhbGl6ZWRQYXJhbXM7XG4gIH1cblxuICByZXR1cm4gdXJsO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IFVSTCBieSBjb21iaW5pbmcgdGhlIHNwZWNpZmllZCBVUkxzXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGJhc2VVUkwgVGhlIGJhc2UgVVJMXG4gKiBAcGFyYW0ge3N0cmluZ30gcmVsYXRpdmVVUkwgVGhlIHJlbGF0aXZlIFVSTFxuICogQHJldHVybnMge3N0cmluZ30gVGhlIGNvbWJpbmVkIFVSTFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNvbWJpbmVVUkxzKGJhc2VVUkwsIHJlbGF0aXZlVVJMKSB7XG4gIHJldHVybiByZWxhdGl2ZVVSTFxuICAgID8gYmFzZVVSTC5yZXBsYWNlKC9cXC8rJC8sICcnKSArICcvJyArIHJlbGF0aXZlVVJMLnJlcGxhY2UoL15cXC8rLywgJycpXG4gICAgOiBiYXNlVVJMO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IChcbiAgdXRpbHMuaXNTdGFuZGFyZEJyb3dzZXJFbnYoKSA/XG5cbiAgLy8gU3RhbmRhcmQgYnJvd3NlciBlbnZzIHN1cHBvcnQgZG9jdW1lbnQuY29va2llXG4gICAgKGZ1bmN0aW9uIHN0YW5kYXJkQnJvd3NlckVudigpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHdyaXRlOiBmdW5jdGlvbiB3cml0ZShuYW1lLCB2YWx1ZSwgZXhwaXJlcywgcGF0aCwgZG9tYWluLCBzZWN1cmUpIHtcbiAgICAgICAgICB2YXIgY29va2llID0gW107XG4gICAgICAgICAgY29va2llLnB1c2gobmFtZSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudCh2YWx1ZSkpO1xuXG4gICAgICAgICAgaWYgKHV0aWxzLmlzTnVtYmVyKGV4cGlyZXMpKSB7XG4gICAgICAgICAgICBjb29raWUucHVzaCgnZXhwaXJlcz0nICsgbmV3IERhdGUoZXhwaXJlcykudG9HTVRTdHJpbmcoKSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHV0aWxzLmlzU3RyaW5nKHBhdGgpKSB7XG4gICAgICAgICAgICBjb29raWUucHVzaCgncGF0aD0nICsgcGF0aCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHV0aWxzLmlzU3RyaW5nKGRvbWFpbikpIHtcbiAgICAgICAgICAgIGNvb2tpZS5wdXNoKCdkb21haW49JyArIGRvbWFpbik7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHNlY3VyZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgY29va2llLnB1c2goJ3NlY3VyZScpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGRvY3VtZW50LmNvb2tpZSA9IGNvb2tpZS5qb2luKCc7ICcpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHJlYWQ6IGZ1bmN0aW9uIHJlYWQobmFtZSkge1xuICAgICAgICAgIHZhciBtYXRjaCA9IGRvY3VtZW50LmNvb2tpZS5tYXRjaChuZXcgUmVnRXhwKCcoXnw7XFxcXHMqKSgnICsgbmFtZSArICcpPShbXjtdKiknKSk7XG4gICAgICAgICAgcmV0dXJuIChtYXRjaCA/IGRlY29kZVVSSUNvbXBvbmVudChtYXRjaFszXSkgOiBudWxsKTtcbiAgICAgICAgfSxcblxuICAgICAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZShuYW1lKSB7XG4gICAgICAgICAgdGhpcy53cml0ZShuYW1lLCAnJywgRGF0ZS5ub3coKSAtIDg2NDAwMDAwKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9KSgpIDpcblxuICAvLyBOb24gc3RhbmRhcmQgYnJvd3NlciBlbnYgKHdlYiB3b3JrZXJzLCByZWFjdC1uYXRpdmUpIGxhY2sgbmVlZGVkIHN1cHBvcnQuXG4gICAgKGZ1bmN0aW9uIG5vblN0YW5kYXJkQnJvd3NlckVudigpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHdyaXRlOiBmdW5jdGlvbiB3cml0ZSgpIHt9LFxuICAgICAgICByZWFkOiBmdW5jdGlvbiByZWFkKCkgeyByZXR1cm4gbnVsbDsgfSxcbiAgICAgICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7fVxuICAgICAgfTtcbiAgICB9KSgpXG4pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIERldGVybWluZXMgd2hldGhlciB0aGUgc3BlY2lmaWVkIFVSTCBpcyBhYnNvbHV0ZVxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgVGhlIFVSTCB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgc3BlY2lmaWVkIFVSTCBpcyBhYnNvbHV0ZSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNBYnNvbHV0ZVVSTCh1cmwpIHtcbiAgLy8gQSBVUkwgaXMgY29uc2lkZXJlZCBhYnNvbHV0ZSBpZiBpdCBiZWdpbnMgd2l0aCBcIjxzY2hlbWU+Oi8vXCIgb3IgXCIvL1wiIChwcm90b2NvbC1yZWxhdGl2ZSBVUkwpLlxuICAvLyBSRkMgMzk4NiBkZWZpbmVzIHNjaGVtZSBuYW1lIGFzIGEgc2VxdWVuY2Ugb2YgY2hhcmFjdGVycyBiZWdpbm5pbmcgd2l0aCBhIGxldHRlciBhbmQgZm9sbG93ZWRcbiAgLy8gYnkgYW55IGNvbWJpbmF0aW9uIG9mIGxldHRlcnMsIGRpZ2l0cywgcGx1cywgcGVyaW9kLCBvciBoeXBoZW4uXG4gIHJldHVybiAvXihbYS16XVthLXpcXGQrXFwtLl0qOik/XFwvXFwvL2kudGVzdCh1cmwpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xuXG4vKipcbiAqIERldGVybWluZXMgd2hldGhlciB0aGUgcGF5bG9hZCBpcyBhbiBlcnJvciB0aHJvd24gYnkgQXhpb3NcbiAqXG4gKiBAcGFyYW0geyp9IHBheWxvYWQgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHRoZSBwYXlsb2FkIGlzIGFuIGVycm9yIHRocm93biBieSBBeGlvcywgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNBeGlvc0Vycm9yKHBheWxvYWQpIHtcbiAgcmV0dXJuIHV0aWxzLmlzT2JqZWN0KHBheWxvYWQpICYmIChwYXlsb2FkLmlzQXhpb3NFcnJvciA9PT0gdHJ1ZSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gKFxuICB1dGlscy5pc1N0YW5kYXJkQnJvd3NlckVudigpID9cblxuICAvLyBTdGFuZGFyZCBicm93c2VyIGVudnMgaGF2ZSBmdWxsIHN1cHBvcnQgb2YgdGhlIEFQSXMgbmVlZGVkIHRvIHRlc3RcbiAgLy8gd2hldGhlciB0aGUgcmVxdWVzdCBVUkwgaXMgb2YgdGhlIHNhbWUgb3JpZ2luIGFzIGN1cnJlbnQgbG9jYXRpb24uXG4gICAgKGZ1bmN0aW9uIHN0YW5kYXJkQnJvd3NlckVudigpIHtcbiAgICAgIHZhciBtc2llID0gLyhtc2llfHRyaWRlbnQpL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcbiAgICAgIHZhciB1cmxQYXJzaW5nTm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICAgIHZhciBvcmlnaW5VUkw7XG5cbiAgICAgIC8qKlxuICAgICogUGFyc2UgYSBVUkwgdG8gZGlzY292ZXIgaXQncyBjb21wb25lbnRzXG4gICAgKlxuICAgICogQHBhcmFtIHtTdHJpbmd9IHVybCBUaGUgVVJMIHRvIGJlIHBhcnNlZFxuICAgICogQHJldHVybnMge09iamVjdH1cbiAgICAqL1xuICAgICAgZnVuY3Rpb24gcmVzb2x2ZVVSTCh1cmwpIHtcbiAgICAgICAgdmFyIGhyZWYgPSB1cmw7XG5cbiAgICAgICAgaWYgKG1zaWUpIHtcbiAgICAgICAgLy8gSUUgbmVlZHMgYXR0cmlidXRlIHNldCB0d2ljZSB0byBub3JtYWxpemUgcHJvcGVydGllc1xuICAgICAgICAgIHVybFBhcnNpbmdOb2RlLnNldEF0dHJpYnV0ZSgnaHJlZicsIGhyZWYpO1xuICAgICAgICAgIGhyZWYgPSB1cmxQYXJzaW5nTm9kZS5ocmVmO1xuICAgICAgICB9XG5cbiAgICAgICAgdXJsUGFyc2luZ05vZGUuc2V0QXR0cmlidXRlKCdocmVmJywgaHJlZik7XG5cbiAgICAgICAgLy8gdXJsUGFyc2luZ05vZGUgcHJvdmlkZXMgdGhlIFVybFV0aWxzIGludGVyZmFjZSAtIGh0dHA6Ly91cmwuc3BlYy53aGF0d2cub3JnLyN1cmx1dGlsc1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGhyZWY6IHVybFBhcnNpbmdOb2RlLmhyZWYsXG4gICAgICAgICAgcHJvdG9jb2w6IHVybFBhcnNpbmdOb2RlLnByb3RvY29sID8gdXJsUGFyc2luZ05vZGUucHJvdG9jb2wucmVwbGFjZSgvOiQvLCAnJykgOiAnJyxcbiAgICAgICAgICBob3N0OiB1cmxQYXJzaW5nTm9kZS5ob3N0LFxuICAgICAgICAgIHNlYXJjaDogdXJsUGFyc2luZ05vZGUuc2VhcmNoID8gdXJsUGFyc2luZ05vZGUuc2VhcmNoLnJlcGxhY2UoL15cXD8vLCAnJykgOiAnJyxcbiAgICAgICAgICBoYXNoOiB1cmxQYXJzaW5nTm9kZS5oYXNoID8gdXJsUGFyc2luZ05vZGUuaGFzaC5yZXBsYWNlKC9eIy8sICcnKSA6ICcnLFxuICAgICAgICAgIGhvc3RuYW1lOiB1cmxQYXJzaW5nTm9kZS5ob3N0bmFtZSxcbiAgICAgICAgICBwb3J0OiB1cmxQYXJzaW5nTm9kZS5wb3J0LFxuICAgICAgICAgIHBhdGhuYW1lOiAodXJsUGFyc2luZ05vZGUucGF0aG5hbWUuY2hhckF0KDApID09PSAnLycpID9cbiAgICAgICAgICAgIHVybFBhcnNpbmdOb2RlLnBhdGhuYW1lIDpcbiAgICAgICAgICAgICcvJyArIHVybFBhcnNpbmdOb2RlLnBhdGhuYW1lXG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIG9yaWdpblVSTCA9IHJlc29sdmVVUkwod2luZG93LmxvY2F0aW9uLmhyZWYpO1xuXG4gICAgICAvKipcbiAgICAqIERldGVybWluZSBpZiBhIFVSTCBzaGFyZXMgdGhlIHNhbWUgb3JpZ2luIGFzIHRoZSBjdXJyZW50IGxvY2F0aW9uXG4gICAgKlxuICAgICogQHBhcmFtIHtTdHJpbmd9IHJlcXVlc3RVUkwgVGhlIFVSTCB0byB0ZXN0XG4gICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiBVUkwgc2hhcmVzIHRoZSBzYW1lIG9yaWdpbiwgb3RoZXJ3aXNlIGZhbHNlXG4gICAgKi9cbiAgICAgIHJldHVybiBmdW5jdGlvbiBpc1VSTFNhbWVPcmlnaW4ocmVxdWVzdFVSTCkge1xuICAgICAgICB2YXIgcGFyc2VkID0gKHV0aWxzLmlzU3RyaW5nKHJlcXVlc3RVUkwpKSA/IHJlc29sdmVVUkwocmVxdWVzdFVSTCkgOiByZXF1ZXN0VVJMO1xuICAgICAgICByZXR1cm4gKHBhcnNlZC5wcm90b2NvbCA9PT0gb3JpZ2luVVJMLnByb3RvY29sICYmXG4gICAgICAgICAgICBwYXJzZWQuaG9zdCA9PT0gb3JpZ2luVVJMLmhvc3QpO1xuICAgICAgfTtcbiAgICB9KSgpIDpcblxuICAvLyBOb24gc3RhbmRhcmQgYnJvd3NlciBlbnZzICh3ZWIgd29ya2VycywgcmVhY3QtbmF0aXZlKSBsYWNrIG5lZWRlZCBzdXBwb3J0LlxuICAgIChmdW5jdGlvbiBub25TdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gaXNVUkxTYW1lT3JpZ2luKCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH07XG4gICAgfSkoKVxuKTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBub3JtYWxpemVIZWFkZXJOYW1lKGhlYWRlcnMsIG5vcm1hbGl6ZWROYW1lKSB7XG4gIHV0aWxzLmZvckVhY2goaGVhZGVycywgZnVuY3Rpb24gcHJvY2Vzc0hlYWRlcih2YWx1ZSwgbmFtZSkge1xuICAgIGlmIChuYW1lICE9PSBub3JtYWxpemVkTmFtZSAmJiBuYW1lLnRvVXBwZXJDYXNlKCkgPT09IG5vcm1hbGl6ZWROYW1lLnRvVXBwZXJDYXNlKCkpIHtcbiAgICAgIGhlYWRlcnNbbm9ybWFsaXplZE5hbWVdID0gdmFsdWU7XG4gICAgICBkZWxldGUgaGVhZGVyc1tuYW1lXTtcbiAgICB9XG4gIH0pO1xufTtcbiIsIi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBzdHJpY3Rcbm1vZHVsZS5leHBvcnRzID0gbnVsbDtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xuXG4vLyBIZWFkZXJzIHdob3NlIGR1cGxpY2F0ZXMgYXJlIGlnbm9yZWQgYnkgbm9kZVxuLy8gYy5mLiBodHRwczovL25vZGVqcy5vcmcvYXBpL2h0dHAuaHRtbCNodHRwX21lc3NhZ2VfaGVhZGVyc1xudmFyIGlnbm9yZUR1cGxpY2F0ZU9mID0gW1xuICAnYWdlJywgJ2F1dGhvcml6YXRpb24nLCAnY29udGVudC1sZW5ndGgnLCAnY29udGVudC10eXBlJywgJ2V0YWcnLFxuICAnZXhwaXJlcycsICdmcm9tJywgJ2hvc3QnLCAnaWYtbW9kaWZpZWQtc2luY2UnLCAnaWYtdW5tb2RpZmllZC1zaW5jZScsXG4gICdsYXN0LW1vZGlmaWVkJywgJ2xvY2F0aW9uJywgJ21heC1mb3J3YXJkcycsICdwcm94eS1hdXRob3JpemF0aW9uJyxcbiAgJ3JlZmVyZXInLCAncmV0cnktYWZ0ZXInLCAndXNlci1hZ2VudCdcbl07XG5cbi8qKlxuICogUGFyc2UgaGVhZGVycyBpbnRvIGFuIG9iamVjdFxuICpcbiAqIGBgYFxuICogRGF0ZTogV2VkLCAyNyBBdWcgMjAxNCAwODo1ODo0OSBHTVRcbiAqIENvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvblxuICogQ29ubmVjdGlvbjoga2VlcC1hbGl2ZVxuICogVHJhbnNmZXItRW5jb2Rpbmc6IGNodW5rZWRcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBoZWFkZXJzIEhlYWRlcnMgbmVlZGluZyB0byBiZSBwYXJzZWRcbiAqIEByZXR1cm5zIHtPYmplY3R9IEhlYWRlcnMgcGFyc2VkIGludG8gYW4gb2JqZWN0XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gcGFyc2VIZWFkZXJzKGhlYWRlcnMpIHtcbiAgdmFyIHBhcnNlZCA9IHt9O1xuICB2YXIga2V5O1xuICB2YXIgdmFsO1xuICB2YXIgaTtcblxuICBpZiAoIWhlYWRlcnMpIHsgcmV0dXJuIHBhcnNlZDsgfVxuXG4gIHV0aWxzLmZvckVhY2goaGVhZGVycy5zcGxpdCgnXFxuJyksIGZ1bmN0aW9uIHBhcnNlcihsaW5lKSB7XG4gICAgaSA9IGxpbmUuaW5kZXhPZignOicpO1xuICAgIGtleSA9IHV0aWxzLnRyaW0obGluZS5zdWJzdHIoMCwgaSkpLnRvTG93ZXJDYXNlKCk7XG4gICAgdmFsID0gdXRpbHMudHJpbShsaW5lLnN1YnN0cihpICsgMSkpO1xuXG4gICAgaWYgKGtleSkge1xuICAgICAgaWYgKHBhcnNlZFtrZXldICYmIGlnbm9yZUR1cGxpY2F0ZU9mLmluZGV4T2Yoa2V5KSA+PSAwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChrZXkgPT09ICdzZXQtY29va2llJykge1xuICAgICAgICBwYXJzZWRba2V5XSA9IChwYXJzZWRba2V5XSA/IHBhcnNlZFtrZXldIDogW10pLmNvbmNhdChbdmFsXSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwYXJzZWRba2V5XSA9IHBhcnNlZFtrZXldID8gcGFyc2VkW2tleV0gKyAnLCAnICsgdmFsIDogdmFsO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHBhcnNlZDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gcGFyc2VQcm90b2NvbCh1cmwpIHtcbiAgdmFyIG1hdGNoID0gL14oWy0rXFx3XXsxLDI1fSkoOj9cXC9cXC98OikvLmV4ZWModXJsKTtcbiAgcmV0dXJuIG1hdGNoICYmIG1hdGNoWzFdIHx8ICcnO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBTeW50YWN0aWMgc3VnYXIgZm9yIGludm9raW5nIGEgZnVuY3Rpb24gYW5kIGV4cGFuZGluZyBhbiBhcnJheSBmb3IgYXJndW1lbnRzLlxuICpcbiAqIENvbW1vbiB1c2UgY2FzZSB3b3VsZCBiZSB0byB1c2UgYEZ1bmN0aW9uLnByb3RvdHlwZS5hcHBseWAuXG4gKlxuICogIGBgYGpzXG4gKiAgZnVuY3Rpb24gZih4LCB5LCB6KSB7fVxuICogIHZhciBhcmdzID0gWzEsIDIsIDNdO1xuICogIGYuYXBwbHkobnVsbCwgYXJncyk7XG4gKiAgYGBgXG4gKlxuICogV2l0aCBgc3ByZWFkYCB0aGlzIGV4YW1wbGUgY2FuIGJlIHJlLXdyaXR0ZW4uXG4gKlxuICogIGBgYGpzXG4gKiAgc3ByZWFkKGZ1bmN0aW9uKHgsIHksIHopIHt9KShbMSwgMiwgM10pO1xuICogIGBgYFxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc3ByZWFkKGNhbGxiYWNrKSB7XG4gIHJldHVybiBmdW5jdGlvbiB3cmFwKGFycikge1xuICAgIHJldHVybiBjYWxsYmFjay5hcHBseShudWxsLCBhcnIpO1xuICB9O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMnKTtcblxuLyoqXG4gKiBDb252ZXJ0IGEgZGF0YSBvYmplY3QgdG8gRm9ybURhdGFcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEBwYXJhbSB7P09iamVjdH0gW2Zvcm1EYXRhXVxuICogQHJldHVybnMge09iamVjdH1cbiAqKi9cblxuZnVuY3Rpb24gdG9Gb3JtRGF0YShvYmosIGZvcm1EYXRhKSB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wYXJhbS1yZWFzc2lnblxuICBmb3JtRGF0YSA9IGZvcm1EYXRhIHx8IG5ldyBGb3JtRGF0YSgpO1xuXG4gIHZhciBzdGFjayA9IFtdO1xuXG4gIGZ1bmN0aW9uIGNvbnZlcnRWYWx1ZSh2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSA9PT0gbnVsbCkgcmV0dXJuICcnO1xuXG4gICAgaWYgKHV0aWxzLmlzRGF0ZSh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiB2YWx1ZS50b0lTT1N0cmluZygpO1xuICAgIH1cblxuICAgIGlmICh1dGlscy5pc0FycmF5QnVmZmVyKHZhbHVlKSB8fCB1dGlscy5pc1R5cGVkQXJyYXkodmFsdWUpKSB7XG4gICAgICByZXR1cm4gdHlwZW9mIEJsb2IgPT09ICdmdW5jdGlvbicgPyBuZXcgQmxvYihbdmFsdWVdKSA6IEJ1ZmZlci5mcm9tKHZhbHVlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICBmdW5jdGlvbiBidWlsZChkYXRhLCBwYXJlbnRLZXkpIHtcbiAgICBpZiAodXRpbHMuaXNQbGFpbk9iamVjdChkYXRhKSB8fCB1dGlscy5pc0FycmF5KGRhdGEpKSB7XG4gICAgICBpZiAoc3RhY2suaW5kZXhPZihkYXRhKSAhPT0gLTEpIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoJ0NpcmN1bGFyIHJlZmVyZW5jZSBkZXRlY3RlZCBpbiAnICsgcGFyZW50S2V5KTtcbiAgICAgIH1cblxuICAgICAgc3RhY2sucHVzaChkYXRhKTtcblxuICAgICAgdXRpbHMuZm9yRWFjaChkYXRhLCBmdW5jdGlvbiBlYWNoKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgaWYgKHV0aWxzLmlzVW5kZWZpbmVkKHZhbHVlKSkgcmV0dXJuO1xuICAgICAgICB2YXIgZnVsbEtleSA9IHBhcmVudEtleSA/IHBhcmVudEtleSArICcuJyArIGtleSA6IGtleTtcbiAgICAgICAgdmFyIGFycjtcblxuICAgICAgICBpZiAodmFsdWUgJiYgIXBhcmVudEtleSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgaWYgKHV0aWxzLmVuZHNXaXRoKGtleSwgJ3t9JykpIHtcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wYXJhbS1yZWFzc2lnblxuICAgICAgICAgICAgdmFsdWUgPSBKU09OLnN0cmluZ2lmeSh2YWx1ZSk7XG4gICAgICAgICAgfSBlbHNlIGlmICh1dGlscy5lbmRzV2l0aChrZXksICdbXScpICYmIChhcnIgPSB1dGlscy50b0FycmF5KHZhbHVlKSkpIHtcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBmdW5jLW5hbWVzXG4gICAgICAgICAgICBhcnIuZm9yRWFjaChmdW5jdGlvbihlbCkge1xuICAgICAgICAgICAgICAhdXRpbHMuaXNVbmRlZmluZWQoZWwpICYmIGZvcm1EYXRhLmFwcGVuZChmdWxsS2V5LCBjb252ZXJ0VmFsdWUoZWwpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGJ1aWxkKHZhbHVlLCBmdWxsS2V5KTtcbiAgICAgIH0pO1xuXG4gICAgICBzdGFjay5wb3AoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZm9ybURhdGEuYXBwZW5kKHBhcmVudEtleSwgY29udmVydFZhbHVlKGRhdGEpKTtcbiAgICB9XG4gIH1cblxuICBidWlsZChvYmopO1xuXG4gIHJldHVybiBmb3JtRGF0YTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB0b0Zvcm1EYXRhO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgVkVSU0lPTiA9IHJlcXVpcmUoJy4uL2Vudi9kYXRhJykudmVyc2lvbjtcbnZhciBBeGlvc0Vycm9yID0gcmVxdWlyZSgnLi4vY29yZS9BeGlvc0Vycm9yJyk7XG5cbnZhciB2YWxpZGF0b3JzID0ge307XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBmdW5jLW5hbWVzXG5bJ29iamVjdCcsICdib29sZWFuJywgJ251bWJlcicsICdmdW5jdGlvbicsICdzdHJpbmcnLCAnc3ltYm9sJ10uZm9yRWFjaChmdW5jdGlvbih0eXBlLCBpKSB7XG4gIHZhbGlkYXRvcnNbdHlwZV0gPSBmdW5jdGlvbiB2YWxpZGF0b3IodGhpbmcpIHtcbiAgICByZXR1cm4gdHlwZW9mIHRoaW5nID09PSB0eXBlIHx8ICdhJyArIChpIDwgMSA/ICduICcgOiAnICcpICsgdHlwZTtcbiAgfTtcbn0pO1xuXG52YXIgZGVwcmVjYXRlZFdhcm5pbmdzID0ge307XG5cbi8qKlxuICogVHJhbnNpdGlvbmFsIG9wdGlvbiB2YWxpZGF0b3JcbiAqIEBwYXJhbSB7ZnVuY3Rpb258Ym9vbGVhbj99IHZhbGlkYXRvciAtIHNldCB0byBmYWxzZSBpZiB0aGUgdHJhbnNpdGlvbmFsIG9wdGlvbiBoYXMgYmVlbiByZW1vdmVkXG4gKiBAcGFyYW0ge3N0cmluZz99IHZlcnNpb24gLSBkZXByZWNhdGVkIHZlcnNpb24gLyByZW1vdmVkIHNpbmNlIHZlcnNpb25cbiAqIEBwYXJhbSB7c3RyaW5nP30gbWVzc2FnZSAtIHNvbWUgbWVzc2FnZSB3aXRoIGFkZGl0aW9uYWwgaW5mb1xuICogQHJldHVybnMge2Z1bmN0aW9ufVxuICovXG52YWxpZGF0b3JzLnRyYW5zaXRpb25hbCA9IGZ1bmN0aW9uIHRyYW5zaXRpb25hbCh2YWxpZGF0b3IsIHZlcnNpb24sIG1lc3NhZ2UpIHtcbiAgZnVuY3Rpb24gZm9ybWF0TWVzc2FnZShvcHQsIGRlc2MpIHtcbiAgICByZXR1cm4gJ1tBeGlvcyB2JyArIFZFUlNJT04gKyAnXSBUcmFuc2l0aW9uYWwgb3B0aW9uIFxcJycgKyBvcHQgKyAnXFwnJyArIGRlc2MgKyAobWVzc2FnZSA/ICcuICcgKyBtZXNzYWdlIDogJycpO1xuICB9XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGZ1bmMtbmFtZXNcbiAgcmV0dXJuIGZ1bmN0aW9uKHZhbHVlLCBvcHQsIG9wdHMpIHtcbiAgICBpZiAodmFsaWRhdG9yID09PSBmYWxzZSkge1xuICAgICAgdGhyb3cgbmV3IEF4aW9zRXJyb3IoXG4gICAgICAgIGZvcm1hdE1lc3NhZ2Uob3B0LCAnIGhhcyBiZWVuIHJlbW92ZWQnICsgKHZlcnNpb24gPyAnIGluICcgKyB2ZXJzaW9uIDogJycpKSxcbiAgICAgICAgQXhpb3NFcnJvci5FUlJfREVQUkVDQVRFRFxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAodmVyc2lvbiAmJiAhZGVwcmVjYXRlZFdhcm5pbmdzW29wdF0pIHtcbiAgICAgIGRlcHJlY2F0ZWRXYXJuaW5nc1tvcHRdID0gdHJ1ZTtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgIGZvcm1hdE1lc3NhZ2UoXG4gICAgICAgICAgb3B0LFxuICAgICAgICAgICcgaGFzIGJlZW4gZGVwcmVjYXRlZCBzaW5jZSB2JyArIHZlcnNpb24gKyAnIGFuZCB3aWxsIGJlIHJlbW92ZWQgaW4gdGhlIG5lYXIgZnV0dXJlJ1xuICAgICAgICApXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiB2YWxpZGF0b3IgPyB2YWxpZGF0b3IodmFsdWUsIG9wdCwgb3B0cykgOiB0cnVlO1xuICB9O1xufTtcblxuLyoqXG4gKiBBc3NlcnQgb2JqZWN0J3MgcHJvcGVydGllcyB0eXBlXG4gKiBAcGFyYW0ge29iamVjdH0gb3B0aW9uc1xuICogQHBhcmFtIHtvYmplY3R9IHNjaGVtYVxuICogQHBhcmFtIHtib29sZWFuP30gYWxsb3dVbmtub3duXG4gKi9cblxuZnVuY3Rpb24gYXNzZXJ0T3B0aW9ucyhvcHRpb25zLCBzY2hlbWEsIGFsbG93VW5rbm93bikge1xuICBpZiAodHlwZW9mIG9wdGlvbnMgIT09ICdvYmplY3QnKSB7XG4gICAgdGhyb3cgbmV3IEF4aW9zRXJyb3IoJ29wdGlvbnMgbXVzdCBiZSBhbiBvYmplY3QnLCBBeGlvc0Vycm9yLkVSUl9CQURfT1BUSU9OX1ZBTFVFKTtcbiAgfVxuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKG9wdGlvbnMpO1xuICB2YXIgaSA9IGtleXMubGVuZ3RoO1xuICB3aGlsZSAoaS0tID4gMCkge1xuICAgIHZhciBvcHQgPSBrZXlzW2ldO1xuICAgIHZhciB2YWxpZGF0b3IgPSBzY2hlbWFbb3B0XTtcbiAgICBpZiAodmFsaWRhdG9yKSB7XG4gICAgICB2YXIgdmFsdWUgPSBvcHRpb25zW29wdF07XG4gICAgICB2YXIgcmVzdWx0ID0gdmFsdWUgPT09IHVuZGVmaW5lZCB8fCB2YWxpZGF0b3IodmFsdWUsIG9wdCwgb3B0aW9ucyk7XG4gICAgICBpZiAocmVzdWx0ICE9PSB0cnVlKSB7XG4gICAgICAgIHRocm93IG5ldyBBeGlvc0Vycm9yKCdvcHRpb24gJyArIG9wdCArICcgbXVzdCBiZSAnICsgcmVzdWx0LCBBeGlvc0Vycm9yLkVSUl9CQURfT1BUSU9OX1ZBTFVFKTtcbiAgICAgIH1cbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBpZiAoYWxsb3dVbmtub3duICE9PSB0cnVlKSB7XG4gICAgICB0aHJvdyBuZXcgQXhpb3NFcnJvcignVW5rbm93biBvcHRpb24gJyArIG9wdCwgQXhpb3NFcnJvci5FUlJfQkFEX09QVElPTik7XG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBhc3NlcnRPcHRpb25zOiBhc3NlcnRPcHRpb25zLFxuICB2YWxpZGF0b3JzOiB2YWxpZGF0b3JzXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYmluZCA9IHJlcXVpcmUoJy4vaGVscGVycy9iaW5kJyk7XG5cbi8vIHV0aWxzIGlzIGEgbGlicmFyeSBvZiBnZW5lcmljIGhlbHBlciBmdW5jdGlvbnMgbm9uLXNwZWNpZmljIHRvIGF4aW9zXG5cbnZhciB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBmdW5jLW5hbWVzXG52YXIga2luZE9mID0gKGZ1bmN0aW9uKGNhY2hlKSB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBmdW5jLW5hbWVzXG4gIHJldHVybiBmdW5jdGlvbih0aGluZykge1xuICAgIHZhciBzdHIgPSB0b1N0cmluZy5jYWxsKHRoaW5nKTtcbiAgICByZXR1cm4gY2FjaGVbc3RyXSB8fCAoY2FjaGVbc3RyXSA9IHN0ci5zbGljZSg4LCAtMSkudG9Mb3dlckNhc2UoKSk7XG4gIH07XG59KShPYmplY3QuY3JlYXRlKG51bGwpKTtcblxuZnVuY3Rpb24ga2luZE9mVGVzdCh0eXBlKSB7XG4gIHR5cGUgPSB0eXBlLnRvTG93ZXJDYXNlKCk7XG4gIHJldHVybiBmdW5jdGlvbiBpc0tpbmRPZih0aGluZykge1xuICAgIHJldHVybiBraW5kT2YodGhpbmcpID09PSB0eXBlO1xuICB9O1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGFuIEFycmF5XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYW4gQXJyYXksIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0FycmF5KHZhbCkge1xuICByZXR1cm4gQXJyYXkuaXNBcnJheSh2YWwpO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIHVuZGVmaW5lZFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHRoZSB2YWx1ZSBpcyB1bmRlZmluZWQsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1VuZGVmaW5lZCh2YWwpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWwgPT09ICd1bmRlZmluZWQnO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgQnVmZmVyXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBCdWZmZXIsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0J1ZmZlcih2YWwpIHtcbiAgcmV0dXJuIHZhbCAhPT0gbnVsbCAmJiAhaXNVbmRlZmluZWQodmFsKSAmJiB2YWwuY29uc3RydWN0b3IgIT09IG51bGwgJiYgIWlzVW5kZWZpbmVkKHZhbC5jb25zdHJ1Y3RvcilcbiAgICAmJiB0eXBlb2YgdmFsLmNvbnN0cnVjdG9yLmlzQnVmZmVyID09PSAnZnVuY3Rpb24nICYmIHZhbC5jb25zdHJ1Y3Rvci5pc0J1ZmZlcih2YWwpO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGFuIEFycmF5QnVmZmVyXG4gKlxuICogQGZ1bmN0aW9uXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhbiBBcnJheUJ1ZmZlciwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbnZhciBpc0FycmF5QnVmZmVyID0ga2luZE9mVGVzdCgnQXJyYXlCdWZmZXInKTtcblxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgdmlldyBvbiBhbiBBcnJheUJ1ZmZlclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgdmlldyBvbiBhbiBBcnJheUJ1ZmZlciwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXlCdWZmZXJWaWV3KHZhbCkge1xuICB2YXIgcmVzdWx0O1xuICBpZiAoKHR5cGVvZiBBcnJheUJ1ZmZlciAhPT0gJ3VuZGVmaW5lZCcpICYmIChBcnJheUJ1ZmZlci5pc1ZpZXcpKSB7XG4gICAgcmVzdWx0ID0gQXJyYXlCdWZmZXIuaXNWaWV3KHZhbCk7XG4gIH0gZWxzZSB7XG4gICAgcmVzdWx0ID0gKHZhbCkgJiYgKHZhbC5idWZmZXIpICYmIChpc0FycmF5QnVmZmVyKHZhbC5idWZmZXIpKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgU3RyaW5nXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBTdHJpbmcsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1N0cmluZyh2YWwpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgTnVtYmVyXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBOdW1iZXIsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc051bWJlcih2YWwpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWwgPT09ICdudW1iZXInO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGFuIE9iamVjdFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGFuIE9iamVjdCwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbCkge1xuICByZXR1cm4gdmFsICE9PSBudWxsICYmIHR5cGVvZiB2YWwgPT09ICdvYmplY3QnO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgcGxhaW4gT2JqZWN0XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybiB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIHBsYWluIE9iamVjdCwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzUGxhaW5PYmplY3QodmFsKSB7XG4gIGlmIChraW5kT2YodmFsKSAhPT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB2YXIgcHJvdG90eXBlID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHZhbCk7XG4gIHJldHVybiBwcm90b3R5cGUgPT09IG51bGwgfHwgcHJvdG90eXBlID09PSBPYmplY3QucHJvdG90eXBlO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgRGF0ZVxuICpcbiAqIEBmdW5jdGlvblxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBEYXRlLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xudmFyIGlzRGF0ZSA9IGtpbmRPZlRlc3QoJ0RhdGUnKTtcblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEZpbGVcbiAqXG4gKiBAZnVuY3Rpb25cbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgRmlsZSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbnZhciBpc0ZpbGUgPSBraW5kT2ZUZXN0KCdGaWxlJyk7XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBCbG9iXG4gKlxuICogQGZ1bmN0aW9uXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIEJsb2IsIG90aGVyd2lzZSBmYWxzZVxuICovXG52YXIgaXNCbG9iID0ga2luZE9mVGVzdCgnQmxvYicpO1xuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgRmlsZUxpc3RcbiAqXG4gKiBAZnVuY3Rpb25cbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgRmlsZSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbnZhciBpc0ZpbGVMaXN0ID0ga2luZE9mVGVzdCgnRmlsZUxpc3QnKTtcblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEZ1bmN0aW9uXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBGdW5jdGlvbiwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBTdHJlYW1cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIFN0cmVhbSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzU3RyZWFtKHZhbCkge1xuICByZXR1cm4gaXNPYmplY3QodmFsKSAmJiBpc0Z1bmN0aW9uKHZhbC5waXBlKTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEZvcm1EYXRhXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHRoaW5nIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhbiBGb3JtRGF0YSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRm9ybURhdGEodGhpbmcpIHtcbiAgdmFyIHBhdHRlcm4gPSAnW29iamVjdCBGb3JtRGF0YV0nO1xuICByZXR1cm4gdGhpbmcgJiYgKFxuICAgICh0eXBlb2YgRm9ybURhdGEgPT09ICdmdW5jdGlvbicgJiYgdGhpbmcgaW5zdGFuY2VvZiBGb3JtRGF0YSkgfHxcbiAgICB0b1N0cmluZy5jYWxsKHRoaW5nKSA9PT0gcGF0dGVybiB8fFxuICAgIChpc0Z1bmN0aW9uKHRoaW5nLnRvU3RyaW5nKSAmJiB0aGluZy50b1N0cmluZygpID09PSBwYXR0ZXJuKVxuICApO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgVVJMU2VhcmNoUGFyYW1zIG9iamVjdFxuICogQGZ1bmN0aW9uXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIFVSTFNlYXJjaFBhcmFtcyBvYmplY3QsIG90aGVyd2lzZSBmYWxzZVxuICovXG52YXIgaXNVUkxTZWFyY2hQYXJhbXMgPSBraW5kT2ZUZXN0KCdVUkxTZWFyY2hQYXJhbXMnKTtcblxuLyoqXG4gKiBUcmltIGV4Y2VzcyB3aGl0ZXNwYWNlIG9mZiB0aGUgYmVnaW5uaW5nIGFuZCBlbmQgb2YgYSBzdHJpbmdcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBTdHJpbmcgdG8gdHJpbVxuICogQHJldHVybnMge1N0cmluZ30gVGhlIFN0cmluZyBmcmVlZCBvZiBleGNlc3Mgd2hpdGVzcGFjZVxuICovXG5mdW5jdGlvbiB0cmltKHN0cikge1xuICByZXR1cm4gc3RyLnRyaW0gPyBzdHIudHJpbSgpIDogc3RyLnJlcGxhY2UoL15cXHMrfFxccyskL2csICcnKTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgd2UncmUgcnVubmluZyBpbiBhIHN0YW5kYXJkIGJyb3dzZXIgZW52aXJvbm1lbnRcbiAqXG4gKiBUaGlzIGFsbG93cyBheGlvcyB0byBydW4gaW4gYSB3ZWIgd29ya2VyLCBhbmQgcmVhY3QtbmF0aXZlLlxuICogQm90aCBlbnZpcm9ubWVudHMgc3VwcG9ydCBYTUxIdHRwUmVxdWVzdCwgYnV0IG5vdCBmdWxseSBzdGFuZGFyZCBnbG9iYWxzLlxuICpcbiAqIHdlYiB3b3JrZXJzOlxuICogIHR5cGVvZiB3aW5kb3cgLT4gdW5kZWZpbmVkXG4gKiAgdHlwZW9mIGRvY3VtZW50IC0+IHVuZGVmaW5lZFxuICpcbiAqIHJlYWN0LW5hdGl2ZTpcbiAqICBuYXZpZ2F0b3IucHJvZHVjdCAtPiAnUmVhY3ROYXRpdmUnXG4gKiBuYXRpdmVzY3JpcHRcbiAqICBuYXZpZ2F0b3IucHJvZHVjdCAtPiAnTmF0aXZlU2NyaXB0JyBvciAnTlMnXG4gKi9cbmZ1bmN0aW9uIGlzU3RhbmRhcmRCcm93c2VyRW52KCkge1xuICBpZiAodHlwZW9mIG5hdmlnYXRvciAhPT0gJ3VuZGVmaW5lZCcgJiYgKG5hdmlnYXRvci5wcm9kdWN0ID09PSAnUmVhY3ROYXRpdmUnIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmF2aWdhdG9yLnByb2R1Y3QgPT09ICdOYXRpdmVTY3JpcHQnIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmF2aWdhdG9yLnByb2R1Y3QgPT09ICdOUycpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiAoXG4gICAgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICB0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnXG4gICk7XG59XG5cbi8qKlxuICogSXRlcmF0ZSBvdmVyIGFuIEFycmF5IG9yIGFuIE9iamVjdCBpbnZva2luZyBhIGZ1bmN0aW9uIGZvciBlYWNoIGl0ZW0uXG4gKlxuICogSWYgYG9iamAgaXMgYW4gQXJyYXkgY2FsbGJhY2sgd2lsbCBiZSBjYWxsZWQgcGFzc2luZ1xuICogdGhlIHZhbHVlLCBpbmRleCwgYW5kIGNvbXBsZXRlIGFycmF5IGZvciBlYWNoIGl0ZW0uXG4gKlxuICogSWYgJ29iaicgaXMgYW4gT2JqZWN0IGNhbGxiYWNrIHdpbGwgYmUgY2FsbGVkIHBhc3NpbmdcbiAqIHRoZSB2YWx1ZSwga2V5LCBhbmQgY29tcGxldGUgb2JqZWN0IGZvciBlYWNoIHByb3BlcnR5LlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fEFycmF5fSBvYmogVGhlIG9iamVjdCB0byBpdGVyYXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgY2FsbGJhY2sgdG8gaW52b2tlIGZvciBlYWNoIGl0ZW1cbiAqL1xuZnVuY3Rpb24gZm9yRWFjaChvYmosIGZuKSB7XG4gIC8vIERvbid0IGJvdGhlciBpZiBubyB2YWx1ZSBwcm92aWRlZFxuICBpZiAob2JqID09PSBudWxsIHx8IHR5cGVvZiBvYmogPT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gRm9yY2UgYW4gYXJyYXkgaWYgbm90IGFscmVhZHkgc29tZXRoaW5nIGl0ZXJhYmxlXG4gIGlmICh0eXBlb2Ygb2JqICE9PSAnb2JqZWN0Jykge1xuICAgIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuICAgIG9iaiA9IFtvYmpdO1xuICB9XG5cbiAgaWYgKGlzQXJyYXkob2JqKSkge1xuICAgIC8vIEl0ZXJhdGUgb3ZlciBhcnJheSB2YWx1ZXNcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IG9iai5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIGZuLmNhbGwobnVsbCwgb2JqW2ldLCBpLCBvYmopO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICAvLyBJdGVyYXRlIG92ZXIgb2JqZWN0IGtleXNcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkge1xuICAgICAgICBmbi5jYWxsKG51bGwsIG9ialtrZXldLCBrZXksIG9iaik7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogQWNjZXB0cyB2YXJhcmdzIGV4cGVjdGluZyBlYWNoIGFyZ3VtZW50IHRvIGJlIGFuIG9iamVjdCwgdGhlblxuICogaW1tdXRhYmx5IG1lcmdlcyB0aGUgcHJvcGVydGllcyBvZiBlYWNoIG9iamVjdCBhbmQgcmV0dXJucyByZXN1bHQuXG4gKlxuICogV2hlbiBtdWx0aXBsZSBvYmplY3RzIGNvbnRhaW4gdGhlIHNhbWUga2V5IHRoZSBsYXRlciBvYmplY3QgaW5cbiAqIHRoZSBhcmd1bWVudHMgbGlzdCB3aWxsIHRha2UgcHJlY2VkZW5jZS5cbiAqXG4gKiBFeGFtcGxlOlxuICpcbiAqIGBgYGpzXG4gKiB2YXIgcmVzdWx0ID0gbWVyZ2Uoe2ZvbzogMTIzfSwge2ZvbzogNDU2fSk7XG4gKiBjb25zb2xlLmxvZyhyZXN1bHQuZm9vKTsgLy8gb3V0cHV0cyA0NTZcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmoxIE9iamVjdCB0byBtZXJnZVxuICogQHJldHVybnMge09iamVjdH0gUmVzdWx0IG9mIGFsbCBtZXJnZSBwcm9wZXJ0aWVzXG4gKi9cbmZ1bmN0aW9uIG1lcmdlKC8qIG9iajEsIG9iajIsIG9iajMsIC4uLiAqLykge1xuICB2YXIgcmVzdWx0ID0ge307XG4gIGZ1bmN0aW9uIGFzc2lnblZhbHVlKHZhbCwga2V5KSB7XG4gICAgaWYgKGlzUGxhaW5PYmplY3QocmVzdWx0W2tleV0pICYmIGlzUGxhaW5PYmplY3QodmFsKSkge1xuICAgICAgcmVzdWx0W2tleV0gPSBtZXJnZShyZXN1bHRba2V5XSwgdmFsKTtcbiAgICB9IGVsc2UgaWYgKGlzUGxhaW5PYmplY3QodmFsKSkge1xuICAgICAgcmVzdWx0W2tleV0gPSBtZXJnZSh7fSwgdmFsKTtcbiAgICB9IGVsc2UgaWYgKGlzQXJyYXkodmFsKSkge1xuICAgICAgcmVzdWx0W2tleV0gPSB2YWwuc2xpY2UoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdWx0W2tleV0gPSB2YWw7XG4gICAgfVxuICB9XG5cbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgZm9yRWFjaChhcmd1bWVudHNbaV0sIGFzc2lnblZhbHVlKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIEV4dGVuZHMgb2JqZWN0IGEgYnkgbXV0YWJseSBhZGRpbmcgdG8gaXQgdGhlIHByb3BlcnRpZXMgb2Ygb2JqZWN0IGIuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGEgVGhlIG9iamVjdCB0byBiZSBleHRlbmRlZFxuICogQHBhcmFtIHtPYmplY3R9IGIgVGhlIG9iamVjdCB0byBjb3B5IHByb3BlcnRpZXMgZnJvbVxuICogQHBhcmFtIHtPYmplY3R9IHRoaXNBcmcgVGhlIG9iamVjdCB0byBiaW5kIGZ1bmN0aW9uIHRvXG4gKiBAcmV0dXJuIHtPYmplY3R9IFRoZSByZXN1bHRpbmcgdmFsdWUgb2Ygb2JqZWN0IGFcbiAqL1xuZnVuY3Rpb24gZXh0ZW5kKGEsIGIsIHRoaXNBcmcpIHtcbiAgZm9yRWFjaChiLCBmdW5jdGlvbiBhc3NpZ25WYWx1ZSh2YWwsIGtleSkge1xuICAgIGlmICh0aGlzQXJnICYmIHR5cGVvZiB2YWwgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGFba2V5XSA9IGJpbmQodmFsLCB0aGlzQXJnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYVtrZXldID0gdmFsO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBhO1xufVxuXG4vKipcbiAqIFJlbW92ZSBieXRlIG9yZGVyIG1hcmtlci4gVGhpcyBjYXRjaGVzIEVGIEJCIEJGICh0aGUgVVRGLTggQk9NKVxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBjb250ZW50IHdpdGggQk9NXG4gKiBAcmV0dXJuIHtzdHJpbmd9IGNvbnRlbnQgdmFsdWUgd2l0aG91dCBCT01cbiAqL1xuZnVuY3Rpb24gc3RyaXBCT00oY29udGVudCkge1xuICBpZiAoY29udGVudC5jaGFyQ29kZUF0KDApID09PSAweEZFRkYpIHtcbiAgICBjb250ZW50ID0gY29udGVudC5zbGljZSgxKTtcbiAgfVxuICByZXR1cm4gY29udGVudDtcbn1cblxuLyoqXG4gKiBJbmhlcml0IHRoZSBwcm90b3R5cGUgbWV0aG9kcyBmcm9tIG9uZSBjb25zdHJ1Y3RvciBpbnRvIGFub3RoZXJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBzdXBlckNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge29iamVjdH0gW3Byb3BzXVxuICogQHBhcmFtIHtvYmplY3R9IFtkZXNjcmlwdG9yc11cbiAqL1xuXG5mdW5jdGlvbiBpbmhlcml0cyhjb25zdHJ1Y3Rvciwgc3VwZXJDb25zdHJ1Y3RvciwgcHJvcHMsIGRlc2NyaXB0b3JzKSB7XG4gIGNvbnN0cnVjdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIGRlc2NyaXB0b3JzKTtcbiAgY29uc3RydWN0b3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gY29uc3RydWN0b3I7XG4gIHByb3BzICYmIE9iamVjdC5hc3NpZ24oY29uc3RydWN0b3IucHJvdG90eXBlLCBwcm9wcyk7XG59XG5cbi8qKlxuICogUmVzb2x2ZSBvYmplY3Qgd2l0aCBkZWVwIHByb3RvdHlwZSBjaGFpbiB0byBhIGZsYXQgb2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gc291cmNlT2JqIHNvdXJjZSBvYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBbZGVzdE9ial1cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtmaWx0ZXJdXG4gKiBAcmV0dXJucyB7T2JqZWN0fVxuICovXG5cbmZ1bmN0aW9uIHRvRmxhdE9iamVjdChzb3VyY2VPYmosIGRlc3RPYmosIGZpbHRlcikge1xuICB2YXIgcHJvcHM7XG4gIHZhciBpO1xuICB2YXIgcHJvcDtcbiAgdmFyIG1lcmdlZCA9IHt9O1xuXG4gIGRlc3RPYmogPSBkZXN0T2JqIHx8IHt9O1xuXG4gIGRvIHtcbiAgICBwcm9wcyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHNvdXJjZU9iaik7XG4gICAgaSA9IHByb3BzLmxlbmd0aDtcbiAgICB3aGlsZSAoaS0tID4gMCkge1xuICAgICAgcHJvcCA9IHByb3BzW2ldO1xuICAgICAgaWYgKCFtZXJnZWRbcHJvcF0pIHtcbiAgICAgICAgZGVzdE9ialtwcm9wXSA9IHNvdXJjZU9ialtwcm9wXTtcbiAgICAgICAgbWVyZ2VkW3Byb3BdID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgc291cmNlT2JqID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHNvdXJjZU9iaik7XG4gIH0gd2hpbGUgKHNvdXJjZU9iaiAmJiAoIWZpbHRlciB8fCBmaWx0ZXIoc291cmNlT2JqLCBkZXN0T2JqKSkgJiYgc291cmNlT2JqICE9PSBPYmplY3QucHJvdG90eXBlKTtcblxuICByZXR1cm4gZGVzdE9iajtcbn1cblxuLypcbiAqIGRldGVybWluZXMgd2hldGhlciBhIHN0cmluZyBlbmRzIHdpdGggdGhlIGNoYXJhY3RlcnMgb2YgYSBzcGVjaWZpZWQgc3RyaW5nXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcGFyYW0ge1N0cmluZ30gc2VhcmNoU3RyaW5nXG4gKiBAcGFyYW0ge051bWJlcn0gW3Bvc2l0aW9uPSAwXVxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGVuZHNXaXRoKHN0ciwgc2VhcmNoU3RyaW5nLCBwb3NpdGlvbikge1xuICBzdHIgPSBTdHJpbmcoc3RyKTtcbiAgaWYgKHBvc2l0aW9uID09PSB1bmRlZmluZWQgfHwgcG9zaXRpb24gPiBzdHIubGVuZ3RoKSB7XG4gICAgcG9zaXRpb24gPSBzdHIubGVuZ3RoO1xuICB9XG4gIHBvc2l0aW9uIC09IHNlYXJjaFN0cmluZy5sZW5ndGg7XG4gIHZhciBsYXN0SW5kZXggPSBzdHIuaW5kZXhPZihzZWFyY2hTdHJpbmcsIHBvc2l0aW9uKTtcbiAgcmV0dXJuIGxhc3RJbmRleCAhPT0gLTEgJiYgbGFzdEluZGV4ID09PSBwb3NpdGlvbjtcbn1cblxuXG4vKipcbiAqIFJldHVybnMgbmV3IGFycmF5IGZyb20gYXJyYXkgbGlrZSBvYmplY3RcbiAqIEBwYXJhbSB7Kn0gW3RoaW5nXVxuICogQHJldHVybnMge0FycmF5fVxuICovXG5mdW5jdGlvbiB0b0FycmF5KHRoaW5nKSB7XG4gIGlmICghdGhpbmcpIHJldHVybiBudWxsO1xuICB2YXIgaSA9IHRoaW5nLmxlbmd0aDtcbiAgaWYgKGlzVW5kZWZpbmVkKGkpKSByZXR1cm4gbnVsbDtcbiAgdmFyIGFyciA9IG5ldyBBcnJheShpKTtcbiAgd2hpbGUgKGktLSA+IDApIHtcbiAgICBhcnJbaV0gPSB0aGluZ1tpXTtcbiAgfVxuICByZXR1cm4gYXJyO1xufVxuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZnVuYy1uYW1lc1xudmFyIGlzVHlwZWRBcnJheSA9IChmdW5jdGlvbihUeXBlZEFycmF5KSB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBmdW5jLW5hbWVzXG4gIHJldHVybiBmdW5jdGlvbih0aGluZykge1xuICAgIHJldHVybiBUeXBlZEFycmF5ICYmIHRoaW5nIGluc3RhbmNlb2YgVHlwZWRBcnJheTtcbiAgfTtcbn0pKHR5cGVvZiBVaW50OEFycmF5ICE9PSAndW5kZWZpbmVkJyAmJiBPYmplY3QuZ2V0UHJvdG90eXBlT2YoVWludDhBcnJheSkpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgaXNBcnJheTogaXNBcnJheSxcbiAgaXNBcnJheUJ1ZmZlcjogaXNBcnJheUJ1ZmZlcixcbiAgaXNCdWZmZXI6IGlzQnVmZmVyLFxuICBpc0Zvcm1EYXRhOiBpc0Zvcm1EYXRhLFxuICBpc0FycmF5QnVmZmVyVmlldzogaXNBcnJheUJ1ZmZlclZpZXcsXG4gIGlzU3RyaW5nOiBpc1N0cmluZyxcbiAgaXNOdW1iZXI6IGlzTnVtYmVyLFxuICBpc09iamVjdDogaXNPYmplY3QsXG4gIGlzUGxhaW5PYmplY3Q6IGlzUGxhaW5PYmplY3QsXG4gIGlzVW5kZWZpbmVkOiBpc1VuZGVmaW5lZCxcbiAgaXNEYXRlOiBpc0RhdGUsXG4gIGlzRmlsZTogaXNGaWxlLFxuICBpc0Jsb2I6IGlzQmxvYixcbiAgaXNGdW5jdGlvbjogaXNGdW5jdGlvbixcbiAgaXNTdHJlYW06IGlzU3RyZWFtLFxuICBpc1VSTFNlYXJjaFBhcmFtczogaXNVUkxTZWFyY2hQYXJhbXMsXG4gIGlzU3RhbmRhcmRCcm93c2VyRW52OiBpc1N0YW5kYXJkQnJvd3NlckVudixcbiAgZm9yRWFjaDogZm9yRWFjaCxcbiAgbWVyZ2U6IG1lcmdlLFxuICBleHRlbmQ6IGV4dGVuZCxcbiAgdHJpbTogdHJpbSxcbiAgc3RyaXBCT006IHN0cmlwQk9NLFxuICBpbmhlcml0czogaW5oZXJpdHMsXG4gIHRvRmxhdE9iamVjdDogdG9GbGF0T2JqZWN0LFxuICBraW5kT2Y6IGtpbmRPZixcbiAga2luZE9mVGVzdDoga2luZE9mVGVzdCxcbiAgZW5kc1dpdGg6IGVuZHNXaXRoLFxuICB0b0FycmF5OiB0b0FycmF5LFxuICBpc1R5cGVkQXJyYXk6IGlzVHlwZWRBcnJheSxcbiAgaXNGaWxlTGlzdDogaXNGaWxlTGlzdFxufTtcbiIsIi8qIVxuKiBzd2VldGFsZXJ0MiB2MTEuNi4xXG4qIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiovXG4oZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuICB0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKSA6XG4gIHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShmYWN0b3J5KSA6XG4gIChnbG9iYWwgPSBnbG9iYWwgfHwgc2VsZiwgZ2xvYmFsLlN3ZWV0YWxlcnQyID0gZmFjdG9yeSgpKTtcbn0odGhpcywgZnVuY3Rpb24gKCkgeyAndXNlIHN0cmljdCc7XG5cbiAgLyoqXG4gICAqIFRoaXMgbW9kdWxlIGNvbnRhaW5zIGBXZWFrTWFwYHMgZm9yIGVhY2ggZWZmZWN0aXZlbHktXCJwcml2YXRlICBwcm9wZXJ0eVwiIHRoYXQgYSBgU3dhbGAgaGFzLlxuICAgKiBGb3IgZXhhbXBsZSwgdG8gc2V0IHRoZSBwcml2YXRlIHByb3BlcnR5IFwiZm9vXCIgb2YgYHRoaXNgIHRvIFwiYmFyXCIsIHlvdSBjYW4gYHByaXZhdGVQcm9wcy5mb28uc2V0KHRoaXMsICdiYXInKWBcbiAgICogVGhpcyBpcyB0aGUgYXBwcm9hY2ggdGhhdCBCYWJlbCB3aWxsIHByb2JhYmx5IHRha2UgdG8gaW1wbGVtZW50IHByaXZhdGUgbWV0aG9kcy9maWVsZHNcbiAgICogICBodHRwczovL2dpdGh1Yi5jb20vdGMzOS9wcm9wb3NhbC1wcml2YXRlLW1ldGhvZHNcbiAgICogICBodHRwczovL2dpdGh1Yi5jb20vYmFiZWwvYmFiZWwvcHVsbC83NTU1XG4gICAqIE9uY2Ugd2UgaGF2ZSB0aGUgY2hhbmdlcyBmcm9tIHRoYXQgUFIgaW4gQmFiZWwsIGFuZCBvdXIgY29yZSBjbGFzcyBmaXRzIHJlYXNvbmFibGUgaW4gKm9uZSBtb2R1bGUqXG4gICAqICAgdGhlbiB3ZSBjYW4gdXNlIHRoYXQgbGFuZ3VhZ2UgZmVhdHVyZS5cbiAgICovXG5cbiAgdmFyIHByaXZhdGVQcm9wcyA9IHtcbiAgICBhd2FpdGluZ1Byb21pc2U6IG5ldyBXZWFrTWFwKCksXG4gICAgcHJvbWlzZTogbmV3IFdlYWtNYXAoKSxcbiAgICBpbm5lclBhcmFtczogbmV3IFdlYWtNYXAoKSxcbiAgICBkb21DYWNoZTogbmV3IFdlYWtNYXAoKVxuICB9O1xuXG4gIGNvbnN0IHN3YWxQcmVmaXggPSAnc3dhbDItJztcblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmdbXX0gaXRlbXNcbiAgICogQHJldHVybnMge29iamVjdH1cbiAgICovXG4gIGNvbnN0IHByZWZpeCA9IGl0ZW1zID0+IHtcbiAgICBjb25zdCByZXN1bHQgPSB7fTtcbiAgICBmb3IgKGNvbnN0IGkgaW4gaXRlbXMpIHtcbiAgICAgIHJlc3VsdFtpdGVtc1tpXV0gPSBzd2FsUHJlZml4ICsgaXRlbXNbaV07XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG4gIGNvbnN0IHN3YWxDbGFzc2VzID0gcHJlZml4KFsnY29udGFpbmVyJywgJ3Nob3duJywgJ2hlaWdodC1hdXRvJywgJ2lvc2ZpeCcsICdwb3B1cCcsICdtb2RhbCcsICduby1iYWNrZHJvcCcsICduby10cmFuc2l0aW9uJywgJ3RvYXN0JywgJ3RvYXN0LXNob3duJywgJ3Nob3cnLCAnaGlkZScsICdjbG9zZScsICd0aXRsZScsICdodG1sLWNvbnRhaW5lcicsICdhY3Rpb25zJywgJ2NvbmZpcm0nLCAnZGVueScsICdjYW5jZWwnLCAnZGVmYXVsdC1vdXRsaW5lJywgJ2Zvb3RlcicsICdpY29uJywgJ2ljb24tY29udGVudCcsICdpbWFnZScsICdpbnB1dCcsICdmaWxlJywgJ3JhbmdlJywgJ3NlbGVjdCcsICdyYWRpbycsICdjaGVja2JveCcsICdsYWJlbCcsICd0ZXh0YXJlYScsICdpbnB1dGVycm9yJywgJ2lucHV0LWxhYmVsJywgJ3ZhbGlkYXRpb24tbWVzc2FnZScsICdwcm9ncmVzcy1zdGVwcycsICdhY3RpdmUtcHJvZ3Jlc3Mtc3RlcCcsICdwcm9ncmVzcy1zdGVwJywgJ3Byb2dyZXNzLXN0ZXAtbGluZScsICdsb2FkZXInLCAnbG9hZGluZycsICdzdHlsZWQnLCAndG9wJywgJ3RvcC1zdGFydCcsICd0b3AtZW5kJywgJ3RvcC1sZWZ0JywgJ3RvcC1yaWdodCcsICdjZW50ZXInLCAnY2VudGVyLXN0YXJ0JywgJ2NlbnRlci1lbmQnLCAnY2VudGVyLWxlZnQnLCAnY2VudGVyLXJpZ2h0JywgJ2JvdHRvbScsICdib3R0b20tc3RhcnQnLCAnYm90dG9tLWVuZCcsICdib3R0b20tbGVmdCcsICdib3R0b20tcmlnaHQnLCAnZ3Jvdy1yb3cnLCAnZ3Jvdy1jb2x1bW4nLCAnZ3Jvdy1mdWxsc2NyZWVuJywgJ3J0bCcsICd0aW1lci1wcm9ncmVzcy1iYXInLCAndGltZXItcHJvZ3Jlc3MtYmFyLWNvbnRhaW5lcicsICdzY3JvbGxiYXItbWVhc3VyZScsICdpY29uLXN1Y2Nlc3MnLCAnaWNvbi13YXJuaW5nJywgJ2ljb24taW5mbycsICdpY29uLXF1ZXN0aW9uJywgJ2ljb24tZXJyb3InLCAnbm8td2FyJ10pO1xuICBjb25zdCBpY29uVHlwZXMgPSBwcmVmaXgoWydzdWNjZXNzJywgJ3dhcm5pbmcnLCAnaW5mbycsICdxdWVzdGlvbicsICdlcnJvciddKTtcblxuICBjb25zdCBjb25zb2xlUHJlZml4ID0gJ1N3ZWV0QWxlcnQyOic7XG5cbiAgLyoqXG4gICAqIEZpbHRlciB0aGUgdW5pcXVlIHZhbHVlcyBpbnRvIGEgbmV3IGFycmF5XG4gICAqXG4gICAqIEBwYXJhbSB7QXJyYXl9IGFyclxuICAgKiBAcmV0dXJucyB7QXJyYXl9XG4gICAqL1xuICBjb25zdCB1bmlxdWVBcnJheSA9IGFyciA9PiB7XG4gICAgY29uc3QgcmVzdWx0ID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChyZXN1bHQuaW5kZXhPZihhcnJbaV0pID09PSAtMSkge1xuICAgICAgICByZXN1bHQucHVzaChhcnJbaV0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8qKlxuICAgKiBDYXBpdGFsaXplIHRoZSBmaXJzdCBsZXR0ZXIgb2YgYSBzdHJpbmdcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHN0clxuICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgKi9cbiAgY29uc3QgY2FwaXRhbGl6ZUZpcnN0TGV0dGVyID0gc3RyID0+IHN0ci5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHN0ci5zbGljZSgxKTtcblxuICAvKipcbiAgICogU3RhbmRhcmRpemUgY29uc29sZSB3YXJuaW5nc1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZyB8IEFycmF5fSBtZXNzYWdlXG4gICAqL1xuICBjb25zdCB3YXJuID0gbWVzc2FnZSA9PiB7XG4gICAgY29uc29sZS53YXJuKFwiXCIuY29uY2F0KGNvbnNvbGVQcmVmaXgsIFwiIFwiKS5jb25jYXQodHlwZW9mIG1lc3NhZ2UgPT09ICdvYmplY3QnID8gbWVzc2FnZS5qb2luKCcgJykgOiBtZXNzYWdlKSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFN0YW5kYXJkaXplIGNvbnNvbGUgZXJyb3JzXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlXG4gICAqL1xuICBjb25zdCBlcnJvciA9IG1lc3NhZ2UgPT4ge1xuICAgIGNvbnNvbGUuZXJyb3IoXCJcIi5jb25jYXQoY29uc29sZVByZWZpeCwgXCIgXCIpLmNvbmNhdChtZXNzYWdlKSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFByaXZhdGUgZ2xvYmFsIHN0YXRlIGZvciBgd2Fybk9uY2VgXG4gICAqXG4gICAqIEB0eXBlIHtBcnJheX1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGNvbnN0IHByZXZpb3VzV2Fybk9uY2VNZXNzYWdlcyA9IFtdO1xuXG4gIC8qKlxuICAgKiBTaG93IGEgY29uc29sZSB3YXJuaW5nLCBidXQgb25seSBpZiBpdCBoYXNuJ3QgYWxyZWFkeSBiZWVuIHNob3duXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlXG4gICAqL1xuICBjb25zdCB3YXJuT25jZSA9IG1lc3NhZ2UgPT4ge1xuICAgIGlmICghcHJldmlvdXNXYXJuT25jZU1lc3NhZ2VzLmluY2x1ZGVzKG1lc3NhZ2UpKSB7XG4gICAgICBwcmV2aW91c1dhcm5PbmNlTWVzc2FnZXMucHVzaChtZXNzYWdlKTtcbiAgICAgIHdhcm4obWVzc2FnZSk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBTaG93IGEgb25lLXRpbWUgY29uc29sZSB3YXJuaW5nIGFib3V0IGRlcHJlY2F0ZWQgcGFyYW1zL21ldGhvZHNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGRlcHJlY2F0ZWRQYXJhbVxuICAgKiBAcGFyYW0ge3N0cmluZ30gdXNlSW5zdGVhZFxuICAgKi9cbiAgY29uc3Qgd2FybkFib3V0RGVwcmVjYXRpb24gPSAoZGVwcmVjYXRlZFBhcmFtLCB1c2VJbnN0ZWFkKSA9PiB7XG4gICAgd2Fybk9uY2UoXCJcXFwiXCIuY29uY2F0KGRlcHJlY2F0ZWRQYXJhbSwgXCJcXFwiIGlzIGRlcHJlY2F0ZWQgYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiB0aGUgbmV4dCBtYWpvciByZWxlYXNlLiBQbGVhc2UgdXNlIFxcXCJcIikuY29uY2F0KHVzZUluc3RlYWQsIFwiXFxcIiBpbnN0ZWFkLlwiKSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIElmIGBhcmdgIGlzIGEgZnVuY3Rpb24sIGNhbGwgaXQgKHdpdGggbm8gYXJndW1lbnRzIG9yIGNvbnRleHQpIGFuZCByZXR1cm4gdGhlIHJlc3VsdC5cbiAgICogT3RoZXJ3aXNlLCBqdXN0IHBhc3MgdGhlIHZhbHVlIHRocm91Z2hcbiAgICpcbiAgICogQHBhcmFtIHtGdW5jdGlvbiB8IGFueX0gYXJnXG4gICAqIEByZXR1cm5zIHthbnl9XG4gICAqL1xuICBjb25zdCBjYWxsSWZGdW5jdGlvbiA9IGFyZyA9PiB0eXBlb2YgYXJnID09PSAnZnVuY3Rpb24nID8gYXJnKCkgOiBhcmc7XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7YW55fSBhcmdcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuICBjb25zdCBoYXNUb1Byb21pc2VGbiA9IGFyZyA9PiBhcmcgJiYgdHlwZW9mIGFyZy50b1Byb21pc2UgPT09ICdmdW5jdGlvbic7XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7YW55fSBhcmdcbiAgICogQHJldHVybnMge1Byb21pc2V9XG4gICAqL1xuICBjb25zdCBhc1Byb21pc2UgPSBhcmcgPT4gaGFzVG9Qcm9taXNlRm4oYXJnKSA/IGFyZy50b1Byb21pc2UoKSA6IFByb21pc2UucmVzb2x2ZShhcmcpO1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge2FueX0gYXJnXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgY29uc3QgaXNQcm9taXNlID0gYXJnID0+IGFyZyAmJiBQcm9taXNlLnJlc29sdmUoYXJnKSA9PT0gYXJnO1xuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBwb3B1cCBjb250YWluZXIgd2hpY2ggY29udGFpbnMgdGhlIGJhY2tkcm9wIGFuZCB0aGUgcG9wdXAgaXRzZWxmLlxuICAgKlxuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnQgfCBudWxsfVxuICAgKi9cbiAgY29uc3QgZ2V0Q29udGFpbmVyID0gKCkgPT4gZG9jdW1lbnQuYm9keS5xdWVyeVNlbGVjdG9yKFwiLlwiLmNvbmNhdChzd2FsQ2xhc3Nlcy5jb250YWluZXIpKTtcblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IHNlbGVjdG9yU3RyaW5nXG4gICAqIEByZXR1cm5zIHtIVE1MRWxlbWVudCB8IG51bGx9XG4gICAqL1xuICBjb25zdCBlbGVtZW50QnlTZWxlY3RvciA9IHNlbGVjdG9yU3RyaW5nID0+IHtcbiAgICBjb25zdCBjb250YWluZXIgPSBnZXRDb250YWluZXIoKTtcbiAgICByZXR1cm4gY29udGFpbmVyID8gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3JTdHJpbmcpIDogbnVsbDtcbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNsYXNzTmFtZVxuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnQgfCBudWxsfVxuICAgKi9cbiAgY29uc3QgZWxlbWVudEJ5Q2xhc3MgPSBjbGFzc05hbWUgPT4ge1xuICAgIHJldHVybiBlbGVtZW50QnlTZWxlY3RvcihcIi5cIi5jb25jYXQoY2xhc3NOYW1lKSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEByZXR1cm5zIHtIVE1MRWxlbWVudCB8IG51bGx9XG4gICAqL1xuICBjb25zdCBnZXRQb3B1cCA9ICgpID0+IGVsZW1lbnRCeUNsYXNzKHN3YWxDbGFzc2VzLnBvcHVwKTtcblxuICAvKipcbiAgICogQHJldHVybnMge0hUTUxFbGVtZW50IHwgbnVsbH1cbiAgICovXG4gIGNvbnN0IGdldEljb24gPSAoKSA9PiBlbGVtZW50QnlDbGFzcyhzd2FsQ2xhc3Nlcy5pY29uKTtcblxuICAvKipcbiAgICogQHJldHVybnMge0hUTUxFbGVtZW50IHwgbnVsbH1cbiAgICovXG4gIGNvbnN0IGdldEljb25Db250ZW50ID0gKCkgPT4gZWxlbWVudEJ5Q2xhc3Moc3dhbENsYXNzZXNbJ2ljb24tY29udGVudCddKTtcblxuICAvKipcbiAgICogQHJldHVybnMge0hUTUxFbGVtZW50IHwgbnVsbH1cbiAgICovXG4gIGNvbnN0IGdldFRpdGxlID0gKCkgPT4gZWxlbWVudEJ5Q2xhc3Moc3dhbENsYXNzZXMudGl0bGUpO1xuXG4gIC8qKlxuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnQgfCBudWxsfVxuICAgKi9cbiAgY29uc3QgZ2V0SHRtbENvbnRhaW5lciA9ICgpID0+IGVsZW1lbnRCeUNsYXNzKHN3YWxDbGFzc2VzWydodG1sLWNvbnRhaW5lciddKTtcblxuICAvKipcbiAgICogQHJldHVybnMge0hUTUxFbGVtZW50IHwgbnVsbH1cbiAgICovXG4gIGNvbnN0IGdldEltYWdlID0gKCkgPT4gZWxlbWVudEJ5Q2xhc3Moc3dhbENsYXNzZXMuaW1hZ2UpO1xuXG4gIC8qKlxuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnQgfCBudWxsfVxuICAgKi9cbiAgY29uc3QgZ2V0UHJvZ3Jlc3NTdGVwcyA9ICgpID0+IGVsZW1lbnRCeUNsYXNzKHN3YWxDbGFzc2VzWydwcm9ncmVzcy1zdGVwcyddKTtcblxuICAvKipcbiAgICogQHJldHVybnMge0hUTUxFbGVtZW50IHwgbnVsbH1cbiAgICovXG4gIGNvbnN0IGdldFZhbGlkYXRpb25NZXNzYWdlID0gKCkgPT4gZWxlbWVudEJ5Q2xhc3Moc3dhbENsYXNzZXNbJ3ZhbGlkYXRpb24tbWVzc2FnZSddKTtcblxuICAvKipcbiAgICogQHJldHVybnMge0hUTUxFbGVtZW50IHwgbnVsbH1cbiAgICovXG4gIGNvbnN0IGdldENvbmZpcm1CdXR0b24gPSAoKSA9PiBlbGVtZW50QnlTZWxlY3RvcihcIi5cIi5jb25jYXQoc3dhbENsYXNzZXMuYWN0aW9ucywgXCIgLlwiKS5jb25jYXQoc3dhbENsYXNzZXMuY29uZmlybSkpO1xuXG4gIC8qKlxuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnQgfCBudWxsfVxuICAgKi9cbiAgY29uc3QgZ2V0RGVueUJ1dHRvbiA9ICgpID0+IGVsZW1lbnRCeVNlbGVjdG9yKFwiLlwiLmNvbmNhdChzd2FsQ2xhc3Nlcy5hY3Rpb25zLCBcIiAuXCIpLmNvbmNhdChzd2FsQ2xhc3Nlcy5kZW55KSk7XG5cbiAgLyoqXG4gICAqIEByZXR1cm5zIHtIVE1MRWxlbWVudCB8IG51bGx9XG4gICAqL1xuICBjb25zdCBnZXRJbnB1dExhYmVsID0gKCkgPT4gZWxlbWVudEJ5Q2xhc3Moc3dhbENsYXNzZXNbJ2lucHV0LWxhYmVsJ10pO1xuXG4gIC8qKlxuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnQgfCBudWxsfVxuICAgKi9cbiAgY29uc3QgZ2V0TG9hZGVyID0gKCkgPT4gZWxlbWVudEJ5U2VsZWN0b3IoXCIuXCIuY29uY2F0KHN3YWxDbGFzc2VzLmxvYWRlcikpO1xuXG4gIC8qKlxuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnQgfCBudWxsfVxuICAgKi9cbiAgY29uc3QgZ2V0Q2FuY2VsQnV0dG9uID0gKCkgPT4gZWxlbWVudEJ5U2VsZWN0b3IoXCIuXCIuY29uY2F0KHN3YWxDbGFzc2VzLmFjdGlvbnMsIFwiIC5cIikuY29uY2F0KHN3YWxDbGFzc2VzLmNhbmNlbCkpO1xuXG4gIC8qKlxuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnQgfCBudWxsfVxuICAgKi9cbiAgY29uc3QgZ2V0QWN0aW9ucyA9ICgpID0+IGVsZW1lbnRCeUNsYXNzKHN3YWxDbGFzc2VzLmFjdGlvbnMpO1xuXG4gIC8qKlxuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnQgfCBudWxsfVxuICAgKi9cbiAgY29uc3QgZ2V0Rm9vdGVyID0gKCkgPT4gZWxlbWVudEJ5Q2xhc3Moc3dhbENsYXNzZXMuZm9vdGVyKTtcblxuICAvKipcbiAgICogQHJldHVybnMge0hUTUxFbGVtZW50IHwgbnVsbH1cbiAgICovXG4gIGNvbnN0IGdldFRpbWVyUHJvZ3Jlc3NCYXIgPSAoKSA9PiBlbGVtZW50QnlDbGFzcyhzd2FsQ2xhc3Nlc1sndGltZXItcHJvZ3Jlc3MtYmFyJ10pO1xuXG4gIC8qKlxuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnQgfCBudWxsfVxuICAgKi9cbiAgY29uc3QgZ2V0Q2xvc2VCdXR0b24gPSAoKSA9PiBlbGVtZW50QnlDbGFzcyhzd2FsQ2xhc3Nlcy5jbG9zZSk7XG5cbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2prdXAvZm9jdXNhYmxlL2Jsb2IvbWFzdGVyL2luZGV4LmpzXG4gIGNvbnN0IGZvY3VzYWJsZSA9IFwiXFxuICBhW2hyZWZdLFxcbiAgYXJlYVtocmVmXSxcXG4gIGlucHV0Om5vdChbZGlzYWJsZWRdKSxcXG4gIHNlbGVjdDpub3QoW2Rpc2FibGVkXSksXFxuICB0ZXh0YXJlYTpub3QoW2Rpc2FibGVkXSksXFxuICBidXR0b246bm90KFtkaXNhYmxlZF0pLFxcbiAgaWZyYW1lLFxcbiAgb2JqZWN0LFxcbiAgZW1iZWQsXFxuICBbdGFiaW5kZXg9XFxcIjBcXFwiXSxcXG4gIFtjb250ZW50ZWRpdGFibGVdLFxcbiAgYXVkaW9bY29udHJvbHNdLFxcbiAgdmlkZW9bY29udHJvbHNdLFxcbiAgc3VtbWFyeVxcblwiO1xuICAvKipcbiAgICogQHJldHVybnMge0hUTUxFbGVtZW50W119XG4gICAqL1xuICBjb25zdCBnZXRGb2N1c2FibGVFbGVtZW50cyA9ICgpID0+IHtcbiAgICBjb25zdCBmb2N1c2FibGVFbGVtZW50c1dpdGhUYWJpbmRleCA9IEFycmF5LmZyb20oZ2V0UG9wdXAoKS5xdWVyeVNlbGVjdG9yQWxsKCdbdGFiaW5kZXhdOm5vdChbdGFiaW5kZXg9XCItMVwiXSk6bm90KFt0YWJpbmRleD1cIjBcIl0pJykpXG4gICAgLy8gc29ydCBhY2NvcmRpbmcgdG8gdGFiaW5kZXhcbiAgICAuc29ydCgoYSwgYikgPT4ge1xuICAgICAgY29uc3QgdGFiaW5kZXhBID0gcGFyc2VJbnQoYS5nZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JykpO1xuICAgICAgY29uc3QgdGFiaW5kZXhCID0gcGFyc2VJbnQoYi5nZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JykpO1xuICAgICAgaWYgKHRhYmluZGV4QSA+IHRhYmluZGV4Qikge1xuICAgICAgICByZXR1cm4gMTtcbiAgICAgIH0gZWxzZSBpZiAodGFiaW5kZXhBIDwgdGFiaW5kZXhCKSB7XG4gICAgICAgIHJldHVybiAtMTtcbiAgICAgIH1cbiAgICAgIHJldHVybiAwO1xuICAgIH0pO1xuICAgIGNvbnN0IG90aGVyRm9jdXNhYmxlRWxlbWVudHMgPSBBcnJheS5mcm9tKGdldFBvcHVwKCkucXVlcnlTZWxlY3RvckFsbChmb2N1c2FibGUpKS5maWx0ZXIoZWwgPT4gZWwuZ2V0QXR0cmlidXRlKCd0YWJpbmRleCcpICE9PSAnLTEnKTtcbiAgICByZXR1cm4gdW5pcXVlQXJyYXkoZm9jdXNhYmxlRWxlbWVudHNXaXRoVGFiaW5kZXguY29uY2F0KG90aGVyRm9jdXNhYmxlRWxlbWVudHMpKS5maWx0ZXIoZWwgPT4gaXNWaXNpYmxlKGVsKSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgY29uc3QgaXNNb2RhbCA9ICgpID0+IHtcbiAgICByZXR1cm4gaGFzQ2xhc3MoZG9jdW1lbnQuYm9keSwgc3dhbENsYXNzZXMuc2hvd24pICYmICFoYXNDbGFzcyhkb2N1bWVudC5ib2R5LCBzd2FsQ2xhc3Nlc1sndG9hc3Qtc2hvd24nXSkgJiYgIWhhc0NsYXNzKGRvY3VtZW50LmJvZHksIHN3YWxDbGFzc2VzWyduby1iYWNrZHJvcCddKTtcbiAgfTtcblxuICAvKipcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuICBjb25zdCBpc1RvYXN0ID0gKCkgPT4ge1xuICAgIHJldHVybiBnZXRQb3B1cCgpICYmIGhhc0NsYXNzKGdldFBvcHVwKCksIHN3YWxDbGFzc2VzLnRvYXN0KTtcbiAgfTtcblxuICAvKipcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuICBjb25zdCBpc0xvYWRpbmcgPSAoKSA9PiB7XG4gICAgcmV0dXJuIGdldFBvcHVwKCkuaGFzQXR0cmlidXRlKCdkYXRhLWxvYWRpbmcnKTtcbiAgfTtcblxuICAvLyBSZW1lbWJlciBzdGF0ZSBpbiBjYXNlcyB3aGVyZSBvcGVuaW5nIGFuZCBoYW5kbGluZyBhIG1vZGFsIHdpbGwgZmlkZGxlIHdpdGggaXQuXG4gIGNvbnN0IHN0YXRlcyA9IHtcbiAgICBwcmV2aW91c0JvZHlQYWRkaW5nOiBudWxsXG4gIH07XG5cbiAgLyoqXG4gICAqIFNlY3VyZWx5IHNldCBpbm5lckhUTUwgb2YgYW4gZWxlbWVudFxuICAgKiBodHRwczovL2dpdGh1Yi5jb20vc3dlZXRhbGVydDIvc3dlZXRhbGVydDIvaXNzdWVzLzE5MjZcbiAgICpcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbVxuICAgKiBAcGFyYW0ge3N0cmluZ30gaHRtbFxuICAgKi9cbiAgY29uc3Qgc2V0SW5uZXJIdG1sID0gKGVsZW0sIGh0bWwpID0+IHtcbiAgICBlbGVtLnRleHRDb250ZW50ID0gJyc7XG4gICAgaWYgKGh0bWwpIHtcbiAgICAgIGNvbnN0IHBhcnNlciA9IG5ldyBET01QYXJzZXIoKTtcbiAgICAgIGNvbnN0IHBhcnNlZCA9IHBhcnNlci5wYXJzZUZyb21TdHJpbmcoaHRtbCwgXCJ0ZXh0L2h0bWxcIik7XG4gICAgICBBcnJheS5mcm9tKHBhcnNlZC5xdWVyeVNlbGVjdG9yKCdoZWFkJykuY2hpbGROb2RlcykuZm9yRWFjaChjaGlsZCA9PiB7XG4gICAgICAgIGVsZW0uYXBwZW5kQ2hpbGQoY2hpbGQpO1xuICAgICAgfSk7XG4gICAgICBBcnJheS5mcm9tKHBhcnNlZC5xdWVyeVNlbGVjdG9yKCdib2R5JykuY2hpbGROb2RlcykuZm9yRWFjaChjaGlsZCA9PiB7XG4gICAgICAgIGlmIChjaGlsZCBpbnN0YW5jZW9mIEhUTUxWaWRlb0VsZW1lbnQgfHwgY2hpbGQgaW5zdGFuY2VvZiBIVE1MQXVkaW9FbGVtZW50KSB7XG4gICAgICAgICAgZWxlbS5hcHBlbmRDaGlsZChjaGlsZC5jbG9uZU5vZGUodHJ1ZSkpOyAvLyBodHRwczovL2dpdGh1Yi5jb20vc3dlZXRhbGVydDIvc3dlZXRhbGVydDIvaXNzdWVzLzI1MDdcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlbGVtLmFwcGVuZENoaWxkKGNoaWxkKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjbGFzc05hbWVcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuICBjb25zdCBoYXNDbGFzcyA9IChlbGVtLCBjbGFzc05hbWUpID0+IHtcbiAgICBpZiAoIWNsYXNzTmFtZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBjb25zdCBjbGFzc0xpc3QgPSBjbGFzc05hbWUuc3BsaXQoL1xccysvKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNsYXNzTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKCFlbGVtLmNsYXNzTGlzdC5jb250YWlucyhjbGFzc0xpc3RbaV0pKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1cbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqL1xuICBjb25zdCByZW1vdmVDdXN0b21DbGFzc2VzID0gKGVsZW0sIHBhcmFtcykgPT4ge1xuICAgIEFycmF5LmZyb20oZWxlbS5jbGFzc0xpc3QpLmZvckVhY2goY2xhc3NOYW1lID0+IHtcbiAgICAgIGlmICghT2JqZWN0LnZhbHVlcyhzd2FsQ2xhc3NlcykuaW5jbHVkZXMoY2xhc3NOYW1lKSAmJiAhT2JqZWN0LnZhbHVlcyhpY29uVHlwZXMpLmluY2x1ZGVzKGNsYXNzTmFtZSkgJiYgIU9iamVjdC52YWx1ZXMocGFyYW1zLnNob3dDbGFzcykuaW5jbHVkZXMoY2xhc3NOYW1lKSkge1xuICAgICAgICBlbGVtLmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbVxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNsYXNzTmFtZVxuICAgKi9cbiAgY29uc3QgYXBwbHlDdXN0b21DbGFzcyA9IChlbGVtLCBwYXJhbXMsIGNsYXNzTmFtZSkgPT4ge1xuICAgIHJlbW92ZUN1c3RvbUNsYXNzZXMoZWxlbSwgcGFyYW1zKTtcbiAgICBpZiAocGFyYW1zLmN1c3RvbUNsYXNzICYmIHBhcmFtcy5jdXN0b21DbGFzc1tjbGFzc05hbWVdKSB7XG4gICAgICBpZiAodHlwZW9mIHBhcmFtcy5jdXN0b21DbGFzc1tjbGFzc05hbWVdICE9PSAnc3RyaW5nJyAmJiAhcGFyYW1zLmN1c3RvbUNsYXNzW2NsYXNzTmFtZV0uZm9yRWFjaCkge1xuICAgICAgICB3YXJuKFwiSW52YWxpZCB0eXBlIG9mIGN1c3RvbUNsYXNzLlwiLmNvbmNhdChjbGFzc05hbWUsIFwiISBFeHBlY3RlZCBzdHJpbmcgb3IgaXRlcmFibGUgb2JqZWN0LCBnb3QgXFxcIlwiKS5jb25jYXQodHlwZW9mIHBhcmFtcy5jdXN0b21DbGFzc1tjbGFzc05hbWVdLCBcIlxcXCJcIikpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBhZGRDbGFzcyhlbGVtLCBwYXJhbXMuY3VzdG9tQ2xhc3NbY2xhc3NOYW1lXSk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBwb3B1cFxuICAgKiBAcGFyYW0ge2ltcG9ydCgnLi9yZW5kZXJlcnMvcmVuZGVySW5wdXQnKS5JbnB1dENsYXNzfSBpbnB1dENsYXNzXG4gICAqIEByZXR1cm5zIHtIVE1MSW5wdXRFbGVtZW50IHwgbnVsbH1cbiAgICovXG4gIGNvbnN0IGdldElucHV0ID0gKHBvcHVwLCBpbnB1dENsYXNzKSA9PiB7XG4gICAgaWYgKCFpbnB1dENsYXNzKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgc3dpdGNoIChpbnB1dENsYXNzKSB7XG4gICAgICBjYXNlICdzZWxlY3QnOlxuICAgICAgY2FzZSAndGV4dGFyZWEnOlxuICAgICAgY2FzZSAnZmlsZSc6XG4gICAgICAgIHJldHVybiBwb3B1cC5xdWVyeVNlbGVjdG9yKFwiLlwiLmNvbmNhdChzd2FsQ2xhc3Nlcy5wb3B1cCwgXCIgPiAuXCIpLmNvbmNhdChzd2FsQ2xhc3Nlc1tpbnB1dENsYXNzXSkpO1xuICAgICAgY2FzZSAnY2hlY2tib3gnOlxuICAgICAgICByZXR1cm4gcG9wdXAucXVlcnlTZWxlY3RvcihcIi5cIi5jb25jYXQoc3dhbENsYXNzZXMucG9wdXAsIFwiID4gLlwiKS5jb25jYXQoc3dhbENsYXNzZXMuY2hlY2tib3gsIFwiIGlucHV0XCIpKTtcbiAgICAgIGNhc2UgJ3JhZGlvJzpcbiAgICAgICAgcmV0dXJuIHBvcHVwLnF1ZXJ5U2VsZWN0b3IoXCIuXCIuY29uY2F0KHN3YWxDbGFzc2VzLnBvcHVwLCBcIiA+IC5cIikuY29uY2F0KHN3YWxDbGFzc2VzLnJhZGlvLCBcIiBpbnB1dDpjaGVja2VkXCIpKSB8fCBwb3B1cC5xdWVyeVNlbGVjdG9yKFwiLlwiLmNvbmNhdChzd2FsQ2xhc3Nlcy5wb3B1cCwgXCIgPiAuXCIpLmNvbmNhdChzd2FsQ2xhc3Nlcy5yYWRpbywgXCIgaW5wdXQ6Zmlyc3QtY2hpbGRcIikpO1xuICAgICAgY2FzZSAncmFuZ2UnOlxuICAgICAgICByZXR1cm4gcG9wdXAucXVlcnlTZWxlY3RvcihcIi5cIi5jb25jYXQoc3dhbENsYXNzZXMucG9wdXAsIFwiID4gLlwiKS5jb25jYXQoc3dhbENsYXNzZXMucmFuZ2UsIFwiIGlucHV0XCIpKTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBwb3B1cC5xdWVyeVNlbGVjdG9yKFwiLlwiLmNvbmNhdChzd2FsQ2xhc3Nlcy5wb3B1cCwgXCIgPiAuXCIpLmNvbmNhdChzd2FsQ2xhc3Nlcy5pbnB1dCkpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtIVE1MSW5wdXRFbGVtZW50IHwgSFRNTFRleHRBcmVhRWxlbWVudCB8IEhUTUxTZWxlY3RFbGVtZW50fSBpbnB1dFxuICAgKi9cbiAgY29uc3QgZm9jdXNJbnB1dCA9IGlucHV0ID0+IHtcbiAgICBpbnB1dC5mb2N1cygpO1xuXG4gICAgLy8gcGxhY2UgY3Vyc29yIGF0IGVuZCBvZiB0ZXh0IGluIHRleHQgaW5wdXRcbiAgICBpZiAoaW5wdXQudHlwZSAhPT0gJ2ZpbGUnKSB7XG4gICAgICAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yMzQ1OTE1XG4gICAgICBjb25zdCB2YWwgPSBpbnB1dC52YWx1ZTtcbiAgICAgIGlucHV0LnZhbHVlID0gJyc7XG4gICAgICBpbnB1dC52YWx1ZSA9IHZhbDtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnQgfCBIVE1MRWxlbWVudFtdIHwgbnVsbH0gdGFyZ2V0XG4gICAqIEBwYXJhbSB7c3RyaW5nIHwgc3RyaW5nW10gfCByZWFkb25seSBzdHJpbmdbXX0gY2xhc3NMaXN0XG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gY29uZGl0aW9uXG4gICAqL1xuICBjb25zdCB0b2dnbGVDbGFzcyA9ICh0YXJnZXQsIGNsYXNzTGlzdCwgY29uZGl0aW9uKSA9PiB7XG4gICAgaWYgKCF0YXJnZXQgfHwgIWNsYXNzTGlzdCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIGNsYXNzTGlzdCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGNsYXNzTGlzdCA9IGNsYXNzTGlzdC5zcGxpdCgvXFxzKy8pLmZpbHRlcihCb29sZWFuKTtcbiAgICB9XG4gICAgY2xhc3NMaXN0LmZvckVhY2goY2xhc3NOYW1lID0+IHtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHRhcmdldCkpIHtcbiAgICAgICAgdGFyZ2V0LmZvckVhY2goZWxlbSA9PiB7XG4gICAgICAgICAgY29uZGl0aW9uID8gZWxlbS5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSkgOiBlbGVtLmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25kaXRpb24gPyB0YXJnZXQuY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpIDogdGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudCB8IEhUTUxFbGVtZW50W10gfCBudWxsfSB0YXJnZXRcbiAgICogQHBhcmFtIHtzdHJpbmcgfCBzdHJpbmdbXSB8IHJlYWRvbmx5IHN0cmluZ1tdfSBjbGFzc0xpc3RcbiAgICovXG4gIGNvbnN0IGFkZENsYXNzID0gKHRhcmdldCwgY2xhc3NMaXN0KSA9PiB7XG4gICAgdG9nZ2xlQ2xhc3ModGFyZ2V0LCBjbGFzc0xpc3QsIHRydWUpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50IHwgSFRNTEVsZW1lbnRbXSB8IG51bGx9IHRhcmdldFxuICAgKiBAcGFyYW0ge3N0cmluZyB8IHN0cmluZ1tdIHwgcmVhZG9ubHkgc3RyaW5nW119IGNsYXNzTGlzdFxuICAgKi9cbiAgY29uc3QgcmVtb3ZlQ2xhc3MgPSAodGFyZ2V0LCBjbGFzc0xpc3QpID0+IHtcbiAgICB0b2dnbGVDbGFzcyh0YXJnZXQsIGNsYXNzTGlzdCwgZmFsc2UpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBHZXQgZGlyZWN0IGNoaWxkIG9mIGFuIGVsZW1lbnQgYnkgY2xhc3MgbmFtZVxuICAgKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjbGFzc05hbWVcbiAgICogQHJldHVybnMge0hUTUxFbGVtZW50IHwgbnVsbH1cbiAgICovXG4gIGNvbnN0IGdldERpcmVjdENoaWxkQnlDbGFzcyA9IChlbGVtLCBjbGFzc05hbWUpID0+IHtcbiAgICBjb25zdCBjaGlsZHJlbiA9IEFycmF5LmZyb20oZWxlbS5jaGlsZHJlbik7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgY2hpbGQgPSBjaGlsZHJlbltpXTtcbiAgICAgIGlmIChjaGlsZCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50ICYmIGhhc0NsYXNzKGNoaWxkLCBjbGFzc05hbWUpKSB7XG4gICAgICAgIHJldHVybiBjaGlsZDtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1cbiAgICogQHBhcmFtIHtzdHJpbmd9IHByb3BlcnR5XG4gICAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAgICovXG4gIGNvbnN0IGFwcGx5TnVtZXJpY2FsU3R5bGUgPSAoZWxlbSwgcHJvcGVydHksIHZhbHVlKSA9PiB7XG4gICAgaWYgKHZhbHVlID09PSBcIlwiLmNvbmNhdChwYXJzZUludCh2YWx1ZSkpKSB7XG4gICAgICB2YWx1ZSA9IHBhcnNlSW50KHZhbHVlKTtcbiAgICB9XG4gICAgaWYgKHZhbHVlIHx8IHBhcnNlSW50KHZhbHVlKSA9PT0gMCkge1xuICAgICAgZWxlbS5zdHlsZVtwcm9wZXJ0eV0gPSB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInID8gXCJcIi5jb25jYXQodmFsdWUsIFwicHhcIikgOiB2YWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgZWxlbS5zdHlsZS5yZW1vdmVQcm9wZXJ0eShwcm9wZXJ0eSk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBkaXNwbGF5XG4gICAqL1xuICBjb25zdCBzaG93ID0gZnVuY3Rpb24gKGVsZW0pIHtcbiAgICBsZXQgZGlzcGxheSA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogJ2ZsZXgnO1xuICAgIGVsZW0uc3R5bGUuZGlzcGxheSA9IGRpc3BsYXk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1cbiAgICovXG4gIGNvbnN0IGhpZGUgPSBlbGVtID0+IHtcbiAgICBlbGVtLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHBhcmVudFxuICAgKiBAcGFyYW0ge3N0cmluZ30gc2VsZWN0b3JcbiAgICogQHBhcmFtIHtzdHJpbmd9IHByb3BlcnR5XG4gICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZVxuICAgKi9cbiAgY29uc3Qgc2V0U3R5bGUgPSAocGFyZW50LCBzZWxlY3RvciwgcHJvcGVydHksIHZhbHVlKSA9PiB7XG4gICAgLyoqIEB0eXBlIHtIVE1MRWxlbWVudH0gKi9cbiAgICBjb25zdCBlbCA9IHBhcmVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcbiAgICBpZiAoZWwpIHtcbiAgICAgIGVsLnN0eWxlW3Byb3BlcnR5XSA9IHZhbHVlO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbVxuICAgKiBAcGFyYW0ge2FueX0gY29uZGl0aW9uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBkaXNwbGF5XG4gICAqL1xuICBjb25zdCB0b2dnbGUgPSBmdW5jdGlvbiAoZWxlbSwgY29uZGl0aW9uKSB7XG4gICAgbGV0IGRpc3BsYXkgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6ICdmbGV4JztcbiAgICBjb25kaXRpb24gPyBzaG93KGVsZW0sIGRpc3BsYXkpIDogaGlkZShlbGVtKTtcbiAgfTtcblxuICAvKipcbiAgICogYm9ycm93ZWQgZnJvbSBqcXVlcnkgJChlbGVtKS5pcygnOnZpc2libGUnKSBpbXBsZW1lbnRhdGlvblxuICAgKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgY29uc3QgaXNWaXNpYmxlID0gZWxlbSA9PiAhIShlbGVtICYmIChlbGVtLm9mZnNldFdpZHRoIHx8IGVsZW0ub2Zmc2V0SGVpZ2h0IHx8IGVsZW0uZ2V0Q2xpZW50UmVjdHMoKS5sZW5ndGgpKTtcblxuICAvKipcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuICBjb25zdCBhbGxCdXR0b25zQXJlSGlkZGVuID0gKCkgPT4gIWlzVmlzaWJsZShnZXRDb25maXJtQnV0dG9uKCkpICYmICFpc1Zpc2libGUoZ2V0RGVueUJ1dHRvbigpKSAmJiAhaXNWaXNpYmxlKGdldENhbmNlbEJ1dHRvbigpKTtcblxuICAvKipcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbVxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG4gIGNvbnN0IGlzU2Nyb2xsYWJsZSA9IGVsZW0gPT4gISEoZWxlbS5zY3JvbGxIZWlnaHQgPiBlbGVtLmNsaWVudEhlaWdodCk7XG5cbiAgLyoqXG4gICAqIGJvcnJvd2VkIGZyb20gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzQ2MzUyMTE5XG4gICAqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1cbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuICBjb25zdCBoYXNDc3NBbmltYXRpb24gPSBlbGVtID0+IHtcbiAgICBjb25zdCBzdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW0pO1xuICAgIGNvbnN0IGFuaW1EdXJhdGlvbiA9IHBhcnNlRmxvYXQoc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZSgnYW5pbWF0aW9uLWR1cmF0aW9uJykgfHwgJzAnKTtcbiAgICBjb25zdCB0cmFuc0R1cmF0aW9uID0gcGFyc2VGbG9hdChzdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKCd0cmFuc2l0aW9uLWR1cmF0aW9uJykgfHwgJzAnKTtcbiAgICByZXR1cm4gYW5pbUR1cmF0aW9uID4gMCB8fCB0cmFuc0R1cmF0aW9uID4gMDtcbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtudW1iZXJ9IHRpbWVyXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gcmVzZXRcbiAgICovXG4gIGNvbnN0IGFuaW1hdGVUaW1lclByb2dyZXNzQmFyID0gZnVuY3Rpb24gKHRpbWVyKSB7XG4gICAgbGV0IHJlc2V0ID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBmYWxzZTtcbiAgICBjb25zdCB0aW1lclByb2dyZXNzQmFyID0gZ2V0VGltZXJQcm9ncmVzc0JhcigpO1xuICAgIGlmIChpc1Zpc2libGUodGltZXJQcm9ncmVzc0JhcikpIHtcbiAgICAgIGlmIChyZXNldCkge1xuICAgICAgICB0aW1lclByb2dyZXNzQmFyLnN0eWxlLnRyYW5zaXRpb24gPSAnbm9uZSc7XG4gICAgICAgIHRpbWVyUHJvZ3Jlc3NCYXIuc3R5bGUud2lkdGggPSAnMTAwJSc7XG4gICAgICB9XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGltZXJQcm9ncmVzc0Jhci5zdHlsZS50cmFuc2l0aW9uID0gXCJ3aWR0aCBcIi5jb25jYXQodGltZXIgLyAxMDAwLCBcInMgbGluZWFyXCIpO1xuICAgICAgICB0aW1lclByb2dyZXNzQmFyLnN0eWxlLndpZHRoID0gJzAlJztcbiAgICAgIH0sIDEwKTtcbiAgICB9XG4gIH07XG4gIGNvbnN0IHN0b3BUaW1lclByb2dyZXNzQmFyID0gKCkgPT4ge1xuICAgIGNvbnN0IHRpbWVyUHJvZ3Jlc3NCYXIgPSBnZXRUaW1lclByb2dyZXNzQmFyKCk7XG4gICAgY29uc3QgdGltZXJQcm9ncmVzc0JhcldpZHRoID0gcGFyc2VJbnQod2luZG93LmdldENvbXB1dGVkU3R5bGUodGltZXJQcm9ncmVzc0Jhcikud2lkdGgpO1xuICAgIHRpbWVyUHJvZ3Jlc3NCYXIuc3R5bGUucmVtb3ZlUHJvcGVydHkoJ3RyYW5zaXRpb24nKTtcbiAgICB0aW1lclByb2dyZXNzQmFyLnN0eWxlLndpZHRoID0gJzEwMCUnO1xuICAgIGNvbnN0IHRpbWVyUHJvZ3Jlc3NCYXJGdWxsV2lkdGggPSBwYXJzZUludCh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aW1lclByb2dyZXNzQmFyKS53aWR0aCk7XG4gICAgY29uc3QgdGltZXJQcm9ncmVzc0JhclBlcmNlbnQgPSB0aW1lclByb2dyZXNzQmFyV2lkdGggLyB0aW1lclByb2dyZXNzQmFyRnVsbFdpZHRoICogMTAwO1xuICAgIHRpbWVyUHJvZ3Jlc3NCYXIuc3R5bGUucmVtb3ZlUHJvcGVydHkoJ3RyYW5zaXRpb24nKTtcbiAgICB0aW1lclByb2dyZXNzQmFyLnN0eWxlLndpZHRoID0gXCJcIi5jb25jYXQodGltZXJQcm9ncmVzc0JhclBlcmNlbnQsIFwiJVwiKTtcbiAgfTtcblxuICBjb25zdCBSRVNUT1JFX0ZPQ1VTX1RJTUVPVVQgPSAxMDA7XG5cbiAgLyoqIEB0eXBlIHtHbG9iYWxTdGF0ZX0gKi9cbiAgY29uc3QgZ2xvYmFsU3RhdGUgPSB7fTtcbiAgY29uc3QgZm9jdXNQcmV2aW91c0FjdGl2ZUVsZW1lbnQgPSAoKSA9PiB7XG4gICAgaWYgKGdsb2JhbFN0YXRlLnByZXZpb3VzQWN0aXZlRWxlbWVudCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgICBnbG9iYWxTdGF0ZS5wcmV2aW91c0FjdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICAgIGdsb2JhbFN0YXRlLnByZXZpb3VzQWN0aXZlRWxlbWVudCA9IG51bGw7XG4gICAgfSBlbHNlIGlmIChkb2N1bWVudC5ib2R5KSB7XG4gICAgICBkb2N1bWVudC5ib2R5LmZvY3VzKCk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBSZXN0b3JlIHByZXZpb3VzIGFjdGl2ZSAoZm9jdXNlZCkgZWxlbWVudFxuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IHJldHVybkZvY3VzXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfVxuICAgKi9cbiAgY29uc3QgcmVzdG9yZUFjdGl2ZUVsZW1lbnQgPSByZXR1cm5Gb2N1cyA9PiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgaWYgKCFyZXR1cm5Gb2N1cykge1xuICAgICAgICByZXR1cm4gcmVzb2x2ZSgpO1xuICAgICAgfVxuICAgICAgY29uc3QgeCA9IHdpbmRvdy5zY3JvbGxYO1xuICAgICAgY29uc3QgeSA9IHdpbmRvdy5zY3JvbGxZO1xuICAgICAgZ2xvYmFsU3RhdGUucmVzdG9yZUZvY3VzVGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBmb2N1c1ByZXZpb3VzQWN0aXZlRWxlbWVudCgpO1xuICAgICAgICByZXNvbHZlKCk7XG4gICAgICB9LCBSRVNUT1JFX0ZPQ1VTX1RJTUVPVVQpOyAvLyBpc3N1ZXMvOTAwXG5cbiAgICAgIHdpbmRvdy5zY3JvbGxUbyh4LCB5KTtcbiAgICB9KTtcbiAgfTtcblxuICAvKipcbiAgICogRGV0ZWN0IE5vZGUgZW52XG4gICAqXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgY29uc3QgaXNOb2RlRW52ID0gKCkgPT4gdHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIGRvY3VtZW50ID09PSAndW5kZWZpbmVkJztcblxuICBjb25zdCBzd2VldEhUTUwgPSBcIlxcbiA8ZGl2IGFyaWEtbGFiZWxsZWRieT1cXFwiXCIuY29uY2F0KHN3YWxDbGFzc2VzLnRpdGxlLCBcIlxcXCIgYXJpYS1kZXNjcmliZWRieT1cXFwiXCIpLmNvbmNhdChzd2FsQ2xhc3Nlc1snaHRtbC1jb250YWluZXInXSwgXCJcXFwiIGNsYXNzPVxcXCJcIikuY29uY2F0KHN3YWxDbGFzc2VzLnBvcHVwLCBcIlxcXCIgdGFiaW5kZXg9XFxcIi0xXFxcIj5cXG4gICA8YnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgY2xhc3M9XFxcIlwiKS5jb25jYXQoc3dhbENsYXNzZXMuY2xvc2UsIFwiXFxcIj48L2J1dHRvbj5cXG4gICA8dWwgY2xhc3M9XFxcIlwiKS5jb25jYXQoc3dhbENsYXNzZXNbJ3Byb2dyZXNzLXN0ZXBzJ10sIFwiXFxcIj48L3VsPlxcbiAgIDxkaXYgY2xhc3M9XFxcIlwiKS5jb25jYXQoc3dhbENsYXNzZXMuaWNvbiwgXCJcXFwiPjwvZGl2PlxcbiAgIDxpbWcgY2xhc3M9XFxcIlwiKS5jb25jYXQoc3dhbENsYXNzZXMuaW1hZ2UsIFwiXFxcIiAvPlxcbiAgIDxoMiBjbGFzcz1cXFwiXCIpLmNvbmNhdChzd2FsQ2xhc3Nlcy50aXRsZSwgXCJcXFwiIGlkPVxcXCJcIikuY29uY2F0KHN3YWxDbGFzc2VzLnRpdGxlLCBcIlxcXCI+PC9oMj5cXG4gICA8ZGl2IGNsYXNzPVxcXCJcIikuY29uY2F0KHN3YWxDbGFzc2VzWydodG1sLWNvbnRhaW5lciddLCBcIlxcXCIgaWQ9XFxcIlwiKS5jb25jYXQoc3dhbENsYXNzZXNbJ2h0bWwtY29udGFpbmVyJ10sIFwiXFxcIj48L2Rpdj5cXG4gICA8aW5wdXQgY2xhc3M9XFxcIlwiKS5jb25jYXQoc3dhbENsYXNzZXMuaW5wdXQsIFwiXFxcIiAvPlxcbiAgIDxpbnB1dCB0eXBlPVxcXCJmaWxlXFxcIiBjbGFzcz1cXFwiXCIpLmNvbmNhdChzd2FsQ2xhc3Nlcy5maWxlLCBcIlxcXCIgLz5cXG4gICA8ZGl2IGNsYXNzPVxcXCJcIikuY29uY2F0KHN3YWxDbGFzc2VzLnJhbmdlLCBcIlxcXCI+XFxuICAgICA8aW5wdXQgdHlwZT1cXFwicmFuZ2VcXFwiIC8+XFxuICAgICA8b3V0cHV0Pjwvb3V0cHV0PlxcbiAgIDwvZGl2PlxcbiAgIDxzZWxlY3QgY2xhc3M9XFxcIlwiKS5jb25jYXQoc3dhbENsYXNzZXMuc2VsZWN0LCBcIlxcXCI+PC9zZWxlY3Q+XFxuICAgPGRpdiBjbGFzcz1cXFwiXCIpLmNvbmNhdChzd2FsQ2xhc3Nlcy5yYWRpbywgXCJcXFwiPjwvZGl2PlxcbiAgIDxsYWJlbCBmb3I9XFxcIlwiKS5jb25jYXQoc3dhbENsYXNzZXMuY2hlY2tib3gsIFwiXFxcIiBjbGFzcz1cXFwiXCIpLmNvbmNhdChzd2FsQ2xhc3Nlcy5jaGVja2JveCwgXCJcXFwiPlxcbiAgICAgPGlucHV0IHR5cGU9XFxcImNoZWNrYm94XFxcIiAvPlxcbiAgICAgPHNwYW4gY2xhc3M9XFxcIlwiKS5jb25jYXQoc3dhbENsYXNzZXMubGFiZWwsIFwiXFxcIj48L3NwYW4+XFxuICAgPC9sYWJlbD5cXG4gICA8dGV4dGFyZWEgY2xhc3M9XFxcIlwiKS5jb25jYXQoc3dhbENsYXNzZXMudGV4dGFyZWEsIFwiXFxcIj48L3RleHRhcmVhPlxcbiAgIDxkaXYgY2xhc3M9XFxcIlwiKS5jb25jYXQoc3dhbENsYXNzZXNbJ3ZhbGlkYXRpb24tbWVzc2FnZSddLCBcIlxcXCIgaWQ9XFxcIlwiKS5jb25jYXQoc3dhbENsYXNzZXNbJ3ZhbGlkYXRpb24tbWVzc2FnZSddLCBcIlxcXCI+PC9kaXY+XFxuICAgPGRpdiBjbGFzcz1cXFwiXCIpLmNvbmNhdChzd2FsQ2xhc3Nlcy5hY3Rpb25zLCBcIlxcXCI+XFxuICAgICA8ZGl2IGNsYXNzPVxcXCJcIikuY29uY2F0KHN3YWxDbGFzc2VzLmxvYWRlciwgXCJcXFwiPjwvZGl2PlxcbiAgICAgPGJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGNsYXNzPVxcXCJcIikuY29uY2F0KHN3YWxDbGFzc2VzLmNvbmZpcm0sIFwiXFxcIj48L2J1dHRvbj5cXG4gICAgIDxidXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBjbGFzcz1cXFwiXCIpLmNvbmNhdChzd2FsQ2xhc3Nlcy5kZW55LCBcIlxcXCI+PC9idXR0b24+XFxuICAgICA8YnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgY2xhc3M9XFxcIlwiKS5jb25jYXQoc3dhbENsYXNzZXMuY2FuY2VsLCBcIlxcXCI+PC9idXR0b24+XFxuICAgPC9kaXY+XFxuICAgPGRpdiBjbGFzcz1cXFwiXCIpLmNvbmNhdChzd2FsQ2xhc3Nlcy5mb290ZXIsIFwiXFxcIj48L2Rpdj5cXG4gICA8ZGl2IGNsYXNzPVxcXCJcIikuY29uY2F0KHN3YWxDbGFzc2VzWyd0aW1lci1wcm9ncmVzcy1iYXItY29udGFpbmVyJ10sIFwiXFxcIj5cXG4gICAgIDxkaXYgY2xhc3M9XFxcIlwiKS5jb25jYXQoc3dhbENsYXNzZXNbJ3RpbWVyLXByb2dyZXNzLWJhciddLCBcIlxcXCI+PC9kaXY+XFxuICAgPC9kaXY+XFxuIDwvZGl2PlxcblwiKS5yZXBsYWNlKC8oXnxcXG4pXFxzKi9nLCAnJyk7XG5cbiAgLyoqXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgY29uc3QgcmVzZXRPbGRDb250YWluZXIgPSAoKSA9PiB7XG4gICAgY29uc3Qgb2xkQ29udGFpbmVyID0gZ2V0Q29udGFpbmVyKCk7XG4gICAgaWYgKCFvbGRDb250YWluZXIpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgb2xkQ29udGFpbmVyLnJlbW92ZSgpO1xuICAgIHJlbW92ZUNsYXNzKFtkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsIGRvY3VtZW50LmJvZHldLCBbc3dhbENsYXNzZXNbJ25vLWJhY2tkcm9wJ10sIHN3YWxDbGFzc2VzWyd0b2FzdC1zaG93biddLCBzd2FsQ2xhc3Nlc1snaGFzLWNvbHVtbiddXSk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG4gIGNvbnN0IHJlc2V0VmFsaWRhdGlvbk1lc3NhZ2UgPSAoKSA9PiB7XG4gICAgZ2xvYmFsU3RhdGUuY3VycmVudEluc3RhbmNlLnJlc2V0VmFsaWRhdGlvbk1lc3NhZ2UoKTtcbiAgfTtcbiAgY29uc3QgYWRkSW5wdXRDaGFuZ2VMaXN0ZW5lcnMgPSAoKSA9PiB7XG4gICAgY29uc3QgcG9wdXAgPSBnZXRQb3B1cCgpO1xuICAgIGNvbnN0IGlucHV0ID0gZ2V0RGlyZWN0Q2hpbGRCeUNsYXNzKHBvcHVwLCBzd2FsQ2xhc3Nlcy5pbnB1dCk7XG4gICAgY29uc3QgZmlsZSA9IGdldERpcmVjdENoaWxkQnlDbGFzcyhwb3B1cCwgc3dhbENsYXNzZXMuZmlsZSk7XG4gICAgLyoqIEB0eXBlIHtIVE1MSW5wdXRFbGVtZW50fSAqL1xuICAgIGNvbnN0IHJhbmdlID0gcG9wdXAucXVlcnlTZWxlY3RvcihcIi5cIi5jb25jYXQoc3dhbENsYXNzZXMucmFuZ2UsIFwiIGlucHV0XCIpKTtcbiAgICAvKiogQHR5cGUge0hUTUxPdXRwdXRFbGVtZW50fSAqL1xuICAgIGNvbnN0IHJhbmdlT3V0cHV0ID0gcG9wdXAucXVlcnlTZWxlY3RvcihcIi5cIi5jb25jYXQoc3dhbENsYXNzZXMucmFuZ2UsIFwiIG91dHB1dFwiKSk7XG4gICAgY29uc3Qgc2VsZWN0ID0gZ2V0RGlyZWN0Q2hpbGRCeUNsYXNzKHBvcHVwLCBzd2FsQ2xhc3Nlcy5zZWxlY3QpO1xuICAgIC8qKiBAdHlwZSB7SFRNTElucHV0RWxlbWVudH0gKi9cbiAgICBjb25zdCBjaGVja2JveCA9IHBvcHVwLnF1ZXJ5U2VsZWN0b3IoXCIuXCIuY29uY2F0KHN3YWxDbGFzc2VzLmNoZWNrYm94LCBcIiBpbnB1dFwiKSk7XG4gICAgY29uc3QgdGV4dGFyZWEgPSBnZXREaXJlY3RDaGlsZEJ5Q2xhc3MocG9wdXAsIHN3YWxDbGFzc2VzLnRleHRhcmVhKTtcbiAgICBpbnB1dC5vbmlucHV0ID0gcmVzZXRWYWxpZGF0aW9uTWVzc2FnZTtcbiAgICBmaWxlLm9uY2hhbmdlID0gcmVzZXRWYWxpZGF0aW9uTWVzc2FnZTtcbiAgICBzZWxlY3Qub25jaGFuZ2UgPSByZXNldFZhbGlkYXRpb25NZXNzYWdlO1xuICAgIGNoZWNrYm94Lm9uY2hhbmdlID0gcmVzZXRWYWxpZGF0aW9uTWVzc2FnZTtcbiAgICB0ZXh0YXJlYS5vbmlucHV0ID0gcmVzZXRWYWxpZGF0aW9uTWVzc2FnZTtcbiAgICByYW5nZS5vbmlucHV0ID0gKCkgPT4ge1xuICAgICAgcmVzZXRWYWxpZGF0aW9uTWVzc2FnZSgpO1xuICAgICAgcmFuZ2VPdXRwdXQudmFsdWUgPSByYW5nZS52YWx1ZTtcbiAgICB9O1xuICAgIHJhbmdlLm9uY2hhbmdlID0gKCkgPT4ge1xuICAgICAgcmVzZXRWYWxpZGF0aW9uTWVzc2FnZSgpO1xuICAgICAgcmFuZ2VPdXRwdXQudmFsdWUgPSByYW5nZS52YWx1ZTtcbiAgICB9O1xuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZyB8IEhUTUxFbGVtZW50fSB0YXJnZXRcbiAgICogQHJldHVybnMge0hUTUxFbGVtZW50fVxuICAgKi9cbiAgY29uc3QgZ2V0VGFyZ2V0ID0gdGFyZ2V0ID0+IHR5cGVvZiB0YXJnZXQgPT09ICdzdHJpbmcnID8gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpIDogdGFyZ2V0O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICovXG4gIGNvbnN0IHNldHVwQWNjZXNzaWJpbGl0eSA9IHBhcmFtcyA9PiB7XG4gICAgY29uc3QgcG9wdXAgPSBnZXRQb3B1cCgpO1xuICAgIHBvcHVwLnNldEF0dHJpYnV0ZSgncm9sZScsIHBhcmFtcy50b2FzdCA/ICdhbGVydCcgOiAnZGlhbG9nJyk7XG4gICAgcG9wdXAuc2V0QXR0cmlidXRlKCdhcmlhLWxpdmUnLCBwYXJhbXMudG9hc3QgPyAncG9saXRlJyA6ICdhc3NlcnRpdmUnKTtcbiAgICBpZiAoIXBhcmFtcy50b2FzdCkge1xuICAgICAgcG9wdXAuc2V0QXR0cmlidXRlKCdhcmlhLW1vZGFsJywgJ3RydWUnKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHRhcmdldEVsZW1lbnRcbiAgICovXG4gIGNvbnN0IHNldHVwUlRMID0gdGFyZ2V0RWxlbWVudCA9PiB7XG4gICAgaWYgKHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHRhcmdldEVsZW1lbnQpLmRpcmVjdGlvbiA9PT0gJ3J0bCcpIHtcbiAgICAgIGFkZENsYXNzKGdldENvbnRhaW5lcigpLCBzd2FsQ2xhc3Nlcy5ydGwpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogQWRkIG1vZGFsICsgYmFja2Ryb3AgKyBuby13YXIgbWVzc2FnZSBmb3IgUnVzc2lhbnMgdG8gRE9NXG4gICAqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKi9cbiAgY29uc3QgaW5pdCA9IHBhcmFtcyA9PiB7XG4gICAgLy8gQ2xlYW4gdXAgdGhlIG9sZCBwb3B1cCBjb250YWluZXIgaWYgaXQgZXhpc3RzXG4gICAgY29uc3Qgb2xkQ29udGFpbmVyRXhpc3RlZCA9IHJlc2V0T2xkQ29udGFpbmVyKCk7XG5cbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICBpZiAoaXNOb2RlRW52KCkpIHtcbiAgICAgIGVycm9yKCdTd2VldEFsZXJ0MiByZXF1aXJlcyBkb2N1bWVudCB0byBpbml0aWFsaXplJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGNvbnRhaW5lci5jbGFzc05hbWUgPSBzd2FsQ2xhc3Nlcy5jb250YWluZXI7XG4gICAgaWYgKG9sZENvbnRhaW5lckV4aXN0ZWQpIHtcbiAgICAgIGFkZENsYXNzKGNvbnRhaW5lciwgc3dhbENsYXNzZXNbJ25vLXRyYW5zaXRpb24nXSk7XG4gICAgfVxuICAgIHNldElubmVySHRtbChjb250YWluZXIsIHN3ZWV0SFRNTCk7XG4gICAgY29uc3QgdGFyZ2V0RWxlbWVudCA9IGdldFRhcmdldChwYXJhbXMudGFyZ2V0KTtcbiAgICB0YXJnZXRFbGVtZW50LmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XG4gICAgc2V0dXBBY2Nlc3NpYmlsaXR5KHBhcmFtcyk7XG4gICAgc2V0dXBSVEwodGFyZ2V0RWxlbWVudCk7XG4gICAgYWRkSW5wdXRDaGFuZ2VMaXN0ZW5lcnMoKTtcbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudCB8IG9iamVjdCB8IHN0cmluZ30gcGFyYW1cbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gdGFyZ2V0XG4gICAqL1xuICBjb25zdCBwYXJzZUh0bWxUb0NvbnRhaW5lciA9IChwYXJhbSwgdGFyZ2V0KSA9PiB7XG4gICAgLy8gRE9NIGVsZW1lbnRcbiAgICBpZiAocGFyYW0gaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgdGFyZ2V0LmFwcGVuZENoaWxkKHBhcmFtKTtcbiAgICB9XG5cbiAgICAvLyBPYmplY3RcbiAgICBlbHNlIGlmICh0eXBlb2YgcGFyYW0gPT09ICdvYmplY3QnKSB7XG4gICAgICBoYW5kbGVPYmplY3QocGFyYW0sIHRhcmdldCk7XG4gICAgfVxuXG4gICAgLy8gUGxhaW4gc3RyaW5nXG4gICAgZWxzZSBpZiAocGFyYW0pIHtcbiAgICAgIHNldElubmVySHRtbCh0YXJnZXQsIHBhcmFtKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBwYXJhbVxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSB0YXJnZXRcbiAgICovXG4gIGNvbnN0IGhhbmRsZU9iamVjdCA9IChwYXJhbSwgdGFyZ2V0KSA9PiB7XG4gICAgLy8gSlF1ZXJ5IGVsZW1lbnQocylcbiAgICBpZiAocGFyYW0uanF1ZXJ5KSB7XG4gICAgICBoYW5kbGVKcXVlcnlFbGVtKHRhcmdldCwgcGFyYW0pO1xuICAgIH1cblxuICAgIC8vIEZvciBvdGhlciBvYmplY3RzIHVzZSB0aGVpciBzdHJpbmcgcmVwcmVzZW50YXRpb25cbiAgICBlbHNlIHtcbiAgICAgIHNldElubmVySHRtbCh0YXJnZXQsIHBhcmFtLnRvU3RyaW5nKCkpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gdGFyZ2V0XG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1cbiAgICovXG4gIGNvbnN0IGhhbmRsZUpxdWVyeUVsZW0gPSAodGFyZ2V0LCBlbGVtKSA9PiB7XG4gICAgdGFyZ2V0LnRleHRDb250ZW50ID0gJyc7XG4gICAgaWYgKDAgaW4gZWxlbSkge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IChpIGluIGVsZW0pOyBpKyspIHtcbiAgICAgICAgdGFyZ2V0LmFwcGVuZENoaWxkKGVsZW1baV0uY2xvbmVOb2RlKHRydWUpKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGFyZ2V0LmFwcGVuZENoaWxkKGVsZW0uY2xvbmVOb2RlKHRydWUpKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIEByZXR1cm5zIHsnd2Via2l0QW5pbWF0aW9uRW5kJyB8ICdhbmltYXRpb25lbmQnIHwgZmFsc2V9XG4gICAqL1xuICBjb25zdCBhbmltYXRpb25FbmRFdmVudCA9ICgoKSA9PiB7XG4gICAgLy8gUHJldmVudCBydW4gaW4gTm9kZSBlbnZcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICBpZiAoaXNOb2RlRW52KCkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgY29uc3QgdGVzdEVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgY29uc3QgdHJhbnNFbmRFdmVudE5hbWVzID0ge1xuICAgICAgV2Via2l0QW5pbWF0aW9uOiAnd2Via2l0QW5pbWF0aW9uRW5kJyxcbiAgICAgIC8vIENocm9tZSwgU2FmYXJpIGFuZCBPcGVyYVxuICAgICAgYW5pbWF0aW9uOiAnYW5pbWF0aW9uZW5kJyAvLyBTdGFuZGFyZCBzeW50YXhcbiAgICB9O1xuXG4gICAgZm9yIChjb25zdCBpIGluIHRyYW5zRW5kRXZlbnROYW1lcykge1xuICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0cmFuc0VuZEV2ZW50TmFtZXMsIGkpICYmIHR5cGVvZiB0ZXN0RWwuc3R5bGVbaV0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHJldHVybiB0cmFuc0VuZEV2ZW50TmFtZXNbaV07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfSkoKTtcblxuICAvKipcbiAgICogTWVhc3VyZSBzY3JvbGxiYXIgd2lkdGggZm9yIHBhZGRpbmcgYm9keSBkdXJpbmcgbW9kYWwgc2hvdy9oaWRlXG4gICAqIGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21hc3Rlci9qcy9zcmMvbW9kYWwuanNcbiAgICpcbiAgICogQHJldHVybnMge251bWJlcn1cbiAgICovXG4gIGNvbnN0IG1lYXN1cmVTY3JvbGxiYXIgPSAoKSA9PiB7XG4gICAgY29uc3Qgc2Nyb2xsRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgc2Nyb2xsRGl2LmNsYXNzTmFtZSA9IHN3YWxDbGFzc2VzWydzY3JvbGxiYXItbWVhc3VyZSddO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc2Nyb2xsRGl2KTtcbiAgICBjb25zdCBzY3JvbGxiYXJXaWR0aCA9IHNjcm9sbERpdi5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCAtIHNjcm9sbERpdi5jbGllbnRXaWR0aDtcbiAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHNjcm9sbERpdik7XG4gICAgcmV0dXJuIHNjcm9sbGJhcldpZHRoO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnQyfSBpbnN0YW5jZVxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICovXG4gIGNvbnN0IHJlbmRlckFjdGlvbnMgPSAoaW5zdGFuY2UsIHBhcmFtcykgPT4ge1xuICAgIGNvbnN0IGFjdGlvbnMgPSBnZXRBY3Rpb25zKCk7XG4gICAgY29uc3QgbG9hZGVyID0gZ2V0TG9hZGVyKCk7XG5cbiAgICAvLyBBY3Rpb25zIChidXR0b25zKSB3cmFwcGVyXG4gICAgaWYgKCFwYXJhbXMuc2hvd0NvbmZpcm1CdXR0b24gJiYgIXBhcmFtcy5zaG93RGVueUJ1dHRvbiAmJiAhcGFyYW1zLnNob3dDYW5jZWxCdXR0b24pIHtcbiAgICAgIGhpZGUoYWN0aW9ucyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNob3coYWN0aW9ucyk7XG4gICAgfVxuXG4gICAgLy8gQ3VzdG9tIGNsYXNzXG4gICAgYXBwbHlDdXN0b21DbGFzcyhhY3Rpb25zLCBwYXJhbXMsICdhY3Rpb25zJyk7XG5cbiAgICAvLyBSZW5kZXIgYWxsIHRoZSBidXR0b25zXG4gICAgcmVuZGVyQnV0dG9ucyhhY3Rpb25zLCBsb2FkZXIsIHBhcmFtcyk7XG5cbiAgICAvLyBMb2FkZXJcbiAgICBzZXRJbm5lckh0bWwobG9hZGVyLCBwYXJhbXMubG9hZGVySHRtbCk7XG4gICAgYXBwbHlDdXN0b21DbGFzcyhsb2FkZXIsIHBhcmFtcywgJ2xvYWRlcicpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBhY3Rpb25zXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGxvYWRlclxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICovXG4gIGZ1bmN0aW9uIHJlbmRlckJ1dHRvbnMoYWN0aW9ucywgbG9hZGVyLCBwYXJhbXMpIHtcbiAgICBjb25zdCBjb25maXJtQnV0dG9uID0gZ2V0Q29uZmlybUJ1dHRvbigpO1xuICAgIGNvbnN0IGRlbnlCdXR0b24gPSBnZXREZW55QnV0dG9uKCk7XG4gICAgY29uc3QgY2FuY2VsQnV0dG9uID0gZ2V0Q2FuY2VsQnV0dG9uKCk7XG5cbiAgICAvLyBSZW5kZXIgYnV0dG9uc1xuICAgIHJlbmRlckJ1dHRvbihjb25maXJtQnV0dG9uLCAnY29uZmlybScsIHBhcmFtcyk7XG4gICAgcmVuZGVyQnV0dG9uKGRlbnlCdXR0b24sICdkZW55JywgcGFyYW1zKTtcbiAgICByZW5kZXJCdXR0b24oY2FuY2VsQnV0dG9uLCAnY2FuY2VsJywgcGFyYW1zKTtcbiAgICBoYW5kbGVCdXR0b25zU3R5bGluZyhjb25maXJtQnV0dG9uLCBkZW55QnV0dG9uLCBjYW5jZWxCdXR0b24sIHBhcmFtcyk7XG4gICAgaWYgKHBhcmFtcy5yZXZlcnNlQnV0dG9ucykge1xuICAgICAgaWYgKHBhcmFtcy50b2FzdCkge1xuICAgICAgICBhY3Rpb25zLmluc2VydEJlZm9yZShjYW5jZWxCdXR0b24sIGNvbmZpcm1CdXR0b24pO1xuICAgICAgICBhY3Rpb25zLmluc2VydEJlZm9yZShkZW55QnV0dG9uLCBjb25maXJtQnV0dG9uKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFjdGlvbnMuaW5zZXJ0QmVmb3JlKGNhbmNlbEJ1dHRvbiwgbG9hZGVyKTtcbiAgICAgICAgYWN0aW9ucy5pbnNlcnRCZWZvcmUoZGVueUJ1dHRvbiwgbG9hZGVyKTtcbiAgICAgICAgYWN0aW9ucy5pbnNlcnRCZWZvcmUoY29uZmlybUJ1dHRvbiwgbG9hZGVyKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gY29uZmlybUJ1dHRvblxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBkZW55QnV0dG9uXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGNhbmNlbEJ1dHRvblxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICovXG4gIGZ1bmN0aW9uIGhhbmRsZUJ1dHRvbnNTdHlsaW5nKGNvbmZpcm1CdXR0b24sIGRlbnlCdXR0b24sIGNhbmNlbEJ1dHRvbiwgcGFyYW1zKSB7XG4gICAgaWYgKCFwYXJhbXMuYnV0dG9uc1N0eWxpbmcpIHtcbiAgICAgIHJlbW92ZUNsYXNzKFtjb25maXJtQnV0dG9uLCBkZW55QnV0dG9uLCBjYW5jZWxCdXR0b25dLCBzd2FsQ2xhc3Nlcy5zdHlsZWQpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBhZGRDbGFzcyhbY29uZmlybUJ1dHRvbiwgZGVueUJ1dHRvbiwgY2FuY2VsQnV0dG9uXSwgc3dhbENsYXNzZXMuc3R5bGVkKTtcblxuICAgIC8vIEJ1dHRvbnMgYmFja2dyb3VuZCBjb2xvcnNcbiAgICBpZiAocGFyYW1zLmNvbmZpcm1CdXR0b25Db2xvcikge1xuICAgICAgY29uZmlybUJ1dHRvbi5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBwYXJhbXMuY29uZmlybUJ1dHRvbkNvbG9yO1xuICAgICAgYWRkQ2xhc3MoY29uZmlybUJ1dHRvbiwgc3dhbENsYXNzZXNbJ2RlZmF1bHQtb3V0bGluZSddKTtcbiAgICB9XG4gICAgaWYgKHBhcmFtcy5kZW55QnV0dG9uQ29sb3IpIHtcbiAgICAgIGRlbnlCdXR0b24uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gcGFyYW1zLmRlbnlCdXR0b25Db2xvcjtcbiAgICAgIGFkZENsYXNzKGRlbnlCdXR0b24sIHN3YWxDbGFzc2VzWydkZWZhdWx0LW91dGxpbmUnXSk7XG4gICAgfVxuICAgIGlmIChwYXJhbXMuY2FuY2VsQnV0dG9uQ29sb3IpIHtcbiAgICAgIGNhbmNlbEJ1dHRvbi5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBwYXJhbXMuY2FuY2VsQnV0dG9uQ29sb3I7XG4gICAgICBhZGRDbGFzcyhjYW5jZWxCdXR0b24sIHN3YWxDbGFzc2VzWydkZWZhdWx0LW91dGxpbmUnXSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGJ1dHRvblxuICAgKiBAcGFyYW0geydjb25maXJtJyB8ICdkZW55JyB8ICdjYW5jZWwnfSBidXR0b25UeXBlXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKi9cbiAgZnVuY3Rpb24gcmVuZGVyQnV0dG9uKGJ1dHRvbiwgYnV0dG9uVHlwZSwgcGFyYW1zKSB7XG4gICAgdG9nZ2xlKGJ1dHRvbiwgcGFyYW1zW1wic2hvd1wiLmNvbmNhdChjYXBpdGFsaXplRmlyc3RMZXR0ZXIoYnV0dG9uVHlwZSksIFwiQnV0dG9uXCIpXSwgJ2lubGluZS1ibG9jaycpO1xuICAgIHNldElubmVySHRtbChidXR0b24sIHBhcmFtc1tcIlwiLmNvbmNhdChidXR0b25UeXBlLCBcIkJ1dHRvblRleHRcIildKTsgLy8gU2V0IGNhcHRpb24gdGV4dFxuICAgIGJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCBwYXJhbXNbXCJcIi5jb25jYXQoYnV0dG9uVHlwZSwgXCJCdXR0b25BcmlhTGFiZWxcIildKTsgLy8gQVJJQSBsYWJlbFxuXG4gICAgLy8gQWRkIGJ1dHRvbnMgY3VzdG9tIGNsYXNzZXNcbiAgICBidXR0b24uY2xhc3NOYW1lID0gc3dhbENsYXNzZXNbYnV0dG9uVHlwZV07XG4gICAgYXBwbHlDdXN0b21DbGFzcyhidXR0b24sIHBhcmFtcywgXCJcIi5jb25jYXQoYnV0dG9uVHlwZSwgXCJCdXR0b25cIikpO1xuICAgIGFkZENsYXNzKGJ1dHRvbiwgcGFyYW1zW1wiXCIuY29uY2F0KGJ1dHRvblR5cGUsIFwiQnV0dG9uQ2xhc3NcIildKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnQyfSBpbnN0YW5jZVxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICovXG4gIGNvbnN0IHJlbmRlckNsb3NlQnV0dG9uID0gKGluc3RhbmNlLCBwYXJhbXMpID0+IHtcbiAgICBjb25zdCBjbG9zZUJ1dHRvbiA9IGdldENsb3NlQnV0dG9uKCk7XG4gICAgc2V0SW5uZXJIdG1sKGNsb3NlQnV0dG9uLCBwYXJhbXMuY2xvc2VCdXR0b25IdG1sKTtcblxuICAgIC8vIEN1c3RvbSBjbGFzc1xuICAgIGFwcGx5Q3VzdG9tQ2xhc3MoY2xvc2VCdXR0b24sIHBhcmFtcywgJ2Nsb3NlQnV0dG9uJyk7XG4gICAgdG9nZ2xlKGNsb3NlQnV0dG9uLCBwYXJhbXMuc2hvd0Nsb3NlQnV0dG9uKTtcbiAgICBjbG9zZUJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCBwYXJhbXMuY2xvc2VCdXR0b25BcmlhTGFiZWwpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnQyfSBpbnN0YW5jZVxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICovXG4gIGNvbnN0IHJlbmRlckNvbnRhaW5lciA9IChpbnN0YW5jZSwgcGFyYW1zKSA9PiB7XG4gICAgY29uc3QgY29udGFpbmVyID0gZ2V0Q29udGFpbmVyKCk7XG4gICAgaWYgKCFjb250YWluZXIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaGFuZGxlQmFja2Ryb3BQYXJhbShjb250YWluZXIsIHBhcmFtcy5iYWNrZHJvcCk7XG4gICAgaGFuZGxlUG9zaXRpb25QYXJhbShjb250YWluZXIsIHBhcmFtcy5wb3NpdGlvbik7XG4gICAgaGFuZGxlR3Jvd1BhcmFtKGNvbnRhaW5lciwgcGFyYW1zLmdyb3cpO1xuXG4gICAgLy8gQ3VzdG9tIGNsYXNzXG4gICAgYXBwbHlDdXN0b21DbGFzcyhjb250YWluZXIsIHBhcmFtcywgJ2NvbnRhaW5lcicpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBjb250YWluZXJcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc1snYmFja2Ryb3AnXX0gYmFja2Ryb3BcbiAgICovXG4gIGZ1bmN0aW9uIGhhbmRsZUJhY2tkcm9wUGFyYW0oY29udGFpbmVyLCBiYWNrZHJvcCkge1xuICAgIGlmICh0eXBlb2YgYmFja2Ryb3AgPT09ICdzdHJpbmcnKSB7XG4gICAgICBjb250YWluZXIuc3R5bGUuYmFja2dyb3VuZCA9IGJhY2tkcm9wO1xuICAgIH0gZWxzZSBpZiAoIWJhY2tkcm9wKSB7XG4gICAgICBhZGRDbGFzcyhbZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LCBkb2N1bWVudC5ib2R5XSwgc3dhbENsYXNzZXNbJ25vLWJhY2tkcm9wJ10pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBjb250YWluZXJcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc1sncG9zaXRpb24nXX0gcG9zaXRpb25cbiAgICovXG4gIGZ1bmN0aW9uIGhhbmRsZVBvc2l0aW9uUGFyYW0oY29udGFpbmVyLCBwb3NpdGlvbikge1xuICAgIGlmIChwb3NpdGlvbiBpbiBzd2FsQ2xhc3Nlcykge1xuICAgICAgYWRkQ2xhc3MoY29udGFpbmVyLCBzd2FsQ2xhc3Nlc1twb3NpdGlvbl0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB3YXJuKCdUaGUgXCJwb3NpdGlvblwiIHBhcmFtZXRlciBpcyBub3QgdmFsaWQsIGRlZmF1bHRpbmcgdG8gXCJjZW50ZXJcIicpO1xuICAgICAgYWRkQ2xhc3MoY29udGFpbmVyLCBzd2FsQ2xhc3Nlcy5jZW50ZXIpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBjb250YWluZXJcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc1snZ3JvdyddfSBncm93XG4gICAqL1xuICBmdW5jdGlvbiBoYW5kbGVHcm93UGFyYW0oY29udGFpbmVyLCBncm93KSB7XG4gICAgaWYgKGdyb3cgJiYgdHlwZW9mIGdyb3cgPT09ICdzdHJpbmcnKSB7XG4gICAgICBjb25zdCBncm93Q2xhc3MgPSBcImdyb3ctXCIuY29uY2F0KGdyb3cpO1xuICAgICAgaWYgKGdyb3dDbGFzcyBpbiBzd2FsQ2xhc3Nlcykge1xuICAgICAgICBhZGRDbGFzcyhjb250YWluZXIsIHN3YWxDbGFzc2VzW2dyb3dDbGFzc10pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi8uLi8uLi9zd2VldGFsZXJ0Mi5kLnRzXCIvPlxuXG4gIC8qKiBAdHlwZSB7SW5wdXRDbGFzc1tdfSAqL1xuICBjb25zdCBpbnB1dENsYXNzZXMgPSBbJ2lucHV0JywgJ2ZpbGUnLCAncmFuZ2UnLCAnc2VsZWN0JywgJ3JhZGlvJywgJ2NoZWNrYm94JywgJ3RleHRhcmVhJ107XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydDJ9IGluc3RhbmNlXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKi9cbiAgY29uc3QgcmVuZGVySW5wdXQgPSAoaW5zdGFuY2UsIHBhcmFtcykgPT4ge1xuICAgIGNvbnN0IHBvcHVwID0gZ2V0UG9wdXAoKTtcbiAgICBjb25zdCBpbm5lclBhcmFtcyA9IHByaXZhdGVQcm9wcy5pbm5lclBhcmFtcy5nZXQoaW5zdGFuY2UpO1xuICAgIGNvbnN0IHJlcmVuZGVyID0gIWlubmVyUGFyYW1zIHx8IHBhcmFtcy5pbnB1dCAhPT0gaW5uZXJQYXJhbXMuaW5wdXQ7XG4gICAgaW5wdXRDbGFzc2VzLmZvckVhY2goaW5wdXRDbGFzcyA9PiB7XG4gICAgICBjb25zdCBpbnB1dENvbnRhaW5lciA9IGdldERpcmVjdENoaWxkQnlDbGFzcyhwb3B1cCwgc3dhbENsYXNzZXNbaW5wdXRDbGFzc10pO1xuXG4gICAgICAvLyBzZXQgYXR0cmlidXRlc1xuICAgICAgc2V0QXR0cmlidXRlcyhpbnB1dENsYXNzLCBwYXJhbXMuaW5wdXRBdHRyaWJ1dGVzKTtcblxuICAgICAgLy8gc2V0IGNsYXNzXG4gICAgICBpbnB1dENvbnRhaW5lci5jbGFzc05hbWUgPSBzd2FsQ2xhc3Nlc1tpbnB1dENsYXNzXTtcbiAgICAgIGlmIChyZXJlbmRlcikge1xuICAgICAgICBoaWRlKGlucHV0Q29udGFpbmVyKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAocGFyYW1zLmlucHV0KSB7XG4gICAgICBpZiAocmVyZW5kZXIpIHtcbiAgICAgICAgc2hvd0lucHV0KHBhcmFtcyk7XG4gICAgICB9XG4gICAgICAvLyBzZXQgY3VzdG9tIGNsYXNzXG4gICAgICBzZXRDdXN0b21DbGFzcyhwYXJhbXMpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqL1xuICBjb25zdCBzaG93SW5wdXQgPSBwYXJhbXMgPT4ge1xuICAgIGlmICghcmVuZGVySW5wdXRUeXBlW3BhcmFtcy5pbnB1dF0pIHtcbiAgICAgIGVycm9yKFwiVW5leHBlY3RlZCB0eXBlIG9mIGlucHV0ISBFeHBlY3RlZCBcXFwidGV4dFxcXCIsIFxcXCJlbWFpbFxcXCIsIFxcXCJwYXNzd29yZFxcXCIsIFxcXCJudW1iZXJcXFwiLCBcXFwidGVsXFxcIiwgXFxcInNlbGVjdFxcXCIsIFxcXCJyYWRpb1xcXCIsIFxcXCJjaGVja2JveFxcXCIsIFxcXCJ0ZXh0YXJlYVxcXCIsIFxcXCJmaWxlXFxcIiBvciBcXFwidXJsXFxcIiwgZ290IFxcXCJcIi5jb25jYXQocGFyYW1zLmlucHV0LCBcIlxcXCJcIikpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBpbnB1dENvbnRhaW5lciA9IGdldElucHV0Q29udGFpbmVyKHBhcmFtcy5pbnB1dCk7XG4gICAgY29uc3QgaW5wdXQgPSByZW5kZXJJbnB1dFR5cGVbcGFyYW1zLmlucHV0XShpbnB1dENvbnRhaW5lciwgcGFyYW1zKTtcbiAgICBzaG93KGlucHV0Q29udGFpbmVyKTtcblxuICAgIC8vIGlucHV0IGF1dG9mb2N1c1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgZm9jdXNJbnB1dChpbnB1dCk7XG4gICAgfSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTElucHV0RWxlbWVudH0gaW5wdXRcbiAgICovXG4gIGNvbnN0IHJlbW92ZUF0dHJpYnV0ZXMgPSBpbnB1dCA9PiB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbnB1dC5hdHRyaWJ1dGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBhdHRyTmFtZSA9IGlucHV0LmF0dHJpYnV0ZXNbaV0ubmFtZTtcbiAgICAgIGlmICghWyd0eXBlJywgJ3ZhbHVlJywgJ3N0eWxlJ10uaW5jbHVkZXMoYXR0ck5hbWUpKSB7XG4gICAgICAgIGlucHV0LnJlbW92ZUF0dHJpYnV0ZShhdHRyTmFtZSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0lucHV0Q2xhc3N9IGlucHV0Q2xhc3NcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc1snaW5wdXRBdHRyaWJ1dGVzJ119IGlucHV0QXR0cmlidXRlc1xuICAgKi9cbiAgY29uc3Qgc2V0QXR0cmlidXRlcyA9IChpbnB1dENsYXNzLCBpbnB1dEF0dHJpYnV0ZXMpID0+IHtcbiAgICBjb25zdCBpbnB1dCA9IGdldElucHV0KGdldFBvcHVwKCksIGlucHV0Q2xhc3MpO1xuICAgIGlmICghaW5wdXQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcmVtb3ZlQXR0cmlidXRlcyhpbnB1dCk7XG4gICAgZm9yIChjb25zdCBhdHRyIGluIGlucHV0QXR0cmlidXRlcykge1xuICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKGF0dHIsIGlucHV0QXR0cmlidXRlc1thdHRyXSk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICovXG4gIGNvbnN0IHNldEN1c3RvbUNsYXNzID0gcGFyYW1zID0+IHtcbiAgICBjb25zdCBpbnB1dENvbnRhaW5lciA9IGdldElucHV0Q29udGFpbmVyKHBhcmFtcy5pbnB1dCk7XG4gICAgaWYgKHR5cGVvZiBwYXJhbXMuY3VzdG9tQ2xhc3MgPT09ICdvYmplY3QnKSB7XG4gICAgICBhZGRDbGFzcyhpbnB1dENvbnRhaW5lciwgcGFyYW1zLmN1c3RvbUNsYXNzLmlucHV0KTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTElucHV0RWxlbWVudCB8IEhUTUxUZXh0QXJlYUVsZW1lbnR9IGlucHV0XG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKi9cbiAgY29uc3Qgc2V0SW5wdXRQbGFjZWhvbGRlciA9IChpbnB1dCwgcGFyYW1zKSA9PiB7XG4gICAgaWYgKCFpbnB1dC5wbGFjZWhvbGRlciB8fCBwYXJhbXMuaW5wdXRQbGFjZWhvbGRlcikge1xuICAgICAgaW5wdXQucGxhY2Vob2xkZXIgPSBwYXJhbXMuaW5wdXRQbGFjZWhvbGRlcjtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7SW5wdXR9IGlucHV0XG4gICAqIEBwYXJhbSB7SW5wdXR9IHByZXBlbmRUb1xuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICovXG4gIGNvbnN0IHNldElucHV0TGFiZWwgPSAoaW5wdXQsIHByZXBlbmRUbywgcGFyYW1zKSA9PiB7XG4gICAgaWYgKHBhcmFtcy5pbnB1dExhYmVsKSB7XG4gICAgICBpbnB1dC5pZCA9IHN3YWxDbGFzc2VzLmlucHV0O1xuICAgICAgY29uc3QgbGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xuICAgICAgY29uc3QgbGFiZWxDbGFzcyA9IHN3YWxDbGFzc2VzWydpbnB1dC1sYWJlbCddO1xuICAgICAgbGFiZWwuc2V0QXR0cmlidXRlKCdmb3InLCBpbnB1dC5pZCk7XG4gICAgICBsYWJlbC5jbGFzc05hbWUgPSBsYWJlbENsYXNzO1xuICAgICAgaWYgKHR5cGVvZiBwYXJhbXMuY3VzdG9tQ2xhc3MgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIGFkZENsYXNzKGxhYmVsLCBwYXJhbXMuY3VzdG9tQ2xhc3MuaW5wdXRMYWJlbCk7XG4gICAgICB9XG4gICAgICBsYWJlbC5pbm5lclRleHQgPSBwYXJhbXMuaW5wdXRMYWJlbDtcbiAgICAgIHByZXBlbmRUby5pbnNlcnRBZGphY2VudEVsZW1lbnQoJ2JlZm9yZWJlZ2luJywgbGFiZWwpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc1snaW5wdXQnXX0gaW5wdXRUeXBlXG4gICAqIEByZXR1cm5zIHtIVE1MRWxlbWVudH1cbiAgICovXG4gIGNvbnN0IGdldElucHV0Q29udGFpbmVyID0gaW5wdXRUeXBlID0+IHtcbiAgICByZXR1cm4gZ2V0RGlyZWN0Q2hpbGRCeUNsYXNzKGdldFBvcHVwKCksIHN3YWxDbGFzc2VzW2lucHV0VHlwZV0gfHwgc3dhbENsYXNzZXMuaW5wdXQpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxJbnB1dEVsZW1lbnQgfCBIVE1MT3V0cHV0RWxlbWVudCB8IEhUTUxUZXh0QXJlYUVsZW1lbnR9IGlucHV0XG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnNbJ2lucHV0VmFsdWUnXX0gaW5wdXRWYWx1ZVxuICAgKi9cbiAgY29uc3QgY2hlY2tBbmRTZXRJbnB1dFZhbHVlID0gKGlucHV0LCBpbnB1dFZhbHVlKSA9PiB7XG4gICAgaWYgKFsnc3RyaW5nJywgJ251bWJlciddLmluY2x1ZGVzKHR5cGVvZiBpbnB1dFZhbHVlKSkge1xuICAgICAgaW5wdXQudmFsdWUgPSBcIlwiLmNvbmNhdChpbnB1dFZhbHVlKTtcbiAgICB9IGVsc2UgaWYgKCFpc1Byb21pc2UoaW5wdXRWYWx1ZSkpIHtcbiAgICAgIHdhcm4oXCJVbmV4cGVjdGVkIHR5cGUgb2YgaW5wdXRWYWx1ZSEgRXhwZWN0ZWQgXFxcInN0cmluZ1xcXCIsIFxcXCJudW1iZXJcXFwiIG9yIFxcXCJQcm9taXNlXFxcIiwgZ290IFxcXCJcIi5jb25jYXQodHlwZW9mIGlucHV0VmFsdWUsIFwiXFxcIlwiKSk7XG4gICAgfVxuICB9O1xuXG4gIC8qKiBAdHlwZSB7UmVjb3JkPHN0cmluZywgKGlucHV0OiBJbnB1dCB8IEhUTUxFbGVtZW50LCBwYXJhbXM6IFN3ZWV0QWxlcnRPcHRpb25zKSA9PiBJbnB1dD59ICovXG4gIGNvbnN0IHJlbmRlcklucHV0VHlwZSA9IHt9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxJbnB1dEVsZW1lbnR9IGlucHV0XG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKiBAcmV0dXJucyB7SFRNTElucHV0RWxlbWVudH1cbiAgICovXG4gIHJlbmRlcklucHV0VHlwZS50ZXh0ID0gcmVuZGVySW5wdXRUeXBlLmVtYWlsID0gcmVuZGVySW5wdXRUeXBlLnBhc3N3b3JkID0gcmVuZGVySW5wdXRUeXBlLm51bWJlciA9IHJlbmRlcklucHV0VHlwZS50ZWwgPSByZW5kZXJJbnB1dFR5cGUudXJsID0gKGlucHV0LCBwYXJhbXMpID0+IHtcbiAgICBjaGVja0FuZFNldElucHV0VmFsdWUoaW5wdXQsIHBhcmFtcy5pbnB1dFZhbHVlKTtcbiAgICBzZXRJbnB1dExhYmVsKGlucHV0LCBpbnB1dCwgcGFyYW1zKTtcbiAgICBzZXRJbnB1dFBsYWNlaG9sZGVyKGlucHV0LCBwYXJhbXMpO1xuICAgIGlucHV0LnR5cGUgPSBwYXJhbXMuaW5wdXQ7XG4gICAgcmV0dXJuIGlucHV0O1xuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxJbnB1dEVsZW1lbnR9IGlucHV0XG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKiBAcmV0dXJucyB7SFRNTElucHV0RWxlbWVudH1cbiAgICovXG4gIHJlbmRlcklucHV0VHlwZS5maWxlID0gKGlucHV0LCBwYXJhbXMpID0+IHtcbiAgICBzZXRJbnB1dExhYmVsKGlucHV0LCBpbnB1dCwgcGFyYW1zKTtcbiAgICBzZXRJbnB1dFBsYWNlaG9sZGVyKGlucHV0LCBwYXJhbXMpO1xuICAgIHJldHVybiBpbnB1dDtcbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtIVE1MSW5wdXRFbGVtZW50fSByYW5nZVxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICogQHJldHVybnMge0hUTUxJbnB1dEVsZW1lbnR9XG4gICAqL1xuICByZW5kZXJJbnB1dFR5cGUucmFuZ2UgPSAocmFuZ2UsIHBhcmFtcykgPT4ge1xuICAgIGNvbnN0IHJhbmdlSW5wdXQgPSByYW5nZS5xdWVyeVNlbGVjdG9yKCdpbnB1dCcpO1xuICAgIGNvbnN0IHJhbmdlT3V0cHV0ID0gcmFuZ2UucXVlcnlTZWxlY3Rvcignb3V0cHV0Jyk7XG4gICAgY2hlY2tBbmRTZXRJbnB1dFZhbHVlKHJhbmdlSW5wdXQsIHBhcmFtcy5pbnB1dFZhbHVlKTtcbiAgICByYW5nZUlucHV0LnR5cGUgPSBwYXJhbXMuaW5wdXQ7XG4gICAgY2hlY2tBbmRTZXRJbnB1dFZhbHVlKHJhbmdlT3V0cHV0LCBwYXJhbXMuaW5wdXRWYWx1ZSk7XG4gICAgc2V0SW5wdXRMYWJlbChyYW5nZUlucHV0LCByYW5nZSwgcGFyYW1zKTtcbiAgICByZXR1cm4gcmFuZ2U7XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTFNlbGVjdEVsZW1lbnR9IHNlbGVjdFxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICogQHJldHVybnMge0hUTUxTZWxlY3RFbGVtZW50fVxuICAgKi9cbiAgcmVuZGVySW5wdXRUeXBlLnNlbGVjdCA9IChzZWxlY3QsIHBhcmFtcykgPT4ge1xuICAgIHNlbGVjdC50ZXh0Q29udGVudCA9ICcnO1xuICAgIGlmIChwYXJhbXMuaW5wdXRQbGFjZWhvbGRlcikge1xuICAgICAgY29uc3QgcGxhY2Vob2xkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcbiAgICAgIHNldElubmVySHRtbChwbGFjZWhvbGRlciwgcGFyYW1zLmlucHV0UGxhY2Vob2xkZXIpO1xuICAgICAgcGxhY2Vob2xkZXIudmFsdWUgPSAnJztcbiAgICAgIHBsYWNlaG9sZGVyLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgIHBsYWNlaG9sZGVyLnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgIHNlbGVjdC5hcHBlbmRDaGlsZChwbGFjZWhvbGRlcik7XG4gICAgfVxuICAgIHNldElucHV0TGFiZWwoc2VsZWN0LCBzZWxlY3QsIHBhcmFtcyk7XG4gICAgcmV0dXJuIHNlbGVjdDtcbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtIVE1MSW5wdXRFbGVtZW50fSByYWRpb1xuICAgKiBAcmV0dXJucyB7SFRNTElucHV0RWxlbWVudH1cbiAgICovXG4gIHJlbmRlcklucHV0VHlwZS5yYWRpbyA9IHJhZGlvID0+IHtcbiAgICByYWRpby50ZXh0Q29udGVudCA9ICcnO1xuICAgIHJldHVybiByYWRpbztcbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtIVE1MTGFiZWxFbGVtZW50fSBjaGVja2JveENvbnRhaW5lclxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICogQHJldHVybnMge0hUTUxJbnB1dEVsZW1lbnR9XG4gICAqL1xuICByZW5kZXJJbnB1dFR5cGUuY2hlY2tib3ggPSAoY2hlY2tib3hDb250YWluZXIsIHBhcmFtcykgPT4ge1xuICAgIGNvbnN0IGNoZWNrYm94ID0gZ2V0SW5wdXQoZ2V0UG9wdXAoKSwgJ2NoZWNrYm94Jyk7XG4gICAgY2hlY2tib3gudmFsdWUgPSAnMSc7XG4gICAgY2hlY2tib3guaWQgPSBzd2FsQ2xhc3Nlcy5jaGVja2JveDtcbiAgICBjaGVja2JveC5jaGVja2VkID0gQm9vbGVhbihwYXJhbXMuaW5wdXRWYWx1ZSk7XG4gICAgY29uc3QgbGFiZWwgPSBjaGVja2JveENvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdzcGFuJyk7XG4gICAgc2V0SW5uZXJIdG1sKGxhYmVsLCBwYXJhbXMuaW5wdXRQbGFjZWhvbGRlcik7XG4gICAgcmV0dXJuIGNoZWNrYm94O1xuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxUZXh0QXJlYUVsZW1lbnR9IHRleHRhcmVhXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKiBAcmV0dXJucyB7SFRNTFRleHRBcmVhRWxlbWVudH1cbiAgICovXG4gIHJlbmRlcklucHV0VHlwZS50ZXh0YXJlYSA9ICh0ZXh0YXJlYSwgcGFyYW1zKSA9PiB7XG4gICAgY2hlY2tBbmRTZXRJbnB1dFZhbHVlKHRleHRhcmVhLCBwYXJhbXMuaW5wdXRWYWx1ZSk7XG4gICAgc2V0SW5wdXRQbGFjZWhvbGRlcih0ZXh0YXJlYSwgcGFyYW1zKTtcbiAgICBzZXRJbnB1dExhYmVsKHRleHRhcmVhLCB0ZXh0YXJlYSwgcGFyYW1zKTtcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsXG4gICAgICogQHJldHVybnMge251bWJlcn1cbiAgICAgKi9cbiAgICBjb25zdCBnZXRNYXJnaW4gPSBlbCA9PiBwYXJzZUludCh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbCkubWFyZ2luTGVmdCkgKyBwYXJzZUludCh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbCkubWFyZ2luUmlnaHQpO1xuXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3N3ZWV0YWxlcnQyL3N3ZWV0YWxlcnQyL2lzc3Vlcy8yMjkxXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vc3dlZXRhbGVydDIvc3dlZXRhbGVydDIvaXNzdWVzLzE2OTlcbiAgICAgIGlmICgnTXV0YXRpb25PYnNlcnZlcicgaW4gd2luZG93KSB7XG4gICAgICAgIGNvbnN0IGluaXRpYWxQb3B1cFdpZHRoID0gcGFyc2VJbnQod2luZG93LmdldENvbXB1dGVkU3R5bGUoZ2V0UG9wdXAoKSkud2lkdGgpO1xuICAgICAgICBjb25zdCB0ZXh0YXJlYVJlc2l6ZUhhbmRsZXIgPSAoKSA9PiB7XG4gICAgICAgICAgY29uc3QgdGV4dGFyZWFXaWR0aCA9IHRleHRhcmVhLm9mZnNldFdpZHRoICsgZ2V0TWFyZ2luKHRleHRhcmVhKTtcbiAgICAgICAgICBpZiAodGV4dGFyZWFXaWR0aCA+IGluaXRpYWxQb3B1cFdpZHRoKSB7XG4gICAgICAgICAgICBnZXRQb3B1cCgpLnN0eWxlLndpZHRoID0gXCJcIi5jb25jYXQodGV4dGFyZWFXaWR0aCwgXCJweFwiKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZ2V0UG9wdXAoKS5zdHlsZS53aWR0aCA9IG51bGw7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBuZXcgTXV0YXRpb25PYnNlcnZlcih0ZXh0YXJlYVJlc2l6ZUhhbmRsZXIpLm9ic2VydmUodGV4dGFyZWEsIHtcbiAgICAgICAgICBhdHRyaWJ1dGVzOiB0cnVlLFxuICAgICAgICAgIGF0dHJpYnV0ZUZpbHRlcjogWydzdHlsZSddXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiB0ZXh0YXJlYTtcbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0Mn0gaW5zdGFuY2VcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqL1xuICBjb25zdCByZW5kZXJDb250ZW50ID0gKGluc3RhbmNlLCBwYXJhbXMpID0+IHtcbiAgICBjb25zdCBodG1sQ29udGFpbmVyID0gZ2V0SHRtbENvbnRhaW5lcigpO1xuICAgIGFwcGx5Q3VzdG9tQ2xhc3MoaHRtbENvbnRhaW5lciwgcGFyYW1zLCAnaHRtbENvbnRhaW5lcicpO1xuXG4gICAgLy8gQ29udGVudCBhcyBIVE1MXG4gICAgaWYgKHBhcmFtcy5odG1sKSB7XG4gICAgICBwYXJzZUh0bWxUb0NvbnRhaW5lcihwYXJhbXMuaHRtbCwgaHRtbENvbnRhaW5lcik7XG4gICAgICBzaG93KGh0bWxDb250YWluZXIsICdibG9jaycpO1xuICAgIH1cblxuICAgIC8vIENvbnRlbnQgYXMgcGxhaW4gdGV4dFxuICAgIGVsc2UgaWYgKHBhcmFtcy50ZXh0KSB7XG4gICAgICBodG1sQ29udGFpbmVyLnRleHRDb250ZW50ID0gcGFyYW1zLnRleHQ7XG4gICAgICBzaG93KGh0bWxDb250YWluZXIsICdibG9jaycpO1xuICAgIH1cblxuICAgIC8vIE5vIGNvbnRlbnRcbiAgICBlbHNlIHtcbiAgICAgIGhpZGUoaHRtbENvbnRhaW5lcik7XG4gICAgfVxuICAgIHJlbmRlcklucHV0KGluc3RhbmNlLCBwYXJhbXMpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnQyfSBpbnN0YW5jZVxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICovXG4gIGNvbnN0IHJlbmRlckZvb3RlciA9IChpbnN0YW5jZSwgcGFyYW1zKSA9PiB7XG4gICAgY29uc3QgZm9vdGVyID0gZ2V0Rm9vdGVyKCk7XG4gICAgdG9nZ2xlKGZvb3RlciwgcGFyYW1zLmZvb3Rlcik7XG4gICAgaWYgKHBhcmFtcy5mb290ZXIpIHtcbiAgICAgIHBhcnNlSHRtbFRvQ29udGFpbmVyKHBhcmFtcy5mb290ZXIsIGZvb3Rlcik7XG4gICAgfVxuXG4gICAgLy8gQ3VzdG9tIGNsYXNzXG4gICAgYXBwbHlDdXN0b21DbGFzcyhmb290ZXIsIHBhcmFtcywgJ2Zvb3RlcicpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnQyfSBpbnN0YW5jZVxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICovXG4gIGNvbnN0IHJlbmRlckljb24gPSAoaW5zdGFuY2UsIHBhcmFtcykgPT4ge1xuICAgIGNvbnN0IGlubmVyUGFyYW1zID0gcHJpdmF0ZVByb3BzLmlubmVyUGFyYW1zLmdldChpbnN0YW5jZSk7XG4gICAgY29uc3QgaWNvbiA9IGdldEljb24oKTtcblxuICAgIC8vIGlmIHRoZSBnaXZlbiBpY29uIGFscmVhZHkgcmVuZGVyZWQsIGFwcGx5IHRoZSBzdHlsaW5nIHdpdGhvdXQgcmUtcmVuZGVyaW5nIHRoZSBpY29uXG4gICAgaWYgKGlubmVyUGFyYW1zICYmIHBhcmFtcy5pY29uID09PSBpbm5lclBhcmFtcy5pY29uKSB7XG4gICAgICAvLyBDdXN0b20gb3IgZGVmYXVsdCBjb250ZW50XG4gICAgICBzZXRDb250ZW50KGljb24sIHBhcmFtcyk7XG4gICAgICBhcHBseVN0eWxlcyhpY29uLCBwYXJhbXMpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIXBhcmFtcy5pY29uICYmICFwYXJhbXMuaWNvbkh0bWwpIHtcbiAgICAgIGhpZGUoaWNvbik7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChwYXJhbXMuaWNvbiAmJiBPYmplY3Qua2V5cyhpY29uVHlwZXMpLmluZGV4T2YocGFyYW1zLmljb24pID09PSAtMSkge1xuICAgICAgZXJyb3IoXCJVbmtub3duIGljb24hIEV4cGVjdGVkIFxcXCJzdWNjZXNzXFxcIiwgXFxcImVycm9yXFxcIiwgXFxcIndhcm5pbmdcXFwiLCBcXFwiaW5mb1xcXCIgb3IgXFxcInF1ZXN0aW9uXFxcIiwgZ290IFxcXCJcIi5jb25jYXQocGFyYW1zLmljb24sIFwiXFxcIlwiKSk7XG4gICAgICBoaWRlKGljb24pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBzaG93KGljb24pO1xuXG4gICAgLy8gQ3VzdG9tIG9yIGRlZmF1bHQgY29udGVudFxuICAgIHNldENvbnRlbnQoaWNvbiwgcGFyYW1zKTtcbiAgICBhcHBseVN0eWxlcyhpY29uLCBwYXJhbXMpO1xuXG4gICAgLy8gQW5pbWF0ZSBpY29uXG4gICAgYWRkQ2xhc3MoaWNvbiwgcGFyYW1zLnNob3dDbGFzcy5pY29uKTtcbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gaWNvblxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICovXG4gIGNvbnN0IGFwcGx5U3R5bGVzID0gKGljb24sIHBhcmFtcykgPT4ge1xuICAgIGZvciAoY29uc3QgaWNvblR5cGUgaW4gaWNvblR5cGVzKSB7XG4gICAgICBpZiAocGFyYW1zLmljb24gIT09IGljb25UeXBlKSB7XG4gICAgICAgIHJlbW92ZUNsYXNzKGljb24sIGljb25UeXBlc1tpY29uVHlwZV0pO1xuICAgICAgfVxuICAgIH1cbiAgICBhZGRDbGFzcyhpY29uLCBpY29uVHlwZXNbcGFyYW1zLmljb25dKTtcblxuICAgIC8vIEljb24gY29sb3JcbiAgICBzZXRDb2xvcihpY29uLCBwYXJhbXMpO1xuXG4gICAgLy8gU3VjY2VzcyBpY29uIGJhY2tncm91bmQgY29sb3JcbiAgICBhZGp1c3RTdWNjZXNzSWNvbkJhY2tncm91bmRDb2xvcigpO1xuXG4gICAgLy8gQ3VzdG9tIGNsYXNzXG4gICAgYXBwbHlDdXN0b21DbGFzcyhpY29uLCBwYXJhbXMsICdpY29uJyk7XG4gIH07XG5cbiAgLy8gQWRqdXN0IHN1Y2Nlc3MgaWNvbiBiYWNrZ3JvdW5kIGNvbG9yIHRvIG1hdGNoIHRoZSBwb3B1cCBiYWNrZ3JvdW5kIGNvbG9yXG4gIGNvbnN0IGFkanVzdFN1Y2Nlc3NJY29uQmFja2dyb3VuZENvbG9yID0gKCkgPT4ge1xuICAgIGNvbnN0IHBvcHVwID0gZ2V0UG9wdXAoKTtcbiAgICBjb25zdCBwb3B1cEJhY2tncm91bmRDb2xvciA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHBvcHVwKS5nZXRQcm9wZXJ0eVZhbHVlKCdiYWNrZ3JvdW5kLWNvbG9yJyk7XG4gICAgLyoqIEB0eXBlIHtOb2RlTGlzdE9mPEhUTUxFbGVtZW50Pn0gKi9cbiAgICBjb25zdCBzdWNjZXNzSWNvblBhcnRzID0gcG9wdXAucXVlcnlTZWxlY3RvckFsbCgnW2NsYXNzXj1zd2FsMi1zdWNjZXNzLWNpcmN1bGFyLWxpbmVdLCAuc3dhbDItc3VjY2Vzcy1maXgnKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN1Y2Nlc3NJY29uUGFydHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHN1Y2Nlc3NJY29uUGFydHNbaV0uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gcG9wdXBCYWNrZ3JvdW5kQ29sb3I7XG4gICAgfVxuICB9O1xuICBjb25zdCBzdWNjZXNzSWNvbkh0bWwgPSBcIlxcbiAgPGRpdiBjbGFzcz1cXFwic3dhbDItc3VjY2Vzcy1jaXJjdWxhci1saW5lLWxlZnRcXFwiPjwvZGl2PlxcbiAgPHNwYW4gY2xhc3M9XFxcInN3YWwyLXN1Y2Nlc3MtbGluZS10aXBcXFwiPjwvc3Bhbj4gPHNwYW4gY2xhc3M9XFxcInN3YWwyLXN1Y2Nlc3MtbGluZS1sb25nXFxcIj48L3NwYW4+XFxuICA8ZGl2IGNsYXNzPVxcXCJzd2FsMi1zdWNjZXNzLXJpbmdcXFwiPjwvZGl2PiA8ZGl2IGNsYXNzPVxcXCJzd2FsMi1zdWNjZXNzLWZpeFxcXCI+PC9kaXY+XFxuICA8ZGl2IGNsYXNzPVxcXCJzd2FsMi1zdWNjZXNzLWNpcmN1bGFyLWxpbmUtcmlnaHRcXFwiPjwvZGl2PlxcblwiO1xuICBjb25zdCBlcnJvckljb25IdG1sID0gXCJcXG4gIDxzcGFuIGNsYXNzPVxcXCJzd2FsMi14LW1hcmtcXFwiPlxcbiAgICA8c3BhbiBjbGFzcz1cXFwic3dhbDIteC1tYXJrLWxpbmUtbGVmdFxcXCI+PC9zcGFuPlxcbiAgICA8c3BhbiBjbGFzcz1cXFwic3dhbDIteC1tYXJrLWxpbmUtcmlnaHRcXFwiPjwvc3Bhbj5cXG4gIDwvc3Bhbj5cXG5cIjtcblxuICAvKipcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gaWNvblxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICovXG4gIGNvbnN0IHNldENvbnRlbnQgPSAoaWNvbiwgcGFyYW1zKSA9PiB7XG4gICAgbGV0IG9sZENvbnRlbnQgPSBpY29uLmlubmVySFRNTDtcbiAgICBsZXQgbmV3Q29udGVudDtcbiAgICBpZiAocGFyYW1zLmljb25IdG1sKSB7XG4gICAgICBuZXdDb250ZW50ID0gaWNvbkNvbnRlbnQocGFyYW1zLmljb25IdG1sKTtcbiAgICB9IGVsc2UgaWYgKHBhcmFtcy5pY29uID09PSAnc3VjY2VzcycpIHtcbiAgICAgIG5ld0NvbnRlbnQgPSBzdWNjZXNzSWNvbkh0bWw7XG4gICAgICBvbGRDb250ZW50ID0gb2xkQ29udGVudC5yZXBsYWNlKC8gc3R5bGU9XCIuKj9cIi9nLCAnJyk7IC8vIHVuZG8gYWRqdXN0U3VjY2Vzc0ljb25CYWNrZ3JvdW5kQ29sb3IoKVxuICAgIH0gZWxzZSBpZiAocGFyYW1zLmljb24gPT09ICdlcnJvcicpIHtcbiAgICAgIG5ld0NvbnRlbnQgPSBlcnJvckljb25IdG1sO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBkZWZhdWx0SWNvbkh0bWwgPSB7XG4gICAgICAgIHF1ZXN0aW9uOiAnPycsXG4gICAgICAgIHdhcm5pbmc6ICchJyxcbiAgICAgICAgaW5mbzogJ2knXG4gICAgICB9O1xuICAgICAgbmV3Q29udGVudCA9IGljb25Db250ZW50KGRlZmF1bHRJY29uSHRtbFtwYXJhbXMuaWNvbl0pO1xuICAgIH1cbiAgICBpZiAob2xkQ29udGVudC50cmltKCkgIT09IG5ld0NvbnRlbnQudHJpbSgpKSB7XG4gICAgICBzZXRJbm5lckh0bWwoaWNvbiwgbmV3Q29udGVudCk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBpY29uXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKi9cbiAgY29uc3Qgc2V0Q29sb3IgPSAoaWNvbiwgcGFyYW1zKSA9PiB7XG4gICAgaWYgKCFwYXJhbXMuaWNvbkNvbG9yKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGljb24uc3R5bGUuY29sb3IgPSBwYXJhbXMuaWNvbkNvbG9yO1xuICAgIGljb24uc3R5bGUuYm9yZGVyQ29sb3IgPSBwYXJhbXMuaWNvbkNvbG9yO1xuICAgIGZvciAoY29uc3Qgc2VsIG9mIFsnLnN3YWwyLXN1Y2Nlc3MtbGluZS10aXAnLCAnLnN3YWwyLXN1Y2Nlc3MtbGluZS1sb25nJywgJy5zd2FsMi14LW1hcmstbGluZS1sZWZ0JywgJy5zd2FsMi14LW1hcmstbGluZS1yaWdodCddKSB7XG4gICAgICBzZXRTdHlsZShpY29uLCBzZWwsICdiYWNrZ3JvdW5kQ29sb3InLCBwYXJhbXMuaWNvbkNvbG9yKTtcbiAgICB9XG4gICAgc2V0U3R5bGUoaWNvbiwgJy5zd2FsMi1zdWNjZXNzLXJpbmcnLCAnYm9yZGVyQ29sb3InLCBwYXJhbXMuaWNvbkNvbG9yKTtcbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNvbnRlbnRcbiAgICogQHJldHVybnMge3N0cmluZ31cbiAgICovXG4gIGNvbnN0IGljb25Db250ZW50ID0gY29udGVudCA9PiBcIjxkaXYgY2xhc3M9XFxcIlwiLmNvbmNhdChzd2FsQ2xhc3Nlc1snaWNvbi1jb250ZW50J10sIFwiXFxcIj5cIikuY29uY2F0KGNvbnRlbnQsIFwiPC9kaXY+XCIpO1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnQyfSBpbnN0YW5jZVxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICovXG4gIGNvbnN0IHJlbmRlckltYWdlID0gKGluc3RhbmNlLCBwYXJhbXMpID0+IHtcbiAgICBjb25zdCBpbWFnZSA9IGdldEltYWdlKCk7XG4gICAgaWYgKCFwYXJhbXMuaW1hZ2VVcmwpIHtcbiAgICAgIGhpZGUoaW1hZ2UpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBzaG93KGltYWdlLCAnJyk7XG5cbiAgICAvLyBTcmMsIGFsdFxuICAgIGltYWdlLnNldEF0dHJpYnV0ZSgnc3JjJywgcGFyYW1zLmltYWdlVXJsKTtcbiAgICBpbWFnZS5zZXRBdHRyaWJ1dGUoJ2FsdCcsIHBhcmFtcy5pbWFnZUFsdCk7XG5cbiAgICAvLyBXaWR0aCwgaGVpZ2h0XG4gICAgYXBwbHlOdW1lcmljYWxTdHlsZShpbWFnZSwgJ3dpZHRoJywgcGFyYW1zLmltYWdlV2lkdGgpO1xuICAgIGFwcGx5TnVtZXJpY2FsU3R5bGUoaW1hZ2UsICdoZWlnaHQnLCBwYXJhbXMuaW1hZ2VIZWlnaHQpO1xuXG4gICAgLy8gQ2xhc3NcbiAgICBpbWFnZS5jbGFzc05hbWUgPSBzd2FsQ2xhc3Nlcy5pbWFnZTtcbiAgICBhcHBseUN1c3RvbUNsYXNzKGltYWdlLCBwYXJhbXMsICdpbWFnZScpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnQyfSBpbnN0YW5jZVxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICovXG4gIGNvbnN0IHJlbmRlclBvcHVwID0gKGluc3RhbmNlLCBwYXJhbXMpID0+IHtcbiAgICBjb25zdCBjb250YWluZXIgPSBnZXRDb250YWluZXIoKTtcbiAgICBjb25zdCBwb3B1cCA9IGdldFBvcHVwKCk7XG5cbiAgICAvLyBXaWR0aFxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9zd2VldGFsZXJ0Mi9zd2VldGFsZXJ0Mi9pc3N1ZXMvMjE3MFxuICAgIGlmIChwYXJhbXMudG9hc3QpIHtcbiAgICAgIGFwcGx5TnVtZXJpY2FsU3R5bGUoY29udGFpbmVyLCAnd2lkdGgnLCBwYXJhbXMud2lkdGgpO1xuICAgICAgcG9wdXAuc3R5bGUud2lkdGggPSAnMTAwJSc7XG4gICAgICBwb3B1cC5pbnNlcnRCZWZvcmUoZ2V0TG9hZGVyKCksIGdldEljb24oKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFwcGx5TnVtZXJpY2FsU3R5bGUocG9wdXAsICd3aWR0aCcsIHBhcmFtcy53aWR0aCk7XG4gICAgfVxuXG4gICAgLy8gUGFkZGluZ1xuICAgIGFwcGx5TnVtZXJpY2FsU3R5bGUocG9wdXAsICdwYWRkaW5nJywgcGFyYW1zLnBhZGRpbmcpO1xuXG4gICAgLy8gQ29sb3JcbiAgICBpZiAocGFyYW1zLmNvbG9yKSB7XG4gICAgICBwb3B1cC5zdHlsZS5jb2xvciA9IHBhcmFtcy5jb2xvcjtcbiAgICB9XG5cbiAgICAvLyBCYWNrZ3JvdW5kXG4gICAgaWYgKHBhcmFtcy5iYWNrZ3JvdW5kKSB7XG4gICAgICBwb3B1cC5zdHlsZS5iYWNrZ3JvdW5kID0gcGFyYW1zLmJhY2tncm91bmQ7XG4gICAgfVxuICAgIGhpZGUoZ2V0VmFsaWRhdGlvbk1lc3NhZ2UoKSk7XG5cbiAgICAvLyBDbGFzc2VzXG4gICAgYWRkQ2xhc3Nlcyhwb3B1cCwgcGFyYW1zKTtcbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gcG9wdXBcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqL1xuICBjb25zdCBhZGRDbGFzc2VzID0gKHBvcHVwLCBwYXJhbXMpID0+IHtcbiAgICAvLyBEZWZhdWx0IENsYXNzICsgc2hvd0NsYXNzIHdoZW4gdXBkYXRpbmcgU3dhbC51cGRhdGUoe30pXG4gICAgcG9wdXAuY2xhc3NOYW1lID0gXCJcIi5jb25jYXQoc3dhbENsYXNzZXMucG9wdXAsIFwiIFwiKS5jb25jYXQoaXNWaXNpYmxlKHBvcHVwKSA/IHBhcmFtcy5zaG93Q2xhc3MucG9wdXAgOiAnJyk7XG4gICAgaWYgKHBhcmFtcy50b2FzdCkge1xuICAgICAgYWRkQ2xhc3MoW2RvY3VtZW50LmRvY3VtZW50RWxlbWVudCwgZG9jdW1lbnQuYm9keV0sIHN3YWxDbGFzc2VzWyd0b2FzdC1zaG93biddKTtcbiAgICAgIGFkZENsYXNzKHBvcHVwLCBzd2FsQ2xhc3Nlcy50b2FzdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFkZENsYXNzKHBvcHVwLCBzd2FsQ2xhc3Nlcy5tb2RhbCk7XG4gICAgfVxuXG4gICAgLy8gQ3VzdG9tIGNsYXNzXG4gICAgYXBwbHlDdXN0b21DbGFzcyhwb3B1cCwgcGFyYW1zLCAncG9wdXAnKTtcbiAgICBpZiAodHlwZW9mIHBhcmFtcy5jdXN0b21DbGFzcyA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGFkZENsYXNzKHBvcHVwLCBwYXJhbXMuY3VzdG9tQ2xhc3MpO1xuICAgIH1cblxuICAgIC8vIEljb24gY2xhc3MgKCMxODQyKVxuICAgIGlmIChwYXJhbXMuaWNvbikge1xuICAgICAgYWRkQ2xhc3MocG9wdXAsIHN3YWxDbGFzc2VzW1wiaWNvbi1cIi5jb25jYXQocGFyYW1zLmljb24pXSk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnQyfSBpbnN0YW5jZVxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICovXG4gIGNvbnN0IHJlbmRlclByb2dyZXNzU3RlcHMgPSAoaW5zdGFuY2UsIHBhcmFtcykgPT4ge1xuICAgIGNvbnN0IHByb2dyZXNzU3RlcHNDb250YWluZXIgPSBnZXRQcm9ncmVzc1N0ZXBzKCk7XG4gICAgaWYgKCFwYXJhbXMucHJvZ3Jlc3NTdGVwcyB8fCBwYXJhbXMucHJvZ3Jlc3NTdGVwcy5sZW5ndGggPT09IDApIHtcbiAgICAgIGhpZGUocHJvZ3Jlc3NTdGVwc0NvbnRhaW5lcik7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHNob3cocHJvZ3Jlc3NTdGVwc0NvbnRhaW5lcik7XG4gICAgcHJvZ3Jlc3NTdGVwc0NvbnRhaW5lci50ZXh0Q29udGVudCA9ICcnO1xuICAgIGlmIChwYXJhbXMuY3VycmVudFByb2dyZXNzU3RlcCA+PSBwYXJhbXMucHJvZ3Jlc3NTdGVwcy5sZW5ndGgpIHtcbiAgICAgIHdhcm4oJ0ludmFsaWQgY3VycmVudFByb2dyZXNzU3RlcCBwYXJhbWV0ZXIsIGl0IHNob3VsZCBiZSBsZXNzIHRoYW4gcHJvZ3Jlc3NTdGVwcy5sZW5ndGggJyArICcoY3VycmVudFByb2dyZXNzU3RlcCBsaWtlIEpTIGFycmF5cyBzdGFydHMgZnJvbSAwKScpO1xuICAgIH1cbiAgICBwYXJhbXMucHJvZ3Jlc3NTdGVwcy5mb3JFYWNoKChzdGVwLCBpbmRleCkgPT4ge1xuICAgICAgY29uc3Qgc3RlcEVsID0gY3JlYXRlU3RlcEVsZW1lbnQoc3RlcCk7XG4gICAgICBwcm9ncmVzc1N0ZXBzQ29udGFpbmVyLmFwcGVuZENoaWxkKHN0ZXBFbCk7XG4gICAgICBpZiAoaW5kZXggPT09IHBhcmFtcy5jdXJyZW50UHJvZ3Jlc3NTdGVwKSB7XG4gICAgICAgIGFkZENsYXNzKHN0ZXBFbCwgc3dhbENsYXNzZXNbJ2FjdGl2ZS1wcm9ncmVzcy1zdGVwJ10pO1xuICAgICAgfVxuICAgICAgaWYgKGluZGV4ICE9PSBwYXJhbXMucHJvZ3Jlc3NTdGVwcy5sZW5ndGggLSAxKSB7XG4gICAgICAgIGNvbnN0IGxpbmVFbCA9IGNyZWF0ZUxpbmVFbGVtZW50KHBhcmFtcyk7XG4gICAgICAgIHByb2dyZXNzU3RlcHNDb250YWluZXIuYXBwZW5kQ2hpbGQobGluZUVsKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IHN0ZXBcbiAgICogQHJldHVybnMge0hUTUxMSUVsZW1lbnR9XG4gICAqL1xuICBjb25zdCBjcmVhdGVTdGVwRWxlbWVudCA9IHN0ZXAgPT4ge1xuICAgIGNvbnN0IHN0ZXBFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgYWRkQ2xhc3Moc3RlcEVsLCBzd2FsQ2xhc3Nlc1sncHJvZ3Jlc3Mtc3RlcCddKTtcbiAgICBzZXRJbm5lckh0bWwoc3RlcEVsLCBzdGVwKTtcbiAgICByZXR1cm4gc3RlcEVsO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICogQHJldHVybnMge0hUTUxMSUVsZW1lbnR9XG4gICAqL1xuICBjb25zdCBjcmVhdGVMaW5lRWxlbWVudCA9IHBhcmFtcyA9PiB7XG4gICAgY29uc3QgbGluZUVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICBhZGRDbGFzcyhsaW5lRWwsIHN3YWxDbGFzc2VzWydwcm9ncmVzcy1zdGVwLWxpbmUnXSk7XG4gICAgaWYgKHBhcmFtcy5wcm9ncmVzc1N0ZXBzRGlzdGFuY2UpIHtcbiAgICAgIGFwcGx5TnVtZXJpY2FsU3R5bGUobGluZUVsLCAnd2lkdGgnLCBwYXJhbXMucHJvZ3Jlc3NTdGVwc0Rpc3RhbmNlKTtcbiAgICB9XG4gICAgcmV0dXJuIGxpbmVFbDtcbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0Mn0gaW5zdGFuY2VcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqL1xuICBjb25zdCByZW5kZXJUaXRsZSA9IChpbnN0YW5jZSwgcGFyYW1zKSA9PiB7XG4gICAgY29uc3QgdGl0bGUgPSBnZXRUaXRsZSgpO1xuICAgIHRvZ2dsZSh0aXRsZSwgcGFyYW1zLnRpdGxlIHx8IHBhcmFtcy50aXRsZVRleHQsICdibG9jaycpO1xuICAgIGlmIChwYXJhbXMudGl0bGUpIHtcbiAgICAgIHBhcnNlSHRtbFRvQ29udGFpbmVyKHBhcmFtcy50aXRsZSwgdGl0bGUpO1xuICAgIH1cbiAgICBpZiAocGFyYW1zLnRpdGxlVGV4dCkge1xuICAgICAgdGl0bGUuaW5uZXJUZXh0ID0gcGFyYW1zLnRpdGxlVGV4dDtcbiAgICB9XG5cbiAgICAvLyBDdXN0b20gY2xhc3NcbiAgICBhcHBseUN1c3RvbUNsYXNzKHRpdGxlLCBwYXJhbXMsICd0aXRsZScpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnQyfSBpbnN0YW5jZVxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICovXG4gIGNvbnN0IHJlbmRlciA9IChpbnN0YW5jZSwgcGFyYW1zKSA9PiB7XG4gICAgcmVuZGVyUG9wdXAoaW5zdGFuY2UsIHBhcmFtcyk7XG4gICAgcmVuZGVyQ29udGFpbmVyKGluc3RhbmNlLCBwYXJhbXMpO1xuICAgIHJlbmRlclByb2dyZXNzU3RlcHMoaW5zdGFuY2UsIHBhcmFtcyk7XG4gICAgcmVuZGVySWNvbihpbnN0YW5jZSwgcGFyYW1zKTtcbiAgICByZW5kZXJJbWFnZShpbnN0YW5jZSwgcGFyYW1zKTtcbiAgICByZW5kZXJUaXRsZShpbnN0YW5jZSwgcGFyYW1zKTtcbiAgICByZW5kZXJDbG9zZUJ1dHRvbihpbnN0YW5jZSwgcGFyYW1zKTtcbiAgICByZW5kZXJDb250ZW50KGluc3RhbmNlLCBwYXJhbXMpO1xuICAgIHJlbmRlckFjdGlvbnMoaW5zdGFuY2UsIHBhcmFtcyk7XG4gICAgcmVuZGVyRm9vdGVyKGluc3RhbmNlLCBwYXJhbXMpO1xuICAgIGlmICh0eXBlb2YgcGFyYW1zLmRpZFJlbmRlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcGFyYW1zLmRpZFJlbmRlcihnZXRQb3B1cCgpKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIEhpZGVzIGxvYWRlciBhbmQgc2hvd3MgYmFjayB0aGUgYnV0dG9uIHdoaWNoIHdhcyBoaWRkZW4gYnkgLnNob3dMb2FkaW5nKClcbiAgICovXG4gIGZ1bmN0aW9uIGhpZGVMb2FkaW5nKCkge1xuICAgIC8vIGRvIG5vdGhpbmcgaWYgcG9wdXAgaXMgY2xvc2VkXG4gICAgY29uc3QgaW5uZXJQYXJhbXMgPSBwcml2YXRlUHJvcHMuaW5uZXJQYXJhbXMuZ2V0KHRoaXMpO1xuICAgIGlmICghaW5uZXJQYXJhbXMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgZG9tQ2FjaGUgPSBwcml2YXRlUHJvcHMuZG9tQ2FjaGUuZ2V0KHRoaXMpO1xuICAgIGhpZGUoZG9tQ2FjaGUubG9hZGVyKTtcbiAgICBpZiAoaXNUb2FzdCgpKSB7XG4gICAgICBpZiAoaW5uZXJQYXJhbXMuaWNvbikge1xuICAgICAgICBzaG93KGdldEljb24oKSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHNob3dSZWxhdGVkQnV0dG9uKGRvbUNhY2hlKTtcbiAgICB9XG4gICAgcmVtb3ZlQ2xhc3MoW2RvbUNhY2hlLnBvcHVwLCBkb21DYWNoZS5hY3Rpb25zXSwgc3dhbENsYXNzZXMubG9hZGluZyk7XG4gICAgZG9tQ2FjaGUucG9wdXAucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWJ1c3knKTtcbiAgICBkb21DYWNoZS5wb3B1cC5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtbG9hZGluZycpO1xuICAgIGRvbUNhY2hlLmNvbmZpcm1CdXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICBkb21DYWNoZS5kZW55QnV0dG9uLmRpc2FibGVkID0gZmFsc2U7XG4gICAgZG9tQ2FjaGUuY2FuY2VsQnV0dG9uLmRpc2FibGVkID0gZmFsc2U7XG4gIH1cbiAgY29uc3Qgc2hvd1JlbGF0ZWRCdXR0b24gPSBkb21DYWNoZSA9PiB7XG4gICAgY29uc3QgYnV0dG9uVG9SZXBsYWNlID0gZG9tQ2FjaGUucG9wdXAuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShkb21DYWNoZS5sb2FkZXIuZ2V0QXR0cmlidXRlKCdkYXRhLWJ1dHRvbi10by1yZXBsYWNlJykpO1xuICAgIGlmIChidXR0b25Ub1JlcGxhY2UubGVuZ3RoKSB7XG4gICAgICBzaG93KGJ1dHRvblRvUmVwbGFjZVswXSwgJ2lubGluZS1ibG9jaycpO1xuICAgIH0gZWxzZSBpZiAoYWxsQnV0dG9uc0FyZUhpZGRlbigpKSB7XG4gICAgICBoaWRlKGRvbUNhY2hlLmFjdGlvbnMpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogR2V0cyB0aGUgaW5wdXQgRE9NIG5vZGUsIHRoaXMgbWV0aG9kIHdvcmtzIHdpdGggaW5wdXQgcGFyYW1ldGVyLlxuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnQgfCBudWxsfVxuICAgKi9cbiAgZnVuY3Rpb24gZ2V0SW5wdXQkMShpbnN0YW5jZSkge1xuICAgIGNvbnN0IGlubmVyUGFyYW1zID0gcHJpdmF0ZVByb3BzLmlubmVyUGFyYW1zLmdldChpbnN0YW5jZSB8fCB0aGlzKTtcbiAgICBjb25zdCBkb21DYWNoZSA9IHByaXZhdGVQcm9wcy5kb21DYWNoZS5nZXQoaW5zdGFuY2UgfHwgdGhpcyk7XG4gICAgaWYgKCFkb21DYWNoZSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBnZXRJbnB1dChkb21DYWNoZS5wb3B1cCwgaW5uZXJQYXJhbXMuaW5wdXQpO1xuICB9XG5cbiAgLypcbiAgICogR2xvYmFsIGZ1bmN0aW9uIHRvIGRldGVybWluZSBpZiBTd2VldEFsZXJ0MiBwb3B1cCBpcyBzaG93blxuICAgKi9cbiAgY29uc3QgaXNWaXNpYmxlJDEgPSAoKSA9PiB7XG4gICAgcmV0dXJuIGlzVmlzaWJsZShnZXRQb3B1cCgpKTtcbiAgfTtcblxuICAvKlxuICAgKiBHbG9iYWwgZnVuY3Rpb24gdG8gY2xpY2sgJ0NvbmZpcm0nIGJ1dHRvblxuICAgKi9cbiAgY29uc3QgY2xpY2tDb25maXJtID0gKCkgPT4gZ2V0Q29uZmlybUJ1dHRvbigpICYmIGdldENvbmZpcm1CdXR0b24oKS5jbGljaygpO1xuXG4gIC8qXG4gICAqIEdsb2JhbCBmdW5jdGlvbiB0byBjbGljayAnRGVueScgYnV0dG9uXG4gICAqL1xuICBjb25zdCBjbGlja0RlbnkgPSAoKSA9PiBnZXREZW55QnV0dG9uKCkgJiYgZ2V0RGVueUJ1dHRvbigpLmNsaWNrKCk7XG5cbiAgLypcbiAgICogR2xvYmFsIGZ1bmN0aW9uIHRvIGNsaWNrICdDYW5jZWwnIGJ1dHRvblxuICAgKi9cbiAgY29uc3QgY2xpY2tDYW5jZWwgPSAoKSA9PiBnZXRDYW5jZWxCdXR0b24oKSAmJiBnZXRDYW5jZWxCdXR0b24oKS5jbGljaygpO1xuXG4gIGNvbnN0IERpc21pc3NSZWFzb24gPSBPYmplY3QuZnJlZXplKHtcbiAgICBjYW5jZWw6ICdjYW5jZWwnLFxuICAgIGJhY2tkcm9wOiAnYmFja2Ryb3AnLFxuICAgIGNsb3NlOiAnY2xvc2UnLFxuICAgIGVzYzogJ2VzYycsXG4gICAgdGltZXI6ICd0aW1lcidcbiAgfSk7XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7R2xvYmFsU3RhdGV9IGdsb2JhbFN0YXRlXG4gICAqL1xuICBjb25zdCByZW1vdmVLZXlkb3duSGFuZGxlciA9IGdsb2JhbFN0YXRlID0+IHtcbiAgICBpZiAoZ2xvYmFsU3RhdGUua2V5ZG93blRhcmdldCAmJiBnbG9iYWxTdGF0ZS5rZXlkb3duSGFuZGxlckFkZGVkKSB7XG4gICAgICBnbG9iYWxTdGF0ZS5rZXlkb3duVGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBnbG9iYWxTdGF0ZS5rZXlkb3duSGFuZGxlciwge1xuICAgICAgICBjYXB0dXJlOiBnbG9iYWxTdGF0ZS5rZXlkb3duTGlzdGVuZXJDYXB0dXJlXG4gICAgICB9KTtcbiAgICAgIGdsb2JhbFN0YXRlLmtleWRvd25IYW5kbGVyQWRkZWQgPSBmYWxzZTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydDJ9IGluc3RhbmNlXG4gICAqIEBwYXJhbSB7R2xvYmFsU3RhdGV9IGdsb2JhbFN0YXRlXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IGlubmVyUGFyYW1zXG4gICAqIEBwYXJhbSB7Kn0gZGlzbWlzc1dpdGhcbiAgICovXG4gIGNvbnN0IGFkZEtleWRvd25IYW5kbGVyID0gKGluc3RhbmNlLCBnbG9iYWxTdGF0ZSwgaW5uZXJQYXJhbXMsIGRpc21pc3NXaXRoKSA9PiB7XG4gICAgcmVtb3ZlS2V5ZG93bkhhbmRsZXIoZ2xvYmFsU3RhdGUpO1xuICAgIGlmICghaW5uZXJQYXJhbXMudG9hc3QpIHtcbiAgICAgIGdsb2JhbFN0YXRlLmtleWRvd25IYW5kbGVyID0gZSA9PiBrZXlkb3duSGFuZGxlcihpbnN0YW5jZSwgZSwgZGlzbWlzc1dpdGgpO1xuICAgICAgZ2xvYmFsU3RhdGUua2V5ZG93blRhcmdldCA9IGlubmVyUGFyYW1zLmtleWRvd25MaXN0ZW5lckNhcHR1cmUgPyB3aW5kb3cgOiBnZXRQb3B1cCgpO1xuICAgICAgZ2xvYmFsU3RhdGUua2V5ZG93bkxpc3RlbmVyQ2FwdHVyZSA9IGlubmVyUGFyYW1zLmtleWRvd25MaXN0ZW5lckNhcHR1cmU7XG4gICAgICBnbG9iYWxTdGF0ZS5rZXlkb3duVGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBnbG9iYWxTdGF0ZS5rZXlkb3duSGFuZGxlciwge1xuICAgICAgICBjYXB0dXJlOiBnbG9iYWxTdGF0ZS5rZXlkb3duTGlzdGVuZXJDYXB0dXJlXG4gICAgICB9KTtcbiAgICAgIGdsb2JhbFN0YXRlLmtleWRvd25IYW5kbGVyQWRkZWQgPSB0cnVlO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gaW5uZXJQYXJhbXNcbiAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4XG4gICAqIEBwYXJhbSB7bnVtYmVyfSBpbmNyZW1lbnRcbiAgICovXG4gIGNvbnN0IHNldEZvY3VzID0gKGlubmVyUGFyYW1zLCBpbmRleCwgaW5jcmVtZW50KSA9PiB7XG4gICAgY29uc3QgZm9jdXNhYmxlRWxlbWVudHMgPSBnZXRGb2N1c2FibGVFbGVtZW50cygpO1xuICAgIC8vIHNlYXJjaCBmb3IgdmlzaWJsZSBlbGVtZW50cyBhbmQgc2VsZWN0IHRoZSBuZXh0IHBvc3NpYmxlIG1hdGNoXG4gICAgaWYgKGZvY3VzYWJsZUVsZW1lbnRzLmxlbmd0aCkge1xuICAgICAgaW5kZXggPSBpbmRleCArIGluY3JlbWVudDtcblxuICAgICAgLy8gcm9sbG92ZXIgdG8gZmlyc3QgaXRlbVxuICAgICAgaWYgKGluZGV4ID09PSBmb2N1c2FibGVFbGVtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgaW5kZXggPSAwO1xuXG4gICAgICAgIC8vIGdvIHRvIGxhc3QgaXRlbVxuICAgICAgfSBlbHNlIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICAgICAgaW5kZXggPSBmb2N1c2FibGVFbGVtZW50cy5sZW5ndGggLSAxO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZvY3VzYWJsZUVsZW1lbnRzW2luZGV4XS5mb2N1cygpO1xuICAgIH1cbiAgICAvLyBubyB2aXNpYmxlIGZvY3VzYWJsZSBlbGVtZW50cywgZm9jdXMgdGhlIHBvcHVwXG4gICAgZ2V0UG9wdXAoKS5mb2N1cygpO1xuICB9O1xuICBjb25zdCBhcnJvd0tleXNOZXh0QnV0dG9uID0gWydBcnJvd1JpZ2h0JywgJ0Fycm93RG93biddO1xuICBjb25zdCBhcnJvd0tleXNQcmV2aW91c0J1dHRvbiA9IFsnQXJyb3dMZWZ0JywgJ0Fycm93VXAnXTtcblxuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0Mn0gaW5zdGFuY2VcbiAgICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBlXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGRpc21pc3NXaXRoXG4gICAqL1xuICBjb25zdCBrZXlkb3duSGFuZGxlciA9IChpbnN0YW5jZSwgZSwgZGlzbWlzc1dpdGgpID0+IHtcbiAgICBjb25zdCBpbm5lclBhcmFtcyA9IHByaXZhdGVQcm9wcy5pbm5lclBhcmFtcy5nZXQoaW5zdGFuY2UpO1xuICAgIGlmICghaW5uZXJQYXJhbXMpIHtcbiAgICAgIHJldHVybjsgLy8gVGhpcyBpbnN0YW5jZSBoYXMgYWxyZWFkeSBiZWVuIGRlc3Ryb3llZFxuICAgIH1cblxuICAgIC8vIElnbm9yZSBrZXlkb3duIGR1cmluZyBJTUUgY29tcG9zaXRpb25cbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRG9jdW1lbnQva2V5ZG93bl9ldmVudCNpZ25vcmluZ19rZXlkb3duX2R1cmluZ19pbWVfY29tcG9zaXRpb25cbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vc3dlZXRhbGVydDIvc3dlZXRhbGVydDIvaXNzdWVzLzcyMFxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9zd2VldGFsZXJ0Mi9zd2VldGFsZXJ0Mi9pc3N1ZXMvMjQwNlxuICAgIGlmIChlLmlzQ29tcG9zaW5nIHx8IGUua2V5Q29kZSA9PT0gMjI5KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChpbm5lclBhcmFtcy5zdG9wS2V5ZG93blByb3BhZ2F0aW9uKSB7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH1cblxuICAgIC8vIEVOVEVSXG4gICAgaWYgKGUua2V5ID09PSAnRW50ZXInKSB7XG4gICAgICBoYW5kbGVFbnRlcihpbnN0YW5jZSwgZSwgaW5uZXJQYXJhbXMpO1xuICAgIH1cblxuICAgIC8vIFRBQlxuICAgIGVsc2UgaWYgKGUua2V5ID09PSAnVGFiJykge1xuICAgICAgaGFuZGxlVGFiKGUsIGlubmVyUGFyYW1zKTtcbiAgICB9XG5cbiAgICAvLyBBUlJPV1MgLSBzd2l0Y2ggZm9jdXMgYmV0d2VlbiBidXR0b25zXG4gICAgZWxzZSBpZiAoWy4uLmFycm93S2V5c05leHRCdXR0b24sIC4uLmFycm93S2V5c1ByZXZpb3VzQnV0dG9uXS5pbmNsdWRlcyhlLmtleSkpIHtcbiAgICAgIGhhbmRsZUFycm93cyhlLmtleSk7XG4gICAgfVxuXG4gICAgLy8gRVNDXG4gICAgZWxzZSBpZiAoZS5rZXkgPT09ICdFc2NhcGUnKSB7XG4gICAgICBoYW5kbGVFc2MoZSwgaW5uZXJQYXJhbXMsIGRpc21pc3NXaXRoKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydDJ9IGluc3RhbmNlXG4gICAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZVxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBpbm5lclBhcmFtc1xuICAgKi9cbiAgY29uc3QgaGFuZGxlRW50ZXIgPSAoaW5zdGFuY2UsIGUsIGlubmVyUGFyYW1zKSA9PiB7XG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3N3ZWV0YWxlcnQyL3N3ZWV0YWxlcnQyL2lzc3Vlcy8yMzg2XG4gICAgaWYgKCFjYWxsSWZGdW5jdGlvbihpbm5lclBhcmFtcy5hbGxvd0VudGVyS2V5KSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoZS50YXJnZXQgJiYgaW5zdGFuY2UuZ2V0SW5wdXQoKSAmJiBlLnRhcmdldCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50ICYmIGUudGFyZ2V0Lm91dGVySFRNTCA9PT0gaW5zdGFuY2UuZ2V0SW5wdXQoKS5vdXRlckhUTUwpIHtcbiAgICAgIGlmIChbJ3RleHRhcmVhJywgJ2ZpbGUnXS5pbmNsdWRlcyhpbm5lclBhcmFtcy5pbnB1dCkpIHtcbiAgICAgICAgcmV0dXJuOyAvLyBkbyBub3Qgc3VibWl0XG4gICAgICB9XG5cbiAgICAgIGNsaWNrQ29uZmlybSgpO1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBlXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IGlubmVyUGFyYW1zXG4gICAqL1xuICBjb25zdCBoYW5kbGVUYWIgPSAoZSwgaW5uZXJQYXJhbXMpID0+IHtcbiAgICBjb25zdCB0YXJnZXRFbGVtZW50ID0gZS50YXJnZXQ7XG4gICAgY29uc3QgZm9jdXNhYmxlRWxlbWVudHMgPSBnZXRGb2N1c2FibGVFbGVtZW50cygpO1xuICAgIGxldCBidG5JbmRleCA9IC0xO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZm9jdXNhYmxlRWxlbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICh0YXJnZXRFbGVtZW50ID09PSBmb2N1c2FibGVFbGVtZW50c1tpXSkge1xuICAgICAgICBidG5JbmRleCA9IGk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEN5Y2xlIHRvIHRoZSBuZXh0IGJ1dHRvblxuICAgIGlmICghZS5zaGlmdEtleSkge1xuICAgICAgc2V0Rm9jdXMoaW5uZXJQYXJhbXMsIGJ0bkluZGV4LCAxKTtcbiAgICB9XG5cbiAgICAvLyBDeWNsZSB0byB0aGUgcHJldiBidXR0b25cbiAgICBlbHNlIHtcbiAgICAgIHNldEZvY3VzKGlubmVyUGFyYW1zLCBidG5JbmRleCwgLTEpO1xuICAgIH1cbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IGtleVxuICAgKi9cbiAgY29uc3QgaGFuZGxlQXJyb3dzID0ga2V5ID0+IHtcbiAgICBjb25zdCBjb25maXJtQnV0dG9uID0gZ2V0Q29uZmlybUJ1dHRvbigpO1xuICAgIGNvbnN0IGRlbnlCdXR0b24gPSBnZXREZW55QnV0dG9uKCk7XG4gICAgY29uc3QgY2FuY2VsQnV0dG9uID0gZ2V0Q2FuY2VsQnV0dG9uKCk7XG4gICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCAmJiAhW2NvbmZpcm1CdXR0b24sIGRlbnlCdXR0b24sIGNhbmNlbEJ1dHRvbl0uaW5jbHVkZXMoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3Qgc2libGluZyA9IGFycm93S2V5c05leHRCdXR0b24uaW5jbHVkZXMoa2V5KSA/ICduZXh0RWxlbWVudFNpYmxpbmcnIDogJ3ByZXZpb3VzRWxlbWVudFNpYmxpbmcnO1xuICAgIGxldCBidXR0b25Ub0ZvY3VzID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGdldEFjdGlvbnMoKS5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgYnV0dG9uVG9Gb2N1cyA9IGJ1dHRvblRvRm9jdXNbc2libGluZ107XG4gICAgICBpZiAoIWJ1dHRvblRvRm9jdXMpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKGJ1dHRvblRvRm9jdXMgaW5zdGFuY2VvZiBIVE1MQnV0dG9uRWxlbWVudCAmJiBpc1Zpc2libGUoYnV0dG9uVG9Gb2N1cykpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChidXR0b25Ub0ZvY3VzIGluc3RhbmNlb2YgSFRNTEJ1dHRvbkVsZW1lbnQpIHtcbiAgICAgIGJ1dHRvblRvRm9jdXMuZm9jdXMoKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZVxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBpbm5lclBhcmFtc1xuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBkaXNtaXNzV2l0aFxuICAgKi9cbiAgY29uc3QgaGFuZGxlRXNjID0gKGUsIGlubmVyUGFyYW1zLCBkaXNtaXNzV2l0aCkgPT4ge1xuICAgIGlmIChjYWxsSWZGdW5jdGlvbihpbm5lclBhcmFtcy5hbGxvd0VzY2FwZUtleSkpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGRpc21pc3NXaXRoKERpc21pc3NSZWFzb24uZXNjKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIFRoaXMgbW9kdWxlIGNvbnRhaW5zIGBXZWFrTWFwYHMgZm9yIGVhY2ggZWZmZWN0aXZlbHktXCJwcml2YXRlICBwcm9wZXJ0eVwiIHRoYXQgYSBgU3dhbGAgaGFzLlxuICAgKiBGb3IgZXhhbXBsZSwgdG8gc2V0IHRoZSBwcml2YXRlIHByb3BlcnR5IFwiZm9vXCIgb2YgYHRoaXNgIHRvIFwiYmFyXCIsIHlvdSBjYW4gYHByaXZhdGVQcm9wcy5mb28uc2V0KHRoaXMsICdiYXInKWBcbiAgICogVGhpcyBpcyB0aGUgYXBwcm9hY2ggdGhhdCBCYWJlbCB3aWxsIHByb2JhYmx5IHRha2UgdG8gaW1wbGVtZW50IHByaXZhdGUgbWV0aG9kcy9maWVsZHNcbiAgICogICBodHRwczovL2dpdGh1Yi5jb20vdGMzOS9wcm9wb3NhbC1wcml2YXRlLW1ldGhvZHNcbiAgICogICBodHRwczovL2dpdGh1Yi5jb20vYmFiZWwvYmFiZWwvcHVsbC83NTU1XG4gICAqIE9uY2Ugd2UgaGF2ZSB0aGUgY2hhbmdlcyBmcm9tIHRoYXQgUFIgaW4gQmFiZWwsIGFuZCBvdXIgY29yZSBjbGFzcyBmaXRzIHJlYXNvbmFibGUgaW4gKm9uZSBtb2R1bGUqXG4gICAqICAgdGhlbiB3ZSBjYW4gdXNlIHRoYXQgbGFuZ3VhZ2UgZmVhdHVyZS5cbiAgICovXG5cbiAgdmFyIHByaXZhdGVNZXRob2RzID0ge1xuICAgIHN3YWxQcm9taXNlUmVzb2x2ZTogbmV3IFdlYWtNYXAoKSxcbiAgICBzd2FsUHJvbWlzZVJlamVjdDogbmV3IFdlYWtNYXAoKVxuICB9O1xuXG4gIC8vIEZyb20gaHR0cHM6Ly9kZXZlbG9wZXIucGFjaWVsbG9ncm91cC5jb20vYmxvZy8yMDE4LzA2L3RoZS1jdXJyZW50LXN0YXRlLW9mLW1vZGFsLWRpYWxvZy1hY2Nlc3NpYmlsaXR5L1xuICAvLyBBZGRpbmcgYXJpYS1oaWRkZW49XCJ0cnVlXCIgdG8gZWxlbWVudHMgb3V0c2lkZSBvZiB0aGUgYWN0aXZlIG1vZGFsIGRpYWxvZyBlbnN1cmVzIHRoYXRcbiAgLy8gZWxlbWVudHMgbm90IHdpdGhpbiB0aGUgYWN0aXZlIG1vZGFsIGRpYWxvZyB3aWxsIG5vdCBiZSBzdXJmYWNlZCBpZiBhIHVzZXIgb3BlbnMgYSBzY3JlZW5cbiAgLy8gcmVhZGVy4oCZcyBsaXN0IG9mIGVsZW1lbnRzIChoZWFkaW5ncywgZm9ybSBjb250cm9scywgbGFuZG1hcmtzLCBldGMuKSBpbiB0aGUgZG9jdW1lbnQuXG5cbiAgY29uc3Qgc2V0QXJpYUhpZGRlbiA9ICgpID0+IHtcbiAgICBjb25zdCBib2R5Q2hpbGRyZW4gPSBBcnJheS5mcm9tKGRvY3VtZW50LmJvZHkuY2hpbGRyZW4pO1xuICAgIGJvZHlDaGlsZHJlbi5mb3JFYWNoKGVsID0+IHtcbiAgICAgIGlmIChlbCA9PT0gZ2V0Q29udGFpbmVyKCkgfHwgZWwuY29udGFpbnMoZ2V0Q29udGFpbmVyKCkpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChlbC5oYXNBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJykpIHtcbiAgICAgICAgZWwuc2V0QXR0cmlidXRlKCdkYXRhLXByZXZpb3VzLWFyaWEtaGlkZGVuJywgZWwuZ2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicpKTtcbiAgICAgIH1cbiAgICAgIGVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuICAgIH0pO1xuICB9O1xuICBjb25zdCB1bnNldEFyaWFIaWRkZW4gPSAoKSA9PiB7XG4gICAgY29uc3QgYm9keUNoaWxkcmVuID0gQXJyYXkuZnJvbShkb2N1bWVudC5ib2R5LmNoaWxkcmVuKTtcbiAgICBib2R5Q2hpbGRyZW4uZm9yRWFjaChlbCA9PiB7XG4gICAgICBpZiAoZWwuaGFzQXR0cmlidXRlKCdkYXRhLXByZXZpb3VzLWFyaWEtaGlkZGVuJykpIHtcbiAgICAgICAgZWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsIGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1wcmV2aW91cy1hcmlhLWhpZGRlbicpKTtcbiAgICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKCdkYXRhLXByZXZpb3VzLWFyaWEtaGlkZGVuJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgLyogaXN0YW5idWwgaWdub3JlIGZpbGUgKi9cblxuICAvLyBGaXggaU9TIHNjcm9sbGluZyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcS8zOTYyNjMwMlxuXG4gIGNvbnN0IGlPU2ZpeCA9ICgpID0+IHtcbiAgICBjb25zdCBpT1MgPVxuICAgIC8vIEB0cy1pZ25vcmVcbiAgICAvaVBhZHxpUGhvbmV8aVBvZC8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSAmJiAhd2luZG93Lk1TU3RyZWFtIHx8IG5hdmlnYXRvci5wbGF0Zm9ybSA9PT0gJ01hY0ludGVsJyAmJiBuYXZpZ2F0b3IubWF4VG91Y2hQb2ludHMgPiAxO1xuICAgIGlmIChpT1MgJiYgIWhhc0NsYXNzKGRvY3VtZW50LmJvZHksIHN3YWxDbGFzc2VzLmlvc2ZpeCkpIHtcbiAgICAgIGNvbnN0IG9mZnNldCA9IGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wO1xuICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS50b3AgPSBcIlwiLmNvbmNhdChvZmZzZXQgKiAtMSwgXCJweFwiKTtcbiAgICAgIGFkZENsYXNzKGRvY3VtZW50LmJvZHksIHN3YWxDbGFzc2VzLmlvc2ZpeCk7XG4gICAgICBsb2NrQm9keVNjcm9sbCgpO1xuICAgICAgYWRkQm90dG9tUGFkZGluZ0ZvclRhbGxQb3B1cHMoKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIGh0dHBzOi8vZ2l0aHViLmNvbS9zd2VldGFsZXJ0Mi9zd2VldGFsZXJ0Mi9pc3N1ZXMvMTk0OFxuICAgKi9cbiAgY29uc3QgYWRkQm90dG9tUGFkZGluZ0ZvclRhbGxQb3B1cHMgPSAoKSA9PiB7XG4gICAgY29uc3QgdWEgPSBuYXZpZ2F0b3IudXNlckFnZW50O1xuICAgIGNvbnN0IGlPUyA9ICEhdWEubWF0Y2goL2lQYWQvaSkgfHwgISF1YS5tYXRjaCgvaVBob25lL2kpO1xuICAgIGNvbnN0IHdlYmtpdCA9ICEhdWEubWF0Y2goL1dlYktpdC9pKTtcbiAgICBjb25zdCBpT1NTYWZhcmkgPSBpT1MgJiYgd2Via2l0ICYmICF1YS5tYXRjaCgvQ3JpT1MvaSk7XG4gICAgaWYgKGlPU1NhZmFyaSkge1xuICAgICAgY29uc3QgYm90dG9tUGFuZWxIZWlnaHQgPSA0NDtcbiAgICAgIGlmIChnZXRQb3B1cCgpLnNjcm9sbEhlaWdodCA+IHdpbmRvdy5pbm5lckhlaWdodCAtIGJvdHRvbVBhbmVsSGVpZ2h0KSB7XG4gICAgICAgIGdldENvbnRhaW5lcigpLnN0eWxlLnBhZGRpbmdCb3R0b20gPSBcIlwiLmNvbmNhdChib3R0b21QYW5lbEhlaWdodCwgXCJweFwiKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIGh0dHBzOi8vZ2l0aHViLmNvbS9zd2VldGFsZXJ0Mi9zd2VldGFsZXJ0Mi9pc3N1ZXMvMTI0NlxuICAgKi9cbiAgY29uc3QgbG9ja0JvZHlTY3JvbGwgPSAoKSA9PiB7XG4gICAgY29uc3QgY29udGFpbmVyID0gZ2V0Q29udGFpbmVyKCk7XG4gICAgbGV0IHByZXZlbnRUb3VjaE1vdmU7XG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtUb3VjaEV2ZW50fSBlXG4gICAgICovXG4gICAgY29udGFpbmVyLm9udG91Y2hzdGFydCA9IGUgPT4ge1xuICAgICAgcHJldmVudFRvdWNoTW92ZSA9IHNob3VsZFByZXZlbnRUb3VjaE1vdmUoZSk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge1RvdWNoRXZlbnR9IGVcbiAgICAgKi9cbiAgICBjb250YWluZXIub250b3VjaG1vdmUgPSBlID0+IHtcbiAgICAgIGlmIChwcmV2ZW50VG91Y2hNb3ZlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIH1cbiAgICB9O1xuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1RvdWNoRXZlbnR9IGV2ZW50XG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgY29uc3Qgc2hvdWxkUHJldmVudFRvdWNoTW92ZSA9IGV2ZW50ID0+IHtcbiAgICBjb25zdCB0YXJnZXQgPSBldmVudC50YXJnZXQ7XG4gICAgY29uc3QgY29udGFpbmVyID0gZ2V0Q29udGFpbmVyKCk7XG4gICAgaWYgKGlzU3R5bHVzKGV2ZW50KSB8fCBpc1pvb20oZXZlbnQpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmICh0YXJnZXQgPT09IGNvbnRhaW5lcikge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGlmICghaXNTY3JvbGxhYmxlKGNvbnRhaW5lcikgJiYgdGFyZ2V0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgJiYgdGFyZ2V0LnRhZ05hbWUgIT09ICdJTlBVVCcgJiZcbiAgICAvLyAjMTYwM1xuICAgIHRhcmdldC50YWdOYW1lICE9PSAnVEVYVEFSRUEnICYmXG4gICAgLy8gIzIyNjZcbiAgICAhKGlzU2Nyb2xsYWJsZShnZXRIdG1sQ29udGFpbmVyKCkpICYmXG4gICAgLy8gIzE5NDRcbiAgICBnZXRIdG1sQ29udGFpbmVyKCkuY29udGFpbnModGFyZ2V0KSkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgLyoqXG4gICAqIGh0dHBzOi8vZ2l0aHViLmNvbS9zd2VldGFsZXJ0Mi9zd2VldGFsZXJ0Mi9pc3N1ZXMvMTc4NlxuICAgKlxuICAgKiBAcGFyYW0geyp9IGV2ZW50XG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgY29uc3QgaXNTdHlsdXMgPSBldmVudCA9PiB7XG4gICAgcmV0dXJuIGV2ZW50LnRvdWNoZXMgJiYgZXZlbnQudG91Y2hlcy5sZW5ndGggJiYgZXZlbnQudG91Y2hlc1swXS50b3VjaFR5cGUgPT09ICdzdHlsdXMnO1xuICB9O1xuXG4gIC8qKlxuICAgKiBodHRwczovL2dpdGh1Yi5jb20vc3dlZXRhbGVydDIvc3dlZXRhbGVydDIvaXNzdWVzLzE4OTFcbiAgICpcbiAgICogQHBhcmFtIHtUb3VjaEV2ZW50fSBldmVudFxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG4gIGNvbnN0IGlzWm9vbSA9IGV2ZW50ID0+IHtcbiAgICByZXR1cm4gZXZlbnQudG91Y2hlcyAmJiBldmVudC50b3VjaGVzLmxlbmd0aCA+IDE7XG4gIH07XG4gIGNvbnN0IHVuZG9JT1NmaXggPSAoKSA9PiB7XG4gICAgaWYgKGhhc0NsYXNzKGRvY3VtZW50LmJvZHksIHN3YWxDbGFzc2VzLmlvc2ZpeCkpIHtcbiAgICAgIGNvbnN0IG9mZnNldCA9IHBhcnNlSW50KGRvY3VtZW50LmJvZHkuc3R5bGUudG9wLCAxMCk7XG4gICAgICByZW1vdmVDbGFzcyhkb2N1bWVudC5ib2R5LCBzd2FsQ2xhc3Nlcy5pb3NmaXgpO1xuICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS50b3AgPSAnJztcbiAgICAgIGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wID0gb2Zmc2V0ICogLTE7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IGZpeFNjcm9sbGJhciA9ICgpID0+IHtcbiAgICAvLyBmb3IgcXVldWVzLCBkbyBub3QgZG8gdGhpcyBtb3JlIHRoYW4gb25jZVxuICAgIGlmIChzdGF0ZXMucHJldmlvdXNCb2R5UGFkZGluZyAhPT0gbnVsbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyBpZiB0aGUgYm9keSBoYXMgb3ZlcmZsb3dcbiAgICBpZiAoZG9jdW1lbnQuYm9keS5zY3JvbGxIZWlnaHQgPiB3aW5kb3cuaW5uZXJIZWlnaHQpIHtcbiAgICAgIC8vIGFkZCBwYWRkaW5nIHNvIHRoZSBjb250ZW50IGRvZXNuJ3Qgc2hpZnQgYWZ0ZXIgcmVtb3ZhbCBvZiBzY3JvbGxiYXJcbiAgICAgIHN0YXRlcy5wcmV2aW91c0JvZHlQYWRkaW5nID0gcGFyc2VJbnQod2luZG93LmdldENvbXB1dGVkU3R5bGUoZG9jdW1lbnQuYm9keSkuZ2V0UHJvcGVydHlWYWx1ZSgncGFkZGluZy1yaWdodCcpKTtcbiAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUucGFkZGluZ1JpZ2h0ID0gXCJcIi5jb25jYXQoc3RhdGVzLnByZXZpb3VzQm9keVBhZGRpbmcgKyBtZWFzdXJlU2Nyb2xsYmFyKCksIFwicHhcIik7XG4gICAgfVxuICB9O1xuICBjb25zdCB1bmRvU2Nyb2xsYmFyID0gKCkgPT4ge1xuICAgIGlmIChzdGF0ZXMucHJldmlvdXNCb2R5UGFkZGluZyAhPT0gbnVsbCkge1xuICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS5wYWRkaW5nUmlnaHQgPSBcIlwiLmNvbmNhdChzdGF0ZXMucHJldmlvdXNCb2R5UGFkZGluZywgXCJweFwiKTtcbiAgICAgIHN0YXRlcy5wcmV2aW91c0JvZHlQYWRkaW5nID0gbnVsbDtcbiAgICB9XG4gIH07XG5cbiAgLypcbiAgICogSW5zdGFuY2UgbWV0aG9kIHRvIGNsb3NlIHN3ZWV0QWxlcnRcbiAgICovXG5cbiAgZnVuY3Rpb24gcmVtb3ZlUG9wdXBBbmRSZXNldFN0YXRlKGluc3RhbmNlLCBjb250YWluZXIsIHJldHVybkZvY3VzLCBkaWRDbG9zZSkge1xuICAgIGlmIChpc1RvYXN0KCkpIHtcbiAgICAgIHRyaWdnZXJEaWRDbG9zZUFuZERpc3Bvc2UoaW5zdGFuY2UsIGRpZENsb3NlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdG9yZUFjdGl2ZUVsZW1lbnQocmV0dXJuRm9jdXMpLnRoZW4oKCkgPT4gdHJpZ2dlckRpZENsb3NlQW5kRGlzcG9zZShpbnN0YW5jZSwgZGlkQ2xvc2UpKTtcbiAgICAgIHJlbW92ZUtleWRvd25IYW5kbGVyKGdsb2JhbFN0YXRlKTtcbiAgICB9XG4gICAgY29uc3QgaXNTYWZhcmkgPSAvXigoPyFjaHJvbWV8YW5kcm9pZCkuKSpzYWZhcmkvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO1xuICAgIC8vIHdvcmthcm91bmQgZm9yICMyMDg4XG4gICAgLy8gZm9yIHNvbWUgcmVhc29uIHJlbW92aW5nIHRoZSBjb250YWluZXIgaW4gU2FmYXJpIHdpbGwgc2Nyb2xsIHRoZSBkb2N1bWVudCB0byBib3R0b21cbiAgICBpZiAoaXNTYWZhcmkpIHtcbiAgICAgIGNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJ2Rpc3BsYXk6bm9uZSAhaW1wb3J0YW50Jyk7XG4gICAgICBjb250YWluZXIucmVtb3ZlQXR0cmlidXRlKCdjbGFzcycpO1xuICAgICAgY29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb250YWluZXIucmVtb3ZlKCk7XG4gICAgfVxuICAgIGlmIChpc01vZGFsKCkpIHtcbiAgICAgIHVuZG9TY3JvbGxiYXIoKTtcbiAgICAgIHVuZG9JT1NmaXgoKTtcbiAgICAgIHVuc2V0QXJpYUhpZGRlbigpO1xuICAgIH1cbiAgICByZW1vdmVCb2R5Q2xhc3NlcygpO1xuICB9XG4gIGZ1bmN0aW9uIHJlbW92ZUJvZHlDbGFzc2VzKCkge1xuICAgIHJlbW92ZUNsYXNzKFtkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsIGRvY3VtZW50LmJvZHldLCBbc3dhbENsYXNzZXMuc2hvd24sIHN3YWxDbGFzc2VzWydoZWlnaHQtYXV0byddLCBzd2FsQ2xhc3Nlc1snbm8tYmFja2Ryb3AnXSwgc3dhbENsYXNzZXNbJ3RvYXN0LXNob3duJ11dKTtcbiAgfVxuICBmdW5jdGlvbiBjbG9zZShyZXNvbHZlVmFsdWUpIHtcbiAgICByZXNvbHZlVmFsdWUgPSBwcmVwYXJlUmVzb2x2ZVZhbHVlKHJlc29sdmVWYWx1ZSk7XG4gICAgY29uc3Qgc3dhbFByb21pc2VSZXNvbHZlID0gcHJpdmF0ZU1ldGhvZHMuc3dhbFByb21pc2VSZXNvbHZlLmdldCh0aGlzKTtcbiAgICBjb25zdCBkaWRDbG9zZSA9IHRyaWdnZXJDbG9zZVBvcHVwKHRoaXMpO1xuICAgIGlmICh0aGlzLmlzQXdhaXRpbmdQcm9taXNlKCkpIHtcbiAgICAgIC8vIEEgc3dhbCBhd2FpdGluZyBmb3IgYSBwcm9taXNlIChhZnRlciBhIGNsaWNrIG9uIENvbmZpcm0gb3IgRGVueSkgY2Fubm90IGJlIGRpc21pc3NlZCBhbnltb3JlICMyMzM1XG4gICAgICBpZiAoIXJlc29sdmVWYWx1ZS5pc0Rpc21pc3NlZCkge1xuICAgICAgICBoYW5kbGVBd2FpdGluZ1Byb21pc2UodGhpcyk7XG4gICAgICAgIHN3YWxQcm9taXNlUmVzb2x2ZShyZXNvbHZlVmFsdWUpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZGlkQ2xvc2UpIHtcbiAgICAgIC8vIFJlc29sdmUgU3dhbCBwcm9taXNlXG4gICAgICBzd2FsUHJvbWlzZVJlc29sdmUocmVzb2x2ZVZhbHVlKTtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gaXNBd2FpdGluZ1Byb21pc2UoKSB7XG4gICAgcmV0dXJuICEhcHJpdmF0ZVByb3BzLmF3YWl0aW5nUHJvbWlzZS5nZXQodGhpcyk7XG4gIH1cbiAgY29uc3QgdHJpZ2dlckNsb3NlUG9wdXAgPSBpbnN0YW5jZSA9PiB7XG4gICAgY29uc3QgcG9wdXAgPSBnZXRQb3B1cCgpO1xuICAgIGlmICghcG9wdXApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgY29uc3QgaW5uZXJQYXJhbXMgPSBwcml2YXRlUHJvcHMuaW5uZXJQYXJhbXMuZ2V0KGluc3RhbmNlKTtcbiAgICBpZiAoIWlubmVyUGFyYW1zIHx8IGhhc0NsYXNzKHBvcHVwLCBpbm5lclBhcmFtcy5oaWRlQ2xhc3MucG9wdXApKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJlbW92ZUNsYXNzKHBvcHVwLCBpbm5lclBhcmFtcy5zaG93Q2xhc3MucG9wdXApO1xuICAgIGFkZENsYXNzKHBvcHVwLCBpbm5lclBhcmFtcy5oaWRlQ2xhc3MucG9wdXApO1xuICAgIGNvbnN0IGJhY2tkcm9wID0gZ2V0Q29udGFpbmVyKCk7XG4gICAgcmVtb3ZlQ2xhc3MoYmFja2Ryb3AsIGlubmVyUGFyYW1zLnNob3dDbGFzcy5iYWNrZHJvcCk7XG4gICAgYWRkQ2xhc3MoYmFja2Ryb3AsIGlubmVyUGFyYW1zLmhpZGVDbGFzcy5iYWNrZHJvcCk7XG4gICAgaGFuZGxlUG9wdXBBbmltYXRpb24oaW5zdGFuY2UsIHBvcHVwLCBpbm5lclBhcmFtcyk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG4gIGZ1bmN0aW9uIHJlamVjdFByb21pc2UoZXJyb3IpIHtcbiAgICBjb25zdCByZWplY3RQcm9taXNlID0gcHJpdmF0ZU1ldGhvZHMuc3dhbFByb21pc2VSZWplY3QuZ2V0KHRoaXMpO1xuICAgIGhhbmRsZUF3YWl0aW5nUHJvbWlzZSh0aGlzKTtcbiAgICBpZiAocmVqZWN0UHJvbWlzZSkge1xuICAgICAgLy8gUmVqZWN0IFN3YWwgcHJvbWlzZVxuICAgICAgcmVqZWN0UHJvbWlzZShlcnJvcik7XG4gICAgfVxuICB9XG4gIGNvbnN0IGhhbmRsZUF3YWl0aW5nUHJvbWlzZSA9IGluc3RhbmNlID0+IHtcbiAgICBpZiAoaW5zdGFuY2UuaXNBd2FpdGluZ1Byb21pc2UoKSkge1xuICAgICAgcHJpdmF0ZVByb3BzLmF3YWl0aW5nUHJvbWlzZS5kZWxldGUoaW5zdGFuY2UpO1xuICAgICAgLy8gVGhlIGluc3RhbmNlIG1pZ2h0IGhhdmUgYmVlbiBwcmV2aW91c2x5IHBhcnRseSBkZXN0cm95ZWQsIHdlIG11c3QgcmVzdW1lIHRoZSBkZXN0cm95IHByb2Nlc3MgaW4gdGhpcyBjYXNlICMyMzM1XG4gICAgICBpZiAoIXByaXZhdGVQcm9wcy5pbm5lclBhcmFtcy5nZXQoaW5zdGFuY2UpKSB7XG4gICAgICAgIGluc3RhbmNlLl9kZXN0cm95KCk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuICBjb25zdCBwcmVwYXJlUmVzb2x2ZVZhbHVlID0gcmVzb2x2ZVZhbHVlID0+IHtcbiAgICAvLyBXaGVuIHVzZXIgY2FsbHMgU3dhbC5jbG9zZSgpXG4gICAgaWYgKHR5cGVvZiByZXNvbHZlVmFsdWUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBpc0NvbmZpcm1lZDogZmFsc2UsXG4gICAgICAgIGlzRGVuaWVkOiBmYWxzZSxcbiAgICAgICAgaXNEaXNtaXNzZWQ6IHRydWVcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHtcbiAgICAgIGlzQ29uZmlybWVkOiBmYWxzZSxcbiAgICAgIGlzRGVuaWVkOiBmYWxzZSxcbiAgICAgIGlzRGlzbWlzc2VkOiBmYWxzZVxuICAgIH0sIHJlc29sdmVWYWx1ZSk7XG4gIH07XG4gIGNvbnN0IGhhbmRsZVBvcHVwQW5pbWF0aW9uID0gKGluc3RhbmNlLCBwb3B1cCwgaW5uZXJQYXJhbXMpID0+IHtcbiAgICBjb25zdCBjb250YWluZXIgPSBnZXRDb250YWluZXIoKTtcbiAgICAvLyBJZiBhbmltYXRpb24gaXMgc3VwcG9ydGVkLCBhbmltYXRlXG4gICAgY29uc3QgYW5pbWF0aW9uSXNTdXBwb3J0ZWQgPSBhbmltYXRpb25FbmRFdmVudCAmJiBoYXNDc3NBbmltYXRpb24ocG9wdXApO1xuICAgIGlmICh0eXBlb2YgaW5uZXJQYXJhbXMud2lsbENsb3NlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBpbm5lclBhcmFtcy53aWxsQ2xvc2UocG9wdXApO1xuICAgIH1cbiAgICBpZiAoYW5pbWF0aW9uSXNTdXBwb3J0ZWQpIHtcbiAgICAgIGFuaW1hdGVQb3B1cChpbnN0YW5jZSwgcG9wdXAsIGNvbnRhaW5lciwgaW5uZXJQYXJhbXMucmV0dXJuRm9jdXMsIGlubmVyUGFyYW1zLmRpZENsb3NlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gT3RoZXJ3aXNlLCByZW1vdmUgaW1tZWRpYXRlbHlcbiAgICAgIHJlbW92ZVBvcHVwQW5kUmVzZXRTdGF0ZShpbnN0YW5jZSwgY29udGFpbmVyLCBpbm5lclBhcmFtcy5yZXR1cm5Gb2N1cywgaW5uZXJQYXJhbXMuZGlkQ2xvc2UpO1xuICAgIH1cbiAgfTtcbiAgY29uc3QgYW5pbWF0ZVBvcHVwID0gKGluc3RhbmNlLCBwb3B1cCwgY29udGFpbmVyLCByZXR1cm5Gb2N1cywgZGlkQ2xvc2UpID0+IHtcbiAgICBnbG9iYWxTdGF0ZS5zd2FsQ2xvc2VFdmVudEZpbmlzaGVkQ2FsbGJhY2sgPSByZW1vdmVQb3B1cEFuZFJlc2V0U3RhdGUuYmluZChudWxsLCBpbnN0YW5jZSwgY29udGFpbmVyLCByZXR1cm5Gb2N1cywgZGlkQ2xvc2UpO1xuICAgIHBvcHVwLmFkZEV2ZW50TGlzdGVuZXIoYW5pbWF0aW9uRW5kRXZlbnQsIGZ1bmN0aW9uIChlKSB7XG4gICAgICBpZiAoZS50YXJnZXQgPT09IHBvcHVwKSB7XG4gICAgICAgIGdsb2JhbFN0YXRlLnN3YWxDbG9zZUV2ZW50RmluaXNoZWRDYWxsYmFjaygpO1xuICAgICAgICBkZWxldGUgZ2xvYmFsU3RhdGUuc3dhbENsb3NlRXZlbnRGaW5pc2hlZENhbGxiYWNrO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuICBjb25zdCB0cmlnZ2VyRGlkQ2xvc2VBbmREaXNwb3NlID0gKGluc3RhbmNlLCBkaWRDbG9zZSkgPT4ge1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgaWYgKHR5cGVvZiBkaWRDbG9zZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBkaWRDbG9zZS5iaW5kKGluc3RhbmNlLnBhcmFtcykoKTtcbiAgICAgIH1cbiAgICAgIGluc3RhbmNlLl9kZXN0cm95KCk7XG4gICAgfSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydDJ9IGluc3RhbmNlXG4gICAqIEBwYXJhbSB7c3RyaW5nW119IGJ1dHRvbnNcbiAgICogQHBhcmFtIHtib29sZWFufSBkaXNhYmxlZFxuICAgKi9cbiAgZnVuY3Rpb24gc2V0QnV0dG9uc0Rpc2FibGVkKGluc3RhbmNlLCBidXR0b25zLCBkaXNhYmxlZCkge1xuICAgIGNvbnN0IGRvbUNhY2hlID0gcHJpdmF0ZVByb3BzLmRvbUNhY2hlLmdldChpbnN0YW5jZSk7XG4gICAgYnV0dG9ucy5mb3JFYWNoKGJ1dHRvbiA9PiB7XG4gICAgICBkb21DYWNoZVtidXR0b25dLmRpc2FibGVkID0gZGlzYWJsZWQ7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtIVE1MSW5wdXRFbGVtZW50fSBpbnB1dFxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGRpc2FibGVkXG4gICAqL1xuICBmdW5jdGlvbiBzZXRJbnB1dERpc2FibGVkKGlucHV0LCBkaXNhYmxlZCkge1xuICAgIGlmICghaW5wdXQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKGlucHV0LnR5cGUgPT09ICdyYWRpbycpIHtcbiAgICAgIGNvbnN0IHJhZGlvc0NvbnRhaW5lciA9IGlucHV0LnBhcmVudE5vZGUucGFyZW50Tm9kZTtcbiAgICAgIGNvbnN0IHJhZGlvcyA9IHJhZGlvc0NvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dCcpO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByYWRpb3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgcmFkaW9zW2ldLmRpc2FibGVkID0gZGlzYWJsZWQ7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlucHV0LmRpc2FibGVkID0gZGlzYWJsZWQ7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIGVuYWJsZUJ1dHRvbnMoKSB7XG4gICAgc2V0QnV0dG9uc0Rpc2FibGVkKHRoaXMsIFsnY29uZmlybUJ1dHRvbicsICdkZW55QnV0dG9uJywgJ2NhbmNlbEJ1dHRvbiddLCBmYWxzZSk7XG4gIH1cbiAgZnVuY3Rpb24gZGlzYWJsZUJ1dHRvbnMoKSB7XG4gICAgc2V0QnV0dG9uc0Rpc2FibGVkKHRoaXMsIFsnY29uZmlybUJ1dHRvbicsICdkZW55QnV0dG9uJywgJ2NhbmNlbEJ1dHRvbiddLCB0cnVlKTtcbiAgfVxuICBmdW5jdGlvbiBlbmFibGVJbnB1dCgpIHtcbiAgICBzZXRJbnB1dERpc2FibGVkKHRoaXMuZ2V0SW5wdXQoKSwgZmFsc2UpO1xuICB9XG4gIGZ1bmN0aW9uIGRpc2FibGVJbnB1dCgpIHtcbiAgICBzZXRJbnB1dERpc2FibGVkKHRoaXMuZ2V0SW5wdXQoKSwgdHJ1ZSk7XG4gIH1cblxuICAvLyBTaG93IGJsb2NrIHdpdGggdmFsaWRhdGlvbiBtZXNzYWdlXG4gIGZ1bmN0aW9uIHNob3dWYWxpZGF0aW9uTWVzc2FnZShlcnJvcikge1xuICAgIGNvbnN0IGRvbUNhY2hlID0gcHJpdmF0ZVByb3BzLmRvbUNhY2hlLmdldCh0aGlzKTtcbiAgICBjb25zdCBwYXJhbXMgPSBwcml2YXRlUHJvcHMuaW5uZXJQYXJhbXMuZ2V0KHRoaXMpO1xuICAgIHNldElubmVySHRtbChkb21DYWNoZS52YWxpZGF0aW9uTWVzc2FnZSwgZXJyb3IpO1xuICAgIGRvbUNhY2hlLnZhbGlkYXRpb25NZXNzYWdlLmNsYXNzTmFtZSA9IHN3YWxDbGFzc2VzWyd2YWxpZGF0aW9uLW1lc3NhZ2UnXTtcbiAgICBpZiAocGFyYW1zLmN1c3RvbUNsYXNzICYmIHBhcmFtcy5jdXN0b21DbGFzcy52YWxpZGF0aW9uTWVzc2FnZSkge1xuICAgICAgYWRkQ2xhc3MoZG9tQ2FjaGUudmFsaWRhdGlvbk1lc3NhZ2UsIHBhcmFtcy5jdXN0b21DbGFzcy52YWxpZGF0aW9uTWVzc2FnZSk7XG4gICAgfVxuICAgIHNob3coZG9tQ2FjaGUudmFsaWRhdGlvbk1lc3NhZ2UpO1xuICAgIGNvbnN0IGlucHV0ID0gdGhpcy5nZXRJbnB1dCgpO1xuICAgIGlmIChpbnB1dCkge1xuICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKCdhcmlhLWludmFsaWQnLCB0cnVlKTtcbiAgICAgIGlucHV0LnNldEF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScsIHN3YWxDbGFzc2VzWyd2YWxpZGF0aW9uLW1lc3NhZ2UnXSk7XG4gICAgICBmb2N1c0lucHV0KGlucHV0KTtcbiAgICAgIGFkZENsYXNzKGlucHV0LCBzd2FsQ2xhc3Nlcy5pbnB1dGVycm9yKTtcbiAgICB9XG4gIH1cblxuICAvLyBIaWRlIGJsb2NrIHdpdGggdmFsaWRhdGlvbiBtZXNzYWdlXG4gIGZ1bmN0aW9uIHJlc2V0VmFsaWRhdGlvbk1lc3NhZ2UkMSgpIHtcbiAgICBjb25zdCBkb21DYWNoZSA9IHByaXZhdGVQcm9wcy5kb21DYWNoZS5nZXQodGhpcyk7XG4gICAgaWYgKGRvbUNhY2hlLnZhbGlkYXRpb25NZXNzYWdlKSB7XG4gICAgICBoaWRlKGRvbUNhY2hlLnZhbGlkYXRpb25NZXNzYWdlKTtcbiAgICB9XG4gICAgY29uc3QgaW5wdXQgPSB0aGlzLmdldElucHV0KCk7XG4gICAgaWYgKGlucHV0KSB7XG4gICAgICBpbnB1dC5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtaW52YWxpZCcpO1xuICAgICAgaW5wdXQucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5Jyk7XG4gICAgICByZW1vdmVDbGFzcyhpbnB1dCwgc3dhbENsYXNzZXMuaW5wdXRlcnJvcik7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0UHJvZ3Jlc3NTdGVwcyQxKCkge1xuICAgIGNvbnN0IGRvbUNhY2hlID0gcHJpdmF0ZVByb3BzLmRvbUNhY2hlLmdldCh0aGlzKTtcbiAgICByZXR1cm4gZG9tQ2FjaGUucHJvZ3Jlc3NTdGVwcztcbiAgfVxuXG4gIGNvbnN0IGRlZmF1bHRQYXJhbXMgPSB7XG4gICAgdGl0bGU6ICcnLFxuICAgIHRpdGxlVGV4dDogJycsXG4gICAgdGV4dDogJycsXG4gICAgaHRtbDogJycsXG4gICAgZm9vdGVyOiAnJyxcbiAgICBpY29uOiB1bmRlZmluZWQsXG4gICAgaWNvbkNvbG9yOiB1bmRlZmluZWQsXG4gICAgaWNvbkh0bWw6IHVuZGVmaW5lZCxcbiAgICB0ZW1wbGF0ZTogdW5kZWZpbmVkLFxuICAgIHRvYXN0OiBmYWxzZSxcbiAgICBzaG93Q2xhc3M6IHtcbiAgICAgIHBvcHVwOiAnc3dhbDItc2hvdycsXG4gICAgICBiYWNrZHJvcDogJ3N3YWwyLWJhY2tkcm9wLXNob3cnLFxuICAgICAgaWNvbjogJ3N3YWwyLWljb24tc2hvdydcbiAgICB9LFxuICAgIGhpZGVDbGFzczoge1xuICAgICAgcG9wdXA6ICdzd2FsMi1oaWRlJyxcbiAgICAgIGJhY2tkcm9wOiAnc3dhbDItYmFja2Ryb3AtaGlkZScsXG4gICAgICBpY29uOiAnc3dhbDItaWNvbi1oaWRlJ1xuICAgIH0sXG4gICAgY3VzdG9tQ2xhc3M6IHt9LFxuICAgIHRhcmdldDogJ2JvZHknLFxuICAgIGNvbG9yOiB1bmRlZmluZWQsXG4gICAgYmFja2Ryb3A6IHRydWUsXG4gICAgaGVpZ2h0QXV0bzogdHJ1ZSxcbiAgICBhbGxvd091dHNpZGVDbGljazogdHJ1ZSxcbiAgICBhbGxvd0VzY2FwZUtleTogdHJ1ZSxcbiAgICBhbGxvd0VudGVyS2V5OiB0cnVlLFxuICAgIHN0b3BLZXlkb3duUHJvcGFnYXRpb246IHRydWUsXG4gICAga2V5ZG93bkxpc3RlbmVyQ2FwdHVyZTogZmFsc2UsXG4gICAgc2hvd0NvbmZpcm1CdXR0b246IHRydWUsXG4gICAgc2hvd0RlbnlCdXR0b246IGZhbHNlLFxuICAgIHNob3dDYW5jZWxCdXR0b246IGZhbHNlLFxuICAgIHByZUNvbmZpcm06IHVuZGVmaW5lZCxcbiAgICBwcmVEZW55OiB1bmRlZmluZWQsXG4gICAgY29uZmlybUJ1dHRvblRleHQ6ICdPSycsXG4gICAgY29uZmlybUJ1dHRvbkFyaWFMYWJlbDogJycsXG4gICAgY29uZmlybUJ1dHRvbkNvbG9yOiB1bmRlZmluZWQsXG4gICAgZGVueUJ1dHRvblRleHQ6ICdObycsXG4gICAgZGVueUJ1dHRvbkFyaWFMYWJlbDogJycsXG4gICAgZGVueUJ1dHRvbkNvbG9yOiB1bmRlZmluZWQsXG4gICAgY2FuY2VsQnV0dG9uVGV4dDogJ0NhbmNlbCcsXG4gICAgY2FuY2VsQnV0dG9uQXJpYUxhYmVsOiAnJyxcbiAgICBjYW5jZWxCdXR0b25Db2xvcjogdW5kZWZpbmVkLFxuICAgIGJ1dHRvbnNTdHlsaW5nOiB0cnVlLFxuICAgIHJldmVyc2VCdXR0b25zOiBmYWxzZSxcbiAgICBmb2N1c0NvbmZpcm06IHRydWUsXG4gICAgZm9jdXNEZW55OiBmYWxzZSxcbiAgICBmb2N1c0NhbmNlbDogZmFsc2UsXG4gICAgcmV0dXJuRm9jdXM6IHRydWUsXG4gICAgc2hvd0Nsb3NlQnV0dG9uOiBmYWxzZSxcbiAgICBjbG9zZUJ1dHRvbkh0bWw6ICcmdGltZXM7JyxcbiAgICBjbG9zZUJ1dHRvbkFyaWFMYWJlbDogJ0Nsb3NlIHRoaXMgZGlhbG9nJyxcbiAgICBsb2FkZXJIdG1sOiAnJyxcbiAgICBzaG93TG9hZGVyT25Db25maXJtOiBmYWxzZSxcbiAgICBzaG93TG9hZGVyT25EZW55OiBmYWxzZSxcbiAgICBpbWFnZVVybDogdW5kZWZpbmVkLFxuICAgIGltYWdlV2lkdGg6IHVuZGVmaW5lZCxcbiAgICBpbWFnZUhlaWdodDogdW5kZWZpbmVkLFxuICAgIGltYWdlQWx0OiAnJyxcbiAgICB0aW1lcjogdW5kZWZpbmVkLFxuICAgIHRpbWVyUHJvZ3Jlc3NCYXI6IGZhbHNlLFxuICAgIHdpZHRoOiB1bmRlZmluZWQsXG4gICAgcGFkZGluZzogdW5kZWZpbmVkLFxuICAgIGJhY2tncm91bmQ6IHVuZGVmaW5lZCxcbiAgICBpbnB1dDogdW5kZWZpbmVkLFxuICAgIGlucHV0UGxhY2Vob2xkZXI6ICcnLFxuICAgIGlucHV0TGFiZWw6ICcnLFxuICAgIGlucHV0VmFsdWU6ICcnLFxuICAgIGlucHV0T3B0aW9uczoge30sXG4gICAgaW5wdXRBdXRvVHJpbTogdHJ1ZSxcbiAgICBpbnB1dEF0dHJpYnV0ZXM6IHt9LFxuICAgIGlucHV0VmFsaWRhdG9yOiB1bmRlZmluZWQsXG4gICAgcmV0dXJuSW5wdXRWYWx1ZU9uRGVueTogZmFsc2UsXG4gICAgdmFsaWRhdGlvbk1lc3NhZ2U6IHVuZGVmaW5lZCxcbiAgICBncm93OiBmYWxzZSxcbiAgICBwb3NpdGlvbjogJ2NlbnRlcicsXG4gICAgcHJvZ3Jlc3NTdGVwczogW10sXG4gICAgY3VycmVudFByb2dyZXNzU3RlcDogdW5kZWZpbmVkLFxuICAgIHByb2dyZXNzU3RlcHNEaXN0YW5jZTogdW5kZWZpbmVkLFxuICAgIHdpbGxPcGVuOiB1bmRlZmluZWQsXG4gICAgZGlkT3BlbjogdW5kZWZpbmVkLFxuICAgIGRpZFJlbmRlcjogdW5kZWZpbmVkLFxuICAgIHdpbGxDbG9zZTogdW5kZWZpbmVkLFxuICAgIGRpZENsb3NlOiB1bmRlZmluZWQsXG4gICAgZGlkRGVzdHJveTogdW5kZWZpbmVkLFxuICAgIHNjcm9sbGJhclBhZGRpbmc6IHRydWVcbiAgfTtcbiAgY29uc3QgdXBkYXRhYmxlUGFyYW1zID0gWydhbGxvd0VzY2FwZUtleScsICdhbGxvd091dHNpZGVDbGljaycsICdiYWNrZ3JvdW5kJywgJ2J1dHRvbnNTdHlsaW5nJywgJ2NhbmNlbEJ1dHRvbkFyaWFMYWJlbCcsICdjYW5jZWxCdXR0b25Db2xvcicsICdjYW5jZWxCdXR0b25UZXh0JywgJ2Nsb3NlQnV0dG9uQXJpYUxhYmVsJywgJ2Nsb3NlQnV0dG9uSHRtbCcsICdjb2xvcicsICdjb25maXJtQnV0dG9uQXJpYUxhYmVsJywgJ2NvbmZpcm1CdXR0b25Db2xvcicsICdjb25maXJtQnV0dG9uVGV4dCcsICdjdXJyZW50UHJvZ3Jlc3NTdGVwJywgJ2N1c3RvbUNsYXNzJywgJ2RlbnlCdXR0b25BcmlhTGFiZWwnLCAnZGVueUJ1dHRvbkNvbG9yJywgJ2RlbnlCdXR0b25UZXh0JywgJ2RpZENsb3NlJywgJ2RpZERlc3Ryb3knLCAnZm9vdGVyJywgJ2hpZGVDbGFzcycsICdodG1sJywgJ2ljb24nLCAnaWNvbkNvbG9yJywgJ2ljb25IdG1sJywgJ2ltYWdlQWx0JywgJ2ltYWdlSGVpZ2h0JywgJ2ltYWdlVXJsJywgJ2ltYWdlV2lkdGgnLCAncHJlQ29uZmlybScsICdwcmVEZW55JywgJ3Byb2dyZXNzU3RlcHMnLCAncmV0dXJuRm9jdXMnLCAncmV2ZXJzZUJ1dHRvbnMnLCAnc2hvd0NhbmNlbEJ1dHRvbicsICdzaG93Q2xvc2VCdXR0b24nLCAnc2hvd0NvbmZpcm1CdXR0b24nLCAnc2hvd0RlbnlCdXR0b24nLCAndGV4dCcsICd0aXRsZScsICd0aXRsZVRleHQnLCAnd2lsbENsb3NlJ107XG4gIGNvbnN0IGRlcHJlY2F0ZWRQYXJhbXMgPSB7fTtcbiAgY29uc3QgdG9hc3RJbmNvbXBhdGlibGVQYXJhbXMgPSBbJ2FsbG93T3V0c2lkZUNsaWNrJywgJ2FsbG93RW50ZXJLZXknLCAnYmFja2Ryb3AnLCAnZm9jdXNDb25maXJtJywgJ2ZvY3VzRGVueScsICdmb2N1c0NhbmNlbCcsICdyZXR1cm5Gb2N1cycsICdoZWlnaHRBdXRvJywgJ2tleWRvd25MaXN0ZW5lckNhcHR1cmUnXTtcblxuICAvKipcbiAgICogSXMgdmFsaWQgcGFyYW1ldGVyXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXJhbU5hbWVcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuICBjb25zdCBpc1ZhbGlkUGFyYW1ldGVyID0gcGFyYW1OYW1lID0+IHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGRlZmF1bHRQYXJhbXMsIHBhcmFtTmFtZSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIElzIHZhbGlkIHBhcmFtZXRlciBmb3IgU3dhbC51cGRhdGUoKSBtZXRob2RcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHBhcmFtTmFtZVxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG4gIGNvbnN0IGlzVXBkYXRhYmxlUGFyYW1ldGVyID0gcGFyYW1OYW1lID0+IHtcbiAgICByZXR1cm4gdXBkYXRhYmxlUGFyYW1zLmluZGV4T2YocGFyYW1OYW1lKSAhPT0gLTE7XG4gIH07XG5cbiAgLyoqXG4gICAqIElzIGRlcHJlY2F0ZWQgcGFyYW1ldGVyXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXJhbU5hbWVcbiAgICogQHJldHVybnMge3N0cmluZyB8IHVuZGVmaW5lZH1cbiAgICovXG4gIGNvbnN0IGlzRGVwcmVjYXRlZFBhcmFtZXRlciA9IHBhcmFtTmFtZSA9PiB7XG4gICAgcmV0dXJuIGRlcHJlY2F0ZWRQYXJhbXNbcGFyYW1OYW1lXTtcbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IHBhcmFtXG4gICAqL1xuICBjb25zdCBjaGVja0lmUGFyYW1Jc1ZhbGlkID0gcGFyYW0gPT4ge1xuICAgIGlmICghaXNWYWxpZFBhcmFtZXRlcihwYXJhbSkpIHtcbiAgICAgIHdhcm4oXCJVbmtub3duIHBhcmFtZXRlciBcXFwiXCIuY29uY2F0KHBhcmFtLCBcIlxcXCJcIikpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IHBhcmFtXG4gICAqL1xuICBjb25zdCBjaGVja0lmVG9hc3RQYXJhbUlzVmFsaWQgPSBwYXJhbSA9PiB7XG4gICAgaWYgKHRvYXN0SW5jb21wYXRpYmxlUGFyYW1zLmluY2x1ZGVzKHBhcmFtKSkge1xuICAgICAgd2FybihcIlRoZSBwYXJhbWV0ZXIgXFxcIlwiLmNvbmNhdChwYXJhbSwgXCJcXFwiIGlzIGluY29tcGF0aWJsZSB3aXRoIHRvYXN0c1wiKSk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGFyYW1cbiAgICovXG4gIGNvbnN0IGNoZWNrSWZQYXJhbUlzRGVwcmVjYXRlZCA9IHBhcmFtID0+IHtcbiAgICBpZiAoaXNEZXByZWNhdGVkUGFyYW1ldGVyKHBhcmFtKSkge1xuICAgICAgd2FybkFib3V0RGVwcmVjYXRpb24ocGFyYW0sIGlzRGVwcmVjYXRlZFBhcmFtZXRlcihwYXJhbSkpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogU2hvdyByZWxldmFudCB3YXJuaW5ncyBmb3IgZ2l2ZW4gcGFyYW1zXG4gICAqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKi9cbiAgY29uc3Qgc2hvd1dhcm5pbmdzRm9yUGFyYW1zID0gcGFyYW1zID0+IHtcbiAgICBpZiAocGFyYW1zLmJhY2tkcm9wID09PSBmYWxzZSAmJiBwYXJhbXMuYWxsb3dPdXRzaWRlQ2xpY2spIHtcbiAgICAgIHdhcm4oJ1wiYWxsb3dPdXRzaWRlQ2xpY2tcIiBwYXJhbWV0ZXIgcmVxdWlyZXMgYGJhY2tkcm9wYCBwYXJhbWV0ZXIgdG8gYmUgc2V0IHRvIGB0cnVlYCcpO1xuICAgIH1cbiAgICBmb3IgKGNvbnN0IHBhcmFtIGluIHBhcmFtcykge1xuICAgICAgY2hlY2tJZlBhcmFtSXNWYWxpZChwYXJhbSk7XG4gICAgICBpZiAocGFyYW1zLnRvYXN0KSB7XG4gICAgICAgIGNoZWNrSWZUb2FzdFBhcmFtSXNWYWxpZChwYXJhbSk7XG4gICAgICB9XG4gICAgICBjaGVja0lmUGFyYW1Jc0RlcHJlY2F0ZWQocGFyYW0pO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogVXBkYXRlcyBwb3B1cCBwYXJhbWV0ZXJzLlxuICAgKi9cbiAgZnVuY3Rpb24gdXBkYXRlKHBhcmFtcykge1xuICAgIGNvbnN0IHBvcHVwID0gZ2V0UG9wdXAoKTtcbiAgICBjb25zdCBpbm5lclBhcmFtcyA9IHByaXZhdGVQcm9wcy5pbm5lclBhcmFtcy5nZXQodGhpcyk7XG4gICAgaWYgKCFwb3B1cCB8fCBoYXNDbGFzcyhwb3B1cCwgaW5uZXJQYXJhbXMuaGlkZUNsYXNzLnBvcHVwKSkge1xuICAgICAgcmV0dXJuIHdhcm4oXCJZb3UncmUgdHJ5aW5nIHRvIHVwZGF0ZSB0aGUgY2xvc2VkIG9yIGNsb3NpbmcgcG9wdXAsIHRoYXQgd29uJ3Qgd29yay4gVXNlIHRoZSB1cGRhdGUoKSBtZXRob2QgaW4gcHJlQ29uZmlybSBwYXJhbWV0ZXIgb3Igc2hvdyBhIG5ldyBwb3B1cC5cIik7XG4gICAgfVxuICAgIGNvbnN0IHZhbGlkVXBkYXRhYmxlUGFyYW1zID0gZmlsdGVyVmFsaWRQYXJhbXMocGFyYW1zKTtcbiAgICBjb25zdCB1cGRhdGVkUGFyYW1zID0gT2JqZWN0LmFzc2lnbih7fSwgaW5uZXJQYXJhbXMsIHZhbGlkVXBkYXRhYmxlUGFyYW1zKTtcbiAgICByZW5kZXIodGhpcywgdXBkYXRlZFBhcmFtcyk7XG4gICAgcHJpdmF0ZVByb3BzLmlubmVyUGFyYW1zLnNldCh0aGlzLCB1cGRhdGVkUGFyYW1zKTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCB7XG4gICAgICBwYXJhbXM6IHtcbiAgICAgICAgdmFsdWU6IE9iamVjdC5hc3NpZ24oe30sIHRoaXMucGFyYW1zLCBwYXJhbXMpLFxuICAgICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICBjb25zdCBmaWx0ZXJWYWxpZFBhcmFtcyA9IHBhcmFtcyA9PiB7XG4gICAgY29uc3QgdmFsaWRVcGRhdGFibGVQYXJhbXMgPSB7fTtcbiAgICBPYmplY3Qua2V5cyhwYXJhbXMpLmZvckVhY2gocGFyYW0gPT4ge1xuICAgICAgaWYgKGlzVXBkYXRhYmxlUGFyYW1ldGVyKHBhcmFtKSkge1xuICAgICAgICB2YWxpZFVwZGF0YWJsZVBhcmFtc1twYXJhbV0gPSBwYXJhbXNbcGFyYW1dO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgd2FybihcIkludmFsaWQgcGFyYW1ldGVyIHRvIHVwZGF0ZTogXCIuY29uY2F0KHBhcmFtKSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHZhbGlkVXBkYXRhYmxlUGFyYW1zO1xuICB9O1xuXG4gIGZ1bmN0aW9uIF9kZXN0cm95KCkge1xuICAgIGNvbnN0IGRvbUNhY2hlID0gcHJpdmF0ZVByb3BzLmRvbUNhY2hlLmdldCh0aGlzKTtcbiAgICBjb25zdCBpbm5lclBhcmFtcyA9IHByaXZhdGVQcm9wcy5pbm5lclBhcmFtcy5nZXQodGhpcyk7XG4gICAgaWYgKCFpbm5lclBhcmFtcykge1xuICAgICAgZGlzcG9zZVdlYWtNYXBzKHRoaXMpOyAvLyBUaGUgV2Vha01hcHMgbWlnaHQgaGF2ZSBiZWVuIHBhcnRseSBkZXN0cm95ZWQsIHdlIG11c3QgcmVjYWxsIGl0IHRvIGRpc3Bvc2UgYW55IHJlbWFpbmluZyBXZWFrTWFwcyAjMjMzNVxuICAgICAgcmV0dXJuOyAvLyBUaGlzIGluc3RhbmNlIGhhcyBhbHJlYWR5IGJlZW4gZGVzdHJveWVkXG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgaWYgdGhlcmUgaXMgYW5vdGhlciBTd2FsIGNsb3NpbmdcbiAgICBpZiAoZG9tQ2FjaGUucG9wdXAgJiYgZ2xvYmFsU3RhdGUuc3dhbENsb3NlRXZlbnRGaW5pc2hlZENhbGxiYWNrKSB7XG4gICAgICBnbG9iYWxTdGF0ZS5zd2FsQ2xvc2VFdmVudEZpbmlzaGVkQ2FsbGJhY2soKTtcbiAgICAgIGRlbGV0ZSBnbG9iYWxTdGF0ZS5zd2FsQ2xvc2VFdmVudEZpbmlzaGVkQ2FsbGJhY2s7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgaW5uZXJQYXJhbXMuZGlkRGVzdHJveSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgaW5uZXJQYXJhbXMuZGlkRGVzdHJveSgpO1xuICAgIH1cbiAgICBkaXNwb3NlU3dhbCh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnQyfSBpbnN0YW5jZVxuICAgKi9cbiAgY29uc3QgZGlzcG9zZVN3YWwgPSBpbnN0YW5jZSA9PiB7XG4gICAgZGlzcG9zZVdlYWtNYXBzKGluc3RhbmNlKTtcbiAgICAvLyBVbnNldCB0aGlzLnBhcmFtcyBzbyBHQyB3aWxsIGRpc3Bvc2UgaXQgKCMxNTY5KVxuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBkZWxldGUgaW5zdGFuY2UucGFyYW1zO1xuICAgIC8vIFVuc2V0IGdsb2JhbFN0YXRlIHByb3BzIHNvIEdDIHdpbGwgZGlzcG9zZSBnbG9iYWxTdGF0ZSAoIzE1NjkpXG4gICAgZGVsZXRlIGdsb2JhbFN0YXRlLmtleWRvd25IYW5kbGVyO1xuICAgIGRlbGV0ZSBnbG9iYWxTdGF0ZS5rZXlkb3duVGFyZ2V0O1xuICAgIC8vIFVuc2V0IGN1cnJlbnRJbnN0YW5jZVxuICAgIGRlbGV0ZSBnbG9iYWxTdGF0ZS5jdXJyZW50SW5zdGFuY2U7XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydDJ9IGluc3RhbmNlXG4gICAqL1xuICBjb25zdCBkaXNwb3NlV2Vha01hcHMgPSBpbnN0YW5jZSA9PiB7XG4gICAgLy8gSWYgdGhlIGN1cnJlbnQgaW5zdGFuY2UgaXMgYXdhaXRpbmcgYSBwcm9taXNlIHJlc3VsdCwgd2Uga2VlcCB0aGUgcHJpdmF0ZU1ldGhvZHMgdG8gY2FsbCB0aGVtIG9uY2UgdGhlIHByb21pc2UgcmVzdWx0IGlzIHJldHJpZXZlZCAjMjMzNVxuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBpZiAoaW5zdGFuY2UuaXNBd2FpdGluZ1Byb21pc2UoKSkge1xuICAgICAgdW5zZXRXZWFrTWFwcyhwcml2YXRlUHJvcHMsIGluc3RhbmNlKTtcbiAgICAgIHByaXZhdGVQcm9wcy5hd2FpdGluZ1Byb21pc2Uuc2V0KGluc3RhbmNlLCB0cnVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdW5zZXRXZWFrTWFwcyhwcml2YXRlTWV0aG9kcywgaW5zdGFuY2UpO1xuICAgICAgdW5zZXRXZWFrTWFwcyhwcml2YXRlUHJvcHMsIGluc3RhbmNlKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBvYmpcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0Mn0gaW5zdGFuY2VcbiAgICovXG4gIGNvbnN0IHVuc2V0V2Vha01hcHMgPSAob2JqLCBpbnN0YW5jZSkgPT4ge1xuICAgIGZvciAoY29uc3QgaSBpbiBvYmopIHtcbiAgICAgIG9ialtpXS5kZWxldGUoaW5zdGFuY2UpO1xuICAgIH1cbiAgfTtcblxuXG5cbiAgdmFyIGluc3RhbmNlTWV0aG9kcyA9IC8qI19fUFVSRV9fKi9PYmplY3QuZnJlZXplKHtcbiAgICBoaWRlTG9hZGluZzogaGlkZUxvYWRpbmcsXG4gICAgZGlzYWJsZUxvYWRpbmc6IGhpZGVMb2FkaW5nLFxuICAgIGdldElucHV0OiBnZXRJbnB1dCQxLFxuICAgIGNsb3NlOiBjbG9zZSxcbiAgICBpc0F3YWl0aW5nUHJvbWlzZTogaXNBd2FpdGluZ1Byb21pc2UsXG4gICAgcmVqZWN0UHJvbWlzZTogcmVqZWN0UHJvbWlzZSxcbiAgICBoYW5kbGVBd2FpdGluZ1Byb21pc2U6IGhhbmRsZUF3YWl0aW5nUHJvbWlzZSxcbiAgICBjbG9zZVBvcHVwOiBjbG9zZSxcbiAgICBjbG9zZU1vZGFsOiBjbG9zZSxcbiAgICBjbG9zZVRvYXN0OiBjbG9zZSxcbiAgICBlbmFibGVCdXR0b25zOiBlbmFibGVCdXR0b25zLFxuICAgIGRpc2FibGVCdXR0b25zOiBkaXNhYmxlQnV0dG9ucyxcbiAgICBlbmFibGVJbnB1dDogZW5hYmxlSW5wdXQsXG4gICAgZGlzYWJsZUlucHV0OiBkaXNhYmxlSW5wdXQsXG4gICAgc2hvd1ZhbGlkYXRpb25NZXNzYWdlOiBzaG93VmFsaWRhdGlvbk1lc3NhZ2UsXG4gICAgcmVzZXRWYWxpZGF0aW9uTWVzc2FnZTogcmVzZXRWYWxpZGF0aW9uTWVzc2FnZSQxLFxuICAgIGdldFByb2dyZXNzU3RlcHM6IGdldFByb2dyZXNzU3RlcHMkMSxcbiAgICB1cGRhdGU6IHVwZGF0ZSxcbiAgICBfZGVzdHJveTogX2Rlc3Ryb3lcbiAgfSk7XG5cbiAgLyoqXG4gICAqIFNob3dzIGxvYWRlciAoc3Bpbm5lciksIHRoaXMgaXMgdXNlZnVsIHdpdGggQUpBWCByZXF1ZXN0cy5cbiAgICogQnkgZGVmYXVsdCB0aGUgbG9hZGVyIGJlIHNob3duIGluc3RlYWQgb2YgdGhlIFwiQ29uZmlybVwiIGJ1dHRvbi5cbiAgICovXG4gIGNvbnN0IHNob3dMb2FkaW5nID0gYnV0dG9uVG9SZXBsYWNlID0+IHtcbiAgICBsZXQgcG9wdXAgPSBnZXRQb3B1cCgpO1xuICAgIGlmICghcG9wdXApIHtcbiAgICAgIG5ldyBTd2FsKCk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbmV3XG4gICAgfVxuXG4gICAgcG9wdXAgPSBnZXRQb3B1cCgpO1xuICAgIGNvbnN0IGxvYWRlciA9IGdldExvYWRlcigpO1xuICAgIGlmIChpc1RvYXN0KCkpIHtcbiAgICAgIGhpZGUoZ2V0SWNvbigpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVwbGFjZUJ1dHRvbihwb3B1cCwgYnV0dG9uVG9SZXBsYWNlKTtcbiAgICB9XG4gICAgc2hvdyhsb2FkZXIpO1xuICAgIHBvcHVwLnNldEF0dHJpYnV0ZSgnZGF0YS1sb2FkaW5nJywgJ3RydWUnKTtcbiAgICBwb3B1cC5zZXRBdHRyaWJ1dGUoJ2FyaWEtYnVzeScsICd0cnVlJyk7XG4gICAgcG9wdXAuZm9jdXMoKTtcbiAgfTtcbiAgY29uc3QgcmVwbGFjZUJ1dHRvbiA9IChwb3B1cCwgYnV0dG9uVG9SZXBsYWNlKSA9PiB7XG4gICAgY29uc3QgYWN0aW9ucyA9IGdldEFjdGlvbnMoKTtcbiAgICBjb25zdCBsb2FkZXIgPSBnZXRMb2FkZXIoKTtcbiAgICBpZiAoIWJ1dHRvblRvUmVwbGFjZSAmJiBpc1Zpc2libGUoZ2V0Q29uZmlybUJ1dHRvbigpKSkge1xuICAgICAgYnV0dG9uVG9SZXBsYWNlID0gZ2V0Q29uZmlybUJ1dHRvbigpO1xuICAgIH1cbiAgICBzaG93KGFjdGlvbnMpO1xuICAgIGlmIChidXR0b25Ub1JlcGxhY2UpIHtcbiAgICAgIGhpZGUoYnV0dG9uVG9SZXBsYWNlKTtcbiAgICAgIGxvYWRlci5zZXRBdHRyaWJ1dGUoJ2RhdGEtYnV0dG9uLXRvLXJlcGxhY2UnLCBidXR0b25Ub1JlcGxhY2UuY2xhc3NOYW1lKTtcbiAgICB9XG4gICAgbG9hZGVyLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGxvYWRlciwgYnV0dG9uVG9SZXBsYWNlKTtcbiAgICBhZGRDbGFzcyhbcG9wdXAsIGFjdGlvbnNdLCBzd2FsQ2xhc3Nlcy5sb2FkaW5nKTtcbiAgfTtcblxuICAvKipcbiAgICogQHR5cGVkZWYgeyBzdHJpbmcgfCBudW1iZXIgfCBib29sZWFuIH0gSW5wdXRWYWx1ZVxuICAgKi9cblxuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0Mn0gaW5zdGFuY2VcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqL1xuICBjb25zdCBoYW5kbGVJbnB1dE9wdGlvbnNBbmRWYWx1ZSA9IChpbnN0YW5jZSwgcGFyYW1zKSA9PiB7XG4gICAgaWYgKHBhcmFtcy5pbnB1dCA9PT0gJ3NlbGVjdCcgfHwgcGFyYW1zLmlucHV0ID09PSAncmFkaW8nKSB7XG4gICAgICBoYW5kbGVJbnB1dE9wdGlvbnMoaW5zdGFuY2UsIHBhcmFtcyk7XG4gICAgfSBlbHNlIGlmIChbJ3RleHQnLCAnZW1haWwnLCAnbnVtYmVyJywgJ3RlbCcsICd0ZXh0YXJlYSddLmluY2x1ZGVzKHBhcmFtcy5pbnB1dCkgJiYgKGhhc1RvUHJvbWlzZUZuKHBhcmFtcy5pbnB1dFZhbHVlKSB8fCBpc1Byb21pc2UocGFyYW1zLmlucHV0VmFsdWUpKSkge1xuICAgICAgc2hvd0xvYWRpbmcoZ2V0Q29uZmlybUJ1dHRvbigpKTtcbiAgICAgIGhhbmRsZUlucHV0VmFsdWUoaW5zdGFuY2UsIHBhcmFtcyk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnQyfSBpbnN0YW5jZVxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBpbm5lclBhcmFtc1xuICAgKiBAcmV0dXJucyB7c3RyaW5nIHwgbnVtYmVyIHwgRmlsZSB8IEZpbGVMaXN0IHwgbnVsbH1cbiAgICovXG4gIGNvbnN0IGdldElucHV0VmFsdWUgPSAoaW5zdGFuY2UsIGlubmVyUGFyYW1zKSA9PiB7XG4gICAgY29uc3QgaW5wdXQgPSBpbnN0YW5jZS5nZXRJbnB1dCgpO1xuICAgIGlmICghaW5wdXQpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBzd2l0Y2ggKGlubmVyUGFyYW1zLmlucHV0KSB7XG4gICAgICBjYXNlICdjaGVja2JveCc6XG4gICAgICAgIHJldHVybiBnZXRDaGVja2JveFZhbHVlKGlucHV0KTtcbiAgICAgIGNhc2UgJ3JhZGlvJzpcbiAgICAgICAgcmV0dXJuIGdldFJhZGlvVmFsdWUoaW5wdXQpO1xuICAgICAgY2FzZSAnZmlsZSc6XG4gICAgICAgIHJldHVybiBnZXRGaWxlVmFsdWUoaW5wdXQpO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIGlubmVyUGFyYW1zLmlucHV0QXV0b1RyaW0gPyBpbnB1dC52YWx1ZS50cmltKCkgOiBpbnB1dC52YWx1ZTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTElucHV0RWxlbWVudH0gaW5wdXRcbiAgICogQHJldHVybnMge251bWJlcn1cbiAgICovXG4gIGNvbnN0IGdldENoZWNrYm94VmFsdWUgPSBpbnB1dCA9PiBpbnB1dC5jaGVja2VkID8gMSA6IDA7XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTElucHV0RWxlbWVudH0gaW5wdXRcbiAgICogQHJldHVybnMge3N0cmluZyB8IG51bGx9XG4gICAqL1xuICBjb25zdCBnZXRSYWRpb1ZhbHVlID0gaW5wdXQgPT4gaW5wdXQuY2hlY2tlZCA/IGlucHV0LnZhbHVlIDogbnVsbDtcblxuICAvKipcbiAgICogQHBhcmFtIHtIVE1MSW5wdXRFbGVtZW50fSBpbnB1dFxuICAgKiBAcmV0dXJucyB7RmlsZUxpc3QgfCBGaWxlIHwgbnVsbH1cbiAgICovXG4gIGNvbnN0IGdldEZpbGVWYWx1ZSA9IGlucHV0ID0+IGlucHV0LmZpbGVzLmxlbmd0aCA/IGlucHV0LmdldEF0dHJpYnV0ZSgnbXVsdGlwbGUnKSAhPT0gbnVsbCA/IGlucHV0LmZpbGVzIDogaW5wdXQuZmlsZXNbMF0gOiBudWxsO1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnQyfSBpbnN0YW5jZVxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICovXG4gIGNvbnN0IGhhbmRsZUlucHV0T3B0aW9ucyA9IChpbnN0YW5jZSwgcGFyYW1zKSA9PiB7XG4gICAgY29uc3QgcG9wdXAgPSBnZXRQb3B1cCgpO1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7UmVjb3JkPHN0cmluZywgYW55Pn0gaW5wdXRPcHRpb25zXG4gICAgICovXG4gICAgY29uc3QgcHJvY2Vzc0lucHV0T3B0aW9ucyA9IGlucHV0T3B0aW9ucyA9PiB7XG4gICAgICBwb3B1bGF0ZUlucHV0T3B0aW9uc1twYXJhbXMuaW5wdXRdKHBvcHVwLCBmb3JtYXRJbnB1dE9wdGlvbnMoaW5wdXRPcHRpb25zKSwgcGFyYW1zKTtcbiAgICB9O1xuICAgIGlmIChoYXNUb1Byb21pc2VGbihwYXJhbXMuaW5wdXRPcHRpb25zKSB8fCBpc1Byb21pc2UocGFyYW1zLmlucHV0T3B0aW9ucykpIHtcbiAgICAgIHNob3dMb2FkaW5nKGdldENvbmZpcm1CdXR0b24oKSk7XG4gICAgICBhc1Byb21pc2UocGFyYW1zLmlucHV0T3B0aW9ucykudGhlbihpbnB1dE9wdGlvbnMgPT4ge1xuICAgICAgICBpbnN0YW5jZS5oaWRlTG9hZGluZygpO1xuICAgICAgICBwcm9jZXNzSW5wdXRPcHRpb25zKGlucHV0T3B0aW9ucyk7XG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBwYXJhbXMuaW5wdXRPcHRpb25zID09PSAnb2JqZWN0Jykge1xuICAgICAgcHJvY2Vzc0lucHV0T3B0aW9ucyhwYXJhbXMuaW5wdXRPcHRpb25zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZXJyb3IoXCJVbmV4cGVjdGVkIHR5cGUgb2YgaW5wdXRPcHRpb25zISBFeHBlY3RlZCBvYmplY3QsIE1hcCBvciBQcm9taXNlLCBnb3QgXCIuY29uY2F0KHR5cGVvZiBwYXJhbXMuaW5wdXRPcHRpb25zKSk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnQyfSBpbnN0YW5jZVxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICovXG4gIGNvbnN0IGhhbmRsZUlucHV0VmFsdWUgPSAoaW5zdGFuY2UsIHBhcmFtcykgPT4ge1xuICAgIGNvbnN0IGlucHV0ID0gaW5zdGFuY2UuZ2V0SW5wdXQoKTtcbiAgICBoaWRlKGlucHV0KTtcbiAgICBhc1Byb21pc2UocGFyYW1zLmlucHV0VmFsdWUpLnRoZW4oaW5wdXRWYWx1ZSA9PiB7XG4gICAgICBpbnB1dC52YWx1ZSA9IHBhcmFtcy5pbnB1dCA9PT0gJ251bWJlcicgPyBcIlwiLmNvbmNhdChwYXJzZUZsb2F0KGlucHV0VmFsdWUpIHx8IDApIDogXCJcIi5jb25jYXQoaW5wdXRWYWx1ZSk7XG4gICAgICBzaG93KGlucHV0KTtcbiAgICAgIGlucHV0LmZvY3VzKCk7XG4gICAgICBpbnN0YW5jZS5oaWRlTG9hZGluZygpO1xuICAgIH0pLmNhdGNoKGVyciA9PiB7XG4gICAgICBlcnJvcihcIkVycm9yIGluIGlucHV0VmFsdWUgcHJvbWlzZTogXCIuY29uY2F0KGVycikpO1xuICAgICAgaW5wdXQudmFsdWUgPSAnJztcbiAgICAgIHNob3coaW5wdXQpO1xuICAgICAgaW5wdXQuZm9jdXMoKTtcbiAgICAgIGluc3RhbmNlLmhpZGVMb2FkaW5nKCk7XG4gICAgfSk7XG4gIH07XG4gIGNvbnN0IHBvcHVsYXRlSW5wdXRPcHRpb25zID0ge1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHBvcHVwXG4gICAgICogQHBhcmFtIHtSZWNvcmQ8c3RyaW5nLCBhbnk+fSBpbnB1dE9wdGlvbnNcbiAgICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICAgKi9cbiAgICBzZWxlY3Q6IChwb3B1cCwgaW5wdXRPcHRpb25zLCBwYXJhbXMpID0+IHtcbiAgICAgIGNvbnN0IHNlbGVjdCA9IGdldERpcmVjdENoaWxkQnlDbGFzcyhwb3B1cCwgc3dhbENsYXNzZXMuc2VsZWN0KTtcbiAgICAgIC8qKlxuICAgICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gcGFyZW50XG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ30gb3B0aW9uTGFiZWxcbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBvcHRpb25WYWx1ZVxuICAgICAgICovXG4gICAgICBjb25zdCByZW5kZXJPcHRpb24gPSAocGFyZW50LCBvcHRpb25MYWJlbCwgb3B0aW9uVmFsdWUpID0+IHtcbiAgICAgICAgY29uc3Qgb3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gICAgICAgIG9wdGlvbi52YWx1ZSA9IG9wdGlvblZhbHVlO1xuICAgICAgICBzZXRJbm5lckh0bWwob3B0aW9uLCBvcHRpb25MYWJlbCk7XG4gICAgICAgIG9wdGlvbi5zZWxlY3RlZCA9IGlzU2VsZWN0ZWQob3B0aW9uVmFsdWUsIHBhcmFtcy5pbnB1dFZhbHVlKTtcbiAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKG9wdGlvbik7XG4gICAgICB9O1xuICAgICAgaW5wdXRPcHRpb25zLmZvckVhY2goaW5wdXRPcHRpb24gPT4ge1xuICAgICAgICBjb25zdCBvcHRpb25WYWx1ZSA9IGlucHV0T3B0aW9uWzBdO1xuICAgICAgICBjb25zdCBvcHRpb25MYWJlbCA9IGlucHV0T3B0aW9uWzFdO1xuICAgICAgICAvLyA8b3B0Z3JvdXA+IHNwZWM6XG4gICAgICAgIC8vIGh0dHBzOi8vd3d3LnczLm9yZy9UUi9odG1sNDAxL2ludGVyYWN0L2Zvcm1zLmh0bWwjaC0xNy42XG4gICAgICAgIC8vIFwiLi4uYWxsIE9QVEdST1VQIGVsZW1lbnRzIG11c3QgYmUgc3BlY2lmaWVkIGRpcmVjdGx5IHdpdGhpbiBhIFNFTEVDVCBlbGVtZW50IChpLmUuLCBncm91cHMgbWF5IG5vdCBiZSBuZXN0ZWQpLi4uXCJcbiAgICAgICAgLy8gY2hlY2sgd2hldGhlciB0aGlzIGlzIGEgPG9wdGdyb3VwPlxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShvcHRpb25MYWJlbCkpIHtcbiAgICAgICAgICAvLyBpZiBpdCBpcyBhbiBhcnJheSwgdGhlbiBpdCBpcyBhbiA8b3B0Z3JvdXA+XG4gICAgICAgICAgY29uc3Qgb3B0Z3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRncm91cCcpO1xuICAgICAgICAgIG9wdGdyb3VwLmxhYmVsID0gb3B0aW9uVmFsdWU7XG4gICAgICAgICAgb3B0Z3JvdXAuZGlzYWJsZWQgPSBmYWxzZTsgLy8gbm90IGNvbmZpZ3VyYWJsZSBmb3Igbm93XG4gICAgICAgICAgc2VsZWN0LmFwcGVuZENoaWxkKG9wdGdyb3VwKTtcbiAgICAgICAgICBvcHRpb25MYWJlbC5mb3JFYWNoKG8gPT4gcmVuZGVyT3B0aW9uKG9wdGdyb3VwLCBvWzFdLCBvWzBdKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gY2FzZSBvZiA8b3B0aW9uPlxuICAgICAgICAgIHJlbmRlck9wdGlvbihzZWxlY3QsIG9wdGlvbkxhYmVsLCBvcHRpb25WYWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgc2VsZWN0LmZvY3VzKCk7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBwb3B1cFxuICAgICAqIEBwYXJhbSB7UmVjb3JkPHN0cmluZywgYW55Pn0gaW5wdXRPcHRpb25zXG4gICAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAgICovXG4gICAgcmFkaW86IChwb3B1cCwgaW5wdXRPcHRpb25zLCBwYXJhbXMpID0+IHtcbiAgICAgIGNvbnN0IHJhZGlvID0gZ2V0RGlyZWN0Q2hpbGRCeUNsYXNzKHBvcHVwLCBzd2FsQ2xhc3Nlcy5yYWRpbyk7XG4gICAgICBpbnB1dE9wdGlvbnMuZm9yRWFjaChpbnB1dE9wdGlvbiA9PiB7XG4gICAgICAgIGNvbnN0IHJhZGlvVmFsdWUgPSBpbnB1dE9wdGlvblswXTtcbiAgICAgICAgY29uc3QgcmFkaW9MYWJlbCA9IGlucHV0T3B0aW9uWzFdO1xuICAgICAgICBjb25zdCByYWRpb0lucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICAgICAgY29uc3QgcmFkaW9MYWJlbEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xuICAgICAgICByYWRpb0lucHV0LnR5cGUgPSAncmFkaW8nO1xuICAgICAgICByYWRpb0lucHV0Lm5hbWUgPSBzd2FsQ2xhc3Nlcy5yYWRpbztcbiAgICAgICAgcmFkaW9JbnB1dC52YWx1ZSA9IHJhZGlvVmFsdWU7XG4gICAgICAgIGlmIChpc1NlbGVjdGVkKHJhZGlvVmFsdWUsIHBhcmFtcy5pbnB1dFZhbHVlKSkge1xuICAgICAgICAgIHJhZGlvSW5wdXQuY2hlY2tlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICAgIHNldElubmVySHRtbChsYWJlbCwgcmFkaW9MYWJlbCk7XG4gICAgICAgIGxhYmVsLmNsYXNzTmFtZSA9IHN3YWxDbGFzc2VzLmxhYmVsO1xuICAgICAgICByYWRpb0xhYmVsRWxlbWVudC5hcHBlbmRDaGlsZChyYWRpb0lucHV0KTtcbiAgICAgICAgcmFkaW9MYWJlbEVsZW1lbnQuYXBwZW5kQ2hpbGQobGFiZWwpO1xuICAgICAgICByYWRpby5hcHBlbmRDaGlsZChyYWRpb0xhYmVsRWxlbWVudCk7XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IHJhZGlvcyA9IHJhZGlvLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0Jyk7XG4gICAgICBpZiAocmFkaW9zLmxlbmd0aCkge1xuICAgICAgICByYWRpb3NbMF0uZm9jdXMoKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIENvbnZlcnRzIGBpbnB1dE9wdGlvbnNgIGludG8gYW4gYXJyYXkgb2YgYFt2YWx1ZSwgbGFiZWxdYHNcbiAgICpcbiAgICogQHBhcmFtIHtSZWNvcmQ8c3RyaW5nLCBhbnk+fSBpbnB1dE9wdGlvbnNcbiAgICogQHJldHVybnMge0FycmF5PEFycmF5PHN0cmluZz4+fVxuICAgKi9cbiAgY29uc3QgZm9ybWF0SW5wdXRPcHRpb25zID0gaW5wdXRPcHRpb25zID0+IHtcbiAgICBjb25zdCByZXN1bHQgPSBbXTtcbiAgICBpZiAodHlwZW9mIE1hcCAhPT0gJ3VuZGVmaW5lZCcgJiYgaW5wdXRPcHRpb25zIGluc3RhbmNlb2YgTWFwKSB7XG4gICAgICBpbnB1dE9wdGlvbnMuZm9yRWFjaCgodmFsdWUsIGtleSkgPT4ge1xuICAgICAgICBsZXQgdmFsdWVGb3JtYXR0ZWQgPSB2YWx1ZTtcbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZUZvcm1hdHRlZCA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAvLyBjYXNlIG9mIDxvcHRncm91cD5cbiAgICAgICAgICB2YWx1ZUZvcm1hdHRlZCA9IGZvcm1hdElucHV0T3B0aW9ucyh2YWx1ZUZvcm1hdHRlZCk7XG4gICAgICAgIH1cbiAgICAgICAgcmVzdWx0LnB1c2goW2tleSwgdmFsdWVGb3JtYXR0ZWRdKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBPYmplY3Qua2V5cyhpbnB1dE9wdGlvbnMpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgbGV0IHZhbHVlRm9ybWF0dGVkID0gaW5wdXRPcHRpb25zW2tleV07XG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWVGb3JtYXR0ZWQgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgLy8gY2FzZSBvZiA8b3B0Z3JvdXA+XG4gICAgICAgICAgdmFsdWVGb3JtYXR0ZWQgPSBmb3JtYXRJbnB1dE9wdGlvbnModmFsdWVGb3JtYXR0ZWQpO1xuICAgICAgICB9XG4gICAgICAgIHJlc3VsdC5wdXNoKFtrZXksIHZhbHVlRm9ybWF0dGVkXSk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IG9wdGlvblZhbHVlXG4gICAqIEBwYXJhbSB7SW5wdXRWYWx1ZSB8IFByb21pc2U8SW5wdXRWYWx1ZT4gfCB7IHRvUHJvbWlzZTogKCkgPT4gSW5wdXRWYWx1ZSB9fSBpbnB1dFZhbHVlXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgY29uc3QgaXNTZWxlY3RlZCA9IChvcHRpb25WYWx1ZSwgaW5wdXRWYWx1ZSkgPT4ge1xuICAgIHJldHVybiBpbnB1dFZhbHVlICYmIGlucHV0VmFsdWUudG9TdHJpbmcoKSA9PT0gb3B0aW9uVmFsdWUudG9TdHJpbmcoKTtcbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0Mn0gaW5zdGFuY2VcbiAgICovXG4gIGNvbnN0IGhhbmRsZUNvbmZpcm1CdXR0b25DbGljayA9IGluc3RhbmNlID0+IHtcbiAgICBjb25zdCBpbm5lclBhcmFtcyA9IHByaXZhdGVQcm9wcy5pbm5lclBhcmFtcy5nZXQoaW5zdGFuY2UpO1xuICAgIGluc3RhbmNlLmRpc2FibGVCdXR0b25zKCk7XG4gICAgaWYgKGlubmVyUGFyYW1zLmlucHV0KSB7XG4gICAgICBoYW5kbGVDb25maXJtT3JEZW55V2l0aElucHV0KGluc3RhbmNlLCAnY29uZmlybScpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25maXJtKGluc3RhbmNlLCB0cnVlKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydDJ9IGluc3RhbmNlXG4gICAqL1xuICBjb25zdCBoYW5kbGVEZW55QnV0dG9uQ2xpY2sgPSBpbnN0YW5jZSA9PiB7XG4gICAgY29uc3QgaW5uZXJQYXJhbXMgPSBwcml2YXRlUHJvcHMuaW5uZXJQYXJhbXMuZ2V0KGluc3RhbmNlKTtcbiAgICBpbnN0YW5jZS5kaXNhYmxlQnV0dG9ucygpO1xuICAgIGlmIChpbm5lclBhcmFtcy5yZXR1cm5JbnB1dFZhbHVlT25EZW55KSB7XG4gICAgICBoYW5kbGVDb25maXJtT3JEZW55V2l0aElucHV0KGluc3RhbmNlLCAnZGVueScpO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZW55KGluc3RhbmNlLCBmYWxzZSk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnQyfSBpbnN0YW5jZVxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBkaXNtaXNzV2l0aFxuICAgKi9cbiAgY29uc3QgaGFuZGxlQ2FuY2VsQnV0dG9uQ2xpY2sgPSAoaW5zdGFuY2UsIGRpc21pc3NXaXRoKSA9PiB7XG4gICAgaW5zdGFuY2UuZGlzYWJsZUJ1dHRvbnMoKTtcbiAgICBkaXNtaXNzV2l0aChEaXNtaXNzUmVhc29uLmNhbmNlbCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydDJ9IGluc3RhbmNlXG4gICAqIEBwYXJhbSB7J2NvbmZpcm0nIHwgJ2RlbnknfSB0eXBlXG4gICAqL1xuICBjb25zdCBoYW5kbGVDb25maXJtT3JEZW55V2l0aElucHV0ID0gKGluc3RhbmNlLCB0eXBlKSA9PiB7XG4gICAgY29uc3QgaW5uZXJQYXJhbXMgPSBwcml2YXRlUHJvcHMuaW5uZXJQYXJhbXMuZ2V0KGluc3RhbmNlKTtcbiAgICBpZiAoIWlubmVyUGFyYW1zLmlucHV0KSB7XG4gICAgICBlcnJvcihcIlRoZSBcXFwiaW5wdXRcXFwiIHBhcmFtZXRlciBpcyBuZWVkZWQgdG8gYmUgc2V0IHdoZW4gdXNpbmcgcmV0dXJuSW5wdXRWYWx1ZU9uXCIuY29uY2F0KGNhcGl0YWxpemVGaXJzdExldHRlcih0eXBlKSkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBpbnB1dFZhbHVlID0gZ2V0SW5wdXRWYWx1ZShpbnN0YW5jZSwgaW5uZXJQYXJhbXMpO1xuICAgIGlmIChpbm5lclBhcmFtcy5pbnB1dFZhbGlkYXRvcikge1xuICAgICAgaGFuZGxlSW5wdXRWYWxpZGF0b3IoaW5zdGFuY2UsIGlucHV0VmFsdWUsIHR5cGUpO1xuICAgIH0gZWxzZSBpZiAoIWluc3RhbmNlLmdldElucHV0KCkuY2hlY2tWYWxpZGl0eSgpKSB7XG4gICAgICBpbnN0YW5jZS5lbmFibGVCdXR0b25zKCk7XG4gICAgICBpbnN0YW5jZS5zaG93VmFsaWRhdGlvbk1lc3NhZ2UoaW5uZXJQYXJhbXMudmFsaWRhdGlvbk1lc3NhZ2UpO1xuICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ2RlbnknKSB7XG4gICAgICBkZW55KGluc3RhbmNlLCBpbnB1dFZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uZmlybShpbnN0YW5jZSwgaW5wdXRWYWx1ZSk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnQyfSBpbnN0YW5jZVxuICAgKiBAcGFyYW0ge3N0cmluZyB8IG51bWJlciB8IEZpbGUgfCBGaWxlTGlzdCB8IG51bGx9IGlucHV0VmFsdWVcbiAgICogQHBhcmFtIHsnY29uZmlybScgfCAnZGVueSd9IHR5cGVcbiAgICovXG4gIGNvbnN0IGhhbmRsZUlucHV0VmFsaWRhdG9yID0gKGluc3RhbmNlLCBpbnB1dFZhbHVlLCB0eXBlKSA9PiB7XG4gICAgY29uc3QgaW5uZXJQYXJhbXMgPSBwcml2YXRlUHJvcHMuaW5uZXJQYXJhbXMuZ2V0KGluc3RhbmNlKTtcbiAgICBpbnN0YW5jZS5kaXNhYmxlSW5wdXQoKTtcbiAgICBjb25zdCB2YWxpZGF0aW9uUHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4gYXNQcm9taXNlKGlubmVyUGFyYW1zLmlucHV0VmFsaWRhdG9yKGlucHV0VmFsdWUsIGlubmVyUGFyYW1zLnZhbGlkYXRpb25NZXNzYWdlKSkpO1xuICAgIHZhbGlkYXRpb25Qcm9taXNlLnRoZW4odmFsaWRhdGlvbk1lc3NhZ2UgPT4ge1xuICAgICAgaW5zdGFuY2UuZW5hYmxlQnV0dG9ucygpO1xuICAgICAgaW5zdGFuY2UuZW5hYmxlSW5wdXQoKTtcbiAgICAgIGlmICh2YWxpZGF0aW9uTWVzc2FnZSkge1xuICAgICAgICBpbnN0YW5jZS5zaG93VmFsaWRhdGlvbk1lc3NhZ2UodmFsaWRhdGlvbk1lc3NhZ2UpO1xuICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAnZGVueScpIHtcbiAgICAgICAgZGVueShpbnN0YW5jZSwgaW5wdXRWYWx1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25maXJtKGluc3RhbmNlLCBpbnB1dFZhbHVlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0Mn0gaW5zdGFuY2VcbiAgICogQHBhcmFtIHthbnl9IHZhbHVlXG4gICAqL1xuICBjb25zdCBkZW55ID0gKGluc3RhbmNlLCB2YWx1ZSkgPT4ge1xuICAgIGNvbnN0IGlubmVyUGFyYW1zID0gcHJpdmF0ZVByb3BzLmlubmVyUGFyYW1zLmdldChpbnN0YW5jZSB8fCB1bmRlZmluZWQpO1xuICAgIGlmIChpbm5lclBhcmFtcy5zaG93TG9hZGVyT25EZW55KSB7XG4gICAgICBzaG93TG9hZGluZyhnZXREZW55QnV0dG9uKCkpO1xuICAgIH1cbiAgICBpZiAoaW5uZXJQYXJhbXMucHJlRGVueSkge1xuICAgICAgcHJpdmF0ZVByb3BzLmF3YWl0aW5nUHJvbWlzZS5zZXQoaW5zdGFuY2UgfHwgdW5kZWZpbmVkLCB0cnVlKTsgLy8gRmxhZ2dpbmcgdGhlIGluc3RhbmNlIGFzIGF3YWl0aW5nIGEgcHJvbWlzZSBzbyBpdCdzIG93biBwcm9taXNlJ3MgcmVqZWN0L3Jlc29sdmUgbWV0aG9kcyBkb2Vzbid0IGdldCBkZXN0cm95ZWQgdW50aWwgdGhlIHJlc3VsdCBmcm9tIHRoaXMgcHJlRGVueSdzIHByb21pc2UgaXMgcmVjZWl2ZWRcbiAgICAgIGNvbnN0IHByZURlbnlQcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiBhc1Byb21pc2UoaW5uZXJQYXJhbXMucHJlRGVueSh2YWx1ZSwgaW5uZXJQYXJhbXMudmFsaWRhdGlvbk1lc3NhZ2UpKSk7XG4gICAgICBwcmVEZW55UHJvbWlzZS50aGVuKHByZURlbnlWYWx1ZSA9PiB7XG4gICAgICAgIGlmIChwcmVEZW55VmFsdWUgPT09IGZhbHNlKSB7XG4gICAgICAgICAgaW5zdGFuY2UuaGlkZUxvYWRpbmcoKTtcbiAgICAgICAgICBoYW5kbGVBd2FpdGluZ1Byb21pc2UoaW5zdGFuY2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGluc3RhbmNlLmNsb3NlKHtcbiAgICAgICAgICAgIGlzRGVuaWVkOiB0cnVlLFxuICAgICAgICAgICAgdmFsdWU6IHR5cGVvZiBwcmVEZW55VmFsdWUgPT09ICd1bmRlZmluZWQnID8gdmFsdWUgOiBwcmVEZW55VmFsdWVcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSkuY2F0Y2goZXJyb3IkJDEgPT4gcmVqZWN0V2l0aChpbnN0YW5jZSB8fCB1bmRlZmluZWQsIGVycm9yJCQxKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGluc3RhbmNlLmNsb3NlKHtcbiAgICAgICAgaXNEZW5pZWQ6IHRydWUsXG4gICAgICAgIHZhbHVlXG4gICAgICB9KTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydDJ9IGluc3RhbmNlXG4gICAqIEBwYXJhbSB7YW55fSB2YWx1ZVxuICAgKi9cbiAgY29uc3Qgc3VjY2VlZFdpdGggPSAoaW5zdGFuY2UsIHZhbHVlKSA9PiB7XG4gICAgaW5zdGFuY2UuY2xvc2Uoe1xuICAgICAgaXNDb25maXJtZWQ6IHRydWUsXG4gICAgICB2YWx1ZVxuICAgIH0pO1xuICB9O1xuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnQyfSBpbnN0YW5jZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gZXJyb3JcbiAgICovXG4gIGNvbnN0IHJlamVjdFdpdGggPSAoaW5zdGFuY2UsIGVycm9yJCQxKSA9PiB7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGluc3RhbmNlLnJlamVjdFByb21pc2UoZXJyb3IkJDEpO1xuICB9O1xuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnQyfSBpbnN0YW5jZVxuICAgKiBAcGFyYW0ge2FueX0gdmFsdWVcbiAgICovXG4gIGNvbnN0IGNvbmZpcm0gPSAoaW5zdGFuY2UsIHZhbHVlKSA9PiB7XG4gICAgY29uc3QgaW5uZXJQYXJhbXMgPSBwcml2YXRlUHJvcHMuaW5uZXJQYXJhbXMuZ2V0KGluc3RhbmNlIHx8IHVuZGVmaW5lZCk7XG4gICAgaWYgKGlubmVyUGFyYW1zLnNob3dMb2FkZXJPbkNvbmZpcm0pIHtcbiAgICAgIHNob3dMb2FkaW5nKCk7XG4gICAgfVxuICAgIGlmIChpbm5lclBhcmFtcy5wcmVDb25maXJtKSB7XG4gICAgICBpbnN0YW5jZS5yZXNldFZhbGlkYXRpb25NZXNzYWdlKCk7XG4gICAgICBwcml2YXRlUHJvcHMuYXdhaXRpbmdQcm9taXNlLnNldChpbnN0YW5jZSB8fCB1bmRlZmluZWQsIHRydWUpOyAvLyBGbGFnZ2luZyB0aGUgaW5zdGFuY2UgYXMgYXdhaXRpbmcgYSBwcm9taXNlIHNvIGl0J3Mgb3duIHByb21pc2UncyByZWplY3QvcmVzb2x2ZSBtZXRob2RzIGRvZXNuJ3QgZ2V0IGRlc3Ryb3llZCB1bnRpbCB0aGUgcmVzdWx0IGZyb20gdGhpcyBwcmVDb25maXJtJ3MgcHJvbWlzZSBpcyByZWNlaXZlZFxuICAgICAgY29uc3QgcHJlQ29uZmlybVByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IGFzUHJvbWlzZShpbm5lclBhcmFtcy5wcmVDb25maXJtKHZhbHVlLCBpbm5lclBhcmFtcy52YWxpZGF0aW9uTWVzc2FnZSkpKTtcbiAgICAgIHByZUNvbmZpcm1Qcm9taXNlLnRoZW4ocHJlQ29uZmlybVZhbHVlID0+IHtcbiAgICAgICAgaWYgKGlzVmlzaWJsZShnZXRWYWxpZGF0aW9uTWVzc2FnZSgpKSB8fCBwcmVDb25maXJtVmFsdWUgPT09IGZhbHNlKSB7XG4gICAgICAgICAgaW5zdGFuY2UuaGlkZUxvYWRpbmcoKTtcbiAgICAgICAgICBoYW5kbGVBd2FpdGluZ1Byb21pc2UoaW5zdGFuY2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHN1Y2NlZWRXaXRoKGluc3RhbmNlLCB0eXBlb2YgcHJlQ29uZmlybVZhbHVlID09PSAndW5kZWZpbmVkJyA/IHZhbHVlIDogcHJlQ29uZmlybVZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfSkuY2F0Y2goZXJyb3IkJDEgPT4gcmVqZWN0V2l0aChpbnN0YW5jZSB8fCB1bmRlZmluZWQsIGVycm9yJCQxKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN1Y2NlZWRXaXRoKGluc3RhbmNlLCB2YWx1ZSk7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IGhhbmRsZVBvcHVwQ2xpY2sgPSAoaW5zdGFuY2UsIGRvbUNhY2hlLCBkaXNtaXNzV2l0aCkgPT4ge1xuICAgIGNvbnN0IGlubmVyUGFyYW1zID0gcHJpdmF0ZVByb3BzLmlubmVyUGFyYW1zLmdldChpbnN0YW5jZSk7XG4gICAgaWYgKGlubmVyUGFyYW1zLnRvYXN0KSB7XG4gICAgICBoYW5kbGVUb2FzdENsaWNrKGluc3RhbmNlLCBkb21DYWNoZSwgZGlzbWlzc1dpdGgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBJZ25vcmUgY2xpY2sgZXZlbnRzIHRoYXQgaGFkIG1vdXNlZG93biBvbiB0aGUgcG9wdXAgYnV0IG1vdXNldXAgb24gdGhlIGNvbnRhaW5lclxuICAgICAgLy8gVGhpcyBjYW4gaGFwcGVuIHdoZW4gdGhlIHVzZXIgZHJhZ3MgYSBzbGlkZXJcbiAgICAgIGhhbmRsZU1vZGFsTW91c2Vkb3duKGRvbUNhY2hlKTtcblxuICAgICAgLy8gSWdub3JlIGNsaWNrIGV2ZW50cyB0aGF0IGhhZCBtb3VzZWRvd24gb24gdGhlIGNvbnRhaW5lciBidXQgbW91c2V1cCBvbiB0aGUgcG9wdXBcbiAgICAgIGhhbmRsZUNvbnRhaW5lck1vdXNlZG93bihkb21DYWNoZSk7XG4gICAgICBoYW5kbGVNb2RhbENsaWNrKGluc3RhbmNlLCBkb21DYWNoZSwgZGlzbWlzc1dpdGgpO1xuICAgIH1cbiAgfTtcbiAgY29uc3QgaGFuZGxlVG9hc3RDbGljayA9IChpbnN0YW5jZSwgZG9tQ2FjaGUsIGRpc21pc3NXaXRoKSA9PiB7XG4gICAgLy8gQ2xvc2luZyB0b2FzdCBieSBpbnRlcm5hbCBjbGlja1xuICAgIGRvbUNhY2hlLnBvcHVwLm9uY2xpY2sgPSAoKSA9PiB7XG4gICAgICBjb25zdCBpbm5lclBhcmFtcyA9IHByaXZhdGVQcm9wcy5pbm5lclBhcmFtcy5nZXQoaW5zdGFuY2UpO1xuICAgICAgaWYgKGlubmVyUGFyYW1zICYmIChpc0FueUJ1dHRvblNob3duKGlubmVyUGFyYW1zKSB8fCBpbm5lclBhcmFtcy50aW1lciB8fCBpbm5lclBhcmFtcy5pbnB1dCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgZGlzbWlzc1dpdGgoRGlzbWlzc1JlYXNvbi5jbG9zZSk7XG4gICAgfTtcbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHsqfSBpbm5lclBhcmFtc1xuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG4gIGNvbnN0IGlzQW55QnV0dG9uU2hvd24gPSBpbm5lclBhcmFtcyA9PiB7XG4gICAgcmV0dXJuIGlubmVyUGFyYW1zLnNob3dDb25maXJtQnV0dG9uIHx8IGlubmVyUGFyYW1zLnNob3dEZW55QnV0dG9uIHx8IGlubmVyUGFyYW1zLnNob3dDYW5jZWxCdXR0b24gfHwgaW5uZXJQYXJhbXMuc2hvd0Nsb3NlQnV0dG9uO1xuICB9O1xuICBsZXQgaWdub3JlT3V0c2lkZUNsaWNrID0gZmFsc2U7XG4gIGNvbnN0IGhhbmRsZU1vZGFsTW91c2Vkb3duID0gZG9tQ2FjaGUgPT4ge1xuICAgIGRvbUNhY2hlLnBvcHVwLm9ubW91c2Vkb3duID0gKCkgPT4ge1xuICAgICAgZG9tQ2FjaGUuY29udGFpbmVyLm9ubW91c2V1cCA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGRvbUNhY2hlLmNvbnRhaW5lci5vbm1vdXNldXAgPSB1bmRlZmluZWQ7XG4gICAgICAgIC8vIFdlIG9ubHkgY2hlY2sgaWYgdGhlIG1vdXNldXAgdGFyZ2V0IGlzIHRoZSBjb250YWluZXIgYmVjYXVzZSB1c3VhbGx5IGl0IGRvZXNuJ3RcbiAgICAgICAgLy8gaGF2ZSBhbnkgb3RoZXIgZGlyZWN0IGNoaWxkcmVuIGFzaWRlIG9mIHRoZSBwb3B1cFxuICAgICAgICBpZiAoZS50YXJnZXQgPT09IGRvbUNhY2hlLmNvbnRhaW5lcikge1xuICAgICAgICAgIGlnbm9yZU91dHNpZGVDbGljayA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfTtcbiAgfTtcbiAgY29uc3QgaGFuZGxlQ29udGFpbmVyTW91c2Vkb3duID0gZG9tQ2FjaGUgPT4ge1xuICAgIGRvbUNhY2hlLmNvbnRhaW5lci5vbm1vdXNlZG93biA9ICgpID0+IHtcbiAgICAgIGRvbUNhY2hlLnBvcHVwLm9ubW91c2V1cCA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGRvbUNhY2hlLnBvcHVwLm9ubW91c2V1cCA9IHVuZGVmaW5lZDtcbiAgICAgICAgLy8gV2UgYWxzbyBuZWVkIHRvIGNoZWNrIGlmIHRoZSBtb3VzZXVwIHRhcmdldCBpcyBhIGNoaWxkIG9mIHRoZSBwb3B1cFxuICAgICAgICBpZiAoZS50YXJnZXQgPT09IGRvbUNhY2hlLnBvcHVwIHx8IGRvbUNhY2hlLnBvcHVwLmNvbnRhaW5zKGUudGFyZ2V0KSkge1xuICAgICAgICAgIGlnbm9yZU91dHNpZGVDbGljayA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfTtcbiAgfTtcbiAgY29uc3QgaGFuZGxlTW9kYWxDbGljayA9IChpbnN0YW5jZSwgZG9tQ2FjaGUsIGRpc21pc3NXaXRoKSA9PiB7XG4gICAgZG9tQ2FjaGUuY29udGFpbmVyLm9uY2xpY2sgPSBlID0+IHtcbiAgICAgIGNvbnN0IGlubmVyUGFyYW1zID0gcHJpdmF0ZVByb3BzLmlubmVyUGFyYW1zLmdldChpbnN0YW5jZSk7XG4gICAgICBpZiAoaWdub3JlT3V0c2lkZUNsaWNrKSB7XG4gICAgICAgIGlnbm9yZU91dHNpZGVDbGljayA9IGZhbHNlO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoZS50YXJnZXQgPT09IGRvbUNhY2hlLmNvbnRhaW5lciAmJiBjYWxsSWZGdW5jdGlvbihpbm5lclBhcmFtcy5hbGxvd091dHNpZGVDbGljaykpIHtcbiAgICAgICAgZGlzbWlzc1dpdGgoRGlzbWlzc1JlYXNvbi5iYWNrZHJvcCk7XG4gICAgICB9XG4gICAgfTtcbiAgfTtcblxuICBjb25zdCBpc0pxdWVyeUVsZW1lbnQgPSBlbGVtID0+IHR5cGVvZiBlbGVtID09PSAnb2JqZWN0JyAmJiBlbGVtLmpxdWVyeTtcbiAgY29uc3QgaXNFbGVtZW50ID0gZWxlbSA9PiBlbGVtIGluc3RhbmNlb2YgRWxlbWVudCB8fCBpc0pxdWVyeUVsZW1lbnQoZWxlbSk7XG4gIGNvbnN0IGFyZ3NUb1BhcmFtcyA9IGFyZ3MgPT4ge1xuICAgIGNvbnN0IHBhcmFtcyA9IHt9O1xuICAgIGlmICh0eXBlb2YgYXJnc1swXSA9PT0gJ29iamVjdCcgJiYgIWlzRWxlbWVudChhcmdzWzBdKSkge1xuICAgICAgT2JqZWN0LmFzc2lnbihwYXJhbXMsIGFyZ3NbMF0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBbJ3RpdGxlJywgJ2h0bWwnLCAnaWNvbiddLmZvckVhY2goKG5hbWUsIGluZGV4KSA9PiB7XG4gICAgICAgIGNvbnN0IGFyZyA9IGFyZ3NbaW5kZXhdO1xuICAgICAgICBpZiAodHlwZW9mIGFyZyA9PT0gJ3N0cmluZycgfHwgaXNFbGVtZW50KGFyZykpIHtcbiAgICAgICAgICBwYXJhbXNbbmFtZV0gPSBhcmc7XG4gICAgICAgIH0gZWxzZSBpZiAoYXJnICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBlcnJvcihcIlVuZXhwZWN0ZWQgdHlwZSBvZiBcIi5jb25jYXQobmFtZSwgXCIhIEV4cGVjdGVkIFxcXCJzdHJpbmdcXFwiIG9yIFxcXCJFbGVtZW50XFxcIiwgZ290IFwiKS5jb25jYXQodHlwZW9mIGFyZykpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHBhcmFtcztcbiAgfTtcblxuICBmdW5jdGlvbiBmaXJlKCkge1xuICAgIGNvbnN0IFN3YWwgPSB0aGlzOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby10aGlzLWFsaWFzXG4gICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBuZXcgQXJyYXkoX2xlbiksIF9rZXkgPSAwOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgICBhcmdzW19rZXldID0gYXJndW1lbnRzW19rZXldO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFN3YWwoLi4uYXJncyk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhbiBleHRlbmRlZCB2ZXJzaW9uIG9mIGBTd2FsYCBjb250YWluaW5nIGBwYXJhbXNgIGFzIGRlZmF1bHRzLlxuICAgKiBVc2VmdWwgZm9yIHJldXNpbmcgU3dhbCBjb25maWd1cmF0aW9uLlxuICAgKlxuICAgKiBGb3IgZXhhbXBsZTpcbiAgICpcbiAgICogQmVmb3JlOlxuICAgKiBjb25zdCB0ZXh0UHJvbXB0T3B0aW9ucyA9IHsgaW5wdXQ6ICd0ZXh0Jywgc2hvd0NhbmNlbEJ1dHRvbjogdHJ1ZSB9XG4gICAqIGNvbnN0IHt2YWx1ZTogZmlyc3ROYW1lfSA9IGF3YWl0IFN3YWwuZmlyZSh7IC4uLnRleHRQcm9tcHRPcHRpb25zLCB0aXRsZTogJ1doYXQgaXMgeW91ciBmaXJzdCBuYW1lPycgfSlcbiAgICogY29uc3Qge3ZhbHVlOiBsYXN0TmFtZX0gPSBhd2FpdCBTd2FsLmZpcmUoeyAuLi50ZXh0UHJvbXB0T3B0aW9ucywgdGl0bGU6ICdXaGF0IGlzIHlvdXIgbGFzdCBuYW1lPycgfSlcbiAgICpcbiAgICogQWZ0ZXI6XG4gICAqIGNvbnN0IFRleHRQcm9tcHQgPSBTd2FsLm1peGluKHsgaW5wdXQ6ICd0ZXh0Jywgc2hvd0NhbmNlbEJ1dHRvbjogdHJ1ZSB9KVxuICAgKiBjb25zdCB7dmFsdWU6IGZpcnN0TmFtZX0gPSBhd2FpdCBUZXh0UHJvbXB0KCdXaGF0IGlzIHlvdXIgZmlyc3QgbmFtZT8nKVxuICAgKiBjb25zdCB7dmFsdWU6IGxhc3ROYW1lfSA9IGF3YWl0IFRleHRQcm9tcHQoJ1doYXQgaXMgeW91ciBsYXN0IG5hbWU/JylcbiAgICpcbiAgICogQHBhcmFtIG1peGluUGFyYW1zXG4gICAqL1xuICBmdW5jdGlvbiBtaXhpbihtaXhpblBhcmFtcykge1xuICAgIGNsYXNzIE1peGluU3dhbCBleHRlbmRzIHRoaXMge1xuICAgICAgX21haW4ocGFyYW1zLCBwcmlvcml0eU1peGluUGFyYW1zKSB7XG4gICAgICAgIHJldHVybiBzdXBlci5fbWFpbihwYXJhbXMsIE9iamVjdC5hc3NpZ24oe30sIG1peGluUGFyYW1zLCBwcmlvcml0eU1peGluUGFyYW1zKSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBNaXhpblN3YWw7XG4gIH1cblxuICAvKipcbiAgICogSWYgYHRpbWVyYCBwYXJhbWV0ZXIgaXMgc2V0LCByZXR1cm5zIG51bWJlciBvZiBtaWxsaXNlY29uZHMgb2YgdGltZXIgcmVtYWluZWQuXG4gICAqIE90aGVyd2lzZSwgcmV0dXJucyB1bmRlZmluZWQuXG4gICAqXG4gICAqIEByZXR1cm5zIHtudW1iZXIgfCB1bmRlZmluZWR9XG4gICAqL1xuICBjb25zdCBnZXRUaW1lckxlZnQgPSAoKSA9PiB7XG4gICAgcmV0dXJuIGdsb2JhbFN0YXRlLnRpbWVvdXQgJiYgZ2xvYmFsU3RhdGUudGltZW91dC5nZXRUaW1lckxlZnQoKTtcbiAgfTtcblxuICAvKipcbiAgICogU3RvcCB0aW1lci4gUmV0dXJucyBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIG9mIHRpbWVyIHJlbWFpbmVkLlxuICAgKiBJZiBgdGltZXJgIHBhcmFtZXRlciBpc24ndCBzZXQsIHJldHVybnMgdW5kZWZpbmVkLlxuICAgKlxuICAgKiBAcmV0dXJucyB7bnVtYmVyIHwgdW5kZWZpbmVkfVxuICAgKi9cbiAgY29uc3Qgc3RvcFRpbWVyID0gKCkgPT4ge1xuICAgIGlmIChnbG9iYWxTdGF0ZS50aW1lb3V0KSB7XG4gICAgICBzdG9wVGltZXJQcm9ncmVzc0JhcigpO1xuICAgICAgcmV0dXJuIGdsb2JhbFN0YXRlLnRpbWVvdXQuc3RvcCgpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogUmVzdW1lIHRpbWVyLiBSZXR1cm5zIG51bWJlciBvZiBtaWxsaXNlY29uZHMgb2YgdGltZXIgcmVtYWluZWQuXG4gICAqIElmIGB0aW1lcmAgcGFyYW1ldGVyIGlzbid0IHNldCwgcmV0dXJucyB1bmRlZmluZWQuXG4gICAqXG4gICAqIEByZXR1cm5zIHtudW1iZXIgfCB1bmRlZmluZWR9XG4gICAqL1xuICBjb25zdCByZXN1bWVUaW1lciA9ICgpID0+IHtcbiAgICBpZiAoZ2xvYmFsU3RhdGUudGltZW91dCkge1xuICAgICAgY29uc3QgcmVtYWluaW5nID0gZ2xvYmFsU3RhdGUudGltZW91dC5zdGFydCgpO1xuICAgICAgYW5pbWF0ZVRpbWVyUHJvZ3Jlc3NCYXIocmVtYWluaW5nKTtcbiAgICAgIHJldHVybiByZW1haW5pbmc7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBSZXN1bWUgdGltZXIuIFJldHVybnMgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyBvZiB0aW1lciByZW1haW5lZC5cbiAgICogSWYgYHRpbWVyYCBwYXJhbWV0ZXIgaXNuJ3Qgc2V0LCByZXR1cm5zIHVuZGVmaW5lZC5cbiAgICpcbiAgICogQHJldHVybnMge251bWJlciB8IHVuZGVmaW5lZH1cbiAgICovXG4gIGNvbnN0IHRvZ2dsZVRpbWVyID0gKCkgPT4ge1xuICAgIGNvbnN0IHRpbWVyID0gZ2xvYmFsU3RhdGUudGltZW91dDtcbiAgICByZXR1cm4gdGltZXIgJiYgKHRpbWVyLnJ1bm5pbmcgPyBzdG9wVGltZXIoKSA6IHJlc3VtZVRpbWVyKCkpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBJbmNyZWFzZSB0aW1lci4gUmV0dXJucyBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIG9mIGFuIHVwZGF0ZWQgdGltZXIuXG4gICAqIElmIGB0aW1lcmAgcGFyYW1ldGVyIGlzbid0IHNldCwgcmV0dXJucyB1bmRlZmluZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBuXG4gICAqIEByZXR1cm5zIHtudW1iZXIgfCB1bmRlZmluZWR9XG4gICAqL1xuICBjb25zdCBpbmNyZWFzZVRpbWVyID0gbiA9PiB7XG4gICAgaWYgKGdsb2JhbFN0YXRlLnRpbWVvdXQpIHtcbiAgICAgIGNvbnN0IHJlbWFpbmluZyA9IGdsb2JhbFN0YXRlLnRpbWVvdXQuaW5jcmVhc2Uobik7XG4gICAgICBhbmltYXRlVGltZXJQcm9ncmVzc0JhcihyZW1haW5pbmcsIHRydWUpO1xuICAgICAgcmV0dXJuIHJlbWFpbmluZztcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRpbWVyIGlzIHJ1bm5pbmcuIFJldHVybnMgdHJ1ZSBpZiB0aW1lciBpcyBydW5uaW5nXG4gICAqIG9yIGZhbHNlIGlmIHRpbWVyIGlzIHBhdXNlZCBvciBzdG9wcGVkLlxuICAgKiBJZiBgdGltZXJgIHBhcmFtZXRlciBpc24ndCBzZXQsIHJldHVybnMgdW5kZWZpbmVkXG4gICAqXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgY29uc3QgaXNUaW1lclJ1bm5pbmcgPSAoKSA9PiB7XG4gICAgcmV0dXJuIGdsb2JhbFN0YXRlLnRpbWVvdXQgJiYgZ2xvYmFsU3RhdGUudGltZW91dC5pc1J1bm5pbmcoKTtcbiAgfTtcblxuICBsZXQgYm9keUNsaWNrTGlzdGVuZXJBZGRlZCA9IGZhbHNlO1xuICBjb25zdCBjbGlja0hhbmRsZXJzID0ge307XG4gIGZ1bmN0aW9uIGJpbmRDbGlja0hhbmRsZXIoKSB7XG4gICAgbGV0IGF0dHIgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6ICdkYXRhLXN3YWwtdGVtcGxhdGUnO1xuICAgIGNsaWNrSGFuZGxlcnNbYXR0cl0gPSB0aGlzO1xuICAgIGlmICghYm9keUNsaWNrTGlzdGVuZXJBZGRlZCkge1xuICAgICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGJvZHlDbGlja0xpc3RlbmVyKTtcbiAgICAgIGJvZHlDbGlja0xpc3RlbmVyQWRkZWQgPSB0cnVlO1xuICAgIH1cbiAgfVxuICBjb25zdCBib2R5Q2xpY2tMaXN0ZW5lciA9IGV2ZW50ID0+IHtcbiAgICBmb3IgKGxldCBlbCA9IGV2ZW50LnRhcmdldDsgZWwgJiYgZWwgIT09IGRvY3VtZW50OyBlbCA9IGVsLnBhcmVudE5vZGUpIHtcbiAgICAgIGZvciAoY29uc3QgYXR0ciBpbiBjbGlja0hhbmRsZXJzKSB7XG4gICAgICAgIGNvbnN0IHRlbXBsYXRlID0gZWwuZ2V0QXR0cmlidXRlKGF0dHIpO1xuICAgICAgICBpZiAodGVtcGxhdGUpIHtcbiAgICAgICAgICBjbGlja0hhbmRsZXJzW2F0dHJdLmZpcmUoe1xuICAgICAgICAgICAgdGVtcGxhdGVcbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG5cblxuXG4gIHZhciBzdGF0aWNNZXRob2RzID0gLyojX19QVVJFX18qL09iamVjdC5mcmVlemUoe1xuICAgIGlzVmFsaWRQYXJhbWV0ZXI6IGlzVmFsaWRQYXJhbWV0ZXIsXG4gICAgaXNVcGRhdGFibGVQYXJhbWV0ZXI6IGlzVXBkYXRhYmxlUGFyYW1ldGVyLFxuICAgIGlzRGVwcmVjYXRlZFBhcmFtZXRlcjogaXNEZXByZWNhdGVkUGFyYW1ldGVyLFxuICAgIGFyZ3NUb1BhcmFtczogYXJnc1RvUGFyYW1zLFxuICAgIGlzVmlzaWJsZTogaXNWaXNpYmxlJDEsXG4gICAgY2xpY2tDb25maXJtOiBjbGlja0NvbmZpcm0sXG4gICAgY2xpY2tEZW55OiBjbGlja0RlbnksXG4gICAgY2xpY2tDYW5jZWw6IGNsaWNrQ2FuY2VsLFxuICAgIGdldENvbnRhaW5lcjogZ2V0Q29udGFpbmVyLFxuICAgIGdldFBvcHVwOiBnZXRQb3B1cCxcbiAgICBnZXRUaXRsZTogZ2V0VGl0bGUsXG4gICAgZ2V0SHRtbENvbnRhaW5lcjogZ2V0SHRtbENvbnRhaW5lcixcbiAgICBnZXRJbWFnZTogZ2V0SW1hZ2UsXG4gICAgZ2V0SWNvbjogZ2V0SWNvbixcbiAgICBnZXRJY29uQ29udGVudDogZ2V0SWNvbkNvbnRlbnQsXG4gICAgZ2V0SW5wdXRMYWJlbDogZ2V0SW5wdXRMYWJlbCxcbiAgICBnZXRDbG9zZUJ1dHRvbjogZ2V0Q2xvc2VCdXR0b24sXG4gICAgZ2V0QWN0aW9uczogZ2V0QWN0aW9ucyxcbiAgICBnZXRDb25maXJtQnV0dG9uOiBnZXRDb25maXJtQnV0dG9uLFxuICAgIGdldERlbnlCdXR0b246IGdldERlbnlCdXR0b24sXG4gICAgZ2V0Q2FuY2VsQnV0dG9uOiBnZXRDYW5jZWxCdXR0b24sXG4gICAgZ2V0TG9hZGVyOiBnZXRMb2FkZXIsXG4gICAgZ2V0Rm9vdGVyOiBnZXRGb290ZXIsXG4gICAgZ2V0VGltZXJQcm9ncmVzc0JhcjogZ2V0VGltZXJQcm9ncmVzc0JhcixcbiAgICBnZXRGb2N1c2FibGVFbGVtZW50czogZ2V0Rm9jdXNhYmxlRWxlbWVudHMsXG4gICAgZ2V0VmFsaWRhdGlvbk1lc3NhZ2U6IGdldFZhbGlkYXRpb25NZXNzYWdlLFxuICAgIGlzTG9hZGluZzogaXNMb2FkaW5nLFxuICAgIGZpcmU6IGZpcmUsXG4gICAgbWl4aW46IG1peGluLFxuICAgIHNob3dMb2FkaW5nOiBzaG93TG9hZGluZyxcbiAgICBlbmFibGVMb2FkaW5nOiBzaG93TG9hZGluZyxcbiAgICBnZXRUaW1lckxlZnQ6IGdldFRpbWVyTGVmdCxcbiAgICBzdG9wVGltZXI6IHN0b3BUaW1lcixcbiAgICByZXN1bWVUaW1lcjogcmVzdW1lVGltZXIsXG4gICAgdG9nZ2xlVGltZXI6IHRvZ2dsZVRpbWVyLFxuICAgIGluY3JlYXNlVGltZXI6IGluY3JlYXNlVGltZXIsXG4gICAgaXNUaW1lclJ1bm5pbmc6IGlzVGltZXJSdW5uaW5nLFxuICAgIGJpbmRDbGlja0hhbmRsZXI6IGJpbmRDbGlja0hhbmRsZXJcbiAgfSk7XG5cbiAgY2xhc3MgVGltZXIge1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGRlbGF5XG4gICAgICovXG4gICAgY29uc3RydWN0b3IoY2FsbGJhY2ssIGRlbGF5KSB7XG4gICAgICB0aGlzLmNhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgICB0aGlzLnJlbWFpbmluZyA9IGRlbGF5O1xuICAgICAgdGhpcy5ydW5uaW5nID0gZmFsc2U7XG4gICAgICB0aGlzLnN0YXJ0KCk7XG4gICAgfVxuICAgIHN0YXJ0KCkge1xuICAgICAgaWYgKCF0aGlzLnJ1bm5pbmcpIHtcbiAgICAgICAgdGhpcy5ydW5uaW5nID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5zdGFydGVkID0gbmV3IERhdGUoKTtcbiAgICAgICAgdGhpcy5pZCA9IHNldFRpbWVvdXQodGhpcy5jYWxsYmFjaywgdGhpcy5yZW1haW5pbmcpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMucmVtYWluaW5nO1xuICAgIH1cbiAgICBzdG9wKCkge1xuICAgICAgaWYgKHRoaXMucnVubmluZykge1xuICAgICAgICB0aGlzLnJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuaWQpO1xuICAgICAgICB0aGlzLnJlbWFpbmluZyAtPSBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIHRoaXMuc3RhcnRlZC5nZXRUaW1lKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5yZW1haW5pbmc7XG4gICAgfVxuICAgIGluY3JlYXNlKG4pIHtcbiAgICAgIGNvbnN0IHJ1bm5pbmcgPSB0aGlzLnJ1bm5pbmc7XG4gICAgICBpZiAocnVubmluZykge1xuICAgICAgICB0aGlzLnN0b3AoKTtcbiAgICAgIH1cbiAgICAgIHRoaXMucmVtYWluaW5nICs9IG47XG4gICAgICBpZiAocnVubmluZykge1xuICAgICAgICB0aGlzLnN0YXJ0KCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5yZW1haW5pbmc7XG4gICAgfVxuICAgIGdldFRpbWVyTGVmdCgpIHtcbiAgICAgIGlmICh0aGlzLnJ1bm5pbmcpIHtcbiAgICAgICAgdGhpcy5zdG9wKCk7XG4gICAgICAgIHRoaXMuc3RhcnQoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLnJlbWFpbmluZztcbiAgICB9XG4gICAgaXNSdW5uaW5nKCkge1xuICAgICAgcmV0dXJuIHRoaXMucnVubmluZztcbiAgICB9XG4gIH1cblxuICBjb25zdCBzd2FsU3RyaW5nUGFyYW1zID0gWydzd2FsLXRpdGxlJywgJ3N3YWwtaHRtbCcsICdzd2FsLWZvb3RlciddO1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICogQHJldHVybnMge1N3ZWV0QWxlcnRPcHRpb25zfVxuICAgKi9cbiAgY29uc3QgZ2V0VGVtcGxhdGVQYXJhbXMgPSBwYXJhbXMgPT4ge1xuICAgIC8qKiBAdHlwZSB7SFRNTFRlbXBsYXRlRWxlbWVudH0gKi9cbiAgICBjb25zdCB0ZW1wbGF0ZSA9IHR5cGVvZiBwYXJhbXMudGVtcGxhdGUgPT09ICdzdHJpbmcnID8gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihwYXJhbXMudGVtcGxhdGUpIDogcGFyYW1zLnRlbXBsYXRlO1xuICAgIGlmICghdGVtcGxhdGUpIHtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gICAgLyoqIEB0eXBlIHtEb2N1bWVudEZyYWdtZW50fSAqL1xuICAgIGNvbnN0IHRlbXBsYXRlQ29udGVudCA9IHRlbXBsYXRlLmNvbnRlbnQ7XG4gICAgc2hvd1dhcm5pbmdzRm9yRWxlbWVudHModGVtcGxhdGVDb250ZW50KTtcbiAgICBjb25zdCByZXN1bHQgPSBPYmplY3QuYXNzaWduKGdldFN3YWxQYXJhbXModGVtcGxhdGVDb250ZW50KSwgZ2V0U3dhbEZ1bmN0aW9uUGFyYW1zKHRlbXBsYXRlQ29udGVudCksIGdldFN3YWxCdXR0b25zKHRlbXBsYXRlQ29udGVudCksIGdldFN3YWxJbWFnZSh0ZW1wbGF0ZUNvbnRlbnQpLCBnZXRTd2FsSWNvbih0ZW1wbGF0ZUNvbnRlbnQpLCBnZXRTd2FsSW5wdXQodGVtcGxhdGVDb250ZW50KSwgZ2V0U3dhbFN0cmluZ1BhcmFtcyh0ZW1wbGF0ZUNvbnRlbnQsIHN3YWxTdHJpbmdQYXJhbXMpKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0RvY3VtZW50RnJhZ21lbnR9IHRlbXBsYXRlQ29udGVudFxuICAgKiBAcmV0dXJucyB7U3dlZXRBbGVydE9wdGlvbnN9XG4gICAqL1xuICBjb25zdCBnZXRTd2FsUGFyYW1zID0gdGVtcGxhdGVDb250ZW50ID0+IHtcbiAgICBjb25zdCByZXN1bHQgPSB7fTtcbiAgICAvKiogQHR5cGUge0hUTUxFbGVtZW50W119ICovXG4gICAgY29uc3Qgc3dhbFBhcmFtcyA9IEFycmF5LmZyb20odGVtcGxhdGVDb250ZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3N3YWwtcGFyYW0nKSk7XG4gICAgc3dhbFBhcmFtcy5mb3JFYWNoKHBhcmFtID0+IHtcbiAgICAgIHNob3dXYXJuaW5nc0ZvckF0dHJpYnV0ZXMocGFyYW0sIFsnbmFtZScsICd2YWx1ZSddKTtcbiAgICAgIGNvbnN0IHBhcmFtTmFtZSA9IHBhcmFtLmdldEF0dHJpYnV0ZSgnbmFtZScpO1xuICAgICAgY29uc3QgdmFsdWUgPSBwYXJhbS5nZXRBdHRyaWJ1dGUoJ3ZhbHVlJyk7XG4gICAgICBpZiAodHlwZW9mIGRlZmF1bHRQYXJhbXNbcGFyYW1OYW1lXSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgIHJlc3VsdFtwYXJhbU5hbWVdID0gdmFsdWUgIT09ICdmYWxzZSc7XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBkZWZhdWx0UGFyYW1zW3BhcmFtTmFtZV0gPT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJlc3VsdFtwYXJhbU5hbWVdID0gSlNPTi5wYXJzZSh2YWx1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHRbcGFyYW1OYW1lXSA9IHZhbHVlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7RG9jdW1lbnRGcmFnbWVudH0gdGVtcGxhdGVDb250ZW50XG4gICAqIEByZXR1cm5zIHtTd2VldEFsZXJ0T3B0aW9uc31cbiAgICovXG4gIGNvbnN0IGdldFN3YWxGdW5jdGlvblBhcmFtcyA9IHRlbXBsYXRlQ29udGVudCA9PiB7XG4gICAgY29uc3QgcmVzdWx0ID0ge307XG4gICAgLyoqIEB0eXBlIHtIVE1MRWxlbWVudFtdfSAqL1xuICAgIGNvbnN0IHN3YWxGdW5jdGlvbnMgPSBBcnJheS5mcm9tKHRlbXBsYXRlQ29udGVudC5xdWVyeVNlbGVjdG9yQWxsKCdzd2FsLWZ1bmN0aW9uLXBhcmFtJykpO1xuICAgIHN3YWxGdW5jdGlvbnMuZm9yRWFjaChwYXJhbSA9PiB7XG4gICAgICBjb25zdCBwYXJhbU5hbWUgPSBwYXJhbS5nZXRBdHRyaWJ1dGUoJ25hbWUnKTtcbiAgICAgIGNvbnN0IHZhbHVlID0gcGFyYW0uZ2V0QXR0cmlidXRlKCd2YWx1ZScpO1xuICAgICAgcmVzdWx0W3BhcmFtTmFtZV0gPSBuZXcgRnVuY3Rpb24oXCJyZXR1cm4gXCIuY29uY2F0KHZhbHVlKSkoKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0RvY3VtZW50RnJhZ21lbnR9IHRlbXBsYXRlQ29udGVudFxuICAgKiBAcmV0dXJucyB7U3dlZXRBbGVydE9wdGlvbnN9XG4gICAqL1xuICBjb25zdCBnZXRTd2FsQnV0dG9ucyA9IHRlbXBsYXRlQ29udGVudCA9PiB7XG4gICAgY29uc3QgcmVzdWx0ID0ge307XG4gICAgLyoqIEB0eXBlIHtIVE1MRWxlbWVudFtdfSAqL1xuICAgIGNvbnN0IHN3YWxCdXR0b25zID0gQXJyYXkuZnJvbSh0ZW1wbGF0ZUNvbnRlbnQucXVlcnlTZWxlY3RvckFsbCgnc3dhbC1idXR0b24nKSk7XG4gICAgc3dhbEJ1dHRvbnMuZm9yRWFjaChidXR0b24gPT4ge1xuICAgICAgc2hvd1dhcm5pbmdzRm9yQXR0cmlidXRlcyhidXR0b24sIFsndHlwZScsICdjb2xvcicsICdhcmlhLWxhYmVsJ10pO1xuICAgICAgY29uc3QgdHlwZSA9IGJ1dHRvbi5nZXRBdHRyaWJ1dGUoJ3R5cGUnKTtcbiAgICAgIHJlc3VsdFtcIlwiLmNvbmNhdCh0eXBlLCBcIkJ1dHRvblRleHRcIildID0gYnV0dG9uLmlubmVySFRNTDtcbiAgICAgIHJlc3VsdFtcInNob3dcIi5jb25jYXQoY2FwaXRhbGl6ZUZpcnN0TGV0dGVyKHR5cGUpLCBcIkJ1dHRvblwiKV0gPSB0cnVlO1xuICAgICAgaWYgKGJ1dHRvbi5oYXNBdHRyaWJ1dGUoJ2NvbG9yJykpIHtcbiAgICAgICAgcmVzdWx0W1wiXCIuY29uY2F0KHR5cGUsIFwiQnV0dG9uQ29sb3JcIildID0gYnV0dG9uLmdldEF0dHJpYnV0ZSgnY29sb3InKTtcbiAgICAgIH1cbiAgICAgIGlmIChidXR0b24uaGFzQXR0cmlidXRlKCdhcmlhLWxhYmVsJykpIHtcbiAgICAgICAgcmVzdWx0W1wiXCIuY29uY2F0KHR5cGUsIFwiQnV0dG9uQXJpYUxhYmVsXCIpXSA9IGJ1dHRvbi5nZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0RvY3VtZW50RnJhZ21lbnR9IHRlbXBsYXRlQ29udGVudFxuICAgKiBAcmV0dXJucyB7U3dlZXRBbGVydE9wdGlvbnN9XG4gICAqL1xuICBjb25zdCBnZXRTd2FsSW1hZ2UgPSB0ZW1wbGF0ZUNvbnRlbnQgPT4ge1xuICAgIGNvbnN0IHJlc3VsdCA9IHt9O1xuICAgIC8qKiBAdHlwZSB7SFRNTEVsZW1lbnR9ICovXG4gICAgY29uc3QgaW1hZ2UgPSB0ZW1wbGF0ZUNvbnRlbnQucXVlcnlTZWxlY3Rvcignc3dhbC1pbWFnZScpO1xuICAgIGlmIChpbWFnZSkge1xuICAgICAgc2hvd1dhcm5pbmdzRm9yQXR0cmlidXRlcyhpbWFnZSwgWydzcmMnLCAnd2lkdGgnLCAnaGVpZ2h0JywgJ2FsdCddKTtcbiAgICAgIGlmIChpbWFnZS5oYXNBdHRyaWJ1dGUoJ3NyYycpKSB7XG4gICAgICAgIHJlc3VsdC5pbWFnZVVybCA9IGltYWdlLmdldEF0dHJpYnV0ZSgnc3JjJyk7XG4gICAgICB9XG4gICAgICBpZiAoaW1hZ2UuaGFzQXR0cmlidXRlKCd3aWR0aCcpKSB7XG4gICAgICAgIHJlc3VsdC5pbWFnZVdpZHRoID0gaW1hZ2UuZ2V0QXR0cmlidXRlKCd3aWR0aCcpO1xuICAgICAgfVxuICAgICAgaWYgKGltYWdlLmhhc0F0dHJpYnV0ZSgnaGVpZ2h0JykpIHtcbiAgICAgICAgcmVzdWx0LmltYWdlSGVpZ2h0ID0gaW1hZ2UuZ2V0QXR0cmlidXRlKCdoZWlnaHQnKTtcbiAgICAgIH1cbiAgICAgIGlmIChpbWFnZS5oYXNBdHRyaWJ1dGUoJ2FsdCcpKSB7XG4gICAgICAgIHJlc3VsdC5pbWFnZUFsdCA9IGltYWdlLmdldEF0dHJpYnV0ZSgnYWx0Jyk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7RG9jdW1lbnRGcmFnbWVudH0gdGVtcGxhdGVDb250ZW50XG4gICAqIEByZXR1cm5zIHtTd2VldEFsZXJ0T3B0aW9uc31cbiAgICovXG4gIGNvbnN0IGdldFN3YWxJY29uID0gdGVtcGxhdGVDb250ZW50ID0+IHtcbiAgICBjb25zdCByZXN1bHQgPSB7fTtcbiAgICAvKiogQHR5cGUge0hUTUxFbGVtZW50fSAqL1xuICAgIGNvbnN0IGljb24gPSB0ZW1wbGF0ZUNvbnRlbnQucXVlcnlTZWxlY3Rvcignc3dhbC1pY29uJyk7XG4gICAgaWYgKGljb24pIHtcbiAgICAgIHNob3dXYXJuaW5nc0ZvckF0dHJpYnV0ZXMoaWNvbiwgWyd0eXBlJywgJ2NvbG9yJ10pO1xuICAgICAgaWYgKGljb24uaGFzQXR0cmlidXRlKCd0eXBlJykpIHtcbiAgICAgICAgLyoqIEB0eXBlIHtTd2VldEFsZXJ0SWNvbn0gKi9cbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICByZXN1bHQuaWNvbiA9IGljb24uZ2V0QXR0cmlidXRlKCd0eXBlJyk7XG4gICAgICB9XG4gICAgICBpZiAoaWNvbi5oYXNBdHRyaWJ1dGUoJ2NvbG9yJykpIHtcbiAgICAgICAgcmVzdWx0Lmljb25Db2xvciA9IGljb24uZ2V0QXR0cmlidXRlKCdjb2xvcicpO1xuICAgICAgfVxuICAgICAgcmVzdWx0Lmljb25IdG1sID0gaWNvbi5pbm5lckhUTUw7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7RG9jdW1lbnRGcmFnbWVudH0gdGVtcGxhdGVDb250ZW50XG4gICAqIEByZXR1cm5zIHtTd2VldEFsZXJ0T3B0aW9uc31cbiAgICovXG4gIGNvbnN0IGdldFN3YWxJbnB1dCA9IHRlbXBsYXRlQ29udGVudCA9PiB7XG4gICAgY29uc3QgcmVzdWx0ID0ge307XG4gICAgLyoqIEB0eXBlIHtIVE1MRWxlbWVudH0gKi9cbiAgICBjb25zdCBpbnB1dCA9IHRlbXBsYXRlQ29udGVudC5xdWVyeVNlbGVjdG9yKCdzd2FsLWlucHV0Jyk7XG4gICAgaWYgKGlucHV0KSB7XG4gICAgICBzaG93V2FybmluZ3NGb3JBdHRyaWJ1dGVzKGlucHV0LCBbJ3R5cGUnLCAnbGFiZWwnLCAncGxhY2Vob2xkZXInLCAndmFsdWUnXSk7XG4gICAgICAvKiogQHR5cGUge1N3ZWV0QWxlcnRJbnB1dH0gKi9cbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIHJlc3VsdC5pbnB1dCA9IGlucHV0LmdldEF0dHJpYnV0ZSgndHlwZScpIHx8ICd0ZXh0JztcbiAgICAgIGlmIChpbnB1dC5oYXNBdHRyaWJ1dGUoJ2xhYmVsJykpIHtcbiAgICAgICAgcmVzdWx0LmlucHV0TGFiZWwgPSBpbnB1dC5nZXRBdHRyaWJ1dGUoJ2xhYmVsJyk7XG4gICAgICB9XG4gICAgICBpZiAoaW5wdXQuaGFzQXR0cmlidXRlKCdwbGFjZWhvbGRlcicpKSB7XG4gICAgICAgIHJlc3VsdC5pbnB1dFBsYWNlaG9sZGVyID0gaW5wdXQuZ2V0QXR0cmlidXRlKCdwbGFjZWhvbGRlcicpO1xuICAgICAgfVxuICAgICAgaWYgKGlucHV0Lmhhc0F0dHJpYnV0ZSgndmFsdWUnKSkge1xuICAgICAgICByZXN1bHQuaW5wdXRWYWx1ZSA9IGlucHV0LmdldEF0dHJpYnV0ZSgndmFsdWUnKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLyoqIEB0eXBlIHtIVE1MRWxlbWVudFtdfSAqL1xuICAgIGNvbnN0IGlucHV0T3B0aW9ucyA9IEFycmF5LmZyb20odGVtcGxhdGVDb250ZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3N3YWwtaW5wdXQtb3B0aW9uJykpO1xuICAgIGlmIChpbnB1dE9wdGlvbnMubGVuZ3RoKSB7XG4gICAgICByZXN1bHQuaW5wdXRPcHRpb25zID0ge307XG4gICAgICBpbnB1dE9wdGlvbnMuZm9yRWFjaChvcHRpb24gPT4ge1xuICAgICAgICBzaG93V2FybmluZ3NGb3JBdHRyaWJ1dGVzKG9wdGlvbiwgWyd2YWx1ZSddKTtcbiAgICAgICAgY29uc3Qgb3B0aW9uVmFsdWUgPSBvcHRpb24uZ2V0QXR0cmlidXRlKCd2YWx1ZScpO1xuICAgICAgICBjb25zdCBvcHRpb25OYW1lID0gb3B0aW9uLmlubmVySFRNTDtcbiAgICAgICAgcmVzdWx0LmlucHV0T3B0aW9uc1tvcHRpb25WYWx1ZV0gPSBvcHRpb25OYW1lO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7RG9jdW1lbnRGcmFnbWVudH0gdGVtcGxhdGVDb250ZW50XG4gICAqIEBwYXJhbSB7c3RyaW5nW119IHBhcmFtTmFtZXNcbiAgICogQHJldHVybnMge1N3ZWV0QWxlcnRPcHRpb25zfVxuICAgKi9cbiAgY29uc3QgZ2V0U3dhbFN0cmluZ1BhcmFtcyA9ICh0ZW1wbGF0ZUNvbnRlbnQsIHBhcmFtTmFtZXMpID0+IHtcbiAgICBjb25zdCByZXN1bHQgPSB7fTtcbiAgICBmb3IgKGNvbnN0IGkgaW4gcGFyYW1OYW1lcykge1xuICAgICAgY29uc3QgcGFyYW1OYW1lID0gcGFyYW1OYW1lc1tpXTtcbiAgICAgIC8qKiBAdHlwZSB7SFRNTEVsZW1lbnR9ICovXG4gICAgICBjb25zdCB0YWcgPSB0ZW1wbGF0ZUNvbnRlbnQucXVlcnlTZWxlY3RvcihwYXJhbU5hbWUpO1xuICAgICAgaWYgKHRhZykge1xuICAgICAgICBzaG93V2FybmluZ3NGb3JBdHRyaWJ1dGVzKHRhZywgW10pO1xuICAgICAgICByZXN1bHRbcGFyYW1OYW1lLnJlcGxhY2UoL15zd2FsLS8sICcnKV0gPSB0YWcuaW5uZXJIVE1MLnRyaW0oKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtEb2N1bWVudEZyYWdtZW50fSB0ZW1wbGF0ZUNvbnRlbnRcbiAgICovXG4gIGNvbnN0IHNob3dXYXJuaW5nc0ZvckVsZW1lbnRzID0gdGVtcGxhdGVDb250ZW50ID0+IHtcbiAgICBjb25zdCBhbGxvd2VkRWxlbWVudHMgPSBzd2FsU3RyaW5nUGFyYW1zLmNvbmNhdChbJ3N3YWwtcGFyYW0nLCAnc3dhbC1mdW5jdGlvbi1wYXJhbScsICdzd2FsLWJ1dHRvbicsICdzd2FsLWltYWdlJywgJ3N3YWwtaWNvbicsICdzd2FsLWlucHV0JywgJ3N3YWwtaW5wdXQtb3B0aW9uJ10pO1xuICAgIEFycmF5LmZyb20odGVtcGxhdGVDb250ZW50LmNoaWxkcmVuKS5mb3JFYWNoKGVsID0+IHtcbiAgICAgIGNvbnN0IHRhZ05hbWUgPSBlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgICBpZiAoIWFsbG93ZWRFbGVtZW50cy5pbmNsdWRlcyh0YWdOYW1lKSkge1xuICAgICAgICB3YXJuKFwiVW5yZWNvZ25pemVkIGVsZW1lbnQgPFwiLmNvbmNhdCh0YWdOYW1lLCBcIj5cIikpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbFxuICAgKiBAcGFyYW0ge3N0cmluZ1tdfSBhbGxvd2VkQXR0cmlidXRlc1xuICAgKi9cbiAgY29uc3Qgc2hvd1dhcm5pbmdzRm9yQXR0cmlidXRlcyA9IChlbCwgYWxsb3dlZEF0dHJpYnV0ZXMpID0+IHtcbiAgICBBcnJheS5mcm9tKGVsLmF0dHJpYnV0ZXMpLmZvckVhY2goYXR0cmlidXRlID0+IHtcbiAgICAgIGlmIChhbGxvd2VkQXR0cmlidXRlcy5pbmRleE9mKGF0dHJpYnV0ZS5uYW1lKSA9PT0gLTEpIHtcbiAgICAgICAgd2FybihbXCJVbnJlY29nbml6ZWQgYXR0cmlidXRlIFxcXCJcIi5jb25jYXQoYXR0cmlidXRlLm5hbWUsIFwiXFxcIiBvbiA8XCIpLmNvbmNhdChlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCksIFwiPi5cIiksIFwiXCIuY29uY2F0KGFsbG93ZWRBdHRyaWJ1dGVzLmxlbmd0aCA/IFwiQWxsb3dlZCBhdHRyaWJ1dGVzIGFyZTogXCIuY29uY2F0KGFsbG93ZWRBdHRyaWJ1dGVzLmpvaW4oJywgJykpIDogJ1RvIHNldCB0aGUgdmFsdWUsIHVzZSBIVE1MIHdpdGhpbiB0aGUgZWxlbWVudC4nKV0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIGNvbnN0IFNIT1dfQ0xBU1NfVElNRU9VVCA9IDEwO1xuXG4gIC8qKlxuICAgKiBPcGVuIHBvcHVwLCBhZGQgbmVjZXNzYXJ5IGNsYXNzZXMgYW5kIHN0eWxlcywgZml4IHNjcm9sbGJhclxuICAgKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICovXG4gIGNvbnN0IG9wZW5Qb3B1cCA9IHBhcmFtcyA9PiB7XG4gICAgY29uc3QgY29udGFpbmVyID0gZ2V0Q29udGFpbmVyKCk7XG4gICAgY29uc3QgcG9wdXAgPSBnZXRQb3B1cCgpO1xuICAgIGlmICh0eXBlb2YgcGFyYW1zLndpbGxPcGVuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBwYXJhbXMud2lsbE9wZW4ocG9wdXApO1xuICAgIH1cbiAgICBjb25zdCBib2R5U3R5bGVzID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZG9jdW1lbnQuYm9keSk7XG4gICAgY29uc3QgaW5pdGlhbEJvZHlPdmVyZmxvdyA9IGJvZHlTdHlsZXMub3ZlcmZsb3dZO1xuICAgIGFkZENsYXNzZXMkMShjb250YWluZXIsIHBvcHVwLCBwYXJhbXMpO1xuXG4gICAgLy8gc2Nyb2xsaW5nIGlzICdoaWRkZW4nIHVudGlsIGFuaW1hdGlvbiBpcyBkb25lLCBhZnRlciB0aGF0ICdhdXRvJ1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgc2V0U2Nyb2xsaW5nVmlzaWJpbGl0eShjb250YWluZXIsIHBvcHVwKTtcbiAgICB9LCBTSE9XX0NMQVNTX1RJTUVPVVQpO1xuICAgIGlmIChpc01vZGFsKCkpIHtcbiAgICAgIGZpeFNjcm9sbENvbnRhaW5lcihjb250YWluZXIsIHBhcmFtcy5zY3JvbGxiYXJQYWRkaW5nLCBpbml0aWFsQm9keU92ZXJmbG93KTtcbiAgICAgIHNldEFyaWFIaWRkZW4oKTtcbiAgICB9XG4gICAgaWYgKCFpc1RvYXN0KCkgJiYgIWdsb2JhbFN0YXRlLnByZXZpb3VzQWN0aXZlRWxlbWVudCkge1xuICAgICAgZ2xvYmFsU3RhdGUucHJldmlvdXNBY3RpdmVFbGVtZW50ID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBwYXJhbXMuZGlkT3BlbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgc2V0VGltZW91dCgoKSA9PiBwYXJhbXMuZGlkT3Blbihwb3B1cCkpO1xuICAgIH1cbiAgICByZW1vdmVDbGFzcyhjb250YWluZXIsIHN3YWxDbGFzc2VzWyduby10cmFuc2l0aW9uJ10pO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0FuaW1hdGlvbkV2ZW50fSBldmVudFxuICAgKi9cbiAgY29uc3Qgc3dhbE9wZW5BbmltYXRpb25GaW5pc2hlZCA9IGV2ZW50ID0+IHtcbiAgICBjb25zdCBwb3B1cCA9IGdldFBvcHVwKCk7XG4gICAgaWYgKGV2ZW50LnRhcmdldCAhPT0gcG9wdXApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgY29udGFpbmVyID0gZ2V0Q29udGFpbmVyKCk7XG4gICAgcG9wdXAucmVtb3ZlRXZlbnRMaXN0ZW5lcihhbmltYXRpb25FbmRFdmVudCwgc3dhbE9wZW5BbmltYXRpb25GaW5pc2hlZCk7XG4gICAgY29udGFpbmVyLnN0eWxlLm92ZXJmbG93WSA9ICdhdXRvJztcbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gY29udGFpbmVyXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHBvcHVwXG4gICAqL1xuICBjb25zdCBzZXRTY3JvbGxpbmdWaXNpYmlsaXR5ID0gKGNvbnRhaW5lciwgcG9wdXApID0+IHtcbiAgICBpZiAoYW5pbWF0aW9uRW5kRXZlbnQgJiYgaGFzQ3NzQW5pbWF0aW9uKHBvcHVwKSkge1xuICAgICAgY29udGFpbmVyLnN0eWxlLm92ZXJmbG93WSA9ICdoaWRkZW4nO1xuICAgICAgcG9wdXAuYWRkRXZlbnRMaXN0ZW5lcihhbmltYXRpb25FbmRFdmVudCwgc3dhbE9wZW5BbmltYXRpb25GaW5pc2hlZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnRhaW5lci5zdHlsZS5vdmVyZmxvd1kgPSAnYXV0byc7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBjb250YWluZXJcbiAgICogQHBhcmFtIHtib29sZWFufSBzY3JvbGxiYXJQYWRkaW5nXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpbml0aWFsQm9keU92ZXJmbG93XG4gICAqL1xuICBjb25zdCBmaXhTY3JvbGxDb250YWluZXIgPSAoY29udGFpbmVyLCBzY3JvbGxiYXJQYWRkaW5nLCBpbml0aWFsQm9keU92ZXJmbG93KSA9PiB7XG4gICAgaU9TZml4KCk7XG4gICAgaWYgKHNjcm9sbGJhclBhZGRpbmcgJiYgaW5pdGlhbEJvZHlPdmVyZmxvdyAhPT0gJ2hpZGRlbicpIHtcbiAgICAgIGZpeFNjcm9sbGJhcigpO1xuICAgIH1cblxuICAgIC8vIHN3ZWV0YWxlcnQyL2lzc3Vlcy8xMjQ3XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBjb250YWluZXIuc2Nyb2xsVG9wID0gMDtcbiAgICB9KTtcbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gY29udGFpbmVyXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHBvcHVwXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKi9cbiAgY29uc3QgYWRkQ2xhc3NlcyQxID0gKGNvbnRhaW5lciwgcG9wdXAsIHBhcmFtcykgPT4ge1xuICAgIGFkZENsYXNzKGNvbnRhaW5lciwgcGFyYW1zLnNob3dDbGFzcy5iYWNrZHJvcCk7XG4gICAgLy8gdGhpcyB3b3JrYXJvdW5kIHdpdGggb3BhY2l0eSBpcyBuZWVkZWQgZm9yIGh0dHBzOi8vZ2l0aHViLmNvbS9zd2VldGFsZXJ0Mi9zd2VldGFsZXJ0Mi9pc3N1ZXMvMjA1OVxuICAgIHBvcHVwLnN0eWxlLnNldFByb3BlcnR5KCdvcGFjaXR5JywgJzAnLCAnaW1wb3J0YW50Jyk7XG4gICAgc2hvdyhwb3B1cCwgJ2dyaWQnKTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIC8vIEFuaW1hdGUgcG9wdXAgcmlnaHQgYWZ0ZXIgc2hvd2luZyBpdFxuICAgICAgYWRkQ2xhc3MocG9wdXAsIHBhcmFtcy5zaG93Q2xhc3MucG9wdXApO1xuICAgICAgLy8gYW5kIHJlbW92ZSB0aGUgb3BhY2l0eSB3b3JrYXJvdW5kXG4gICAgICBwb3B1cC5zdHlsZS5yZW1vdmVQcm9wZXJ0eSgnb3BhY2l0eScpO1xuICAgIH0sIFNIT1dfQ0xBU1NfVElNRU9VVCk7IC8vIDEwbXMgaW4gb3JkZXIgdG8gZml4ICMyMDYyXG5cbiAgICBhZGRDbGFzcyhbZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LCBkb2N1bWVudC5ib2R5XSwgc3dhbENsYXNzZXMuc2hvd24pO1xuICAgIGlmIChwYXJhbXMuaGVpZ2h0QXV0byAmJiBwYXJhbXMuYmFja2Ryb3AgJiYgIXBhcmFtcy50b2FzdCkge1xuICAgICAgYWRkQ2xhc3MoW2RvY3VtZW50LmRvY3VtZW50RWxlbWVudCwgZG9jdW1lbnQuYm9keV0sIHN3YWxDbGFzc2VzWydoZWlnaHQtYXV0byddKTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIGRlZmF1bHRJbnB1dFZhbGlkYXRvcnMgPSB7XG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHN0cmluZ1xuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB2YWxpZGF0aW9uTWVzc2FnZVxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPHZvaWQgfCBzdHJpbmc+fVxuICAgICAqL1xuICAgIGVtYWlsOiAoc3RyaW5nLCB2YWxpZGF0aW9uTWVzc2FnZSkgPT4ge1xuICAgICAgcmV0dXJuIC9eW2EtekEtWjAtOS4rXy1dK0BbYS16QS1aMC05Li1dK1xcLlthLXpBLVowLTktXXsyLDI0fSQvLnRlc3Qoc3RyaW5nKSA/IFByb21pc2UucmVzb2x2ZSgpIDogUHJvbWlzZS5yZXNvbHZlKHZhbGlkYXRpb25NZXNzYWdlIHx8ICdJbnZhbGlkIGVtYWlsIGFkZHJlc3MnKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmdcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsaWRhdGlvbk1lc3NhZ2VcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTx2b2lkIHwgc3RyaW5nPn1cbiAgICAgKi9cbiAgICB1cmw6IChzdHJpbmcsIHZhbGlkYXRpb25NZXNzYWdlKSA9PiB7XG4gICAgICAvLyB0YWtlbiBmcm9tIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8zODA5NDM1IHdpdGggYSBzbWFsbCBjaGFuZ2UgZnJvbSAjMTMwNiBhbmQgIzIwMTNcbiAgICAgIHJldHVybiAvXmh0dHBzPzpcXC9cXC8od3d3XFwuKT9bLWEtekEtWjAtOUA6JS5fK34jPV17MSwyNTZ9XFwuW2Etel17Miw2M31cXGIoWy1hLXpBLVowLTlAOiVfKy5+Iz8mLz1dKikkLy50ZXN0KHN0cmluZykgPyBQcm9taXNlLnJlc29sdmUoKSA6IFByb21pc2UucmVzb2x2ZSh2YWxpZGF0aW9uTWVzc2FnZSB8fCAnSW52YWxpZCBVUkwnKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKi9cbiAgZnVuY3Rpb24gc2V0RGVmYXVsdElucHV0VmFsaWRhdG9ycyhwYXJhbXMpIHtcbiAgICAvLyBVc2UgZGVmYXVsdCBgaW5wdXRWYWxpZGF0b3JgIGZvciBzdXBwb3J0ZWQgaW5wdXQgdHlwZXMgaWYgbm90IHByb3ZpZGVkXG4gICAgaWYgKCFwYXJhbXMuaW5wdXRWYWxpZGF0b3IpIHtcbiAgICAgIE9iamVjdC5rZXlzKGRlZmF1bHRJbnB1dFZhbGlkYXRvcnMpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgaWYgKHBhcmFtcy5pbnB1dCA9PT0ga2V5KSB7XG4gICAgICAgICAgcGFyYW1zLmlucHV0VmFsaWRhdG9yID0gZGVmYXVsdElucHV0VmFsaWRhdG9yc1trZXldO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqL1xuICBmdW5jdGlvbiB2YWxpZGF0ZUN1c3RvbVRhcmdldEVsZW1lbnQocGFyYW1zKSB7XG4gICAgLy8gRGV0ZXJtaW5lIGlmIHRoZSBjdXN0b20gdGFyZ2V0IGVsZW1lbnQgaXMgdmFsaWRcbiAgICBpZiAoIXBhcmFtcy50YXJnZXQgfHwgdHlwZW9mIHBhcmFtcy50YXJnZXQgPT09ICdzdHJpbmcnICYmICFkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHBhcmFtcy50YXJnZXQpIHx8IHR5cGVvZiBwYXJhbXMudGFyZ2V0ICE9PSAnc3RyaW5nJyAmJiAhcGFyYW1zLnRhcmdldC5hcHBlbmRDaGlsZCkge1xuICAgICAgd2FybignVGFyZ2V0IHBhcmFtZXRlciBpcyBub3QgdmFsaWQsIGRlZmF1bHRpbmcgdG8gXCJib2R5XCInKTtcbiAgICAgIHBhcmFtcy50YXJnZXQgPSAnYm9keSc7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNldCB0eXBlLCB0ZXh0IGFuZCBhY3Rpb25zIG9uIHBvcHVwXG4gICAqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKi9cbiAgZnVuY3Rpb24gc2V0UGFyYW1ldGVycyhwYXJhbXMpIHtcbiAgICBzZXREZWZhdWx0SW5wdXRWYWxpZGF0b3JzKHBhcmFtcyk7XG5cbiAgICAvLyBzaG93TG9hZGVyT25Db25maXJtICYmIHByZUNvbmZpcm1cbiAgICBpZiAocGFyYW1zLnNob3dMb2FkZXJPbkNvbmZpcm0gJiYgIXBhcmFtcy5wcmVDb25maXJtKSB7XG4gICAgICB3YXJuKCdzaG93TG9hZGVyT25Db25maXJtIGlzIHNldCB0byB0cnVlLCBidXQgcHJlQ29uZmlybSBpcyBub3QgZGVmaW5lZC5cXG4nICsgJ3Nob3dMb2FkZXJPbkNvbmZpcm0gc2hvdWxkIGJlIHVzZWQgdG9nZXRoZXIgd2l0aCBwcmVDb25maXJtLCBzZWUgdXNhZ2UgZXhhbXBsZTpcXG4nICsgJ2h0dHBzOi8vc3dlZXRhbGVydDIuZ2l0aHViLmlvLyNhamF4LXJlcXVlc3QnKTtcbiAgICB9XG4gICAgdmFsaWRhdGVDdXN0b21UYXJnZXRFbGVtZW50KHBhcmFtcyk7XG5cbiAgICAvLyBSZXBsYWNlIG5ld2xpbmVzIHdpdGggPGJyPiBpbiB0aXRsZVxuICAgIGlmICh0eXBlb2YgcGFyYW1zLnRpdGxlID09PSAnc3RyaW5nJykge1xuICAgICAgcGFyYW1zLnRpdGxlID0gcGFyYW1zLnRpdGxlLnNwbGl0KCdcXG4nKS5qb2luKCc8YnIgLz4nKTtcbiAgICB9XG4gICAgaW5pdChwYXJhbXMpO1xuICB9XG5cbiAgbGV0IGN1cnJlbnRJbnN0YW5jZTtcbiAgY2xhc3MgU3dlZXRBbGVydCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAvLyBQcmV2ZW50IHJ1biBpbiBOb2RlIGVudlxuICAgICAgaWYgKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGN1cnJlbnRJbnN0YW5jZSA9IHRoaXM7XG5cbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gbmV3IEFycmF5KF9sZW4pLCBfa2V5ID0gMDsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgICAgICBhcmdzW19rZXldID0gYXJndW1lbnRzW19rZXldO1xuICAgICAgfVxuICAgICAgY29uc3Qgb3V0ZXJQYXJhbXMgPSBPYmplY3QuZnJlZXplKHRoaXMuY29uc3RydWN0b3IuYXJnc1RvUGFyYW1zKGFyZ3MpKTtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMsIHtcbiAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgdmFsdWU6IG91dGVyUGFyYW1zLFxuICAgICAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgY29uc3QgcHJvbWlzZSA9IGN1cnJlbnRJbnN0YW5jZS5fbWFpbihjdXJyZW50SW5zdGFuY2UucGFyYW1zKTtcbiAgICAgIHByaXZhdGVQcm9wcy5wcm9taXNlLnNldCh0aGlzLCBwcm9taXNlKTtcbiAgICB9XG4gICAgX21haW4odXNlclBhcmFtcykge1xuICAgICAgbGV0IG1peGluUGFyYW1zID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB7fTtcbiAgICAgIHNob3dXYXJuaW5nc0ZvclBhcmFtcyhPYmplY3QuYXNzaWduKHt9LCBtaXhpblBhcmFtcywgdXNlclBhcmFtcykpO1xuICAgICAgaWYgKGdsb2JhbFN0YXRlLmN1cnJlbnRJbnN0YW5jZSkge1xuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIGdsb2JhbFN0YXRlLmN1cnJlbnRJbnN0YW5jZS5fZGVzdHJveSgpO1xuICAgICAgICBpZiAoaXNNb2RhbCgpKSB7XG4gICAgICAgICAgdW5zZXRBcmlhSGlkZGVuKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGdsb2JhbFN0YXRlLmN1cnJlbnRJbnN0YW5jZSA9IGN1cnJlbnRJbnN0YW5jZTtcbiAgICAgIGNvbnN0IGlubmVyUGFyYW1zID0gcHJlcGFyZVBhcmFtcyh1c2VyUGFyYW1zLCBtaXhpblBhcmFtcyk7XG4gICAgICBzZXRQYXJhbWV0ZXJzKGlubmVyUGFyYW1zKTtcbiAgICAgIE9iamVjdC5mcmVlemUoaW5uZXJQYXJhbXMpO1xuXG4gICAgICAvLyBjbGVhciB0aGUgcHJldmlvdXMgdGltZXJcbiAgICAgIGlmIChnbG9iYWxTdGF0ZS50aW1lb3V0KSB7XG4gICAgICAgIGdsb2JhbFN0YXRlLnRpbWVvdXQuc3RvcCgpO1xuICAgICAgICBkZWxldGUgZ2xvYmFsU3RhdGUudGltZW91dDtcbiAgICAgIH1cblxuICAgICAgLy8gY2xlYXIgdGhlIHJlc3RvcmUgZm9jdXMgdGltZW91dFxuICAgICAgY2xlYXJUaW1lb3V0KGdsb2JhbFN0YXRlLnJlc3RvcmVGb2N1c1RpbWVvdXQpO1xuICAgICAgY29uc3QgZG9tQ2FjaGUgPSBwb3B1bGF0ZURvbUNhY2hlKGN1cnJlbnRJbnN0YW5jZSk7XG4gICAgICByZW5kZXIoY3VycmVudEluc3RhbmNlLCBpbm5lclBhcmFtcyk7XG4gICAgICBwcml2YXRlUHJvcHMuaW5uZXJQYXJhbXMuc2V0KGN1cnJlbnRJbnN0YW5jZSwgaW5uZXJQYXJhbXMpO1xuICAgICAgcmV0dXJuIHN3YWxQcm9taXNlKGN1cnJlbnRJbnN0YW5jZSwgZG9tQ2FjaGUsIGlubmVyUGFyYW1zKTtcbiAgICB9XG5cbiAgICAvLyBgY2F0Y2hgIGNhbm5vdCBiZSB0aGUgbmFtZSBvZiBhIG1vZHVsZSBleHBvcnQsIHNvIHdlIGRlZmluZSBvdXIgdGhlbmFibGUgbWV0aG9kcyBoZXJlIGluc3RlYWRcbiAgICB0aGVuKG9uRnVsZmlsbGVkKSB7XG4gICAgICBjb25zdCBwcm9taXNlID0gcHJpdmF0ZVByb3BzLnByb21pc2UuZ2V0KHRoaXMpO1xuICAgICAgcmV0dXJuIHByb21pc2UudGhlbihvbkZ1bGZpbGxlZCk7XG4gICAgfVxuICAgIGZpbmFsbHkob25GaW5hbGx5KSB7XG4gICAgICBjb25zdCBwcm9taXNlID0gcHJpdmF0ZVByb3BzLnByb21pc2UuZ2V0KHRoaXMpO1xuICAgICAgcmV0dXJuIHByb21pc2UuZmluYWxseShvbkZpbmFsbHkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnQyfSBpbnN0YW5jZVxuICAgKiBAcGFyYW0ge0RvbUNhY2hlfSBkb21DYWNoZVxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBpbm5lclBhcmFtc1xuICAgKiBAcmV0dXJucyB7UHJvbWlzZX1cbiAgICovXG4gIGNvbnN0IHN3YWxQcm9taXNlID0gKGluc3RhbmNlLCBkb21DYWNoZSwgaW5uZXJQYXJhbXMpID0+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgLy8gZnVuY3Rpb25zIHRvIGhhbmRsZSBhbGwgY2xvc2luZ3MvZGlzbWlzc2Fsc1xuICAgICAgLyoqXG4gICAgICAgKiBAcGFyYW0ge0Rpc21pc3NSZWFzb259IGRpc21pc3NcbiAgICAgICAqL1xuICAgICAgY29uc3QgZGlzbWlzc1dpdGggPSBkaXNtaXNzID0+IHtcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBpbnN0YW5jZS5jbG9zZSh7XG4gICAgICAgICAgaXNEaXNtaXNzZWQ6IHRydWUsXG4gICAgICAgICAgZGlzbWlzc1xuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgICBwcml2YXRlTWV0aG9kcy5zd2FsUHJvbWlzZVJlc29sdmUuc2V0KGluc3RhbmNlLCByZXNvbHZlKTtcbiAgICAgIHByaXZhdGVNZXRob2RzLnN3YWxQcm9taXNlUmVqZWN0LnNldChpbnN0YW5jZSwgcmVqZWN0KTtcbiAgICAgIGRvbUNhY2hlLmNvbmZpcm1CdXR0b24ub25jbGljayA9ICgpID0+IHtcbiAgICAgICAgaGFuZGxlQ29uZmlybUJ1dHRvbkNsaWNrKGluc3RhbmNlKTtcbiAgICAgIH07XG4gICAgICBkb21DYWNoZS5kZW55QnV0dG9uLm9uY2xpY2sgPSAoKSA9PiB7XG4gICAgICAgIGhhbmRsZURlbnlCdXR0b25DbGljayhpbnN0YW5jZSk7XG4gICAgICB9O1xuICAgICAgZG9tQ2FjaGUuY2FuY2VsQnV0dG9uLm9uY2xpY2sgPSAoKSA9PiB7XG4gICAgICAgIGhhbmRsZUNhbmNlbEJ1dHRvbkNsaWNrKGluc3RhbmNlLCBkaXNtaXNzV2l0aCk7XG4gICAgICB9O1xuICAgICAgZG9tQ2FjaGUuY2xvc2VCdXR0b24ub25jbGljayA9ICgpID0+IHtcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBkaXNtaXNzV2l0aChEaXNtaXNzUmVhc29uLmNsb3NlKTtcbiAgICAgIH07XG4gICAgICBoYW5kbGVQb3B1cENsaWNrKGluc3RhbmNlLCBkb21DYWNoZSwgZGlzbWlzc1dpdGgpO1xuICAgICAgYWRkS2V5ZG93bkhhbmRsZXIoaW5zdGFuY2UsIGdsb2JhbFN0YXRlLCBpbm5lclBhcmFtcywgZGlzbWlzc1dpdGgpO1xuICAgICAgaGFuZGxlSW5wdXRPcHRpb25zQW5kVmFsdWUoaW5zdGFuY2UsIGlubmVyUGFyYW1zKTtcbiAgICAgIG9wZW5Qb3B1cChpbm5lclBhcmFtcyk7XG4gICAgICBzZXR1cFRpbWVyKGdsb2JhbFN0YXRlLCBpbm5lclBhcmFtcywgZGlzbWlzc1dpdGgpO1xuICAgICAgaW5pdEZvY3VzKGRvbUNhY2hlLCBpbm5lclBhcmFtcyk7XG5cbiAgICAgIC8vIFNjcm9sbCBjb250YWluZXIgdG8gdG9wIG9uIG9wZW4gKCMxMjQ3LCAjMTk0NilcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBkb21DYWNoZS5jb250YWluZXIuc2Nyb2xsVG9wID0gMDtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSB1c2VyUGFyYW1zXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IG1peGluUGFyYW1zXG4gICAqIEByZXR1cm5zIHtTd2VldEFsZXJ0T3B0aW9uc31cbiAgICovXG4gIGNvbnN0IHByZXBhcmVQYXJhbXMgPSAodXNlclBhcmFtcywgbWl4aW5QYXJhbXMpID0+IHtcbiAgICBjb25zdCB0ZW1wbGF0ZVBhcmFtcyA9IGdldFRlbXBsYXRlUGFyYW1zKHVzZXJQYXJhbXMpO1xuICAgIGNvbnN0IHBhcmFtcyA9IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRQYXJhbXMsIG1peGluUGFyYW1zLCB0ZW1wbGF0ZVBhcmFtcywgdXNlclBhcmFtcyk7IC8vIHByZWNlZGVuY2UgaXMgZGVzY3JpYmVkIGluICMyMTMxXG4gICAgcGFyYW1zLnNob3dDbGFzcyA9IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRQYXJhbXMuc2hvd0NsYXNzLCBwYXJhbXMuc2hvd0NsYXNzKTtcbiAgICBwYXJhbXMuaGlkZUNsYXNzID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdFBhcmFtcy5oaWRlQ2xhc3MsIHBhcmFtcy5oaWRlQ2xhc3MpO1xuICAgIHJldHVybiBwYXJhbXM7XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydDJ9IGluc3RhbmNlXG4gICAqIEByZXR1cm5zIHtEb21DYWNoZX1cbiAgICovXG4gIGNvbnN0IHBvcHVsYXRlRG9tQ2FjaGUgPSBpbnN0YW5jZSA9PiB7XG4gICAgY29uc3QgZG9tQ2FjaGUgPSB7XG4gICAgICBwb3B1cDogZ2V0UG9wdXAoKSxcbiAgICAgIGNvbnRhaW5lcjogZ2V0Q29udGFpbmVyKCksXG4gICAgICBhY3Rpb25zOiBnZXRBY3Rpb25zKCksXG4gICAgICBjb25maXJtQnV0dG9uOiBnZXRDb25maXJtQnV0dG9uKCksXG4gICAgICBkZW55QnV0dG9uOiBnZXREZW55QnV0dG9uKCksXG4gICAgICBjYW5jZWxCdXR0b246IGdldENhbmNlbEJ1dHRvbigpLFxuICAgICAgbG9hZGVyOiBnZXRMb2FkZXIoKSxcbiAgICAgIGNsb3NlQnV0dG9uOiBnZXRDbG9zZUJ1dHRvbigpLFxuICAgICAgdmFsaWRhdGlvbk1lc3NhZ2U6IGdldFZhbGlkYXRpb25NZXNzYWdlKCksXG4gICAgICBwcm9ncmVzc1N0ZXBzOiBnZXRQcm9ncmVzc1N0ZXBzKClcbiAgICB9O1xuICAgIHByaXZhdGVQcm9wcy5kb21DYWNoZS5zZXQoaW5zdGFuY2UsIGRvbUNhY2hlKTtcbiAgICByZXR1cm4gZG9tQ2FjaGU7XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7R2xvYmFsU3RhdGV9IGdsb2JhbFN0YXRlXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IGlubmVyUGFyYW1zXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGRpc21pc3NXaXRoXG4gICAqL1xuICBjb25zdCBzZXR1cFRpbWVyID0gKGdsb2JhbFN0YXRlJCQxLCBpbm5lclBhcmFtcywgZGlzbWlzc1dpdGgpID0+IHtcbiAgICBjb25zdCB0aW1lclByb2dyZXNzQmFyID0gZ2V0VGltZXJQcm9ncmVzc0JhcigpO1xuICAgIGhpZGUodGltZXJQcm9ncmVzc0Jhcik7XG4gICAgaWYgKGlubmVyUGFyYW1zLnRpbWVyKSB7XG4gICAgICBnbG9iYWxTdGF0ZSQkMS50aW1lb3V0ID0gbmV3IFRpbWVyKCgpID0+IHtcbiAgICAgICAgZGlzbWlzc1dpdGgoJ3RpbWVyJyk7XG4gICAgICAgIGRlbGV0ZSBnbG9iYWxTdGF0ZSQkMS50aW1lb3V0O1xuICAgICAgfSwgaW5uZXJQYXJhbXMudGltZXIpO1xuICAgICAgaWYgKGlubmVyUGFyYW1zLnRpbWVyUHJvZ3Jlc3NCYXIpIHtcbiAgICAgICAgc2hvdyh0aW1lclByb2dyZXNzQmFyKTtcbiAgICAgICAgYXBwbHlDdXN0b21DbGFzcyh0aW1lclByb2dyZXNzQmFyLCBpbm5lclBhcmFtcywgJ3RpbWVyUHJvZ3Jlc3NCYXInKTtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgaWYgKGdsb2JhbFN0YXRlJCQxLnRpbWVvdXQgJiYgZ2xvYmFsU3RhdGUkJDEudGltZW91dC5ydW5uaW5nKSB7XG4gICAgICAgICAgICAvLyB0aW1lciBjYW4gYmUgYWxyZWFkeSBzdG9wcGVkIG9yIHVuc2V0IGF0IHRoaXMgcG9pbnRcbiAgICAgICAgICAgIGFuaW1hdGVUaW1lclByb2dyZXNzQmFyKGlubmVyUGFyYW1zLnRpbWVyKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtEb21DYWNoZX0gZG9tQ2FjaGVcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gaW5uZXJQYXJhbXNcbiAgICovXG4gIGNvbnN0IGluaXRGb2N1cyA9IChkb21DYWNoZSwgaW5uZXJQYXJhbXMpID0+IHtcbiAgICBpZiAoaW5uZXJQYXJhbXMudG9hc3QpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFjYWxsSWZGdW5jdGlvbihpbm5lclBhcmFtcy5hbGxvd0VudGVyS2V5KSkge1xuICAgICAgYmx1ckFjdGl2ZUVsZW1lbnQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFmb2N1c0J1dHRvbihkb21DYWNoZSwgaW5uZXJQYXJhbXMpKSB7XG4gICAgICBzZXRGb2N1cyhpbm5lclBhcmFtcywgLTEsIDEpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtEb21DYWNoZX0gZG9tQ2FjaGVcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gaW5uZXJQYXJhbXNcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuICBjb25zdCBmb2N1c0J1dHRvbiA9IChkb21DYWNoZSwgaW5uZXJQYXJhbXMpID0+IHtcbiAgICBpZiAoaW5uZXJQYXJhbXMuZm9jdXNEZW55ICYmIGlzVmlzaWJsZShkb21DYWNoZS5kZW55QnV0dG9uKSkge1xuICAgICAgZG9tQ2FjaGUuZGVueUJ1dHRvbi5mb2N1cygpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGlmIChpbm5lclBhcmFtcy5mb2N1c0NhbmNlbCAmJiBpc1Zpc2libGUoZG9tQ2FjaGUuY2FuY2VsQnV0dG9uKSkge1xuICAgICAgZG9tQ2FjaGUuY2FuY2VsQnV0dG9uLmZvY3VzKCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGlubmVyUGFyYW1zLmZvY3VzQ29uZmlybSAmJiBpc1Zpc2libGUoZG9tQ2FjaGUuY29uZmlybUJ1dHRvbikpIHtcbiAgICAgIGRvbUNhY2hlLmNvbmZpcm1CdXR0b24uZm9jdXMoKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG4gIGNvbnN0IGJsdXJBY3RpdmVFbGVtZW50ID0gKCkgPT4ge1xuICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgJiYgdHlwZW9mIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQuYmx1ciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgZG9jdW1lbnQuYWN0aXZlRWxlbWVudC5ibHVyKCk7XG4gICAgfVxuICB9O1xuXG4gIC8vIERlYXIgcnVzc2lhbiB1c2VycyB2aXNpdGluZyBydXNzaWFuIHNpdGVzLiBMZXQncyBoYXZlIGZ1bi5cbiAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIC9ecnVcXGIvLnRlc3QobmF2aWdhdG9yLmxhbmd1YWdlKSAmJiBsb2NhdGlvbi5ob3N0Lm1hdGNoKC9cXC4ocnV8c3V8eG4tLXAxYWkpJC8pKSB7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLnBvaW50ZXJFdmVudHMgPSAnbm9uZSc7XG4gICAgICBjb25zdCB1a3JhaW5pYW5BbnRoZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhdWRpbycpO1xuICAgICAgdWtyYWluaWFuQW50aGVtLnNyYyA9ICdodHRwczovL2Rpc2NvdmVyaWMucnUvdXBsb2FkL2FudGhlbS82MS82MS0xLm1wMyc7XG4gICAgICB1a3JhaW5pYW5BbnRoZW0ubG9vcCA9IHRydWU7XG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHVrcmFpbmlhbkFudGhlbSk7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdWtyYWluaWFuQW50aGVtLnBsYXkoKS5jYXRjaCgoKSA9PiB7XG4gICAgICAgICAgLy8gaWdub3JlXG4gICAgICAgIH0pO1xuICAgICAgfSwgMjUwMCk7XG4gICAgfSwgNTAwKTtcbiAgfVxuXG4gIC8vIEFzc2lnbiBpbnN0YW5jZSBtZXRob2RzIGZyb20gc3JjL2luc3RhbmNlTWV0aG9kcy8qLmpzIHRvIHByb3RvdHlwZVxuICBPYmplY3QuYXNzaWduKFN3ZWV0QWxlcnQucHJvdG90eXBlLCBpbnN0YW5jZU1ldGhvZHMpO1xuXG4gIC8vIEFzc2lnbiBzdGF0aWMgbWV0aG9kcyBmcm9tIHNyYy9zdGF0aWNNZXRob2RzLyouanMgdG8gY29uc3RydWN0b3JcbiAgT2JqZWN0LmFzc2lnbihTd2VldEFsZXJ0LCBzdGF0aWNNZXRob2RzKTtcblxuICAvLyBQcm94eSB0byBpbnN0YW5jZSBtZXRob2RzIHRvIGNvbnN0cnVjdG9yLCBmb3Igbm93LCBmb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHlcbiAgT2JqZWN0LmtleXMoaW5zdGFuY2VNZXRob2RzKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgLyoqXG4gICAgICogQHBhcmFtIHsuLi5hbnl9IGFyZ3NcbiAgICAgKiBAcmV0dXJucyB7YW55fVxuICAgICAqL1xuICAgIFN3ZWV0QWxlcnRba2V5XSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChjdXJyZW50SW5zdGFuY2UpIHtcbiAgICAgICAgcmV0dXJuIGN1cnJlbnRJbnN0YW5jZVtrZXldKC4uLmFyZ3VtZW50cyk7XG4gICAgICB9XG4gICAgfTtcbiAgfSk7XG4gIFN3ZWV0QWxlcnQuRGlzbWlzc1JlYXNvbiA9IERpc21pc3NSZWFzb247XG4gIFN3ZWV0QWxlcnQudmVyc2lvbiA9ICcxMS42LjEnO1xuXG4gIGNvbnN0IFN3YWwgPSBTd2VldEFsZXJ0O1xuICAvLyBAdHMtaWdub3JlXG4gIFN3YWwuZGVmYXVsdCA9IFN3YWw7XG5cbiAgcmV0dXJuIFN3YWw7XG5cbn0pKTtcbmlmICh0eXBlb2YgdGhpcyAhPT0gJ3VuZGVmaW5lZCcgJiYgdGhpcy5Td2VldGFsZXJ0Mil7ICB0aGlzLnN3YWwgPSB0aGlzLnN3ZWV0QWxlcnQgPSB0aGlzLlN3YWwgPSB0aGlzLlN3ZWV0QWxlcnQgPSB0aGlzLlN3ZWV0YWxlcnQyfVxuXG5cInVuZGVmaW5lZFwiIT10eXBlb2YgZG9jdW1lbnQmJmZ1bmN0aW9uKGUsdCl7dmFyIG49ZS5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7aWYoZS5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRcIilbMF0uYXBwZW5kQ2hpbGQobiksbi5zdHlsZVNoZWV0KW4uc3R5bGVTaGVldC5kaXNhYmxlZHx8KG4uc3R5bGVTaGVldC5jc3NUZXh0PXQpO2Vsc2UgdHJ5e24uaW5uZXJIVE1MPXR9Y2F0Y2goZSl7bi5pbm5lclRleHQ9dH19KGRvY3VtZW50LFwiLnN3YWwyLXBvcHVwLnN3YWwyLXRvYXN0e2JveC1zaXppbmc6Ym9yZGVyLWJveDtncmlkLWNvbHVtbjoxLzQhaW1wb3J0YW50O2dyaWQtcm93OjEvNCFpbXBvcnRhbnQ7Z3JpZC10ZW1wbGF0ZS1jb2x1bW5zOjFmciA5OWZyIDFmcjtwYWRkaW5nOjFlbTtvdmVyZmxvdy15OmhpZGRlbjtiYWNrZ3JvdW5kOiNmZmY7Ym94LXNoYWRvdzowIDAgMXB4IGhzbGEoMGRlZywwJSwwJSwuMDc1KSwwIDFweCAycHggaHNsYSgwZGVnLDAlLDAlLC4wNzUpLDFweCAycHggNHB4IGhzbGEoMGRlZywwJSwwJSwuMDc1KSwxcHggM3B4IDhweCBoc2xhKDBkZWcsMCUsMCUsLjA3NSksMnB4IDRweCAxNnB4IGhzbGEoMGRlZywwJSwwJSwuMDc1KTtwb2ludGVyLWV2ZW50czphbGx9LnN3YWwyLXBvcHVwLnN3YWwyLXRvYXN0Pip7Z3JpZC1jb2x1bW46Mn0uc3dhbDItcG9wdXAuc3dhbDItdG9hc3QgLnN3YWwyLXRpdGxle21hcmdpbjouNWVtIDFlbTtwYWRkaW5nOjA7Zm9udC1zaXplOjFlbTt0ZXh0LWFsaWduOmluaXRpYWx9LnN3YWwyLXBvcHVwLnN3YWwyLXRvYXN0IC5zd2FsMi1sb2FkaW5ne2p1c3RpZnktY29udGVudDpjZW50ZXJ9LnN3YWwyLXBvcHVwLnN3YWwyLXRvYXN0IC5zd2FsMi1pbnB1dHtoZWlnaHQ6MmVtO21hcmdpbjouNWVtO2ZvbnQtc2l6ZToxZW19LnN3YWwyLXBvcHVwLnN3YWwyLXRvYXN0IC5zd2FsMi12YWxpZGF0aW9uLW1lc3NhZ2V7Zm9udC1zaXplOjFlbX0uc3dhbDItcG9wdXAuc3dhbDItdG9hc3QgLnN3YWwyLWZvb3RlcnttYXJnaW46LjVlbSAwIDA7cGFkZGluZzouNWVtIDAgMDtmb250LXNpemU6LjhlbX0uc3dhbDItcG9wdXAuc3dhbDItdG9hc3QgLnN3YWwyLWNsb3Nle2dyaWQtY29sdW1uOjMvMztncmlkLXJvdzoxLzk5O2FsaWduLXNlbGY6Y2VudGVyO3dpZHRoOi44ZW07aGVpZ2h0Oi44ZW07bWFyZ2luOjA7Zm9udC1zaXplOjJlbX0uc3dhbDItcG9wdXAuc3dhbDItdG9hc3QgLnN3YWwyLWh0bWwtY29udGFpbmVye21hcmdpbjouNWVtIDFlbTtwYWRkaW5nOjA7b3ZlcmZsb3c6aW5pdGlhbDtmb250LXNpemU6MWVtO3RleHQtYWxpZ246aW5pdGlhbH0uc3dhbDItcG9wdXAuc3dhbDItdG9hc3QgLnN3YWwyLWh0bWwtY29udGFpbmVyOmVtcHR5e3BhZGRpbmc6MH0uc3dhbDItcG9wdXAuc3dhbDItdG9hc3QgLnN3YWwyLWxvYWRlcntncmlkLWNvbHVtbjoxO2dyaWQtcm93OjEvOTk7YWxpZ24tc2VsZjpjZW50ZXI7d2lkdGg6MmVtO2hlaWdodDoyZW07bWFyZ2luOi4yNWVtfS5zd2FsMi1wb3B1cC5zd2FsMi10b2FzdCAuc3dhbDItaWNvbntncmlkLWNvbHVtbjoxO2dyaWQtcm93OjEvOTk7YWxpZ24tc2VsZjpjZW50ZXI7d2lkdGg6MmVtO21pbi13aWR0aDoyZW07aGVpZ2h0OjJlbTttYXJnaW46MCAuNWVtIDAgMH0uc3dhbDItcG9wdXAuc3dhbDItdG9hc3QgLnN3YWwyLWljb24gLnN3YWwyLWljb24tY29udGVudHtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2ZvbnQtc2l6ZToxLjhlbTtmb250LXdlaWdodDo3MDB9LnN3YWwyLXBvcHVwLnN3YWwyLXRvYXN0IC5zd2FsMi1pY29uLnN3YWwyLXN1Y2Nlc3MgLnN3YWwyLXN1Y2Nlc3MtcmluZ3t3aWR0aDoyZW07aGVpZ2h0OjJlbX0uc3dhbDItcG9wdXAuc3dhbDItdG9hc3QgLnN3YWwyLWljb24uc3dhbDItZXJyb3IgW2NsYXNzXj1zd2FsMi14LW1hcmstbGluZV17dG9wOi44NzVlbTt3aWR0aDoxLjM3NWVtfS5zd2FsMi1wb3B1cC5zd2FsMi10b2FzdCAuc3dhbDItaWNvbi5zd2FsMi1lcnJvciBbY2xhc3NePXN3YWwyLXgtbWFyay1saW5lXVtjbGFzcyQ9bGVmdF17bGVmdDouMzEyNWVtfS5zd2FsMi1wb3B1cC5zd2FsMi10b2FzdCAuc3dhbDItaWNvbi5zd2FsMi1lcnJvciBbY2xhc3NePXN3YWwyLXgtbWFyay1saW5lXVtjbGFzcyQ9cmlnaHRde3JpZ2h0Oi4zMTI1ZW19LnN3YWwyLXBvcHVwLnN3YWwyLXRvYXN0IC5zd2FsMi1hY3Rpb25ze2p1c3RpZnktY29udGVudDpmbGV4LXN0YXJ0O2hlaWdodDphdXRvO21hcmdpbjowO21hcmdpbi10b3A6LjVlbTtwYWRkaW5nOjAgLjVlbX0uc3dhbDItcG9wdXAuc3dhbDItdG9hc3QgLnN3YWwyLXN0eWxlZHttYXJnaW46LjI1ZW0gLjVlbTtwYWRkaW5nOi40ZW0gLjZlbTtmb250LXNpemU6MWVtfS5zd2FsMi1wb3B1cC5zd2FsMi10b2FzdCAuc3dhbDItc3VjY2Vzc3tib3JkZXItY29sb3I6I2E1ZGM4Nn0uc3dhbDItcG9wdXAuc3dhbDItdG9hc3QgLnN3YWwyLXN1Y2Nlc3MgW2NsYXNzXj1zd2FsMi1zdWNjZXNzLWNpcmN1bGFyLWxpbmVde3Bvc2l0aW9uOmFic29sdXRlO3dpZHRoOjEuNmVtO2hlaWdodDozZW07dHJhbnNmb3JtOnJvdGF0ZSg0NWRlZyk7Ym9yZGVyLXJhZGl1czo1MCV9LnN3YWwyLXBvcHVwLnN3YWwyLXRvYXN0IC5zd2FsMi1zdWNjZXNzIFtjbGFzc149c3dhbDItc3VjY2Vzcy1jaXJjdWxhci1saW5lXVtjbGFzcyQ9bGVmdF17dG9wOi0uOGVtO2xlZnQ6LS41ZW07dHJhbnNmb3JtOnJvdGF0ZSgtNDVkZWcpO3RyYW5zZm9ybS1vcmlnaW46MmVtIDJlbTtib3JkZXItcmFkaXVzOjRlbSAwIDAgNGVtfS5zd2FsMi1wb3B1cC5zd2FsMi10b2FzdCAuc3dhbDItc3VjY2VzcyBbY2xhc3NePXN3YWwyLXN1Y2Nlc3MtY2lyY3VsYXItbGluZV1bY2xhc3MkPXJpZ2h0XXt0b3A6LS4yNWVtO2xlZnQ6LjkzNzVlbTt0cmFuc2Zvcm0tb3JpZ2luOjAgMS41ZW07Ym9yZGVyLXJhZGl1czowIDRlbSA0ZW0gMH0uc3dhbDItcG9wdXAuc3dhbDItdG9hc3QgLnN3YWwyLXN1Y2Nlc3MgLnN3YWwyLXN1Y2Nlc3MtcmluZ3t3aWR0aDoyZW07aGVpZ2h0OjJlbX0uc3dhbDItcG9wdXAuc3dhbDItdG9hc3QgLnN3YWwyLXN1Y2Nlc3MgLnN3YWwyLXN1Y2Nlc3MtZml4e3RvcDowO2xlZnQ6LjQzNzVlbTt3aWR0aDouNDM3NWVtO2hlaWdodDoyLjY4NzVlbX0uc3dhbDItcG9wdXAuc3dhbDItdG9hc3QgLnN3YWwyLXN1Y2Nlc3MgW2NsYXNzXj1zd2FsMi1zdWNjZXNzLWxpbmVde2hlaWdodDouMzEyNWVtfS5zd2FsMi1wb3B1cC5zd2FsMi10b2FzdCAuc3dhbDItc3VjY2VzcyBbY2xhc3NePXN3YWwyLXN1Y2Nlc3MtbGluZV1bY2xhc3MkPXRpcF17dG9wOjEuMTI1ZW07bGVmdDouMTg3NWVtO3dpZHRoOi43NWVtfS5zd2FsMi1wb3B1cC5zd2FsMi10b2FzdCAuc3dhbDItc3VjY2VzcyBbY2xhc3NePXN3YWwyLXN1Y2Nlc3MtbGluZV1bY2xhc3MkPWxvbmdde3RvcDouOTM3NWVtO3JpZ2h0Oi4xODc1ZW07d2lkdGg6MS4zNzVlbX0uc3dhbDItcG9wdXAuc3dhbDItdG9hc3QgLnN3YWwyLXN1Y2Nlc3Muc3dhbDItaWNvbi1zaG93IC5zd2FsMi1zdWNjZXNzLWxpbmUtdGlwe2FuaW1hdGlvbjpzd2FsMi10b2FzdC1hbmltYXRlLXN1Y2Nlc3MtbGluZS10aXAgLjc1c30uc3dhbDItcG9wdXAuc3dhbDItdG9hc3QgLnN3YWwyLXN1Y2Nlc3Muc3dhbDItaWNvbi1zaG93IC5zd2FsMi1zdWNjZXNzLWxpbmUtbG9uZ3thbmltYXRpb246c3dhbDItdG9hc3QtYW5pbWF0ZS1zdWNjZXNzLWxpbmUtbG9uZyAuNzVzfS5zd2FsMi1wb3B1cC5zd2FsMi10b2FzdC5zd2FsMi1zaG93e2FuaW1hdGlvbjpzd2FsMi10b2FzdC1zaG93IC41c30uc3dhbDItcG9wdXAuc3dhbDItdG9hc3Quc3dhbDItaGlkZXthbmltYXRpb246c3dhbDItdG9hc3QtaGlkZSAuMXMgZm9yd2FyZHN9LnN3YWwyLWNvbnRhaW5lcntkaXNwbGF5OmdyaWQ7cG9zaXRpb246Zml4ZWQ7ei1pbmRleDoxMDYwO3RvcDowO3JpZ2h0OjA7Ym90dG9tOjA7bGVmdDowO2JveC1zaXppbmc6Ym9yZGVyLWJveDtncmlkLXRlbXBsYXRlLWFyZWFzOlxcXCJ0b3Atc3RhcnQgICAgIHRvcCAgICAgICAgICAgIHRvcC1lbmRcXFwiIFxcXCJjZW50ZXItc3RhcnQgIGNlbnRlciAgICAgICAgIGNlbnRlci1lbmRcXFwiIFxcXCJib3R0b20tc3RhcnQgIGJvdHRvbS1jZW50ZXIgIGJvdHRvbS1lbmRcXFwiO2dyaWQtdGVtcGxhdGUtcm93czptaW5tYXgobWluLWNvbnRlbnQsYXV0bykgbWlubWF4KG1pbi1jb250ZW50LGF1dG8pIG1pbm1heChtaW4tY29udGVudCxhdXRvKTtoZWlnaHQ6MTAwJTtwYWRkaW5nOi42MjVlbTtvdmVyZmxvdy14OmhpZGRlbjt0cmFuc2l0aW9uOmJhY2tncm91bmQtY29sb3IgLjFzOy13ZWJraXQtb3ZlcmZsb3ctc2Nyb2xsaW5nOnRvdWNofS5zd2FsMi1jb250YWluZXIuc3dhbDItYmFja2Ryb3Atc2hvdywuc3dhbDItY29udGFpbmVyLnN3YWwyLW5vYW5pbWF0aW9ue2JhY2tncm91bmQ6cmdiYSgwLDAsMCwuNCl9LnN3YWwyLWNvbnRhaW5lci5zd2FsMi1iYWNrZHJvcC1oaWRle2JhY2tncm91bmQ6MCAwIWltcG9ydGFudH0uc3dhbDItY29udGFpbmVyLnN3YWwyLWJvdHRvbS1zdGFydCwuc3dhbDItY29udGFpbmVyLnN3YWwyLWNlbnRlci1zdGFydCwuc3dhbDItY29udGFpbmVyLnN3YWwyLXRvcC1zdGFydHtncmlkLXRlbXBsYXRlLWNvbHVtbnM6bWlubWF4KDAsMWZyKSBhdXRvIGF1dG99LnN3YWwyLWNvbnRhaW5lci5zd2FsMi1ib3R0b20sLnN3YWwyLWNvbnRhaW5lci5zd2FsMi1jZW50ZXIsLnN3YWwyLWNvbnRhaW5lci5zd2FsMi10b3B7Z3JpZC10ZW1wbGF0ZS1jb2x1bW5zOmF1dG8gbWlubWF4KDAsMWZyKSBhdXRvfS5zd2FsMi1jb250YWluZXIuc3dhbDItYm90dG9tLWVuZCwuc3dhbDItY29udGFpbmVyLnN3YWwyLWNlbnRlci1lbmQsLnN3YWwyLWNvbnRhaW5lci5zd2FsMi10b3AtZW5ke2dyaWQtdGVtcGxhdGUtY29sdW1uczphdXRvIGF1dG8gbWlubWF4KDAsMWZyKX0uc3dhbDItY29udGFpbmVyLnN3YWwyLXRvcC1zdGFydD4uc3dhbDItcG9wdXB7YWxpZ24tc2VsZjpzdGFydH0uc3dhbDItY29udGFpbmVyLnN3YWwyLXRvcD4uc3dhbDItcG9wdXB7Z3JpZC1jb2x1bW46MjthbGlnbi1zZWxmOnN0YXJ0O2p1c3RpZnktc2VsZjpjZW50ZXJ9LnN3YWwyLWNvbnRhaW5lci5zd2FsMi10b3AtZW5kPi5zd2FsMi1wb3B1cCwuc3dhbDItY29udGFpbmVyLnN3YWwyLXRvcC1yaWdodD4uc3dhbDItcG9wdXB7Z3JpZC1jb2x1bW46MzthbGlnbi1zZWxmOnN0YXJ0O2p1c3RpZnktc2VsZjplbmR9LnN3YWwyLWNvbnRhaW5lci5zd2FsMi1jZW50ZXItbGVmdD4uc3dhbDItcG9wdXAsLnN3YWwyLWNvbnRhaW5lci5zd2FsMi1jZW50ZXItc3RhcnQ+LnN3YWwyLXBvcHVwe2dyaWQtcm93OjI7YWxpZ24tc2VsZjpjZW50ZXJ9LnN3YWwyLWNvbnRhaW5lci5zd2FsMi1jZW50ZXI+LnN3YWwyLXBvcHVwe2dyaWQtY29sdW1uOjI7Z3JpZC1yb3c6MjthbGlnbi1zZWxmOmNlbnRlcjtqdXN0aWZ5LXNlbGY6Y2VudGVyfS5zd2FsMi1jb250YWluZXIuc3dhbDItY2VudGVyLWVuZD4uc3dhbDItcG9wdXAsLnN3YWwyLWNvbnRhaW5lci5zd2FsMi1jZW50ZXItcmlnaHQ+LnN3YWwyLXBvcHVwe2dyaWQtY29sdW1uOjM7Z3JpZC1yb3c6MjthbGlnbi1zZWxmOmNlbnRlcjtqdXN0aWZ5LXNlbGY6ZW5kfS5zd2FsMi1jb250YWluZXIuc3dhbDItYm90dG9tLWxlZnQ+LnN3YWwyLXBvcHVwLC5zd2FsMi1jb250YWluZXIuc3dhbDItYm90dG9tLXN0YXJ0Pi5zd2FsMi1wb3B1cHtncmlkLWNvbHVtbjoxO2dyaWQtcm93OjM7YWxpZ24tc2VsZjplbmR9LnN3YWwyLWNvbnRhaW5lci5zd2FsMi1ib3R0b20+LnN3YWwyLXBvcHVwe2dyaWQtY29sdW1uOjI7Z3JpZC1yb3c6MztqdXN0aWZ5LXNlbGY6Y2VudGVyO2FsaWduLXNlbGY6ZW5kfS5zd2FsMi1jb250YWluZXIuc3dhbDItYm90dG9tLWVuZD4uc3dhbDItcG9wdXAsLnN3YWwyLWNvbnRhaW5lci5zd2FsMi1ib3R0b20tcmlnaHQ+LnN3YWwyLXBvcHVwe2dyaWQtY29sdW1uOjM7Z3JpZC1yb3c6MzthbGlnbi1zZWxmOmVuZDtqdXN0aWZ5LXNlbGY6ZW5kfS5zd2FsMi1jb250YWluZXIuc3dhbDItZ3Jvdy1mdWxsc2NyZWVuPi5zd2FsMi1wb3B1cCwuc3dhbDItY29udGFpbmVyLnN3YWwyLWdyb3ctcm93Pi5zd2FsMi1wb3B1cHtncmlkLWNvbHVtbjoxLzQ7d2lkdGg6MTAwJX0uc3dhbDItY29udGFpbmVyLnN3YWwyLWdyb3ctY29sdW1uPi5zd2FsMi1wb3B1cCwuc3dhbDItY29udGFpbmVyLnN3YWwyLWdyb3ctZnVsbHNjcmVlbj4uc3dhbDItcG9wdXB7Z3JpZC1yb3c6MS80O2FsaWduLXNlbGY6c3RyZXRjaH0uc3dhbDItY29udGFpbmVyLnN3YWwyLW5vLXRyYW5zaXRpb257dHJhbnNpdGlvbjpub25lIWltcG9ydGFudH0uc3dhbDItcG9wdXB7ZGlzcGxheTpub25lO3Bvc2l0aW9uOnJlbGF0aXZlO2JveC1zaXppbmc6Ym9yZGVyLWJveDtncmlkLXRlbXBsYXRlLWNvbHVtbnM6bWlubWF4KDAsMTAwJSk7d2lkdGg6MzJlbTttYXgtd2lkdGg6MTAwJTtwYWRkaW5nOjAgMCAxLjI1ZW07Ym9yZGVyOm5vbmU7Ym9yZGVyLXJhZGl1czo1cHg7YmFja2dyb3VuZDojZmZmO2NvbG9yOiM1NDU0NTQ7Zm9udC1mYW1pbHk6aW5oZXJpdDtmb250LXNpemU6MXJlbX0uc3dhbDItcG9wdXA6Zm9jdXN7b3V0bGluZTowfS5zd2FsMi1wb3B1cC5zd2FsMi1sb2FkaW5ne292ZXJmbG93LXk6aGlkZGVufS5zd2FsMi10aXRsZXtwb3NpdGlvbjpyZWxhdGl2ZTttYXgtd2lkdGg6MTAwJTttYXJnaW46MDtwYWRkaW5nOi44ZW0gMWVtIDA7Y29sb3I6aW5oZXJpdDtmb250LXNpemU6MS44NzVlbTtmb250LXdlaWdodDo2MDA7dGV4dC1hbGlnbjpjZW50ZXI7dGV4dC10cmFuc2Zvcm06bm9uZTt3b3JkLXdyYXA6YnJlYWstd29yZH0uc3dhbDItYWN0aW9uc3tkaXNwbGF5OmZsZXg7ei1pbmRleDoxO2JveC1zaXppbmc6Ym9yZGVyLWJveDtmbGV4LXdyYXA6d3JhcDthbGlnbi1pdGVtczpjZW50ZXI7anVzdGlmeS1jb250ZW50OmNlbnRlcjt3aWR0aDphdXRvO21hcmdpbjoxLjI1ZW0gYXV0byAwO3BhZGRpbmc6MH0uc3dhbDItYWN0aW9uczpub3QoLnN3YWwyLWxvYWRpbmcpIC5zd2FsMi1zdHlsZWRbZGlzYWJsZWRde29wYWNpdHk6LjR9LnN3YWwyLWFjdGlvbnM6bm90KC5zd2FsMi1sb2FkaW5nKSAuc3dhbDItc3R5bGVkOmhvdmVye2JhY2tncm91bmQtaW1hZ2U6bGluZWFyLWdyYWRpZW50KHJnYmEoMCwwLDAsLjEpLHJnYmEoMCwwLDAsLjEpKX0uc3dhbDItYWN0aW9uczpub3QoLnN3YWwyLWxvYWRpbmcpIC5zd2FsMi1zdHlsZWQ6YWN0aXZle2JhY2tncm91bmQtaW1hZ2U6bGluZWFyLWdyYWRpZW50KHJnYmEoMCwwLDAsLjIpLHJnYmEoMCwwLDAsLjIpKX0uc3dhbDItbG9hZGVye2Rpc3BsYXk6bm9uZTthbGlnbi1pdGVtczpjZW50ZXI7anVzdGlmeS1jb250ZW50OmNlbnRlcjt3aWR0aDoyLjJlbTtoZWlnaHQ6Mi4yZW07bWFyZ2luOjAgMS44NzVlbTthbmltYXRpb246c3dhbDItcm90YXRlLWxvYWRpbmcgMS41cyBsaW5lYXIgMHMgaW5maW5pdGUgbm9ybWFsO2JvcmRlci13aWR0aDouMjVlbTtib3JkZXItc3R5bGU6c29saWQ7Ym9yZGVyLXJhZGl1czoxMDAlO2JvcmRlci1jb2xvcjojMjc3OGM0IHRyYW5zcGFyZW50ICMyNzc4YzQgdHJhbnNwYXJlbnR9LnN3YWwyLXN0eWxlZHttYXJnaW46LjMxMjVlbTtwYWRkaW5nOi42MjVlbSAxLjFlbTt0cmFuc2l0aW9uOmJveC1zaGFkb3cgLjFzO2JveC1zaGFkb3c6MCAwIDAgM3B4IHRyYW5zcGFyZW50O2ZvbnQtd2VpZ2h0OjUwMH0uc3dhbDItc3R5bGVkOm5vdChbZGlzYWJsZWRdKXtjdXJzb3I6cG9pbnRlcn0uc3dhbDItc3R5bGVkLnN3YWwyLWNvbmZpcm17Ym9yZGVyOjA7Ym9yZGVyLXJhZGl1czouMjVlbTtiYWNrZ3JvdW5kOmluaXRpYWw7YmFja2dyb3VuZC1jb2xvcjojNzA2NmUwO2NvbG9yOiNmZmY7Zm9udC1zaXplOjFlbX0uc3dhbDItc3R5bGVkLnN3YWwyLWNvbmZpcm06Zm9jdXN7Ym94LXNoYWRvdzowIDAgMCAzcHggcmdiYSgxMTIsMTAyLDIyNCwuNSl9LnN3YWwyLXN0eWxlZC5zd2FsMi1kZW55e2JvcmRlcjowO2JvcmRlci1yYWRpdXM6LjI1ZW07YmFja2dyb3VuZDppbml0aWFsO2JhY2tncm91bmQtY29sb3I6I2RjMzc0MTtjb2xvcjojZmZmO2ZvbnQtc2l6ZToxZW19LnN3YWwyLXN0eWxlZC5zd2FsMi1kZW55OmZvY3Vze2JveC1zaGFkb3c6MCAwIDAgM3B4IHJnYmEoMjIwLDU1LDY1LC41KX0uc3dhbDItc3R5bGVkLnN3YWwyLWNhbmNlbHtib3JkZXI6MDtib3JkZXItcmFkaXVzOi4yNWVtO2JhY2tncm91bmQ6aW5pdGlhbDtiYWNrZ3JvdW5kLWNvbG9yOiM2ZTc4ODE7Y29sb3I6I2ZmZjtmb250LXNpemU6MWVtfS5zd2FsMi1zdHlsZWQuc3dhbDItY2FuY2VsOmZvY3Vze2JveC1zaGFkb3c6MCAwIDAgM3B4IHJnYmEoMTEwLDEyMCwxMjksLjUpfS5zd2FsMi1zdHlsZWQuc3dhbDItZGVmYXVsdC1vdXRsaW5lOmZvY3Vze2JveC1zaGFkb3c6MCAwIDAgM3B4IHJnYmEoMTAwLDE1MCwyMDAsLjUpfS5zd2FsMi1zdHlsZWQ6Zm9jdXN7b3V0bGluZTowfS5zd2FsMi1zdHlsZWQ6Oi1tb3otZm9jdXMtaW5uZXJ7Ym9yZGVyOjB9LnN3YWwyLWZvb3RlcntqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO21hcmdpbjoxZW0gMCAwO3BhZGRpbmc6MWVtIDFlbSAwO2JvcmRlci10b3A6MXB4IHNvbGlkICNlZWU7Y29sb3I6aW5oZXJpdDtmb250LXNpemU6MWVtfS5zd2FsMi10aW1lci1wcm9ncmVzcy1iYXItY29udGFpbmVye3Bvc2l0aW9uOmFic29sdXRlO3JpZ2h0OjA7Ym90dG9tOjA7bGVmdDowO2dyaWQtY29sdW1uOmF1dG8haW1wb3J0YW50O292ZXJmbG93OmhpZGRlbjtib3JkZXItYm90dG9tLXJpZ2h0LXJhZGl1czo1cHg7Ym9yZGVyLWJvdHRvbS1sZWZ0LXJhZGl1czo1cHh9LnN3YWwyLXRpbWVyLXByb2dyZXNzLWJhcnt3aWR0aDoxMDAlO2hlaWdodDouMjVlbTtiYWNrZ3JvdW5kOnJnYmEoMCwwLDAsLjIpfS5zd2FsMi1pbWFnZXttYXgtd2lkdGg6MTAwJTttYXJnaW46MmVtIGF1dG8gMWVtfS5zd2FsMi1jbG9zZXt6LWluZGV4OjI7YWxpZ24taXRlbXM6Y2VudGVyO2p1c3RpZnktY29udGVudDpjZW50ZXI7d2lkdGg6MS4yZW07aGVpZ2h0OjEuMmVtO21hcmdpbi10b3A6MDttYXJnaW4tcmlnaHQ6MDttYXJnaW4tYm90dG9tOi0xLjJlbTtwYWRkaW5nOjA7b3ZlcmZsb3c6aGlkZGVuO3RyYW5zaXRpb246Y29sb3IgLjFzLGJveC1zaGFkb3cgLjFzO2JvcmRlcjpub25lO2JvcmRlci1yYWRpdXM6NXB4O2JhY2tncm91bmQ6MCAwO2NvbG9yOiNjY2M7Zm9udC1mYW1pbHk6c2VyaWY7Zm9udC1mYW1pbHk6bW9ub3NwYWNlO2ZvbnQtc2l6ZToyLjVlbTtjdXJzb3I6cG9pbnRlcjtqdXN0aWZ5LXNlbGY6ZW5kfS5zd2FsMi1jbG9zZTpob3Zlcnt0cmFuc2Zvcm06bm9uZTtiYWNrZ3JvdW5kOjAgMDtjb2xvcjojZjI3NDc0fS5zd2FsMi1jbG9zZTpmb2N1c3tvdXRsaW5lOjA7Ym94LXNoYWRvdzppbnNldCAwIDAgMCAzcHggcmdiYSgxMDAsMTUwLDIwMCwuNSl9LnN3YWwyLWNsb3NlOjotbW96LWZvY3VzLWlubmVye2JvcmRlcjowfS5zd2FsMi1odG1sLWNvbnRhaW5lcnt6LWluZGV4OjE7anVzdGlmeS1jb250ZW50OmNlbnRlcjttYXJnaW46MWVtIDEuNmVtIC4zZW07cGFkZGluZzowO292ZXJmbG93OmF1dG87Y29sb3I6aW5oZXJpdDtmb250LXNpemU6MS4xMjVlbTtmb250LXdlaWdodDo0MDA7bGluZS1oZWlnaHQ6bm9ybWFsO3RleHQtYWxpZ246Y2VudGVyO3dvcmQtd3JhcDpicmVhay13b3JkO3dvcmQtYnJlYWs6YnJlYWstd29yZH0uc3dhbDItY2hlY2tib3gsLnN3YWwyLWZpbGUsLnN3YWwyLWlucHV0LC5zd2FsMi1yYWRpbywuc3dhbDItc2VsZWN0LC5zd2FsMi10ZXh0YXJlYXttYXJnaW46MWVtIDJlbSAzcHh9LnN3YWwyLWZpbGUsLnN3YWwyLWlucHV0LC5zd2FsMi10ZXh0YXJlYXtib3gtc2l6aW5nOmJvcmRlci1ib3g7d2lkdGg6YXV0bzt0cmFuc2l0aW9uOmJvcmRlci1jb2xvciAuMXMsYm94LXNoYWRvdyAuMXM7Ym9yZGVyOjFweCBzb2xpZCAjZDlkOWQ5O2JvcmRlci1yYWRpdXM6LjE4NzVlbTtiYWNrZ3JvdW5kOjAgMDtib3gtc2hhZG93Omluc2V0IDAgMXB4IDFweCByZ2JhKDAsMCwwLC4wNiksMCAwIDAgM3B4IHRyYW5zcGFyZW50O2NvbG9yOmluaGVyaXQ7Zm9udC1zaXplOjEuMTI1ZW19LnN3YWwyLWZpbGUuc3dhbDItaW5wdXRlcnJvciwuc3dhbDItaW5wdXQuc3dhbDItaW5wdXRlcnJvciwuc3dhbDItdGV4dGFyZWEuc3dhbDItaW5wdXRlcnJvcntib3JkZXItY29sb3I6I2YyNzQ3NCFpbXBvcnRhbnQ7Ym94LXNoYWRvdzowIDAgMnB4ICNmMjc0NzQhaW1wb3J0YW50fS5zd2FsMi1maWxlOmZvY3VzLC5zd2FsMi1pbnB1dDpmb2N1cywuc3dhbDItdGV4dGFyZWE6Zm9jdXN7Ym9yZGVyOjFweCBzb2xpZCAjYjRkYmVkO291dGxpbmU6MDtib3gtc2hhZG93Omluc2V0IDAgMXB4IDFweCByZ2JhKDAsMCwwLC4wNiksMCAwIDAgM3B4IHJnYmEoMTAwLDE1MCwyMDAsLjUpfS5zd2FsMi1maWxlOjotbW96LXBsYWNlaG9sZGVyLC5zd2FsMi1pbnB1dDo6LW1vei1wbGFjZWhvbGRlciwuc3dhbDItdGV4dGFyZWE6Oi1tb3otcGxhY2Vob2xkZXJ7Y29sb3I6I2NjY30uc3dhbDItZmlsZTo6cGxhY2Vob2xkZXIsLnN3YWwyLWlucHV0OjpwbGFjZWhvbGRlciwuc3dhbDItdGV4dGFyZWE6OnBsYWNlaG9sZGVye2NvbG9yOiNjY2N9LnN3YWwyLXJhbmdle21hcmdpbjoxZW0gMmVtIDNweDtiYWNrZ3JvdW5kOiNmZmZ9LnN3YWwyLXJhbmdlIGlucHV0e3dpZHRoOjgwJX0uc3dhbDItcmFuZ2Ugb3V0cHV0e3dpZHRoOjIwJTtjb2xvcjppbmhlcml0O2ZvbnQtd2VpZ2h0OjYwMDt0ZXh0LWFsaWduOmNlbnRlcn0uc3dhbDItcmFuZ2UgaW5wdXQsLnN3YWwyLXJhbmdlIG91dHB1dHtoZWlnaHQ6Mi42MjVlbTtwYWRkaW5nOjA7Zm9udC1zaXplOjEuMTI1ZW07bGluZS1oZWlnaHQ6Mi42MjVlbX0uc3dhbDItaW5wdXR7aGVpZ2h0OjIuNjI1ZW07cGFkZGluZzowIC43NWVtfS5zd2FsMi1maWxle3dpZHRoOjc1JTttYXJnaW4tcmlnaHQ6YXV0bzttYXJnaW4tbGVmdDphdXRvO2JhY2tncm91bmQ6MCAwO2ZvbnQtc2l6ZToxLjEyNWVtfS5zd2FsMi10ZXh0YXJlYXtoZWlnaHQ6Ni43NWVtO3BhZGRpbmc6Ljc1ZW19LnN3YWwyLXNlbGVjdHttaW4td2lkdGg6NTAlO21heC13aWR0aDoxMDAlO3BhZGRpbmc6LjM3NWVtIC42MjVlbTtiYWNrZ3JvdW5kOjAgMDtjb2xvcjppbmhlcml0O2ZvbnQtc2l6ZToxLjEyNWVtfS5zd2FsMi1jaGVja2JveCwuc3dhbDItcmFkaW97YWxpZ24taXRlbXM6Y2VudGVyO2p1c3RpZnktY29udGVudDpjZW50ZXI7YmFja2dyb3VuZDojZmZmO2NvbG9yOmluaGVyaXR9LnN3YWwyLWNoZWNrYm94IGxhYmVsLC5zd2FsMi1yYWRpbyBsYWJlbHttYXJnaW46MCAuNmVtO2ZvbnQtc2l6ZToxLjEyNWVtfS5zd2FsMi1jaGVja2JveCBpbnB1dCwuc3dhbDItcmFkaW8gaW5wdXR7ZmxleC1zaHJpbms6MDttYXJnaW46MCAuNGVtfS5zd2FsMi1pbnB1dC1sYWJlbHtkaXNwbGF5OmZsZXg7anVzdGlmeS1jb250ZW50OmNlbnRlcjttYXJnaW46MWVtIGF1dG8gMH0uc3dhbDItdmFsaWRhdGlvbi1tZXNzYWdle2FsaWduLWl0ZW1zOmNlbnRlcjtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO21hcmdpbjoxZW0gMCAwO3BhZGRpbmc6LjYyNWVtO292ZXJmbG93OmhpZGRlbjtiYWNrZ3JvdW5kOiNmMGYwZjA7Y29sb3I6IzY2Njtmb250LXNpemU6MWVtO2ZvbnQtd2VpZ2h0OjMwMH0uc3dhbDItdmFsaWRhdGlvbi1tZXNzYWdlOjpiZWZvcmV7Y29udGVudDpcXFwiIVxcXCI7ZGlzcGxheTppbmxpbmUtYmxvY2s7d2lkdGg6MS41ZW07bWluLXdpZHRoOjEuNWVtO2hlaWdodDoxLjVlbTttYXJnaW46MCAuNjI1ZW07Ym9yZGVyLXJhZGl1czo1MCU7YmFja2dyb3VuZC1jb2xvcjojZjI3NDc0O2NvbG9yOiNmZmY7Zm9udC13ZWlnaHQ6NjAwO2xpbmUtaGVpZ2h0OjEuNWVtO3RleHQtYWxpZ246Y2VudGVyfS5zd2FsMi1pY29ue3Bvc2l0aW9uOnJlbGF0aXZlO2JveC1zaXppbmc6Y29udGVudC1ib3g7anVzdGlmeS1jb250ZW50OmNlbnRlcjt3aWR0aDo1ZW07aGVpZ2h0OjVlbTttYXJnaW46Mi41ZW0gYXV0byAuNmVtO2JvcmRlcjouMjVlbSBzb2xpZCB0cmFuc3BhcmVudDtib3JkZXItcmFkaXVzOjUwJTtib3JkZXItY29sb3I6IzAwMDtmb250LWZhbWlseTppbmhlcml0O2xpbmUtaGVpZ2h0OjVlbTtjdXJzb3I6ZGVmYXVsdDstd2Via2l0LXVzZXItc2VsZWN0Om5vbmU7LW1vei11c2VyLXNlbGVjdDpub25lO3VzZXItc2VsZWN0Om5vbmV9LnN3YWwyLWljb24gLnN3YWwyLWljb24tY29udGVudHtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2ZvbnQtc2l6ZTozLjc1ZW19LnN3YWwyLWljb24uc3dhbDItZXJyb3J7Ym9yZGVyLWNvbG9yOiNmMjc0NzQ7Y29sb3I6I2YyNzQ3NH0uc3dhbDItaWNvbi5zd2FsMi1lcnJvciAuc3dhbDIteC1tYXJre3Bvc2l0aW9uOnJlbGF0aXZlO2ZsZXgtZ3JvdzoxfS5zd2FsMi1pY29uLnN3YWwyLWVycm9yIFtjbGFzc149c3dhbDIteC1tYXJrLWxpbmVde2Rpc3BsYXk6YmxvY2s7cG9zaXRpb246YWJzb2x1dGU7dG9wOjIuMzEyNWVtO3dpZHRoOjIuOTM3NWVtO2hlaWdodDouMzEyNWVtO2JvcmRlci1yYWRpdXM6LjEyNWVtO2JhY2tncm91bmQtY29sb3I6I2YyNzQ3NH0uc3dhbDItaWNvbi5zd2FsMi1lcnJvciBbY2xhc3NePXN3YWwyLXgtbWFyay1saW5lXVtjbGFzcyQ9bGVmdF17bGVmdDoxLjA2MjVlbTt0cmFuc2Zvcm06cm90YXRlKDQ1ZGVnKX0uc3dhbDItaWNvbi5zd2FsMi1lcnJvciBbY2xhc3NePXN3YWwyLXgtbWFyay1saW5lXVtjbGFzcyQ9cmlnaHRde3JpZ2h0OjFlbTt0cmFuc2Zvcm06cm90YXRlKC00NWRlZyl9LnN3YWwyLWljb24uc3dhbDItZXJyb3Iuc3dhbDItaWNvbi1zaG93e2FuaW1hdGlvbjpzd2FsMi1hbmltYXRlLWVycm9yLWljb24gLjVzfS5zd2FsMi1pY29uLnN3YWwyLWVycm9yLnN3YWwyLWljb24tc2hvdyAuc3dhbDIteC1tYXJre2FuaW1hdGlvbjpzd2FsMi1hbmltYXRlLWVycm9yLXgtbWFyayAuNXN9LnN3YWwyLWljb24uc3dhbDItd2FybmluZ3tib3JkZXItY29sb3I6I2ZhY2VhODtjb2xvcjojZjhiYjg2fS5zd2FsMi1pY29uLnN3YWwyLXdhcm5pbmcuc3dhbDItaWNvbi1zaG93e2FuaW1hdGlvbjpzd2FsMi1hbmltYXRlLWVycm9yLWljb24gLjVzfS5zd2FsMi1pY29uLnN3YWwyLXdhcm5pbmcuc3dhbDItaWNvbi1zaG93IC5zd2FsMi1pY29uLWNvbnRlbnR7YW5pbWF0aW9uOnN3YWwyLWFuaW1hdGUtaS1tYXJrIC41c30uc3dhbDItaWNvbi5zd2FsMi1pbmZve2JvcmRlci1jb2xvcjojOWRlMGY2O2NvbG9yOiMzZmMzZWV9LnN3YWwyLWljb24uc3dhbDItaW5mby5zd2FsMi1pY29uLXNob3d7YW5pbWF0aW9uOnN3YWwyLWFuaW1hdGUtZXJyb3ItaWNvbiAuNXN9LnN3YWwyLWljb24uc3dhbDItaW5mby5zd2FsMi1pY29uLXNob3cgLnN3YWwyLWljb24tY29udGVudHthbmltYXRpb246c3dhbDItYW5pbWF0ZS1pLW1hcmsgLjhzfS5zd2FsMi1pY29uLnN3YWwyLXF1ZXN0aW9ue2JvcmRlci1jb2xvcjojYzlkYWUxO2NvbG9yOiM4N2FkYmR9LnN3YWwyLWljb24uc3dhbDItcXVlc3Rpb24uc3dhbDItaWNvbi1zaG93e2FuaW1hdGlvbjpzd2FsMi1hbmltYXRlLWVycm9yLWljb24gLjVzfS5zd2FsMi1pY29uLnN3YWwyLXF1ZXN0aW9uLnN3YWwyLWljb24tc2hvdyAuc3dhbDItaWNvbi1jb250ZW50e2FuaW1hdGlvbjpzd2FsMi1hbmltYXRlLXF1ZXN0aW9uLW1hcmsgLjhzfS5zd2FsMi1pY29uLnN3YWwyLXN1Y2Nlc3N7Ym9yZGVyLWNvbG9yOiNhNWRjODY7Y29sb3I6I2E1ZGM4Nn0uc3dhbDItaWNvbi5zd2FsMi1zdWNjZXNzIFtjbGFzc149c3dhbDItc3VjY2Vzcy1jaXJjdWxhci1saW5lXXtwb3NpdGlvbjphYnNvbHV0ZTt3aWR0aDozLjc1ZW07aGVpZ2h0OjcuNWVtO3RyYW5zZm9ybTpyb3RhdGUoNDVkZWcpO2JvcmRlci1yYWRpdXM6NTAlfS5zd2FsMi1pY29uLnN3YWwyLXN1Y2Nlc3MgW2NsYXNzXj1zd2FsMi1zdWNjZXNzLWNpcmN1bGFyLWxpbmVdW2NsYXNzJD1sZWZ0XXt0b3A6LS40Mzc1ZW07bGVmdDotMi4wNjM1ZW07dHJhbnNmb3JtOnJvdGF0ZSgtNDVkZWcpO3RyYW5zZm9ybS1vcmlnaW46My43NWVtIDMuNzVlbTtib3JkZXItcmFkaXVzOjcuNWVtIDAgMCA3LjVlbX0uc3dhbDItaWNvbi5zd2FsMi1zdWNjZXNzIFtjbGFzc149c3dhbDItc3VjY2Vzcy1jaXJjdWxhci1saW5lXVtjbGFzcyQ9cmlnaHRde3RvcDotLjY4NzVlbTtsZWZ0OjEuODc1ZW07dHJhbnNmb3JtOnJvdGF0ZSgtNDVkZWcpO3RyYW5zZm9ybS1vcmlnaW46MCAzLjc1ZW07Ym9yZGVyLXJhZGl1czowIDcuNWVtIDcuNWVtIDB9LnN3YWwyLWljb24uc3dhbDItc3VjY2VzcyAuc3dhbDItc3VjY2Vzcy1yaW5ne3Bvc2l0aW9uOmFic29sdXRlO3otaW5kZXg6Mjt0b3A6LS4yNWVtO2xlZnQ6LS4yNWVtO2JveC1zaXppbmc6Y29udGVudC1ib3g7d2lkdGg6MTAwJTtoZWlnaHQ6MTAwJTtib3JkZXI6LjI1ZW0gc29saWQgcmdiYSgxNjUsMjIwLDEzNCwuMyk7Ym9yZGVyLXJhZGl1czo1MCV9LnN3YWwyLWljb24uc3dhbDItc3VjY2VzcyAuc3dhbDItc3VjY2Vzcy1maXh7cG9zaXRpb246YWJzb2x1dGU7ei1pbmRleDoxO3RvcDouNWVtO2xlZnQ6MS42MjVlbTt3aWR0aDouNDM3NWVtO2hlaWdodDo1LjYyNWVtO3RyYW5zZm9ybTpyb3RhdGUoLTQ1ZGVnKX0uc3dhbDItaWNvbi5zd2FsMi1zdWNjZXNzIFtjbGFzc149c3dhbDItc3VjY2Vzcy1saW5lXXtkaXNwbGF5OmJsb2NrO3Bvc2l0aW9uOmFic29sdXRlO3otaW5kZXg6MjtoZWlnaHQ6LjMxMjVlbTtib3JkZXItcmFkaXVzOi4xMjVlbTtiYWNrZ3JvdW5kLWNvbG9yOiNhNWRjODZ9LnN3YWwyLWljb24uc3dhbDItc3VjY2VzcyBbY2xhc3NePXN3YWwyLXN1Y2Nlc3MtbGluZV1bY2xhc3MkPXRpcF17dG9wOjIuODc1ZW07bGVmdDouODEyNWVtO3dpZHRoOjEuNTYyNWVtO3RyYW5zZm9ybTpyb3RhdGUoNDVkZWcpfS5zd2FsMi1pY29uLnN3YWwyLXN1Y2Nlc3MgW2NsYXNzXj1zd2FsMi1zdWNjZXNzLWxpbmVdW2NsYXNzJD1sb25nXXt0b3A6Mi4zNzVlbTtyaWdodDouNWVtO3dpZHRoOjIuOTM3NWVtO3RyYW5zZm9ybTpyb3RhdGUoLTQ1ZGVnKX0uc3dhbDItaWNvbi5zd2FsMi1zdWNjZXNzLnN3YWwyLWljb24tc2hvdyAuc3dhbDItc3VjY2Vzcy1saW5lLXRpcHthbmltYXRpb246c3dhbDItYW5pbWF0ZS1zdWNjZXNzLWxpbmUtdGlwIC43NXN9LnN3YWwyLWljb24uc3dhbDItc3VjY2Vzcy5zd2FsMi1pY29uLXNob3cgLnN3YWwyLXN1Y2Nlc3MtbGluZS1sb25ne2FuaW1hdGlvbjpzd2FsMi1hbmltYXRlLXN1Y2Nlc3MtbGluZS1sb25nIC43NXN9LnN3YWwyLWljb24uc3dhbDItc3VjY2Vzcy5zd2FsMi1pY29uLXNob3cgLnN3YWwyLXN1Y2Nlc3MtY2lyY3VsYXItbGluZS1yaWdodHthbmltYXRpb246c3dhbDItcm90YXRlLXN1Y2Nlc3MtY2lyY3VsYXItbGluZSA0LjI1cyBlYXNlLWlufS5zd2FsMi1wcm9ncmVzcy1zdGVwc3tmbGV4LXdyYXA6d3JhcDthbGlnbi1pdGVtczpjZW50ZXI7bWF4LXdpZHRoOjEwMCU7bWFyZ2luOjEuMjVlbSBhdXRvO3BhZGRpbmc6MDtiYWNrZ3JvdW5kOjAgMDtmb250LXdlaWdodDo2MDB9LnN3YWwyLXByb2dyZXNzLXN0ZXBzIGxpe2Rpc3BsYXk6aW5saW5lLWJsb2NrO3Bvc2l0aW9uOnJlbGF0aXZlfS5zd2FsMi1wcm9ncmVzcy1zdGVwcyAuc3dhbDItcHJvZ3Jlc3Mtc3RlcHt6LWluZGV4OjIwO2ZsZXgtc2hyaW5rOjA7d2lkdGg6MmVtO2hlaWdodDoyZW07Ym9yZGVyLXJhZGl1czoyZW07YmFja2dyb3VuZDojMjc3OGM0O2NvbG9yOiNmZmY7bGluZS1oZWlnaHQ6MmVtO3RleHQtYWxpZ246Y2VudGVyfS5zd2FsMi1wcm9ncmVzcy1zdGVwcyAuc3dhbDItcHJvZ3Jlc3Mtc3RlcC5zd2FsMi1hY3RpdmUtcHJvZ3Jlc3Mtc3RlcHtiYWNrZ3JvdW5kOiMyNzc4YzR9LnN3YWwyLXByb2dyZXNzLXN0ZXBzIC5zd2FsMi1wcm9ncmVzcy1zdGVwLnN3YWwyLWFjdGl2ZS1wcm9ncmVzcy1zdGVwfi5zd2FsMi1wcm9ncmVzcy1zdGVwe2JhY2tncm91bmQ6I2FkZDhlNjtjb2xvcjojZmZmfS5zd2FsMi1wcm9ncmVzcy1zdGVwcyAuc3dhbDItcHJvZ3Jlc3Mtc3RlcC5zd2FsMi1hY3RpdmUtcHJvZ3Jlc3Mtc3RlcH4uc3dhbDItcHJvZ3Jlc3Mtc3RlcC1saW5le2JhY2tncm91bmQ6I2FkZDhlNn0uc3dhbDItcHJvZ3Jlc3Mtc3RlcHMgLnN3YWwyLXByb2dyZXNzLXN0ZXAtbGluZXt6LWluZGV4OjEwO2ZsZXgtc2hyaW5rOjA7d2lkdGg6Mi41ZW07aGVpZ2h0Oi40ZW07bWFyZ2luOjAgLTFweDtiYWNrZ3JvdW5kOiMyNzc4YzR9W2NsYXNzXj1zd2FsMl17LXdlYmtpdC10YXAtaGlnaGxpZ2h0LWNvbG9yOnRyYW5zcGFyZW50fS5zd2FsMi1zaG93e2FuaW1hdGlvbjpzd2FsMi1zaG93IC4zc30uc3dhbDItaGlkZXthbmltYXRpb246c3dhbDItaGlkZSAuMTVzIGZvcndhcmRzfS5zd2FsMi1ub2FuaW1hdGlvbnt0cmFuc2l0aW9uOm5vbmV9LnN3YWwyLXNjcm9sbGJhci1tZWFzdXJle3Bvc2l0aW9uOmFic29sdXRlO3RvcDotOTk5OXB4O3dpZHRoOjUwcHg7aGVpZ2h0OjUwcHg7b3ZlcmZsb3c6c2Nyb2xsfS5zd2FsMi1ydGwgLnN3YWwyLWNsb3Nle21hcmdpbi1yaWdodDppbml0aWFsO21hcmdpbi1sZWZ0OjB9LnN3YWwyLXJ0bCAuc3dhbDItdGltZXItcHJvZ3Jlc3MtYmFye3JpZ2h0OjA7bGVmdDphdXRvfUBrZXlmcmFtZXMgc3dhbDItdG9hc3Qtc2hvd3swJXt0cmFuc2Zvcm06dHJhbnNsYXRlWSgtLjYyNWVtKSByb3RhdGVaKDJkZWcpfTMzJXt0cmFuc2Zvcm06dHJhbnNsYXRlWSgwKSByb3RhdGVaKC0yZGVnKX02NiV7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoLjMxMjVlbSkgcm90YXRlWigyZGVnKX0xMDAle3RyYW5zZm9ybTp0cmFuc2xhdGVZKDApIHJvdGF0ZVooMCl9fUBrZXlmcmFtZXMgc3dhbDItdG9hc3QtaGlkZXsxMDAle3RyYW5zZm9ybTpyb3RhdGVaKDFkZWcpO29wYWNpdHk6MH19QGtleWZyYW1lcyBzd2FsMi10b2FzdC1hbmltYXRlLXN1Y2Nlc3MtbGluZS10aXB7MCV7dG9wOi41NjI1ZW07bGVmdDouMDYyNWVtO3dpZHRoOjB9NTQle3RvcDouMTI1ZW07bGVmdDouMTI1ZW07d2lkdGg6MH03MCV7dG9wOi42MjVlbTtsZWZ0Oi0uMjVlbTt3aWR0aDoxLjYyNWVtfTg0JXt0b3A6MS4wNjI1ZW07bGVmdDouNzVlbTt3aWR0aDouNWVtfTEwMCV7dG9wOjEuMTI1ZW07bGVmdDouMTg3NWVtO3dpZHRoOi43NWVtfX1Aa2V5ZnJhbWVzIHN3YWwyLXRvYXN0LWFuaW1hdGUtc3VjY2Vzcy1saW5lLWxvbmd7MCV7dG9wOjEuNjI1ZW07cmlnaHQ6MS4zNzVlbTt3aWR0aDowfTY1JXt0b3A6MS4yNWVtO3JpZ2h0Oi45Mzc1ZW07d2lkdGg6MH04NCV7dG9wOi45Mzc1ZW07cmlnaHQ6MDt3aWR0aDoxLjEyNWVtfTEwMCV7dG9wOi45Mzc1ZW07cmlnaHQ6LjE4NzVlbTt3aWR0aDoxLjM3NWVtfX1Aa2V5ZnJhbWVzIHN3YWwyLXNob3d7MCV7dHJhbnNmb3JtOnNjYWxlKC43KX00NSV7dHJhbnNmb3JtOnNjYWxlKDEuMDUpfTgwJXt0cmFuc2Zvcm06c2NhbGUoLjk1KX0xMDAle3RyYW5zZm9ybTpzY2FsZSgxKX19QGtleWZyYW1lcyBzd2FsMi1oaWRlezAle3RyYW5zZm9ybTpzY2FsZSgxKTtvcGFjaXR5OjF9MTAwJXt0cmFuc2Zvcm06c2NhbGUoLjUpO29wYWNpdHk6MH19QGtleWZyYW1lcyBzd2FsMi1hbmltYXRlLXN1Y2Nlc3MtbGluZS10aXB7MCV7dG9wOjEuMTg3NWVtO2xlZnQ6LjA2MjVlbTt3aWR0aDowfTU0JXt0b3A6MS4wNjI1ZW07bGVmdDouMTI1ZW07d2lkdGg6MH03MCV7dG9wOjIuMTg3NWVtO2xlZnQ6LS4zNzVlbTt3aWR0aDozLjEyNWVtfTg0JXt0b3A6M2VtO2xlZnQ6MS4zMTI1ZW07d2lkdGg6MS4wNjI1ZW19MTAwJXt0b3A6Mi44MTI1ZW07bGVmdDouODEyNWVtO3dpZHRoOjEuNTYyNWVtfX1Aa2V5ZnJhbWVzIHN3YWwyLWFuaW1hdGUtc3VjY2Vzcy1saW5lLWxvbmd7MCV7dG9wOjMuMzc1ZW07cmlnaHQ6Mi44NzVlbTt3aWR0aDowfTY1JXt0b3A6My4zNzVlbTtyaWdodDoyLjg3NWVtO3dpZHRoOjB9ODQle3RvcDoyLjE4NzVlbTtyaWdodDowO3dpZHRoOjMuNDM3NWVtfTEwMCV7dG9wOjIuMzc1ZW07cmlnaHQ6LjVlbTt3aWR0aDoyLjkzNzVlbX19QGtleWZyYW1lcyBzd2FsMi1yb3RhdGUtc3VjY2Vzcy1jaXJjdWxhci1saW5lezAle3RyYW5zZm9ybTpyb3RhdGUoLTQ1ZGVnKX01JXt0cmFuc2Zvcm06cm90YXRlKC00NWRlZyl9MTIle3RyYW5zZm9ybTpyb3RhdGUoLTQwNWRlZyl9MTAwJXt0cmFuc2Zvcm06cm90YXRlKC00MDVkZWcpfX1Aa2V5ZnJhbWVzIHN3YWwyLWFuaW1hdGUtZXJyb3IteC1tYXJrezAle21hcmdpbi10b3A6MS42MjVlbTt0cmFuc2Zvcm06c2NhbGUoLjQpO29wYWNpdHk6MH01MCV7bWFyZ2luLXRvcDoxLjYyNWVtO3RyYW5zZm9ybTpzY2FsZSguNCk7b3BhY2l0eTowfTgwJXttYXJnaW4tdG9wOi0uMzc1ZW07dHJhbnNmb3JtOnNjYWxlKDEuMTUpfTEwMCV7bWFyZ2luLXRvcDowO3RyYW5zZm9ybTpzY2FsZSgxKTtvcGFjaXR5OjF9fUBrZXlmcmFtZXMgc3dhbDItYW5pbWF0ZS1lcnJvci1pY29uezAle3RyYW5zZm9ybTpyb3RhdGVYKDEwMGRlZyk7b3BhY2l0eTowfTEwMCV7dHJhbnNmb3JtOnJvdGF0ZVgoMCk7b3BhY2l0eToxfX1Aa2V5ZnJhbWVzIHN3YWwyLXJvdGF0ZS1sb2FkaW5nezAle3RyYW5zZm9ybTpyb3RhdGUoMCl9MTAwJXt0cmFuc2Zvcm06cm90YXRlKDM2MGRlZyl9fUBrZXlmcmFtZXMgc3dhbDItYW5pbWF0ZS1xdWVzdGlvbi1tYXJrezAle3RyYW5zZm9ybTpyb3RhdGVZKC0zNjBkZWcpfTEwMCV7dHJhbnNmb3JtOnJvdGF0ZVkoMCl9fUBrZXlmcmFtZXMgc3dhbDItYW5pbWF0ZS1pLW1hcmt7MCV7dHJhbnNmb3JtOnJvdGF0ZVooNDVkZWcpO29wYWNpdHk6MH0yNSV7dHJhbnNmb3JtOnJvdGF0ZVooLTI1ZGVnKTtvcGFjaXR5Oi40fTUwJXt0cmFuc2Zvcm06cm90YXRlWigxNWRlZyk7b3BhY2l0eTouOH03NSV7dHJhbnNmb3JtOnJvdGF0ZVooLTVkZWcpO29wYWNpdHk6MX0xMDAle3RyYW5zZm9ybTpyb3RhdGVYKDApO29wYWNpdHk6MX19Ym9keS5zd2FsMi1zaG93bjpub3QoLnN3YWwyLW5vLWJhY2tkcm9wKTpub3QoLnN3YWwyLXRvYXN0LXNob3duKXtvdmVyZmxvdzpoaWRkZW59Ym9keS5zd2FsMi1oZWlnaHQtYXV0b3toZWlnaHQ6YXV0byFpbXBvcnRhbnR9Ym9keS5zd2FsMi1uby1iYWNrZHJvcCAuc3dhbDItY29udGFpbmVye2JhY2tncm91bmQtY29sb3I6dHJhbnNwYXJlbnQhaW1wb3J0YW50O3BvaW50ZXItZXZlbnRzOm5vbmV9Ym9keS5zd2FsMi1uby1iYWNrZHJvcCAuc3dhbDItY29udGFpbmVyIC5zd2FsMi1wb3B1cHtwb2ludGVyLWV2ZW50czphbGx9Ym9keS5zd2FsMi1uby1iYWNrZHJvcCAuc3dhbDItY29udGFpbmVyIC5zd2FsMi1tb2RhbHtib3gtc2hhZG93OjAgMCAxMHB4IHJnYmEoMCwwLDAsLjQpfUBtZWRpYSBwcmludHtib2R5LnN3YWwyLXNob3duOm5vdCguc3dhbDItbm8tYmFja2Ryb3ApOm5vdCguc3dhbDItdG9hc3Qtc2hvd24pe292ZXJmbG93LXk6c2Nyb2xsIWltcG9ydGFudH1ib2R5LnN3YWwyLXNob3duOm5vdCguc3dhbDItbm8tYmFja2Ryb3ApOm5vdCguc3dhbDItdG9hc3Qtc2hvd24pPlthcmlhLWhpZGRlbj10cnVlXXtkaXNwbGF5Om5vbmV9Ym9keS5zd2FsMi1zaG93bjpub3QoLnN3YWwyLW5vLWJhY2tkcm9wKTpub3QoLnN3YWwyLXRvYXN0LXNob3duKSAuc3dhbDItY29udGFpbmVye3Bvc2l0aW9uOnN0YXRpYyFpbXBvcnRhbnR9fWJvZHkuc3dhbDItdG9hc3Qtc2hvd24gLnN3YWwyLWNvbnRhaW5lcntib3gtc2l6aW5nOmJvcmRlci1ib3g7d2lkdGg6MzYwcHg7bWF4LXdpZHRoOjEwMCU7YmFja2dyb3VuZC1jb2xvcjp0cmFuc3BhcmVudDtwb2ludGVyLWV2ZW50czpub25lfWJvZHkuc3dhbDItdG9hc3Qtc2hvd24gLnN3YWwyLWNvbnRhaW5lci5zd2FsMi10b3B7dG9wOjA7cmlnaHQ6YXV0bztib3R0b206YXV0bztsZWZ0OjUwJTt0cmFuc2Zvcm06dHJhbnNsYXRlWCgtNTAlKX1ib2R5LnN3YWwyLXRvYXN0LXNob3duIC5zd2FsMi1jb250YWluZXIuc3dhbDItdG9wLWVuZCxib2R5LnN3YWwyLXRvYXN0LXNob3duIC5zd2FsMi1jb250YWluZXIuc3dhbDItdG9wLXJpZ2h0e3RvcDowO3JpZ2h0OjA7Ym90dG9tOmF1dG87bGVmdDphdXRvfWJvZHkuc3dhbDItdG9hc3Qtc2hvd24gLnN3YWwyLWNvbnRhaW5lci5zd2FsMi10b3AtbGVmdCxib2R5LnN3YWwyLXRvYXN0LXNob3duIC5zd2FsMi1jb250YWluZXIuc3dhbDItdG9wLXN0YXJ0e3RvcDowO3JpZ2h0OmF1dG87Ym90dG9tOmF1dG87bGVmdDowfWJvZHkuc3dhbDItdG9hc3Qtc2hvd24gLnN3YWwyLWNvbnRhaW5lci5zd2FsMi1jZW50ZXItbGVmdCxib2R5LnN3YWwyLXRvYXN0LXNob3duIC5zd2FsMi1jb250YWluZXIuc3dhbDItY2VudGVyLXN0YXJ0e3RvcDo1MCU7cmlnaHQ6YXV0bztib3R0b206YXV0bztsZWZ0OjA7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoLTUwJSl9Ym9keS5zd2FsMi10b2FzdC1zaG93biAuc3dhbDItY29udGFpbmVyLnN3YWwyLWNlbnRlcnt0b3A6NTAlO3JpZ2h0OmF1dG87Ym90dG9tOmF1dG87bGVmdDo1MCU7dHJhbnNmb3JtOnRyYW5zbGF0ZSgtNTAlLC01MCUpfWJvZHkuc3dhbDItdG9hc3Qtc2hvd24gLnN3YWwyLWNvbnRhaW5lci5zd2FsMi1jZW50ZXItZW5kLGJvZHkuc3dhbDItdG9hc3Qtc2hvd24gLnN3YWwyLWNvbnRhaW5lci5zd2FsMi1jZW50ZXItcmlnaHR7dG9wOjUwJTtyaWdodDowO2JvdHRvbTphdXRvO2xlZnQ6YXV0bzt0cmFuc2Zvcm06dHJhbnNsYXRlWSgtNTAlKX1ib2R5LnN3YWwyLXRvYXN0LXNob3duIC5zd2FsMi1jb250YWluZXIuc3dhbDItYm90dG9tLWxlZnQsYm9keS5zd2FsMi10b2FzdC1zaG93biAuc3dhbDItY29udGFpbmVyLnN3YWwyLWJvdHRvbS1zdGFydHt0b3A6YXV0bztyaWdodDphdXRvO2JvdHRvbTowO2xlZnQ6MH1ib2R5LnN3YWwyLXRvYXN0LXNob3duIC5zd2FsMi1jb250YWluZXIuc3dhbDItYm90dG9te3RvcDphdXRvO3JpZ2h0OmF1dG87Ym90dG9tOjA7bGVmdDo1MCU7dHJhbnNmb3JtOnRyYW5zbGF0ZVgoLTUwJSl9Ym9keS5zd2FsMi10b2FzdC1zaG93biAuc3dhbDItY29udGFpbmVyLnN3YWwyLWJvdHRvbS1lbmQsYm9keS5zd2FsMi10b2FzdC1zaG93biAuc3dhbDItY29udGFpbmVyLnN3YWwyLWJvdHRvbS1yaWdodHt0b3A6YXV0bztyaWdodDowO2JvdHRvbTowO2xlZnQ6YXV0b31cIik7IiwiLyoqXG4qIFRvbSBTZWxlY3QgdjIuMi4yXG4qIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4qL1xuXG4oZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuXHR0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKSA6XG5cdHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShmYWN0b3J5KSA6XG5cdChnbG9iYWwgPSB0eXBlb2YgZ2xvYmFsVGhpcyAhPT0gJ3VuZGVmaW5lZCcgPyBnbG9iYWxUaGlzIDogZ2xvYmFsIHx8IHNlbGYsIGdsb2JhbC5Ub21TZWxlY3QgPSBmYWN0b3J5KCkpO1xufSkodGhpcywgKGZ1bmN0aW9uICgpIHsgJ3VzZSBzdHJpY3QnO1xuXG5cdC8qKlxuXHQgKiBNaWNyb0V2ZW50IC0gdG8gbWFrZSBhbnkganMgb2JqZWN0IGFuIGV2ZW50IGVtaXR0ZXJcblx0ICpcblx0ICogLSBwdXJlIGphdmFzY3JpcHQgLSBzZXJ2ZXIgY29tcGF0aWJsZSwgYnJvd3NlciBjb21wYXRpYmxlXG5cdCAqIC0gZG9udCByZWx5IG9uIHRoZSBicm93c2VyIGRvbXNcblx0ICogLSBzdXBlciBzaW1wbGUgLSB5b3UgZ2V0IGl0IGltbWVkaWF0bHksIG5vIG1pc3RlcnksIG5vIG1hZ2ljIGludm9sdmVkXG5cdCAqXG5cdCAqIEBhdXRob3IgSmVyb21lIEV0aWVubmUgKGh0dHBzOi8vZ2l0aHViLmNvbS9qZXJvbWVldGllbm5lKVxuXHQgKi9cblxuXHQvKipcblx0ICogRXhlY3V0ZSBjYWxsYmFjayBmb3IgZWFjaCBldmVudCBpbiBzcGFjZSBzZXBhcmF0ZWQgbGlzdCBvZiBldmVudCBuYW1lc1xuXHQgKlxuXHQgKi9cblx0ZnVuY3Rpb24gZm9yRXZlbnRzKGV2ZW50cywgY2FsbGJhY2spIHtcblx0ICBldmVudHMuc3BsaXQoL1xccysvKS5mb3JFYWNoKGV2ZW50ID0+IHtcblx0ICAgIGNhbGxiYWNrKGV2ZW50KTtcblx0ICB9KTtcblx0fVxuXG5cdGNsYXNzIE1pY3JvRXZlbnQge1xuXHQgIGNvbnN0cnVjdG9yKCkge1xuXHQgICAgdGhpcy5fZXZlbnRzID0gdm9pZCAwO1xuXHQgICAgdGhpcy5fZXZlbnRzID0ge307XG5cdCAgfVxuXG5cdCAgb24oZXZlbnRzLCBmY3QpIHtcblx0ICAgIGZvckV2ZW50cyhldmVudHMsIGV2ZW50ID0+IHtcblx0ICAgICAgY29uc3QgZXZlbnRfYXJyYXkgPSB0aGlzLl9ldmVudHNbZXZlbnRdIHx8IFtdO1xuXHQgICAgICBldmVudF9hcnJheS5wdXNoKGZjdCk7XG5cdCAgICAgIHRoaXMuX2V2ZW50c1tldmVudF0gPSBldmVudF9hcnJheTtcblx0ICAgIH0pO1xuXHQgIH1cblxuXHQgIG9mZihldmVudHMsIGZjdCkge1xuXHQgICAgdmFyIG4gPSBhcmd1bWVudHMubGVuZ3RoO1xuXG5cdCAgICBpZiAobiA9PT0gMCkge1xuXHQgICAgICB0aGlzLl9ldmVudHMgPSB7fTtcblx0ICAgICAgcmV0dXJuO1xuXHQgICAgfVxuXG5cdCAgICBmb3JFdmVudHMoZXZlbnRzLCBldmVudCA9PiB7XG5cdCAgICAgIGlmIChuID09PSAxKSB7XG5cdCAgICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1tldmVudF07XG5cdCAgICAgICAgcmV0dXJuO1xuXHQgICAgICB9XG5cblx0ICAgICAgY29uc3QgZXZlbnRfYXJyYXkgPSB0aGlzLl9ldmVudHNbZXZlbnRdO1xuXHQgICAgICBpZiAoZXZlbnRfYXJyYXkgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xuXHQgICAgICBldmVudF9hcnJheS5zcGxpY2UoZXZlbnRfYXJyYXkuaW5kZXhPZihmY3QpLCAxKTtcblx0ICAgICAgdGhpcy5fZXZlbnRzW2V2ZW50XSA9IGV2ZW50X2FycmF5O1xuXHQgICAgfSk7XG5cdCAgfVxuXG5cdCAgdHJpZ2dlcihldmVudHMsIC4uLmFyZ3MpIHtcblx0ICAgIHZhciBzZWxmID0gdGhpcztcblx0ICAgIGZvckV2ZW50cyhldmVudHMsIGV2ZW50ID0+IHtcblx0ICAgICAgY29uc3QgZXZlbnRfYXJyYXkgPSBzZWxmLl9ldmVudHNbZXZlbnRdO1xuXHQgICAgICBpZiAoZXZlbnRfYXJyYXkgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xuXHQgICAgICBldmVudF9hcnJheS5mb3JFYWNoKGZjdCA9PiB7XG5cdCAgICAgICAgZmN0LmFwcGx5KHNlbGYsIGFyZ3MpO1xuXHQgICAgICB9KTtcblx0ICAgIH0pO1xuXHQgIH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIG1pY3JvcGx1Z2luLmpzXG5cdCAqIENvcHlyaWdodCAoYykgMjAxMyBCcmlhbiBSZWF2aXMgJiBjb250cmlidXRvcnNcblx0ICpcblx0ICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlIHRoaXNcblx0ICogZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXQ6XG5cdCAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuXHQgKlxuXHQgKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyXG5cdCAqIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0Zcblx0ICogQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlXG5cdCAqIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5cdCAqXG5cdCAqIEBhdXRob3IgQnJpYW4gUmVhdmlzIDxicmlhbkB0aGlyZHJvdXRlLmNvbT5cblx0ICovXG5cdGZ1bmN0aW9uIE1pY3JvUGx1Z2luKEludGVyZmFjZSkge1xuXHQgIEludGVyZmFjZS5wbHVnaW5zID0ge307XG5cdCAgcmV0dXJuIGNsYXNzIGV4dGVuZHMgSW50ZXJmYWNlIHtcblx0ICAgIGNvbnN0cnVjdG9yKC4uLmFyZ3MpIHtcblx0ICAgICAgc3VwZXIoLi4uYXJncyk7XG5cdCAgICAgIHRoaXMucGx1Z2lucyA9IHtcblx0ICAgICAgICBuYW1lczogW10sXG5cdCAgICAgICAgc2V0dGluZ3M6IHt9LFxuXHQgICAgICAgIHJlcXVlc3RlZDoge30sXG5cdCAgICAgICAgbG9hZGVkOiB7fVxuXHQgICAgICB9O1xuXHQgICAgfVxuXG5cdCAgICAvKipcblx0ICAgICAqIFJlZ2lzdGVycyBhIHBsdWdpbi5cblx0ICAgICAqXG5cdCAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBmblxuXHQgICAgICovXG5cdCAgICBzdGF0aWMgZGVmaW5lKG5hbWUsIGZuKSB7XG5cdCAgICAgIEludGVyZmFjZS5wbHVnaW5zW25hbWVdID0ge1xuXHQgICAgICAgICduYW1lJzogbmFtZSxcblx0ICAgICAgICAnZm4nOiBmblxuXHQgICAgICB9O1xuXHQgICAgfVxuXHQgICAgLyoqXG5cdCAgICAgKiBJbml0aWFsaXplcyB0aGUgbGlzdGVkIHBsdWdpbnMgKHdpdGggb3B0aW9ucykuXG5cdCAgICAgKiBBY2NlcHRhYmxlIGZvcm1hdHM6XG5cdCAgICAgKlxuXHQgICAgICogTGlzdCAod2l0aG91dCBvcHRpb25zKTpcblx0ICAgICAqICAgWydhJywgJ2InLCAnYyddXG5cdCAgICAgKlxuXHQgICAgICogTGlzdCAod2l0aCBvcHRpb25zKTpcblx0ICAgICAqICAgW3snbmFtZSc6ICdhJywgb3B0aW9uczoge319LCB7J25hbWUnOiAnYicsIG9wdGlvbnM6IHt9fV1cblx0ICAgICAqXG5cdCAgICAgKiBIYXNoICh3aXRoIG9wdGlvbnMpOlxuXHQgICAgICogICB7J2EnOiB7IC4uLiB9LCAnYic6IHsgLi4uIH0sICdjJzogeyAuLi4gfX1cblx0ICAgICAqXG5cdCAgICAgKiBAcGFyYW0ge2FycmF5fG9iamVjdH0gcGx1Z2luc1xuXHQgICAgICovXG5cblxuXHQgICAgaW5pdGlhbGl6ZVBsdWdpbnMocGx1Z2lucykge1xuXHQgICAgICB2YXIga2V5LCBuYW1lO1xuXHQgICAgICBjb25zdCBzZWxmID0gdGhpcztcblx0ICAgICAgY29uc3QgcXVldWUgPSBbXTtcblxuXHQgICAgICBpZiAoQXJyYXkuaXNBcnJheShwbHVnaW5zKSkge1xuXHQgICAgICAgIHBsdWdpbnMuZm9yRWFjaChwbHVnaW4gPT4ge1xuXHQgICAgICAgICAgaWYgKHR5cGVvZiBwbHVnaW4gPT09ICdzdHJpbmcnKSB7XG5cdCAgICAgICAgICAgIHF1ZXVlLnB1c2gocGx1Z2luKTtcblx0ICAgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICAgIHNlbGYucGx1Z2lucy5zZXR0aW5nc1twbHVnaW4ubmFtZV0gPSBwbHVnaW4ub3B0aW9ucztcblx0ICAgICAgICAgICAgcXVldWUucHVzaChwbHVnaW4ubmFtZSk7XG5cdCAgICAgICAgICB9XG5cdCAgICAgICAgfSk7XG5cdCAgICAgIH0gZWxzZSBpZiAocGx1Z2lucykge1xuXHQgICAgICAgIGZvciAoa2V5IGluIHBsdWdpbnMpIHtcblx0ICAgICAgICAgIGlmIChwbHVnaW5zLmhhc093blByb3BlcnR5KGtleSkpIHtcblx0ICAgICAgICAgICAgc2VsZi5wbHVnaW5zLnNldHRpbmdzW2tleV0gPSBwbHVnaW5zW2tleV07XG5cdCAgICAgICAgICAgIHF1ZXVlLnB1c2goa2V5KTtcblx0ICAgICAgICAgIH1cblx0ICAgICAgICB9XG5cdCAgICAgIH1cblxuXHQgICAgICB3aGlsZSAobmFtZSA9IHF1ZXVlLnNoaWZ0KCkpIHtcblx0ICAgICAgICBzZWxmLnJlcXVpcmUobmFtZSk7XG5cdCAgICAgIH1cblx0ICAgIH1cblxuXHQgICAgbG9hZFBsdWdpbihuYW1lKSB7XG5cdCAgICAgIHZhciBzZWxmID0gdGhpcztcblx0ICAgICAgdmFyIHBsdWdpbnMgPSBzZWxmLnBsdWdpbnM7XG5cdCAgICAgIHZhciBwbHVnaW4gPSBJbnRlcmZhY2UucGx1Z2luc1tuYW1lXTtcblxuXHQgICAgICBpZiAoIUludGVyZmFjZS5wbHVnaW5zLmhhc093blByb3BlcnR5KG5hbWUpKSB7XG5cdCAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmFibGUgdG8gZmluZCBcIicgKyBuYW1lICsgJ1wiIHBsdWdpbicpO1xuXHQgICAgICB9XG5cblx0ICAgICAgcGx1Z2lucy5yZXF1ZXN0ZWRbbmFtZV0gPSB0cnVlO1xuXHQgICAgICBwbHVnaW5zLmxvYWRlZFtuYW1lXSA9IHBsdWdpbi5mbi5hcHBseShzZWxmLCBbc2VsZi5wbHVnaW5zLnNldHRpbmdzW25hbWVdIHx8IHt9XSk7XG5cdCAgICAgIHBsdWdpbnMubmFtZXMucHVzaChuYW1lKTtcblx0ICAgIH1cblx0ICAgIC8qKlxuXHQgICAgICogSW5pdGlhbGl6ZXMgYSBwbHVnaW4uXG5cdCAgICAgKlxuXHQgICAgICovXG5cblxuXHQgICAgcmVxdWlyZShuYW1lKSB7XG5cdCAgICAgIHZhciBzZWxmID0gdGhpcztcblx0ICAgICAgdmFyIHBsdWdpbnMgPSBzZWxmLnBsdWdpbnM7XG5cblx0ICAgICAgaWYgKCFzZWxmLnBsdWdpbnMubG9hZGVkLmhhc093blByb3BlcnR5KG5hbWUpKSB7XG5cdCAgICAgICAgaWYgKHBsdWdpbnMucmVxdWVzdGVkW25hbWVdKSB7XG5cdCAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1BsdWdpbiBoYXMgY2lyY3VsYXIgZGVwZW5kZW5jeSAoXCInICsgbmFtZSArICdcIiknKTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICBzZWxmLmxvYWRQbHVnaW4obmFtZSk7XG5cdCAgICAgIH1cblxuXHQgICAgICByZXR1cm4gcGx1Z2lucy5sb2FkZWRbbmFtZV07XG5cdCAgICB9XG5cblx0ICB9O1xuXHR9XG5cblx0LyohIEBvcmNoaWRqcy91bmljb2RlLXZhcmlhbnRzIHwgaHR0cHM6Ly9naXRodWIuY29tL29yY2hpZGpzL3VuaWNvZGUtdmFyaWFudHMgfCBBcGFjaGUgTGljZW5zZSAodjIpICovXG5cdC8qKlxuXHQgKiBDb252ZXJ0IGFycmF5IG9mIHN0cmluZ3MgdG8gYSByZWd1bGFyIGV4cHJlc3Npb25cblx0ICpcdGV4IFsnYWInLCdhJ10gPT4gKD86YWJ8YSlcblx0ICogXHRleCBbJ2EnLCdiJ10gPT4gW2FiXVxuXHQgKiBAcGFyYW0ge3N0cmluZ1tdfSBjaGFyc1xuXHQgKiBAcmV0dXJuIHtzdHJpbmd9XG5cdCAqL1xuXHRjb25zdCBhcnJheVRvUGF0dGVybiA9IGNoYXJzID0+IHtcblx0ICBjaGFycyA9IGNoYXJzLmZpbHRlcihCb29sZWFuKTtcblxuXHQgIGlmIChjaGFycy5sZW5ndGggPCAyKSB7XG5cdCAgICByZXR1cm4gY2hhcnNbMF0gfHwgJyc7XG5cdCAgfVxuXG5cdCAgcmV0dXJuIG1heFZhbHVlTGVuZ3RoKGNoYXJzKSA9PSAxID8gJ1snICsgY2hhcnMuam9pbignJykgKyAnXScgOiAnKD86JyArIGNoYXJzLmpvaW4oJ3wnKSArICcpJztcblx0fTtcblx0LyoqXG5cdCAqIEBwYXJhbSB7c3RyaW5nW119IGFycmF5XG5cdCAqIEByZXR1cm4ge3N0cmluZ31cblx0ICovXG5cblx0Y29uc3Qgc2VxdWVuY2VQYXR0ZXJuID0gYXJyYXkgPT4ge1xuXHQgIGlmICghaGFzRHVwbGljYXRlcyhhcnJheSkpIHtcblx0ICAgIHJldHVybiBhcnJheS5qb2luKCcnKTtcblx0ICB9XG5cblx0ICBsZXQgcGF0dGVybiA9ICcnO1xuXHQgIGxldCBwcmV2X2NoYXJfY291bnQgPSAwO1xuXG5cdCAgY29uc3QgcHJldl9wYXR0ZXJuID0gKCkgPT4ge1xuXHQgICAgaWYgKHByZXZfY2hhcl9jb3VudCA+IDEpIHtcblx0ICAgICAgcGF0dGVybiArPSAneycgKyBwcmV2X2NoYXJfY291bnQgKyAnfSc7XG5cdCAgICB9XG5cdCAgfTtcblxuXHQgIGFycmF5LmZvckVhY2goKGNoYXIsIGkpID0+IHtcblx0ICAgIGlmIChjaGFyID09PSBhcnJheVtpIC0gMV0pIHtcblx0ICAgICAgcHJldl9jaGFyX2NvdW50Kys7XG5cdCAgICAgIHJldHVybjtcblx0ICAgIH1cblxuXHQgICAgcHJldl9wYXR0ZXJuKCk7XG5cdCAgICBwYXR0ZXJuICs9IGNoYXI7XG5cdCAgICBwcmV2X2NoYXJfY291bnQgPSAxO1xuXHQgIH0pO1xuXHQgIHByZXZfcGF0dGVybigpO1xuXHQgIHJldHVybiBwYXR0ZXJuO1xuXHR9O1xuXHQvKipcblx0ICogQ29udmVydCBhcnJheSBvZiBzdHJpbmdzIHRvIGEgcmVndWxhciBleHByZXNzaW9uXG5cdCAqXHRleCBbJ2FiJywnYSddID0+ICg/OmFifGEpXG5cdCAqIFx0ZXggWydhJywnYiddID0+IFthYl1cblx0ICogQHBhcmFtIHtTZXQ8c3RyaW5nPn0gY2hhcnNcblx0ICogQHJldHVybiB7c3RyaW5nfVxuXHQgKi9cblxuXHRjb25zdCBzZXRUb1BhdHRlcm4gPSBjaGFycyA9PiB7XG5cdCAgbGV0IGFycmF5ID0gdG9BcnJheShjaGFycyk7XG5cdCAgcmV0dXJuIGFycmF5VG9QYXR0ZXJuKGFycmF5KTtcblx0fTtcblx0LyoqXG5cdCAqXG5cdCAqIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzczNzY1OTgvaW4tamF2YXNjcmlwdC1ob3ctZG8taS1jaGVjay1pZi1hbi1hcnJheS1oYXMtZHVwbGljYXRlLXZhbHVlc1xuXHQgKiBAcGFyYW0ge2FueVtdfSBhcnJheVxuXHQgKi9cblxuXHRjb25zdCBoYXNEdXBsaWNhdGVzID0gYXJyYXkgPT4ge1xuXHQgIHJldHVybiBuZXcgU2V0KGFycmF5KS5zaXplICE9PSBhcnJheS5sZW5ndGg7XG5cdH07XG5cdC8qKlxuXHQgKiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy82MzAwNjYwMS93aHktZG9lcy11LXRocm93LWFuLWludmFsaWQtZXNjYXBlLWVycm9yXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBzdHJcblx0ICogQHJldHVybiB7c3RyaW5nfVxuXHQgKi9cblxuXHRjb25zdCBlc2NhcGVfcmVnZXggPSBzdHIgPT4ge1xuXHQgIHJldHVybiAoc3RyICsgJycpLnJlcGxhY2UoLyhbXFwkXFwoXFwpXFwqXFwrXFwuXFw/XFxbXFxdXFxeXFx7XFx8XFx9XFxcXF0pL2d1LCAnXFxcXCQxJyk7XG5cdH07XG5cdC8qKlxuXHQgKiBSZXR1cm4gdGhlIG1heCBsZW5ndGggb2YgYXJyYXkgdmFsdWVzXG5cdCAqIEBwYXJhbSB7c3RyaW5nW119IGFycmF5XG5cdCAqXG5cdCAqL1xuXG5cdGNvbnN0IG1heFZhbHVlTGVuZ3RoID0gYXJyYXkgPT4ge1xuXHQgIHJldHVybiBhcnJheS5yZWR1Y2UoKGxvbmdlc3QsIHZhbHVlKSA9PiBNYXRoLm1heChsb25nZXN0LCB1bmljb2RlTGVuZ3RoKHZhbHVlKSksIDApO1xuXHR9O1xuXHQvKipcblx0ICogQHBhcmFtIHtzdHJpbmd9IHN0clxuXHQgKi9cblxuXHRjb25zdCB1bmljb2RlTGVuZ3RoID0gc3RyID0+IHtcblx0ICByZXR1cm4gdG9BcnJheShzdHIpLmxlbmd0aDtcblx0fTtcblx0LyoqXG5cdCAqIEBwYXJhbSB7YW55fSBwXG5cdCAqIEByZXR1cm4ge2FueVtdfVxuXHQgKi9cblxuXHRjb25zdCB0b0FycmF5ID0gcCA9PiBBcnJheS5mcm9tKHApO1xuXG5cdC8qISBAb3JjaGlkanMvdW5pY29kZS12YXJpYW50cyB8IGh0dHBzOi8vZ2l0aHViLmNvbS9vcmNoaWRqcy91bmljb2RlLXZhcmlhbnRzIHwgQXBhY2hlIExpY2Vuc2UgKHYyKSAqL1xuXHQvKipcblx0ICogR2V0IGFsbCBwb3NzaWJsZSBjb21iaW5hdGlvbnMgb2Ygc3Vic3RyaW5ncyB0aGF0IGFkZCB1cCB0byB0aGUgZ2l2ZW4gc3RyaW5nXG5cdCAqIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzMwMTY5NTg3L2ZpbmQtYWxsLXRoZS1jb21iaW5hdGlvbi1vZi1zdWJzdHJpbmdzLXRoYXQtYWRkLXVwLXRvLXRoZS1naXZlbi1zdHJpbmdcblx0ICogQHBhcmFtIHtzdHJpbmd9IGlucHV0XG5cdCAqIEByZXR1cm4ge3N0cmluZ1tdW119XG5cdCAqL1xuXHRjb25zdCBhbGxTdWJzdHJpbmdzID0gaW5wdXQgPT4ge1xuXHQgIGlmIChpbnB1dC5sZW5ndGggPT09IDEpIHJldHVybiBbW2lucHV0XV07XG5cdCAgLyoqIEB0eXBlIHtzdHJpbmdbXVtdfSAqL1xuXG5cdCAgbGV0IHJlc3VsdCA9IFtdO1xuXHQgIGNvbnN0IHN0YXJ0ID0gaW5wdXQuc3Vic3RyaW5nKDEpO1xuXHQgIGNvbnN0IHN1YmEgPSBhbGxTdWJzdHJpbmdzKHN0YXJ0KTtcblx0ICBzdWJhLmZvckVhY2goZnVuY3Rpb24gKHN1YnJlc3VsdCkge1xuXHQgICAgbGV0IHRtcCA9IHN1YnJlc3VsdC5zbGljZSgwKTtcblx0ICAgIHRtcFswXSA9IGlucHV0LmNoYXJBdCgwKSArIHRtcFswXTtcblx0ICAgIHJlc3VsdC5wdXNoKHRtcCk7XG5cdCAgICB0bXAgPSBzdWJyZXN1bHQuc2xpY2UoMCk7XG5cdCAgICB0bXAudW5zaGlmdChpbnB1dC5jaGFyQXQoMCkpO1xuXHQgICAgcmVzdWx0LnB1c2godG1wKTtcblx0ICB9KTtcblx0ICByZXR1cm4gcmVzdWx0O1xuXHR9O1xuXG5cdC8qISBAb3JjaGlkanMvdW5pY29kZS12YXJpYW50cyB8IGh0dHBzOi8vZ2l0aHViLmNvbS9vcmNoaWRqcy91bmljb2RlLXZhcmlhbnRzIHwgQXBhY2hlIExpY2Vuc2UgKHYyKSAqL1xuXG5cdC8qKlxuXHQgKiBAdHlwZWRlZiB7e1trZXk6c3RyaW5nXTpzdHJpbmd9fSBUVW5pY29kZU1hcFxuXHQgKiBAdHlwZWRlZiB7e1trZXk6c3RyaW5nXTpTZXQ8c3RyaW5nPn19IFRVbmljb2RlU2V0c1xuXHQgKiBAdHlwZWRlZiB7W1tudW1iZXIsbnVtYmVyXV19IFRDb2RlUG9pbnRzXG5cdCAqIEB0eXBlZGVmIHt7Zm9sZGVkOnN0cmluZyxjb21wb3NlZDpzdHJpbmcsY29kZV9wb2ludDpudW1iZXJ9fSBUQ29kZVBvaW50T2JqXG5cdCAqIEB0eXBlZGVmIHt7c3RhcnQ6bnVtYmVyLGVuZDpudW1iZXIsbGVuZ3RoOm51bWJlcixzdWJzdHI6c3RyaW5nfX0gVFNlcXVlbmNlUGFydFxuXHQgKi9cblx0LyoqIEB0eXBlIHtUQ29kZVBvaW50c30gKi9cblxuXHRjb25zdCBjb2RlX3BvaW50cyA9IFtbMCwgNjU1MzVdXTtcblx0Y29uc3QgYWNjZW50X3BhdCA9ICdbXFx1MDMwMC1cXHUwMzZGXFx1e2I3fVxcdXsyYmV9XFx1ezJiY31dJztcblx0LyoqIEB0eXBlIHtUVW5pY29kZU1hcH0gKi9cblxuXHRsZXQgdW5pY29kZV9tYXA7XG5cdC8qKiBAdHlwZSB7UmVnRXhwfSAqL1xuXG5cdGxldCBtdWx0aV9jaGFyX3JlZztcblx0Y29uc3QgbWF4X2NoYXJfbGVuZ3RoID0gMztcblx0LyoqIEB0eXBlIHtUVW5pY29kZU1hcH0gKi9cblxuXHRjb25zdCBsYXRpbl9jb252ZXJ0ID0ge307XG5cdC8qKiBAdHlwZSB7VFVuaWNvZGVNYXB9ICovXG5cblx0Y29uc3QgbGF0aW5fY29uZGVuc2VkID0ge1xuXHQgICcvJzogJ+KBhOKIlScsXG5cdCAgJzAnOiAn34AnLFxuXHQgIFwiYVwiOiBcIuKxpcmQyZFcIixcblx0ICBcImFhXCI6IFwi6pyzXCIsXG5cdCAgXCJhZVwiOiBcIsOmx73Ho1wiLFxuXHQgIFwiYW9cIjogXCLqnLVcIixcblx0ICBcImF1XCI6IFwi6py3XCIsXG5cdCAgXCJhdlwiOiBcIuqcueqcu1wiLFxuXHQgIFwiYXlcIjogXCLqnL1cIixcblx0ICBcImJcIjogXCLGgMmTxoNcIixcblx0ICBcImNcIjogXCLqnL/GiMi84oaEXCIsXG5cdCAgXCJkXCI6IFwixJHJl8mW4bSFxozqrrfUgcmmXCIsXG5cdCAgXCJlXCI6IFwiyZvHneG0h8mHXCIsXG5cdCAgXCJmXCI6IFwi6p28xpJcIixcblx0ICBcImdcIjogXCLHpcmg6p6h4bW56p2/yaJcIixcblx0ICBcImhcIjogXCLEp+KxqOKxtsmlXCIsXG5cdCAgXCJpXCI6IFwiyajEsVwiLFxuXHQgIFwialwiOiBcIsmJyLdcIixcblx0ICBcImtcIjogXCLGmeKxquqdgeqdg+qdheqeo1wiLFxuXHQgIFwibFwiOiBcIsWCxprJq+Kxoeqdieqdh+qegcmtXCIsXG5cdCAgXCJtXCI6IFwiybHJr8+7XCIsXG5cdCAgXCJuXCI6IFwi6p6lxp7JsuqekeG0jtC71IlcIixcblx0ICBcIm9cIjogXCLDuMe/yZTJteqdi+qdjeG0kVwiLFxuXHQgIFwib2VcIjogXCLFk1wiLFxuXHQgIFwib2lcIjogXCLGo1wiLFxuXHQgIFwib29cIjogXCLqnY9cIixcblx0ICBcIm91XCI6IFwiyKNcIixcblx0ICBcInBcIjogXCLGpeG1veqdkeqdk+qdlc+BXCIsXG5cdCAgXCJxXCI6IFwi6p2X6p2ZyYtcIixcblx0ICBcInJcIjogXCLJjcm96p2b6p6n6p6DXCIsXG5cdCAgXCJzXCI6IFwiw5/Iv+qeqeqehcqCXCIsXG5cdCAgXCJ0XCI6IFwixafGrcqI4rGm6p6HXCIsXG5cdCAgXCJ0aFwiOiBcIsO+XCIsXG5cdCAgXCJ0elwiOiBcIuqcqVwiLFxuXHQgIFwidVwiOiBcIsqJXCIsXG5cdCAgXCJ2XCI6IFwiyovqnZ/KjFwiLFxuXHQgIFwidnlcIjogXCLqnaFcIixcblx0ICBcIndcIjogXCLisbNcIixcblx0ICBcInlcIjogXCLGtMmP4bu/XCIsXG5cdCAgXCJ6XCI6IFwixrbIpcmA4rGs6p2jXCIsXG5cdCAgXCJodlwiOiBcIsaVXCJcblx0fTtcblxuXHRmb3IgKGxldCBsYXRpbiBpbiBsYXRpbl9jb25kZW5zZWQpIHtcblx0ICBsZXQgdW5pY29kZSA9IGxhdGluX2NvbmRlbnNlZFtsYXRpbl0gfHwgJyc7XG5cblx0ICBmb3IgKGxldCBpID0gMDsgaSA8IHVuaWNvZGUubGVuZ3RoOyBpKyspIHtcblx0ICAgIGxldCBjaGFyID0gdW5pY29kZS5zdWJzdHJpbmcoaSwgaSArIDEpO1xuXHQgICAgbGF0aW5fY29udmVydFtjaGFyXSA9IGxhdGluO1xuXHQgIH1cblx0fVxuXG5cdGNvbnN0IGNvbnZlcnRfcGF0ID0gbmV3IFJlZ0V4cChPYmplY3Qua2V5cyhsYXRpbl9jb252ZXJ0KS5qb2luKCd8JykgKyAnfCcgKyBhY2NlbnRfcGF0LCAnZ3UnKTtcblx0LyoqXG5cdCAqIEluaXRpYWxpemUgdGhlIHVuaWNvZGVfbWFwIGZyb20gdGhlIGdpdmUgY29kZSBwb2ludCByYW5nZXNcblx0ICpcblx0ICogQHBhcmFtIHtUQ29kZVBvaW50cz19IF9jb2RlX3BvaW50c1xuXHQgKi9cblxuXHRjb25zdCBpbml0aWFsaXplID0gX2NvZGVfcG9pbnRzID0+IHtcblx0ICBpZiAodW5pY29kZV9tYXAgIT09IHVuZGVmaW5lZCkgcmV0dXJuO1xuXHQgIHVuaWNvZGVfbWFwID0gZ2VuZXJhdGVNYXAoX2NvZGVfcG9pbnRzIHx8IGNvZGVfcG9pbnRzKTtcblx0fTtcblx0LyoqXG5cdCAqIEhlbHBlciBtZXRob2QgZm9yIG5vcm1hbGl6ZSBhIHN0cmluZ1xuXHQgKiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9TdHJpbmcvbm9ybWFsaXplXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBzdHJcblx0ICogQHBhcmFtIHtzdHJpbmd9IGZvcm1cblx0ICovXG5cblx0Y29uc3Qgbm9ybWFsaXplID0gKHN0ciwgZm9ybSA9ICdORktEJykgPT4gc3RyLm5vcm1hbGl6ZShmb3JtKTtcblx0LyoqXG5cdCAqIFJlbW92ZSBhY2NlbnRzIHdpdGhvdXQgcmVvcmRlcmluZyBzdHJpbmdcblx0ICogY2FsbGluZyBzdHIubm9ybWFsaXplKCdORktEJykgb24gXFx1ezU5NH1cXHV7NTk1fVxcdXs1OTZ9IGJlY29tZXMgXFx1ezU5Nn1cXHV7NTk0fVxcdXs1OTV9XG5cdCAqIHZpYSBodHRwczovL2dpdGh1Yi5jb20va3Jpc2svRnVzZS9pc3N1ZXMvMTMzI2lzc3VlY29tbWVudC0zMTg2OTI3MDNcblx0ICogQHBhcmFtIHtzdHJpbmd9IHN0clxuXHQgKiBAcmV0dXJuIHtzdHJpbmd9XG5cdCAqL1xuXG5cdGNvbnN0IGFzY2lpZm9sZCA9IHN0ciA9PiB7XG5cdCAgcmV0dXJuIHRvQXJyYXkoc3RyKS5yZWR1Y2UoXG5cdCAgLyoqXG5cdCAgICogQHBhcmFtIHtzdHJpbmd9IHJlc3VsdFxuXHQgICAqIEBwYXJhbSB7c3RyaW5nfSBjaGFyXG5cdCAgICovXG5cdCAgKHJlc3VsdCwgY2hhcikgPT4ge1xuXHQgICAgcmV0dXJuIHJlc3VsdCArIF9hc2NpaWZvbGQoY2hhcik7XG5cdCAgfSwgJycpO1xuXHR9O1xuXHQvKipcblx0ICogQHBhcmFtIHtzdHJpbmd9IHN0clxuXHQgKiBAcmV0dXJuIHtzdHJpbmd9XG5cdCAqL1xuXG5cdGNvbnN0IF9hc2NpaWZvbGQgPSBzdHIgPT4ge1xuXHQgIHN0ciA9IG5vcm1hbGl6ZShzdHIpLnRvTG93ZXJDYXNlKCkucmVwbGFjZShjb252ZXJ0X3BhdCwgKFxuXHQgIC8qKiBAdHlwZSB7c3RyaW5nfSAqL1xuXHQgIGNoYXIpID0+IHtcblx0ICAgIHJldHVybiBsYXRpbl9jb252ZXJ0W2NoYXJdIHx8ICcnO1xuXHQgIH0pOyAvL3JldHVybiBzdHI7XG5cblx0ICByZXR1cm4gbm9ybWFsaXplKHN0ciwgJ05GQycpO1xuXHR9O1xuXHQvKipcblx0ICogR2VuZXJhdGUgYSBsaXN0IG9mIHVuaWNvZGUgdmFyaWFudHMgZnJvbSB0aGUgbGlzdCBvZiBjb2RlIHBvaW50c1xuXHQgKiBAcGFyYW0ge1RDb2RlUG9pbnRzfSBjb2RlX3BvaW50c1xuXHQgKiBAeWllbGQge1RDb2RlUG9pbnRPYmp9XG5cdCAqL1xuXG5cdGZ1bmN0aW9uKiBnZW5lcmF0b3IoY29kZV9wb2ludHMpIHtcblx0ICBmb3IgKGNvbnN0IFtjb2RlX3BvaW50X21pbiwgY29kZV9wb2ludF9tYXhdIG9mIGNvZGVfcG9pbnRzKSB7XG5cdCAgICBmb3IgKGxldCBpID0gY29kZV9wb2ludF9taW47IGkgPD0gY29kZV9wb2ludF9tYXg7IGkrKykge1xuXHQgICAgICBsZXQgY29tcG9zZWQgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGkpO1xuXHQgICAgICBsZXQgZm9sZGVkID0gYXNjaWlmb2xkKGNvbXBvc2VkKTtcblxuXHQgICAgICBpZiAoZm9sZGVkID09IGNvbXBvc2VkLnRvTG93ZXJDYXNlKCkpIHtcblx0ICAgICAgICBjb250aW51ZTtcblx0ICAgICAgfSAvLyBza2lwIHdoZW4gZm9sZGVkIGlzIGEgc3RyaW5nIGxvbmdlciB0aGFuIDMgY2hhcmFjdGVycyBsb25nXG5cdCAgICAgIC8vIGJjIHRoZSByZXN1bHRpbmcgcmVnZXggcGF0dGVybnMgd2lsbCBiZSBsb25nXG5cdCAgICAgIC8vIGVnOlxuXHQgICAgICAvLyBmb2xkZWQg2LXZhNmJINin2YTZhNmHINi52YTZitmHINmI2LPZhNmFIGxlbmd0aCAxOCBjb2RlIHBvaW50IDY1MDE4XG5cdCAgICAgIC8vIGZvbGRlZCDYrNmEINis2YTYp9mE2YcgbGVuZ3RoIDggY29kZSBwb2ludCA2NTAxOVxuXG5cblx0ICAgICAgaWYgKGZvbGRlZC5sZW5ndGggPiBtYXhfY2hhcl9sZW5ndGgpIHtcblx0ICAgICAgICBjb250aW51ZTtcblx0ICAgICAgfVxuXG5cdCAgICAgIGlmIChmb2xkZWQubGVuZ3RoID09IDApIHtcblx0ICAgICAgICBjb250aW51ZTtcblx0ICAgICAgfVxuXG5cdCAgICAgIHlpZWxkIHtcblx0ICAgICAgICBmb2xkZWQ6IGZvbGRlZCxcblx0ICAgICAgICBjb21wb3NlZDogY29tcG9zZWQsXG5cdCAgICAgICAgY29kZV9wb2ludDogaVxuXHQgICAgICB9O1xuXHQgICAgfVxuXHQgIH1cblx0fVxuXHQvKipcblx0ICogR2VuZXJhdGUgYSB1bmljb2RlIG1hcCBmcm9tIHRoZSBsaXN0IG9mIGNvZGUgcG9pbnRzXG5cdCAqIEBwYXJhbSB7VENvZGVQb2ludHN9IGNvZGVfcG9pbnRzXG5cdCAqIEByZXR1cm4ge1RVbmljb2RlU2V0c31cblx0ICovXG5cblx0Y29uc3QgZ2VuZXJhdGVTZXRzID0gY29kZV9wb2ludHMgPT4ge1xuXHQgIC8qKiBAdHlwZSB7e1trZXk6c3RyaW5nXTpTZXQ8c3RyaW5nPn19ICovXG5cdCAgY29uc3QgdW5pY29kZV9zZXRzID0ge307XG5cdCAgLyoqXG5cdCAgICogQHBhcmFtIHtzdHJpbmd9IGZvbGRlZFxuXHQgICAqIEBwYXJhbSB7c3RyaW5nfSB0b19hZGRcblx0ICAgKi9cblxuXHQgIGNvbnN0IGFkZE1hdGNoaW5nID0gKGZvbGRlZCwgdG9fYWRkKSA9PiB7XG5cdCAgICAvKiogQHR5cGUge1NldDxzdHJpbmc+fSAqL1xuXHQgICAgY29uc3QgZm9sZGVkX3NldCA9IHVuaWNvZGVfc2V0c1tmb2xkZWRdIHx8IG5ldyBTZXQoKTtcblx0ICAgIGNvbnN0IHBhdHQgPSBuZXcgUmVnRXhwKCdeJyArIHNldFRvUGF0dGVybihmb2xkZWRfc2V0KSArICckJywgJ2l1Jyk7XG5cblx0ICAgIGlmICh0b19hZGQubWF0Y2gocGF0dCkpIHtcblx0ICAgICAgcmV0dXJuO1xuXHQgICAgfVxuXG5cdCAgICBmb2xkZWRfc2V0LmFkZChlc2NhcGVfcmVnZXgodG9fYWRkKSk7XG5cdCAgICB1bmljb2RlX3NldHNbZm9sZGVkXSA9IGZvbGRlZF9zZXQ7XG5cdCAgfTtcblxuXHQgIGZvciAobGV0IHZhbHVlIG9mIGdlbmVyYXRvcihjb2RlX3BvaW50cykpIHtcblx0ICAgIGFkZE1hdGNoaW5nKHZhbHVlLmZvbGRlZCwgdmFsdWUuZm9sZGVkKTtcblx0ICAgIGFkZE1hdGNoaW5nKHZhbHVlLmZvbGRlZCwgdmFsdWUuY29tcG9zZWQpO1xuXHQgIH1cblxuXHQgIHJldHVybiB1bmljb2RlX3NldHM7XG5cdH07XG5cdC8qKlxuXHQgKiBHZW5lcmF0ZSBhIHVuaWNvZGUgbWFwIGZyb20gdGhlIGxpc3Qgb2YgY29kZSBwb2ludHNcblx0ICogYWUgPT4gKD86KD86YWV8w4Z8x7x8x6IpfCg/OkF84pK2fO+8oS4uLikoPzpFfMmbfOKSui4uLikpXG5cdCAqXG5cdCAqIEBwYXJhbSB7VENvZGVQb2ludHN9IGNvZGVfcG9pbnRzXG5cdCAqIEByZXR1cm4ge1RVbmljb2RlTWFwfVxuXHQgKi9cblxuXHRjb25zdCBnZW5lcmF0ZU1hcCA9IGNvZGVfcG9pbnRzID0+IHtcblx0ICAvKiogQHR5cGUge1RVbmljb2RlU2V0c30gKi9cblx0ICBjb25zdCB1bmljb2RlX3NldHMgPSBnZW5lcmF0ZVNldHMoY29kZV9wb2ludHMpO1xuXHQgIC8qKiBAdHlwZSB7VFVuaWNvZGVNYXB9ICovXG5cblx0ICBjb25zdCB1bmljb2RlX21hcCA9IHt9O1xuXHQgIC8qKiBAdHlwZSB7c3RyaW5nW119ICovXG5cblx0ICBsZXQgbXVsdGlfY2hhciA9IFtdO1xuXG5cdCAgZm9yIChsZXQgZm9sZGVkIGluIHVuaWNvZGVfc2V0cykge1xuXHQgICAgbGV0IHNldCA9IHVuaWNvZGVfc2V0c1tmb2xkZWRdO1xuXG5cdCAgICBpZiAoc2V0KSB7XG5cdCAgICAgIHVuaWNvZGVfbWFwW2ZvbGRlZF0gPSBzZXRUb1BhdHRlcm4oc2V0KTtcblx0ICAgIH1cblxuXHQgICAgaWYgKGZvbGRlZC5sZW5ndGggPiAxKSB7XG5cdCAgICAgIG11bHRpX2NoYXIucHVzaChlc2NhcGVfcmVnZXgoZm9sZGVkKSk7XG5cdCAgICB9XG5cdCAgfVxuXG5cdCAgbXVsdGlfY2hhci5zb3J0KChhLCBiKSA9PiBiLmxlbmd0aCAtIGEubGVuZ3RoKTtcblx0ICBjb25zdCBtdWx0aV9jaGFyX3BhdHQgPSBhcnJheVRvUGF0dGVybihtdWx0aV9jaGFyKTtcblx0ICBtdWx0aV9jaGFyX3JlZyA9IG5ldyBSZWdFeHAoJ14nICsgbXVsdGlfY2hhcl9wYXR0LCAndScpO1xuXHQgIHJldHVybiB1bmljb2RlX21hcDtcblx0fTtcblx0LyoqXG5cdCAqIE1hcCBlYWNoIGVsZW1lbnQgb2YgYW4gYXJyYXkgZnJvbSBpdCdzIGZvbGRlZCB2YWx1ZSB0byBhbGwgcG9zc2libGUgdW5pY29kZSBtYXRjaGVzXG5cdCAqIEBwYXJhbSB7c3RyaW5nW119IHN0cmluZ3Ncblx0ICogQHBhcmFtIHtudW1iZXJ9IG1pbl9yZXBsYWNlbWVudFxuXHQgKiBAcmV0dXJuIHtzdHJpbmd9XG5cdCAqL1xuXG5cdGNvbnN0IG1hcFNlcXVlbmNlID0gKHN0cmluZ3MsIG1pbl9yZXBsYWNlbWVudCA9IDEpID0+IHtcblx0ICBsZXQgY2hhcnNfcmVwbGFjZWQgPSAwO1xuXHQgIHN0cmluZ3MgPSBzdHJpbmdzLm1hcChzdHIgPT4ge1xuXHQgICAgaWYgKHVuaWNvZGVfbWFwW3N0cl0pIHtcblx0ICAgICAgY2hhcnNfcmVwbGFjZWQgKz0gc3RyLmxlbmd0aDtcblx0ICAgIH1cblxuXHQgICAgcmV0dXJuIHVuaWNvZGVfbWFwW3N0cl0gfHwgc3RyO1xuXHQgIH0pO1xuXG5cdCAgaWYgKGNoYXJzX3JlcGxhY2VkID49IG1pbl9yZXBsYWNlbWVudCkge1xuXHQgICAgcmV0dXJuIHNlcXVlbmNlUGF0dGVybihzdHJpbmdzKTtcblx0ICB9XG5cblx0ICByZXR1cm4gJyc7XG5cdH07XG5cdC8qKlxuXHQgKiBDb252ZXJ0IGEgc2hvcnQgc3RyaW5nIGFuZCBzcGxpdCBpdCBpbnRvIGFsbCBwb3NzaWJsZSBwYXR0ZXJuc1xuXHQgKiBLZWVwIGEgcGF0dGVybiBvbmx5IGlmIG1pbl9yZXBsYWNlbWVudCBpcyBtZXRcblx0ICpcblx0ICogJ2FiYydcblx0ICogXHRcdD0+IFtbJ2FiYyddLFsnYWInLCdjJ10sWydhJywnYmMnXSxbJ2EnLCdiJywnYyddXVxuXHQgKlx0XHQ9PiBbJ2FiYy1wYXR0ZXJuJywnYWItYy1wYXR0ZXJuJy4uLl1cblx0ICpcblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IHN0clxuXHQgKiBAcGFyYW0ge251bWJlcn0gbWluX3JlcGxhY2VtZW50XG5cdCAqIEByZXR1cm4ge3N0cmluZ31cblx0ICovXG5cblx0Y29uc3Qgc3Vic3RyaW5nc1RvUGF0dGVybiA9IChzdHIsIG1pbl9yZXBsYWNlbWVudCA9IDEpID0+IHtcblx0ICBtaW5fcmVwbGFjZW1lbnQgPSBNYXRoLm1heChtaW5fcmVwbGFjZW1lbnQsIHN0ci5sZW5ndGggLSAxKTtcblx0ICByZXR1cm4gYXJyYXlUb1BhdHRlcm4oYWxsU3Vic3RyaW5ncyhzdHIpLm1hcChzdWJfcGF0ID0+IHtcblx0ICAgIHJldHVybiBtYXBTZXF1ZW5jZShzdWJfcGF0LCBtaW5fcmVwbGFjZW1lbnQpO1xuXHQgIH0pKTtcblx0fTtcblx0LyoqXG5cdCAqIENvbnZlcnQgYW4gYXJyYXkgb2Ygc2VxdWVuY2VzIGludG8gYSBwYXR0ZXJuXG5cdCAqIFt7c3RhcnQ6MCxlbmQ6MyxsZW5ndGg6MyxzdWJzdHI6J2lpaSd9Li4uXSA9PiAoPzppaWkuLi4pXG5cdCAqXG5cdCAqIEBwYXJhbSB7U2VxdWVuY2VbXX0gc2VxdWVuY2VzXG5cdCAqIEBwYXJhbSB7Ym9vbGVhbn0gYWxsXG5cdCAqL1xuXG5cdGNvbnN0IHNlcXVlbmNlc1RvUGF0dGVybiA9IChzZXF1ZW5jZXMsIGFsbCA9IHRydWUpID0+IHtcblx0ICBsZXQgbWluX3JlcGxhY2VtZW50ID0gc2VxdWVuY2VzLmxlbmd0aCA+IDEgPyAxIDogMDtcblx0ICByZXR1cm4gYXJyYXlUb1BhdHRlcm4oc2VxdWVuY2VzLm1hcChzZXF1ZW5jZSA9PiB7XG5cdCAgICBsZXQgc2VxID0gW107XG5cdCAgICBjb25zdCBsZW4gPSBhbGwgPyBzZXF1ZW5jZS5sZW5ndGgoKSA6IHNlcXVlbmNlLmxlbmd0aCgpIC0gMTtcblxuXHQgICAgZm9yIChsZXQgaiA9IDA7IGogPCBsZW47IGorKykge1xuXHQgICAgICBzZXEucHVzaChzdWJzdHJpbmdzVG9QYXR0ZXJuKHNlcXVlbmNlLnN1YnN0cnNbal0gfHwgJycsIG1pbl9yZXBsYWNlbWVudCkpO1xuXHQgICAgfVxuXG5cdCAgICByZXR1cm4gc2VxdWVuY2VQYXR0ZXJuKHNlcSk7XG5cdCAgfSkpO1xuXHR9O1xuXHQvKipcblx0ICogUmV0dXJuIHRydWUgaWYgdGhlIHNlcXVlbmNlIGlzIGFscmVhZHkgaW4gdGhlIHNlcXVlbmNlc1xuXHQgKiBAcGFyYW0ge1NlcXVlbmNlfSBuZWVkbGVfc2VxXG5cdCAqIEBwYXJhbSB7U2VxdWVuY2VbXX0gc2VxdWVuY2VzXG5cdCAqL1xuXG5cblx0Y29uc3QgaW5TZXF1ZW5jZXMgPSAobmVlZGxlX3NlcSwgc2VxdWVuY2VzKSA9PiB7XG5cdCAgZm9yIChjb25zdCBzZXEgb2Ygc2VxdWVuY2VzKSB7XG5cdCAgICBpZiAoc2VxLnN0YXJ0ICE9IG5lZWRsZV9zZXEuc3RhcnQgfHwgc2VxLmVuZCAhPSBuZWVkbGVfc2VxLmVuZCkge1xuXHQgICAgICBjb250aW51ZTtcblx0ICAgIH1cblxuXHQgICAgaWYgKHNlcS5zdWJzdHJzLmpvaW4oJycpICE9PSBuZWVkbGVfc2VxLnN1YnN0cnMuam9pbignJykpIHtcblx0ICAgICAgY29udGludWU7XG5cdCAgICB9XG5cblx0ICAgIGxldCBuZWVkbGVfcGFydHMgPSBuZWVkbGVfc2VxLnBhcnRzO1xuXHQgICAgLyoqXG5cdCAgICAgKiBAcGFyYW0ge1RTZXF1ZW5jZVBhcnR9IHBhcnRcblx0ICAgICAqL1xuXG5cdCAgICBjb25zdCBmaWx0ZXIgPSBwYXJ0ID0+IHtcblx0ICAgICAgZm9yIChjb25zdCBuZWVkbGVfcGFydCBvZiBuZWVkbGVfcGFydHMpIHtcblx0ICAgICAgICBpZiAobmVlZGxlX3BhcnQuc3RhcnQgPT09IHBhcnQuc3RhcnQgJiYgbmVlZGxlX3BhcnQuc3Vic3RyID09PSBwYXJ0LnN1YnN0cikge1xuXHQgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIGlmIChwYXJ0Lmxlbmd0aCA9PSAxIHx8IG5lZWRsZV9wYXJ0Lmxlbmd0aCA9PSAxKSB7XG5cdCAgICAgICAgICBjb250aW51ZTtcblx0ICAgICAgICB9IC8vIGNoZWNrIGZvciBvdmVybGFwcGluZyBwYXJ0c1xuXHQgICAgICAgIC8vIGEgPSBbJzo6PScsJz09J11cblx0ICAgICAgICAvLyBiID0gWyc6OicsJz09PSddXG5cdCAgICAgICAgLy8gYSA9IFsncicsJ3NtJ11cblx0ICAgICAgICAvLyBiID0gWydycycsJ20nXVxuXG5cblx0ICAgICAgICBpZiAocGFydC5zdGFydCA8IG5lZWRsZV9wYXJ0LnN0YXJ0ICYmIHBhcnQuZW5kID4gbmVlZGxlX3BhcnQuc3RhcnQpIHtcblx0ICAgICAgICAgIHJldHVybiB0cnVlO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIGlmIChuZWVkbGVfcGFydC5zdGFydCA8IHBhcnQuc3RhcnQgJiYgbmVlZGxlX3BhcnQuZW5kID4gcGFydC5zdGFydCkge1xuXHQgICAgICAgICAgcmV0dXJuIHRydWU7XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cblx0ICAgICAgcmV0dXJuIGZhbHNlO1xuXHQgICAgfTtcblxuXHQgICAgbGV0IGZpbHRlcmVkID0gc2VxLnBhcnRzLmZpbHRlcihmaWx0ZXIpO1xuXG5cdCAgICBpZiAoZmlsdGVyZWQubGVuZ3RoID4gMCkge1xuXHQgICAgICBjb250aW51ZTtcblx0ICAgIH1cblxuXHQgICAgcmV0dXJuIHRydWU7XG5cdCAgfVxuXG5cdCAgcmV0dXJuIGZhbHNlO1xuXHR9O1xuXG5cdGNsYXNzIFNlcXVlbmNlIHtcblx0ICBjb25zdHJ1Y3RvcigpIHtcblx0ICAgIC8qKiBAdHlwZSB7VFNlcXVlbmNlUGFydFtdfSAqL1xuXHQgICAgdGhpcy5wYXJ0cyA9IFtdO1xuXHQgICAgLyoqIEB0eXBlIHtzdHJpbmdbXX0gKi9cblxuXHQgICAgdGhpcy5zdWJzdHJzID0gW107XG5cdCAgICB0aGlzLnN0YXJ0ID0gMDtcblx0ICAgIHRoaXMuZW5kID0gMDtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogQHBhcmFtIHtUU2VxdWVuY2VQYXJ0fHVuZGVmaW5lZH0gcGFydFxuXHQgICAqL1xuXG5cblx0ICBhZGQocGFydCkge1xuXHQgICAgaWYgKHBhcnQpIHtcblx0ICAgICAgdGhpcy5wYXJ0cy5wdXNoKHBhcnQpO1xuXHQgICAgICB0aGlzLnN1YnN0cnMucHVzaChwYXJ0LnN1YnN0cik7XG5cdCAgICAgIHRoaXMuc3RhcnQgPSBNYXRoLm1pbihwYXJ0LnN0YXJ0LCB0aGlzLnN0YXJ0KTtcblx0ICAgICAgdGhpcy5lbmQgPSBNYXRoLm1heChwYXJ0LmVuZCwgdGhpcy5lbmQpO1xuXHQgICAgfVxuXHQgIH1cblxuXHQgIGxhc3QoKSB7XG5cdCAgICByZXR1cm4gdGhpcy5wYXJ0c1t0aGlzLnBhcnRzLmxlbmd0aCAtIDFdO1xuXHQgIH1cblxuXHQgIGxlbmd0aCgpIHtcblx0ICAgIHJldHVybiB0aGlzLnBhcnRzLmxlbmd0aDtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogQHBhcmFtIHtudW1iZXJ9IHBvc2l0aW9uXG5cdCAgICogQHBhcmFtIHtUU2VxdWVuY2VQYXJ0fSBsYXN0X3BpZWNlXG5cdCAgICovXG5cblxuXHQgIGNsb25lKHBvc2l0aW9uLCBsYXN0X3BpZWNlKSB7XG5cdCAgICBsZXQgY2xvbmUgPSBuZXcgU2VxdWVuY2UoKTtcblx0ICAgIGxldCBwYXJ0cyA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkodGhpcy5wYXJ0cykpO1xuXHQgICAgbGV0IGxhc3RfcGFydCA9IHBhcnRzLnBvcCgpO1xuXG5cdCAgICBmb3IgKGNvbnN0IHBhcnQgb2YgcGFydHMpIHtcblx0ICAgICAgY2xvbmUuYWRkKHBhcnQpO1xuXHQgICAgfVxuXG5cdCAgICBsZXQgbGFzdF9zdWJzdHIgPSBsYXN0X3BpZWNlLnN1YnN0ci5zdWJzdHJpbmcoMCwgcG9zaXRpb24gLSBsYXN0X3BhcnQuc3RhcnQpO1xuXHQgICAgbGV0IGNsb25lX2xhc3RfbGVuID0gbGFzdF9zdWJzdHIubGVuZ3RoO1xuXHQgICAgY2xvbmUuYWRkKHtcblx0ICAgICAgc3RhcnQ6IGxhc3RfcGFydC5zdGFydCxcblx0ICAgICAgZW5kOiBsYXN0X3BhcnQuc3RhcnQgKyBjbG9uZV9sYXN0X2xlbixcblx0ICAgICAgbGVuZ3RoOiBjbG9uZV9sYXN0X2xlbixcblx0ICAgICAgc3Vic3RyOiBsYXN0X3N1YnN0clxuXHQgICAgfSk7XG5cdCAgICByZXR1cm4gY2xvbmU7XG5cdCAgfVxuXG5cdH1cblx0LyoqXG5cdCAqIEV4cGFuZCBhIHJlZ3VsYXIgZXhwcmVzc2lvbiBwYXR0ZXJuIHRvIGluY2x1ZGUgdW5pY29kZSB2YXJpYW50c1xuXHQgKiBcdGVnIC9hLyBiZWNvbWVzIC9h4pOQ772B4bqaw6DDocOi4bqn4bql4bqr4bqpw6PEgcSD4bqx4bqv4bq14bqzyKfHocOkx5/huqPDpce7x47IgciD4bqh4bqt4bq34biBxIXisaXJkMmRQeKStu+8ocOAw4HDguG6puG6pOG6quG6qMODxIDEguG6sOG6ruG6tOG6ssimx6DDhMee4bqiw4XHuseNyIDIguG6oOG6rOG6tuG4gMSEyLrisa8vXG5cdCAqXG5cdCAqIElzc3VlOlxuXHQgKiAg77qK77qLIFsgJ++6iiA9IFxcXFx1e2ZlOGF9JywgJ++6iyA9IFxcXFx1e2ZlOGJ9JyBdXG5cdCAqXHRiZWNvbWVzOlx02YrZlNmK2ZQgWyAn2YogPSBcXFxcdXs2NGF9JywgJ9mUID0gXFxcXHV7NjU0fScsICfZiiA9IFxcXFx1ezY0YX0nLCAn2ZQgPSBcXFxcdXs2NTR9JyBdXG5cdCAqXG5cdCAqXHTEsMSyID0gSUlKID0g4oWhSlxuXHQgKlxuXHQgKiBcdDEvMi80XG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBzdHJcblx0ICogQHJldHVybiB7c3RyaW5nfHVuZGVmaW5lZH1cblx0ICovXG5cblxuXHRjb25zdCBnZXRQYXR0ZXJuID0gc3RyID0+IHtcblx0ICBpbml0aWFsaXplKCk7XG5cdCAgc3RyID0gYXNjaWlmb2xkKHN0cik7XG5cdCAgbGV0IHBhdHRlcm4gPSAnJztcblx0ICBsZXQgc2VxdWVuY2VzID0gW25ldyBTZXF1ZW5jZSgpXTtcblxuXHQgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XG5cdCAgICBsZXQgc3Vic3RyID0gc3RyLnN1YnN0cmluZyhpKTtcblx0ICAgIGxldCBtYXRjaCA9IHN1YnN0ci5tYXRjaChtdWx0aV9jaGFyX3JlZyk7XG5cdCAgICBjb25zdCBjaGFyID0gc3RyLnN1YnN0cmluZyhpLCBpICsgMSk7XG5cdCAgICBjb25zdCBtYXRjaF9zdHIgPSBtYXRjaCA/IG1hdGNoWzBdIDogbnVsbDsgLy8gbG9vcCB0aHJvdWdoIHNlcXVlbmNlc1xuXHQgICAgLy8gYWRkIGVpdGhlciB0aGUgY2hhciBvciBtdWx0aV9tYXRjaFxuXG5cdCAgICBsZXQgb3ZlcmxhcHBpbmcgPSBbXTtcblx0ICAgIGxldCBhZGRlZF90eXBlcyA9IG5ldyBTZXQoKTtcblxuXHQgICAgZm9yIChjb25zdCBzZXF1ZW5jZSBvZiBzZXF1ZW5jZXMpIHtcblx0ICAgICAgY29uc3QgbGFzdF9waWVjZSA9IHNlcXVlbmNlLmxhc3QoKTtcblxuXHQgICAgICBpZiAoIWxhc3RfcGllY2UgfHwgbGFzdF9waWVjZS5sZW5ndGggPT0gMSB8fCBsYXN0X3BpZWNlLmVuZCA8PSBpKSB7XG5cdCAgICAgICAgLy8gaWYgd2UgaGF2ZSBhIG11bHRpIG1hdGNoXG5cdCAgICAgICAgaWYgKG1hdGNoX3N0cikge1xuXHQgICAgICAgICAgY29uc3QgbGVuID0gbWF0Y2hfc3RyLmxlbmd0aDtcblx0ICAgICAgICAgIHNlcXVlbmNlLmFkZCh7XG5cdCAgICAgICAgICAgIHN0YXJ0OiBpLFxuXHQgICAgICAgICAgICBlbmQ6IGkgKyBsZW4sXG5cdCAgICAgICAgICAgIGxlbmd0aDogbGVuLFxuXHQgICAgICAgICAgICBzdWJzdHI6IG1hdGNoX3N0clxuXHQgICAgICAgICAgfSk7XG5cdCAgICAgICAgICBhZGRlZF90eXBlcy5hZGQoJzEnKTtcblx0ICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgc2VxdWVuY2UuYWRkKHtcblx0ICAgICAgICAgICAgc3RhcnQ6IGksXG5cdCAgICAgICAgICAgIGVuZDogaSArIDEsXG5cdCAgICAgICAgICAgIGxlbmd0aDogMSxcblx0ICAgICAgICAgICAgc3Vic3RyOiBjaGFyXG5cdCAgICAgICAgICB9KTtcblx0ICAgICAgICAgIGFkZGVkX3R5cGVzLmFkZCgnMicpO1xuXHQgICAgICAgIH1cblx0ICAgICAgfSBlbHNlIGlmIChtYXRjaF9zdHIpIHtcblx0ICAgICAgICBsZXQgY2xvbmUgPSBzZXF1ZW5jZS5jbG9uZShpLCBsYXN0X3BpZWNlKTtcblx0ICAgICAgICBjb25zdCBsZW4gPSBtYXRjaF9zdHIubGVuZ3RoO1xuXHQgICAgICAgIGNsb25lLmFkZCh7XG5cdCAgICAgICAgICBzdGFydDogaSxcblx0ICAgICAgICAgIGVuZDogaSArIGxlbixcblx0ICAgICAgICAgIGxlbmd0aDogbGVuLFxuXHQgICAgICAgICAgc3Vic3RyOiBtYXRjaF9zdHJcblx0ICAgICAgICB9KTtcblx0ICAgICAgICBvdmVybGFwcGluZy5wdXNoKGNsb25lKTtcblx0ICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAvLyBkb24ndCBhZGQgY2hhclxuXHQgICAgICAgIC8vIGFkZGluZyB3b3VsZCBjcmVhdGUgaW52YWxpZCBwYXR0ZXJuczogMjM0ID0+IFsyLDM0LDRdXG5cdCAgICAgICAgYWRkZWRfdHlwZXMuYWRkKCczJyk7XG5cdCAgICAgIH1cblx0ICAgIH0gLy8gaWYgd2UgaGF2ZSBvdmVybGFwcGluZ1xuXG5cblx0ICAgIGlmIChvdmVybGFwcGluZy5sZW5ndGggPiAwKSB7XG5cdCAgICAgIC8vIFsnaWknLCdpaWknXSBiZWZvcmUgWydpJywnaScsJ2lpaSddXG5cdCAgICAgIG92ZXJsYXBwaW5nID0gb3ZlcmxhcHBpbmcuc29ydCgoYSwgYikgPT4ge1xuXHQgICAgICAgIHJldHVybiBhLmxlbmd0aCgpIC0gYi5sZW5ndGgoKTtcblx0ICAgICAgfSk7XG5cblx0ICAgICAgZm9yIChsZXQgY2xvbmUgb2Ygb3ZlcmxhcHBpbmcpIHtcblx0ICAgICAgICAvLyBkb24ndCBhZGQgaWYgd2UgYWxyZWFkeSBoYXZlIGFuIGVxdWl2YWxlbnQgc2VxdWVuY2Vcblx0ICAgICAgICBpZiAoaW5TZXF1ZW5jZXMoY2xvbmUsIHNlcXVlbmNlcykpIHtcblx0ICAgICAgICAgIGNvbnRpbnVlO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHNlcXVlbmNlcy5wdXNoKGNsb25lKTtcblx0ICAgICAgfVxuXG5cdCAgICAgIGNvbnRpbnVlO1xuXHQgICAgfSAvLyBpZiB3ZSBoYXZlbid0IGRvbmUgYW55dGhpbmcgdW5pcXVlXG5cdCAgICAvLyBjbGVhbiB1cCB0aGUgcGF0dGVybnNcblx0ICAgIC8vIGhlbHBzIGtlZXAgcGF0dGVybnMgc21hbGxlclxuXHQgICAgLy8gaWYgc3RyID0gJ3LigqjjjqdhYXJzcycsIHBhdHRlcm4gd2lsbCBiZSA0NDYgaW5zdGVhZCBvZiA2NTVcblxuXG5cdCAgICBpZiAoaSA+IDAgJiYgYWRkZWRfdHlwZXMuc2l6ZSA9PSAxICYmICFhZGRlZF90eXBlcy5oYXMoJzMnKSkge1xuXHQgICAgICBwYXR0ZXJuICs9IHNlcXVlbmNlc1RvUGF0dGVybihzZXF1ZW5jZXMsIGZhbHNlKTtcblx0ICAgICAgbGV0IG5ld19zZXEgPSBuZXcgU2VxdWVuY2UoKTtcblx0ICAgICAgY29uc3Qgb2xkX3NlcSA9IHNlcXVlbmNlc1swXTtcblxuXHQgICAgICBpZiAob2xkX3NlcSkge1xuXHQgICAgICAgIG5ld19zZXEuYWRkKG9sZF9zZXEubGFzdCgpKTtcblx0ICAgICAgfVxuXG5cdCAgICAgIHNlcXVlbmNlcyA9IFtuZXdfc2VxXTtcblx0ICAgIH1cblx0ICB9XG5cblx0ICBwYXR0ZXJuICs9IHNlcXVlbmNlc1RvUGF0dGVybihzZXF1ZW5jZXMsIHRydWUpO1xuXHQgIHJldHVybiBwYXR0ZXJuO1xuXHR9O1xuXG5cdC8qISBzaWZ0ZXIuanMgfCBodHRwczovL2dpdGh1Yi5jb20vb3JjaGlkanMvc2lmdGVyLmpzIHwgQXBhY2hlIExpY2Vuc2UgKHYyKSAqL1xuXG5cdC8qKlxuXHQgKiBBIHByb3BlcnR5IGdldHRlciByZXNvbHZpbmcgZG90LW5vdGF0aW9uXG5cdCAqIEBwYXJhbSAge09iamVjdH0gIG9iaiAgICAgVGhlIHJvb3Qgb2JqZWN0IHRvIGZldGNoIHByb3BlcnR5IG9uXG5cdCAqIEBwYXJhbSAge1N0cmluZ30gIG5hbWUgICAgVGhlIG9wdGlvbmFsbHkgZG90dGVkIHByb3BlcnR5IG5hbWUgdG8gZmV0Y2hcblx0ICogQHJldHVybiB7T2JqZWN0fSAgICAgICAgICBUaGUgcmVzb2x2ZWQgcHJvcGVydHkgdmFsdWVcblx0ICovXG5cdGNvbnN0IGdldEF0dHIgPSAob2JqLCBuYW1lKSA9PiB7XG5cdCAgaWYgKCFvYmopIHJldHVybjtcblx0ICByZXR1cm4gb2JqW25hbWVdO1xuXHR9O1xuXHQvKipcblx0ICogQSBwcm9wZXJ0eSBnZXR0ZXIgcmVzb2x2aW5nIGRvdC1ub3RhdGlvblxuXHQgKiBAcGFyYW0gIHtPYmplY3R9ICBvYmogICAgIFRoZSByb290IG9iamVjdCB0byBmZXRjaCBwcm9wZXJ0eSBvblxuXHQgKiBAcGFyYW0gIHtTdHJpbmd9ICBuYW1lICAgIFRoZSBvcHRpb25hbGx5IGRvdHRlZCBwcm9wZXJ0eSBuYW1lIHRvIGZldGNoXG5cdCAqIEByZXR1cm4ge09iamVjdH0gICAgICAgICAgVGhlIHJlc29sdmVkIHByb3BlcnR5IHZhbHVlXG5cdCAqL1xuXG5cdGNvbnN0IGdldEF0dHJOZXN0aW5nID0gKG9iaiwgbmFtZSkgPT4ge1xuXHQgIGlmICghb2JqKSByZXR1cm47XG5cdCAgdmFyIHBhcnQsXG5cdCAgICAgIG5hbWVzID0gbmFtZS5zcGxpdChcIi5cIik7XG5cblx0ICB3aGlsZSAoKHBhcnQgPSBuYW1lcy5zaGlmdCgpKSAmJiAob2JqID0gb2JqW3BhcnRdKSk7XG5cblx0ICByZXR1cm4gb2JqO1xuXHR9O1xuXHQvKipcblx0ICogQ2FsY3VsYXRlcyBob3cgY2xvc2Ugb2YgYSBtYXRjaCB0aGVcblx0ICogZ2l2ZW4gdmFsdWUgaXMgYWdhaW5zdCBhIHNlYXJjaCB0b2tlbi5cblx0ICpcblx0ICovXG5cblx0Y29uc3Qgc2NvcmVWYWx1ZSA9ICh2YWx1ZSwgdG9rZW4sIHdlaWdodCkgPT4ge1xuXHQgIHZhciBzY29yZSwgcG9zO1xuXHQgIGlmICghdmFsdWUpIHJldHVybiAwO1xuXHQgIHZhbHVlID0gdmFsdWUgKyAnJztcblx0ICBpZiAodG9rZW4ucmVnZXggPT0gbnVsbCkgcmV0dXJuIDA7XG5cdCAgcG9zID0gdmFsdWUuc2VhcmNoKHRva2VuLnJlZ2V4KTtcblx0ICBpZiAocG9zID09PSAtMSkgcmV0dXJuIDA7XG5cdCAgc2NvcmUgPSB0b2tlbi5zdHJpbmcubGVuZ3RoIC8gdmFsdWUubGVuZ3RoO1xuXHQgIGlmIChwb3MgPT09IDApIHNjb3JlICs9IDAuNTtcblx0ICByZXR1cm4gc2NvcmUgKiB3ZWlnaHQ7XG5cdH07XG5cdC8qKlxuXHQgKiBDYXN0IG9iamVjdCBwcm9wZXJ0eSB0byBhbiBhcnJheSBpZiBpdCBleGlzdHMgYW5kIGhhcyBhIHZhbHVlXG5cdCAqXG5cdCAqL1xuXG5cdGNvbnN0IHByb3BUb0FycmF5ID0gKG9iaiwga2V5KSA9PiB7XG5cdCAgdmFyIHZhbHVlID0gb2JqW2tleV07XG5cdCAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnZnVuY3Rpb24nKSByZXR1cm4gdmFsdWU7XG5cblx0ICBpZiAodmFsdWUgJiYgIUFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG5cdCAgICBvYmpba2V5XSA9IFt2YWx1ZV07XG5cdCAgfVxuXHR9O1xuXHQvKipcblx0ICogSXRlcmF0ZXMgb3ZlciBhcnJheXMgYW5kIGhhc2hlcy5cblx0ICpcblx0ICogYGBgXG5cdCAqIGl0ZXJhdGUodGhpcy5pdGVtcywgZnVuY3Rpb24oaXRlbSwgaWQpIHtcblx0ICogICAgLy8gaW52b2tlZCBmb3IgZWFjaCBpdGVtXG5cdCAqIH0pO1xuXHQgKiBgYGBcblx0ICpcblx0ICovXG5cblx0Y29uc3QgaXRlcmF0ZSQxID0gKG9iamVjdCwgY2FsbGJhY2spID0+IHtcblx0ICBpZiAoQXJyYXkuaXNBcnJheShvYmplY3QpKSB7XG5cdCAgICBvYmplY3QuZm9yRWFjaChjYWxsYmFjayk7XG5cdCAgfSBlbHNlIHtcblx0ICAgIGZvciAodmFyIGtleSBpbiBvYmplY3QpIHtcblx0ICAgICAgaWYgKG9iamVjdC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG5cdCAgICAgICAgY2FsbGJhY2sob2JqZWN0W2tleV0sIGtleSk7XG5cdCAgICAgIH1cblx0ICAgIH1cblx0ICB9XG5cdH07XG5cdGNvbnN0IGNtcCA9IChhLCBiKSA9PiB7XG5cdCAgaWYgKHR5cGVvZiBhID09PSAnbnVtYmVyJyAmJiB0eXBlb2YgYiA9PT0gJ251bWJlcicpIHtcblx0ICAgIHJldHVybiBhID4gYiA/IDEgOiBhIDwgYiA/IC0xIDogMDtcblx0ICB9XG5cblx0ICBhID0gYXNjaWlmb2xkKGEgKyAnJykudG9Mb3dlckNhc2UoKTtcblx0ICBiID0gYXNjaWlmb2xkKGIgKyAnJykudG9Mb3dlckNhc2UoKTtcblx0ICBpZiAoYSA+IGIpIHJldHVybiAxO1xuXHQgIGlmIChiID4gYSkgcmV0dXJuIC0xO1xuXHQgIHJldHVybiAwO1xuXHR9O1xuXG5cdC8qISBzaWZ0ZXIuanMgfCBodHRwczovL2dpdGh1Yi5jb20vb3JjaGlkanMvc2lmdGVyLmpzIHwgQXBhY2hlIExpY2Vuc2UgKHYyKSAqL1xuXG5cdC8qKlxuXHQgKiBzaWZ0ZXIuanNcblx0ICogQ29weXJpZ2h0IChjKSAyMDEz4oCTMjAyMCBCcmlhbiBSZWF2aXMgJiBjb250cmlidXRvcnNcblx0ICpcblx0ICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlIHRoaXNcblx0ICogZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXQ6XG5cdCAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuXHQgKlxuXHQgKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyXG5cdCAqIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0Zcblx0ICogQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlXG5cdCAqIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5cdCAqXG5cdCAqIEBhdXRob3IgQnJpYW4gUmVhdmlzIDxicmlhbkB0aGlyZHJvdXRlLmNvbT5cblx0ICovXG5cblx0Y2xhc3MgU2lmdGVyIHtcblx0ICAvLyBbXXx7fTtcblxuXHQgIC8qKlxuXHQgICAqIFRleHR1YWxseSBzZWFyY2hlcyBhcnJheXMgYW5kIGhhc2hlcyBvZiBvYmplY3RzXG5cdCAgICogYnkgcHJvcGVydHkgKG9yIG11bHRpcGxlIHByb3BlcnRpZXMpLiBEZXNpZ25lZFxuXHQgICAqIHNwZWNpZmljYWxseSBmb3IgYXV0b2NvbXBsZXRlLlxuXHQgICAqXG5cdCAgICovXG5cdCAgY29uc3RydWN0b3IoaXRlbXMsIHNldHRpbmdzKSB7XG5cdCAgICB0aGlzLml0ZW1zID0gdm9pZCAwO1xuXHQgICAgdGhpcy5zZXR0aW5ncyA9IHZvaWQgMDtcblx0ICAgIHRoaXMuaXRlbXMgPSBpdGVtcztcblx0ICAgIHRoaXMuc2V0dGluZ3MgPSBzZXR0aW5ncyB8fCB7XG5cdCAgICAgIGRpYWNyaXRpY3M6IHRydWVcblx0ICAgIH07XG5cdCAgfVxuXG5cdCAgLyoqXG5cdCAgICogU3BsaXRzIGEgc2VhcmNoIHN0cmluZyBpbnRvIGFuIGFycmF5IG9mIGluZGl2aWR1YWxcblx0ICAgKiByZWdleHBzIHRvIGJlIHVzZWQgdG8gbWF0Y2ggcmVzdWx0cy5cblx0ICAgKlxuXHQgICAqL1xuXHQgIHRva2VuaXplKHF1ZXJ5LCByZXNwZWN0X3dvcmRfYm91bmRhcmllcywgd2VpZ2h0cykge1xuXHQgICAgaWYgKCFxdWVyeSB8fCAhcXVlcnkubGVuZ3RoKSByZXR1cm4gW107XG5cdCAgICBjb25zdCB0b2tlbnMgPSBbXTtcblx0ICAgIGNvbnN0IHdvcmRzID0gcXVlcnkuc3BsaXQoL1xccysvKTtcblx0ICAgIHZhciBmaWVsZF9yZWdleDtcblxuXHQgICAgaWYgKHdlaWdodHMpIHtcblx0ICAgICAgZmllbGRfcmVnZXggPSBuZXcgUmVnRXhwKCdeKCcgKyBPYmplY3Qua2V5cyh3ZWlnaHRzKS5tYXAoZXNjYXBlX3JlZ2V4KS5qb2luKCd8JykgKyAnKVxcOiguKikkJyk7XG5cdCAgICB9XG5cblx0ICAgIHdvcmRzLmZvckVhY2god29yZCA9PiB7XG5cdCAgICAgIGxldCBmaWVsZF9tYXRjaDtcblx0ICAgICAgbGV0IGZpZWxkID0gbnVsbDtcblx0ICAgICAgbGV0IHJlZ2V4ID0gbnVsbDsgLy8gbG9vayBmb3IgXCJmaWVsZDpxdWVyeVwiIHRva2Vuc1xuXG5cdCAgICAgIGlmIChmaWVsZF9yZWdleCAmJiAoZmllbGRfbWF0Y2ggPSB3b3JkLm1hdGNoKGZpZWxkX3JlZ2V4KSkpIHtcblx0ICAgICAgICBmaWVsZCA9IGZpZWxkX21hdGNoWzFdO1xuXHQgICAgICAgIHdvcmQgPSBmaWVsZF9tYXRjaFsyXTtcblx0ICAgICAgfVxuXG5cdCAgICAgIGlmICh3b3JkLmxlbmd0aCA+IDApIHtcblx0ICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5kaWFjcml0aWNzKSB7XG5cdCAgICAgICAgICByZWdleCA9IGdldFBhdHRlcm4od29yZCkgfHwgbnVsbDtcblx0ICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgcmVnZXggPSBlc2NhcGVfcmVnZXgod29yZCk7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgaWYgKHJlZ2V4ICYmIHJlc3BlY3Rfd29yZF9ib3VuZGFyaWVzKSByZWdleCA9IFwiXFxcXGJcIiArIHJlZ2V4O1xuXHQgICAgICB9XG5cblx0ICAgICAgdG9rZW5zLnB1c2goe1xuXHQgICAgICAgIHN0cmluZzogd29yZCxcblx0ICAgICAgICByZWdleDogcmVnZXggPyBuZXcgUmVnRXhwKHJlZ2V4LCAnaXUnKSA6IG51bGwsXG5cdCAgICAgICAgZmllbGQ6IGZpZWxkXG5cdCAgICAgIH0pO1xuXHQgICAgfSk7XG5cdCAgICByZXR1cm4gdG9rZW5zO1xuXHQgIH1cblxuXHQgIC8qKlxuXHQgICAqIFJldHVybnMgYSBmdW5jdGlvbiB0byBiZSB1c2VkIHRvIHNjb3JlIGluZGl2aWR1YWwgcmVzdWx0cy5cblx0ICAgKlxuXHQgICAqIEdvb2QgbWF0Y2hlcyB3aWxsIGhhdmUgYSBoaWdoZXIgc2NvcmUgdGhhbiBwb29yIG1hdGNoZXMuXG5cdCAgICogSWYgYW4gaXRlbSBpcyBub3QgYSBtYXRjaCwgMCB3aWxsIGJlIHJldHVybmVkIGJ5IHRoZSBmdW5jdGlvbi5cblx0ICAgKlxuXHQgICAqIEByZXR1cm5zIHtULlNjb3JlRm59XG5cdCAgICovXG5cdCAgZ2V0U2NvcmVGdW5jdGlvbihxdWVyeSwgb3B0aW9ucykge1xuXHQgICAgdmFyIHNlYXJjaCA9IHRoaXMucHJlcGFyZVNlYXJjaChxdWVyeSwgb3B0aW9ucyk7XG5cdCAgICByZXR1cm4gdGhpcy5fZ2V0U2NvcmVGdW5jdGlvbihzZWFyY2gpO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBAcmV0dXJucyB7VC5TY29yZUZufVxuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIF9nZXRTY29yZUZ1bmN0aW9uKHNlYXJjaCkge1xuXHQgICAgY29uc3QgdG9rZW5zID0gc2VhcmNoLnRva2Vucyxcblx0ICAgICAgICAgIHRva2VuX2NvdW50ID0gdG9rZW5zLmxlbmd0aDtcblxuXHQgICAgaWYgKCF0b2tlbl9jb3VudCkge1xuXHQgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuXHQgICAgICAgIHJldHVybiAwO1xuXHQgICAgICB9O1xuXHQgICAgfVxuXG5cdCAgICBjb25zdCBmaWVsZHMgPSBzZWFyY2gub3B0aW9ucy5maWVsZHMsXG5cdCAgICAgICAgICB3ZWlnaHRzID0gc2VhcmNoLndlaWdodHMsXG5cdCAgICAgICAgICBmaWVsZF9jb3VudCA9IGZpZWxkcy5sZW5ndGgsXG5cdCAgICAgICAgICBnZXRBdHRyRm4gPSBzZWFyY2guZ2V0QXR0ckZuO1xuXG5cdCAgICBpZiAoIWZpZWxkX2NvdW50KSB7XG5cdCAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgcmV0dXJuIDE7XG5cdCAgICAgIH07XG5cdCAgICB9XG5cdCAgICAvKipcblx0ICAgICAqIENhbGN1bGF0ZXMgdGhlIHNjb3JlIG9mIGFuIG9iamVjdFxuXHQgICAgICogYWdhaW5zdCB0aGUgc2VhcmNoIHF1ZXJ5LlxuXHQgICAgICpcblx0ICAgICAqL1xuXG5cblx0ICAgIGNvbnN0IHNjb3JlT2JqZWN0ID0gZnVuY3Rpb24gKCkge1xuXHQgICAgICBpZiAoZmllbGRfY291bnQgPT09IDEpIHtcblx0ICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHRva2VuLCBkYXRhKSB7XG5cdCAgICAgICAgICBjb25zdCBmaWVsZCA9IGZpZWxkc1swXS5maWVsZDtcblx0ICAgICAgICAgIHJldHVybiBzY29yZVZhbHVlKGdldEF0dHJGbihkYXRhLCBmaWVsZCksIHRva2VuLCB3ZWlnaHRzW2ZpZWxkXSB8fCAxKTtcblx0ICAgICAgICB9O1xuXHQgICAgICB9XG5cblx0ICAgICAgcmV0dXJuIGZ1bmN0aW9uICh0b2tlbiwgZGF0YSkge1xuXHQgICAgICAgIHZhciBzdW0gPSAwOyAvLyBpcyB0aGUgdG9rZW4gc3BlY2lmaWMgdG8gYSBmaWVsZD9cblxuXHQgICAgICAgIGlmICh0b2tlbi5maWVsZCkge1xuXHQgICAgICAgICAgY29uc3QgdmFsdWUgPSBnZXRBdHRyRm4oZGF0YSwgdG9rZW4uZmllbGQpO1xuXG5cdCAgICAgICAgICBpZiAoIXRva2VuLnJlZ2V4ICYmIHZhbHVlKSB7XG5cdCAgICAgICAgICAgIHN1bSArPSAxIC8gZmllbGRfY291bnQ7XG5cdCAgICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgICBzdW0gKz0gc2NvcmVWYWx1ZSh2YWx1ZSwgdG9rZW4sIDEpO1xuXHQgICAgICAgICAgfVxuXHQgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICBpdGVyYXRlJDEod2VpZ2h0cywgKHdlaWdodCwgZmllbGQpID0+IHtcblx0ICAgICAgICAgICAgc3VtICs9IHNjb3JlVmFsdWUoZ2V0QXR0ckZuKGRhdGEsIGZpZWxkKSwgdG9rZW4sIHdlaWdodCk7XG5cdCAgICAgICAgICB9KTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICByZXR1cm4gc3VtIC8gZmllbGRfY291bnQ7XG5cdCAgICAgIH07XG5cdCAgICB9KCk7XG5cblx0ICAgIGlmICh0b2tlbl9jb3VudCA9PT0gMSkge1xuXHQgICAgICByZXR1cm4gZnVuY3Rpb24gKGRhdGEpIHtcblx0ICAgICAgICByZXR1cm4gc2NvcmVPYmplY3QodG9rZW5zWzBdLCBkYXRhKTtcblx0ICAgICAgfTtcblx0ICAgIH1cblxuXHQgICAgaWYgKHNlYXJjaC5vcHRpb25zLmNvbmp1bmN0aW9uID09PSAnYW5kJykge1xuXHQgICAgICByZXR1cm4gZnVuY3Rpb24gKGRhdGEpIHtcblx0ICAgICAgICB2YXIgc2NvcmUsXG5cdCAgICAgICAgICAgIHN1bSA9IDA7XG5cblx0ICAgICAgICBmb3IgKGxldCB0b2tlbiBvZiB0b2tlbnMpIHtcblx0ICAgICAgICAgIHNjb3JlID0gc2NvcmVPYmplY3QodG9rZW4sIGRhdGEpO1xuXHQgICAgICAgICAgaWYgKHNjb3JlIDw9IDApIHJldHVybiAwO1xuXHQgICAgICAgICAgc3VtICs9IHNjb3JlO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHJldHVybiBzdW0gLyB0b2tlbl9jb3VudDtcblx0ICAgICAgfTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIHJldHVybiBmdW5jdGlvbiAoZGF0YSkge1xuXHQgICAgICAgIHZhciBzdW0gPSAwO1xuXHQgICAgICAgIGl0ZXJhdGUkMSh0b2tlbnMsIHRva2VuID0+IHtcblx0ICAgICAgICAgIHN1bSArPSBzY29yZU9iamVjdCh0b2tlbiwgZGF0YSk7XG5cdCAgICAgICAgfSk7XG5cdCAgICAgICAgcmV0dXJuIHN1bSAvIHRva2VuX2NvdW50O1xuXHQgICAgICB9O1xuXHQgICAgfVxuXHQgIH1cblxuXHQgIC8qKlxuXHQgICAqIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IGNhbiBiZSB1c2VkIHRvIGNvbXBhcmUgdHdvXG5cdCAgICogcmVzdWx0cywgZm9yIHNvcnRpbmcgcHVycG9zZXMuIElmIG5vIHNvcnRpbmcgc2hvdWxkXG5cdCAgICogYmUgcGVyZm9ybWVkLCBgbnVsbGAgd2lsbCBiZSByZXR1cm5lZC5cblx0ICAgKlxuXHQgICAqIEByZXR1cm4gZnVuY3Rpb24oYSxiKVxuXHQgICAqL1xuXHQgIGdldFNvcnRGdW5jdGlvbihxdWVyeSwgb3B0aW9ucykge1xuXHQgICAgdmFyIHNlYXJjaCA9IHRoaXMucHJlcGFyZVNlYXJjaChxdWVyeSwgb3B0aW9ucyk7XG5cdCAgICByZXR1cm4gdGhpcy5fZ2V0U29ydEZ1bmN0aW9uKHNlYXJjaCk7XG5cdCAgfVxuXG5cdCAgX2dldFNvcnRGdW5jdGlvbihzZWFyY2gpIHtcblx0ICAgIHZhciBpbXBsaWNpdF9zY29yZSxcblx0ICAgICAgICBzb3J0X2ZsZHMgPSBbXTtcblx0ICAgIGNvbnN0IHNlbGYgPSB0aGlzLFxuXHQgICAgICAgICAgb3B0aW9ucyA9IHNlYXJjaC5vcHRpb25zLFxuXHQgICAgICAgICAgc29ydCA9ICFzZWFyY2gucXVlcnkgJiYgb3B0aW9ucy5zb3J0X2VtcHR5ID8gb3B0aW9ucy5zb3J0X2VtcHR5IDogb3B0aW9ucy5zb3J0O1xuXG5cdCAgICBpZiAodHlwZW9mIHNvcnQgPT0gJ2Z1bmN0aW9uJykge1xuXHQgICAgICByZXR1cm4gc29ydC5iaW5kKHRoaXMpO1xuXHQgICAgfVxuXHQgICAgLyoqXG5cdCAgICAgKiBGZXRjaGVzIHRoZSBzcGVjaWZpZWQgc29ydCBmaWVsZCB2YWx1ZVxuXHQgICAgICogZnJvbSBhIHNlYXJjaCByZXN1bHQgaXRlbS5cblx0ICAgICAqXG5cdCAgICAgKi9cblxuXG5cdCAgICBjb25zdCBnZXRfZmllbGQgPSBmdW5jdGlvbiBnZXRfZmllbGQobmFtZSwgcmVzdWx0KSB7XG5cdCAgICAgIGlmIChuYW1lID09PSAnJHNjb3JlJykgcmV0dXJuIHJlc3VsdC5zY29yZTtcblx0ICAgICAgcmV0dXJuIHNlYXJjaC5nZXRBdHRyRm4oc2VsZi5pdGVtc1tyZXN1bHQuaWRdLCBuYW1lKTtcblx0ICAgIH07IC8vIHBhcnNlIG9wdGlvbnNcblxuXG5cdCAgICBpZiAoc29ydCkge1xuXHQgICAgICBmb3IgKGxldCBzIG9mIHNvcnQpIHtcblx0ICAgICAgICBpZiAoc2VhcmNoLnF1ZXJ5IHx8IHMuZmllbGQgIT09ICckc2NvcmUnKSB7XG5cdCAgICAgICAgICBzb3J0X2ZsZHMucHVzaChzKTtcblx0ICAgICAgICB9XG5cdCAgICAgIH1cblx0ICAgIH0gLy8gdGhlIFwiJHNjb3JlXCIgZmllbGQgaXMgaW1wbGllZCB0byBiZSB0aGUgcHJpbWFyeVxuXHQgICAgLy8gc29ydCBmaWVsZCwgdW5sZXNzIGl0J3MgbWFudWFsbHkgc3BlY2lmaWVkXG5cblxuXHQgICAgaWYgKHNlYXJjaC5xdWVyeSkge1xuXHQgICAgICBpbXBsaWNpdF9zY29yZSA9IHRydWU7XG5cblx0ICAgICAgZm9yIChsZXQgZmxkIG9mIHNvcnRfZmxkcykge1xuXHQgICAgICAgIGlmIChmbGQuZmllbGQgPT09ICckc2NvcmUnKSB7XG5cdCAgICAgICAgICBpbXBsaWNpdF9zY29yZSA9IGZhbHNlO1xuXHQgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cblx0ICAgICAgaWYgKGltcGxpY2l0X3Njb3JlKSB7XG5cdCAgICAgICAgc29ydF9mbGRzLnVuc2hpZnQoe1xuXHQgICAgICAgICAgZmllbGQ6ICckc2NvcmUnLFxuXHQgICAgICAgICAgZGlyZWN0aW9uOiAnZGVzYydcblx0ICAgICAgICB9KTtcblx0ICAgICAgfSAvLyB3aXRob3V0IGEgc2VhcmNoLnF1ZXJ5LCBhbGwgaXRlbXMgd2lsbCBoYXZlIHRoZSBzYW1lIHNjb3JlXG5cblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIHNvcnRfZmxkcyA9IHNvcnRfZmxkcy5maWx0ZXIoZmxkID0+IGZsZC5maWVsZCAhPT0gJyRzY29yZScpO1xuXHQgICAgfSAvLyBidWlsZCBmdW5jdGlvblxuXG5cblx0ICAgIGNvbnN0IHNvcnRfZmxkc19jb3VudCA9IHNvcnRfZmxkcy5sZW5ndGg7XG5cblx0ICAgIGlmICghc29ydF9mbGRzX2NvdW50KSB7XG5cdCAgICAgIHJldHVybiBudWxsO1xuXHQgICAgfVxuXG5cdCAgICByZXR1cm4gZnVuY3Rpb24gKGEsIGIpIHtcblx0ICAgICAgdmFyIHJlc3VsdCwgZmllbGQ7XG5cblx0ICAgICAgZm9yIChsZXQgc29ydF9mbGQgb2Ygc29ydF9mbGRzKSB7XG5cdCAgICAgICAgZmllbGQgPSBzb3J0X2ZsZC5maWVsZDtcblx0ICAgICAgICBsZXQgbXVsdGlwbGllciA9IHNvcnRfZmxkLmRpcmVjdGlvbiA9PT0gJ2Rlc2MnID8gLTEgOiAxO1xuXHQgICAgICAgIHJlc3VsdCA9IG11bHRpcGxpZXIgKiBjbXAoZ2V0X2ZpZWxkKGZpZWxkLCBhKSwgZ2V0X2ZpZWxkKGZpZWxkLCBiKSk7XG5cdCAgICAgICAgaWYgKHJlc3VsdCkgcmV0dXJuIHJlc3VsdDtcblx0ICAgICAgfVxuXG5cdCAgICAgIHJldHVybiAwO1xuXHQgICAgfTtcblx0ICB9XG5cblx0ICAvKipcblx0ICAgKiBQYXJzZXMgYSBzZWFyY2ggcXVlcnkgYW5kIHJldHVybnMgYW4gb2JqZWN0XG5cdCAgICogd2l0aCB0b2tlbnMgYW5kIGZpZWxkcyByZWFkeSB0byBiZSBwb3B1bGF0ZWRcblx0ICAgKiB3aXRoIHJlc3VsdHMuXG5cdCAgICpcblx0ICAgKi9cblx0ICBwcmVwYXJlU2VhcmNoKHF1ZXJ5LCBvcHRzVXNlcikge1xuXHQgICAgY29uc3Qgd2VpZ2h0cyA9IHt9O1xuXHQgICAgdmFyIG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCBvcHRzVXNlcik7XG5cdCAgICBwcm9wVG9BcnJheShvcHRpb25zLCAnc29ydCcpO1xuXHQgICAgcHJvcFRvQXJyYXkob3B0aW9ucywgJ3NvcnRfZW1wdHknKTsgLy8gY29udmVydCBmaWVsZHMgdG8gbmV3IGZvcm1hdFxuXG5cdCAgICBpZiAob3B0aW9ucy5maWVsZHMpIHtcblx0ICAgICAgcHJvcFRvQXJyYXkob3B0aW9ucywgJ2ZpZWxkcycpO1xuXHQgICAgICBjb25zdCBmaWVsZHMgPSBbXTtcblx0ICAgICAgb3B0aW9ucy5maWVsZHMuZm9yRWFjaChmaWVsZCA9PiB7XG5cdCAgICAgICAgaWYgKHR5cGVvZiBmaWVsZCA9PSAnc3RyaW5nJykge1xuXHQgICAgICAgICAgZmllbGQgPSB7XG5cdCAgICAgICAgICAgIGZpZWxkOiBmaWVsZCxcblx0ICAgICAgICAgICAgd2VpZ2h0OiAxXG5cdCAgICAgICAgICB9O1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIGZpZWxkcy5wdXNoKGZpZWxkKTtcblx0ICAgICAgICB3ZWlnaHRzW2ZpZWxkLmZpZWxkXSA9ICd3ZWlnaHQnIGluIGZpZWxkID8gZmllbGQud2VpZ2h0IDogMTtcblx0ICAgICAgfSk7XG5cdCAgICAgIG9wdGlvbnMuZmllbGRzID0gZmllbGRzO1xuXHQgICAgfVxuXG5cdCAgICByZXR1cm4ge1xuXHQgICAgICBvcHRpb25zOiBvcHRpb25zLFxuXHQgICAgICBxdWVyeTogcXVlcnkudG9Mb3dlckNhc2UoKS50cmltKCksXG5cdCAgICAgIHRva2VuczogdGhpcy50b2tlbml6ZShxdWVyeSwgb3B0aW9ucy5yZXNwZWN0X3dvcmRfYm91bmRhcmllcywgd2VpZ2h0cyksXG5cdCAgICAgIHRvdGFsOiAwLFxuXHQgICAgICBpdGVtczogW10sXG5cdCAgICAgIHdlaWdodHM6IHdlaWdodHMsXG5cdCAgICAgIGdldEF0dHJGbjogb3B0aW9ucy5uZXN0aW5nID8gZ2V0QXR0ck5lc3RpbmcgOiBnZXRBdHRyXG5cdCAgICB9O1xuXHQgIH1cblxuXHQgIC8qKlxuXHQgICAqIFNlYXJjaGVzIHRocm91Z2ggYWxsIGl0ZW1zIGFuZCByZXR1cm5zIGEgc29ydGVkIGFycmF5IG9mIG1hdGNoZXMuXG5cdCAgICpcblx0ICAgKi9cblx0ICBzZWFyY2gocXVlcnksIG9wdGlvbnMpIHtcblx0ICAgIHZhciBzZWxmID0gdGhpcyxcblx0ICAgICAgICBzY29yZSxcblx0ICAgICAgICBzZWFyY2g7XG5cdCAgICBzZWFyY2ggPSB0aGlzLnByZXBhcmVTZWFyY2gocXVlcnksIG9wdGlvbnMpO1xuXHQgICAgb3B0aW9ucyA9IHNlYXJjaC5vcHRpb25zO1xuXHQgICAgcXVlcnkgPSBzZWFyY2gucXVlcnk7IC8vIGdlbmVyYXRlIHJlc3VsdCBzY29yaW5nIGZ1bmN0aW9uXG5cblx0ICAgIGNvbnN0IGZuX3Njb3JlID0gb3B0aW9ucy5zY29yZSB8fCBzZWxmLl9nZXRTY29yZUZ1bmN0aW9uKHNlYXJjaCk7IC8vIHBlcmZvcm0gc2VhcmNoIGFuZCBzb3J0XG5cblxuXHQgICAgaWYgKHF1ZXJ5Lmxlbmd0aCkge1xuXHQgICAgICBpdGVyYXRlJDEoc2VsZi5pdGVtcywgKGl0ZW0sIGlkKSA9PiB7XG5cdCAgICAgICAgc2NvcmUgPSBmbl9zY29yZShpdGVtKTtcblxuXHQgICAgICAgIGlmIChvcHRpb25zLmZpbHRlciA9PT0gZmFsc2UgfHwgc2NvcmUgPiAwKSB7XG5cdCAgICAgICAgICBzZWFyY2guaXRlbXMucHVzaCh7XG5cdCAgICAgICAgICAgICdzY29yZSc6IHNjb3JlLFxuXHQgICAgICAgICAgICAnaWQnOiBpZFxuXHQgICAgICAgICAgfSk7XG5cdCAgICAgICAgfVxuXHQgICAgICB9KTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIGl0ZXJhdGUkMShzZWxmLml0ZW1zLCAoXywgaWQpID0+IHtcblx0ICAgICAgICBzZWFyY2guaXRlbXMucHVzaCh7XG5cdCAgICAgICAgICAnc2NvcmUnOiAxLFxuXHQgICAgICAgICAgJ2lkJzogaWRcblx0ICAgICAgICB9KTtcblx0ICAgICAgfSk7XG5cdCAgICB9XG5cblx0ICAgIGNvbnN0IGZuX3NvcnQgPSBzZWxmLl9nZXRTb3J0RnVuY3Rpb24oc2VhcmNoKTtcblxuXHQgICAgaWYgKGZuX3NvcnQpIHNlYXJjaC5pdGVtcy5zb3J0KGZuX3NvcnQpOyAvLyBhcHBseSBsaW1pdHNcblxuXHQgICAgc2VhcmNoLnRvdGFsID0gc2VhcmNoLml0ZW1zLmxlbmd0aDtcblxuXHQgICAgaWYgKHR5cGVvZiBvcHRpb25zLmxpbWl0ID09PSAnbnVtYmVyJykge1xuXHQgICAgICBzZWFyY2guaXRlbXMgPSBzZWFyY2guaXRlbXMuc2xpY2UoMCwgb3B0aW9ucy5saW1pdCk7XG5cdCAgICB9XG5cblx0ICAgIHJldHVybiBzZWFyY2g7XG5cdCAgfVxuXG5cdH1cblxuXHQvKipcblx0ICogSXRlcmF0ZXMgb3ZlciBhcnJheXMgYW5kIGhhc2hlcy5cblx0ICpcblx0ICogYGBgXG5cdCAqIGl0ZXJhdGUodGhpcy5pdGVtcywgZnVuY3Rpb24oaXRlbSwgaWQpIHtcblx0ICogICAgLy8gaW52b2tlZCBmb3IgZWFjaCBpdGVtXG5cdCAqIH0pO1xuXHQgKiBgYGBcblx0ICpcblx0ICovXG5cblx0Y29uc3QgaXRlcmF0ZSA9IChvYmplY3QsIGNhbGxiYWNrKSA9PiB7XG5cdCAgaWYgKEFycmF5LmlzQXJyYXkob2JqZWN0KSkge1xuXHQgICAgb2JqZWN0LmZvckVhY2goY2FsbGJhY2spO1xuXHQgIH0gZWxzZSB7XG5cdCAgICBmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSB7XG5cdCAgICAgIGlmIChvYmplY3QuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuXHQgICAgICAgIGNhbGxiYWNrKG9iamVjdFtrZXldLCBrZXkpO1xuXHQgICAgICB9XG5cdCAgICB9XG5cdCAgfVxuXHR9O1xuXG5cdC8qKlxuXHQgKiBSZXR1cm4gYSBkb20gZWxlbWVudCBmcm9tIGVpdGhlciBhIGRvbSBxdWVyeSBzdHJpbmcsIGpRdWVyeSBvYmplY3QsIGEgZG9tIGVsZW1lbnQgb3IgaHRtbCBzdHJpbmdcblx0ICogaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNDk0MTQzL2NyZWF0aW5nLWEtbmV3LWRvbS1lbGVtZW50LWZyb20tYW4taHRtbC1zdHJpbmctdXNpbmctYnVpbHQtaW4tZG9tLW1ldGhvZHMtb3ItcHJvLzM1Mzg1NTE4IzM1Mzg1NTE4XG5cdCAqXG5cdCAqIHBhcmFtIHF1ZXJ5IHNob3VsZCBiZSB7fVxuXHQgKi9cblxuXHRjb25zdCBnZXREb20gPSBxdWVyeSA9PiB7XG5cdCAgaWYgKHF1ZXJ5LmpxdWVyeSkge1xuXHQgICAgcmV0dXJuIHF1ZXJ5WzBdO1xuXHQgIH1cblxuXHQgIGlmIChxdWVyeSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG5cdCAgICByZXR1cm4gcXVlcnk7XG5cdCAgfVxuXG5cdCAgaWYgKGlzSHRtbFN0cmluZyhxdWVyeSkpIHtcblx0ICAgIHZhciB0cGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xuXHQgICAgdHBsLmlubmVySFRNTCA9IHF1ZXJ5LnRyaW0oKTsgLy8gTmV2ZXIgcmV0dXJuIGEgdGV4dCBub2RlIG9mIHdoaXRlc3BhY2UgYXMgdGhlIHJlc3VsdFxuXG5cdCAgICByZXR1cm4gdHBsLmNvbnRlbnQuZmlyc3RDaGlsZDtcblx0ICB9XG5cblx0ICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihxdWVyeSk7XG5cdH07XG5cdGNvbnN0IGlzSHRtbFN0cmluZyA9IGFyZyA9PiB7XG5cdCAgaWYgKHR5cGVvZiBhcmcgPT09ICdzdHJpbmcnICYmIGFyZy5pbmRleE9mKCc8JykgPiAtMSkge1xuXHQgICAgcmV0dXJuIHRydWU7XG5cdCAgfVxuXG5cdCAgcmV0dXJuIGZhbHNlO1xuXHR9O1xuXHRjb25zdCBlc2NhcGVRdWVyeSA9IHF1ZXJ5ID0+IHtcblx0ICByZXR1cm4gcXVlcnkucmVwbGFjZSgvWydcIlxcXFxdL2csICdcXFxcJCYnKTtcblx0fTtcblx0LyoqXG5cdCAqIERpc3BhdGNoIGFuIGV2ZW50XG5cdCAqXG5cdCAqL1xuXG5cdGNvbnN0IHRyaWdnZXJFdmVudCA9IChkb21fZWwsIGV2ZW50X25hbWUpID0+IHtcblx0ICB2YXIgZXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnSFRNTEV2ZW50cycpO1xuXHQgIGV2ZW50LmluaXRFdmVudChldmVudF9uYW1lLCB0cnVlLCBmYWxzZSk7XG5cdCAgZG9tX2VsLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuXHR9O1xuXHQvKipcblx0ICogQXBwbHkgQ1NTIHJ1bGVzIHRvIGEgZG9tIGVsZW1lbnRcblx0ICpcblx0ICovXG5cblx0Y29uc3QgYXBwbHlDU1MgPSAoZG9tX2VsLCBjc3MpID0+IHtcblx0ICBPYmplY3QuYXNzaWduKGRvbV9lbC5zdHlsZSwgY3NzKTtcblx0fTtcblx0LyoqXG5cdCAqIEFkZCBjc3MgY2xhc3Nlc1xuXHQgKlxuXHQgKi9cblxuXHRjb25zdCBhZGRDbGFzc2VzID0gKGVsbXRzLCAuLi5jbGFzc2VzKSA9PiB7XG5cdCAgdmFyIG5vcm1fY2xhc3NlcyA9IGNsYXNzZXNBcnJheShjbGFzc2VzKTtcblx0ICBlbG10cyA9IGNhc3RBc0FycmF5KGVsbXRzKTtcblx0ICBlbG10cy5tYXAoZWwgPT4ge1xuXHQgICAgbm9ybV9jbGFzc2VzLm1hcChjbHMgPT4ge1xuXHQgICAgICBlbC5jbGFzc0xpc3QuYWRkKGNscyk7XG5cdCAgICB9KTtcblx0ICB9KTtcblx0fTtcblx0LyoqXG5cdCAqIFJlbW92ZSBjc3MgY2xhc3Nlc1xuXHQgKlxuXHQgKi9cblxuXHRjb25zdCByZW1vdmVDbGFzc2VzID0gKGVsbXRzLCAuLi5jbGFzc2VzKSA9PiB7XG5cdCAgdmFyIG5vcm1fY2xhc3NlcyA9IGNsYXNzZXNBcnJheShjbGFzc2VzKTtcblx0ICBlbG10cyA9IGNhc3RBc0FycmF5KGVsbXRzKTtcblx0ICBlbG10cy5tYXAoZWwgPT4ge1xuXHQgICAgbm9ybV9jbGFzc2VzLm1hcChjbHMgPT4ge1xuXHQgICAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKGNscyk7XG5cdCAgICB9KTtcblx0ICB9KTtcblx0fTtcblx0LyoqXG5cdCAqIFJldHVybiBhcmd1bWVudHNcblx0ICpcblx0ICovXG5cblx0Y29uc3QgY2xhc3Nlc0FycmF5ID0gYXJncyA9PiB7XG5cdCAgdmFyIGNsYXNzZXMgPSBbXTtcblx0ICBpdGVyYXRlKGFyZ3MsIF9jbGFzc2VzID0+IHtcblx0ICAgIGlmICh0eXBlb2YgX2NsYXNzZXMgPT09ICdzdHJpbmcnKSB7XG5cdCAgICAgIF9jbGFzc2VzID0gX2NsYXNzZXMudHJpbSgpLnNwbGl0KC9bXFwxMVxcMTJcXDE0XFwxNVxcNDBdLyk7XG5cdCAgICB9XG5cblx0ICAgIGlmIChBcnJheS5pc0FycmF5KF9jbGFzc2VzKSkge1xuXHQgICAgICBjbGFzc2VzID0gY2xhc3Nlcy5jb25jYXQoX2NsYXNzZXMpO1xuXHQgICAgfVxuXHQgIH0pO1xuXHQgIHJldHVybiBjbGFzc2VzLmZpbHRlcihCb29sZWFuKTtcblx0fTtcblx0LyoqXG5cdCAqIENyZWF0ZSBhbiBhcnJheSBmcm9tIGFyZyBpZiBpdCdzIG5vdCBhbHJlYWR5IGFuIGFycmF5XG5cdCAqXG5cdCAqL1xuXG5cdGNvbnN0IGNhc3RBc0FycmF5ID0gYXJnID0+IHtcblx0ICBpZiAoIUFycmF5LmlzQXJyYXkoYXJnKSkge1xuXHQgICAgYXJnID0gW2FyZ107XG5cdCAgfVxuXG5cdCAgcmV0dXJuIGFyZztcblx0fTtcblx0LyoqXG5cdCAqIEdldCB0aGUgY2xvc2VzdCBub2RlIHRvIHRoZSBldnQudGFyZ2V0IG1hdGNoaW5nIHRoZSBzZWxlY3RvclxuXHQgKiBTdG9wcyBhdCB3cmFwcGVyXG5cdCAqXG5cdCAqL1xuXG5cdGNvbnN0IHBhcmVudE1hdGNoID0gKHRhcmdldCwgc2VsZWN0b3IsIHdyYXBwZXIpID0+IHtcblx0ICBpZiAod3JhcHBlciAmJiAhd3JhcHBlci5jb250YWlucyh0YXJnZXQpKSB7XG5cdCAgICByZXR1cm47XG5cdCAgfVxuXG5cdCAgd2hpbGUgKHRhcmdldCAmJiB0YXJnZXQubWF0Y2hlcykge1xuXHQgICAgaWYgKHRhcmdldC5tYXRjaGVzKHNlbGVjdG9yKSkge1xuXHQgICAgICByZXR1cm4gdGFyZ2V0O1xuXHQgICAgfVxuXG5cdCAgICB0YXJnZXQgPSB0YXJnZXQucGFyZW50Tm9kZTtcblx0ICB9XG5cdH07XG5cdC8qKlxuXHQgKiBHZXQgdGhlIGZpcnN0IG9yIGxhc3QgaXRlbSBmcm9tIGFuIGFycmF5XG5cdCAqXG5cdCAqID4gMCAtIHJpZ2h0IChsYXN0KVxuXHQgKiA8PSAwIC0gbGVmdCAoZmlyc3QpXG5cdCAqXG5cdCAqL1xuXG5cdGNvbnN0IGdldFRhaWwgPSAobGlzdCwgZGlyZWN0aW9uID0gMCkgPT4ge1xuXHQgIGlmIChkaXJlY3Rpb24gPiAwKSB7XG5cdCAgICByZXR1cm4gbGlzdFtsaXN0Lmxlbmd0aCAtIDFdO1xuXHQgIH1cblxuXHQgIHJldHVybiBsaXN0WzBdO1xuXHR9O1xuXHQvKipcblx0ICogUmV0dXJuIHRydWUgaWYgYW4gb2JqZWN0IGlzIGVtcHR5XG5cdCAqXG5cdCAqL1xuXG5cdGNvbnN0IGlzRW1wdHlPYmplY3QgPSBvYmogPT4ge1xuXHQgIHJldHVybiBPYmplY3Qua2V5cyhvYmopLmxlbmd0aCA9PT0gMDtcblx0fTtcblx0LyoqXG5cdCAqIEdldCB0aGUgaW5kZXggb2YgYW4gZWxlbWVudCBhbW9uZ3N0IHNpYmxpbmcgbm9kZXMgb2YgdGhlIHNhbWUgdHlwZVxuXHQgKlxuXHQgKi9cblxuXHRjb25zdCBub2RlSW5kZXggPSAoZWwsIGFtb25nc3QpID0+IHtcblx0ICBpZiAoIWVsKSByZXR1cm4gLTE7XG5cdCAgYW1vbmdzdCA9IGFtb25nc3QgfHwgZWwubm9kZU5hbWU7XG5cdCAgdmFyIGkgPSAwO1xuXG5cdCAgd2hpbGUgKGVsID0gZWwucHJldmlvdXNFbGVtZW50U2libGluZykge1xuXHQgICAgaWYgKGVsLm1hdGNoZXMoYW1vbmdzdCkpIHtcblx0ICAgICAgaSsrO1xuXHQgICAgfVxuXHQgIH1cblxuXHQgIHJldHVybiBpO1xuXHR9O1xuXHQvKipcblx0ICogU2V0IGF0dHJpYnV0ZXMgb2YgYW4gZWxlbWVudFxuXHQgKlxuXHQgKi9cblxuXHRjb25zdCBzZXRBdHRyID0gKGVsLCBhdHRycykgPT4ge1xuXHQgIGl0ZXJhdGUoYXR0cnMsICh2YWwsIGF0dHIpID0+IHtcblx0ICAgIGlmICh2YWwgPT0gbnVsbCkge1xuXHQgICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoYXR0cik7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICBlbC5zZXRBdHRyaWJ1dGUoYXR0ciwgJycgKyB2YWwpO1xuXHQgICAgfVxuXHQgIH0pO1xuXHR9O1xuXHQvKipcblx0ICogUmVwbGFjZSBhIG5vZGVcblx0ICovXG5cblx0Y29uc3QgcmVwbGFjZU5vZGUgPSAoZXhpc3RpbmcsIHJlcGxhY2VtZW50KSA9PiB7XG5cdCAgaWYgKGV4aXN0aW5nLnBhcmVudE5vZGUpIGV4aXN0aW5nLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKHJlcGxhY2VtZW50LCBleGlzdGluZyk7XG5cdH07XG5cblx0LyoqXG5cdCAqIGhpZ2hsaWdodCB2MyB8IE1JVCBsaWNlbnNlIHwgSm9oYW5uIEJ1cmthcmQgPGpiQGVhaW8uY29tPlxuXHQgKiBIaWdobGlnaHRzIGFyYml0cmFyeSB0ZXJtcyBpbiBhIG5vZGUuXG5cdCAqXG5cdCAqIC0gTW9kaWZpZWQgYnkgTWFyc2hhbCA8YmVhdGdhdGVzQGdtYWlsLmNvbT4gMjAxMS02LTI0IChhZGRlZCByZWdleClcblx0ICogLSBNb2RpZmllZCBieSBCcmlhbiBSZWF2aXMgPGJyaWFuQHRoaXJkcm91dGUuY29tPiAyMDEyLTgtMjcgKGNsZWFudXApXG5cdCAqL1xuXHRjb25zdCBoaWdobGlnaHQgPSAoZWxlbWVudCwgcmVnZXgpID0+IHtcblx0ICBpZiAocmVnZXggPT09IG51bGwpIHJldHVybjsgLy8gY29udmV0IHN0cmluZyB0byByZWdleFxuXG5cdCAgaWYgKHR5cGVvZiByZWdleCA9PT0gJ3N0cmluZycpIHtcblx0ICAgIGlmICghcmVnZXgubGVuZ3RoKSByZXR1cm47XG5cdCAgICByZWdleCA9IG5ldyBSZWdFeHAocmVnZXgsICdpJyk7XG5cdCAgfSAvLyBXcmFwIG1hdGNoaW5nIHBhcnQgb2YgdGV4dCBub2RlIHdpdGggaGlnaGxpZ2h0aW5nIDxzcGFuPiwgZS5nLlxuXHQgIC8vIFNvY2NlciAgLT4gIDxzcGFuIGNsYXNzPVwiaGlnaGxpZ2h0XCI+U29jPC9zcGFuPmNlciAgZm9yIHJlZ2V4ID0gL3NvYy9pXG5cblxuXHQgIGNvbnN0IGhpZ2hsaWdodFRleHQgPSBub2RlID0+IHtcblx0ICAgIHZhciBtYXRjaCA9IG5vZGUuZGF0YS5tYXRjaChyZWdleCk7XG5cblx0ICAgIGlmIChtYXRjaCAmJiBub2RlLmRhdGEubGVuZ3RoID4gMCkge1xuXHQgICAgICB2YXIgc3Bhbm5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG5cdCAgICAgIHNwYW5ub2RlLmNsYXNzTmFtZSA9ICdoaWdobGlnaHQnO1xuXHQgICAgICB2YXIgbWlkZGxlYml0ID0gbm9kZS5zcGxpdFRleHQobWF0Y2guaW5kZXgpO1xuXHQgICAgICBtaWRkbGViaXQuc3BsaXRUZXh0KG1hdGNoWzBdLmxlbmd0aCk7XG5cdCAgICAgIHZhciBtaWRkbGVjbG9uZSA9IG1pZGRsZWJpdC5jbG9uZU5vZGUodHJ1ZSk7XG5cdCAgICAgIHNwYW5ub2RlLmFwcGVuZENoaWxkKG1pZGRsZWNsb25lKTtcblx0ICAgICAgcmVwbGFjZU5vZGUobWlkZGxlYml0LCBzcGFubm9kZSk7XG5cdCAgICAgIHJldHVybiAxO1xuXHQgICAgfVxuXG5cdCAgICByZXR1cm4gMDtcblx0ICB9OyAvLyBSZWN1cnNlIGVsZW1lbnQgbm9kZSwgbG9va2luZyBmb3IgY2hpbGQgdGV4dCBub2RlcyB0byBoaWdobGlnaHQsIHVubGVzcyBlbGVtZW50XG5cdCAgLy8gaXMgY2hpbGRsZXNzLCA8c2NyaXB0PiwgPHN0eWxlPiwgb3IgYWxyZWFkeSBoaWdobGlnaHRlZDogPHNwYW4gY2xhc3M9XCJoaWdodGxpZ2h0XCI+XG5cblxuXHQgIGNvbnN0IGhpZ2hsaWdodENoaWxkcmVuID0gbm9kZSA9PiB7XG5cdCAgICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gMSAmJiBub2RlLmNoaWxkTm9kZXMgJiYgIS8oc2NyaXB0fHN0eWxlKS9pLnRlc3Qobm9kZS50YWdOYW1lKSAmJiAobm9kZS5jbGFzc05hbWUgIT09ICdoaWdobGlnaHQnIHx8IG5vZGUudGFnTmFtZSAhPT0gJ1NQQU4nKSkge1xuXHQgICAgICBBcnJheS5mcm9tKG5vZGUuY2hpbGROb2RlcykuZm9yRWFjaChlbGVtZW50ID0+IHtcblx0ICAgICAgICBoaWdobGlnaHRSZWN1cnNpdmUoZWxlbWVudCk7XG5cdCAgICAgIH0pO1xuXHQgICAgfVxuXHQgIH07XG5cblx0ICBjb25zdCBoaWdobGlnaHRSZWN1cnNpdmUgPSBub2RlID0+IHtcblx0ICAgIGlmIChub2RlLm5vZGVUeXBlID09PSAzKSB7XG5cdCAgICAgIHJldHVybiBoaWdobGlnaHRUZXh0KG5vZGUpO1xuXHQgICAgfVxuXG5cdCAgICBoaWdobGlnaHRDaGlsZHJlbihub2RlKTtcblx0ICAgIHJldHVybiAwO1xuXHQgIH07XG5cblx0ICBoaWdobGlnaHRSZWN1cnNpdmUoZWxlbWVudCk7XG5cdH07XG5cdC8qKlxuXHQgKiByZW1vdmVIaWdobGlnaHQgZm4gY29waWVkIGZyb20gaGlnaGxpZ2h0IHY1IGFuZFxuXHQgKiBlZGl0ZWQgdG8gcmVtb3ZlIHdpdGgoKSwgcGFzcyBqcyBzdHJpY3QgbW9kZSwgYW5kIHVzZSB3aXRob3V0IGpxdWVyeVxuXHQgKi9cblxuXHRjb25zdCByZW1vdmVIaWdobGlnaHQgPSBlbCA9PiB7XG5cdCAgdmFyIGVsZW1lbnRzID0gZWwucXVlcnlTZWxlY3RvckFsbChcInNwYW4uaGlnaGxpZ2h0XCIpO1xuXHQgIEFycmF5LnByb3RvdHlwZS5mb3JFYWNoLmNhbGwoZWxlbWVudHMsIGZ1bmN0aW9uIChlbCkge1xuXHQgICAgdmFyIHBhcmVudCA9IGVsLnBhcmVudE5vZGU7XG5cdCAgICBwYXJlbnQucmVwbGFjZUNoaWxkKGVsLmZpcnN0Q2hpbGQsIGVsKTtcblx0ICAgIHBhcmVudC5ub3JtYWxpemUoKTtcblx0ICB9KTtcblx0fTtcblxuXHRjb25zdCBLRVlfQSA9IDY1O1xuXHRjb25zdCBLRVlfUkVUVVJOID0gMTM7XG5cdGNvbnN0IEtFWV9FU0MgPSAyNztcblx0Y29uc3QgS0VZX0xFRlQgPSAzNztcblx0Y29uc3QgS0VZX1VQID0gMzg7XG5cdGNvbnN0IEtFWV9SSUdIVCA9IDM5O1xuXHRjb25zdCBLRVlfRE9XTiA9IDQwO1xuXHRjb25zdCBLRVlfQkFDS1NQQUNFID0gODtcblx0Y29uc3QgS0VZX0RFTEVURSA9IDQ2O1xuXHRjb25zdCBLRVlfVEFCID0gOTtcblx0Y29uc3QgSVNfTUFDID0gdHlwZW9mIG5hdmlnYXRvciA9PT0gJ3VuZGVmaW5lZCcgPyBmYWxzZSA6IC9NYWMvLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7XG5cdGNvbnN0IEtFWV9TSE9SVENVVCA9IElTX01BQyA/ICdtZXRhS2V5JyA6ICdjdHJsS2V5JzsgLy8gY3RybCBrZXkgb3IgYXBwbGUga2V5IGZvciBtYVxuXG5cdHZhciBkZWZhdWx0cyA9IHtcblx0ICBvcHRpb25zOiBbXSxcblx0ICBvcHRncm91cHM6IFtdLFxuXHQgIHBsdWdpbnM6IFtdLFxuXHQgIGRlbGltaXRlcjogJywnLFxuXHQgIHNwbGl0T246IG51bGwsXG5cdCAgLy8gcmVnZXhwIG9yIHN0cmluZyBmb3Igc3BsaXR0aW5nIHVwIHZhbHVlcyBmcm9tIGEgcGFzdGUgY29tbWFuZFxuXHQgIHBlcnNpc3Q6IHRydWUsXG5cdCAgZGlhY3JpdGljczogdHJ1ZSxcblx0ICBjcmVhdGU6IG51bGwsXG5cdCAgY3JlYXRlT25CbHVyOiBmYWxzZSxcblx0ICBjcmVhdGVGaWx0ZXI6IG51bGwsXG5cdCAgaGlnaGxpZ2h0OiB0cnVlLFxuXHQgIG9wZW5PbkZvY3VzOiB0cnVlLFxuXHQgIHNob3VsZE9wZW46IG51bGwsXG5cdCAgbWF4T3B0aW9uczogNTAsXG5cdCAgbWF4SXRlbXM6IG51bGwsXG5cdCAgaGlkZVNlbGVjdGVkOiBudWxsLFxuXHQgIGR1cGxpY2F0ZXM6IGZhbHNlLFxuXHQgIGFkZFByZWNlZGVuY2U6IGZhbHNlLFxuXHQgIHNlbGVjdE9uVGFiOiBmYWxzZSxcblx0ICBwcmVsb2FkOiBudWxsLFxuXHQgIGFsbG93RW1wdHlPcHRpb246IGZhbHNlLFxuXHQgIC8vY2xvc2VBZnRlclNlbGVjdDogZmFsc2UsXG5cdCAgbG9hZFRocm90dGxlOiAzMDAsXG5cdCAgbG9hZGluZ0NsYXNzOiAnbG9hZGluZycsXG5cdCAgZGF0YUF0dHI6IG51bGwsXG5cdCAgLy8nZGF0YS1kYXRhJyxcblx0ICBvcHRncm91cEZpZWxkOiAnb3B0Z3JvdXAnLFxuXHQgIHZhbHVlRmllbGQ6ICd2YWx1ZScsXG5cdCAgbGFiZWxGaWVsZDogJ3RleHQnLFxuXHQgIGRpc2FibGVkRmllbGQ6ICdkaXNhYmxlZCcsXG5cdCAgb3B0Z3JvdXBMYWJlbEZpZWxkOiAnbGFiZWwnLFxuXHQgIG9wdGdyb3VwVmFsdWVGaWVsZDogJ3ZhbHVlJyxcblx0ICBsb2NrT3B0Z3JvdXBPcmRlcjogZmFsc2UsXG5cdCAgc29ydEZpZWxkOiAnJG9yZGVyJyxcblx0ICBzZWFyY2hGaWVsZDogWyd0ZXh0J10sXG5cdCAgc2VhcmNoQ29uanVuY3Rpb246ICdhbmQnLFxuXHQgIG1vZGU6IG51bGwsXG5cdCAgd3JhcHBlckNsYXNzOiAndHMtd3JhcHBlcicsXG5cdCAgY29udHJvbENsYXNzOiAndHMtY29udHJvbCcsXG5cdCAgZHJvcGRvd25DbGFzczogJ3RzLWRyb3Bkb3duJyxcblx0ICBkcm9wZG93bkNvbnRlbnRDbGFzczogJ3RzLWRyb3Bkb3duLWNvbnRlbnQnLFxuXHQgIGl0ZW1DbGFzczogJ2l0ZW0nLFxuXHQgIG9wdGlvbkNsYXNzOiAnb3B0aW9uJyxcblx0ICBkcm9wZG93blBhcmVudDogbnVsbCxcblx0ICBjb250cm9sSW5wdXQ6ICc8aW5wdXQgdHlwZT1cInRleHRcIiBhdXRvY29tcGxldGU9XCJvZmZcIiBzaXplPVwiMVwiIC8+Jyxcblx0ICBjb3B5Q2xhc3Nlc1RvRHJvcGRvd246IGZhbHNlLFxuXHQgIHBsYWNlaG9sZGVyOiBudWxsLFxuXHQgIGhpZGVQbGFjZWhvbGRlcjogbnVsbCxcblx0ICBzaG91bGRMb2FkOiBmdW5jdGlvbiAocXVlcnkpIHtcblx0ICAgIHJldHVybiBxdWVyeS5sZW5ndGggPiAwO1xuXHQgIH0sXG5cblx0ICAvKlxuXHQgIGxvYWQgICAgICAgICAgICAgICAgIDogbnVsbCwgLy8gZnVuY3Rpb24ocXVlcnksIGNhbGxiYWNrKSB7IC4uLiB9XG5cdCAgc2NvcmUgICAgICAgICAgICAgICAgOiBudWxsLCAvLyBmdW5jdGlvbihzZWFyY2gpIHsgLi4uIH1cblx0ICBvbkluaXRpYWxpemUgICAgICAgICA6IG51bGwsIC8vIGZ1bmN0aW9uKCkgeyAuLi4gfVxuXHQgIG9uQ2hhbmdlICAgICAgICAgICAgIDogbnVsbCwgLy8gZnVuY3Rpb24odmFsdWUpIHsgLi4uIH1cblx0ICBvbkl0ZW1BZGQgICAgICAgICAgICA6IG51bGwsIC8vIGZ1bmN0aW9uKHZhbHVlLCAkaXRlbSkgeyAuLi4gfVxuXHQgIG9uSXRlbVJlbW92ZSAgICAgICAgIDogbnVsbCwgLy8gZnVuY3Rpb24odmFsdWUpIHsgLi4uIH1cblx0ICBvbkNsZWFyICAgICAgICAgICAgICA6IG51bGwsIC8vIGZ1bmN0aW9uKCkgeyAuLi4gfVxuXHQgIG9uT3B0aW9uQWRkICAgICAgICAgIDogbnVsbCwgLy8gZnVuY3Rpb24odmFsdWUsIGRhdGEpIHsgLi4uIH1cblx0ICBvbk9wdGlvblJlbW92ZSAgICAgICA6IG51bGwsIC8vIGZ1bmN0aW9uKHZhbHVlKSB7IC4uLiB9XG5cdCAgb25PcHRpb25DbGVhciAgICAgICAgOiBudWxsLCAvLyBmdW5jdGlvbigpIHsgLi4uIH1cblx0ICBvbk9wdGlvbkdyb3VwQWRkICAgICA6IG51bGwsIC8vIGZ1bmN0aW9uKGlkLCBkYXRhKSB7IC4uLiB9XG5cdCAgb25PcHRpb25Hcm91cFJlbW92ZSAgOiBudWxsLCAvLyBmdW5jdGlvbihpZCkgeyAuLi4gfVxuXHQgIG9uT3B0aW9uR3JvdXBDbGVhciAgIDogbnVsbCwgLy8gZnVuY3Rpb24oKSB7IC4uLiB9XG5cdCAgb25Ecm9wZG93bk9wZW4gICAgICAgOiBudWxsLCAvLyBmdW5jdGlvbihkcm9wZG93bikgeyAuLi4gfVxuXHQgIG9uRHJvcGRvd25DbG9zZSAgICAgIDogbnVsbCwgLy8gZnVuY3Rpb24oZHJvcGRvd24pIHsgLi4uIH1cblx0ICBvblR5cGUgICAgICAgICAgICAgICA6IG51bGwsIC8vIGZ1bmN0aW9uKHN0cikgeyAuLi4gfVxuXHQgIG9uRGVsZXRlICAgICAgICAgICAgIDogbnVsbCwgLy8gZnVuY3Rpb24odmFsdWVzKSB7IC4uLiB9XG5cdCAgKi9cblx0ICByZW5kZXI6IHtcblx0ICAgIC8qXG5cdCAgICBpdGVtOiBudWxsLFxuXHQgICAgb3B0Z3JvdXA6IG51bGwsXG5cdCAgICBvcHRncm91cF9oZWFkZXI6IG51bGwsXG5cdCAgICBvcHRpb246IG51bGwsXG5cdCAgICBvcHRpb25fY3JlYXRlOiBudWxsXG5cdCAgICAqL1xuXHQgIH1cblx0fTtcblxuXHQvKipcblx0ICogQ29udmVydHMgYSBzY2FsYXIgdG8gaXRzIGJlc3Qgc3RyaW5nIHJlcHJlc2VudGF0aW9uXG5cdCAqIGZvciBoYXNoIGtleXMgYW5kIEhUTUwgYXR0cmlidXRlIHZhbHVlcy5cblx0ICpcblx0ICogVHJhbnNmb3JtYXRpb25zOlxuXHQgKiAgICdzdHInICAgICAtPiAnc3RyJ1xuXHQgKiAgIG51bGwgICAgICAtPiAnJ1xuXHQgKiAgIHVuZGVmaW5lZCAtPiAnJ1xuXHQgKiAgIHRydWUgICAgICAtPiAnMSdcblx0ICogICBmYWxzZSAgICAgLT4gJzAnXG5cdCAqICAgMCAgICAgICAgIC0+ICcwJ1xuXHQgKiAgIDEgICAgICAgICAtPiAnMSdcblx0ICpcblx0ICovXG5cdGNvbnN0IGhhc2hfa2V5ID0gdmFsdWUgPT4ge1xuXHQgIGlmICh0eXBlb2YgdmFsdWUgPT09ICd1bmRlZmluZWQnIHx8IHZhbHVlID09PSBudWxsKSByZXR1cm4gbnVsbDtcblx0ICByZXR1cm4gZ2V0X2hhc2godmFsdWUpO1xuXHR9O1xuXHRjb25zdCBnZXRfaGFzaCA9IHZhbHVlID0+IHtcblx0ICBpZiAodHlwZW9mIHZhbHVlID09PSAnYm9vbGVhbicpIHJldHVybiB2YWx1ZSA/ICcxJyA6ICcwJztcblx0ICByZXR1cm4gdmFsdWUgKyAnJztcblx0fTtcblx0LyoqXG5cdCAqIEVzY2FwZXMgYSBzdHJpbmcgZm9yIHVzZSB3aXRoaW4gSFRNTC5cblx0ICpcblx0ICovXG5cblx0Y29uc3QgZXNjYXBlX2h0bWwgPSBzdHIgPT4ge1xuXHQgIHJldHVybiAoc3RyICsgJycpLnJlcGxhY2UoLyYvZywgJyZhbXA7JykucmVwbGFjZSgvPC9nLCAnJmx0OycpLnJlcGxhY2UoLz4vZywgJyZndDsnKS5yZXBsYWNlKC9cIi9nLCAnJnF1b3Q7Jyk7XG5cdH07XG5cdC8qKlxuXHQgKiBEZWJvdW5jZSB0aGUgdXNlciBwcm92aWRlZCBsb2FkIGZ1bmN0aW9uXG5cdCAqXG5cdCAqL1xuXG5cdGNvbnN0IGxvYWREZWJvdW5jZSA9IChmbiwgZGVsYXkpID0+IHtcblx0ICB2YXIgdGltZW91dDtcblx0ICByZXR1cm4gZnVuY3Rpb24gKHZhbHVlLCBjYWxsYmFjaykge1xuXHQgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG5cdCAgICBpZiAodGltZW91dCkge1xuXHQgICAgICBzZWxmLmxvYWRpbmcgPSBNYXRoLm1heChzZWxmLmxvYWRpbmcgLSAxLCAwKTtcblx0ICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuXHQgICAgfVxuXG5cdCAgICB0aW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cdCAgICAgIHRpbWVvdXQgPSBudWxsO1xuXHQgICAgICBzZWxmLmxvYWRlZFNlYXJjaGVzW3ZhbHVlXSA9IHRydWU7XG5cdCAgICAgIGZuLmNhbGwoc2VsZiwgdmFsdWUsIGNhbGxiYWNrKTtcblx0ICAgIH0sIGRlbGF5KTtcblx0ICB9O1xuXHR9O1xuXHQvKipcblx0ICogRGVib3VuY2UgYWxsIGZpcmVkIGV2ZW50cyB0eXBlcyBsaXN0ZWQgaW4gYHR5cGVzYFxuXHQgKiB3aGlsZSBleGVjdXRpbmcgdGhlIHByb3ZpZGVkIGBmbmAuXG5cdCAqXG5cdCAqL1xuXG5cdGNvbnN0IGRlYm91bmNlX2V2ZW50cyA9IChzZWxmLCB0eXBlcywgZm4pID0+IHtcblx0ICB2YXIgdHlwZTtcblx0ICB2YXIgdHJpZ2dlciA9IHNlbGYudHJpZ2dlcjtcblx0ICB2YXIgZXZlbnRfYXJncyA9IHt9OyAvLyBvdmVycmlkZSB0cmlnZ2VyIG1ldGhvZFxuXG5cdCAgc2VsZi50cmlnZ2VyID0gZnVuY3Rpb24gKCkge1xuXHQgICAgdmFyIHR5cGUgPSBhcmd1bWVudHNbMF07XG5cblx0ICAgIGlmICh0eXBlcy5pbmRleE9mKHR5cGUpICE9PSAtMSkge1xuXHQgICAgICBldmVudF9hcmdzW3R5cGVdID0gYXJndW1lbnRzO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgcmV0dXJuIHRyaWdnZXIuYXBwbHkoc2VsZiwgYXJndW1lbnRzKTtcblx0ICAgIH1cblx0ICB9OyAvLyBpbnZva2UgcHJvdmlkZWQgZnVuY3Rpb25cblxuXG5cdCAgZm4uYXBwbHkoc2VsZiwgW10pO1xuXHQgIHNlbGYudHJpZ2dlciA9IHRyaWdnZXI7IC8vIHRyaWdnZXIgcXVldWVkIGV2ZW50c1xuXG5cdCAgZm9yICh0eXBlIG9mIHR5cGVzKSB7XG5cdCAgICBpZiAodHlwZSBpbiBldmVudF9hcmdzKSB7XG5cdCAgICAgIHRyaWdnZXIuYXBwbHkoc2VsZiwgZXZlbnRfYXJnc1t0eXBlXSk7XG5cdCAgICB9XG5cdCAgfVxuXHR9O1xuXHQvKipcblx0ICogRGV0ZXJtaW5lcyB0aGUgY3VycmVudCBzZWxlY3Rpb24gd2l0aGluIGEgdGV4dCBpbnB1dCBjb250cm9sLlxuXHQgKiBSZXR1cm5zIGFuIG9iamVjdCBjb250YWluaW5nOlxuXHQgKiAgIC0gc3RhcnRcblx0ICogICAtIGxlbmd0aFxuXHQgKlxuXHQgKi9cblxuXHRjb25zdCBnZXRTZWxlY3Rpb24gPSBpbnB1dCA9PiB7XG5cdCAgcmV0dXJuIHtcblx0ICAgIHN0YXJ0OiBpbnB1dC5zZWxlY3Rpb25TdGFydCB8fCAwLFxuXHQgICAgbGVuZ3RoOiAoaW5wdXQuc2VsZWN0aW9uRW5kIHx8IDApIC0gKGlucHV0LnNlbGVjdGlvblN0YXJ0IHx8IDApXG5cdCAgfTtcblx0fTtcblx0LyoqXG5cdCAqIFByZXZlbnQgZGVmYXVsdFxuXHQgKlxuXHQgKi9cblxuXHRjb25zdCBwcmV2ZW50RGVmYXVsdCA9IChldnQsIHN0b3AgPSBmYWxzZSkgPT4ge1xuXHQgIGlmIChldnQpIHtcblx0ICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdCAgICBpZiAoc3RvcCkge1xuXHQgICAgICBldnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdCAgICB9XG5cdCAgfVxuXHR9O1xuXHQvKipcblx0ICogQWRkIGV2ZW50IGhlbHBlclxuXHQgKlxuXHQgKi9cblxuXHRjb25zdCBhZGRFdmVudCA9ICh0YXJnZXQsIHR5cGUsIGNhbGxiYWNrLCBvcHRpb25zKSA9PiB7XG5cdCAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgY2FsbGJhY2ssIG9wdGlvbnMpO1xuXHR9O1xuXHQvKipcblx0ICogUmV0dXJuIHRydWUgaWYgdGhlIHJlcXVlc3RlZCBrZXkgaXMgZG93blxuXHQgKiBXaWxsIHJldHVybiBmYWxzZSBpZiBtb3JlIHRoYW4gb25lIGNvbnRyb2wgY2hhcmFjdGVyIGlzIHByZXNzZWQgKCB3aGVuIFtjdHJsK3NoaWZ0K2FdICE9IFtjdHJsK2FdIClcblx0ICogVGhlIGN1cnJlbnQgZXZ0IG1heSBub3QgYWx3YXlzIHNldCAoIGVnIGNhbGxpbmcgYWR2YW5jZVNlbGVjdGlvbigpIClcblx0ICpcblx0ICovXG5cblx0Y29uc3QgaXNLZXlEb3duID0gKGtleV9uYW1lLCBldnQpID0+IHtcblx0ICBpZiAoIWV2dCkge1xuXHQgICAgcmV0dXJuIGZhbHNlO1xuXHQgIH1cblxuXHQgIGlmICghZXZ0W2tleV9uYW1lXSkge1xuXHQgICAgcmV0dXJuIGZhbHNlO1xuXHQgIH1cblxuXHQgIHZhciBjb3VudCA9IChldnQuYWx0S2V5ID8gMSA6IDApICsgKGV2dC5jdHJsS2V5ID8gMSA6IDApICsgKGV2dC5zaGlmdEtleSA/IDEgOiAwKSArIChldnQubWV0YUtleSA/IDEgOiAwKTtcblxuXHQgIGlmIChjb3VudCA9PT0gMSkge1xuXHQgICAgcmV0dXJuIHRydWU7XG5cdCAgfVxuXG5cdCAgcmV0dXJuIGZhbHNlO1xuXHR9O1xuXHQvKipcblx0ICogR2V0IHRoZSBpZCBvZiBhbiBlbGVtZW50XG5cdCAqIElmIHRoZSBpZCBhdHRyaWJ1dGUgaXMgbm90IHNldCwgc2V0IHRoZSBhdHRyaWJ1dGUgd2l0aCB0aGUgZ2l2ZW4gaWRcblx0ICpcblx0ICovXG5cblx0Y29uc3QgZ2V0SWQgPSAoZWwsIGlkKSA9PiB7XG5cdCAgY29uc3QgZXhpc3RpbmdfaWQgPSBlbC5nZXRBdHRyaWJ1dGUoJ2lkJyk7XG5cblx0ICBpZiAoZXhpc3RpbmdfaWQpIHtcblx0ICAgIHJldHVybiBleGlzdGluZ19pZDtcblx0ICB9XG5cblx0ICBlbC5zZXRBdHRyaWJ1dGUoJ2lkJywgaWQpO1xuXHQgIHJldHVybiBpZDtcblx0fTtcblx0LyoqXG5cdCAqIFJldHVybnMgYSBzdHJpbmcgd2l0aCBiYWNrc2xhc2hlcyBhZGRlZCBiZWZvcmUgY2hhcmFjdGVycyB0aGF0IG5lZWQgdG8gYmUgZXNjYXBlZC5cblx0ICovXG5cblx0Y29uc3QgYWRkU2xhc2hlcyA9IHN0ciA9PiB7XG5cdCAgcmV0dXJuIHN0ci5yZXBsYWNlKC9bXFxcXFwiJ10vZywgJ1xcXFwkJicpO1xuXHR9O1xuXHQvKipcblx0ICpcblx0ICovXG5cblx0Y29uc3QgYXBwZW5kID0gKHBhcmVudCwgbm9kZSkgPT4ge1xuXHQgIGlmIChub2RlKSBwYXJlbnQuYXBwZW5kKG5vZGUpO1xuXHR9O1xuXG5cdGZ1bmN0aW9uIGdldFNldHRpbmdzKGlucHV0LCBzZXR0aW5nc191c2VyKSB7XG5cdCAgdmFyIHNldHRpbmdzID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdHMsIHNldHRpbmdzX3VzZXIpO1xuXHQgIHZhciBhdHRyX2RhdGEgPSBzZXR0aW5ncy5kYXRhQXR0cjtcblx0ICB2YXIgZmllbGRfbGFiZWwgPSBzZXR0aW5ncy5sYWJlbEZpZWxkO1xuXHQgIHZhciBmaWVsZF92YWx1ZSA9IHNldHRpbmdzLnZhbHVlRmllbGQ7XG5cdCAgdmFyIGZpZWxkX2Rpc2FibGVkID0gc2V0dGluZ3MuZGlzYWJsZWRGaWVsZDtcblx0ICB2YXIgZmllbGRfb3B0Z3JvdXAgPSBzZXR0aW5ncy5vcHRncm91cEZpZWxkO1xuXHQgIHZhciBmaWVsZF9vcHRncm91cF9sYWJlbCA9IHNldHRpbmdzLm9wdGdyb3VwTGFiZWxGaWVsZDtcblx0ICB2YXIgZmllbGRfb3B0Z3JvdXBfdmFsdWUgPSBzZXR0aW5ncy5vcHRncm91cFZhbHVlRmllbGQ7XG5cdCAgdmFyIHRhZ19uYW1lID0gaW5wdXQudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xuXHQgIHZhciBwbGFjZWhvbGRlciA9IGlucHV0LmdldEF0dHJpYnV0ZSgncGxhY2Vob2xkZXInKSB8fCBpbnB1dC5nZXRBdHRyaWJ1dGUoJ2RhdGEtcGxhY2Vob2xkZXInKTtcblxuXHQgIGlmICghcGxhY2Vob2xkZXIgJiYgIXNldHRpbmdzLmFsbG93RW1wdHlPcHRpb24pIHtcblx0ICAgIGxldCBvcHRpb24gPSBpbnB1dC5xdWVyeVNlbGVjdG9yKCdvcHRpb25bdmFsdWU9XCJcIl0nKTtcblxuXHQgICAgaWYgKG9wdGlvbikge1xuXHQgICAgICBwbGFjZWhvbGRlciA9IG9wdGlvbi50ZXh0Q29udGVudDtcblx0ICAgIH1cblx0ICB9XG5cblx0ICB2YXIgc2V0dGluZ3NfZWxlbWVudCA9IHtcblx0ICAgIHBsYWNlaG9sZGVyOiBwbGFjZWhvbGRlcixcblx0ICAgIG9wdGlvbnM6IFtdLFxuXHQgICAgb3B0Z3JvdXBzOiBbXSxcblx0ICAgIGl0ZW1zOiBbXSxcblx0ICAgIG1heEl0ZW1zOiBudWxsXG5cdCAgfTtcblx0ICAvKipcblx0ICAgKiBJbml0aWFsaXplIGZyb20gYSA8c2VsZWN0PiBlbGVtZW50LlxuXHQgICAqXG5cdCAgICovXG5cblx0ICB2YXIgaW5pdF9zZWxlY3QgPSAoKSA9PiB7XG5cdCAgICB2YXIgdGFnTmFtZTtcblx0ICAgIHZhciBvcHRpb25zID0gc2V0dGluZ3NfZWxlbWVudC5vcHRpb25zO1xuXHQgICAgdmFyIG9wdGlvbnNNYXAgPSB7fTtcblx0ICAgIHZhciBncm91cF9jb3VudCA9IDE7XG5cblx0ICAgIHZhciByZWFkRGF0YSA9IGVsID0+IHtcblx0ICAgICAgdmFyIGRhdGEgPSBPYmplY3QuYXNzaWduKHt9LCBlbC5kYXRhc2V0KTsgLy8gZ2V0IHBsYWluIG9iamVjdCBmcm9tIERPTVN0cmluZ01hcFxuXG5cdCAgICAgIHZhciBqc29uID0gYXR0cl9kYXRhICYmIGRhdGFbYXR0cl9kYXRhXTtcblxuXHQgICAgICBpZiAodHlwZW9mIGpzb24gPT09ICdzdHJpbmcnICYmIGpzb24ubGVuZ3RoKSB7XG5cdCAgICAgICAgZGF0YSA9IE9iamVjdC5hc3NpZ24oZGF0YSwgSlNPTi5wYXJzZShqc29uKSk7XG5cdCAgICAgIH1cblxuXHQgICAgICByZXR1cm4gZGF0YTtcblx0ICAgIH07XG5cblx0ICAgIHZhciBhZGRPcHRpb24gPSAob3B0aW9uLCBncm91cCkgPT4ge1xuXHQgICAgICB2YXIgdmFsdWUgPSBoYXNoX2tleShvcHRpb24udmFsdWUpO1xuXHQgICAgICBpZiAodmFsdWUgPT0gbnVsbCkgcmV0dXJuO1xuXHQgICAgICBpZiAoIXZhbHVlICYmICFzZXR0aW5ncy5hbGxvd0VtcHR5T3B0aW9uKSByZXR1cm47IC8vIGlmIHRoZSBvcHRpb24gYWxyZWFkeSBleGlzdHMsIGl0J3MgcHJvYmFibHkgYmVlblxuXHQgICAgICAvLyBkdXBsaWNhdGVkIGluIGFub3RoZXIgb3B0Z3JvdXAuIGluIHRoaXMgY2FzZSwgcHVzaFxuXHQgICAgICAvLyB0aGUgY3VycmVudCBncm91cCB0byB0aGUgXCJvcHRncm91cFwiIHByb3BlcnR5IG9uIHRoZVxuXHQgICAgICAvLyBleGlzdGluZyBvcHRpb24gc28gdGhhdCBpdCdzIHJlbmRlcmVkIGluIGJvdGggcGxhY2VzLlxuXG5cdCAgICAgIGlmIChvcHRpb25zTWFwLmhhc093blByb3BlcnR5KHZhbHVlKSkge1xuXHQgICAgICAgIGlmIChncm91cCkge1xuXHQgICAgICAgICAgdmFyIGFyciA9IG9wdGlvbnNNYXBbdmFsdWVdW2ZpZWxkX29wdGdyb3VwXTtcblxuXHQgICAgICAgICAgaWYgKCFhcnIpIHtcblx0ICAgICAgICAgICAgb3B0aW9uc01hcFt2YWx1ZV1bZmllbGRfb3B0Z3JvdXBdID0gZ3JvdXA7XG5cdCAgICAgICAgICB9IGVsc2UgaWYgKCFBcnJheS5pc0FycmF5KGFycikpIHtcblx0ICAgICAgICAgICAgb3B0aW9uc01hcFt2YWx1ZV1bZmllbGRfb3B0Z3JvdXBdID0gW2FyciwgZ3JvdXBdO1xuXHQgICAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgICAgYXJyLnB1c2goZ3JvdXApO1xuXHQgICAgICAgICAgfVxuXHQgICAgICAgIH1cblx0ICAgICAgfSBlbHNlIHtcblx0ICAgICAgICB2YXIgb3B0aW9uX2RhdGEgPSByZWFkRGF0YShvcHRpb24pO1xuXHQgICAgICAgIG9wdGlvbl9kYXRhW2ZpZWxkX2xhYmVsXSA9IG9wdGlvbl9kYXRhW2ZpZWxkX2xhYmVsXSB8fCBvcHRpb24udGV4dENvbnRlbnQ7XG5cdCAgICAgICAgb3B0aW9uX2RhdGFbZmllbGRfdmFsdWVdID0gb3B0aW9uX2RhdGFbZmllbGRfdmFsdWVdIHx8IHZhbHVlO1xuXHQgICAgICAgIG9wdGlvbl9kYXRhW2ZpZWxkX2Rpc2FibGVkXSA9IG9wdGlvbl9kYXRhW2ZpZWxkX2Rpc2FibGVkXSB8fCBvcHRpb24uZGlzYWJsZWQ7XG5cdCAgICAgICAgb3B0aW9uX2RhdGFbZmllbGRfb3B0Z3JvdXBdID0gb3B0aW9uX2RhdGFbZmllbGRfb3B0Z3JvdXBdIHx8IGdyb3VwO1xuXHQgICAgICAgIG9wdGlvbl9kYXRhLiRvcHRpb24gPSBvcHRpb247XG5cdCAgICAgICAgb3B0aW9uc01hcFt2YWx1ZV0gPSBvcHRpb25fZGF0YTtcblx0ICAgICAgICBvcHRpb25zLnB1c2gob3B0aW9uX2RhdGEpO1xuXHQgICAgICB9XG5cblx0ICAgICAgaWYgKG9wdGlvbi5zZWxlY3RlZCkge1xuXHQgICAgICAgIHNldHRpbmdzX2VsZW1lbnQuaXRlbXMucHVzaCh2YWx1ZSk7XG5cdCAgICAgIH1cblx0ICAgIH07XG5cblx0ICAgIHZhciBhZGRHcm91cCA9IG9wdGdyb3VwID0+IHtcblx0ICAgICAgdmFyIGlkLCBvcHRncm91cF9kYXRhO1xuXHQgICAgICBvcHRncm91cF9kYXRhID0gcmVhZERhdGEob3B0Z3JvdXApO1xuXHQgICAgICBvcHRncm91cF9kYXRhW2ZpZWxkX29wdGdyb3VwX2xhYmVsXSA9IG9wdGdyb3VwX2RhdGFbZmllbGRfb3B0Z3JvdXBfbGFiZWxdIHx8IG9wdGdyb3VwLmdldEF0dHJpYnV0ZSgnbGFiZWwnKSB8fCAnJztcblx0ICAgICAgb3B0Z3JvdXBfZGF0YVtmaWVsZF9vcHRncm91cF92YWx1ZV0gPSBvcHRncm91cF9kYXRhW2ZpZWxkX29wdGdyb3VwX3ZhbHVlXSB8fCBncm91cF9jb3VudCsrO1xuXHQgICAgICBvcHRncm91cF9kYXRhW2ZpZWxkX2Rpc2FibGVkXSA9IG9wdGdyb3VwX2RhdGFbZmllbGRfZGlzYWJsZWRdIHx8IG9wdGdyb3VwLmRpc2FibGVkO1xuXHQgICAgICBzZXR0aW5nc19lbGVtZW50Lm9wdGdyb3Vwcy5wdXNoKG9wdGdyb3VwX2RhdGEpO1xuXHQgICAgICBpZCA9IG9wdGdyb3VwX2RhdGFbZmllbGRfb3B0Z3JvdXBfdmFsdWVdO1xuXHQgICAgICBpdGVyYXRlKG9wdGdyb3VwLmNoaWxkcmVuLCBvcHRpb24gPT4ge1xuXHQgICAgICAgIGFkZE9wdGlvbihvcHRpb24sIGlkKTtcblx0ICAgICAgfSk7XG5cdCAgICB9O1xuXG5cdCAgICBzZXR0aW5nc19lbGVtZW50Lm1heEl0ZW1zID0gaW5wdXQuaGFzQXR0cmlidXRlKCdtdWx0aXBsZScpID8gbnVsbCA6IDE7XG5cdCAgICBpdGVyYXRlKGlucHV0LmNoaWxkcmVuLCBjaGlsZCA9PiB7XG5cdCAgICAgIHRhZ05hbWUgPSBjaGlsZC50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG5cblx0ICAgICAgaWYgKHRhZ05hbWUgPT09ICdvcHRncm91cCcpIHtcblx0ICAgICAgICBhZGRHcm91cChjaGlsZCk7XG5cdCAgICAgIH0gZWxzZSBpZiAodGFnTmFtZSA9PT0gJ29wdGlvbicpIHtcblx0ICAgICAgICBhZGRPcHRpb24oY2hpbGQpO1xuXHQgICAgICB9XG5cdCAgICB9KTtcblx0ICB9O1xuXHQgIC8qKlxuXHQgICAqIEluaXRpYWxpemUgZnJvbSBhIDxpbnB1dCB0eXBlPVwidGV4dFwiPiBlbGVtZW50LlxuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIHZhciBpbml0X3RleHRib3ggPSAoKSA9PiB7XG5cdCAgICBjb25zdCBkYXRhX3JhdyA9IGlucHV0LmdldEF0dHJpYnV0ZShhdHRyX2RhdGEpO1xuXG5cdCAgICBpZiAoIWRhdGFfcmF3KSB7XG5cdCAgICAgIHZhciB2YWx1ZSA9IGlucHV0LnZhbHVlLnRyaW0oKSB8fCAnJztcblx0ICAgICAgaWYgKCFzZXR0aW5ncy5hbGxvd0VtcHR5T3B0aW9uICYmICF2YWx1ZS5sZW5ndGgpIHJldHVybjtcblx0ICAgICAgY29uc3QgdmFsdWVzID0gdmFsdWUuc3BsaXQoc2V0dGluZ3MuZGVsaW1pdGVyKTtcblx0ICAgICAgaXRlcmF0ZSh2YWx1ZXMsIHZhbHVlID0+IHtcblx0ICAgICAgICBjb25zdCBvcHRpb24gPSB7fTtcblx0ICAgICAgICBvcHRpb25bZmllbGRfbGFiZWxdID0gdmFsdWU7XG5cdCAgICAgICAgb3B0aW9uW2ZpZWxkX3ZhbHVlXSA9IHZhbHVlO1xuXHQgICAgICAgIHNldHRpbmdzX2VsZW1lbnQub3B0aW9ucy5wdXNoKG9wdGlvbik7XG5cdCAgICAgIH0pO1xuXHQgICAgICBzZXR0aW5nc19lbGVtZW50Lml0ZW1zID0gdmFsdWVzO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgc2V0dGluZ3NfZWxlbWVudC5vcHRpb25zID0gSlNPTi5wYXJzZShkYXRhX3Jhdyk7XG5cdCAgICAgIGl0ZXJhdGUoc2V0dGluZ3NfZWxlbWVudC5vcHRpb25zLCBvcHQgPT4ge1xuXHQgICAgICAgIHNldHRpbmdzX2VsZW1lbnQuaXRlbXMucHVzaChvcHRbZmllbGRfdmFsdWVdKTtcblx0ICAgICAgfSk7XG5cdCAgICB9XG5cdCAgfTtcblxuXHQgIGlmICh0YWdfbmFtZSA9PT0gJ3NlbGVjdCcpIHtcblx0ICAgIGluaXRfc2VsZWN0KCk7XG5cdCAgfSBlbHNlIHtcblx0ICAgIGluaXRfdGV4dGJveCgpO1xuXHQgIH1cblxuXHQgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0cywgc2V0dGluZ3NfZWxlbWVudCwgc2V0dGluZ3NfdXNlcik7XG5cdH1cblxuXHR2YXIgaW5zdGFuY2VfaSA9IDA7XG5cdGNsYXNzIFRvbVNlbGVjdCBleHRlbmRzIE1pY3JvUGx1Z2luKE1pY3JvRXZlbnQpIHtcblx0ICAvLyBAZGVwcmVjYXRlZCAxLjhcblx0ICBjb25zdHJ1Y3RvcihpbnB1dF9hcmcsIHVzZXJfc2V0dGluZ3MpIHtcblx0ICAgIHN1cGVyKCk7XG5cdCAgICB0aGlzLmNvbnRyb2xfaW5wdXQgPSB2b2lkIDA7XG5cdCAgICB0aGlzLndyYXBwZXIgPSB2b2lkIDA7XG5cdCAgICB0aGlzLmRyb3Bkb3duID0gdm9pZCAwO1xuXHQgICAgdGhpcy5jb250cm9sID0gdm9pZCAwO1xuXHQgICAgdGhpcy5kcm9wZG93bl9jb250ZW50ID0gdm9pZCAwO1xuXHQgICAgdGhpcy5mb2N1c19ub2RlID0gdm9pZCAwO1xuXHQgICAgdGhpcy5vcmRlciA9IDA7XG5cdCAgICB0aGlzLnNldHRpbmdzID0gdm9pZCAwO1xuXHQgICAgdGhpcy5pbnB1dCA9IHZvaWQgMDtcblx0ICAgIHRoaXMudGFiSW5kZXggPSB2b2lkIDA7XG5cdCAgICB0aGlzLmlzX3NlbGVjdF90YWcgPSB2b2lkIDA7XG5cdCAgICB0aGlzLnJ0bCA9IHZvaWQgMDtcblx0ICAgIHRoaXMuaW5wdXRJZCA9IHZvaWQgMDtcblx0ICAgIHRoaXMuX2Rlc3Ryb3kgPSB2b2lkIDA7XG5cdCAgICB0aGlzLnNpZnRlciA9IHZvaWQgMDtcblx0ICAgIHRoaXMuaXNPcGVuID0gZmFsc2U7XG5cdCAgICB0aGlzLmlzRGlzYWJsZWQgPSBmYWxzZTtcblx0ICAgIHRoaXMuaXNSZXF1aXJlZCA9IHZvaWQgMDtcblx0ICAgIHRoaXMuaXNJbnZhbGlkID0gZmFsc2U7XG5cdCAgICB0aGlzLmlzVmFsaWQgPSB0cnVlO1xuXHQgICAgdGhpcy5pc0xvY2tlZCA9IGZhbHNlO1xuXHQgICAgdGhpcy5pc0ZvY3VzZWQgPSBmYWxzZTtcblx0ICAgIHRoaXMuaXNJbnB1dEhpZGRlbiA9IGZhbHNlO1xuXHQgICAgdGhpcy5pc1NldHVwID0gZmFsc2U7XG5cdCAgICB0aGlzLmlnbm9yZUZvY3VzID0gZmFsc2U7XG5cdCAgICB0aGlzLmlnbm9yZUhvdmVyID0gZmFsc2U7XG5cdCAgICB0aGlzLmhhc09wdGlvbnMgPSBmYWxzZTtcblx0ICAgIHRoaXMuY3VycmVudFJlc3VsdHMgPSB2b2lkIDA7XG5cdCAgICB0aGlzLmxhc3RWYWx1ZSA9ICcnO1xuXHQgICAgdGhpcy5jYXJldFBvcyA9IDA7XG5cdCAgICB0aGlzLmxvYWRpbmcgPSAwO1xuXHQgICAgdGhpcy5sb2FkZWRTZWFyY2hlcyA9IHt9O1xuXHQgICAgdGhpcy5hY3RpdmVPcHRpb24gPSBudWxsO1xuXHQgICAgdGhpcy5hY3RpdmVJdGVtcyA9IFtdO1xuXHQgICAgdGhpcy5vcHRncm91cHMgPSB7fTtcblx0ICAgIHRoaXMub3B0aW9ucyA9IHt9O1xuXHQgICAgdGhpcy51c2VyT3B0aW9ucyA9IHt9O1xuXHQgICAgdGhpcy5pdGVtcyA9IFtdO1xuXHQgICAgaW5zdGFuY2VfaSsrO1xuXHQgICAgdmFyIGRpcjtcblx0ICAgIHZhciBpbnB1dCA9IGdldERvbShpbnB1dF9hcmcpO1xuXG5cdCAgICBpZiAoaW5wdXQudG9tc2VsZWN0KSB7XG5cdCAgICAgIHRocm93IG5ldyBFcnJvcignVG9tIFNlbGVjdCBhbHJlYWR5IGluaXRpYWxpemVkIG9uIHRoaXMgZWxlbWVudCcpO1xuXHQgICAgfVxuXG5cdCAgICBpbnB1dC50b21zZWxlY3QgPSB0aGlzOyAvLyBkZXRlY3QgcnRsIGVudmlyb25tZW50XG5cblx0ICAgIHZhciBjb21wdXRlZFN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUgJiYgd2luZG93LmdldENvbXB1dGVkU3R5bGUoaW5wdXQsIG51bGwpO1xuXHQgICAgZGlyID0gY29tcHV0ZWRTdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKCdkaXJlY3Rpb24nKTsgLy8gc2V0dXAgZGVmYXVsdCBzdGF0ZVxuXG5cdCAgICBjb25zdCBzZXR0aW5ncyA9IGdldFNldHRpbmdzKGlucHV0LCB1c2VyX3NldHRpbmdzKTtcblx0ICAgIHRoaXMuc2V0dGluZ3MgPSBzZXR0aW5ncztcblx0ICAgIHRoaXMuaW5wdXQgPSBpbnB1dDtcblx0ICAgIHRoaXMudGFiSW5kZXggPSBpbnB1dC50YWJJbmRleCB8fCAwO1xuXHQgICAgdGhpcy5pc19zZWxlY3RfdGFnID0gaW5wdXQudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnc2VsZWN0Jztcblx0ICAgIHRoaXMucnRsID0gL3J0bC9pLnRlc3QoZGlyKTtcblx0ICAgIHRoaXMuaW5wdXRJZCA9IGdldElkKGlucHV0LCAndG9tc2VsZWN0LScgKyBpbnN0YW5jZV9pKTtcblx0ICAgIHRoaXMuaXNSZXF1aXJlZCA9IGlucHV0LnJlcXVpcmVkOyAvLyBzZWFyY2ggc3lzdGVtXG5cblx0ICAgIHRoaXMuc2lmdGVyID0gbmV3IFNpZnRlcih0aGlzLm9wdGlvbnMsIHtcblx0ICAgICAgZGlhY3JpdGljczogc2V0dGluZ3MuZGlhY3JpdGljc1xuXHQgICAgfSk7IC8vIG9wdGlvbi1kZXBlbmRlbnQgZGVmYXVsdHNcblxuXHQgICAgc2V0dGluZ3MubW9kZSA9IHNldHRpbmdzLm1vZGUgfHwgKHNldHRpbmdzLm1heEl0ZW1zID09PSAxID8gJ3NpbmdsZScgOiAnbXVsdGknKTtcblxuXHQgICAgaWYgKHR5cGVvZiBzZXR0aW5ncy5oaWRlU2VsZWN0ZWQgIT09ICdib29sZWFuJykge1xuXHQgICAgICBzZXR0aW5ncy5oaWRlU2VsZWN0ZWQgPSBzZXR0aW5ncy5tb2RlID09PSAnbXVsdGknO1xuXHQgICAgfVxuXG5cdCAgICBpZiAodHlwZW9mIHNldHRpbmdzLmhpZGVQbGFjZWhvbGRlciAhPT0gJ2Jvb2xlYW4nKSB7XG5cdCAgICAgIHNldHRpbmdzLmhpZGVQbGFjZWhvbGRlciA9IHNldHRpbmdzLm1vZGUgIT09ICdtdWx0aSc7XG5cdCAgICB9IC8vIHNldCB1cCBjcmVhdGVGaWx0ZXIgY2FsbGJhY2tcblxuXG5cdCAgICB2YXIgZmlsdGVyID0gc2V0dGluZ3MuY3JlYXRlRmlsdGVyO1xuXG5cdCAgICBpZiAodHlwZW9mIGZpbHRlciAhPT0gJ2Z1bmN0aW9uJykge1xuXHQgICAgICBpZiAodHlwZW9mIGZpbHRlciA9PT0gJ3N0cmluZycpIHtcblx0ICAgICAgICBmaWx0ZXIgPSBuZXcgUmVnRXhwKGZpbHRlcik7XG5cdCAgICAgIH1cblxuXHQgICAgICBpZiAoZmlsdGVyIGluc3RhbmNlb2YgUmVnRXhwKSB7XG5cdCAgICAgICAgc2V0dGluZ3MuY3JlYXRlRmlsdGVyID0gaW5wdXQgPT4gZmlsdGVyLnRlc3QoaW5wdXQpO1xuXHQgICAgICB9IGVsc2Uge1xuXHQgICAgICAgIHNldHRpbmdzLmNyZWF0ZUZpbHRlciA9IHZhbHVlID0+IHtcblx0ICAgICAgICAgIHJldHVybiB0aGlzLnNldHRpbmdzLmR1cGxpY2F0ZXMgfHwgIXRoaXMub3B0aW9uc1t2YWx1ZV07XG5cdCAgICAgICAgfTtcblx0ICAgICAgfVxuXHQgICAgfVxuXG5cdCAgICB0aGlzLmluaXRpYWxpemVQbHVnaW5zKHNldHRpbmdzLnBsdWdpbnMpO1xuXHQgICAgdGhpcy5zZXR1cENhbGxiYWNrcygpO1xuXHQgICAgdGhpcy5zZXR1cFRlbXBsYXRlcygpOyAvLyBDcmVhdGUgYWxsIGVsZW1lbnRzXG5cblx0ICAgIGNvbnN0IHdyYXBwZXIgPSBnZXREb20oJzxkaXY+Jyk7XG5cdCAgICBjb25zdCBjb250cm9sID0gZ2V0RG9tKCc8ZGl2PicpO1xuXG5cdCAgICBjb25zdCBkcm9wZG93biA9IHRoaXMuX3JlbmRlcignZHJvcGRvd24nKTtcblxuXHQgICAgY29uc3QgZHJvcGRvd25fY29udGVudCA9IGdldERvbShgPGRpdiByb2xlPVwibGlzdGJveFwiIHRhYmluZGV4PVwiLTFcIj5gKTtcblx0ICAgIGNvbnN0IGNsYXNzZXMgPSB0aGlzLmlucHV0LmdldEF0dHJpYnV0ZSgnY2xhc3MnKSB8fCAnJztcblx0ICAgIGNvbnN0IGlucHV0TW9kZSA9IHNldHRpbmdzLm1vZGU7XG5cdCAgICB2YXIgY29udHJvbF9pbnB1dDtcblx0ICAgIGFkZENsYXNzZXMod3JhcHBlciwgc2V0dGluZ3Mud3JhcHBlckNsYXNzLCBjbGFzc2VzLCBpbnB1dE1vZGUpO1xuXHQgICAgYWRkQ2xhc3Nlcyhjb250cm9sLCBzZXR0aW5ncy5jb250cm9sQ2xhc3MpO1xuXHQgICAgYXBwZW5kKHdyYXBwZXIsIGNvbnRyb2wpO1xuXHQgICAgYWRkQ2xhc3Nlcyhkcm9wZG93biwgc2V0dGluZ3MuZHJvcGRvd25DbGFzcywgaW5wdXRNb2RlKTtcblxuXHQgICAgaWYgKHNldHRpbmdzLmNvcHlDbGFzc2VzVG9Ecm9wZG93bikge1xuXHQgICAgICBhZGRDbGFzc2VzKGRyb3Bkb3duLCBjbGFzc2VzKTtcblx0ICAgIH1cblxuXHQgICAgYWRkQ2xhc3Nlcyhkcm9wZG93bl9jb250ZW50LCBzZXR0aW5ncy5kcm9wZG93bkNvbnRlbnRDbGFzcyk7XG5cdCAgICBhcHBlbmQoZHJvcGRvd24sIGRyb3Bkb3duX2NvbnRlbnQpO1xuXHQgICAgZ2V0RG9tKHNldHRpbmdzLmRyb3Bkb3duUGFyZW50IHx8IHdyYXBwZXIpLmFwcGVuZENoaWxkKGRyb3Bkb3duKTsgLy8gZGVmYXVsdCBjb250cm9sSW5wdXRcblxuXHQgICAgaWYgKGlzSHRtbFN0cmluZyhzZXR0aW5ncy5jb250cm9sSW5wdXQpKSB7XG5cdCAgICAgIGNvbnRyb2xfaW5wdXQgPSBnZXREb20oc2V0dGluZ3MuY29udHJvbElucHV0KTsgLy8gc2V0IGF0dHJpYnV0ZXNcblxuXHQgICAgICB2YXIgYXR0cnMgPSBbJ2F1dG9jb3JyZWN0JywgJ2F1dG9jYXBpdGFsaXplJywgJ2F1dG9jb21wbGV0ZSddO1xuXHQgICAgICBpdGVyYXRlJDEoYXR0cnMsIGF0dHIgPT4ge1xuXHQgICAgICAgIGlmIChpbnB1dC5nZXRBdHRyaWJ1dGUoYXR0cikpIHtcblx0ICAgICAgICAgIHNldEF0dHIoY29udHJvbF9pbnB1dCwge1xuXHQgICAgICAgICAgICBbYXR0cl06IGlucHV0LmdldEF0dHJpYnV0ZShhdHRyKVxuXHQgICAgICAgICAgfSk7XG5cdCAgICAgICAgfVxuXHQgICAgICB9KTtcblx0ICAgICAgY29udHJvbF9pbnB1dC50YWJJbmRleCA9IC0xO1xuXHQgICAgICBjb250cm9sLmFwcGVuZENoaWxkKGNvbnRyb2xfaW5wdXQpO1xuXHQgICAgICB0aGlzLmZvY3VzX25vZGUgPSBjb250cm9sX2lucHV0OyAvLyBkb20gZWxlbWVudFxuXHQgICAgfSBlbHNlIGlmIChzZXR0aW5ncy5jb250cm9sSW5wdXQpIHtcblx0ICAgICAgY29udHJvbF9pbnB1dCA9IGdldERvbShzZXR0aW5ncy5jb250cm9sSW5wdXQpO1xuXHQgICAgICB0aGlzLmZvY3VzX25vZGUgPSBjb250cm9sX2lucHV0O1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgY29udHJvbF9pbnB1dCA9IGdldERvbSgnPGlucHV0Lz4nKTtcblx0ICAgICAgdGhpcy5mb2N1c19ub2RlID0gY29udHJvbDtcblx0ICAgIH1cblxuXHQgICAgdGhpcy53cmFwcGVyID0gd3JhcHBlcjtcblx0ICAgIHRoaXMuZHJvcGRvd24gPSBkcm9wZG93bjtcblx0ICAgIHRoaXMuZHJvcGRvd25fY29udGVudCA9IGRyb3Bkb3duX2NvbnRlbnQ7XG5cdCAgICB0aGlzLmNvbnRyb2wgPSBjb250cm9sO1xuXHQgICAgdGhpcy5jb250cm9sX2lucHV0ID0gY29udHJvbF9pbnB1dDtcblx0ICAgIHRoaXMuc2V0dXAoKTtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogc2V0IHVwIGV2ZW50IGJpbmRpbmdzLlxuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIHNldHVwKCkge1xuXHQgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cdCAgICBjb25zdCBzZXR0aW5ncyA9IHNlbGYuc2V0dGluZ3M7XG5cdCAgICBjb25zdCBjb250cm9sX2lucHV0ID0gc2VsZi5jb250cm9sX2lucHV0O1xuXHQgICAgY29uc3QgZHJvcGRvd24gPSBzZWxmLmRyb3Bkb3duO1xuXHQgICAgY29uc3QgZHJvcGRvd25fY29udGVudCA9IHNlbGYuZHJvcGRvd25fY29udGVudDtcblx0ICAgIGNvbnN0IHdyYXBwZXIgPSBzZWxmLndyYXBwZXI7XG5cdCAgICBjb25zdCBjb250cm9sID0gc2VsZi5jb250cm9sO1xuXHQgICAgY29uc3QgaW5wdXQgPSBzZWxmLmlucHV0O1xuXHQgICAgY29uc3QgZm9jdXNfbm9kZSA9IHNlbGYuZm9jdXNfbm9kZTtcblx0ICAgIGNvbnN0IHBhc3NpdmVfZXZlbnQgPSB7XG5cdCAgICAgIHBhc3NpdmU6IHRydWVcblx0ICAgIH07XG5cdCAgICBjb25zdCBsaXN0Ym94SWQgPSBzZWxmLmlucHV0SWQgKyAnLXRzLWRyb3Bkb3duJztcblx0ICAgIHNldEF0dHIoZHJvcGRvd25fY29udGVudCwge1xuXHQgICAgICBpZDogbGlzdGJveElkXG5cdCAgICB9KTtcblx0ICAgIHNldEF0dHIoZm9jdXNfbm9kZSwge1xuXHQgICAgICByb2xlOiAnY29tYm9ib3gnLFxuXHQgICAgICAnYXJpYS1oYXNwb3B1cCc6ICdsaXN0Ym94Jyxcblx0ICAgICAgJ2FyaWEtZXhwYW5kZWQnOiAnZmFsc2UnLFxuXHQgICAgICAnYXJpYS1jb250cm9scyc6IGxpc3Rib3hJZFxuXHQgICAgfSk7XG5cdCAgICBjb25zdCBjb250cm9sX2lkID0gZ2V0SWQoZm9jdXNfbm9kZSwgc2VsZi5pbnB1dElkICsgJy10cy1jb250cm9sJyk7XG5cdCAgICBjb25zdCBxdWVyeSA9IFwibGFiZWxbZm9yPSdcIiArIGVzY2FwZVF1ZXJ5KHNlbGYuaW5wdXRJZCkgKyBcIiddXCI7XG5cdCAgICBjb25zdCBsYWJlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IocXVlcnkpO1xuXHQgICAgY29uc3QgbGFiZWxfY2xpY2sgPSBzZWxmLmZvY3VzLmJpbmQoc2VsZik7XG5cblx0ICAgIGlmIChsYWJlbCkge1xuXHQgICAgICBhZGRFdmVudChsYWJlbCwgJ2NsaWNrJywgbGFiZWxfY2xpY2spO1xuXHQgICAgICBzZXRBdHRyKGxhYmVsLCB7XG5cdCAgICAgICAgZm9yOiBjb250cm9sX2lkXG5cdCAgICAgIH0pO1xuXHQgICAgICBjb25zdCBsYWJlbF9pZCA9IGdldElkKGxhYmVsLCBzZWxmLmlucHV0SWQgKyAnLXRzLWxhYmVsJyk7XG5cdCAgICAgIHNldEF0dHIoZm9jdXNfbm9kZSwge1xuXHQgICAgICAgICdhcmlhLWxhYmVsbGVkYnknOiBsYWJlbF9pZFxuXHQgICAgICB9KTtcblx0ICAgICAgc2V0QXR0cihkcm9wZG93bl9jb250ZW50LCB7XG5cdCAgICAgICAgJ2FyaWEtbGFiZWxsZWRieSc6IGxhYmVsX2lkXG5cdCAgICAgIH0pO1xuXHQgICAgfVxuXG5cdCAgICB3cmFwcGVyLnN0eWxlLndpZHRoID0gaW5wdXQuc3R5bGUud2lkdGg7XG5cblx0ICAgIGlmIChzZWxmLnBsdWdpbnMubmFtZXMubGVuZ3RoKSB7XG5cdCAgICAgIGNvbnN0IGNsYXNzZXNfcGx1Z2lucyA9ICdwbHVnaW4tJyArIHNlbGYucGx1Z2lucy5uYW1lcy5qb2luKCcgcGx1Z2luLScpO1xuXHQgICAgICBhZGRDbGFzc2VzKFt3cmFwcGVyLCBkcm9wZG93bl0sIGNsYXNzZXNfcGx1Z2lucyk7XG5cdCAgICB9XG5cblx0ICAgIGlmICgoc2V0dGluZ3MubWF4SXRlbXMgPT09IG51bGwgfHwgc2V0dGluZ3MubWF4SXRlbXMgPiAxKSAmJiBzZWxmLmlzX3NlbGVjdF90YWcpIHtcblx0ICAgICAgc2V0QXR0cihpbnB1dCwge1xuXHQgICAgICAgIG11bHRpcGxlOiAnbXVsdGlwbGUnXG5cdCAgICAgIH0pO1xuXHQgICAgfVxuXG5cdCAgICBpZiAoc2V0dGluZ3MucGxhY2Vob2xkZXIpIHtcblx0ICAgICAgc2V0QXR0cihjb250cm9sX2lucHV0LCB7XG5cdCAgICAgICAgcGxhY2Vob2xkZXI6IHNldHRpbmdzLnBsYWNlaG9sZGVyXG5cdCAgICAgIH0pO1xuXHQgICAgfSAvLyBpZiBzcGxpdE9uIHdhcyBub3QgcGFzc2VkIGluLCBjb25zdHJ1Y3QgaXQgZnJvbSB0aGUgZGVsaW1pdGVyIHRvIGFsbG93IHBhc3RpbmcgdW5pdmVyc2FsbHlcblxuXG5cdCAgICBpZiAoIXNldHRpbmdzLnNwbGl0T24gJiYgc2V0dGluZ3MuZGVsaW1pdGVyKSB7XG5cdCAgICAgIHNldHRpbmdzLnNwbGl0T24gPSBuZXcgUmVnRXhwKCdcXFxccyonICsgZXNjYXBlX3JlZ2V4KHNldHRpbmdzLmRlbGltaXRlcikgKyAnK1xcXFxzKicpO1xuXHQgICAgfSAvLyBkZWJvdW5jZSB1c2VyIGRlZmluZWQgbG9hZCgpIGlmIGxvYWRUaHJvdHRsZSA+IDBcblx0ICAgIC8vIGFmdGVyIGluaXRpYWxpemVQbHVnaW5zKCkgc28gcGx1Z2lucyBjYW4gY3JlYXRlL21vZGlmeSB1c2VyIGRlZmluZWQgbG9hZGVyc1xuXG5cblx0ICAgIGlmIChzZXR0aW5ncy5sb2FkICYmIHNldHRpbmdzLmxvYWRUaHJvdHRsZSkge1xuXHQgICAgICBzZXR0aW5ncy5sb2FkID0gbG9hZERlYm91bmNlKHNldHRpbmdzLmxvYWQsIHNldHRpbmdzLmxvYWRUaHJvdHRsZSk7XG5cdCAgICB9XG5cblx0ICAgIHNlbGYuY29udHJvbF9pbnB1dC50eXBlID0gaW5wdXQudHlwZTtcblx0ICAgIGFkZEV2ZW50KGRyb3Bkb3duLCAnbW91c2Vtb3ZlJywgKCkgPT4ge1xuXHQgICAgICBzZWxmLmlnbm9yZUhvdmVyID0gZmFsc2U7XG5cdCAgICB9KTtcblx0ICAgIGFkZEV2ZW50KGRyb3Bkb3duLCAnbW91c2VlbnRlcicsIGUgPT4ge1xuXHQgICAgICB2YXIgdGFyZ2V0X21hdGNoID0gcGFyZW50TWF0Y2goZS50YXJnZXQsICdbZGF0YS1zZWxlY3RhYmxlXScsIGRyb3Bkb3duKTtcblx0ICAgICAgaWYgKHRhcmdldF9tYXRjaCkgc2VsZi5vbk9wdGlvbkhvdmVyKGUsIHRhcmdldF9tYXRjaCk7XG5cdCAgICB9LCB7XG5cdCAgICAgIGNhcHR1cmU6IHRydWVcblx0ICAgIH0pOyAvLyBjbGlja2luZyBvbiBhbiBvcHRpb24gc2hvdWxkIHNlbGVjdCBpdFxuXG5cdCAgICBhZGRFdmVudChkcm9wZG93biwgJ2NsaWNrJywgZXZ0ID0+IHtcblx0ICAgICAgY29uc3Qgb3B0aW9uID0gcGFyZW50TWF0Y2goZXZ0LnRhcmdldCwgJ1tkYXRhLXNlbGVjdGFibGVdJyk7XG5cblx0ICAgICAgaWYgKG9wdGlvbikge1xuXHQgICAgICAgIHNlbGYub25PcHRpb25TZWxlY3QoZXZ0LCBvcHRpb24pO1xuXHQgICAgICAgIHByZXZlbnREZWZhdWx0KGV2dCwgdHJ1ZSk7XG5cdCAgICAgIH1cblx0ICAgIH0pO1xuXHQgICAgYWRkRXZlbnQoY29udHJvbCwgJ2NsaWNrJywgZXZ0ID0+IHtcblx0ICAgICAgdmFyIHRhcmdldF9tYXRjaCA9IHBhcmVudE1hdGNoKGV2dC50YXJnZXQsICdbZGF0YS10cy1pdGVtXScsIGNvbnRyb2wpO1xuXG5cdCAgICAgIGlmICh0YXJnZXRfbWF0Y2ggJiYgc2VsZi5vbkl0ZW1TZWxlY3QoZXZ0LCB0YXJnZXRfbWF0Y2gpKSB7XG5cdCAgICAgICAgcHJldmVudERlZmF1bHQoZXZ0LCB0cnVlKTtcblx0ICAgICAgICByZXR1cm47XG5cdCAgICAgIH0gLy8gcmV0YWluIGZvY3VzIChzZWUgY29udHJvbF9pbnB1dCBtb3VzZWRvd24pXG5cblxuXHQgICAgICBpZiAoY29udHJvbF9pbnB1dC52YWx1ZSAhPSAnJykge1xuXHQgICAgICAgIHJldHVybjtcblx0ICAgICAgfVxuXG5cdCAgICAgIHNlbGYub25DbGljaygpO1xuXHQgICAgICBwcmV2ZW50RGVmYXVsdChldnQsIHRydWUpO1xuXHQgICAgfSk7IC8vIGtleWRvd24gb24gZm9jdXNfbm9kZSBmb3IgYXJyb3dfZG93bi9hcnJvd191cFxuXG5cdCAgICBhZGRFdmVudChmb2N1c19ub2RlLCAna2V5ZG93bicsIGUgPT4gc2VsZi5vbktleURvd24oZSkpOyAvLyBrZXlwcmVzcyBhbmQgaW5wdXQva2V5dXBcblxuXHQgICAgYWRkRXZlbnQoY29udHJvbF9pbnB1dCwgJ2tleXByZXNzJywgZSA9PiBzZWxmLm9uS2V5UHJlc3MoZSkpO1xuXHQgICAgYWRkRXZlbnQoY29udHJvbF9pbnB1dCwgJ2lucHV0JywgZSA9PiBzZWxmLm9uSW5wdXQoZSkpO1xuXHQgICAgYWRkRXZlbnQoZm9jdXNfbm9kZSwgJ2JsdXInLCBlID0+IHNlbGYub25CbHVyKGUpKTtcblx0ICAgIGFkZEV2ZW50KGZvY3VzX25vZGUsICdmb2N1cycsIGUgPT4gc2VsZi5vbkZvY3VzKGUpKTtcblx0ICAgIGFkZEV2ZW50KGNvbnRyb2xfaW5wdXQsICdwYXN0ZScsIGUgPT4gc2VsZi5vblBhc3RlKGUpKTtcblxuXHQgICAgY29uc3QgZG9jX21vdXNlZG93biA9IGV2dCA9PiB7XG5cdCAgICAgIC8vIGJsdXIgaWYgdGFyZ2V0IGlzIG91dHNpZGUgb2YgdGhpcyBpbnN0YW5jZVxuXHQgICAgICAvLyBkcm9wZG93biBpcyBub3QgYWx3YXlzIGluc2lkZSB3cmFwcGVyXG5cdCAgICAgIGNvbnN0IHRhcmdldCA9IGV2dC5jb21wb3NlZFBhdGgoKVswXTtcblxuXHQgICAgICBpZiAoIXdyYXBwZXIuY29udGFpbnModGFyZ2V0KSAmJiAhZHJvcGRvd24uY29udGFpbnModGFyZ2V0KSkge1xuXHQgICAgICAgIGlmIChzZWxmLmlzRm9jdXNlZCkge1xuXHQgICAgICAgICAgc2VsZi5ibHVyKCk7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgc2VsZi5pbnB1dFN0YXRlKCk7XG5cdCAgICAgICAgcmV0dXJuO1xuXHQgICAgICB9IC8vIHJldGFpbiBmb2N1cyBieSBwcmV2ZW50aW5nIG5hdGl2ZSBoYW5kbGluZy4gaWYgdGhlXG5cdCAgICAgIC8vIGV2ZW50IHRhcmdldCBpcyB0aGUgaW5wdXQgaXQgc2hvdWxkIG5vdCBiZSBtb2RpZmllZC5cblx0ICAgICAgLy8gb3RoZXJ3aXNlLCB0ZXh0IHNlbGVjdGlvbiB3aXRoaW4gdGhlIGlucHV0IHdvbid0IHdvcmsuXG5cdCAgICAgIC8vIEZpeGVzIGJ1ZyAjMjEyIHdoaWNoIGlzIG5vIGNvdmVyZWQgYnkgdGVzdHNcblxuXG5cdCAgICAgIGlmICh0YXJnZXQgPT0gY29udHJvbF9pbnB1dCAmJiBzZWxmLmlzT3Blbikge1xuXHQgICAgICAgIGV2dC5zdG9wUHJvcGFnYXRpb24oKTsgLy8gY2xpY2tpbmcgYW55d2hlcmUgaW4gdGhlIGNvbnRyb2wgc2hvdWxkIG5vdCBibHVyIHRoZSBjb250cm9sX2lucHV0ICh3aGljaCB3b3VsZCBjbG9zZSB0aGUgZHJvcGRvd24pXG5cdCAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgcHJldmVudERlZmF1bHQoZXZ0LCB0cnVlKTtcblx0ICAgICAgfVxuXHQgICAgfTtcblxuXHQgICAgY29uc3Qgd2luX3Njcm9sbCA9ICgpID0+IHtcblx0ICAgICAgaWYgKHNlbGYuaXNPcGVuKSB7XG5cdCAgICAgICAgc2VsZi5wb3NpdGlvbkRyb3Bkb3duKCk7XG5cdCAgICAgIH1cblx0ICAgIH07XG5cblx0ICAgIGFkZEV2ZW50KGRvY3VtZW50LCAnbW91c2Vkb3duJywgZG9jX21vdXNlZG93bik7XG5cdCAgICBhZGRFdmVudCh3aW5kb3csICdzY3JvbGwnLCB3aW5fc2Nyb2xsLCBwYXNzaXZlX2V2ZW50KTtcblx0ICAgIGFkZEV2ZW50KHdpbmRvdywgJ3Jlc2l6ZScsIHdpbl9zY3JvbGwsIHBhc3NpdmVfZXZlbnQpO1xuXG5cdCAgICB0aGlzLl9kZXN0cm95ID0gKCkgPT4ge1xuXHQgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBkb2NfbW91c2Vkb3duKTtcblx0ICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHdpbl9zY3JvbGwpO1xuXHQgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgd2luX3Njcm9sbCk7XG5cdCAgICAgIGlmIChsYWJlbCkgbGFiZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBsYWJlbF9jbGljayk7XG5cdCAgICB9OyAvLyBzdG9yZSBvcmlnaW5hbCBodG1sIGFuZCB0YWIgaW5kZXggc28gdGhhdCB0aGV5IGNhbiBiZVxuXHQgICAgLy8gcmVzdG9yZWQgd2hlbiB0aGUgZGVzdHJveSgpIG1ldGhvZCBpcyBjYWxsZWQuXG5cblxuXHQgICAgdGhpcy5yZXZlcnRTZXR0aW5ncyA9IHtcblx0ICAgICAgaW5uZXJIVE1MOiBpbnB1dC5pbm5lckhUTUwsXG5cdCAgICAgIHRhYkluZGV4OiBpbnB1dC50YWJJbmRleFxuXHQgICAgfTtcblx0ICAgIGlucHV0LnRhYkluZGV4ID0gLTE7XG5cdCAgICBpbnB1dC5pbnNlcnRBZGphY2VudEVsZW1lbnQoJ2FmdGVyZW5kJywgc2VsZi53cmFwcGVyKTtcblx0ICAgIHNlbGYuc3luYyhmYWxzZSk7XG5cdCAgICBzZXR0aW5ncy5pdGVtcyA9IFtdO1xuXHQgICAgZGVsZXRlIHNldHRpbmdzLm9wdGdyb3Vwcztcblx0ICAgIGRlbGV0ZSBzZXR0aW5ncy5vcHRpb25zO1xuXHQgICAgYWRkRXZlbnQoaW5wdXQsICdpbnZhbGlkJywgKCkgPT4ge1xuXHQgICAgICBpZiAoc2VsZi5pc1ZhbGlkKSB7XG5cdCAgICAgICAgc2VsZi5pc1ZhbGlkID0gZmFsc2U7XG5cdCAgICAgICAgc2VsZi5pc0ludmFsaWQgPSB0cnVlO1xuXHQgICAgICAgIHNlbGYucmVmcmVzaFN0YXRlKCk7XG5cdCAgICAgIH1cblx0ICAgIH0pO1xuXHQgICAgc2VsZi51cGRhdGVPcmlnaW5hbElucHV0KCk7XG5cdCAgICBzZWxmLnJlZnJlc2hJdGVtcygpO1xuXHQgICAgc2VsZi5jbG9zZShmYWxzZSk7XG5cdCAgICBzZWxmLmlucHV0U3RhdGUoKTtcblx0ICAgIHNlbGYuaXNTZXR1cCA9IHRydWU7XG5cblx0ICAgIGlmIChpbnB1dC5kaXNhYmxlZCkge1xuXHQgICAgICBzZWxmLmRpc2FibGUoKTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIHNlbGYuZW5hYmxlKCk7IC8vc2V0cyB0YWJJbmRleFxuXHQgICAgfVxuXG5cdCAgICBzZWxmLm9uKCdjaGFuZ2UnLCB0aGlzLm9uQ2hhbmdlKTtcblx0ICAgIGFkZENsYXNzZXMoaW5wdXQsICd0b21zZWxlY3RlZCcsICd0cy1oaWRkZW4tYWNjZXNzaWJsZScpO1xuXHQgICAgc2VsZi50cmlnZ2VyKCdpbml0aWFsaXplJyk7IC8vIHByZWxvYWQgb3B0aW9uc1xuXG5cdCAgICBpZiAoc2V0dGluZ3MucHJlbG9hZCA9PT0gdHJ1ZSkge1xuXHQgICAgICBzZWxmLnByZWxvYWQoKTtcblx0ICAgIH1cblx0ICB9XG5cdCAgLyoqXG5cdCAgICogUmVnaXN0ZXIgb3B0aW9ucyBhbmQgb3B0Z3JvdXBzXG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgc2V0dXBPcHRpb25zKG9wdGlvbnMgPSBbXSwgb3B0Z3JvdXBzID0gW10pIHtcblx0ICAgIC8vIGJ1aWxkIG9wdGlvbnMgdGFibGVcblx0ICAgIHRoaXMuYWRkT3B0aW9ucyhvcHRpb25zKTsgLy8gYnVpbGQgb3B0Z3JvdXAgdGFibGVcblxuXHQgICAgaXRlcmF0ZSQxKG9wdGdyb3Vwcywgb3B0Z3JvdXAgPT4ge1xuXHQgICAgICB0aGlzLnJlZ2lzdGVyT3B0aW9uR3JvdXAob3B0Z3JvdXApO1xuXHQgICAgfSk7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFNldHMgdXAgZGVmYXVsdCByZW5kZXJpbmcgZnVuY3Rpb25zLlxuXHQgICAqL1xuXG5cblx0ICBzZXR1cFRlbXBsYXRlcygpIHtcblx0ICAgIHZhciBzZWxmID0gdGhpcztcblx0ICAgIHZhciBmaWVsZF9sYWJlbCA9IHNlbGYuc2V0dGluZ3MubGFiZWxGaWVsZDtcblx0ICAgIHZhciBmaWVsZF9vcHRncm91cCA9IHNlbGYuc2V0dGluZ3Mub3B0Z3JvdXBMYWJlbEZpZWxkO1xuXHQgICAgdmFyIHRlbXBsYXRlcyA9IHtcblx0ICAgICAgJ29wdGdyb3VwJzogZGF0YSA9PiB7XG5cdCAgICAgICAgbGV0IG9wdGdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdCAgICAgICAgb3B0Z3JvdXAuY2xhc3NOYW1lID0gJ29wdGdyb3VwJztcblx0ICAgICAgICBvcHRncm91cC5hcHBlbmRDaGlsZChkYXRhLm9wdGlvbnMpO1xuXHQgICAgICAgIHJldHVybiBvcHRncm91cDtcblx0ICAgICAgfSxcblx0ICAgICAgJ29wdGdyb3VwX2hlYWRlcic6IChkYXRhLCBlc2NhcGUpID0+IHtcblx0ICAgICAgICByZXR1cm4gJzxkaXYgY2xhc3M9XCJvcHRncm91cC1oZWFkZXJcIj4nICsgZXNjYXBlKGRhdGFbZmllbGRfb3B0Z3JvdXBdKSArICc8L2Rpdj4nO1xuXHQgICAgICB9LFxuXHQgICAgICAnb3B0aW9uJzogKGRhdGEsIGVzY2FwZSkgPT4ge1xuXHQgICAgICAgIHJldHVybiAnPGRpdj4nICsgZXNjYXBlKGRhdGFbZmllbGRfbGFiZWxdKSArICc8L2Rpdj4nO1xuXHQgICAgICB9LFxuXHQgICAgICAnaXRlbSc6IChkYXRhLCBlc2NhcGUpID0+IHtcblx0ICAgICAgICByZXR1cm4gJzxkaXY+JyArIGVzY2FwZShkYXRhW2ZpZWxkX2xhYmVsXSkgKyAnPC9kaXY+Jztcblx0ICAgICAgfSxcblx0ICAgICAgJ29wdGlvbl9jcmVhdGUnOiAoZGF0YSwgZXNjYXBlKSA9PiB7XG5cdCAgICAgICAgcmV0dXJuICc8ZGl2IGNsYXNzPVwiY3JlYXRlXCI+QWRkIDxzdHJvbmc+JyArIGVzY2FwZShkYXRhLmlucHV0KSArICc8L3N0cm9uZz4maGVsbGlwOzwvZGl2Pic7XG5cdCAgICAgIH0sXG5cdCAgICAgICdub19yZXN1bHRzJzogKCkgPT4ge1xuXHQgICAgICAgIHJldHVybiAnPGRpdiBjbGFzcz1cIm5vLXJlc3VsdHNcIj5ObyByZXN1bHRzIGZvdW5kPC9kaXY+Jztcblx0ICAgICAgfSxcblx0ICAgICAgJ2xvYWRpbmcnOiAoKSA9PiB7XG5cdCAgICAgICAgcmV0dXJuICc8ZGl2IGNsYXNzPVwic3Bpbm5lclwiPjwvZGl2Pic7XG5cdCAgICAgIH0sXG5cdCAgICAgICdub3RfbG9hZGluZyc6ICgpID0+IHt9LFxuXHQgICAgICAnZHJvcGRvd24nOiAoKSA9PiB7XG5cdCAgICAgICAgcmV0dXJuICc8ZGl2PjwvZGl2Pic7XG5cdCAgICAgIH1cblx0ICAgIH07XG5cdCAgICBzZWxmLnNldHRpbmdzLnJlbmRlciA9IE9iamVjdC5hc3NpZ24oe30sIHRlbXBsYXRlcywgc2VsZi5zZXR0aW5ncy5yZW5kZXIpO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBNYXBzIGZpcmVkIGV2ZW50cyB0byBjYWxsYmFja3MgcHJvdmlkZWRcblx0ICAgKiBpbiB0aGUgc2V0dGluZ3MgdXNlZCB3aGVuIGNyZWF0aW5nIHRoZSBjb250cm9sLlxuXHQgICAqL1xuXG5cblx0ICBzZXR1cENhbGxiYWNrcygpIHtcblx0ICAgIHZhciBrZXksIGZuO1xuXHQgICAgdmFyIGNhbGxiYWNrcyA9IHtcblx0ICAgICAgJ2luaXRpYWxpemUnOiAnb25Jbml0aWFsaXplJyxcblx0ICAgICAgJ2NoYW5nZSc6ICdvbkNoYW5nZScsXG5cdCAgICAgICdpdGVtX2FkZCc6ICdvbkl0ZW1BZGQnLFxuXHQgICAgICAnaXRlbV9yZW1vdmUnOiAnb25JdGVtUmVtb3ZlJyxcblx0ICAgICAgJ2l0ZW1fc2VsZWN0JzogJ29uSXRlbVNlbGVjdCcsXG5cdCAgICAgICdjbGVhcic6ICdvbkNsZWFyJyxcblx0ICAgICAgJ29wdGlvbl9hZGQnOiAnb25PcHRpb25BZGQnLFxuXHQgICAgICAnb3B0aW9uX3JlbW92ZSc6ICdvbk9wdGlvblJlbW92ZScsXG5cdCAgICAgICdvcHRpb25fY2xlYXInOiAnb25PcHRpb25DbGVhcicsXG5cdCAgICAgICdvcHRncm91cF9hZGQnOiAnb25PcHRpb25Hcm91cEFkZCcsXG5cdCAgICAgICdvcHRncm91cF9yZW1vdmUnOiAnb25PcHRpb25Hcm91cFJlbW92ZScsXG5cdCAgICAgICdvcHRncm91cF9jbGVhcic6ICdvbk9wdGlvbkdyb3VwQ2xlYXInLFxuXHQgICAgICAnZHJvcGRvd25fb3Blbic6ICdvbkRyb3Bkb3duT3BlbicsXG5cdCAgICAgICdkcm9wZG93bl9jbG9zZSc6ICdvbkRyb3Bkb3duQ2xvc2UnLFxuXHQgICAgICAndHlwZSc6ICdvblR5cGUnLFxuXHQgICAgICAnbG9hZCc6ICdvbkxvYWQnLFxuXHQgICAgICAnZm9jdXMnOiAnb25Gb2N1cycsXG5cdCAgICAgICdibHVyJzogJ29uQmx1cidcblx0ICAgIH07XG5cblx0ICAgIGZvciAoa2V5IGluIGNhbGxiYWNrcykge1xuXHQgICAgICBmbiA9IHRoaXMuc2V0dGluZ3NbY2FsbGJhY2tzW2tleV1dO1xuXHQgICAgICBpZiAoZm4pIHRoaXMub24oa2V5LCBmbik7XG5cdCAgICB9XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFN5bmMgdGhlIFRvbSBTZWxlY3QgaW5zdGFuY2Ugd2l0aCB0aGUgb3JpZ2luYWwgaW5wdXQgb3Igc2VsZWN0XG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgc3luYyhnZXRfc2V0dGluZ3MgPSB0cnVlKSB7XG5cdCAgICBjb25zdCBzZWxmID0gdGhpcztcblx0ICAgIGNvbnN0IHNldHRpbmdzID0gZ2V0X3NldHRpbmdzID8gZ2V0U2V0dGluZ3Moc2VsZi5pbnB1dCwge1xuXHQgICAgICBkZWxpbWl0ZXI6IHNlbGYuc2V0dGluZ3MuZGVsaW1pdGVyXG5cdCAgICB9KSA6IHNlbGYuc2V0dGluZ3M7XG5cdCAgICBzZWxmLnNldHVwT3B0aW9ucyhzZXR0aW5ncy5vcHRpb25zLCBzZXR0aW5ncy5vcHRncm91cHMpO1xuXHQgICAgc2VsZi5zZXRWYWx1ZShzZXR0aW5ncy5pdGVtcyB8fCBbXSwgdHJ1ZSk7IC8vIHNpbGVudCBwcmV2ZW50cyByZWN1cnNpb25cblxuXHQgICAgc2VsZi5sYXN0UXVlcnkgPSBudWxsOyAvLyBzbyB1cGRhdGVkIG9wdGlvbnMgd2lsbCBiZSBkaXNwbGF5ZWQgaW4gZHJvcGRvd25cblx0ICB9XG5cdCAgLyoqXG5cdCAgICogVHJpZ2dlcmVkIHdoZW4gdGhlIG1haW4gY29udHJvbCBlbGVtZW50XG5cdCAgICogaGFzIGEgY2xpY2sgZXZlbnQuXG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgb25DbGljaygpIHtcblx0ICAgIHZhciBzZWxmID0gdGhpcztcblxuXHQgICAgaWYgKHNlbGYuYWN0aXZlSXRlbXMubGVuZ3RoID4gMCkge1xuXHQgICAgICBzZWxmLmNsZWFyQWN0aXZlSXRlbXMoKTtcblx0ICAgICAgc2VsZi5mb2N1cygpO1xuXHQgICAgICByZXR1cm47XG5cdCAgICB9XG5cblx0ICAgIGlmIChzZWxmLmlzRm9jdXNlZCAmJiBzZWxmLmlzT3Blbikge1xuXHQgICAgICBzZWxmLmJsdXIoKTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIHNlbGYuZm9jdXMoKTtcblx0ICAgIH1cblx0ICB9XG5cdCAgLyoqXG5cdCAgICogQGRlcHJlY2F0ZWQgdjEuN1xuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIG9uTW91c2VEb3duKCkge31cblx0ICAvKipcblx0ICAgKiBUcmlnZ2VyZWQgd2hlbiB0aGUgdmFsdWUgb2YgdGhlIGNvbnRyb2wgaGFzIGJlZW4gY2hhbmdlZC5cblx0ICAgKiBUaGlzIHNob3VsZCBwcm9wYWdhdGUgdGhlIGV2ZW50IHRvIHRoZSBvcmlnaW5hbCBET01cblx0ICAgKiBpbnB1dCAvIHNlbGVjdCBlbGVtZW50LlxuXHQgICAqL1xuXG5cblx0ICBvbkNoYW5nZSgpIHtcblx0ICAgIHRyaWdnZXJFdmVudCh0aGlzLmlucHV0LCAnaW5wdXQnKTtcblx0ICAgIHRyaWdnZXJFdmVudCh0aGlzLmlucHV0LCAnY2hhbmdlJyk7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFRyaWdnZXJlZCBvbiA8aW5wdXQ+IHBhc3RlLlxuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIG9uUGFzdGUoZSkge1xuXHQgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG5cdCAgICBpZiAoc2VsZi5pc0lucHV0SGlkZGVuIHx8IHNlbGYuaXNMb2NrZWQpIHtcblx0ICAgICAgcHJldmVudERlZmF1bHQoZSk7XG5cdCAgICAgIHJldHVybjtcblx0ICAgIH0gLy8gSWYgYSByZWdleCBvciBzdHJpbmcgaXMgaW5jbHVkZWQsIHRoaXMgd2lsbCBzcGxpdCB0aGUgcGFzdGVkXG5cdCAgICAvLyBpbnB1dCBhbmQgY3JlYXRlIEl0ZW1zIGZvciBlYWNoIHNlcGFyYXRlIHZhbHVlXG5cblxuXHQgICAgaWYgKCFzZWxmLnNldHRpbmdzLnNwbGl0T24pIHtcblx0ICAgICAgcmV0dXJuO1xuXHQgICAgfSAvLyBXYWl0IGZvciBwYXN0ZWQgdGV4dCB0byBiZSByZWNvZ25pemVkIGluIHZhbHVlXG5cblxuXHQgICAgc2V0VGltZW91dCgoKSA9PiB7XG5cdCAgICAgIHZhciBwYXN0ZWRUZXh0ID0gc2VsZi5pbnB1dFZhbHVlKCk7XG5cblx0ICAgICAgaWYgKCFwYXN0ZWRUZXh0Lm1hdGNoKHNlbGYuc2V0dGluZ3Muc3BsaXRPbikpIHtcblx0ICAgICAgICByZXR1cm47XG5cdCAgICAgIH1cblxuXHQgICAgICB2YXIgc3BsaXRJbnB1dCA9IHBhc3RlZFRleHQudHJpbSgpLnNwbGl0KHNlbGYuc2V0dGluZ3Muc3BsaXRPbik7XG5cdCAgICAgIGl0ZXJhdGUkMShzcGxpdElucHV0LCBwaWVjZSA9PiB7XG5cdCAgICAgICAgY29uc3QgaGFzaCA9IGhhc2hfa2V5KHBpZWNlKTtcblxuXHQgICAgICAgIGlmIChoYXNoKSB7XG5cdCAgICAgICAgICBpZiAodGhpcy5vcHRpb25zW3BpZWNlXSkge1xuXHQgICAgICAgICAgICBzZWxmLmFkZEl0ZW0ocGllY2UpO1xuXHQgICAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgICAgc2VsZi5jcmVhdGVJdGVtKHBpZWNlKTtcblx0ICAgICAgICAgIH1cblx0ICAgICAgICB9XG5cdCAgICAgIH0pO1xuXHQgICAgfSwgMCk7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFRyaWdnZXJlZCBvbiA8aW5wdXQ+IGtleXByZXNzLlxuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIG9uS2V5UHJlc3MoZSkge1xuXHQgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG5cdCAgICBpZiAoc2VsZi5pc0xvY2tlZCkge1xuXHQgICAgICBwcmV2ZW50RGVmYXVsdChlKTtcblx0ICAgICAgcmV0dXJuO1xuXHQgICAgfVxuXG5cdCAgICB2YXIgY2hhcmFjdGVyID0gU3RyaW5nLmZyb21DaGFyQ29kZShlLmtleUNvZGUgfHwgZS53aGljaCk7XG5cblx0ICAgIGlmIChzZWxmLnNldHRpbmdzLmNyZWF0ZSAmJiBzZWxmLnNldHRpbmdzLm1vZGUgPT09ICdtdWx0aScgJiYgY2hhcmFjdGVyID09PSBzZWxmLnNldHRpbmdzLmRlbGltaXRlcikge1xuXHQgICAgICBzZWxmLmNyZWF0ZUl0ZW0oKTtcblx0ICAgICAgcHJldmVudERlZmF1bHQoZSk7XG5cdCAgICAgIHJldHVybjtcblx0ICAgIH1cblx0ICB9XG5cdCAgLyoqXG5cdCAgICogVHJpZ2dlcmVkIG9uIDxpbnB1dD4ga2V5ZG93bi5cblx0ICAgKlxuXHQgICAqL1xuXG5cblx0ICBvbktleURvd24oZSkge1xuXHQgICAgdmFyIHNlbGYgPSB0aGlzO1xuXHQgICAgc2VsZi5pZ25vcmVIb3ZlciA9IHRydWU7XG5cblx0ICAgIGlmIChzZWxmLmlzTG9ja2VkKSB7XG5cdCAgICAgIGlmIChlLmtleUNvZGUgIT09IEtFWV9UQUIpIHtcblx0ICAgICAgICBwcmV2ZW50RGVmYXVsdChlKTtcblx0ICAgICAgfVxuXG5cdCAgICAgIHJldHVybjtcblx0ICAgIH1cblxuXHQgICAgc3dpdGNoIChlLmtleUNvZGUpIHtcblx0ICAgICAgLy8gY3RybCtBOiBzZWxlY3QgYWxsXG5cdCAgICAgIGNhc2UgS0VZX0E6XG5cdCAgICAgICAgaWYgKGlzS2V5RG93bihLRVlfU0hPUlRDVVQsIGUpKSB7XG5cdCAgICAgICAgICBpZiAoc2VsZi5jb250cm9sX2lucHV0LnZhbHVlID09ICcnKSB7XG5cdCAgICAgICAgICAgIHByZXZlbnREZWZhdWx0KGUpO1xuXHQgICAgICAgICAgICBzZWxmLnNlbGVjdEFsbCgpO1xuXHQgICAgICAgICAgICByZXR1cm47XG5cdCAgICAgICAgICB9XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgYnJlYWs7XG5cdCAgICAgIC8vIGVzYzogY2xvc2UgZHJvcGRvd25cblxuXHQgICAgICBjYXNlIEtFWV9FU0M6XG5cdCAgICAgICAgaWYgKHNlbGYuaXNPcGVuKSB7XG5cdCAgICAgICAgICBwcmV2ZW50RGVmYXVsdChlLCB0cnVlKTtcblx0ICAgICAgICAgIHNlbGYuY2xvc2UoKTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICBzZWxmLmNsZWFyQWN0aXZlSXRlbXMoKTtcblx0ICAgICAgICByZXR1cm47XG5cdCAgICAgIC8vIGRvd246IG9wZW4gZHJvcGRvd24gb3IgbW92ZSBzZWxlY3Rpb24gZG93blxuXG5cdCAgICAgIGNhc2UgS0VZX0RPV046XG5cdCAgICAgICAgaWYgKCFzZWxmLmlzT3BlbiAmJiBzZWxmLmhhc09wdGlvbnMpIHtcblx0ICAgICAgICAgIHNlbGYub3BlbigpO1xuXHQgICAgICAgIH0gZWxzZSBpZiAoc2VsZi5hY3RpdmVPcHRpb24pIHtcblx0ICAgICAgICAgIGxldCBuZXh0ID0gc2VsZi5nZXRBZGphY2VudChzZWxmLmFjdGl2ZU9wdGlvbiwgMSk7XG5cdCAgICAgICAgICBpZiAobmV4dCkgc2VsZi5zZXRBY3RpdmVPcHRpb24obmV4dCk7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgcHJldmVudERlZmF1bHQoZSk7XG5cdCAgICAgICAgcmV0dXJuO1xuXHQgICAgICAvLyB1cDogbW92ZSBzZWxlY3Rpb24gdXBcblxuXHQgICAgICBjYXNlIEtFWV9VUDpcblx0ICAgICAgICBpZiAoc2VsZi5hY3RpdmVPcHRpb24pIHtcblx0ICAgICAgICAgIGxldCBwcmV2ID0gc2VsZi5nZXRBZGphY2VudChzZWxmLmFjdGl2ZU9wdGlvbiwgLTEpO1xuXHQgICAgICAgICAgaWYgKHByZXYpIHNlbGYuc2V0QWN0aXZlT3B0aW9uKHByZXYpO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHByZXZlbnREZWZhdWx0KGUpO1xuXHQgICAgICAgIHJldHVybjtcblx0ICAgICAgLy8gcmV0dXJuOiBzZWxlY3QgYWN0aXZlIG9wdGlvblxuXG5cdCAgICAgIGNhc2UgS0VZX1JFVFVSTjpcblx0ICAgICAgICBpZiAoc2VsZi5jYW5TZWxlY3Qoc2VsZi5hY3RpdmVPcHRpb24pKSB7XG5cdCAgICAgICAgICBzZWxmLm9uT3B0aW9uU2VsZWN0KGUsIHNlbGYuYWN0aXZlT3B0aW9uKTtcblx0ICAgICAgICAgIHByZXZlbnREZWZhdWx0KGUpOyAvLyBpZiB0aGUgb3B0aW9uX2NyZWF0ZT1udWxsLCB0aGUgZHJvcGRvd24gbWlnaHQgYmUgY2xvc2VkXG5cdCAgICAgICAgfSBlbHNlIGlmIChzZWxmLnNldHRpbmdzLmNyZWF0ZSAmJiBzZWxmLmNyZWF0ZUl0ZW0oKSkge1xuXHQgICAgICAgICAgcHJldmVudERlZmF1bHQoZSk7IC8vIGRvbid0IHN1Ym1pdCBmb3JtIHdoZW4gc2VhcmNoaW5nIGZvciBhIHZhbHVlXG5cdCAgICAgICAgfSBlbHNlIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09IHNlbGYuY29udHJvbF9pbnB1dCAmJiBzZWxmLmlzT3Blbikge1xuXHQgICAgICAgICAgcHJldmVudERlZmF1bHQoZSk7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgcmV0dXJuO1xuXHQgICAgICAvLyBsZWZ0OiBtb2RpZml5IGl0ZW0gc2VsZWN0aW9uIHRvIHRoZSBsZWZ0XG5cblx0ICAgICAgY2FzZSBLRVlfTEVGVDpcblx0ICAgICAgICBzZWxmLmFkdmFuY2VTZWxlY3Rpb24oLTEsIGUpO1xuXHQgICAgICAgIHJldHVybjtcblx0ICAgICAgLy8gcmlnaHQ6IG1vZGlmaXkgaXRlbSBzZWxlY3Rpb24gdG8gdGhlIHJpZ2h0XG5cblx0ICAgICAgY2FzZSBLRVlfUklHSFQ6XG5cdCAgICAgICAgc2VsZi5hZHZhbmNlU2VsZWN0aW9uKDEsIGUpO1xuXHQgICAgICAgIHJldHVybjtcblx0ICAgICAgLy8gdGFiOiBzZWxlY3QgYWN0aXZlIG9wdGlvbiBhbmQvb3IgY3JlYXRlIGl0ZW1cblxuXHQgICAgICBjYXNlIEtFWV9UQUI6XG5cdCAgICAgICAgaWYgKHNlbGYuc2V0dGluZ3Muc2VsZWN0T25UYWIpIHtcblx0ICAgICAgICAgIGlmIChzZWxmLmNhblNlbGVjdChzZWxmLmFjdGl2ZU9wdGlvbikpIHtcblx0ICAgICAgICAgICAgc2VsZi5vbk9wdGlvblNlbGVjdChlLCBzZWxmLmFjdGl2ZU9wdGlvbik7IC8vIHByZXZlbnQgZGVmYXVsdCBbdGFiXSBiZWhhdmlvdXIgb2YganVtcCB0byB0aGUgbmV4dCBmaWVsZFxuXHQgICAgICAgICAgICAvLyBpZiBzZWxlY3QgaXNGdWxsLCB0aGVuIHRoZSBkcm9wZG93biB3b24ndCBiZSBvcGVuIGFuZCBbdGFiXSB3aWxsIHdvcmsgbm9ybWFsbHlcblxuXHQgICAgICAgICAgICBwcmV2ZW50RGVmYXVsdChlKTtcblx0ICAgICAgICAgIH1cblxuXHQgICAgICAgICAgaWYgKHNlbGYuc2V0dGluZ3MuY3JlYXRlICYmIHNlbGYuY3JlYXRlSXRlbSgpKSB7XG5cdCAgICAgICAgICAgIHByZXZlbnREZWZhdWx0KGUpO1xuXHQgICAgICAgICAgfVxuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHJldHVybjtcblx0ICAgICAgLy8gZGVsZXRlfGJhY2tzcGFjZTogZGVsZXRlIGl0ZW1zXG5cblx0ICAgICAgY2FzZSBLRVlfQkFDS1NQQUNFOlxuXHQgICAgICBjYXNlIEtFWV9ERUxFVEU6XG5cdCAgICAgICAgc2VsZi5kZWxldGVTZWxlY3Rpb24oZSk7XG5cdCAgICAgICAgcmV0dXJuO1xuXHQgICAgfSAvLyBkb24ndCBlbnRlciB0ZXh0IGluIHRoZSBjb250cm9sX2lucHV0IHdoZW4gYWN0aXZlIGl0ZW1zIGFyZSBzZWxlY3RlZFxuXG5cblx0ICAgIGlmIChzZWxmLmlzSW5wdXRIaWRkZW4gJiYgIWlzS2V5RG93bihLRVlfU0hPUlRDVVQsIGUpKSB7XG5cdCAgICAgIHByZXZlbnREZWZhdWx0KGUpO1xuXHQgICAgfVxuXHQgIH1cblx0ICAvKipcblx0ICAgKiBUcmlnZ2VyZWQgb24gPGlucHV0PiBrZXl1cC5cblx0ICAgKlxuXHQgICAqL1xuXG5cblx0ICBvbklucHV0KGUpIHtcblx0ICAgIHZhciBzZWxmID0gdGhpcztcblxuXHQgICAgaWYgKHNlbGYuaXNMb2NrZWQpIHtcblx0ICAgICAgcmV0dXJuO1xuXHQgICAgfVxuXG5cdCAgICB2YXIgdmFsdWUgPSBzZWxmLmlucHV0VmFsdWUoKTtcblxuXHQgICAgaWYgKHNlbGYubGFzdFZhbHVlICE9PSB2YWx1ZSkge1xuXHQgICAgICBzZWxmLmxhc3RWYWx1ZSA9IHZhbHVlO1xuXG5cdCAgICAgIGlmIChzZWxmLnNldHRpbmdzLnNob3VsZExvYWQuY2FsbChzZWxmLCB2YWx1ZSkpIHtcblx0ICAgICAgICBzZWxmLmxvYWQodmFsdWUpO1xuXHQgICAgICB9XG5cblx0ICAgICAgc2VsZi5yZWZyZXNoT3B0aW9ucygpO1xuXHQgICAgICBzZWxmLnRyaWdnZXIoJ3R5cGUnLCB2YWx1ZSk7XG5cdCAgICB9XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFRyaWdnZXJlZCB3aGVuIHRoZSB1c2VyIHJvbGxzIG92ZXJcblx0ICAgKiBhbiBvcHRpb24gaW4gdGhlIGF1dG9jb21wbGV0ZSBkcm9wZG93biBtZW51LlxuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIG9uT3B0aW9uSG92ZXIoZXZ0LCBvcHRpb24pIHtcblx0ICAgIGlmICh0aGlzLmlnbm9yZUhvdmVyKSByZXR1cm47XG5cdCAgICB0aGlzLnNldEFjdGl2ZU9wdGlvbihvcHRpb24sIGZhbHNlKTtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogVHJpZ2dlcmVkIG9uIDxpbnB1dD4gZm9jdXMuXG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgb25Gb2N1cyhlKSB7XG5cdCAgICB2YXIgc2VsZiA9IHRoaXM7XG5cdCAgICB2YXIgd2FzRm9jdXNlZCA9IHNlbGYuaXNGb2N1c2VkO1xuXG5cdCAgICBpZiAoc2VsZi5pc0Rpc2FibGVkKSB7XG5cdCAgICAgIHNlbGYuYmx1cigpO1xuXHQgICAgICBwcmV2ZW50RGVmYXVsdChlKTtcblx0ICAgICAgcmV0dXJuO1xuXHQgICAgfVxuXG5cdCAgICBpZiAoc2VsZi5pZ25vcmVGb2N1cykgcmV0dXJuO1xuXHQgICAgc2VsZi5pc0ZvY3VzZWQgPSB0cnVlO1xuXHQgICAgaWYgKHNlbGYuc2V0dGluZ3MucHJlbG9hZCA9PT0gJ2ZvY3VzJykgc2VsZi5wcmVsb2FkKCk7XG5cdCAgICBpZiAoIXdhc0ZvY3VzZWQpIHNlbGYudHJpZ2dlcignZm9jdXMnKTtcblxuXHQgICAgaWYgKCFzZWxmLmFjdGl2ZUl0ZW1zLmxlbmd0aCkge1xuXHQgICAgICBzZWxmLnNob3dJbnB1dCgpO1xuXHQgICAgICBzZWxmLnJlZnJlc2hPcHRpb25zKCEhc2VsZi5zZXR0aW5ncy5vcGVuT25Gb2N1cyk7XG5cdCAgICB9XG5cblx0ICAgIHNlbGYucmVmcmVzaFN0YXRlKCk7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFRyaWdnZXJlZCBvbiA8aW5wdXQ+IGJsdXIuXG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgb25CbHVyKGUpIHtcblx0ICAgIGlmIChkb2N1bWVudC5oYXNGb2N1cygpID09PSBmYWxzZSkgcmV0dXJuO1xuXHQgICAgdmFyIHNlbGYgPSB0aGlzO1xuXHQgICAgaWYgKCFzZWxmLmlzRm9jdXNlZCkgcmV0dXJuO1xuXHQgICAgc2VsZi5pc0ZvY3VzZWQgPSBmYWxzZTtcblx0ICAgIHNlbGYuaWdub3JlRm9jdXMgPSBmYWxzZTtcblxuXHQgICAgdmFyIGRlYWN0aXZhdGUgPSAoKSA9PiB7XG5cdCAgICAgIHNlbGYuY2xvc2UoKTtcblx0ICAgICAgc2VsZi5zZXRBY3RpdmVJdGVtKCk7XG5cdCAgICAgIHNlbGYuc2V0Q2FyZXQoc2VsZi5pdGVtcy5sZW5ndGgpO1xuXHQgICAgICBzZWxmLnRyaWdnZXIoJ2JsdXInKTtcblx0ICAgIH07XG5cblx0ICAgIGlmIChzZWxmLnNldHRpbmdzLmNyZWF0ZSAmJiBzZWxmLnNldHRpbmdzLmNyZWF0ZU9uQmx1cikge1xuXHQgICAgICBzZWxmLmNyZWF0ZUl0ZW0obnVsbCwgZGVhY3RpdmF0ZSk7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICBkZWFjdGl2YXRlKCk7XG5cdCAgICB9XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFRyaWdnZXJlZCB3aGVuIHRoZSB1c2VyIGNsaWNrcyBvbiBhbiBvcHRpb25cblx0ICAgKiBpbiB0aGUgYXV0b2NvbXBsZXRlIGRyb3Bkb3duIG1lbnUuXG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgb25PcHRpb25TZWxlY3QoZXZ0LCBvcHRpb24pIHtcblx0ICAgIHZhciB2YWx1ZSxcblx0ICAgICAgICBzZWxmID0gdGhpczsgLy8gc2hvdWxkIG5vdCBiZSBwb3NzaWJsZSB0byB0cmlnZ2VyIGEgb3B0aW9uIHVuZGVyIGEgZGlzYWJsZWQgb3B0Z3JvdXBcblxuXHQgICAgaWYgKG9wdGlvbi5wYXJlbnRFbGVtZW50ICYmIG9wdGlvbi5wYXJlbnRFbGVtZW50Lm1hdGNoZXMoJ1tkYXRhLWRpc2FibGVkXScpKSB7XG5cdCAgICAgIHJldHVybjtcblx0ICAgIH1cblxuXHQgICAgaWYgKG9wdGlvbi5jbGFzc0xpc3QuY29udGFpbnMoJ2NyZWF0ZScpKSB7XG5cdCAgICAgIHNlbGYuY3JlYXRlSXRlbShudWxsLCAoKSA9PiB7XG5cdCAgICAgICAgaWYgKHNlbGYuc2V0dGluZ3MuY2xvc2VBZnRlclNlbGVjdCkge1xuXHQgICAgICAgICAgc2VsZi5jbG9zZSgpO1xuXHQgICAgICAgIH1cblx0ICAgICAgfSk7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICB2YWx1ZSA9IG9wdGlvbi5kYXRhc2V0LnZhbHVlO1xuXG5cdCAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICd1bmRlZmluZWQnKSB7XG5cdCAgICAgICAgc2VsZi5sYXN0UXVlcnkgPSBudWxsO1xuXHQgICAgICAgIHNlbGYuYWRkSXRlbSh2YWx1ZSk7XG5cblx0ICAgICAgICBpZiAoc2VsZi5zZXR0aW5ncy5jbG9zZUFmdGVyU2VsZWN0KSB7XG5cdCAgICAgICAgICBzZWxmLmNsb3NlKCk7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgaWYgKCFzZWxmLnNldHRpbmdzLmhpZGVTZWxlY3RlZCAmJiBldnQudHlwZSAmJiAvY2xpY2svLnRlc3QoZXZ0LnR5cGUpKSB7XG5cdCAgICAgICAgICBzZWxmLnNldEFjdGl2ZU9wdGlvbihvcHRpb24pO1xuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXHQgICAgfVxuXHQgIH1cblx0ICAvKipcblx0ICAgKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgZ2l2ZW4gb3B0aW9uIGNhbiBiZSBzZWxlY3RlZFxuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIGNhblNlbGVjdChvcHRpb24pIHtcblx0ICAgIGlmICh0aGlzLmlzT3BlbiAmJiBvcHRpb24gJiYgdGhpcy5kcm9wZG93bl9jb250ZW50LmNvbnRhaW5zKG9wdGlvbikpIHtcblx0ICAgICAgcmV0dXJuIHRydWU7XG5cdCAgICB9XG5cblx0ICAgIHJldHVybiBmYWxzZTtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogVHJpZ2dlcmVkIHdoZW4gdGhlIHVzZXIgY2xpY2tzIG9uIGFuIGl0ZW1cblx0ICAgKiB0aGF0IGhhcyBiZWVuIHNlbGVjdGVkLlxuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIG9uSXRlbVNlbGVjdChldnQsIGl0ZW0pIHtcblx0ICAgIHZhciBzZWxmID0gdGhpcztcblxuXHQgICAgaWYgKCFzZWxmLmlzTG9ja2VkICYmIHNlbGYuc2V0dGluZ3MubW9kZSA9PT0gJ211bHRpJykge1xuXHQgICAgICBwcmV2ZW50RGVmYXVsdChldnQpO1xuXHQgICAgICBzZWxmLnNldEFjdGl2ZUl0ZW0oaXRlbSwgZXZ0KTtcblx0ICAgICAgcmV0dXJuIHRydWU7XG5cdCAgICB9XG5cblx0ICAgIHJldHVybiBmYWxzZTtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogRGV0ZXJtaW5lcyB3aGV0aGVyIG9yIG5vdCB0byBpbnZva2Vcblx0ICAgKiB0aGUgdXNlci1wcm92aWRlZCBvcHRpb24gcHJvdmlkZXIgLyBsb2FkZXJcblx0ICAgKlxuXHQgICAqIE5vdGUsIHRoZXJlIGlzIGEgc3VidGxlIGRpZmZlcmVuY2UgYmV0d2VlblxuXHQgICAqIHRoaXMuY2FuTG9hZCgpIGFuZCB0aGlzLnNldHRpbmdzLnNob3VsZExvYWQoKTtcblx0ICAgKlxuXHQgICAqXHQtIHNldHRpbmdzLnNob3VsZExvYWQoKSBpcyBhIHVzZXItaW5wdXQgdmFsaWRhdG9yLlxuXHQgICAqXHRXaGVuIGZhbHNlIGlzIHJldHVybmVkLCB0aGUgbm90X2xvYWRpbmcgdGVtcGxhdGVcblx0ICAgKlx0d2lsbCBiZSBhZGRlZCB0byB0aGUgZHJvcGRvd25cblx0ICAgKlxuXHQgICAqXHQtIGNhbkxvYWQoKSBpcyBsb3dlciBsZXZlbCB2YWxpZGF0b3IgdGhhdCBjaGVja3Ncblx0ICAgKiBcdHRoZSBUb20gU2VsZWN0IGluc3RhbmNlLiBUaGVyZSBpcyBubyBpbmhlcmVudCB1c2VyXG5cdCAgICpcdGZlZWRiYWNrIHdoZW4gY2FuTG9hZCByZXR1cm5zIGZhbHNlXG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgY2FuTG9hZCh2YWx1ZSkge1xuXHQgICAgaWYgKCF0aGlzLnNldHRpbmdzLmxvYWQpIHJldHVybiBmYWxzZTtcblx0ICAgIGlmICh0aGlzLmxvYWRlZFNlYXJjaGVzLmhhc093blByb3BlcnR5KHZhbHVlKSkgcmV0dXJuIGZhbHNlO1xuXHQgICAgcmV0dXJuIHRydWU7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIEludm9rZXMgdGhlIHVzZXItcHJvdmlkZWQgb3B0aW9uIHByb3ZpZGVyIC8gbG9hZGVyLlxuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIGxvYWQodmFsdWUpIHtcblx0ICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXHQgICAgaWYgKCFzZWxmLmNhbkxvYWQodmFsdWUpKSByZXR1cm47XG5cdCAgICBhZGRDbGFzc2VzKHNlbGYud3JhcHBlciwgc2VsZi5zZXR0aW5ncy5sb2FkaW5nQ2xhc3MpO1xuXHQgICAgc2VsZi5sb2FkaW5nKys7XG5cdCAgICBjb25zdCBjYWxsYmFjayA9IHNlbGYubG9hZENhbGxiYWNrLmJpbmQoc2VsZik7XG5cdCAgICBzZWxmLnNldHRpbmdzLmxvYWQuY2FsbChzZWxmLCB2YWx1ZSwgY2FsbGJhY2spO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBJbnZva2VkIGJ5IHRoZSB1c2VyLXByb3ZpZGVkIG9wdGlvbiBwcm92aWRlclxuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIGxvYWRDYWxsYmFjayhvcHRpb25zLCBvcHRncm91cHMpIHtcblx0ICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXHQgICAgc2VsZi5sb2FkaW5nID0gTWF0aC5tYXgoc2VsZi5sb2FkaW5nIC0gMSwgMCk7XG5cdCAgICBzZWxmLmxhc3RRdWVyeSA9IG51bGw7XG5cdCAgICBzZWxmLmNsZWFyQWN0aXZlT3B0aW9uKCk7IC8vIHdoZW4gbmV3IHJlc3VsdHMgbG9hZCwgZm9jdXMgc2hvdWxkIGJlIG9uIGZpcnN0IG9wdGlvblxuXG5cdCAgICBzZWxmLnNldHVwT3B0aW9ucyhvcHRpb25zLCBvcHRncm91cHMpO1xuXHQgICAgc2VsZi5yZWZyZXNoT3B0aW9ucyhzZWxmLmlzRm9jdXNlZCAmJiAhc2VsZi5pc0lucHV0SGlkZGVuKTtcblxuXHQgICAgaWYgKCFzZWxmLmxvYWRpbmcpIHtcblx0ICAgICAgcmVtb3ZlQ2xhc3NlcyhzZWxmLndyYXBwZXIsIHNlbGYuc2V0dGluZ3MubG9hZGluZ0NsYXNzKTtcblx0ICAgIH1cblxuXHQgICAgc2VsZi50cmlnZ2VyKCdsb2FkJywgb3B0aW9ucywgb3B0Z3JvdXBzKTtcblx0ICB9XG5cblx0ICBwcmVsb2FkKCkge1xuXHQgICAgdmFyIGNsYXNzTGlzdCA9IHRoaXMud3JhcHBlci5jbGFzc0xpc3Q7XG5cdCAgICBpZiAoY2xhc3NMaXN0LmNvbnRhaW5zKCdwcmVsb2FkZWQnKSkgcmV0dXJuO1xuXHQgICAgY2xhc3NMaXN0LmFkZCgncHJlbG9hZGVkJyk7XG5cdCAgICB0aGlzLmxvYWQoJycpO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBTZXRzIHRoZSBpbnB1dCBmaWVsZCBvZiB0aGUgY29udHJvbCB0byB0aGUgc3BlY2lmaWVkIHZhbHVlLlxuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIHNldFRleHRib3hWYWx1ZSh2YWx1ZSA9ICcnKSB7XG5cdCAgICB2YXIgaW5wdXQgPSB0aGlzLmNvbnRyb2xfaW5wdXQ7XG5cdCAgICB2YXIgY2hhbmdlZCA9IGlucHV0LnZhbHVlICE9PSB2YWx1ZTtcblxuXHQgICAgaWYgKGNoYW5nZWQpIHtcblx0ICAgICAgaW5wdXQudmFsdWUgPSB2YWx1ZTtcblx0ICAgICAgdHJpZ2dlckV2ZW50KGlucHV0LCAndXBkYXRlJyk7XG5cdCAgICAgIHRoaXMubGFzdFZhbHVlID0gdmFsdWU7XG5cdCAgICB9XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFJldHVybnMgdGhlIHZhbHVlIG9mIHRoZSBjb250cm9sLiBJZiBtdWx0aXBsZSBpdGVtc1xuXHQgICAqIGNhbiBiZSBzZWxlY3RlZCAoZS5nLiA8c2VsZWN0IG11bHRpcGxlPiksIHRoaXMgcmV0dXJuc1xuXHQgICAqIGFuIGFycmF5LiBJZiBvbmx5IG9uZSBpdGVtIGNhbiBiZSBzZWxlY3RlZCwgdGhpc1xuXHQgICAqIHJldHVybnMgYSBzdHJpbmcuXG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgZ2V0VmFsdWUoKSB7XG5cdCAgICBpZiAodGhpcy5pc19zZWxlY3RfdGFnICYmIHRoaXMuaW5wdXQuaGFzQXR0cmlidXRlKCdtdWx0aXBsZScpKSB7XG5cdCAgICAgIHJldHVybiB0aGlzLml0ZW1zO1xuXHQgICAgfVxuXG5cdCAgICByZXR1cm4gdGhpcy5pdGVtcy5qb2luKHRoaXMuc2V0dGluZ3MuZGVsaW1pdGVyKTtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogUmVzZXRzIHRoZSBzZWxlY3RlZCBpdGVtcyB0byB0aGUgZ2l2ZW4gdmFsdWUuXG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgc2V0VmFsdWUodmFsdWUsIHNpbGVudCkge1xuXHQgICAgdmFyIGV2ZW50cyA9IHNpbGVudCA/IFtdIDogWydjaGFuZ2UnXTtcblx0ICAgIGRlYm91bmNlX2V2ZW50cyh0aGlzLCBldmVudHMsICgpID0+IHtcblx0ICAgICAgdGhpcy5jbGVhcihzaWxlbnQpO1xuXHQgICAgICB0aGlzLmFkZEl0ZW1zKHZhbHVlLCBzaWxlbnQpO1xuXHQgICAgfSk7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFJlc2V0cyB0aGUgbnVtYmVyIG9mIG1heCBpdGVtcyB0byB0aGUgZ2l2ZW4gdmFsdWVcblx0ICAgKlxuXHQgICAqL1xuXG5cblx0ICBzZXRNYXhJdGVtcyh2YWx1ZSkge1xuXHQgICAgaWYgKHZhbHVlID09PSAwKSB2YWx1ZSA9IG51bGw7IC8vcmVzZXQgdG8gdW5saW1pdGVkIGl0ZW1zLlxuXG5cdCAgICB0aGlzLnNldHRpbmdzLm1heEl0ZW1zID0gdmFsdWU7XG5cdCAgICB0aGlzLnJlZnJlc2hTdGF0ZSgpO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBTZXRzIHRoZSBzZWxlY3RlZCBpdGVtLlxuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIHNldEFjdGl2ZUl0ZW0oaXRlbSwgZSkge1xuXHQgICAgdmFyIHNlbGYgPSB0aGlzO1xuXHQgICAgdmFyIGV2ZW50TmFtZTtcblx0ICAgIHZhciBpLCBiZWdpbiwgZW5kLCBzd2FwO1xuXHQgICAgdmFyIGxhc3Q7XG5cdCAgICBpZiAoc2VsZi5zZXR0aW5ncy5tb2RlID09PSAnc2luZ2xlJykgcmV0dXJuOyAvLyBjbGVhciB0aGUgYWN0aXZlIHNlbGVjdGlvblxuXG5cdCAgICBpZiAoIWl0ZW0pIHtcblx0ICAgICAgc2VsZi5jbGVhckFjdGl2ZUl0ZW1zKCk7XG5cblx0ICAgICAgaWYgKHNlbGYuaXNGb2N1c2VkKSB7XG5cdCAgICAgICAgc2VsZi5zaG93SW5wdXQoKTtcblx0ICAgICAgfVxuXG5cdCAgICAgIHJldHVybjtcblx0ICAgIH0gLy8gbW9kaWZ5IHNlbGVjdGlvblxuXG5cblx0ICAgIGV2ZW50TmFtZSA9IGUgJiYgZS50eXBlLnRvTG93ZXJDYXNlKCk7XG5cblx0ICAgIGlmIChldmVudE5hbWUgPT09ICdjbGljaycgJiYgaXNLZXlEb3duKCdzaGlmdEtleScsIGUpICYmIHNlbGYuYWN0aXZlSXRlbXMubGVuZ3RoKSB7XG5cdCAgICAgIGxhc3QgPSBzZWxmLmdldExhc3RBY3RpdmUoKTtcblx0ICAgICAgYmVnaW4gPSBBcnJheS5wcm90b3R5cGUuaW5kZXhPZi5jYWxsKHNlbGYuY29udHJvbC5jaGlsZHJlbiwgbGFzdCk7XG5cdCAgICAgIGVuZCA9IEFycmF5LnByb3RvdHlwZS5pbmRleE9mLmNhbGwoc2VsZi5jb250cm9sLmNoaWxkcmVuLCBpdGVtKTtcblxuXHQgICAgICBpZiAoYmVnaW4gPiBlbmQpIHtcblx0ICAgICAgICBzd2FwID0gYmVnaW47XG5cdCAgICAgICAgYmVnaW4gPSBlbmQ7XG5cdCAgICAgICAgZW5kID0gc3dhcDtcblx0ICAgICAgfVxuXG5cdCAgICAgIGZvciAoaSA9IGJlZ2luOyBpIDw9IGVuZDsgaSsrKSB7XG5cdCAgICAgICAgaXRlbSA9IHNlbGYuY29udHJvbC5jaGlsZHJlbltpXTtcblxuXHQgICAgICAgIGlmIChzZWxmLmFjdGl2ZUl0ZW1zLmluZGV4T2YoaXRlbSkgPT09IC0xKSB7XG5cdCAgICAgICAgICBzZWxmLnNldEFjdGl2ZUl0ZW1DbGFzcyhpdGVtKTtcblx0ICAgICAgICB9XG5cdCAgICAgIH1cblxuXHQgICAgICBwcmV2ZW50RGVmYXVsdChlKTtcblx0ICAgIH0gZWxzZSBpZiAoZXZlbnROYW1lID09PSAnY2xpY2snICYmIGlzS2V5RG93bihLRVlfU0hPUlRDVVQsIGUpIHx8IGV2ZW50TmFtZSA9PT0gJ2tleWRvd24nICYmIGlzS2V5RG93bignc2hpZnRLZXknLCBlKSkge1xuXHQgICAgICBpZiAoaXRlbS5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XG5cdCAgICAgICAgc2VsZi5yZW1vdmVBY3RpdmVJdGVtKGl0ZW0pO1xuXHQgICAgICB9IGVsc2Uge1xuXHQgICAgICAgIHNlbGYuc2V0QWN0aXZlSXRlbUNsYXNzKGl0ZW0pO1xuXHQgICAgICB9XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICBzZWxmLmNsZWFyQWN0aXZlSXRlbXMoKTtcblx0ICAgICAgc2VsZi5zZXRBY3RpdmVJdGVtQ2xhc3MoaXRlbSk7XG5cdCAgICB9IC8vIGVuc3VyZSBjb250cm9sIGhhcyBmb2N1c1xuXG5cblx0ICAgIHNlbGYuaGlkZUlucHV0KCk7XG5cblx0ICAgIGlmICghc2VsZi5pc0ZvY3VzZWQpIHtcblx0ICAgICAgc2VsZi5mb2N1cygpO1xuXHQgICAgfVxuXHQgIH1cblx0ICAvKipcblx0ICAgKiBTZXQgdGhlIGFjdGl2ZSBhbmQgbGFzdC1hY3RpdmUgY2xhc3Nlc1xuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIHNldEFjdGl2ZUl0ZW1DbGFzcyhpdGVtKSB7XG5cdCAgICBjb25zdCBzZWxmID0gdGhpcztcblx0ICAgIGNvbnN0IGxhc3RfYWN0aXZlID0gc2VsZi5jb250cm9sLnF1ZXJ5U2VsZWN0b3IoJy5sYXN0LWFjdGl2ZScpO1xuXHQgICAgaWYgKGxhc3RfYWN0aXZlKSByZW1vdmVDbGFzc2VzKGxhc3RfYWN0aXZlLCAnbGFzdC1hY3RpdmUnKTtcblx0ICAgIGFkZENsYXNzZXMoaXRlbSwgJ2FjdGl2ZSBsYXN0LWFjdGl2ZScpO1xuXHQgICAgc2VsZi50cmlnZ2VyKCdpdGVtX3NlbGVjdCcsIGl0ZW0pO1xuXG5cdCAgICBpZiAoc2VsZi5hY3RpdmVJdGVtcy5pbmRleE9mKGl0ZW0pID09IC0xKSB7XG5cdCAgICAgIHNlbGYuYWN0aXZlSXRlbXMucHVzaChpdGVtKTtcblx0ICAgIH1cblx0ICB9XG5cdCAgLyoqXG5cdCAgICogUmVtb3ZlIGFjdGl2ZSBpdGVtXG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgcmVtb3ZlQWN0aXZlSXRlbShpdGVtKSB7XG5cdCAgICB2YXIgaWR4ID0gdGhpcy5hY3RpdmVJdGVtcy5pbmRleE9mKGl0ZW0pO1xuXHQgICAgdGhpcy5hY3RpdmVJdGVtcy5zcGxpY2UoaWR4LCAxKTtcblx0ICAgIHJlbW92ZUNsYXNzZXMoaXRlbSwgJ2FjdGl2ZScpO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBDbGVhcnMgYWxsIHRoZSBhY3RpdmUgaXRlbXNcblx0ICAgKlxuXHQgICAqL1xuXG5cblx0ICBjbGVhckFjdGl2ZUl0ZW1zKCkge1xuXHQgICAgcmVtb3ZlQ2xhc3Nlcyh0aGlzLmFjdGl2ZUl0ZW1zLCAnYWN0aXZlJyk7XG5cdCAgICB0aGlzLmFjdGl2ZUl0ZW1zID0gW107XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFNldHMgdGhlIHNlbGVjdGVkIGl0ZW0gaW4gdGhlIGRyb3Bkb3duIG1lbnVcblx0ICAgKiBvZiBhdmFpbGFibGUgb3B0aW9ucy5cblx0ICAgKlxuXHQgICAqL1xuXG5cblx0ICBzZXRBY3RpdmVPcHRpb24ob3B0aW9uLCBzY3JvbGwgPSB0cnVlKSB7XG5cdCAgICBpZiAob3B0aW9uID09PSB0aGlzLmFjdGl2ZU9wdGlvbikge1xuXHQgICAgICByZXR1cm47XG5cdCAgICB9XG5cblx0ICAgIHRoaXMuY2xlYXJBY3RpdmVPcHRpb24oKTtcblx0ICAgIGlmICghb3B0aW9uKSByZXR1cm47XG5cdCAgICB0aGlzLmFjdGl2ZU9wdGlvbiA9IG9wdGlvbjtcblx0ICAgIHNldEF0dHIodGhpcy5mb2N1c19ub2RlLCB7XG5cdCAgICAgICdhcmlhLWFjdGl2ZWRlc2NlbmRhbnQnOiBvcHRpb24uZ2V0QXR0cmlidXRlKCdpZCcpXG5cdCAgICB9KTtcblx0ICAgIHNldEF0dHIob3B0aW9uLCB7XG5cdCAgICAgICdhcmlhLXNlbGVjdGVkJzogJ3RydWUnXG5cdCAgICB9KTtcblx0ICAgIGFkZENsYXNzZXMob3B0aW9uLCAnYWN0aXZlJyk7XG5cdCAgICBpZiAoc2Nyb2xsKSB0aGlzLnNjcm9sbFRvT3B0aW9uKG9wdGlvbik7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFNldHMgdGhlIGRyb3Bkb3duX2NvbnRlbnQgc2Nyb2xsVG9wIHRvIGRpc3BsYXkgdGhlIG9wdGlvblxuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIHNjcm9sbFRvT3B0aW9uKG9wdGlvbiwgYmVoYXZpb3IpIHtcblx0ICAgIGlmICghb3B0aW9uKSByZXR1cm47XG5cdCAgICBjb25zdCBjb250ZW50ID0gdGhpcy5kcm9wZG93bl9jb250ZW50O1xuXHQgICAgY29uc3QgaGVpZ2h0X21lbnUgPSBjb250ZW50LmNsaWVudEhlaWdodDtcblx0ICAgIGNvbnN0IHNjcm9sbFRvcCA9IGNvbnRlbnQuc2Nyb2xsVG9wIHx8IDA7XG5cdCAgICBjb25zdCBoZWlnaHRfaXRlbSA9IG9wdGlvbi5vZmZzZXRIZWlnaHQ7XG5cdCAgICBjb25zdCB5ID0gb3B0aW9uLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCAtIGNvbnRlbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wICsgc2Nyb2xsVG9wO1xuXG5cdCAgICBpZiAoeSArIGhlaWdodF9pdGVtID4gaGVpZ2h0X21lbnUgKyBzY3JvbGxUb3ApIHtcblx0ICAgICAgdGhpcy5zY3JvbGwoeSAtIGhlaWdodF9tZW51ICsgaGVpZ2h0X2l0ZW0sIGJlaGF2aW9yKTtcblx0ICAgIH0gZWxzZSBpZiAoeSA8IHNjcm9sbFRvcCkge1xuXHQgICAgICB0aGlzLnNjcm9sbCh5LCBiZWhhdmlvcik7XG5cdCAgICB9XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFNjcm9sbCB0aGUgZHJvcGRvd24gdG8gdGhlIGdpdmVuIHBvc2l0aW9uXG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgc2Nyb2xsKHNjcm9sbFRvcCwgYmVoYXZpb3IpIHtcblx0ICAgIGNvbnN0IGNvbnRlbnQgPSB0aGlzLmRyb3Bkb3duX2NvbnRlbnQ7XG5cblx0ICAgIGlmIChiZWhhdmlvcikge1xuXHQgICAgICBjb250ZW50LnN0eWxlLnNjcm9sbEJlaGF2aW9yID0gYmVoYXZpb3I7XG5cdCAgICB9XG5cblx0ICAgIGNvbnRlbnQuc2Nyb2xsVG9wID0gc2Nyb2xsVG9wO1xuXHQgICAgY29udGVudC5zdHlsZS5zY3JvbGxCZWhhdmlvciA9ICcnO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBDbGVhcnMgdGhlIGFjdGl2ZSBvcHRpb25cblx0ICAgKlxuXHQgICAqL1xuXG5cblx0ICBjbGVhckFjdGl2ZU9wdGlvbigpIHtcblx0ICAgIGlmICh0aGlzLmFjdGl2ZU9wdGlvbikge1xuXHQgICAgICByZW1vdmVDbGFzc2VzKHRoaXMuYWN0aXZlT3B0aW9uLCAnYWN0aXZlJyk7XG5cdCAgICAgIHNldEF0dHIodGhpcy5hY3RpdmVPcHRpb24sIHtcblx0ICAgICAgICAnYXJpYS1zZWxlY3RlZCc6IG51bGxcblx0ICAgICAgfSk7XG5cdCAgICB9XG5cblx0ICAgIHRoaXMuYWN0aXZlT3B0aW9uID0gbnVsbDtcblx0ICAgIHNldEF0dHIodGhpcy5mb2N1c19ub2RlLCB7XG5cdCAgICAgICdhcmlhLWFjdGl2ZWRlc2NlbmRhbnQnOiBudWxsXG5cdCAgICB9KTtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogU2VsZWN0cyBhbGwgaXRlbXMgKENUUkwgKyBBKS5cblx0ICAgKi9cblxuXG5cdCAgc2VsZWN0QWxsKCkge1xuXHQgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cdCAgICBpZiAoc2VsZi5zZXR0aW5ncy5tb2RlID09PSAnc2luZ2xlJykgcmV0dXJuO1xuXHQgICAgY29uc3QgYWN0aXZlSXRlbXMgPSBzZWxmLmNvbnRyb2xDaGlsZHJlbigpO1xuXHQgICAgaWYgKCFhY3RpdmVJdGVtcy5sZW5ndGgpIHJldHVybjtcblx0ICAgIHNlbGYuaGlkZUlucHV0KCk7XG5cdCAgICBzZWxmLmNsb3NlKCk7XG5cdCAgICBzZWxmLmFjdGl2ZUl0ZW1zID0gYWN0aXZlSXRlbXM7XG5cdCAgICBpdGVyYXRlJDEoYWN0aXZlSXRlbXMsIGl0ZW0gPT4ge1xuXHQgICAgICBzZWxmLnNldEFjdGl2ZUl0ZW1DbGFzcyhpdGVtKTtcblx0ICAgIH0pO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBEZXRlcm1pbmVzIGlmIHRoZSBjb250cm9sX2lucHV0IHNob3VsZCBiZSBpbiBhIGhpZGRlbiBvciB2aXNpYmxlIHN0YXRlXG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgaW5wdXRTdGF0ZSgpIHtcblx0ICAgIHZhciBzZWxmID0gdGhpcztcblx0ICAgIGlmICghc2VsZi5jb250cm9sLmNvbnRhaW5zKHNlbGYuY29udHJvbF9pbnB1dCkpIHJldHVybjtcblx0ICAgIHNldEF0dHIoc2VsZi5jb250cm9sX2lucHV0LCB7XG5cdCAgICAgIHBsYWNlaG9sZGVyOiBzZWxmLnNldHRpbmdzLnBsYWNlaG9sZGVyXG5cdCAgICB9KTtcblxuXHQgICAgaWYgKHNlbGYuYWN0aXZlSXRlbXMubGVuZ3RoID4gMCB8fCAhc2VsZi5pc0ZvY3VzZWQgJiYgc2VsZi5zZXR0aW5ncy5oaWRlUGxhY2Vob2xkZXIgJiYgc2VsZi5pdGVtcy5sZW5ndGggPiAwKSB7XG5cdCAgICAgIHNlbGYuc2V0VGV4dGJveFZhbHVlKCk7XG5cdCAgICAgIHNlbGYuaXNJbnB1dEhpZGRlbiA9IHRydWU7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICBpZiAoc2VsZi5zZXR0aW5ncy5oaWRlUGxhY2Vob2xkZXIgJiYgc2VsZi5pdGVtcy5sZW5ndGggPiAwKSB7XG5cdCAgICAgICAgc2V0QXR0cihzZWxmLmNvbnRyb2xfaW5wdXQsIHtcblx0ICAgICAgICAgIHBsYWNlaG9sZGVyOiAnJ1xuXHQgICAgICAgIH0pO1xuXHQgICAgICB9XG5cblx0ICAgICAgc2VsZi5pc0lucHV0SGlkZGVuID0gZmFsc2U7XG5cdCAgICB9XG5cblx0ICAgIHNlbGYud3JhcHBlci5jbGFzc0xpc3QudG9nZ2xlKCdpbnB1dC1oaWRkZW4nLCBzZWxmLmlzSW5wdXRIaWRkZW4pO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBIaWRlcyB0aGUgaW5wdXQgZWxlbWVudCBvdXQgb2Ygdmlldywgd2hpbGVcblx0ICAgKiByZXRhaW5pbmcgaXRzIGZvY3VzLlxuXHQgICAqIEBkZXByZWNhdGVkIDEuM1xuXHQgICAqL1xuXG5cblx0ICBoaWRlSW5wdXQoKSB7XG5cdCAgICB0aGlzLmlucHV0U3RhdGUoKTtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogUmVzdG9yZXMgaW5wdXQgdmlzaWJpbGl0eS5cblx0ICAgKiBAZGVwcmVjYXRlZCAxLjNcblx0ICAgKi9cblxuXG5cdCAgc2hvd0lucHV0KCkge1xuXHQgICAgdGhpcy5pbnB1dFN0YXRlKCk7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIEdldCB0aGUgaW5wdXQgdmFsdWVcblx0ICAgKi9cblxuXG5cdCAgaW5wdXRWYWx1ZSgpIHtcblx0ICAgIHJldHVybiB0aGlzLmNvbnRyb2xfaW5wdXQudmFsdWUudHJpbSgpO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBHaXZlcyB0aGUgY29udHJvbCBmb2N1cy5cblx0ICAgKi9cblxuXG5cdCAgZm9jdXMoKSB7XG5cdCAgICB2YXIgc2VsZiA9IHRoaXM7XG5cdCAgICBpZiAoc2VsZi5pc0Rpc2FibGVkKSByZXR1cm47XG5cdCAgICBzZWxmLmlnbm9yZUZvY3VzID0gdHJ1ZTtcblxuXHQgICAgaWYgKHNlbGYuY29udHJvbF9pbnB1dC5vZmZzZXRXaWR0aCkge1xuXHQgICAgICBzZWxmLmNvbnRyb2xfaW5wdXQuZm9jdXMoKTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIHNlbGYuZm9jdXNfbm9kZS5mb2N1cygpO1xuXHQgICAgfVxuXG5cdCAgICBzZXRUaW1lb3V0KCgpID0+IHtcblx0ICAgICAgc2VsZi5pZ25vcmVGb2N1cyA9IGZhbHNlO1xuXHQgICAgICBzZWxmLm9uRm9jdXMoKTtcblx0ICAgIH0sIDApO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBGb3JjZXMgdGhlIGNvbnRyb2wgb3V0IG9mIGZvY3VzLlxuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIGJsdXIoKSB7XG5cdCAgICB0aGlzLmZvY3VzX25vZGUuYmx1cigpO1xuXHQgICAgdGhpcy5vbkJsdXIoKTtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgc2NvcmVzIGFuIG9iamVjdFxuXHQgICAqIHRvIHNob3cgaG93IGdvb2Qgb2YgYSBtYXRjaCBpdCBpcyB0byB0aGVcblx0ICAgKiBwcm92aWRlZCBxdWVyeS5cblx0ICAgKlxuXHQgICAqIEByZXR1cm4ge2Z1bmN0aW9ufVxuXHQgICAqL1xuXG5cblx0ICBnZXRTY29yZUZ1bmN0aW9uKHF1ZXJ5KSB7XG5cdCAgICByZXR1cm4gdGhpcy5zaWZ0ZXIuZ2V0U2NvcmVGdW5jdGlvbihxdWVyeSwgdGhpcy5nZXRTZWFyY2hPcHRpb25zKCkpO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBSZXR1cm5zIHNlYXJjaCBvcHRpb25zIGZvciBzaWZ0ZXIgKHRoZSBzeXN0ZW1cblx0ICAgKiBmb3Igc2NvcmluZyBhbmQgc29ydGluZyByZXN1bHRzKS5cblx0ICAgKlxuXHQgICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL29yY2hpZGpzL3NpZnRlci5qc1xuXHQgICAqIEByZXR1cm4ge29iamVjdH1cblx0ICAgKi9cblxuXG5cdCAgZ2V0U2VhcmNoT3B0aW9ucygpIHtcblx0ICAgIHZhciBzZXR0aW5ncyA9IHRoaXMuc2V0dGluZ3M7XG5cdCAgICB2YXIgc29ydCA9IHNldHRpbmdzLnNvcnRGaWVsZDtcblxuXHQgICAgaWYgKHR5cGVvZiBzZXR0aW5ncy5zb3J0RmllbGQgPT09ICdzdHJpbmcnKSB7XG5cdCAgICAgIHNvcnQgPSBbe1xuXHQgICAgICAgIGZpZWxkOiBzZXR0aW5ncy5zb3J0RmllbGRcblx0ICAgICAgfV07XG5cdCAgICB9XG5cblx0ICAgIHJldHVybiB7XG5cdCAgICAgIGZpZWxkczogc2V0dGluZ3Muc2VhcmNoRmllbGQsXG5cdCAgICAgIGNvbmp1bmN0aW9uOiBzZXR0aW5ncy5zZWFyY2hDb25qdW5jdGlvbixcblx0ICAgICAgc29ydDogc29ydCxcblx0ICAgICAgbmVzdGluZzogc2V0dGluZ3MubmVzdGluZ1xuXHQgICAgfTtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogU2VhcmNoZXMgdGhyb3VnaCBhdmFpbGFibGUgb3B0aW9ucyBhbmQgcmV0dXJuc1xuXHQgICAqIGEgc29ydGVkIGFycmF5IG9mIG1hdGNoZXMuXG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgc2VhcmNoKHF1ZXJ5KSB7XG5cdCAgICB2YXIgcmVzdWx0LCBjYWxjdWxhdGVTY29yZTtcblx0ICAgIHZhciBzZWxmID0gdGhpcztcblx0ICAgIHZhciBvcHRpb25zID0gdGhpcy5nZXRTZWFyY2hPcHRpb25zKCk7IC8vIHZhbGlkYXRlIHVzZXItcHJvdmlkZWQgcmVzdWx0IHNjb3JpbmcgZnVuY3Rpb25cblxuXHQgICAgaWYgKHNlbGYuc2V0dGluZ3Muc2NvcmUpIHtcblx0ICAgICAgY2FsY3VsYXRlU2NvcmUgPSBzZWxmLnNldHRpbmdzLnNjb3JlLmNhbGwoc2VsZiwgcXVlcnkpO1xuXG5cdCAgICAgIGlmICh0eXBlb2YgY2FsY3VsYXRlU2NvcmUgIT09ICdmdW5jdGlvbicpIHtcblx0ICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RvbSBTZWxlY3QgXCJzY29yZVwiIHNldHRpbmcgbXVzdCBiZSBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhIGZ1bmN0aW9uJyk7XG5cdCAgICAgIH1cblx0ICAgIH0gLy8gcGVyZm9ybSBzZWFyY2hcblxuXG5cdCAgICBpZiAocXVlcnkgIT09IHNlbGYubGFzdFF1ZXJ5KSB7XG5cdCAgICAgIHNlbGYubGFzdFF1ZXJ5ID0gcXVlcnk7XG5cdCAgICAgIHJlc3VsdCA9IHNlbGYuc2lmdGVyLnNlYXJjaChxdWVyeSwgT2JqZWN0LmFzc2lnbihvcHRpb25zLCB7XG5cdCAgICAgICAgc2NvcmU6IGNhbGN1bGF0ZVNjb3JlXG5cdCAgICAgIH0pKTtcblx0ICAgICAgc2VsZi5jdXJyZW50UmVzdWx0cyA9IHJlc3VsdDtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIHJlc3VsdCA9IE9iamVjdC5hc3NpZ24oe30sIHNlbGYuY3VycmVudFJlc3VsdHMpO1xuXHQgICAgfSAvLyBmaWx0ZXIgb3V0IHNlbGVjdGVkIGl0ZW1zXG5cblxuXHQgICAgaWYgKHNlbGYuc2V0dGluZ3MuaGlkZVNlbGVjdGVkKSB7XG5cdCAgICAgIHJlc3VsdC5pdGVtcyA9IHJlc3VsdC5pdGVtcy5maWx0ZXIoaXRlbSA9PiB7XG5cdCAgICAgICAgbGV0IGhhc2hlZCA9IGhhc2hfa2V5KGl0ZW0uaWQpO1xuXHQgICAgICAgIHJldHVybiAhKGhhc2hlZCAmJiBzZWxmLml0ZW1zLmluZGV4T2YoaGFzaGVkKSAhPT0gLTEpO1xuXHQgICAgICB9KTtcblx0ICAgIH1cblxuXHQgICAgcmV0dXJuIHJlc3VsdDtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogUmVmcmVzaGVzIHRoZSBsaXN0IG9mIGF2YWlsYWJsZSBvcHRpb25zIHNob3duXG5cdCAgICogaW4gdGhlIGF1dG9jb21wbGV0ZSBkcm9wZG93biBtZW51LlxuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIHJlZnJlc2hPcHRpb25zKHRyaWdnZXJEcm9wZG93biA9IHRydWUpIHtcblx0ICAgIHZhciBpLCBqLCBrLCBuLCBvcHRncm91cCwgb3B0Z3JvdXBzLCBodG1sLCBoYXNfY3JlYXRlX29wdGlvbiwgYWN0aXZlX2dyb3VwO1xuXHQgICAgdmFyIGNyZWF0ZTtcblx0ICAgIGNvbnN0IGdyb3VwcyA9IHt9O1xuXHQgICAgY29uc3QgZ3JvdXBzX29yZGVyID0gW107XG5cdCAgICB2YXIgc2VsZiA9IHRoaXM7XG5cdCAgICB2YXIgcXVlcnkgPSBzZWxmLmlucHV0VmFsdWUoKTtcblx0ICAgIGNvbnN0IHNhbWVfcXVlcnkgPSBxdWVyeSA9PT0gc2VsZi5sYXN0UXVlcnkgfHwgcXVlcnkgPT0gJycgJiYgc2VsZi5sYXN0UXVlcnkgPT0gbnVsbDtcblx0ICAgIHZhciByZXN1bHRzID0gc2VsZi5zZWFyY2gocXVlcnkpO1xuXHQgICAgdmFyIGFjdGl2ZV9vcHRpb24gPSBudWxsO1xuXHQgICAgdmFyIHNob3dfZHJvcGRvd24gPSBzZWxmLnNldHRpbmdzLnNob3VsZE9wZW4gfHwgZmFsc2U7XG5cdCAgICB2YXIgZHJvcGRvd25fY29udGVudCA9IHNlbGYuZHJvcGRvd25fY29udGVudDtcblxuXHQgICAgaWYgKHNhbWVfcXVlcnkpIHtcblx0ICAgICAgYWN0aXZlX29wdGlvbiA9IHNlbGYuYWN0aXZlT3B0aW9uO1xuXG5cdCAgICAgIGlmIChhY3RpdmVfb3B0aW9uKSB7XG5cdCAgICAgICAgYWN0aXZlX2dyb3VwID0gYWN0aXZlX29wdGlvbi5jbG9zZXN0KCdbZGF0YS1ncm91cF0nKTtcblx0ICAgICAgfVxuXHQgICAgfSAvLyBidWlsZCBtYXJrdXBcblxuXG5cdCAgICBuID0gcmVzdWx0cy5pdGVtcy5sZW5ndGg7XG5cblx0ICAgIGlmICh0eXBlb2Ygc2VsZi5zZXR0aW5ncy5tYXhPcHRpb25zID09PSAnbnVtYmVyJykge1xuXHQgICAgICBuID0gTWF0aC5taW4obiwgc2VsZi5zZXR0aW5ncy5tYXhPcHRpb25zKTtcblx0ICAgIH1cblxuXHQgICAgaWYgKG4gPiAwKSB7XG5cdCAgICAgIHNob3dfZHJvcGRvd24gPSB0cnVlO1xuXHQgICAgfSAvLyByZW5kZXIgYW5kIGdyb3VwIGF2YWlsYWJsZSBvcHRpb25zIGluZGl2aWR1YWxseVxuXG5cblx0ICAgIGZvciAoaSA9IDA7IGkgPCBuOyBpKyspIHtcblx0ICAgICAgLy8gZ2V0IG9wdGlvbiBkb20gZWxlbWVudFxuXHQgICAgICBsZXQgaXRlbSA9IHJlc3VsdHMuaXRlbXNbaV07XG5cdCAgICAgIGlmICghaXRlbSkgY29udGludWU7XG5cdCAgICAgIGxldCBvcHRfdmFsdWUgPSBpdGVtLmlkO1xuXHQgICAgICBsZXQgb3B0aW9uID0gc2VsZi5vcHRpb25zW29wdF92YWx1ZV07XG5cdCAgICAgIGlmIChvcHRpb24gPT09IHVuZGVmaW5lZCkgY29udGludWU7XG5cdCAgICAgIGxldCBvcHRfaGFzaCA9IGdldF9oYXNoKG9wdF92YWx1ZSk7XG5cdCAgICAgIGxldCBvcHRpb25fZWwgPSBzZWxmLmdldE9wdGlvbihvcHRfaGFzaCwgdHJ1ZSk7IC8vIHRvZ2dsZSAnc2VsZWN0ZWQnIGNsYXNzXG5cblx0ICAgICAgaWYgKCFzZWxmLnNldHRpbmdzLmhpZGVTZWxlY3RlZCkge1xuXHQgICAgICAgIG9wdGlvbl9lbC5jbGFzc0xpc3QudG9nZ2xlKCdzZWxlY3RlZCcsIHNlbGYuaXRlbXMuaW5jbHVkZXMob3B0X2hhc2gpKTtcblx0ICAgICAgfVxuXG5cdCAgICAgIG9wdGdyb3VwID0gb3B0aW9uW3NlbGYuc2V0dGluZ3Mub3B0Z3JvdXBGaWVsZF0gfHwgJyc7XG5cdCAgICAgIG9wdGdyb3VwcyA9IEFycmF5LmlzQXJyYXkob3B0Z3JvdXApID8gb3B0Z3JvdXAgOiBbb3B0Z3JvdXBdO1xuXG5cdCAgICAgIGZvciAoaiA9IDAsIGsgPSBvcHRncm91cHMgJiYgb3B0Z3JvdXBzLmxlbmd0aDsgaiA8IGs7IGorKykge1xuXHQgICAgICAgIG9wdGdyb3VwID0gb3B0Z3JvdXBzW2pdO1xuXG5cdCAgICAgICAgaWYgKCFzZWxmLm9wdGdyb3Vwcy5oYXNPd25Qcm9wZXJ0eShvcHRncm91cCkpIHtcblx0ICAgICAgICAgIG9wdGdyb3VwID0gJyc7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgbGV0IGdyb3VwX2ZyYWdtZW50ID0gZ3JvdXBzW29wdGdyb3VwXTtcblxuXHQgICAgICAgIGlmIChncm91cF9mcmFnbWVudCA9PT0gdW5kZWZpbmVkKSB7XG5cdCAgICAgICAgICBncm91cF9mcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcblx0ICAgICAgICAgIGdyb3Vwc19vcmRlci5wdXNoKG9wdGdyb3VwKTtcblx0ICAgICAgICB9IC8vIG5vZGVzIGNhbiBvbmx5IGhhdmUgb25lIHBhcmVudCwgc28gaWYgdGhlIG9wdGlvbiBpcyBpbiBtdXRwbGUgZ3JvdXBzLCB3ZSBuZWVkIGEgY2xvbmVcblxuXG5cdCAgICAgICAgaWYgKGogPiAwKSB7XG5cdCAgICAgICAgICBvcHRpb25fZWwgPSBvcHRpb25fZWwuY2xvbmVOb2RlKHRydWUpO1xuXHQgICAgICAgICAgc2V0QXR0cihvcHRpb25fZWwsIHtcblx0ICAgICAgICAgICAgaWQ6IG9wdGlvbi4kaWQgKyAnLWNsb25lLScgKyBqLFxuXHQgICAgICAgICAgICAnYXJpYS1zZWxlY3RlZCc6IG51bGxcblx0ICAgICAgICAgIH0pO1xuXHQgICAgICAgICAgb3B0aW9uX2VsLmNsYXNzTGlzdC5hZGQoJ3RzLWNsb25lZCcpO1xuXHQgICAgICAgICAgcmVtb3ZlQ2xhc3NlcyhvcHRpb25fZWwsICdhY3RpdmUnKTsgLy8gbWFrZSBzdXJlIHdlIGtlZXAgdGhlIGFjdGl2ZU9wdGlvbiBpbiB0aGUgc2FtZSBncm91cFxuXG5cdCAgICAgICAgICBpZiAoc2VsZi5hY3RpdmVPcHRpb24gJiYgc2VsZi5hY3RpdmVPcHRpb24uZGF0YXNldC52YWx1ZSA9PSBvcHRfdmFsdWUpIHtcblx0ICAgICAgICAgICAgaWYgKGFjdGl2ZV9ncm91cCAmJiBhY3RpdmVfZ3JvdXAuZGF0YXNldC5ncm91cCA9PT0gb3B0Z3JvdXAudG9TdHJpbmcoKSkge1xuXHQgICAgICAgICAgICAgIGFjdGl2ZV9vcHRpb24gPSBvcHRpb25fZWw7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgIH1cblx0ICAgICAgICB9XG5cblx0ICAgICAgICBncm91cF9mcmFnbWVudC5hcHBlbmRDaGlsZChvcHRpb25fZWwpO1xuXHQgICAgICAgIGdyb3Vwc1tvcHRncm91cF0gPSBncm91cF9mcmFnbWVudDtcblx0ICAgICAgfVxuXHQgICAgfSAvLyBzb3J0IG9wdGdyb3Vwc1xuXG5cblx0ICAgIGlmIChzZWxmLnNldHRpbmdzLmxvY2tPcHRncm91cE9yZGVyKSB7XG5cdCAgICAgIGdyb3Vwc19vcmRlci5zb3J0KChhLCBiKSA9PiB7XG5cdCAgICAgICAgY29uc3QgZ3JwX2EgPSBzZWxmLm9wdGdyb3Vwc1thXTtcblx0ICAgICAgICBjb25zdCBncnBfYiA9IHNlbGYub3B0Z3JvdXBzW2JdO1xuXHQgICAgICAgIGNvbnN0IGFfb3JkZXIgPSBncnBfYSAmJiBncnBfYS4kb3JkZXIgfHwgMDtcblx0ICAgICAgICBjb25zdCBiX29yZGVyID0gZ3JwX2IgJiYgZ3JwX2IuJG9yZGVyIHx8IDA7XG5cdCAgICAgICAgcmV0dXJuIGFfb3JkZXIgLSBiX29yZGVyO1xuXHQgICAgICB9KTtcblx0ICAgIH0gLy8gcmVuZGVyIG9wdGdyb3VwIGhlYWRlcnMgJiBqb2luIGdyb3Vwc1xuXG5cblx0ICAgIGh0bWwgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG5cdCAgICBpdGVyYXRlJDEoZ3JvdXBzX29yZGVyLCBvcHRncm91cCA9PiB7XG5cdCAgICAgIGxldCBncm91cF9mcmFnbWVudCA9IGdyb3Vwc1tvcHRncm91cF07XG5cdCAgICAgIGlmICghZ3JvdXBfZnJhZ21lbnQgfHwgIWdyb3VwX2ZyYWdtZW50LmNoaWxkcmVuLmxlbmd0aCkgcmV0dXJuO1xuXHQgICAgICBsZXQgZ3JvdXBfaGVhZGluZyA9IHNlbGYub3B0Z3JvdXBzW29wdGdyb3VwXTtcblxuXHQgICAgICBpZiAoZ3JvdXBfaGVhZGluZyAhPT0gdW5kZWZpbmVkKSB7XG5cdCAgICAgICAgbGV0IGdyb3VwX29wdGlvbnMgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG5cdCAgICAgICAgbGV0IGhlYWRlciA9IHNlbGYucmVuZGVyKCdvcHRncm91cF9oZWFkZXInLCBncm91cF9oZWFkaW5nKTtcblx0ICAgICAgICBhcHBlbmQoZ3JvdXBfb3B0aW9ucywgaGVhZGVyKTtcblx0ICAgICAgICBhcHBlbmQoZ3JvdXBfb3B0aW9ucywgZ3JvdXBfZnJhZ21lbnQpO1xuXHQgICAgICAgIGxldCBncm91cF9odG1sID0gc2VsZi5yZW5kZXIoJ29wdGdyb3VwJywge1xuXHQgICAgICAgICAgZ3JvdXA6IGdyb3VwX2hlYWRpbmcsXG5cdCAgICAgICAgICBvcHRpb25zOiBncm91cF9vcHRpb25zXG5cdCAgICAgICAgfSk7XG5cdCAgICAgICAgYXBwZW5kKGh0bWwsIGdyb3VwX2h0bWwpO1xuXHQgICAgICB9IGVsc2Uge1xuXHQgICAgICAgIGFwcGVuZChodG1sLCBncm91cF9mcmFnbWVudCk7XG5cdCAgICAgIH1cblx0ICAgIH0pO1xuXHQgICAgZHJvcGRvd25fY29udGVudC5pbm5lckhUTUwgPSAnJztcblx0ICAgIGFwcGVuZChkcm9wZG93bl9jb250ZW50LCBodG1sKTsgLy8gaGlnaGxpZ2h0IG1hdGNoaW5nIHRlcm1zIGlubGluZVxuXG5cdCAgICBpZiAoc2VsZi5zZXR0aW5ncy5oaWdobGlnaHQpIHtcblx0ICAgICAgcmVtb3ZlSGlnaGxpZ2h0KGRyb3Bkb3duX2NvbnRlbnQpO1xuXG5cdCAgICAgIGlmIChyZXN1bHRzLnF1ZXJ5Lmxlbmd0aCAmJiByZXN1bHRzLnRva2Vucy5sZW5ndGgpIHtcblx0ICAgICAgICBpdGVyYXRlJDEocmVzdWx0cy50b2tlbnMsIHRvayA9PiB7XG5cdCAgICAgICAgICBoaWdobGlnaHQoZHJvcGRvd25fY29udGVudCwgdG9rLnJlZ2V4KTtcblx0ICAgICAgICB9KTtcblx0ICAgICAgfVxuXHQgICAgfSAvLyBoZWxwZXIgbWV0aG9kIGZvciBhZGRpbmcgdGVtcGxhdGVzIHRvIGRyb3Bkb3duXG5cblxuXHQgICAgdmFyIGFkZF90ZW1wbGF0ZSA9IHRlbXBsYXRlID0+IHtcblx0ICAgICAgbGV0IGNvbnRlbnQgPSBzZWxmLnJlbmRlcih0ZW1wbGF0ZSwge1xuXHQgICAgICAgIGlucHV0OiBxdWVyeVxuXHQgICAgICB9KTtcblxuXHQgICAgICBpZiAoY29udGVudCkge1xuXHQgICAgICAgIHNob3dfZHJvcGRvd24gPSB0cnVlO1xuXHQgICAgICAgIGRyb3Bkb3duX2NvbnRlbnQuaW5zZXJ0QmVmb3JlKGNvbnRlbnQsIGRyb3Bkb3duX2NvbnRlbnQuZmlyc3RDaGlsZCk7XG5cdCAgICAgIH1cblxuXHQgICAgICByZXR1cm4gY29udGVudDtcblx0ICAgIH07IC8vIGFkZCBsb2FkaW5nIG1lc3NhZ2VcblxuXG5cdCAgICBpZiAoc2VsZi5sb2FkaW5nKSB7XG5cdCAgICAgIGFkZF90ZW1wbGF0ZSgnbG9hZGluZycpOyAvLyBpbnZhbGlkIHF1ZXJ5XG5cdCAgICB9IGVsc2UgaWYgKCFzZWxmLnNldHRpbmdzLnNob3VsZExvYWQuY2FsbChzZWxmLCBxdWVyeSkpIHtcblx0ICAgICAgYWRkX3RlbXBsYXRlKCdub3RfbG9hZGluZycpOyAvLyBhZGQgbm9fcmVzdWx0cyBtZXNzYWdlXG5cdCAgICB9IGVsc2UgaWYgKHJlc3VsdHMuaXRlbXMubGVuZ3RoID09PSAwKSB7XG5cdCAgICAgIGFkZF90ZW1wbGF0ZSgnbm9fcmVzdWx0cycpO1xuXHQgICAgfSAvLyBhZGQgY3JlYXRlIG9wdGlvblxuXG5cblx0ICAgIGhhc19jcmVhdGVfb3B0aW9uID0gc2VsZi5jYW5DcmVhdGUocXVlcnkpO1xuXG5cdCAgICBpZiAoaGFzX2NyZWF0ZV9vcHRpb24pIHtcblx0ICAgICAgY3JlYXRlID0gYWRkX3RlbXBsYXRlKCdvcHRpb25fY3JlYXRlJyk7XG5cdCAgICB9IC8vIGFjdGl2YXRlXG5cblxuXHQgICAgc2VsZi5oYXNPcHRpb25zID0gcmVzdWx0cy5pdGVtcy5sZW5ndGggPiAwIHx8IGhhc19jcmVhdGVfb3B0aW9uO1xuXG5cdCAgICBpZiAoc2hvd19kcm9wZG93bikge1xuXHQgICAgICBpZiAocmVzdWx0cy5pdGVtcy5sZW5ndGggPiAwKSB7XG5cdCAgICAgICAgaWYgKCFhY3RpdmVfb3B0aW9uICYmIHNlbGYuc2V0dGluZ3MubW9kZSA9PT0gJ3NpbmdsZScgJiYgc2VsZi5pdGVtc1swXSAhPSB1bmRlZmluZWQpIHtcblx0ICAgICAgICAgIGFjdGl2ZV9vcHRpb24gPSBzZWxmLmdldE9wdGlvbihzZWxmLml0ZW1zWzBdKTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICBpZiAoIWRyb3Bkb3duX2NvbnRlbnQuY29udGFpbnMoYWN0aXZlX29wdGlvbikpIHtcblx0ICAgICAgICAgIGxldCBhY3RpdmVfaW5kZXggPSAwO1xuXG5cdCAgICAgICAgICBpZiAoY3JlYXRlICYmICFzZWxmLnNldHRpbmdzLmFkZFByZWNlZGVuY2UpIHtcblx0ICAgICAgICAgICAgYWN0aXZlX2luZGV4ID0gMTtcblx0ICAgICAgICAgIH1cblxuXHQgICAgICAgICAgYWN0aXZlX29wdGlvbiA9IHNlbGYuc2VsZWN0YWJsZSgpW2FjdGl2ZV9pbmRleF07XG5cdCAgICAgICAgfVxuXHQgICAgICB9IGVsc2UgaWYgKGNyZWF0ZSkge1xuXHQgICAgICAgIGFjdGl2ZV9vcHRpb24gPSBjcmVhdGU7XG5cdCAgICAgIH1cblxuXHQgICAgICBpZiAodHJpZ2dlckRyb3Bkb3duICYmICFzZWxmLmlzT3Blbikge1xuXHQgICAgICAgIHNlbGYub3BlbigpO1xuXHQgICAgICAgIHNlbGYuc2Nyb2xsVG9PcHRpb24oYWN0aXZlX29wdGlvbiwgJ2F1dG8nKTtcblx0ICAgICAgfVxuXG5cdCAgICAgIHNlbGYuc2V0QWN0aXZlT3B0aW9uKGFjdGl2ZV9vcHRpb24pO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgc2VsZi5jbGVhckFjdGl2ZU9wdGlvbigpO1xuXG5cdCAgICAgIGlmICh0cmlnZ2VyRHJvcGRvd24gJiYgc2VsZi5pc09wZW4pIHtcblx0ICAgICAgICBzZWxmLmNsb3NlKGZhbHNlKTsgLy8gaWYgY3JlYXRlX29wdGlvbj1udWxsLCB3ZSB3YW50IHRoZSBkcm9wZG93biB0byBjbG9zZSBidXQgbm90IHJlc2V0IHRoZSB0ZXh0Ym94IHZhbHVlXG5cdCAgICAgIH1cblx0ICAgIH1cblx0ICB9XG5cdCAgLyoqXG5cdCAgICogUmV0dXJuIGxpc3Qgb2Ygc2VsZWN0YWJsZSBvcHRpb25zXG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgc2VsZWN0YWJsZSgpIHtcblx0ICAgIHJldHVybiB0aGlzLmRyb3Bkb3duX2NvbnRlbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtc2VsZWN0YWJsZV0nKTtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogQWRkcyBhbiBhdmFpbGFibGUgb3B0aW9uLiBJZiBpdCBhbHJlYWR5IGV4aXN0cyxcblx0ICAgKiBub3RoaW5nIHdpbGwgaGFwcGVuLiBOb3RlOiB0aGlzIGRvZXMgbm90IHJlZnJlc2hcblx0ICAgKiB0aGUgb3B0aW9ucyBsaXN0IGRyb3Bkb3duICh1c2UgYHJlZnJlc2hPcHRpb25zYFxuXHQgICAqIGZvciB0aGF0KS5cblx0ICAgKlxuXHQgICAqIFVzYWdlOlxuXHQgICAqXG5cdCAgICogICB0aGlzLmFkZE9wdGlvbihkYXRhKVxuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIGFkZE9wdGlvbihkYXRhLCB1c2VyX2NyZWF0ZWQgPSBmYWxzZSkge1xuXHQgICAgY29uc3Qgc2VsZiA9IHRoaXM7IC8vIEBkZXByZWNhdGVkIDEuNy43XG5cdCAgICAvLyB1c2UgYWRkT3B0aW9ucyggYXJyYXksIHVzZXJfY3JlYXRlZCApIGZvciBhZGRpbmcgbXVsdGlwbGUgb3B0aW9uc1xuXG5cdCAgICBpZiAoQXJyYXkuaXNBcnJheShkYXRhKSkge1xuXHQgICAgICBzZWxmLmFkZE9wdGlvbnMoZGF0YSwgdXNlcl9jcmVhdGVkKTtcblx0ICAgICAgcmV0dXJuIGZhbHNlO1xuXHQgICAgfVxuXG5cdCAgICBjb25zdCBrZXkgPSBoYXNoX2tleShkYXRhW3NlbGYuc2V0dGluZ3MudmFsdWVGaWVsZF0pO1xuXG5cdCAgICBpZiAoa2V5ID09PSBudWxsIHx8IHNlbGYub3B0aW9ucy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG5cdCAgICAgIHJldHVybiBmYWxzZTtcblx0ICAgIH1cblxuXHQgICAgZGF0YS4kb3JkZXIgPSBkYXRhLiRvcmRlciB8fCArK3NlbGYub3JkZXI7XG5cdCAgICBkYXRhLiRpZCA9IHNlbGYuaW5wdXRJZCArICctb3B0LScgKyBkYXRhLiRvcmRlcjtcblx0ICAgIHNlbGYub3B0aW9uc1trZXldID0gZGF0YTtcblx0ICAgIHNlbGYubGFzdFF1ZXJ5ID0gbnVsbDtcblxuXHQgICAgaWYgKHVzZXJfY3JlYXRlZCkge1xuXHQgICAgICBzZWxmLnVzZXJPcHRpb25zW2tleV0gPSB1c2VyX2NyZWF0ZWQ7XG5cdCAgICAgIHNlbGYudHJpZ2dlcignb3B0aW9uX2FkZCcsIGtleSwgZGF0YSk7XG5cdCAgICB9XG5cblx0ICAgIHJldHVybiBrZXk7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIEFkZCBtdWx0aXBsZSBvcHRpb25zXG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgYWRkT3B0aW9ucyhkYXRhLCB1c2VyX2NyZWF0ZWQgPSBmYWxzZSkge1xuXHQgICAgaXRlcmF0ZSQxKGRhdGEsIGRhdCA9PiB7XG5cdCAgICAgIHRoaXMuYWRkT3B0aW9uKGRhdCwgdXNlcl9jcmVhdGVkKTtcblx0ICAgIH0pO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBAZGVwcmVjYXRlZCAxLjcuN1xuXHQgICAqL1xuXG5cblx0ICByZWdpc3Rlck9wdGlvbihkYXRhKSB7XG5cdCAgICByZXR1cm4gdGhpcy5hZGRPcHRpb24oZGF0YSk7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFJlZ2lzdGVycyBhbiBvcHRpb24gZ3JvdXAgdG8gdGhlIHBvb2wgb2Ygb3B0aW9uIGdyb3Vwcy5cblx0ICAgKlxuXHQgICAqIEByZXR1cm4ge2Jvb2xlYW58c3RyaW5nfVxuXHQgICAqL1xuXG5cblx0ICByZWdpc3Rlck9wdGlvbkdyb3VwKGRhdGEpIHtcblx0ICAgIHZhciBrZXkgPSBoYXNoX2tleShkYXRhW3RoaXMuc2V0dGluZ3Mub3B0Z3JvdXBWYWx1ZUZpZWxkXSk7XG5cdCAgICBpZiAoa2V5ID09PSBudWxsKSByZXR1cm4gZmFsc2U7XG5cdCAgICBkYXRhLiRvcmRlciA9IGRhdGEuJG9yZGVyIHx8ICsrdGhpcy5vcmRlcjtcblx0ICAgIHRoaXMub3B0Z3JvdXBzW2tleV0gPSBkYXRhO1xuXHQgICAgcmV0dXJuIGtleTtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogUmVnaXN0ZXJzIGEgbmV3IG9wdGdyb3VwIGZvciBvcHRpb25zXG5cdCAgICogdG8gYmUgYnVja2V0ZWQgaW50by5cblx0ICAgKlxuXHQgICAqL1xuXG5cblx0ICBhZGRPcHRpb25Hcm91cChpZCwgZGF0YSkge1xuXHQgICAgdmFyIGhhc2hlZF9pZDtcblx0ICAgIGRhdGFbdGhpcy5zZXR0aW5ncy5vcHRncm91cFZhbHVlRmllbGRdID0gaWQ7XG5cblx0ICAgIGlmIChoYXNoZWRfaWQgPSB0aGlzLnJlZ2lzdGVyT3B0aW9uR3JvdXAoZGF0YSkpIHtcblx0ICAgICAgdGhpcy50cmlnZ2VyKCdvcHRncm91cF9hZGQnLCBoYXNoZWRfaWQsIGRhdGEpO1xuXHQgICAgfVxuXHQgIH1cblx0ICAvKipcblx0ICAgKiBSZW1vdmVzIGFuIGV4aXN0aW5nIG9wdGlvbiBncm91cC5cblx0ICAgKlxuXHQgICAqL1xuXG5cblx0ICByZW1vdmVPcHRpb25Hcm91cChpZCkge1xuXHQgICAgaWYgKHRoaXMub3B0Z3JvdXBzLmhhc093blByb3BlcnR5KGlkKSkge1xuXHQgICAgICBkZWxldGUgdGhpcy5vcHRncm91cHNbaWRdO1xuXHQgICAgICB0aGlzLmNsZWFyQ2FjaGUoKTtcblx0ICAgICAgdGhpcy50cmlnZ2VyKCdvcHRncm91cF9yZW1vdmUnLCBpZCk7XG5cdCAgICB9XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIENsZWFycyBhbGwgZXhpc3Rpbmcgb3B0aW9uIGdyb3Vwcy5cblx0ICAgKi9cblxuXG5cdCAgY2xlYXJPcHRpb25Hcm91cHMoKSB7XG5cdCAgICB0aGlzLm9wdGdyb3VwcyA9IHt9O1xuXHQgICAgdGhpcy5jbGVhckNhY2hlKCk7XG5cdCAgICB0aGlzLnRyaWdnZXIoJ29wdGdyb3VwX2NsZWFyJyk7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFVwZGF0ZXMgYW4gb3B0aW9uIGF2YWlsYWJsZSBmb3Igc2VsZWN0aW9uLiBJZlxuXHQgICAqIGl0IGlzIHZpc2libGUgaW4gdGhlIHNlbGVjdGVkIGl0ZW1zIG9yIG9wdGlvbnNcblx0ICAgKiBkcm9wZG93biwgaXQgd2lsbCBiZSByZS1yZW5kZXJlZCBhdXRvbWF0aWNhbGx5LlxuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIHVwZGF0ZU9wdGlvbih2YWx1ZSwgZGF0YSkge1xuXHQgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cdCAgICB2YXIgaXRlbV9uZXc7XG5cdCAgICB2YXIgaW5kZXhfaXRlbTtcblx0ICAgIGNvbnN0IHZhbHVlX29sZCA9IGhhc2hfa2V5KHZhbHVlKTtcblx0ICAgIGNvbnN0IHZhbHVlX25ldyA9IGhhc2hfa2V5KGRhdGFbc2VsZi5zZXR0aW5ncy52YWx1ZUZpZWxkXSk7IC8vIHNhbml0eSBjaGVja3NcblxuXHQgICAgaWYgKHZhbHVlX29sZCA9PT0gbnVsbCkgcmV0dXJuO1xuXHQgICAgY29uc3QgZGF0YV9vbGQgPSBzZWxmLm9wdGlvbnNbdmFsdWVfb2xkXTtcblx0ICAgIGlmIChkYXRhX29sZCA9PSB1bmRlZmluZWQpIHJldHVybjtcblx0ICAgIGlmICh0eXBlb2YgdmFsdWVfbmV3ICE9PSAnc3RyaW5nJykgdGhyb3cgbmV3IEVycm9yKCdWYWx1ZSBtdXN0IGJlIHNldCBpbiBvcHRpb24gZGF0YScpO1xuXHQgICAgY29uc3Qgb3B0aW9uID0gc2VsZi5nZXRPcHRpb24odmFsdWVfb2xkKTtcblx0ICAgIGNvbnN0IGl0ZW0gPSBzZWxmLmdldEl0ZW0odmFsdWVfb2xkKTtcblx0ICAgIGRhdGEuJG9yZGVyID0gZGF0YS4kb3JkZXIgfHwgZGF0YV9vbGQuJG9yZGVyO1xuXHQgICAgZGVsZXRlIHNlbGYub3B0aW9uc1t2YWx1ZV9vbGRdOyAvLyBpbnZhbGlkYXRlIHJlbmRlciBjYWNoZVxuXHQgICAgLy8gZG9uJ3QgcmVtb3ZlIGV4aXN0aW5nIG5vZGUgeWV0LCB3ZSdsbCByZW1vdmUgaXQgYWZ0ZXIgcmVwbGFjaW5nIGl0XG5cblx0ICAgIHNlbGYudW5jYWNoZVZhbHVlKHZhbHVlX25ldyk7XG5cdCAgICBzZWxmLm9wdGlvbnNbdmFsdWVfbmV3XSA9IGRhdGE7IC8vIHVwZGF0ZSB0aGUgb3B0aW9uIGlmIGl0J3MgaW4gdGhlIGRyb3Bkb3duXG5cblx0ICAgIGlmIChvcHRpb24pIHtcblx0ICAgICAgaWYgKHNlbGYuZHJvcGRvd25fY29udGVudC5jb250YWlucyhvcHRpb24pKSB7XG5cdCAgICAgICAgY29uc3Qgb3B0aW9uX25ldyA9IHNlbGYuX3JlbmRlcignb3B0aW9uJywgZGF0YSk7XG5cblx0ICAgICAgICByZXBsYWNlTm9kZShvcHRpb24sIG9wdGlvbl9uZXcpO1xuXG5cdCAgICAgICAgaWYgKHNlbGYuYWN0aXZlT3B0aW9uID09PSBvcHRpb24pIHtcblx0ICAgICAgICAgIHNlbGYuc2V0QWN0aXZlT3B0aW9uKG9wdGlvbl9uZXcpO1xuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXG5cdCAgICAgIG9wdGlvbi5yZW1vdmUoKTtcblx0ICAgIH0gLy8gdXBkYXRlIHRoZSBpdGVtIGlmIHdlIGhhdmUgb25lXG5cblxuXHQgICAgaWYgKGl0ZW0pIHtcblx0ICAgICAgaW5kZXhfaXRlbSA9IHNlbGYuaXRlbXMuaW5kZXhPZih2YWx1ZV9vbGQpO1xuXG5cdCAgICAgIGlmIChpbmRleF9pdGVtICE9PSAtMSkge1xuXHQgICAgICAgIHNlbGYuaXRlbXMuc3BsaWNlKGluZGV4X2l0ZW0sIDEsIHZhbHVlX25ldyk7XG5cdCAgICAgIH1cblxuXHQgICAgICBpdGVtX25ldyA9IHNlbGYuX3JlbmRlcignaXRlbScsIGRhdGEpO1xuXHQgICAgICBpZiAoaXRlbS5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSBhZGRDbGFzc2VzKGl0ZW1fbmV3LCAnYWN0aXZlJyk7XG5cdCAgICAgIHJlcGxhY2VOb2RlKGl0ZW0sIGl0ZW1fbmV3KTtcblx0ICAgIH0gLy8gaW52YWxpZGF0ZSBsYXN0IHF1ZXJ5IGJlY2F1c2Ugd2UgbWlnaHQgaGF2ZSB1cGRhdGVkIHRoZSBzb3J0RmllbGRcblxuXG5cdCAgICBzZWxmLmxhc3RRdWVyeSA9IG51bGw7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFJlbW92ZXMgYSBzaW5nbGUgb3B0aW9uLlxuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIHJlbW92ZU9wdGlvbih2YWx1ZSwgc2lsZW50KSB7XG5cdCAgICBjb25zdCBzZWxmID0gdGhpcztcblx0ICAgIHZhbHVlID0gZ2V0X2hhc2godmFsdWUpO1xuXHQgICAgc2VsZi51bmNhY2hlVmFsdWUodmFsdWUpO1xuXHQgICAgZGVsZXRlIHNlbGYudXNlck9wdGlvbnNbdmFsdWVdO1xuXHQgICAgZGVsZXRlIHNlbGYub3B0aW9uc1t2YWx1ZV07XG5cdCAgICBzZWxmLmxhc3RRdWVyeSA9IG51bGw7XG5cdCAgICBzZWxmLnRyaWdnZXIoJ29wdGlvbl9yZW1vdmUnLCB2YWx1ZSk7XG5cdCAgICBzZWxmLnJlbW92ZUl0ZW0odmFsdWUsIHNpbGVudCk7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIENsZWFycyBhbGwgb3B0aW9ucy5cblx0ICAgKi9cblxuXG5cdCAgY2xlYXJPcHRpb25zKGZpbHRlcikge1xuXHQgICAgY29uc3QgYm91bmRGaWx0ZXIgPSAoZmlsdGVyIHx8IHRoaXMuY2xlYXJGaWx0ZXIpLmJpbmQodGhpcyk7XG5cdCAgICB0aGlzLmxvYWRlZFNlYXJjaGVzID0ge307XG5cdCAgICB0aGlzLnVzZXJPcHRpb25zID0ge307XG5cdCAgICB0aGlzLmNsZWFyQ2FjaGUoKTtcblx0ICAgIGNvbnN0IHNlbGVjdGVkID0ge307XG5cdCAgICBpdGVyYXRlJDEodGhpcy5vcHRpb25zLCAob3B0aW9uLCBrZXkpID0+IHtcblx0ICAgICAgaWYgKGJvdW5kRmlsdGVyKG9wdGlvbiwga2V5KSkge1xuXHQgICAgICAgIHNlbGVjdGVkW2tleV0gPSBvcHRpb247XG5cdCAgICAgIH1cblx0ICAgIH0pO1xuXHQgICAgdGhpcy5vcHRpb25zID0gdGhpcy5zaWZ0ZXIuaXRlbXMgPSBzZWxlY3RlZDtcblx0ICAgIHRoaXMubGFzdFF1ZXJ5ID0gbnVsbDtcblx0ICAgIHRoaXMudHJpZ2dlcignb3B0aW9uX2NsZWFyJyk7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFVzZWQgYnkgY2xlYXJPcHRpb25zKCkgdG8gZGVjaWRlIHdoZXRoZXIgb3Igbm90IGFuIG9wdGlvbiBzaG91bGQgYmUgcmVtb3ZlZFxuXHQgICAqIFJldHVybiB0cnVlIHRvIGtlZXAgYW4gb3B0aW9uLCBmYWxzZSB0byByZW1vdmVcblx0ICAgKlxuXHQgICAqL1xuXG5cblx0ICBjbGVhckZpbHRlcihvcHRpb24sIHZhbHVlKSB7XG5cdCAgICBpZiAodGhpcy5pdGVtcy5pbmRleE9mKHZhbHVlKSA+PSAwKSB7XG5cdCAgICAgIHJldHVybiB0cnVlO1xuXHQgICAgfVxuXG5cdCAgICByZXR1cm4gZmFsc2U7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFJldHVybnMgdGhlIGRvbSBlbGVtZW50IG9mIHRoZSBvcHRpb25cblx0ICAgKiBtYXRjaGluZyB0aGUgZ2l2ZW4gdmFsdWUuXG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgZ2V0T3B0aW9uKHZhbHVlLCBjcmVhdGUgPSBmYWxzZSkge1xuXHQgICAgY29uc3QgaGFzaGVkID0gaGFzaF9rZXkodmFsdWUpO1xuXHQgICAgaWYgKGhhc2hlZCA9PT0gbnVsbCkgcmV0dXJuIG51bGw7XG5cdCAgICBjb25zdCBvcHRpb24gPSB0aGlzLm9wdGlvbnNbaGFzaGVkXTtcblxuXHQgICAgaWYgKG9wdGlvbiAhPSB1bmRlZmluZWQpIHtcblx0ICAgICAgaWYgKG9wdGlvbi4kZGl2KSB7XG5cdCAgICAgICAgcmV0dXJuIG9wdGlvbi4kZGl2O1xuXHQgICAgICB9XG5cblx0ICAgICAgaWYgKGNyZWF0ZSkge1xuXHQgICAgICAgIHJldHVybiB0aGlzLl9yZW5kZXIoJ29wdGlvbicsIG9wdGlvbik7XG5cdCAgICAgIH1cblx0ICAgIH1cblxuXHQgICAgcmV0dXJuIG51bGw7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFJldHVybnMgdGhlIGRvbSBlbGVtZW50IG9mIHRoZSBuZXh0IG9yIHByZXZpb3VzIGRvbSBlbGVtZW50IG9mIHRoZSBzYW1lIHR5cGVcblx0ICAgKiBOb3RlOiBhZGphY2VudCBvcHRpb25zIG1heSBub3QgYmUgYWRqYWNlbnQgRE9NIGVsZW1lbnRzIChvcHRncm91cHMpXG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgZ2V0QWRqYWNlbnQob3B0aW9uLCBkaXJlY3Rpb24sIHR5cGUgPSAnb3B0aW9uJykge1xuXHQgICAgdmFyIHNlbGYgPSB0aGlzLFxuXHQgICAgICAgIGFsbDtcblxuXHQgICAgaWYgKCFvcHRpb24pIHtcblx0ICAgICAgcmV0dXJuIG51bGw7XG5cdCAgICB9XG5cblx0ICAgIGlmICh0eXBlID09ICdpdGVtJykge1xuXHQgICAgICBhbGwgPSBzZWxmLmNvbnRyb2xDaGlsZHJlbigpO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgYWxsID0gc2VsZi5kcm9wZG93bl9jb250ZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLXNlbGVjdGFibGVdJyk7XG5cdCAgICB9XG5cblx0ICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYWxsLmxlbmd0aDsgaSsrKSB7XG5cdCAgICAgIGlmIChhbGxbaV0gIT0gb3B0aW9uKSB7XG5cdCAgICAgICAgY29udGludWU7XG5cdCAgICAgIH1cblxuXHQgICAgICBpZiAoZGlyZWN0aW9uID4gMCkge1xuXHQgICAgICAgIHJldHVybiBhbGxbaSArIDFdO1xuXHQgICAgICB9XG5cblx0ICAgICAgcmV0dXJuIGFsbFtpIC0gMV07XG5cdCAgICB9XG5cblx0ICAgIHJldHVybiBudWxsO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBSZXR1cm5zIHRoZSBkb20gZWxlbWVudCBvZiB0aGUgaXRlbVxuXHQgICAqIG1hdGNoaW5nIHRoZSBnaXZlbiB2YWx1ZS5cblx0ICAgKlxuXHQgICAqL1xuXG5cblx0ICBnZXRJdGVtKGl0ZW0pIHtcblx0ICAgIGlmICh0eXBlb2YgaXRlbSA9PSAnb2JqZWN0Jykge1xuXHQgICAgICByZXR1cm4gaXRlbTtcblx0ICAgIH1cblxuXHQgICAgdmFyIHZhbHVlID0gaGFzaF9rZXkoaXRlbSk7XG5cdCAgICByZXR1cm4gdmFsdWUgIT09IG51bGwgPyB0aGlzLmNvbnRyb2wucXVlcnlTZWxlY3RvcihgW2RhdGEtdmFsdWU9XCIke2FkZFNsYXNoZXModmFsdWUpfVwiXWApIDogbnVsbDtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogXCJTZWxlY3RzXCIgbXVsdGlwbGUgaXRlbXMgYXQgb25jZS4gQWRkcyB0aGVtIHRvIHRoZSBsaXN0XG5cdCAgICogYXQgdGhlIGN1cnJlbnQgY2FyZXQgcG9zaXRpb24uXG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgYWRkSXRlbXModmFsdWVzLCBzaWxlbnQpIHtcblx0ICAgIHZhciBzZWxmID0gdGhpcztcblx0ICAgIHZhciBpdGVtcyA9IEFycmF5LmlzQXJyYXkodmFsdWVzKSA/IHZhbHVlcyA6IFt2YWx1ZXNdO1xuXHQgICAgaXRlbXMgPSBpdGVtcy5maWx0ZXIoeCA9PiBzZWxmLml0ZW1zLmluZGV4T2YoeCkgPT09IC0xKTtcblx0ICAgIGNvbnN0IGxhc3RfaXRlbSA9IGl0ZW1zW2l0ZW1zLmxlbmd0aCAtIDFdO1xuXHQgICAgaXRlbXMuZm9yRWFjaChpdGVtID0+IHtcblx0ICAgICAgc2VsZi5pc1BlbmRpbmcgPSBpdGVtICE9PSBsYXN0X2l0ZW07XG5cdCAgICAgIHNlbGYuYWRkSXRlbShpdGVtLCBzaWxlbnQpO1xuXHQgICAgfSk7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFwiU2VsZWN0c1wiIGFuIGl0ZW0uIEFkZHMgaXQgdG8gdGhlIGxpc3Rcblx0ICAgKiBhdCB0aGUgY3VycmVudCBjYXJldCBwb3NpdGlvbi5cblx0ICAgKlxuXHQgICAqL1xuXG5cblx0ICBhZGRJdGVtKHZhbHVlLCBzaWxlbnQpIHtcblx0ICAgIHZhciBldmVudHMgPSBzaWxlbnQgPyBbXSA6IFsnY2hhbmdlJywgJ2Ryb3Bkb3duX2Nsb3NlJ107XG5cdCAgICBkZWJvdW5jZV9ldmVudHModGhpcywgZXZlbnRzLCAoKSA9PiB7XG5cdCAgICAgIHZhciBpdGVtLCB3YXNGdWxsO1xuXHQgICAgICBjb25zdCBzZWxmID0gdGhpcztcblx0ICAgICAgY29uc3QgaW5wdXRNb2RlID0gc2VsZi5zZXR0aW5ncy5tb2RlO1xuXHQgICAgICBjb25zdCBoYXNoZWQgPSBoYXNoX2tleSh2YWx1ZSk7XG5cblx0ICAgICAgaWYgKGhhc2hlZCAmJiBzZWxmLml0ZW1zLmluZGV4T2YoaGFzaGVkKSAhPT0gLTEpIHtcblx0ICAgICAgICBpZiAoaW5wdXRNb2RlID09PSAnc2luZ2xlJykge1xuXHQgICAgICAgICAgc2VsZi5jbG9zZSgpO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIGlmIChpbnB1dE1vZGUgPT09ICdzaW5nbGUnIHx8ICFzZWxmLnNldHRpbmdzLmR1cGxpY2F0ZXMpIHtcblx0ICAgICAgICAgIHJldHVybjtcblx0ICAgICAgICB9XG5cdCAgICAgIH1cblxuXHQgICAgICBpZiAoaGFzaGVkID09PSBudWxsIHx8ICFzZWxmLm9wdGlvbnMuaGFzT3duUHJvcGVydHkoaGFzaGVkKSkgcmV0dXJuO1xuXHQgICAgICBpZiAoaW5wdXRNb2RlID09PSAnc2luZ2xlJykgc2VsZi5jbGVhcihzaWxlbnQpO1xuXHQgICAgICBpZiAoaW5wdXRNb2RlID09PSAnbXVsdGknICYmIHNlbGYuaXNGdWxsKCkpIHJldHVybjtcblx0ICAgICAgaXRlbSA9IHNlbGYuX3JlbmRlcignaXRlbScsIHNlbGYub3B0aW9uc1toYXNoZWRdKTtcblxuXHQgICAgICBpZiAoc2VsZi5jb250cm9sLmNvbnRhaW5zKGl0ZW0pKSB7XG5cdCAgICAgICAgLy8gZHVwbGljYXRlc1xuXHQgICAgICAgIGl0ZW0gPSBpdGVtLmNsb25lTm9kZSh0cnVlKTtcblx0ICAgICAgfVxuXG5cdCAgICAgIHdhc0Z1bGwgPSBzZWxmLmlzRnVsbCgpO1xuXHQgICAgICBzZWxmLml0ZW1zLnNwbGljZShzZWxmLmNhcmV0UG9zLCAwLCBoYXNoZWQpO1xuXHQgICAgICBzZWxmLmluc2VydEF0Q2FyZXQoaXRlbSk7XG5cblx0ICAgICAgaWYgKHNlbGYuaXNTZXR1cCkge1xuXHQgICAgICAgIC8vIHVwZGF0ZSBtZW51IC8gcmVtb3ZlIHRoZSBvcHRpb24gKGlmIHRoaXMgaXMgbm90IG9uZSBpdGVtIGJlaW5nIGFkZGVkIGFzIHBhcnQgb2Ygc2VyaWVzKVxuXHQgICAgICAgIGlmICghc2VsZi5pc1BlbmRpbmcgJiYgc2VsZi5zZXR0aW5ncy5oaWRlU2VsZWN0ZWQpIHtcblx0ICAgICAgICAgIGxldCBvcHRpb24gPSBzZWxmLmdldE9wdGlvbihoYXNoZWQpO1xuXHQgICAgICAgICAgbGV0IG5leHQgPSBzZWxmLmdldEFkamFjZW50KG9wdGlvbiwgMSk7XG5cblx0ICAgICAgICAgIGlmIChuZXh0KSB7XG5cdCAgICAgICAgICAgIHNlbGYuc2V0QWN0aXZlT3B0aW9uKG5leHQpO1xuXHQgICAgICAgICAgfVxuXHQgICAgICAgIH0gLy8gcmVmcmVzaE9wdGlvbnMgYWZ0ZXIgc2V0QWN0aXZlT3B0aW9uKCksXG5cdCAgICAgICAgLy8gb3RoZXJ3aXNlIHNldEFjdGl2ZU9wdGlvbigpIHdpbGwgYmUgY2FsbGVkIGJ5IHJlZnJlc2hPcHRpb25zKCkgd2l0aCB0aGUgd3JvbmcgdmFsdWVcblxuXG5cdCAgICAgICAgaWYgKCFzZWxmLmlzUGVuZGluZyAmJiAhc2VsZi5zZXR0aW5ncy5jbG9zZUFmdGVyU2VsZWN0KSB7XG5cdCAgICAgICAgICBzZWxmLnJlZnJlc2hPcHRpb25zKHNlbGYuaXNGb2N1c2VkICYmIGlucHV0TW9kZSAhPT0gJ3NpbmdsZScpO1xuXHQgICAgICAgIH0gLy8gaGlkZSB0aGUgbWVudSBpZiB0aGUgbWF4aW11bSBudW1iZXIgb2YgaXRlbXMgaGF2ZSBiZWVuIHNlbGVjdGVkIG9yIG5vIG9wdGlvbnMgYXJlIGxlZnRcblxuXG5cdCAgICAgICAgaWYgKHNlbGYuc2V0dGluZ3MuY2xvc2VBZnRlclNlbGVjdCAhPSBmYWxzZSAmJiBzZWxmLmlzRnVsbCgpKSB7XG5cdCAgICAgICAgICBzZWxmLmNsb3NlKCk7XG5cdCAgICAgICAgfSBlbHNlIGlmICghc2VsZi5pc1BlbmRpbmcpIHtcblx0ICAgICAgICAgIHNlbGYucG9zaXRpb25Ecm9wZG93bigpO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHNlbGYudHJpZ2dlcignaXRlbV9hZGQnLCBoYXNoZWQsIGl0ZW0pO1xuXG5cdCAgICAgICAgaWYgKCFzZWxmLmlzUGVuZGluZykge1xuXHQgICAgICAgICAgc2VsZi51cGRhdGVPcmlnaW5hbElucHV0KHtcblx0ICAgICAgICAgICAgc2lsZW50OiBzaWxlbnRcblx0ICAgICAgICAgIH0pO1xuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXG5cdCAgICAgIGlmICghc2VsZi5pc1BlbmRpbmcgfHwgIXdhc0Z1bGwgJiYgc2VsZi5pc0Z1bGwoKSkge1xuXHQgICAgICAgIHNlbGYuaW5wdXRTdGF0ZSgpO1xuXHQgICAgICAgIHNlbGYucmVmcmVzaFN0YXRlKCk7XG5cdCAgICAgIH1cblx0ICAgIH0pO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBSZW1vdmVzIHRoZSBzZWxlY3RlZCBpdGVtIG1hdGNoaW5nXG5cdCAgICogdGhlIHByb3ZpZGVkIHZhbHVlLlxuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIHJlbW92ZUl0ZW0oaXRlbSA9IG51bGwsIHNpbGVudCkge1xuXHQgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cdCAgICBpdGVtID0gc2VsZi5nZXRJdGVtKGl0ZW0pO1xuXHQgICAgaWYgKCFpdGVtKSByZXR1cm47XG5cdCAgICB2YXIgaSwgaWR4O1xuXHQgICAgY29uc3QgdmFsdWUgPSBpdGVtLmRhdGFzZXQudmFsdWU7XG5cdCAgICBpID0gbm9kZUluZGV4KGl0ZW0pO1xuXHQgICAgaXRlbS5yZW1vdmUoKTtcblxuXHQgICAgaWYgKGl0ZW0uY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkge1xuXHQgICAgICBpZHggPSBzZWxmLmFjdGl2ZUl0ZW1zLmluZGV4T2YoaXRlbSk7XG5cdCAgICAgIHNlbGYuYWN0aXZlSXRlbXMuc3BsaWNlKGlkeCwgMSk7XG5cdCAgICAgIHJlbW92ZUNsYXNzZXMoaXRlbSwgJ2FjdGl2ZScpO1xuXHQgICAgfVxuXG5cdCAgICBzZWxmLml0ZW1zLnNwbGljZShpLCAxKTtcblx0ICAgIHNlbGYubGFzdFF1ZXJ5ID0gbnVsbDtcblxuXHQgICAgaWYgKCFzZWxmLnNldHRpbmdzLnBlcnNpc3QgJiYgc2VsZi51c2VyT3B0aW9ucy5oYXNPd25Qcm9wZXJ0eSh2YWx1ZSkpIHtcblx0ICAgICAgc2VsZi5yZW1vdmVPcHRpb24odmFsdWUsIHNpbGVudCk7XG5cdCAgICB9XG5cblx0ICAgIGlmIChpIDwgc2VsZi5jYXJldFBvcykge1xuXHQgICAgICBzZWxmLnNldENhcmV0KHNlbGYuY2FyZXRQb3MgLSAxKTtcblx0ICAgIH1cblxuXHQgICAgc2VsZi51cGRhdGVPcmlnaW5hbElucHV0KHtcblx0ICAgICAgc2lsZW50OiBzaWxlbnRcblx0ICAgIH0pO1xuXHQgICAgc2VsZi5yZWZyZXNoU3RhdGUoKTtcblx0ICAgIHNlbGYucG9zaXRpb25Ecm9wZG93bigpO1xuXHQgICAgc2VsZi50cmlnZ2VyKCdpdGVtX3JlbW92ZScsIHZhbHVlLCBpdGVtKTtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogSW52b2tlcyB0aGUgYGNyZWF0ZWAgbWV0aG9kIHByb3ZpZGVkIGluIHRoZVxuXHQgICAqIFRvbVNlbGVjdCBvcHRpb25zIHRoYXQgc2hvdWxkIHByb3ZpZGUgdGhlIGRhdGFcblx0ICAgKiBmb3IgdGhlIG5ldyBpdGVtLCBnaXZlbiB0aGUgdXNlciBpbnB1dC5cblx0ICAgKlxuXHQgICAqIE9uY2UgdGhpcyBjb21wbGV0ZXMsIGl0IHdpbGwgYmUgYWRkZWRcblx0ICAgKiB0byB0aGUgaXRlbSBsaXN0LlxuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIGNyZWF0ZUl0ZW0oaW5wdXQgPSBudWxsLCBjYWxsYmFjayA9ICgpID0+IHt9KSB7XG5cdCAgICAvLyB0cmlnZ2VyRHJvcGRvd24gcGFyYW1ldGVyIEBkZXByZWNhdGVkIDIuMS4xXG5cdCAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMykge1xuXHQgICAgICBjYWxsYmFjayA9IGFyZ3VtZW50c1syXTtcblx0ICAgIH1cblxuXHQgICAgaWYgKHR5cGVvZiBjYWxsYmFjayAhPSAnZnVuY3Rpb24nKSB7XG5cdCAgICAgIGNhbGxiYWNrID0gKCkgPT4ge307XG5cdCAgICB9XG5cblx0ICAgIHZhciBzZWxmID0gdGhpcztcblx0ICAgIHZhciBjYXJldCA9IHNlbGYuY2FyZXRQb3M7XG5cdCAgICB2YXIgb3V0cHV0O1xuXHQgICAgaW5wdXQgPSBpbnB1dCB8fCBzZWxmLmlucHV0VmFsdWUoKTtcblxuXHQgICAgaWYgKCFzZWxmLmNhbkNyZWF0ZShpbnB1dCkpIHtcblx0ICAgICAgY2FsbGJhY2soKTtcblx0ICAgICAgcmV0dXJuIGZhbHNlO1xuXHQgICAgfVxuXG5cdCAgICBzZWxmLmxvY2soKTtcblx0ICAgIHZhciBjcmVhdGVkID0gZmFsc2U7XG5cblx0ICAgIHZhciBjcmVhdGUgPSBkYXRhID0+IHtcblx0ICAgICAgc2VsZi51bmxvY2soKTtcblx0ICAgICAgaWYgKCFkYXRhIHx8IHR5cGVvZiBkYXRhICE9PSAnb2JqZWN0JykgcmV0dXJuIGNhbGxiYWNrKCk7XG5cdCAgICAgIHZhciB2YWx1ZSA9IGhhc2hfa2V5KGRhdGFbc2VsZi5zZXR0aW5ncy52YWx1ZUZpZWxkXSk7XG5cblx0ICAgICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ3N0cmluZycpIHtcblx0ICAgICAgICByZXR1cm4gY2FsbGJhY2soKTtcblx0ICAgICAgfVxuXG5cdCAgICAgIHNlbGYuc2V0VGV4dGJveFZhbHVlKCk7XG5cdCAgICAgIHNlbGYuYWRkT3B0aW9uKGRhdGEsIHRydWUpO1xuXHQgICAgICBzZWxmLnNldENhcmV0KGNhcmV0KTtcblx0ICAgICAgc2VsZi5hZGRJdGVtKHZhbHVlKTtcblx0ICAgICAgY2FsbGJhY2soZGF0YSk7XG5cdCAgICAgIGNyZWF0ZWQgPSB0cnVlO1xuXHQgICAgfTtcblxuXHQgICAgaWYgKHR5cGVvZiBzZWxmLnNldHRpbmdzLmNyZWF0ZSA9PT0gJ2Z1bmN0aW9uJykge1xuXHQgICAgICBvdXRwdXQgPSBzZWxmLnNldHRpbmdzLmNyZWF0ZS5jYWxsKHRoaXMsIGlucHV0LCBjcmVhdGUpO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgb3V0cHV0ID0ge1xuXHQgICAgICAgIFtzZWxmLnNldHRpbmdzLmxhYmVsRmllbGRdOiBpbnB1dCxcblx0ICAgICAgICBbc2VsZi5zZXR0aW5ncy52YWx1ZUZpZWxkXTogaW5wdXRcblx0ICAgICAgfTtcblx0ICAgIH1cblxuXHQgICAgaWYgKCFjcmVhdGVkKSB7XG5cdCAgICAgIGNyZWF0ZShvdXRwdXQpO1xuXHQgICAgfVxuXG5cdCAgICByZXR1cm4gdHJ1ZTtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogUmUtcmVuZGVycyB0aGUgc2VsZWN0ZWQgaXRlbSBsaXN0cy5cblx0ICAgKi9cblxuXG5cdCAgcmVmcmVzaEl0ZW1zKCkge1xuXHQgICAgdmFyIHNlbGYgPSB0aGlzO1xuXHQgICAgc2VsZi5sYXN0UXVlcnkgPSBudWxsO1xuXG5cdCAgICBpZiAoc2VsZi5pc1NldHVwKSB7XG5cdCAgICAgIHNlbGYuYWRkSXRlbXMoc2VsZi5pdGVtcyk7XG5cdCAgICB9XG5cblx0ICAgIHNlbGYudXBkYXRlT3JpZ2luYWxJbnB1dCgpO1xuXHQgICAgc2VsZi5yZWZyZXNoU3RhdGUoKTtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogVXBkYXRlcyBhbGwgc3RhdGUtZGVwZW5kZW50IGF0dHJpYnV0ZXNcblx0ICAgKiBhbmQgQ1NTIGNsYXNzZXMuXG5cdCAgICovXG5cblxuXHQgIHJlZnJlc2hTdGF0ZSgpIHtcblx0ICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXHQgICAgc2VsZi5yZWZyZXNoVmFsaWRpdHlTdGF0ZSgpO1xuXHQgICAgY29uc3QgaXNGdWxsID0gc2VsZi5pc0Z1bGwoKTtcblx0ICAgIGNvbnN0IGlzTG9ja2VkID0gc2VsZi5pc0xvY2tlZDtcblx0ICAgIHNlbGYud3JhcHBlci5jbGFzc0xpc3QudG9nZ2xlKCdydGwnLCBzZWxmLnJ0bCk7XG5cdCAgICBjb25zdCB3cmFwX2NsYXNzTGlzdCA9IHNlbGYud3JhcHBlci5jbGFzc0xpc3Q7XG5cdCAgICB3cmFwX2NsYXNzTGlzdC50b2dnbGUoJ2ZvY3VzJywgc2VsZi5pc0ZvY3VzZWQpO1xuXHQgICAgd3JhcF9jbGFzc0xpc3QudG9nZ2xlKCdkaXNhYmxlZCcsIHNlbGYuaXNEaXNhYmxlZCk7XG5cdCAgICB3cmFwX2NsYXNzTGlzdC50b2dnbGUoJ3JlcXVpcmVkJywgc2VsZi5pc1JlcXVpcmVkKTtcblx0ICAgIHdyYXBfY2xhc3NMaXN0LnRvZ2dsZSgnaW52YWxpZCcsICFzZWxmLmlzVmFsaWQpO1xuXHQgICAgd3JhcF9jbGFzc0xpc3QudG9nZ2xlKCdsb2NrZWQnLCBpc0xvY2tlZCk7XG5cdCAgICB3cmFwX2NsYXNzTGlzdC50b2dnbGUoJ2Z1bGwnLCBpc0Z1bGwpO1xuXHQgICAgd3JhcF9jbGFzc0xpc3QudG9nZ2xlKCdpbnB1dC1hY3RpdmUnLCBzZWxmLmlzRm9jdXNlZCAmJiAhc2VsZi5pc0lucHV0SGlkZGVuKTtcblx0ICAgIHdyYXBfY2xhc3NMaXN0LnRvZ2dsZSgnZHJvcGRvd24tYWN0aXZlJywgc2VsZi5pc09wZW4pO1xuXHQgICAgd3JhcF9jbGFzc0xpc3QudG9nZ2xlKCdoYXMtb3B0aW9ucycsIGlzRW1wdHlPYmplY3Qoc2VsZi5vcHRpb25zKSk7XG5cdCAgICB3cmFwX2NsYXNzTGlzdC50b2dnbGUoJ2hhcy1pdGVtcycsIHNlbGYuaXRlbXMubGVuZ3RoID4gMCk7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFVwZGF0ZSB0aGUgYHJlcXVpcmVkYCBhdHRyaWJ1dGUgb2YgYm90aCBpbnB1dCBhbmQgY29udHJvbCBpbnB1dC5cblx0ICAgKlxuXHQgICAqIFRoZSBgcmVxdWlyZWRgIHByb3BlcnR5IG5lZWRzIHRvIGJlIGFjdGl2YXRlZCBvbiB0aGUgY29udHJvbCBpbnB1dFxuXHQgICAqIGZvciB0aGUgZXJyb3IgdG8gYmUgZGlzcGxheWVkIGF0IHRoZSByaWdodCBwbGFjZS4gYHJlcXVpcmVkYCBhbHNvXG5cdCAgICogbmVlZHMgdG8gYmUgdGVtcG9yYXJpbHkgZGVhY3RpdmF0ZWQgb24gdGhlIGlucHV0IHNpbmNlIHRoZSBpbnB1dCBpc1xuXHQgICAqIGhpZGRlbiBhbmQgY2FuJ3Qgc2hvdyBlcnJvcnMuXG5cdCAgICovXG5cblxuXHQgIHJlZnJlc2hWYWxpZGl0eVN0YXRlKCkge1xuXHQgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG5cdCAgICBpZiAoIXNlbGYuaW5wdXQudmFsaWRpdHkpIHtcblx0ICAgICAgcmV0dXJuO1xuXHQgICAgfVxuXG5cdCAgICBzZWxmLmlzVmFsaWQgPSBzZWxmLmlucHV0LnZhbGlkaXR5LnZhbGlkO1xuXHQgICAgc2VsZi5pc0ludmFsaWQgPSAhc2VsZi5pc1ZhbGlkO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBEZXRlcm1pbmVzIHdoZXRoZXIgb3Igbm90IG1vcmUgaXRlbXMgY2FuIGJlIGFkZGVkXG5cdCAgICogdG8gdGhlIGNvbnRyb2wgd2l0aG91dCBleGNlZWRpbmcgdGhlIHVzZXItZGVmaW5lZCBtYXhpbXVtLlxuXHQgICAqXG5cdCAgICogQHJldHVybnMge2Jvb2xlYW59XG5cdCAgICovXG5cblxuXHQgIGlzRnVsbCgpIHtcblx0ICAgIHJldHVybiB0aGlzLnNldHRpbmdzLm1heEl0ZW1zICE9PSBudWxsICYmIHRoaXMuaXRlbXMubGVuZ3RoID49IHRoaXMuc2V0dGluZ3MubWF4SXRlbXM7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFJlZnJlc2hlcyB0aGUgb3JpZ2luYWwgPHNlbGVjdD4gb3IgPGlucHV0PlxuXHQgICAqIGVsZW1lbnQgdG8gcmVmbGVjdCB0aGUgY3VycmVudCBzdGF0ZS5cblx0ICAgKlxuXHQgICAqL1xuXG5cblx0ICB1cGRhdGVPcmlnaW5hbElucHV0KG9wdHMgPSB7fSkge1xuXHQgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cdCAgICB2YXIgb3B0aW9uLCBsYWJlbDtcblx0ICAgIGNvbnN0IGVtcHR5X29wdGlvbiA9IHNlbGYuaW5wdXQucXVlcnlTZWxlY3Rvcignb3B0aW9uW3ZhbHVlPVwiXCJdJyk7XG5cblx0ICAgIGlmIChzZWxmLmlzX3NlbGVjdF90YWcpIHtcblx0ICAgICAgY29uc3Qgc2VsZWN0ZWQgPSBbXTtcblx0ICAgICAgY29uc3QgaGFzX3NlbGVjdGVkID0gc2VsZi5pbnB1dC5xdWVyeVNlbGVjdG9yQWxsKCdvcHRpb246Y2hlY2tlZCcpLmxlbmd0aDtcblxuXHQgICAgICBmdW5jdGlvbiBBZGRTZWxlY3RlZChvcHRpb25fZWwsIHZhbHVlLCBsYWJlbCkge1xuXHQgICAgICAgIGlmICghb3B0aW9uX2VsKSB7XG5cdCAgICAgICAgICBvcHRpb25fZWwgPSBnZXREb20oJzxvcHRpb24gdmFsdWU9XCInICsgZXNjYXBlX2h0bWwodmFsdWUpICsgJ1wiPicgKyBlc2NhcGVfaHRtbChsYWJlbCkgKyAnPC9vcHRpb24+Jyk7XG5cdCAgICAgICAgfSAvLyBkb24ndCBtb3ZlIGVtcHR5IG9wdGlvbiBmcm9tIHRvcCBvZiBsaXN0XG5cdCAgICAgICAgLy8gZml4ZXMgYnVnIGluIGZpcmVmb3ggaHR0cHM6Ly9idWd6aWxsYS5tb3ppbGxhLm9yZy9zaG93X2J1Zy5jZ2k/aWQ9MTcyNTI5M1xuXG5cblx0ICAgICAgICBpZiAob3B0aW9uX2VsICE9IGVtcHR5X29wdGlvbikge1xuXHQgICAgICAgICAgc2VsZi5pbnB1dC5hcHBlbmQob3B0aW9uX2VsKTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICBzZWxlY3RlZC5wdXNoKG9wdGlvbl9lbCk7IC8vIG1hcmtpbmcgZW1wdHkgb3B0aW9uIGFzIHNlbGVjdGVkIGNhbiBicmVhayB2YWxpZGF0aW9uXG5cdCAgICAgICAgLy8gZml4ZXMgaHR0cHM6Ly9naXRodWIuY29tL29yY2hpZGpzL3RvbS1zZWxlY3QvaXNzdWVzLzMwM1xuXG5cdCAgICAgICAgaWYgKG9wdGlvbl9lbCAhPSBlbXB0eV9vcHRpb24gfHwgaGFzX3NlbGVjdGVkID4gMCkge1xuXHQgICAgICAgICAgb3B0aW9uX2VsLnNlbGVjdGVkID0gdHJ1ZTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICByZXR1cm4gb3B0aW9uX2VsO1xuXHQgICAgICB9IC8vIHVuc2VsZWN0IGFsbCBzZWxlY3RlZCBvcHRpb25zXG5cblxuXHQgICAgICBzZWxmLmlucHV0LnF1ZXJ5U2VsZWN0b3JBbGwoJ29wdGlvbjpjaGVja2VkJykuZm9yRWFjaChvcHRpb25fZWwgPT4ge1xuXHQgICAgICAgIG9wdGlvbl9lbC5zZWxlY3RlZCA9IGZhbHNlO1xuXHQgICAgICB9KTsgLy8gbm90aGluZyBzZWxlY3RlZD9cblxuXHQgICAgICBpZiAoc2VsZi5pdGVtcy5sZW5ndGggPT0gMCAmJiBzZWxmLnNldHRpbmdzLm1vZGUgPT0gJ3NpbmdsZScpIHtcblx0ICAgICAgICBBZGRTZWxlY3RlZChlbXB0eV9vcHRpb24sIFwiXCIsIFwiXCIpOyAvLyBvcmRlciBzZWxlY3RlZCA8b3B0aW9uPiB0YWdzIGZvciB2YWx1ZXMgaW4gc2VsZi5pdGVtc1xuXHQgICAgICB9IGVsc2Uge1xuXHQgICAgICAgIHNlbGYuaXRlbXMuZm9yRWFjaCh2YWx1ZSA9PiB7XG5cdCAgICAgICAgICBvcHRpb24gPSBzZWxmLm9wdGlvbnNbdmFsdWVdO1xuXHQgICAgICAgICAgbGFiZWwgPSBvcHRpb25bc2VsZi5zZXR0aW5ncy5sYWJlbEZpZWxkXSB8fCAnJztcblxuXHQgICAgICAgICAgaWYgKHNlbGVjdGVkLmluY2x1ZGVzKG9wdGlvbi4kb3B0aW9uKSkge1xuXHQgICAgICAgICAgICBjb25zdCByZXVzZV9vcHQgPSBzZWxmLmlucHV0LnF1ZXJ5U2VsZWN0b3IoYG9wdGlvblt2YWx1ZT1cIiR7YWRkU2xhc2hlcyh2YWx1ZSl9XCJdOm5vdCg6Y2hlY2tlZClgKTtcblx0ICAgICAgICAgICAgQWRkU2VsZWN0ZWQocmV1c2Vfb3B0LCB2YWx1ZSwgbGFiZWwpO1xuXHQgICAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgICAgb3B0aW9uLiRvcHRpb24gPSBBZGRTZWxlY3RlZChvcHRpb24uJG9wdGlvbiwgdmFsdWUsIGxhYmVsKTtcblx0ICAgICAgICAgIH1cblx0ICAgICAgICB9KTtcblx0ICAgICAgfVxuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgc2VsZi5pbnB1dC52YWx1ZSA9IHNlbGYuZ2V0VmFsdWUoKTtcblx0ICAgIH1cblxuXHQgICAgaWYgKHNlbGYuaXNTZXR1cCkge1xuXHQgICAgICBpZiAoIW9wdHMuc2lsZW50KSB7XG5cdCAgICAgICAgc2VsZi50cmlnZ2VyKCdjaGFuZ2UnLCBzZWxmLmdldFZhbHVlKCkpO1xuXHQgICAgICB9XG5cdCAgICB9XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFNob3dzIHRoZSBhdXRvY29tcGxldGUgZHJvcGRvd24gY29udGFpbmluZ1xuXHQgICAqIHRoZSBhdmFpbGFibGUgb3B0aW9ucy5cblx0ICAgKi9cblxuXG5cdCAgb3BlbigpIHtcblx0ICAgIHZhciBzZWxmID0gdGhpcztcblx0ICAgIGlmIChzZWxmLmlzTG9ja2VkIHx8IHNlbGYuaXNPcGVuIHx8IHNlbGYuc2V0dGluZ3MubW9kZSA9PT0gJ211bHRpJyAmJiBzZWxmLmlzRnVsbCgpKSByZXR1cm47XG5cdCAgICBzZWxmLmlzT3BlbiA9IHRydWU7XG5cdCAgICBzZXRBdHRyKHNlbGYuZm9jdXNfbm9kZSwge1xuXHQgICAgICAnYXJpYS1leHBhbmRlZCc6ICd0cnVlJ1xuXHQgICAgfSk7XG5cdCAgICBzZWxmLnJlZnJlc2hTdGF0ZSgpO1xuXHQgICAgYXBwbHlDU1Moc2VsZi5kcm9wZG93biwge1xuXHQgICAgICB2aXNpYmlsaXR5OiAnaGlkZGVuJyxcblx0ICAgICAgZGlzcGxheTogJ2Jsb2NrJ1xuXHQgICAgfSk7XG5cdCAgICBzZWxmLnBvc2l0aW9uRHJvcGRvd24oKTtcblx0ICAgIGFwcGx5Q1NTKHNlbGYuZHJvcGRvd24sIHtcblx0ICAgICAgdmlzaWJpbGl0eTogJ3Zpc2libGUnLFxuXHQgICAgICBkaXNwbGF5OiAnYmxvY2snXG5cdCAgICB9KTtcblx0ICAgIHNlbGYuZm9jdXMoKTtcblx0ICAgIHNlbGYudHJpZ2dlcignZHJvcGRvd25fb3BlbicsIHNlbGYuZHJvcGRvd24pO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBDbG9zZXMgdGhlIGF1dG9jb21wbGV0ZSBkcm9wZG93biBtZW51LlxuXHQgICAqL1xuXG5cblx0ICBjbG9zZShzZXRUZXh0Ym94VmFsdWUgPSB0cnVlKSB7XG5cdCAgICB2YXIgc2VsZiA9IHRoaXM7XG5cdCAgICB2YXIgdHJpZ2dlciA9IHNlbGYuaXNPcGVuO1xuXG5cdCAgICBpZiAoc2V0VGV4dGJveFZhbHVlKSB7XG5cdCAgICAgIC8vIGJlZm9yZSBibHVyKCkgdG8gcHJldmVudCBmb3JtIG9uY2hhbmdlIGV2ZW50XG5cdCAgICAgIHNlbGYuc2V0VGV4dGJveFZhbHVlKCk7XG5cblx0ICAgICAgaWYgKHNlbGYuc2V0dGluZ3MubW9kZSA9PT0gJ3NpbmdsZScgJiYgc2VsZi5pdGVtcy5sZW5ndGgpIHtcblx0ICAgICAgICBzZWxmLmhpZGVJbnB1dCgpO1xuXHQgICAgICB9XG5cdCAgICB9XG5cblx0ICAgIHNlbGYuaXNPcGVuID0gZmFsc2U7XG5cdCAgICBzZXRBdHRyKHNlbGYuZm9jdXNfbm9kZSwge1xuXHQgICAgICAnYXJpYS1leHBhbmRlZCc6ICdmYWxzZSdcblx0ICAgIH0pO1xuXHQgICAgYXBwbHlDU1Moc2VsZi5kcm9wZG93biwge1xuXHQgICAgICBkaXNwbGF5OiAnbm9uZSdcblx0ICAgIH0pO1xuXG5cdCAgICBpZiAoc2VsZi5zZXR0aW5ncy5oaWRlU2VsZWN0ZWQpIHtcblx0ICAgICAgc2VsZi5jbGVhckFjdGl2ZU9wdGlvbigpO1xuXHQgICAgfVxuXG5cdCAgICBzZWxmLnJlZnJlc2hTdGF0ZSgpO1xuXHQgICAgaWYgKHRyaWdnZXIpIHNlbGYudHJpZ2dlcignZHJvcGRvd25fY2xvc2UnLCBzZWxmLmRyb3Bkb3duKTtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogQ2FsY3VsYXRlcyBhbmQgYXBwbGllcyB0aGUgYXBwcm9wcmlhdGVcblx0ICAgKiBwb3NpdGlvbiBvZiB0aGUgZHJvcGRvd24gaWYgZHJvcGRvd25QYXJlbnQgPSAnYm9keScuXG5cdCAgICogT3RoZXJ3aXNlLCBwb3NpdGlvbiBpcyBkZXRlcm1pbmVkIGJ5IGNzc1xuXHQgICAqL1xuXG5cblx0ICBwb3NpdGlvbkRyb3Bkb3duKCkge1xuXHQgICAgaWYgKHRoaXMuc2V0dGluZ3MuZHJvcGRvd25QYXJlbnQgIT09ICdib2R5Jykge1xuXHQgICAgICByZXR1cm47XG5cdCAgICB9XG5cblx0ICAgIHZhciBjb250ZXh0ID0gdGhpcy5jb250cm9sO1xuXHQgICAgdmFyIHJlY3QgPSBjb250ZXh0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHQgICAgdmFyIHRvcCA9IGNvbnRleHQub2Zmc2V0SGVpZ2h0ICsgcmVjdC50b3AgKyB3aW5kb3cuc2Nyb2xsWTtcblx0ICAgIHZhciBsZWZ0ID0gcmVjdC5sZWZ0ICsgd2luZG93LnNjcm9sbFg7XG5cdCAgICBhcHBseUNTUyh0aGlzLmRyb3Bkb3duLCB7XG5cdCAgICAgIHdpZHRoOiByZWN0LndpZHRoICsgJ3B4Jyxcblx0ICAgICAgdG9wOiB0b3AgKyAncHgnLFxuXHQgICAgICBsZWZ0OiBsZWZ0ICsgJ3B4J1xuXHQgICAgfSk7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFJlc2V0cyAvIGNsZWFycyBhbGwgc2VsZWN0ZWQgaXRlbXNcblx0ICAgKiBmcm9tIHRoZSBjb250cm9sLlxuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIGNsZWFyKHNpbGVudCkge1xuXHQgICAgdmFyIHNlbGYgPSB0aGlzO1xuXHQgICAgaWYgKCFzZWxmLml0ZW1zLmxlbmd0aCkgcmV0dXJuO1xuXHQgICAgdmFyIGl0ZW1zID0gc2VsZi5jb250cm9sQ2hpbGRyZW4oKTtcblx0ICAgIGl0ZXJhdGUkMShpdGVtcywgaXRlbSA9PiB7XG5cdCAgICAgIHNlbGYucmVtb3ZlSXRlbShpdGVtLCB0cnVlKTtcblx0ICAgIH0pO1xuXHQgICAgc2VsZi5zaG93SW5wdXQoKTtcblx0ICAgIGlmICghc2lsZW50KSBzZWxmLnVwZGF0ZU9yaWdpbmFsSW5wdXQoKTtcblx0ICAgIHNlbGYudHJpZ2dlcignY2xlYXInKTtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogQSBoZWxwZXIgbWV0aG9kIGZvciBpbnNlcnRpbmcgYW4gZWxlbWVudFxuXHQgICAqIGF0IHRoZSBjdXJyZW50IGNhcmV0IHBvc2l0aW9uLlxuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIGluc2VydEF0Q2FyZXQoZWwpIHtcblx0ICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXHQgICAgY29uc3QgY2FyZXQgPSBzZWxmLmNhcmV0UG9zO1xuXHQgICAgY29uc3QgdGFyZ2V0ID0gc2VsZi5jb250cm9sO1xuXHQgICAgdGFyZ2V0Lmluc2VydEJlZm9yZShlbCwgdGFyZ2V0LmNoaWxkcmVuW2NhcmV0XSB8fCBudWxsKTtcblx0ICAgIHNlbGYuc2V0Q2FyZXQoY2FyZXQgKyAxKTtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogUmVtb3ZlcyB0aGUgY3VycmVudCBzZWxlY3RlZCBpdGVtKHMpLlxuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIGRlbGV0ZVNlbGVjdGlvbihlKSB7XG5cdCAgICB2YXIgZGlyZWN0aW9uLCBzZWxlY3Rpb24sIGNhcmV0LCB0YWlsO1xuXHQgICAgdmFyIHNlbGYgPSB0aGlzO1xuXHQgICAgZGlyZWN0aW9uID0gZSAmJiBlLmtleUNvZGUgPT09IEtFWV9CQUNLU1BBQ0UgPyAtMSA6IDE7XG5cdCAgICBzZWxlY3Rpb24gPSBnZXRTZWxlY3Rpb24oc2VsZi5jb250cm9sX2lucHV0KTsgLy8gZGV0ZXJtaW5lIGl0ZW1zIHRoYXQgd2lsbCBiZSByZW1vdmVkXG5cblx0ICAgIGNvbnN0IHJtX2l0ZW1zID0gW107XG5cblx0ICAgIGlmIChzZWxmLmFjdGl2ZUl0ZW1zLmxlbmd0aCkge1xuXHQgICAgICB0YWlsID0gZ2V0VGFpbChzZWxmLmFjdGl2ZUl0ZW1zLCBkaXJlY3Rpb24pO1xuXHQgICAgICBjYXJldCA9IG5vZGVJbmRleCh0YWlsKTtcblxuXHQgICAgICBpZiAoZGlyZWN0aW9uID4gMCkge1xuXHQgICAgICAgIGNhcmV0Kys7XG5cdCAgICAgIH1cblxuXHQgICAgICBpdGVyYXRlJDEoc2VsZi5hY3RpdmVJdGVtcywgaXRlbSA9PiBybV9pdGVtcy5wdXNoKGl0ZW0pKTtcblx0ICAgIH0gZWxzZSBpZiAoKHNlbGYuaXNGb2N1c2VkIHx8IHNlbGYuc2V0dGluZ3MubW9kZSA9PT0gJ3NpbmdsZScpICYmIHNlbGYuaXRlbXMubGVuZ3RoKSB7XG5cdCAgICAgIGNvbnN0IGl0ZW1zID0gc2VsZi5jb250cm9sQ2hpbGRyZW4oKTtcblx0ICAgICAgbGV0IHJtX2l0ZW07XG5cblx0ICAgICAgaWYgKGRpcmVjdGlvbiA8IDAgJiYgc2VsZWN0aW9uLnN0YXJ0ID09PSAwICYmIHNlbGVjdGlvbi5sZW5ndGggPT09IDApIHtcblx0ICAgICAgICBybV9pdGVtID0gaXRlbXNbc2VsZi5jYXJldFBvcyAtIDFdO1xuXHQgICAgICB9IGVsc2UgaWYgKGRpcmVjdGlvbiA+IDAgJiYgc2VsZWN0aW9uLnN0YXJ0ID09PSBzZWxmLmlucHV0VmFsdWUoKS5sZW5ndGgpIHtcblx0ICAgICAgICBybV9pdGVtID0gaXRlbXNbc2VsZi5jYXJldFBvc107XG5cdCAgICAgIH1cblxuXHQgICAgICBpZiAocm1faXRlbSAhPT0gdW5kZWZpbmVkKSB7XG5cdCAgICAgICAgcm1faXRlbXMucHVzaChybV9pdGVtKTtcblx0ICAgICAgfVxuXHQgICAgfVxuXG5cdCAgICBpZiAoIXNlbGYuc2hvdWxkRGVsZXRlKHJtX2l0ZW1zLCBlKSkge1xuXHQgICAgICByZXR1cm4gZmFsc2U7XG5cdCAgICB9XG5cblx0ICAgIHByZXZlbnREZWZhdWx0KGUsIHRydWUpOyAvLyBwZXJmb3JtIHJlbW92YWxcblxuXHQgICAgaWYgKHR5cGVvZiBjYXJldCAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0ICAgICAgc2VsZi5zZXRDYXJldChjYXJldCk7XG5cdCAgICB9XG5cblx0ICAgIHdoaWxlIChybV9pdGVtcy5sZW5ndGgpIHtcblx0ICAgICAgc2VsZi5yZW1vdmVJdGVtKHJtX2l0ZW1zLnBvcCgpKTtcblx0ICAgIH1cblxuXHQgICAgc2VsZi5zaG93SW5wdXQoKTtcblx0ICAgIHNlbGYucG9zaXRpb25Ecm9wZG93bigpO1xuXHQgICAgc2VsZi5yZWZyZXNoT3B0aW9ucyhmYWxzZSk7XG5cdCAgICByZXR1cm4gdHJ1ZTtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogUmV0dXJuIHRydWUgaWYgdGhlIGl0ZW1zIHNob3VsZCBiZSBkZWxldGVkXG5cdCAgICovXG5cblxuXHQgIHNob3VsZERlbGV0ZShpdGVtcywgZXZ0KSB7XG5cdCAgICBjb25zdCB2YWx1ZXMgPSBpdGVtcy5tYXAoaXRlbSA9PiBpdGVtLmRhdGFzZXQudmFsdWUpOyAvLyBhbGxvdyB0aGUgY2FsbGJhY2sgdG8gYWJvcnRcblxuXHQgICAgaWYgKCF2YWx1ZXMubGVuZ3RoIHx8IHR5cGVvZiB0aGlzLnNldHRpbmdzLm9uRGVsZXRlID09PSAnZnVuY3Rpb24nICYmIHRoaXMuc2V0dGluZ3Mub25EZWxldGUodmFsdWVzLCBldnQpID09PSBmYWxzZSkge1xuXHQgICAgICByZXR1cm4gZmFsc2U7XG5cdCAgICB9XG5cblx0ICAgIHJldHVybiB0cnVlO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBTZWxlY3RzIHRoZSBwcmV2aW91cyAvIG5leHQgaXRlbSAoZGVwZW5kaW5nIG9uIHRoZSBgZGlyZWN0aW9uYCBhcmd1bWVudCkuXG5cdCAgICpcblx0ICAgKiA+IDAgLSByaWdodFxuXHQgICAqIDwgMCAtIGxlZnRcblx0ICAgKlxuXHQgICAqL1xuXG5cblx0ICBhZHZhbmNlU2VsZWN0aW9uKGRpcmVjdGlvbiwgZSkge1xuXHQgICAgdmFyIGxhc3RfYWN0aXZlLFxuXHQgICAgICAgIGFkamFjZW50LFxuXHQgICAgICAgIHNlbGYgPSB0aGlzO1xuXHQgICAgaWYgKHNlbGYucnRsKSBkaXJlY3Rpb24gKj0gLTE7XG5cdCAgICBpZiAoc2VsZi5pbnB1dFZhbHVlKCkubGVuZ3RoKSByZXR1cm47IC8vIGFkZCBvciByZW1vdmUgdG8gYWN0aXZlIGl0ZW1zXG5cblx0ICAgIGlmIChpc0tleURvd24oS0VZX1NIT1JUQ1VULCBlKSB8fCBpc0tleURvd24oJ3NoaWZ0S2V5JywgZSkpIHtcblx0ICAgICAgbGFzdF9hY3RpdmUgPSBzZWxmLmdldExhc3RBY3RpdmUoZGlyZWN0aW9uKTtcblxuXHQgICAgICBpZiAobGFzdF9hY3RpdmUpIHtcblx0ICAgICAgICBpZiAoIWxhc3RfYWN0aXZlLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcblx0ICAgICAgICAgIGFkamFjZW50ID0gbGFzdF9hY3RpdmU7XG5cdCAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgIGFkamFjZW50ID0gc2VsZi5nZXRBZGphY2VudChsYXN0X2FjdGl2ZSwgZGlyZWN0aW9uLCAnaXRlbScpO1xuXHQgICAgICAgIH0gLy8gaWYgbm8gYWN0aXZlIGl0ZW0sIGdldCBpdGVtcyBhZGphY2VudCB0byB0aGUgY29udHJvbCBpbnB1dFxuXG5cdCAgICAgIH0gZWxzZSBpZiAoZGlyZWN0aW9uID4gMCkge1xuXHQgICAgICAgIGFkamFjZW50ID0gc2VsZi5jb250cm9sX2lucHV0Lm5leHRFbGVtZW50U2libGluZztcblx0ICAgICAgfSBlbHNlIHtcblx0ICAgICAgICBhZGphY2VudCA9IHNlbGYuY29udHJvbF9pbnB1dC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xuXHQgICAgICB9XG5cblx0ICAgICAgaWYgKGFkamFjZW50KSB7XG5cdCAgICAgICAgaWYgKGFkamFjZW50LmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcblx0ICAgICAgICAgIHNlbGYucmVtb3ZlQWN0aXZlSXRlbShsYXN0X2FjdGl2ZSk7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgc2VsZi5zZXRBY3RpdmVJdGVtQ2xhc3MoYWRqYWNlbnQpOyAvLyBtYXJrIGFzIGxhc3RfYWN0aXZlICEhIGFmdGVyIHJlbW92ZUFjdGl2ZUl0ZW0oKSBvbiBsYXN0X2FjdGl2ZVxuXHQgICAgICB9IC8vIG1vdmUgY2FyZXQgdG8gdGhlIGxlZnQgb3IgcmlnaHRcblxuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgc2VsZi5tb3ZlQ2FyZXQoZGlyZWN0aW9uKTtcblx0ICAgIH1cblx0ICB9XG5cblx0ICBtb3ZlQ2FyZXQoZGlyZWN0aW9uKSB7fVxuXHQgIC8qKlxuXHQgICAqIEdldCB0aGUgbGFzdCBhY3RpdmUgaXRlbVxuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIGdldExhc3RBY3RpdmUoZGlyZWN0aW9uKSB7XG5cdCAgICBsZXQgbGFzdF9hY3RpdmUgPSB0aGlzLmNvbnRyb2wucXVlcnlTZWxlY3RvcignLmxhc3QtYWN0aXZlJyk7XG5cblx0ICAgIGlmIChsYXN0X2FjdGl2ZSkge1xuXHQgICAgICByZXR1cm4gbGFzdF9hY3RpdmU7XG5cdCAgICB9XG5cblx0ICAgIHZhciByZXN1bHQgPSB0aGlzLmNvbnRyb2wucXVlcnlTZWxlY3RvckFsbCgnLmFjdGl2ZScpO1xuXG5cdCAgICBpZiAocmVzdWx0KSB7XG5cdCAgICAgIHJldHVybiBnZXRUYWlsKHJlc3VsdCwgZGlyZWN0aW9uKTtcblx0ICAgIH1cblx0ICB9XG5cdCAgLyoqXG5cdCAgICogTW92ZXMgdGhlIGNhcmV0IHRvIHRoZSBzcGVjaWZpZWQgaW5kZXguXG5cdCAgICpcblx0ICAgKiBUaGUgaW5wdXQgbXVzdCBiZSBtb3ZlZCBieSBsZWF2aW5nIGl0IGluIHBsYWNlIGFuZCBtb3ZpbmcgdGhlXG5cdCAgICogc2libGluZ3MsIGR1ZSB0byB0aGUgZmFjdCB0aGF0IGZvY3VzIGNhbm5vdCBiZSByZXN0b3JlZCBvbmNlIGxvc3Rcblx0ICAgKiBvbiBtb2JpbGUgd2Via2l0IGRldmljZXNcblx0ICAgKlxuXHQgICAqL1xuXG5cblx0ICBzZXRDYXJldChuZXdfcG9zKSB7XG5cdCAgICB0aGlzLmNhcmV0UG9zID0gdGhpcy5pdGVtcy5sZW5ndGg7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFJldHVybiBsaXN0IG9mIGl0ZW0gZG9tIGVsZW1lbnRzXG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgY29udHJvbENoaWxkcmVuKCkge1xuXHQgICAgcmV0dXJuIEFycmF5LmZyb20odGhpcy5jb250cm9sLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLXRzLWl0ZW1dJykpO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBEaXNhYmxlcyB1c2VyIGlucHV0IG9uIHRoZSBjb250cm9sLiBVc2VkIHdoaWxlXG5cdCAgICogaXRlbXMgYXJlIGJlaW5nIGFzeW5jaHJvbm91c2x5IGNyZWF0ZWQuXG5cdCAgICovXG5cblxuXHQgIGxvY2soKSB7XG5cdCAgICB0aGlzLmlzTG9ja2VkID0gdHJ1ZTtcblx0ICAgIHRoaXMucmVmcmVzaFN0YXRlKCk7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFJlLWVuYWJsZXMgdXNlciBpbnB1dCBvbiB0aGUgY29udHJvbC5cblx0ICAgKi9cblxuXG5cdCAgdW5sb2NrKCkge1xuXHQgICAgdGhpcy5pc0xvY2tlZCA9IGZhbHNlO1xuXHQgICAgdGhpcy5yZWZyZXNoU3RhdGUoKTtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogRGlzYWJsZXMgdXNlciBpbnB1dCBvbiB0aGUgY29udHJvbCBjb21wbGV0ZWx5LlxuXHQgICAqIFdoaWxlIGRpc2FibGVkLCBpdCBjYW5ub3QgcmVjZWl2ZSBmb2N1cy5cblx0ICAgKi9cblxuXG5cdCAgZGlzYWJsZSgpIHtcblx0ICAgIHZhciBzZWxmID0gdGhpcztcblx0ICAgIHNlbGYuaW5wdXQuZGlzYWJsZWQgPSB0cnVlO1xuXHQgICAgc2VsZi5jb250cm9sX2lucHV0LmRpc2FibGVkID0gdHJ1ZTtcblx0ICAgIHNlbGYuZm9jdXNfbm9kZS50YWJJbmRleCA9IC0xO1xuXHQgICAgc2VsZi5pc0Rpc2FibGVkID0gdHJ1ZTtcblx0ICAgIHRoaXMuY2xvc2UoKTtcblx0ICAgIHNlbGYubG9jaygpO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBFbmFibGVzIHRoZSBjb250cm9sIHNvIHRoYXQgaXQgY2FuIHJlc3BvbmRcblx0ICAgKiB0byBmb2N1cyBhbmQgdXNlciBpbnB1dC5cblx0ICAgKi9cblxuXG5cdCAgZW5hYmxlKCkge1xuXHQgICAgdmFyIHNlbGYgPSB0aGlzO1xuXHQgICAgc2VsZi5pbnB1dC5kaXNhYmxlZCA9IGZhbHNlO1xuXHQgICAgc2VsZi5jb250cm9sX2lucHV0LmRpc2FibGVkID0gZmFsc2U7XG5cdCAgICBzZWxmLmZvY3VzX25vZGUudGFiSW5kZXggPSBzZWxmLnRhYkluZGV4O1xuXHQgICAgc2VsZi5pc0Rpc2FibGVkID0gZmFsc2U7XG5cdCAgICBzZWxmLnVubG9jaygpO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBDb21wbGV0ZWx5IGRlc3Ryb3lzIHRoZSBjb250cm9sIGFuZFxuXHQgICAqIHVuYmluZHMgYWxsIGV2ZW50IGxpc3RlbmVycyBzbyB0aGF0IGl0IGNhblxuXHQgICAqIGJlIGdhcmJhZ2UgY29sbGVjdGVkLlxuXHQgICAqL1xuXG5cblx0ICBkZXN0cm95KCkge1xuXHQgICAgdmFyIHNlbGYgPSB0aGlzO1xuXHQgICAgdmFyIHJldmVydFNldHRpbmdzID0gc2VsZi5yZXZlcnRTZXR0aW5ncztcblx0ICAgIHNlbGYudHJpZ2dlcignZGVzdHJveScpO1xuXHQgICAgc2VsZi5vZmYoKTtcblx0ICAgIHNlbGYud3JhcHBlci5yZW1vdmUoKTtcblx0ICAgIHNlbGYuZHJvcGRvd24ucmVtb3ZlKCk7XG5cdCAgICBzZWxmLmlucHV0LmlubmVySFRNTCA9IHJldmVydFNldHRpbmdzLmlubmVySFRNTDtcblx0ICAgIHNlbGYuaW5wdXQudGFiSW5kZXggPSByZXZlcnRTZXR0aW5ncy50YWJJbmRleDtcblx0ICAgIHJlbW92ZUNsYXNzZXMoc2VsZi5pbnB1dCwgJ3RvbXNlbGVjdGVkJywgJ3RzLWhpZGRlbi1hY2Nlc3NpYmxlJyk7XG5cblx0ICAgIHNlbGYuX2Rlc3Ryb3koKTtcblxuXHQgICAgZGVsZXRlIHNlbGYuaW5wdXQudG9tc2VsZWN0O1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBBIGhlbHBlciBtZXRob2QgZm9yIHJlbmRlcmluZyBcIml0ZW1cIiBhbmRcblx0ICAgKiBcIm9wdGlvblwiIHRlbXBsYXRlcywgZ2l2ZW4gdGhlIGRhdGEuXG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgcmVuZGVyKHRlbXBsYXRlTmFtZSwgZGF0YSkge1xuXHQgICAgdmFyIGlkLCBodG1sO1xuXHQgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cblx0ICAgIGlmICh0eXBlb2YgdGhpcy5zZXR0aW5ncy5yZW5kZXJbdGVtcGxhdGVOYW1lXSAhPT0gJ2Z1bmN0aW9uJykge1xuXHQgICAgICByZXR1cm4gbnVsbDtcblx0ICAgIH0gLy8gcmVuZGVyIG1hcmt1cFxuXG5cblx0ICAgIGh0bWwgPSBzZWxmLnNldHRpbmdzLnJlbmRlclt0ZW1wbGF0ZU5hbWVdLmNhbGwodGhpcywgZGF0YSwgZXNjYXBlX2h0bWwpO1xuXG5cdCAgICBpZiAoIWh0bWwpIHtcblx0ICAgICAgcmV0dXJuIG51bGw7XG5cdCAgICB9XG5cblx0ICAgIGh0bWwgPSBnZXREb20oaHRtbCk7IC8vIGFkZCBtYW5kYXRvcnkgYXR0cmlidXRlc1xuXG5cdCAgICBpZiAodGVtcGxhdGVOYW1lID09PSAnb3B0aW9uJyB8fCB0ZW1wbGF0ZU5hbWUgPT09ICdvcHRpb25fY3JlYXRlJykge1xuXHQgICAgICBpZiAoZGF0YVtzZWxmLnNldHRpbmdzLmRpc2FibGVkRmllbGRdKSB7XG5cdCAgICAgICAgc2V0QXR0cihodG1sLCB7XG5cdCAgICAgICAgICAnYXJpYS1kaXNhYmxlZCc6ICd0cnVlJ1xuXHQgICAgICAgIH0pO1xuXHQgICAgICB9IGVsc2Uge1xuXHQgICAgICAgIHNldEF0dHIoaHRtbCwge1xuXHQgICAgICAgICAgJ2RhdGEtc2VsZWN0YWJsZSc6ICcnXG5cdCAgICAgICAgfSk7XG5cdCAgICAgIH1cblx0ICAgIH0gZWxzZSBpZiAodGVtcGxhdGVOYW1lID09PSAnb3B0Z3JvdXAnKSB7XG5cdCAgICAgIGlkID0gZGF0YS5ncm91cFtzZWxmLnNldHRpbmdzLm9wdGdyb3VwVmFsdWVGaWVsZF07XG5cdCAgICAgIHNldEF0dHIoaHRtbCwge1xuXHQgICAgICAgICdkYXRhLWdyb3VwJzogaWRcblx0ICAgICAgfSk7XG5cblx0ICAgICAgaWYgKGRhdGEuZ3JvdXBbc2VsZi5zZXR0aW5ncy5kaXNhYmxlZEZpZWxkXSkge1xuXHQgICAgICAgIHNldEF0dHIoaHRtbCwge1xuXHQgICAgICAgICAgJ2RhdGEtZGlzYWJsZWQnOiAnJ1xuXHQgICAgICAgIH0pO1xuXHQgICAgICB9XG5cdCAgICB9XG5cblx0ICAgIGlmICh0ZW1wbGF0ZU5hbWUgPT09ICdvcHRpb24nIHx8IHRlbXBsYXRlTmFtZSA9PT0gJ2l0ZW0nKSB7XG5cdCAgICAgIGNvbnN0IHZhbHVlID0gZ2V0X2hhc2goZGF0YVtzZWxmLnNldHRpbmdzLnZhbHVlRmllbGRdKTtcblx0ICAgICAgc2V0QXR0cihodG1sLCB7XG5cdCAgICAgICAgJ2RhdGEtdmFsdWUnOiB2YWx1ZVxuXHQgICAgICB9KTsgLy8gbWFrZSBzdXJlIHdlIGhhdmUgc29tZSBjbGFzc2VzIGlmIGEgdGVtcGxhdGUgaXMgb3ZlcndyaXR0ZW5cblxuXHQgICAgICBpZiAodGVtcGxhdGVOYW1lID09PSAnaXRlbScpIHtcblx0ICAgICAgICBhZGRDbGFzc2VzKGh0bWwsIHNlbGYuc2V0dGluZ3MuaXRlbUNsYXNzKTtcblx0ICAgICAgICBzZXRBdHRyKGh0bWwsIHtcblx0ICAgICAgICAgICdkYXRhLXRzLWl0ZW0nOiAnJ1xuXHQgICAgICAgIH0pO1xuXHQgICAgICB9IGVsc2Uge1xuXHQgICAgICAgIGFkZENsYXNzZXMoaHRtbCwgc2VsZi5zZXR0aW5ncy5vcHRpb25DbGFzcyk7XG5cdCAgICAgICAgc2V0QXR0cihodG1sLCB7XG5cdCAgICAgICAgICByb2xlOiAnb3B0aW9uJyxcblx0ICAgICAgICAgIGlkOiBkYXRhLiRpZFxuXHQgICAgICAgIH0pOyAvLyB1cGRhdGUgY2FjaGVcblxuXHQgICAgICAgIGRhdGEuJGRpdiA9IGh0bWw7XG5cdCAgICAgICAgc2VsZi5vcHRpb25zW3ZhbHVlXSA9IGRhdGE7XG5cdCAgICAgIH1cblx0ICAgIH1cblxuXHQgICAgcmV0dXJuIGh0bWw7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFR5cGUgZ3VhcmRlZCByZW5kZXJpbmdcblx0ICAgKlxuXHQgICAqL1xuXG5cblx0ICBfcmVuZGVyKHRlbXBsYXRlTmFtZSwgZGF0YSkge1xuXHQgICAgY29uc3QgaHRtbCA9IHRoaXMucmVuZGVyKHRlbXBsYXRlTmFtZSwgZGF0YSk7XG5cblx0ICAgIGlmIChodG1sID09IG51bGwpIHtcblx0ICAgICAgdGhyb3cgJ0hUTUxFbGVtZW50IGV4cGVjdGVkJztcblx0ICAgIH1cblxuXHQgICAgcmV0dXJuIGh0bWw7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIENsZWFycyB0aGUgcmVuZGVyIGNhY2hlIGZvciBhIHRlbXBsYXRlLiBJZlxuXHQgICAqIG5vIHRlbXBsYXRlIGlzIGdpdmVuLCBjbGVhcnMgYWxsIHJlbmRlclxuXHQgICAqIGNhY2hlcy5cblx0ICAgKlxuXHQgICAqL1xuXG5cblx0ICBjbGVhckNhY2hlKCkge1xuXHQgICAgaXRlcmF0ZSQxKHRoaXMub3B0aW9ucywgb3B0aW9uID0+IHtcblx0ICAgICAgaWYgKG9wdGlvbi4kZGl2KSB7XG5cdCAgICAgICAgb3B0aW9uLiRkaXYucmVtb3ZlKCk7XG5cdCAgICAgICAgZGVsZXRlIG9wdGlvbi4kZGl2O1xuXHQgICAgICB9XG5cdCAgICB9KTtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogUmVtb3ZlcyBhIHZhbHVlIGZyb20gaXRlbSBhbmQgb3B0aW9uIGNhY2hlc1xuXHQgICAqXG5cdCAgICovXG5cblxuXHQgIHVuY2FjaGVWYWx1ZSh2YWx1ZSkge1xuXHQgICAgY29uc3Qgb3B0aW9uX2VsID0gdGhpcy5nZXRPcHRpb24odmFsdWUpO1xuXHQgICAgaWYgKG9wdGlvbl9lbCkgb3B0aW9uX2VsLnJlbW92ZSgpO1xuXHQgIH1cblx0ICAvKipcblx0ICAgKiBEZXRlcm1pbmVzIHdoZXRoZXIgb3Igbm90IHRvIGRpc3BsYXkgdGhlXG5cdCAgICogY3JlYXRlIGl0ZW0gcHJvbXB0LCBnaXZlbiBhIHVzZXIgaW5wdXQuXG5cdCAgICpcblx0ICAgKi9cblxuXG5cdCAgY2FuQ3JlYXRlKGlucHV0KSB7XG5cdCAgICByZXR1cm4gdGhpcy5zZXR0aW5ncy5jcmVhdGUgJiYgaW5wdXQubGVuZ3RoID4gMCAmJiB0aGlzLnNldHRpbmdzLmNyZWF0ZUZpbHRlci5jYWxsKHRoaXMsIGlucHV0KTtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogV3JhcHMgdGhpcy5gbWV0aG9kYCBzbyB0aGF0IGBuZXdfZm5gIGNhbiBiZSBpbnZva2VkICdiZWZvcmUnLCAnYWZ0ZXInLCBvciAnaW5zdGVhZCcgb2YgdGhlIG9yaWdpbmFsIG1ldGhvZFxuXHQgICAqXG5cdCAgICogdGhpcy5ob29rKCdpbnN0ZWFkJywnb25LZXlEb3duJyxmdW5jdGlvbiggYXJnMSwgYXJnMiAuLi4pe1xuXHQgICAqXG5cdCAgICogfSk7XG5cdCAgICovXG5cblxuXHQgIGhvb2sod2hlbiwgbWV0aG9kLCBuZXdfZm4pIHtcblx0ICAgIHZhciBzZWxmID0gdGhpcztcblx0ICAgIHZhciBvcmlnX21ldGhvZCA9IHNlbGZbbWV0aG9kXTtcblxuXHQgICAgc2VsZlttZXRob2RdID0gZnVuY3Rpb24gKCkge1xuXHQgICAgICB2YXIgcmVzdWx0LCByZXN1bHRfbmV3O1xuXG5cdCAgICAgIGlmICh3aGVuID09PSAnYWZ0ZXInKSB7XG5cdCAgICAgICAgcmVzdWx0ID0gb3JpZ19tZXRob2QuYXBwbHkoc2VsZiwgYXJndW1lbnRzKTtcblx0ICAgICAgfVxuXG5cdCAgICAgIHJlc3VsdF9uZXcgPSBuZXdfZm4uYXBwbHkoc2VsZiwgYXJndW1lbnRzKTtcblxuXHQgICAgICBpZiAod2hlbiA9PT0gJ2luc3RlYWQnKSB7XG5cdCAgICAgICAgcmV0dXJuIHJlc3VsdF9uZXc7XG5cdCAgICAgIH1cblxuXHQgICAgICBpZiAod2hlbiA9PT0gJ2JlZm9yZScpIHtcblx0ICAgICAgICByZXN1bHQgPSBvcmlnX21ldGhvZC5hcHBseShzZWxmLCBhcmd1bWVudHMpO1xuXHQgICAgICB9XG5cblx0ICAgICAgcmV0dXJuIHJlc3VsdDtcblx0ICAgIH07XG5cdCAgfVxuXG5cdH1cblxuXHQvKipcblx0ICogUGx1Z2luOiBcImNoYW5nZV9saXN0ZW5lclwiIChUb20gU2VsZWN0KVxuXHQgKiBDb3B5cmlnaHQgKGMpIGNvbnRyaWJ1dG9yc1xuXHQgKlxuXHQgKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpc1xuXHQgKiBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdDpcblx0ICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG5cdCAqXG5cdCAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXJcblx0ICogdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRlxuXHQgKiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2Vcblx0ICogZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cblx0ICpcblx0ICovXG5cdGZ1bmN0aW9uIGNoYW5nZV9saXN0ZW5lciAoKSB7XG5cdCAgYWRkRXZlbnQodGhpcy5pbnB1dCwgJ2NoYW5nZScsICgpID0+IHtcblx0ICAgIHRoaXMuc3luYygpO1xuXHQgIH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIFBsdWdpbjogXCJyZXN0b3JlX29uX2JhY2tzcGFjZVwiIChUb20gU2VsZWN0KVxuXHQgKiBDb3B5cmlnaHQgKGMpIGNvbnRyaWJ1dG9yc1xuXHQgKlxuXHQgKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpc1xuXHQgKiBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdDpcblx0ICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG5cdCAqXG5cdCAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXJcblx0ICogdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRlxuXHQgKiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2Vcblx0ICogZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cblx0ICpcblx0ICovXG5cdGZ1bmN0aW9uIGNoZWNrYm94X29wdGlvbnMgKCkge1xuXHQgIHZhciBzZWxmID0gdGhpcztcblx0ICB2YXIgb3JpZ19vbk9wdGlvblNlbGVjdCA9IHNlbGYub25PcHRpb25TZWxlY3Q7XG5cdCAgc2VsZi5zZXR0aW5ncy5oaWRlU2VsZWN0ZWQgPSBmYWxzZTsgLy8gdXBkYXRlIHRoZSBjaGVja2JveCBmb3IgYW4gb3B0aW9uXG5cblx0ICB2YXIgVXBkYXRlQ2hlY2tib3ggPSBmdW5jdGlvbiBVcGRhdGVDaGVja2JveChvcHRpb24pIHtcblx0ICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuXHQgICAgICB2YXIgY2hlY2tib3ggPSBvcHRpb24ucXVlcnlTZWxlY3RvcignaW5wdXQnKTtcblxuXHQgICAgICBpZiAoY2hlY2tib3ggaW5zdGFuY2VvZiBIVE1MSW5wdXRFbGVtZW50KSB7XG5cdCAgICAgICAgaWYgKG9wdGlvbi5jbGFzc0xpc3QuY29udGFpbnMoJ3NlbGVjdGVkJykpIHtcblx0ICAgICAgICAgIGNoZWNrYm94LmNoZWNrZWQgPSB0cnVlO1xuXHQgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICBjaGVja2JveC5jaGVja2VkID0gZmFsc2U7XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cdCAgICB9LCAxKTtcblx0ICB9OyAvLyBhZGQgY2hlY2tib3ggdG8gb3B0aW9uIHRlbXBsYXRlXG5cblxuXHQgIHNlbGYuaG9vaygnYWZ0ZXInLCAnc2V0dXBUZW1wbGF0ZXMnLCAoKSA9PiB7XG5cdCAgICB2YXIgb3JpZ19yZW5kZXJfb3B0aW9uID0gc2VsZi5zZXR0aW5ncy5yZW5kZXIub3B0aW9uO1xuXG5cdCAgICBzZWxmLnNldHRpbmdzLnJlbmRlci5vcHRpb24gPSAoZGF0YSwgZXNjYXBlX2h0bWwpID0+IHtcblx0ICAgICAgdmFyIHJlbmRlcmVkID0gZ2V0RG9tKG9yaWdfcmVuZGVyX29wdGlvbi5jYWxsKHNlbGYsIGRhdGEsIGVzY2FwZV9odG1sKSk7XG5cdCAgICAgIHZhciBjaGVja2JveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG5cdCAgICAgIGNoZWNrYm94LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGV2dCkge1xuXHQgICAgICAgIHByZXZlbnREZWZhdWx0KGV2dCk7XG5cdCAgICAgIH0pO1xuXHQgICAgICBjaGVja2JveC50eXBlID0gJ2NoZWNrYm94Jztcblx0ICAgICAgY29uc3QgaGFzaGVkID0gaGFzaF9rZXkoZGF0YVtzZWxmLnNldHRpbmdzLnZhbHVlRmllbGRdKTtcblxuXHQgICAgICBpZiAoaGFzaGVkICYmIHNlbGYuaXRlbXMuaW5kZXhPZihoYXNoZWQpID4gLTEpIHtcblx0ICAgICAgICBjaGVja2JveC5jaGVja2VkID0gdHJ1ZTtcblx0ICAgICAgfVxuXG5cdCAgICAgIHJlbmRlcmVkLnByZXBlbmQoY2hlY2tib3gpO1xuXHQgICAgICByZXR1cm4gcmVuZGVyZWQ7XG5cdCAgICB9O1xuXHQgIH0pOyAvLyB1bmNoZWNrIHdoZW4gaXRlbSByZW1vdmVkXG5cblx0ICBzZWxmLm9uKCdpdGVtX3JlbW92ZScsIHZhbHVlID0+IHtcblx0ICAgIHZhciBvcHRpb24gPSBzZWxmLmdldE9wdGlvbih2YWx1ZSk7XG5cblx0ICAgIGlmIChvcHRpb24pIHtcblx0ICAgICAgLy8gaWYgZHJvcGRvd24gaGFzbid0IGJlZW4gb3BlbmVkIHlldCwgdGhlIG9wdGlvbiB3b24ndCBleGlzdFxuXHQgICAgICBvcHRpb24uY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0ZWQnKTsgLy8gc2VsZWN0ZWQgY2xhc3Mgd29uJ3QgYmUgcmVtb3ZlZCB5ZXRcblxuXHQgICAgICBVcGRhdGVDaGVja2JveChvcHRpb24pO1xuXHQgICAgfVxuXHQgIH0pOyAvLyBjaGVjayB3aGVuIGl0ZW0gYWRkZWRcblxuXHQgIHNlbGYub24oJ2l0ZW1fYWRkJywgdmFsdWUgPT4ge1xuXHQgICAgdmFyIG9wdGlvbiA9IHNlbGYuZ2V0T3B0aW9uKHZhbHVlKTtcblxuXHQgICAgaWYgKG9wdGlvbikge1xuXHQgICAgICAvLyBpZiBkcm9wZG93biBoYXNuJ3QgYmVlbiBvcGVuZWQgeWV0LCB0aGUgb3B0aW9uIHdvbid0IGV4aXN0XG5cdCAgICAgIFVwZGF0ZUNoZWNrYm94KG9wdGlvbik7XG5cdCAgICB9XG5cdCAgfSk7IC8vIHJlbW92ZSBpdGVtcyB3aGVuIHNlbGVjdGVkIG9wdGlvbiBpcyBjbGlja2VkXG5cblx0ICBzZWxmLmhvb2soJ2luc3RlYWQnLCAnb25PcHRpb25TZWxlY3QnLCAoZXZ0LCBvcHRpb24pID0+IHtcblx0ICAgIGlmIChvcHRpb24uY2xhc3NMaXN0LmNvbnRhaW5zKCdzZWxlY3RlZCcpKSB7XG5cdCAgICAgIG9wdGlvbi5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZCcpO1xuXHQgICAgICBzZWxmLnJlbW92ZUl0ZW0ob3B0aW9uLmRhdGFzZXQudmFsdWUpO1xuXHQgICAgICBzZWxmLnJlZnJlc2hPcHRpb25zKCk7XG5cdCAgICAgIHByZXZlbnREZWZhdWx0KGV2dCwgdHJ1ZSk7XG5cdCAgICAgIHJldHVybjtcblx0ICAgIH1cblxuXHQgICAgb3JpZ19vbk9wdGlvblNlbGVjdC5jYWxsKHNlbGYsIGV2dCwgb3B0aW9uKTtcblx0ICAgIFVwZGF0ZUNoZWNrYm94KG9wdGlvbik7XG5cdCAgfSk7XG5cdH1cblxuXHQvKipcblx0ICogUGx1Z2luOiBcImRyb3Bkb3duX2hlYWRlclwiIChUb20gU2VsZWN0KVxuXHQgKiBDb3B5cmlnaHQgKGMpIGNvbnRyaWJ1dG9yc1xuXHQgKlxuXHQgKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpc1xuXHQgKiBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdDpcblx0ICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG5cdCAqXG5cdCAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXJcblx0ICogdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRlxuXHQgKiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2Vcblx0ICogZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cblx0ICpcblx0ICovXG5cdGZ1bmN0aW9uIGNsZWFyX2J1dHRvbiAodXNlck9wdGlvbnMpIHtcblx0ICBjb25zdCBzZWxmID0gdGhpcztcblx0ICBjb25zdCBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7XG5cdCAgICBjbGFzc05hbWU6ICdjbGVhci1idXR0b24nLFxuXHQgICAgdGl0bGU6ICdDbGVhciBBbGwnLFxuXHQgICAgaHRtbDogZGF0YSA9PiB7XG5cdCAgICAgIHJldHVybiBgPGRpdiBjbGFzcz1cIiR7ZGF0YS5jbGFzc05hbWV9XCIgdGl0bGU9XCIke2RhdGEudGl0bGV9XCI+JiMxMDc5OTs8L2Rpdj5gO1xuXHQgICAgfVxuXHQgIH0sIHVzZXJPcHRpb25zKTtcblx0ICBzZWxmLm9uKCdpbml0aWFsaXplJywgKCkgPT4ge1xuXHQgICAgdmFyIGJ1dHRvbiA9IGdldERvbShvcHRpb25zLmh0bWwob3B0aW9ucykpO1xuXHQgICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZ0ID0+IHtcblx0ICAgICAgaWYgKHNlbGYuaXNEaXNhYmxlZCkge1xuXHQgICAgICAgIHJldHVybjtcblx0ICAgICAgfVxuXG5cdCAgICAgIHNlbGYuY2xlYXIoKTtcblxuXHQgICAgICBpZiAoc2VsZi5zZXR0aW5ncy5tb2RlID09PSAnc2luZ2xlJyAmJiBzZWxmLnNldHRpbmdzLmFsbG93RW1wdHlPcHRpb24pIHtcblx0ICAgICAgICBzZWxmLmFkZEl0ZW0oJycpO1xuXHQgICAgICB9XG5cblx0ICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cdCAgICAgIGV2dC5zdG9wUHJvcGFnYXRpb24oKTtcblx0ICAgIH0pO1xuXHQgICAgc2VsZi5jb250cm9sLmFwcGVuZENoaWxkKGJ1dHRvbik7XG5cdCAgfSk7XG5cdH1cblxuXHQvKipcblx0ICogUGx1Z2luOiBcImRyYWdfZHJvcFwiIChUb20gU2VsZWN0KVxuXHQgKiBDb3B5cmlnaHQgKGMpIGNvbnRyaWJ1dG9yc1xuXHQgKlxuXHQgKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpc1xuXHQgKiBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdDpcblx0ICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG5cdCAqXG5cdCAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXJcblx0ICogdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRlxuXHQgKiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2Vcblx0ICogZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cblx0ICpcblx0ICovXG5cdGZ1bmN0aW9uIGRyYWdfZHJvcCAoKSB7XG5cdCAgdmFyIHNlbGYgPSB0aGlzO1xuXHQgIGlmICghJC5mbi5zb3J0YWJsZSkgdGhyb3cgbmV3IEVycm9yKCdUaGUgXCJkcmFnX2Ryb3BcIiBwbHVnaW4gcmVxdWlyZXMgalF1ZXJ5IFVJIFwic29ydGFibGVcIi4nKTtcblx0ICBpZiAoc2VsZi5zZXR0aW5ncy5tb2RlICE9PSAnbXVsdGknKSByZXR1cm47XG5cdCAgdmFyIG9yaWdfbG9jayA9IHNlbGYubG9jaztcblx0ICB2YXIgb3JpZ191bmxvY2sgPSBzZWxmLnVubG9jaztcblx0ICBzZWxmLmhvb2soJ2luc3RlYWQnLCAnbG9jaycsICgpID0+IHtcblx0ICAgIHZhciBzb3J0YWJsZSA9ICQoc2VsZi5jb250cm9sKS5kYXRhKCdzb3J0YWJsZScpO1xuXHQgICAgaWYgKHNvcnRhYmxlKSBzb3J0YWJsZS5kaXNhYmxlKCk7XG5cdCAgICByZXR1cm4gb3JpZ19sb2NrLmNhbGwoc2VsZik7XG5cdCAgfSk7XG5cdCAgc2VsZi5ob29rKCdpbnN0ZWFkJywgJ3VubG9jaycsICgpID0+IHtcblx0ICAgIHZhciBzb3J0YWJsZSA9ICQoc2VsZi5jb250cm9sKS5kYXRhKCdzb3J0YWJsZScpO1xuXHQgICAgaWYgKHNvcnRhYmxlKSBzb3J0YWJsZS5lbmFibGUoKTtcblx0ICAgIHJldHVybiBvcmlnX3VubG9jay5jYWxsKHNlbGYpO1xuXHQgIH0pO1xuXHQgIHNlbGYub24oJ2luaXRpYWxpemUnLCAoKSA9PiB7XG5cdCAgICB2YXIgJGNvbnRyb2wgPSAkKHNlbGYuY29udHJvbCkuc29ydGFibGUoe1xuXHQgICAgICBpdGVtczogJ1tkYXRhLXZhbHVlXScsXG5cdCAgICAgIGZvcmNlUGxhY2Vob2xkZXJTaXplOiB0cnVlLFxuXHQgICAgICBkaXNhYmxlZDogc2VsZi5pc0xvY2tlZCxcblx0ICAgICAgc3RhcnQ6IChlLCB1aSkgPT4ge1xuXHQgICAgICAgIHVpLnBsYWNlaG9sZGVyLmNzcygnd2lkdGgnLCB1aS5oZWxwZXIuY3NzKCd3aWR0aCcpKTtcblx0ICAgICAgICAkY29udHJvbC5jc3Moe1xuXHQgICAgICAgICAgb3ZlcmZsb3c6ICd2aXNpYmxlJ1xuXHQgICAgICAgIH0pO1xuXHQgICAgICB9LFxuXHQgICAgICBzdG9wOiAoKSA9PiB7XG5cdCAgICAgICAgJGNvbnRyb2wuY3NzKHtcblx0ICAgICAgICAgIG92ZXJmbG93OiAnaGlkZGVuJ1xuXHQgICAgICAgIH0pO1xuXHQgICAgICAgIHZhciB2YWx1ZXMgPSBbXTtcblx0ICAgICAgICAkY29udHJvbC5jaGlsZHJlbignW2RhdGEtdmFsdWVdJykuZWFjaChmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgICBpZiAodGhpcy5kYXRhc2V0LnZhbHVlKSB2YWx1ZXMucHVzaCh0aGlzLmRhdGFzZXQudmFsdWUpO1xuXHQgICAgICAgIH0pO1xuXHQgICAgICAgIHNlbGYuc2V0VmFsdWUodmFsdWVzKTtcblx0ICAgICAgfVxuXHQgICAgfSk7XG5cdCAgfSk7XG5cdH1cblxuXHQvKipcblx0ICogUGx1Z2luOiBcImRyb3Bkb3duX2hlYWRlclwiIChUb20gU2VsZWN0KVxuXHQgKiBDb3B5cmlnaHQgKGMpIGNvbnRyaWJ1dG9yc1xuXHQgKlxuXHQgKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpc1xuXHQgKiBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdDpcblx0ICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG5cdCAqXG5cdCAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXJcblx0ICogdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRlxuXHQgKiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2Vcblx0ICogZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cblx0ICpcblx0ICovXG5cdGZ1bmN0aW9uIGRyb3Bkb3duX2hlYWRlciAodXNlck9wdGlvbnMpIHtcblx0ICBjb25zdCBzZWxmID0gdGhpcztcblx0ICBjb25zdCBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7XG5cdCAgICB0aXRsZTogJ1VudGl0bGVkJyxcblx0ICAgIGhlYWRlckNsYXNzOiAnZHJvcGRvd24taGVhZGVyJyxcblx0ICAgIHRpdGxlUm93Q2xhc3M6ICdkcm9wZG93bi1oZWFkZXItdGl0bGUnLFxuXHQgICAgbGFiZWxDbGFzczogJ2Ryb3Bkb3duLWhlYWRlci1sYWJlbCcsXG5cdCAgICBjbG9zZUNsYXNzOiAnZHJvcGRvd24taGVhZGVyLWNsb3NlJyxcblx0ICAgIGh0bWw6IGRhdGEgPT4ge1xuXHQgICAgICByZXR1cm4gJzxkaXYgY2xhc3M9XCInICsgZGF0YS5oZWFkZXJDbGFzcyArICdcIj4nICsgJzxkaXYgY2xhc3M9XCInICsgZGF0YS50aXRsZVJvd0NsYXNzICsgJ1wiPicgKyAnPHNwYW4gY2xhc3M9XCInICsgZGF0YS5sYWJlbENsYXNzICsgJ1wiPicgKyBkYXRhLnRpdGxlICsgJzwvc3Bhbj4nICsgJzxhIGNsYXNzPVwiJyArIGRhdGEuY2xvc2VDbGFzcyArICdcIj4mdGltZXM7PC9hPicgKyAnPC9kaXY+JyArICc8L2Rpdj4nO1xuXHQgICAgfVxuXHQgIH0sIHVzZXJPcHRpb25zKTtcblx0ICBzZWxmLm9uKCdpbml0aWFsaXplJywgKCkgPT4ge1xuXHQgICAgdmFyIGhlYWRlciA9IGdldERvbShvcHRpb25zLmh0bWwob3B0aW9ucykpO1xuXHQgICAgdmFyIGNsb3NlX2xpbmsgPSBoZWFkZXIucXVlcnlTZWxlY3RvcignLicgKyBvcHRpb25zLmNsb3NlQ2xhc3MpO1xuXG5cdCAgICBpZiAoY2xvc2VfbGluaykge1xuXHQgICAgICBjbG9zZV9saW5rLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZ0ID0+IHtcblx0ICAgICAgICBwcmV2ZW50RGVmYXVsdChldnQsIHRydWUpO1xuXHQgICAgICAgIHNlbGYuY2xvc2UoKTtcblx0ICAgICAgfSk7XG5cdCAgICB9XG5cblx0ICAgIHNlbGYuZHJvcGRvd24uaW5zZXJ0QmVmb3JlKGhlYWRlciwgc2VsZi5kcm9wZG93bi5maXJzdENoaWxkKTtcblx0ICB9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBQbHVnaW46IFwiZHJvcGRvd25faW5wdXRcIiAoVG9tIFNlbGVjdClcblx0ICogQ29weXJpZ2h0IChjKSBjb250cmlidXRvcnNcblx0ICpcblx0ICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlIHRoaXNcblx0ICogZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXQ6XG5cdCAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuXHQgKlxuXHQgKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyXG5cdCAqIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0Zcblx0ICogQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlXG5cdCAqIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5cdCAqXG5cdCAqL1xuXHRmdW5jdGlvbiBjYXJldF9wb3NpdGlvbiAoKSB7XG5cdCAgdmFyIHNlbGYgPSB0aGlzO1xuXHQgIC8qKlxuXHQgICAqIE1vdmVzIHRoZSBjYXJldCB0byB0aGUgc3BlY2lmaWVkIGluZGV4LlxuXHQgICAqXG5cdCAgICogVGhlIGlucHV0IG11c3QgYmUgbW92ZWQgYnkgbGVhdmluZyBpdCBpbiBwbGFjZSBhbmQgbW92aW5nIHRoZVxuXHQgICAqIHNpYmxpbmdzLCBkdWUgdG8gdGhlIGZhY3QgdGhhdCBmb2N1cyBjYW5ub3QgYmUgcmVzdG9yZWQgb25jZSBsb3N0XG5cdCAgICogb24gbW9iaWxlIHdlYmtpdCBkZXZpY2VzXG5cdCAgICpcblx0ICAgKi9cblxuXHQgIHNlbGYuaG9vaygnaW5zdGVhZCcsICdzZXRDYXJldCcsIG5ld19wb3MgPT4ge1xuXHQgICAgaWYgKHNlbGYuc2V0dGluZ3MubW9kZSA9PT0gJ3NpbmdsZScgfHwgIXNlbGYuY29udHJvbC5jb250YWlucyhzZWxmLmNvbnRyb2xfaW5wdXQpKSB7XG5cdCAgICAgIG5ld19wb3MgPSBzZWxmLml0ZW1zLmxlbmd0aDtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIG5ld19wb3MgPSBNYXRoLm1heCgwLCBNYXRoLm1pbihzZWxmLml0ZW1zLmxlbmd0aCwgbmV3X3BvcykpO1xuXG5cdCAgICAgIGlmIChuZXdfcG9zICE9IHNlbGYuY2FyZXRQb3MgJiYgIXNlbGYuaXNQZW5kaW5nKSB7XG5cdCAgICAgICAgc2VsZi5jb250cm9sQ2hpbGRyZW4oKS5mb3JFYWNoKChjaGlsZCwgaikgPT4ge1xuXHQgICAgICAgICAgaWYgKGogPCBuZXdfcG9zKSB7XG5cdCAgICAgICAgICAgIHNlbGYuY29udHJvbF9pbnB1dC5pbnNlcnRBZGphY2VudEVsZW1lbnQoJ2JlZm9yZWJlZ2luJywgY2hpbGQpO1xuXHQgICAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgICAgc2VsZi5jb250cm9sLmFwcGVuZENoaWxkKGNoaWxkKTtcblx0ICAgICAgICAgIH1cblx0ICAgICAgICB9KTtcblx0ICAgICAgfVxuXHQgICAgfVxuXG5cdCAgICBzZWxmLmNhcmV0UG9zID0gbmV3X3Bvcztcblx0ICB9KTtcblx0ICBzZWxmLmhvb2soJ2luc3RlYWQnLCAnbW92ZUNhcmV0JywgZGlyZWN0aW9uID0+IHtcblx0ICAgIGlmICghc2VsZi5pc0ZvY3VzZWQpIHJldHVybjsgLy8gbW92ZSBjYXJldCBiZWZvcmUgb3IgYWZ0ZXIgc2VsZWN0ZWQgaXRlbXNcblxuXHQgICAgY29uc3QgbGFzdF9hY3RpdmUgPSBzZWxmLmdldExhc3RBY3RpdmUoZGlyZWN0aW9uKTtcblxuXHQgICAgaWYgKGxhc3RfYWN0aXZlKSB7XG5cdCAgICAgIGNvbnN0IGlkeCA9IG5vZGVJbmRleChsYXN0X2FjdGl2ZSk7XG5cdCAgICAgIHNlbGYuc2V0Q2FyZXQoZGlyZWN0aW9uID4gMCA/IGlkeCArIDEgOiBpZHgpO1xuXHQgICAgICBzZWxmLnNldEFjdGl2ZUl0ZW0oKTtcblx0ICAgICAgcmVtb3ZlQ2xhc3NlcyhsYXN0X2FjdGl2ZSwgJ2xhc3QtYWN0aXZlJyk7IC8vIG1vdmUgY2FyZXQgbGVmdCBvciByaWdodCBvZiBjdXJyZW50IHBvc2l0aW9uXG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICBzZWxmLnNldENhcmV0KHNlbGYuY2FyZXRQb3MgKyBkaXJlY3Rpb24pO1xuXHQgICAgfVxuXHQgIH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIFBsdWdpbjogXCJkcm9wZG93bl9pbnB1dFwiIChUb20gU2VsZWN0KVxuXHQgKiBDb3B5cmlnaHQgKGMpIGNvbnRyaWJ1dG9yc1xuXHQgKlxuXHQgKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpc1xuXHQgKiBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdDpcblx0ICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG5cdCAqXG5cdCAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXJcblx0ICogdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRlxuXHQgKiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2Vcblx0ICogZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cblx0ICpcblx0ICovXG5cdGZ1bmN0aW9uIGRyb3Bkb3duX2lucHV0ICgpIHtcblx0ICBjb25zdCBzZWxmID0gdGhpcztcblx0ICBzZWxmLnNldHRpbmdzLnNob3VsZE9wZW4gPSB0cnVlOyAvLyBtYWtlIHN1cmUgdGhlIGlucHV0IGlzIHNob3duIGV2ZW4gaWYgdGhlcmUgYXJlIG5vIG9wdGlvbnMgdG8gZGlzcGxheSBpbiB0aGUgZHJvcGRvd25cblxuXHQgIHNlbGYuaG9vaygnYmVmb3JlJywgJ3NldHVwJywgKCkgPT4ge1xuXHQgICAgc2VsZi5mb2N1c19ub2RlID0gc2VsZi5jb250cm9sO1xuXHQgICAgYWRkQ2xhc3NlcyhzZWxmLmNvbnRyb2xfaW5wdXQsICdkcm9wZG93bi1pbnB1dCcpO1xuXHQgICAgY29uc3QgZGl2ID0gZ2V0RG9tKCc8ZGl2IGNsYXNzPVwiZHJvcGRvd24taW5wdXQtd3JhcFwiPicpO1xuXHQgICAgZGl2LmFwcGVuZChzZWxmLmNvbnRyb2xfaW5wdXQpO1xuXHQgICAgc2VsZi5kcm9wZG93bi5pbnNlcnRCZWZvcmUoZGl2LCBzZWxmLmRyb3Bkb3duLmZpcnN0Q2hpbGQpOyAvLyBzZXQgYSBwbGFjZWhvbGRlciBpbiB0aGUgc2VsZWN0IGNvbnRyb2xcblxuXHQgICAgY29uc3QgcGxhY2Vob2xkZXIgPSBnZXREb20oJzxpbnB1dCBjbGFzcz1cIml0ZW1zLXBsYWNlaG9sZGVyXCIgdGFiaW5kZXg9XCItMVwiIC8+Jyk7XG5cdCAgICBwbGFjZWhvbGRlci5wbGFjZWhvbGRlciA9IHNlbGYuc2V0dGluZ3MucGxhY2Vob2xkZXIgfHwgJyc7XG5cdCAgICBzZWxmLmNvbnRyb2wuYXBwZW5kKHBsYWNlaG9sZGVyKTtcblx0ICB9KTtcblx0ICBzZWxmLm9uKCdpbml0aWFsaXplJywgKCkgPT4ge1xuXHQgICAgLy8gc2V0IHRhYkluZGV4IG9uIGNvbnRyb2wgdG8gLTEsIG90aGVyd2lzZSBbc2hpZnQrdGFiXSB3aWxsIHB1dCBmb2N1cyByaWdodCBiYWNrIG9uIGNvbnRyb2xfaW5wdXRcblx0ICAgIHNlbGYuY29udHJvbF9pbnB1dC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgZXZ0ID0+IHtcblx0ICAgICAgLy9hZGRFdmVudChzZWxmLmNvbnRyb2xfaW5wdXQsJ2tleWRvd24nIGFzIGNvbnN0LChldnQ6S2V5Ym9hcmRFdmVudCkgPT57XG5cdCAgICAgIHN3aXRjaCAoZXZ0LmtleUNvZGUpIHtcblx0ICAgICAgICBjYXNlIEtFWV9FU0M6XG5cdCAgICAgICAgICBpZiAoc2VsZi5pc09wZW4pIHtcblx0ICAgICAgICAgICAgcHJldmVudERlZmF1bHQoZXZ0LCB0cnVlKTtcblx0ICAgICAgICAgICAgc2VsZi5jbG9zZSgpO1xuXHQgICAgICAgICAgfVxuXG5cdCAgICAgICAgICBzZWxmLmNsZWFyQWN0aXZlSXRlbXMoKTtcblx0ICAgICAgICAgIHJldHVybjtcblxuXHQgICAgICAgIGNhc2UgS0VZX1RBQjpcblx0ICAgICAgICAgIHNlbGYuZm9jdXNfbm9kZS50YWJJbmRleCA9IC0xO1xuXHQgICAgICAgICAgYnJlYWs7XG5cdCAgICAgIH1cblxuXHQgICAgICByZXR1cm4gc2VsZi5vbktleURvd24uY2FsbChzZWxmLCBldnQpO1xuXHQgICAgfSk7XG5cdCAgICBzZWxmLm9uKCdibHVyJywgKCkgPT4ge1xuXHQgICAgICBzZWxmLmZvY3VzX25vZGUudGFiSW5kZXggPSBzZWxmLmlzRGlzYWJsZWQgPyAtMSA6IHNlbGYudGFiSW5kZXg7XG5cdCAgICB9KTsgLy8gZ2l2ZSB0aGUgY29udHJvbF9pbnB1dCBmb2N1cyB3aGVuIHRoZSBkcm9wZG93biBpcyBvcGVuXG5cblx0ICAgIHNlbGYub24oJ2Ryb3Bkb3duX29wZW4nLCAoKSA9PiB7XG5cdCAgICAgIHNlbGYuY29udHJvbF9pbnB1dC5mb2N1cygpO1xuXHQgICAgfSk7IC8vIHByZXZlbnQgb25CbHVyIGZyb20gY2xvc2luZyB3aGVuIGZvY3VzIGlzIG9uIHRoZSBjb250cm9sX2lucHV0XG5cblx0ICAgIGNvbnN0IG9yaWdfb25CbHVyID0gc2VsZi5vbkJsdXI7XG5cdCAgICBzZWxmLmhvb2soJ2luc3RlYWQnLCAnb25CbHVyJywgZXZ0ID0+IHtcblx0ICAgICAgaWYgKGV2dCAmJiBldnQucmVsYXRlZFRhcmdldCA9PSBzZWxmLmNvbnRyb2xfaW5wdXQpIHJldHVybjtcblx0ICAgICAgcmV0dXJuIG9yaWdfb25CbHVyLmNhbGwoc2VsZik7XG5cdCAgICB9KTtcblx0ICAgIGFkZEV2ZW50KHNlbGYuY29udHJvbF9pbnB1dCwgJ2JsdXInLCAoKSA9PiBzZWxmLm9uQmx1cigpKTsgLy8gcmV0dXJuIGZvY3VzIHRvIGNvbnRyb2wgdG8gYWxsb3cgZnVydGhlciBrZXlib2FyZCBpbnB1dFxuXG5cdCAgICBzZWxmLmhvb2soJ2JlZm9yZScsICdjbG9zZScsICgpID0+IHtcblx0ICAgICAgaWYgKCFzZWxmLmlzT3BlbikgcmV0dXJuO1xuXHQgICAgICBzZWxmLmZvY3VzX25vZGUuZm9jdXMoe1xuXHQgICAgICAgIHByZXZlbnRTY3JvbGw6IHRydWVcblx0ICAgICAgfSk7XG5cdCAgICB9KTtcblx0ICB9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBQbHVnaW46IFwiaW5wdXRfYXV0b2dyb3dcIiAoVG9tIFNlbGVjdClcblx0ICpcblx0ICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlIHRoaXNcblx0ICogZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXQ6XG5cdCAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuXHQgKlxuXHQgKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyXG5cdCAqIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0Zcblx0ICogQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlXG5cdCAqIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5cdCAqXG5cdCAqL1xuXHRmdW5jdGlvbiBpbnB1dF9hdXRvZ3JvdyAoKSB7XG5cdCAgdmFyIHNlbGYgPSB0aGlzO1xuXHQgIHNlbGYub24oJ2luaXRpYWxpemUnLCAoKSA9PiB7XG5cdCAgICB2YXIgdGVzdF9pbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcblx0ICAgIHZhciBjb250cm9sID0gc2VsZi5jb250cm9sX2lucHV0O1xuXHQgICAgdGVzdF9pbnB1dC5zdHlsZS5jc3NUZXh0ID0gJ3Bvc2l0aW9uOmFic29sdXRlOyB0b3A6LTk5OTk5cHg7IGxlZnQ6LTk5OTk5cHg7IHdpZHRoOmF1dG87IHBhZGRpbmc6MDsgd2hpdGUtc3BhY2U6cHJlOyAnO1xuXHQgICAgc2VsZi53cmFwcGVyLmFwcGVuZENoaWxkKHRlc3RfaW5wdXQpO1xuXHQgICAgdmFyIHRyYW5zZmVyX3N0eWxlcyA9IFsnbGV0dGVyU3BhY2luZycsICdmb250U2l6ZScsICdmb250RmFtaWx5JywgJ2ZvbnRXZWlnaHQnLCAndGV4dFRyYW5zZm9ybSddO1xuXG5cdCAgICBmb3IgKGNvbnN0IHN0eWxlX25hbWUgb2YgdHJhbnNmZXJfc3R5bGVzKSB7XG5cdCAgICAgIC8vIEB0cy1pZ25vcmUgVFM3MDE1IGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS81MDUwNjE1NC82OTc1NzZcblx0ICAgICAgdGVzdF9pbnB1dC5zdHlsZVtzdHlsZV9uYW1lXSA9IGNvbnRyb2wuc3R5bGVbc3R5bGVfbmFtZV07XG5cdCAgICB9XG5cdCAgICAvKipcblx0ICAgICAqIFNldCB0aGUgY29udHJvbCB3aWR0aFxuXHQgICAgICpcblx0ICAgICAqL1xuXG5cblx0ICAgIHZhciByZXNpemUgPSAoKSA9PiB7XG5cdCAgICAgIHRlc3RfaW5wdXQudGV4dENvbnRlbnQgPSBjb250cm9sLnZhbHVlO1xuXHQgICAgICBjb250cm9sLnN0eWxlLndpZHRoID0gdGVzdF9pbnB1dC5jbGllbnRXaWR0aCArICdweCc7XG5cdCAgICB9O1xuXG5cdCAgICByZXNpemUoKTtcblx0ICAgIHNlbGYub24oJ3VwZGF0ZSBpdGVtX2FkZCBpdGVtX3JlbW92ZScsIHJlc2l6ZSk7XG5cdCAgICBhZGRFdmVudChjb250cm9sLCAnaW5wdXQnLCByZXNpemUpO1xuXHQgICAgYWRkRXZlbnQoY29udHJvbCwgJ2tleXVwJywgcmVzaXplKTtcblx0ICAgIGFkZEV2ZW50KGNvbnRyb2wsICdibHVyJywgcmVzaXplKTtcblx0ICAgIGFkZEV2ZW50KGNvbnRyb2wsICd1cGRhdGUnLCByZXNpemUpO1xuXHQgIH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIFBsdWdpbjogXCJpbnB1dF9hdXRvZ3Jvd1wiIChUb20gU2VsZWN0KVxuXHQgKlxuXHQgKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpc1xuXHQgKiBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdDpcblx0ICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG5cdCAqXG5cdCAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXJcblx0ICogdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRlxuXHQgKiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2Vcblx0ICogZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cblx0ICpcblx0ICovXG5cdGZ1bmN0aW9uIG5vX2JhY2tzcGFjZV9kZWxldGUgKCkge1xuXHQgIHZhciBzZWxmID0gdGhpcztcblx0ICB2YXIgb3JpZ19kZWxldGVTZWxlY3Rpb24gPSBzZWxmLmRlbGV0ZVNlbGVjdGlvbjtcblx0ICB0aGlzLmhvb2soJ2luc3RlYWQnLCAnZGVsZXRlU2VsZWN0aW9uJywgZXZ0ID0+IHtcblx0ICAgIGlmIChzZWxmLmFjdGl2ZUl0ZW1zLmxlbmd0aCkge1xuXHQgICAgICByZXR1cm4gb3JpZ19kZWxldGVTZWxlY3Rpb24uY2FsbChzZWxmLCBldnQpO1xuXHQgICAgfVxuXG5cdCAgICByZXR1cm4gZmFsc2U7XG5cdCAgfSk7XG5cdH1cblxuXHQvKipcblx0ICogUGx1Z2luOiBcIm5vX2FjdGl2ZV9pdGVtc1wiIChUb20gU2VsZWN0KVxuXHQgKlxuXHQgKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpc1xuXHQgKiBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdDpcblx0ICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG5cdCAqXG5cdCAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXJcblx0ICogdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRlxuXHQgKiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2Vcblx0ICogZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cblx0ICpcblx0ICovXG5cdGZ1bmN0aW9uIG5vX2FjdGl2ZV9pdGVtcyAoKSB7XG5cdCAgdGhpcy5ob29rKCdpbnN0ZWFkJywgJ3NldEFjdGl2ZUl0ZW0nLCAoKSA9PiB7fSk7XG5cdCAgdGhpcy5ob29rKCdpbnN0ZWFkJywgJ3NlbGVjdEFsbCcsICgpID0+IHt9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBQbHVnaW46IFwib3B0Z3JvdXBfY29sdW1uc1wiIChUb20gU2VsZWN0LmpzKVxuXHQgKiBDb3B5cmlnaHQgKGMpIGNvbnRyaWJ1dG9yc1xuXHQgKlxuXHQgKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpc1xuXHQgKiBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdDpcblx0ICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG5cdCAqXG5cdCAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXJcblx0ICogdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRlxuXHQgKiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2Vcblx0ICogZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cblx0ICpcblx0ICovXG5cdGZ1bmN0aW9uIG9wdGdyb3VwX2NvbHVtbnMgKCkge1xuXHQgIHZhciBzZWxmID0gdGhpcztcblx0ICB2YXIgb3JpZ19rZXlkb3duID0gc2VsZi5vbktleURvd247XG5cdCAgc2VsZi5ob29rKCdpbnN0ZWFkJywgJ29uS2V5RG93bicsIGV2dCA9PiB7XG5cdCAgICB2YXIgaW5kZXgsIG9wdGlvbiwgb3B0aW9ucywgb3B0Z3JvdXA7XG5cblx0ICAgIGlmICghc2VsZi5pc09wZW4gfHwgIShldnQua2V5Q29kZSA9PT0gS0VZX0xFRlQgfHwgZXZ0LmtleUNvZGUgPT09IEtFWV9SSUdIVCkpIHtcblx0ICAgICAgcmV0dXJuIG9yaWdfa2V5ZG93bi5jYWxsKHNlbGYsIGV2dCk7XG5cdCAgICB9XG5cblx0ICAgIHNlbGYuaWdub3JlSG92ZXIgPSB0cnVlO1xuXHQgICAgb3B0Z3JvdXAgPSBwYXJlbnRNYXRjaChzZWxmLmFjdGl2ZU9wdGlvbiwgJ1tkYXRhLWdyb3VwXScpO1xuXHQgICAgaW5kZXggPSBub2RlSW5kZXgoc2VsZi5hY3RpdmVPcHRpb24sICdbZGF0YS1zZWxlY3RhYmxlXScpO1xuXG5cdCAgICBpZiAoIW9wdGdyb3VwKSB7XG5cdCAgICAgIHJldHVybjtcblx0ICAgIH1cblxuXHQgICAgaWYgKGV2dC5rZXlDb2RlID09PSBLRVlfTEVGVCkge1xuXHQgICAgICBvcHRncm91cCA9IG9wdGdyb3VwLnByZXZpb3VzU2libGluZztcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIG9wdGdyb3VwID0gb3B0Z3JvdXAubmV4dFNpYmxpbmc7XG5cdCAgICB9XG5cblx0ICAgIGlmICghb3B0Z3JvdXApIHtcblx0ICAgICAgcmV0dXJuO1xuXHQgICAgfVxuXG5cdCAgICBvcHRpb25zID0gb3B0Z3JvdXAucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtc2VsZWN0YWJsZV0nKTtcblx0ICAgIG9wdGlvbiA9IG9wdGlvbnNbTWF0aC5taW4ob3B0aW9ucy5sZW5ndGggLSAxLCBpbmRleCldO1xuXG5cdCAgICBpZiAob3B0aW9uKSB7XG5cdCAgICAgIHNlbGYuc2V0QWN0aXZlT3B0aW9uKG9wdGlvbik7XG5cdCAgICB9XG5cdCAgfSk7XG5cdH1cblxuXHQvKipcblx0ICogUGx1Z2luOiBcInJlbW92ZV9idXR0b25cIiAoVG9tIFNlbGVjdClcblx0ICogQ29weXJpZ2h0IChjKSBjb250cmlidXRvcnNcblx0ICpcblx0ICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlIHRoaXNcblx0ICogZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXQ6XG5cdCAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuXHQgKlxuXHQgKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyXG5cdCAqIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0Zcblx0ICogQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlXG5cdCAqIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5cdCAqXG5cdCAqL1xuXHRmdW5jdGlvbiByZW1vdmVfYnV0dG9uICh1c2VyT3B0aW9ucykge1xuXHQgIGNvbnN0IG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHtcblx0ICAgIGxhYmVsOiAnJnRpbWVzOycsXG5cdCAgICB0aXRsZTogJ1JlbW92ZScsXG5cdCAgICBjbGFzc05hbWU6ICdyZW1vdmUnLFxuXHQgICAgYXBwZW5kOiB0cnVlXG5cdCAgfSwgdXNlck9wdGlvbnMpOyAvL29wdGlvbnMuY2xhc3NOYW1lID0gJ3JlbW92ZS1zaW5nbGUnO1xuXG5cdCAgdmFyIHNlbGYgPSB0aGlzOyAvLyBvdmVycmlkZSB0aGUgcmVuZGVyIG1ldGhvZCB0byBhZGQgcmVtb3ZlIGJ1dHRvbiB0byBlYWNoIGl0ZW1cblxuXHQgIGlmICghb3B0aW9ucy5hcHBlbmQpIHtcblx0ICAgIHJldHVybjtcblx0ICB9XG5cblx0ICB2YXIgaHRtbCA9ICc8YSBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApXCIgY2xhc3M9XCInICsgb3B0aW9ucy5jbGFzc05hbWUgKyAnXCIgdGFiaW5kZXg9XCItMVwiIHRpdGxlPVwiJyArIGVzY2FwZV9odG1sKG9wdGlvbnMudGl0bGUpICsgJ1wiPicgKyBvcHRpb25zLmxhYmVsICsgJzwvYT4nO1xuXHQgIHNlbGYuaG9vaygnYWZ0ZXInLCAnc2V0dXBUZW1wbGF0ZXMnLCAoKSA9PiB7XG5cdCAgICB2YXIgb3JpZ19yZW5kZXJfaXRlbSA9IHNlbGYuc2V0dGluZ3MucmVuZGVyLml0ZW07XG5cblx0ICAgIHNlbGYuc2V0dGluZ3MucmVuZGVyLml0ZW0gPSAoZGF0YSwgZXNjYXBlKSA9PiB7XG5cdCAgICAgIHZhciBpdGVtID0gZ2V0RG9tKG9yaWdfcmVuZGVyX2l0ZW0uY2FsbChzZWxmLCBkYXRhLCBlc2NhcGUpKTtcblx0ICAgICAgdmFyIGNsb3NlX2J1dHRvbiA9IGdldERvbShodG1sKTtcblx0ICAgICAgaXRlbS5hcHBlbmRDaGlsZChjbG9zZV9idXR0b24pO1xuXHQgICAgICBhZGRFdmVudChjbG9zZV9idXR0b24sICdtb3VzZWRvd24nLCBldnQgPT4ge1xuXHQgICAgICAgIHByZXZlbnREZWZhdWx0KGV2dCwgdHJ1ZSk7XG5cdCAgICAgIH0pO1xuXHQgICAgICBhZGRFdmVudChjbG9zZV9idXR0b24sICdjbGljaycsIGV2dCA9PiB7XG5cdCAgICAgICAgLy8gcHJvcGFnYXRpbmcgd2lsbCB0cmlnZ2VyIHRoZSBkcm9wZG93biB0byBzaG93IGZvciBzaW5nbGUgbW9kZVxuXHQgICAgICAgIHByZXZlbnREZWZhdWx0KGV2dCwgdHJ1ZSk7XG5cdCAgICAgICAgaWYgKHNlbGYuaXNMb2NrZWQpIHJldHVybjtcblx0ICAgICAgICBpZiAoIXNlbGYuc2hvdWxkRGVsZXRlKFtpdGVtXSwgZXZ0KSkgcmV0dXJuO1xuXHQgICAgICAgIHNlbGYucmVtb3ZlSXRlbShpdGVtKTtcblx0ICAgICAgICBzZWxmLnJlZnJlc2hPcHRpb25zKGZhbHNlKTtcblx0ICAgICAgICBzZWxmLmlucHV0U3RhdGUoKTtcblx0ICAgICAgfSk7XG5cdCAgICAgIHJldHVybiBpdGVtO1xuXHQgICAgfTtcblx0ICB9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBQbHVnaW46IFwicmVzdG9yZV9vbl9iYWNrc3BhY2VcIiAoVG9tIFNlbGVjdClcblx0ICogQ29weXJpZ2h0IChjKSBjb250cmlidXRvcnNcblx0ICpcblx0ICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlIHRoaXNcblx0ICogZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXQ6XG5cdCAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuXHQgKlxuXHQgKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyXG5cdCAqIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0Zcblx0ICogQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlXG5cdCAqIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5cdCAqXG5cdCAqL1xuXHRmdW5jdGlvbiByZXN0b3JlX29uX2JhY2tzcGFjZSAodXNlck9wdGlvbnMpIHtcblx0ICBjb25zdCBzZWxmID0gdGhpcztcblx0ICBjb25zdCBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7XG5cdCAgICB0ZXh0OiBvcHRpb24gPT4ge1xuXHQgICAgICByZXR1cm4gb3B0aW9uW3NlbGYuc2V0dGluZ3MubGFiZWxGaWVsZF07XG5cdCAgICB9XG5cdCAgfSwgdXNlck9wdGlvbnMpO1xuXHQgIHNlbGYub24oJ2l0ZW1fcmVtb3ZlJywgZnVuY3Rpb24gKHZhbHVlKSB7XG5cdCAgICBpZiAoIXNlbGYuaXNGb2N1c2VkKSB7XG5cdCAgICAgIHJldHVybjtcblx0ICAgIH1cblxuXHQgICAgaWYgKHNlbGYuY29udHJvbF9pbnB1dC52YWx1ZS50cmltKCkgPT09ICcnKSB7XG5cdCAgICAgIHZhciBvcHRpb24gPSBzZWxmLm9wdGlvbnNbdmFsdWVdO1xuXG5cdCAgICAgIGlmIChvcHRpb24pIHtcblx0ICAgICAgICBzZWxmLnNldFRleHRib3hWYWx1ZShvcHRpb25zLnRleHQuY2FsbChzZWxmLCBvcHRpb24pKTtcblx0ICAgICAgfVxuXHQgICAgfVxuXHQgIH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIFBsdWdpbjogXCJyZXN0b3JlX29uX2JhY2tzcGFjZVwiIChUb20gU2VsZWN0KVxuXHQgKiBDb3B5cmlnaHQgKGMpIGNvbnRyaWJ1dG9yc1xuXHQgKlxuXHQgKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpc1xuXHQgKiBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdDpcblx0ICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG5cdCAqXG5cdCAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXJcblx0ICogdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRlxuXHQgKiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2Vcblx0ICogZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cblx0ICpcblx0ICovXG5cdGZ1bmN0aW9uIHZpcnR1YWxfc2Nyb2xsICgpIHtcblx0ICBjb25zdCBzZWxmID0gdGhpcztcblx0ICBjb25zdCBvcmlnX2NhbkxvYWQgPSBzZWxmLmNhbkxvYWQ7XG5cdCAgY29uc3Qgb3JpZ19jbGVhckFjdGl2ZU9wdGlvbiA9IHNlbGYuY2xlYXJBY3RpdmVPcHRpb247XG5cdCAgY29uc3Qgb3JpZ19sb2FkQ2FsbGJhY2sgPSBzZWxmLmxvYWRDYWxsYmFjaztcblx0ICB2YXIgcGFnaW5hdGlvbiA9IHt9O1xuXHQgIHZhciBkcm9wZG93bl9jb250ZW50O1xuXHQgIHZhciBsb2FkaW5nX21vcmUgPSBmYWxzZTtcblx0ICB2YXIgbG9hZF9tb3JlX29wdDtcblx0ICB2YXIgZGVmYXVsdF92YWx1ZXMgPSBbXTtcblxuXHQgIGlmICghc2VsZi5zZXR0aW5ncy5zaG91bGRMb2FkTW9yZSkge1xuXHQgICAgLy8gcmV0dXJuIHRydWUgaWYgYWRkaXRpb25hbCByZXN1bHRzIHNob3VsZCBiZSBsb2FkZWRcblx0ICAgIHNlbGYuc2V0dGluZ3Muc2hvdWxkTG9hZE1vcmUgPSAoKSA9PiB7XG5cdCAgICAgIGNvbnN0IHNjcm9sbF9wZXJjZW50ID0gZHJvcGRvd25fY29udGVudC5jbGllbnRIZWlnaHQgLyAoZHJvcGRvd25fY29udGVudC5zY3JvbGxIZWlnaHQgLSBkcm9wZG93bl9jb250ZW50LnNjcm9sbFRvcCk7XG5cblx0ICAgICAgaWYgKHNjcm9sbF9wZXJjZW50ID4gMC45KSB7XG5cdCAgICAgICAgcmV0dXJuIHRydWU7XG5cdCAgICAgIH1cblxuXHQgICAgICBpZiAoc2VsZi5hY3RpdmVPcHRpb24pIHtcblx0ICAgICAgICB2YXIgc2VsZWN0YWJsZSA9IHNlbGYuc2VsZWN0YWJsZSgpO1xuXHQgICAgICAgIHZhciBpbmRleCA9IEFycmF5LmZyb20oc2VsZWN0YWJsZSkuaW5kZXhPZihzZWxmLmFjdGl2ZU9wdGlvbik7XG5cblx0ICAgICAgICBpZiAoaW5kZXggPj0gc2VsZWN0YWJsZS5sZW5ndGggLSAyKSB7XG5cdCAgICAgICAgICByZXR1cm4gdHJ1ZTtcblx0ICAgICAgICB9XG5cdCAgICAgIH1cblxuXHQgICAgICByZXR1cm4gZmFsc2U7XG5cdCAgICB9O1xuXHQgIH1cblxuXHQgIGlmICghc2VsZi5zZXR0aW5ncy5maXJzdFVybCkge1xuXHQgICAgdGhyb3cgJ3ZpcnR1YWxfc2Nyb2xsIHBsdWdpbiByZXF1aXJlcyBhIGZpcnN0VXJsKCkgbWV0aG9kJztcblx0ICB9IC8vIGluIG9yZGVyIGZvciB2aXJ0dWFsIHNjcm9sbGluZyB0byB3b3JrLFxuXHQgIC8vIG9wdGlvbnMgbmVlZCB0byBiZSBvcmRlcmVkIHRoZSBzYW1lIHdheSB0aGV5J3JlIHJldHVybmVkIGZyb20gdGhlIHJlbW90ZSBkYXRhIHNvdXJjZVxuXG5cblx0ICBzZWxmLnNldHRpbmdzLnNvcnRGaWVsZCA9IFt7XG5cdCAgICBmaWVsZDogJyRvcmRlcidcblx0ICB9LCB7XG5cdCAgICBmaWVsZDogJyRzY29yZSdcblx0ICB9XTsgLy8gY2FuIHdlIGxvYWQgbW9yZSByZXN1bHRzIGZvciBnaXZlbiBxdWVyeT9cblxuXHQgIGNvbnN0IGNhbkxvYWRNb3JlID0gcXVlcnkgPT4ge1xuXHQgICAgaWYgKHR5cGVvZiBzZWxmLnNldHRpbmdzLm1heE9wdGlvbnMgPT09ICdudW1iZXInICYmIGRyb3Bkb3duX2NvbnRlbnQuY2hpbGRyZW4ubGVuZ3RoID49IHNlbGYuc2V0dGluZ3MubWF4T3B0aW9ucykge1xuXHQgICAgICByZXR1cm4gZmFsc2U7XG5cdCAgICB9XG5cblx0ICAgIGlmIChxdWVyeSBpbiBwYWdpbmF0aW9uICYmIHBhZ2luYXRpb25bcXVlcnldKSB7XG5cdCAgICAgIHJldHVybiB0cnVlO1xuXHQgICAgfVxuXG5cdCAgICByZXR1cm4gZmFsc2U7XG5cdCAgfTtcblxuXHQgIGNvbnN0IGNsZWFyRmlsdGVyID0gKG9wdGlvbiwgdmFsdWUpID0+IHtcblx0ICAgIGlmIChzZWxmLml0ZW1zLmluZGV4T2YodmFsdWUpID49IDAgfHwgZGVmYXVsdF92YWx1ZXMuaW5kZXhPZih2YWx1ZSkgPj0gMCkge1xuXHQgICAgICByZXR1cm4gdHJ1ZTtcblx0ICAgIH1cblxuXHQgICAgcmV0dXJuIGZhbHNlO1xuXHQgIH07IC8vIHNldCB0aGUgbmV4dCB1cmwgdGhhdCB3aWxsIGJlXG5cblxuXHQgIHNlbGYuc2V0TmV4dFVybCA9ICh2YWx1ZSwgbmV4dF91cmwpID0+IHtcblx0ICAgIHBhZ2luYXRpb25bdmFsdWVdID0gbmV4dF91cmw7XG5cdCAgfTsgLy8gZ2V0VXJsKCkgdG8gYmUgdXNlZCBpbiBzZXR0aW5ncy5sb2FkKClcblxuXG5cdCAgc2VsZi5nZXRVcmwgPSBxdWVyeSA9PiB7XG5cdCAgICBpZiAocXVlcnkgaW4gcGFnaW5hdGlvbikge1xuXHQgICAgICBjb25zdCBuZXh0X3VybCA9IHBhZ2luYXRpb25bcXVlcnldO1xuXHQgICAgICBwYWdpbmF0aW9uW3F1ZXJ5XSA9IGZhbHNlO1xuXHQgICAgICByZXR1cm4gbmV4dF91cmw7XG5cdCAgICB9IC8vIGlmIHRoZSB1c2VyIGdvZXMgYmFjayB0byBhIHByZXZpb3VzIHF1ZXJ5XG5cdCAgICAvLyB3ZSBuZWVkIHRvIGxvYWQgdGhlIGZpcnN0IHBhZ2UgYWdhaW5cblxuXG5cdCAgICBwYWdpbmF0aW9uID0ge307XG5cdCAgICByZXR1cm4gc2VsZi5zZXR0aW5ncy5maXJzdFVybC5jYWxsKHNlbGYsIHF1ZXJ5KTtcblx0ICB9OyAvLyBkb24ndCBjbGVhciB0aGUgYWN0aXZlIG9wdGlvbiAoYW5kIGNhdXNlIHVud2FudGVkIGRyb3Bkb3duIHNjcm9sbClcblx0ICAvLyB3aGlsZSBsb2FkaW5nIG1vcmUgcmVzdWx0c1xuXG5cblx0ICBzZWxmLmhvb2soJ2luc3RlYWQnLCAnY2xlYXJBY3RpdmVPcHRpb24nLCAoKSA9PiB7XG5cdCAgICBpZiAobG9hZGluZ19tb3JlKSB7XG5cdCAgICAgIHJldHVybjtcblx0ICAgIH1cblxuXHQgICAgcmV0dXJuIG9yaWdfY2xlYXJBY3RpdmVPcHRpb24uY2FsbChzZWxmKTtcblx0ICB9KTsgLy8gb3ZlcnJpZGUgdGhlIGNhbkxvYWQgbWV0aG9kXG5cblx0ICBzZWxmLmhvb2soJ2luc3RlYWQnLCAnY2FuTG9hZCcsIHF1ZXJ5ID0+IHtcblx0ICAgIC8vIGZpcnN0IHRpbWUgdGhlIHF1ZXJ5IGhhcyBiZWVuIHNlZW5cblx0ICAgIGlmICghKHF1ZXJ5IGluIHBhZ2luYXRpb24pKSB7XG5cdCAgICAgIHJldHVybiBvcmlnX2NhbkxvYWQuY2FsbChzZWxmLCBxdWVyeSk7XG5cdCAgICB9XG5cblx0ICAgIHJldHVybiBjYW5Mb2FkTW9yZShxdWVyeSk7XG5cdCAgfSk7IC8vIHdyYXAgdGhlIGxvYWRcblxuXHQgIHNlbGYuaG9vaygnaW5zdGVhZCcsICdsb2FkQ2FsbGJhY2snLCAob3B0aW9ucywgb3B0Z3JvdXBzKSA9PiB7XG5cdCAgICBpZiAoIWxvYWRpbmdfbW9yZSkge1xuXHQgICAgICBzZWxmLmNsZWFyT3B0aW9ucyhjbGVhckZpbHRlcik7XG5cdCAgICB9IGVsc2UgaWYgKGxvYWRfbW9yZV9vcHQpIHtcblx0ICAgICAgY29uc3QgZmlyc3Rfb3B0aW9uID0gb3B0aW9uc1swXTtcblxuXHQgICAgICBpZiAoZmlyc3Rfb3B0aW9uICE9PSB1bmRlZmluZWQpIHtcblx0ICAgICAgICBsb2FkX21vcmVfb3B0LmRhdGFzZXQudmFsdWUgPSBmaXJzdF9vcHRpb25bc2VsZi5zZXR0aW5ncy52YWx1ZUZpZWxkXTtcblx0ICAgICAgfVxuXHQgICAgfVxuXG5cdCAgICBvcmlnX2xvYWRDYWxsYmFjay5jYWxsKHNlbGYsIG9wdGlvbnMsIG9wdGdyb3Vwcyk7XG5cdCAgICBsb2FkaW5nX21vcmUgPSBmYWxzZTtcblx0ICB9KTsgLy8gYWRkIHRlbXBsYXRlcyB0byBkcm9wZG93blxuXHQgIC8vXHRsb2FkaW5nX21vcmUgaWYgd2UgaGF2ZSBhbm90aGVyIHVybCBpbiB0aGUgcXVldWVcblx0ICAvL1x0bm9fbW9yZV9yZXN1bHRzIGlmIHdlIGRvbid0IGhhdmUgYW5vdGhlciB1cmwgaW4gdGhlIHF1ZXVlXG5cblx0ICBzZWxmLmhvb2soJ2FmdGVyJywgJ3JlZnJlc2hPcHRpb25zJywgKCkgPT4ge1xuXHQgICAgY29uc3QgcXVlcnkgPSBzZWxmLmxhc3RWYWx1ZTtcblx0ICAgIHZhciBvcHRpb247XG5cblx0ICAgIGlmIChjYW5Mb2FkTW9yZShxdWVyeSkpIHtcblx0ICAgICAgb3B0aW9uID0gc2VsZi5yZW5kZXIoJ2xvYWRpbmdfbW9yZScsIHtcblx0ICAgICAgICBxdWVyeTogcXVlcnlcblx0ICAgICAgfSk7XG5cblx0ICAgICAgaWYgKG9wdGlvbikge1xuXHQgICAgICAgIG9wdGlvbi5zZXRBdHRyaWJ1dGUoJ2RhdGEtc2VsZWN0YWJsZScsICcnKTsgLy8gc28gdGhhdCBuYXZpZ2F0aW5nIGRyb3Bkb3duIHdpdGggW2Rvd25dIGtleXByZXNzZXMgY2FuIG5hdmlnYXRlIHRvIHRoaXMgbm9kZVxuXG5cdCAgICAgICAgbG9hZF9tb3JlX29wdCA9IG9wdGlvbjtcblx0ICAgICAgfVxuXHQgICAgfSBlbHNlIGlmIChxdWVyeSBpbiBwYWdpbmF0aW9uICYmICFkcm9wZG93bl9jb250ZW50LnF1ZXJ5U2VsZWN0b3IoJy5uby1yZXN1bHRzJykpIHtcblx0ICAgICAgb3B0aW9uID0gc2VsZi5yZW5kZXIoJ25vX21vcmVfcmVzdWx0cycsIHtcblx0ICAgICAgICBxdWVyeTogcXVlcnlcblx0ICAgICAgfSk7XG5cdCAgICB9XG5cblx0ICAgIGlmIChvcHRpb24pIHtcblx0ICAgICAgYWRkQ2xhc3NlcyhvcHRpb24sIHNlbGYuc2V0dGluZ3Mub3B0aW9uQ2xhc3MpO1xuXHQgICAgICBkcm9wZG93bl9jb250ZW50LmFwcGVuZChvcHRpb24pO1xuXHQgICAgfVxuXHQgIH0pOyAvLyBhZGQgc2Nyb2xsIGxpc3RlbmVyIGFuZCBkZWZhdWx0IHRlbXBsYXRlc1xuXG5cdCAgc2VsZi5vbignaW5pdGlhbGl6ZScsICgpID0+IHtcblx0ICAgIGRlZmF1bHRfdmFsdWVzID0gT2JqZWN0LmtleXMoc2VsZi5vcHRpb25zKTtcblx0ICAgIGRyb3Bkb3duX2NvbnRlbnQgPSBzZWxmLmRyb3Bkb3duX2NvbnRlbnQ7IC8vIGRlZmF1bHQgdGVtcGxhdGVzXG5cblx0ICAgIHNlbGYuc2V0dGluZ3MucmVuZGVyID0gT2JqZWN0LmFzc2lnbih7fSwge1xuXHQgICAgICBsb2FkaW5nX21vcmU6ICgpID0+IHtcblx0ICAgICAgICByZXR1cm4gYDxkaXYgY2xhc3M9XCJsb2FkaW5nLW1vcmUtcmVzdWx0c1wiPkxvYWRpbmcgbW9yZSByZXN1bHRzIC4uLiA8L2Rpdj5gO1xuXHQgICAgICB9LFxuXHQgICAgICBub19tb3JlX3Jlc3VsdHM6ICgpID0+IHtcblx0ICAgICAgICByZXR1cm4gYDxkaXYgY2xhc3M9XCJuby1tb3JlLXJlc3VsdHNcIj5ObyBtb3JlIHJlc3VsdHM8L2Rpdj5gO1xuXHQgICAgICB9XG5cdCAgICB9LCBzZWxmLnNldHRpbmdzLnJlbmRlcik7IC8vIHdhdGNoIGRyb3Bkb3duIGNvbnRlbnQgc2Nyb2xsIHBvc2l0aW9uXG5cblx0ICAgIGRyb3Bkb3duX2NvbnRlbnQuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgKCkgPT4ge1xuXHQgICAgICBpZiAoIXNlbGYuc2V0dGluZ3Muc2hvdWxkTG9hZE1vcmUuY2FsbChzZWxmKSkge1xuXHQgICAgICAgIHJldHVybjtcblx0ICAgICAgfSAvLyAhaW1wb3J0YW50OiB0aGlzIHdpbGwgZ2V0IGNoZWNrZWQgYWdhaW4gaW4gbG9hZCgpIGJ1dCB3ZSBzdGlsbCBuZWVkIHRvIGNoZWNrIGhlcmUgb3RoZXJ3aXNlIGxvYWRpbmdfbW9yZSB3aWxsIGJlIHNldCB0byB0cnVlXG5cblxuXHQgICAgICBpZiAoIWNhbkxvYWRNb3JlKHNlbGYubGFzdFZhbHVlKSkge1xuXHQgICAgICAgIHJldHVybjtcblx0ICAgICAgfSAvLyBkb24ndCBjYWxsIGxvYWQoKSB0b28gbXVjaFxuXG5cblx0ICAgICAgaWYgKGxvYWRpbmdfbW9yZSkgcmV0dXJuO1xuXHQgICAgICBsb2FkaW5nX21vcmUgPSB0cnVlO1xuXHQgICAgICBzZWxmLmxvYWQuY2FsbChzZWxmLCBzZWxmLmxhc3RWYWx1ZSk7XG5cdCAgICB9KTtcblx0ICB9KTtcblx0fVxuXG5cdFRvbVNlbGVjdC5kZWZpbmUoJ2NoYW5nZV9saXN0ZW5lcicsIGNoYW5nZV9saXN0ZW5lcik7XG5cdFRvbVNlbGVjdC5kZWZpbmUoJ2NoZWNrYm94X29wdGlvbnMnLCBjaGVja2JveF9vcHRpb25zKTtcblx0VG9tU2VsZWN0LmRlZmluZSgnY2xlYXJfYnV0dG9uJywgY2xlYXJfYnV0dG9uKTtcblx0VG9tU2VsZWN0LmRlZmluZSgnZHJhZ19kcm9wJywgZHJhZ19kcm9wKTtcblx0VG9tU2VsZWN0LmRlZmluZSgnZHJvcGRvd25faGVhZGVyJywgZHJvcGRvd25faGVhZGVyKTtcblx0VG9tU2VsZWN0LmRlZmluZSgnY2FyZXRfcG9zaXRpb24nLCBjYXJldF9wb3NpdGlvbik7XG5cdFRvbVNlbGVjdC5kZWZpbmUoJ2Ryb3Bkb3duX2lucHV0JywgZHJvcGRvd25faW5wdXQpO1xuXHRUb21TZWxlY3QuZGVmaW5lKCdpbnB1dF9hdXRvZ3JvdycsIGlucHV0X2F1dG9ncm93KTtcblx0VG9tU2VsZWN0LmRlZmluZSgnbm9fYmFja3NwYWNlX2RlbGV0ZScsIG5vX2JhY2tzcGFjZV9kZWxldGUpO1xuXHRUb21TZWxlY3QuZGVmaW5lKCdub19hY3RpdmVfaXRlbXMnLCBub19hY3RpdmVfaXRlbXMpO1xuXHRUb21TZWxlY3QuZGVmaW5lKCdvcHRncm91cF9jb2x1bW5zJywgb3B0Z3JvdXBfY29sdW1ucyk7XG5cdFRvbVNlbGVjdC5kZWZpbmUoJ3JlbW92ZV9idXR0b24nLCByZW1vdmVfYnV0dG9uKTtcblx0VG9tU2VsZWN0LmRlZmluZSgncmVzdG9yZV9vbl9iYWNrc3BhY2UnLCByZXN0b3JlX29uX2JhY2tzcGFjZSk7XG5cdFRvbVNlbGVjdC5kZWZpbmUoJ3ZpcnR1YWxfc2Nyb2xsJywgdmlydHVhbF9zY3JvbGwpO1xuXG5cdHJldHVybiBUb21TZWxlY3Q7XG5cbn0pKTtcbnZhciB0b21TZWxlY3Q9ZnVuY3Rpb24oZWwsb3B0cyl7cmV0dXJuIG5ldyBUb21TZWxlY3QoZWwsb3B0cyk7fSBcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRvbS1zZWxlY3QuY29tcGxldGUuanMubWFwXG4iLCJpbXBvcnQgVG9tU2VsZWN0IGZyb20gXCJ0b20tc2VsZWN0XCJcclxuaW1wb3J0IHsgVG9tSW5wdXQgfSBmcm9tIFwidG9tLXNlbGVjdC9kaXN0L3R5cGVzL3R5cGVzXCI7XHJcblxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xyXG4gICAgLy8udG9tLXNlbGVjdOOBjOOBguOCjOOBsFRvbVNlbGVjdOimgee0oCjjgrPjg7Pjg5zjg5zjg4Pjgq/jgrkp44Gr572u44GN5o+b44GI44KLXHJcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudG9tLXNlbGVjdCcpLmZvckVhY2goKGVsKSA9PiB7XHJcbiAgICAgICAgbmV3IFRvbVNlbGVjdChlbCBhcyBUb21JbnB1dCwge30pO1xyXG4gICAgfSk7XHJcbn0pO1xyXG5cclxuZXhwb3J0IGNsYXNzIGNvbW1vbiB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLnJlcGxhY2VUb21TZWxlY3QoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIC50b20tc2VsZWN044Gu6KaB57Sg44KSVG9tU2VsZWN06KaB57SgKOOCs+ODs+ODnOODnOODg+OCr+OCuSnjgavnva7jgY3mj5vjgYjjgotcclxuICAgICAqICovXHJcbiAgICByZXBsYWNlVG9tU2VsZWN0KCkge1xyXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIC8vLnRvbS1zZWxlY3TjgYzjgYLjgozjgbBUb21TZWxlY3TopoHntKAo44Kz44Oz44Oc44Oc44OD44Kv44K5KeOBq+e9ruOBjeaPm+OBiOOCi1xyXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudG9tLXNlbGVjdCcpLmZvckVhY2goKGVsKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBuZXcgVG9tU2VsZWN0KGVsIGFzIFRvbUlucHV0LCB7fSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIFxyXG59OyIsImltcG9ydCB7IFNwaW5uZXIgfSBmcm9tICdzcGluLmpzJztcclxuaW1wb3J0IGF4aW9zIGZyb20gJ2F4aW9zJztcclxuaW1wb3J0IFN3YWwgZnJvbSAnc3dlZXRhbGVydDInO1xyXG5cclxudmFyIG9wdHMgPSB7XHJcbiAgICBsaW5lczogMTMgLy8gVGhlIG51bWJlciBvZiBsaW5lcyB0byBkcmF3XHJcbiAgICAsIGxlbmd0aDogMjggLy8gVGhlIGxlbmd0aCBvZiBlYWNoIGxpbmVcclxuICAgICwgd2lkdGg6IDE0IC8vIFRoZSBsaW5lIHRoaWNrbmVzc1xyXG4gICAgLCByYWRpdXM6IDQyIC8vIFRoZSByYWRpdXMgb2YgdGhlIGlubmVyIGNpcmNsZVxyXG4gICAgLCBzY2FsZTogMSAvLyBTY2FsZXMgb3ZlcmFsbCBzaXplIG9mIHRoZSBzcGlubmVyXHJcbiAgICAsIGNvcm5lcnM6IDEgLy8gQ29ybmVyIHJvdW5kbmVzcyAoMC4uMSlcclxuICAgICwgY29sb3I6ICcjMDAwJyAvLyAjcmdiIG9yICNycmdnYmIgb3IgYXJyYXkgb2YgY29sb3JzXHJcbiAgICAsIG9wYWNpdHk6IDAuMjUgLy8gT3BhY2l0eSBvZiB0aGUgbGluZXNcclxuICAgICwgcm90YXRlOiAwIC8vIFRoZSByb3RhdGlvbiBvZmZzZXRcclxuICAgICwgZGlyZWN0aW9uOiAxIC8vIDE6IGNsb2Nrd2lzZSwgLTE6IGNvdW50ZXJjbG9ja3dpc2VcclxuICAgICwgc3BlZWQ6IDEgLy8gUm91bmRzIHBlciBzZWNvbmRcclxuICAgICwgdHJhaWw6IDYwIC8vIEFmdGVyZ2xvdyBwZXJjZW50YWdlXHJcbiAgICAsIGZwczogMjAgLy8gRnJhbWVzIHBlciBzZWNvbmQgd2hlbiB1c2luZyBzZXRUaW1lb3V0KCkgYXMgYSBmYWxsYmFjayBmb3IgQ1NTXHJcbiAgICAsIHpJbmRleDogMmU5IC8vIFRoZSB6LWluZGV4IChkZWZhdWx0cyB0byAyMDAwMDAwMDAwKVxyXG4gICAgLCBjbGFzc05hbWU6ICdzcGlubmVyJyAvLyBUaGUgQ1NTIGNsYXNzIHRvIGFzc2lnbiB0byB0aGUgc3Bpbm5lclxyXG4gICAgLCB0b3A6ICc1MCUnIC8vIFRvcCBwb3NpdGlvbiByZWxhdGl2ZSB0byBwYXJlbnRcclxuICAgICwgbGVmdDogJzUwJScgLy8gTGVmdCBwb3NpdGlvbiByZWxhdGl2ZSB0byBwYXJlbnRcclxuICAgICwgc2hhZG93OiBmYWxzZSAvLyBXaGV0aGVyIHRvIHJlbmRlciBhIHNoYWRvd1xyXG4gICAgLCBod2FjY2VsOiBmYWxzZSAvLyBXaGV0aGVyIHRvIHVzZSBoYXJkd2FyZSBhY2NlbGVyYXRpb25cclxuICAgICwgcG9zaXRpb246ICdhYnNvbHV0ZScgLy8gRWxlbWVudCBwb3NpdGlvbmluZ1xyXG59O1xyXG4vL+aPj+eUu+WFiOOBruimquimgee0oFxyXG52YXIgc3Bpbl90YXJnZXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3Bpbi1hcmVhJyk7XHJcbi8v44K544OU44OK44O844Kq44OW44K444Kn44Kv44OIXHJcbnZhciBzcGlubmVyID0gbmV3IFNwaW5uZXIob3B0cykuc3BpbigpO1xyXG5cclxudmFyIHNwaW5uZXJMYXllciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsYXllcicpO1xyXG5pZiAoc3Bpbl90YXJnZXQgIT0gbnVsbCAmJiBzcGlubmVyTGF5ZXIgIT0gbnVsbCAmJiBzcGlubmVyLmVsKSB7XHJcbiAgICBzcGlubmVyTGF5ZXIuaGlkZGVuID0gdHJ1ZTtcclxuICAgIHNwaW5fdGFyZ2V0LmhpZGRlbiA9IHRydWU7XHJcbiAgICBzcGlubmVyLnNwaW4oc3Bpbl90YXJnZXQpO1xyXG4gICAgc3Bpbl90YXJnZXQuYXBwZW5kQ2hpbGQ8SFRNTEVsZW1lbnQ+KHNwaW5uZXIuZWwpO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3Qgc3Bpbm5lclV0aWwgPSB7XHJcblxyXG4gICAgc3RhcnRTcGlubmVyIDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGxldCBhbGxJbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0Jyk7XHJcbiAgICAgICAgYWxsSW5wdXQuZm9yRWFjaChpbnB1dEVsZW1lbnQgPT4ge1xyXG4gICAgICAgICAgICBpbnB1dEVsZW1lbnQuZGlzYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGlmIChzcGluX3RhcmdldCAhPSBudWxsICYmIHNwaW5uZXJMYXllciAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHNwaW5uZXIuc3RvcDtcclxuICAgICAgICAgICAgc3Bpbm5lci5zcGluKHNwaW5fdGFyZ2V0KTtcclxuICAgICAgICAgICAgc3Bpbm5lckxheWVyLmhpZGRlbiA9IGZhbHNlO1xyXG4gICAgICAgICAgICBzcGluX3RhcmdldC5oaWRkZW4gPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIHN0b3BTcGlubmVyIDpmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgbGV0IGFsbElucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnaW5wdXQnKTtcclxuICAgICAgICBhbGxJbnB1dC5mb3JFYWNoKGlucHV0RWxlbWVudCA9PiB7XHJcbiAgICAgICAgICAgIGlucHV0RWxlbWVudC5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGlmIChzcGluX3RhcmdldCAhPSBudWxsICYmIHNwaW5uZXJMYXllciAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHNwaW5uZXIuc3RvcDtcclxuICAgICAgICAgICAgc3Bpbm5lckxheWVyLmhpZGRlbiA9IHRydWU7XHJcbiAgICAgICAgICAgIHNwaW5fdGFyZ2V0LmhpZGRlbiA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufTtcclxuIiwidmFyIF9fYXNzaWduID0gKHRoaXMgJiYgdGhpcy5fX2Fzc2lnbikgfHwgZnVuY3Rpb24gKCkge1xyXG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uKHQpIHtcclxuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcclxuICAgICAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKVxyXG4gICAgICAgICAgICAgICAgdFtwXSA9IHNbcF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0O1xyXG4gICAgfTtcclxuICAgIHJldHVybiBfX2Fzc2lnbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG59O1xyXG52YXIgZGVmYXVsdHMgPSB7XHJcbiAgICBsaW5lczogMTIsXHJcbiAgICBsZW5ndGg6IDcsXHJcbiAgICB3aWR0aDogNSxcclxuICAgIHJhZGl1czogMTAsXHJcbiAgICBzY2FsZTogMS4wLFxyXG4gICAgY29ybmVyczogMSxcclxuICAgIGNvbG9yOiAnIzAwMCcsXHJcbiAgICBmYWRlQ29sb3I6ICd0cmFuc3BhcmVudCcsXHJcbiAgICBhbmltYXRpb246ICdzcGlubmVyLWxpbmUtZmFkZS1kZWZhdWx0JyxcclxuICAgIHJvdGF0ZTogMCxcclxuICAgIGRpcmVjdGlvbjogMSxcclxuICAgIHNwZWVkOiAxLFxyXG4gICAgekluZGV4OiAyZTksXHJcbiAgICBjbGFzc05hbWU6ICdzcGlubmVyJyxcclxuICAgIHRvcDogJzUwJScsXHJcbiAgICBsZWZ0OiAnNTAlJyxcclxuICAgIHNoYWRvdzogJzAgMCAxcHggdHJhbnNwYXJlbnQnLFxyXG4gICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXHJcbn07XHJcbnZhciBTcGlubmVyID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gU3Bpbm5lcihvcHRzKSB7XHJcbiAgICAgICAgaWYgKG9wdHMgPT09IHZvaWQgMCkgeyBvcHRzID0ge307IH1cclxuICAgICAgICB0aGlzLm9wdHMgPSBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgZGVmYXVsdHMpLCBvcHRzKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogQWRkcyB0aGUgc3Bpbm5lciB0byB0aGUgZ2l2ZW4gdGFyZ2V0IGVsZW1lbnQuIElmIHRoaXMgaW5zdGFuY2UgaXMgYWxyZWFkeVxyXG4gICAgICogc3Bpbm5pbmcsIGl0IGlzIGF1dG9tYXRpY2FsbHkgcmVtb3ZlZCBmcm9tIGl0cyBwcmV2aW91cyB0YXJnZXQgYnkgY2FsbGluZ1xyXG4gICAgICogc3RvcCgpIGludGVybmFsbHkuXHJcbiAgICAgKi9cclxuICAgIFNwaW5uZXIucHJvdG90eXBlLnNwaW4gPSBmdW5jdGlvbiAodGFyZ2V0KSB7XHJcbiAgICAgICAgdGhpcy5zdG9wKCk7XHJcbiAgICAgICAgdGhpcy5lbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHRoaXMuZWwuY2xhc3NOYW1lID0gdGhpcy5vcHRzLmNsYXNzTmFtZTtcclxuICAgICAgICB0aGlzLmVsLnNldEF0dHJpYnV0ZSgncm9sZScsICdwcm9ncmVzc2JhcicpO1xyXG4gICAgICAgIGNzcyh0aGlzLmVsLCB7XHJcbiAgICAgICAgICAgIHBvc2l0aW9uOiB0aGlzLm9wdHMucG9zaXRpb24sXHJcbiAgICAgICAgICAgIHdpZHRoOiAwLFxyXG4gICAgICAgICAgICB6SW5kZXg6IHRoaXMub3B0cy56SW5kZXgsXHJcbiAgICAgICAgICAgIGxlZnQ6IHRoaXMub3B0cy5sZWZ0LFxyXG4gICAgICAgICAgICB0b3A6IHRoaXMub3B0cy50b3AsXHJcbiAgICAgICAgICAgIHRyYW5zZm9ybTogXCJzY2FsZShcIiArIHRoaXMub3B0cy5zY2FsZSArIFwiKVwiLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGlmICh0YXJnZXQpIHtcclxuICAgICAgICAgICAgdGFyZ2V0Lmluc2VydEJlZm9yZSh0aGlzLmVsLCB0YXJnZXQuZmlyc3RDaGlsZCB8fCBudWxsKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZHJhd0xpbmVzKHRoaXMuZWwsIHRoaXMub3B0cyk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBTdG9wcyBhbmQgcmVtb3ZlcyB0aGUgU3Bpbm5lci5cclxuICAgICAqIFN0b3BwZWQgc3Bpbm5lcnMgbWF5IGJlIHJldXNlZCBieSBjYWxsaW5nIHNwaW4oKSBhZ2Fpbi5cclxuICAgICAqL1xyXG4gICAgU3Bpbm5lci5wcm90b3R5cGUuc3RvcCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAodGhpcy5lbCkge1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHJlcXVlc3RBbmltYXRpb25GcmFtZSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMuYW5pbWF0ZUlkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLmFuaW1hdGVJZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuZWwucGFyZW50Tm9kZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMuZWwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuZWwgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBTcGlubmVyO1xyXG59KCkpO1xyXG5leHBvcnQgeyBTcGlubmVyIH07XHJcbi8qKlxyXG4gKiBTZXRzIG11bHRpcGxlIHN0eWxlIHByb3BlcnRpZXMgYXQgb25jZS5cclxuICovXHJcbmZ1bmN0aW9uIGNzcyhlbCwgcHJvcHMpIHtcclxuICAgIGZvciAodmFyIHByb3AgaW4gcHJvcHMpIHtcclxuICAgICAgICBlbC5zdHlsZVtwcm9wXSA9IHByb3BzW3Byb3BdO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGVsO1xyXG59XHJcbi8qKlxyXG4gKiBSZXR1cm5zIHRoZSBsaW5lIGNvbG9yIGZyb20gdGhlIGdpdmVuIHN0cmluZyBvciBhcnJheS5cclxuICovXHJcbmZ1bmN0aW9uIGdldENvbG9yKGNvbG9yLCBpZHgpIHtcclxuICAgIHJldHVybiB0eXBlb2YgY29sb3IgPT0gJ3N0cmluZycgPyBjb2xvciA6IGNvbG9yW2lkeCAlIGNvbG9yLmxlbmd0aF07XHJcbn1cclxuLyoqXHJcbiAqIEludGVybmFsIG1ldGhvZCB0aGF0IGRyYXdzIHRoZSBpbmRpdmlkdWFsIGxpbmVzLlxyXG4gKi9cclxuZnVuY3Rpb24gZHJhd0xpbmVzKGVsLCBvcHRzKSB7XHJcbiAgICB2YXIgYm9yZGVyUmFkaXVzID0gKE1hdGgucm91bmQob3B0cy5jb3JuZXJzICogb3B0cy53aWR0aCAqIDUwMCkgLyAxMDAwKSArICdweCc7XHJcbiAgICB2YXIgc2hhZG93ID0gJ25vbmUnO1xyXG4gICAgaWYgKG9wdHMuc2hhZG93ID09PSB0cnVlKSB7XHJcbiAgICAgICAgc2hhZG93ID0gJzAgMnB4IDRweCAjMDAwJzsgLy8gZGVmYXVsdCBzaGFkb3dcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHR5cGVvZiBvcHRzLnNoYWRvdyA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICBzaGFkb3cgPSBvcHRzLnNoYWRvdztcclxuICAgIH1cclxuICAgIHZhciBzaGFkb3dzID0gcGFyc2VCb3hTaGFkb3coc2hhZG93KTtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgb3B0cy5saW5lczsgaSsrKSB7XHJcbiAgICAgICAgdmFyIGRlZ3JlZXMgPSB+figzNjAgLyBvcHRzLmxpbmVzICogaSArIG9wdHMucm90YXRlKTtcclxuICAgICAgICB2YXIgYmFja2dyb3VuZExpbmUgPSBjc3MoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksIHtcclxuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXHJcbiAgICAgICAgICAgIHRvcDogLW9wdHMud2lkdGggLyAyICsgXCJweFwiLFxyXG4gICAgICAgICAgICB3aWR0aDogKG9wdHMubGVuZ3RoICsgb3B0cy53aWR0aCkgKyAncHgnLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IG9wdHMud2lkdGggKyAncHgnLFxyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiBnZXRDb2xvcihvcHRzLmZhZGVDb2xvciwgaSksXHJcbiAgICAgICAgICAgIGJvcmRlclJhZGl1czogYm9yZGVyUmFkaXVzLFxyXG4gICAgICAgICAgICB0cmFuc2Zvcm1PcmlnaW46ICdsZWZ0JyxcclxuICAgICAgICAgICAgdHJhbnNmb3JtOiBcInJvdGF0ZShcIiArIGRlZ3JlZXMgKyBcImRlZykgdHJhbnNsYXRlWChcIiArIG9wdHMucmFkaXVzICsgXCJweClcIixcclxuICAgICAgICB9KTtcclxuICAgICAgICB2YXIgZGVsYXkgPSBpICogb3B0cy5kaXJlY3Rpb24gLyBvcHRzLmxpbmVzIC8gb3B0cy5zcGVlZDtcclxuICAgICAgICBkZWxheSAtPSAxIC8gb3B0cy5zcGVlZDsgLy8gc28gaW5pdGlhbCBhbmltYXRpb24gc3RhdGUgd2lsbCBpbmNsdWRlIHRyYWlsXHJcbiAgICAgICAgdmFyIGxpbmUgPSBjc3MoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksIHtcclxuICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcclxuICAgICAgICAgICAgaGVpZ2h0OiAnMTAwJScsXHJcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IGdldENvbG9yKG9wdHMuY29sb3IsIGkpLFxyXG4gICAgICAgICAgICBib3JkZXJSYWRpdXM6IGJvcmRlclJhZGl1cyxcclxuICAgICAgICAgICAgYm94U2hhZG93OiBub3JtYWxpemVTaGFkb3coc2hhZG93cywgZGVncmVlcyksXHJcbiAgICAgICAgICAgIGFuaW1hdGlvbjogMSAvIG9wdHMuc3BlZWQgKyBcInMgbGluZWFyIFwiICsgZGVsYXkgKyBcInMgaW5maW5pdGUgXCIgKyBvcHRzLmFuaW1hdGlvbixcclxuICAgICAgICB9KTtcclxuICAgICAgICBiYWNrZ3JvdW5kTGluZS5hcHBlbmRDaGlsZChsaW5lKTtcclxuICAgICAgICBlbC5hcHBlbmRDaGlsZChiYWNrZ3JvdW5kTGluZSk7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gcGFyc2VCb3hTaGFkb3coYm94U2hhZG93KSB7XHJcbiAgICB2YXIgcmVnZXggPSAvXlxccyooW2EtekEtWl0rXFxzKyk/KC0/XFxkKyhcXC5cXGQrKT8pKFthLXpBLVpdKilcXHMrKC0/XFxkKyhcXC5cXGQrKT8pKFthLXpBLVpdKikoLiopJC87XHJcbiAgICB2YXIgc2hhZG93cyA9IFtdO1xyXG4gICAgZm9yICh2YXIgX2kgPSAwLCBfYSA9IGJveFNoYWRvdy5zcGxpdCgnLCcpOyBfaSA8IF9hLmxlbmd0aDsgX2krKykge1xyXG4gICAgICAgIHZhciBzaGFkb3cgPSBfYVtfaV07XHJcbiAgICAgICAgdmFyIG1hdGNoZXMgPSBzaGFkb3cubWF0Y2gocmVnZXgpO1xyXG4gICAgICAgIGlmIChtYXRjaGVzID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGNvbnRpbnVlOyAvLyBpbnZhbGlkIHN5bnRheFxyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgeCA9ICttYXRjaGVzWzJdO1xyXG4gICAgICAgIHZhciB5ID0gK21hdGNoZXNbNV07XHJcbiAgICAgICAgdmFyIHhVbml0cyA9IG1hdGNoZXNbNF07XHJcbiAgICAgICAgdmFyIHlVbml0cyA9IG1hdGNoZXNbN107XHJcbiAgICAgICAgaWYgKHggPT09IDAgJiYgIXhVbml0cykge1xyXG4gICAgICAgICAgICB4VW5pdHMgPSB5VW5pdHM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh5ID09PSAwICYmICF5VW5pdHMpIHtcclxuICAgICAgICAgICAgeVVuaXRzID0geFVuaXRzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoeFVuaXRzICE9PSB5VW5pdHMpIHtcclxuICAgICAgICAgICAgY29udGludWU7IC8vIHVuaXRzIG11c3QgbWF0Y2ggdG8gdXNlIGFzIGNvb3JkaW5hdGVzXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHNoYWRvd3MucHVzaCh7XHJcbiAgICAgICAgICAgIHByZWZpeDogbWF0Y2hlc1sxXSB8fCAnJyxcclxuICAgICAgICAgICAgeDogeCxcclxuICAgICAgICAgICAgeTogeSxcclxuICAgICAgICAgICAgeFVuaXRzOiB4VW5pdHMsXHJcbiAgICAgICAgICAgIHlVbml0czogeVVuaXRzLFxyXG4gICAgICAgICAgICBlbmQ6IG1hdGNoZXNbOF0sXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gc2hhZG93cztcclxufVxyXG4vKipcclxuICogTW9kaWZ5IGJveC1zaGFkb3cgeC95IG9mZnNldHMgdG8gY291bnRlcmFjdCByb3RhdGlvblxyXG4gKi9cclxuZnVuY3Rpb24gbm9ybWFsaXplU2hhZG93KHNoYWRvd3MsIGRlZ3JlZXMpIHtcclxuICAgIHZhciBub3JtYWxpemVkID0gW107XHJcbiAgICBmb3IgKHZhciBfaSA9IDAsIHNoYWRvd3NfMSA9IHNoYWRvd3M7IF9pIDwgc2hhZG93c18xLmxlbmd0aDsgX2krKykge1xyXG4gICAgICAgIHZhciBzaGFkb3cgPSBzaGFkb3dzXzFbX2ldO1xyXG4gICAgICAgIHZhciB4eSA9IGNvbnZlcnRPZmZzZXQoc2hhZG93LngsIHNoYWRvdy55LCBkZWdyZWVzKTtcclxuICAgICAgICBub3JtYWxpemVkLnB1c2goc2hhZG93LnByZWZpeCArIHh5WzBdICsgc2hhZG93LnhVbml0cyArICcgJyArIHh5WzFdICsgc2hhZG93LnlVbml0cyArIHNoYWRvdy5lbmQpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG5vcm1hbGl6ZWQuam9pbignLCAnKTtcclxufVxyXG5mdW5jdGlvbiBjb252ZXJ0T2Zmc2V0KHgsIHksIGRlZ3JlZXMpIHtcclxuICAgIHZhciByYWRpYW5zID0gZGVncmVlcyAqIE1hdGguUEkgLyAxODA7XHJcbiAgICB2YXIgc2luID0gTWF0aC5zaW4ocmFkaWFucyk7XHJcbiAgICB2YXIgY29zID0gTWF0aC5jb3MocmFkaWFucyk7XHJcbiAgICByZXR1cm4gW1xyXG4gICAgICAgIE1hdGgucm91bmQoKHggKiBjb3MgKyB5ICogc2luKSAqIDEwMDApIC8gMTAwMCxcclxuICAgICAgICBNYXRoLnJvdW5kKCgteCAqIHNpbiArIHkgKiBjb3MpICogMTAwMCkgLyAxMDAwLFxyXG4gICAgXTtcclxufVxyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgc3Bpbm5lclV0aWwgfSBmcm9tICcuLi9jb21tb24vc3Bpbm5lclV0aWwnO1xyXG5pbXBvcnQgeyBjb21tb24gfSBmcm9tICcuLi9jb21tb24vZGlzcF9jb21tb24nO1xyXG5pbXBvcnQgYXhpb3MgZnJvbSAnYXhpb3MnO1xyXG5pbXBvcnQgU3dhbCBmcm9tICdzd2VldGFsZXJ0Mic7XHJcblxyXG5uZXcgY29tbW9uKCk7XHJcblxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xyXG5cclxuICAgIGxldCBzeW5jQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Vudl9zeW5jX2J0bicpO1xyXG4gICAgc3luY0J0bj8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoZXYpID0+IHtcclxuICAgICAgICBzcGlubmVyVXRpbC5zdGFydFNwaW5uZXIoKTtcclxuXHJcbiAgICAgICAgbGV0IGVudlN5bmNVcmwgPSAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2Vudl9zeW5jX3VybCcpIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlO1xyXG5cclxuICAgICAgICBhd2FpdCBheGlvcy5nZXQoZW52U3luY1VybCwge1xyXG4gICAgICAgICAgICAnaGVhZGVycyc6IHtcclxuICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pLnRoZW4oKHJlc3ApID0+IHtcclxuICAgICAgICAgICAgc3Bpbm5lclV0aWwuc3RvcFNwaW5uZXIoKTtcclxuICAgICAgICAgICAgLy8g5oiQ5Yqf44Gu5Yem55CGXHJcbiAgICAgICAgICAgIFN3YWwuZmlyZSh7XHJcbiAgICAgICAgICAgICAgICBpY29uOiAnc3VjY2VzcycsXHJcbiAgICAgICAgICAgICAgICB0aXRsZTogJ+aIkOWKnydcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XHJcbiAgICAgICAgICAgIHNwaW5uZXJVdGlsLnN0b3BTcGlubmVyKCk7XHJcblxyXG4gICAgICAgICAgICBsZXQgZXJyb3JNc2cgPSBlcnIucmVzcG9uc2UuZGF0YS5wYXJhbVswXSBhcyBTdHJpbmc7XHJcbiAgICAgICAgICAgIHZhciBlcnJvckRldGFpbHMgPSBlcnJvck1zZy5zcGxpdCgne1wiY29kZVwiJyk7XHJcbiAgICAgICAgICAgIGlmIChlcnJvckRldGFpbHMubGVuZ3RoID49IDIpIHtcclxuICAgICAgICAgICAgICAgIFN3YWwuZmlyZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgaWNvbjogJ2Vycm9yJyxcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ+OCqOODqeODvCcsXHJcbiAgICAgICAgICAgICAgICAgICAgaHRtbDogJ3tcImNvZGVcIicgKyBlcnJvckRldGFpbHNbMV1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgU3dhbC5maXJlKHtcclxuICAgICAgICAgICAgICAgICAgICBpY29uOiAnZXJyb3InLFxyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAn44Ko44Op44O8JyxcclxuICAgICAgICAgICAgICAgICAgICBodG1sOiBlcnJvck1zZ1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9KTtcclxufSk7Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9