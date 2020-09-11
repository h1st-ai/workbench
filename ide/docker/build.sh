#!/bin/bash

VERSION=${1:-"latest"}

docker build -f ./docker/Dockerfile -t h1st/workbench:$VERSION .
