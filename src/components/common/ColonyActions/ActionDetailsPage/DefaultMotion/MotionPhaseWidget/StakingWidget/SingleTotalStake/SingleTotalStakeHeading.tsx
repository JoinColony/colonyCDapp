import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { Placement } from '@popperjs/core';

import { Heading5 } from '~shared/Heading';
import Numeral from '~shared/Numeral';
import QuestionMarkTooltip from '~shared/QuestionMarkTooltip';
import { useColonyContext } from '~hooks';

import styles from './SingleTotalStakeHeading.css';

const displayName =
  'common.ColonyActions.ActionDetailsPage.DefaultMotion.StakingWidget.SingleTotalStakeHeading';

const MSG = defineMessages({
  motionTitle: {
    id: `${displayName}.motionTitle`,
    defaultMessage: 'Stake',
  },
  objectionTitle: {
    id: `${displayName}.objectionTitle`,
    defaultMessage: 'Goal',
  },
  stakeToolTip: {
    id: `${displayName}.stakeToolTip`,
    defaultMessage: `Percentage this Motion has been staked. For it to show up in the Actions list a min 10% is required.`,
  },
  stakeProgress: {
    id: `${displayName}.stakeProgress`,
    defaultMessage: '{totalPercentage}% of {requiredStake}',
  },
});

const tooltipOptions = {
  placement: 'top-end' as Placement,
  modifiers: [
    {
      name: 'offset',
      options: {
        offset: [0, 10],
      },
    },
  ],
};

interface SingleTotalStakeHeadingProps {
  totalPercentage: number;
  requiredStake: string;
}

const SingleTotalStakeHeading = ({
  totalPercentage,
  requiredStake,
}: SingleTotalStakeHeadingProps) => {
  const { colony } = useColonyContext();
  const { symbol: nativeTokenSymbol, decimals: nativeTokenDecimals } =
    colony?.nativeToken || {};

  const isObjection = false;
  return (
    <div className={styles.widgetHeading}>
      <div className={styles.subHeading}>
        <Heading5
          appearance={{
            theme: 'dark',
            margin: 'none',
          }}
          text={isObjection ? MSG.objectionTitle : MSG.motionTitle}
          className={styles.title}
        />
        <QuestionMarkTooltip
          tooltipText={MSG.stakeToolTip}
          className={styles.helpTooltip}
          tooltipClassName={styles.tooltip}
          showArrow={false}
          tooltipPopperOptions={tooltipOptions}
        />
      </div>
      <span className={styles.stakeProgress}>
        <FormattedMessage
          {...MSG.stakeProgress}
          values={{
            totalPercentage,
            requiredStake: (
              <Numeral
                value={requiredStake}
                suffix={nativeTokenSymbol}
                decimals={nativeTokenDecimals}
              />
            ),
          }}
        />
      </span>
    </div>
  );
};

SingleTotalStakeHeading.displayName = displayName;

export default SingleTotalStakeHeading;
