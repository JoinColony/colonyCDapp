import React from 'react';

import { ACTIONS_EVENTS } from '../staticMaps';
import {
  ColonyAction,
  ColonyAndExtensionsEvents,
  SystemMessagesName,
} from '~types';

import ActionsPageEvent from './ActionDetailsPageEvent';

const displayName =
  'common.ColonyActions.ActionDetailsPage.ActionDetailsPageFeed';

interface ActionsPageFeedProps {
  actionData: ColonyAction;
}

const ActionDetailsPageFeed = ({ actionData }: ActionsPageFeedProps) => {
  const messages = actionData.isMotion
    ? actionData.motionData?.messages
    : ACTIONS_EVENTS[actionData.type];
  return (
    <>
      {messages?.map((message) => (
        <ActionsPageEvent
          actionData={actionData}
          motionMessageData={message}
          eventName={
            ColonyAndExtensionsEvents[message.name] ??
            SystemMessagesName[message.name]
          }
          key={message.messageKey || message}
        />
      ))}
    </>
  );
};

ActionDetailsPageFeed.displayName = displayName;

export default ActionDetailsPageFeed;
