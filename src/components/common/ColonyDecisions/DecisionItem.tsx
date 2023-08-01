import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Placement } from '@popperjs/core';

import ListItem, { ListItemStatus } from '~shared/ListItem';
import UserAvatar from '~shared/UserAvatar';
import { ColonyDecision } from '~types';
import { useUserByAddress } from '~hooks';

import { ListItemProps } from '~shared/ListItem/ListItem';

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

interface DecisionItemProps extends Pick<ListItemProps, 'tag' | 'status'> {
  decision: ColonyDecision;
}

const DecisionItem = ({
  decision: { actionId, walletAddress, title, createdAt },
  tag,
  status = ListItemStatus.Defused,
}: DecisionItemProps) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user } = useUserByAddress(walletAddress);
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
      onClick={() => navigate(`${pathname}/tx/${actionId}`)}
      tag={tag}
      title={title}
      status={status}
    />
  );
};

DecisionItem.displayName = displayName;

export default DecisionItem;
