import { SpinnerGap } from '@phosphor-icons/react';
import React, { useState, type FC, useEffect, useMemo } from 'react';

import { ADDRESS_ZERO } from '~constants';
import { Action } from '~constants/actions.ts';
import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { usePaymentBuilderContext } from '~context/PaymentBuilderContext/PaymentBuilderContext.ts';
import {
  useGetColonyExpendituresQuery,
  ColonyActionType,
  ExpenditureType,
} from '~gql';
import useEnabledExtensions from '~hooks/useEnabledExtensions.ts';
import { ActionTypes } from '~redux';
import { type LockExpenditurePayload } from '~redux/sagas/expenditures/lockExpenditure.ts';
import SpinnerLoader from '~shared/Preloaders/SpinnerLoader.tsx';
import { type ExpenditureAction } from '~types/graphql.ts';
import { notMaybe, notNull } from '~utils/arrays/index.ts';
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
import EditStep from '../EditStep/EditStep.tsx';
import FinalizeByPaymentCreatorInfo from '../FinalizeByPaymentCreatorInfo/FinalizeByPaymentCreatorInfo.tsx';
import FundingModal from '../FundingModal/FundingModal.tsx';
import FundingRequests from '../FundingRequests/FundingRequests.tsx';
import MotionBox from '../MotionBox/MotionBox.tsx';
import PaymentStepDetailsBlock from '../PaymentStepDetailsBlock/PaymentStepDetailsBlock.tsx';
import ReleasePaymentModal from '../ReleasePaymentModal/ReleasePaymentModal.tsx';
import { type MilestoneItem } from '../StagedPaymentStep/partials/MilestoneReleaseModal/types.ts';
import StagedPaymentStep, {
  type ReleaseActionItem,
} from '../StagedPaymentStep/StagedPaymentStep.tsx';
import StepDetailsBlock from '../StepDetailsBlock/StepDetailsBlock.tsx';
import UninstalledExtensionBox from '../UninstalledExtensionBox/UninstalledExtensionBox.tsx';

