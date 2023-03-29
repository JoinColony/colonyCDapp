const { BigNumber } = require('ethers');

const ZERO = '0';
const NEARZERO = '~0';
const DECIMAL_PLACES = 2;

const calculatePercentageReputation = (
  userReputation,
  totalReputation,
  decimalPlaces = DECIMAL_PLACES,
) => {
  if (!userReputation || !totalReputation) return null;
  const userReputationNumber = BigNumber.from(userReputation);
  const totalReputationNumber = BigNumber.from(totalReputation);

  const reputationSafeguard = BigNumber.from(100).pow(decimalPlaces);

  if (userReputationNumber?.isZero() || totalReputationNumber?.isZero()) {
    return ZERO;
  }

  if (userReputationNumber.mul(reputationSafeguard).lt(totalReputationNumber)) {
    return NEARZERO;
  }
  const reputation = userReputationNumber
    .mul(reputationSafeguard)
    .div(totalReputationNumber)
    .toNumber();

  return reputation / 10 ** decimalPlaces;
};

module.exports = {
  calculatePercentageReputation,
};
