import React from 'react';
import { useNavigate } from 'react-router-dom';
import { defineMessages } from 'react-intl';
import { Placement } from '@popperjs/core';
import { Id } from '@colony/colony-js';

import UserAvatar from '~shared/UserAvatar';
import ListItem, { ListItemStatus } from '~shared/ListItem';
import { ColonyAction, Domain } from '~types';
import { useColonyContext } from '~hooks';
import {
  MotionState,
  useShouldDisplayMotionCountdownTime,
} from '~utils/colonyMotions';
import { formatText } from '~utils/intl';

import CountDownTimer from '../CountDownTimer';
import { getActionTitleValues } from '../helpers';
import ActionsListItemMeta from './ActionsListItemMeta';
import { useColonyMotionState, useMotionTag } from './helpers';

const displayName = 'common.ColonyActions.ActionsListItem';

const MSG = defineMessages({
  domain: {
    id: `${displayName}.domain`,
    defaultMessage: 'Team {domainId}',
  },
});

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

interface Props {
  item: ColonyAction;
}

const getDomainName = (
  fromDomain?: Domain | null,
  motionDomain?: Domain | null,
): string => {
  if (!motionDomain) {
    const actionFallback = formatText(MSG.domain, {
      domainId: fromDomain?.id ?? Id.RootDomain,
    }) as string; // safe casting as we're using simple values

    return fromDomain?.metadata?.name ?? actionFallback;
  }

  const motionFallback = formatText(MSG.domain, {
    domainId: motionDomain.nativeId,
  }) as string; // safe casting as we're using simple values

  return motionDomain.metadata?.name ?? motionFallback;
};

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

  const handleActionRedirect = () =>
    navigate(`/colony/${colony?.name}/tx/${transactionHash}`);

  const status = ListItemStatus.Defused;

  const { motionState, refetchMotionState } = useColonyMotionState(
    isMotion,
    motionData,
    transactionHash,
  );

  const MotionTag = useMotionTag(isMotion, motionState);
  const showMotionCountdownTimer =
    useShouldDisplayMotionCountdownTime(motionState);

  if (!colony) {
    return null;
  }

  const domainName = getDomainName(fromDomain, motionData?.motionDomain);

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
        showMotionCountdownTimer &&
        motionData && (
          <CountDownTimer
            motionState={motionState as MotionState} // safe casting: if motionState is null, showMotionCountdownTimer will be false.
            motionId={motionData.motionId}
            motionStakes={motionData.motionStakes}
            refetchMotionState={refetchMotionState}
          />
        )
      }
      meta={<ActionsListItemMeta domainName={domainName} />}
      onClick={handleActionRedirect}
      status={status}
      tag={<MotionTag />}
      title={{ id: 'action.title' }}
      titleValues={getActionTitleValues(item, colony)}
    />
  );
};

ActionsListItem.displayName = displayName;

export default ActionsListItem;
