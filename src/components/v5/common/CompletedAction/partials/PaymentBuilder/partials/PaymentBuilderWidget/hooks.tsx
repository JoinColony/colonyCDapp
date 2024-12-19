import { SpinnerGap } from '@phosphor-icons/react';
import React, { useEffect, useMemo, useState } from 'react';

import { usePaymentBuilderContext } from '~context/PaymentBuilderContext/PaymentBuilderContext.ts';
import { ExpenditureType } from '~gql';
import useEnabledExtensions from '~hooks/useEnabledExtensions.ts';
import { notMaybe, notNull } from '~utils/arrays/index.ts';
import { MotionState } from '~utils/colonyMotions.ts';
import { formatText } from '~utils/intl.ts';
import useGetColonyAction from '~v5/common/ActionSidebar/hooks/useGetColonyAction.ts';
import MotionCountDownTimer from '~v5/common/ActionSidebar/partials/Motions/partials/MotionCountDownTimer/MotionCountDownTimer.tsx';
import Button from '~v5/shared/Button/Button.tsx';
import IconButton from '~v5/shared/Button/IconButton.tsx';

import ActionWithPermissionsInfo from '../ActionWithPermissionsInfo/ActionWithPermissionsInfo.tsx';
import FinalizeByPaymentCreatorInfo from '../FinalizeByPaymentCreatorInfo/FinalizeByPaymentCreatorInfo.tsx';
import MotionBox from '../MotionBox/MotionBox.tsx';
import RequestsBox from '../RequestsBox/RequestsBox.tsx';
import StepDetailsBlock from '../StepDetailsBlock/StepDetailsBlock.tsx';
import UninstalledExtensionBox from '../UninstalledExtensionBox/UninstalledExtensionBox.tsx';

import { ExpenditureStep, type FinalizeStepProps } from './types.ts';
import { sortActionsByCreatedDate } from './utils.ts';

export const useGetFinalizeStep = ({
  expectedStepKey,
  expenditure,
  expenditureStep,
  setExpectedStepKey,
}: FinalizeStepProps) => {
  const {
    setSelectedFinalizeAction,
    toggleOnFinalizeModal: showFinalizePaymentModal,
    selectedFinalizeAction,
  } = usePaymentBuilderContext();
  const { stagedExpenditureAddress } = useEnabledExtensions();
  const isStagedExpenditure = expenditure?.type === ExpenditureType.Staged;
  const [previousFinalizingActionsCount, setPreviousFinalizingActionsCount] =
    useState(0);

  const { finalizingActions, finalizedAt, ownerAddress } = expenditure || {};

  const sortedFinalizeActions = useMemo(
    () =>
      finalizingActions?.items.filter(notNull).sort(sortActionsByCreatedDate) ??
      [],
    [finalizingActions?.items],
  );

  const { motionData: selectedFinalizeMotion } = selectedFinalizeAction ?? {};
  const {
    motionState: finalizeMotionState,
    refetchMotionState: refetchFinalizeMotionState,
  } = useGetColonyAction(selectedFinalizeAction?.transactionHash);

  const allFinalizeMotions = sortedFinalizeActions
    .map((finalizeAction) => finalizeAction.motionData)
    .filter(notMaybe);
  const isAnyFinalizeMotionInProgress = allFinalizeMotions.some(
    (motion) =>
      !motion.isFinalized && !motion.motionStateHistory.hasFailedNotFinalizable,
  );
  const hasUninstalledExtension =
    expenditure?.stagedExpenditureAddress &&
    stagedExpenditureAddress !== expenditure.stagedExpenditureAddress;

  const shouldShowFinalizeMotionTimer =
    finalizeMotionState &&
    [
      MotionState.Staking,
      MotionState.Supported,
      MotionState.Opposed,
      MotionState.Voting,
      MotionState.Reveal,
    ].includes(finalizeMotionState);
  const shouldShowFinalizeButton =
    !isAnyFinalizeMotionInProgress && !hasUninstalledExtension;

  useEffect(() => {
    if (
      sortedFinalizeActions.length !== previousFinalizingActionsCount ||
      !selectedFinalizeAction
    ) {
      setSelectedFinalizeAction(sortedFinalizeActions[0] ?? null);
      setPreviousFinalizingActionsCount(sortedFinalizeActions.length);
    }
  }, [
    previousFinalizingActionsCount,
    selectedFinalizeAction,
    setSelectedFinalizeAction,
    sortedFinalizeActions,
  ]);

  useEffect(() => {
    return () => {
      setSelectedFinalizeAction(null);
    };
  }, [setSelectedFinalizeAction]);

  useEffect(() => {
    const latestMotion = sortedFinalizeActions[0];

    const hasLatestFailedMotion =
      latestMotion?.motionData?.motionStateHistory.hasFailedNotFinalizable ||
      latestMotion?.motionData?.motionStateHistory.hasFailed;

    if (hasLatestFailedMotion) {
      setExpectedStepKey(ExpenditureStep.Release);
    }
  }, [sortedFinalizeActions, setExpectedStepKey]);

  return {
    key: ExpenditureStep.Release,
    heading: {
      label: formatText({ id: 'expenditure.releaseStage.label' }),
      decor:
        selectedFinalizeMotion && shouldShowFinalizeMotionTimer ? (
          <MotionCountDownTimer
            motionState={finalizeMotionState}
            motionId={selectedFinalizeMotion.motionId}
            motionStakes={selectedFinalizeMotion.motionStakes}
            refetchMotionState={refetchFinalizeMotionState}
          />
        ) : null,
    },
    content: (
      <>
        {hasUninstalledExtension && isStagedExpenditure ? (
          <UninstalledExtensionBox />
        ) : (
          <div className="flex flex-col gap-2">
            {sortedFinalizeActions.length > 0 && (
              <RequestsBox
                actions={sortedFinalizeActions}
                selectedAction={selectedFinalizeAction}
                onClick={setSelectedFinalizeAction}
                title={formatText({ id: 'expenditure.finalizeRequest.title' })}
              />
            )}

            {selectedFinalizeMotion && (
              <MotionBox
                transactionId={selectedFinalizeMotion.transactionHash}
              />
            )}

            {selectedFinalizeAction && !selectedFinalizeMotion && (
              <FinalizeByPaymentCreatorInfo
                userAdddress={selectedFinalizeAction.initiatorAddress}
              />
            )}

            {expenditureStep === ExpenditureStep.Release &&
              shouldShowFinalizeButton && (
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
                        onClick={showFinalizePaymentModal}
                        text={formatText({
                          id: 'expenditure.releaseStage.button',
                        })}
                      />
                    )
                  }
                />
              )}
            {!shouldShowFinalizeButton && !selectedFinalizeMotion && (
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
        )}
      </>
    ),
  };
};
