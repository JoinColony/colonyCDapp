const { default: fetch } = require('node-fetch');

const AWS_SESSION_TOKEN =  process.env.AWS_SESSION_TOKEN;
const ENV = process.env.ENV;

const getGraphQLURI = async () => {
  // Retrieve GraphQL URI from Parameter Store
  const graphQLParamName = `%2Famplify%2Fcdapp%2F${ENV}%2Faws_appsync_graphql_url`;
  const res = await fetch(
    `http://localhost:2773/systemsmanager/parameters/get?name=${graphQLParamName}`,
    {
      headers: {
        'X-Aws-Parameters-Secrets-Token': AWS_SESSION_TOKEN,
      },
    },
  );
  const graphQLURI = await res.json();
  const {
    Parameter: { Value },
  } = graphQLURI;
  return Value;
};

module.exports = {
  getGraphQLURI,
};
