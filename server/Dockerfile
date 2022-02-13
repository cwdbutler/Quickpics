FROM node:16.13

WORKDIR /src/app

COPY package.json yarn.lock ./
COPY prisma ./prisma/

RUN yarn

COPY . .
COPY .env.production .env
# overwrite environment variables with the production ones

ENV NODE_ENV=production

RUN yarn prisma:deploy
# push migrations from schema
RUN yarn build


EXPOSE 80

CMD ["node", "dist/index.js"]

USER node