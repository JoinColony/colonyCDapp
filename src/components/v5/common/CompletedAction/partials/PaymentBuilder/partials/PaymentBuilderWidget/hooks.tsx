import { SpinnerGap } from '@phosphor-icons/react';
import React, { useEffect, useMemo } from 'react';

import { usePaymentBuilderContext } from '~context/PaymentBuilderContext/PaymentBuilderContext.ts';
import { notMaybe, notNull } from '~utils/arrays/index.ts';
import { MotionState } from '~utils/colonyMotions.ts';
import { formatText } from '~utils/intl.ts';
import useGetColonyAction from '~v5/common/ActionSidebar/hooks/useGetColonyAction.ts';
import MotionCountDownTimer from '~v5/common/ActionSidebar/partials/Motions/partials/MotionCountDownTimer/MotionCountDownTimer.tsx';
import Button from '~v5/shared/Button/Button.tsx';
import IconButton from '~v5/shared/Button/IconButton.tsx';

import ActionWithPermissionsInfo from '../ActionWithPermissionsInfo/ActionWithPermissionsInfo.tsx';
import FinalizeByPaymentCreatorInfo from '../FinalizeByPaymentCreatorInfo/FinalizeByPaymentCreatorInfo.tsx';
import FundingRequests from '../FundingRequests/FundingRequests.tsx';
import MotionBox from '../MotionBox/MotionBox.tsx';
import ReleaseRequests from '../ReleaseRequests/ReleaseRequests.tsx';
import StepDetailsBlock from '../StepDetailsBlock/StepDetailsBlock.tsx';

import {
  ExpenditureStep,
  type ReleaseStepProps,
  type FundingStepProps,
} from './types.ts';
import { isExpenditureFullyFunded } from './utils.ts';

export const useGetFundingStep = ({
  expenditure,
  expectedStepKey,
}: FundingStepProps) => {
  const {
    setSelectedFundingAction,
    selectedFundingAction,
    toggleOnFundingModal: showFundingModal,
  } = usePaymentBuilderContext();
  const isExpenditureFunded = isExpenditureFullyFunded(expenditure);
  const { fundingActions } = expenditure || {};

  const sortedFundingActions = useMemo(
    () =>
      fundingActions?.items.filter(notNull).sort((a, b) => {
        if (a?.createdAt && b?.createdAt) {
          return Date.parse(b.createdAt) - Date.parse(a.createdAt);
        }
        return 0;
      }) ?? [],
    [fundingActions?.items],
  );

  const { motionData: selectedFundingMotion } = selectedFundingAction ?? {};
  const {
    motionState: fundingMotionState,
    refetchMotionState: refetchFundingMotionState,
  } = useGetColonyAction(selectedFundingAction?.transactionHash);

  const shouldShowFundingMotionTimer = [
    MotionState.Staking,
    MotionState.Supported,
    MotionState.Voting,
    MotionState.Reveal,
  ].includes(fundingMotionState);

  const allFundingMotions = sortedFundingActions
    .map((fundingAction) => fundingAction.motionData)
    .filter(notMaybe);
  const isAnyFundingMotionInProgress = allFundingMotions.some(
    (motion) =>
      !motion.isFinalized && !motion.motionStateHistory.hasFailedNotFinalizable,
  );
  const shouldShowFundingButton =
    !isAnyFundingMotionInProgress && !isExpenditureFunded;
  useEffect(() => {
    if (!selectedFundingAction && sortedFundingActions.length > 0) {
      setSelectedFundingAction(sortedFundingActions[0]);
    }

    if (
      selectedFundingAction &&
      !sortedFundingActions.some(
        (fundingAction) =>
          fundingAction.transactionHash ===
          selectedFundingAction.transactionHash,
      )
    ) {
      setSelectedFundingAction(null);
    }
  }, [selectedFundingAction, setSelectedFundingAction, sortedFundingActions]);

  return {
    key: ExpenditureStep.Funding,
    heading: {
      label: formatText({ id: 'expenditure.fundingStage.label' }),
      decor:
        selectedFundingMotion && shouldShowFundingMotionTimer ? (
          <MotionCountDownTimer
            motionState={fundingMotionState}
            motionId={selectedFundingMotion.motionId}
            motionStakes={selectedFundingMotion.motionStakes}
            refetchMotionState={refetchFundingMotionState}
          />
        ) : null,
    },
    content: (
      <div className="flex flex-col gap-2">
        {sortedFundingActions.length > 0 && (
          <FundingRequests actions={sortedFundingActions} />
        )}

        {selectedFundingMotion && (
          <MotionBox transactionId={selectedFundingMotion.transactionHash} />
        )}

        {selectedFundingAction && !selectedFundingMotion && (
          <ActionWithPermissionsInfo action={selectedFundingAction} />
        )}

        {shouldShowFundingButton && (
          <StepDetailsBlock
            text={formatText({
              id: 'expenditure.fundingStage.info',
            })}
            content={
              <>
                {expectedStepKey === ExpenditureStep.Release ? (
                  <IconButton
                    className="w-full"
                    rounded="s"
                    text={{ id: 'button.pending' }}
                    icon={
                      <span className="ml-1.5 flex shrink-0">
                        <SpinnerGap className="animate-spin" size={14} />
                      </span>
                    }
                  />
                ) : (
                  <Button
                    className="w-full"
                    onClick={showFundingModal}
                    text={formatText({
                      id: 'expenditure.fundingStage.button',
                    })}
                  />
                )}
              </>
            }
          />
        )}
      </div>
    ),
  };
};

