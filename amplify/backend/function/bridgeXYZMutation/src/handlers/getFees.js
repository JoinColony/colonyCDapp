const { v4: uuid } = require('uuid');

const { handleGet } = require('../api/rest/bridge');

const getFeesHandler = async (event) => {
  const { path } = event.arguments?.input || {};

  try {
    const response = await handleGet(path, {
      'Idempotency-Key': uuid(),
    });
    const data = response.data;

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
