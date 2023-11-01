const fetch = require('node-fetch');
require('dotenv').config();

const AWS_APPSYNC_GRAPHQL_URL = process.env.AWS_APPSYNC_GRAPHQL_URL;
const API_KEY = process.env.AWS_APPSYNC_KEY;

const updateColonyVersion = {
  query: `
              mutation UpdateColonyVersion {
                  updateColony(input: {
                      id: "0xE1B444afa740AdB073991695Cb9002C1685523d8",
                      version: 1
                  }) {
                      id
                  }
              }
          `,
};

postRequest(updateColonyVersion)
  .then(() => 'sucess')
  .catch((e) => console.log(e));

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
