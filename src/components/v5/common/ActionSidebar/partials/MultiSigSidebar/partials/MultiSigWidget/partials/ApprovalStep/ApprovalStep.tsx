import clsx from 'clsx';
import React, { useState, type FC, useEffect } from 'react';
import { defineMessages } from 'react-intl';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import {
  type ColonyActionType,
  type ColonyMultiSigFragment,
  MultiSigVote,
} from '~gql';
import { useEligibleSignees } from '~hooks/multiSig/useEligibleSignees.ts';
import Tooltip from '~shared/Extensions/Tooltip/Tooltip.tsx';
import { notMaybe } from '~utils/arrays/index.ts';
import { formatText } from '~utils/intl.ts';
import { getMultiSigRequiredRole } from '~utils/multiSig.ts';
import MenuWithStatusText from '~v5/shared/MenuWithStatusText/MenuWithStatusText.tsx';
import ProgressBar from '~v5/shared/ProgressBar/ProgressBar.tsx';
import { StatusTypes } from '~v5/shared/StatusText/consts.ts';
import StatusText from '~v5/shared/StatusText/StatusText.tsx';

import CancelButton from '../../../CancelButton/CancelButton.tsx';
import RemoveVoteButton from '../../../RemoveVoteButton/RemoveVoteButton.tsx';
import Signees from '../../../Signees/Signees.tsx';
import VoteButton from '../../../VoteButton/VoteButton.tsx';
import { VoteExpectedStep } from '../../types.ts';
import { hasWeekPassed } from '../../utils.ts';
import MultiSigPills from '../MultiSigPills/MultiSigPills.tsx';

const displayName =
  'v5.common.ActionSidebar.partials.MultiSig.partials.MultiSigWidget.partials.ApprovalStep';

interface ApprovalStepProps {
  threshold: number;
  actionType: ColonyActionType;
  multiSigData: ColonyMultiSigFragment;
  initiatorAddress: string;
  createdAt: string;
}

const MSG = defineMessages({
  heading: {
    id: `${displayName}.heading`,
    defaultMessage:
      '{threshold} {threshold, plural, one {signature is} other {signatures are}} required to approve the action',
  },
  approvals: {
    id: `${displayName}.approvals`,
    defaultMessage: 'Approvals',
  },
  rejections: {
    id: `${displayName}.rejections`,
    defaultMessage: 'Rejections',
  },
  additionalText: {
    id: `${displayName}.additionalText`,
    defaultMessage: 'of {threshold}',
  },
  creatorRejection: {
    id: `${displayName}.creatorRejection`,
    defaultMessage:
      'As the creator, “Reject” will immediately cancel the action without requiring approval',
  },
  weekRejection: {
    id: `${displayName}.weekRejection`,
    defaultMessage:
      '7 days have passed, “Reject” will immediately cancel the action without requiring approval',
  },
  tooltip: {
    id: `${displayName}.tooltip`,
    defaultMessage:
      'Only members with {permission} permission or higher in the team can approve.',
  },
  title: {
    id: `${displayName}.title`,
    defaultMessage: 'Signatories',
  },
  signed: {
    id: `${displayName}.signed`,
    defaultMessage: 'You signed:',
  },
  change: {
    id: `${displayName}.change`,
    defaultMessage: 'Make a change',
  },
  changeDescription: {
    id: `${displayName}.change.description`,
    defaultMessage: 'You can remove or change your signature',
  },
});

