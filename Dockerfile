FROM node:16.14.2-alpine
WORKDIR /app/

CMD [ "yarn", "build" ]