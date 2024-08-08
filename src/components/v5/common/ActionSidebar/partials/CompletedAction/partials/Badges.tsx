import React, { type FC } from 'react';

import { type ColonyAction, type Expenditure } from '~types/graphql.ts';
import { type MotionState } from '~utils/colonyMotions.ts';
import { formatText } from '~utils/intl.ts';
import PillsBase from '~v5/common/Pills/PillsBase.tsx';

import ExpenditureActionStatusBadge from '../../ExpenditureActionStatusBadge/ExpenditureActionStatusBadge.tsx';
import MotionOutcomeBadge from '../../MotionOutcomeBadge/MotionOutcomeBadge.tsx';

interface Props {
  action?: ColonyAction;
  isMotion: boolean;
  motionState: MotionState;
  expenditure?: Expenditure;
}

const displayName = 'v5.common.ActionSidebar.CompletedAction.Badges';

const Badges: FC<Props> = ({ action, isMotion, motionState, expenditure }) => {
  return (
    <>
      {action && !isMotion && !expenditure && (
        <PillsBase
          className="bg-success-100 text-success-400"
          isCapitalized={false}
        >
          {formatText({ id: 'action.passed' })}
        </PillsBase>
      )}
      {!!expenditure && (
        <ExpenditureActionStatusBadge
          expenditure={expenditure}
          withAdditionalStatuses
        />
      )}
      <MotionOutcomeBadge motionState={motionState} />
    </>
  );
};

Badges.displayName = displayName;

export default Badges;
