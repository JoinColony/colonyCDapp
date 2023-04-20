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

const displayName = 'common.ColonyActions.ActionDetailsPage.ActionEventData';

const ActionEventData = ({
  actionData: { createdAt, transactionHash, type },
  actionData,
  eventName,
  eventId,
}: Pick<
  ActionDetailsPageEventProps,
  'actionData' | 'eventName' | 'eventId'
>) => {
  const { colony } = useColonyContext();

  return (
    <EventData
      text={
        <FormattedMessage
          id="event.title"
          values={getActionEventTitleValues(
            eventName,
            actionData,
            eventId,
            colony,
          )}
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
