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
sudo apt-get install -y ca-certificates curl gnupg awscli nodejs npm git nginx apache2-utils netcat unzip wget jq

# Install docker dependencies
sudo apt-get -y install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Install docker compose plugin
sudo apt-get -y install docker-compose-plugin

# Start Docker service
sudo usermod -aG docker ubuntu
sudo systemctl start docker

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
CLOUDWATCH_URL="https://console.aws.amazon.com/cloudwatch/home?region=$AWS_REGION#logsV2:log-groups/log-group/$ENCODED_LOG_GROUP_NAME/log-events/$ENCODED_LOG_STREAM_NAME"

# Create JSON payload for the Discord notification with embed, because of how long the CW URL would be
read -r -d '' PAYLOAD << EOM
{
  "content": "Hey <@$DISCORD_USER_ID>, your on demand environment is getting ready!",
  "embeds": [
    {
      "title": "On-Demand Environment Setup",
      "description": "You can keep an eye on the setup process using the CloudWatch link below.",
      "color": 5814783,
      "fields": [
        {
          "name": "CloudWatch Logs",
          "value": "[Click here to view logs]($CLOUDWATCH_URL)"
        }
      ],
      "footer": {
        "text": "The environment will be ready soon. You will get notified when it's up and running."
      }
    }
  ]
}
EOM

# Send initial notification on Discord
curl -H "Content-Type: application/json" \
     -X POST \
     -d "$PAYLOAD" \
     $DISCORD_WEBHOOK

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
PASSWORD=$(aws ssm get-parameter --region $AWS_REGION --name "/qa/pr-environment/password" --with-decryption --query "Parameter.Value" --output text)
USERNAME=$(aws ssm get-parameter --region $AWS_REGION --name "/qa/pr-environment/username" --query "Parameter.Value" --output text)

sudo htpasswd -cb /etc/nginx/.htpasswd $USERNAME $PASSWORD

