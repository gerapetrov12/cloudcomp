FROM openalpr/openalpr

COPY ./openalpr /openalpr

WORKDIR /openalpr
RUN dir /openalpr
# Install prerequisites
RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y \
&& apt-get install curl gnupg -yq \
&& curl -sL https://deb.nodesource.com/setup_8.x | bash \
&& apt-get install nodejs -yq
EXPOSE 3001/tcp
RUN npm install amqplib/callback_api

CMD [ "node", "index.js" ]