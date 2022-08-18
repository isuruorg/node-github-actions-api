FROM node:16.10.0-alpine

WORKDIR /usr/src/api
COPY yarn.lock ./
COPY package.json ./
RUN yarn cache clean && yarn --update-checksums
COPY . ./
EXPOSE 4000

CMD ["yarn", "start:dev"]
