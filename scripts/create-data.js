require('cross-fetch/polyfill');

const {
  utils,
  Wallet,
  providers,
  BigNumber,
  constants,
  Contract,
} = require('ethers');
const { poll } = require('ethers/lib/utils');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const { nanoid } = require('nanoid');
const { compareVersions } = require('compare-versions');
const {
  ColonyTokenFactory,
  ColonyNetworkFactory,
  ColonyFactory,
  getPermissionProofs,
  ColonyRole,
  getExtensionHash,
  colonyRoles2Hex,
  getChildIndex,
  ClientType,
} = require('@colony/colony-js');
const { graphqlRequest } = require('./utils/graphqlRequest');
const { abi: OneTxAbi } = require('@colony/abis/versions/hmwss/OneTxPayment');
const {
  abi: StakedExpenditureAbi,
} = require('@colony/abis/versions/hmwss/StakedExpenditure');

/*
 * @NOTE This script depends on both the ganache chain (and especially accounts) being active
 * as well as the network contracts being deployed on said chain
 * So make sure to only run this script after the dev environment (via docker compose) was started
 */
let etherRouterAddress;
let private_keys;
let ganacheAddresses;

const {
  colonies: coloniesTempData,
  users: usersTempData,
} = require('./tempColonyData');

// fetch command line arguments
const timeoutArg = process.argv.indexOf('--timeout');
const timeoutArgValue = process.argv[timeoutArg + 1];

const coloniesArg = process.argv.indexOf('--coloniesCount');
const coloniesArgValue = process.argv[coloniesArg + 1];

const usePreviousColonyVersionArg =
  process.argv.indexOf('--usePreviousColonyVersion') !== -1;

const yesArg = process.argv.indexOf('--yes');

const DEFAULT_COLONIES = parseInt(coloniesArgValue, 10) || 2;
const DEFAULT_TIMEOUT = parseInt(timeoutArgValue, 10) || 300;

const API_KEY = 'da2-fakeApiId123456';
const GRAPHQL_URI =
  process.env.AWS_APPSYNC_GRAPHQL_URL || 'http://localhost:20002/graphql';

const DOMAIN_COLORS = [
  'AQUA',
  'BLACK',
  'BLUE',
  'BLUE_GREY',
  'EMERALD_GREEN',
  'GOLD',
  'GREEN',
  'LIGHT_PINK',
  'MAGENTA',
  'ORANGE',
  'PERIWINKLE',
  'PINK',
  'PURPLE',
  'PURPLE_GREY',
  'RED',
  'YELLOW',
];

const CHAR_LIMITS = {
  USER: {
    MAX_DISPLAYNAME_CHARS: 30,
    MAX_BIO_CHARS: 200,
    MAX_LOCATION_CHARS: 200,
  },
  COLONY: {
    MAX_COLONY_DISPLAY_NAME: 20,
  },
};

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
const createColonyTokens = /* GraphQL */ `
  mutation CreateColonyTokens($input: CreateColonyTokensInput!) {
    createColonyTokens(input: $input) {
      id
    }
  }
`;
const createDomainMetadata = /* GraphQL */ `
  mutation CreateDomainMetadata($input: CreateDomainMetadataInput!) {
    createDomainMetadata(input: $input) {
      id
    }
  }
`;
const createContributor = /* GraphQL */ `
  mutation CreateColonyContributor($input: CreateColonyContributorInput!) {
    createColonyContributor(input: $input) {
      id
    }
  }
`;

const updateColonyMetadata = /* GraphQL */ `
  mutation UpdateColonyMetadata($input: UpdateColonyMetadataInput!) {
    updateColonyMetadata(input: $input) {
      id
    }
  }
`;

const createColonyEtherealMetadata = /* GraphQL */ `
  mutation CreateColonyEtherealMetadata(
    $input: CreateColonyEtherealMetadataInput!
  ) {
    createColonyEtherealMetadata(input: $input) {
      id
    }
  }
`;

const updateColonyContributor = /* GraphQL */ `
  mutation UpdateColonyContributor($input: UpdateColonyContributorInput!) {
    updateColonyContributor(input: $input) {
      id
    }
  }
`;

const updateContributorsWithReputation = /* GraphQL */ `
  mutation UpdateContributorsWithReputation($colonyAddress: String) {
    updateContributorsWithReputation(input: { colonyAddress: $colonyAddress })
  }
`;

const createTransaction = /* GraphQL */ `
  mutation CreateTransaction($input: CreateTransactionInput!) {
    createTransaction(input: $input) {
      id
    }
  }
`;

const updateToken = /* GraphQL */ `
  mutation UpdateToken($input: UpdateTokenInput!) {
    updateToken(input: $input) {
      id
    }
  }
`;

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

const getCurrentVersion = /* GraphQL */ `
  query GetCurrentVersion($key: String!) {
    getCurrentVersionByKey(key: $key) {
      items {
        version
      }
    }
  }
`;

const getColonyDomains = /* GraphQL */ `
  query GetColonyDomains($address: ID!) {
    getColonyByAddress(id: $address) {
      items {
        domains {
          items {
            id
            nativeId
            nativeFundingPotId
          }
        }
      }
    }
  }
`;

const getColonyContributors = /* GraphQL */ `
  query GetColonyContributors($address: ID!) {
    listColonyContributors(filter: { colonyAddress: { eq: $address } }) {
      items {
        user {
          id
        }
      }
    }
  }
`;

const getColonyMetadata = /* GraphQL */ `
  query GetColonyMetadata($id: ID!) {
    getColonyMetadata(id: $id) {
      id
    }
  }
`;

const graphqlRequestPreconfigured = async (queryOrMutation, variables) =>
  graphqlRequest(queryOrMutation, variables, GRAPHQL_URI, API_KEY);

/*
 * Helper methods
 */
const delay = (ms = DEFAULT_TIMEOUT, verbose = false) =>
  new Promise((resolve) =>
    setTimeout(() => {
      if (verbose) {
        console.log(`Delaying execution by ${ms} milliseconds`);
      }
      resolve();
    }, ms),
  );

const readFile = (path) => {
  try {
    const data = fs.readFileSync(path, 'utf8');
    return data;
  } catch (err) {
    console.error(err);
  }
};