const ApprovalStep: FC<ApprovalStepProps> = ({
  threshold,
  actionType,
  multiSigData,
  initiatorAddress,
  createdAt,
}) => {
  const { user } = useAppContext();
  const [activeStep, setActiveStep] = useState<VoteExpectedStep | null>(null);
  const [expectedStep, setExpectedStep] = useState<VoteExpectedStep | null>(
    null,
  );
  const [currentVote, setCurrentVote] = useState<MultiSigVote | null>(null);

  const isOwner = user?.walletAddress === initiatorAddress;

  const requiredRole = getMultiSigRequiredRole(actionType);
  const { eligibleSignees } = useEligibleSignees({
    domainId: multiSigData.multiSigDomainId,
    requiredRole,
  });
  const voteOrder = {
    [MultiSigVote.None]: 2,
    [MultiSigVote.Approve]: 0,
    [MultiSigVote.Reject]: 1,
  };

  const signatures = (multiSigData?.signatures?.items ?? []).filter(notMaybe);
  const notSignedUsers = (eligibleSignees ?? [])
    .filter((eligibleSignee) => {
      return !signatures.find(
        (signature) => signature.userAddress === eligibleSignee?.targetAddress,
      );
    })
    .map((eligibleSignee) => {
      return {
        userAddress: eligibleSignee?.targetAddress,
        user: {
          profile: eligibleSignee?.targetUser?.profile,
        },
        vote: MultiSigVote.None,
      };
    });
  const allSignatures = [...signatures, ...notSignedUsers].sort((a, b) => {
    const voteComparison = voteOrder[a.vote] - voteOrder[b.vote];

    if (voteComparison !== 0) {
      return voteComparison;
    }

    return (
      a.user.profile?.displayName?.localeCompare(
        b.user.profile?.displayName ?? '',
      ) ?? 0
    );
  });

  const userSignature = signatures.find(
    (signature) => signature?.userAddress === user?.walletAddress,
  );

  const canUserSign = eligibleSignees.some(
    (signature) => signature?.targetAddress === user?.walletAddress,
  );
  const hasApprovalVotes = signatures.some(
    (signature) => signature.vote === MultiSigVote.Approve,
  );
  const hasRejectionVotes = signatures.some(
    (signature) => signature.vote === MultiSigVote.Reject,
  );
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
  const isMultiSigInFinalizeState =
    isMultiSigFinalizable || isMultiSigExecuted || isMultiSigRejected;

  useEffect(() => {
    if (userSignature) {
      setActiveStep(VoteExpectedStep.cancel);
      setCurrentVote(null);
    } else {
      setActiveStep(VoteExpectedStep.vote);
    }

    if (expectedStep === activeStep) {
      setExpectedStep(null);
    }
  }, [activeStep, expectedStep, userSignature]);

  const isMotionOlderThanWeek = hasWeekPassed(createdAt);

  return (
    <MenuWithStatusText
      statusTextSectionProps={{
        status: StatusTypes.Info,
        children: formatText(MSG.heading, {
          threshold,
        }),
        content: (
          <>
            <div className="ml-[1.375rem] mt-1">
              {hasRejectionVotes && !hasApprovalVotes ? null : (
                <div className="flex items-center gap-2.5">
                  {hasApprovalVotes && hasRejectionVotes && (
                    <span className="text-4">{formatText(MSG.approvals)}</span>
                  )}
                  <ProgressBar
                    progress={approvalProgress}
                    max={threshold}
                    additionalText={formatText(MSG.additionalText, {
                      threshold,
                    })}
                    className="ml-[0.125rem] !text-xs"
                    isTall
                  />
                </div>
              )}
              {hasRejectionVotes && (
                <div
                  className={clsx('flex items-center gap-2.5', {
                    'mt-1': hasApprovalVotes,
                  })}
                >
                  {hasApprovalVotes && hasRejectionVotes && (
                    <span className="text-4">{formatText(MSG.rejections)}</span>
                  )}
                  <ProgressBar
                    progress={rejectionProgress}
                    max={threshold}
                    additionalText={formatText(MSG.additionalText, {
                      threshold,
                    })}
                    className="ml-[0.125rem] !text-xs"
                    isTall
                  />
                </div>
              )}
            </div>
            {isOwner && allSignatures.length > 5 && (
              <div className="mt-2">
                <StatusText
                  status={StatusTypes.Info}
                  textClassName="text-4 text-gray-900"
                  iconAlignment="top"
                  iconSize={16}
                  iconClassName="text-gray-500"
                >
                  {formatText(MSG.creatorRejection)}
                </StatusText>
              </div>
            )}
            {isMotionOlderThanWeek && (
              <div className="mt-2">
                <StatusText
                  status={StatusTypes.Info}
                  textClassName="text-4 text-gray-900"
                  iconAlignment="top"
                  iconSize={16}
                  iconClassName="text-gray-500"
                >
                  {formatText(MSG.weekRejection)}
                </StatusText>
              </div>
            )}
          </>
        ),
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
              <Tooltip
                placement="bottom-start"
                offset={[0, 4]}
                tooltipContent={formatText(MSG.tooltip, {
                  permission: requiredRole,
                })}
              >
                <h5 className="mb-2 text-1">{formatText(MSG.title)}</h5>
              </Tooltip>
              <Signees signees={allSignatures} />
              {!isMultiSigInFinalizeState && canUserSign && (
                <>
                  {userSignature ? (
                    <>
                      <div className="my-6 h-px w-full bg-gray-200" />
                      <div className="mb-4 flex items-center justify-between gap-2">
                        <span className="text-1">{formatText(MSG.signed)}</span>
                        <MultiSigPills multiSigState={userSignature.vote} />
                      </div>
                      <h5 className="mb-1 text-1">{formatText(MSG.change)}</h5>
                      <p className="mb-4 text-sm text-gray-600">
                        {formatText(MSG.changeDescription)}
                      </p>
                      <RemoveVoteButton
                        setExpectedStep={setExpectedStep}
                        isPending={expectedStep === VoteExpectedStep.vote}
                        actionType={actionType}
                        multiSigId={multiSigData.nativeMultiSigId}
                        multiSigDomainId={Number(
                          multiSigData.nativeMultiSigDomainId,
                        )}
                      />
                    </>
                  ) : (
                    <div className="mt-6 flex flex-col gap-2">
                      <VoteButton
                        actionType={actionType}
                        multiSigId={multiSigData.nativeMultiSigId}
                        multiSigDomainId={Number(
                          multiSigData.nativeMultiSigDomainId,
                        )}
                        isPending={
                          expectedStep === VoteExpectedStep.cancel &&
                          currentVote === MultiSigVote.Approve
                        }
                        setExpectedStep={setExpectedStep}
                        setCurrentVote={setCurrentVote}
                        voteType={MultiSigVote.Approve}
                        buttonProps={{
                          disabled: expectedStep === VoteExpectedStep.cancel,
                        }}
                      />
                      {(isOwner && allSignatures.length > 5) ||
                      isMotionOlderThanWeek ? (
                        <CancelButton
                          multiSigId={multiSigData.nativeMultiSigId}
                          isPending={
                            expectedStep === VoteExpectedStep.cancel &&
                            currentVote === MultiSigVote.Reject
                          }
                          setExpectedStep={setExpectedStep}
                        />
                      ) : (
                        <VoteButton
                          actionType={actionType}
                          multiSigId={multiSigData.nativeMultiSigId}
                          multiSigDomainId={Number(
                            multiSigData.nativeMultiSigDomainId,
                          )}
                          isPending={
                            expectedStep === VoteExpectedStep.cancel &&
                            currentVote !== MultiSigVote.Approve
                          }
                          setExpectedStep={setExpectedStep}
                          setCurrentVote={setCurrentVote}
                          voteType={MultiSigVote.Reject}
                          buttonProps={{
                            disabled: expectedStep === VoteExpectedStep.cancel,
                            mode: 'primaryOutline',
                          }}
                        />
                      )}
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

export default ApprovalStep;
