import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { useAppContext } from '~hooks';
import { Tooltip } from '~shared/Popover';

import MinimumStakeMessage from './MinimumStakeMessage';
import RequiredStakeMessage, {
  RequiredStakeMessageProps,
} from './RequiredStakeMessage';

import styles from './StakingSliderAnnotation.css';

const displayName =
  'common.ColonyActions.ActionDetailsPage.DefaultMotion.StakingSliderMessage';

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

export interface StakingSliderAnnotationProps {
  enoughTokens: boolean;
  requiredStakeMessageProps: RequiredStakeMessageProps;
}

const StakingSliderAnnotation = ({
  enoughTokens,
  requiredStakeMessageProps,
}: StakingSliderAnnotationProps) => {
  const { user } = useAppContext();
  const showMinStakeMsg = !!user && !enoughTokens;

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
        {showMinStakeMsg ? (
          <MinimumStakeMessage />
        ) : (
          <RequiredStakeMessage {...requiredStakeMessageProps} />
        )}
      </Tooltip>
    </span>
  );
};

StakingSliderAnnotation.displayName = displayName;

export default StakingSliderAnnotation;
