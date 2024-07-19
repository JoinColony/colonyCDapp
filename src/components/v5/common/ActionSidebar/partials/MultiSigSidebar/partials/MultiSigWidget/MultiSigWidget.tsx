import { WarningCircle } from '@phosphor-icons/react';
import { useMemo, type FC, useState, useEffect } from 'react';
import React from 'react';
import { defineMessages } from 'react-intl';

import { useDomainThreshold } from '~hooks/multiSig/useDomainThreshold.ts';
import { type MultiSigAction } from '~types/motions.ts';
import { notMaybe } from '~utils/arrays/index.ts';
import { formatText } from '~utils/intl.ts';
import { getRolesNeededForMultiSigAction } from '~utils/multiSig/index.ts';
import NotificationBanner from '~v5/shared/NotificationBanner/NotificationBanner.tsx';
import Stepper from '~v5/shared/Stepper/Stepper.tsx';

import ApprovalStep from './partials/ApprovalStep/ApprovalStep.tsx';
import FinalizeStep from './partials/FinalizeStep/FinalizeStep.tsx';
import { MultiSigState } from './types.ts';
import { getSignaturesPerRole } from './utils.ts';

const displayName =
  'v5.common.ActionSidebar.partials.MultiSig.partials.MultiSigWidget';

interface MultiSigWidgetProps {
  action: MultiSigAction;
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

const MultiSigWidget: FC<MultiSigWidgetProps> = ({ action }) => {
  const { type: actionType, multiSigData } = action;
  const requiredRoles =
    getRolesNeededForMultiSigAction({
      actionType,
      createdIn: Number(multiSigData.nativeMultiSigDomainId),
    }) || [];

  const { isLoading, thresholdPerRole } = useDomainThreshold({
    domainId: Number(multiSigData.nativeMultiSigDomainId),
    requiredRoles,
  });

  const signatures = (multiSigData?.signatures?.items ?? []).filter(notMaybe);

  const { approvalsPerRole, rejectionsPerRole } =
    getSignaturesPerRole(signatures);

  const isMultiSigFinalizable =
    Object.keys(approvalsPerRole).length > 0 &&
    Object.keys(approvalsPerRole).every((role) => {
      const approvals = approvalsPerRole[role]?.length || 0;
      if (!thresholdPerRole || !thresholdPerRole[role]) {
        return false;
      }
      const threshold = thresholdPerRole[role];
      return approvals >= threshold;
    });

  const isMultiSigCancelable =
    Object.keys(rejectionsPerRole).length > 0 &&
    Object.keys(rejectionsPerRole).every((role) => {
      const rejections = rejectionsPerRole[role]?.length || 0;
      if (!thresholdPerRole) {
        return false;
      }
      const threshold = thresholdPerRole[role] || 0;
      return rejections >= threshold;
    });

  const isMultiSigRejected = multiSigData.isRejected;
  const isMultiSigExecuted = multiSigData.isExecuted;

  const combinedThreshold = thresholdPerRole
    ? Object.values(thresholdPerRole).reduce(
        (acc, threshold) => acc + threshold,
        0,
      )
    : 0;

  const items = useMemo(() => {
    if (isLoading) {
      return [];
    }
    return [
      {
        key: MultiSigState.Approval,
        content: (
          <ApprovalStep
            thresholdPerRole={thresholdPerRole}
            multiSigData={multiSigData}
            actionType={actionType}
            initiatorAddress={action.initiatorAddress}
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
            isMultiSigFinalizable={isMultiSigFinalizable}
            isMultiSigCancelable={isMultiSigCancelable}
            // initiatorAddress={initiatorAddress}
            action={action}
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
    thresholdPerRole,
    multiSigData,
    actionType,
    action,
    combinedThreshold,
    isMultiSigFinalizable,
    isMultiSigCancelable,
  ]);

  const [activeStepKey, setActiveStepKey] = useState<MultiSigState>(
    MultiSigState.Approval,
  );

  useEffect(() => {
    if (
      isMultiSigFinalizable ||
      isMultiSigCancelable ||
      isMultiSigExecuted ||
      isMultiSigRejected
    ) {
      setActiveStepKey(MultiSigState.Finalize);
    }
  }, [
    isMultiSigFinalizable,
    isMultiSigRejected,
    isMultiSigExecuted,
    isMultiSigCancelable,
  ]);

  if (thresholdPerRole === null && !isLoading) {
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
