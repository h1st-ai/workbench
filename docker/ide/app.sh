#!/bin/bash

set -x

WORKSPACE_PATH=${WORKSPACE_PATH:-"/home/project"}
WORKBENCH_NAME=${WORKBENCH_NAME:-"/SampleProject"}

if [ ! -d "$WORKSPACE_PATH/$WORKBENCH_NAME" ]; then
    if [ ! -e "$WORKSPACE_PATH" ]; then
        mkdir -p $WORKSPACE_PATH
    fi

    (
        cd $WORKSPACE_PATH
        h1 new-project "$WORKBENCH_NAME"
    )
fi

# run these in background
(
    node /home/theia/browser-app/src-gen/backend/main.js "$WORKSPACE_PATH/$WORKBENCH_NAME" --hostname=0.0.0.0 --port 3001 &
)

(
    jupyter-notebook --allow-root &
)

exec traefik --configfile /opt/traefik.yml
