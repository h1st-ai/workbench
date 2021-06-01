aws ecr get-login-password --region us-west-1 | docker login --username AWS --password-stdin 394497726199.dkr.ecr.us-west-1.amazonaws.com
docker pull 394497726199.dkr.ecr.us-west-1.amazonaws.com/h1st/workbench:latest

ECR_REPO_LINK="733647232589.dkr.ecr.us-west-1.amazonaws.com"
aws ecr get-login-password --region us-west-1 --profile aitomatic | docker login --username AWS --password-stdin $ECR_REPO_LINK
docker pull $ECR_REPO_LINK/workbench_gpus:latest
