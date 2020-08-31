#!/bin/bash

ssh ubuntu@13.52.242.238 << EOF
    set -ex

    . ~/.nvm/nvm.sh

    cd /opt/dashboard
    export $(cat .env | xargs)
    
    git pull

    (
        cd services/web
        yarn build:prod
        (sudo docker rm -f dashboard_web || true)
        sudo docker run -d --name dashboard_web --restart always -p 3000:80 -v \`pwd\`/build:/usr/share/nginx/html nginx
    )

    (
        sudo docker build -f docker/Dockerfile -t h1st/dashboard-api .
        cd services/api
        sudo docker run --rm --env-file .env h1st/dashboard-api yarn migration:run
        (sudo docker rm -f dashboard_api || true)
        sudo docker run -d --name dashboard_api --restart always --env-file .env \
            -p 3001:3001 h1st/dashboard-api
    )
EOF
