import React from 'react';
import { FormattedMessage } from 'react-intl';

import { ColonyAndExtensionsEvents } from '~types';
import {
  getActionEventTitleValues,
  TransactionMeta,
} from '~common/ColonyActions';
import { useColonyContext } from '~hooks';
import EventData from '../EventData';

import ActionRoles from './ActionRoles';
import { ActionDetailsPageEventProps } from './ActionDetailsPageEvent';

const displayName = 'common.ColonyActions.ActionDetailsPage.ActionEventData';

const ActionEventData = ({
  actionData: { createdAt, transactionHash, type },
  actionData,
  eventName,
}: Pick<ActionDetailsPageEventProps, 'actionData' | 'eventName'>) => {
  const { colony } = useColonyContext();

  return (
    <EventData
      text={
        <FormattedMessage
          id="event.title"
          values={getActionEventTitleValues(eventName, actionData, colony)}
        />
      }
      details={
        <>
          <ActionRoles
            actionType={type}
            eventName={eventName as ColonyAndExtensionsEvents}
          />
          <TransactionMeta
            transactionHash={transactionHash}
            createdAt={createdAt}
          />
        </>
      }
    />
  );
};

ActionEventData.displayName = displayName;

export default ActionEventData;
