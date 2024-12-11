const { graphqlRequest } = require('./utils/graphqlRequest');
const { providers, utils } = require('ethers');

const API_KEY = 'da2-fakeApiId123456';
const GRAPHQL_URI =
  process.env.AWS_APPSYNC_GRAPHQL_URL || 'http://localhost:20002/graphql';
const RPC_URL = 'http://localhost:8545';

const getColonies = /* GraphQL */ `
  query GetColonies($nextToken: String, $limit: Int) {
    listColonies(nextToken: $nextToken, limit: $limit) {
      items {
        id
        colonyCreateEvent {
          blockNumber
          salt
        }
      }
    }
  }
`;

const updateColony = /* GraphQL */ `
  mutation UpdateColony($input: UpdateColonyInput!) {
    updateColony(input: $input) {
      id
    }
  }
`;

const getAllPages = async (getData, params) => {
  let items = [];
  let nextToken = null;

  do {
    const actionsData = await getData({ ...params, nextToken, limit: 1000 });
    nextToken = actionsData?.nextToken;
    if (actionsData?.items) {
      items.push(...actionsData.items);
    }
  } while (nextToken);

  return items;
};

// @TODO maybe try to filter out colonies having the colonyCreateEvent set
const getColoniesData = async ({ limit, nextToken }) => {
  const result = await graphqlRequest(
    getColonies,
    {
      limit,
      nextToken,
    },
    GRAPHQL_URI,
    API_KEY,
  );

  if (!result) {
    console.warn('Could not find any colonies in db.');
  }

  return result.data.listColonies;
};

const getAllColonies = async () => {
  return getAllPages(getColoniesData);
};

const updateColonyCreateEvent = async (colonyAddress, blockNumber, salt) => {
  await graphqlRequest(
    updateColony,
    {
      input: {
        id: colonyAddress,
        colonyCreateEvent: {
          blockNumber,
          salt,
        },
      },
    },
    GRAPHQL_URI,
    API_KEY,
  );
};

const ContractEventsSignatures = {
  ContractCreation: 'ContractCreation(address)',
  Create3ProxyContractCreation: 'Create3ProxyContractCreation(address,bytes32)',
};

async function getColonyCreationBlock() {
  try {
    const provider = new providers.StaticJsonRpcProvider(RPC_URL);

    const allColonies = await getAllColonies();

    for (const colony of allColonies) {
      const colonyAddress = colony.id;
      if (colony.colonyCreateEvent) {
        console.log(
          `Colony with colonyAddress ${colonyAddress} already has the creation event set`,
        );
        continue;
      }

      console.log(
        `Colony with colonyAddress ${colonyAddress} doesn't have the creation event set. Migrating...`,
      );

      try {
        const createLogs = await provider.getLogs({
          fromBlock: 0,
          topics: [
            utils.id(ContractEventsSignatures.ContractCreation),
            // We need to make sure the address is 32 bytes long
            `0x${colonyAddress.slice(2).padStart(64, '0')}`,
          ],
        });

        if (createLogs.length === 0) {
          throw new Error(
            `Couldn't fetch colony creation event for colonyAddress: ${colonyAddress}`,
          );
        }

        const createLogBlockNumber = createLogs[0].blockNumber;

        const createSaltLogs = await provider.getLogs({
          fromBlock: createLogBlockNumber,
          toBlock: createLogBlockNumber,
          topics: [
            utils.id(ContractEventsSignatures.Create3ProxyContractCreation),
          ],
        });

        if (createSaltLogs.length === 0) {
          throw new Error(
            `Couldn't fetch colony salt creation event for colonyAddress: ${colonyAddress}`,
          );
        }

        const salt = createSaltLogs?.[0].topics?.[2];

        if (!salt) {
          throw new Error(
            `Couldn't find salt value for colonyAddress: ${colonyAddress}`,
          );
        }

        console.log(
          `Updating the createEvent details for colonyAddress: ${colonyAddress}`,
        );
        await updateColonyCreateEvent(
          colonyAddress,
          createLogBlockNumber,
          salt,
        );
      } catch (error) {
        console.error(
          `Encountered error while executing migration for colonyAddress ${colonyAddress}: ${error}`,
        );
      }
    }
  } catch (error) {
    console.error(
      'Error while executing the colony-create-event-details migration',
      error,
    );
  }
}

getColonyCreationBlock();
