const fetch = require('cross-fetch');
const { v4: uuid } = require('uuid');

const getGatewayFeeHandler = async (_, { apiKey, apiUrl }) => {
  try {
    const res = await fetch(`${apiUrl}/v0/developer/fees`, {
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': apiKey,
      },
    });

    const data = await res.json();

    if (!data.default_liquidation_address_fee_percent) {
      throw new Error('No default_liquidation_address_fee_percent returned');
    } else {
      return {
        transactionFeePercentage: parseFloat(data.default_liquidation_address_fee_percent),
        success: true,
      };
    }
  } catch (e) {
    console.error(e);
    return undefined;
  }
};

module.exports = {
    getGatewayFeeHandler,
};
