import React from 'react';
import Decimal from 'decimal.js';
import { defineMessages, FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import Numeral from '~shared/Numeral';
import { useRequiredStakeMessage } from '~hooks';

import styles from './RequiredStakeMessage.css';

const displayName =
  'common.ActionDetailsPage.DefaultMotion.StakingWidget.RequiredStakeMessage';

const MSG = defineMessages({
  requiredStake: {
    id: `${displayName}.requiredStake`,
    defaultMessage: ` ({stakePercentage}% of required)`,
  },
});

export interface RequiredStakeMessageProps {
  nativeTokenSymbol: string;
  nativeTokenDecimals: number;
  minUserStake: Decimal;
  remainingToStake: Decimal;
  totalPercentage: number;
}

const RequiredStakeMessage = ({
  nativeTokenSymbol,
  nativeTokenDecimals,
  minUserStake,
  remainingToStake,
  totalPercentage,
}: RequiredStakeMessageProps) => {
  const { stake, isUnderThreshold, isOverThreshold, stakePercentage } =
    useRequiredStakeMessage({
      minUserStake,
      remainingToStake,
      totalPercentage,
    });
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
        <FormattedMessage {...MSG.requiredStake} values={{ stakePercentage }} />
      </span>
    </div>
  );
};

RequiredStakeMessage.displayName = displayName;

export default RequiredStakeMessage;
