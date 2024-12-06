const { getGatewayFee } = require('../api/rest/bridge');

const getGatewayFeeHandler = async () => {
  try {
    const data = await getGatewayFee();

    if (!data.default_liquidation_address_fee_percent) {
      throw new Error('No default_liquidation_address_fee_percent returned');
    } else {
      return {
        transactionFeePercentage: parseFloat(
          data.default_liquidation_address_fee_percent,
        ),
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
