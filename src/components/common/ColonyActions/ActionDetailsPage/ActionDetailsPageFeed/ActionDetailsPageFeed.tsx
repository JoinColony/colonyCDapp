import React from 'react';

import { ColonyAction } from '~types';
import { parseSafeTransactionEventType } from '~utils/safes';

import { ACTIONS_EVENTS } from '../staticMaps';

import { ActionsPageEvent } from './ActionDetailsPageEvent';

const displayName =
  'common.ColonyActions.ActionDetailsPage.ActionDetailsPageFeed';

interface ActionsPageFeedProps {
  actionData: ColonyAction;
}

// only safe events for now
const arbitraryTransactionEventParser = (actionData: ColonyAction) => {
  const safeType = parseSafeTransactionEventType(actionData.safeTransaction);

  if (safeType) {
    return safeType;
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
