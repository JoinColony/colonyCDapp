import React from 'react';
import { FormattedMessage } from 'react-intl';

import { getEventTitleValues, TransactionMeta } from '~common/ColonyActions';
import { useColonyContext, useUserByNameOrAddress } from '~hooks';

import ActionRoles from './ActionRoles';
import { ActionsPageEventProps } from './ActionDetailsPageEvent';

import styles from './ActionEventData.css';

const displayName = 'common.ColonyActions.ActionDetailsPage.ActionEventData';

const ActionEventData = ({
  actionData: { createdAt, transactionHash, type },
  actionData,
  motionEventData,
  eventName,
}: Pick<
  ActionsPageEventProps,
  'actionData' | 'eventName' | 'motionEventData'
>) => {
  const { colony } = useColonyContext();
  const { user: motionEventInitiatorUser } = useUserByNameOrAddress(
    motionEventData.initiatorAddress || '',
  );

  return (
    <div className={styles.content}>
      <div className={styles.text} data-test="actionsEventText">
        <FormattedMessage
          id="event.title"
          values={getEventTitleValues(
            eventName,
            actionData,
            motionEventData,
            motionEventInitiatorUser,
            colony,
          )}
        />
      </div>
      <div className={styles.details}>
        <ActionRoles actionType={type} eventName={eventName} />
        <TransactionMeta
          transactionHash={transactionHash}
          createdAt={createdAt}
        />
      </div>
    </div>
  );
};

ActionEventData.displayName = displayName;

export default ActionEventData;
