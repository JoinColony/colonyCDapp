import { SpinnerGap } from '@phosphor-icons/react';
import { isToday, isYesterday } from 'date-fns';
import React, { useState, type FC, useEffect } from 'react';
import { FormattedDate, defineMessages } from 'react-intl';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { MultiSigVote, type ColonyMultiSigFragment } from '~gql';
import { ActionTypes } from '~redux';
import { ActionForm } from '~shared/Fields/index.ts';
import { mapPayload } from '~utils/actions.ts';
import { notMaybe } from '~utils/arrays/index.ts';
import { formatText } from '~utils/intl.ts';
import Button from '~v5/shared/Button/Button.tsx';
import TxButton from '~v5/shared/Button/TxButton.tsx';
import MenuWithStatusText from '~v5/shared/MenuWithStatusText/MenuWithStatusText.tsx';
import { StatusTypes } from '~v5/shared/StatusText/consts.ts';

import FinalizeButton from '../../../FinalizeButton/FinalizeButton.tsx';
import { hasWeekPassed } from '../../utils.ts';

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
      'The creator can reject the action immediately without requiring approval.',
  },
  headingRejectedWeek: {
    id: `${displayName}.headingRejectedWeek`,
    defaultMessage:
      '7 days had passed, the action was rejected immediately without requiring approval.',
  },
  headingFinalizeCancel: {
    id: `${displayName}.finalizeCancel`,
    defaultMessage: 'Finalize to cancel the action.',
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
  isMultiSigFinalizable: boolean;
  // initiatorAddress: string;
  createdAt: string;
  threshold: number;
}

const FinalizeStep: FC<FinalizeStepProps> = ({
  multiSigData,
  isMultiSigFinalizable,
  // initiatorAddress,
  createdAt,
  threshold,
}) => {
  const [isFinalizePending, setIsFinalizePending] = useState(false);
  const { colony } = useColonyContext();
  const isMultiSigExecuted = multiSigData.isExecuted;
  const isMultiSigRejected = multiSigData.isRejected;
  const isMotionOlderThanWeek = hasWeekPassed(createdAt);
  // @TODO: Check for rejected initiator
  const isOwner = false;

  const signatures = (multiSigData?.signatures?.items ?? []).filter(notMaybe);
  const approvedSignaturesCount = signatures.filter(
    (signature) => signature.vote === MultiSigVote.Approve,
  ).length;
  const rejectedSignaturesCount = signatures.filter(
    (signature) => signature.vote === MultiSigVote.Reject,
  ).length;
  const finalizedAt = multiSigData.executedAt;

  let stepTitle = MSG.heading;

  if (isMultiSigExecuted) {
    stepTitle = MSG.headingSuccess;
  } else if (isMultiSigRejected && isOwner) {
    stepTitle = MSG.headingRejectedByOwner;
  } else if (isMultiSigRejected && isMotionOlderThanWeek) {
    stepTitle = MSG.headingRejectedWeek;
  } else if (isMultiSigRejected) {
    stepTitle = MSG.headingRejected;
  } else if (rejectedSignaturesCount === threshold && !isMultiSigRejected) {
    stepTitle = MSG.headingFinalizeCancel;
  } else if (approvedSignaturesCount === threshold && !isMultiSigRejected) {
    stepTitle = MSG.heading;
  } else {
    stepTitle = MSG.headingFinalizeBoth;
  }

  const transform = mapPayload(() => ({
    colonyAddress: colony.colonyAddress,
    motionId: multiSigData.nativeMultiSigId,
  }));

  useEffect(() => {
    if (isMultiSigExecuted || isMultiSigRejected) {
      setIsFinalizePending(false);
    }
  }, [isMultiSigExecuted, isMultiSigRejected]);

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
              {isMultiSigFinalizable &&
                !isMultiSigExecuted &&
                !isMultiSigRejected && (
                  <div className="flex flex-col gap-2">
                    {approvedSignaturesCount === threshold && (
                      <FinalizeButton
                        isPending={isFinalizePending}
                        setIsPending={setIsFinalizePending}
                        multiSigId={multiSigData.nativeMultiSigId}
                      />
                    )}
                    {rejectedSignaturesCount === threshold && (
                      <ActionForm
                        actionType={ActionTypes.MULTISIG_CANCEL}
                        onSuccess={() => setIsFinalizePending(true)}
                        onError={() => setIsFinalizePending(false)}
                        transform={transform}
                      >
                        {({ formState: { isSubmitting } }) =>
                          isFinalizePending || isSubmitting ? (
                            <TxButton
                              rounded="s"
                              isFullSize
                              text={{ id: 'button.pending' }}
                              icon={
                                <span className="ml-2 flex shrink-0">
                                  <SpinnerGap
                                    size={18}
                                    className="animate-spin"
                                  />
                                </span>
                              }
                              className="!px-4 !text-md"
                            />
                          ) : (
                            <Button type="submit" isFullSize>
                              {formatText(MSG.finalizeCancelButton)}
                            </Button>
                          )
                        }
                      </ActionForm>
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
                        approval: approvedSignaturesCount,
                        rejection: rejectedSignaturesCount,
                      })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 text-sm">
                    <span className="text-gray-600">
                      {formatText(MSG.finalized)}
                    </span>
                    <span>{finalizedAt && formatDate(finalizedAt)}</span>
                  </div>
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
