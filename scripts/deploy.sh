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
        cd services/api
        yarn migration:run
    )
EOF
