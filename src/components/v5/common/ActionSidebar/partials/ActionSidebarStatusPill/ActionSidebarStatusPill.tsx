import React, { type FC } from 'react';

import { ColonyActionType } from '~gql';
import { formatText } from '~utils/intl.ts';
import PillsBase from '~v5/common/Pills/PillsBase.tsx';

import ExpenditureActionStatusBadge from '../ExpenditureActionStatusBadge/ExpenditureActionStatusBadge.tsx';
import MotionOutcomeBadge from '../MotionOutcomeBadge/MotionOutcomeBadge.tsx';
import StreamingPaymentStatusPill from '../StreamingPaymentStatusPill/StreamingPaymentStatusPill.tsx';

import { type ActionSidebarStatusPillProps } from './types.ts';

const ActionSidebarStatusPill: FC<ActionSidebarStatusPillProps> = ({
  action,
  isMotion,
  motionState,
  expenditure,
  streamingPaymentStatus,
  isMultiSig,
}) => {
  if (expenditure && action?.type === ColonyActionType.CreateExpenditure) {
    return (
      <ExpenditureActionStatusBadge
        expenditure={expenditure}
        withAdditionalStatuses
      />
    );
  }

  if (
    streamingPaymentStatus &&
    action?.type === ColonyActionType.CreateStreamingPayment
  ) {
    return <StreamingPaymentStatusPill status={streamingPaymentStatus} />;
  }

  if (isMotion || isMultiSig) {
    if (!motionState) {
      return null;
    }
    return <MotionOutcomeBadge motionState={motionState} />;
  }

  return action ? (
    <PillsBase
      className="bg-success-100 text-success-400"
      isCapitalized={false}
    >
      {formatText({ id: 'action.passed' })}
    </PillsBase>
  ) : null;
};

export default ActionSidebarStatusPill;
