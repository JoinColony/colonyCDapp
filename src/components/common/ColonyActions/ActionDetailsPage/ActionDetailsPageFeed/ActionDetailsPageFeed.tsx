import React from 'react';

import { ColonyAction, ColonyAndExtensionsEvents } from '~types';

import ActionsPageEvent from './ActionDetailsPageEvent';

const displayName =
  'common.ColonyActions.ActionDetailsPage.ActionDetailsPageFeed';

interface ActionsPageFeedProps {
  actionData: ColonyAction;
}

const ActionDetailsPageFeed = ({ actionData }: ActionsPageFeedProps) => {
  const motionEvents = actionData.motionData?.events;
  return (
    <>
      {motionEvents?.map((event) => (
        <ActionsPageEvent
          actionData={actionData}
          motionEventData={event}
          eventName={ColonyAndExtensionsEvents[event.name]}
          key={`${event.name}-${event.initiatorAddress}-${event.amount}`}
        />
      ))}
    </>
  );
};

ActionDetailsPageFeed.displayName = displayName;

export default ActionDetailsPageFeed;
