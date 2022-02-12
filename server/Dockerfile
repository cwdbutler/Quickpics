FROM node:16

WORKDIR /src/app

COPY package.json yarn.lock ./

RUN yarn

COPY . .

RUN yarn build

ENV NODE_ENV production

EXPOSE 80

CMD ["node", "dist/index.js"]

USER node