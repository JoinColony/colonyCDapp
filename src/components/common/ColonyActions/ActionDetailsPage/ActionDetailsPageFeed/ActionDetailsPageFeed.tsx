import React from 'react';

import { ACTIONS_EVENTS } from '../staticMaps';
import { ColonyAction } from '~types';

import { ActionsPageEvent } from './ActionDetailsPageEvent';

const displayName =
  'common.ColonyActions.ActionDetailsPage.ActionDetailsPageFeed';

interface ActionsPageFeedProps {
  actionData: ColonyAction;
}

const ActionDetailsPageFeed = ({ actionData }: ActionsPageFeedProps) => {
  const events = ACTIONS_EVENTS[actionData.type];
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

ActionDetailsPageFeed.displayName = displayName;

export default ActionDetailsPageFeed;
