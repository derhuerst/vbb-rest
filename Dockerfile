FROM node:alpine

WORKDIR /app
ADD . /app

RUN apk add --update git && \
	npm install --production && \
	rm -rf /tmp/* /var/cache/apk/*

EXPOSE 3000

ENV HOSTNAME 2.vbb.transport.rest
ENV PORT 3000

CMD ["npm", "start"]
