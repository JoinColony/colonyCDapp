require('cross-fetch/polyfill');
const { utils, providers } = require('ethers');
const crypto = require('crypto');
const { getColonyNetworkClient, Network, Id } = require('@colony/colony-js');

const { graphqlRequest } = require('./utils');

/*
 * @TODO This needs to be imported properly into the project (maybe?)
 * So that we can always ensure it follows the latest schema
 * (currently it's just saved statically)
 */
const {
  getColony,
  createColony,
  createColonyMemberInvite,
  getTokenFromEverywhere,
  createColonyTokens,
  createDomain,
  createDomainMetadata,
  getColonyMetadata,
  createColonyMetadata,
  deleteColonyMetadata,
  getColonyByName,
} = require('./graphql');

let apiKey = 'da2-fakeApiId123456';
let graphqlURL = 'http://localhost:20002/graphql';
let rpcURL = 'http://network-contracts:8545'; // this needs to be extended to all supported networks
let network = Network.Custom;
let networkAddress;

const setEnvVariables = async () => {
  const ENV = process.env.ENV;
  if (ENV === 'qa' || ENV === 'prod') {
    const { getParams } = require('/opt/nodejs/getParams');
    [networkAddress, apiKey, graphqlURL, rpcURL, network] = await getParams([
      'networkContractAddress',
      'appsyncApiKey',
      'graphqlUrl',
      'chainRpcEndpoint',
      'chainNetwork',
    ]);
  } else {
    const {
      etherRouterAddress,
    } = require('../../../../mock-data/colonyNetworkArtifacts/etherrouter-address.json');
    networkAddress = etherRouterAddress;
  }
};

