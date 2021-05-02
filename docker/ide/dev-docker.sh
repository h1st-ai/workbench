# Run this command to install nvidia container runtime in GPU machine
# so that docker can use GPUs
# Reference link: https://towardsdatascience.com/how-to-properly-use-the-gpu-within-a-docker-container-4c699c78c6d1
apt-get install nvidia-container-runtime

docker run -it --init -p 3000:3000  -v "$(pwd)/browser-app:/home/theia/browser-app" -v "$(pwd)/h1st:/home/theia/h1st"  -e WORKSPACE_PATH="/home/project"  -e WORKBENCH_NAME="H1stSample"  h1st/workbench:latest

# run docker with --gpus flag and cuda lib from GPU machine
docker run -d -p 80:3000 -v "/home/ubuntu/data:/home/project" -v "/usr/local/cuda-11.0:/usr/local/cuda-11.0" --name workbench_gpus --restart=always --gpus all workbench
