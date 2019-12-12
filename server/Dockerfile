FROM node:10

COPY ./server /server

WORKDIR /server

RUN dir /server
RUN npm install
RUN npm install --save minio
RUN npm install fs
RUN npm install http
RUN npm install amqplib
RUN npm install nodemailer
EXPOSE 3000/tcp
HEALTHCHECK --interval=30s --timeout=3s \
CMD curl -f http://localhost/ || exit 1

CMD [ "node", "index.js" ]
