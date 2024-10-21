import { SpinnerGap } from '@phosphor-icons/react';
import React, { useState, type FC, useEffect, useMemo } from 'react';

import { Action } from '~constants/actions.ts';
import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { usePaymentBuilderContext } from '~context/PaymentBuilderContext/PaymentBuilderContext.ts';
import {
  ExpenditureStatus,
  ExpenditureType,
  useGetColonyExpendituresQuery,
} from '~gql';
import useEnabledExtensions from '~hooks/useEnabledExtensions.ts';
import usePrevious from '~hooks/usePrevious.ts';
import { ActionTypes } from '~redux';
import { type LockExpenditurePayload } from '~redux/sagas/expenditures/lockExpenditure.ts';
import SpinnerLoader from '~shared/Preloaders/SpinnerLoader.tsx';
import { type ExpenditureAction } from '~types/graphql.ts';
import { notMaybe, notNull } from '~utils/arrays/index.ts';
import { MotionState } from '~utils/colonyMotions.ts';
import { getClaimableExpenditurePayouts } from '~utils/expenditures.ts';
import { formatText } from '~utils/intl.ts';
import {
  CacheQueryKeys,
  getSafePollingInterval,
  removeCacheEntry,
} from '~utils/queries.ts';
import useGetColonyAction from '~v5/common/ActionSidebar/hooks/useGetColonyAction.ts';
import { useGetExpenditureData } from '~v5/common/ActionSidebar/hooks/useGetExpenditureData.ts';
import MotionCountDownTimer from '~v5/common/ActionSidebar/partials/Motions/partials/MotionCountDownTimer/MotionCountDownTimer.tsx';
import ActionButton from '~v5/shared/Button/ActionButton.tsx';
import Button from '~v5/shared/Button/Button.tsx';
import IconButton from '~v5/shared/Button/IconButton.tsx';
import { LoadingBehavior } from '~v5/shared/Button/types.ts';
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
import { waitForDbAfterClaimingPayouts } from '../ReleasePaymentModal/utils.ts';
import StagedPaymentStep from '../StagedPaymentStep/StagedPaymentStep.tsx';
import StepDetailsBlock from '../StepDetailsBlock/StepDetailsBlock.tsx';
import UninstalledExtensionBox from '../UninstalledExtensionBox/UninstalledExtensionBox.tsx';

