/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);

  return [
    {
      tokenAddress: '0x6b175474e89094c44da98b954eedeac495271d0f',
      amount: '1000',
    },
  ];
};
