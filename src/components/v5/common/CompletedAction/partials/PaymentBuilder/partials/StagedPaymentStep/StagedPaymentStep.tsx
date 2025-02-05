import { SpinnerGap } from '@phosphor-icons/react';
import React, { type FC, useEffect } from 'react';
import { defineMessages } from 'react-intl';

import { usePaymentBuilderContext } from '~context/PaymentBuilderContext/PaymentBuilderContext.ts';
import { useStagedPaymentContext } from '~context/StagedPaymentContext/StagedPaymentContext.ts';
import useEnabledExtensions from '~hooks/useEnabledExtensions.ts';
import { type ExpenditureAction, type Expenditure } from '~types/graphql.ts';
import { notMaybe } from '~utils/arrays/index.ts';
import { formatText } from '~utils/intl.ts';
import Button from '~v5/shared/Button/Button.tsx';
import IconButton from '~v5/shared/Button/IconButton.tsx';

import ActionWithPermissionsInfo from '../ActionWithPermissionsInfo/ActionWithPermissionsInfo.tsx';
import MotionBox from '../MotionBox/MotionBox.tsx';
import { ExpenditureStep } from '../PaymentBuilderWidget/types.ts';
import PaymentOverview from '../PaymentStepDetailsBlock/partials/PaymentOverview/PaymentOverview.tsx';
import { getSummedTokens } from '../PaymentStepDetailsBlock/utils.ts';
import StepDetailsBlock from '../StepDetailsBlock/StepDetailsBlock.tsx';

import MilestoneReleaseModal from './partials/MilestoneReleaseModal/MilestoneReleaseModal.tsx';
import ReleaseActions from './partials/ReleaseActions/ReleaseActions.tsx';

const displayName =
  'v5.common.CompletedAction.partials.PaymentBuilder.partials.StagedPaymentStep';

const MSG = defineMessages({
  releaseNextMilestone: {
    id: `${displayName}.releaseNextMilestone`,
    defaultMessage: 'Releases the next milestone payment.',
  },
  makeNextButton: {
    id: `${displayName}.makeNextButton`,
    defaultMessage: 'Make next payment',
  },
  extensionUninstalled: {
    id: `${displayName}.extensionUninstalled`,
    defaultMessage: 'Staged payment extension was uninstalled',
  },
  extensionDescription: {
    id: `${displayName}.extensionDescription`,
    defaultMessage:
      'The extension used to create this action has been uninstalled. Unpaid payments are currently not able to be completed. You will be able to edit the payment once edit functionality is supported.',
  },
  cancelPayment: {
    id: `${displayName}.cancelPayment`,
    defaultMessage: 'Cancel payment',
  },
});

interface StagedPaymentStepProps {
  expectedStepKey: ExpenditureStep | null;
  expenditure: Expenditure;
  releaseActions: ExpenditureAction[];
}

