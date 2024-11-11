const { utils, Wallet, providers } = require('ethers');
const { graphqlRequest } = require('./utils/graphqlRequest');
const readline = require('readline');

const {
  ColonyNetworkFactory,
  ColonyFactory,
  getPermissionProofs,
  ColonyRole,
  colonyRoles2Hex,
} = require('@colony/colony-js');

// fetch command line arguments
const timeoutArg = process.argv.indexOf('--timeout');
const timeoutArgValue = process.argv[timeoutArg + 1];

const DEFAULT_TIMEOUT = parseInt(timeoutArgValue, 10) || 300;

const API_KEY = 'da2-fakeApiId123456';
const GRAPHQL_URI =
  process.env.AWS_APPSYNC_GRAPHQL_URL || 'http://localhost:20002/graphql';

const CHAR_LIMITS = {
  USER: {
    MAX_DISPLAYNAME_CHARS: 30,
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

const createContributor = /* GraphQL */ `
  mutation CreateColonyContributor($input: CreateColonyContributorInput!) {
    createColonyContributor(input: $input) {
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

const subscribeUserToColony = async (
  userAddress,
  colonyAddress,
  isVerified = false,
) => {
  // subscribe user to colony
  await graphqlRequestPreconfigured(createContributor, {
    input: {
      colonyAddress,
      colonyReputationPercentage: 0,
      contributorAddress: userAddress,
      isVerified,
      id: `${colonyAddress}_${userAddress}`,
      isWatching: true,
    },
  });
  await delay();

  console.log(
    `Subscribing user { address: "${userAddress}" } to colony's { address: "${colonyAddress}" } watchers`,
  );
};

