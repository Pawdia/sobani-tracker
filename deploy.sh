#!/bin/bash

# update apt
sudo apt-get update

install_go() {
    sudo apt-get install -y go
}

# install nodejs
GO=`which go`
SHOULD_INSTALL_GO=false
if ! [ -x "${GO}" ]; then
    GO_VER=`go version | awk -F'.' '{ print substr($2, 1)}'`
    if ! [ -x "${GO_VER}" -le 15 ]; then
        SHOULD_INSTALL_GO=true
    fi
else
    SHOULD_INSTALL_GO=true
fi

if [ "${SHOULD_INSTALL_GO}" ]; then
    install_go
fi

# install git
GIT=`which git`
if ! [ -x "${GIT}" ]; then
    sudo apt-get install -y git
fi

# clone sobani-tracker
git clone https://github.com/Pawdia/sobani-tracker ~/sobani-tracker
cd ~/sobani-tracker

# install sobani-tracker dependenceis
go build -o sobani-tracker
cp conf.yaml.example conf.yaml

# generate systemd service file
cat <<EOF | sudo tee /etc/systemd/system/sobani-tracker.service
[Unit]
Description=Sobani Tracker
After=network-online.target
[Service]
User=${USER}
WorkingDirectory=${HOME}/sobani-tracker
ExecStart=${HOME}/sobani-tracker/sobani-tracker
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
