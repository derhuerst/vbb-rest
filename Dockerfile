FROM node:alpine

WORKDIR /app
ADD . /app

RUN apk add --update git bash && \
	npm install --production && \
	rm -rf /tmp/* /var/cache/apk/*

EXPOSE 3000

ENV HOSTNAME 2.vbb.transport.rest
ENV PORT 3000

CMD ["/bin/sh", "docker-entrypoint.sh"]
