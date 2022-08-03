FROM node:16.14.2-alpine
WORKDIR /app/

# パッケージインストールのためのコマンド追加
COPY ./package.json ./yarn.lock ./
RUN yarn install --frozen-lockfile
# 全ファイルをコピー
COPY ./ ./

CMD [ "yarn", "build" ]