const fetch = require('node-fetch');
require('dotenv').config();

const d = new Date();
d.setFullYear(d.getFullYear() - 1);

const AWS_APPSYNC_GRAPHQL_URL = process.env.AWS_APPSYNC_GRAPHQL_URL;
const API_KEY = process.env.AWS_APPSYNC_KEY;

const updateProfile = {
  query: `
              mutation UpdateProfile {
                  updateProfile(input: {
                      id: "0x7ABf6f487428e3018248A7D51228Ae3A55949d6B",
                      displayNameChanged: "${d.toISOString()}"
                  }) {
                      id
                  }
              }
          `,
};

postRequest(updateProfile)
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
