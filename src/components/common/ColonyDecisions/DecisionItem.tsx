import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Placement } from '@popperjs/core';

import ListItem, { ListItemStatus } from '~shared/ListItem';
import UserAvatar from '~shared/UserAvatar';
import { ColonyDecision } from '~types';
import { useUserByAddress } from '~hooks';

import { useGetColonyActionQuery } from '~gql';
import {
  useColonyMotionState,
  useMotionTag,
} from '~common/ColonyActions/ActionsListItem/helpers';
import CountDownTimer from '~common/ColonyActions/CountDownTimer/CountDownTimer';
import {
  MotionState,
  useShouldDisplayMotionCountdownTime,
} from '~utils/colonyMotions';

const displayName = 'common.ColonyDecisions.DecisionItem';

const avatarPopoverOptions = {
  showArrow: false,
  placement: 'bottom-start' as Placement,
  modifiers: [
    {
      name: 'offset',
      options: {
        offset: [-20, 30],
      },
    },
  ],
};

interface DecisionItemProps {
  decision: ColonyDecision;
}

const DecisionItem = ({
  decision: { actionId, walletAddress, title, createdAt },
}: DecisionItemProps) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user } = useUserByAddress(walletAddress);

  const { data } = useGetColonyActionQuery({
    skip: !actionId,
    variables: { transactionHash: actionId },
  });

  const motionData = data?.getColonyAction?.motionData;

  const { motionState, refetchMotionState } = useColonyMotionState(
    true,
    motionData,
  );

  const showMotionCountdownTimer =
    useShouldDisplayMotionCountdownTime(motionState);

  const MotionTag = useMotionTag(true, motionState);
  return (
    <ListItem
      avatar={
        <UserAvatar
          size="s"
          address={walletAddress}
          user={user}
          notSet={false}
          showInfo
          popperOptions={avatarPopoverOptions}
        />
      }
      createdAt={createdAt}
      extra={
        showMotionCountdownTimer &&
        motionData && (
          <CountDownTimer
            motionState={motionState as MotionState} // safe casting: if motionState is null, showMotionCountdownTimer will be false.
            refetchMotionState={refetchMotionState}
            motionId={motionData.motionId}
            motionStakes={motionData.motionStakes}
          />
        )
      }
      onClick={() => navigate(`${pathname}?tx=${actionId}`)}
      tag={<MotionTag />}
      title={title}
      status={ListItemStatus.Defused}
    />
  );
};

DecisionItem.displayName = displayName;

export default DecisionItem;
