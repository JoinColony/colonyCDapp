import { isToday, isYesterday } from 'date-fns';
import React, { useState, type FC, useEffect } from 'react';
import { FormattedDate, defineMessages } from 'react-intl';

import { type ActionData } from '~actions';
import { type ColonyMultiSigFragment } from '~gql';
import useCurrentBlockTime from '~hooks/useCurrentBlockTime.ts';
import { type Threshold } from '~types/multiSig.ts';
import { notMaybe } from '~utils/arrays/index.ts';
import { formatText } from '~utils/intl.ts';
import FinalizeButton from '~v5/common/ActionSidebar/partials/MultiSigSidebar/partials/FinalizeButton/FinalizeButton.tsx';
import {
  getIsMultiSigExecutable,
  getNumberOfApprovals,
  getNumberOfRejections,
  getSignaturesPerRole,
  hasWeekPassed,
} from '~v5/common/ActionSidebar/partials/MultiSigSidebar/partials/MultiSigWidget/utils.ts';
import { handleMotionCompleted } from '~v5/common/ActionSidebar/utils.ts';
import MenuWithStatusText from '~v5/shared/MenuWithStatusText/MenuWithStatusText.tsx';
import { StatusTypes } from '~v5/shared/StatusText/consts.ts';

const displayName =
  'v5.common.ActionSidebar.partials.MultiSig.partials.MultiSigWidget.partials.FinalizeStep';

const MSG = defineMessages({
  todayAt: {
    id: `${displayName}.todayAt`,
    defaultMessage: 'Today at',
  },
  yestardayAt: {
    id: `${displayName}.yestardayAt`,
    defaultMessage: 'Yesterday at',
  },
  at: {
    id: `${displayName}.at`,
    defaultMessage: 'at',
  },
  heading: {
    id: `${displayName}.heading`,
    defaultMessage: 'Finalize to execute the agreed transactions.',
  },
  headingSuccess: {
    id: `${displayName}.headingSuccess`,
    defaultMessage: 'Action was approved and executed.',
  },
  headingFailed: {
    id: `${displayName}.headingFailed`,
    defaultMessage: "Action was approved but couldn't be executed.",
  },
  headingRejected: {
    id: `${displayName}.headingRejected`,
    defaultMessage: 'Action was rejected and cannot be executed.',
  },
  headingRejectedByOwner: {
    id: `${displayName}.headingRejectedByOwner`,
    defaultMessage:
      'The creator rejected the action immediately without requiring approval.',
  },
  headingRejectedWeek: {
    id: `${displayName}.headingRejectedWeek`,
    defaultMessage:
      '7 days had passed, the action was rejected immediately without requiring approval.',
  },
  headingFinalizeBoth: {
    id: `${displayName}.finalizeBoth`,
    defaultMessage: 'Finalize to cancel or execute the action.',
  },
  overview: {
    id: `${displayName}.overview`,
    defaultMessage: 'Overview',
  },
  outcome: {
    id: `${displayName}.outcome`,
    defaultMessage: 'Outcome',
  },
  outcomeValue: {
    id: `${displayName}.outcomeValue`,
    defaultMessage:
      '{approval} {approval, plural, one {approval} other {approvals}} / {rejection} {rejection, plural, one {rejection} other {rejections}}',
  },
  finalized: {
    id: `${displayName}.finalized`,
    defaultMessage: 'Finalized',
  },
  finalizeCancelButton: {
    id: `${displayName}.finalizeCancelButton`,
    defaultMessage: 'Finalize cancel',
  },
  finalizedNotExecuted: {
    id: `${displayName}.finalizedNotExecuted`,
    defaultMessage: 'Not executed',
  },
  notExecutedReasonLabel: {
    id: `${displayName}.notExecutedReasonLabel`,
    defaultMessage: 'Reason',
  },
  notExecutedReasonValue: {
    id: `${displayName}.notExecutedReasonValue`,
    defaultMessage: 'Execution failed beyond timeout',
  },
});

const formatDate = (value: string | undefined) => {
  if (!value) {
    return undefined;
  }

  const date = new Date(value);

  if (isToday(date)) {
    return (
      <>
        {formatText(MSG.todayAt)}{' '}
        <FormattedDate value={date} hour="numeric" minute="numeric" />
      </>
    );
  }

  if (isYesterday(date)) {
    return (
      <>
        {formatText(MSG.yestardayAt)}{' '}
        <FormattedDate value={date} hour="numeric" minute="numeric" />
      </>
    );
  }

  return (
    <>
      <FormattedDate value={date} day="numeric" month="short" year="numeric" />{' '}
      {formatText(MSG.at)}{' '}
      <FormattedDate value={date} hour="numeric" minute="numeric" />
    </>
  );
};

interface FinalizeStepProps {
  multiSigData: ColonyMultiSigFragment;
  initiatorAddress: string;
  thresholdPerRole: Threshold;
  actionData: ActionData;
}

