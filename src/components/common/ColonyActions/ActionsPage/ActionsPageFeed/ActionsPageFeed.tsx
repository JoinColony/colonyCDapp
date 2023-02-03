import React from 'react';

import { ColonyAndExtensionsEvents, FormattedAction } from '~types';

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
  return (
    <div>
      Feed
      <ActionsPageEvent
        actionData={actionData}
        eventName={ColonyAndExtensionsEvents.ColonyUpgraded}
      />
    </div>
  );
};

ActionsPageFeed.displayName = displayName;

export default ActionsPageFeed;
