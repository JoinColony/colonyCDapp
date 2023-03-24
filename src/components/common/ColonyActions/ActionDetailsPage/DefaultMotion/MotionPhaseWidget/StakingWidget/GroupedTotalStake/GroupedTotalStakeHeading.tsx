import React from 'react';
import { defineMessages } from 'react-intl';

import { Heading5 } from '~shared/Heading';
import QuestionMarkTooltip from '~shared/QuestionMarkTooltip';

import styles from './GroupedTotalStakeHeading.css';

const displayName =
  'common.ColonyActions.ActionDetailsPage.DefaultMotion.StakingWidget.GroupedTotalStakeHeading';

const MSG = defineMessages({
  crowdfundStakeTitle: {
    id: `${displayName}.crowdfundStakeTitle`,
    defaultMessage: 'Crowdfund stakes',
  },
  totalStakeTooltip: {
    id: `${displayName}.totalStakeTooltip`,
    defaultMessage: `The total staked amount and weight for each side of the Motion.`,
  },
});

const GroupedTotalStakeHeading = () => (
  <div className={styles.widgetHeading}>
    <Heading5
      appearance={{
        theme: 'dark',
        margin: 'none',
      }}
      text={MSG.crowdfundStakeTitle}
      className={styles.title}
    />
    <QuestionMarkTooltip
      className={styles.help}
      tooltipClassName={styles.tooltip}
      tooltipText={MSG.totalStakeTooltip}
      tooltipPopperOptions={{
        placement: 'right',
      }}
    />
  </div>
);

GroupedTotalStakeHeading.displayName = displayName;

export default GroupedTotalStakeHeading;
