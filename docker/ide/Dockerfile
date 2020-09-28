
FROM theiaide/theia-python

COPY ./docker/ide/components/requirements.txt /tmp
RUN pip3 install --no-cache -r /tmp/requirements.txt
RUN pip3 install git+https://github.com/h1st-ai/h1st

# switch to py3 as default
RUN PYTHON_PATH=`which python` && \
  rm -f $PYTHON_PATH && ln -s `which python3` $PYTHON_PATH && \
  PIP_PATH=`which pip` && \
  rm -f $PIP_PATH && ln -s `which pip3` $PIP_PATH

# ENV THEIA_DEFAULT_PLUGINS=local-dir:/home/theia/browser-app/plugins

# COPY ./package.json /home/theia

# COPY ./h1st/package.json /home/h1st/package.json
# COPY ./h1st/tsconfig.json /home/h1st/tsconfig.json
# COPY ./h1st/src /home/h1st/src

WORKDIR /home/theia

RUN rm -rf *

COPY ./ide/yarn.lock ./yarn.lock
COPY ./ide/package.json   ./package.json
COPY ./ide/yarn.lock   ./yarn.lock
COPY ./ide/lerna.json   ./lerna.json

COPY ./ide/h1st/package.json ./h1st/package.json
COPY ./ide/h1st/tsconfig.json ./h1st/tsconfig.json
COPY ./ide/h1st/src ./h1st/src

COPY ./ide/browser-app/package.json ./browser-app/package.json

RUN yarn global add @theia/cli@1.5.0 && yarn

WORKDIR /home/theia/browser-app
RUN NODE_OPTIONS="--max_old_space_size=4096" yarn run build:pro && yarn run download:plugins

RUN cd /tmp && curl -LO https://github.com/traefik/traefik/releases/download/v2.3.0/traefik_v2.3.0_linux_amd64.tar.gz && \
  tar -xf traefik_v2.3.0_linux_amd64.tar.gz && \
  mv traefik /usr/local/bin && mkdir -p /opt/traefik

COPY ./docker/ide/traefik.yml /opt
COPY ./docker/ide/traefik-service.yml /opt/traefik

COPY ./docker/ide/components/index.html ./src-gen/frontend/index.html
COPY ./docker/ide/components/index.html ./lib/index.html

EXPOSE 3000
COPY ./docker/ide/entrypoint.sh ./docker/ide/app.sh /

ENV SHELL=/bin/bash \
  THEIA_DEFAULT_PLUGINS=local-dir:/home/theia/browser-app/plugins 

ENTRYPOINT [ "/entrypoint.sh" ]
WORKDIR /home/theia/browser-app

CMD ["/app.sh"]
