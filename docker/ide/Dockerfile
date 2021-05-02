
FROM theiaide/theia-python:1.5.0

# switch to py3 as default
RUN PYTHON_PATH=`which python` && \
    rm -f $PYTHON_PATH && ln -s `which python3` $PYTHON_PATH && \
    PIP_PATH=`which pip` && \
    rm -f $PIP_PATH && ln -s `which pip3` $PIP_PATH

COPY ./docker/ide/components/requirements.txt /tmp
RUN pip3 install --no-cache -r /tmp/requirements.txt

# ENV THEIA_DEFAULT_PLUGINS=local-dir:/home/theia/browser-app/plugins

# COPY ./package.json /home/theia

# COPY ./h1st/package.json /home/h1st/package.json
# COPY ./h1st/tsconfig.json /home/h1st/tsconfig.json
# COPY ./h1st/src /home/h1st/src

WORKDIR /home/theia

RUN rm -rf *

COPY ./ide/yarn.lock ./yarn.lock
COPY ./ide/package.json   ./package.json
COPY ./ide/lerna.json   ./lerna.json

COPY ./ide/h1st ./h1st
COPY ./ide/browser-app ./browser-app

RUN yarn global add @theia/cli@1.5.0 pm2 && yarn && \
    curl -O https://bin.equinox.io/c/4VmDzA7iaHb/ngrok-stable-linux-amd64.zip && \
    unzip ./ngrok-stable-linux-amd64.zip && chmod +x ./ngrok && \
    cp ./ngrok /usr/bin && \
    rm ngrok-stable-linux-amd64.zip ngrok

WORKDIR /home/theia/browser-app
RUN NODE_OPTIONS="--max_old_space_size=4096" yarn run build:pro && yarn run download:plugins && \
    cd /tmp && curl -LO https://github.com/traefik/traefik/releases/download/v2.3.0/traefik_v2.3.0_linux_amd64.tar.gz && \
    tar -xf traefik_v2.3.0_linux_amd64.tar.gz && \
    mv traefik /usr/local/bin && mkdir -p /opt/traefik && mkdir -p /root/.jupyter

COPY ./docker/ide/traefik.yml /opt
COPY ./docker/ide/traefik-service.yml /opt/traefik
COPY ./docker/ide/jupyter_notebook_config.py /root/.jupyter/jupyter_notebook_config.py

COPY ./services/tune /opt/tune/
RUN pip3 install --no-cache -r /opt/tune/requirements.txt

COPY ./docker/ide/components/index.html ./src-gen/frontend/index.html
COPY ./docker/ide/components/index.html ./lib/index.html
COPY ./docker/ide/entrypoint.sh ./docker/ide/app.sh /

# this is also updated more often
RUN pip3 install --no-cache --force-reinstall git+https://github.com/h1st-ai/h1st && \
    apt-get update -y && apt-get install -y rsync

WORKDIR /home/theia/browser-app
EXPOSE 3000

ENV SHELL=/bin/bash \
    THEIA_DEFAULT_PLUGINS=local-dir:/home/theia/browser-app/plugins \
    LD_LIBRARY_PATH=/usr/local/cuda-11.0/lib64${LD_LIBRARY_PATH:+:${LD_LIBRARY_PATH}}
ENTRYPOINT [ "/entrypoint.sh" ]
CMD ["/app.sh"]
