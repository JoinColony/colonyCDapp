import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Placement } from '@popperjs/core';

import ListItem, { ListItemStatus } from '~shared/ListItem';
import UserAvatar from '~shared/UserAvatar';
import { ColonyDecision } from '~types';
import { useAppContext } from '~hooks';
import { DECISIONS_PREVIEW_ROUTE_SUFFIX as DECISIONS_PREVIEW } from '~routes';

import DraftDecisionActions from './DraftDecisionActions';

import styles from './DraftDecisionItem.css';
import { Draft as DraftTag } from '~shared/Tag';

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
  decision: ColonyDecision;
}

const DraftDecisionItem = ({ decision }: DraftDecisionItemProps) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user } = useAppContext();
  const walletAddress = user?.walletAddress || '';

  const redirectToPreview = () => navigate(`${pathname}${DECISIONS_PREVIEW}`);

  if (!decision) {
    return null;
  }

  return (
    <div className={styles.draftDecision}>
      <ListItem
        extra={<DraftDecisionActions decision={decision} />}
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
        title={decision.title}
        status={ListItemStatus.Draft}
      />
    </div>
  );
};

DraftDecisionItem.displayName = displayName;

export default DraftDecisionItem;
