import React from 'react';
import { FormattedMessage } from 'react-intl';

import { getEventTitleValues, TransactionMeta } from '~common/ColonyActions';
import { mockEventData } from '~common/ColonyActions/mockData';
import { useColonyContext } from '~hooks';

import ActionRoles from './ActionRoles';
import { ActionsPageEventProps } from './ActionDetailsPageEvent';

import styles from './ActionEventData.css';

const displayName = 'common.ColonyActions.ActionDetailsPage.ActionEventData';

const ActionEventData = ({
  actionData: { createdAt, transactionHash, type },
  actionData,
  eventName,
}: Pick<ActionsPageEventProps, 'actionData' | 'eventName'>) => {
  const { colony } = useColonyContext();

  return (
    <div className={styles.content}>
      <div className={styles.text} data-test="actionsEventText">
        <FormattedMessage
          id="event.title"
          values={getEventTitleValues(
            { ...mockEventData, eventName },
            actionData,
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
