FROM node:alpine

LABEL maintainer="Pawdia <pawdia@async.moe>"

# Create app directory
WORKDIR /usr/src/sobani-tracker

# Bundle app source
COPY . .

RUN npm install
EXPOSE 3000/udp

CMD [ "node", "app.js" ]
