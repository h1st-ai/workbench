# H1ST WORKBENCH

There are two main components:

- Saas services: located in `/services`. These are services required to run the site at https://cloud.h1st.ai
- Workbench IDE: located in `/ide`. This is the actual Workbench IDE. It's based on Theia editor https://theia-ide.org/. We're writing an extension to do what we want

## Requirements:

- yarn >= 1.13
- docker
- node == 12

## Setting up development environment:

There are some required environment variables:

- `H1ST_VSWB_PATH` set this to the root of the project on your hard drive (E.g `/Users/khoama/Workspace/Arimo/vswb`)
- `WORKSPACE_PATH` set this to some existing folder on your hard drive. This serves as the entry point for the workspace when we start the IDE. This folder should have at least 1 sub folder.
- `WORKBENCH_NAME` (optional): By default the Workbench will pick up the first child of `WORKSPACE_PATH` and make it the workbench name. If you want to override that, set this to the name of the subfolder you want to be the workspace.
- In `/services/api`, create a `.env` file from `.env_template`, override the variables in there if needed.

### Saas services

1. Starting docker: `cd ./docker && docker-compose -f dev.yml up`
2. Starting api: `cd ./services/api && yarn start`
3. Starting web ui: `cd ./services/web && yarn start`. Select yes when prompted

### First time setup

- Install nginx and use the config file from `services/auth/nginx.confg.template` to use nginx as the proxy for the local services
- Start nginx
- Visit http://localhost/access/auth and set up the local realm named `h1st` that can be used for the local authentication service
- Now the web ui should be available at http://localhost
