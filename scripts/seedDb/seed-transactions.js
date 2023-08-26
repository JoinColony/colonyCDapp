const fetch = require('node-fetch');

require('dotenv').config();

const AWS_APPSYNC_GRAPHQL_URL = process.env.AWS_APPSYNC_GRAPHQL_URL;
const API_KEY = process.env.AWS_APPSYNC_KEY;

async function postRequest(body) {
  const headers = {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY,
  };

  const response = await fetch(AWS_APPSYNC_GRAPHQL_URL, {
    method: 'POST',
    body: JSON.stringify(body),
    headers,
  });

  const { data, errors } = await response.json();
  if (errors) {
    console.error(`error:`, JSON.stringify(errors));
    throw new Error('Failed to seed record:', errors);
  } else {
    console.log('Successfully seeded record', JSON.stringify(data));
  }
}

const MUTATION = `
mutation CreateTransaction($input: CreateTransactionInput!) {
  createTransaction(input: $input) {
    id
  }
}
`;

const ClientType = [
  'CoinMachineClient',
  'ColonyClient',
  'EvaluatedExpenditureClient',
  'FundingQueueClient',
  'MotionTargetClient',
  'NetworkClient',
  'OneTxPaymentClient',
  'ReputationBootstrapperClient',
  'StakedExpenditureClient',
  'StreamingPaymentsClient',
  'TokenSupplierClient',
  'TokenClient',
  'TokenLockingClient',
  'VotingReputationClient',
  'WhitelistClient',
  'WrappedTokenClient',
  'VestingSimpleClient',
  'LightTokenClient',
];

const TransactionStatus = [
  'CREATED',
  'READY',
  'PENDING',
  'FAILED',
  'SUCCEEDED',
];

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const methods = ['mintTokens', 'setUserRoles', 'claimColonyFunds'];

async function seedTransactions() {
  await Promise.all(
    Array.from({ length: 100 })
      .fill(0)
      .map((_, idx) => {
        const body = {
          query: MUTATION,
          variables: {
            input: {
              context: getRandomElement(ClientType),
              createdAt: new Date().toISOString(),
              groupId: `bingbang-${idx}`,
              group: {
                id: `bingbang-${idx}`,
                key: `bingbang-key-${idx}`,
                index: 0,
                title: JSON.stringify({
                  id: 'transaction.ColonyClient.exitRecoveryMode.title',
                }),
                description: JSON.stringify({
                  id: 'transaction.ColonyClient.exitRecoveryMode.description',
                }),
              },
              from: '0xb77D57F4959eAfA0339424b83FcFaf9c15407461',
              colonyAddress: '0x839754f237472999a85037d9a17C4C34CBCa9037',
              methodName: getRandomElement(methods),
              status: getRandomElement(TransactionStatus),
              metatransaction: false,
              title: JSON.stringify({
                id: 'transaction.ColonyClient.exitRecoveryMode.title',
              }),
            },
          },
        };
        return postRequest(body);
      }),
  );
}

seedTransactions().catch((err) => console.error(err));
