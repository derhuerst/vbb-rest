FROM node:16.8.0-alpine3.13 as builder
WORKDIR /app

# install dependencies
RUN apk add --update git bash
ADD package.json /app
RUN npm install

# build documentation
ADD . /app
RUN npm run build

# ---

FROM node:16.8.0-alpine3.13
WORKDIR /app

# install dependencies
ADD package.json /app
RUN npm install --production

# add source code
ADD . /app
COPY --from=builder /app/docs ./docs

EXPOSE 3000

ENV HOSTNAME v5.vbb.transport.rest
ENV PORT 3000

CMD ["node", "index.js"]
