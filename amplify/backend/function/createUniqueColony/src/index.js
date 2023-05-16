const { utils } = require('ethers');

const { graphqlRequest } = require('./utils');

/*
 * @TODO This needs to be imported properly into the project (maybe?)
 * So that we can always ensure it follows the latest schema
 * (currently it's just saved statically)
 */
const { getColony, createColony, getTokenByAddress } = require('./graphql');

const API_KEY = process.env.APPSYNC_API_KEY || 'da2-fakeApiId123456';
const GRAPHQL_URI =
  process.env.AWS_APPSYNC_GRAPHQL_URL || 'http://localhost:20002/graphql';

exports.handler = async (event) => {
  const {
    id: colonyAddress,
    name,
    colonyNativeTokenId,
    type = 'COLONY',
    version,
    chainMetadata,
    status,
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
    checksummedToken = utils.getAddress(colonyNativeTokenId);
  } catch (error) {
    throw new Error(
      `Token address "${colonyNativeTokenId}" is not valid (after checksum)`,
    );
  }

  if (checksummedAddress === checksummedToken) {
    throw new Error(
      `Token address "${checksummedToken}" and Colony address "${checksummedAddress}" cannot be the same`,
    );
  }

  /*
   * Determine if the colony was already registered
   * Either via it's address or via it's name
   */
  const colonyQuery = await graphqlRequest(
    getColony,
    { id: checksummedAddress, name },
    GRAPHQL_URI,
    API_KEY,
  );

  if (colonyQuery.errors || !colonyQuery.data) {
    const [error] = colonyQuery.errors;
    throw new Error(
      error?.message || 'Could not fetch colony data from DynamoDB',
    );
  }

  const [existingColonyAddress] =
    colonyQuery?.data?.getColonyByAddress?.items || [];
  const [existingColonyName] = colonyQuery?.data?.getColonyByName?.items || [];

  if (existingColonyAddress) {
    throw new Error(
      `Colony with address "${existingColonyAddress.id}" is already registered`,
    );
  }
  if (existingColonyName) {
    throw new Error(
      `Colony with name "${existingColonyName.name}" is already registered`,
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
   * Determine if the token exists
   */
  const tokenQuery = await graphqlRequest(
    getTokenByAddress,
    { id: checksummedToken },
    GRAPHQL_URI,
    API_KEY,
  );

  if (tokenQuery.errors || !tokenQuery.data) {
    const [error] = tokenQuery.errors;
    throw new Error(
      error?.message || 'Could not fetch token data from DynamoDB',
    );
  }

  const [existingTokenAddress] =
    tokenQuery?.data?.getTokenByAddress?.items || [];

  if (!existingTokenAddress) {
    throw new Error(
      `Token with address "${checksummedToken}" does not exist, hence it cannot be used as a native token for this colony`,
    );
  }

  /*
   * Create the colony
   */
  const mutation = await graphqlRequest(
    createColony,
    {
      input: {
        id: checksummedAddress,
        colonyNativeTokenId: checksummedToken,
        name,
        type,
        chainMetadata,
        version,
        status,
      },
    },
    GRAPHQL_URI,
    API_KEY,
  );

  if (mutation.errors || !mutation.data) {
    const [error] = mutation.errors;
    throw new Error(
      error?.message ||
        `Could not create user "${name}" with wallet address "${checksummedAddress}"`,
    );
  }

  return mutation?.data?.createColony || null;
};
