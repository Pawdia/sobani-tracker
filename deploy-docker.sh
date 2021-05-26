#!/bin/bash

# check docker
DOCKER=`which docker`
if ! [ -x "${DOCKER}" ]; then
    echo "Please install docker first"
else
    ${DOCKER} build -t sobani-tracker .
    ${DOCKER} run -p 8123:8123/udp --restart=always -v ./:/usr/src/sobani-tracker/conf sobani-tracker
fi
