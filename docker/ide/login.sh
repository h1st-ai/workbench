export $(cat .env | xargs)
aws ecr get-login-password --region us-west-1 | sudo docker login --username AWS --password-stdin 394497726199.dkr.ecr.us-west-1.amazonaws.com