const FinalizeStep: FC<FinalizeStepProps> = ({
  multiSigData,
  initiatorAddress,
  actionData,
  thresholdPerRole,
}) => {
  const { createdAt } = multiSigData;
  const [isFinalizePending, setIsFinalizePending] = useState(false);

  const { currentBlockTime } = useCurrentBlockTime();
  const isMotionOlderThanWeek = currentBlockTime
    ? hasWeekPassed(createdAt, currentBlockTime * 1000)
    : false;

  const isMultiSigExecuted = multiSigData.isExecuted;
  const hasMultiSigActionCompleted = multiSigData.hasActionCompleted;
  const isMultiSigRejected = multiSigData.isRejected;
  // used if failing execution after a week
  const isMultiSigFailingExecution =
    isMultiSigExecuted && !hasMultiSigActionCompleted;

  const rejectedByOwner = multiSigData.rejectedBy === initiatorAddress;

  const signatures = (multiSigData?.signatures?.items ?? []).filter(notMaybe);

  const { approvalsPerRole, rejectionsPerRole } =
    getSignaturesPerRole(signatures);

  const numberOfApprovals = getNumberOfApprovals(
    approvalsPerRole,
    thresholdPerRole,
  );
  const numberOfRejections = getNumberOfRejections(
    rejectionsPerRole,
    thresholdPerRole,
  );
  const isMultiSigExecutable = getIsMultiSigExecutable(
    approvalsPerRole,
    thresholdPerRole,
  );

  let finalizedAt;

  if (isMultiSigRejected) {
    finalizedAt = multiSigData.rejectedAt;
  }

  if (isMultiSigExecuted) {
    finalizedAt = multiSigData.executedAt;
  }

  let stepTitle = MSG.heading;

  if (isMultiSigFailingExecution) {
    stepTitle = MSG.headingFailed;
  } else if (isMultiSigExecuted) {
    stepTitle = MSG.headingSuccess;
  } else if (isMultiSigRejected && rejectedByOwner) {
    stepTitle = MSG.headingRejectedByOwner;
  } else if (isMultiSigRejected && isMotionOlderThanWeek) {
    stepTitle = MSG.headingRejectedWeek;
  } else if (isMultiSigRejected) {
    stepTitle = MSG.headingRejected;
  } else if (isMultiSigExecutable && !isMultiSigRejected) {
    stepTitle = MSG.heading;
  } else {
    stepTitle = MSG.headingFinalizeBoth;
  }

  useEffect(() => {
    if (isMultiSigExecuted || isMultiSigRejected) {
      setIsFinalizePending(false);
    }
    if (isMultiSigExecuted) {
      handleMotionCompleted(actionData);
    }
  }, [isMultiSigExecuted, isMultiSigRejected, actionData]);

  return (
    <MenuWithStatusText
      statusTextSectionProps={{
        status: StatusTypes.Info,
        children: formatText(stepTitle),
        textClassName: 'text-4 text-gray-900',
        iconAlignment: 'top',
        iconSize: 16,
        iconClassName: 'text-gray-500',
      }}
      sections={[
        {
          key: 'signatories',
          content: (
            <div>
              {isMultiSigExecutable &&
                !isMultiSigExecuted &&
                !isMultiSigRejected && (
                  <div className="flex flex-col gap-2">
                    {isMultiSigExecutable && (
                      <FinalizeButton
                        isMotionOlderThanAWeek={isMotionOlderThanWeek}
                        isPending={isFinalizePending}
                        setIsPending={setIsFinalizePending}
                        multiSigId={multiSigData.nativeMultiSigId}
                        actionData={actionData}
                      />
                    )}
                  </div>
                )}
              {(isMultiSigExecuted || isMultiSigRejected) && (
                <>
                  <h5 className="mb-2 text-1">{formatText(MSG.overview)}</h5>
                  <div className="mb-2 flex items-center justify-between gap-2 text-sm">
                    <span className="text-gray-600">
                      {formatText(MSG.outcome)}
                    </span>
                    <span>
                      {formatText(MSG.outcomeValue, {
                        approval: numberOfApprovals,
                        rejection: numberOfRejections,
                      })}
                    </span>
                  </div>
                  {isMultiSigFailingExecution ? (
                    <>
                      <div className="mb-2 flex items-center justify-between gap-2 text-sm">
                        <span className="text-gray-600">
                          {formatText(MSG.finalized)}
                        </span>
                        <span>{formatText(MSG.finalizedNotExecuted)}</span>
                      </div>
                      <div className="flex items-center justify-between gap-2 text-sm">
                        <span className="text-gray-600">
                          {formatText(MSG.notExecutedReasonLabel)}
                        </span>
                        <span>{formatText(MSG.notExecutedReasonValue)}</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-between gap-2 text-sm">
                      <span className="text-gray-600">
                        {formatText(MSG.finalized)}
                      </span>
                      <span>{finalizedAt && formatDate(finalizedAt)}</span>
                    </div>
                  )}
                </>
              )}
            </div>
          ),
          className: '!p-[1.125rem]',
        },
      ]}
    />
  );
};

export default FinalizeStep;
