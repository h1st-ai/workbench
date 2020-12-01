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

if [ -d "/local/ws-${WORKBENCH_ID}/python" ]; then
    export PATH=/local/ws-${WORKBENCH_ID}/python/bin:$PATH
fi

# run these in background
(
    node /home/theia/browser-app/src-gen/backend/main.js "$WORKSPACE_PATH/$WORKBENCH_NAME" --hostname=0.0.0.0 --port 3001 &
)


start-jupyter() {
    cd $WORKSPACE_PATH
    EXTRAPATH=$(find `pwd`/ -maxdepth 1 -type d | xargs -n 999 | tr -s ' ' ':')
    export PYTHONPATH=$EXTRAPATH:$PYTHONPATH
    jupyter-notebook --allow-root
}

start-api() {
    export PYTHONPATH=/opt/tune:$PYTHONPATH
    DIR_NAME=`python -c "import h1st.cli.project as prj; print(prj._clean_name('$WORKBENCH_NAME')[0])"`
    cd $WORKSPACE_PATH/$DIR_NAME
    uvicorn --port 3002 tune_server.server:app
}

start-jupyter &
start-api &

exec traefik --configfile /opt/traefik.yml
