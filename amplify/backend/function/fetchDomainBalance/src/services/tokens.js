const { BigNumber } = require('ethers');
const { getStartOfDayFor } = require('../utils');

const getConvertedTokenAmount = (
  amount,
  networkFee,
  decimals,
  exchangeRate,
) => {
  const tokenScaleFactor = BigNumber.from(10).pow(decimals);
  const exchangeRateDecimals = 9;
  const normalizedTokenExchangeRate = BigNumber.from(
    Math.round(exchangeRate * Math.pow(10, exchangeRateDecimals)),
  );
  const formattedNetworkFee = BigNumber.from(networkFee || 0);

  return BigNumber.from(amount)
    .add(formattedNetworkFee)
    .div(tokenScaleFactor)
    .mul(normalizedTokenExchangeRate)
    .div(BigNumber.from(10).pow(exchangeRateDecimals));
};

const getTotalFiatAmountFor = async (items, exchangeRates) => {
  let totalAmount = BigNumber.from(0);
  for (let item of items) {
    const { amount, networkFee, token, finalizedDate } = item;
    const tokenId = token.id;
    const date = getStartOfDayFor(finalizedDate);
    const tokenExchangeRate = exchangeRates[tokenId][date];

    const convertedTokenValue = getConvertedTokenAmount(
      amount,
      networkFee,
      token.decimals,
      tokenExchangeRate,
    );

    totalAmount = totalAmount.add(convertedTokenValue);
  }

  return totalAmount.toString();
};

module.exports = {
  getTotalFiatAmountFor,
};
