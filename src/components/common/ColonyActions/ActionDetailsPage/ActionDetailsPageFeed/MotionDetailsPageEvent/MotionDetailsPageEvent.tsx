import React from 'react';

import {
  ColonyAction,
  ColonyAndExtensionsEvents,
  MotionMessage,
  SystemMessagesName,
} from '~types';
import { TransactionStatus, TransactionStatuses } from '~common/ColonyActions';
import MotionEventData from './MotionEventData';

import styles from '../ActionDetailsPageEvent.css';

const displayName =
  'common.ColonyActions.ActionDetailsPage.MotionDetailsPageEvent';

export interface MotionDetailsPageEventProps {
  eventName: ColonyAndExtensionsEvents | SystemMessagesName;
  actionData: ColonyAction;
  motionMessageData: MotionMessage;
  dataTest?: string;
}

const MotionDetailsPageEvent = ({
  eventName,
  actionData,
  motionMessageData,
  dataTest,
}: MotionDetailsPageEventProps) => (
  <div className={styles.main} data-test={dataTest}>
    <TransactionStatus status={TransactionStatuses.Succeeded} showTooltip />
    <MotionEventData
      actionData={actionData}
      motionMessageData={motionMessageData}
      eventName={eventName}
    />
  </div>
);

MotionDetailsPageEvent.displayName = displayName;

export default MotionDetailsPageEvent;
