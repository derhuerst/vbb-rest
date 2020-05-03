FROM node:alpine as builder
WORKDIR /app

RUN apk add --update git bash

ADD package.json /app
RUN npm install --production

FROM node:alpine
WORKDIR /app

EXPOSE 3000

ENV HOSTNAME v5.vbb.transport.rest
ENV PORT 3000

COPY --from=builder /app/node_modules ./node_modules
ADD . /app

RUN npm run build

CMD ["node", "index.js"]
