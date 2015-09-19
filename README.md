# Kaminari

Kaminari means the Thunderbolt in Japanese. Kaminari is thin wrapper of `fetch()`.

## Example

```javascript
import kaminari from 'kaminari';

kaminari.get('/path/to/api/:id', {
  query: { offset: 40, limit: 20 },
  param: { id: 3 },
  body: {
    yeah: 'whoo',
  },
  header: {

  },
  ...
})
  .simple()
  .fetchJson()
  .then(json => {

  })
  .catch(err => {

  });
```
