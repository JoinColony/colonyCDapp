import { SpinnerGap } from '@phosphor-icons/react';
import { isEqual } from 'lodash';
import React, { useEffect, type FC } from 'react';
import { defineMessages } from 'react-intl';

import { usePaymentBuilderContext } from '~context/PaymentBuilderContext/PaymentBuilderContext.ts';
import { ColonyActionType, type Expenditure } from '~types/graphql.ts';
import { formatText } from '~utils/intl.ts';
import Button from '~v5/shared/Button/Button.tsx';
import TxButton from '~v5/shared/Button/TxButton.tsx';

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
  releaseNextButton: {
    id: `${displayName}.releaseNextButton`,
    defaultMessage: 'Release next payment',
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
  const releaseMilestoneMotions = expenditure.motions?.items.filter(
    (motion) =>
      motion?.action?.type === ColonyActionType.ReleaseStagedPaymentsMotion,
  );
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
  const hasEveryMotionEnded =
    releaseMilestoneMotions &&
    releaseMilestoneMotions.length > 0 &&
    releaseMilestoneMotions.every(
      (motion) =>
        !motion?.motionStateHistory.hasPassed ||
        !motion?.motionStateHistory.hasFailed ||
        !motion?.motionStateHistory.hasFailedNotFinalizable,
    );
  const activeMotionsIds = (releaseMilestoneMotions || [])
    .filter(
      (motion) =>
        !motion?.motionStateHistory.hasPassed ||
        !motion?.motionStateHistory.hasFailed ||
        !motion?.motionStateHistory.hasFailedNotFinalizable,
    )
    .flatMap((motion) => motion?.expenditureSlotIds || 0);

  const totals = getSummedTokens(items);
  const paid = getSummedTokens(items, true);
  const allPaid = items.every(({ isClaimed }) => isClaimed);
  const hasAllStakesClaimed = releaseMilestoneMotions?.every((releaseMotion) =>
    releaseMotion?.stakerRewards.every(
      (stakerReward) => stakerReward.isClaimed,
    ),
  );

  const motionMilestonesRef = React.useRef(motionMilestones);

  useEffect(() => {
    if (motionMilestonesRef.current.length !== motionMilestones.length) {
      if (!motionMilestones) {
        return;
      }
      setSelectedMilestoneMotion(
        motionMilestones?.[motionMilestones.length - 1],
      );
      motionMilestonesRef.current = motionMilestones;
    }
  }, [motionMilestones, setSelectedMilestoneMotion]);

  return (
    <>
      {allPaid && hasAllStakesClaimed ? (
        <PaymentOverview
          className="rounded-lg border border-gray-200 bg-base-white p-[1.125rem]"
          total={totals}
          paid={paid}
        />
      ) : (
        <>
          {(releasedMilestones.length > 0 ||
            (releaseMilestoneMotions || []).length > 0) && (
            <ReleasedBox items={releaseItems} releaseActions={releaseActions} />
          )}
          {hasEveryMotionEnded && (
            <StepDetailsBlock
              text={formatText(MSG.releaseNextMilestone)}
              content={
                expectedStepKey === ExpenditureStep.Payment ? (
                  <TxButton
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
                    text={formatText(MSG.releaseNextButton)}
                  />
                )
              }
            />
          )}
        </>
      )}
      <MilestoneReleaseModal
        items={selectedMilestones}
        motionIds={activeMotionsIds}
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
