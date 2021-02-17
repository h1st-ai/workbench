#!/bin/bash

# export NVM_DIR="$HOME/.nvm"
# [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
# [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

#Define cleanup procedure
preStop() {
    echo "Container stopped, performing cleanup..."
    pip freeze > /home/project/requirements_xyz_tmp.txt
    # Check for difference and keep only new packages
    awk 'NR == FNR{ a[$0] = 1;next } !a[$0]' /home/project/requirements_xyz_tmp.txt /home/project/requirements_xyz.txt > /home/project/requirements_xyz.txt
    rm /home/project/requirements_xyz_tmp.txt
}


PYTHON_REQ_FILE=/home/project/requirements_xyz.txt
if [ -f "$PYTHON_REQ_FILE"]; then
    # Install new packages
    pip install -r $PYTHON_REQ_FILE
else
    # List out default packages for later pre-stopping comparision
    pip freeze > $PYTHON_REQ_FILE
fi

#Trap SIGTERM
trap 'true' SIGTERM

#Execute command
# nvm use default
"$@"

#Wait
wait $!

#Cleanup
preStop