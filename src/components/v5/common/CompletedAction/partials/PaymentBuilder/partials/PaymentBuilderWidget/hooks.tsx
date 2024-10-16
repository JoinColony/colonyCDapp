import { SpinnerGap } from '@phosphor-icons/react';
import React, { useEffect, useMemo } from 'react';

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
import ReleaseRequests from '../ReleaseRequests/ReleaseRequests.tsx';
import StepDetailsBlock from '../StepDetailsBlock/StepDetailsBlock.tsx';
import UninstalledExtensionBox from '../UninstalledExtensionBox/UninstalledExtensionBox.tsx';

import { ExpenditureStep, type ReleaseStepProps } from './types.ts';

export const useGetReleaseStep = ({
  expectedStepKey,
  expenditure,
  expenditureStep,
}: ReleaseStepProps) => {
  const {
    setSelectedReleaseAction,
    toggleOnReleaseModal: showReleasePaymentModal,
    selectedReleaseAction,
    setExpectedStepKey,
  } = usePaymentBuilderContext();
  const { isStagedExtensionInstalled } = useEnabledExtensions();
  const isStagedExpenditure = expenditure?.type === ExpenditureType.Staged;

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
  const {
    motionState: releaseMotionState,
    refetchMotionState: refetchReleaseMotionState,
  } = useGetColonyAction(selectedReleaseAction?.transactionHash);

  const allReleaseMotions = sortedReleaseActions
    .map((releaseAction) => releaseAction.motionData)
    .filter(notMaybe);
  const isAnyReleaseMotionInProgress = allReleaseMotions.some(
    (motion) =>
      !motion.isFinalized && !motion.motionStateHistory.hasFailedNotFinalizable,
  );

  const shouldShowFundingMotionTimer =
    releaseMotionState &&
    [
      MotionState.Staking,
      MotionState.Supported,
      MotionState.Voting,
      MotionState.Reveal,
    ].includes(releaseMotionState);
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

  useEffect(() => {
    if (
      !isAnyReleaseMotionInProgress &&
      allReleaseMotions &&
      allReleaseMotions.length > 0 &&
      !allReleaseMotions[0].motionStateHistory.hasPassed
    ) {
      setExpectedStepKey(ExpenditureStep.Release);
    }
  }, [allReleaseMotions, isAnyReleaseMotionInProgress, setExpectedStepKey]);

  return {
    key: ExpenditureStep.Release,
    heading: {
      label: formatText({ id: 'expenditure.releaseStage.label' }),
      decor:
        selectedReleaseMotion && shouldShowFundingMotionTimer ? (
          <MotionCountDownTimer
            motionState={releaseMotionState}
            motionId={selectedReleaseMotion.motionId}
            motionStakes={selectedReleaseMotion.motionStakes}
            refetchMotionState={refetchReleaseMotionState}
          />
        ) : null,
    },
    content: (
      <>
        {!isStagedExtensionInstalled && isStagedExpenditure ? (
          <UninstalledExtensionBox />
        ) : (
          <div className="flex flex-col gap-2">
            {sortedReleaseActions.length > 0 && (
              <ReleaseRequests actions={sortedReleaseActions} />
            )}

            {selectedReleaseMotion && (
              <MotionBox
                transactionId={selectedReleaseMotion.transactionHash}
              />
            )}

            {selectedReleaseAction && !selectedReleaseMotion && (
              <ActionWithPermissionsInfo action={selectedReleaseAction} />
            )}

            {expenditureStep === ExpenditureStep.Release &&
              shouldShowReleaseButton && (
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
              )}
            {!shouldShowReleaseButton && !selectedReleaseMotion && (
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
