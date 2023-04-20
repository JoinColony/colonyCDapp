import React from 'react';
import { FormattedMessage } from 'react-intl';

import { ColonyAndExtensionsEvents } from '~types';
import {
  getMotionEventTitleValues,
  TransactionMeta,
} from '~common/ColonyActions';
import { useUserByNameOrAddress } from '~hooks';
import EventData from '../EventData';

import { MotionDetailsPageEventProps } from './MotionDetailsPageEvent';

const displayName = 'common.ColonyActions.ActionDetailsPage.ActionEventData';

type MotionEventDataProps = Pick<
  MotionDetailsPageEventProps,
  'actionData' | 'eventName' | 'motionMessageData'
>;

const MotionEventData = ({
  actionData: { createdAt, transactionHash },
  actionData,
  motionMessageData,
  eventName,
}: MotionEventDataProps) => {
  const { user: motionMessageInitiatorUser } = useUserByNameOrAddress(
    motionMessageData.initiatorAddress || '',
  );
  const messageId =
    eventName in ColonyAndExtensionsEvents
      ? 'event.title'
      : 'systemMessage.title';

  return (
    <EventData
      text={
        <FormattedMessage
          id={messageId}
          values={getMotionEventTitleValues(
            eventName,
            actionData,
            motionMessageData,
            motionMessageInitiatorUser,
          )}
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