const addTxToDb = async ({
  colonyAddress,
  context,
  groupId,
  groupIndex,
  groupKey,
  hash,
  methodName,
  params,
  status,
  userAddress,
}) => {
  const txGroup = {
    id: `${groupId}-${groupIndex}`,
    groupId,
    index: groupIndex,
    key: groupKey,
    description: null,
    descriptionValues: null,
    title: null,
    titleValues: null,
  };

  const input = {
    id: `${groupId}-${methodName}`,
    context,
    createdAt: new Date().toISOString(),
    from: userAddress,
    colonyAddress,
    groupId,
    group: txGroup,
    hash,
    methodContext: null,
    methodName,
    status,
    title: null,
    titleValues: null,
    params: JSON.stringify(params),
    identifier: colonyAddress,
    options: JSON.stringify({}),
  };

  return graphqlRequest(createTransaction, { input }, GRAPHQL_URI, API_KEY);
};

/*
 * User
 */
const subscribeUserToColony = async (userAddress, colonyAddress) => {
  // subscribe user to colony
  await graphqlRequestPreconfigured(createContributor, {
    input: {
      colonyAddress,
      colonyReputationPercentage: 0,
      contributorAddress: userAddress,
      isVerified: false,
      id: `${colonyAddress}_${userAddress}`,
      isWatching: true,
    },
  });
  await delay();

  console.log(
    `Subscribing user { address: "${userAddress}" } to colony's { address: "${colonyAddress}" } watchers`,
  );
};

const createUser = async (
  { username, avatar, description, website, location },
  accountIndex,
) => {
  /*
   * @NOTE This could be done "cheaper", but I wanted to make sure the address
   * is proper, so I've instantiated a wallet as well
   */
  const provider = new providers.JsonRpcProvider();

  let userWallet = Wallet.createRandom().connect(provider);

  if (accountIndex >= 0) {
    const privateKey = Object.values(private_keys)[accountIndex];
    userWallet = new Wallet(privateKey, provider);
  }

  const userAddress = utils.getAddress(userWallet.address);
  userWallet.address = userAddress;

  try {
    const metadata = {};

    if (avatar) {
      metadata.avatar = avatar;
      metadata.thumbnail = avatar;
    }

    if (description) {
      metadata.bio = description.slice(0, CHAR_LIMITS.USER.MAX_BIO_CHARS);
    }

    if (website) {
      metadata.website = website;
    }

    if (location) {
      metadata.location = location.slice(
        0,
        CHAR_LIMITS.USER.MAX_LOCATION_CHARS,
      );
    }

    const displayName = username.slice(
      0,
      CHAR_LIMITS.USER.MAX_DISPLAYNAME_CHARS,
    );
    const email = `${displayName}@colony.io`;

    const userQuery = await graphqlRequestPreconfigured(createUniqueUser, {
      input: {
        id: userAddress,
        profile: {
          displayName,
          email,
          ...metadata,
        },
      },
    });
    await delay();

    if (userQuery?.errors) {
      console.log(
        'USER COULD NOT BE CREATED.',
        userQuery.errors[0].message,
        JSON.stringify(userQuery.errors),
      );
    } else {
      console.log(
        `Creating user { walletAddress: "${userAddress}", profile: { displayName: "${displayName}", email: "${email}" } }`,
      );
    }
  } catch (error) {
    console.error(error);
  }

  return userWallet;
};

/*
 * Token
 */

const addTokenToColonyTokens = async (colonyAddress, tokenAddress) => {
  // add token to colony's token list
  await graphqlRequestPreconfigured(createColonyTokens, {
    input: {
      colonyID: colonyAddress,
      tokenID: tokenAddress,
    },
  });
  await delay();

  console.log(
    `Adding token { address: "${tokenAddress}" } to colony's { address: "${colonyAddress}" } tokens list`,
  );
};

const addTokenToDB = async (tokenAddress, avatar) => {
  // create token entry in the db
  await graphqlRequestPreconfigured(getTokenFromEverywhere, {
    input: {
      tokenAddress,
      avatar: avatar || null,
      thumbnail: avatar || null,
    },
  });
};

const updateInitialReputation = async (colonyAddress) => {
  console.log(`Setting initial reputation for colony ${colonyAddress}`);
  await graphqlRequestPreconfigured(updateContributorsWithReputation, {
    input: {
      colonyAddress,
    },
  });
  await delay(3000);
};

// Creating extra tokens, not added to any colony, but which are validated
// Note that this method won't actually return anything
const createValidatedToken = async (
  { tokenName = 'Generic Token', tokenSymbol = 'GTKN', tokenDecimals = 18 },
  signerOrWallet,
) => {
  const colonyNetwork = await ColonyNetworkFactory.connect(
    etherRouterAddress,
    signerOrWallet,
  );

  // Dry run
  const newlyCreatedTokenAddress = await colonyNetwork.callStatic[
    'deployTokenViaNetwork'
  ](tokenName, tokenSymbol, tokenDecimals);

  // Create the actual token
  await colonyNetwork.deployTokenViaNetwork(
    tokenName,
    tokenSymbol,
    tokenDecimals,
  );

  // add the token to the db
  await addTokenToDB(newlyCreatedTokenAddress);

  // validate the token
  await graphqlRequest(
    updateToken,
    {
      input: {
        id: newlyCreatedTokenAddress,
        validated: true,
      },
    },
    GRAPHQL_URI,
    API_KEY,
  );

  console.log(
    `Created validated token "${tokenName}", "${tokenSymbol}", at address "${newlyCreatedTokenAddress}"`,
  );
};

