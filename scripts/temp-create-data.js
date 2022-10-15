const { utils, Wallet, Contract, ContractFactory, providers } = require('ethers');

const colonyJSExtras = require('@colony/colony-js/extras')

/*
 * @NOTE To preserve time, I just re-used a script I wrote for one of the lambda functions
 * So if that lambda function gets removed, this script will stop working
 */
const { graphqlRequest } = require('../amplify/backend/function/createUniqueColony/src/utils');
/*
 * @NOTE This script depends on both the ganache chain (and especially accounts) being active
 * as well as the network contracts being deployed on said chain
 * So make sure to only run this script after the dev environment (via docker compose) was started
 */
const { private_keys } = require('../amplify/mock-data/colonyNetworkArtifacts/ganache-accounts.json');
const { etherRouterAddress } = require('../amplify/mock-data/colonyNetworkArtifacts/etherrouter-address.json')

const API_KEY = 'da2-fakeApiId123456';
const GRAPHQL_URI = 'http://localhost:20002/graphql';

/*
 * Mutations
 */
const createUniqueUser = /* GraphQL */ `
  mutation CreateUniqueUser($input: CreateUniqueUserInput) {
    createUniqueUser(input: $input) { id }
  }
`;
const createUniqueColony = /* GraphQL */ `
  mutation CreateUniqueColony($input: CreateUniqueColonyInput) {
    createUniqueColony(input: $input) { id }
  }
`;
const createColonyTokens = /* GraphQL */ `
  mutation CreateColonyTokens($input: CreateColonyTokensInput!) {
    createColonyTokens(input: $input) { id }
  }
`;
const createUserTokens = /* GraphQL */ `
  mutation CreateUserTokens($input: CreateUserTokensInput!) {
    createUserTokens(input: $input) { id }
  }
`;
const createWatchedColonies = /* GraphQL */ `
  mutation CreateWatchedColonies($input: CreateWatchedColoniesInput!) {
    createWatchedColonies(input: $input) { id }
  }
`;

/*
 * Queries
 */
const getTokenFromEverywhere = /* GraphQL */ `
  query GetTokenFromEverywhere($input: TokenFromEverywhereArguments) {
    getTokenFromEverywhere(input: $input) { items { id } }
  }
`;

const createUserAndColonyData = async () => {
  const provider = new providers.JsonRpcProvider();
  /*
   * User
   * @NOTE This could be done "cheaper", but I wanted to make sure the address
   * is proper, so I've instantiated a wallet as well
   */
  const [ firstUserPrivateKey ] = Object.values(private_keys);
  const firstUserWallet = new Wallet(firstUserPrivateKey, provider);
  const firstUserAddress = utils.getAddress(firstUserWallet.address);

  const userQuery = await graphqlRequest(
    createUniqueUser,
    {
       input: {
        id: firstUserAddress,
        name: 'a',
        profile: { displayName: 'User A' },
       }
    },
    GRAPHQL_URI,
    API_KEY,
  );

  if (userQuery?.errors) {
    console.log('USER COULD NOT BE CREATED.', userQuery.errors[0].message);
  } else {
    console.log(`Creating user { name: "a", walletAddress: "${firstUserAddress}", profile: { displayName: "User A" } }`);
  }

  /*
   * Colony Network
   */
  const { abi: IColonyNetworkAbi } = colonyJSExtras.factories.latest.IColonyNetwork__factory;

  const colonyNetork = new Contract(etherRouterAddress, IColonyNetworkAbi, firstUserWallet);

  /*
   * Token
   */
  const { abi: TokenAbi, bytecode: TokenBytecode } = colonyJSExtras.factories.latest.MetaTxToken__factory;
  const tokenFactory = new ContractFactory(TokenAbi, TokenBytecode, firstUserWallet);
  const token = await tokenFactory.deploy('Token A', 'A', 18);
  await token.deployed();
  const tokenAddress = utils.getAddress(token.address);

  await graphqlRequest(
    getTokenFromEverywhere,
    { input: { tokenAddress } },
    GRAPHQL_URI,
    API_KEY,
  );

  if (!userQuery?.errors) {
    await graphqlRequest(
      createUserTokens,
      {
        input: {
          userID: firstUserAddress,
          tokenID: tokenAddress,
        }
      },
      GRAPHQL_URI,
      API_KEY,
    );
  }

  console.log(`Creating token { name: "Token A", symbol: "A", decimals: "18", address: "${tokenAddress}" }`);

  /*
   * Colony
   */
  const currentNetworkVersion = await colonyNetork.getCurrentColonyVersion();
  const colonyDeployment = await colonyNetork['createColony(address,uint256,string,string)'](tokenAddress, currentNetworkVersion, '', '');
  const colonyDeploymentTransaction = await colonyDeployment.wait();
  const createColonyEvent = colonyDeploymentTransaction.events.find(event => !!event?.args?.colonyAddress);
  const colonyAddress = utils.getAddress(createColonyEvent.args.colonyAddress);

  const colonyQuery = await graphqlRequest(
    createUniqueColony,
    {
       input: {
        id: colonyAddress,
        colonyNativeTokenId: tokenAddress,
        name: 'a',
        profile: { displayName: 'Colony A' },
       }
    },
    GRAPHQL_URI,
    API_KEY,
  );

  if (!colonyQuery?.errors) {
    await graphqlRequest(
      createColonyTokens,
      {
        input: {
          colonyID: colonyAddress,
          tokenID: tokenAddress,
        }
      },
      GRAPHQL_URI,
      API_KEY,
    );

    await graphqlRequest(
      createWatchedColonies,
      {
        input: {
          colonyID: colonyAddress,
          userID: firstUserAddress,
        }
      },
      GRAPHQL_URI,
      API_KEY,
    );
  }

  if (colonyQuery?.errors) {
    console.log('COLONY COULD NOT BE CREATED.', colonyQuery.errors[0].message);
  } else {
    console.log(`Creating colony { name: "a", colonyAddress: "${colonyAddress}", profile: { displayName: "Colony A" }, nativeToken: "${tokenAddress}", version: "${currentNetworkVersion.toString()}" }`);
  }
};

createUserAndColonyData();
