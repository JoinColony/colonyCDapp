import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { Tooltip } from '~shared/Popover';

import { RequiredStakeMessage } from './StakingSliderMessages';

import styles from './StakingSliderAnnotation.css';
import { RequiredStakeMessageProps } from './StakingSliderMessages/RequiredStakeMessage';

const displayName =
  'common.ColonyActions.ActionDetailsPage.DefaultMotion.StakingSliderAnnotation';

const MSG = defineMessages({
  tooltip: {
    id: `${displayName}.tooltip`,
    defaultMessage: `Stake above the minimum 10% threshold to make it visible to others within the Actions list.`,
  },
});

const tooltipOptions = {
  modifiers: [
    {
      name: 'offset',
      options: {
        offset: [0, 0],
      },
    },
  ],
};

interface StakingSliderAnnotationProps {
  requiredStakeMessageProps: RequiredStakeMessageProps;
}

const StakingSliderAnnotation = ({
  requiredStakeMessageProps,
}: StakingSliderAnnotationProps) => {
  // const { user } = useAppContext();
  // const showMinStakeMsg = !!user && !enoughTokens;

  return (
    <span className={styles.minStakeAmountContainer}>
      <Tooltip
        trigger="hover"
        content={
          <div className={styles.tooltip}>
            <FormattedMessage {...MSG.tooltip} />
          </div>
        }
        placement="top"
        popperOptions={tooltipOptions}
      >
        <RequiredStakeMessage {...requiredStakeMessageProps} />

        {/* {showMinStakeMsg ? (
          <MinimumStakeMessage />
        ) : (
        )} */}
      </Tooltip>
    </span>
  );
};

StakingSliderAnnotation.displayName = displayName;

export default StakingSliderAnnotation;
