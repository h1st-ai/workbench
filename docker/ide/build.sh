#!/bin/bash

VERSION=${1:-"latest"}

docker build -f ./docker/ide/Dockerfile -t h1st/workbench:$VERSION .