const mintTokens = async (
  colonyAddress,
  colonyName,
  tokenAddress,
  signerOrWallet,
) => {
  const colonyClient = ColonyFactory.connect(colonyAddress, signerOrWallet);

  const amount = BigNumber.from(
    `${randomBetweenNumbers(1, 100)}000000000000000000000000`,
  );

  // mint
  const mintTokens = await colonyClient.mintTokens(amount);
  await delay();
  await mintTokens.wait();
  await delay();

  const batchKey = 'mintTokens';
  const groupId = nanoid();

  await addTxToDb({
    colonyAddress,
    context: ClientType.ColonyClient,
    groupId,
    groupIndex: 0,
    groupKey: batchKey,
    hash: mintTokens.hash,
    methodName: 'mintTokens',
    params: [amount],
    status: 'SUCCEEDED',
    userAddress: signerOrWallet.address,
  });

  // claim
  const claimColonyFunds = await colonyClient.claimColonyFunds(tokenAddress);
  await delay();
  await claimColonyFunds.wait();
  await delay();

  await addTxToDb({
    colonyAddress,
    context: ClientType.ColonyClient,
    groupId,
    groupIndex: 1,
    groupKey: batchKey,
    hash: claimColonyFunds.hash,
    methodName: 'claimColonyFunds',
    params: [amount],
    status: 'SUCCEEDED',
    userAddress: signerOrWallet.address,
  });

  console.log(
    `Minted and claimed ${amount.toString()} tokens in colony "${colonyName}"`,
  );
};

/*
 * Colony
 */

