import fetch from 'isomorphic-fetch';
import querystring from 'querystring';

const METHODS = [
  'GET',
  'POST',
  'PUT',
  'DELETE',
  'HEAD',
  'OPTIONS'
];
const SIMPLE_ALLOW_HEADERS = [
  'accept',
  'accept-language',
  'content-language',
  'content-type'
];
const SIMPLE_ALLOW_CONTENT_TYPES = [
  'text/plain',
  'application/x-www-form-urlencoded',
  'multipart/form-data'
];

const __validateUrl = url => {
  if (typeof url !== 'string') {
    throw new TypeError('url must be a String');
  }

  return url;
};

const __validateMethod = method => {
  const upperCased = String(method).toUpperCase();

  if (METHODS.indexOf(upperCased) === -1) {
    throw new TypeError(`method must be a String of : ${METHODS.join(', ')}`);
  }

  return upperCased;
};

const __createFullUrl = (base, param, query) => {
  let url = base;

  if (Object.prototype.toString.call(param) !== '[object Object]') {
    throw new TypeError('param must be an object');
  }
  if (Object.prototype.toString.call(query) !== '[object Object]') {
    throw new TypeError('query must be an object');
  }

  for (const key of Object.keys(param)) {
    if (url.indexOf(`:${key}`) === -1) continue;

    url = url.replace(`:${key}`, param[key]);
  }

  if (Object.keys(query).length > 0) {
    url = url + `?${querystring.stringify(query)}`;
  }

  return url;
};

export class Yomogi {
  constructor(options = {}) {
    for (const key of Object.keys(options)) {
      this[key] = options[key];
    }

    const { method, url, query, param, body, header } = options;

    this.method = __validateMethod(method);
    this.url = __validateUrl(url);
    this.query = query || {};
    this.param = param || {};
    this.body = body || null;
    this.header = {};

    //
    for (let key of Object.keys(header || {})) {
      this.header[key.toLowerCase()] = header[key];
    }

    //
    this.fullUrl = __createFullUrl(this.url, this.param, this.query);

    //
    this.realBody = this.body;

    // if body is an object or an array, regard it as JSON
    if (Object.prototype.toString.call(this.body) === '[object Object]' ||
        Object.prototype.toString.call(this.body) === '[object Array]') {
      this.realBody = JSON.stringify(this.body);
      this.header = Object.assign({
        'content-type': 'application/json',
      }, this.header);
    }
  }

  assign(options) {
    return new Yomogi(Object.assign({}, this, options));
  }

  simple() {
    const method = this.method === 'GET' ? 'GET' : 'POST';
    const header = {};

    // remove Headers without allowed for send the CORS Simple Request
    for (const key of Object.keys(this.header)) {
      if (SIMPLE_ALLOW_HEADERS.indexOf(key.toLowerCase()) !== -1) {
        header[key] = this.header[key];
      }
    }

    // force the Content-type for send the CORS Simple Request
    if ('content-type' in header &&
        SIMPLE_ALLOW_CONTENT_TYPES.indexOf(header['content-type'].toLowerCase()) === -1) {
      header['content-type'] = SIMPLE_ALLOW_CONTENT_TYPES[0];
    }

    return new Yomogi({
      method,
      url: this.url,
      query: this.query,
      param: this.param,
      body: this.body,
      header: this.header,
    });
  }

  fetch() {
    return fetch(this.url, this);
  }
}

export default Yomogi;