exports.handler = async (event) => {
  try {
    await setEnvVariables();
  } catch (e) {
    throw new Error('Unable to set environment variables. Reason:', e);
  }

  const {
    colonyAddress,
    tokenAddress,
    initiatorAddress,
    type = 'COLONY',
    transactionHash,
  } = event.arguments?.input || {};

  /*
   * Validate Colony and Token addresses
   */
  let checksummedAddress;
  let checksummedToken;
  try {
    checksummedAddress = utils.getAddress(colonyAddress);
  } catch (error) {
    throw new Error(
      `Colony address "${colonyAddress}" is not valid (after checksum)`,
    );
  }
  try {
    checksummedToken = utils.getAddress(tokenAddress);
  } catch (error) {
    throw new Error(
      `Token address "${tokenAddress}" is not valid (after checksum)`,
    );
  }

  if (checksummedAddress === checksummedToken) {
    throw new Error(
      `Token address "${checksummedToken}" and Colony address "${checksummedAddress}" cannot be the same`,
    );
  }

  /*
   * Determine if the colony was already registered
   * Via it's address
   */
  const colonyQuery = await graphqlRequest(
    getColony,
    { id: checksummedAddress },
    graphqlURL,
    apiKey,
  );

  if (colonyQuery.errors || !colonyQuery.data) {
    const [error] = colonyQuery.errors;
    throw new Error(
      error?.message || 'Could not fetch colony data from DynamoDB',
    );
  }

  const [existingColonyAddress] =
    colonyQuery?.data?.getColonyByAddress?.items || [];

  if (existingColonyAddress) {
    throw new Error(
      `Colony with address "${existingColonyAddress.id}" is already registered`,
    );
  }

  if (type === 'METACOLONY') {
    const [existingMetacolony] =
      colonyQuery?.data?.getColonyByType?.items || [];
    if (existingMetacolony) {
      throw new Error(
        `Metacolony "${existingMetacolony.name}" already exists. There can be only one metacolony.`,
      );
    }
  }

  /*
   * Get metadata, determine if it's the correct one, anf if we should proceed
   */
  const metadataQuery = await graphqlRequest(
    getColonyMetadata,
    { id: `etherealcolonymetadata-${transactionHash}` },
    graphqlURL,
    apiKey,
  );

  if (metadataQuery.errors || !metadataQuery.data) {
    const [error] = metadataQuery.errors;
    throw new Error(
      error?.message || 'Could not fetch colony metadata from DynamoDB',
    );
  }

  const {
    colonyName,
    colonyDisplayName,
    tokenAvatar = null,
    tokenThumbnail = null,
    initiatorAddress: metadataInitiatorAddress,
  } = metadataQuery?.data?.getColonyMetadata?.etherealData || {};

  if (
    utils.getAddress(metadataInitiatorAddress) !==
    utils.getAddress(initiatorAddress)
  ) {
    throw new Error(
      `Colony metadata does not match the colony we are trying to create`,
    );
  }

  /*
   * Ensure the colony name doesn't already exist in the database
   */
  const colonyNameQuery = await graphqlRequest(
    getColonyByName,
    { name: colonyName },
    graphqlURL,
    apiKey,
  );

  const [{ name: existingColonyName = '' } = {}] =
    colonyNameQuery?.data?.getColonyByName?.items || [];

  if (existingColonyName === colonyName) {
    throw new Error(
      `Colony with name "${colonyName}" already exists. Cannot create another one.`,
    );
  }

  /*
   * Get colony network and the respective clients
   */
  const provider = new providers.JsonRpcProvider(rpcURL);
  const networkClient = await getColonyNetworkClient(network, provider, {
    networkAddress,
  });
  const colonyClient = await networkClient.getColonyClient(checksummedAddress);

  /*
   * Create token in the database
   */
  const tokenQuery = await graphqlRequest(
    getTokenFromEverywhere,
    {
      input: {
        tokenAddress: checksummedToken,
        avatar: tokenAvatar,
        thumbnail: tokenThumbnail,
      },
    },
    graphqlURL,
    apiKey,
  );

  if (tokenQuery.errors || !tokenQuery.data) {
    const [error] = tokenQuery.errors;
    throw new Error(
      error?.message || 'Could not fetch token data from DynamoDB',
    );
  }

  const [existingToken] = tokenQuery?.data?.getTokenFromEverywhere?.items || [];

  if (!existingToken || !existingToken?.id) {
    throw new Error(
      `Token with address "${checksummedToken}" does not exist, hence it cannot be used as a native token for this colony`,
    );
  }

  const memberInviteCode = crypto.randomUUID();

  const { chainId } = await provider.getNetwork();
  const version = await colonyClient.version();
  const isTokenLocked = colonyClient.tokenClient.locked();

  /*
   * Create the colony
   */
  const colonyMutation = await graphqlRequest(
    createColony,
    {
      input: {
        id: checksummedAddress, // comes from event
        nativeTokenId: checksummedToken, // comes from event
        name: colonyName, // above
        type, // default
        chainMetadata: {
          chainId,
        },
        version: version.toNumber(),
        status: {
          nativeToken: {
            unlocked: !isTokenLocked,
            // set to false until we know the proper state
            // if it's a colony token, this will get updated when
            // log set authority will be set
            mintable: false,
            unlockable: false,
          },
        },
        colonyMemberInviteCode: memberInviteCode, // above
        whitelist: [initiatorAddress], // initiator user
      },
    },
    graphqlURL,
    apiKey,
  );

  if (colonyMutation.errors || !colonyMutation.data) {
    const [error] = colonyMutation.errors;
    throw new Error(
      error?.message ||
        `Could not create colony "${name}" with address "${checksummedAddress}"`,
    );
  }

  /*
   * Set the actual colony metadata object
   *
   * @NOTE This, plus the next mutation constitute one two many mutations.
   *
   * It would be ideal if we could achieve the same in a single operation
   * Update would do the trick here, however it cannot change the id
   */
  const colonyMetadataMutation = await graphqlRequest(
    createColonyMetadata,
    {
      input: {
        id: checksummedAddress,
        displayName: colonyDisplayName,
        isWhitelistActivated: false,
      },
    },
    graphqlURL,
    apiKey,
  );

  if (colonyMetadataMutation.errors || !colonyMetadataMutation.data) {
    const [error] = colonyMetadataMutation.errors;
    throw new Error(
      error?.message ||
        `Could not create metadata entry for colony "${name}" with address "${checksummedAddress}"`,
    );
  }

  /*
   * Delete the ethereal metadata entry
   */
  await graphqlRequest(
    deleteColonyMetadata,
    { input: { id: `etherealcolonymetadata-${transactionHash}` } },
    graphqlURL,
    apiKey,
  );

  /*
   * Create the member invite
   */
  const inviteMutation = await graphqlRequest(
    createColonyMemberInvite,
    {
      input: {
        id: memberInviteCode,
        colonyId: checksummedAddress,
        invitesRemaining: 100,
      },
    },
    graphqlURL,
    apiKey,
  );

  if (inviteMutation.errors || !inviteMutation.data) {
    const [error] = inviteMutation.errors;
    throw new Error(error?.message || `Could not create private member invite`);
  }

  /*
   * Add token to the colony's token list
   */
  await graphqlRequest(
    createColonyTokens,
    {
      input: {
        colonyID: checksummedAddress,
        tokenID: checksummedToken,
      },
    },
    graphqlURL,
    apiKey,
  );

  /*
   * Create the root domain metadata
   */
  await graphqlRequest(
    createDomainMetadata,
    {
      input: {
        id: `${checksummedAddress}_${Id.RootDomain}`,
        color: 'LIGHT_PINK',
        name: 'General',
        description: '',
      },
    },
    graphqlURL,
    apiKey,
  );

  const [skillId, fundingPotId] = await colonyClient.getDomain(Id.RootDomain);

  /*
   * Create the root domain
   */
  await graphqlRequest(
    createDomain,
    {
      input: {
        id: `${checksummedAddress}_${Id.RootDomain}`,
        colonyId: checksummedAddress,
        isRoot: true,
        nativeId: Id.RootDomain,
        nativeSkillId: skillId.toNumber(),
        nativeFundingPotId: fundingPotId.toNumber(),
      },
    },
    graphqlURL,
    apiKey,
  );

  return colonyMutation?.data?.createColony || null;
};
