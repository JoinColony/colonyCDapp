const { utils, Wallet, Contract, ContractFactory, providers } = require('ethers');

const colonyJSExtras = require('@colony/colony-js/extras')
const colonyJSIColony = require('../node_modules/@colony/colony-js/dist/cjs/contracts/IColony/9/factories/IColony__factory.js')
const { addAugmentsB } = require('../node_modules/@colony/colony-js/dist/cjs/clients/Core/augments/AddDomain.js');

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
const createUniqueDomain = /* GraphQL */ `
  mutation CreateUniqueDomain($input: CreateUniqueDomainInput) {
    createUniqueDomain(input: $input) { nativeId }
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

  const colonyNetwork = new Contract(etherRouterAddress, IColonyNetworkAbi, firstUserWallet);

  /*
   * Token
   */
  const { abi: TokenAbi, bytecode: TokenBytecode } = colonyJSExtras.factories.latest.MetaTxToken__factory;
  const tokenFactory = new ContractFactory(TokenAbi, TokenBytecode, firstUserWallet);
  const token = await tokenFactory.deploy('Token A', 'A', 18, { gasPrice: '2000000000' });
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
  const currentNetworkVersion = await colonyNetwork.getCurrentColonyVersion();
  const colonyDeployment = await colonyNetwork['createColony(address,uint256,string,string)'](tokenAddress, currentNetworkVersion, '', '');
  const colonyDeploymentTransaction = await colonyDeployment.wait();
  const createColonyEvent = colonyDeploymentTransaction.events.find(event => !!event?.args?.colonyAddress);
  const colonyAddress = utils.getAddress(createColonyEvent.args.colonyAddress);

  const { abi: IColonyAbi } = colonyJSIColony.IColony__factory;
  const colony = new Contract(colonyAddress, IColonyAbi, firstUserWallet);

  addAugmentsB(colony);

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

  /*
   * Domains
   */
  if (!colonyQuery?.errors) {
    /*
     * Root
     */
    const rootDomainMutation = await graphqlRequest(
      createUniqueDomain,
      {
        input: {
          colonyAddress: colonyAddress,
        }
      },
      GRAPHQL_URI,
      API_KEY,
    );
    if (!rootDomainMutation?.errors) {
      console.log(`Creating root domain { name: "Root", nativeId: "1", parentId: "null", id: "${colonyAddress}_1"`);
    }


    /*
     * First Domain
     */
    const firstSubdomainDeployment = await colony['addDomainWithProofs(uint256)'](1);
    const firstSubdomainTransactions = await firstSubdomainDeployment.wait();
    const { args: { domainId: firstSubdomainId } } = firstSubdomainTransactions.events.find(event => !!event?.args?.domainId);

    const firstDomainMutation = await graphqlRequest(
      createUniqueDomain,
      {
        input: {
          colonyAddress: colonyAddress,
          name: 'Red',
          description: 'First domain',
          color: 'RED',
        }
      },
      GRAPHQL_URI,
      API_KEY,
    );

    if (!firstDomainMutation?.errors) {
      console.log(`Creating subdomain { name: "First Subdomain", nativeId: "${firstSubdomainId.toString()}", parentId: "1", id: "${colonyAddress}_${firstSubdomainId.toString()}"`);
    }

    /*
     * Second Domain
     */
    const secondSubdomainDeployment = await colony['addDomainWithProofs(uint256)'](1);
    const secondSubdomainTransactions = await secondSubdomainDeployment.wait();
    const { args: { domainId: secondSubdomainId } } = secondSubdomainTransactions.events.find(event => !!event?.args?.domainId);

    const secondDomainMutation = await graphqlRequest(
      createUniqueDomain,
      {
        input: {
          colonyAddress: colonyAddress,
          name: 'Orange',
          description: 'Second domain',
          color: 'ORANGE',
        }
      },
      GRAPHQL_URI,
      API_KEY,
    );

    if (!secondDomainMutation?.errors) {
      console.log(`Creating subdomain { name: "Second Subdomain", nativeId: "${secondSubdomainId.toString()}", parentId: "1", id: "${colonyAddress}_${secondSubdomainId.toString()}"`);
    }
  }
};

createUserAndColonyData();
