#!/bin/bash

if [[ "$1" == "PROD" ]]; then
    HOST=13.52.242.238
    REACT_APP_STAGE=production
else
    HOST=10.30.128.207
    REACT_APP_STAGE=staging
fi

ssh -A ubuntu@$HOST << EOF
    set -ex

    . ~/.nvm/nvm.sh

    cd /opt/dashboard
    export $(cat .env | xargs)
    
    git pull

    (
        export REACT_APP_STAGE=$REACT_APP_STAGE
        cd services/web
        yarn install && yarn run build
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
