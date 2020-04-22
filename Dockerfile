FROM node:buster-slim

# Create app directory
WORKDIR /usr/src/sobani-tracker

# Bundle app source
COPY . .

RUN npm install
EXPOSE 3000

CMD [ "node", "app.js" ]