const StagedPaymentStep: FC<StagedPaymentStepProps> = ({
  expectedStepKey,
  expenditure,
  releaseActions,
}) => {
  const { selectedReleaseAction } = usePaymentBuilderContext();
  const {
    toggleOnMilestoneModal: showModal,
    isMilestoneModalOpen,
    toggleOffMilestoneModal: hideModal,
    allMilestonesSlotIdsAwaitingRelease,
    currentMilestonesAwaitingRelease,
    setCurrentMilestonesAwaitingRelease,
    isPendingStagesRelease,
    setPendingState,
    resetMilestonesState,
    removeSlotIdsFromPending,
  } = useStagedPaymentContext();
  const { stagedExpenditureAddress } = useEnabledExtensions();

  const selectedReleaseMotion = selectedReleaseAction?.motionData;

  const items = expenditure.slots.map((slot) => {
    const payout = slot.payouts?.[0];
    const { amount = '0', tokenAddress = '', isClaimed = false } = payout ?? {};
    const milestoneMetadata = expenditure.metadata?.stages?.find(
      (stage) => stage.slotId === slot.id,
    );

    return {
      milestone: milestoneMetadata?.name ?? '',
      amount,
      tokenAddress,
      isClaimed,
      slotId: slot.id,
    };
  });

  const notReleasedMilestones = items
    .sort((a, b) => a.slotId - b.slotId)
    .filter((item) => !item.isClaimed);

  const firstMilestone = notReleasedMilestones[0];

  const releaseNextMilestone = () => {
    setCurrentMilestonesAwaitingRelease([firstMilestone]);
    showModal();
  };

  const notReleasedMilestonesSlotIds = notReleasedMilestones.map(
    (item) => item.slotId,
  );

  const hasAllMilestonesReleased = !notReleasedMilestonesSlotIds.length;
  const releaseMilestoneMotions = expenditure.releaseActions?.items
    .map((action) => action?.motionData)
    .filter(notMaybe);

  const slotsWithActiveMotions = (releaseMilestoneMotions || [])
    .filter(
      (motion) =>
        !motion?.motionStateHistory.hasPassed &&
        !motion?.motionStateHistory.hasFailed &&
        !motion?.motionStateHistory.hasFailedNotFinalizable,
    )
    .flatMap((motion) => motion?.expenditureSlotIds || []);

  const shouldUpdateAllMilestonesSlotIds = slotsWithActiveMotions.some(
    (slotId) => allMilestonesSlotIdsAwaitingRelease.includes(slotId),
  );

  const totals = getSummedTokens(items);
  const paid = getSummedTokens(items, true);
  const allPaid = items.every(({ isClaimed }) => isClaimed);

  const releaseActionsSlotsIds = releaseActions.flatMap(
    (releaseAction) => releaseAction.expenditureSlotIds,
  );

  const allReleaseActionsAmongReleaseMilestones =
    !!allMilestonesSlotIdsAwaitingRelease.length &&
    allMilestonesSlotIdsAwaitingRelease.every((slotId) =>
      releaseActionsSlotsIds.includes(slotId),
    );

  // In case of milestones released using motions, we want to re-enable those milestones to be able to release them using a different decision method
  // So we will remove them from the allMilestonesSlotIdsAwaitingRelease list
  useEffect(() => {
    if (shouldUpdateAllMilestonesSlotIds) {
      removeSlotIdsFromPending(slotsWithActiveMotions);
    }
  }, [
    shouldUpdateAllMilestonesSlotIds,
    slotsWithActiveMotions,
    removeSlotIdsFromPending,
  ]);

  useEffect(() => {
    if (allPaid) {
      resetMilestonesState();
    }
  }, [allPaid, resetMilestonesState]);

  useEffect(() => {
    if (allReleaseActionsAmongReleaseMilestones) {
      setPendingState(false);
    }
  }, [allReleaseActionsAmongReleaseMilestones, setPendingState]);

  const releaseMotions = releaseActions
    .map((releaseAction) => releaseAction.motionData)
    .filter(notMaybe);
  const isAnyReleaseStagesMotionInProgress = releaseMotions.some(
    (motion) =>
      !motion.isFinalized && !motion.motionStateHistory.hasFailedNotFinalizable,
  );
  const allStagesReleased = expenditure.slots.every((slot) =>
    slot.payouts?.every((payout) => payout.isClaimed),
  );

  const isCorrectExtensionInstalled =
    !!expenditure.stagedExpenditureAddress &&
    stagedExpenditureAddress === expenditure.stagedExpenditureAddress;

  const shouldShowReleaseButton =
    isCorrectExtensionInstalled &&
    !isAnyReleaseStagesMotionInProgress &&
    !allStagesReleased;

  return (
    <>
      <div className="flex flex-col gap-2">
        {!isCorrectExtensionInstalled && (
          <StepDetailsBlock
            text={formatText(MSG.extensionUninstalled)}
            content={
              <div className="-m-[1.125rem] bg-negative-100 p-[1.125rem] text-sm text-negative-400">
                {formatText(MSG.extensionDescription)}
              </div>
            }
          />
        )}

        {releaseActions.length > 0 && (
          <ReleaseActions expenditure={expenditure} actions={releaseActions} />
        )}

        {selectedReleaseMotion && (
          <MotionBox transactionId={selectedReleaseMotion.transactionHash} />
        )}

        {selectedReleaseAction && !selectedReleaseMotion && (
          <ActionWithPermissionsInfo action={selectedReleaseAction} />
        )}

        {shouldShowReleaseButton && (
          <StepDetailsBlock
            text={formatText(MSG.releaseNextMilestone)}
            className="mt-4"
            content={
              expectedStepKey === ExpenditureStep.Payment ||
              isPendingStagesRelease ? (
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
                  onClick={releaseNextMilestone}
                  text={formatText(MSG.makeNextButton)}
                />
              )
            }
          />
        )}
        {allPaid && (
          <PaymentOverview
            className="rounded-lg border border-gray-200 bg-base-white p-[1.125rem]"
            total={totals}
            paid={paid}
          />
        )}
      </div>

      <MilestoneReleaseModal
        items={currentMilestonesAwaitingRelease}
        slotsWithActiveMotions={slotsWithActiveMotions}
        expenditure={expenditure}
        isOpen={isMilestoneModalOpen}
        hasAllMilestonesReleased={hasAllMilestonesReleased}
        onClose={hideModal}
      />
    </>
  );
};

StagedPaymentStep.displayName = displayName;

export default StagedPaymentStep;
