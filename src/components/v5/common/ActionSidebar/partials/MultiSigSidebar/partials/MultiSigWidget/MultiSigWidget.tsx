import { WarningCircle } from '@phosphor-icons/react';
import { useMemo, type FC, useState, useEffect } from 'react';
import React from 'react';
import { defineMessages } from 'react-intl';

import { useDomainThreshold } from '~hooks/multiSig/useDomainThreshold.ts';
import { type MultiSigAction } from '~types/motions.ts';
import { notMaybe } from '~utils/arrays/index.ts';
import { formatText } from '~utils/intl.ts';
import { getRolesNeededForMultiSigAction } from '~utils/multiSig/index.ts';
import MotionWidgetSkeleton from '~v5/shared/MotionWidgetSkeleton/MotionWidgetSkeleton.tsx';
import NotificationBanner from '~v5/shared/NotificationBanner/NotificationBanner.tsx';
import Stepper from '~v5/shared/Stepper/Stepper.tsx';

import ApprovalStep from './partials/ApprovalStep/ApprovalStep.tsx';
import FinalizeStep from './partials/FinalizeStep/FinalizeStep.tsx';
import { MultiSigState } from './types.ts';
import {
  getDomainIdForActionType,
  getIsMultiSigExecutable,
  getSignaturesPerRole,
} from './utils.ts';

const displayName =
  'v5.common.ActionSidebar.partials.MultiSig.partials.MultiSigWidget';

interface MultiSigWidgetProps {
  action: MultiSigAction;
  variant: 'stepper' | 'standalone';
  onMultiSigRejected?: () => void;
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
  action,
  variant,
  onMultiSigRejected,
}) => {
  const { type: actionType, multiSigData } = action;

  // this is only because managing permissions in a subdomain requires signees in the parent domain
  const requiredRoles = useMemo(() => {
    return (
      getRolesNeededForMultiSigAction({
        actionType,
        createdIn: Number(multiSigData.nativeMultiSigDomainId),
      }) || []
    );
  }, [actionType, multiSigData.nativeMultiSigDomainId]);

  const { isLoading, thresholdPerRole } = useDomainThreshold({
    domainId: getDomainIdForActionType(
      actionType,
      multiSigData.nativeMultiSigDomainId,
    ),
    requiredRoles,
  });

  const signatures = (multiSigData?.signatures?.items ?? []).filter(notMaybe);

  const { approvalsPerRole } = getSignaturesPerRole(signatures);

  const isMultiSigExecutable = getIsMultiSigExecutable(
    approvalsPerRole,
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
            actionType={actionType}
            thresholdPerRole={thresholdPerRole}
            multiSigData={multiSigData}
            requiredRoles={requiredRoles}
            initiatorAddress={action.initiatorAddress}
            onMultiSigRejected={onMultiSigRejected}
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
            initiatorAddress={action.initiatorAddress}
            action={action}
          />
        ),
        heading: {
          label: formatText(MSG.finalizeLabel),
        },
      },
    ];
  }, [
    isLoading,
    actionType,
    thresholdPerRole,
    multiSigData,
    requiredRoles,
    action,
    onMultiSigRejected,
  ]);

  const [activeStepKey, setActiveStepKey] = useState<MultiSigState>(
    isMultiSigExecutable || isMultiSigExecuted || isMultiSigRejected
      ? MultiSigState.Finalize
      : MultiSigState.Approval,
  );

  useEffect(() => {
    if (isMultiSigExecutable || isMultiSigExecuted || isMultiSigRejected) {
      setActiveStepKey(MultiSigState.Finalize);
    } else {
      setActiveStepKey(MultiSigState.Approval);
    }
  }, [isMultiSigExecutable, isMultiSigRejected, isMultiSigExecuted]);

  if (thresholdPerRole === null && !isLoading) {
    console.warn('Invalid threshold');

    return (
      <NotificationBanner status="error" icon={WarningCircle}>
        {formatText(MSG.invalidThreshold)}
      </NotificationBanner>
    );
  }

  if (variant === 'stepper') {
    return (
      <Stepper<MultiSigState>
        items={items}
        activeStepKey={activeStepKey}
        setActiveStepKey={setActiveStepKey}
      />
    );
  }

  // The stepper handles its own loading somehow
  if (isLoading) {
    return <MotionWidgetSkeleton />;
  }
  const activeItem = items.find((item) => item.key === activeStepKey);

  return activeItem?.content ?? null;
};

MultiSigWidget.displayName = displayName;
export default MultiSigWidget;