const createColony = async (
  {
    colonyName = '',
    colonyDisplayName,
    colonyDescription,
    colonySocialLinks = [],
    colonyAvatar,
    version,
    token: {
      name: tokenName = 'Generic Token',
      symbol: tokenSymbol = 'GTKN',
      decimals: tokenDecimals = 18,
      avatar: tokenAvatar,
    } = {},
    domains = [],
  } = {},
  signerOrWallet,
) => {
  const colonyNetwork = ColonyNetworkFactory.connect(
    etherRouterAddress,
    signerOrWallet,
  );

  if (!version) {
    version = await colonyNetwork.getCurrentColonyVersion();
  }

  const params = [
    constants.AddressZero,
    tokenName,
    tokenSymbol,
    tokenDecimals,
    version,
    '', // no point in storing ens name on the chain
    '',
  ];

  const populatedTransaction = await colonyNetwork.populateTransaction[
    'createColonyForFrontend'
  ](...params);

  populatedTransaction.gasPrice = BigNumber.from(1000000000);

  const gas = await signerOrWallet.provider.estimateGas(populatedTransaction);
  populatedTransaction.gasLimit = gas;

  const nonce = await signerOrWallet.getTransactionCount();
  populatedTransaction.nonce = nonce;

  const signedTransaction =
    await signerOrWallet.signTransaction(populatedTransaction);
  const hash = utils.keccak256(signedTransaction);

  const displayName = (
    colonyDisplayName || `Colony ${colonyName.toUpperCase()}`
  ).slice(0, CHAR_LIMITS.COLONY.MAX_COLONY_DISPLAY_NAME);

  // create the colony
  const colonyQuery = await graphqlRequestPreconfigured(
    createColonyEtherealMetadata,
    {
      input: {
        colonyName,
        colonyDisplayName: displayName,
        tokenAvatar,
        tokenThumbnail: tokenAvatar,
        initiatorAddress: utils.getAddress(signerOrWallet.address),
        transactionHash: hash,
        inviteCode: 'dev',
      },
    },
  );

  if (colonyQuery?.errors) {
    console.log(
      'COLONY ETHEREAL DATA COULD NOT BE CREATED.',
      colonyQuery.errors[0].message,
    );
  } else {
    console.log(
      `Creating colony ethereal data { name: "${colonyName}", creationTransactionHash: "${hash}", version: "${version.toString()}" }`,
    );
  }

  const colonyDeployment =
    await signerOrWallet.provider.sendTransaction(signedTransaction);
  const colonyDeploymentTransaction = await colonyDeployment.wait();

  await delay();

  const events = colonyDeploymentTransaction.logs.map((log) => {
    try {
      return colonyNetwork.interface.parseLog(log);
    } catch (err) {
      return null;
    }
  });

  const createColonyEvent = events.find(
    (event) => !!event?.args?.colonyAddress,
  );

  const colonyAddress = utils.getAddress(createColonyEvent.args.colonyAddress);
  const tokenAddress = utils.getAddress(createColonyEvent.args.token);

  const batchKey = 'createColony';
  const groupId = nanoid();

  await addTxToDb({
    colonyAddress,
    context: ClientType.NetworkClient,
    groupId,
    groupIndex: 0,
    groupKey: batchKey,
    hash: colonyDeploymentTransaction.transactionHash,
    methodName: 'createColonyForFrontend',
    params,
    status: 'SUCCEEDED',
    userAddress: signerOrWallet.address,
  });

  const colonyClient = ColonyFactory.connect(colonyAddress, signerOrWallet);
  const tokenClient = ColonyTokenFactory.connect(tokenAddress, signerOrWallet);

  const metadata = {};
  if (colonyDescription) {
    metadata.description = colonyDescription.slice(
      0,
      CHAR_LIMITS.COLONY.MAX_COLONY_DESCRIPTION,
    );
  }
  if (colonyAvatar) {
    metadata.avatar = colonyAvatar;
    metadata.thumbnail = colonyAvatar;
  }
  if (colonySocialLinks && colonySocialLinks.length) {
    metadata.externalLinks = colonySocialLinks;
  }

  const colonyExists = await tryFetchGraphqlQuery(getColonyMetadata, {
    id: utils.getAddress(colonyAddress),
  });

  if (!colonyExists?.id) {
    console.log(
      `There was an error creating colony ${colonyDisplayName} with address ${colonyAddress}`,
    );
    return;
  }

  // Colony metadata
  const metadataMutation = await graphqlRequestPreconfigured(
    updateColonyMetadata,
    {
      input: {
        id: utils.getAddress(colonyAddress),
        ...metadata,
      },
    },
  );
  await delay();

  if (!metadataMutation.errors) {
    console.log(
      `Creating colony metadata { displayName: "${
        colonyDisplayName || 'Colony ' + colonyName.toUpperCase()
      }" }`,
    );
  }

  // subscribe main users to colony
  await subscribeUserToColony(
    utils.getAddress(Object.keys(ganacheAddresses)[1]),
    colonyAddress,
  );
  await subscribeUserToColony(
    utils.getAddress(Object.keys(ganacheAddresses)[2]),
    colonyAddress,
  );

  /*
   * Domains
   */

  for (let index = 0; index < domains.length; index += 1) {
    try {
      // permission proofs
      const [permissionDomainId, childSkillIndex] = await getPermissionProofs(
        colonyNetwork,
        colonyClient,
        1,
        ColonyRole.Architecture,
      );

      const rootDomainId = 1;

      // estimate
      const estimateGas = await colonyClient.estimateGas[
        'addDomain(uint256,uint256,uint256)'
      ](permissionDomainId, childSkillIndex, rootDomainId);
      // transactions
      const subdomainDeployment = await colonyClient[
        'addDomain(uint256,uint256,uint256)'
      ](permissionDomainId, childSkillIndex, rootDomainId, {
        gasLimit: estimateGas.div(BigNumber.from(10)).add(estimateGas),
      });
      await delay();
      // receipt events
      const subdomainTransactions = await subdomainDeployment.wait();

      const domainGroupId = nanoid();
      const domainBatchKey = 'createDomain';

      await addTxToDb({
        colonyAddress,
        context: ClientType.ColonyClient,
        groupId: domainGroupId,
        groupIndex: 0,
        groupKey: domainBatchKey,
        hash: subdomainTransactions.transactionHash,
        methodName: 'addDomain(uint256,uint256,uint256)',
        params: [rootDomainId],
        status: 'SUCCEEDED',
        userAddress: signerOrWallet.address,
      });

      await delay();
      const {
        args: { domainId: subdomainId },
      } = subdomainTransactions.events.find((event) => !!event?.args?.domainId);

      console.log('new domain', subdomainId.toString());

      const domainColor =
        domains[index].color ||
        DOMAIN_COLORS[randomBetweenNumbers(0, DOMAIN_COLORS.length - 1)] ||
        'LIGHT_PINK';

      const domainMetadataMutation = await graphqlRequestPreconfigured(
        createDomainMetadata,
        {
          input: {
            id: `${utils.getAddress(colonyAddress)}_${subdomainId.toString()}`,
            name: domains[index].name || `Team #${subdomainId.toString()}`,
            color: domainColor,
            description: domains[index].description || '',
          },
        },
      );

      await delay();

      if (!domainMetadataMutation?.errors) {
        console.log(
          `Creating subdomain metadata { name: "${
            domains[index].name || `Team #${subdomainId.toString()}`
          }", id: "${colonyAddress}_${subdomainId.toString()}", color: "${domainColor}" }`,
        );
      }
    } catch (error) {
      console.error(error);
    }
  }

  // set owner
  const setOwner = await tokenClient.setOwner(colonyAddress);
  await delay();
  const setOwnerTransaction = await setOwner.wait();

  await addTxToDb({
    colonyAddress,
    context: ClientType.TokenClient,
    groupId,
    groupIndex: 1,
    groupKey: batchKey,
    hash: setOwnerTransaction.transactionHash,
    methodName: 'setOwner',
    params: [colonyAddress],
    status: 'SUCCEEDED',
    userAddress: signerOrWallet.address,
  });

  await delay();

  // deploy OneTxPayment and StakedExpenditure extensions
  const oneTxHash = getExtensionHash('OneTxPayment');
  const stakedExpenditureHash = getExtensionHash('StakedExpenditure');

  const { data: oneTxVersionData } = await graphqlRequestPreconfigured(
    getCurrentVersion,
    {
      key: oneTxHash,
    },
  );
  const { data: stakedExpenditureVersionData } =
    await graphqlRequestPreconfigured(getCurrentVersion, {
      key: stakedExpenditureHash,
    });
  const latestOneTxVersion =
    oneTxVersionData?.getCurrentVersionByKey?.items[0]?.version || 1;
  const latestStakedExpenditureVersion =
    stakedExpenditureVersionData?.getCurrentVersionByKey?.items[0]?.version ||
    1;

  const installMulticallData = [];
  installMulticallData.push(
    colonyClient.interface.encodeFunctionData('installExtension', [
      oneTxHash,
      latestOneTxVersion,
    ]),
  );
  installMulticallData.push(
    colonyClient.interface.encodeFunctionData('installExtension', [
      stakedExpenditureHash,
      latestStakedExpenditureVersion,
    ]),
  );

  const installExtensions = await colonyClient.multicall(installMulticallData);
  await delay();
  const installExtensionsTx = await installExtensions.wait();

  await addTxToDb({
    colonyAddress,
    context: ClientType.ColonyClient,
    groupId,
    groupIndex: 2,
    groupKey: batchKey,
    hash: installExtensionsTx.transactionHash,
    methodName: 'multicall.installExtensions',
    params: [],
    status: 'SUCCEEDED',
    userAddress: signerOrWallet.address,
  });

  await delay(1000);

  // give permissions to extensions
  const [oneTxExtensionAddress, stakedExpenditureAddress] = await Promise.all([
    poll(
      async () => {
        try {
          const address = await colonyNetwork.getExtensionInstallation(
            oneTxHash,
            colonyAddress,
          );
          return address;
        } catch (err) {
          return undefined;
        }
      },
      {
        timeout: 30000,
      },
    ),
    poll(
      async () => {
        try {
          const address = await colonyNetwork.getExtensionInstallation(
            stakedExpenditureHash,
            colonyAddress,
          );
          return address;
        } catch (err) {
          return undefined;
        }
      },
      {
        timeout: 30000,
      },
    ),
  ]);

  console.log(
    `Installed OneTxPayment extension in colony ${
      colonyDisplayName || colonyName
    } at address ${oneTxExtensionAddress}`,
  );
  console.log(
    `Installed StakedExpenditure extension in colony ${
      colonyDisplayName || colonyName
    } at address ${stakedExpenditureAddress}`,
  );

  const [permissionDomainId, childSkillIndex] = await getPermissionProofs(
    colonyNetwork,
    colonyClient,
    1,
    [ColonyRole.Architecture, ColonyRole.Root],
  );

  const setRolesMulticallData = [];
  setRolesMulticallData.push(
    colonyClient.interface.encodeFunctionData('setUserRoles', [
      permissionDomainId,
      childSkillIndex,
      oneTxExtensionAddress,
      1,
      colonyRoles2Hex([
        ColonyRole.Administration,
        ColonyRole.Funding,
        ColonyRole.Arbitration,
      ]),
    ]),
  );

  setRolesMulticallData.push(
    colonyClient.interface.encodeFunctionData('setUserRoles', [
      permissionDomainId,
      childSkillIndex,
      stakedExpenditureAddress,
      1,
      colonyRoles2Hex([
        ColonyRole.Administration,
        ColonyRole.Funding,
        ColonyRole.Arbitration,
      ]),
    ]),
  );
  const setExtensionRoles = await colonyClient.multicall(setRolesMulticallData);

  await delay();
  const setExtensionRolesTx = await setExtensionRoles.wait();

  await addTxToDb({
    colonyAddress,
    context: ClientType.ColonyClient,
    groupId,
    groupIndex: 3,
    groupKey: batchKey,
    hash: setExtensionRolesTx.transactionHash,
    methodName: 'setUserRoles',
    params: [],
    status: 'SUCCEEDED',
    userAddress: signerOrWallet.address,
  });

  await delay();

  const stakeFraction = BigNumber.from(1)
    .mul(BigNumber.from(10).pow(tokenDecimals))
    .div(100); // 1% in wei
  const stakedExpenditureClient = new Contract(
    stakedExpenditureAddress,
    StakedExpenditureAbi,
    signerOrWallet,
  );
  const enableStakedExpenditureGas =
    await stakedExpenditureClient.estimateGas.initialise(stakeFraction);
  const enableStakedExpenditure = await stakedExpenditureClient.initialise(
    stakeFraction,
    {
      gasLimit: enableStakedExpenditureGas
        .div(BigNumber.from(10))
        .add(enableStakedExpenditureGas),
    },
  );

  await delay();
  const stakedExpenditureInitTx = await enableStakedExpenditure.wait();

  await addTxToDb({
    colonyAddress,
    context: ClientType.StakedExpenditureClient,
    groupId,
    groupIndex: 4,
    groupKey: batchKey,
    hash: stakedExpenditureInitTx.transactionHash,
    methodName: 'initialise',
    params: [stakeFraction],
    status: 'SUCCEEDED',
    userAddress: signerOrWallet.address,
  });

  await delay();

  return {
    colonyAddress,
    tokenAddress,
    colonyName: colonyDisplayName || colonyName,
    oneTxExtensionAddress,
  };
};

