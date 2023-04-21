import React from 'react';
import { FormattedMessage } from 'react-intl';

import { ColonyAndExtensionsEvents } from '~types';
import {
  useGetMotionEventTitleValues,
  TransactionMeta,
} from '~common/ColonyActions';
import EventData from '../EventData';

import { MotionDetailsPageEventProps } from './MotionDetailsPageEvent';

const displayName = 'common.ColonyActions.ActionDetailsPage.MotionEventData';

type MotionEventDataProps = Pick<
  MotionDetailsPageEventProps,
  'actionData' | 'eventName' | 'motionMessageData'
>;

const MotionEventData = ({
  actionData: { createdAt, transactionHash },
  motionMessageData,
  eventName,
}: MotionEventDataProps) => {
  const messageId =
    eventName in ColonyAndExtensionsEvents
      ? 'event.title'
      : 'systemMessage.title';

  return (
    <EventData
      text={
        <FormattedMessage
          id={messageId}
          values={useGetMotionEventTitleValues(eventName, motionMessageData)}
        />
      }
      details={
        <TransactionMeta
          transactionHash={transactionHash}
          createdAt={createdAt}
        />
      }
    />
  );
};

MotionEventData.displayName = displayName;

export default MotionEventData;
