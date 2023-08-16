import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Placement } from '@popperjs/core';

import ListItem, { ListItemStatus } from '~shared/ListItem';
import UserAvatar from '~shared/UserAvatar';
import { useAppContext } from '~hooks';
import { DECISIONS_PREVIEW_ROUTE_SUFFIX as DECISIONS_PREVIEW } from '~routes';

import DraftDecisionActions from './DraftDecisionActions';

import { Draft as DraftTag } from '~shared/Tag';
import { DecisionDraft } from '~utils/decisions';

const displayName = 'common.ColonyDecisions.DraftDecisionItem';

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

export interface DraftDecisionItemProps {
  draftDecision: DecisionDraft;
}

const DraftDecisionItem = ({ draftDecision }: DraftDecisionItemProps) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user } = useAppContext();
  const walletAddress = user?.walletAddress || '';

  const redirectToPreview = () => navigate(`${pathname}${DECISIONS_PREVIEW}`);

  if (!draftDecision) {
    return null;
  }

  return (
    <ListItem
      extra={<DraftDecisionActions draftDecision={draftDecision} />}
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
      onClick={redirectToPreview}
      tag={<DraftTag />}
      title={draftDecision.title}
      status={ListItemStatus.Draft}
    />
  );
};

DraftDecisionItem.displayName = displayName;

export default DraftDecisionItem;
