#!/bin/bash

# export NVM_DIR="$HOME/.nvm"
# [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
# [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

PYTHON_REQ_FILE=/home/project/_requirements.txt
PYTHON_REQ_START_FILE=/home/project/_requirements_start.txt
PYTHON_REQ_STOP_FILE=/home/project/_requirements_stop.txt

#Define cleanup procedure
preStop() {
    echo "Container stopped, performing cleanup..."
    pip3 freeze > $PYTHON_REQ_STOP_FILE
    # Check for difference and keep only new packages
    awk 'NR == FNR{ a[$0] = 1;next } !a[$0]'  $PYTHON_REQ_START_FILE $PYTHON_REQ_STOP_FILE > $PYTHON_REQ_FILE
    rm $PYTHON_REQ_START_FILE
    rm $PYTHON_REQ_STOP_FILE
}

pip3 freeze > $PYTHON_REQ_START_FILE
if [ -f "$PYTHON_REQ_FILE" ]; then
    # Install new packages
    echo "Install installed packages from the last session"
    pip3 install --no-cache -r $PYTHON_REQ_FILE
fi

#Trap SIGTERM
trap 'true' SIGTERM

#Execute command
# nvm use default
"$@" &

#Wait
wait $!

#Cleanup
preStop