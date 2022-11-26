/* eslint-disable @typescript-eslint/no-var-requires */
const { generate } = require('@graphql-codegen/cli');
const {
  buildClientSchema,
  getIntrospectionQuery,
  printSchema,
} = require('graphql');
const fetch = require('node-fetch');

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

  return printSchema(schema);
};

const codegen = async () => {
  try {
    const schema = await fetchSchema();

    const graphqlFiles = './src/graphql/**/*.graphql';

    generate({
      schema,
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
      watch: graphqlFiles,
    });
  } catch {
    console.error('Error when fetching Amplify schema, retrying...');
    setTimeout(codegen, 500);
  }
};

codegen();
