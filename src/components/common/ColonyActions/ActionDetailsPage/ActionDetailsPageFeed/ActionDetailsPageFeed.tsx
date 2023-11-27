import React from 'react';

import { ColonyAction } from '~types';
import { parseSafeTransactionType } from '~utils/safes';

import { ACTIONS_EVENTS } from '../staticMaps';

import { ActionsPageEvent } from './ActionDetailsPageEvent';

const displayName =
  'common.ColonyActions.ActionDetailsPage.ActionDetailsPageFeed';

interface ActionsPageFeedProps {
  actionData: ColonyAction;
}

const ActionDetailsPageFeed = ({ actionData }: ActionsPageFeedProps) => {
  const events =
    JSON.parse(actionData.individualEvents as string) ||
    ACTIONS_EVENTS[parseSafeTransactionType(actionData) || actionData.type];

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
