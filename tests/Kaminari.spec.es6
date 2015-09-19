import expect from 'expect.js';
import Kaminari from '../sources/Kaminari';

describe('Kaminari', () => {
  describe('Kaminari#constructor()', () => {
    it('should options as it is this.xxx', () => {
      const kaminari = new Kaminari({
        url: '/path/to/api',
        aaa: '123',
        bbb: '456',
        ccc: '789',
      });

      expect(kaminari.aaa).to.be('123');
      expect(kaminari.bbb).to.be('456');
      expect(kaminari.ccc).to.be('789');
    });

    it('should this.fullUrl is parsed from options.url, options.param and options.query', () => {
      [
        {
          input: {
            url: '/path/to/api/:mode',
            param: { mode: 'latest' },
            query: { offset: 100, limit: 50 },
          },
          output: '/path/to/api/latest?offset=100&limit=50',
        },
        {
          input: {
            url: '/path/to/api',
          },
          output: '/path/to/api',
        },
        {
          input: {
            url: '/path/to/api/:id/children/:subId',
            param: { id: 12, subId: 345 },
          },
          output: '/path/to/api/12/children/345',
        },
        {
          input: {
            url: '/path/to/api/:id/children/:wrongid',
            param: { id: 1234 },
          },
          output: '/path/to/api/1234/children/:wrongid',
        }
      ].forEach(({ input, output }) => {
        const kaminari = new Kaminari(input);

        expect(kaminari.fullUrl).to.be(output);
      });
    });

    it('should method becomes GET when it is invalid', () => {
      [
        {
          input: 'INVALID',
          output: 'GET',
        },
        {
          input: 'POST',
          output: 'POST',
        },
        {
          input: 'delete',
          output: 'DELETE',
        },
        {
          input: ' head',
          output: 'GET',
        }
      ].forEach(({ input, output }) => {
        const kaminari = new Kaminari({
          method: input,
          url: '/path/to/api',
        });

        expect(kaminari.method).to.be(output);
      });
    });
  });
});
