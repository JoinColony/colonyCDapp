import React from 'react';

import {
  ColonyAction,
  ColonyAndExtensionsEvents,
  MotionMessage,
  SystemMessages,
} from '~types';
import { TransactionStatus, TransactionStatuses } from '~common/ColonyActions';
import MotionEventData from './MotionEventData';

import styles from '../ActionDetailsPageEvent.css';

const displayName =
  'common.ColonyActions.ActionDetailsPage.MotionDetailsPageEvent';

export interface MotionDetailsPageEventProps {
  eventName: ColonyAndExtensionsEvents | SystemMessages;
  actionData: ColonyAction;
  dataTest?: string;
  motionMessageData: MotionMessage;
}

const MotionDetailsPageEvent = ({
  eventName,
  actionData,
  dataTest,
  motionMessageData,
}: MotionDetailsPageEventProps) => (
  <div className={styles.main} data-test={dataTest}>
    <TransactionStatus status={TransactionStatuses.Succeeded} showTooltip />
    <MotionEventData
      actionData={actionData}
      eventName={eventName}
      motionMessageData={motionMessageData}
    />
  </div>
);

MotionDetailsPageEvent.displayName = displayName;

export default MotionDetailsPageEvent;
