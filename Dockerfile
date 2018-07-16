FROM node:alpine

WORKDIR /app
ADD . /app

RUN npm install --production

EXPOSE 3000

ENV HOSTNAME 2.vbb.transport.rest
ENV PORT 3000

CMD ["npm", "start"]