const getMultiPermissionProofs = async (
  colonyClient,
  signerOrWallet,
  domainId,
  roles,
  customAddress,
) => {
  const colonyNetwork = ColonyNetworkFactory.connect(
    etherRouterAddress,
    signerOrWallet,
  );

  const proofs = await Promise.all(
    roles.map((role) =>
      getPermissionProofs(
        colonyNetwork,
        colonyClient,
        domainId,
        role,
        customAddress,
      ),
    ),
  );

  // We are checking that all of the permissions resolve to the same domain and childSkillIndex
  for (let idx = 0; idx < proofs.length; idx += 1) {
    const [permissionDomainId, childSkillIndex, address] = proofs[idx];
    if (
      !permissionDomainId.eq(proofs[0][0]) ||
      !childSkillIndex.eq(proofs[0][1])
    ) {
      throw new Error(
        `${address} has to have all required roles (${roles}) in the same domain`,
      );
    }
  }
  // It does not need to be an array because if we get here, all the proofs are the same
  return proofs[0];
};

const getMoveFundsPermissionsProofs = async (
  colonyClient,
  fromDomainNativeId,
  toDomainNativeId,
  signerOrWallet,
) => {
  const colonyNetwork = ColonyNetworkFactory.connect(
    etherRouterAddress,
    signerOrWallet,
  );

  const [fromPermissionDomainId, fromChildSkillIndex] =
    await getPermissionProofs(
      colonyNetwork,
      colonyClient,
      fromDomainNativeId,
      ColonyRole.Funding,
      signerOrWallet.address,
    );

  // @TODO: once getPermissionProofs is more expensive we can just check the domain here
  // with userHasRole and then immediately get the permission proofs
  const [toPermissionDomainId, toChildSkillIndex] = await getPermissionProofs(
    colonyNetwork,
    colonyClient,
    toDomainNativeId,
    ColonyRole.Funding,
    signerOrWallet.address,
  );

  // Here's a weird case. We have found permissions for these domains but they don't share
  // a parent domain with that permission. We can still find a common parent domain that
  // has the funding permission
  if (!fromPermissionDomainId.eq(toPermissionDomainId)) {
    const hasFundingInRoot = await colonyClient.hasUserRole(
      signerOrWallet.address,
      1,
      ColonyRole.Funding,
    );
    // @TODO: In the future we have to not only check the ROOT domain but traverse the tree
    // (binary search) to find a common parent domain with funding permission
    // ALTHOUGH there might not be a colony version that supports the old
    // moveFundsBetweenPots function AND nested domains
    if (hasFundingInRoot) {
      const rootFromChildSkillIndex = await getChildIndex(
        colonyNetwork,
        colonyClient,
        1,
        fromDomainNativeId,
      );
      const rootToChildSkillIndex = await getChildIndex(
        colonyNetwork,
        colonyClient,
        1,
        toDomainNativeId,
      );
      // This shouldn't really happen as we have already checked whether the user has funding
      if (rootFromChildSkillIndex.lt(0) || rootToChildSkillIndex.lt(0)) {
        throw new Error(
          `User does not have the funding permission in any parent domain`,
        );
      }
      return [
        fromPermissionDomainId,
        rootFromChildSkillIndex,
        rootToChildSkillIndex,
      ];
    }
    throw new Error(
      // eslint-disable-next-line max-len
      'User has to have the funding role in a domain that both associated pots a children of',
    );
  }
  return [fromPermissionDomainId, fromChildSkillIndex, toChildSkillIndex];
};

