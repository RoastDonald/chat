FROM node:12.14.1

WORKDIR /usr/src/telegram
COPY ./package.json ./

RUN npm install

RUN npm run build-server
RUN cp .env ./build

CMD ["npm","run","dev"]