import { ExpenditureStep, type PaymentBuilderWidgetProps } from './types.ts';
import {
  getExpenditureStep,
  getShouldShowMotionTimer,
  isExpenditureFullyFunded,
  sortActionsByCreatedDate,
  getCurrentStepIndex,
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
    selectedReleaseAction,
    setSelectedReleaseAction,
    currentStep,
    setCurrentStep,
    setSelectedEditingAction,
    selectedFundingAction,
    setSelectedFundingAction,
  } = usePaymentBuilderContext();
  const { isEditMode } = useActionSidebarContext();

  const { expenditureId } = action;

  const {
    expenditure,
    loadingExpenditure,
    refetchExpenditure,
    startPolling,
    stopPolling,
  } = useGetExpenditureData(expenditureId);

  const {
    fundingActions,
    finalizingActions,
    cancellingActions,
    releaseActions,
    finalizedAt,
    isStaked,
    userStake,
    ownerAddress,
    status,
  } = expenditure || {};
  const { amount: stakeAmount = '' } = userStake || {};
  const previousStatus = usePrevious(status);

  const expenditureStep = getExpenditureStep(expenditure);

  const [expectedStepKey, setExpectedStepKey] =
    useState<ExpenditureStep | null>(null);
  const [activeStepKey, setActiveStepKey] = useState<ExpenditureStep | string>(
    expenditureStep,
  );
  const [isWaitingForClaimedPayouts, setIsWaitingForClaimedPayouts] =
    useState(false);

  const [previousFundingActionsCount, setPreviousFundingActionsCount] =
    useState(0);
  const [previousReleaseActionsCount, setPreviousReleaseActionsCount] =
    useState(0);

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
    if (
      expenditureStep === ExpenditureStep.Payment &&
      previousStatus !== undefined &&
      previousStatus !== ExpenditureStatus.Finalized
    ) {
      // Payments with 0 claim delay will be paid immediately once at the payment step
      // we need to remove all getDomainBalance queries to refetch the correct balances
      removeCacheEntry(CacheQueryKeys.GetDomainBalance);
    }
  }, [expenditureStep, previousStatus]);

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
  const { motionState, refetchMotionState } = useGetColonyAction(
    selectedFundingAction?.transactionHash,
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

  const isStagedExpenditure = expenditure?.type === ExpenditureType.Staged;

  const {
    motionState: releaseMotionState,
    refetchMotionState: refetchReleaseMotionState,
  } = useGetColonyAction(selectedReleaseAction?.transactionHash);

  const sortedReleaseActions = useMemo(
    () =>
      releaseActions?.items.filter(notNull).sort(sortActionsByCreatedDate) ??
      [],
    [releaseActions?.items],
  );
  const selectedReleaseMotion = selectedReleaseAction?.motionData;

  useEffect(() => {
    if (
      sortedFundingActions.length !== previousFundingActionsCount ||
      !selectedFundingAction
    ) {
      setSelectedFundingAction(sortedFundingActions[0] ?? null);
      setPreviousFundingActionsCount(sortedFundingActions.length);
    }
  }, [
    sortedFundingActions,
    setSelectedFundingAction,
    previousFundingActionsCount,
    selectedFundingAction,
  ]);

  useEffect(() => {
    if (
      sortedReleaseActions.length !== previousReleaseActionsCount ||
      !selectedReleaseAction
    ) {
      setSelectedReleaseAction(sortedReleaseActions[0] ?? null);
      setPreviousReleaseActionsCount(sortedReleaseActions.length);
    }
  }, [
    sortedReleaseActions,
    setSelectedReleaseAction,
    previousReleaseActionsCount,
    selectedReleaseAction,
  ]);

  useEffect(() => {
    return () => {
      setSelectedFundingAction(null);
      setSelectedReleaseAction(null);
    };
  }, [setSelectedFundingAction, setSelectedReleaseAction]);

  const paymentStep = isStagedExpenditure
    ? {
        key: ExpenditureStep.Payment,
        heading: {
          label: formatText({ id: 'expenditure.paymentStage.label' }),
          decor:
            selectedReleaseMotion &&
            releaseMotionState &&
            getShouldShowMotionTimer(releaseMotionState) ? (
              <MotionCountDownTimer
                key={selectedReleaseAction?.transactionHash}
                motionState={releaseMotionState}
                motionId={selectedReleaseMotion.motionId}
                motionStakes={selectedReleaseMotion.motionStakes}
                refetchMotionState={refetchReleaseMotionState}
              />
            ) : null,
        },
        content: (
          <StagedPaymentStep
            releaseActions={sortedReleaseActions}
            expenditure={expenditure}
            expectedStepKey={expectedStepKey}
            previousReleaseActionsCount={previousReleaseActionsCount}
          />
        ),
      }
    : {
        key: ExpenditureStep.Payment,
        heading: {
          label: formatText({ id: 'expenditure.paymentStage.label' }),
        },
        content: (
          <PaymentStepDetailsBlock
            expenditure={expenditure}
            isWaitingForClaimedPayouts={isWaitingForClaimedPayouts}
          />
        ),
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
                    loadingBehavior={LoadingBehavior.TxLoader}
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
      heading: { label: formatText({ id: 'expenditure.releaseStage.label' }) },
      content: (
        <>
          {!isStagedExtensionInstalled && isStagedExpenditure ? (
            <UninstalledExtensionBox />
          ) : (
            <>
              {expenditureStep === ExpenditureStep.Release ? (
                <StepDetailsBlock
                  text={formatText({
                    id: 'expenditure.releaseStage.info',
                  })}
                  content={
                    <Button
                      className="w-full"
                      onClick={showReleasePaymentModal}
                      text={formatText({
                        id: 'expenditure.releaseStage.button',
                      })}
                      loading={expectedStepKey === ExpenditureStep.Payment}
                    />
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
            </>
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
            onSuccess={async () => {
              setExpectedStepKey(ExpenditureStep.Payment);

              try {
                const claimablePayouts = getClaimableExpenditurePayouts(
                  expenditure.slots,
                );
                setIsWaitingForClaimedPayouts(true);
                await waitForDbAfterClaimingPayouts(
                  claimablePayouts,
                  refetchExpenditure,
                );
              } finally {
                setIsWaitingForClaimedPayouts(false);
              }
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
