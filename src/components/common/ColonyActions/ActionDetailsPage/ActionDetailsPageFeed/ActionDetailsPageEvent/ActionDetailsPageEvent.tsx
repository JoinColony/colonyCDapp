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
  motionEventData: MotionEvent;
  dataTest?: string;
}

const ActionsPageEvent = ({
  eventName,
  actionData,
  motionEventData,
  dataTest,
}: ActionsPageEventProps) => (
  <div className={styles.main} data-test={dataTest}>
    <TransactionStatus status={TransactionStatuses.Succeeded} showTooltip />
    <ActionEventData
      actionData={actionData}
      motionEventData={motionEventData}
      eventName={eventName}
    />
  </div>
);

ActionsPageEvent.displayName = displayName;

export default ActionsPageEvent;
