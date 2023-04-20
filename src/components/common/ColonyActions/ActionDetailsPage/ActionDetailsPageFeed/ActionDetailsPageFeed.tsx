import React from 'react';

import { ColonyAction } from '~types';
// import { ACTIONS_EVENTS } from '../staticMaps';

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
  const events =
    JSON.parse(actionData.individualEvents as string) ||
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
