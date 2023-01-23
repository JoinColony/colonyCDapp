import { Placement } from '@popperjs/core';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import ListItem, { ListItemStatus } from '~shared/ListItem';
import UserAvatar from '~shared/UserAvatar';
import { Decision } from '~types';
import { MotionState } from '~utils/colonyMotions';
import { useAppContext, useColonyContext } from '~hooks';
import { DECISIONS_PREVIEW_ROUTE_SUFFIX as DECISIONS_PREVIEW } from '~routes';

import DraftDecisionActions from './DraftDecisionActions';

import styles from './DraftDecisionItem.css';

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
  decision: Decision;
  setDecision: ReturnType<typeof useState>[1];
}

const DraftDecisionItem = ({
  decision,
  setDecision,
}: DraftDecisionItemProps) => {
  const navigate = useNavigate();
  const { colony } = useColonyContext();
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
        actions={
          <DraftDecisionActions decision={decision} setDecision={setDecision} />
        }
        avatar={
          <UserAvatar
            colony={colony}
            size="s"
            address={walletAddress}
            user={user}
            notSet={false}
            showInfo
            popperOptions={avatarPopoverOptions}
          />
        }
        onClick={redirectToPreview}
        tag={MotionState.Draft}
        title={decision.title}
        status={ListItemStatus.Draft}
      />
    </div>
  );
};

DraftDecisionItem.displayName = displayName;

export default DraftDecisionItem;
