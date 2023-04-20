import React from 'react';

import { ColonyAction, ColonyAndExtensionsEvents } from '~types';
import { TransactionStatus, TransactionStatuses } from '~common/ColonyActions';
import ActionEventData from './ActionEventData';

import styles from './ActionDetailsPageEvent.css';

const displayName = 'common.ColonyActions.ActionDetailsPage.ActionsPageEvent';

export interface ActionsPageEventProps {
  eventName: ColonyAndExtensionsEvents;
  actionData: ColonyAction;
  dataTest?: string;
}

const ActionsPageEvent = ({
  eventName,
  actionData,
  dataTest,
}: ActionsPageEventProps) => (
  <div className={styles.main} data-test={dataTest}>
    <TransactionStatus status={TransactionStatuses.Succeeded} showTooltip />
    <ActionEventData actionData={actionData} eventName={eventName} />
  </div>
);

ActionsPageEvent.displayName = displayName;

export default ActionsPageEvent;
