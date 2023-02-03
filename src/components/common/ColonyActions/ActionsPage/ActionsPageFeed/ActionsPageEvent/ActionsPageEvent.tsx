import React, { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';

import {
  TransactionMeta,
  TransactionStatus,
  Status,
} from '~common/ColonyActions/ActionsPage';
import getEventTitleValues from '~common/ColonyActions/helpers/getEventTitleValues';
import { mockEventData } from '~common/ColonyActions/mockData';
import { useColonyContext } from '~hooks';
import { ColonyAndExtensionsEvents, FormattedAction } from '~types';

import ActionRoles from './ActionRoles';
import styles from './ActionsPageEvent.css';

const displayName = 'common.ColonyActions.ActionsPage.ActionsPageEvent';

interface ActionsPageEventProps {
  eventName?: ColonyAndExtensionsEvents;
  actionData: FormattedAction;
  dataTest: string;
  children?: ReactNode;
}
const ActionsPageEvent = ({
  actionData: { createdAt, transactionHash, actionType },
  eventName = ColonyAndExtensionsEvents.Generic,
  dataTest,
  children,
}: ActionsPageEventProps) => {
  const { colony } = useColonyContext();

  return (
    <div className={styles.main} data-test={dataTest}>
      <div className={styles.wrapper}>
        <TransactionStatus status={Status.Succeeded} showTooltip />
        <div className={styles.content}>
          <div className={styles.text} data-test="actionsEventText">
            <FormattedMessage
              id="event.title"
              values={getEventTitleValues(mockEventData, colony)}
            />
          </div>
          <div className={styles.details}>
            <ActionRoles actionType={actionType} eventName={eventName} />
            <TransactionMeta
              transactionHash={transactionHash}
              createdAt={createdAt}
            />
          </div>
        </div>
      </div>
      {children}
    </div>
  );
};

ActionsPageEvent.displayName = displayName;

export default ActionsPageEvent;
