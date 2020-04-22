#!/bin/bash

# check docker-compose
DOCKER_COMPOSE=`which docker-compose`
if ! [ -x "${DOCKER_COMPOSE}" ]; then
    echo "Please install docker-compose first"
else
    ${DOCKER_COMPOSE} build
    ${DOCKER_COMPOSE} up -d
fi
