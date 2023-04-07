import React from 'react';

import { ColonyAction, ColonyAndExtensionsEvents } from '~types';
// import { ACTIONS_EVENTS } from '../staticMaps';

import ActionsPageEvent from './ActionDetailsPageEvent';

const displayName =
  'common.ColonyActions.ActionDetailsPage.ActionDetailsPageFeed';

interface ActionsPageFeedProps {
  actionData: ColonyAction;
}

const ActionDetailsPageFeed = ({ actionData }: ActionsPageFeedProps) => {
  const events = actionData.motionData?.events;
  return (
    <>
      {events?.map((event) => (
        <ActionsPageEvent
          actionData={actionData}
          eventData={event}
          eventName={ColonyAndExtensionsEvents[event.name]}
          // key={event.transactionHash}
        />
      ))}
    </>
  );
};

ActionDetailsPageFeed.displayName = displayName;

export default ActionDetailsPageFeed;