# Get the public IP
PUBLIC_IP=$(curl http://169.254.169.254/latest/meta-data/public-ipv4)

# Use the IP address in the OpenSSL command
sudo mkdir -p /etc/nginx/ssl

aws ssm get-parameter --region $AWS_REGION --name "/qa/pr-environment/cert" --with-decryption --query "Parameter.Value" --output text | sudo tee /etc/nginx/ssl/nginx.crt > /dev/null
aws ssm get-parameter --region $AWS_REGION --name "/qa/pr-environment/cert-key" --with-decryption --query "Parameter.Value" --output text | sudo tee /etc/nginx/ssl/nginx.key > /dev/null

# Set proper permissions
sudo chmod 644 /etc/nginx/ssl/nginx.crt
sudo chmod 600 /etc/nginx/ssl/nginx.key

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

    location /ws {
        auth_basic "Restricted Access";
        auth_basic_user_file /etc/nginx/.htpasswd;

        proxy_pass http://localhost:9091/ws;
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

server {
    listen 13004 ssl;
    server_name _;

    # Specify the key and certificate file
    ssl_certificate /etc/nginx/ssl/nginx.crt;
    ssl_certificate_key /etc/nginx/ssl/nginx.key;

    location / {
        proxy_pass http://localhost:3004;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}

server {
    listen 13005 ssl;
    server_name _;

    # Specify the key and certificate file
    ssl_certificate /etc/nginx/ssl/nginx.crt;
    ssl_certificate_key /etc/nginx/ssl/nginx.key;

    location / {
        proxy_pass http://localhost:3005;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}

server {
    listen 13006 ssl;
    server_name _;

    # Specify the key and certificate file
    ssl_certificate /etc/nginx/ssl/nginx.crt;
    ssl_certificate_key /etc/nginx/ssl/nginx.key;

    location / {
        proxy_pass http://localhost:3006;
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

nvm install 20
nvm use 20

# Get the commit hash of the checked out code
COMMIT_HASH=$(git rev-parse HEAD)

# Create the FQDN using the commit hash
FQDN="${COMMIT_HASH:0:8}.colony.io"

# Set env vars (these will override the .env.local file)
# frontend
export AUTH_PROXY_ENDPOINT=https://${FQDN}:13005
export METATX_BROADCASTER_ENDPOINT=http://${FQDN}:13004
export REPUTATION_ORACLE_ENDPOINT=https://${FQDN}:3002/reputation/local
export URL=https://${FQDN}
export VITE_NETWORK_FILES_ENDPOINT=https://${FQDN}:13006
export VITE_GANACHE_RPC_URL=https://${FQDN}:8546
# backend
export AWS_APPSYNC_KEY=da2-fakeApiId123456
export AWS_APPSYNC_GRAPHQL_URL=https://${FQDN}:20003/graphql
export ON_DEMAND_ENV=true
EOL

# Install dependencies
npm ci

# For the authentication proxy
echo "ORIGIN_URL=https://${FQDN}" >> ./docker/files/auth/env.base

env
# Build and run Docker images
npm run on-demand &

# Wait for graphql port to come up
while ! nc -z localhost 20002; do
  sleep 10
done
# Believe it or not but this checks whether amplify is actually ready
while true; do
    AMPLIFY_READY=$(curl -X POST -H "x-api-key: da2-fakeApiId123456" -H "Content-Type: application/json" -d '{"query":"query { __schema { types { name } } }"}' -s http://localhost:20002/graphql | jq 'has("data")')

    if [[ "$AMPLIFY_READY" == "true" ]]; then
        echo "Amplify seems to be up. Going our merry way."
        break
    else
        echo "Amplify is not up yet, waiting..."
        sleep 10
    fi
done

# Wait for auth proxy to come up
while ! nc -z localhost 3001; do
  sleep 5
done

# Wait for block ingestor to come up
while ! nc -z localhost 10001; do
  sleep 5
done

# Seed database (pass --yes to skip confirmation)
# node ./scripts/create-data.js --yes

# Temporary fix to get frontend running
export BSCSCAN_API_KEY="test"
export ETHERSCAN_API_KEY="test"
export GOOGLE_TAG_MANAGER_ID="test"
export PINATA_API_KEY="test"
export PINATA_API_SECRET="test"
export COINGECKO_API_KEY="test"
export COINGECKO_API_URL="test"
export POSTHOG_KEY="test"
export POSTHOG_HOST="test"
export PERSONA_ENVIRONMENT_ID="test"

# Start frontend
npm run frontend &

# Wait for frontend service to come up
while ! nc -zv localhost 9091; do
  echo "Waiting for port 9091 to be open..."
  sleep 10
done
echo "Port 9091 is now open!"

# Check if record exists
EXISTING_RECORD=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}/dns_records?type=A&name=${FQDN}" \
     -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
     -H "Content-Type: application/json")

RECORD_ID=$(echo $EXISTING_RECORD | jq -r '.result[0].id')

# Prepare the record data
RECORD_DATA='{
    "type": "A",
    "name": "'$FQDN'",
    "content": "'$PUBLIC_IP'",
    "ttl": 120,
    "proxied": true
}'

echo "Creating DNS record for on demand environment"
if [ -n "$RECORD_ID" ] && [ "$RECORD_ID" != "null" ]; then
    # Update existing record
    RESPONSE=$(curl -s -X PUT "https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}/dns_records/${RECORD_ID}" \
         -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
         -H "Content-Type: application/json" \
         --data "$RECORD_DATA")
    echo "Updated existing record for ${FQDN}"
else
    # Create new record
    RESPONSE=$(curl -s -X POST "https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}/dns_records" \
         -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
         -H "Content-Type: application/json" \
         --data "$RECORD_DATA")
    echo "Created new record for ${FQDN}"
fi

# Check if the operation was successful
if [ "$(echo $RESPONSE | jq -r '.success')" != "true" ]; then
    echo "Error: $(echo $RESPONSE | jq -r '.errors[0].message')"
    exit 1
fi

# Construct the full URL
FULL_URL="https://${FQDN}"

# Create JSON payload for the Discord notification
read -r -d '' PAYLOAD << EOF
{
  "content": "Hey <@${DISCORD_USER_ID}>, your on demand environment for ${SOURCE_USED} is ready to use at ${FULL_URL} !",
  "embeds": [{
    "title": "Environment Details",
    "color": 5814783,
    "fields": [
      {
        "name": "Source",
        "value": "${SOURCE_USED}",
        "inline": true
      },
      {
        "name": "URL",
        "value": "${FULL_URL}",
        "inline": true
      }
    ],
    "footer": {
      "text": "Click the URL above to open your environment"
    }
  }]
}
EOF

# Send notification on Discord
curl -H "Content-Type: application/json" \
     -X POST \
     -d "${PAYLOAD}" \
     $DISCORD_WEBHOOK

echo "Notification message posted!"