export const useGetReleaseStep = ({
  expectedStepKey,
  expenditure,
  expenditureStep,
}: ReleaseStepProps) => {
  const {
    setSelectedReleaseAction,
    toggleOnReleaseModal: showReleasePaymentModal,
    selectedReleaseAction,
  } = usePaymentBuilderContext();

  const { finalizingActions, finalizedAt, ownerAddress } = expenditure || {};

  const sortedReleaseActions = useMemo(
    () =>
      finalizingActions?.items.filter(notNull).sort((a, b) => {
        if (a?.createdAt && b?.createdAt) {
          return Date.parse(b.createdAt) - Date.parse(a.createdAt);
        }
        return 0;
      }) ?? [],
    [finalizingActions?.items],
  );

  const { motionData: selectedReleaseMotion } = selectedReleaseAction ?? {};

  const allReleaseMotions = sortedReleaseActions
    .map((releaseAction) => releaseAction.motionData)
    .filter(notMaybe);
  const isAnyReleaseMotionInProgress = allReleaseMotions.some(
    (motion) =>
      !motion.isFinalized && !motion.motionStateHistory.hasFailedNotFinalizable,
  );
  const shouldShowReleaseButton = !isAnyReleaseMotionInProgress;
  useEffect(() => {
    if (!selectedReleaseAction && sortedReleaseActions.length > 0) {
      setSelectedReleaseAction(sortedReleaseActions[0]);
    }

    if (
      selectedReleaseAction &&
      !sortedReleaseActions.some(
        (releaseAction) =>
          releaseAction.transactionHash ===
          selectedReleaseAction.transactionHash,
      )
    ) {
      setSelectedReleaseAction(null);
    }
  }, [selectedReleaseAction, setSelectedReleaseAction, sortedReleaseActions]);

  return {
    key: ExpenditureStep.Release,
    heading: { label: formatText({ id: 'expenditure.releaseStage.label' }) },
    content: (
      <div className="flex flex-col gap-2">
        {sortedReleaseActions.length > 0 && (
          <ReleaseRequests actions={sortedReleaseActions} />
        )}

        {selectedReleaseMotion && (
          <MotionBox transactionId={selectedReleaseMotion.transactionHash} />
        )}

        {selectedReleaseAction && !selectedReleaseMotion && (
          <ActionWithPermissionsInfo action={selectedReleaseAction} />
        )}

        {expenditureStep === ExpenditureStep.Release &&
        shouldShowReleaseButton ? (
          <StepDetailsBlock
            text={formatText({
              id: 'expenditure.releaseStage.info',
            })}
            content={
              expectedStepKey === ExpenditureStep.Payment ? (
                <IconButton
                  className="max-h-[2.5rem] w-full !text-md"
                  rounded="s"
                  text={{ id: 'button.pending' }}
                  icon={
                    <span className="ml-1.5 flex shrink-0">
                      <SpinnerGap className="animate-spin" size={14} />
                    </span>
                  }
                />
              ) : (
                <Button
                  className="w-full"
                  onClick={showReleasePaymentModal}
                  text={formatText({
                    id: 'expenditure.releaseStage.button',
                  })}
                />
              )
            }
          />
        ) : (
          <>
            {finalizedAt ? (
              <>
                {finalizingActions?.items[0]?.initiatorAddress ===
                ownerAddress ? (
                  <FinalizeByPaymentCreatorInfo
                    userAdddress={expenditure?.ownerAddress}
                  />
                ) : (
                  <ActionWithPermissionsInfo
                    action={finalizingActions?.items[0]}
                  />
                )}
              </>
            ) : (
              <div />
            )}
          </>
        )}
      </div>
    ),
  };
};
