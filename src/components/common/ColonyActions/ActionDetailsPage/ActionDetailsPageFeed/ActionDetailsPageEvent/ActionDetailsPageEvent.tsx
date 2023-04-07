import React from 'react';

import { ColonyAction, ColonyAndExtensionsEvents, MotionEvent } from '~types';
import { TransactionStatus, TransactionStatuses } from '~common/ColonyActions';
import ActionEventData from './ActionEventData';

import styles from './ActionDetailsPageEvent.css';

const displayName =
  'common.ColonyActions.ActionDetailsPage.ActionDetailsPageEvent';

export interface ActionsPageEventProps {
  eventName: ColonyAndExtensionsEvents;
  actionData: ColonyAction;
  eventData: MotionEvent;
  dataTest?: string;
}

const ActionsPageEvent = ({
  eventName,
  actionData,
  eventData,
  dataTest,
}: ActionsPageEventProps) => (
  <div className={styles.main} data-test={dataTest}>
    <TransactionStatus status={TransactionStatuses.Succeeded} showTooltip />
    <ActionEventData
      actionData={actionData}
      eventData={eventData}
      eventName={eventName}
    />
  </div>
);

ActionsPageEvent.displayName = displayName;

export default ActionsPageEvent;
