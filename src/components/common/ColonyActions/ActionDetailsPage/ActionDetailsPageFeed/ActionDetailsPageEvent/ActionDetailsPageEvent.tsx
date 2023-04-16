import React from 'react';

import {
  ColonyAction,
  ColonyAndExtensionsEvents,
  MotionMessage,
  SystemMessagesName,
} from '~types';
import { TransactionStatus, TransactionStatuses } from '~common/ColonyActions';
import ActionEventData from './ActionEventData';

import styles from './ActionDetailsPageEvent.css';

const displayName =
  'common.ColonyActions.ActionDetailsPage.ActionDetailsPageEvent';

export interface ActionsPageEventProps {
  eventName: ColonyAndExtensionsEvents | SystemMessagesName;
  actionData: ColonyAction;
  motionMessageData: MotionMessage;
  dataTest?: string;
}

const ActionsPageEvent = ({
  eventName,
  actionData,
  motionMessageData,
  dataTest,
}: ActionsPageEventProps) => (
  <div className={styles.main} data-test={dataTest}>
    <TransactionStatus status={TransactionStatuses.Succeeded} showTooltip />
    <ActionEventData
      actionData={actionData}
      motionMessageData={motionMessageData}
      eventName={eventName}
    />
  </div>
);

ActionsPageEvent.displayName = displayName;

export default ActionsPageEvent;
