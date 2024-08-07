const fetch = require('cross-fetch');
const { v4: uuid } = require('uuid');

const getFeesHandler = async (event, { apiKey, apiUrl }) => {
  const { path } = event.arguments?.input || {};

  try {
    const res = await fetch(`${apiUrl}/${path}`, {
      headers: {
        'Content-Type': 'application/json',
        'Idempotency-Key': uuid(),
        'Api-Key': apiKey,
      },
    });

    const data = await res.json();

    if (!data.default_liquidation_address_fee_percent) {
      throw new Error('No default_liquidation_address_fee_percent returned');
    } else {
      return {
        transactionFee: data.default_liquidation_address_fee_percent,
        success: true,
      };
    }
  } catch (e) {
    console.error(e);
    return undefined;
  }
};

module.exports = {
  getFeesHandler,
};
