const { utils, Wallet, Contract, ContractFactory, providers, BigNumber } = require('ethers');

const colonyJSExtras = require('@colony/colony-js/extras')
const colonyJSIColony = require('../node_modules/@colony/colony-js/dist/cjs/contracts/IColony/9/factories/IColony__factory.js')
const colonyJSMetaTxToken = require('../node_modules/@colony/colony-js/dist/cjs/contracts/factories/latest/MetaTxToken__factory.js')
const { addAugmentsB } = require('../node_modules/@colony/colony-js/dist/cjs/clients/Core/augments/AddDomain.js');

/*
 * @NOTE To preserve time, I just re-used a script I wrote for one of the lambda functions
 * So if that lambda function gets removed, this script will stop working
 */
const {
  graphqlRequest,
} = require('../amplify/backend/function/createUniqueColony/src/utils');
/*
 * @NOTE This script depends on both the ganache chain (and especially accounts) being active
 * as well as the network contracts being deployed on said chain
 * So make sure to only run this script after the dev environment (via docker compose) was started
 */
const {
  private_keys,
} = require('../amplify/mock-data/colonyNetworkArtifacts/ganache-accounts.json');
const {
  etherRouterAddress,
} = require('../amplify/mock-data/colonyNetworkArtifacts/etherrouter-address.json');

const userThumbnails = require('./imageData');

const API_KEY = 'da2-fakeApiId123456';
const GRAPHQL_URI = 'http://localhost:20002/graphql';

/*
 * Mutations
 */
const createUniqueUser = /* GraphQL */ `
  mutation CreateUniqueUser($input: CreateUniqueUserInput) {
    createUniqueUser(input: $input) {
      id
    }
  }
`;
const createUniqueColony = /* GraphQL */ `
  mutation CreateUniqueColony($input: CreateUniqueColonyInput) {
    createUniqueColony(input: $input) {
      id
    }
  }
`;
const createColonyTokens = /* GraphQL */ `
  mutation CreateColonyTokens($input: CreateColonyTokensInput!) {
    createColonyTokens(input: $input) {
      id
    }
  }
`;
const createUserTokens = /* GraphQL */ `
  mutation CreateUserTokens($input: CreateUserTokensInput!) {
    createUserTokens(input: $input) {
      id
    }
  }
`;
const createWatchedColonies = /* GraphQL */ `
  mutation CreateWatchedColonies($input: CreateWatchedColoniesInput!) {
    createWatchedColonies(input: $input) {
      id
    }
  }
`;
const createDomain = /* GraphQL */`
  mutation CreateDomain($input: CreateDomainInput!) {
    createDomain(input: $input) { id }
  }
`;
const createDomainMetadata = /* GraphQL */`
  mutation CreateDomainMetadata($input: CreateDomainMetadataInput!) {
    createDomainMetadata(input: $input) { id }
  }
`;
const createColonyMetadata = /* GraphQL */`
  mutation CreateColonyMetadata($input: CreateColonyMetadataInput!) {
    createColonyMetadata(input: $input) { id }
  }
`

/*
 * Queries
 */
const getTokenFromEverywhere = /* GraphQL */ `
  query GetTokenFromEverywhere($input: TokenFromEverywhereArguments) {
    getTokenFromEverywhere(input: $input) {
      items {
        id
      }
    }
  }
`;

/*
 * Helper methods
 */
const delay = (ms = 300, verbose = false) =>
  new Promise((resolve) =>
    setTimeout(() => {
      if (verbose) {
        console.log(`Delaying execution by ${ms} milliseconds`);
      }
      resolve();
    }, ms),
  );

/*
 * User
 */
const subscribeUserToColony = async (userAddress, colonyAddress) => {
  // subscribe user to colony
  await graphqlRequest(
    createWatchedColonies,
    {
      input: {
        colonyID: colonyAddress,
        userID: userAddress,
      },
    },
    GRAPHQL_URI,
    API_KEY,
  );
  await delay();

  console.log(
    `Subscribing user { address: "${userAddress}" } to colony's { address: "${colonyAddress}" } watchers`,
  );
};

