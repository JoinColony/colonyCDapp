#!/bin/bash

# # Add official Docker GPG key
# sudo install -m 0755 -d /etc/apt/keyrings
# curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
# sudo chmod a+r /etc/apt/keyrings/docker.gpg

# # Setup docker repo
# echo \
#   "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
#   "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
#   sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# # Update and install required dependencies
# sudo apt-get update -y
# sudo apt-get install -y ca-certificates curl gnupg awscli nodejs npm git nginx apache2-utils netcat unzip wget

# # Install docker dependencies
# sudo apt-get -y install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# # Install docker compose plugin
# sudo apt-get -y install docker-compose-plugin

# # Start Docker service
# sudo usermod -aG docker ubuntu
# sudo systemctl start docker

# Download the CloudWatch agent
wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb

# Install the CloudWatch agent
dpkg -i -E ./amazon-cloudwatch-agent.deb

# Create a directory for the CloudWatch Agent configuration file
mkdir -p /opt/aws/amazon-cloudwatch-agent/etc

# Write CloudWatch Agent configuration file
cat > /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json << EOF
{
    "logs": {
        "logs_collected": {
            "files": {
                "collect_list": [
                    {
                        "file_path": "/var/log/cloud-init-output.log",
                        "log_group_name": "on-demand-envs",
                        "log_stream_name": "{instance_id}"
                    }
                ]
            }
        }
    }
}
EOF

# Start the CloudWatch Agent
sudo systemctl start amazon-cloudwatch-agent

# Enable the CloudWatch Agent to start on boot
sudo systemctl enable amazon-cloudwatch-agent