const transferFundsBetweenPots = async (
  colonyAddress,
  colonyName,
  tokenAddress,
  domains,
  signerOrWallet,
) => {
  const colonyClient = ColonyFactory.connect(colonyAddress, signerOrWallet);

  const rootDomain = domains.find(({ nativeId }) => nativeId === 1);
  if (!rootDomain) {
    throw new Error('Root domain not found');
  }

  const domainsWithoutRoot = domains.filter(({ nativeId }) => nativeId !== 1);

  for (let index = 0; index < domainsWithoutRoot.length; index += 1) {
    try {
      const amount = BigNumber.from(
        `${randomBetweenNumbers(100, 500)}000000000000000000`,
      );

      const [permissionDomainId, fromChildSkillIndex, toChildSkillIndex] =
        await getMoveFundsPermissionsProofs(
          colonyClient,
          rootDomain.nativeId,
          domainsWithoutRoot[index].nativeId,
          signerOrWallet,
        );

      const params = [
        rootDomain.nativeFundingPotId,
        domainsWithoutRoot[index].nativeFundingPotId,
        amount,
        tokenAddress,
      ];

      const estimatedGas = await colonyClient.estimateGas[
        'moveFundsBetweenPots(uint256,uint256,uint256,uint256,uint256,uint256,address)'
      ](permissionDomainId, fromChildSkillIndex, toChildSkillIndex, ...params);

      const transferFunds = await colonyClient[
        'moveFundsBetweenPots(uint256,uint256,uint256,uint256,uint256,uint256,address)'
      ](permissionDomainId, fromChildSkillIndex, toChildSkillIndex, ...params, {
        gasLimit: estimatedGas.div(BigNumber.from(10)).add(estimatedGas),
      });
      await delay();
      const transferFundsTransaction = await transferFunds.wait();

      const batchKey = 'moveFunds';
      const groupId = nanoid();

      await addTxToDb({
        colonyAddress,
        context: ClientType.ColonyClient,
        groupId,
        groupIndex: 0,
        groupKey: batchKey,
        hash: transferFundsTransaction.transactionHash,
        methodName:
          'moveFundsBetweenPots(uint256,uint256,uint256,uint256,uint256,uint256,address)',
        params,
        status: 'SUCCEEDED',
        userAddress: signerOrWallet.address,
      });

      await delay();

      console.log(
        `Sending ${amount
          .div(BigNumber.from(10).pow(18))
          .toString()} tokens to domain ${
          domainsWithoutRoot[index].nativeId
        } in colony "${colonyName}"`,
      );
    } catch (error) {
      console.log('Transfer Funds Between Pots');
      console.error(error);
    }
  }
};

const userPayments = async (
  colonyAddress,
  colonyName,
  oneTxExtensionAddress,
  tokenAddress,
  domains,
  users,
  signerOrWallet,
) => {
  const colonyClient = ColonyFactory.connect(colonyAddress, signerOrWallet);
  const oneTxClient = new Contract(
    oneTxExtensionAddress,
    OneTxAbi,
    signerOrWallet,
  );
  try {
    // domains
    for (let domainIndex = 0; domainIndex < domains.length; domainIndex += 1) {
      const [extensionPDID, extensionCSI] = await getMultiPermissionProofs(
        colonyClient,
        signerOrWallet,
        domains[domainIndex].nativeId,
        [ColonyRole.Funding, ColonyRole.Administration],
        oneTxExtensionAddress,
      );

      const [userPDID, userCSI] = await getMultiPermissionProofs(
        colonyClient,
        signerOrWallet,
        domains[domainIndex].nativeId,
        [ColonyRole.Funding, ColonyRole.Administration],
      );

      // users
      for (let userIndex = 0; userIndex < users.length; userIndex += 1) {
        if (users[userIndex]) {
          let amount = BigNumber.from(
            `${randomBetweenNumbers(1, 3)}000000000000000000`,
          );
          if (
            users[userIndex] ===
            utils.getAddress(Object.keys(ganacheAddresses)[0])
          ) {
            amount = BigNumber.from(`50000000000000000000`);
          }

          const params = [
            [users[userIndex]],
            [tokenAddress],
            [amount],
            domains[domainIndex].nativeId,
            /*
             * NOTE Always make the payment in the global skill 0
             * This will make it so that the user only receives reputation in the
             * above domain, but none in the skill itself.
             */
            0,
          ];

          // estimate
          const estimatedGas =
            await oneTxClient.estimateGas.makePaymentFundedFromDomain(
              extensionPDID,
              extensionCSI,
              userPDID,
              userCSI,
              ...params,
            );
          // if we'd like to be fancy, all payments in one domain could
          const oneTxPayment = await oneTxClient.makePaymentFundedFromDomain(
            extensionPDID,
            extensionCSI,
            userPDID,
            userCSI,
            ...params,
            {
              gasLimit: estimatedGas.div(BigNumber.from(10)).add(estimatedGas),
            },
          );
          await delay();
          const oneTxPaymentTransaction = await oneTxPayment.wait();

          const batchKey = 'payment';
          const groupId = nanoid();

          await addTxToDb({
            colonyAddress,
            context: ClientType.OneTxPaymentClient,
            groupId,
            groupIndex: 0,
            groupKey: batchKey,
            hash: oneTxPaymentTransaction.transactionHash,
            methodName: 'makePaymentFundedFromDomain',
            params,
            status: 'SUCCEEDED',
            userAddress: signerOrWallet.address,
          });

          await delay();

          console.log(
            `Paying ${amount
              .div(BigNumber.from(10).pow(18))
              .toString()} tokens from domain "${
              domains[domainIndex].nativeId
            }" to user "${users[userIndex]}" in colony "${colonyName}"`,
          );
        }
      }
    }
  } catch (error) {
    console.log('User Payments');
    console.error(error);
  }
};

const randomBetweenNumbers = (min = 1, max = 10) =>
  Math.floor(Math.random() * (max - min + 1) + min);

async function imageUrlToBase64(url) {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(1000) });

    if (!response.ok) {
      return null;
    }

    const blob = await response.arrayBuffer();

    const contentType = response.headers.get('content-type');

    const base64String = `data:${contentType};base64,${Buffer.from(
      blob,
    ).toString('base64')}`;

    return base64String;
  } catch (err) {
    // console.log(err);
    return null;
  }
}

const toggleRepMining = async () => {
  const response = await fetch(
    'http://localhost:3001/reputation/monitor/toggle',
    { signal: AbortSignal.timeout(3000) },
  );

  if (response.ok) {
    const text = await response.text();
    console.log(text);
    return text.includes('is now on');
  } else {
    console.log('Could not toggle reputation mining');
    return false;
  }
};