const createUser = async (username, accountIndex = 0) => {
  /*
   * @NOTE This could be done "cheaper", but I wanted to make sure the address
   * is proper, so I've instantiated a wallet as well
   */
  const provider = new providers.JsonRpcProvider();
  const privateKey = Object.values(private_keys)[accountIndex];
  const userWallet = new Wallet(privateKey, provider);
  const userAddress = utils.getAddress(userWallet.address);
  userWallet.address = userAddress;

  const userQuery = await graphqlRequest(
    createUniqueUser,
    {
      input: {
        id: userAddress,
        name: username,
        profile: {
          displayName: `User ${username.toUpperCase()}`,
          thumbnail: userThumbnails[`thumbnailUser${username.toUpperCase()}`],
          email: `${username}@colony.io`,
          meta: { emailPermissions: [] },
        },
      },
    },
    GRAPHQL_URI,
    API_KEY,
  );
  await delay();

  if (userQuery?.errors) {
    console.log('USER COULD NOT BE CREATED.', userQuery.errors[0].message);
  } else {
    console.log(
      `Creating user { name: "${username}", walletAddress: "${userAddress}", profile: { displayName: "User ${username.toUpperCase()}", email: "${username}@colony.io", emailPermissions: "[]" } }`,
    );
  }

  return userWallet;
};

/*
 * Token
 */
const addTokenToUserTokens = async (userAddress, tokenAddress) => {
  // add new token to the current user's token list
  await graphqlRequest(
    createUserTokens,
    {
      input: {
        userID: userAddress,
        tokenID: tokenAddress,
      },
    },
    GRAPHQL_URI,
    API_KEY,
  );
  await delay();

  console.log(
    `Adding token { address: "${tokenAddress}" } to user's { address: "${userAddress}" } tokens list`,
  );
};

const addTokenToColonyTokens = async (colonyAddress, tokenAddress) => {
  // add token to colony's token list
  await graphqlRequest(
    createColonyTokens,
    {
      input: {
        colonyID: colonyAddress,
        tokenID: tokenAddress,
      },
    },
    GRAPHQL_URI,
    API_KEY,
  );
  await delay();

  console.log(
    `Adding token { address: "${tokenAddress}" } to colony's { address: "${colonyAddress}" } tokens list`,
  );
};

const addTokenToDB = async (tokenAddress) => {
  // create token entry in the db
  await graphqlRequest(
    getTokenFromEverywhere,
    { input: { tokenAddress } },
    GRAPHQL_URI,
    API_KEY,
  );
};

const createToken = async (symbol, singerOrWallet) => {
  const { abi: TokenAbi, bytecode: TokenBytecode } = colonyJSMetaTxToken.MetaTxToken__factory;
  const tokenFactory = new ContractFactory(TokenAbi, TokenBytecode, singerOrWallet);
  const token = await tokenFactory.deploy(`Token ${symbol.toUpperCase()}`, symbol.toUpperCase(), 18);
  await delay();
  await token.deployed();
  await delay();
  const tokenAddress = utils.getAddress(token.address);

  // create token entry in the db
  await addTokenToDB(tokenAddress);

  console.log(
    `Creating token { name: "Token ${symbol.toUpperCase()}", symbol: "${symbol.toUpperCase()}", decimals: "18", address: "${tokenAddress}" }`,
  );

  await addTokenToUserTokens(singerOrWallet.address, tokenAddress);

  return tokenAddress;
};

/*
 * Colony
 */
const createMetacolony = async (singerOrWallet) => {
  const { abi: IColonyNetworkAbi } =
    colonyJSExtras.factories.latest.IColonyNetwork__factory;
  const { abi: IColonyAbi } = colonyJSIColony.IColony__factory;
  const colonyNetwork = new Contract(
    etherRouterAddress,
    IColonyNetworkAbi,
    singerOrWallet,
  );

  const metacolonyAddress = await colonyNetwork['getMetaColony()']();
  const metacolony = new Contract(
    metacolonyAddress,
    IColonyAbi,
    singerOrWallet,
  );
  const metacolonyTokenAddress = await metacolony.getToken();
  const metacolonyVersion = await metacolony.version();

  await addTokenToDB(utils.getAddress(metacolonyTokenAddress));

  // create the metacolony
  const metacolonyQuery = await graphqlRequest(
    createUniqueColony,
    {
      input: {
        id: utils.getAddress(metacolonyAddress),
        colonyNativeTokenId: utils.getAddress(metacolonyTokenAddress),
        name: 'meta',
        type: 'METACOLONY',
        version: BigNumber.from(metacolonyVersion).toNumber()
      }
    },
    GRAPHQL_URI,
    API_KEY,
  );
  await delay();

  if (!metacolonyQuery?.errors) {
    // add token to colony's token list
    await addTokenToColonyTokens(
      utils.getAddress(metacolonyAddress),
      utils.getAddress(metacolonyTokenAddress),
    );
    await delay();

    if (metacolonyQuery?.errors) {
      console.log(
        'METACOLONY COULD NOT BE CREATED.',
        metacolonyQuery.errors[0].message,
      );
    } else {
      console.log(`Creating metacolony { name: "meta", colonyAddress: "${utils.getAddress(metacolonyAddress)}", nativeToken: "${utils.getAddress(metacolonyTokenAddress)}", version: "${metacolonyVersion.toString()}" }`);
    }

    // create metacolony metadata 
    const metadataMutation = await graphqlRequest(
      createColonyMetadata,
      {
        input: {
          id: utils.getAddress(metacolonyAddress),
          displayName: 'Metacolony'
        }
      },
      GRAPHQL_URI,
      API_KEY,
    );
    await delay();

    if(!metadataMutation.errors) {
      console.log(`Creating metacolony metadata { displayName: "Metacolony" }`);
    }

    const rootDomainMetadataMutation = await graphqlRequest(
      createDomainMetadata,
      {
        input: {
          id: `${utils.getAddress(metacolonyAddress)}_1`,
          name: 'Root',
          color: 'LIGHT_PINK',
          description: ''
        },
      },
      GRAPHQL_URI,
      API_KEY,
    );
    // @NOTE: Temporary, until handled by block-ingestor (unlike subdomains)
    const rootDomainMutation = await graphqlRequest(
      createDomain,
      {
        input: {
          id: `${utils.getAddress(metacolonyAddress)}_1`,
          colonyId: utils.getAddress(metacolonyAddress),
          nativeId: 1,
          isRoot: true,
          nativeFundingPotId: 1,
          nativeSkillId: 1
        },
      },
      GRAPHQL_URI,
      API_KEY,
    );

    await delay();

    if (!rootDomainMetadataMutation?.errors && !rootDomainMutation?.errors) {
      console.log(`Creating root domain and its metadata { name: "Root", id: "${utils.getAddress(metacolonyAddress)}_1", color: "LIGHT_PINK", description: "" }`);
    }
  }

  return utils.getAddress(metacolonyAddress);
};

