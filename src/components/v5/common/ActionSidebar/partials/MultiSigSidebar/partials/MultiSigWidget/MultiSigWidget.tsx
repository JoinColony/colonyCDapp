import { WarningCircle } from '@phosphor-icons/react';
import { useMemo, type FC, useState, useEffect } from 'react';
import React from 'react';
import { defineMessages } from 'react-intl';

import { MultiSigVote, type ColonyActionType } from '~gql';
import { useDomainThreshold } from '~hooks/multiSig/useDomainThreshold.ts';
import { type ColonyMultiSig } from '~types/graphql.ts';
import { notMaybe } from '~utils/arrays/index.ts';
import { formatText } from '~utils/intl.ts';
import NotificationBanner from '~v5/shared/NotificationBanner/NotificationBanner.tsx';
import Stepper from '~v5/shared/Stepper/Stepper.tsx';
import { getRolesNeededForMultiSigAction } from '~utils/multiSig.ts';

import ApprovalStep from './partials/ApprovalStep/ApprovalStep.tsx';
import FinalizeStep from './partials/FinalizeStep/FinalizeStep.tsx';
import { MultiSigState } from './types.ts';

const displayName =
  'v5.common.ActionSidebar.partials.MultiSig.partials.MultiSigWidget';

interface MultiSigWidgetProps {
  actionType: ColonyActionType;
  multiSigData: ColonyMultiSig;
  initiatorAddress: string;
}

const MSG = defineMessages({
  approvalLabel: {
    id: `${displayName}.approvalLabel`,
    defaultMessage: 'Approval',
  },
  finalizeLabel: {
    id: `${displayName}.finalizeLabel`,
    defaultMessage: 'Finalize',
  },
  invalidThreshold: {
    id: `${displayName}.invalidThreshold`,
    defaultMessage: 'Invalid threshold',
  },
});

const MultiSigWidget: FC<MultiSigWidgetProps> = ({
  multiSigData,
  actionType,
  initiatorAddress,
}) => {
  const requiredRoles = getRolesNeededForMultiSigAction(actionType);

  const { isLoading, threshold } = useDomainThreshold({
    domainId: Number(multiSigData.multiSigDomainId),
    requiredRoles,
  });

  const signatures = (multiSigData?.signatures?.items ?? []).filter(notMaybe);

  const approvalProgress = signatures.filter(
    (signature) => signature.vote === MultiSigVote.Approve,
  ).length;
  const rejectionProgress = signatures.filter(
    (signature) => signature.vote === MultiSigVote.Reject,
  ).length;

  const isMultiSigFinalizable =
    threshold && (approvalProgress || rejectionProgress) >= threshold;
  const isMultiSigExecuted = multiSigData.isExecuted;
  const isMultiSigRejected = multiSigData.isRejected;

  const items = useMemo(() => {
    if (isLoading) {
      return [];
    }
    return [
      {
        key: MultiSigState.Approval,
        content: (
          <ApprovalStep
            threshold={threshold || 0}
            multiSigData={multiSigData}
            actionType={actionType}
            initiatorAddress={initiatorAddress}
            createdAt={multiSigData.createdAt}
          />
        ),
        heading: {
          label: formatText(MSG.approvalLabel),
        },
      },
      {
        key: MultiSigState.Finalize,
        content: (
          <FinalizeStep
            threshold={threshold || 0}
            multiSigData={multiSigData}
            isMultiSigFinalizable={isMultiSigFinalizable || false}
            // initiatorAddress={initiatorAddress}
            createdAt={multiSigData.createdAt}
          />
        ),
        heading: {
          label: formatText(MSG.finalizeLabel),
        },
      },
    ];
  }, [
    isLoading,
    threshold,
    multiSigData,
    actionType,
    initiatorAddress,
    isMultiSigFinalizable,
  ]);

  const [activeStepKey, setActiveStepKey] = useState<MultiSigState>(
    MultiSigState.Approval,
  );

  useEffect(() => {
    if (isMultiSigFinalizable || isMultiSigExecuted || isMultiSigRejected) {
      setActiveStepKey(MultiSigState.Finalize);
    }
  }, [isMultiSigFinalizable, isMultiSigRejected, isMultiSigExecuted]);

  if (threshold === null && !isLoading) {
    console.warn('Invalid threshold');

    return (
      <NotificationBanner status="error" icon={WarningCircle}>
        {formatText(MSG.invalidThreshold)}
      </NotificationBanner>
    );
  }

  return (
    <div>
      <Stepper<MultiSigState>
        items={items}
        activeStepKey={activeStepKey}
        setActiveStepKey={setActiveStepKey}
      />
    </div>
  );
};

MultiSigWidget.displayName = displayName;
export default MultiSigWidget;
