#!/usr/bin/env bash
apt-get update && \
apt-get install -y libfontconfig zip git apt-transport-https ca-certificates curl openssl software-properties-common && \
curl -fsSL https://deb.nodesource.com/setup_14.x | bash - && \
apt-get install -y nodejs && \
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -  && \
add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable" && \
apt-get update && \
apt-get install -y docker-ce && \
node --version && \
npm --version && \
npm i -g yarn