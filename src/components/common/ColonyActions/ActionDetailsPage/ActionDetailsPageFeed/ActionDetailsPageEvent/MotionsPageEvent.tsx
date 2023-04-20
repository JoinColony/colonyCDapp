import React from 'react';

import {
  ColonyAction,
  ColonyAndExtensionsEvents,
  MotionMessage,
  SystemMessagesName,
} from '~types';
import { TransactionStatus, TransactionStatuses } from '~common/ColonyActions';
import MotionEventData from './MotionEventData';

import styles from './ActionDetailsPageEvent.css';

const displayName = 'common.ColonyActions.ActionDetailsPage.MotionsPageEvent';

export interface MotionsPageEventProps {
  eventName: ColonyAndExtensionsEvents | SystemMessagesName;
  actionData: ColonyAction;
  motionMessageData: MotionMessage;
  dataTest?: string;
}

const MotionsPageEvent = ({
  eventName,
  actionData,
  motionMessageData,
  dataTest,
}: MotionsPageEventProps) => (
  <div className={styles.main} data-test={dataTest}>
    <TransactionStatus status={TransactionStatuses.Succeeded} showTooltip />
    <MotionEventData
      actionData={actionData}
      motionMessageData={motionMessageData}
      eventName={eventName}
    />
  </div>
);

MotionsPageEvent.displayName = displayName;

export default MotionsPageEvent;
