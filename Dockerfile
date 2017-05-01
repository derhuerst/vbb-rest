FROM node

WORKDIR /app
ADD . /app

RUN npm install

EXPOSE 3000

ENV HOSTNAME vbb.transport.rest
ENV PORT 3000

CMD ["npm", "start"]
