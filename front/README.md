# susan-next/front

SUSAN bot に連携する LIFF アプリケーション

URL: ???

## How to use

### set .env

.env ファイルに環境変数を設定する．書き方は .env.sample を参照．

- LIFF ID([LINE Developer Console](https://developers.line.biz/console/)から LINE ログインのチャンネルの作成・ID を取得)

### start developing

```
docker-compose build front
docker-compose up -d front
```

### Enter to Docker shell

新しいライブラリなど入れるときは必ず Docker コンテナ内のシェルから実行．

```
# frontコンテナ内のシェルを起動
docker-compose run --rm front sh
```
