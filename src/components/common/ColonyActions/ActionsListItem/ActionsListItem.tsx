import { Id } from '@colony/colony-js';
import { Placement } from '@popperjs/core';
import React from 'react';
import { defineMessages } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import {
  useColonyContext,
  TRANSACTION_STATUS,
  SafeMSGs,
  useSafeTransactionStatus,
  useShouldDisplayMotionCountdownTime,
} from '~hooks';
import ListItem, { ListItemStatus } from '~shared/ListItem';
import Tag from '~shared/Tag';
import UserAvatar from '~shared/UserAvatar';
import { ColonyAction, Domain } from '~types';
import { MotionState } from '~utils/colonyMotions';
import { formatText } from '~utils/intl';
import { isEmpty } from '~utils/lodash';

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
    });

    return fromDomain?.metadata?.name ?? actionFallback;
  }

  const motionFallback = formatText(MSG.domain, {
    domainId: motionDomain.nativeId,
  });

  return motionDomain.metadata?.name ?? motionFallback;
};

const ActionsListItem = ({
  item: {
    fromDomain: itemDomain,
    transactionHash,
    // commentCount = 0,
    // status = ListItemStatus.Defused,
    createdAt,
    isMotion,
    motionData,
    safeTransaction,
  },
  item,
}: Props) => {
  const { colony } = useColonyContext();
  const navigate = useNavigate();

  const handleActionRedirect = () =>
    navigate(`/${colony.name}?tx=${transactionHash}`);

  const status = ListItemStatus.Defused;

  const { motionState, refetchMotionState } = useColonyMotionState(
    isMotion,
    motionData,
  );

  const safeTransactionStatus = useSafeTransactionStatus(item);
  const isActionNeeded = !!safeTransactionStatus.find(
    (transactionStatus) =>
      transactionStatus === TRANSACTION_STATUS.ACTION_NEEDED,
  );

  const MotionTag = useMotionTag(isMotion, motionState);
  const showMotionCountdownTimer =
    useShouldDisplayMotionCountdownTime(motionState);

  const domainName = getDomainName(itemDomain, motionData?.motionDomain);

  const shouldDisplaySafeTransactionStatus =
    safeTransaction && !isEmpty(safeTransactionStatus);

  const ActionListItemTags = (
    <>
      <MotionTag />
      {shouldDisplaySafeTransactionStatus && (
        <Tag
          text={
            SafeMSGs[
              isActionNeeded
                ? TRANSACTION_STATUS.ACTION_NEEDED
                : TRANSACTION_STATUS.COMPLETED
            ]
          }
          appearance={{
            theme: isActionNeeded ? 'golden' : 'primary',
            colorSchema: 'fullColor',
          }}
        />
      )}
    </>
  );

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
      tag={ActionListItemTags}
      title={{ id: 'action.title' }}
      titleValues={getActionTitleValues(item, colony)}
    />
  );
};

ActionsListItem.displayName = displayName;

export default ActionsListItem;
