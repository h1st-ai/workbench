#!/bin/bash

aws ecr get-login-password --region us-west-1 | docker login --username AWS --password-stdin 394497726199.dkr.ecr.us-west-1.amazonaws.com
docker tag h1st/workbench 394497726199.dkr.ecr.us-west-1.amazonaws.com/h1st/workbench:latest
docker push 394497726199.dkr.ecr.us-west-1.amazonaws.com/h1st/workbench:latest
