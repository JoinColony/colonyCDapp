import React from 'react';
import { FormattedMessage } from 'react-intl';

import { ColonyAndExtensionsEvents } from '~types';
import { getEventTitleValues, TransactionMeta } from '~common/ColonyActions';
import { useColonyContext, useUserByNameOrAddress } from '~hooks';

import ActionRoles from './ActionRoles';
import { ActionsPageEventProps } from './ActionDetailsPageEvent';

import styles from './ActionEventData.css';

const displayName = 'common.ColonyActions.ActionDetailsPage.ActionEventData';

const ActionEventData = ({
  actionData: { createdAt, transactionHash, type },
  actionData,
  motionMessageData,
  eventName,
}: Pick<
  ActionsPageEventProps,
  'actionData' | 'eventName' | 'motionMessageData'
>) => {
  const { colony } = useColonyContext();
  const { user: motionMessageInitiatorUser } = useUserByNameOrAddress(
    motionMessageData.initiatorAddress || '',
  );
  const messageId = Object.values<string>(ColonyAndExtensionsEvents).includes(
    eventName,
  )
    ? 'event.title'
    : 'systemMessage.title';

  return (
    <div className={styles.content}>
      <div className={styles.text} data-test="actionsEventText">
        <FormattedMessage
          id={messageId}
          values={getEventTitleValues(
            eventName,
            actionData,
            motionMessageData,
            motionMessageInitiatorUser,
            colony,
          )}
        />
      </div>
      <div className={styles.details}>
        <ActionRoles
          actionType={type}
          eventName={eventName as ColonyAndExtensionsEvents}
        />
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
