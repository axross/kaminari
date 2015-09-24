import expect from 'expect.js';
import Yomogi from '../sources/Yomogi';

describe('Yomogi', () => {
  describe('Yomogi\'s constructor', () => {
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

    it('should realBody is JSON string and \'content-type\' of header is \'application/json\' if body is a Plain object or an instance of Array', () => {
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
});

// describe('Yomogi', () => {
//   describe('Yomogi#constructor()', () => {
//     it('should options as it is this.xxx', () => {
//       const kaminari = new Yomogi({
//         url: '/path/to/api',
//         aaa: '123',
//         bbb: '456',
//         ccc: '789',
//       });
//
//       expect(kaminari.aaa).to.be('123');
//       expect(kaminari.bbb).to.be('456');
//       expect(kaminari.ccc).to.be('789');
//     });
//
//     it('should this.fullUrl is parsed from options.url, options.param and options.query', () => {
//       [
//         {
//           input: {
//             url: '/path/to/api/:mode',
//             param: { mode: 'latest' },
//             query: { offset: 100, limit: 50 },
//           },
//           output: '/path/to/api/latest?offset=100&limit=50',
//         },
//         {
//           input: {
//             url: '/path/to/api',
//           },
//           output: '/path/to/api',
//         },
//         {
//           input: {
//             url: '/path/to/api/:id/children/:subId',
//             param: { id: 12, subId: 345 },
//           },
//           output: '/path/to/api/12/children/345',
//         },
//         {
//           input: {
//             url: '/path/to/api/:id/children/:wrongid',
//             param: { id: 1234 },
//           },
//           output: '/path/to/api/1234/children/:wrongid',
//         }
//       ].forEach(({ input, output }) => {
//         const kaminari = new Yomogi(input);
//
//         expect(kaminari.fullUrl).to.be(output);
//       });
//     });
//
//     it('should method becomes GET when it is invalid', () => {
//       [
//         {
//           input: 'INVALID',
//           output: 'GET',
//         },
//         {
//           input: 'POST',
//           output: 'POST',
//         },
//         {
//           input: 'delete',
//           output: 'DELETE',
//         },
//         {
//           input: ' head',
//           output: 'GET',
//         }
//       ].forEach(({ input, output }) => {
//         const kaminari = new Yomogi({
//           method: input,
//           url: '/path/to/api',
//         });
//
//         expect(kaminari.method).to.be(output);
//       });
//     });
//   });
// });
