import React from 'react';

import { ColonyAction, ColonyAndExtensionsEvents } from '~types';
import { TransactionStatus, TransactionStatuses } from '~common/ColonyActions';
import ActionEventData from './ActionEventData';

import styles from '../ActionDetailsPageEvent.css';

const displayName =
  'common.ColonyActions.ActionDetailsPage.ActionDetailsPageEvent';

export interface ActionDetailsPageEventProps {
  eventName: ColonyAndExtensionsEvents;
  actionData: ColonyAction;
  dataTest?: string;
}

const ActionDetailsPageEvent = ({
  eventName,
  actionData,
  dataTest,
}: ActionDetailsPageEventProps) => (
  <div className={styles.main} data-test={dataTest}>
    <TransactionStatus status={TransactionStatuses.Succeeded} showTooltip />
    <ActionEventData actionData={actionData} eventName={eventName} />
  </div>
);

ActionDetailsPageEvent.displayName = displayName;

export default ActionDetailsPageEvent;
