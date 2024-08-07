import { SpinnerGap } from '@phosphor-icons/react';
import React, { useState, type FC, useEffect, useMemo } from 'react';

import { ADDRESS_ZERO } from '~constants';
import { Action } from '~constants/actions.ts';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { usePaymentBuilderContext } from '~context/PaymentBuilderContext/PaymentBuilderContext.ts';
import {
  useGetColonyExpendituresQuery,
  ColonyActionType,
  ExpenditureType,
} from '~gql';
import { ActionTypes } from '~redux';
import { type LockExpenditurePayload } from '~redux/sagas/expenditures/lockExpenditure.ts';
import SpinnerLoader from '~shared/Preloaders/SpinnerLoader.tsx';
import { notNull } from '~utils/arrays/index.ts';
import { MotionState } from '~utils/colonyMotions.ts';
import { formatText } from '~utils/intl.ts';
import { getSafePollingInterval } from '~utils/queries.ts';
import useGetColonyAction from '~v5/common/ActionSidebar/hooks/useGetColonyAction.ts';
import { useGetExpenditureData } from '~v5/common/ActionSidebar/hooks/useGetExpenditureData.ts';
import MotionCountDownTimer from '~v5/common/ActionSidebar/partials/Motions/partials/MotionCountDownTimer/MotionCountDownTimer.tsx';
import ActionButton from '~v5/shared/Button/ActionButton.tsx';
import Button from '~v5/shared/Button/Button.tsx';
import IconButton from '~v5/shared/Button/IconButton.tsx';
import Stepper from '~v5/shared/Stepper/index.ts';
import { type StepperItem } from '~v5/shared/Stepper/types.ts';

import ActionWithPermissionsInfo from '../ActionWithPermissionsInfo/ActionWithPermissionsInfo.tsx';
import ActionWithStakingInfo from '../ActionWithStakingInfo/ActionWithStakingInfo.tsx';
import FinalizeByPaymentCreatorInfo from '../FinalizeByPaymentCreatorInfo/FinalizeByPaymentCreatorInfo.tsx';
import FundingModal from '../FundingModal/FundingModal.tsx';
import MotionBox from '../MotionBox/MotionBox.tsx';
import PaymentStepDetailsBlock from '../PaymentStepDetailsBlock/PaymentStepDetailsBlock.tsx';
import ReleasePaymentModal from '../ReleasePaymentModal/ReleasePaymentModal.tsx';
import RequestBox from '../RequestBox/RequestBox.tsx';
import { type MilestoneItem } from '../StagedPaymentStep/partials/MilestoneReleaseModal/types.ts';
import StagedPaymentStep, {
  type ReleaseActionItem,
} from '../StagedPaymentStep/StagedPaymentStep.tsx';
import StepDetailsBlock from '../StepDetailsBlock/StepDetailsBlock.tsx';
import UninstalledExtensionBox from '../UninstalledExtensionBox/UninstalledExtensionBox.tsx';

import { ExpenditureStep, type PaymentBuilderWidgetProps } from './types.ts';
import {
  getCancelStepIndex,
  getExpenditureStep,
  useGetExtensionInstalled,
} from './utils.ts';