const createColony = async (colonyName, tokenAddress, singerOrWallet) => {
  const { abi: IColonyNetworkAbi } =
    colonyJSExtras.factories.latest.IColonyNetwork__factory;
  const colonyNetwork = new Contract(
    etherRouterAddress,
    IColonyNetworkAbi,
    singerOrWallet,
  );
  const currentNetworkVersion = await colonyNetwork.getCurrentColonyVersion();
  const colonyDeployment = await colonyNetwork[
    'createColony(address,uint256,string,string)'
  ](tokenAddress, currentNetworkVersion, '', '');
  await delay();
  const colonyDeploymentTransaction = await colonyDeployment.wait();
  await delay();
  const createColonyEvent = colonyDeploymentTransaction.events.find(
    (event) => !!event?.args?.colonyAddress,
  );
  const colonyAddress = utils.getAddress(createColonyEvent.args.colonyAddress);

  const { abi: IColonyAbi } = colonyJSIColony.IColony__factory;
  const colony = new Contract(colonyAddress, IColonyAbi, singerOrWallet);

  addAugmentsB(colony);

  // create the colony
  const colonyQuery = await graphqlRequest(
    createUniqueColony,
    {
      input: {
        id: colonyAddress,
        colonyNativeTokenId: tokenAddress,
        name: colonyName,
        version: BigNumber.from(currentNetworkVersion).toNumber()
      }
    },
    GRAPHQL_URI,
    API_KEY,
  );

  if (!colonyQuery?.errors) {
    // add token to colony's token list
    await addTokenToColonyTokens(colonyAddress, tokenAddress);
    // subscribe user to colony
    await subscribeUserToColony(singerOrWallet.address, colonyAddress);
  }

  await delay();

  if (colonyQuery?.errors) {
    console.log('COLONY COULD NOT BE CREATED.', colonyQuery.errors[0].message);
  } else {
    console.log(`Creating colony { name: "${colonyName}", colonyAddress: "${colonyAddress}", nativeToken: "${tokenAddress}", version: "${currentNetworkVersion.toString()}" }`);
  }

  // Colony metadata
  const metadataMutation = await graphqlRequest(
    createColonyMetadata,
    {
      input: {
        id: utils.getAddress(colonyAddress),
        displayName: `Colony ${colonyName.toUpperCase()}`
      }
    },
    GRAPHQL_URI,
    API_KEY,
  );
  await delay();

  if(!metadataMutation.errors) {
    console.log(`Creating colony metadata { displayName: "Colony ${colonyName.toUpperCase()}" }`);
  }

  /*
   * Domains
   */
  if (!colonyQuery?.errors) {
    /*
     * Root
     */
    const rootDomainMetadataMutation = await graphqlRequest(
      createDomainMetadata,
      {
        input: {
          id: `${utils.getAddress(colonyAddress)}_1`,
          name: 'Root',
          color: 'LIGHT_PINK',
          description: ''
        },
      },
      GRAPHQL_URI,
      API_KEY,
    );
     // @NOTE: Temporary, until handled by block-ingestor (unlike subdomains)
    const rootDomainMutation = await graphqlRequest(
      createDomain,
      {
        input: {
          id: `${utils.getAddress(colonyAddress)}_1`,
          colonyId: utils.getAddress(colonyAddress),
          nativeId: 1,
          isRoot: true,
          nativeFundingPotId: 1,
          nativeSkillId: 1
        },
      },
      GRAPHQL_URI,
      API_KEY,
    );

    await delay();

    if (!rootDomainMetadataMutation?.errors && !rootDomainMutation?.errors) {
      console.log(`Creating root domain and its metadata { name: "Root", id: "${utils.getAddress(colonyAddress)}_1", color: "LIGHT_PINK", description: "" }`);
    }

    /*
     * First Domain
     */
    const firstSubdomainDeployment = await colony[
      'addDomainWithProofs(uint256)'
    ](1);
    await delay();
    const firstSubdomainTransactions = await firstSubdomainDeployment.wait();
    await delay();
    const {
      args: { domainId: firstSubdomainId },
    } = firstSubdomainTransactions.events.find(
      (event) => !!event?.args?.domainId,
    );

    const firstDomainMetadataMutation = await graphqlRequest(
      createDomainMetadata,
      {
        input: {
          id: `${utils.getAddress(colonyAddress)}_${firstSubdomainId.toString()}`,
          name: 'Red',
          color: 'RED',
          description: 'First domain'
        }
      },
      GRAPHQL_URI,
      API_KEY,
    )

    await delay();

    if (!firstDomainMetadataMutation?.errors) {
      console.log(`Creating subdomain metadata { name: "Red", id: "${colonyAddress}_${firstSubdomainId.toString()}", color: "RED", description: "First domain" }`);
    }

    /*
     * Second Domain
     */
    const secondSubdomainDeployment = await colony[
      'addDomainWithProofs(uint256)'
    ](1);
    await delay();
    const secondSubdomainTransactions = await secondSubdomainDeployment.wait();
    await delay();
    const {
      args: { domainId: secondSubdomainId },
    } = secondSubdomainTransactions.events.find(
      (event) => !!event?.args?.domainId,
    );

    const secondDomainMetadataMutation = await graphqlRequest(
      createDomainMetadata,
      {
        input: {
          id: `${utils.getAddress(colonyAddress)}_${secondSubdomainId.toString()}`,
          name: 'Orange',
          color: 'ORANGE',
          description: 'Second domain'
        }
      },
      GRAPHQL_URI,
      API_KEY,
    )

    await delay();

    if (!secondDomainMetadataMutation?.errors) {
      console.log(`Creating subdomain metadata { name: "Orange", id: "${colonyAddress}_${secondSubdomainId.toString()}", color: "ORANGE", description: "Second domain" }`);
    }
  }

  return colonyAddress;
};

