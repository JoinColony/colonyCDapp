import { WarningCircle } from '@phosphor-icons/react';
import { useMemo, type FC, useState, useEffect } from 'react';
import React from 'react';
import { defineMessages } from 'react-intl';

import { type ColonyActionType } from '~gql';
import { useDomainThreshold } from '~hooks/multiSig/useDomainThreshold.ts';
import {
  type MultiSigUserSignature,
  type ColonyMultiSig,
} from '~types/graphql.ts';
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

  const { isLoading, thresholdPerRole } = useDomainThreshold({
    domainId: Number(multiSigData.multiSigDomainId),
    requiredRoles,
  });

  if (thresholdPerRole === null && !isLoading) {
    console.warn('Invalid threshold');

    return (
      <NotificationBanner status="error" icon={WarningCircle}>
        {formatText(MSG.invalidThreshold)}
      </NotificationBanner>
    );
  }

  // @TODO: This wasn't handled in the UI issue
  if (isLoading) {
    return <div>Loading threshold</div>;
  }

  // @TODO: This wasn't handled in the UI issue
  if (thresholdPerRole === null) {
    console.warn('Invalid threshold');
    return <div>Invalid threshold, assign some stuff</div>;
  }

  const signatures = (multiSigData?.signatures?.items ?? []).filter(notMaybe);

  const approvalSignaturesPerRole = {};
  const rejectionSignaturesPerRole = {};
  const allApprovalSignees = new Set<MultiSigUserSignature['user']>();
  const allRejectionSignees = new Set<MultiSigUserSignature['user']>();

  signatures.forEach((signature) => {
    const { role, vote, user: voter } = signature;

    if (vote === 'Approve') {
      allApprovalSignees.add(voter);

      if (!approvalSignaturesPerRole[role]) {
        approvalSignaturesPerRole[role] = [];
      }
      approvalSignaturesPerRole[role].push(signature);
    } else if (vote === 'Reject') {
      allRejectionSignees.add(voter);

      if (!rejectionSignaturesPerRole[role]) {
        rejectionSignaturesPerRole[role] = [];
      }
      rejectionSignaturesPerRole[role].push(signature);
    }
  });

  const isMultiSigFinalizable = Object.keys(approvalSignaturesPerRole).every(
    (role) => {
      const approvals = approvalSignaturesPerRole[role]?.length || 0;
      const threshold = thresholdPerRole[role] || 0;
      return approvals >= threshold;
    },
    );
    
    const isMultiSigCancelable = Object.keys(rejectionSignaturesPerRole).every(
      (role) => {
      // @TODO: This doesn't look right = should be rejections and rejectionSignaturesPerRole?
      const approvals = approvalSignaturesPerRole[role]?.length || 0;
      const threshold = thresholdPerRole[role] || 0;
      return approvals >= threshold;
    },
  );

  const isMultiSigRejected = multiSigData.isRejected;
  const isMultiSigExecuted = multiSigData.isExecuted;

  const combinedThreshold = Object.values(thresholdPerRole).reduce(
    (acc, threshold) => acc + threshold,
    0,
  );

  let combinedApprovals = 0;
  Object.keys(approvalSignaturesPerRole).forEach((role) => {
    const approvalsForRole = approvalSignaturesPerRole[role]
      ? approvalSignaturesPerRole[role].length
      : 0;
    const thresholdForRole = thresholdPerRole[role];
    combinedApprovals += Math.min(approvalsForRole, thresholdForRole);
  });

  let combinedRejections = 0;
  Object.keys(approvalSignaturesPerRole).forEach((role) => {
    const rejectionsForRole = rejectionSignaturesPerRole[role]
      ? rejectionSignaturesPerRole[role].length
      : 0;
    const thresholdForRole = thresholdPerRole[role];
    combinedRejections += Math.min(rejectionsForRole, thresholdForRole);
  });

  const items = useMemo(() => {
    if (isLoading) {
      return [];
    }
    return [
      {
        key: MultiSigState.Approval,
        content: (
          <ApprovalStep
            threshold={combinedThreshold || 0}
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
            threshold={combinedThreshold || 0}
            multiSigData={multiSigData}
            isMultiSigFinalizable={isMultiSigFinalizable || isMultiSigCancelable || false}
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
    combinedThreshold,
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
