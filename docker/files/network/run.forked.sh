set -e

cd colonyNetwork

if [ -z "${ARCHIVE_RPC}" ]; then
    echo "ARCHIVE_RPC is not set. Please set it to the archive node RPC endpoint."
    exit 1
fi

if [ -z "${FORKED_NETWORK_ADDRESS}" ]; then
    echo "FORKED_NETWORK_ADDRESS is not set with '\$ARCHIVE_RPC'. Please set it to the network address to fork."
    exit 1
fi


CHAIN_ID=`curl -X POST --data '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}' $ARCHIVE_RPC | jq -r .result`
echo "Forking from chain with ID $CHAIN_ID"
echo "Starting colony network with forked node"
# >/dev/null 2>&1
CHAIN_ID=$CHAIN_ID npx hardhat node --fork $ARCHIVE_RPC >/dev/null 2>&1 & bash -c 'until nc -z $0 $1; do sleep 1; done' 127.0.0.1 8545

echo "Deploying latest contracts to forked node"
CHAIN_ID=$CHAIN_ID npx hardhat run ./scripts/deployToForkedChain.js --network development


# Export deployed addresses

echo "{\"etherRouterAddress\":\"$FORKED_NETWORK_ADDRESS\"}" > etherrouter-address.json
ETHER_ROUTER_ADDRESS=$(jq -r .etherRouterAddress etherrouter-address.json)

# Get miner account address
# This file should have been made by the deployToForkedChain.js script
MINER_ACCOUNT_ADDRESS=$(jq -r '.minerAddress' ./miner-address.json)

# Any account can be the broadcaster account, so long as it's funded which these addresses should be
BROADCASTER_ACCOUNT_PRIVKEY=$(jq -r '.private_keys | to_entries | .[17] | .value' ganache-accounts.json)

# Copy over colony network build artifacts to aid in development
# Some of the files are needed to be imported and used in the app for local dev

rm --recursive --force /colonyCDapp/amplify/mock-data/colonyNetworkArtifacts
mkdir --parents /colonyCDapp/amplify/mock-data/colonyNetworkArtifacts
cp -R ./artifacts /colonyCDapp/amplify/mock-data/colonyNetworkArtifacts/
cp ./etherrouter-address.json /colonyCDapp/amplify/mock-data/colonyNetworkArtifacts/etherrouter-address.json
cp ./ganache-accounts.json /colonyCDapp/amplify/mock-data/colonyNetworkArtifacts/ganache-accounts.json

# Reputation Miner

cd packages/reputation-miner
CHAIN_ID=$CHAIN_ID node ./bin/forked.js --minerAddress $MINER_ACCOUNT_ADDRESS --syncFrom 1 --colonyNetworkAddress $ETHER_ROUTER_ADDRESS --oracle --auto --dbPath reputationStates.sqlite --oraclePort 3002 --processingDelay 1 &
# Broadcaster Service

cd ../metatransaction-broadcaster
node ./bin/index.js --privateKey $BROADCASTER_ACCOUNT_PRIVKEY --gasPrice 1 --gasLimit 6000000 --colonyNetworkAddress $ETHER_ROUTER_ADDRESS --port 3004