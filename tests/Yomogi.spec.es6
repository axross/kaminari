import expect from 'expect.js';
import Yomogi from '../sources/Yomogi';

describe('Yomogi', () => {
  describe('Yomogi#constructor', () => {
    it('should occur an exception if method does not exist', () => {
      expect(() => {
        new Yomogi();
      }).to.throwException(/method must be a String of : GET, POST, PUT, DELETE, HEAD, OPTIONS/);

      expect(() => {
        new Yomogi({});
      }).to.throwException(/method must be a String of : GET, POST, PUT, DELETE, HEAD, OPTIONS/);

      expect(() => {
        new Yomogi({ method: null });
      }).to.throwException(/method must be a String of : GET, POST, PUT, DELETE, HEAD, OPTIONS/);

      expect(() => {
        new Yomogi({ method: 'JET' });
      }).to.throwException(/method must be a String of : GET, POST, PUT, DELETE, HEAD, OPTIONS/);
    });

    it('should occur an exception if url is not a String', () => {
      expect(() => new Yomogi({
        method: 'GET',
      })).to.throwException(/url must be a String/);

      expect(() => {
        new Yomogi({
          method: 'GET',
          url: 12,
        });
      }).to.throwException(/url must be a String/);
    });

    it('should method be upper case', () => {
      expect(new Yomogi({
        method: 'get',
        url: '/path/to/api',
      }).method).to.be('GET');

      expect(new Yomogi({
        method: 'delete',
        url: '/path/to/api',
      }).method).to.be('DELETE');

      expect(new Yomogi({
        method: 'POST',
        url: '/path/to/api',
      }).method).to.be('POST');
    });

    it('should header be lower case', () => {
      expect(new Yomogi({
        method: 'GET',
        url: '/path/to/api',
        header: {
          'Accept': 'application/json',
        },
      }).header).to.eql({
        'accept': 'application/json',
      });

      expect(new Yomogi({
        method: 'GET',
        url: '/path/to/api',
        header: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'token': 'a1B2c3D4e5F6',
        },
      }).header).to.eql({
        'accept': 'application/json',
        'content-type': 'application/json',
        'token': 'a1B2c3D4e5F6',
      });
    });

    it('should fullUrl is created with url, param and query', () => {
      expect(new Yomogi({
        method: 'GET',
        url: '/path/to/api/article/:articleId/comment/:commentId',
        param: {
          articleId: 21,
          commentId: 3,
        },
        query: {
          filter: ['photo', 'video'],
          order: 'desc',
        },
      }).fullUrl).to.be('/path/to/api/article/21/comment/3?filter=photo&filter=video&order=desc');

      expect(new Yomogi({
        method: 'GET',
        url: '/path/to/api/page/:page',
        param: {
          page: 12,
        },
      }).fullUrl).to.be('/path/to/api/page/12');

      expect(new Yomogi({
        method: 'GET',
        url: '/path/to/api',
        query: {
          offset: 60,
          limit: 20,
        },
      }).fullUrl).to.be('/path/to/api?offset=60&limit=20');

      expect(new Yomogi({
        method: 'GET',
        url: '/path/to/api',
      }).fullUrl).to.be('/path/to/api');
    });

    it('should realBody is copy of body', () => {
      expect(new Yomogi({
        method: 'GET',
        url: '/path/to/api',
        body: 'abc',
      }).realBody).to.be('abc');

      expect(new Yomogi({
        method: 'GET',
        url: '/path/to/api',
        body: null,
      }).realBody).to.be(null);

      expect(new Yomogi({
        method: 'GET',
        url: '/path/to/api',
      }).realBody).to.be(null);
    });

    it('should realBody is JSON string and "content-type" of header is "application/json" if body is a Plain object or an instance of Array', () => {
      expect(new Yomogi({
        method: 'GET',
        url: '/path/to/api',
        body: {
          a: 1,
          b: 'two',
          c: true,
        },
      }).realBody).to.be('{"a":1,"b":"two","c":true}');

      expect(new Yomogi({
        method: 'GET',
        url: '/path/to/api',
        body: {
          foo: new Date(0),
          bar: undefined,
        },
      }).realBody).to.be('{"foo":"1970-01-01T00:00:00.000Z"}');

      expect(new Yomogi({
        method: 'GET',
        url: '/path/to/api',
        body: {},
      }).realBody).to.be('{}');
    });

    it('should some member of options as it is member of this', () => {
      const yomogi = new Yomogi({
        method: 'GET',
        url: '/path/to/api',
        foo: 'bar',
        baz: 'qux',
      });

      expect(yomogi.foo).to.be('bar');
      expect(yomogi.baz).to.be('qux');
    });
  });

  describe('Yomogi#assign()', () => {
    it('should return an instance of Yomogi that it is an another reference', () => {
      const yomogi = new Yomogi({
        method: 'GET',
        url: '/path/to/api',
      });

      expect(yomogi.assign()).to.eql(yomogi);
      expect(yomogi.assign()).not.to.be(yomogi);
    });

    it('should return it is merged options to origin', () => {
      const yomogi = new Yomogi({
        method: 'GET',
        url: '/path/to/api/article/:articleId/comment/:commentId',
        param: {
          articleId: 21,
          commentId: 3,
        },
        query: {
          offset: 60,
          limit: 20,
        },
      });

      const assigned = yomogi.assign({
        param: {
          articleId: 45
        },
        query: {
          limit: 40,
        },
      });

      expect(assigned.param).to.eql({ articleId: 45 });
      expect(assigned.query).to.eql({ limit: 40 });
    });
  });

  describe('Yomogi#simple()', () => {
    it('should return an instance of Yomogi that it is an another reference', () => {
      const yomogi = new Yomogi({
        method: 'GET',
        url: '/path/to/api',
      });

      expect(yomogi.assign()).to.eql(yomogi);
      expect(yomogi.assign()).not.to.be(yomogi);
    });

    it('should force method to "POST" if it is not "GET"', () => {
      [
        {
          input: 'GET',
          output: 'GET',
        },
        {
          input: 'DELETE',
          output: 'POST',
        },
        {
          input: 'PUT',
          output: 'POST',
        },
        {
          input: 'head',
          output: 'POST',
        },
      ].forEach(({ input, output }) => {
        expect(new Yomogi({
          method: input,
          url: '/path/to/api',
        }).simple().method).to.be(output);
      });

      const yomogi = new Yomogi({
        method: 'GET',
        url: '/path/to/api'
      });
    });

    it('should remove headers not accepted for the CORS Simple Request', () => {
      [
        // We want more cases...
        {
          input: {
            'accept': 'text/plain',
            'accept-language': 'ja-JP',
            'content-language': 'ja-JP',
            'content-type': 'text/plain',
          },
          output: {
            'accept': 'text/plain',
            'accept-language': 'ja-JP',
            'content-language': 'ja-JP',
            'content-type': 'text/plain',
          },
        },
        {
          input: {
            'accept': 'text/plain',
            'content-language': 'ja-JP',
            'content-type': 'text/plain',
            'yomogi-authentication-code': 'a1s2d3f4',
          },
          output: {
            'accept': 'text/plain',
            'content-language': 'ja-JP',
            'content-type': 'text/plain',
          },
        },
        {
          input: {
            'accept-encoding': 'gzip, deflate, sdch',
            'connection': 'keep-alive',
            'content-length': 25,
            'origin': 'https://yomogi.com',
          },
          output: {},
        },
      ].forEach(({ input, output }) => {
        expect(new Yomogi({
          method: 'GET',
          url: '/path/to/api',
          header: input,
        }).simple().header).to.eql(output);
      });
    });

    it('should force "content-type" of header to "text/plain" if it is not accepted for the CORS Simple Request', () => {
      [
        {
          input: {
            'accept': 'text/plain',
            'content-type': 'text/plain',
          },
          output: {
            'accept': 'text/plain',
            'content-type': 'text/plain',
          },
        },
        {
          input: {
            'accept': 'text/plain',
            'content-type': 'application/x-www-form-urlencoded',
          },
          output: {
            'accept': 'text/plain',
            'content-type': 'application/x-www-form-urlencoded',
          },
        },
        {
          input: {
            'accept': 'text/plain',
            'content-type': 'multipart/form-data',
          },
          output: {
            'accept': 'text/plain',
            'content-type': 'multipart/form-data',
          },
        },
        {
          input: {
            'accept': 'text/plain',
            'content-type': 'foo',
          },
          output: {
            'accept': 'text/plain',
            'content-type': 'text/plain',
          },
        },
        {
          input: {
            'accept': 'text/plain',
            'content-type': 'multipart/form-data-is-what',
          },
          output: {
            'accept': 'text/plain',
            'content-type': 'text/plain',
          },
        },
        {
          input: {
            'accept': 'text/plain',
          },
          output: {
            'accept': 'text/plain',
          },
        },
      ].forEach(({ input, output }) => {
        expect(new Yomogi({
          method: 'GET',
          url: '/path/to/api',
          header: input,
        }).simple().header).to.eql(output);
      });
    });
  });

  describe('Yomogi#fetch()', () => {
    it('should occur an exception if fetch() is not defined', () => {
      expect(() => {
        new Yomogi({
          method: 'GET',
          url: '/path/to/api',
        })
          .fetch()
      }).to.throwException(/fetch\(\) function is not defined/);
    });

    it('should call fetch() function with fullUrl and self that is used realBody and realHeader instead', done => {
      const yomogi = new Yomogi({
        method: 'GET',
        url: '/path/to/api/page/:page',
        param: { page: 3 },
        query: {
          sort: 'id',
          order: 'desc',
        },
        body: {
          foo: 'bar',
          baz: ['q', 'u', 'x'],
        },
        abc: 123,
      });

      global.fetch = (url, options) => {
        expect(url).to.be(yomogi.fullUrl);
        expect(options).to.eql(yomogi);

        done();
      };

      yomogi.fetch();

      delete global.fetch;
    });
  });
});
