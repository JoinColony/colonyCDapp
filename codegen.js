/* eslint-disable @typescript-eslint/no-var-requires */

const { writeFileSync } = require('fs');
const { generate } = require('@graphql-codegen/cli');
const {
  buildClientSchema,
  getIntrospectionQuery,
  printSchema,
} = require('graphql');
const fetch = require('node-fetch');
const http = require('http');

const SCHEMA_LOCATION = './tmp-schema.graphql';

const fetchSchema = async () => {
  const response = await fetch('http://localhost:20002/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': 'da2-fakeApiId123456',
    },
    body: JSON.stringify({ query: getIntrospectionQuery() }),
  });
  const data = await response.json();
  const schema = buildClientSchema(data.data);

  writeFileSync(SCHEMA_LOCATION, printSchema(schema));
};

const codegen = async () => {
  try {
    await fetchSchema();

    const graphqlFiles = ['./src/graphql/**/*.graphql'];

    generate({
      schema: SCHEMA_LOCATION,
      documents: graphqlFiles,
      generates: {
        './src/graphql/generated.ts': {
          plugins: [
            'typescript',
            'typescript-operations',
            'typescript-react-apollo',
          ],
        },
      },
      config: {
        scalars: {
          AWSDateTime: 'string',
          AWSEmail: 'string',
          AWSURL: 'string',
          AWSTimestamp: 'number',
        },
      },
      watch: graphqlFiles,
    });
  } catch {
    console.error('Error when fetching Amplify schema, retrying...');
    setTimeout(codegen, 5000);
  }
};

const SERVICE_PORT = 20002;

function isServiceResponsive(callback) {
  http
    .get(`http://localhost:${SERVICE_PORT}`, (res) => {
      if (res.statusCode === 200) {
        callback(true);
      } else {
        callback(false);
      }
    })
    .on('error', (err) => {
      callback(false);
    });
}

function waitForServiceToBeResponsive(callback) {
  isServiceResponsive((isResponsive) => {
    if (isResponsive) {
      callback();
    } else {
      setTimeout(() => {
        waitForServiceToBeResponsive(callback);
      }, 1000); // Check every second
    }
  });
}

waitForServiceToBeResponsive(codegen);
