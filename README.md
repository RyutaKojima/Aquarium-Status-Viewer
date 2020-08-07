# 開発環境の準備

パッケージのインストール
```sh
$ npm install
```

[Firebase CLI](https://firebase.google.com/docs/cli/) のインストール
```sh
$ npm install -g firebase-tools
$ firebase login
```


# ビルド～テスト

```
# Build
$ ./node_modules/.bin/webpack


# ローカル ウェブサーバー起動（for ローカルテスト）
$ firebase serve
```

# firebaseにデプロイ

```sh
firebase deploy --only hosting
```
