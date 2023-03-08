import Decimal from 'decimal.js';
import React from 'react';

import Numeral from '~shared/Numeral';
import TokensLeftToActivate from '../TokensLeftToActivate';

import styles from './StakingValidationMessage.css';

interface ValidationErrorNumeral {
  value: Decimal;
  decimals: number;
}

const ValidationErrorNumeral = ({
  value,
  decimals,
}: ValidationErrorNumeral) => (
  <Numeral
    className={styles.validationError}
    value={value}
    decimals={decimals}
  />
);

interface useStakingValidationMessageProps {
  nativeTokenDecimals: number;
  nativeTokenSymbol: string;
  minUserStake: Decimal;
  maxUserStake: Decimal;
}

const getErrorValues = ({
  nativeTokenDecimals,
  nativeTokenSymbol,
  minUserStake,
  maxUserStake,
}: useStakingValidationMessageProps) => {
  const errorValues = {
    tokens: {
      leftToActivate: <TokensLeftToActivate />,
      tokenSymbol: nativeTokenSymbol,
    },
    reputation: {
      minimumReputation: (
        <ValidationErrorNumeral
          decimals={nativeTokenDecimals}
          value={minUserStake}
        />
      ),
      userReputation: (
        <ValidationErrorNumeral
          decimals={nativeTokenDecimals}
          value={maxUserStake}
        />
      ),
    },
  };

  return errorValues;
};

export default getErrorValues;
