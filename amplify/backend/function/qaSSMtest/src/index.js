/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

const AWS_SESSION_TOKEN =  process.env.AWS_SESSION_TOKEN;

const getGraphQLURI = async () => {
  // Retrieve GraphQL URI from Parameter Store
  const res = await fetch(
    `http://localhost:2773/systemsmanager/parameters/get?name=awsAppSyncGraphqlUrlSSM`,
    {
      headers: {
        'X-Aws-Parameters-Secrets-Token': AWS_SESSION_TOKEN,
      },
    },
  );

  const graphQLURI = await res.json();
  return graphQLURI;
};


exports.handler = async () => {
    const graphQLURI = await getGraphQLURI();
    console.log({graphQLURI});
    return null;
};
