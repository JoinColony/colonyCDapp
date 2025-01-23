import { type ColonyRole } from '@colony/colony-js';
import clsx from 'clsx';
import React, { useState, type FC, useMemo, useEffect } from 'react';
import { defineMessages } from 'react-intl';

import { findFirstUserRoleWithColonyRoles } from '~constants/permissions.ts';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { MultiSigVote } from '~gql';
import { useEligibleSignees } from '~hooks/multiSig/useEligibleSignees.ts';
import useCurrentBlockTime from '~hooks/useCurrentBlockTime.ts';
import usePrevious from '~hooks/usePrevious.ts';
import Tooltip from '~shared/Extensions/Tooltip/Tooltip.tsx';
import SpinnerLoader from '~shared/Preloaders/SpinnerLoader.tsx';
import { type MultiSigAction } from '~types/motions.ts';
import { type Threshold } from '~types/multiSig.ts';
import { notMaybe } from '~utils/arrays/index.ts';
import { formatText } from '~utils/intl.ts';
import { getDomainIdsForEligibleSignees } from '~utils/multiSig/index.ts';
import CancelButton from '~v5/common/ActionSidebar/partials/MultiSigSidebar/partials/CancelButton/CancelButton.tsx';
import {
  getAllUserSignatures,
  getDomainIdForActionType,
  getIsMultiSigExecutable,
  getNotSignedUsers,
  getNumberOfApprovals,
  getNumberOfRejections,
  getSignaturesPerRole,
  hasWeekPassed,
} from '~v5/common/ActionSidebar/partials/MultiSigSidebar/partials/MultiSigWidget/utils.ts';
import RemoveVoteButton from '~v5/common/ActionSidebar/partials/MultiSigSidebar/partials/RemoveVoteButton/RemoveVoteButton.tsx';
import Signees from '~v5/common/ActionSidebar/partials/MultiSigSidebar/partials/Signees/Signees.tsx';
import VoteButton from '~v5/common/ActionSidebar/partials/MultiSigSidebar/partials/VoteButton/VoteButton.tsx';
import MenuWithStatusText from '~v5/shared/MenuWithStatusText/MenuWithStatusText.tsx';
import ProgressBar from '~v5/shared/ProgressBar/ProgressBar.tsx';
import { StatusTypes } from '~v5/shared/StatusText/consts.ts';
import StatusText from '~v5/shared/StatusText/StatusText.tsx';

import MultiSigPills from '../MultiSigPills/MultiSigPills.tsx';
import ThresholdPassedBanner from '../ThresholdPassedBanner/ThresholdPassedBanner.tsx';

const displayName =
  'v5.common.ActionSidebar.partials.MultiSig.partials.MultiSigWidget.partials.ApprovalStep';

interface ApprovalStepProps {
  thresholdPerRole: Threshold;
  requiredRoles: ColonyRole[];
  initiatorAddress: string;
  onMultiSigRejected?: () => void;
  action: MultiSigAction;
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
      'This action requires a bundled approval. Each approval is based on the permissions you hold.',
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
  initiatorAddress,
  requiredRoles,
  onMultiSigRejected,
  action,
}) => {
  const { multiSigData, type: actionType } = action;
  const { createdAt } = multiSigData;
  const { user } = useAppContext();

  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isRemovingVote, setIsRemovingVote] = useState(false);

  const isOwner = user?.walletAddress === initiatorAddress;
  const isMultiSigRejected = multiSigData.isRejected;
  const previousIsMultiSigRejected = usePrevious(isMultiSigRejected);

  const doesActionRequireMultipleRoles = requiredRoles.length > 1;
  const { currentBlockTime } = useCurrentBlockTime();
  const isMotionOlderThanWeek = currentBlockTime
    ? hasWeekPassed(createdAt, currentBlockTime * 1000)
    : false;
  const signatures = (multiSigData?.signatures?.items ?? []).filter(notMaybe);

  const userSignature = useMemo(
    () =>
      signatures.find(
        (signature) => signature?.userAddress === user?.walletAddress,
      ),
    [signatures, user?.walletAddress],
  );

  // When the signature value changes (added or removed), set all loading states to 0
  useEffect(() => {
    setIsApproving(false);
    setIsRejecting(false);
    setIsRemovingVote(false);
  }, [userSignature]);

  useEffect(() => {
    if (isMultiSigRejected && previousIsMultiSigRejected === false) {
      onMultiSigRejected?.();
    }
  }, [isMultiSigRejected, onMultiSigRejected, previousIsMultiSigRejected]);

  const { isLoading: areEligibleSigneesLoading, uniqueEligibleSignees } =
    useEligibleSignees({
      domainIds: getDomainIdsForEligibleSignees(
        getDomainIdForActionType(
          actionType,
          multiSigData.nativeMultiSigDomainId,
        ),
      ),
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
  const isMultiSigInFinalizeState =
    isMultiSigExecutable || isMultiSigExecuted || isMultiSigRejected;

  const shouldCheckUserRoles = !userSignature && !isMultiSigInFinalizeState;

  return (
    <MenuWithStatusText
      statusText={
        <StatusText
          status={StatusTypes.Info}
          textClassName="text-4 text-gray-900"
          iconAlignment="top"
          iconSize={16}
          iconClassName="text-gray-500"
        >
          {doesActionRequireMultipleRoles
            ? formatText(MSG.multipleRolesHeading)
            : formatText(MSG.heading, {
                threshold,
              })}
        </StatusText>
      }
      content={
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
      }
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
                placement="top-start"
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
                        isLoading={isRemovingVote}
                        requiredRoles={requiredRoles}
                        handleLoadingChange={(isLoading) => {
                          setIsRemovingVote(isLoading);
                        }}
                        action={action}
                      />
                    </>
                  ) : (
                    <div className="mt-6 flex flex-col gap-2">
                      <VoteButton
                        action={action}
                        isLoading={isApproving}
                        requiredRoles={requiredRoles}
                        handleLoadingChange={(isLoading) => {
                          setIsApproving(isLoading);
                        }}
                        voteType={MultiSigVote.Approve}
                        buttonProps={{
                          disabled: isRejecting,
                        }}
                      />
                      {isOwner || isMotionOlderThanWeek ? (
                        <CancelButton
                          action={action}
                          isLoading={isRejecting}
                          multiSigId={multiSigData.nativeMultiSigId}
                          handleLoadingChange={(isLoading) => {
                            setIsRejecting(isLoading);
                          }}
                          buttonProps={{
                            disabled: isApproving,
                          }}
                        />
                      ) : (
                        <VoteButton
                          action={action}
                          isLoading={isRejecting}
                          requiredRoles={requiredRoles}
                          handleLoadingChange={(isLoading) => {
                            setIsRejecting(isLoading);
                          }}
                          voteType={MultiSigVote.Reject}
                          buttonProps={{
                            disabled: isApproving,
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