const tryFetchGraphqlQuery = async (
  queryOrMutation,
  variables,
  maxRetries = 10,
  blockTime = 5000,
) => {
  let currentTry = 0;
  while (true) {
    const { data } = await graphqlRequestPreconfigured(
      queryOrMutation,
      variables,
    );

    /*
     * @NOTE That this limits to only fetching one operation at a time
     */
    if (data[Object.keys(data)[0]]) {
      return data[Object.keys(data)[0]];
    }

    if (currentTry < maxRetries) {
      await delay(blockTime);
      currentTry += 1;
    } else {
      console.log(data);
      throw new Error('Could not fetch graphql data in time');
    }
  }
};

const createRandomUser = async ({ username, index }) => {
  const avatarURL = `http://xsgames.co/randomusers/assets/avatars/${
    (index + 1) % 2 === 0 ? 'female' : 'male'
  }/${index + 1}.jpg`;
  const avatar = await imageUrlToBase64(avatarURL);
  return createUser({
    username,
    avatar: (index + 1) % 5 === 0 ? null : avatar,
  });
};

const createRandomUsersBatch = async (start, size = 3) => {
  const batch = [];

  for (let index = start; index < start + size; index++) {
    if (index > usersTempData.randomUsernames.length - 1) {
      break;
    }
    batch.push(
      createRandomUser({
        username: usersTempData.randomUsernames[index],
        index,
      }),
    );
  }

  return Promise.all(batch);
};

const createRandomUsersInBatches = async () => {
  const batchSize = 3;
  const randomUsersBatchCount = Math.ceil(
    usersTempData.randomUsernames.length / batchSize,
  );
  const randomUsers = [];

  for (let batchCount = 0; batchCount < randomUsersBatchCount; batchCount++) {
    const randomUsersBatch = await createRandomUsersBatch(
      batchCount * batchSize,
      batchSize,
    );
    randomUsers.push(...randomUsersBatch);
    delay(1000);
  }

  return randomUsers;
};

/*
 * Orchestration
 */
const createUserAndColonyData = async () => {
  let fetchRes = await fetch(`http://localhost:3006/etherrouter-address.json`);
  let fetchResJSON = await fetchRes.json();
  etherRouterAddress = fetchResJSON.etherRouterAddress;

  fetchRes = await fetch(`http://localhost:3006/ganache-accounts.json`);
  fetchResJSON = await fetchRes.json();
  private_keys = fetchResJSON.private_keys;
  ganacheAddresses = fetchResJSON.addresses;

  // TODO: assert the above worked

  const availableUsers = {
    randomUsers: {},
    walletUsers: {},
  };
  const availableColonies = {};
  let reputationMining = false;

  const { leela, amy, fry } = usersTempData;
  const walletUsers = await Promise.all(
    [leela, amy, fry].map((user, index) => createUser(user, index)),
  );

  walletUsers.forEach((user) => {
    availableUsers.walletUsers[user.address] = user;
  });

  const randomUsers = await createRandomUsersInBatches();
  randomUsers.forEach((user) => {
    availableUsers.randomUsers[user.address] = user;
  });

  const leelaWallet =
    availableUsers.walletUsers[
      utils.getAddress(Object.keys(ganacheAddresses)[0])
    ];

  const colonyNetwork = ColonyNetworkFactory.connect(
    etherRouterAddress,
    leelaWallet,
  );

  const currentVersion = await colonyNetwork.getCurrentColonyVersion();

  const colonyNamesToCreate = Object.keys(coloniesTempData).slice(
    0,
    DEFAULT_COLONIES,
  );
  for (let index = 0; index < colonyNamesToCreate.length; index++) {
    const colonyData = coloniesTempData[colonyNamesToCreate[index]];
    colonyData.version = currentVersion.toNumber();
    if (usePreviousColonyVersionArg) {
      // Check version exists...
      const resolver = await colonyNetwork.getColonyVersionResolver(
        colonyData.version - 1,
      );
      if (resolver !== constants.AddressZero) {
        colonyData.version -= 1;
      }
    }

    const {
      colonyAddress: newColonyAddress,
      tokenAddress,
      colonyName,
      oneTxExtensionAddress,
    } = await createColony(colonyData, leelaWallet);
    await delay();

    availableColonies[newColonyAddress] = {
      colonyAddress: newColonyAddress,
      tokenAddress,
      colonyName,
      oneTxExtensionAddress,
    };

    let noOfMembers = randomBetweenNumbers(
      1,
      Object.keys(availableUsers.randomUsers).length - 1 || 1,
    );
    if (colonyName === 'Planet Express') {
      // this is so stupid
      noOfMembers = Object.keys(availableUsers.randomUsers).length - 1 || 1;
    }
    //subscribe random users to this colony
    await Promise.all(
      Object.keys(availableUsers.randomUsers)
        .slice(0, noOfMembers)
        .map(async (userAddress) => {
          await subscribeUserToColony(userAddress, newColonyAddress);
          await delay(100);
        }),
    );

    console.log(
      `Subscribed ${noOfMembers} members to colony ${
        colonyData.colonyDisplayName || colonyData.colonyName
      }`,
    );

    // verify users
    await Promise.all(
      Object.keys(availableUsers.walletUsers).map(async (userAddress) => {
        await graphqlRequestPreconfigured(updateColonyContributor, {
          input: {
            id: `${newColonyAddress}_${userAddress}`,
            isVerified: true,
          },
        });
      }),
    );

    // mint colony tokens
    await mintTokens(newColonyAddress, colonyName, tokenAddress, leelaWallet);

    const { data: colonyDomainsdata } = await graphqlRequestPreconfigured(
      getColonyDomains,
      { address: newColonyAddress },
    );

    const domains =
      colonyDomainsdata?.getColonyByAddress?.items[0]?.domains?.items || [];

    if (domains.length > 1) {
      // transfer funds to domains
      await transferFundsBetweenPots(
        newColonyAddress,
        colonyName,
        tokenAddress,
        domains,
        leelaWallet,
      );
    }

    if (domains.length > 0) {
      const { data: colonyContributorsData } =
        await graphqlRequestPreconfigured(getColonyContributors, {
          address: newColonyAddress,
        });
      const contributors = (
        colonyContributorsData?.listColonyContributors?.items || []
      )
        .map(({ user }) => user?.id)
        .filter((userAddress) => !!userAddress);

      // enable rep mining
      if (!reputationMining) {
        reputationMining = await toggleRepMining();
      }

      // payouts to various users (need to fetch subscribers)
      await userPayments(
        newColonyAddress,
        colonyName,
        oneTxExtensionAddress,
        tokenAddress,
        domains,
        [
          ...Object.keys(availableUsers.walletUsers).map(
            (userAddress) => userAddress,
          ),
          contributors[randomBetweenNumbers(0, contributors.length - 1)],
        ],
        leelaWallet,
      );

      // All other colonies that are not planex
      if (colonyName !== 'Planet Express') {
        const colonies = Object.keys(availableColonies).map(
          (colonyAddress) => availableColonies[colonyAddress],
        );
        const planetExpressColony = colonies.find(
          ({ colonyName }) => colonyName === 'Planet Express',
        );

        // payout to planex
        await userPayments(
          newColonyAddress,
          colonyName,
          oneTxExtensionAddress,
          tokenAddress,
          [{ nativeId: 1 }],
          [planetExpressColony?.colonyAddress],
          leelaWallet,
        );
      }
    }
  }

  const colonies = Object.values(availableColonies);
  const coloniesTokens = colonies
    .map(({ colonyName, tokenAddress }) => {
      if (colonyName !== 'Planet Express') {
        return tokenAddress;
      }
    })
    .filter((value) => !!value);

  const planetExpressColony = colonies.find(
    ({ colonyName }) => colonyName === 'Planet Express',
  );

  //addTokenToColonyTokens
  await Promise.all(
    coloniesTokens.slice(0, 5).map(async (tokenAddress) => {
      addTokenToColonyTokens(planetExpressColony.colonyAddress, tokenAddress);
      await delay();
    }),
  );

  // Create some verified tokens (Acting as stablecoins for local dev)
  const validatedTokensOwner =
    availableUsers.walletUsers[
      utils.getAddress(Object.keys(ganacheAddresses)[0])
    ];
  await createValidatedToken(
    {
      tokenName: 'USDC for Local Development',
      tokenSymbol: 'USDC-L',
      tokenDecimals: 6,
    },
    validatedTokensOwner,
  );
  await createValidatedToken(
    {
      tokenName: 'USDT for Local Development',
      tokenSymbol: 'USDT-L',
      tokenDecimals: 6,
    },
    validatedTokensOwner,
  );
  await createValidatedToken(
    {
      tokenName: 'DAI for Local Development',
      tokenSymbol: 'DAI-L',
      tokenDecimals: 18,
    },
    validatedTokensOwner,
  );

  // mine initial reputation
  await Promise.all(
    colonies.map(async ({ colonyAddress }) => {
      await updateInitialReputation(colonyAddress);
    }),
  );

  if (reputationMining) {
    console.log(
      "Reputation mining should now be disabled. Make sure you check this manually, otherwise you'll get chain time skips",
    );
    console.log();
    console.log('Performing cleanup...');
    await delay(20000);
    // disable rep mining
    toggleRepMining().then(() => process.exit(0));
  }
};

