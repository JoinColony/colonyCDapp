import { SpinnerGap } from '@phosphor-icons/react';
import { isEqual } from 'lodash';
import React, { useEffect, type FC, useState } from 'react';
import { defineMessages } from 'react-intl';

import { usePaymentBuilderContext } from '~context/PaymentBuilderContext/PaymentBuilderContext.ts';
import useEnabledExtensions from '~hooks/useEnabledExtensions.ts';
import { ColonyActionType, type Expenditure } from '~types/graphql.ts';
import { notMaybe } from '~utils/arrays/index.ts';
import { formatText } from '~utils/intl.ts';
import Button from '~v5/shared/Button/Button.tsx';
import IconButton from '~v5/shared/Button/IconButton.tsx';

import { ExpenditureStep } from '../PaymentBuilderWidget/types.ts';
import PaymentOverview from '../PaymentStepDetailsBlock/partials/PaymentOverview/PaymentOverview.tsx';
import { getSummedTokens } from '../PaymentStepDetailsBlock/utils.ts';
import StepDetailsBlock from '../StepDetailsBlock/StepDetailsBlock.tsx';

import MilestoneReleaseModal from './partials/MilestoneReleaseModal/MilestoneReleaseModal.tsx';
import { type MilestoneItem } from './partials/MilestoneReleaseModal/types.ts';
import ReleasedBox from './partials/ReleasedBox/ReleasedBox.tsx';
import { type ReleaseBoxItem } from './partials/ReleasedBoxItem/ReleasedBoxItem.tsx';

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

export interface ReleaseActionItem {
  userAddress: string;
  createdAt: string;
  slotIds: number[];
}

interface StagedPaymentStepProps {
  expectedStepKey: ExpenditureStep | null;
  items: MilestoneItem[];
  expenditure: Expenditure;
  releaseActions: ReleaseActionItem[];
}

const StagedPaymentStep: FC<StagedPaymentStepProps> = ({
  expectedStepKey,
  items,
  expenditure,
  releaseActions,
}) => {
  const {
    toggleOnMilestoneModal: showModal,
    isMilestoneModalOpen,
    toggleOffMilestoneModal: hideModal,
    selectedMilestones,
    setSelectedMilestones,
    setSelectedMilestoneMotion,
  } = usePaymentBuilderContext();
  const { isStagedExtensionInstalled } = useEnabledExtensions();
  const [isMotionPending, setIsMotionPending] = useState(false);

  const firstMilestone = items
    .sort((a, b) => a.slotId - b.slotId)
    .filter((item) => !item.isClaimed)[0];

  const releaseNextMilestone = () => {
    setSelectedMilestones([firstMilestone]);
    showModal();
  };

  const notReleasedMilestones = items.filter((item) => !item.isClaimed);
  const hasAllMilestonesReleased = isEqual(
    notReleasedMilestones,
    selectedMilestones,
  );
  const releaseMilestoneMotions = expenditure.motions?.items
    .filter(
      (motion) =>
        motion?.action?.type === ColonyActionType.ReleaseStagedPaymentsMotion,
    )
    .filter(notMaybe);
  const motionMilestones: ReleaseBoxItem[] = (
    releaseMilestoneMotions || []
  ).map((motion, index) => {
    const matchingItems = items.filter((milestone) =>
      motion?.expenditureSlotIds?.includes(milestone.slotId),
    );

    const slotIds = matchingItems.map((item) => item.slotId);

    const firstItem = matchingItems[0];

    return {
      amount: firstItem.amount || '0',
      isClaimed: firstItem.isClaimed || false,
      milestone: firstItem.milestone || '',
      slotId: slotIds,
      tokenAddress: firstItem.tokenAddress || '',
      transactionHash: motion?.transactionHash,
      uniqueId: `${slotIds.join('-')}-${index + 1}`,
      createdAt: motion?.createdAt || '',
    };
  });
  const releasedMilestones = items
    .filter((item) => item.isClaimed)
    .map((item) => {
      const createdAt = releaseActions.find((action) =>
        action.slotIds.includes(item.slotId),
      )?.createdAt;

      return {
        ...item,
        uniqueId: `${item.slotId}-0`,
        createdAt: createdAt || '',
      };
    })
    .filter((item) => {
      const motion = releaseMilestoneMotions?.find((m) =>
        m?.expenditureSlotIds?.includes(item.slotId),
      );

      return !motion?.motionStateHistory.hasPassed;
    });
  const releaseItems = [...motionMilestones, ...releasedMilestones].sort(
    (a, b) => {
      if (new Date(a.createdAt) > new Date(b.createdAt)) return -1;
      if (new Date(a.createdAt) < new Date(b.createdAt)) return 1;
      return 0;
    },
  );
  const isAnyPaymentMotionInProgress = releaseMilestoneMotions?.some(
    (motion) =>
      !motion.isFinalized && !motion.motionStateHistory.hasFailedNotFinalizable,
  );

  const activeMotionsIds = (releaseMilestoneMotions || [])
    .filter(
      (motion) =>
        !motion?.motionStateHistory.hasPassed &&
        !motion?.motionStateHistory.hasFailed &&
        !motion?.motionStateHistory.hasFailedNotFinalizable,
    )
    .flatMap((motion) => motion?.expenditureSlotIds || 0);

  const totals = getSummedTokens(items);
  const paid = getSummedTokens(items, true);
  const allPaid = items.every(({ isClaimed }) => isClaimed);

  const milestonesRef = React.useRef(releaseItems);

  useEffect(() => {
    if (!isStagedExtensionInstalled) {
      setSelectedMilestoneMotion(null);
      return;
    }

    if (milestonesRef.current.length !== releaseItems.length) {
      if (!releaseItems) {
        return;
      }
      setSelectedMilestoneMotion(releaseItems?.[releaseItems.length - 1]);
      setIsMotionPending(false);
      milestonesRef.current = releaseItems;
    }
  }, [releaseItems, setSelectedMilestoneMotion, isStagedExtensionInstalled]);

  return (
    <>
      <>
        {(releasedMilestones.length > 0 ||
          (releaseMilestoneMotions || []).length > 0) && (
          <ReleasedBox items={releaseItems} releaseActions={releaseActions} />
        )}
        {!isStagedExtensionInstalled && (
          <StepDetailsBlock
            text={formatText(MSG.extensionUninstalled)}
            content={
              <div className="-ml-[1.125rem] -mr-[1.125rem] -mt-[1.125rem] bg-negative-100 p-[1.125rem] text-sm text-negative-400">
                {formatText(MSG.extensionDescription)}
              </div>
            }
          />
        )}
        {!isAnyPaymentMotionInProgress &&
          !allPaid &&
          isStagedExtensionInstalled && (
            <StepDetailsBlock
              text={formatText(MSG.releaseNextMilestone)}
              content={
                expectedStepKey === ExpenditureStep.Payment ||
                isMotionPending ? (
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
      </>
      <MilestoneReleaseModal
        items={selectedMilestones}
        motionIds={activeMotionsIds}
        expenditure={expenditure}
        isOpen={isMilestoneModalOpen}
        hasAllMilestonesReleased={hasAllMilestonesReleased}
        onClose={hideModal}
        setIsMotionPending={setIsMotionPending}
      />
    </>
  );
};

StagedPaymentStep.displayName = displayName;

export default StagedPaymentStep;
