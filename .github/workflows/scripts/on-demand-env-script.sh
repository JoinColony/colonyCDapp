#!/bin/bash

# Add official Docker GPG key
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Setup docker repo
echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Update and install required dependencies
sudo apt-get update -y
sudo apt-get install -y ca-certificates curl gnupg
sudo apt-get install -y nodejs npm git nginx apache2-utils netcat

# Install docker dependencies
sudo apt-get -y install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Install docker compose plugin
sudo apt-get -y install docker-compose-plugin

# Start Docker service
sudo usermod -aG docker ubuntu
sudo systemctl start docker

# Clone the repo
git clone https://github.com/JoinColony/colonyCDapp.git ~/app

# Checkout specific PR (use the passed PR number)
cd ~/app
git checkout env/temp-environments
# git fetch origin pull/$PR_NUMBER/head:pr-branch
# git checkout pr-branch

# Clone the repo
git clone https://github.com/Org/repo.git ~/app
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
PASSWORD=$(aws ssm get-parameter --name "/qa/pr-environment/password" --with-decryption --query "Parameter.Value" --output text)
USERNAME=$(aws ssm get-parameter --name "/qa/pr-environment/username" --query "Parameter.Value" --output text)

sudo htpasswd -cb /etc/nginx/.htpasswd $USERNAME $PASSWORD

sudo mkdir -p /etc/nginx/ssl
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/nginx.key -out /etc/nginx/ssl/nginx.crt


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

# Get the public IP
PUBLIC_IP=$(curl http://169.254.169.254/latest/meta-data/public-ipv4)

# Set env vars
cat <<EOL > ./.env
METATRANSACTIONS=true
REPUTATION_ORACLE_ENDPOINT=http://${PUBLIC_IP}:3001/reputation/local
NETWORK_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
GANACHE_RPC_URL=http://${PUBLIC_IP}:8545
NETWORK=ganache
AWS_APPSYNC_KEY=da2-fakeApiId123456
AWS_APPSYNC_GRAPHQL_URL=http://${PUBLIC_IP}:20002/graphql
EOL

# Install appropriate npm version and dependencies
npm install -g npm@8
npm i

# Build and run Docker images
npm run dev &

while ! nc -z localhost 20002; do
  sleep 10
done

# Seed database
node ./scripts/temp-create-data.js

# Start frontend
npm run webpack &

while ! nc -zv localhost 9091; do
  echo "Waiting for port 9091 to be open..."
  sleep 10
done
echo "Port 9091 is now open!"

# Send notification on Discord
curl -H "Content-Type: application/json" \
     -X POST \
     -d '{"content":"Dev environment for '"$SOURCE_USED"' ready at [IP: '"$PUBLIC_IP"'](http://'"$PUBLIC_IP"') !"}' \
     $DISCORD_WEBHOOK
echo "Completion message posted!"