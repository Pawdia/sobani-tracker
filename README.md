# sobani-tracker

## Introduction

Aim to set up a tracker server for sobani service and clients

## Setup with Docker

Clone to your instance

```
git clone https://github.com/nekomeowww/sobani-tracker.git
```

```
cd sobani-tracker

# default port is 3000
# if you want another port
# please edit in deploy-docker.sh
# if you are using this with docker composer
# please change config.json and Dockerfile

# setup by script
chmod +x ./deploy-docker.sh
./deploy-docker.sh

# or setup manually
docker build -t sobani-tracker .
docker run -p 3000:3000/udp \
  --restart=always \
  -v ./config:/usr/src/sobani-tracker/config \
  sobani-tracker

# test
# default tracker set to '127.0.0.1:8123'
node test/test-client-only.js
```

## Setup with Docker Composer

Clone to your instance

```
git clone https://github.com/Pawdia/sobani-tracker.git
```

```
cd sobani-tracker

# default port is 3000
# if you want to use another port
#   please edit in docker-compose.yml
# docker-compose.yml will map `./config` in host to
#   `/usr/src/sobani-tracker/config` in container by default

chmod +x ./deploy-docker-compose.sh
./deploy-docker-compose.sh

# test
# default tracker set to '127.0.0.1:8123'
node test/test-client-only.js
```

## Setup

Clone to your instance

```
git clone https://github.com/Pawdia/sobani-tracker.git
```

Install dependencies

```
cd sobani-tracker
yarn install
```

Start server

```
yarn run test
```
