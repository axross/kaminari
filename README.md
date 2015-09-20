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

## Tests

- Kaminari#constructor()
    - Kaminariインスタンスが返る
    - xxxがthis.xxxとして受け継がれる
    - methodは大文字にされる
    - methodは存在しないものの場合はエラーが発生する
    - urlはStringでない場合はエラーが発生する
    - this.fullUrlはurl, param, queryをもとに正しいものが生成される
    - this.headerは小文字化される
    - bodyがObjectまたはArrayの場合、this.realBodyはJSON文字列になり、content-typeに'application/json'が設定される(上書きはされない)
- Kaminari#assign()
    - Kaminariインスタンスが返る
    - thisとoptionsがマージされた新しいインスタンスが返る
- Kaminari#simple()
    - Kaminariインスタンスが返る
    - methodがGETならGET、そうでなければPOSTに補正される
    - CORS Simple Requestとして許可されないheaderは排除される
    - CORS Simple Requestとして許可されないContent-Typeは'text/plain'に補正される
- Kaminari#fetch()
    - fetch()の結果が返る
    - fetchにはfullUrl, thisが渡っていて、bodyとheaderにはrealBodyとrealHeaderが代わりに使われる
- Kaminari.use()
    - Kaminari自身が返る
    - functionでない場合はエラーが発生する
    - middlewareとして登録され、fetch()時に呼ばれる
    - 呼ばれる際は、middlewareとして登録した順番で
