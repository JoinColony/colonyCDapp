import React from 'react';
import { useFormContext } from 'react-hook-form';
import { defineMessages, FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import Decimal from 'decimal.js';

import Numeral from '~shared/Numeral';
import { SLIDER_AMOUNT_KEY } from '../StakingInput';

import styles from './RequiredStakeMessage.css';

const displayName =
  'common.ActionDetailsPage.DefaultMotion.StakingWidget.RequiredStakeMessage';

const MSG = defineMessages({
  requiredStake: {
    id: `${displayName}.requiredStake`,
    defaultMessage: ` ({stakePercentage}% of required)`,
  },
});

const RequiredStakeMessage = () => {
  const { watch } = useFormContext();
  const sliderAmount = watch(SLIDER_AMOUNT_KEY);
  const isUnderThreshold = sliderAmount < 10;
  const isOverThreshold = !isUnderThreshold;
  const nativeTokenDecimals = 18;
  const nativeTokenSymbol = 'WILL';
  const stake =
    sliderAmount === 0
      ? 0
      : new Decimal('1000000000000000000').div(sliderAmount);

  return (
    <div>
      <Numeral
        className={styles.amount}
        value={stake}
        decimals={nativeTokenDecimals}
        suffix={nativeTokenSymbol}
      />
      <span
        className={classNames(styles.requiredStakeText, {
          [styles.requiredStakeUnderThreshold]: isUnderThreshold,
          [styles.requiredStakeAboveThreshold]: isOverThreshold,
        })}
      >
        <FormattedMessage
          {...MSG.requiredStake}
          values={{ stakePercentage: sliderAmount }}
        />
      </span>
    </div>
  );
};

RequiredStakeMessage.displayName = displayName;

export default RequiredStakeMessage;
