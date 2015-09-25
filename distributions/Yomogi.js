'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

var global = Function('return this');
var _fetch = global.fetch;

var METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTIONS'];
var SIMPLE_ALLOW_HEADERS = ['accept', 'accept-language', 'content-language', 'content-type'];
var SIMPLE_ALLOW_CONTENT_TYPES = ['text/plain', 'application/x-www-form-urlencoded', 'multipart/form-data'];

var __validateUrl = function __validateUrl(url) {
  if (typeof url !== 'string') {
    throw new TypeError('url must be a String');
  }

  return url;
};

var __validateMethod = function __validateMethod(method) {
  var upperCased = String(method).toUpperCase();

  if (METHODS.indexOf(upperCased) === -1) {
    throw new TypeError('method must be a String of : ' + METHODS.join(', '));
  }

  return upperCased;
};

var __createFullUrl = function __createFullUrl(base, param, query) {
  var url = base;

  if (Object.prototype.toString.call(param) !== '[object Object]') {
    throw new TypeError('param must be an object');
  }
  if (Object.prototype.toString.call(query) !== '[object Object]') {
    throw new TypeError('query must be an object');
  }

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = Object.keys(param)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var key = _step.value;

      if (url.indexOf(':' + key) === -1) continue;

      url = url.replace(':' + key, param[key]);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator['return']) {
        _iterator['return']();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  if (Object.keys(query).length > 0) {
    url = url + ('?' + _querystring2['default'].stringify(query));
  }

  return url;
};

var Yomogi = (function () {
  function Yomogi() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Yomogi);

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = Object.keys(options)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var key = _step2.value;

        this[key] = options[key];
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2['return']) {
          _iterator2['return']();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    var method = options.method;
    var url = options.url;
    var query = options.query;
    var param = options.param;
    var body = options.body;
    var header = options.header;

    this.method = __validateMethod(method);
    this.url = __validateUrl(url);
    this.param = param || {};
    this.query = query || {};
    this.body = body || null;
    this.header = {};

    //
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = Object.keys(header || {})[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var key = _step3.value;

        this.header[key.toLowerCase()] = header[key];
      }

      //
    } catch (err) {
      _didIteratorError3 = true;
      _iteratorError3 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion3 && _iterator3['return']) {
          _iterator3['return']();
        }
      } finally {
        if (_didIteratorError3) {
          throw _iteratorError3;
        }
      }
    }

    this.fullUrl = __createFullUrl(this.url, this.param, this.query);

    //
    this.realBody = this.body;

    // if body is an object or an array, regard it as JSON
    if (Object.prototype.toString.call(this.body) === '[object Object]' || Object.prototype.toString.call(this.body) === '[object Array]') {
      this.realBody = JSON.stringify(this.body);
      this.header = Object.assign({
        'content-type': 'application/json'
      }, this.header);
    }
  }

  _createClass(Yomogi, [{
    key: 'assign',
    value: function assign(options) {
      return new Yomogi(Object.assign({}, this, options));
    }
  }, {
    key: 'simple',
    value: function simple() {
      var method = this.method === 'GET' ? 'GET' : 'POST';
      var header = {};

      // remove Headers without allowed for send the CORS Simple Request
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = Object.keys(this.header)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var key = _step4.value;

          if (SIMPLE_ALLOW_HEADERS.indexOf(key.toLowerCase()) !== -1) {
            header[key] = this.header[key];
          }
        }

        // force the Content-type for send the CORS Simple Request
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4['return']) {
            _iterator4['return']();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      if ('content-type' in header && SIMPLE_ALLOW_CONTENT_TYPES.indexOf(header['content-type'].toLowerCase()) === -1) {
        header['content-type'] = SIMPLE_ALLOW_CONTENT_TYPES[0];
      }

      return new Yomogi({
        method: method,
        url: this.url,
        query: this.query,
        param: this.param,
        body: this.body,
        header: header
      });
    }
  }, {
    key: 'fetch',
    value: function fetch() {
      if (typeof _fetch !== 'function') {
        throw new ReferenceError('fetch() function is not defined');
      }

      return _fetch(this.url, this);
    }
  }]);

  return Yomogi;
})();

exports.Yomogi = Yomogi;
exports['default'] = Yomogi;