import { ExpenditureStep, type PaymentBuilderWidgetProps } from './types.ts';
import {
  getCurrentStepIndex,
  getExpenditureStep,
  isExpenditureFullyFunded,
  getFundingItemIndex,
  segregateFundingActions,
  segregateEditActions,
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
  const { isStagedExtensionInstalled } = useEnabledExtensions();

  const {
    isFundingModalOpen,
    toggleOffFundingModal: hideFundingModal,
    toggleOnFundingModal: showFundingModal,
    isReleaseModalOpen: isReleasePaymentModalOpen,
    toggleOffReleaseModal: hideReleasePaymentModal,
    toggleOnReleaseModal: showReleasePaymentModal,
    currentStep,
    setCurrentStep,
    setSelectedEditingAction,
    selectedFundingAction,
    setSelectedFundingAction,
    selectedMilestoneMotion,
  } = usePaymentBuilderContext();
  const { isEditMode } = useActionSidebarContext();

  const { expenditureId } = action;

  const { expenditure, loadingExpenditure, startPolling, stopPolling } =
    useGetExpenditureData(expenditureId);

  const {
    fundingActions,
    finalizingActions,
    cancellingActions,
    releaseActions,
    finalizedAt,
    isStaked,
    userStake,
    ownerAddress,
    motions,
    slots,
    metadata,
  } = expenditure || {};
  const { amount: stakeAmount = '' } = userStake || {};

  const expenditureStep = getExpenditureStep(expenditure);

  const [activeStepKey, setActiveStepKey] = useState<ExpenditureStep | string>(
    expenditureStep,
  );
  const [expectedStepKey, setExpectedStepKey] = useState<
    ExpenditureStep | string | null
  >(null);

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

    if (expenditureStep.startsWith(ExpenditureStep.Funding)) {
      const groupedFundingActions = segregateFundingActions(expenditure);
      const itemIndex = getFundingItemIndex(groupedFundingActions);

      setActiveStepKey(`${ExpenditureStep.Funding}-${itemIndex}`);
      setCurrentStep(`${ExpenditureStep.Funding}-${itemIndex}`);

      return;
    }
    setActiveStepKey(expenditureStep);
    setCurrentStep(expenditureStep);
  }, [
    expenditure,
    expenditureStep,
    refetchColony,
    refetchExpenditures,
    setCurrentStep,
    setSelectedEditingAction,
  ]);

  useEffect(() => {
    setSelectedEditingAction(null);
  }, [currentStep, setSelectedEditingAction]);

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
    content: <ActionWithPermissionsInfo action={cancellingActions?.items[0]} />,
    isHidden: expenditureStep !== ExpenditureStep.Cancel,
  };

  const getEditItem = (actions: ExpenditureAction[], index: number) => {
    return {
      key: `${ExpenditureStep.Edit}-${index}`,
      heading: {
        label: formatText({ id: 'expenditure.editStage.label' }),
      },
      content: expenditure ? <EditStep actions={actions} /> : null,
    };
  };

  const isExpenditureCanceled = expenditureStep === ExpenditureStep.Cancel;
  const isPaymentMotion =
    motions?.items?.length &&
    motions.items?.[0]?.action?.type ===
      ColonyActionType.ReleaseStagedPaymentsMotion;

  const isExpenditureFunded = isExpenditureFullyFunded(expenditure);

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
    action: motionAction,
    motionState,
    refetchMotionState,
  } = useGetColonyAction(
    selectedFundingAction?.transactionHash ||
      selectedMilestoneMotion?.transactionHash,
  );

  const shouldShowFundingMotionTimer =
    motionState &&
    [
      MotionState.Staking,
      MotionState.Supported,
      MotionState.Voting,
      MotionState.Reveal,
    ].includes(motionState);

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

  const getFundingItem = (itemIndex: number) => {
    const segregatedFundingActions = segregateFundingActions(expenditure);

    const currentActions = segregatedFundingActions?.[itemIndex]
      ? segregatedFundingActions[itemIndex]
      : [];

    const allFundingMotions = currentActions
      .map((fundingAction) => fundingAction.motionData)
      .filter(notMaybe);
    const isAnyFundingMotionInProgress = allFundingMotions.some(
      (motion) =>
        !motion.isFinalized &&
        !motion.motionStateHistory.hasFailedNotFinalizable,
    );
    const shouldShowFundingButton =
      !isAnyFundingMotionInProgress && !isExpenditureFunded;

    const itemKey = `${ExpenditureStep.Funding}-${itemIndex}`;

    const isSelectedActionInCurrentActions = currentActions.some(
      (currentAction) =>
        currentAction.transactionHash ===
        selectedFundingAction?.transactionHash,
    );
    const isSelectedMotionInCurrentActions = currentActions.some(
      (currentAction) =>
        currentAction.motionData?.motionId === selectedFundingMotion?.motionId,
    );

    const fundingItem = {
      key: itemKey,
      heading: {
        label: formatText({ id: 'expenditure.fundingStage.label' }),
        decor:
          selectedFundingMotion &&
          shouldShowFundingMotionTimer &&
          expenditureStep === itemKey ? (
            <MotionCountDownTimer
              motionState={motionState}
              motionId={selectedFundingMotion.motionId}
              motionStakes={selectedFundingMotion.motionStakes}
              refetchMotionState={refetchMotionState}
            />
          ) : null,
      },
      content: (
        <div className="flex flex-col gap-2">
          {currentActions.length > 0 && (
            <FundingRequests actions={currentActions} />
          )}

          {selectedFundingMotion && isSelectedMotionInCurrentActions && (
            <MotionBox transactionId={selectedFundingMotion.transactionHash} />
          )}

          {selectedFundingAction &&
            isSelectedActionInCurrentActions &&
            !selectedFundingMotion && (
              <ActionWithPermissionsInfo action={selectedFundingAction} />
            )}

          {shouldShowFundingButton && expenditureStep === itemKey && (
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
                      disabled={isEditMode}
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

    return fundingItem;
  };

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

  const isStagedExpenditure = expenditure?.type === ExpenditureType.Staged;

  const paymentStep = isStagedExpenditure
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
            motionAction?.motionData?.motionStakes ? (
              <MotionCountDownTimer
                key={`${motionAction?.transactionHash}-${motionState}-${motionAction.motionData.motionId}}`}
                motionState={motionState}
                motionId={motionAction.motionData.motionId}
                motionStakes={motionAction?.motionData?.motionStakes}
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
        <ActionWithPermissionsInfo action={action} />
      ),
    },
    {
      key: ExpenditureStep.Review,
      heading: { label: formatText({ id: 'expenditure.reviewStage.label' }) },
      content:
        expenditureStep === ExpenditureStep.Review ? (
          <>
            {!isStagedExtensionInstalled && isStagedExpenditure ? (
              <UninstalledExtensionBox />
            ) : (
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
                action={expenditure?.lockingActions?.items[0]}
              />
            )}
          </>
        ),
    },
    getFundingItem(0),
    {
      key: ExpenditureStep.Release,
      heading: {
        label: formatText({ id: 'expenditure.releaseStage.label' }),
      },
      content:
        expenditureStep === ExpenditureStep.Release ? (
          <>
            {!isStagedExtensionInstalled && isStagedExpenditure ? (
              <UninstalledExtensionBox />
            ) : (
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
                    action={finalizingActions?.items[0]}
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

  const currentIndex = getCurrentStepIndex(expenditure);
  const editedActions = segregateEditActions(expenditure);
  const fundingPillItems = segregateFundingActions(expenditure);

  if (fundingPillItems && fundingPillItems.length > 0) {
    fundingPillItems.forEach(() => {
      const fundingItems = items.filter((item) =>
        item.key.startsWith(ExpenditureStep.Funding),
      );

      const newestFundingItemKey = fundingItems
        .map((fundingItem) => {
          const [fundingIndex] = fundingItem.key.split('-').slice(-1);
          return Number(fundingIndex);
        })
        .sort((a, b) => b - a)[0];

      const latestFundingItem = fundingItems.find(
        (fundingItem) =>
          fundingItem.key ===
          `${ExpenditureStep.Funding}-${newestFundingItemKey}`,
      );

      const fundingStepIndex = items.findIndex(
        (item) => item.key === latestFundingItem?.key,
      );

      const numberOfFundingItemsNeeded = fundingPillItems.length;
      const numberOfFundingItems = fundingItems.length;

      const nextFundingStepKey = `${ExpenditureStep.Funding}-${newestFundingItemKey + 1}`;

      const needsMoreFundingItems =
        numberOfFundingItemsNeeded > numberOfFundingItems;
      const isAtNextFundingStep =
        numberOfFundingItemsNeeded === numberOfFundingItems &&
        !isExpenditureFunded &&
        expenditureStep === nextFundingStepKey;

      if (needsMoreFundingItems || isAtNextFundingStep) {
        items.splice(
          fundingStepIndex + 1,
          0,
          getFundingItem(newestFundingItemKey + 1),
        );
      }
    });
  }

  if (editedActions) {
    const fundingItems = items.filter((item) =>
      item.key.startsWith(ExpenditureStep.Funding),
    );

    if (editedActions.funding.length > 0) {
      editedActions.funding.forEach((actions, index) => {
        const selectedFundingItem = fundingItems[index];
        const latestFundingItem = fundingItems[fundingItems.length - 1];

        const fundingStepIndex = items.findIndex(
          (item) => item.key === selectedFundingItem?.key,
        );
        const latestFundingItemIndex = items.findIndex(
          (item) => item.key === latestFundingItem.key,
        );

        items.splice(
          selectedFundingItem ? fundingStepIndex : latestFundingItemIndex + 1,
          0,
          getEditItem(
            actions,
            selectedFundingItem ? fundingStepIndex : latestFundingItemIndex,
          ),
        );
      });
    }

    if (editedActions.finalizing.length > 0) {
      const releaseStepIndex = items.findIndex(
        (item) => item.key === ExpenditureStep.Release,
      );

      items.splice(
        releaseStepIndex,
        0,
        getEditItem(editedActions.finalizing, releaseStepIndex),
      );
    }
  }

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
        setCurrentStepKey={setCurrentStep}
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
