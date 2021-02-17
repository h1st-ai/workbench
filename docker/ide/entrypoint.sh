#!/bin/bash

# export NVM_DIR="$HOME/.nvm"
# [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
# [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

#Define cleanup procedure
preStop() {
    echo "Container stopped, performing cleanup..."
    pip3 freeze > /home/project/requirements_xyz.txt
}

PYTHON_REQ_FILE=/home/project/requirements_xyz.txt
if [ -f "$PYTHON_REQ_FILE" ]; then
    # Install new packages
    echo "Install new packages"
    pip3 install --no-cache -r $PYTHON_REQ_FILE
else
    # List out default packages for later pre-stopping comparision
    echo "Save list of packages for later pre-stopping comparision"
    pip3 freeze > $PYTHON_REQ_FILE
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