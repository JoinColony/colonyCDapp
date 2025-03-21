import { WarningCircle } from '@phosphor-icons/react';
import { useMemo, type FC, useState, useEffect } from 'react';
import React from 'react';
import { defineMessages } from 'react-intl';

import { useDomainThreshold } from '~hooks/multiSig/useDomainThreshold.ts';
import { notMaybe } from '~utils/arrays/index.ts';
import { formatText } from '~utils/intl.ts';
import { getRolesNeededForMultiSigAction } from '~utils/multiSig/index.ts';
import { type ICompletedMultiSigAction } from '~v5/common/ActionSidebar/partials/MultiSigSidebar/types.ts';
import MotionWidgetSkeleton from '~v5/shared/MotionWidgetSkeleton/MotionWidgetSkeleton.tsx';
import NotificationBanner from '~v5/shared/NotificationBanner/NotificationBanner.tsx';
import Stepper from '~v5/shared/Stepper/Stepper.tsx';

import { MultiSigStep } from './partials/MultiSigStep/index.ts';
import { MultiSigState } from './types.ts';
import {
  getDomainIdForActionType,
  getIsMultiSigExecutable,
  getSignaturesPerRole,
} from './utils.ts';

const displayName =
  'v5.common.ActionSidebar.partials.MultiSig.partials.MultiSigWidget';

export interface MultiSigWidgetProps extends ICompletedMultiSigAction {
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
  multiSigData,
  onMultiSigRejected,
}) => {
  const { type: actionType } = action;

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
          <MultiSigStep.Approval
            thresholdPerRole={thresholdPerRole}
            requiredRoles={requiredRoles}
            initiatorAddress={action.initiatorAddress}
            onMultiSigRejected={onMultiSigRejected}
            action={action}
            multiSigData={multiSigData}
          />
        ),
        heading: {
          label: formatText(MSG.approvalLabel),
        },
      },
      {
        key: MultiSigState.Finalize,
        content: (
          <MultiSigStep.Finalize
            action={action}
            multiSigData={multiSigData}
            initiatorAddress={action.initiatorAddress}
            thresholdPerRole={thresholdPerRole}
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
