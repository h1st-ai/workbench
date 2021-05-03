export $(cat .env | xargs)
ECR_REPO_LINK="733647232589.dkr.ecr.us-west-1.amazonaws.com"
aws ecr get-login-password --region us-west-1 | sudo docker login --username AWS --password-stdin $ECR_REPO_LINK