/*
 * Orchestration
 */
const createUserAndColonyData = async () => {
  const firstUser = await createUser('Boris', 0);
  const secondUser = await createUser('Liz', 1);
  const thirdUser = await createUser('Rishi', 2);

  await createMetacolony(firstUser);

  const firstTokenAddress = await createToken('a', firstUser);
  const secondTokenAddress = await createToken('b', secondUser);
  const thirdTokenAddress = await createToken('c', thirdUser);

  await addTokenToUserTokens(firstUser.address, secondTokenAddress);
  await addTokenToUserTokens(firstUser.address, thirdTokenAddress);
  await addTokenToUserTokens(secondUser.address, firstTokenAddress);
  await addTokenToUserTokens(secondUser.address, thirdTokenAddress);
  await addTokenToUserTokens(thirdUser.address, firstTokenAddress);
  await addTokenToUserTokens(thirdUser.address, secondTokenAddress);

  const firstColonyAddress = await createColony(
    'a',
    firstTokenAddress,
    firstUser,
  );
  const secondColonyAddress = await createColony(
    'b',
    secondTokenAddress,
    secondUser,
  );
  const thirdColonyAddress = await createColony(
    'c',
    thirdTokenAddress,
    thirdUser,
  );

  await subscribeUserToColony(firstUser.address, secondColonyAddress);
  await subscribeUserToColony(firstUser.address, thirdColonyAddress);
  await subscribeUserToColony(secondUser.address, firstColonyAddress);
  await subscribeUserToColony(secondUser.address, thirdColonyAddress);
  await subscribeUserToColony(thirdUser.address, firstColonyAddress);
  await subscribeUserToColony(thirdUser.address, secondColonyAddress);
};

createUserAndColonyData();
