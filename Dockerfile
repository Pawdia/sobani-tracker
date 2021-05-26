FROM registry.semaphoreci.com/golang:1.15 as builder

LABEL maintainer="Pawdia <pawdia@async.moe>"

# Create app directory
WORKDIR /usr/src/sobani-tracker

# Bundle app source
COPY . .

# Build sobani-tracker
RUN go mod download
RUN go mod verify
RUN go build -o sobani-tracker

# Build environment
FROM debian:buster
FROM registry.semaphoreci.com/golang:1.15

COPY conf.yaml.example conf.yaml
EXPOSE 8123/udp
CMD ["./sobani-tracker"]
