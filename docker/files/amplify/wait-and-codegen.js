/* eslint-disable @typescript-eslint/no-var-requires */
const waitOn = require('wait-on');
const { execSync } = require('child_process');

const waitAndCodegen = async () => {
  await waitOn({
    resources: ['tcp:20002'],
  });

  // add an extra 10 s delay for amplify to create the DB tables
  await new Promise((resolve) => {
    setTimeout(resolve, 10000);
  });

  execSync(
    'npx graphql-codegen --watch "/colonyCDapp/src/graphql/**/*.graphql"',
    {
      stdio: 'inherit',
    },
  );
};

waitAndCodegen();
