/**
 */
exports.handler = async (event) => {
  console.log('Authorizer Lambda called:', JSON.stringify(event, null, 2));

  try {
    const authorizationHeader = event.request.headers.authorization || '';

    console.log('Authorization header:', authorizationHeader);

    // if (!authorizationHeader) {
    //   throw new Error('Missing header');
    // }

    // /**
    //  * @TODO Add actual SIWE logic in here
    //  */

    return {
      isAuthorized: true,
      deniedFields: [],
      resolverContext: {
        context: true,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      isAuthorized: false,
    };
  }
};
