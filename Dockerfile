ARG NETWORK_HASH=develop
ARG BLOCKINGESTOR_HASH=master
ARG REPUTATIONMONITOR_HASH=master

# TODO Actually check if they are set, otherwise break

FROM node:16.16.0

VOLUME [ "/colonyCDapp/amplify/backend", "/colonyCDapp/amplify/mock-data", "/colonyCDapp/src/graphql" ]

# Update the apt cache
RUN apt-get clean
RUN apt-get update

# Adding various nicities and libraries we use through the container
RUN apt-get install -y \
  apt-utils \
  locales \
  build-essential \
  curl \
  file \
  zip \
  jq \
  netcat

# Download and install the `java-common` package which is needed for Amazon's Java SDK
RUN curl -LO http://mirrors.kernel.org/ubuntu/pool/main/j/java-common/java-common_0.72_all.deb
RUN dpkg -i java-common_0.72_all.deb

# Download and install Amazon's version of a Java SDK
RUN curl -LO https://corretto.aws/downloads/latest/amazon-corretto-11-x64-linux-jdk.deb
RUN dpkg -i amazon-corretto-11-x64-linux-jdk.deb

# Reconfigure locales
RUN echo "en_US.UTF-8 UTF-8" >> /etc/locale.gen
RUN locale-gen

# Install a certain version of NPM
RUN npm install --location=global --registry=https://registry.npmjs.org npm@8.11

# Configure git to always use HTTPS instead of SSH
# This counteracts the fact that you need a GH account in order to use ssh keys
RUN git config --global url."https://github".insteadOf ssh://git@github


WORKDIR /colonyCDapp

# Add dependencies from the host
ADD --chown=root:root package.json /colonyCDapp/package.colonyCDapp.json
ADD --chown=root:root amplify /colonyCDapp/amplify
ADD --chown=root:root src/aws-exports.js /colonyCDapp/src/aws-exports.js
ADD --chown=root:root .graphqlconfig.yml /colonyCDapp/.graphqlconfig.yml

#
# Amplify
#

WORKDIR /colonyCDapp

# Generate the local "light" version of package json
# It gets the amplify version from the CDapp's package.json file
RUN AMPLIFY_VERSION=$(jq '.dependencies."@aws-amplify/cli"' package.colonyCDapp.json) && echo "{\"scripts\":{\"amplify\":\"amplify\"},\"dependencies\":{\"@aws-amplify/cli\": $AMPLIFY_VERSION}}" > package.json

# Install amplify as a dependency
RUN npm install

# Actually download the amplify tarball (don't ask me, it's how it works)
RUN npm run amplify

# Update amplify local env config
RUN tmp=$(mktemp) && jq '.projectPath="/colonyCDapp"' amplify/.config/local-env-info.json > $tmp && mv $tmp amplify/.config/local-env-info.json

#
# Colony Network
#

WORKDIR /colonyCDappBackend

# Clone the network repo
RUN git clone https://github.com/JoinColony/colonyNetwork.git
WORKDIR /colonyCDappBackend/colonyNetwork

# Fetch the correct network repo commit/branch/tag
RUN git fetch origin $NETWORK_HASH
RUN git checkout $NETWORK_HASH
RUN git submodule update --init --recursive

# Install required network dependencies
RUN yarn

# Compile network contracts
RUN DISABLE_DOCKER=true yarn provision:token:contracts

# Initialize the justification tree cache
# To avoid the error spewed by the miner at startup
RUN echo "{}" > ./packages/reputation-miner/justificationTreeCache.json

#
# Block Ingestor
#

# Clone block ingestor repo
WORKDIR /colonyCDappBackend
RUN git clone https://github.com/JoinColony/block-ingestor.git
WORKDIR /colonyCDappBackend/block-ingestor

# Fetch the correct network repo commit/branch/tag
RUN git fetch origin $BLOCKINGESTOR_HASH
RUN git checkout $BLOCKINGESTOR_HASH

# Install block ingestor dependencies
RUN npm install

#
# Reputation Monitor
#

# Clone block ingestor repo
WORKDIR /colonyCDappBackend
RUN git clone https://github.com/JoinColony/reputation-monitor-dev.git
WORKDIR /colonyCDappBackend/reputation-monitor-dev

# Fetch the correct network repo commit/branch/tag
RUN git fetch origin $REPUTATIONMONITOR_HASH
RUN git checkout $REPUTATIONMONITOR_HASH

# Install reputation monitor dependencies
RUN npm install

WORKDIR /colonyCDappBackend

#
# Orchestration script
#

EXPOSE 3002
EXPOSE 8545
EXPOSE 20002

# Generate the local start script
RUN echo "cd colonyNetwork\n" \
  "yarn start:blockchain:client &\n" \
  "DISABLE_DOCKER=true yarn truffle migrate\n" \
  "ETHER_ROUTER_ADDRESS=\$(jq -r .etherRouterAddress etherrouter-address.json)\n" \
  "MINER_ACCOUNT_ADDRESS=\$(jq -r '.addresses | keys[5]'  ganache-accounts.json)\n" \
  "cd packages/reputation-miner\n" \
  "node ./bin/index.js --minerAddress \$MINER_ACCOUNT_ADDRESS --syncFrom 1 --colonyNetworkAddress \$ETHER_ROUTER_ADDRESS --oracle --auto --dbPath reputationStates.sqlite --oraclePort 3002 --processingDelay 1 &\n" \
  "cd ../../../reputation-monitor-dev\n" \
  "node index.js \$ETHER_ROUTER_ADDRESS &\n" \
  "cd ../block-ingestor\n" \
  "npm run start &\n" \
  "cd /colonyCDapp\n" \
  "npm run amplify mock" > ./run.sh
RUN chmod +x ./run.sh

# Battlecruiser Operational!
CMD ./run.sh
