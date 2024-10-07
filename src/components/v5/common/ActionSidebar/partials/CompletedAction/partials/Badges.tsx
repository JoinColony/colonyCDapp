import React, { type FC } from 'react';

import { type ActionData } from '~actions/index.ts';
import { type Expenditure } from '~types/graphql.ts';
import { type MotionState } from '~utils/colonyMotions.ts';
import { formatText } from '~utils/intl.ts';
import ExpenditureActionStatusBadge from '~v5/common/ActionSidebar/partials/ExpenditureActionStatusBadge/ExpenditureActionStatusBadge.tsx';
import MotionOutcomeBadge from '~v5/common/ActionSidebar/partials/MotionOutcomeBadge/MotionOutcomeBadge.tsx';
import PillsBase from '~v5/common/Pills/PillsBase.tsx';

interface Props {
  actionData?: ActionData;
  isMotion: boolean;
  isMultiSig: boolean;
  motionState?: MotionState;
  expenditure?: Expenditure;
  loadingExpenditure?: boolean;
}

const displayName = 'v5.common.ActionSidebar.CompletedAction.Badges';

const Badges: FC<Props> = ({
  actionData: action,
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
      {(!!isMotion || !!isMultiSig) && motionState && (
        <MotionOutcomeBadge motionState={motionState} />
      )}
    </>
  );
};

Badges.displayName = displayName;

export default Badges;
