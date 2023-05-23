import React from 'react';

import { ColonyAction, ColonyAndExtensionsEvents } from '~types';
import { TransactionStatus, TransactionStatuses } from '~common/ColonyActions';
import ActionEventData from './ActionEventData';

import styles from './ActionDetailsPageEvent.css';

const displayName =
  'common.ColonyActions.ActionDetailsPage.ActionDetailsPageEvent';

export interface ActionsPageEventProps {
  eventName: ColonyAndExtensionsEvents;
  actionData: ColonyAction;
  dataTest?: string;
  eventId?: string;
}

const ActionsPageEvent = ({
  actionData,
  eventName,
  dataTest,
  eventId,
}: ActionsPageEventProps) => (
  <div className={styles.main} data-test={dataTest}>
    <TransactionStatus status={TransactionStatuses.Succeeded} showTooltip />
    <ActionEventData
      actionData={actionData}
      eventName={eventName}
      eventId={eventId}
    />
  </div>
);

ActionsPageEvent.displayName = displayName;

export default ActionsPageEvent;
