import React, { type FC } from 'react';

import { type ColonyAction, type Expenditure } from '~types/graphql.ts';
import { type MotionState } from '~utils/colonyMotions.ts';
import { formatText } from '~utils/intl.ts';
import ExpenditureActionStatusBadge from '~v5/common/ActionSidebar/partials/ExpenditureActionStatusBadge/ExpenditureActionStatusBadge.tsx';
import MotionOutcomeBadge from '~v5/common/ActionSidebar/partials/MotionOutcomeBadge/MotionOutcomeBadge.tsx';
import PillsBase from '~v5/common/Pills/PillsBase.tsx';

interface Props {
  action?: ColonyAction;
  isMotion: boolean;
  isMultiSig: boolean;
  motionState?: MotionState;
  expenditure?: Expenditure;
  loadingExpenditure?: boolean;
}

const displayName = 'v5.common.ActionSidebar.CompletedAction.Badges';

const Badges: FC<Props> = ({
  action,
  isMotion,
  isMultiSig,
  motionState,
  expenditure,
  loadingExpenditure,
}) => {
  return (
    <>
      {action &&
        !isMotion &&
        !isMultiSig &&
        !expenditure &&
        !loadingExpenditure && (
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
      {(!!(isMotion && action?.motionData?.motionStateHistory.endedAt) ||
        !!isMultiSig) &&
        motionState && <MotionOutcomeBadge motionState={motionState} />}
    </>
  );
};

Badges.displayName = displayName;

export default Badges;
