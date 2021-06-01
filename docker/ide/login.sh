export $(cat .env | xargs)

aws ecr get-login-password --region us-west-1 | docker login --username AWS --password-stdin 394497726199.dkr.ecr.us-west-1.amazonaws.com

ECR_REPO_LINK="733647232589.dkr.ecr.us-west-1.amazonaws.com"
aws ecr get-login-password --region us-west-1 --profile aitomatic | docker login --username AWS --password-stdin $ECR_REPO_LINK
