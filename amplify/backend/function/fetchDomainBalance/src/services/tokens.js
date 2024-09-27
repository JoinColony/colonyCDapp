const { BigNumber } = require('ethers');
const { getStartOfDayFor } = require('../utils');

const getConvertedTokenAmount = (
  amount,
  networkFee,
  decimals,
  exchangeRate,
) => {
  // Number of decimals for exchange rate precision
  const exchangeRateDecimals = 9;
  // Scale factor for exchange rate precision
  const exchangeRateScaleFactor = BigNumber.from(10).pow(exchangeRateDecimals);
  // Scale factor based on token's decimals
  const tokenScaleFactor = BigNumber.from(10).pow(decimals);
  // Convert exchange rate to BigNumber and normalize it with respect to token scale.
  // We multiply exchange rate by 10^exchangeRateDecimals to remove decimals, then adjust it by token scale.
  const normalizedTokenExchangeRate = BigNumber.from(
    Math.round(exchangeRate * Math.pow(10, exchangeRateDecimals)),
  )
    .mul(tokenScaleFactor)
    .div(exchangeRateScaleFactor);
  const formattedNetworkFee = BigNumber.from(networkFee || 0);

  // Calculate final amount considering network fees and exchange rate, normalizing to 10^18 scale
  return BigNumber.from(amount)
    .add(formattedNetworkFee) // Add network fee to the initial amount
    .mul(normalizedTokenExchangeRate) // Adjust amount using the normalized exchange rate
    .mul(BigNumber.from(10).pow(18)) // Scale the result to 10^18 format for consistency
    .div(tokenScaleFactor) // Undo initial scaling of the amount and network fee
    .div(tokenScaleFactor); // Adjust the final value by the normalized exchange rate scale;
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