const PaymentBuilderWidget: FC<PaymentBuilderWidgetProps> = ({ action }) => {
  const { colony, refetchColony } = useColonyContext();
  const { refetch: refetchExpenditures } = useGetColonyExpendituresQuery({
    variables: {
      colonyAddress: colony.colonyAddress,
    },
  });
  const { user } = useAppContext();
  const { walletAddress } = user || {};
  const { isStagedExtensionInstalled } = useGetExtensionInstalled();

  const {
    isFundingModalOpen,
    toggleOffFundingModal: hideFundingModal,
    toggleOnFundingModal: showFundingModal,
    isReleaseModalOpen: isReleasePaymentModalOpen,
    toggleOffReleaseModal: hideReleasePaymentModal,
    toggleOnReleaseModal: showReleasePaymentModal,
  } = usePaymentBuilderContext();

  const { expenditureId } = action;

  const { expenditure, loadingExpenditure, startPolling, stopPolling } =
    useGetExpenditureData(expenditureId);

  const {
    fundingActions,
    finalizingActions,
    cancellingActions,
    releaseActions,
    finalizedAt,
    createdAt,
    isStaked,
    userStake,
    ownerAddress,
    motions,
    slots,
    metadata,
  } = expenditure || {};
  const { amount: stakeAmount = '' } = userStake || {};
  const { items: fundingActionsItems } = fundingActions || {};

  const expenditureStep = getExpenditureStep(expenditure);

  const [activeStepKey, setActiveStepKey] =
    useState<ExpenditureStep>(expenditureStep);
  const [expectedStepKey, setExpectedStepKey] =
    useState<ExpenditureStep | null>(null);

  useEffect(() => {
    startPolling(getSafePollingInterval());

    return () => stopPolling();
  }, [startPolling, stopPolling]);

  useEffect(() => {
    if (expenditureStep === ExpenditureStep.Release) {
      // Once funds have been allocated to this expenditure,
      // we need to refetch the colony and the expenditures so that
      // balances are correctly shown across the app.
      refetchColony();
      refetchExpenditures();
    }
    setActiveStepKey(expenditureStep);
  }, [expenditureStep, refetchColony, refetchExpenditures]);

  useEffect(() => {
    if (expectedStepKey === expenditureStep) {
      setExpectedStepKey(null);
    }
  }, [expectedStepKey, expenditureStep]);

  const lockExpenditurePayload: LockExpenditurePayload | null = useMemo(
    () =>
      expenditure
        ? {
            colonyAddress: colony.colonyAddress,
            nativeExpenditureId: expenditure.nativeId,
          }
        : null,
    [colony.colonyAddress, expenditure],
  );

  const cancelItem: StepperItem<ExpenditureStep> = {
    key: ExpenditureStep.Cancel,
    heading: {
      label: formatText({ id: 'expenditure.cancelStage.label' }),
    },
    content: (
      <ActionWithPermissionsInfo
        userAdddress={cancellingActions?.items[0]?.initiatorAddress}
      />
    ),
    isHidden: expenditureStep !== ExpenditureStep.Cancel,
  };

  const isExpenditureCanceled = expenditureStep === ExpenditureStep.Cancel;
  const isFundingMotion =
    motions?.items?.length &&
    motions.items?.[0]?.action?.type === ColonyActionType.FundExpenditureMotion;
  const isPaymentMotion =
    motions?.items?.length &&
    motions.items?.[0]?.action?.type ===
      ColonyActionType.ReleaseStagedPaymentsMotion;
  const fundingMotions = useMemo(() => {
    return (
      motions?.items
        .filter(notNull)
        .filter(
          (motion) =>
            motion?.action?.type === ColonyActionType.FundExpenditureMotion,
        )
        .sort((a, b) => {
          if (a?.createdAt && b?.createdAt) {
            return Date.parse(b.createdAt) - Date.parse(a.createdAt);
          }
          return 0;
        }) || []
    );
  }, [motions]);

  const {
    selectedTransaction,
    setSelectedTransaction,
    selectedMilestoneMotion,
  } = usePaymentBuilderContext();

  const {
    action: motionAction,
    motionState,
    refetchMotionState,
  } = useGetColonyAction(
    selectedTransaction ||
      fundingMotions?.[0]?.transactionHash ||
      selectedMilestoneMotion?.transactionHash,
  );

  const selectedMotion = fundingMotions.find(
    (motion) => motion?.transactionHash === selectedTransaction,
  );

  useEffect(() => {
    if (
      selectedMotion?.motionStateHistory.hasFailed ||
      selectedMotion?.motionStateHistory.hasFailedNotFinalizable
    ) {
      setSelectedTransaction('');
    }
  }, [
    selectedMotion?.motionStateHistory.hasFailed,
    selectedMotion?.motionStateHistory.hasFailedNotFinalizable,
    setSelectedTransaction,
  ]);

  const { motionId = '', motionStakes } = motionAction?.motionData || {};
  const isFundingClaimed = selectedMotion
    ? selectedMotion?.stakerRewards &&
      selectedMotion?.stakerRewards.length > 0 &&
      selectedMotion?.stakerRewards.every((reward) => reward.isClaimed)
    : fundingMotions?.[0]?.stakerRewards &&
      fundingMotions?.[0].stakerRewards.length > 0 &&
      fundingMotions[0].stakerRewards.every((reward) => reward.isClaimed);

  const isFundingMotionFailed = selectedMotion
    ? selectedMotion?.motionStateHistory.hasFailed ||
      selectedMotion?.motionStateHistory.hasFailedNotFinalizable
    : fundingMotions?.[0]?.motionStateHistory.hasFailed ||
      fundingMotions?.[0]?.motionStateHistory.hasFailedNotFinalizable;
  const hasMotionPassed = selectedMotion
    ? selectedMotion?.motionStateHistory.hasPassed
    : fundingMotions?.[0]?.motionStateHistory.hasPassed;
  const hasEveryMotionEnded =
    fundingMotions &&
    fundingMotions.length > 0 &&
    fundingMotions.every(
      (motion) =>
        motion?.motionStateHistory.hasPassed ||
        motion?.motionStateHistory.hasFailed ||
        motion?.motionStateHistory.hasFailedNotFinalizable,
    );

  useEffect(() => {
    if (
      fundingMotions &&
      fundingMotions.length > 0 &&
      expectedStepKey === ExpenditureStep.Release &&
      !hasEveryMotionEnded
    ) {
      setExpectedStepKey(null);
    }
  }, [expectedStepKey, hasEveryMotionEnded, fundingMotions]);

  useEffect(() => {
    if (
      !hasEveryMotionEnded &&
      (motionState === MotionState.FailedNotFinalizable ||
        motionState === MotionState.Invalid)
    ) {
      setSelectedTransaction(fundingMotions?.[0]?.transactionHash);
    }
  }, [
    fundingMotions,
    hasEveryMotionEnded,
    motionState,
    setSelectedTransaction,
  ]);

  useEffect(() => {
    setSelectedTransaction(fundingMotions?.[0]?.transactionHash);
  }, [fundingMotions, fundingMotions.length, setSelectedTransaction]);

  const milestones: MilestoneItem[] = useMemo(
    () =>
      (metadata?.stages || []).map((item) => {
        const payout = (slots || []).find((slot) => slot.id === item.slotId);
        const amount = payout?.payouts?.[0].amount;
        const tokenAddress = payout?.payouts?.[0].tokenAddress;
        const isClaimed = payout?.payouts?.[0].isClaimed;

        return {
          milestone: item.name,
          amount: amount || '0',
          tokenAddress: tokenAddress || ADDRESS_ZERO,
          slotId: item.slotId,
          isClaimed: isClaimed || false,
        };
      }),
    [slots, metadata],
  );
  const mappedReleaseActions: ReleaseActionItem[] = useMemo(() => {
    const { items } = releaseActions || {};

    if (!items) return [];

    return items.map((releaseAction) => {
      const { expenditureSlotIds } = releaseAction || {};

      return {
        userAddress: releaseAction?.initiatorAddress || '',
        createdAt: releaseAction?.createdAt || '',
        slotIds: expenditureSlotIds || [],
      };
    });
  }, [releaseActions]);

  const paymentStep =
    expenditure?.type === ExpenditureType.Staged
      ? {
          key: ExpenditureStep.Payment,
          heading: {
            label: formatText({ id: 'expenditure.paymentStage.label' }),
            decor:
              isPaymentMotion &&
              !motionAction?.motionData?.motionStateHistory.hasPassed &&
              !motionAction?.motionData?.motionStateHistory.hasFailed &&
              !motionAction?.motionData?.motionStateHistory
                .hasFailedNotFinalizable &&
              motionStakes ? (
                <MotionCountDownTimer
                  key={`${motionAction?.transactionHash}-${motionState}-${motionId}}`}
                  motionState={motionState}
                  motionId={motionId}
                  motionStakes={motionStakes}
                  refetchMotionState={refetchMotionState}
                />
              ) : null,
          },
          content: (
            <StagedPaymentStep
              items={milestones}
              expenditure={expenditure}
              expectedStepKey={expectedStepKey}
              releaseActions={mappedReleaseActions}
            />
          ),
        }
      : {
          key: ExpenditureStep.Payment,
          heading: {
            label: formatText({ id: 'expenditure.paymentStage.label' }),
          },
          content: <PaymentStepDetailsBlock expenditure={expenditure} />,
        };

  const items: StepperItem<ExpenditureStep>[] = [
    {
      key: ExpenditureStep.Create,
      heading: { label: formatText({ id: 'expenditure.createStage.label' }) },
      content: isStaked ? (
        <ActionWithStakingInfo
          userAdddress={expenditure?.ownerAddress}
          stakeAmount={stakeAmount ?? ''}
        />
      ) : (
        <ActionWithPermissionsInfo
          userAdddress={expenditure?.ownerAddress}
          createdAt={createdAt}
        />
      ),
    },
    {
      key: ExpenditureStep.Review,
      heading: { label: formatText({ id: 'expenditure.reviewStage.label' }) },
      content:
        expenditureStep === ExpenditureStep.Review ? (
          <>
            {isStagedExtensionInstalled ? (
              <StepDetailsBlock
                text={formatText({
                  id: 'expenditure.reviewStage.confirmDetails.info',
                })}
                content={
                  <ActionButton
                    disabled={
                      !expenditure?.ownerAddress ||
                      walletAddress !== expenditure?.ownerAddress
                    }
                    onSuccess={() => {
                      setExpectedStepKey(ExpenditureStep.Funding);
                    }}
                    loadingContent={
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
                    }
                    text={formatText({
                      id: 'expenditure.reviewStage.confirmDetails.button',
                    })}
                    values={lockExpenditurePayload}
                    actionType={ActionTypes.EXPENDITURE_LOCK}
                    mode="primarySolid"
                    className="w-full"
                    isLoading={expectedStepKey === ExpenditureStep.Funding}
                  />
                }
              />
            ) : (
              <UninstalledExtensionBox />
            )}
          </>
        ) : (
          <>
            {isStaked ? (
              <ActionWithStakingInfo
                userAdddress={expenditure?.ownerAddress}
                stakeAmount={stakeAmount ?? ''}
              />
            ) : (
              <ActionWithPermissionsInfo
                userAdddress={expenditure?.ownerAddress}
                createdAt={expenditure?.lockingActions?.items[0]?.createdAt}
              />
            )}
          </>
        ),
    },
    {
      key: ExpenditureStep.Funding,
      heading: {
        label: formatText({ id: 'expenditure.fundingStage.label' }),
        decor:
          isFundingMotion &&
          !hasMotionPassed &&
          !isFundingMotionFailed &&
          motionStakes ? (
            <MotionCountDownTimer
              key={`${motionAction?.transactionHash}-${motionState}-${motionId}}`}
              motionState={motionState}
              motionId={motionId}
              motionStakes={motionStakes}
              refetchMotionState={refetchMotionState}
            />
          ) : null,
      },
      content:
        expenditureStep === ExpenditureStep.Funding ? (
          <>
            {isStagedExtensionInstalled ? (
              <>
                {isFundingMotion &&
                !isFundingMotionFailed &&
                !isFundingClaimed ? (
                  <div className="flex flex-col gap-2">
                    <RequestBox
                      title={formatText({
                        id: 'expenditure.fundingRequest.title',
                      })}
                      motions={fundingMotions}
                    />
                    <MotionBox
                      transactionId={
                        selectedTransaction ||
                        fundingMotions?.[0].transactionHash ||
                        ''
                      }
                    />
                  </div>
                ) : (
                  <StepDetailsBlock
                    text={formatText({
                      id: 'expenditure.fundingStage.info',
                    })}
                    content={
                      <>
                        {fundingMotions && fundingMotions.length > 0 && (
                          <RequestBox
                            withoutPadding
                            title={formatText({
                              id: 'expenditure.fundingRequest.title',
                            })}
                            motions={fundingMotions}
                          />
                        )}
                        {expectedStepKey === ExpenditureStep.Release ? (
                          <IconButton
                            className="w-full"
                            rounded="s"
                            text={{ id: 'button.pending' }}
                            icon={
                              <span className="ml-1.5 flex shrink-0">
                                <SpinnerGap
                                  className="animate-spin"
                                  size={14}
                                />
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
              </>
            ) : (
              <UninstalledExtensionBox />
            )}
          </>
        ) : (
          <>
            {isFundingMotion ? (
              <div className="flex flex-col gap-2">
                <RequestBox
                  title={formatText({ id: 'expenditure.fundingRequest.title' })}
                  motions={fundingMotions}
                />
                <MotionBox
                  transactionId={
                    selectedTransaction ||
                    motions?.items[0]?.transactionHash ||
                    ''
                  }
                />
              </div>
            ) : undefined}
            {fundingActionsItems?.[0] && (
              <ActionWithPermissionsInfo
                userAdddress={fundingActionsItems[0].initiatorAddress}
                createdAt={fundingActionsItems[0]?.createdAt}
              />
            )}
          </>
        ),
    },
    {
      key: ExpenditureStep.Release,
      heading: {
        label: formatText({ id: 'expenditure.releaseStage.label' }),
      },
      content:
        expenditureStep === ExpenditureStep.Release ? (
          <>
            {isStagedExtensionInstalled ? (
              <StepDetailsBlock
                text={formatText({
                  id:
                    expenditure?.type === ExpenditureType.Staged
                      ? 'expenditure.releaseStage.staged.info'
                      : 'expenditure.releaseStage.info',
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
              <UninstalledExtensionBox />
            )}
          </>
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
                    userAdddress={finalizingActions?.items[0]?.initiatorAddress}
                    createdAt={finalizingActions?.items[0]?.createdAt}
                  />
                )}
              </>
            ) : (
              <div />
            )}
          </>
        ),
    },
    paymentStep,
  ];

  const currentIndex = getCancelStepIndex(expenditure);

  const updatedItems = isExpenditureCanceled
    ? [...items.slice(0, currentIndex), cancelItem]
    : items;

  if (loadingExpenditure) {
    return <SpinnerLoader appearance={{ size: 'medium' }} />;
  }

  return (
    <>
      <Stepper<ExpenditureStep>
        items={updatedItems}
        activeStepKey={activeStepKey}
        setActiveStepKey={setActiveStepKey}
      />
      {expenditure && (
        <>
          <ReleasePaymentModal
            expenditure={expenditure}
            isOpen={isReleasePaymentModalOpen}
            onClose={hideReleasePaymentModal}
            onSuccess={() => {
              setExpectedStepKey(ExpenditureStep.Payment);
            }}
            // @todo: update when split payment will be ready
            actionType={Action.PaymentBuilder}
          />
          <FundingModal
            isOpen={isFundingModalOpen}
            onClose={hideFundingModal}
            expenditure={expenditure}
            onSuccess={() => {
              setExpectedStepKey(ExpenditureStep.Release);
            }}
            // @todo: update when split payment will be ready
            actionType={Action.PaymentBuilder}
          />
        </>
      )}
    </>
  );
};

export default PaymentBuilderWidget;