const createUser = async (displayName, email) => {
  /*
   * @NOTE This could be done "cheaper", but I wanted to make sure the address
   * is proper, so I've instantiated a wallet as well
   */
  const provider = new providers.JsonRpcProvider();

  let userWallet = Wallet.createRandom().connect(provider);

  const userAddress = utils.getAddress(userWallet.address);
  userWallet.address = userAddress;

  displayName = displayName ?? userAddress;
  email = email ?? `${userAddress}@colony.io`;

  try {
    const userQuery = await graphqlRequestPreconfigured(createUniqueUser, {
      input: {
        id: userAddress,
        profile: {
          displayName,
          email,
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

const createRandomUsersBatch = async (
  start,
  size = 3,
  numberOfUsers,
  results,
) => {
  const batch = [];

  for (let index = start; index < start + size; index++) {
    if (index > numberOfUsers - 1) {
      break;
    }

    const userData = results && results[index] ? results[index] : undefined;

    const displayName = userData
      ? `${userData.name.first}-${userData.name.last}`
      : undefined;
    const email = userData ? userData.email : undefined;
    batch.push(createUser(displayName, email));
  }

  return Promise.all(batch);
};

const createRandomUsersInBatches = async (numberOfUsers) => {
  const batchSize = 3;
  const totalBatches = Math.ceil(numberOfUsers / batchSize);
  const randomUsers = [];

  // Can only fetch up to a maximum of 5000 in one request
  const fetchRes = await fetch(
    `https://randomuser.me/api/?results=${numberOfUsers}&inc=name,email`,
  );
  const fetchResJSON = await fetchRes.json();

  const { results } = fetchResJSON;

  for (let batchCount = 0; batchCount < totalBatches; batchCount++) {
    const randomUsersBatch = await createRandomUsersBatch(
      batchCount * batchSize,
      batchSize,
      numberOfUsers,
      results,
    );
    randomUsers.push(...randomUsersBatch);
    delay(1000);
  }

  return randomUsers;
};

const giveUsersPermissions = async (users, colonyAddress, domainRoles) => {
  if (!domainRoles || domainRoles.length === 0) {
    return;
  }

  const provider = new providers.JsonRpcProvider();

  let fetchRes = await fetch(`http://localhost:3006/etherrouter-address.json`);
  let fetchResJSON = await fetchRes.json();
  etherRouterAddress = fetchResJSON.etherRouterAddress;

  fetchRes = await fetch(`http://localhost:3006/ganache-accounts.json`);
  fetchResJSON = await fetchRes.json();
  private_keys = fetchResJSON.private_keys;
  ganacheAddresses = fetchResJSON.addresses;

  const leelaPrivateKey = Object.values(private_keys)[0];
  const leelaWallet = new Wallet(leelaPrivateKey, provider);

  const colonyClient = ColonyFactory.connect(colonyAddress, leelaWallet);
  const colonyNetwork = ColonyNetworkFactory.connect(
    etherRouterAddress,
    leelaWallet,
  );

  for (const { domain, roles } of domainRoles) {
    const [permissionDomainId, childSkillIndex] = await getPermissionProofs(
      colonyNetwork,
      colonyClient,
      domain,
      [ColonyRole.Architecture, ColonyRole.Root],
    );

    for (const user of users) {
      await colonyClient.setUserRoles(
        permissionDomainId,
        childSkillIndex,
        user.address,
        domain,
        colonyRoles2Hex(roles),
      );

      console.log(
        `Set roles for user ${user.address} in domain ${domain} with roles ${roles}`,
      );

      await delay();
    }
  }
};

const createUsersAndSubscribeToColony = async (
  numberOfUsers,
  colonyAddress,
  isVerified,
  domainRoles,
) => {
  const randomUsers = await createRandomUsersInBatches(numberOfUsers);

  await Promise.all(
    randomUsers.map(async ({ address: userAddress }) => {
      await subscribeUserToColony(userAddress, colonyAddress, isVerified);
      await delay(100);
    }),
  );

  console.log(
    `Subscribed ${randomUsers.length} members to colony ${colonyAddress}`,
  );

  giveUsersPermissions(randomUsers, colonyAddress, domainRoles);
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to prompt for any input
function promptQuestion(question) {
  return new Promise((resolve) => {
    rl.question(`${question}: `, (answer) => {
      resolve(answer.trim());
    });
  });
}

// Function to prompt for roles for a specific domain and validate the response
async function promptRolesForDomain(domain) {
  const isRootDomain = domain === '1';
  const validRoles = isRootDomain
    ? ['0', '1', '2', '3', '5', '6']
    : ['2', '3', '5', '6'];

  while (true) {
    const rolesInput = await promptQuestion(
      isRootDomain
        ? `Enter a comma-separated list of roles for domain ${domain} (valid roles: 0,1,2,3,5,6 where 0: Recovery, 1: Root, 2: Arbitration, 3: Architecture, 5: Funding, 6: Administration)`
        : `Enter a comma-separated list of roles for domain ${domain} (valid roles: 2,3,5,6 where 2: Arbitration, 3: Architecture, 5: Funding, 6: Administration)`,
    );

    // Split and validate the roles input
    const roles = rolesInput.split(',').map((role) => role.trim());
    if (roles.every((role) => validRoles.includes(role))) {
      return roles.map(Number); // Convert to numbers and return
    } else {
      console.error(
        isRootDomain
          ? 'Error: Please enter only valid role numbers (0,1,2,3,5,6).'
          : 'Error: Please enter only valid role numbers (2,3,5,6).',
      );
      process.exit(1);
    }
  }
}

// Function to validate the inputs
async function getArguments() {
  try {
    // Prompt for number of users
    const numberOfUsers = await promptQuestion(
      'Please enter a number of users',
    );
    if (isNaN(numberOfUsers) || Number(numberOfUsers) <= 0) {
      console.error('Error: Please enter a valid number greater than 0.');
      process.exit(1);
    }

    // Prompt for colony address
    const colonyAddress = await promptQuestion('Please enter a colony address');
    if (colonyAddress.length === 0) {
      console.error('Error: Colony address cannot be empty.');
      process.exit(1);
    }

    // Prompt for user permissions
    const verifyUsersResponse = await promptQuestion(
      'Do you want to verify these users? Y/N',
    );

    if (!['Y', 'N'].includes(verifyUsersResponse.toUpperCase())) {
      console.error("Error: Please enter 'Y' or 'N'.");
      process.exit(1);
    }

    const verifyUsers = verifyUsersResponse.toUpperCase() === 'Y';

    // Prompt for user permissions
    const setUserPermissions = await promptQuestion(
      'Do you want to set user permissions? Y/N',
    );
    if (!['Y', 'N'].includes(setUserPermissions.toUpperCase())) {
      console.error("Error: Please enter 'Y' or 'N'.");
      process.exit(1);
    }

    if (setUserPermissions.toUpperCase() === 'N') {
      createUsersAndSubscribeToColony(
        numberOfUsers,
        colonyAddress,
        verifyUsers,
      );
      return;
    }

    // Prompt for domain list
    const domainList = await promptQuestion(
      'Enter a comma-separated list of domains you wish to assign user roles in, e.g., 1,2,3,6 where 1 is the root domain',
    );

    // Validate domain list
    const domains = domainList.split(',').map((domain) => domain.trim());
    if (!domains.every((domain) => !isNaN(domain) && Number(domain) > 0)) {
      console.error(
        'Error: Please enter a valid comma-separated list of positive numbers.',
      );
      process.exit(1);
    }

    // Array to store each domain and its associated roles
    const domainRoles = [];

    // Loop over each domain to prompt for roles
    for (const domain of domains) {
      const roles = await promptRolesForDomain(domain);
      domainRoles.push({ domain: Number(domain), roles });
    }

    createUsersAndSubscribeToColony(
      numberOfUsers,
      colonyAddress,
      verifyUsers,
      domainRoles,
    );
  } finally {
    rl.close();
  }
}

getArguments();
