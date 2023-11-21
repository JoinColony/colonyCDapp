/* eslint-disable @typescript-eslint/no-var-requires */

const { writeFileSync } = require('fs');
const { generate } = require('@graphql-codegen/cli');
const {
  buildClientSchema,
  getIntrospectionQuery,
  printSchema,
} = require('graphql');
const fetch = require('node-fetch');

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

    const graphqlFiles = './src/graphql/**/*.graphql';

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
  } catch (error) {
    console.error('Error when generating types: ', error);
  }
};

codegen();
