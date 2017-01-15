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

console.log("rest")
rest.get('/api/todos')
    .then(function(xhr, response) {
			console.log(response)
			console.table(response)
			render(response)
    })
		
		var tasks = [
{
	id: "1",
	category: "Glowne",
	title: "Przynieść Gnarowi 10 wilczych skór",
	content: "Ork kolekcjonuje skóry i skupuje każde ilości. Chętnie kupi 10 skór -Zdobądź 10 wilczych skór -Sprzedaj skory Gnarowi",
	done: true,
},
{
	id: "2",
	category: "Poboczne",
	title: "Mięso dla ekipy",
	content: "Ork kolekcjonuje skóry i skupuje każde ilości. Chętnie kupi 10 skór -Zdobądź 10 wilczych skór -Sprzedaj skory Gnarowi",
	done: false,
},
{
	id: "3",
	category: "Zlecenia",
	title: "Przynieść Gnarowi 10 wilczych skór",
	content: "Ork kolekcjonuje skóry i skupuje każde ilości. Chętnie kupi 10 skór -Zdobądź 10 wilczych skór -Sprzedaj skory Gnarowi",
	done: true,
}
]

//render(tasks)

function render(todos) {
	console.log('Get todos')
        todos.forEach(function(todo){
					console.log('Gen task')
          var container = document.querySelector("#render")
          var box = document.createElement("div")
          var title = document.createElement("h2")
					var content = document.createElement("p")
          title.textContent = todo.title
					content.textContent = todo.content
          box.appendChild(title)
					box.appendChild(content)
          container.appendChild(box)
					console.log('Render task')
        })
      }
      //render();

},{"qwest":4}]},{},[5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvanF1ZXJ5LXBhcmFtL2pxdWVyeS1wYXJhbS5qcyIsIm5vZGVfbW9kdWxlcy9waW5reXN3ZWFyL3Bpbmt5c3dlYXIuanMiLCJub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL3F3ZXN0L3NyYy9xd2VzdC5qcyIsInB1YmxpYy9hc3NldHMvanMvYXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3JIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcmZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiAqIEBwcmVzZXJ2ZSBqcXVlcnktcGFyYW0gKGMpIDIwMTUgS05PV0xFREdFQ09ERSB8IE1JVFxuICovXG4vKmdsb2JhbCBkZWZpbmUgKi9cbihmdW5jdGlvbiAoZ2xvYmFsKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgdmFyIHBhcmFtID0gZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgdmFyIGFkZCA9IGZ1bmN0aW9uIChzLCBrLCB2KSB7XG4gICAgICAgICAgICB2ID0gdHlwZW9mIHYgPT09ICdmdW5jdGlvbicgPyB2KCkgOiB2ID09PSBudWxsID8gJycgOiB2ID09PSB1bmRlZmluZWQgPyAnJyA6IHY7XG4gICAgICAgICAgICBzW3MubGVuZ3RoXSA9IGVuY29kZVVSSUNvbXBvbmVudChrKSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudCh2KTtcbiAgICAgICAgfSwgYnVpbGRQYXJhbXMgPSBmdW5jdGlvbiAocHJlZml4LCBvYmosIHMpIHtcbiAgICAgICAgICAgIHZhciBpLCBsZW4sIGtleTtcblxuICAgICAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBBcnJheV0nKSB7XG4gICAgICAgICAgICAgICAgZm9yIChpID0gMCwgbGVuID0gb2JqLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGJ1aWxkUGFyYW1zKHByZWZpeCArICdbJyArICh0eXBlb2Ygb2JqW2ldID09PSAnb2JqZWN0JyA/IGkgOiAnJykgKyAnXScsIG9ialtpXSwgcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChvYmogJiYgb2JqLnRvU3RyaW5nKCkgPT09ICdbb2JqZWN0IE9iamVjdF0nKSB7XG4gICAgICAgICAgICAgICAgZm9yIChrZXkgaW4gb2JqKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByZWZpeCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1aWxkUGFyYW1zKHByZWZpeCArICdbJyArIGtleSArICddJywgb2JqW2tleV0sIHMsIGFkZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1aWxkUGFyYW1zKGtleSwgb2JqW2tleV0sIHMsIGFkZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHByZWZpeCkge1xuICAgICAgICAgICAgICAgIGFkZChzLCBwcmVmaXgsIG9iaik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZvciAoa2V5IGluIG9iaikge1xuICAgICAgICAgICAgICAgICAgICBhZGQocywga2V5LCBvYmpba2V5XSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHM7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBidWlsZFBhcmFtcygnJywgYSwgW10pLmpvaW4oJyYnKS5yZXBsYWNlKC8lMjAvZywgJysnKTtcbiAgICB9O1xuXG4gICAgaWYgKHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUuZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBwYXJhbTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICBkZWZpbmUoW10sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXJhbTtcbiAgICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZ2xvYmFsLnBhcmFtID0gcGFyYW07XG4gICAgfVxuXG59KHRoaXMpKTtcbiIsIi8qXG4gKiBQaW5reVN3ZWFyLmpzIDIuMi4yIC0gTWluaW1hbGlzdGljIGltcGxlbWVudGF0aW9uIG9mIHRoZSBQcm9taXNlcy9BKyBzcGVjXG4gKiBcbiAqIFB1YmxpYyBEb21haW4uIFVzZSwgbW9kaWZ5IGFuZCBkaXN0cmlidXRlIGl0IGFueSB3YXkgeW91IGxpa2UuIE5vIGF0dHJpYnV0aW9uIHJlcXVpcmVkLlxuICpcbiAqIE5PIFdBUlJBTlRZIEVYUFJFU1NFRCBPUiBJTVBMSUVELiBVU0UgQVQgWU9VUiBPV04gUklTSy5cbiAqXG4gKiBQaW5reVN3ZWFyIGlzIGEgdmVyeSBzbWFsbCBpbXBsZW1lbnRhdGlvbiBvZiB0aGUgUHJvbWlzZXMvQSsgc3BlY2lmaWNhdGlvbi4gQWZ0ZXIgY29tcGlsYXRpb24gd2l0aCB0aGVcbiAqIEdvb2dsZSBDbG9zdXJlIENvbXBpbGVyIGFuZCBnemlwcGluZyBpdCB3ZWlnaHMgbGVzcyB0aGFuIDUwMCBieXRlcy4gSXQgaXMgYmFzZWQgb24gdGhlIGltcGxlbWVudGF0aW9uIGZvciBcbiAqIE1pbmlmaWVkLmpzIGFuZCBzaG91bGQgYmUgcGVyZmVjdCBmb3IgZW1iZWRkaW5nLiBcbiAqXG4gKlxuICogUGlua3lTd2VhciBoYXMganVzdCB0aHJlZSBmdW5jdGlvbnMuXG4gKlxuICogVG8gY3JlYXRlIGEgbmV3IHByb21pc2UgaW4gcGVuZGluZyBzdGF0ZSwgY2FsbCBwaW5reVN3ZWFyKCk6XG4gKiAgICAgICAgIHZhciBwcm9taXNlID0gcGlua3lTd2VhcigpO1xuICpcbiAqIFRoZSByZXR1cm5lZCBvYmplY3QgaGFzIGEgUHJvbWlzZXMvQSsgY29tcGF0aWJsZSB0aGVuKCkgaW1wbGVtZW50YXRpb246XG4gKiAgICAgICAgICBwcm9taXNlLnRoZW4oZnVuY3Rpb24odmFsdWUpIHsgYWxlcnQoXCJTdWNjZXNzIVwiKTsgfSwgZnVuY3Rpb24odmFsdWUpIHsgYWxlcnQoXCJGYWlsdXJlIVwiKTsgfSk7XG4gKlxuICpcbiAqIFRoZSBwcm9taXNlIHJldHVybmVkIGJ5IHBpbmt5U3dlYXIoKSBpcyBhIGZ1bmN0aW9uLiBUbyBmdWxmaWxsIHRoZSBwcm9taXNlLCBjYWxsIHRoZSBmdW5jdGlvbiB3aXRoIHRydWUgYXMgZmlyc3QgYXJndW1lbnQgYW5kXG4gKiBhbiBvcHRpb25hbCBhcnJheSBvZiB2YWx1ZXMgdG8gcGFzcyB0byB0aGUgdGhlbigpIGhhbmRsZXIuIEJ5IHB1dHRpbmcgbW9yZSB0aGFuIG9uZSB2YWx1ZSBpbiB0aGUgYXJyYXksIHlvdSBjYW4gcGFzcyBtb3JlIHRoYW4gb25lXG4gKiB2YWx1ZSB0byB0aGUgdGhlbigpIGhhbmRsZXJzLiBIZXJlIGFuIGV4YW1wbGUgdG8gZnVsZmlsbCBhIHByb21zaXNlLCB0aGlzIHRpbWUgd2l0aCBvbmx5IG9uZSBhcmd1bWVudDogXG4gKiAgICAgICAgIHByb21pc2UodHJ1ZSwgWzQyXSk7XG4gKlxuICogV2hlbiB0aGUgcHJvbWlzZSBoYXMgYmVlbiByZWplY3RlZCwgY2FsbCBpdCB3aXRoIGZhbHNlLiBBZ2FpbiwgdGhlcmUgbWF5IGJlIG1vcmUgdGhhbiBvbmUgYXJndW1lbnQgZm9yIHRoZSB0aGVuKCkgaGFuZGxlcjpcbiAqICAgICAgICAgcHJvbWlzZSh0cnVlLCBbNiwgNiwgNl0pO1xuICogICAgICAgICBcbiAqIFlvdSBjYW4gb2J0YWluIHRoZSBwcm9taXNlJ3MgY3VycmVudCBzdGF0ZSBieSBjYWxsaW5nIHRoZSBmdW5jdGlvbiB3aXRob3V0IGFyZ3VtZW50cy4gSXQgd2lsbCBiZSB0cnVlIGlmIGZ1bGZpbGxlZCxcbiAqIGZhbHNlIGlmIHJlamVjdGVkLCBhbmQgb3RoZXJ3aXNlIHVuZGVmaW5lZC5cbiAqIFx0XHQgICB2YXIgc3RhdGUgPSBwcm9taXNlKCk7IFxuICogXG4gKiBodHRwczovL2dpdGh1Yi5jb20vdGltamFuc2VuL1Bpbmt5U3dlYXIuanNcbiAqL1xuKGZ1bmN0aW9uKHRhcmdldCkge1xuXHR2YXIgdW5kZWY7XG5cblx0ZnVuY3Rpb24gaXNGdW5jdGlvbihmKSB7XG5cdFx0cmV0dXJuIHR5cGVvZiBmID09ICdmdW5jdGlvbic7XG5cdH1cblx0ZnVuY3Rpb24gaXNPYmplY3QoZikge1xuXHRcdHJldHVybiB0eXBlb2YgZiA9PSAnb2JqZWN0Jztcblx0fVxuXHRmdW5jdGlvbiBkZWZlcihjYWxsYmFjaykge1xuXHRcdGlmICh0eXBlb2Ygc2V0SW1tZWRpYXRlICE9ICd1bmRlZmluZWQnKVxuXHRcdFx0c2V0SW1tZWRpYXRlKGNhbGxiYWNrKTtcblx0XHRlbHNlIGlmICh0eXBlb2YgcHJvY2VzcyAhPSAndW5kZWZpbmVkJyAmJiBwcm9jZXNzWyduZXh0VGljayddKVxuXHRcdFx0cHJvY2Vzc1snbmV4dFRpY2snXShjYWxsYmFjayk7XG5cdFx0ZWxzZVxuXHRcdFx0c2V0VGltZW91dChjYWxsYmFjaywgMCk7XG5cdH1cblxuXHR0YXJnZXRbMF1bdGFyZ2V0WzFdXSA9IGZ1bmN0aW9uIHBpbmt5U3dlYXIoZXh0ZW5kKSB7XG5cdFx0dmFyIHN0YXRlOyAgICAgICAgICAgLy8gdW5kZWZpbmVkL251bGwgPSBwZW5kaW5nLCB0cnVlID0gZnVsZmlsbGVkLCBmYWxzZSA9IHJlamVjdGVkXG5cdFx0dmFyIHZhbHVlcyA9IFtdOyAgICAgLy8gYW4gYXJyYXkgb2YgdmFsdWVzIGFzIGFyZ3VtZW50cyBmb3IgdGhlIHRoZW4oKSBoYW5kbGVyc1xuXHRcdHZhciBkZWZlcnJlZCA9IFtdOyAgIC8vIGZ1bmN0aW9ucyB0byBjYWxsIHdoZW4gc2V0KCkgaXMgaW52b2tlZFxuXG5cdFx0dmFyIHNldCA9IGZ1bmN0aW9uKG5ld1N0YXRlLCBuZXdWYWx1ZXMpIHtcblx0XHRcdGlmIChzdGF0ZSA9PSBudWxsICYmIG5ld1N0YXRlICE9IG51bGwpIHtcblx0XHRcdFx0c3RhdGUgPSBuZXdTdGF0ZTtcblx0XHRcdFx0dmFsdWVzID0gbmV3VmFsdWVzO1xuXHRcdFx0XHRpZiAoZGVmZXJyZWQubGVuZ3RoKVxuXHRcdFx0XHRcdGRlZmVyKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkZWZlcnJlZC5sZW5ndGg7IGkrKylcblx0XHRcdFx0XHRcdFx0ZGVmZXJyZWRbaV0oKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBzdGF0ZTtcblx0XHR9O1xuXG5cdFx0c2V0Wyd0aGVuJ10gPSBmdW5jdGlvbiAob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpIHtcblx0XHRcdHZhciBwcm9taXNlMiA9IHBpbmt5U3dlYXIoZXh0ZW5kKTtcblx0XHRcdHZhciBjYWxsQ2FsbGJhY2tzID0gZnVuY3Rpb24oKSB7XG5cdCAgICBcdFx0dHJ5IHtcblx0ICAgIFx0XHRcdHZhciBmID0gKHN0YXRlID8gb25GdWxmaWxsZWQgOiBvblJlamVjdGVkKTtcblx0ICAgIFx0XHRcdGlmIChpc0Z1bmN0aW9uKGYpKSB7XG5cdFx0ICAgXHRcdFx0XHRmdW5jdGlvbiByZXNvbHZlKHgpIHtcblx0XHRcdFx0XHRcdCAgICB2YXIgdGhlbiwgY2JDYWxsZWQgPSAwO1xuXHRcdCAgIFx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHQgICBcdFx0XHRcdGlmICh4ICYmIChpc09iamVjdCh4KSB8fCBpc0Z1bmN0aW9uKHgpKSAmJiBpc0Z1bmN0aW9uKHRoZW4gPSB4Wyd0aGVuJ10pKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmICh4ID09PSBwcm9taXNlMilcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHRoZW5bJ2NhbGwnXSh4LFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGZ1bmN0aW9uKCkgeyBpZiAoIWNiQ2FsbGVkKyspIHJlc29sdmUuYXBwbHkodW5kZWYsYXJndW1lbnRzKTsgfSAsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZnVuY3Rpb24odmFsdWUpeyBpZiAoIWNiQ2FsbGVkKyspIHByb21pc2UyKGZhbHNlLFt2YWx1ZV0pO30pO1xuXHRcdFx0XHQgICBcdFx0XHRcdH1cblx0XHRcdFx0ICAgXHRcdFx0XHRlbHNlXG5cdFx0XHRcdCAgIFx0XHRcdFx0XHRwcm9taXNlMih0cnVlLCBhcmd1bWVudHMpO1xuXHRcdCAgIFx0XHRcdFx0XHR9XG5cdFx0ICAgXHRcdFx0XHRcdGNhdGNoKGUpIHtcblx0XHQgICBcdFx0XHRcdFx0XHRpZiAoIWNiQ2FsbGVkKyspXG5cdFx0ICAgXHRcdFx0XHRcdFx0XHRwcm9taXNlMihmYWxzZSwgW2VdKTtcblx0XHQgICBcdFx0XHRcdFx0fVxuXHRcdCAgIFx0XHRcdFx0fVxuXHRcdCAgIFx0XHRcdFx0cmVzb2x2ZShmLmFwcGx5KHVuZGVmLCB2YWx1ZXMgfHwgW10pKTtcblx0XHQgICBcdFx0XHR9XG5cdFx0ICAgXHRcdFx0ZWxzZVxuXHRcdCAgIFx0XHRcdFx0cHJvbWlzZTIoc3RhdGUsIHZhbHVlcyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0Y2F0Y2ggKGUpIHtcblx0XHRcdFx0XHRwcm9taXNlMihmYWxzZSwgW2VdKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHRcdGlmIChzdGF0ZSAhPSBudWxsKVxuXHRcdFx0XHRkZWZlcihjYWxsQ2FsbGJhY2tzKTtcblx0XHRcdGVsc2Vcblx0XHRcdFx0ZGVmZXJyZWQucHVzaChjYWxsQ2FsbGJhY2tzKTtcblx0XHRcdHJldHVybiBwcm9taXNlMjtcblx0XHR9O1xuICAgICAgICBpZihleHRlbmQpe1xuICAgICAgICAgICAgc2V0ID0gZXh0ZW5kKHNldCk7XG4gICAgICAgIH1cblx0XHRyZXR1cm4gc2V0O1xuXHR9O1xufSkodHlwZW9mIG1vZHVsZSA9PSAndW5kZWZpbmVkJyA/IFt3aW5kb3csICdwaW5reVN3ZWFyJ10gOiBbbW9kdWxlLCAnZXhwb3J0cyddKTtcblxuIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbi8vIGNhY2hlZCBmcm9tIHdoYXRldmVyIGdsb2JhbCBpcyBwcmVzZW50IHNvIHRoYXQgdGVzdCBydW5uZXJzIHRoYXQgc3R1YiBpdFxuLy8gZG9uJ3QgYnJlYWsgdGhpbmdzLiAgQnV0IHdlIG5lZWQgdG8gd3JhcCBpdCBpbiBhIHRyeSBjYXRjaCBpbiBjYXNlIGl0IGlzXG4vLyB3cmFwcGVkIGluIHN0cmljdCBtb2RlIGNvZGUgd2hpY2ggZG9lc24ndCBkZWZpbmUgYW55IGdsb2JhbHMuICBJdCdzIGluc2lkZSBhXG4vLyBmdW5jdGlvbiBiZWNhdXNlIHRyeS9jYXRjaGVzIGRlb3B0aW1pemUgaW4gY2VydGFpbiBlbmdpbmVzLlxuXG52YXIgY2FjaGVkU2V0VGltZW91dDtcbnZhciBjYWNoZWRDbGVhclRpbWVvdXQ7XG5cbmZ1bmN0aW9uIGRlZmF1bHRTZXRUaW1vdXQoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzZXRUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG5mdW5jdGlvbiBkZWZhdWx0Q2xlYXJUaW1lb3V0ICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NsZWFyVGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuKGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIHNldFRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIGNsZWFyVGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICB9XG59ICgpKVxuZnVuY3Rpb24gcnVuVGltZW91dChmdW4pIHtcbiAgICBpZiAoY2FjaGVkU2V0VGltZW91dCA9PT0gc2V0VGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgLy8gaWYgc2V0VGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZFNldFRpbWVvdXQgPT09IGRlZmF1bHRTZXRUaW1vdXQgfHwgIWNhY2hlZFNldFRpbWVvdXQpICYmIHNldFRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0IHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKG51bGwsIGZ1biwgMCk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbCh0aGlzLCBmdW4sIDApO1xuICAgICAgICB9XG4gICAgfVxuXG5cbn1cbmZ1bmN0aW9uIHJ1bkNsZWFyVGltZW91dChtYXJrZXIpIHtcbiAgICBpZiAoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgLy8gaWYgY2xlYXJUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBkZWZhdWx0Q2xlYXJUaW1lb3V0IHx8ICFjYWNoZWRDbGVhclRpbWVvdXQpICYmIGNsZWFyVGltZW91dCkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfSBjYXRjaCAoZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgIHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwobnVsbCwgbWFya2VyKTtcbiAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvci5cbiAgICAgICAgICAgIC8vIFNvbWUgdmVyc2lvbnMgb2YgSS5FLiBoYXZlIGRpZmZlcmVudCBydWxlcyBmb3IgY2xlYXJUaW1lb3V0IHZzIHNldFRpbWVvdXRcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbCh0aGlzLCBtYXJrZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxufVxudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgaWYgKCFkcmFpbmluZyB8fCAhY3VycmVudFF1ZXVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gcnVuVGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgcnVuQ2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgcnVuVGltZW91dChkcmFpblF1ZXVlKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsIi8qISBxd2VzdCA0LjQuNSAoaHR0cHM6Ly9naXRodWIuY29tL3B5cnNtay9xd2VzdCkgKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XHJcblxyXG5cdHZhciBnbG9iYWwgPSB0eXBlb2Ygd2luZG93ICE9ICd1bmRlZmluZWQnID8gd2luZG93IDogc2VsZixcclxuXHRcdHBpbmt5c3dlYXIgPSByZXF1aXJlKCdwaW5reXN3ZWFyJyksXHJcblx0XHRqcGFyYW0gPSByZXF1aXJlKCdqcXVlcnktcGFyYW0nKSxcclxuXHRcdGRlZmF1bHRPcHRpb25zID0ge30sXHJcblx0XHQvLyBEZWZhdWx0IHJlc3BvbnNlIHR5cGUgZm9yIFhEUiBpbiBhdXRvIG1vZGVcclxuXHRcdGRlZmF1bHRYZHJSZXNwb25zZVR5cGUgPSAnanNvbicsXHJcblx0XHQvLyBEZWZhdWx0IGRhdGEgdHlwZVxyXG5cdFx0ZGVmYXVsdERhdGFUeXBlID0gJ3Bvc3QnLFxyXG5cdFx0Ly8gVmFyaWFibGVzIGZvciBsaW1pdCBtZWNoYW5pc21cclxuXHRcdGxpbWl0ID0gbnVsbCxcclxuXHRcdHJlcXVlc3RzID0gMCxcclxuXHRcdHJlcXVlc3Rfc3RhY2sgPSBbXSxcclxuXHRcdC8vIEdldCBYTUxIdHRwUmVxdWVzdCBvYmplY3RcclxuXHRcdGdldFhIUiA9IGdsb2JhbC5YTUxIdHRwUmVxdWVzdD8gZnVuY3Rpb24oKXtcclxuXHRcdFx0cmV0dXJuIG5ldyBnbG9iYWwuWE1MSHR0cFJlcXVlc3QoKTtcclxuXHRcdH06IGZ1bmN0aW9uKCl7XHJcblx0XHRcdHJldHVybiBuZXcgQWN0aXZlWE9iamVjdCgnTWljcm9zb2Z0LlhNTEhUVFAnKTtcclxuXHRcdH0sXHJcblx0XHQvLyBHdWVzcyBYSFIgdmVyc2lvblxyXG5cdFx0eGhyMiA9IChnZXRYSFIoKS5yZXNwb25zZVR5cGU9PT0nJyksXHJcblxyXG5cdC8vIENvcmUgZnVuY3Rpb25cclxuXHRxd2VzdCA9IGZ1bmN0aW9uKG1ldGhvZCwgdXJsLCBkYXRhLCBvcHRpb25zLCBiZWZvcmUpIHtcclxuXHRcdC8vIEZvcm1hdFxyXG5cdFx0bWV0aG9kID0gbWV0aG9kLnRvVXBwZXJDYXNlKCk7XHJcblx0XHRkYXRhID0gZGF0YSB8fCBudWxsO1xyXG5cdFx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XHJcblx0XHRmb3IodmFyIG5hbWUgaW4gZGVmYXVsdE9wdGlvbnMpIHtcclxuXHRcdFx0aWYoIShuYW1lIGluIG9wdGlvbnMpKSB7XHJcblx0XHRcdFx0aWYodHlwZW9mIGRlZmF1bHRPcHRpb25zW25hbWVdID09ICdvYmplY3QnICYmIHR5cGVvZiBvcHRpb25zW25hbWVdID09ICdvYmplY3QnKSB7XHJcblx0XHRcdFx0XHRmb3IodmFyIG5hbWUyIGluIGRlZmF1bHRPcHRpb25zW25hbWVdKSB7XHJcblx0XHRcdFx0XHRcdG9wdGlvbnNbbmFtZV1bbmFtZTJdID0gZGVmYXVsdE9wdGlvbnNbbmFtZV1bbmFtZTJdO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdG9wdGlvbnNbbmFtZV0gPSBkZWZhdWx0T3B0aW9uc1tuYW1lXTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHQvLyBEZWZpbmUgdmFyaWFibGVzXHJcblx0XHR2YXIgbmF0aXZlUmVzcG9uc2VQYXJzaW5nID0gZmFsc2UsXHJcblx0XHRcdGNyb3NzT3JpZ2luLFxyXG5cdFx0XHR4aHIsXHJcblx0XHRcdHhkciA9IGZhbHNlLFxyXG5cdFx0XHR0aW1lb3V0LFxyXG5cdFx0XHRhYm9ydGVkID0gZmFsc2UsXHJcblx0XHRcdGF0dGVtcHRzID0gMCxcclxuXHRcdFx0aGVhZGVycyA9IHt9LFxyXG5cdFx0XHRtaW1lVHlwZXMgPSB7XHJcblx0XHRcdFx0dGV4dDogJyovKicsXHJcblx0XHRcdFx0eG1sOiAndGV4dC94bWwnLFxyXG5cdFx0XHRcdGpzb246ICdhcHBsaWNhdGlvbi9qc29uJyxcclxuXHRcdFx0XHRwb3N0OiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyxcclxuXHRcdFx0XHRkb2N1bWVudDogJ3RleHQvaHRtbCdcclxuXHRcdFx0fSxcclxuXHRcdFx0YWNjZXB0ID0ge1xyXG5cdFx0XHRcdHRleHQ6ICcqLyonLFxyXG5cdFx0XHRcdHhtbDogJ2FwcGxpY2F0aW9uL3htbDsgcT0xLjAsIHRleHQveG1sOyBxPTAuOCwgKi8qOyBxPTAuMScsXHJcblx0XHRcdFx0anNvbjogJ2FwcGxpY2F0aW9uL2pzb247IHE9MS4wLCB0ZXh0Lyo7IHE9MC44LCAqLyo7IHE9MC4xJ1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRpLCBqLFxyXG5cdFx0XHRyZXNwb25zZSxcclxuXHRcdFx0c2VuZGluZyA9IGZhbHNlLFxyXG5cclxuXHRcdC8vIENyZWF0ZSB0aGUgcHJvbWlzZVxyXG5cdFx0cHJvbWlzZSA9IHBpbmt5c3dlYXIoZnVuY3Rpb24ocGlua3kpIHtcclxuXHRcdFx0cGlua3kuYWJvcnQgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRpZighYWJvcnRlZCkge1xyXG5cdFx0XHRcdFx0aWYoeGhyICYmIHhoci5yZWFkeVN0YXRlICE9IDQpIHsgLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNzI4NzcwNi9pZS05LWphdmFzY3JpcHQtZXJyb3ItYzAwYzAyM2ZcclxuXHRcdFx0XHRcdFx0eGhyLmFib3J0KCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRpZihzZW5kaW5nKSB7XHJcblx0XHRcdFx0XHRcdC0tcmVxdWVzdHM7XHJcblx0XHRcdFx0XHRcdHNlbmRpbmcgPSBmYWxzZTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGFib3J0ZWQgPSB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fTtcclxuXHRcdFx0cGlua3kuc2VuZCA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdC8vIFByZXZlbnQgZnVydGhlciBzZW5kKCkgY2FsbHNcclxuXHRcdFx0XHRpZihzZW5kaW5nKSB7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdC8vIFJlYWNoZWQgcmVxdWVzdCBsaW1pdCwgZ2V0IG91dCFcclxuXHRcdFx0XHRpZihyZXF1ZXN0cyA9PSBsaW1pdCkge1xyXG5cdFx0XHRcdFx0cmVxdWVzdF9zdGFjay5wdXNoKHBpbmt5KTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Ly8gVmVyaWZ5IGlmIHRoZSByZXF1ZXN0IGhhcyBub3QgYmVlbiBwcmV2aW91c2x5IGFib3J0ZWRcclxuXHRcdFx0XHRpZihhYm9ydGVkKSB7XHJcblx0XHRcdFx0XHRpZihyZXF1ZXN0X3N0YWNrLmxlbmd0aCkge1xyXG5cdFx0XHRcdFx0XHRyZXF1ZXN0X3N0YWNrLnNoaWZ0KCkuc2VuZCgpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQvLyBUaGUgc2VuZGluZyBpcyBydW5uaW5nXHJcblx0XHRcdFx0KytyZXF1ZXN0cztcclxuXHRcdFx0XHRzZW5kaW5nID0gdHJ1ZTtcclxuXHRcdFx0XHQvLyBHZXQgWEhSIG9iamVjdFxyXG5cdFx0XHRcdHhociA9IGdldFhIUigpO1xyXG5cdFx0XHRcdGlmKGNyb3NzT3JpZ2luKSB7XHJcblx0XHRcdFx0XHRpZighKCd3aXRoQ3JlZGVudGlhbHMnIGluIHhocikgJiYgZ2xvYmFsLlhEb21haW5SZXF1ZXN0KSB7XHJcblx0XHRcdFx0XHRcdHhociA9IG5ldyBYRG9tYWluUmVxdWVzdCgpOyAvLyBDT1JTIHdpdGggSUU4LzlcclxuXHRcdFx0XHRcdFx0eGRyID0gdHJ1ZTtcclxuXHRcdFx0XHRcdFx0aWYobWV0aG9kICE9ICdHRVQnICYmIG1ldGhvZCAhPSAnUE9TVCcpIHtcclxuXHRcdFx0XHRcdFx0XHRtZXRob2QgPSAnUE9TVCc7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Ly8gT3BlbiBjb25uZWN0aW9uXHJcblx0XHRcdFx0aWYoeGRyKSB7XHJcblx0XHRcdFx0XHR4aHIub3BlbihtZXRob2QsIHVybCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0eGhyLm9wZW4obWV0aG9kLCB1cmwsIG9wdGlvbnMuYXN5bmMsIG9wdGlvbnMudXNlciwgb3B0aW9ucy5wYXNzd29yZCk7XHJcblx0XHRcdFx0XHRpZih4aHIyICYmIG9wdGlvbnMuYXN5bmMpIHtcclxuXHRcdFx0XHRcdFx0eGhyLndpdGhDcmVkZW50aWFscyA9IG9wdGlvbnMud2l0aENyZWRlbnRpYWxzO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQvLyBTZXQgaGVhZGVyc1xyXG5cdFx0XHRcdGlmKCF4ZHIpIHtcclxuXHRcdFx0XHRcdGZvcih2YXIgaSBpbiBoZWFkZXJzKSB7XHJcblx0XHRcdFx0XHRcdGlmKGhlYWRlcnNbaV0pIHtcclxuXHRcdFx0XHRcdFx0XHR4aHIuc2V0UmVxdWVzdEhlYWRlcihpLCBoZWFkZXJzW2ldKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQvLyBWZXJpZnkgaWYgdGhlIHJlc3BvbnNlIHR5cGUgaXMgc3VwcG9ydGVkIGJ5IHRoZSBjdXJyZW50IGJyb3dzZXJcclxuXHRcdFx0XHRpZih4aHIyICYmIG9wdGlvbnMucmVzcG9uc2VUeXBlICE9ICdhdXRvJykge1xyXG5cdFx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdFx0eGhyLnJlc3BvbnNlVHlwZSA9IG9wdGlvbnMucmVzcG9uc2VUeXBlO1xyXG5cdFx0XHRcdFx0XHRuYXRpdmVSZXNwb25zZVBhcnNpbmcgPSAoeGhyLnJlc3BvbnNlVHlwZSA9PSBvcHRpb25zLnJlc3BvbnNlVHlwZSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRjYXRjaChlKSB7fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQvLyBQbHVnIHJlc3BvbnNlIGhhbmRsZXJcclxuXHRcdFx0XHRpZih4aHIyIHx8IHhkcikge1xyXG5cdFx0XHRcdFx0eGhyLm9ubG9hZCA9IGhhbmRsZVJlc3BvbnNlO1xyXG5cdFx0XHRcdFx0eGhyLm9uZXJyb3IgPSBoYW5kbGVFcnJvcjtcclxuXHRcdFx0XHRcdC8vIGh0dHA6Ly9jeXByZXNzbm9ydGguY29tL3Byb2dyYW1taW5nL2ludGVybmV0LWV4cGxvcmVyLWFib3J0aW5nLWFqYXgtcmVxdWVzdHMtZml4ZWQvXHJcblx0XHRcdFx0XHRpZih4ZHIpIHtcclxuXHRcdFx0XHRcdFx0eGhyLm9ucHJvZ3Jlc3MgPSBmdW5jdGlvbigpIHt9O1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0aWYoeGhyLnJlYWR5U3RhdGUgPT0gNCkge1xyXG5cdFx0XHRcdFx0XHRcdGhhbmRsZVJlc3BvbnNlKCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdC8vIFBsdWcgdGltZW91dFxyXG5cdFx0XHRcdGlmKG9wdGlvbnMuYXN5bmMpIHtcclxuXHRcdFx0XHRcdGlmKCd0aW1lb3V0JyBpbiB4aHIpIHtcclxuXHRcdFx0XHRcdFx0eGhyLnRpbWVvdXQgPSBvcHRpb25zLnRpbWVvdXQ7XHJcblx0XHRcdFx0XHRcdHhoci5vbnRpbWVvdXQgPSBoYW5kbGVUaW1lb3V0O1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRcdHRpbWVvdXQgPSBzZXRUaW1lb3V0KGhhbmRsZVRpbWVvdXQsIG9wdGlvbnMudGltZW91dCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdC8vIGh0dHA6Ly9jeXByZXNzbm9ydGguY29tL3Byb2dyYW1taW5nL2ludGVybmV0LWV4cGxvcmVyLWFib3J0aW5nLWFqYXgtcmVxdWVzdHMtZml4ZWQvXHJcblx0XHRcdFx0ZWxzZSBpZih4ZHIpIHtcclxuXHRcdFx0XHRcdHhoci5vbnRpbWVvdXQgPSBmdW5jdGlvbigpIHt9O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQvLyBPdmVycmlkZSBtaW1lIHR5cGUgdG8gZW5zdXJlIHRoZSByZXNwb25zZSBpcyB3ZWxsIHBhcnNlZFxyXG5cdFx0XHRcdGlmKG9wdGlvbnMucmVzcG9uc2VUeXBlICE9ICdhdXRvJyAmJiAnb3ZlcnJpZGVNaW1lVHlwZScgaW4geGhyKSB7XHJcblx0XHRcdFx0XHR4aHIub3ZlcnJpZGVNaW1lVHlwZShtaW1lVHlwZXNbb3B0aW9ucy5yZXNwb25zZVR5cGVdKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Ly8gUnVuICdiZWZvcmUnIGNhbGxiYWNrXHJcblx0XHRcdFx0aWYoYmVmb3JlKSB7XHJcblx0XHRcdFx0XHRiZWZvcmUoeGhyKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Ly8gU2VuZCByZXF1ZXN0XHJcblx0XHRcdFx0aWYoeGRyKSB7XHJcblx0XHRcdFx0XHQvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvWERvbWFpblJlcXVlc3RcclxuXHRcdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdHhoci5zZW5kKG1ldGhvZCAhPSAnR0VUJz8gZGF0YSA6IG51bGwpO1xyXG5cdFx0XHRcdFx0fSwgMCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0eGhyLnNlbmQobWV0aG9kICE9ICdHRVQnID8gZGF0YSA6IG51bGwpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fTtcclxuXHRcdFx0cmV0dXJuIHBpbmt5O1xyXG5cdFx0fSksXHJcblxyXG5cdFx0Ly8gSGFuZGxlIHRoZSByZXNwb25zZVxyXG5cdFx0aGFuZGxlUmVzcG9uc2UgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIGksIHJlc3BvbnNlVHlwZTtcclxuXHRcdFx0Ly8gU3RvcCBzZW5kaW5nIHN0YXRlXHJcblx0XHRcdHNlbmRpbmcgPSBmYWxzZTtcclxuXHRcdFx0Y2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xyXG5cdFx0XHQvLyBMYXVuY2ggbmV4dCBzdGFja2VkIHJlcXVlc3RcclxuXHRcdFx0aWYocmVxdWVzdF9zdGFjay5sZW5ndGgpIHtcclxuXHRcdFx0XHRyZXF1ZXN0X3N0YWNrLnNoaWZ0KCkuc2VuZCgpO1xyXG5cdFx0XHR9XHJcblx0XHRcdC8vIFZlcmlmeSBpZiB0aGUgcmVxdWVzdCBoYXMgbm90IGJlZW4gcHJldmlvdXNseSBhYm9ydGVkXHJcblx0XHRcdGlmKGFib3J0ZWQpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0Ly8gRGVjcmVhc2UgdGhlIG51bWJlciBvZiByZXF1ZXN0c1xyXG5cdFx0XHQtLXJlcXVlc3RzO1xyXG5cdFx0XHQvLyBIYW5kbGUgcmVzcG9uc2VcclxuXHRcdFx0dHJ5e1xyXG5cdFx0XHRcdC8vIFByb2Nlc3MgcmVzcG9uc2VcclxuXHRcdFx0XHRpZihuYXRpdmVSZXNwb25zZVBhcnNpbmcpIHtcclxuXHRcdFx0XHRcdGlmKCdyZXNwb25zZScgaW4geGhyICYmIHhoci5yZXNwb25zZSA9PT0gbnVsbCkge1xyXG5cdFx0XHRcdFx0XHR0aHJvdyAnVGhlIHJlcXVlc3QgcmVzcG9uc2UgaXMgZW1wdHknO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0cmVzcG9uc2UgPSB4aHIucmVzcG9uc2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0Ly8gR3Vlc3MgcmVzcG9uc2UgdHlwZVxyXG5cdFx0XHRcdFx0cmVzcG9uc2VUeXBlID0gb3B0aW9ucy5yZXNwb25zZVR5cGU7XHJcblx0XHRcdFx0XHRpZihyZXNwb25zZVR5cGUgPT0gJ2F1dG8nKSB7XHJcblx0XHRcdFx0XHRcdGlmKHhkcikge1xyXG5cdFx0XHRcdFx0XHRcdHJlc3BvbnNlVHlwZSA9IGRlZmF1bHRYZHJSZXNwb25zZVR5cGU7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0dmFyIGN0ID0geGhyLmdldFJlc3BvbnNlSGVhZGVyKCdDb250ZW50LVR5cGUnKSB8fCAnJztcclxuXHRcdFx0XHRcdFx0XHRpZihjdC5pbmRleE9mKG1pbWVUeXBlcy5qc29uKT4tMSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0cmVzcG9uc2VUeXBlID0gJ2pzb24nO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmKGN0LmluZGV4T2YobWltZVR5cGVzLnhtbCkgPiAtMSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0cmVzcG9uc2VUeXBlID0gJ3htbCc7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0cmVzcG9uc2VUeXBlID0gJ3RleHQnO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0Ly8gSGFuZGxlIHJlc3BvbnNlIHR5cGVcclxuXHRcdFx0XHRcdHN3aXRjaChyZXNwb25zZVR5cGUpIHtcclxuXHRcdFx0XHRcdFx0Y2FzZSAnanNvbic6XHJcblx0XHRcdFx0XHRcdFx0aWYoeGhyLnJlc3BvbnNlVGV4dC5sZW5ndGgpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmKCdKU09OJyBpbiBnbG9iYWwpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRyZXNwb25zZSA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0cmVzcG9uc2UgPSBuZXcgRnVuY3Rpb24oJ3JldHVybiAoJyArIHhoci5yZXNwb25zZVRleHQgKyAnKScpKCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdGNhdGNoKGUpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0dGhyb3cgXCJFcnJvciB3aGlsZSBwYXJzaW5nIEpTT04gYm9keSA6IFwiK2U7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRjYXNlICd4bWwnOlxyXG5cdFx0XHRcdFx0XHRcdC8vIEJhc2VkIG9uIGpRdWVyeSdzIHBhcnNlWE1MKCkgZnVuY3Rpb25cclxuXHRcdFx0XHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gU3RhbmRhcmRcclxuXHRcdFx0XHRcdFx0XHRcdGlmKGdsb2JhbC5ET01QYXJzZXIpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0cmVzcG9uc2UgPSAobmV3IERPTVBhcnNlcigpKS5wYXJzZUZyb21TdHJpbmcoeGhyLnJlc3BvbnNlVGV4dCwndGV4dC94bWwnKTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdC8vIElFPDlcclxuXHRcdFx0XHRcdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRyZXNwb25zZSA9IG5ldyBBY3RpdmVYT2JqZWN0KCdNaWNyb3NvZnQuWE1MRE9NJyk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHJlc3BvbnNlLmFzeW5jID0gJ2ZhbHNlJztcclxuXHRcdFx0XHRcdFx0XHRcdFx0cmVzcG9uc2UubG9hZFhNTCh4aHIucmVzcG9uc2VUZXh0KTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0Y2F0Y2goZSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0cmVzcG9uc2UgPSB1bmRlZmluZWQ7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdGlmKCFyZXNwb25zZSB8fCAhcmVzcG9uc2UuZG9jdW1lbnRFbGVtZW50IHx8IHJlc3BvbnNlLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdwYXJzZXJlcnJvcicpLmxlbmd0aCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0dGhyb3cgJ0ludmFsaWQgWE1MJztcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdGRlZmF1bHQ6XHJcblx0XHRcdFx0XHRcdFx0cmVzcG9uc2UgPSB4aHIucmVzcG9uc2VUZXh0O1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQvLyBMYXRlIHN0YXR1cyBjb2RlIHZlcmlmaWNhdGlvbiB0byBhbGxvdyBwYXNzaW5nIGRhdGEgd2hlbiwgcGVyIGV4YW1wbGUsIGEgNDA5IGlzIHJldHVybmVkXHJcblx0XHRcdFx0Ly8gLS0tIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzEwMDQ2OTcyL21zaWUtcmV0dXJucy1zdGF0dXMtY29kZS1vZi0xMjIzLWZvci1hamF4LXJlcXVlc3RcclxuXHRcdFx0XHRpZignc3RhdHVzJyBpbiB4aHIgJiYgIS9eMnwxMjIzLy50ZXN0KHhoci5zdGF0dXMpKSB7XHJcblx0XHRcdFx0XHR0aHJvdyB4aHIuc3RhdHVzICsgJyAoJyArIHhoci5zdGF0dXNUZXh0ICsgJyknO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQvLyBGdWxmaWxsZWRcclxuXHRcdFx0XHRwcm9taXNlKHRydWUsIFt4aHIsIHJlc3BvbnNlXSk7XHJcblx0XHRcdH1cclxuXHRcdFx0Y2F0Y2goZSkge1xyXG5cdFx0XHRcdC8vIFJlamVjdGVkXHJcblx0XHRcdFx0cHJvbWlzZShmYWxzZSwgW2UsIHhociwgcmVzcG9uc2VdKTtcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHJcblx0XHQvLyBIYW5kbGUgZXJyb3JzXHJcblx0XHRoYW5kbGVFcnJvciA9IGZ1bmN0aW9uKG1lc3NhZ2UpIHtcclxuXHRcdFx0aWYoIWFib3J0ZWQpIHtcclxuXHRcdFx0XHRtZXNzYWdlID0gdHlwZW9mIG1lc3NhZ2UgPT0gJ3N0cmluZycgPyBtZXNzYWdlIDogJ0Nvbm5lY3Rpb24gYWJvcnRlZCc7XHJcblx0XHRcdFx0cHJvbWlzZS5hYm9ydCgpO1xyXG5cdFx0XHRcdHByb21pc2UoZmFsc2UsIFtuZXcgRXJyb3IobWVzc2FnZSksIHhociwgbnVsbF0pO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0XHRcclxuXHRcdC8vIEhhbmRsZSB0aW1lb3V0c1xyXG5cdFx0aGFuZGxlVGltZW91dCA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRpZighYWJvcnRlZCkge1xyXG5cdFx0XHRcdGlmKCFvcHRpb25zLmF0dGVtcHRzIHx8ICsrYXR0ZW1wdHMgIT0gb3B0aW9ucy5hdHRlbXB0cykge1xyXG5cdFx0XHRcdFx0eGhyLmFib3J0KCk7XHJcblx0XHRcdFx0XHRzZW5kaW5nID0gZmFsc2U7XHJcblx0XHRcdFx0XHRwcm9taXNlLnNlbmQoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRoYW5kbGVFcnJvcignVGltZW91dCAoJyArIHVybCArICcpJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdC8vIE5vcm1hbGl6ZSBvcHRpb25zXHJcblx0XHRvcHRpb25zLmFzeW5jID0gJ2FzeW5jJyBpbiBvcHRpb25zID8gISFvcHRpb25zLmFzeW5jIDogdHJ1ZTtcclxuXHRcdG9wdGlvbnMuY2FjaGUgPSAnY2FjaGUnIGluIG9wdGlvbnMgPyAhIW9wdGlvbnMuY2FjaGUgOiBmYWxzZTtcclxuXHRcdG9wdGlvbnMuZGF0YVR5cGUgPSAnZGF0YVR5cGUnIGluIG9wdGlvbnMgPyBvcHRpb25zLmRhdGFUeXBlLnRvTG93ZXJDYXNlKCkgOiBkZWZhdWx0RGF0YVR5cGU7XHJcblx0XHRvcHRpb25zLnJlc3BvbnNlVHlwZSA9ICdyZXNwb25zZVR5cGUnIGluIG9wdGlvbnMgPyBvcHRpb25zLnJlc3BvbnNlVHlwZS50b0xvd2VyQ2FzZSgpIDogJ2F1dG8nO1xyXG5cdFx0b3B0aW9ucy51c2VyID0gb3B0aW9ucy51c2VyIHx8ICcnO1xyXG5cdFx0b3B0aW9ucy5wYXNzd29yZCA9IG9wdGlvbnMucGFzc3dvcmQgfHwgJyc7XHJcblx0XHRvcHRpb25zLndpdGhDcmVkZW50aWFscyA9ICEhb3B0aW9ucy53aXRoQ3JlZGVudGlhbHM7XHJcblx0XHRvcHRpb25zLnRpbWVvdXQgPSAndGltZW91dCcgaW4gb3B0aW9ucyA/IHBhcnNlSW50KG9wdGlvbnMudGltZW91dCwgMTApIDogMzAwMDA7XHJcblx0XHRvcHRpb25zLmF0dGVtcHRzID0gJ2F0dGVtcHRzJyBpbiBvcHRpb25zID8gcGFyc2VJbnQob3B0aW9ucy5hdHRlbXB0cywgMTApIDogMTtcclxuXHJcblx0XHQvLyBHdWVzcyBpZiB3ZSdyZSBkZWFsaW5nIHdpdGggYSBjcm9zcy1vcmlnaW4gcmVxdWVzdFxyXG5cdFx0aSA9IHVybC5tYXRjaCgvXFwvXFwvKC4rPylcXC8vKTtcclxuXHRcdGNyb3NzT3JpZ2luID0gaSAmJiAoaVsxXSA/IGlbMV0gIT0gbG9jYXRpb24uaG9zdCA6IGZhbHNlKTtcclxuXHJcblx0XHQvLyBQcmVwYXJlIGRhdGFcclxuXHRcdGlmKCdBcnJheUJ1ZmZlcicgaW4gZ2xvYmFsICYmIGRhdGEgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcikge1xyXG5cdFx0XHRvcHRpb25zLmRhdGFUeXBlID0gJ2FycmF5YnVmZmVyJztcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYoJ0Jsb2InIGluIGdsb2JhbCAmJiBkYXRhIGluc3RhbmNlb2YgQmxvYikge1xyXG5cdFx0XHRvcHRpb25zLmRhdGFUeXBlID0gJ2Jsb2InO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZignRG9jdW1lbnQnIGluIGdsb2JhbCAmJiBkYXRhIGluc3RhbmNlb2YgRG9jdW1lbnQpIHtcclxuXHRcdFx0b3B0aW9ucy5kYXRhVHlwZSA9ICdkb2N1bWVudCc7XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmKCdGb3JtRGF0YScgaW4gZ2xvYmFsICYmIGRhdGEgaW5zdGFuY2VvZiBGb3JtRGF0YSkge1xyXG5cdFx0XHRvcHRpb25zLmRhdGFUeXBlID0gJ2Zvcm1kYXRhJztcclxuXHRcdH1cclxuXHRcdGlmKGRhdGEgIT09IG51bGwpIHtcclxuXHRcdFx0c3dpdGNoKG9wdGlvbnMuZGF0YVR5cGUpIHtcclxuXHRcdFx0XHRjYXNlICdqc29uJzpcclxuXHRcdFx0XHRcdGRhdGEgPSBKU09OLnN0cmluZ2lmeShkYXRhKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgJ3Bvc3QnOlxyXG5cdFx0XHRcdFx0ZGF0YSA9IGpwYXJhbShkYXRhKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFByZXBhcmUgaGVhZGVyc1xyXG5cdFx0aWYob3B0aW9ucy5oZWFkZXJzKSB7XHJcblx0XHRcdHZhciBmb3JtYXQgPSBmdW5jdGlvbihtYXRjaCxwMSxwMikge1xyXG5cdFx0XHRcdHJldHVybiBwMSArIHAyLnRvVXBwZXJDYXNlKCk7XHJcblx0XHRcdH07XHJcblx0XHRcdGZvcihpIGluIG9wdGlvbnMuaGVhZGVycykge1xyXG5cdFx0XHRcdGhlYWRlcnNbaS5yZXBsYWNlKC8oXnwtKShbXi1dKS9nLGZvcm1hdCldID0gb3B0aW9ucy5oZWFkZXJzW2ldO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRpZighKCdDb250ZW50LVR5cGUnIGluIGhlYWRlcnMpICYmIG1ldGhvZCE9J0dFVCcpIHtcclxuXHRcdFx0aWYob3B0aW9ucy5kYXRhVHlwZSBpbiBtaW1lVHlwZXMpIHtcclxuXHRcdFx0XHRpZihtaW1lVHlwZXNbb3B0aW9ucy5kYXRhVHlwZV0pIHtcclxuXHRcdFx0XHRcdGhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddID0gbWltZVR5cGVzW29wdGlvbnMuZGF0YVR5cGVdO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0aWYoIWhlYWRlcnMuQWNjZXB0KSB7XHJcblx0XHRcdGhlYWRlcnMuQWNjZXB0ID0gKG9wdGlvbnMucmVzcG9uc2VUeXBlIGluIGFjY2VwdCkgPyBhY2NlcHRbb3B0aW9ucy5yZXNwb25zZVR5cGVdIDogJyovKic7XHJcblx0XHR9XHJcblx0XHRpZighY3Jvc3NPcmlnaW4gJiYgISgnWC1SZXF1ZXN0ZWQtV2l0aCcgaW4gaGVhZGVycykpIHsgLy8gKHRoYXQgaGVhZGVyIGJyZWFrcyBpbiBsZWdhY3kgYnJvd3NlcnMgd2l0aCBDT1JTKVxyXG5cdFx0XHRoZWFkZXJzWydYLVJlcXVlc3RlZC1XaXRoJ10gPSAnWE1MSHR0cFJlcXVlc3QnO1xyXG5cdFx0fVxyXG5cdFx0aWYoIW9wdGlvbnMuY2FjaGUgJiYgISgnQ2FjaGUtQ29udHJvbCcgaW4gaGVhZGVycykpIHtcclxuXHRcdFx0aGVhZGVyc1snQ2FjaGUtQ29udHJvbCddID0gJ25vLWNhY2hlJztcclxuXHRcdH1cclxuXHJcblx0XHQvLyBQcmVwYXJlIFVSTFxyXG5cdFx0aWYobWV0aG9kID09ICdHRVQnICYmIGRhdGEgJiYgdHlwZW9mIGRhdGEgPT0gJ3N0cmluZycpIHtcclxuXHRcdFx0dXJsICs9ICgvXFw/Ly50ZXN0KHVybCk/JyYnOic/JykgKyBkYXRhO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFN0YXJ0IHRoZSByZXF1ZXN0XHJcblx0XHRpZihvcHRpb25zLmFzeW5jKSB7XHJcblx0XHRcdHByb21pc2Uuc2VuZCgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFJldHVybiBwcm9taXNlXHJcblx0XHRyZXR1cm4gcHJvbWlzZTtcclxuXHJcblx0fTtcclxuXHRcclxuXHQvLyBEZWZpbmUgZXh0ZXJuYWwgcXdlc3Qgb2JqZWN0XHJcblx0dmFyIGdldE5ld1Byb21pc2UgPSBmdW5jdGlvbihxKSB7XHJcblx0XHRcdC8vIFByZXBhcmVcclxuXHRcdFx0dmFyIHByb21pc2VzID0gW10sXHJcblx0XHRcdFx0bG9hZGluZyA9IDAsXHJcblx0XHRcdFx0dmFsdWVzID0gW107XHJcblx0XHRcdC8vIENyZWF0ZSBhIG5ldyBwcm9taXNlIHRvIGhhbmRsZSBhbGwgcmVxdWVzdHNcclxuXHRcdFx0cmV0dXJuIHBpbmt5c3dlYXIoZnVuY3Rpb24ocGlua3kpIHtcclxuXHRcdFx0XHQvLyBCYXNpYyByZXF1ZXN0IG1ldGhvZFxyXG5cdFx0XHRcdHZhciBtZXRob2RfaW5kZXggPSAtMSxcclxuXHRcdFx0XHRcdGNyZWF0ZU1ldGhvZCA9IGZ1bmN0aW9uKG1ldGhvZCkge1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24odXJsLCBkYXRhLCBvcHRpb25zLCBiZWZvcmUpIHtcclxuXHRcdFx0XHRcdFx0XHR2YXIgaW5kZXggPSArK21ldGhvZF9pbmRleDtcclxuXHRcdFx0XHRcdFx0XHQrK2xvYWRpbmc7XHJcblx0XHRcdFx0XHRcdFx0cHJvbWlzZXMucHVzaChxd2VzdChtZXRob2QsIHBpbmt5LmJhc2UgKyB1cmwsIGRhdGEsIG9wdGlvbnMsIGJlZm9yZSkudGhlbihmdW5jdGlvbih4aHIsIHJlc3BvbnNlKSB7XHJcblx0XHRcdFx0XHRcdFx0XHR2YWx1ZXNbaW5kZXhdID0gYXJndW1lbnRzO1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYoIS0tbG9hZGluZykge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRwaW5reSh0cnVlLCB2YWx1ZXMubGVuZ3RoID09IDEgPyB2YWx1ZXNbMF0gOiBbdmFsdWVzXSk7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fSwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRwaW5reShmYWxzZSwgYXJndW1lbnRzKTtcclxuXHRcdFx0XHRcdFx0XHR9KSk7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHBpbmt5O1xyXG5cdFx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0fTtcclxuXHRcdFx0XHQvLyBEZWZpbmUgZXh0ZXJuYWwgQVBJXHJcblx0XHRcdFx0cGlua3kuZ2V0ID0gY3JlYXRlTWV0aG9kKCdHRVQnKTtcclxuXHRcdFx0XHRwaW5reS5wb3N0ID0gY3JlYXRlTWV0aG9kKCdQT1NUJyk7XHJcblx0XHRcdFx0cGlua3kucHV0ID0gY3JlYXRlTWV0aG9kKCdQVVQnKTtcclxuXHRcdFx0XHRwaW5reVsnZGVsZXRlJ10gPSBjcmVhdGVNZXRob2QoJ0RFTEVURScpO1xyXG5cdFx0XHRcdHBpbmt5WydjYXRjaCddID0gZnVuY3Rpb24oZikge1xyXG5cdFx0XHRcdFx0cmV0dXJuIHBpbmt5LnRoZW4obnVsbCwgZik7XHJcblx0XHRcdFx0fTtcclxuXHRcdFx0XHRwaW5reS5jb21wbGV0ZSA9IGZ1bmN0aW9uKGYpIHtcclxuXHRcdFx0XHRcdHZhciBmdW5jID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdGYoKTsgLy8gb3RoZXJ3aXNlIGFyZ3VtZW50cyB3aWxsIGJlIHBhc3NlZCB0byB0aGUgY2FsbGJhY2tcclxuXHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHRyZXR1cm4gcGlua3kudGhlbihmdW5jLCBmdW5jKTtcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdHBpbmt5Lm1hcCA9IGZ1bmN0aW9uKHR5cGUsIHVybCwgZGF0YSwgb3B0aW9ucywgYmVmb3JlKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gY3JlYXRlTWV0aG9kKHR5cGUudG9VcHBlckNhc2UoKSkuY2FsbCh0aGlzLCB1cmwsIGRhdGEsIG9wdGlvbnMsIGJlZm9yZSk7XHJcblx0XHRcdFx0fTtcclxuXHRcdFx0XHQvLyBQb3B1bGF0ZSBtZXRob2RzIGZyb20gZXh0ZXJuYWwgb2JqZWN0XHJcblx0XHRcdFx0Zm9yKHZhciBwcm9wIGluIHEpIHtcclxuXHRcdFx0XHRcdGlmKCEocHJvcCBpbiBwaW5reSkpIHtcclxuXHRcdFx0XHRcdFx0cGlua3lbcHJvcF0gPSBxW3Byb3BdO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQvLyBTZXQgbGFzdCBtZXRob2RzXHJcblx0XHRcdFx0cGlua3kuc2VuZCA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0Zm9yKHZhciBpPTAsIGo9cHJvbWlzZXMubGVuZ3RoOyBpPGo7ICsraSkge1xyXG5cdFx0XHRcdFx0XHRwcm9taXNlc1tpXS5zZW5kKCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRyZXR1cm4gcGlua3k7XHJcblx0XHRcdFx0fTtcclxuXHRcdFx0XHRwaW5reS5hYm9ydCA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0Zm9yKHZhciBpPTAsIGo9cHJvbWlzZXMubGVuZ3RoOyBpPGo7ICsraSkge1xyXG5cdFx0XHRcdFx0XHRwcm9taXNlc1tpXS5hYm9ydCgpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0cmV0dXJuIHBpbmt5O1xyXG5cdFx0XHRcdH07XHJcblx0XHRcdFx0cmV0dXJuIHBpbmt5O1xyXG5cdFx0XHR9KTtcclxuXHRcdH0sXHJcblx0XHRxID0ge1xyXG5cdFx0XHRiYXNlOiAnJyxcclxuXHRcdFx0Z2V0OiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRyZXR1cm4gZ2V0TmV3UHJvbWlzZShxKS5nZXQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0cG9zdDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0cmV0dXJuIGdldE5ld1Byb21pc2UocSkucG9zdC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRwdXQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHJldHVybiBnZXROZXdQcm9taXNlKHEpLnB1dC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHQnZGVsZXRlJzogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0cmV0dXJuIGdldE5ld1Byb21pc2UocSlbJ2RlbGV0ZSddLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcblx0XHRcdH0sXHJcblx0XHRcdG1hcDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0cmV0dXJuIGdldE5ld1Byb21pc2UocSkubWFwLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcblx0XHRcdH0sXHJcblx0XHRcdHhocjI6IHhocjIsXHJcblx0XHRcdGxpbWl0OiBmdW5jdGlvbihieSkge1xyXG5cdFx0XHRcdGxpbWl0ID0gYnk7XHJcblx0XHRcdFx0cmV0dXJuIHE7XHJcblx0XHRcdH0sXHJcblx0XHRcdHNldERlZmF1bHRPcHRpb25zOiBmdW5jdGlvbihvcHRpb25zKSB7XHJcblx0XHRcdFx0ZGVmYXVsdE9wdGlvbnMgPSBvcHRpb25zO1xyXG5cdFx0XHRcdHJldHVybiBxO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRzZXREZWZhdWx0WGRyUmVzcG9uc2VUeXBlOiBmdW5jdGlvbih0eXBlKSB7XHJcblx0XHRcdFx0ZGVmYXVsdFhkclJlc3BvbnNlVHlwZSA9IHR5cGUudG9Mb3dlckNhc2UoKTtcclxuXHRcdFx0XHRyZXR1cm4gcTtcclxuXHRcdFx0fSxcclxuXHRcdFx0c2V0RGVmYXVsdERhdGFUeXBlOiBmdW5jdGlvbih0eXBlKSB7XHJcblx0XHRcdFx0ZGVmYXVsdERhdGFUeXBlID0gdHlwZS50b0xvd2VyQ2FzZSgpO1xyXG5cdFx0XHRcdHJldHVybiBxO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRnZXRPcGVuUmVxdWVzdHM6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHJldHVybiByZXF1ZXN0cztcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHRcclxuXHRyZXR1cm4gcTtcclxuXHJcbn0oKTtcclxuIiwiY29uc3QgcmVzdCA9IHJlcXVpcmUoJ3F3ZXN0JylcclxuXHJcbmNvbnNvbGUubG9nKFwicmVzdFwiKVxyXG5yZXN0LmdldCgnL2FwaS90b2RvcycpXHJcbiAgICAudGhlbihmdW5jdGlvbih4aHIsIHJlc3BvbnNlKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKHJlc3BvbnNlKVxyXG5cdFx0XHRjb25zb2xlLnRhYmxlKHJlc3BvbnNlKVxyXG5cdFx0XHRyZW5kZXIocmVzcG9uc2UpXHJcbiAgICB9KVxyXG5cdFx0XHJcblx0XHR2YXIgdGFza3MgPSBbXHJcbntcclxuXHRpZDogXCIxXCIsXHJcblx0Y2F0ZWdvcnk6IFwiR2xvd25lXCIsXHJcblx0dGl0bGU6IFwiUHJ6eW5pZcWbxIcgR25hcm93aSAxMCB3aWxjenljaCBza8OzclwiLFxyXG5cdGNvbnRlbnQ6IFwiT3JrIGtvbGVrY2pvbnVqZSBza8OzcnkgaSBza3VwdWplIGthxbxkZSBpbG/Fm2NpLiBDaMSZdG5pZSBrdXBpIDEwIHNrw7NyIC1aZG9ixIVkxbogMTAgd2lsY3p5Y2ggc2vDs3IgLVNwcnplZGFqIHNrb3J5IEduYXJvd2lcIixcclxuXHRkb25lOiB0cnVlLFxyXG59LFxyXG57XHJcblx0aWQ6IFwiMlwiLFxyXG5cdGNhdGVnb3J5OiBcIlBvYm9jem5lXCIsXHJcblx0dGl0bGU6IFwiTWnEmXNvIGRsYSBla2lweVwiLFxyXG5cdGNvbnRlbnQ6IFwiT3JrIGtvbGVrY2pvbnVqZSBza8OzcnkgaSBza3VwdWplIGthxbxkZSBpbG/Fm2NpLiBDaMSZdG5pZSBrdXBpIDEwIHNrw7NyIC1aZG9ixIVkxbogMTAgd2lsY3p5Y2ggc2vDs3IgLVNwcnplZGFqIHNrb3J5IEduYXJvd2lcIixcclxuXHRkb25lOiBmYWxzZSxcclxufSxcclxue1xyXG5cdGlkOiBcIjNcIixcclxuXHRjYXRlZ29yeTogXCJabGVjZW5pYVwiLFxyXG5cdHRpdGxlOiBcIlByenluaWXFm8SHIEduYXJvd2kgMTAgd2lsY3p5Y2ggc2vDs3JcIixcclxuXHRjb250ZW50OiBcIk9yayBrb2xla2Nqb251amUgc2vDs3J5IGkgc2t1cHVqZSBrYcW8ZGUgaWxvxZtjaS4gQ2jEmXRuaWUga3VwaSAxMCBza8OzciAtWmRvYsSFZMW6IDEwIHdpbGN6eWNoIHNrw7NyIC1TcHJ6ZWRhaiBza29yeSBHbmFyb3dpXCIsXHJcblx0ZG9uZTogdHJ1ZSxcclxufVxyXG5dXHJcblxyXG4vL3JlbmRlcih0YXNrcylcclxuXHJcbmZ1bmN0aW9uIHJlbmRlcih0b2Rvcykge1xyXG5cdGNvbnNvbGUubG9nKCdHZXQgdG9kb3MnKVxyXG4gICAgICAgIHRvZG9zLmZvckVhY2goZnVuY3Rpb24odG9kbyl7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnR2VuIHRhc2snKVxyXG4gICAgICAgICAgdmFyIGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcmVuZGVyXCIpXHJcbiAgICAgICAgICB2YXIgYm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKVxyXG4gICAgICAgICAgdmFyIHRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImgyXCIpXHJcblx0XHRcdFx0XHR2YXIgY29udGVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpXHJcbiAgICAgICAgICB0aXRsZS50ZXh0Q29udGVudCA9IHRvZG8udGl0bGVcclxuXHRcdFx0XHRcdGNvbnRlbnQudGV4dENvbnRlbnQgPSB0b2RvLmNvbnRlbnRcclxuICAgICAgICAgIGJveC5hcHBlbmRDaGlsZCh0aXRsZSlcclxuXHRcdFx0XHRcdGJveC5hcHBlbmRDaGlsZChjb250ZW50KVxyXG4gICAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGJveClcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdSZW5kZXIgdGFzaycpXHJcbiAgICAgICAgfSlcclxuICAgICAgfVxyXG4gICAgICAvL3JlbmRlcigpO1xyXG4iXX0=
