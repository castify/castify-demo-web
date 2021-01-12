# vanilla

`<script>` タグによって直接 Castify のプレイヤーを利用する方式のサンプルです。

## 導入

プレイヤーを利用するページに以下のような `<script>` タグを挿入します。

```html
<script src="https://storage.googleapis.com/public.castify.jp/js/player/castify-player-1.latest.js"></script>
```

Internet Explorer 11 で動作するようにするには Polyfill を導入する必要があります。

```html
<script src="https://unpkg.com/@ungap/event-target@0.2.2/min.js"></script>
<script src="https://polyfill.io/v3/polyfill.js?features=URL%2CURLSearchParams%2CCustomEvent%2CPromise%2CPromise.prototype.finally%2CObject.values%2CUint8Array%2CArray.prototype.find%2CArray.prototype.findIndex%2CArray.prototype.values%2CObject.entries%2CMap%2CglobalThis%2Cfetch"></script>
```

[`polyfill.io`](https://polyfill.io/v3/url-builder/) で導入される機能は以下の通りです。

 - URL
 - URLSearchParams
 - Uint8Array
 - CustomEvent
 - Promise
 - Array.prototype.findIndex
 - Array.prototype.values
 - Object.entries
 - Map
 - globalThis
 - fetch
