FROM node:16.14.2-alpine
WORKDIR /susan-next/

# パッケージインストールのためのコマンド追加
COPY ./susan-next/package.json ./susan-next/yarn.lock ./
RUN yarn install --frozen-lockfile
# 全ファイルをコピー
COPY ./susan-next/ ./

CMD [ "yarn", "build" ]