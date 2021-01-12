# react+webpack/1.play-live

Castify のライブ配信を再生する基本的なサンプルです。

## サンプルの閲覧方法

[src/index.tsx](./src/index.tsx) をエディターで開き `broadcastId` に適切な配信 ID を設定します。

```typescript
const broadcastId = "bc_XXX";
```

次に、以下の手順で React アプリケーションのビルドを行います。

```shell
yarn install
yarn serve
```
