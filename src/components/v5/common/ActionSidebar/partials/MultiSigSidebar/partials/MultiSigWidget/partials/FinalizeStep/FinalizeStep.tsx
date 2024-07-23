import { isToday, isYesterday } from 'date-fns';
import React, { useState, type FC, useEffect } from 'react';
import { FormattedDate, defineMessages } from 'react-intl';

import { type ColonyMultiSigFragment } from '~gql';
import { type ColonyAction } from '~types/graphql.ts';
import { type Threshold } from '~types/multiSig.ts';
import { notMaybe } from '~utils/arrays/index.ts';
import { formatText } from '~utils/intl.ts';
import { handleMotionCompleted } from '~v5/common/ActionSidebar/utils.ts';
import MenuWithStatusText from '~v5/shared/MenuWithStatusText/MenuWithStatusText.tsx';
import { StatusTypes } from '~v5/shared/StatusText/consts.ts';

import FinalizeButton from '../../../FinalizeButton/FinalizeButton.tsx';
import {
  getIsMultiSigExecutable,
  getNumberOfApprovals,
  getNumberOfRejections,
  getSignaturesPerRole,
  hasWeekPassed,
} from '../../utils.ts';

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
  createdAt: string;
  thresholdPerRole: Threshold;
  action: ColonyAction;
}

const FinalizeStep: FC<FinalizeStepProps> = ({
  multiSigData,
  initiatorAddress,
  createdAt,
  action,
  thresholdPerRole,
}) => {
  const [isFinalizePending, setIsFinalizePending] = useState(false);
  const isMultiSigExecuted = multiSigData.isExecuted;
  const isMultiSigRejected = multiSigData.isRejected;
  const isMotionOlderThanWeek = hasWeekPassed(createdAt);
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

  if (isMultiSigExecuted) {
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
      handleMotionCompleted(action);
    }
  }, [isMultiSigExecuted, isMultiSigRejected, action]);

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
                        isPending={isFinalizePending}
                        setIsPending={setIsFinalizePending}
                        multiSigId={multiSigData.nativeMultiSigId}
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
                  {finalizedAt && (
                    <div className="flex items-center justify-between gap-2 text-sm">
                      <span className="text-gray-600">
                        {formatText(MSG.finalized)}
                      </span>
                      <span>{formatDate(finalizedAt)}</span>
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
