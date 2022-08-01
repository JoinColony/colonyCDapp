const { fetch, Request } = require('cross-fetch');

module.exports = {
  output: (...messages) => console.log('[BlockIngestor]', ...messages),
  poorMansGraphQL: async (
    query,
    endpoint = 'http://0.0.0.0:20002/graphql',
    /*
     * @NOTE This is Hardcoded in Amplify
     * It will always be da2-fakeApiId123456
     * https://github.com/aws-amplify/amplify-cli/blob/da712b858873ba90090f7407211ec97ca4991f29/packages/amplify-util-mock/src/CFNParser/resource-processors/appsync.ts#L139
     */
    apiKey = 'da2-fakeApiId123456',
  ) => {
    const options = {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'content-type': 'application/json'
      },
      body: JSON.stringify(query)
    };

    const request = new Request(endpoint, options);
    let statusCode = 200;
    let body;
    let response;

    try {
      response = await fetch(request);
      body = await response.json();
      if (body.errors) statusCode = 400;
    } catch (error) {
      console.log(error)
    }

    if (statusCode === 400) {
      throw new Error(`Query not successful: ${query.operationName}`)
    }

    return {
      statusCode,
      body: JSON.stringify(body)
    };
  },
};