const checkArguments = () => {
  const maxColoniesCount = Object.keys(coloniesTempData).length;

  console.log();
  if (DEFAULT_COLONIES > maxColoniesCount) {
    console.log(`Number of colonies to create is higher than available data.`);
    console.log(
      `Please use --coloniesCount <number> to select a more reasonable number. (Max available colonies: ${maxColoniesCount})`,
    );
    process.exit(0);
  }

  if (DEFAULT_TIMEOUT < 1) {
    console.log(
      `You've chosen to not create any colonies. You must have at least one colony for this script to work properly.`,
    );
    console.log(
      `Please use --coloniesCount <number> to select a more reasonable number. (Max available colonies: ${maxColoniesCount})`,
    );
    process.exit(0);
  }

  console.log(
    `Starting data creation script with ${DEFAULT_COLONIES} colonies and a timeout of ${DEFAULT_TIMEOUT} ms using the ${usePreviousColonyVersionArg ? 'previous' : 'current'} Colony version.`,
  );
  console.log(
    `If you wish to change these values, please pass --coloniesCount <number> and --timeout <number> respectively to this script.`,
  );
  console.log();

  if (!usePreviousColonyVersionArg) {
    console.log(
      `Colonies will be deployed using the current Colony version. To deploy with the previous version pass --usePreviousColonyVersion`,
    );
  }

  console.log(
    `(For this to work, you will need to have already deployed the previous Colony version resolver to the network.)`,
  );
};

const checkNodeVersion = () => {
  const requiredVersion = readFile(
    path.resolve(__dirname, '..', '.nvmrc'),
  ).trim();
  const currentVersion = process.version;
  if (compareVersions(currentVersion, requiredVersion) < 0) {
    console.log();
    console.log(
      `Please use the correct node version when running the CDapp. Anything less than "v${requiredVersion}" and this script won't work properly.`,
    );
    console.log(
      `Current version: ${currentVersion} Required version: v${requiredVersion}`,
    );
    console.log();
    process.exit(0);
  } else {
    console.log();
    console.log(`Using node ${currentVersion}`);
  }
};

const pressKeyToContinue = async () => {
  // Skip confirmation if --yes is passed
  if (yesArg > -1) {
    return Promise.resolve();
  }

  console.log();
  console.log(`Only run this script on blank databases and chain state`);
  console.log(
    'If you believe your dev environment state is not clean, restart your environment and try again',
  );
  console.log(
    `Not doing so, will most likely break your currently running CDapp`,
  );
  console.log(`Press "return" to confirm you understood this!`);
  console.log();

  process.stdin.setRawMode(true);
  return new Promise((resolve) =>
    process.stdin.once('data', () => {
      process.stdin.setRawMode(false);
      resolve();
    }),
  );
};

checkArguments();

checkNodeVersion();

pressKeyToContinue().then(async () => {
  createUserAndColonyData();
});
