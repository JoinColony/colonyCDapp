ARG NETWORK_HASH=develop
ARG BLOCKINGESTOR_HASH=master
ARG REPUTATIONMONITOR_HASH=master

FROM node:16.16.0

USER root

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

# Declare volumes to set up metadata
VOLUME [ "/colonyCDapp/amplify/backend", "/colonyCDapp/amplify/mock-data", "/colonyCDapp/src/graphql" ]

WORKDIR /colonyCDapp

# Add dependencies from the host
ADD package.json /colonyCDapp/package.colonyCDapp.json
ADD amplify /colonyCDapp/amplify
ADD scripts /colonyCDappBackend/scripts
ADD .graphqlconfig.yml /colonyCDapp/.graphqlconfig.yml

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

# Hidrate amplify configuration artifacts
RUN cp /colonyCDappBackend/scripts/local-env-info.json.base /colonyCDapp/amplify/.config/local-env-info.json
RUN cp /colonyCDappBackend/scripts/local-aws-info.json.base /colonyCDapp/amplify/.config/local-aws-info.json
RUN mkdir -p /colonyCDapp/src
RUN cp /colonyCDappBackend/scripts/aws-exports.js.base /colonyCDapp/src/aws-exports.js

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

# Hidrate the run script
RUN cp /colonyCDappBackend/scripts/run.sh.base /colonyCDappBackend/run.sh
RUN chmod +x ./run.sh

# Battlecruiser Operational!
CMD [ "./run.sh" ]
