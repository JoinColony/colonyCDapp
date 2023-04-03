const { graphqlRequest } = require('../../utils');
const {
  getCurrentNetworkInverseFee,
  createCurrentNetworkInverseFee,
  updateCurrentNetworkInverseFee,
} = require('./graphql');

/*
 * @TODO These values need to be imported properly, and differentiate based on environment
 */
const API_KEY = 'da2-fakeApiId123456';
const GRAPHQL_URI = 'http://localhost:20002/graphql';

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  const { inverseFee } = event.arguments?.input || {};

  const getCurrentNetworkInverseFeeData = await graphqlRequest(
    getCurrentNetworkInverseFee,
    {},
    GRAPHQL_URI,
    API_KEY,
  );

  const existingFeeId =
    getCurrentNetworkInverseFeeData?.data?.listCurrentNetworkInverseFees?.items?.[0]?.id;

  if (existingFeeId) {
    const updateCurrentVersionData = await graphqlRequest(
        updateCurrentNetworkInverseFee,
      {
        input: {
          id: existingFeeId,
          inverseFee,
        },
      },
      GRAPHQL_URI,
      API_KEY,
    );

    return !!updateCurrentVersionData;
  }

  const createCurrentVersionData = await graphqlRequest(
    createCurrentNetworkInverseFee,
    {
      input: {
        inverseFee,
      },
    },
    GRAPHQL_URI,
    API_KEY,
  );

  return !!createCurrentVersionData;
};
