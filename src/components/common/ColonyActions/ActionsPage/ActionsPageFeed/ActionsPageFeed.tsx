import React from 'react';

import { FormattedAction } from '~types';
import { ACTIONS_EVENTS } from '../staticMaps';

import ActionsPageEvent from './ActionsPageEvent';

const displayName = 'common.ColonyActions.ActionsPage.ActionsPageFeed';

interface ActionsPageFeedProps {
  actionData: FormattedAction;
  // networkEvents: FormattedEvent[];
}

const ActionsPageFeed = ({
  actionData,
}: // networkEvents,
ActionsPageFeedProps) => {
  const events = ACTIONS_EVENTS[actionData.actionType];
  return (
    <>
      {events?.map((event) => (
        <ActionsPageEvent
          actionData={actionData}
          eventName={event}
          key={event}
        />
      ))}
    </>
  );
};

ActionsPageFeed.displayName = displayName;

export default ActionsPageFeed;
