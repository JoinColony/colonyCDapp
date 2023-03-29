import React from 'react';
import { useFormContext } from 'react-hook-form';
import { defineMessages, FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import { useColonyContext } from '~hooks';
import Numeral from '~shared/Numeral';
import {
  getStakeFromSlider,
  getStakePercentage,
  useStakingWidgetContext,
} from '../..';
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

const RequiredStakeMessage = () => {
  const { watch } = useFormContext();
  const { colony } = useColonyContext();
  const { decimals: nativeTokenDecimals, symbol: nativeTokenSymbol } =
    colony?.nativeToken || {};
  const {
    motionStakes: {
      percentage: { yay: yayPercentageStaked, nay: nayPercentageStaked },
    },
    remainingStakes: [nayRemaining, yayRemaining],
    userMinStake,
  } = useStakingWidgetContext();
  const isObjection = false;
  const remainingToStake = isObjection ? nayRemaining : yayRemaining;
  const sliderAmount = watch(SLIDER_AMOUNT_KEY);
  const isUnderThreshold =
    sliderAmount <
    10 - Number(isObjection ? nayPercentageStaked : yayPercentageStaked);
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