# URL-encode the log group and log stream names
LOG_GROUP_NAME="on-demand-envs"
INSTANCE_ID=$(curl -s http://169.254.169.254/latest/meta-data/instance-id)
ENCODED_LOG_GROUP_NAME=$(python3 -c "import urllib.parse; print(urllib.parse.quote('$LOG_GROUP_NAME'))")
ENCODED_LOG_STREAM_NAME=$(python3 -c "import urllib.parse; print(urllib.parse.quote('$INSTANCE_ID'))")

# Construct the CloudWatch Logs URL
REGION="eu-west-2"
CLOUDWATCH_URL="https://console.aws.amazon.com/cloudwatch/home?region=$REGION#logsV2:log-groups/log-group/$ENCODED_LOG_GROUP_NAME/log-events/$ENCODED_LOG_STREAM_NAME"

# Check if Discord user ID is provided
if [ -z "$DISCORD_USER_ID" ]; then
    echo "No Discord user ID provided."
    DISCORD_GREETING="Hey there person with no Discord ID"
    exit 1
else
    echo "Discord user ID provided."
    DISCORD_GREETING="Hey <@$DISCORD_USER_ID>"
fi

# Need to create JSON payload for the Discord notification with the URL embedded, otherwise the CW URL would be too long in the message
read -r -d '' PAYLOAD << EOM
{
  "embeds": [
    {
      "title": "Dev Environment Setup",
      "description": "$DISCORD_GREETING, your dev environment is getting ready, you can keep an eye on it [here]($CLOUDWATCH_URL).",
      "color": 5814783
    }
  ]
}
EOM

# Send initial notification on Discord
curl -H "Content-Type: application/json" \
     -X POST \
     -d "$PAYLOAD" \
     $DISCORD_WEBHOOK

# # Loop through array of image names, pull them and tag them with local name
# for i in "${IMAGE_NAMES[@]}"
# do
#     docker pull 204031746016.dkr.ecr.eu-west-2.amazonaws.com/on-demand-env:$i
#     docker tag 204031746016.dkr.ecr.eu-west-2.amazonaws.com/on-demand-env:$i colony-cdapp-dev-env/$i
# done

# Login to ECR
aws ecr get-login-password --region eu-west-2 | docker login --username AWS --password-stdin 204031746016.dkr.ecr.your-region.amazonaws.com

# Pull docker images
echo "Pulling docker images..."
docker pull 204031746016.dkr.ecr.eu-west-2.amazonaws.com/on-demand-env:base
docker pull 204031746016.dkr.ecr.eu-west-2.amazonaws.com/on-demand-env:network
docker pull 204031746016.dkr.ecr.eu-west-2.amazonaws.com/on-demand-env:block-ingestor
docker pull 204031746016.dkr.ecr.eu-west-2.amazonaws.com/on-demand-env:amplify
docker pull 204031746016.dkr.ecr.eu-west-2.amazonaws.com/on-demand-env:auth-proxy
docker pull 204031746016.dkr.ecr.eu-west-2.amazonaws.com/on-demand-env:reputation-monitor

# Tag docker images with local name
echo "Tagging docker images..."
docker tag 204031746016.dkr.ecr.eu-west-2.amazonaws.com/on-demand-env:base colony-cdapp-dev-env/base
docker tag 204031746016.dkr.ecr.eu-west-2.amazonaws.com/on-demand-env:network colony-cdapp-dev-env/network
docker tag 204031746016.dkr.ecr.eu-west-2.amazonaws.com/on-demand-env:block-ingestor colony-cdapp-dev-env/block-ingestor
docker tag 204031746016.dkr.ecr.eu-west-2.amazonaws.com/on-demand-env:amplify colony-cdapp-dev-env/amplify
docker tag 204031746016.dkr.ecr.eu-west-2.amazonaws.com/on-demand-env:auth-proxy colony-cdapp-dev-env/auth-proxy
docker tag 204031746016.dkr.ecr.eu-west-2.amazonaws.com/on-demand-env:reputation-monitor colony-cdapp-dev-env/reputation-monitor

# Clone the repo
git clone https://github.com/JoinColony/colonyCDapp.git ~/app
cd ~/app

# Check and apply the correct git action based on the input
if [ ! -z "$PR_NUMBER" ]; then
    git fetch origin pull/$PR_NUMBER/head:pr-branch
    git checkout pr-branch
    SOURCE_USED="PR Number: $PR_NUMBER"
    echo "Checked out the repo using PR Number: $PR_NUMBER"
elif [ ! -z "$BRANCH" ]; then
    git checkout $BRANCH
    SOURCE_USED="Branch: $BRANCH"
    echo "Checked out the repo using Branch: $BRANCH"
elif [ ! -z "$COMMIT_HASH" ]; then
    git checkout $COMMIT_HASH
    SOURCE_USED="Commit Hash: $COMMIT_HASH"
    echo "Checked out the repo using Commit Hash: $COMMIT_HASH"
else
    echo "No valid source provided."
    exit 1
fi


# Create a user and password for HTTP Basic Authentication
sudo mkdir -p /etc/nginx
# sudo htpasswd -cb /etc/nginx/.htpasswd user yourpassword
PASSWORD=$(aws ssm get-parameter --region eu-west-2 --name "/qa/pr-environment/password" --with-decryption --query "Parameter.Value" --output text)
USERNAME=$(aws ssm get-parameter --region eu-west-2 --name "/qa/pr-environment/username" --query "Parameter.Value" --output text)

sudo htpasswd -cb /etc/nginx/.htpasswd $USERNAME $PASSWORD

# Get the public IP
PUBLIC_IP=$(curl http://169.254.169.254/latest/meta-data/public-ipv4)

# Use the IP address in the OpenSSL command
sudo mkdir -p /etc/nginx/ssl
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/nginx.key -out /etc/nginx/ssl/nginx.crt \
    -subj "/CN=$PUBLIC_IP"


# Create a new Nginx configuration file for reverse proxy with authentication
cat <<EOL | sudo tee /etc/nginx/sites-available/myapp
server {
    listen       80;
    server_name  _;

    # Redirect all HTTP requests to HTTPS with a 301 Moved Permanently response.
    return 301 https://\$host\$request_uri;
}

server {
    listen 443 ssl;
    server_name _;

    # Specify the key and certificate file
    ssl_certificate /etc/nginx/ssl/nginx.crt;
    ssl_certificate_key /etc/nginx/ssl/nginx.key;

    location / {
        auth_basic "Restricted Access";
        auth_basic_user_file /etc/nginx/.htpasswd;

        proxy_pass http://localhost:9091;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}

server {
    listen 20003 ssl; # Nginx listens on this port
    server_name _;

    ssl_certificate /etc/nginx/ssl/nginx.crt;
    ssl_certificate_key /etc/nginx/ssl/nginx.key;

    location / {
        proxy_pass http://localhost:20002; # Proxy to GraphQL service
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}

server {
    listen 8546 ssl; # SSL for port 8546
    server_name _;

    # Specify the key and certificate file
    ssl_certificate /etc/nginx/ssl/nginx.crt;
    ssl_certificate_key /etc/nginx/ssl/nginx.key;

    location / {
        proxy_pass http://localhost:8545; 
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOL

# Enable the site and restart Nginx
sudo ln -s /etc/nginx/sites-available/myapp /etc/nginx/sites-enabled
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl restart nginx

# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

nvm install 16
nvm use 16

# Set env vars (reputation endpoint is 3001 and graphql is 20002, but increasing number by 1 to serve from nginx)
cat <<EOL > ./.env
METATRANSACTIONS=true
REPUTATION_ORACLE_ENDPOINT=https://${PUBLIC_IP}:3002/reputation/local
NETWORK_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
GANACHE_RPC_URL=https://${PUBLIC_IP}:8546
NETWORK=ganache
AWS_APPSYNC_KEY=da2-fakeApiId123456
AWS_APPSYNC_GRAPHQL_URL=https://${PUBLIC_IP}:20003/graphql
EOL

# Install appropriate npm version and dependencies
npm install -g npm@8
npm i

# Build and run Docker images
npm run dev &

# Wait for graphql service to come up
while ! nc -z localhost 20002; do
  sleep 10
done

# Seed database
node ./scripts/temp-create-data.js

# Start frontend
npm run webpack &

# Wait for frontend service to come up
while ! nc -zv localhost 9091; do
  echo "Waiting for port 9091 to be open..."
  sleep 10
done
echo "Port 9091 is now open!"

# Send completion notification on Discord
curl -H "Content-Type: application/json" \
     -X POST \
     -d '{"content":"'"$DISCORD_GREETING"', your dev environment for '"$SOURCE_USED"' is ready to use at [IP: '"$PUBLIC_IP"'](https://'"$PUBLIC_IP"') !"}' \
     $DISCORD_WEBHOOK
echo "Completion message posted!"
