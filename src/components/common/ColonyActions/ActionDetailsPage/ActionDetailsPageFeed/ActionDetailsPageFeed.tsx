import React from 'react';

import { ACTIONS_EVENTS } from '../staticMaps';
import {
  ColonyAction,
  ColonyAndExtensionsEvents,
  SystemMessagesName,
} from '~types';

import { MotionsPageEvent, ActionsPageEvent } from './ActionDetailsPageEvent';

const displayName =
  'common.ColonyActions.ActionDetailsPage.ActionDetailsPageFeed';

interface ActionsPageFeedProps {
  actionData: ColonyAction;
}

const ActionDetailsPageFeed = ({ actionData }: ActionsPageFeedProps) => {
  if (actionData.isMotion) {
    const messages = actionData.motionData?.messages;
    return (
      <>
        {messages?.map((message) => (
          <MotionsPageEvent
            actionData={actionData}
            motionMessageData={message}
            eventName={
              ColonyAndExtensionsEvents[message.name] ??
              SystemMessagesName[message.name]
            }
            key={message.messageKey}
          />
        ))}
      </>
    );
  }
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
