(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * @preserve jquery-param (c) 2015 KNOWLEDGECODE | MIT
 */
/*global define */
(function (global) {
    'use strict';

    var param = function (a) {
        var add = function (s, k, v) {
            v = typeof v === 'function' ? v() : v === null ? '' : v === undefined ? '' : v;
            s[s.length] = encodeURIComponent(k) + '=' + encodeURIComponent(v);
        }, buildParams = function (prefix, obj, s) {
            var i, len, key;

            if (Object.prototype.toString.call(obj) === '[object Array]') {
                for (i = 0, len = obj.length; i < len; i++) {
                    buildParams(prefix + '[' + (typeof obj[i] === 'object' ? i : '') + ']', obj[i], s);
                }
            } else if (obj && obj.toString() === '[object Object]') {
                for (key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        if (prefix) {
                            buildParams(prefix + '[' + key + ']', obj[key], s, add);
                        } else {
                            buildParams(key, obj[key], s, add);
                        }
                    }
                }
            } else if (prefix) {
                add(s, prefix, obj);
            } else {
                for (key in obj) {
                    add(s, key, obj[key]);
                }
            }
            return s;
        };
        return buildParams('', a, []).join('&').replace(/%20/g, '+');
    };

    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = param;
    } else if (typeof define === 'function' && define.amd) {
        define([], function () {
            return param;
        });
    } else {
        global.param = param;
    }

}(this));

},{}],2:[function(require,module,exports){
(function (process){
/*
 * PinkySwear.js 2.2.2 - Minimalistic implementation of the Promises/A+ spec
 * 
 * Public Domain. Use, modify and distribute it any way you like. No attribution required.
 *
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 *
 * PinkySwear is a very small implementation of the Promises/A+ specification. After compilation with the
 * Google Closure Compiler and gzipping it weighs less than 500 bytes. It is based on the implementation for 
 * Minified.js and should be perfect for embedding. 
 *
 *
 * PinkySwear has just three functions.
 *
 * To create a new promise in pending state, call pinkySwear():
 *         var promise = pinkySwear();
 *
 * The returned object has a Promises/A+ compatible then() implementation:
 *          promise.then(function(value) { alert("Success!"); }, function(value) { alert("Failure!"); });
 *
 *
 * The promise returned by pinkySwear() is a function. To fulfill the promise, call the function with true as first argument and
 * an optional array of values to pass to the then() handler. By putting more than one value in the array, you can pass more than one
 * value to the then() handlers. Here an example to fulfill a promsise, this time with only one argument: 
 *         promise(true, [42]);
 *
 * When the promise has been rejected, call it with false. Again, there may be more than one argument for the then() handler:
 *         promise(true, [6, 6, 6]);
 *         
 * You can obtain the promise's current state by calling the function without arguments. It will be true if fulfilled,
 * false if rejected, and otherwise undefined.
 * 		   var state = promise(); 
 * 
 * https://github.com/timjansen/PinkySwear.js
 */
(function(target) {
	var undef;

	function isFunction(f) {
		return typeof f == 'function';
	}
	function isObject(f) {
		return typeof f == 'object';
	}
	function defer(callback) {
		if (typeof setImmediate != 'undefined')
			setImmediate(callback);
		else if (typeof process != 'undefined' && process['nextTick'])
			process['nextTick'](callback);
		else
			setTimeout(callback, 0);
	}

	target[0][target[1]] = function pinkySwear(extend) {
		var state;           // undefined/null = pending, true = fulfilled, false = rejected
		var values = [];     // an array of values as arguments for the then() handlers
		var deferred = [];   // functions to call when set() is invoked

		var set = function(newState, newValues) {
			if (state == null && newState != null) {
				state = newState;
				values = newValues;
				if (deferred.length)
					defer(function() {
						for (var i = 0; i < deferred.length; i++)
							deferred[i]();
					});
			}
			return state;
		};

		set['then'] = function (onFulfilled, onRejected) {
			var promise2 = pinkySwear(extend);
			var callCallbacks = function() {
	    		try {
	    			var f = (state ? onFulfilled : onRejected);
	    			if (isFunction(f)) {
		   				function resolve(x) {
						    var then, cbCalled = 0;
		   					try {
				   				if (x && (isObject(x) || isFunction(x)) && isFunction(then = x['then'])) {
										if (x === promise2)
											throw new TypeError();
										then['call'](x,
											function() { if (!cbCalled++) resolve.apply(undef,arguments); } ,
											function(value){ if (!cbCalled++) promise2(false,[value]);});
				   				}
				   				else
				   					promise2(true, arguments);
		   					}
		   					catch(e) {
		   						if (!cbCalled++)
		   							promise2(false, [e]);
		   					}
		   				}
		   				resolve(f.apply(undef, values || []));
		   			}
		   			else
		   				promise2(state, values);
				}
				catch (e) {
					promise2(false, [e]);
				}
			};
			if (state != null)
				defer(callCallbacks);
			else
				deferred.push(callCallbacks);
			return promise2;
		};
        if(extend){
            set = extend(set);
        }
		return set;
	};
})(typeof module == 'undefined' ? [window, 'pinkySwear'] : [module, 'exports']);


}).call(this,require('_process'))

},{"_process":3}],3:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],4:[function(require,module,exports){
/*! qwest 4.4.5 (https://github.com/pyrsmk/qwest) */

module.exports = function() {

	var global = typeof window != 'undefined' ? window : self,
		pinkyswear = require('pinkyswear'),
		jparam = require('jquery-param'),
		defaultOptions = {},
		// Default response type for XDR in auto mode
		defaultXdrResponseType = 'json',
		// Default data type
		defaultDataType = 'post',
		// Variables for limit mechanism
		limit = null,
		requests = 0,
		request_stack = [],
		// Get XMLHttpRequest object
		getXHR = global.XMLHttpRequest? function(){
			return new global.XMLHttpRequest();
		}: function(){
			return new ActiveXObject('Microsoft.XMLHTTP');
		},
		// Guess XHR version
		xhr2 = (getXHR().responseType===''),

	// Core function
	qwest = function(method, url, data, options, before) {
		// Format
		method = method.toUpperCase();
		data = data || null;
		options = options || {};
		for(var name in defaultOptions) {
			if(!(name in options)) {
				if(typeof defaultOptions[name] == 'object' && typeof options[name] == 'object') {
					for(var name2 in defaultOptions[name]) {
						options[name][name2] = defaultOptions[name][name2];
					}
				}
				else {
					options[name] = defaultOptions[name];
				}
			}
		}

		// Define variables
		var nativeResponseParsing = false,
			crossOrigin,
			xhr,
			xdr = false,
			timeout,
			aborted = false,
			attempts = 0,
			headers = {},
			mimeTypes = {
				text: '*/*',
				xml: 'text/xml',
				json: 'application/json',
				post: 'application/x-www-form-urlencoded',
				document: 'text/html'
			},
			accept = {
				text: '*/*',
				xml: 'application/xml; q=1.0, text/xml; q=0.8, */*; q=0.1',
				json: 'application/json; q=1.0, text/*; q=0.8, */*; q=0.1'
			},
			i, j,
			response,
			sending = false,

		// Create the promise
		promise = pinkyswear(function(pinky) {
			pinky.abort = function() {
				if(!aborted) {
					if(xhr && xhr.readyState != 4) { // https://stackoverflow.com/questions/7287706/ie-9-javascript-error-c00c023f
						xhr.abort();
					}
					if(sending) {
						--requests;
						sending = false;
					}
					aborted = true;
				}
			};
			pinky.send = function() {
				// Prevent further send() calls
				if(sending) {
					return;
				}
				// Reached request limit, get out!
				if(requests == limit) {
					request_stack.push(pinky);
					return;
				}
				// Verify if the request has not been previously aborted
				if(aborted) {
					if(request_stack.length) {
						request_stack.shift().send();
					}
					return;
				}
				// The sending is running
				++requests;
				sending = true;
				// Get XHR object
				xhr = getXHR();
				if(crossOrigin) {
					if(!('withCredentials' in xhr) && global.XDomainRequest) {
						xhr = new XDomainRequest(); // CORS with IE8/9
						xdr = true;
						if(method != 'GET' && method != 'POST') {
							method = 'POST';
						}
					}
				}
				// Open connection
				if(xdr) {
					xhr.open(method, url);
				}
				else {
					xhr.open(method, url, options.async, options.user, options.password);
					if(xhr2 && options.async) {
						xhr.withCredentials = options.withCredentials;
					}
				}
				// Set headers
				if(!xdr) {
					for(var i in headers) {
						if(headers[i]) {
							xhr.setRequestHeader(i, headers[i]);
						}
					}
				}
				// Verify if the response type is supported by the current browser
				if(xhr2 && options.responseType != 'auto') {
					try {
						xhr.responseType = options.responseType;
						nativeResponseParsing = (xhr.responseType == options.responseType);
					}
					catch(e) {}
				}
				// Plug response handler
				if(xhr2 || xdr) {
					xhr.onload = handleResponse;
					xhr.onerror = handleError;
					// http://cypressnorth.com/programming/internet-explorer-aborting-ajax-requests-fixed/
					if(xdr) {
						xhr.onprogress = function() {};
					}
				}
				else {
					xhr.onreadystatechange = function() {
						if(xhr.readyState == 4) {
							handleResponse();
						}
					};
				}
				// Plug timeout
				if(options.async) {
					if('timeout' in xhr) {
						xhr.timeout = options.timeout;
						xhr.ontimeout = handleTimeout;
					}
					else {
						timeout = setTimeout(handleTimeout, options.timeout);
					}
				}
				// http://cypressnorth.com/programming/internet-explorer-aborting-ajax-requests-fixed/
				else if(xdr) {
					xhr.ontimeout = function() {};
				}
				// Override mime type to ensure the response is well parsed
				if(options.responseType != 'auto' && 'overrideMimeType' in xhr) {
					xhr.overrideMimeType(mimeTypes[options.responseType]);
				}
				// Run 'before' callback
				if(before) {
					before(xhr);
				}
				// Send request
				if(xdr) {
					// https://developer.mozilla.org/en-US/docs/Web/API/XDomainRequest
					setTimeout(function() {
						xhr.send(method != 'GET'? data : null);
					}, 0);
				}
				else {
					xhr.send(method != 'GET' ? data : null);
				}
			};
			return pinky;
		}),

		// Handle the response
		handleResponse = function() {
			var i, responseType;
			// Stop sending state
			sending = false;
			clearTimeout(timeout);
			// Launch next stacked request
			if(request_stack.length) {
				request_stack.shift().send();
			}
			// Verify if the request has not been previously aborted
			if(aborted) {
				return;
			}
			// Decrease the number of requests
			--requests;
			// Handle response
			try{
				// Process response
				if(nativeResponseParsing) {
					if('response' in xhr && xhr.response === null) {
						throw 'The request response is empty';
					}
					response = xhr.response;
				}
				else {
					// Guess response type
					responseType = options.responseType;
					if(responseType == 'auto') {
						if(xdr) {
							responseType = defaultXdrResponseType;
						}
						else {
							var ct = xhr.getResponseHeader('Content-Type') || '';
							if(ct.indexOf(mimeTypes.json)>-1) {
								responseType = 'json';
							}
							else if(ct.indexOf(mimeTypes.xml) > -1) {
								responseType = 'xml';
							}
							else {
								responseType = 'text';
							}
						}
					}
					// Handle response type
					switch(responseType) {
						case 'json':
							if(xhr.responseText.length) {
								try {
									if('JSON' in global) {
										response = JSON.parse(xhr.responseText);
									}
									else {
										response = new Function('return (' + xhr.responseText + ')')();
									}
								}
								catch(e) {
									throw "Error while parsing JSON body : "+e;
								}
							}
							break;
						case 'xml':
							// Based on jQuery's parseXML() function
							try {
								// Standard
								if(global.DOMParser) {
									response = (new DOMParser()).parseFromString(xhr.responseText,'text/xml');
								}
								// IE<9
								else {
									response = new ActiveXObject('Microsoft.XMLDOM');
									response.async = 'false';
									response.loadXML(xhr.responseText);
								}
							}
							catch(e) {
								response = undefined;
							}
							if(!response || !response.documentElement || response.getElementsByTagName('parsererror').length) {
								throw 'Invalid XML';
							}
							break;
						default:
							response = xhr.responseText;
					}
				}
				// Late status code verification to allow passing data when, per example, a 409 is returned
				// --- https://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request
				if('status' in xhr && !/^2|1223/.test(xhr.status)) {
					throw xhr.status + ' (' + xhr.statusText + ')';
				}
				// Fulfilled
				promise(true, [xhr, response]);
			}
			catch(e) {
				// Rejected
				promise(false, [e, xhr, response]);
			}
		},

		// Handle errors
		handleError = function(message) {
			if(!aborted) {
				message = typeof message == 'string' ? message : 'Connection aborted';
				promise.abort();
				promise(false, [new Error(message), xhr, null]);
			}
		},
			
		// Handle timeouts
		handleTimeout = function() {
			if(!aborted) {
				if(!options.attempts || ++attempts != options.attempts) {
					xhr.abort();
					sending = false;
					promise.send();
				}
				else {
					handleError('Timeout (' + url + ')');
				}
			}
		};

		// Normalize options
		options.async = 'async' in options ? !!options.async : true;
		options.cache = 'cache' in options ? !!options.cache : false;
		options.dataType = 'dataType' in options ? options.dataType.toLowerCase() : defaultDataType;
		options.responseType = 'responseType' in options ? options.responseType.toLowerCase() : 'auto';
		options.user = options.user || '';
		options.password = options.password || '';
		options.withCredentials = !!options.withCredentials;
		options.timeout = 'timeout' in options ? parseInt(options.timeout, 10) : 30000;
		options.attempts = 'attempts' in options ? parseInt(options.attempts, 10) : 1;

		// Guess if we're dealing with a cross-origin request
		i = url.match(/\/\/(.+?)\//);
		crossOrigin = i && (i[1] ? i[1] != location.host : false);

		// Prepare data
		if('ArrayBuffer' in global && data instanceof ArrayBuffer) {
			options.dataType = 'arraybuffer';
		}
		else if('Blob' in global && data instanceof Blob) {
			options.dataType = 'blob';
		}
		else if('Document' in global && data instanceof Document) {
			options.dataType = 'document';
		}
		else if('FormData' in global && data instanceof FormData) {
			options.dataType = 'formdata';
		}
		if(data !== null) {
			switch(options.dataType) {
				case 'json':
					data = JSON.stringify(data);
					break;
				case 'post':
					data = jparam(data);
			}
		}

		// Prepare headers
		if(options.headers) {
			var format = function(match,p1,p2) {
				return p1 + p2.toUpperCase();
			};
			for(i in options.headers) {
				headers[i.replace(/(^|-)([^-])/g,format)] = options.headers[i];
			}
		}
		if(!('Content-Type' in headers) && method!='GET') {
			if(options.dataType in mimeTypes) {
				if(mimeTypes[options.dataType]) {
					headers['Content-Type'] = mimeTypes[options.dataType];
				}
			}
		}
		if(!headers.Accept) {
			headers.Accept = (options.responseType in accept) ? accept[options.responseType] : '*/*';
		}
		if(!crossOrigin && !('X-Requested-With' in headers)) { // (that header breaks in legacy browsers with CORS)
			headers['X-Requested-With'] = 'XMLHttpRequest';
		}
		if(!options.cache && !('Cache-Control' in headers)) {
			headers['Cache-Control'] = 'no-cache';
		}

		// Prepare URL
		if(method == 'GET' && data && typeof data == 'string') {
			url += (/\?/.test(url)?'&':'?') + data;
		}

		// Start the request
		if(options.async) {
			promise.send();
		}

		// Return promise
		return promise;

	};
	
	// Define external qwest object
	var getNewPromise = function(q) {
			// Prepare
			var promises = [],
				loading = 0,
				values = [];
			// Create a new promise to handle all requests
			return pinkyswear(function(pinky) {
				// Basic request method
				var method_index = -1,
					createMethod = function(method) {
						return function(url, data, options, before) {
							var index = ++method_index;
							++loading;
							promises.push(qwest(method, pinky.base + url, data, options, before).then(function(xhr, response) {
								values[index] = arguments;
								if(!--loading) {
									pinky(true, values.length == 1 ? values[0] : [values]);
								}
							}, function() {
								pinky(false, arguments);
							}));
							return pinky;
						};
					};
				// Define external API
				pinky.get = createMethod('GET');
				pinky.post = createMethod('POST');
				pinky.put = createMethod('PUT');
				pinky['delete'] = createMethod('DELETE');
				pinky['catch'] = function(f) {
					return pinky.then(null, f);
				};
				pinky.complete = function(f) {
					var func = function() {
						f(); // otherwise arguments will be passed to the callback
					};
					return pinky.then(func, func);
				};
				pinky.map = function(type, url, data, options, before) {
					return createMethod(type.toUpperCase()).call(this, url, data, options, before);
				};
				// Populate methods from external object
				for(var prop in q) {
					if(!(prop in pinky)) {
						pinky[prop] = q[prop];
					}
				}
				// Set last methods
				pinky.send = function() {
					for(var i=0, j=promises.length; i<j; ++i) {
						promises[i].send();
					}
					return pinky;
				};
				pinky.abort = function() {
					for(var i=0, j=promises.length; i<j; ++i) {
						promises[i].abort();
					}
					return pinky;
				};
				return pinky;
			});
		},
		q = {
			base: '',
			get: function() {
				return getNewPromise(q).get.apply(this, arguments);
			},
			post: function() {
				return getNewPromise(q).post.apply(this, arguments);
			},
			put: function() {
				return getNewPromise(q).put.apply(this, arguments);
			},
			'delete': function() {
				return getNewPromise(q)['delete'].apply(this, arguments);
			},
			map: function() {
				return getNewPromise(q).map.apply(this, arguments);
			},
			xhr2: xhr2,
			limit: function(by) {
				limit = by;
				return q;
			},
			setDefaultOptions: function(options) {
				defaultOptions = options;
				return q;
			},
			setDefaultXdrResponseType: function(type) {
				defaultXdrResponseType = type.toLowerCase();
				return q;
			},
			setDefaultDataType: function(type) {
				defaultDataType = type.toLowerCase();
				return q;
			},
			getOpenRequests: function() {
				return requests;
			}
		};
	
	return q;

}();

},{"jquery-param":1,"pinkyswear":2}],5:[function(require,module,exports){
const rest = require('qwest')

// console.log("rest")
rest.get('/api/todos')
    .then(function(xhr, response) {
			// console.log(response)
			// console.table(response)
			render(response)
    })

// render(tasks)

function render(todos) {
	console.log('Get todos')
        todos.forEach(function(todo){
					console.log('Gen task')
          // Dodanie questa do małej listy
          var catClass = ".cat_"+todo.category
          console.log(catClass)
          var listCat = document.querySelector(catClass)
          console.log('Category found')
          var liel = document.createElement("li")
          console.log('element created')
          liel.textContent = todo.title
          console.log('nice title added')
          listCat.appendChild(liel)
          console.log("Render list")
          // Box szczegółów questa
          var container = document.querySelector(".main_quests_details")
          // Element zawierający zadanie
          var box = document.createElement("li")
          var header = document.createElement("header")
          var title = document.createElement("h1")
					var content = document.createElement("p")
					var doneTask = document.createElement("input")
          var deleteTask = document.createElement("button")
          deleteTask.textContent = "Usuń Zadanie"
          var moveTask = document.createElement("button")
          moveTask.textContent = "Przenieś Zadanie"
          var editTask = document.createElement("button")
          editTask.textContent = "Edytuj Zadanie"
          var taskOptions  = document.createElement("div")
          console.log("Add classes");
          taskOptions.setAttribute("class", "quest_details_options")
          console.log("break");
          // Opcje dotyczące zadania
          taskOptions.appendChild(moveTask)
          taskOptions.appendChild(deleteTask)
          taskOptions.appendChild(editTask)
          title.textContent = todo.title
					content.textContent = todo.content
          console.log("Add text");
          header.appendChild(title)
					box.appendChild(header)
					box.appendChild(content)
					box.appendChild(taskOptions)
          container.appendChild(box)
					console.log('Render task')
        })
      }
      //render();

},{"qwest":4}]},{},[5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvanF1ZXJ5LXBhcmFtL2pxdWVyeS1wYXJhbS5qcyIsIm5vZGVfbW9kdWxlcy9waW5reXN3ZWFyL3Bpbmt5c3dlYXIuanMiLCJub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL3F3ZXN0L3NyYy9xd2VzdC5qcyIsInB1YmxpYy9hc3NldHMvanMvYXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3JIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcmZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXG4gKiBAcHJlc2VydmUganF1ZXJ5LXBhcmFtIChjKSAyMDE1IEtOT1dMRURHRUNPREUgfCBNSVRcbiAqL1xuLypnbG9iYWwgZGVmaW5lICovXG4oZnVuY3Rpb24gKGdsb2JhbCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciBwYXJhbSA9IGZ1bmN0aW9uIChhKSB7XG4gICAgICAgIHZhciBhZGQgPSBmdW5jdGlvbiAocywgaywgdikge1xuICAgICAgICAgICAgdiA9IHR5cGVvZiB2ID09PSAnZnVuY3Rpb24nID8gdigpIDogdiA9PT0gbnVsbCA/ICcnIDogdiA9PT0gdW5kZWZpbmVkID8gJycgOiB2O1xuICAgICAgICAgICAgc1tzLmxlbmd0aF0gPSBlbmNvZGVVUklDb21wb25lbnQoaykgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQodik7XG4gICAgICAgIH0sIGJ1aWxkUGFyYW1zID0gZnVuY3Rpb24gKHByZWZpeCwgb2JqLCBzKSB7XG4gICAgICAgICAgICB2YXIgaSwgbGVuLCBrZXk7XG5cbiAgICAgICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgQXJyYXldJykge1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDAsIGxlbiA9IG9iai5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBidWlsZFBhcmFtcyhwcmVmaXggKyAnWycgKyAodHlwZW9mIG9ialtpXSA9PT0gJ29iamVjdCcgPyBpIDogJycpICsgJ10nLCBvYmpbaV0sIHMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAob2JqICYmIG9iai50b1N0cmluZygpID09PSAnW29iamVjdCBPYmplY3RdJykge1xuICAgICAgICAgICAgICAgIGZvciAoa2V5IGluIG9iaikge1xuICAgICAgICAgICAgICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcmVmaXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBidWlsZFBhcmFtcyhwcmVmaXggKyAnWycgKyBrZXkgKyAnXScsIG9ialtrZXldLCBzLCBhZGQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBidWlsZFBhcmFtcyhrZXksIG9ialtrZXldLCBzLCBhZGQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChwcmVmaXgpIHtcbiAgICAgICAgICAgICAgICBhZGQocywgcHJlZml4LCBvYmopO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmb3IgKGtleSBpbiBvYmopIHtcbiAgICAgICAgICAgICAgICAgICAgYWRkKHMsIGtleSwgb2JqW2tleV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBzO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gYnVpbGRQYXJhbXMoJycsIGEsIFtdKS5qb2luKCcmJykucmVwbGFjZSgvJTIwL2csICcrJyk7XG4gICAgfTtcblxuICAgIGlmICh0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlLmV4cG9ydHMgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gcGFyYW07XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgZGVmaW5lKFtdLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gcGFyYW07XG4gICAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGdsb2JhbC5wYXJhbSA9IHBhcmFtO1xuICAgIH1cblxufSh0aGlzKSk7XG4iLCIvKlxuICogUGlua3lTd2Vhci5qcyAyLjIuMiAtIE1pbmltYWxpc3RpYyBpbXBsZW1lbnRhdGlvbiBvZiB0aGUgUHJvbWlzZXMvQSsgc3BlY1xuICogXG4gKiBQdWJsaWMgRG9tYWluLiBVc2UsIG1vZGlmeSBhbmQgZGlzdHJpYnV0ZSBpdCBhbnkgd2F5IHlvdSBsaWtlLiBObyBhdHRyaWJ1dGlvbiByZXF1aXJlZC5cbiAqXG4gKiBOTyBXQVJSQU5UWSBFWFBSRVNTRUQgT1IgSU1QTElFRC4gVVNFIEFUIFlPVVIgT1dOIFJJU0suXG4gKlxuICogUGlua3lTd2VhciBpcyBhIHZlcnkgc21hbGwgaW1wbGVtZW50YXRpb24gb2YgdGhlIFByb21pc2VzL0ErIHNwZWNpZmljYXRpb24uIEFmdGVyIGNvbXBpbGF0aW9uIHdpdGggdGhlXG4gKiBHb29nbGUgQ2xvc3VyZSBDb21waWxlciBhbmQgZ3ppcHBpbmcgaXQgd2VpZ2hzIGxlc3MgdGhhbiA1MDAgYnl0ZXMuIEl0IGlzIGJhc2VkIG9uIHRoZSBpbXBsZW1lbnRhdGlvbiBmb3IgXG4gKiBNaW5pZmllZC5qcyBhbmQgc2hvdWxkIGJlIHBlcmZlY3QgZm9yIGVtYmVkZGluZy4gXG4gKlxuICpcbiAqIFBpbmt5U3dlYXIgaGFzIGp1c3QgdGhyZWUgZnVuY3Rpb25zLlxuICpcbiAqIFRvIGNyZWF0ZSBhIG5ldyBwcm9taXNlIGluIHBlbmRpbmcgc3RhdGUsIGNhbGwgcGlua3lTd2VhcigpOlxuICogICAgICAgICB2YXIgcHJvbWlzZSA9IHBpbmt5U3dlYXIoKTtcbiAqXG4gKiBUaGUgcmV0dXJuZWQgb2JqZWN0IGhhcyBhIFByb21pc2VzL0ErIGNvbXBhdGlibGUgdGhlbigpIGltcGxlbWVudGF0aW9uOlxuICogICAgICAgICAgcHJvbWlzZS50aGVuKGZ1bmN0aW9uKHZhbHVlKSB7IGFsZXJ0KFwiU3VjY2VzcyFcIik7IH0sIGZ1bmN0aW9uKHZhbHVlKSB7IGFsZXJ0KFwiRmFpbHVyZSFcIik7IH0pO1xuICpcbiAqXG4gKiBUaGUgcHJvbWlzZSByZXR1cm5lZCBieSBwaW5reVN3ZWFyKCkgaXMgYSBmdW5jdGlvbi4gVG8gZnVsZmlsbCB0aGUgcHJvbWlzZSwgY2FsbCB0aGUgZnVuY3Rpb24gd2l0aCB0cnVlIGFzIGZpcnN0IGFyZ3VtZW50IGFuZFxuICogYW4gb3B0aW9uYWwgYXJyYXkgb2YgdmFsdWVzIHRvIHBhc3MgdG8gdGhlIHRoZW4oKSBoYW5kbGVyLiBCeSBwdXR0aW5nIG1vcmUgdGhhbiBvbmUgdmFsdWUgaW4gdGhlIGFycmF5LCB5b3UgY2FuIHBhc3MgbW9yZSB0aGFuIG9uZVxuICogdmFsdWUgdG8gdGhlIHRoZW4oKSBoYW5kbGVycy4gSGVyZSBhbiBleGFtcGxlIHRvIGZ1bGZpbGwgYSBwcm9tc2lzZSwgdGhpcyB0aW1lIHdpdGggb25seSBvbmUgYXJndW1lbnQ6IFxuICogICAgICAgICBwcm9taXNlKHRydWUsIFs0Ml0pO1xuICpcbiAqIFdoZW4gdGhlIHByb21pc2UgaGFzIGJlZW4gcmVqZWN0ZWQsIGNhbGwgaXQgd2l0aCBmYWxzZS4gQWdhaW4sIHRoZXJlIG1heSBiZSBtb3JlIHRoYW4gb25lIGFyZ3VtZW50IGZvciB0aGUgdGhlbigpIGhhbmRsZXI6XG4gKiAgICAgICAgIHByb21pc2UodHJ1ZSwgWzYsIDYsIDZdKTtcbiAqICAgICAgICAgXG4gKiBZb3UgY2FuIG9idGFpbiB0aGUgcHJvbWlzZSdzIGN1cnJlbnQgc3RhdGUgYnkgY2FsbGluZyB0aGUgZnVuY3Rpb24gd2l0aG91dCBhcmd1bWVudHMuIEl0IHdpbGwgYmUgdHJ1ZSBpZiBmdWxmaWxsZWQsXG4gKiBmYWxzZSBpZiByZWplY3RlZCwgYW5kIG90aGVyd2lzZSB1bmRlZmluZWQuXG4gKiBcdFx0ICAgdmFyIHN0YXRlID0gcHJvbWlzZSgpOyBcbiAqIFxuICogaHR0cHM6Ly9naXRodWIuY29tL3RpbWphbnNlbi9QaW5reVN3ZWFyLmpzXG4gKi9cbihmdW5jdGlvbih0YXJnZXQpIHtcblx0dmFyIHVuZGVmO1xuXG5cdGZ1bmN0aW9uIGlzRnVuY3Rpb24oZikge1xuXHRcdHJldHVybiB0eXBlb2YgZiA9PSAnZnVuY3Rpb24nO1xuXHR9XG5cdGZ1bmN0aW9uIGlzT2JqZWN0KGYpIHtcblx0XHRyZXR1cm4gdHlwZW9mIGYgPT0gJ29iamVjdCc7XG5cdH1cblx0ZnVuY3Rpb24gZGVmZXIoY2FsbGJhY2spIHtcblx0XHRpZiAodHlwZW9mIHNldEltbWVkaWF0ZSAhPSAndW5kZWZpbmVkJylcblx0XHRcdHNldEltbWVkaWF0ZShjYWxsYmFjayk7XG5cdFx0ZWxzZSBpZiAodHlwZW9mIHByb2Nlc3MgIT0gJ3VuZGVmaW5lZCcgJiYgcHJvY2Vzc1snbmV4dFRpY2snXSlcblx0XHRcdHByb2Nlc3NbJ25leHRUaWNrJ10oY2FsbGJhY2spO1xuXHRcdGVsc2Vcblx0XHRcdHNldFRpbWVvdXQoY2FsbGJhY2ssIDApO1xuXHR9XG5cblx0dGFyZ2V0WzBdW3RhcmdldFsxXV0gPSBmdW5jdGlvbiBwaW5reVN3ZWFyKGV4dGVuZCkge1xuXHRcdHZhciBzdGF0ZTsgICAgICAgICAgIC8vIHVuZGVmaW5lZC9udWxsID0gcGVuZGluZywgdHJ1ZSA9IGZ1bGZpbGxlZCwgZmFsc2UgPSByZWplY3RlZFxuXHRcdHZhciB2YWx1ZXMgPSBbXTsgICAgIC8vIGFuIGFycmF5IG9mIHZhbHVlcyBhcyBhcmd1bWVudHMgZm9yIHRoZSB0aGVuKCkgaGFuZGxlcnNcblx0XHR2YXIgZGVmZXJyZWQgPSBbXTsgICAvLyBmdW5jdGlvbnMgdG8gY2FsbCB3aGVuIHNldCgpIGlzIGludm9rZWRcblxuXHRcdHZhciBzZXQgPSBmdW5jdGlvbihuZXdTdGF0ZSwgbmV3VmFsdWVzKSB7XG5cdFx0XHRpZiAoc3RhdGUgPT0gbnVsbCAmJiBuZXdTdGF0ZSAhPSBudWxsKSB7XG5cdFx0XHRcdHN0YXRlID0gbmV3U3RhdGU7XG5cdFx0XHRcdHZhbHVlcyA9IG5ld1ZhbHVlcztcblx0XHRcdFx0aWYgKGRlZmVycmVkLmxlbmd0aClcblx0XHRcdFx0XHRkZWZlcihmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgZGVmZXJyZWQubGVuZ3RoOyBpKyspXG5cdFx0XHRcdFx0XHRcdGRlZmVycmVkW2ldKCk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gc3RhdGU7XG5cdFx0fTtcblxuXHRcdHNldFsndGhlbiddID0gZnVuY3Rpb24gKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkKSB7XG5cdFx0XHR2YXIgcHJvbWlzZTIgPSBwaW5reVN3ZWFyKGV4dGVuZCk7XG5cdFx0XHR2YXIgY2FsbENhbGxiYWNrcyA9IGZ1bmN0aW9uKCkge1xuXHQgICAgXHRcdHRyeSB7XG5cdCAgICBcdFx0XHR2YXIgZiA9IChzdGF0ZSA/IG9uRnVsZmlsbGVkIDogb25SZWplY3RlZCk7XG5cdCAgICBcdFx0XHRpZiAoaXNGdW5jdGlvbihmKSkge1xuXHRcdCAgIFx0XHRcdFx0ZnVuY3Rpb24gcmVzb2x2ZSh4KSB7XG5cdFx0XHRcdFx0XHQgICAgdmFyIHRoZW4sIGNiQ2FsbGVkID0gMDtcblx0XHQgICBcdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0ICAgXHRcdFx0XHRpZiAoeCAmJiAoaXNPYmplY3QoeCkgfHwgaXNGdW5jdGlvbih4KSkgJiYgaXNGdW5jdGlvbih0aGVuID0geFsndGhlbiddKSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoeCA9PT0gcHJvbWlzZTIpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcigpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR0aGVuWydjYWxsJ10oeCxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRmdW5jdGlvbigpIHsgaWYgKCFjYkNhbGxlZCsrKSByZXNvbHZlLmFwcGx5KHVuZGVmLGFyZ3VtZW50cyk7IH0gLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGZ1bmN0aW9uKHZhbHVlKXsgaWYgKCFjYkNhbGxlZCsrKSBwcm9taXNlMihmYWxzZSxbdmFsdWVdKTt9KTtcblx0XHRcdFx0ICAgXHRcdFx0XHR9XG5cdFx0XHRcdCAgIFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHQgICBcdFx0XHRcdFx0cHJvbWlzZTIodHJ1ZSwgYXJndW1lbnRzKTtcblx0XHQgICBcdFx0XHRcdFx0fVxuXHRcdCAgIFx0XHRcdFx0XHRjYXRjaChlKSB7XG5cdFx0ICAgXHRcdFx0XHRcdFx0aWYgKCFjYkNhbGxlZCsrKVxuXHRcdCAgIFx0XHRcdFx0XHRcdFx0cHJvbWlzZTIoZmFsc2UsIFtlXSk7XG5cdFx0ICAgXHRcdFx0XHRcdH1cblx0XHQgICBcdFx0XHRcdH1cblx0XHQgICBcdFx0XHRcdHJlc29sdmUoZi5hcHBseSh1bmRlZiwgdmFsdWVzIHx8IFtdKSk7XG5cdFx0ICAgXHRcdFx0fVxuXHRcdCAgIFx0XHRcdGVsc2Vcblx0XHQgICBcdFx0XHRcdHByb21pc2UyKHN0YXRlLCB2YWx1ZXMpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNhdGNoIChlKSB7XG5cdFx0XHRcdFx0cHJvbWlzZTIoZmFsc2UsIFtlXSk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0XHRpZiAoc3RhdGUgIT0gbnVsbClcblx0XHRcdFx0ZGVmZXIoY2FsbENhbGxiYWNrcyk7XG5cdFx0XHRlbHNlXG5cdFx0XHRcdGRlZmVycmVkLnB1c2goY2FsbENhbGxiYWNrcyk7XG5cdFx0XHRyZXR1cm4gcHJvbWlzZTI7XG5cdFx0fTtcbiAgICAgICAgaWYoZXh0ZW5kKXtcbiAgICAgICAgICAgIHNldCA9IGV4dGVuZChzZXQpO1xuICAgICAgICB9XG5cdFx0cmV0dXJuIHNldDtcblx0fTtcbn0pKHR5cGVvZiBtb2R1bGUgPT0gJ3VuZGVmaW5lZCcgPyBbd2luZG93LCAncGlua3lTd2VhciddIDogW21vZHVsZSwgJ2V4cG9ydHMnXSk7XG5cbiIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyBjYWNoZWQgZnJvbSB3aGF0ZXZlciBnbG9iYWwgaXMgcHJlc2VudCBzbyB0aGF0IHRlc3QgcnVubmVycyB0aGF0IHN0dWIgaXRcbi8vIGRvbid0IGJyZWFrIHRoaW5ncy4gIEJ1dCB3ZSBuZWVkIHRvIHdyYXAgaXQgaW4gYSB0cnkgY2F0Y2ggaW4gY2FzZSBpdCBpc1xuLy8gd3JhcHBlZCBpbiBzdHJpY3QgbW9kZSBjb2RlIHdoaWNoIGRvZXNuJ3QgZGVmaW5lIGFueSBnbG9iYWxzLiAgSXQncyBpbnNpZGUgYVxuLy8gZnVuY3Rpb24gYmVjYXVzZSB0cnkvY2F0Y2hlcyBkZW9wdGltaXplIGluIGNlcnRhaW4gZW5naW5lcy5cblxudmFyIGNhY2hlZFNldFRpbWVvdXQ7XG52YXIgY2FjaGVkQ2xlYXJUaW1lb3V0O1xuXG5mdW5jdGlvbiBkZWZhdWx0U2V0VGltb3V0KCkge1xuICAgIHRocm93IG5ldyBFcnJvcignc2V0VGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuZnVuY3Rpb24gZGVmYXVsdENsZWFyVGltZW91dCAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjbGVhclRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbihmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZXRUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBjbGVhclRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgfVxufSAoKSlcbmZ1bmN0aW9uIHJ1blRpbWVvdXQoZnVuKSB7XG4gICAgaWYgKGNhY2hlZFNldFRpbWVvdXQgPT09IHNldFRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIC8vIGlmIHNldFRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRTZXRUaW1lb3V0ID09PSBkZWZhdWx0U2V0VGltb3V0IHx8ICFjYWNoZWRTZXRUaW1lb3V0KSAmJiBzZXRUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbChudWxsLCBmdW4sIDApO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwodGhpcywgZnVuLCAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5mdW5jdGlvbiBydW5DbGVhclRpbWVvdXQobWFya2VyKSB7XG4gICAgaWYgKGNhY2hlZENsZWFyVGltZW91dCA9PT0gY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIC8vIGlmIGNsZWFyVGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZENsZWFyVGltZW91dCA9PT0gZGVmYXVsdENsZWFyVGltZW91dCB8fCAhY2FjaGVkQ2xlYXJUaW1lb3V0KSAmJiBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0ICB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKG51bGwsIG1hcmtlcik7XG4gICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3IuXG4gICAgICAgICAgICAvLyBTb21lIHZlcnNpb25zIG9mIEkuRS4gaGF2ZSBkaWZmZXJlbnQgcnVsZXMgZm9yIGNsZWFyVGltZW91dCB2cyBzZXRUaW1lb3V0XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwodGhpcywgbWFya2VyKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbn1cbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHJ1blRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIHJ1bkNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHJ1blRpbWVvdXQoZHJhaW5RdWV1ZSk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iLCIvKiEgcXdlc3QgNC40LjUgKGh0dHBzOi8vZ2l0aHViLmNvbS9weXJzbWsvcXdlc3QpICovXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xyXG5cclxuXHR2YXIgZ2xvYmFsID0gdHlwZW9mIHdpbmRvdyAhPSAndW5kZWZpbmVkJyA/IHdpbmRvdyA6IHNlbGYsXHJcblx0XHRwaW5reXN3ZWFyID0gcmVxdWlyZSgncGlua3lzd2VhcicpLFxyXG5cdFx0anBhcmFtID0gcmVxdWlyZSgnanF1ZXJ5LXBhcmFtJyksXHJcblx0XHRkZWZhdWx0T3B0aW9ucyA9IHt9LFxyXG5cdFx0Ly8gRGVmYXVsdCByZXNwb25zZSB0eXBlIGZvciBYRFIgaW4gYXV0byBtb2RlXHJcblx0XHRkZWZhdWx0WGRyUmVzcG9uc2VUeXBlID0gJ2pzb24nLFxyXG5cdFx0Ly8gRGVmYXVsdCBkYXRhIHR5cGVcclxuXHRcdGRlZmF1bHREYXRhVHlwZSA9ICdwb3N0JyxcclxuXHRcdC8vIFZhcmlhYmxlcyBmb3IgbGltaXQgbWVjaGFuaXNtXHJcblx0XHRsaW1pdCA9IG51bGwsXHJcblx0XHRyZXF1ZXN0cyA9IDAsXHJcblx0XHRyZXF1ZXN0X3N0YWNrID0gW10sXHJcblx0XHQvLyBHZXQgWE1MSHR0cFJlcXVlc3Qgb2JqZWN0XHJcblx0XHRnZXRYSFIgPSBnbG9iYWwuWE1MSHR0cFJlcXVlc3Q/IGZ1bmN0aW9uKCl7XHJcblx0XHRcdHJldHVybiBuZXcgZ2xvYmFsLlhNTEh0dHBSZXF1ZXN0KCk7XHJcblx0XHR9OiBmdW5jdGlvbigpe1xyXG5cdFx0XHRyZXR1cm4gbmV3IEFjdGl2ZVhPYmplY3QoJ01pY3Jvc29mdC5YTUxIVFRQJyk7XHJcblx0XHR9LFxyXG5cdFx0Ly8gR3Vlc3MgWEhSIHZlcnNpb25cclxuXHRcdHhocjIgPSAoZ2V0WEhSKCkucmVzcG9uc2VUeXBlPT09JycpLFxyXG5cclxuXHQvLyBDb3JlIGZ1bmN0aW9uXHJcblx0cXdlc3QgPSBmdW5jdGlvbihtZXRob2QsIHVybCwgZGF0YSwgb3B0aW9ucywgYmVmb3JlKSB7XHJcblx0XHQvLyBGb3JtYXRcclxuXHRcdG1ldGhvZCA9IG1ldGhvZC50b1VwcGVyQ2FzZSgpO1xyXG5cdFx0ZGF0YSA9IGRhdGEgfHwgbnVsbDtcclxuXHRcdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xyXG5cdFx0Zm9yKHZhciBuYW1lIGluIGRlZmF1bHRPcHRpb25zKSB7XHJcblx0XHRcdGlmKCEobmFtZSBpbiBvcHRpb25zKSkge1xyXG5cdFx0XHRcdGlmKHR5cGVvZiBkZWZhdWx0T3B0aW9uc1tuYW1lXSA9PSAnb2JqZWN0JyAmJiB0eXBlb2Ygb3B0aW9uc1tuYW1lXSA9PSAnb2JqZWN0Jykge1xyXG5cdFx0XHRcdFx0Zm9yKHZhciBuYW1lMiBpbiBkZWZhdWx0T3B0aW9uc1tuYW1lXSkge1xyXG5cdFx0XHRcdFx0XHRvcHRpb25zW25hbWVdW25hbWUyXSA9IGRlZmF1bHRPcHRpb25zW25hbWVdW25hbWUyXTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRvcHRpb25zW25hbWVdID0gZGVmYXVsdE9wdGlvbnNbbmFtZV07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gRGVmaW5lIHZhcmlhYmxlc1xyXG5cdFx0dmFyIG5hdGl2ZVJlc3BvbnNlUGFyc2luZyA9IGZhbHNlLFxyXG5cdFx0XHRjcm9zc09yaWdpbixcclxuXHRcdFx0eGhyLFxyXG5cdFx0XHR4ZHIgPSBmYWxzZSxcclxuXHRcdFx0dGltZW91dCxcclxuXHRcdFx0YWJvcnRlZCA9IGZhbHNlLFxyXG5cdFx0XHRhdHRlbXB0cyA9IDAsXHJcblx0XHRcdGhlYWRlcnMgPSB7fSxcclxuXHRcdFx0bWltZVR5cGVzID0ge1xyXG5cdFx0XHRcdHRleHQ6ICcqLyonLFxyXG5cdFx0XHRcdHhtbDogJ3RleHQveG1sJyxcclxuXHRcdFx0XHRqc29uOiAnYXBwbGljYXRpb24vanNvbicsXHJcblx0XHRcdFx0cG9zdDogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcsXHJcblx0XHRcdFx0ZG9jdW1lbnQ6ICd0ZXh0L2h0bWwnXHJcblx0XHRcdH0sXHJcblx0XHRcdGFjY2VwdCA9IHtcclxuXHRcdFx0XHR0ZXh0OiAnKi8qJyxcclxuXHRcdFx0XHR4bWw6ICdhcHBsaWNhdGlvbi94bWw7IHE9MS4wLCB0ZXh0L3htbDsgcT0wLjgsICovKjsgcT0wLjEnLFxyXG5cdFx0XHRcdGpzb246ICdhcHBsaWNhdGlvbi9qc29uOyBxPTEuMCwgdGV4dC8qOyBxPTAuOCwgKi8qOyBxPTAuMSdcclxuXHRcdFx0fSxcclxuXHRcdFx0aSwgaixcclxuXHRcdFx0cmVzcG9uc2UsXHJcblx0XHRcdHNlbmRpbmcgPSBmYWxzZSxcclxuXHJcblx0XHQvLyBDcmVhdGUgdGhlIHByb21pc2VcclxuXHRcdHByb21pc2UgPSBwaW5reXN3ZWFyKGZ1bmN0aW9uKHBpbmt5KSB7XHJcblx0XHRcdHBpbmt5LmFib3J0ID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0aWYoIWFib3J0ZWQpIHtcclxuXHRcdFx0XHRcdGlmKHhociAmJiB4aHIucmVhZHlTdGF0ZSAhPSA0KSB7IC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzcyODc3MDYvaWUtOS1qYXZhc2NyaXB0LWVycm9yLWMwMGMwMjNmXHJcblx0XHRcdFx0XHRcdHhoci5hYm9ydCgpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYoc2VuZGluZykge1xyXG5cdFx0XHRcdFx0XHQtLXJlcXVlc3RzO1xyXG5cdFx0XHRcdFx0XHRzZW5kaW5nID0gZmFsc2U7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRhYm9ydGVkID0gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH07XHJcblx0XHRcdHBpbmt5LnNlbmQgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHQvLyBQcmV2ZW50IGZ1cnRoZXIgc2VuZCgpIGNhbGxzXHJcblx0XHRcdFx0aWYoc2VuZGluZykge1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQvLyBSZWFjaGVkIHJlcXVlc3QgbGltaXQsIGdldCBvdXQhXHJcblx0XHRcdFx0aWYocmVxdWVzdHMgPT0gbGltaXQpIHtcclxuXHRcdFx0XHRcdHJlcXVlc3Rfc3RhY2sucHVzaChwaW5reSk7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdC8vIFZlcmlmeSBpZiB0aGUgcmVxdWVzdCBoYXMgbm90IGJlZW4gcHJldmlvdXNseSBhYm9ydGVkXHJcblx0XHRcdFx0aWYoYWJvcnRlZCkge1xyXG5cdFx0XHRcdFx0aWYocmVxdWVzdF9zdGFjay5sZW5ndGgpIHtcclxuXHRcdFx0XHRcdFx0cmVxdWVzdF9zdGFjay5zaGlmdCgpLnNlbmQoKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Ly8gVGhlIHNlbmRpbmcgaXMgcnVubmluZ1xyXG5cdFx0XHRcdCsrcmVxdWVzdHM7XHJcblx0XHRcdFx0c2VuZGluZyA9IHRydWU7XHJcblx0XHRcdFx0Ly8gR2V0IFhIUiBvYmplY3RcclxuXHRcdFx0XHR4aHIgPSBnZXRYSFIoKTtcclxuXHRcdFx0XHRpZihjcm9zc09yaWdpbikge1xyXG5cdFx0XHRcdFx0aWYoISgnd2l0aENyZWRlbnRpYWxzJyBpbiB4aHIpICYmIGdsb2JhbC5YRG9tYWluUmVxdWVzdCkge1xyXG5cdFx0XHRcdFx0XHR4aHIgPSBuZXcgWERvbWFpblJlcXVlc3QoKTsgLy8gQ09SUyB3aXRoIElFOC85XHJcblx0XHRcdFx0XHRcdHhkciA9IHRydWU7XHJcblx0XHRcdFx0XHRcdGlmKG1ldGhvZCAhPSAnR0VUJyAmJiBtZXRob2QgIT0gJ1BPU1QnKSB7XHJcblx0XHRcdFx0XHRcdFx0bWV0aG9kID0gJ1BPU1QnO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdC8vIE9wZW4gY29ubmVjdGlvblxyXG5cdFx0XHRcdGlmKHhkcikge1xyXG5cdFx0XHRcdFx0eGhyLm9wZW4obWV0aG9kLCB1cmwpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHhoci5vcGVuKG1ldGhvZCwgdXJsLCBvcHRpb25zLmFzeW5jLCBvcHRpb25zLnVzZXIsIG9wdGlvbnMucGFzc3dvcmQpO1xyXG5cdFx0XHRcdFx0aWYoeGhyMiAmJiBvcHRpb25zLmFzeW5jKSB7XHJcblx0XHRcdFx0XHRcdHhoci53aXRoQ3JlZGVudGlhbHMgPSBvcHRpb25zLndpdGhDcmVkZW50aWFscztcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Ly8gU2V0IGhlYWRlcnNcclxuXHRcdFx0XHRpZigheGRyKSB7XHJcblx0XHRcdFx0XHRmb3IodmFyIGkgaW4gaGVhZGVycykge1xyXG5cdFx0XHRcdFx0XHRpZihoZWFkZXJzW2ldKSB7XHJcblx0XHRcdFx0XHRcdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoaSwgaGVhZGVyc1tpXSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Ly8gVmVyaWZ5IGlmIHRoZSByZXNwb25zZSB0eXBlIGlzIHN1cHBvcnRlZCBieSB0aGUgY3VycmVudCBicm93c2VyXHJcblx0XHRcdFx0aWYoeGhyMiAmJiBvcHRpb25zLnJlc3BvbnNlVHlwZSAhPSAnYXV0bycpIHtcclxuXHRcdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHRcdHhoci5yZXNwb25zZVR5cGUgPSBvcHRpb25zLnJlc3BvbnNlVHlwZTtcclxuXHRcdFx0XHRcdFx0bmF0aXZlUmVzcG9uc2VQYXJzaW5nID0gKHhoci5yZXNwb25zZVR5cGUgPT0gb3B0aW9ucy5yZXNwb25zZVR5cGUpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0Y2F0Y2goZSkge31cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Ly8gUGx1ZyByZXNwb25zZSBoYW5kbGVyXHJcblx0XHRcdFx0aWYoeGhyMiB8fCB4ZHIpIHtcclxuXHRcdFx0XHRcdHhoci5vbmxvYWQgPSBoYW5kbGVSZXNwb25zZTtcclxuXHRcdFx0XHRcdHhoci5vbmVycm9yID0gaGFuZGxlRXJyb3I7XHJcblx0XHRcdFx0XHQvLyBodHRwOi8vY3lwcmVzc25vcnRoLmNvbS9wcm9ncmFtbWluZy9pbnRlcm5ldC1leHBsb3Jlci1hYm9ydGluZy1hamF4LXJlcXVlc3RzLWZpeGVkL1xyXG5cdFx0XHRcdFx0aWYoeGRyKSB7XHJcblx0XHRcdFx0XHRcdHhoci5vbnByb2dyZXNzID0gZnVuY3Rpb24oKSB7fTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHR4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdGlmKHhoci5yZWFkeVN0YXRlID09IDQpIHtcclxuXHRcdFx0XHRcdFx0XHRoYW5kbGVSZXNwb25zZSgpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQvLyBQbHVnIHRpbWVvdXRcclxuXHRcdFx0XHRpZihvcHRpb25zLmFzeW5jKSB7XHJcblx0XHRcdFx0XHRpZigndGltZW91dCcgaW4geGhyKSB7XHJcblx0XHRcdFx0XHRcdHhoci50aW1lb3V0ID0gb3B0aW9ucy50aW1lb3V0O1xyXG5cdFx0XHRcdFx0XHR4aHIub250aW1lb3V0ID0gaGFuZGxlVGltZW91dDtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0XHR0aW1lb3V0ID0gc2V0VGltZW91dChoYW5kbGVUaW1lb3V0LCBvcHRpb25zLnRpbWVvdXQpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQvLyBodHRwOi8vY3lwcmVzc25vcnRoLmNvbS9wcm9ncmFtbWluZy9pbnRlcm5ldC1leHBsb3Jlci1hYm9ydGluZy1hamF4LXJlcXVlc3RzLWZpeGVkL1xyXG5cdFx0XHRcdGVsc2UgaWYoeGRyKSB7XHJcblx0XHRcdFx0XHR4aHIub250aW1lb3V0ID0gZnVuY3Rpb24oKSB7fTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Ly8gT3ZlcnJpZGUgbWltZSB0eXBlIHRvIGVuc3VyZSB0aGUgcmVzcG9uc2UgaXMgd2VsbCBwYXJzZWRcclxuXHRcdFx0XHRpZihvcHRpb25zLnJlc3BvbnNlVHlwZSAhPSAnYXV0bycgJiYgJ292ZXJyaWRlTWltZVR5cGUnIGluIHhocikge1xyXG5cdFx0XHRcdFx0eGhyLm92ZXJyaWRlTWltZVR5cGUobWltZVR5cGVzW29wdGlvbnMucmVzcG9uc2VUeXBlXSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdC8vIFJ1biAnYmVmb3JlJyBjYWxsYmFja1xyXG5cdFx0XHRcdGlmKGJlZm9yZSkge1xyXG5cdFx0XHRcdFx0YmVmb3JlKHhocik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdC8vIFNlbmQgcmVxdWVzdFxyXG5cdFx0XHRcdGlmKHhkcikge1xyXG5cdFx0XHRcdFx0Ly8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1hEb21haW5SZXF1ZXN0XHJcblx0XHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHR4aHIuc2VuZChtZXRob2QgIT0gJ0dFVCc/IGRhdGEgOiBudWxsKTtcclxuXHRcdFx0XHRcdH0sIDApO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHhoci5zZW5kKG1ldGhvZCAhPSAnR0VUJyA/IGRhdGEgOiBudWxsKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH07XHJcblx0XHRcdHJldHVybiBwaW5reTtcclxuXHRcdH0pLFxyXG5cclxuXHRcdC8vIEhhbmRsZSB0aGUgcmVzcG9uc2VcclxuXHRcdGhhbmRsZVJlc3BvbnNlID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciBpLCByZXNwb25zZVR5cGU7XHJcblx0XHRcdC8vIFN0b3Agc2VuZGluZyBzdGF0ZVxyXG5cdFx0XHRzZW5kaW5nID0gZmFsc2U7XHJcblx0XHRcdGNsZWFyVGltZW91dCh0aW1lb3V0KTtcclxuXHRcdFx0Ly8gTGF1bmNoIG5leHQgc3RhY2tlZCByZXF1ZXN0XHJcblx0XHRcdGlmKHJlcXVlc3Rfc3RhY2subGVuZ3RoKSB7XHJcblx0XHRcdFx0cmVxdWVzdF9zdGFjay5zaGlmdCgpLnNlbmQoKTtcclxuXHRcdFx0fVxyXG5cdFx0XHQvLyBWZXJpZnkgaWYgdGhlIHJlcXVlc3QgaGFzIG5vdCBiZWVuIHByZXZpb3VzbHkgYWJvcnRlZFxyXG5cdFx0XHRpZihhYm9ydGVkKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdC8vIERlY3JlYXNlIHRoZSBudW1iZXIgb2YgcmVxdWVzdHNcclxuXHRcdFx0LS1yZXF1ZXN0cztcclxuXHRcdFx0Ly8gSGFuZGxlIHJlc3BvbnNlXHJcblx0XHRcdHRyeXtcclxuXHRcdFx0XHQvLyBQcm9jZXNzIHJlc3BvbnNlXHJcblx0XHRcdFx0aWYobmF0aXZlUmVzcG9uc2VQYXJzaW5nKSB7XHJcblx0XHRcdFx0XHRpZigncmVzcG9uc2UnIGluIHhociAmJiB4aHIucmVzcG9uc2UgPT09IG51bGwpIHtcclxuXHRcdFx0XHRcdFx0dGhyb3cgJ1RoZSByZXF1ZXN0IHJlc3BvbnNlIGlzIGVtcHR5JztcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHJlc3BvbnNlID0geGhyLnJlc3BvbnNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdC8vIEd1ZXNzIHJlc3BvbnNlIHR5cGVcclxuXHRcdFx0XHRcdHJlc3BvbnNlVHlwZSA9IG9wdGlvbnMucmVzcG9uc2VUeXBlO1xyXG5cdFx0XHRcdFx0aWYocmVzcG9uc2VUeXBlID09ICdhdXRvJykge1xyXG5cdFx0XHRcdFx0XHRpZih4ZHIpIHtcclxuXHRcdFx0XHRcdFx0XHRyZXNwb25zZVR5cGUgPSBkZWZhdWx0WGRyUmVzcG9uc2VUeXBlO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdHZhciBjdCA9IHhoci5nZXRSZXNwb25zZUhlYWRlcignQ29udGVudC1UeXBlJykgfHwgJyc7XHJcblx0XHRcdFx0XHRcdFx0aWYoY3QuaW5kZXhPZihtaW1lVHlwZXMuanNvbik+LTEpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHJlc3BvbnNlVHlwZSA9ICdqc29uJztcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0ZWxzZSBpZihjdC5pbmRleE9mKG1pbWVUeXBlcy54bWwpID4gLTEpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHJlc3BvbnNlVHlwZSA9ICd4bWwnO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdHJlc3BvbnNlVHlwZSA9ICd0ZXh0JztcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdC8vIEhhbmRsZSByZXNwb25zZSB0eXBlXHJcblx0XHRcdFx0XHRzd2l0Y2gocmVzcG9uc2VUeXBlKSB7XHJcblx0XHRcdFx0XHRcdGNhc2UgJ2pzb24nOlxyXG5cdFx0XHRcdFx0XHRcdGlmKHhoci5yZXNwb25zZVRleHQubGVuZ3RoKSB7XHJcblx0XHRcdFx0XHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZignSlNPTicgaW4gZ2xvYmFsKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0cmVzcG9uc2UgPSBKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJlc3BvbnNlID0gbmV3IEZ1bmN0aW9uKCdyZXR1cm4gKCcgKyB4aHIucmVzcG9uc2VUZXh0ICsgJyknKSgpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRjYXRjaChlKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHRocm93IFwiRXJyb3Igd2hpbGUgcGFyc2luZyBKU09OIGJvZHkgOiBcIitlO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0Y2FzZSAneG1sJzpcclxuXHRcdFx0XHRcdFx0XHQvLyBCYXNlZCBvbiBqUXVlcnkncyBwYXJzZVhNTCgpIGZ1bmN0aW9uXHJcblx0XHRcdFx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFN0YW5kYXJkXHJcblx0XHRcdFx0XHRcdFx0XHRpZihnbG9iYWwuRE9NUGFyc2VyKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHJlc3BvbnNlID0gKG5ldyBET01QYXJzZXIoKSkucGFyc2VGcm9tU3RyaW5nKHhoci5yZXNwb25zZVRleHQsJ3RleHQveG1sJyk7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBJRTw5XHJcblx0XHRcdFx0XHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0cmVzcG9uc2UgPSBuZXcgQWN0aXZlWE9iamVjdCgnTWljcm9zb2Z0LlhNTERPTScpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRyZXNwb25zZS5hc3luYyA9ICdmYWxzZSc7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHJlc3BvbnNlLmxvYWRYTUwoeGhyLnJlc3BvbnNlVGV4dCk7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdGNhdGNoKGUpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHJlc3BvbnNlID0gdW5kZWZpbmVkO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRpZighcmVzcG9uc2UgfHwgIXJlc3BvbnNlLmRvY3VtZW50RWxlbWVudCB8fCByZXNwb25zZS5nZXRFbGVtZW50c0J5VGFnTmFtZSgncGFyc2VyZXJyb3InKS5sZW5ndGgpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHRocm93ICdJbnZhbGlkIFhNTCc7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRkZWZhdWx0OlxyXG5cdFx0XHRcdFx0XHRcdHJlc3BvbnNlID0geGhyLnJlc3BvbnNlVGV4dDtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Ly8gTGF0ZSBzdGF0dXMgY29kZSB2ZXJpZmljYXRpb24gdG8gYWxsb3cgcGFzc2luZyBkYXRhIHdoZW4sIHBlciBleGFtcGxlLCBhIDQwOSBpcyByZXR1cm5lZFxyXG5cdFx0XHRcdC8vIC0tLSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xMDA0Njk3Mi9tc2llLXJldHVybnMtc3RhdHVzLWNvZGUtb2YtMTIyMy1mb3ItYWpheC1yZXF1ZXN0XHJcblx0XHRcdFx0aWYoJ3N0YXR1cycgaW4geGhyICYmICEvXjJ8MTIyMy8udGVzdCh4aHIuc3RhdHVzKSkge1xyXG5cdFx0XHRcdFx0dGhyb3cgeGhyLnN0YXR1cyArICcgKCcgKyB4aHIuc3RhdHVzVGV4dCArICcpJztcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Ly8gRnVsZmlsbGVkXHJcblx0XHRcdFx0cHJvbWlzZSh0cnVlLCBbeGhyLCByZXNwb25zZV0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdGNhdGNoKGUpIHtcclxuXHRcdFx0XHQvLyBSZWplY3RlZFxyXG5cdFx0XHRcdHByb21pc2UoZmFsc2UsIFtlLCB4aHIsIHJlc3BvbnNlXSk7XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblxyXG5cdFx0Ly8gSGFuZGxlIGVycm9yc1xyXG5cdFx0aGFuZGxlRXJyb3IgPSBmdW5jdGlvbihtZXNzYWdlKSB7XHJcblx0XHRcdGlmKCFhYm9ydGVkKSB7XHJcblx0XHRcdFx0bWVzc2FnZSA9IHR5cGVvZiBtZXNzYWdlID09ICdzdHJpbmcnID8gbWVzc2FnZSA6ICdDb25uZWN0aW9uIGFib3J0ZWQnO1xyXG5cdFx0XHRcdHByb21pc2UuYWJvcnQoKTtcclxuXHRcdFx0XHRwcm9taXNlKGZhbHNlLCBbbmV3IEVycm9yKG1lc3NhZ2UpLCB4aHIsIG51bGxdKTtcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdFx0XHJcblx0XHQvLyBIYW5kbGUgdGltZW91dHNcclxuXHRcdGhhbmRsZVRpbWVvdXQgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0aWYoIWFib3J0ZWQpIHtcclxuXHRcdFx0XHRpZighb3B0aW9ucy5hdHRlbXB0cyB8fCArK2F0dGVtcHRzICE9IG9wdGlvbnMuYXR0ZW1wdHMpIHtcclxuXHRcdFx0XHRcdHhoci5hYm9ydCgpO1xyXG5cdFx0XHRcdFx0c2VuZGluZyA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0cHJvbWlzZS5zZW5kKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0aGFuZGxlRXJyb3IoJ1RpbWVvdXQgKCcgKyB1cmwgKyAnKScpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHQvLyBOb3JtYWxpemUgb3B0aW9uc1xyXG5cdFx0b3B0aW9ucy5hc3luYyA9ICdhc3luYycgaW4gb3B0aW9ucyA/ICEhb3B0aW9ucy5hc3luYyA6IHRydWU7XHJcblx0XHRvcHRpb25zLmNhY2hlID0gJ2NhY2hlJyBpbiBvcHRpb25zID8gISFvcHRpb25zLmNhY2hlIDogZmFsc2U7XHJcblx0XHRvcHRpb25zLmRhdGFUeXBlID0gJ2RhdGFUeXBlJyBpbiBvcHRpb25zID8gb3B0aW9ucy5kYXRhVHlwZS50b0xvd2VyQ2FzZSgpIDogZGVmYXVsdERhdGFUeXBlO1xyXG5cdFx0b3B0aW9ucy5yZXNwb25zZVR5cGUgPSAncmVzcG9uc2VUeXBlJyBpbiBvcHRpb25zID8gb3B0aW9ucy5yZXNwb25zZVR5cGUudG9Mb3dlckNhc2UoKSA6ICdhdXRvJztcclxuXHRcdG9wdGlvbnMudXNlciA9IG9wdGlvbnMudXNlciB8fCAnJztcclxuXHRcdG9wdGlvbnMucGFzc3dvcmQgPSBvcHRpb25zLnBhc3N3b3JkIHx8ICcnO1xyXG5cdFx0b3B0aW9ucy53aXRoQ3JlZGVudGlhbHMgPSAhIW9wdGlvbnMud2l0aENyZWRlbnRpYWxzO1xyXG5cdFx0b3B0aW9ucy50aW1lb3V0ID0gJ3RpbWVvdXQnIGluIG9wdGlvbnMgPyBwYXJzZUludChvcHRpb25zLnRpbWVvdXQsIDEwKSA6IDMwMDAwO1xyXG5cdFx0b3B0aW9ucy5hdHRlbXB0cyA9ICdhdHRlbXB0cycgaW4gb3B0aW9ucyA/IHBhcnNlSW50KG9wdGlvbnMuYXR0ZW1wdHMsIDEwKSA6IDE7XHJcblxyXG5cdFx0Ly8gR3Vlc3MgaWYgd2UncmUgZGVhbGluZyB3aXRoIGEgY3Jvc3Mtb3JpZ2luIHJlcXVlc3RcclxuXHRcdGkgPSB1cmwubWF0Y2goL1xcL1xcLyguKz8pXFwvLyk7XHJcblx0XHRjcm9zc09yaWdpbiA9IGkgJiYgKGlbMV0gPyBpWzFdICE9IGxvY2F0aW9uLmhvc3QgOiBmYWxzZSk7XHJcblxyXG5cdFx0Ly8gUHJlcGFyZSBkYXRhXHJcblx0XHRpZignQXJyYXlCdWZmZXInIGluIGdsb2JhbCAmJiBkYXRhIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpIHtcclxuXHRcdFx0b3B0aW9ucy5kYXRhVHlwZSA9ICdhcnJheWJ1ZmZlcic7XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmKCdCbG9iJyBpbiBnbG9iYWwgJiYgZGF0YSBpbnN0YW5jZW9mIEJsb2IpIHtcclxuXHRcdFx0b3B0aW9ucy5kYXRhVHlwZSA9ICdibG9iJztcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYoJ0RvY3VtZW50JyBpbiBnbG9iYWwgJiYgZGF0YSBpbnN0YW5jZW9mIERvY3VtZW50KSB7XHJcblx0XHRcdG9wdGlvbnMuZGF0YVR5cGUgPSAnZG9jdW1lbnQnO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZignRm9ybURhdGEnIGluIGdsb2JhbCAmJiBkYXRhIGluc3RhbmNlb2YgRm9ybURhdGEpIHtcclxuXHRcdFx0b3B0aW9ucy5kYXRhVHlwZSA9ICdmb3JtZGF0YSc7XHJcblx0XHR9XHJcblx0XHRpZihkYXRhICE9PSBudWxsKSB7XHJcblx0XHRcdHN3aXRjaChvcHRpb25zLmRhdGFUeXBlKSB7XHJcblx0XHRcdFx0Y2FzZSAnanNvbic6XHJcblx0XHRcdFx0XHRkYXRhID0gSlNPTi5zdHJpbmdpZnkoZGF0YSk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlICdwb3N0JzpcclxuXHRcdFx0XHRcdGRhdGEgPSBqcGFyYW0oZGF0YSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHQvLyBQcmVwYXJlIGhlYWRlcnNcclxuXHRcdGlmKG9wdGlvbnMuaGVhZGVycykge1xyXG5cdFx0XHR2YXIgZm9ybWF0ID0gZnVuY3Rpb24obWF0Y2gscDEscDIpIHtcclxuXHRcdFx0XHRyZXR1cm4gcDEgKyBwMi50b1VwcGVyQ2FzZSgpO1xyXG5cdFx0XHR9O1xyXG5cdFx0XHRmb3IoaSBpbiBvcHRpb25zLmhlYWRlcnMpIHtcclxuXHRcdFx0XHRoZWFkZXJzW2kucmVwbGFjZSgvKF58LSkoW14tXSkvZyxmb3JtYXQpXSA9IG9wdGlvbnMuaGVhZGVyc1tpXTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0aWYoISgnQ29udGVudC1UeXBlJyBpbiBoZWFkZXJzKSAmJiBtZXRob2QhPSdHRVQnKSB7XHJcblx0XHRcdGlmKG9wdGlvbnMuZGF0YVR5cGUgaW4gbWltZVR5cGVzKSB7XHJcblx0XHRcdFx0aWYobWltZVR5cGVzW29wdGlvbnMuZGF0YVR5cGVdKSB7XHJcblx0XHRcdFx0XHRoZWFkZXJzWydDb250ZW50LVR5cGUnXSA9IG1pbWVUeXBlc1tvcHRpb25zLmRhdGFUeXBlXTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGlmKCFoZWFkZXJzLkFjY2VwdCkge1xyXG5cdFx0XHRoZWFkZXJzLkFjY2VwdCA9IChvcHRpb25zLnJlc3BvbnNlVHlwZSBpbiBhY2NlcHQpID8gYWNjZXB0W29wdGlvbnMucmVzcG9uc2VUeXBlXSA6ICcqLyonO1xyXG5cdFx0fVxyXG5cdFx0aWYoIWNyb3NzT3JpZ2luICYmICEoJ1gtUmVxdWVzdGVkLVdpdGgnIGluIGhlYWRlcnMpKSB7IC8vICh0aGF0IGhlYWRlciBicmVha3MgaW4gbGVnYWN5IGJyb3dzZXJzIHdpdGggQ09SUylcclxuXHRcdFx0aGVhZGVyc1snWC1SZXF1ZXN0ZWQtV2l0aCddID0gJ1hNTEh0dHBSZXF1ZXN0JztcclxuXHRcdH1cclxuXHRcdGlmKCFvcHRpb25zLmNhY2hlICYmICEoJ0NhY2hlLUNvbnRyb2wnIGluIGhlYWRlcnMpKSB7XHJcblx0XHRcdGhlYWRlcnNbJ0NhY2hlLUNvbnRyb2wnXSA9ICduby1jYWNoZSc7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gUHJlcGFyZSBVUkxcclxuXHRcdGlmKG1ldGhvZCA9PSAnR0VUJyAmJiBkYXRhICYmIHR5cGVvZiBkYXRhID09ICdzdHJpbmcnKSB7XHJcblx0XHRcdHVybCArPSAoL1xcPy8udGVzdCh1cmwpPycmJzonPycpICsgZGF0YTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBTdGFydCB0aGUgcmVxdWVzdFxyXG5cdFx0aWYob3B0aW9ucy5hc3luYykge1xyXG5cdFx0XHRwcm9taXNlLnNlbmQoKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBSZXR1cm4gcHJvbWlzZVxyXG5cdFx0cmV0dXJuIHByb21pc2U7XHJcblxyXG5cdH07XHJcblx0XHJcblx0Ly8gRGVmaW5lIGV4dGVybmFsIHF3ZXN0IG9iamVjdFxyXG5cdHZhciBnZXROZXdQcm9taXNlID0gZnVuY3Rpb24ocSkge1xyXG5cdFx0XHQvLyBQcmVwYXJlXHJcblx0XHRcdHZhciBwcm9taXNlcyA9IFtdLFxyXG5cdFx0XHRcdGxvYWRpbmcgPSAwLFxyXG5cdFx0XHRcdHZhbHVlcyA9IFtdO1xyXG5cdFx0XHQvLyBDcmVhdGUgYSBuZXcgcHJvbWlzZSB0byBoYW5kbGUgYWxsIHJlcXVlc3RzXHJcblx0XHRcdHJldHVybiBwaW5reXN3ZWFyKGZ1bmN0aW9uKHBpbmt5KSB7XHJcblx0XHRcdFx0Ly8gQmFzaWMgcmVxdWVzdCBtZXRob2RcclxuXHRcdFx0XHR2YXIgbWV0aG9kX2luZGV4ID0gLTEsXHJcblx0XHRcdFx0XHRjcmVhdGVNZXRob2QgPSBmdW5jdGlvbihtZXRob2QpIHtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uKHVybCwgZGF0YSwgb3B0aW9ucywgYmVmb3JlKSB7XHJcblx0XHRcdFx0XHRcdFx0dmFyIGluZGV4ID0gKyttZXRob2RfaW5kZXg7XHJcblx0XHRcdFx0XHRcdFx0Kytsb2FkaW5nO1xyXG5cdFx0XHRcdFx0XHRcdHByb21pc2VzLnB1c2gocXdlc3QobWV0aG9kLCBwaW5reS5iYXNlICsgdXJsLCBkYXRhLCBvcHRpb25zLCBiZWZvcmUpLnRoZW4oZnVuY3Rpb24oeGhyLCByZXNwb25zZSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0dmFsdWVzW2luZGV4XSA9IGFyZ3VtZW50cztcclxuXHRcdFx0XHRcdFx0XHRcdGlmKCEtLWxvYWRpbmcpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0cGlua3kodHJ1ZSwgdmFsdWVzLmxlbmd0aCA9PSAxID8gdmFsdWVzWzBdIDogW3ZhbHVlc10pO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH0sIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0cGlua3koZmFsc2UsIGFyZ3VtZW50cyk7XHJcblx0XHRcdFx0XHRcdFx0fSkpO1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybiBwaW5reTtcclxuXHRcdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdH07XHJcblx0XHRcdFx0Ly8gRGVmaW5lIGV4dGVybmFsIEFQSVxyXG5cdFx0XHRcdHBpbmt5LmdldCA9IGNyZWF0ZU1ldGhvZCgnR0VUJyk7XHJcblx0XHRcdFx0cGlua3kucG9zdCA9IGNyZWF0ZU1ldGhvZCgnUE9TVCcpO1xyXG5cdFx0XHRcdHBpbmt5LnB1dCA9IGNyZWF0ZU1ldGhvZCgnUFVUJyk7XHJcblx0XHRcdFx0cGlua3lbJ2RlbGV0ZSddID0gY3JlYXRlTWV0aG9kKCdERUxFVEUnKTtcclxuXHRcdFx0XHRwaW5reVsnY2F0Y2gnXSA9IGZ1bmN0aW9uKGYpIHtcclxuXHRcdFx0XHRcdHJldHVybiBwaW5reS50aGVuKG51bGwsIGYpO1xyXG5cdFx0XHRcdH07XHJcblx0XHRcdFx0cGlua3kuY29tcGxldGUgPSBmdW5jdGlvbihmKSB7XHJcblx0XHRcdFx0XHR2YXIgZnVuYyA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHRmKCk7IC8vIG90aGVyd2lzZSBhcmd1bWVudHMgd2lsbCBiZSBwYXNzZWQgdG8gdGhlIGNhbGxiYWNrXHJcblx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0cmV0dXJuIHBpbmt5LnRoZW4oZnVuYywgZnVuYyk7XHJcblx0XHRcdFx0fTtcclxuXHRcdFx0XHRwaW5reS5tYXAgPSBmdW5jdGlvbih0eXBlLCB1cmwsIGRhdGEsIG9wdGlvbnMsIGJlZm9yZSkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIGNyZWF0ZU1ldGhvZCh0eXBlLnRvVXBwZXJDYXNlKCkpLmNhbGwodGhpcywgdXJsLCBkYXRhLCBvcHRpb25zLCBiZWZvcmUpO1xyXG5cdFx0XHRcdH07XHJcblx0XHRcdFx0Ly8gUG9wdWxhdGUgbWV0aG9kcyBmcm9tIGV4dGVybmFsIG9iamVjdFxyXG5cdFx0XHRcdGZvcih2YXIgcHJvcCBpbiBxKSB7XHJcblx0XHRcdFx0XHRpZighKHByb3AgaW4gcGlua3kpKSB7XHJcblx0XHRcdFx0XHRcdHBpbmt5W3Byb3BdID0gcVtwcm9wXTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Ly8gU2V0IGxhc3QgbWV0aG9kc1xyXG5cdFx0XHRcdHBpbmt5LnNlbmQgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdGZvcih2YXIgaT0wLCBqPXByb21pc2VzLmxlbmd0aDsgaTxqOyArK2kpIHtcclxuXHRcdFx0XHRcdFx0cHJvbWlzZXNbaV0uc2VuZCgpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0cmV0dXJuIHBpbmt5O1xyXG5cdFx0XHRcdH07XHJcblx0XHRcdFx0cGlua3kuYWJvcnQgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdGZvcih2YXIgaT0wLCBqPXByb21pc2VzLmxlbmd0aDsgaTxqOyArK2kpIHtcclxuXHRcdFx0XHRcdFx0cHJvbWlzZXNbaV0uYWJvcnQoKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHJldHVybiBwaW5reTtcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdHJldHVybiBwaW5reTtcclxuXHRcdFx0fSk7XHJcblx0XHR9LFxyXG5cdFx0cSA9IHtcclxuXHRcdFx0YmFzZTogJycsXHJcblx0XHRcdGdldDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0cmV0dXJuIGdldE5ld1Byb21pc2UocSkuZ2V0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcblx0XHRcdH0sXHJcblx0XHRcdHBvc3Q6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHJldHVybiBnZXROZXdQcm9taXNlKHEpLnBvc3QuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0cHV0OiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRyZXR1cm4gZ2V0TmV3UHJvbWlzZShxKS5wdXQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0J2RlbGV0ZSc6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHJldHVybiBnZXROZXdQcm9taXNlKHEpWydkZWxldGUnXS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRtYXA6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHJldHVybiBnZXROZXdQcm9taXNlKHEpLm1hcC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHR4aHIyOiB4aHIyLFxyXG5cdFx0XHRsaW1pdDogZnVuY3Rpb24oYnkpIHtcclxuXHRcdFx0XHRsaW1pdCA9IGJ5O1xyXG5cdFx0XHRcdHJldHVybiBxO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRzZXREZWZhdWx0T3B0aW9uczogZnVuY3Rpb24ob3B0aW9ucykge1xyXG5cdFx0XHRcdGRlZmF1bHRPcHRpb25zID0gb3B0aW9ucztcclxuXHRcdFx0XHRyZXR1cm4gcTtcclxuXHRcdFx0fSxcclxuXHRcdFx0c2V0RGVmYXVsdFhkclJlc3BvbnNlVHlwZTogZnVuY3Rpb24odHlwZSkge1xyXG5cdFx0XHRcdGRlZmF1bHRYZHJSZXNwb25zZVR5cGUgPSB0eXBlLnRvTG93ZXJDYXNlKCk7XHJcblx0XHRcdFx0cmV0dXJuIHE7XHJcblx0XHRcdH0sXHJcblx0XHRcdHNldERlZmF1bHREYXRhVHlwZTogZnVuY3Rpb24odHlwZSkge1xyXG5cdFx0XHRcdGRlZmF1bHREYXRhVHlwZSA9IHR5cGUudG9Mb3dlckNhc2UoKTtcclxuXHRcdFx0XHRyZXR1cm4gcTtcclxuXHRcdFx0fSxcclxuXHRcdFx0Z2V0T3BlblJlcXVlc3RzOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRyZXR1cm4gcmVxdWVzdHM7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblx0XHJcblx0cmV0dXJuIHE7XHJcblxyXG59KCk7XHJcbiIsImNvbnN0IHJlc3QgPSByZXF1aXJlKCdxd2VzdCcpXHJcblxyXG4vLyBjb25zb2xlLmxvZyhcInJlc3RcIilcclxucmVzdC5nZXQoJy9hcGkvdG9kb3MnKVxyXG4gICAgLnRoZW4oZnVuY3Rpb24oeGhyLCByZXNwb25zZSkge1xyXG5cdFx0XHQvLyBjb25zb2xlLmxvZyhyZXNwb25zZSlcclxuXHRcdFx0Ly8gY29uc29sZS50YWJsZShyZXNwb25zZSlcclxuXHRcdFx0cmVuZGVyKHJlc3BvbnNlKVxyXG4gICAgfSlcclxuXHJcbi8vIHJlbmRlcih0YXNrcylcclxuXHJcbmZ1bmN0aW9uIHJlbmRlcih0b2Rvcykge1xyXG5cdGNvbnNvbGUubG9nKCdHZXQgdG9kb3MnKVxyXG4gICAgICAgIHRvZG9zLmZvckVhY2goZnVuY3Rpb24odG9kbyl7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnR2VuIHRhc2snKVxyXG4gICAgICAgICAgLy8gRG9kYW5pZSBxdWVzdGEgZG8gbWHFgmVqIGxpc3R5XHJcbiAgICAgICAgICB2YXIgY2F0Q2xhc3MgPSBcIi5jYXRfXCIrdG9kby5jYXRlZ29yeVxyXG4gICAgICAgICAgY29uc29sZS5sb2coY2F0Q2xhc3MpXHJcbiAgICAgICAgICB2YXIgbGlzdENhdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoY2F0Q2xhc3MpXHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnQ2F0ZWdvcnkgZm91bmQnKVxyXG4gICAgICAgICAgdmFyIGxpZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlcIilcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdlbGVtZW50IGNyZWF0ZWQnKVxyXG4gICAgICAgICAgbGllbC50ZXh0Q29udGVudCA9IHRvZG8udGl0bGVcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCduaWNlIHRpdGxlIGFkZGVkJylcclxuICAgICAgICAgIGxpc3RDYXQuYXBwZW5kQ2hpbGQobGllbClcclxuICAgICAgICAgIGNvbnNvbGUubG9nKFwiUmVuZGVyIGxpc3RcIilcclxuICAgICAgICAgIC8vIEJveCBzemN6ZWfDs8WCw7N3IHF1ZXN0YVxyXG4gICAgICAgICAgdmFyIGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubWFpbl9xdWVzdHNfZGV0YWlsc1wiKVxyXG4gICAgICAgICAgLy8gRWxlbWVudCB6YXdpZXJhasSFY3kgemFkYW5pZVxyXG4gICAgICAgICAgdmFyIGJveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaVwiKVxyXG4gICAgICAgICAgdmFyIGhlYWRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoZWFkZXJcIilcclxuICAgICAgICAgIHZhciB0aXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoMVwiKVxyXG5cdFx0XHRcdFx0dmFyIGNvbnRlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKVxyXG5cdFx0XHRcdFx0dmFyIGRvbmVUYXNrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpXHJcbiAgICAgICAgICB2YXIgZGVsZXRlVGFzayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIilcclxuICAgICAgICAgIGRlbGV0ZVRhc2sudGV4dENvbnRlbnQgPSBcIlVzdcWEIFphZGFuaWVcIlxyXG4gICAgICAgICAgdmFyIG1vdmVUYXNrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKVxyXG4gICAgICAgICAgbW92ZVRhc2sudGV4dENvbnRlbnQgPSBcIlByemVuaWXFmyBaYWRhbmllXCJcclxuICAgICAgICAgIHZhciBlZGl0VGFzayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIilcclxuICAgICAgICAgIGVkaXRUYXNrLnRleHRDb250ZW50ID0gXCJFZHl0dWogWmFkYW5pZVwiXHJcbiAgICAgICAgICB2YXIgdGFza09wdGlvbnMgID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKVxyXG4gICAgICAgICAgY29uc29sZS5sb2coXCJBZGQgY2xhc3Nlc1wiKTtcclxuICAgICAgICAgIHRhc2tPcHRpb25zLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwicXVlc3RfZGV0YWlsc19vcHRpb25zXCIpXHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhcImJyZWFrXCIpO1xyXG4gICAgICAgICAgLy8gT3BjamUgZG90eWN6xIVjZSB6YWRhbmlhXHJcbiAgICAgICAgICB0YXNrT3B0aW9ucy5hcHBlbmRDaGlsZChtb3ZlVGFzaylcclxuICAgICAgICAgIHRhc2tPcHRpb25zLmFwcGVuZENoaWxkKGRlbGV0ZVRhc2spXHJcbiAgICAgICAgICB0YXNrT3B0aW9ucy5hcHBlbmRDaGlsZChlZGl0VGFzaylcclxuICAgICAgICAgIHRpdGxlLnRleHRDb250ZW50ID0gdG9kby50aXRsZVxyXG5cdFx0XHRcdFx0Y29udGVudC50ZXh0Q29udGVudCA9IHRvZG8uY29udGVudFxyXG4gICAgICAgICAgY29uc29sZS5sb2coXCJBZGQgdGV4dFwiKTtcclxuICAgICAgICAgIGhlYWRlci5hcHBlbmRDaGlsZCh0aXRsZSlcclxuXHRcdFx0XHRcdGJveC5hcHBlbmRDaGlsZChoZWFkZXIpXHJcblx0XHRcdFx0XHRib3guYXBwZW5kQ2hpbGQoY29udGVudClcclxuXHRcdFx0XHRcdGJveC5hcHBlbmRDaGlsZCh0YXNrT3B0aW9ucylcclxuICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChib3gpXHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnUmVuZGVyIHRhc2snKVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH1cclxuICAgICAgLy9yZW5kZXIoKTtcclxuIl19
