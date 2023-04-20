import React from 'react';

import { ColonyAction, ColonyAndExtensionsEvents } from '~types';
import { TransactionStatus, TransactionStatuses } from '~common/ColonyActions';
import MotionEventData from './MotionEventData';

import styles from './ActionDetailsPageEvent.css';

const displayName = 'common.ColonyActions.ActionDetailsPage.MotionsPageEvent';

export interface MotionsPageEventProps {
  eventName: ColonyAndExtensionsEvents | SystemMessagesName;
  actionData: ColonyAction;
  dataTest?: string;
  eventId?: string;
}

const MotionsPageEvent = ({
  eventName,
  actionData,
  dataTest,
}: MotionsPageEventProps) => (
  <div className={styles.main} data-test={dataTest}>
    <TransactionStatus status={TransactionStatuses.Succeeded} showTooltip />
    <MotionEventData
      actionData={actionData}
      eventName={eventName}
      eventId={eventId}
    />
  </div>
);

MotionsPageEvent.displayName = displayName;

export default MotionsPageEvent;
