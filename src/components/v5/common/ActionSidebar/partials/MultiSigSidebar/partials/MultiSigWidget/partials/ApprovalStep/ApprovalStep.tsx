import clsx from 'clsx';
import React, { useState, type FC, useEffect } from 'react';
import { defineMessages } from 'react-intl';

import { findFirstUserRoleWithColonyRoles } from '~constants/permissions.ts';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import {
  type ColonyActionType,
  type ColonyMultiSigFragment,
  MultiSigVote,
} from '~gql';
import { useEligibleSignees } from '~hooks/multiSig/useEligibleSignees.ts';
import Tooltip from '~shared/Extensions/Tooltip/Tooltip.tsx';
import SpinnerLoader from '~shared/Preloaders/SpinnerLoader.tsx';
import { type Threshold } from '~types/multiSig.ts';
import { notMaybe } from '~utils/arrays/index.ts';
import { formatText } from '~utils/intl.ts';
import { getRolesNeededForMultiSigAction } from '~utils/multiSig/index.ts';
import MenuWithStatusText from '~v5/shared/MenuWithStatusText/MenuWithStatusText.tsx';
import ProgressBar from '~v5/shared/ProgressBar/ProgressBar.tsx';
import { StatusTypes } from '~v5/shared/StatusText/consts.ts';
import StatusText from '~v5/shared/StatusText/StatusText.tsx';

import CancelButton from '../../../CancelButton/CancelButton.tsx';
import RemoveVoteButton from '../../../RemoveVoteButton/RemoveVoteButton.tsx';
import Signees from '../../../Signees/Signees.tsx';
import VoteButton from '../../../VoteButton/VoteButton.tsx';
import { VoteExpectedStep } from '../../types.ts';
import {
  getAllUserSignatures,
  getIsMultiSigExecutable,
  getNotSignedUsers,
  getNumberOfApprovals,
  getNumberOfRejections,
  getSignaturesPerRole,
  hasWeekPassed,
} from '../../utils.ts';
import MultiSigPills from '../MultiSigPills/MultiSigPills.tsx';
import ThresholdPassedBanner from '../ThresholdPassedBanner/ThresholdPassedBanner.tsx';

const displayName =
  'v5.common.ActionSidebar.partials.MultiSig.partials.MultiSigWidget.partials.ApprovalStep';

interface ApprovalStepProps {
  thresholdPerRole: Threshold;
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
  multipleRolesHeading: {
    id: `${displayName}.multipleRolesHeading`,
    defaultMessage:
      'Multiple permissions are required for this action.\nEach permission held counts as an approval',
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
    defaultMessage: '{progress} of {threshold}',
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

const voteOrder = {
  [MultiSigVote.None]: 2,
  [MultiSigVote.Approve]: 0,
  [MultiSigVote.Reject]: 1,
};

const ApprovalStep: FC<ApprovalStepProps> = ({
  thresholdPerRole,
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

  const requiredRoles =
    getRolesNeededForMultiSigAction({
      actionType,
      createdIn: Number(multiSigData.nativeMultiSigDomainId),
    }) || [];

  const doesActionRequireMultipleRoles = requiredRoles.length > 1;
  const isMotionOlderThanWeek = hasWeekPassed(createdAt);

  const signatures = (multiSigData?.signatures?.items ?? []).filter(notMaybe);

  const userSignature = signatures.find(
    (signature) => signature?.userAddress === user?.walletAddress,
  );

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

  const { isLoading: areEligibleSigneesLoading, uniqueEligibleSignees } =
    useEligibleSignees({
      domainId: Number(multiSigData.nativeMultiSigDomainId),
      requiredRoles,
    });

  if (areEligibleSigneesLoading) {
    return <SpinnerLoader appearance={{ size: 'medium' }} />;
  }

  const notSignedUsers = getNotSignedUsers({
    eligibleSignees: Object.values(uniqueEligibleSignees),
    signatures,
  });

  const allUserSignatures = getAllUserSignatures(signatures, requiredRoles);

  const signaturesToDisplay = [
    ...Object.values(allUserSignatures),
    ...notSignedUsers,
  ].sort((a, b) => {
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

  const threshold = thresholdPerRole
    ? Object.values(thresholdPerRole).reduce(
        (acc, roleThreshold) => acc + roleThreshold,
        0,
      )
    : 0;
  const { approvalsPerRole, rejectionsPerRole } =
    getSignaturesPerRole(signatures);

  const canUserSign = user?.walletAddress
    ? !!uniqueEligibleSignees[user.walletAddress]
    : false;
  const hasApprovalVotes = signatures.some(
    (signature) => signature.vote === MultiSigVote.Approve,
  );
  const hasRejectionVotes = signatures.some(
    (signature) => signature.vote === MultiSigVote.Reject,
  );

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

  const isMultiSigExecuted = multiSigData.isExecuted;
  const isMultiSigRejected = multiSigData.isRejected;
  const isMultiSigInFinalizeState =
    isMultiSigExecutable || isMultiSigExecuted || isMultiSigRejected;

  const shouldCheckUserRoles = !userSignature && !isMultiSigInFinalizeState;

  return (
    <MenuWithStatusText
      statusTextSectionProps={{
        status: StatusTypes.Info,
        children: doesActionRequireMultipleRoles
          ? formatText(MSG.multipleRolesHeading)
          : formatText(MSG.heading, {
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
                    progress={Math.min(numberOfApprovals, threshold)}
                    max={threshold}
                    progressLabel={formatText(MSG.additionalText, {
                      threshold,
                      progress: numberOfApprovals,
                    })}
                    className="ml-[0.125rem] w-full !text-xs"
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
                    progress={Math.min(numberOfRejections, threshold)}
                    max={threshold}
                    progressLabel={formatText(MSG.additionalText, {
                      current: numberOfRejections,
                      threshold,
                      progress: numberOfRejections,
                    })}
                    className="ml-[0.125rem] w-full !text-xs"
                    isTall
                  />
                </div>
              )}
            </div>
            {isOwner && !isMotionOlderThanWeek && !userSignature && (
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
            {isMotionOlderThanWeek && !userSignature && (
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
          key: 'thresholdPassedBanner',
          className: '!p-0',
          content: shouldCheckUserRoles ? (
            <ThresholdPassedBanner
              rejectionsPerRole={rejectionsPerRole}
              approvalsPerRole={approvalsPerRole}
              thresholdPerRole={thresholdPerRole}
              multiSigDomainId={Number(multiSigData.nativeMultiSigDomainId)}
              requiredRoles={requiredRoles}
            />
          ) : null,
        },
        {
          key: 'signatories',
          content: (
            <div>
              <Tooltip
                placement="bottom-start"
                offset={[0, 4]}
                tooltipContent={formatText(MSG.tooltip, {
                  permission: findFirstUserRoleWithColonyRoles({
                    colonyRoles: requiredRoles,
                  }),
                })}
              >
                <h5 className="mb-2 text-1">{formatText(MSG.title)}</h5>
              </Tooltip>
              <Signees
                signees={signaturesToDisplay}
                shouldShowRoleNumber={doesActionRequireMultipleRoles}
              />
              {!isMultiSigExecuted && !isMultiSigRejected && canUserSign && (
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
                      {isOwner || isMotionOlderThanWeek ? (
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
