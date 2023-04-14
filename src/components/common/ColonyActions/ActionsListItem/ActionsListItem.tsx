import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Placement } from '@popperjs/core';

import UserAvatar from '~shared/UserAvatar';
import ListItem, { ListItemStatus } from '~shared/ListItem';
import { ColonyAction } from '~types';
import { useColonyContext, useEnabledExtensions } from '~hooks';

import { getActionTitleValues } from '../helpers';
import ActionsListItemMeta from './ActionsListItemMeta';
import { useMotionTag } from './helpers';

const displayName = 'common.ColonyActions.ActionsListItem';

const userAvatarPopoverOptions = {
  showArrow: false,
  placement: 'bottom-start' as Placement,
  modifiers: [
    {
      name: 'offset',
      options: {
        offset: [-20, 10],
      },
    },
  ],
};

// const isFullyNayStaked = (totalNayStake?: string, requiredStake?: string) =>
//   BigNumber.from(totalNayStake || 0).gte(BigNumber.from(requiredStake || 0));

// const shouldDisplayCountDownTimer = (motionId, motionState) => {
//   const isMotionFinished =
//     motionState === MotionState.Passed ||
//     motionState === MotionState.Failed ||
//     motionState === MotionState.FailedNoFinalizable;

//   return motionId && !isMotionFinished;
// };

interface Props {
  item: ColonyAction;
}

const ActionsListItem = ({
  item: {
    fromDomain,
    transactionHash,
    // commentCount = 0,
    // status = ListItemStatus.Defused,
    createdAt,
    isMotion,
    motionData,
  },
  item,
}: Props) => {
  const { colony } = useColonyContext();
  const navigate = useNavigate();

  if (!colony) {
    return null;
  }

  const handleActionRedirect = () =>
    navigate(`/colony/${colony?.name}/tx/${transactionHash}`);

  // const displayCountdownTimer = shouldDisplayCountDownTimer(
  //   motionId,
  //   motionState,
  // );

  const status = ListItemStatus.Defused;
  const { isVotingReputationEnabled } = useEnabledExtensions();
  const MotionTag = useMotionTag(isMotion, motionData);
  const showMotionTag = isVotingReputationEnabled && !!MotionTag;

  return (
    <ListItem
      avatar={
        <UserAvatar
          size="s"
          user={item.initiatorUser}
          showInfo
          popperOptions={userAvatarPopoverOptions}
        />
      }
      createdAt={createdAt}
      extra={
        null // displayCountdownTimer && (
        //   <CountdownTimer
        //     state={motionState as MotionState}
        //     motionId={Number(motionId)}
        //     isFullyNayStaked={isFullyNayStaked(totalNayStake, requiredStake)}
        //   />
        // )
      }
      meta={<ActionsListItemMeta fromDomain={fromDomain ?? undefined} />}
      onClick={handleActionRedirect}
      status={status}
      tag={showMotionTag ? <MotionTag /> : undefined}
      title={{ id: 'action.title' }}
      titleValues={getActionTitleValues(item, colony)}
    />
  );
};

ActionsListItem.displayName = displayName;

export default ActionsListItem;
