const ethers = require('ethers');
const { getColonyNetworkClient, getLogs } = require('@colony/colony-js');

const { output, poorMansGraphQL } = require('./utils');
const { etherRouterAddress: networkAddress } = require('../colonyNetwork/etherrouter-address.json');

(async () => {
  const provider = new ethers.providers.JsonRpcProvider();

  const networkClient = getColonyNetworkClient(
    'local',
    provider,
    { networkAddress },
  )

  let currentBlock = await provider.getBlockNumber();
  output(`Starting at block #${currentBlock}`);

  provider.on('block', async (blockNumber) => {
    output(`Processing block #${blockNumber}`);

    if (blockNumber > currentBlock) {
      const userLabelRegisteredLogs = await getLogs(
        networkClient,
        networkClient.filters.UserLabelRegistered(),
        {
          fromBlock: blockNumber,
          toBlock: blockNumber,
        },
      );

      userLabelRegisteredLogs.map(async (log) => {
        const { args: [rawAddress] } = networkClient.interface.parseLog(log);

        const userAddress = ethers.utils.getAddress(rawAddress);

        const fullEnsDomain = await networkClient.lookupRegisteredENSDomainWithNetworkPatches(
          userAddress,
        )
        const username = fullEnsDomain.slice(0, fullEnsDomain.indexOf('.'))

        try {
          output('Found user:', username, userAddress);

          const query = {
            operationName: "CreateUser",
            query: `
                mutation CreateUser {
                createUser(
                  input: { walletAddress: "${userAddress}", username: "${username}" }
                  condition: {}
                ) {
                  displayName
                  avatarHash
                }
              }
            `,
            variables: null,
          };

          try {
            await poorMansGraphQL(query);
            output('Saving user to database:', username);
          } catch (error) {
            // silent error
          }

        } catch (error) {
          console.error(
            'Could not create user:',
            username,
            'with address:',
            userAddress,
          )
          console.error(error)
        }
      });

      /*
       * Only update the current block if we actually processed the new one
       */
      currentBlock = blockNumber;
    }
  });
})()
