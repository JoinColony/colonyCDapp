import React from 'react';
import { defineMessages } from 'react-intl';

import { ActionButton } from '~shared/Button';
import QuestionMarkTooltip from '~shared/QuestionMarkTooltip';
import { ActionTypes } from '~redux';
import { mapPayload } from '~utils/actions';
import { Address } from '~types';
import { useColonyContext } from '~hooks';

import styles from './EscalateButton.css';

const displayName =
  'common.ColonyActions.ActionsPage.DefaultMotion.EscalateButton';

const MSG = defineMessages({
  escalate: {
    id: `${displayName}.escalate`,
    defaultMessage: `Escalate`,
  },
  escalateTooltip: {
    id: `${displayName}.escalateTooltip`,
    defaultMessage: `Motion escalation will be released in a future update`,
  },
});

interface EscalateButtonProps {
  motionId: number;
  userAddress: Address;
}

const EscalateButton = ({ motionId, userAddress }: EscalateButtonProps) => {
  const { colony } = useColonyContext();

  if (!colony) {
    return null;
  }

  const escalateTransform = mapPayload(() => ({
    colony: colony.colonyAddress,
    motionId,
    userAddress,
  }));

  return (
    <div className={styles.escalation}>
      <ActionButton
        appearance={{ theme: 'blue', size: 'small' }}
        actionType={ActionTypes.MOTION_ESCALATE}
        transform={escalateTransform}
        text={MSG.escalate}
        /*
         * @NOTE For the current release the "escalate" functionality
         * has been disabled due to difficulties in implementing
         * the events, **after** the motion has been escalated, due
         * to the `motion.events` array values being reset
         */
        disabled
      />
      <QuestionMarkTooltip
        tooltipText={MSG.escalateTooltip}
        className={styles.helpEscalate}
        tooltipClassName={styles.tooltip}
        tooltipPopperOptions={{
          placement: 'right',
        }}
      />
    </div>
  );
};

EscalateButton.displayName = displayName;

export default EscalateButton;
