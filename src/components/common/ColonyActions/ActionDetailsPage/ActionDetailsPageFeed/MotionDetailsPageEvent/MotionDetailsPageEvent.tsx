import React from 'react';

import { ColonyAction, ColonyAndExtensionsEvents } from '~types';
import { TransactionStatus, TransactionStatuses } from '~common/ColonyActions';
import MotionEventData from './MotionEventData';

import styles from '../ActionDetailsPageEvent.css';

const displayName =
  'common.ColonyActions.ActionDetailsPage.MotionDetailsPageEvent';

export interface MotionDetailsPageEventProps {
  eventName: ColonyAndExtensionsEvents | SystemMessagesName;
  actionData: ColonyAction;
  dataTest?: string;
  eventId?: string;
}

const MotionDetailsPageEvent = ({
  eventName,
  actionData,
  dataTest,
}: MotionDetailsPageEventProps) => (
  <div className={styles.main} data-test={dataTest}>
    <TransactionStatus status={TransactionStatuses.Succeeded} showTooltip />
    <MotionEventData
      actionData={actionData}
      eventName={eventName}
      eventId={eventId}
    />
  </div>
);

MotionDetailsPageEvent.displayName = displayName;

export default MotionDetailsPageEvent;
