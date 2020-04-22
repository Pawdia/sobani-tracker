#!/bin/bash

# check docker
DOCKER=`which docker`
if ! [ -x "${DOCKER}" ]; then
    echo "Please install docker first"
else
    ${DOCKER} build -t sobani-tracker .
    ${DOCKER} run -p 3000:3000/udp --restart=always -v ./config:/usr/src/sobani-tracker/config sobani-tracker
fi
