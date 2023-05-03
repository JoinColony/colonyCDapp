import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Placement } from '@popperjs/core';

import UserAvatar from '~shared/UserAvatar';
import ListItem, { ListItemStatus } from '~shared/ListItem';
import { ColonyAction } from '~types';
import { useColonyContext } from '~hooks';

import { getActionTitleValues, getActionTitleMessageId } from '../helpers';
import ActionsListItemMeta from './ActionsListItemMeta';

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
  },
  item,
}: Props) => {
  const { colony } = useColonyContext();
  const navigate = useNavigate();

  const handleActionRedirect = () =>
    navigate(`/colony/${colony?.name}/tx/${transactionHash}`);

  // const { isVotingExtensionEnabled } = useEnabledExtensions({
  //   colonyAddress: colony?.colonyAddress,
  // });

  // const isForced = true; //isVotingExtensionEnabled && !actionType?.endsWith('Motion');
  // const tag = motionState || (isForced && MotionState.Forced) || MotionState.Invalid;

  // const displayCountdownTimer = shouldDisplayCountDownTimer(
  //   motionId,
  //   motionState,
  // );

  const status = ListItemStatus.Defused;

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
      // tag={tag}
      title={{ id: getActionTitleMessageId(item, colony) }}
      titleValues={getActionTitleValues(item, colony)}
    />
  );
};

ActionsListItem.displayName = displayName;

export default ActionsListItem;
