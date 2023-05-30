import React from 'react';

import {
  ColonyAction,
  ColonyAndExtensionsEvents,
  SystemMessages,
} from '~types';
import { notNull } from '~utils/arrays';

import MotionDetailsPageEvent from './MotionDetailsPageEvent/MotionDetailsPageEvent';

const displayName =
  'common.ColonyActions.ActionDetailsPage.MotionDetailsPageFeed';

interface MotionDetailsPageFeedProps {
  actionData: ColonyAction;
}

const MotionDetailsPageFeed = ({ actionData }: MotionDetailsPageFeedProps) => {
  const messages = actionData.motionData?.messages?.items.filter(notNull);
  return (
    <>
      {messages?.map((message) => (
        <MotionDetailsPageEvent
          actionData={actionData}
          motionMessageData={message}
          eventName={
            ColonyAndExtensionsEvents[message.name] ??
            SystemMessages[message.name]
          }
          key={message.messageKey}
        />
      ))}
    </>
  );
};

MotionDetailsPageFeed.displayName = displayName;

export default MotionDetailsPageFeed;
