const crypto = require('crypto');
const fetch = require('node-fetch');
require('dotenv').config();

function generateRandomEVMAddress() {
  return '0x' + crypto.randomBytes(20).toString('hex');
}

async function postRequest(body) {
  const headers = {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY,
  };

  const response = await fetch(AWS_APPSYNC_GRAPHQL_URL, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: headers,
  });

  const { errors } = await response.json();
  if (errors) {
    console.error(`error:`, JSON.stringify(errors));
    throw new Error('Failed to seed record:', errors);
  } else {
    console.log('Successfully seeded record');
  }
}

const TOTAL_COLONY_REP = Math.pow(2, 40);

function getRepDistribution(members = 100) {
  const repDistribution = Array.from({ length: members }).fill(0);
  let total = 100;
  const MAX = 5;

  for (let i = 0; i < repDistribution.length; i++) {
    const limit = Math.min(MAX, total);
    const rep = Number((Math.random() * (limit + 1)).toFixed(2));
    repDistribution[i] = rep;
    total -= rep;
  }

  return repDistribution.sort((a, b) => b - a);
}

const contributorAddressList = [];

const christianNames = [
  'James',
  'Mary',
  'John',
  'Elizabeth',
  'Matthew',
  'Sarah',
  'Paul',
  'Rebecca',
  'Peter',
  'Martha',
  'Andrew',
  'Rachel',
  'Philip',
  'Lydia',
  'Thomas',
];

const userTemplate = ({ contributorAddress }) => {
  const name =
    christianNames[Math.floor(christianNames.length * Math.random())];
  return {
    query: `
                mutation AddUser {
                    createUser(input: {
                        id: "${contributorAddress}",
                        name: "${name}",
                    }) {
                        id
                    }
                }
            `,
  };
};

const colonyContributorTemplate = ({
  contributorAddress,
  type,
  isVerified,
  hasReputation,
  hasPermissions,
  isWatching,
  colonyAddress,
  colonyReputationPercentage,
}) => ({
  query: `
              mutation AddContributor {
                  createColonyContributor(input: {
                      id: "${colonyAddress}_${contributorAddress}",
                      contributorAddress: "${contributorAddress}",
                      type: ${type},
                      isVerified: ${isVerified},
                      hasReputation: ${hasReputation},
                      hasPermissions: ${hasPermissions},
                      isWatching: ${isWatching},
                      colonyReputationPercentage: ${colonyReputationPercentage},
                      colonyAddress: "${colonyAddress}",
                  }) {
                      id
                  }
              }
          `,
});

const contributorReputationTemplate = ({
  contributorAddress,
  colonyAddress,
  repPercent,
}) => ({
  query: `mutation CreateContributorReputation {
            createContributorReputation(input: {
                id: "${colonyAddress}_1_${contributorAddress}",
                contributorAddress: "${contributorAddress}",
                colonyAddress: "${colonyAddress}",
                domainId: "${colonyAddress}_1",
                reputationRaw: "${repPercent * TOTAL_COLONY_REP}",
                reputationPercentage: ${repPercent},
            }) {
                id
            }
        }`,
});

const colonyRoleTemplate = ({ contributorAddress, colonyAddress, roles }) => ({
  query: `mutation CreateColonyRole {
              createColonyRole(input: {
                  id: "${colonyAddress}_1_${contributorAddress}",
                  domainId: "${colonyAddress}_1",
                  targetAddress: "${contributorAddress}",
                  colonyAddress: "${colonyAddress}",
                  latestBlock: 1,
                  role_0: ${roles[0]},
                  role_1: ${roles[1]},
                  role_2: ${roles[2]},
                  role_3: ${roles[3]},
                  role_5: ${roles[4]},
                  role_6: ${roles[5]},
              }) {
                  id
              }
          }`,
});

const getType = (idx) => {
  if (idx < 20) {
    return 'TOP';
  }

  if (idx < 40) {
    return 'DEDICATED';
  }

  if (idx < 60) {
    return 'ACTIVE';
  }

  if (idx < 80) {
    return 'NEW';
  }

  return 'GENERAL';
};

function generateRecords(numRecords = 100) {
  const mockData = [];
  const membersRep = getRepDistribution(numRecords);

  // Base address
  const COLONY_ADDRESS = process.argv[2];

  for (let i = 0; i < numRecords; i++) {
    const roles = Array.from({ length: 6 })
      .fill(false)
      .map(() => Math.random() >= 0.5);

    const contributorAddress = generateRandomEVMAddress();
    contributorAddressList.push(contributorAddress);
    const idString = `${COLONY_ADDRESS}_${contributorAddress}`;
    const contributorType = getType(i);
    const colonyRepPercentage = membersRep[i];
    const isVerified = Math.random() >= 0.5;
    const isWatching = Math.random() >= 0.5;

    const colonyContributor = {
      id: idString,
      contributorAddress: contributorAddress,
      type: contributorType,
      isVerified,
      hasReputation: colonyRepPercentage > 0,
      hasPermissions: roles.some((role) => !!role),
      isWatching,
      colonyReputationPercentage: colonyRepPercentage,
      colonyAddress: COLONY_ADDRESS,
    };

    const user = {
      contributorAddress,
    };

    const contributorReputation = {
      contributorAddress,
      colonyAddress: COLONY_ADDRESS,
      repPercent: colonyRepPercentage,
    };

    const colonyRole = {
      contributorAddress,
      colonyAddress: COLONY_ADDRESS,
      roles,
    };

    mockData.push({
      colonyContributor,
      user,
      contributorReputation,
      colonyRole,
    });
  }

  return mockData;
}

const NUM_RECORDS = process.argv[3];

// Generate and log the mock data
const data = generateRecords(Number(NUM_RECORDS));

console.log(`Creating ${data.length} records`);

const AWS_APPSYNC_GRAPHQL_URL = process.env.AWS_APPSYNC_GRAPHQL_URL;
const API_KEY = process.env.AWS_APPSYNC_KEY;

async function seedDatabase() {
  await Promise.all(
    data.map(
      async ({
        user,
        colonyContributor,
        contributorReputation,
        colonyRole,
      }) => {
        await postRequest(userTemplate(user));
        await postRequest(colonyContributorTemplate(colonyContributor));
        await postRequest(contributorReputationTemplate(contributorReputation));
        await postRequest(colonyRoleTemplate(colonyRole));
      },
    ),
  );
}

seedDatabase().catch((error) =>
  console.error('Error seeding database:', error),
);
