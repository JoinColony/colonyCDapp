require('dotenv').config();
const fetch = require('node-fetch');

const apiKey = process.env.AWS_APPSYNC_KEY;
const apiUrl = process.env.AWS_APPSYNC_GRAPHQL_URL;
const colonyId = '0xbd409c4FdcDA391552333Fed2459f884e2C95851';

const createDomainMutation = `
  mutation CreateDomain($input: CreateDomainInput!) {
    createDomain(input: $input) {
      id
    }
  }
`;

const createDomainMetadataMutation = `
  mutation CreateDomainMetadata($input: CreateDomainMetadataInput!) {
    createDomainMetadata(input: $input) {
      id
    }
  }
`;

const domainNames = [
  'Finance',
  'Research',
  'Human Resources',
  'Engineering',
  'Sales',
  'Marketing',
  'Operations',
  'Product Development',
  'Customer Support',
  'Executive',
];

const domainColors = [
  'LIGHT_PINK',
  'BLACK',
  'EMERALD_GREEN',
  'BLUE',
  'YELLOW',
  'RED',
  'GREEN',
  'PERIWINKLE',
  'GOLD',
  'AQUA',
];

const seedDomains = async () => {
  for (let i = 2; i <= 10; i++) {
    const id = `${colonyId}_${i}`;
    const domainInput = {
      id,
      colonyId,
      nativeId: i,
      nativeFundingPotId: i,
      nativeSkillId: i,
      isRoot: false,
      reputation: String(Math.floor(Math.random() * 100_000_000_000)),
    };

    const metadataInput = {
      id,
      name: domainNames[i],
      description: `Description for domain ${i}`,
      color: domainColors[i],
    };

    await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({
        query: createDomainMutation,
        variables: { input: domainInput },
      }),
    });

    console.log(`Inserted domain with ID: ${id}`);

    await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({
        query: createDomainMetadataMutation,
        variables: { input: metadataInput },
      }),
    });

    console.log(`Inserted metadata for domain with ID: ${id}`);
  }
};

seedDomains().catch((error) => console.error(`An error occurred: ${error}`));
