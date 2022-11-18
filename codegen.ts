import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: [
    {
      'http://localhost:20002/graphql': {
        headers: {
          'x-api-key': 'da2-fakeApiId123456',
        },
      },
    },
  ],
  documents: './src/graphql/**/*.graphql',
  generates: {
    './src/graphql/generated.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-apollo',
      ],
    },
  },
};

export default config;
