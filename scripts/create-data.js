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
} = require('@colony/colony-js');
const { abi: OneTxAbi } = require('@colony/abis/versions/glwss4/OneTxPayment');
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

/*
 * User
 */
const subscribeUserToColony = async (userAddress, colonyAddress) => {
  // subscribe user to colony
  await graphqlRequest(
    createContributor,
    {
      input: {
        colonyAddress,
        colonyReputationPercentage: 0,
        contributorAddress: userAddress,
        isVerified: true, // !!
        id: `${colonyAddress}_${userAddress}`,
        isWatching: true,
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
      metadata.bio = description;
    }

    if (website) {
      metadata.website = website;
    }

    if (location) {
      metadata.location = location;
    }

    const userQuery = await graphqlRequest(
      createUniqueUser,
      {
        input: {
          id: userAddress,
          profile: {
            displayName: username,
            email: `${username}@colony.io`,
            ...metadata,
          },
        },
      },
      GRAPHQL_URI,
      API_KEY,
    );
    await delay();

    if (userQuery?.errors) {
      console.log(
        'USER COULD NOT BE CREATED.',
        userQuery.errors[0].message,
        JSON.stringify(userQuery.errors),
      );
    } else {
      console.log(
        `Creating user { walletAddress: "${userAddress}", profile: { displayName: "${username}", email: "${username}@colony.io" } }`,
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

const addTokenToDB = async (tokenAddress, avatar) => {
  // create token entry in the db
  await graphqlRequest(
    getTokenFromEverywhere,
    {
      input: {
        tokenAddress,
        avatar: avatar || null,
        thumbnail: avatar || null,
      },
    },
    GRAPHQL_URI,
    API_KEY,
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
  delay();
  await mintTokens.wait();
  delay();

  // claim
  const claimColonyFunds = await colonyClient.claimColonyFunds(tokenAddress);
  delay();
  await claimColonyFunds.wait();
  delay();

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
    colonyObjective = {},
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

  const currentNetworkVersion = await colonyNetwork.getCurrentColonyVersion();

  const colonyDeployment = await colonyNetwork['createColonyForFrontend'](
    constants.AddressZero,
    tokenName,
    tokenSymbol,
    tokenDecimals,
    currentNetworkVersion,
    '', // no point in storing ens name on the chain
    '',
  );
  await delay();

  const colonyDeploymentTransaction = await colonyDeployment.wait();
  await delay();

  const createColonyEvent = colonyDeploymentTransaction.events.find(
    (event) => !!event?.args?.colonyAddress,
  );
  const createTokenAuthorityEvent = colonyDeploymentTransaction.events.find(
    (event) => !!event?.args?.tokenAuthorityAddress,
  );
  const { transactionHash } = colonyDeploymentTransaction;

  const colonyAddress = utils.getAddress(createColonyEvent.args.colonyAddress);
  const tokenAddress = utils.getAddress(createColonyEvent.args.token);
  const tokenAuthorityAddress = utils.getAddress(
    createTokenAuthorityEvent.args.tokenAuthorityAddress,
  );

  // create the colony
  const colonyQuery = await graphqlRequest(
    createColonyEtherealMetadata,
    {
      input: {
        colonyName,
        colonyDisplayName:
          colonyDisplayName || `Colony ${colonyName.toUpperCase()}`,
        tokenAvatar,
        tokenThumbnail: tokenAvatar,
        initiatorAddress: utils.getAddress(signerOrWallet.address),
        transactionHash,
        inviteCode: 'dev',
      },
    },
    GRAPHQL_URI,
    API_KEY,
  );

  await delay();

  if (colonyQuery?.errors) {
    console.log('COLONY COULD NOT BE CREATED.', colonyQuery.errors[0].message);
  } else {
    console.log(
      `Creating colony { name: "${colonyName}", colonyAddress: "${colonyAddress}", nativeToken: "${tokenAddress}", version: "${currentNetworkVersion.toString()}" }`,
    );
  }

  const colonyClient = ColonyFactory.connect(colonyAddress, signerOrWallet);
  const tokenClient = ColonyTokenFactory.connect(tokenAddress, signerOrWallet);

  const metadata = {
    isWhitelistActivated: false,
  };
  if (colonyDescription) {
    metadata.description = colonyDescription;
  }
  if (colonyAvatar) {
    metadata.avatar = colonyAvatar;
    metadata.thumbnail = colonyAvatar;
  }
  if (colonySocialLinks && colonySocialLinks.length) {
    metadata.externalLinks = colonySocialLinks;
  }
  if (colonyObjective?.title && colonyObjective?.description) {
    metadata.objective = colonyObjective;
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
  const metadataMutation = await graphqlRequest(
    updateColonyMetadata,
    {
      input: {
        id: utils.getAddress(colonyAddress),
        ...metadata,
      },
    },
    GRAPHQL_URI,
    API_KEY,
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
      // estimate
      const estimateGas = await colonyClient.estimateGas[
        'addDomain(uint256,uint256,uint256)'
      ](permissionDomainId, childSkillIndex, 1);
      // transactions
      const subdomainDeployment = await colonyClient[
        'addDomain(uint256,uint256,uint256)'
      ](permissionDomainId, childSkillIndex, 1, {
        gasLimit: estimateGas.div(BigNumber.from(10)).add(estimateGas),
      });
      await delay();
      // receipt events
      const subdomainTransactions = await subdomainDeployment.wait();
      await delay();
      const {
        args: { domainId: subdomainId },
      } = subdomainTransactions.events.find((event) => !!event?.args?.domainId);

      console.log('new domain', subdomainId.toString());

      const domainColor =
        domains[index].color ||
        DOMAIN_COLORS[randomBetweenNumbers(0, DOMAIN_COLORS.length - 1)] ||
        'LIGHT_PINK';

      const domainMetadataMutation = await graphqlRequest(
        createDomainMetadata,
        {
          input: {
            id: `${utils.getAddress(colonyAddress)}_${subdomainId.toString()}`,
            name: domains[index].name || `Team #${subdomainId.toString()}`,
            color: domainColor,
            description: domains[index].description || '',
          },
        },
        GRAPHQL_URI,
        API_KEY,
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

  // set authority
  const setAuthority = await tokenClient.setAuthority(tokenAuthorityAddress);
  await delay();
  await setAuthority.wait();
  await delay();

  // set owner
  const setOwner = await tokenClient.setOwner(colonyAddress);
  await delay();
  await setOwner.wait();
  await delay();

  // deploy one tx
  const oneTxHash = getExtensionHash('OneTxPayment');
  const { data: currentVersionData } = await graphqlRequest(
    getCurrentVersion,
    {
      key: oneTxHash,
    },
    GRAPHQL_URI,
    API_KEY,
  );
  const latestOneTxVersion =
    currentVersionData?.getCurrentVersionByKey?.items[0]?.version || 1;

  const deployOneTx = await colonyClient.installExtension(
    oneTxHash,
    latestOneTxVersion,
  );
  await delay();
  await deployOneTx.wait();
  await delay(1000);

  // give one tx permissions
  const oneTxExtensionAddress = await poll(
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
  );

  console.log(
    `Installed OneTxPayment extension in colony ${
      colonyDisplayName || colonyName
    } at address ${oneTxExtensionAddress}`,
  );

  const [permissionDomainId, childSkillIndex] = await getPermissionProofs(
    colonyNetwork,
    colonyClient,
    1,
    [ColonyRole.Architecture, ColonyRole.Root],
  );

  const oneTxPermissions = await colonyClient.setUserRoles(
    permissionDomainId,
    childSkillIndex,
    oneTxExtensionAddress,
    1,
    colonyRoles2Hex([
      ColonyRole.Administration,
      ColonyRole.Funding,
      ColonyRole.Arbitration,
    ]),
  );
  await delay();
  await oneTxPermissions.wait();
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

      const estimatedGas = await colonyClient.estimateGas[
        'moveFundsBetweenPots(uint256,uint256,uint256,uint256,uint256,uint256,address)'
      ](
        permissionDomainId,
        fromChildSkillIndex,
        toChildSkillIndex,
        rootDomain.nativeFundingPotId,
        domainsWithoutRoot[index].nativeFundingPotId,
        amount,
        tokenAddress,
      );

      const transferFunds = await colonyClient[
        'moveFundsBetweenPots(uint256,uint256,uint256,uint256,uint256,uint256,address)'
      ](
        permissionDomainId,
        fromChildSkillIndex,
        toChildSkillIndex,
        rootDomain.nativeFundingPotId,
        domainsWithoutRoot[index].nativeFundingPotId,
        amount,
        tokenAddress,
        { gasLimit: estimatedGas.div(BigNumber.from(10)).add(estimatedGas) },
      );
      delay();
      await transferFunds.wait();
      delay();

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

          // estimate
          const estimatedGas =
            await oneTxClient.estimateGas.makePaymentFundedFromDomain(
              extensionPDID,
              extensionCSI,
              userPDID,
              userCSI,
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
            );
          // if we'd like to be fancy, all payments in one domain could
          const oneTxPayment = await oneTxClient.makePaymentFundedFromDomain(
            extensionPDID,
            extensionCSI,
            userPDID,
            userCSI,
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
            {
              gasLimit: estimatedGas.div(BigNumber.from(10)).add(estimatedGas),
            },
          );
          delay();
          await oneTxPayment.wait();
          delay();

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
    const { data } = await graphqlRequest(
      queryOrMutation,
      variables,
      GRAPHQL_URI,
      API_KEY,
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
  await Promise.all(
    [leela, amy, fry].map(async (user, index) => {
      const newUser = await createUser(user, index);
      availableUsers.walletUsers[newUser.address] = newUser;
      delay(100);
    }),
  );

  await Promise.all(
    usersTempData.randomUsernames.map(async (username, index) => {
      const avatarURL = `http://xsgames.co/randomusers/assets/avatars/${
        (index + 1) % 2 === 0 ? 'female' : 'male'
      }/${index + 1}.jpg`;
      const avatar = await imageUrlToBase64(avatarURL);
      const user = await createUser({
        username,
        avatar: (index + 1) % 5 === 0 ? null : avatar,
      });
      availableUsers.randomUsers[user.address] = user;
      delay(100);
    }),
  );

  const colonyNamesToCreate = Object.keys(coloniesTempData).slice(
    0,
    DEFAULT_COLONIES,
  );
  for (let index = 0; index < colonyNamesToCreate.length; index++) {
    const colonyData = coloniesTempData[colonyNamesToCreate[index]];

    const leela =
      availableUsers.walletUsers[
        utils.getAddress(Object.keys(ganacheAddresses)[0])
      ];
    const {
      colonyAddress: newColonyAddress,
      tokenAddress,
      colonyName,
      oneTxExtensionAddress,
    } = await createColony(
      colonyData,
      availableUsers.walletUsers[leela.address],
    );
    delay();

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
          delay(100);
        }),
    );

    console.log(
      `Subscribed ${noOfMembers} members to colony ${
        colonyData.colonyDisplayName || colonyData.colonyName
      }`,
    );

    // verify users
    await graphqlRequest(
      updateColonyMetadata,
      {
        input: {
          id: newColonyAddress,
          isWhitelistActivated: true,
          whitelistedAddresses: Object.keys(availableUsers.randomUsers).slice(
            0,
            noOfMembers,
          ),
        },
      },
      GRAPHQL_URI,
      API_KEY,
    );

    // mint colony tokens
    await mintTokens(
      newColonyAddress,
      colonyName,
      tokenAddress,
      availableUsers.walletUsers[leela.address],
    );

    const { data: colonyDomainsdata } = await graphqlRequest(
      getColonyDomains,
      { address: newColonyAddress },
      GRAPHQL_URI,
      API_KEY,
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
        availableUsers.walletUsers[leela.address],
      );
    }

    if (domains.length > 0) {
      const { data: colonyContributorsData } = await graphqlRequest(
        getColonyContributors,
        { address: newColonyAddress },
        GRAPHQL_URI,
        API_KEY,
      );
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
        availableUsers.walletUsers[leela.address],
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
          availableUsers.walletUsers[leela.address],
        );
      }
    }
  }

  const colonies = Object.keys(availableColonies).map(
    (colonyAddress) => availableColonies[colonyAddress],
  );
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
      delay();
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
    `Starting data creation script with ${DEFAULT_COLONIES} colonies and a timeout of ${DEFAULT_TIMEOUT} ms.`,
  );
  console.log(
    `If you wish to change these values, please pass --coloniesCount <number> and --timeout <number> respectively to this script.`,
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
