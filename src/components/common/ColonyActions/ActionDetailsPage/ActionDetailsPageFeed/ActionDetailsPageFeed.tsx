import React from 'react';

import { isEmpty } from '~utils/lodash';
import { ColonyAction, ColonyAndExtensionsEvents } from '~types';
import { ACTIONS_EVENTS } from '../staticMaps';

import { ActionsPageEvent } from './ActionDetailsPageEvent';

const displayName =
  'common.ColonyActions.ActionDetailsPage.ActionDetailsPageFeed';

interface ActionsPageFeedProps {
  actionData: ColonyAction;
}

// only safe events for now
const arbitraryTransactionEventParser = (actionData: ColonyAction) => {
  if (!isEmpty(actionData.safeTransaction)) {
    if (actionData.safeTransaction.transactions.length > 1) {
      return [ColonyAndExtensionsEvents.SafeMultipleTransactions];
    }

    const actionType = `SAFE_${actionData.safeTransaction.transactions[0].transactionType}`;

    return [actionType as ColonyAndExtensionsEvents];
  }

  return undefined;
};

const ActionDetailsPageFeed = ({ actionData }: ActionsPageFeedProps) => {
  const events =
    JSON.parse(actionData.individualEvents as string) ||
    arbitraryTransactionEventParser(actionData) ||
    ACTIONS_EVENTS[actionData.type];

  return (
    <>
      {events?.map((event) => (
        <ActionsPageEvent
          actionData={actionData}
          eventName={event?.type || event}
          key={event?.id || event}
          eventId={event?.id || event}
        />
      ))}
    </>
  );
};

ActionDetailsPageFeed.displayName = displayName;

export default ActionDetailsPageFeed;
