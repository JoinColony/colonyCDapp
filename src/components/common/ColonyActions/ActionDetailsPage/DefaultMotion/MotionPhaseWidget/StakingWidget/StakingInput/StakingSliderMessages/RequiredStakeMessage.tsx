import React from 'react';
import { useFormContext } from 'react-hook-form';
import { defineMessages, FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import Numeral from '~shared/Numeral';
import { getStakeFromSlider, getStakePercentage } from '../..';
import { SLIDER_AMOUNT_KEY } from '..';

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
  percentageStaked: string;
  remainingToStake: string;
  userMinStake: string;
  nativeTokenDecimals: number;
  nativeTokenSymbol: string;
}

const RequiredStakeMessage = ({
  percentageStaked,
  remainingToStake,
  userMinStake,
  nativeTokenDecimals,
  nativeTokenSymbol,
}: RequiredStakeMessageProps) => {
  const { watch } = useFormContext();
  const sliderAmount = watch(SLIDER_AMOUNT_KEY);
  const isUnderThreshold = sliderAmount < 10 - Number(percentageStaked);
  const stake = getStakeFromSlider(
    sliderAmount,
    remainingToStake,
    userMinStake,
  );
  const stakePercentage = getStakePercentage(stake, remainingToStake);

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
          [styles.requiredStakeAboveThreshold]: !isUnderThreshold,
        })}
      >
        <FormattedMessage {...MSG.requiredStake} values={{ stakePercentage }} />
      </span>
    </div>
  );
};

RequiredStakeMessage.displayName = displayName;

export default RequiredStakeMessage;
