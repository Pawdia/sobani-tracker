#!/bin/bash

# update apt
sudo apt-get update

install_node() {
    sudo curl -sL https://deb.nodesource.com/setup_13.x | sudo bash -
    sudo apt-get install -y nodejs
}

# install nodejs
NODE=`which node`
NPM=`which npm`
SHOULD_INSTALL_NODE=false
if ! [ -x "${NODE}" ]; then
    NODE_VER=`node -v | awk -F'.' '{ print substr($1, 2, length($1) - 1)}'`
    if ! [ -x "${NODE_VER}" -le 10 ]; then
        SHOULD_INSTALL_NODE=true
    fi
    if ! [ ! -x "${NPM}" ]; then
        SHOULD_INSTALL_NODE=true
    fi
else
    SHOULD_INSTALL_NODE=true
fi

if [ "${SHOULD_INSTALL_NODE}" ]; then
    install_node
fi

# install git
GIT=`which git`
if ! [ -x "${GIT}" ]; then
    sudo apt-get install -y git
fi

# clone sobani-tracker
git clone https://github.com/nekomeowww/sobani-tracker ~/sobani-tracker
cd ~/sobani-tracker

# install sobani-tracker dependenceis
npm install --save

# generate systemd service file
cat <<EOF | sudo tee /etc/systemd/system/sobani-tracker.service
[Unit]
Description=Sobani Tracker
After=network-online.target

[Service]
User=${USER}
WorkingDirectory=${HOME}/sobani-tracker
ExecStart=/usr/bin/node ${HOME}/sobani-tracker/app.js
# Restart every >2 seconds to avoid StartLimitInterval failure
RestartSec=5
Restart=always

[Install]
WantedBy=multi-user.target
EOF

# enable and start sobani-tracker
sudo systemctl enable sobani-tracker.service
sudo systemctl start sobani-tracker

sudo systemctl status sobani-tracker
