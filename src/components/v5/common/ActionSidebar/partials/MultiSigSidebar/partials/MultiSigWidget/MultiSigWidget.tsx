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
import {
  getIsMultiSigCancelable,
  getIsMultiSigExecutable,
  getSignaturesPerRole,
} from './utils.ts';

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

  const isMultiSigExecutable = getIsMultiSigExecutable(
    approvalsPerRole,
    thresholdPerRole,
  );
  const isMultiSigCancelable = getIsMultiSigCancelable(
    rejectionsPerRole,
    thresholdPerRole,
  );

  const isMultiSigRejected = multiSigData.isRejected;
  const isMultiSigExecuted = multiSigData.isExecuted;

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
            thresholdPerRole={thresholdPerRole}
            multiSigData={multiSigData}
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
  }, [isLoading, thresholdPerRole, multiSigData, actionType, action]);

  const [activeStepKey, setActiveStepKey] = useState<MultiSigState>(
    MultiSigState.Approval,
  );

  useEffect(() => {
    if (
      isMultiSigExecutable ||
      isMultiSigCancelable ||
      isMultiSigExecuted ||
      isMultiSigRejected
    ) {
      setActiveStepKey(MultiSigState.Finalize);
    }
  }, [
    isMultiSigExecutable,
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
