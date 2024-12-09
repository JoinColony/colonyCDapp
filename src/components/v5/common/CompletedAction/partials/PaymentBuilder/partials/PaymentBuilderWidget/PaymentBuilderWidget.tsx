import { SpinnerGap } from '@phosphor-icons/react';
import React, { useState, type FC, useEffect, useMemo } from 'react';

import { Action } from '~constants/actions.ts';
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
import Numeral from '~shared/Numeral/Numeral.tsx';
import SpinnerLoader from '~shared/Preloaders/SpinnerLoader.tsx';
import { notMaybe, notNull } from '~utils/arrays/index.ts';
import { MotionState } from '~utils/colonyMotions.ts';
import { getClaimableExpenditurePayouts } from '~utils/expenditures.ts';
import { formatText } from '~utils/intl.ts';
import { isMultiSig } from '~utils/multiSig/index.ts';
import {
  CacheQueryKeys,
  getSafePollingInterval,
  removeCacheEntry,
} from '~utils/queries.ts';
import useGetColonyAction from '~v5/common/ActionSidebar/hooks/useGetColonyAction.ts';
import { useGetExpenditureData } from '~v5/common/ActionSidebar/hooks/useGetExpenditureData.ts';
import MotionCountDownTimer from '~v5/common/ActionSidebar/partials/Motions/partials/MotionCountDownTimer/MotionCountDownTimer.tsx';
import PenaliseBadge from '~v5/common/Pills/PenaliseBadge/PenaliseBadge.tsx';
import ActionButton from '~v5/shared/Button/ActionButton.tsx';
import Button from '~v5/shared/Button/Button.tsx';
import IconButton from '~v5/shared/Button/IconButton.tsx';
import { LoadingBehavior } from '~v5/shared/Button/types.ts';
import MotionWidgetSkeleton from '~v5/shared/MotionWidgetSkeleton/MotionWidgetSkeleton.tsx';
import Stepper from '~v5/shared/Stepper/index.ts';
import { type StepperItem } from '~v5/shared/Stepper/types.ts';

import ActionWithPermissionsInfo from '../ActionWithPermissionsInfo/ActionWithPermissionsInfo.tsx';
import ActionWithStakingInfo from '../ActionWithStakingInfo/ActionWithStakingInfo.tsx';
import CancelRequests from '../CancelRequests/CancelRequests.tsx';
import FinalizeByPaymentCreatorInfo from '../FinalizeByPaymentCreatorInfo/FinalizeByPaymentCreatorInfo.tsx';
import FormatDate from '../FormatDate/FormatDate.tsx';
import FundingModal from '../FundingModal/FundingModal.tsx';
import FundingRequests from '../FundingRequests/FundingRequests.tsx';
import MotionBox from '../MotionBox/MotionBox.tsx';
import PaymentStepDetailsBlock from '../PaymentStepDetailsBlock/PaymentStepDetailsBlock.tsx';
import ReleasePaymentModal from '../ReleasePaymentModal/ReleasePaymentModal.tsx';
import { waitForDbAfterClaimingPayouts } from '../ReleasePaymentModal/utils.ts';
import StagedPaymentStep from '../StagedPaymentStep/StagedPaymentStep.tsx';
import StepDetailsBlock from '../StepDetailsBlock/StepDetailsBlock.tsx';
import UninstalledExtensionBox from '../UninstalledExtensionBox/UninstalledExtensionBox.tsx';

import MultiSigFunding from './partials/MultiSigFunding.tsx';
import { ExpenditureStep, type PaymentBuilderWidgetProps } from './types.ts';
import {
  getCancelStepIndex,
  getExpenditureStep,
  getShouldShowMotionTimer,
  isExpenditureFullyFunded,
  sortActionsByCreatedDate,
  segregateCancelActions,
} from './utils.ts';

const PaymentBuilderWidget: FC<PaymentBuilderWidgetProps> = ({ action }) => {
  const { colony, refetchColony } = useColonyContext();
  const { nativeToken } = colony;
  const { refetch: refetchExpenditures } = useGetColonyExpendituresQuery({
    variables: {
      colonyAddress: colony.colonyAddress,
    },
  });
  const { user } = useAppContext();
  const { walletAddress } = user || {};
  const { stagedExpenditureAddress } = useEnabledExtensions();

  const {
    isFundingModalOpen,
    toggleOffFundingModal: hideFundingModal,
    toggleOnFundingModal: showFundingModal,
    isReleaseModalOpen: isReleasePaymentModalOpen,
    toggleOffReleaseModal: hideReleasePaymentModal,
    toggleOnReleaseModal: showReleasePaymentModal,
    selectedFundingAction,
    selectedReleaseAction,
    setSelectedFundingAction,
    setSelectedReleaseAction,
    selectedCancellingAction,
    setSelectedCancellingAction,
  } = usePaymentBuilderContext();

  const { expenditureId } = action;

  const {
    expenditure,
    loadingExpenditure,
    refetchExpenditure,
    startPolling,
    stopPolling,
  } = useGetExpenditureData(expenditureId, { pollUntilUnmount: true });

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
  const {
    amount: stakeAmount = '',
    isClaimed: isUserStakeClaimed,
    userAddress,
  } = userStake || {};
  const previousStatus = usePrevious(status);

  const expenditureStep = getExpenditureStep(expenditure);

  const [expectedStepKey, setExpectedStepKey] =
    useState<ExpenditureStep | null>(null);
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
  }, [expenditureStep, refetchColony, refetchExpenditures]);

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
  }, [expectedStepKey, expenditureStep, setExpectedStepKey]);

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

  const { motionData: selectedCancellingMotion } =
    selectedCancellingAction ?? {};
  const {
    motionState: cancellingMotionState,
    refetchMotionState: refetchCancellingMotionState,
  } = useGetColonyAction(selectedCancellingAction?.transactionHash);

  const shouldShowCancellingMotionTimer =
    cancellingMotionState &&
    [
      MotionState.Staking,
      MotionState.Supported,
      MotionState.Voting,
      MotionState.Reveal,
    ].includes(cancellingMotionState);

  const sortedCancellingActions = useMemo(
    () =>
      cancellingActions?.items.filter(notNull).sort((a, b) => {
        if (a?.createdAt && b?.createdAt) {
          return Date.parse(b.createdAt) - Date.parse(a.createdAt);
        }
        return 0;
      }) ?? [],
    [cancellingActions?.items],
  );
  const allCancelledMotions = sortedCancellingActions
    .map((cancellingAction) => cancellingAction?.motionData)
    .filter(notMaybe);
  const isAnyCancellingMotionInProgress = allCancelledMotions?.some(
    (motion) =>
      !motion.motionStateHistory.hasPassed &&
      !motion.isFinalized &&
      !motion.motionStateHistory.hasFailedNotFinalizable,
  );
  const isExpenditureCanceled =
    expenditureStep.includes(ExpenditureStep.Cancel) ||
    expenditureStep === ExpenditureStep.Reclaim;

  useEffect(() => {
    if (!selectedCancellingAction && sortedCancellingActions.length > 0) {
      setSelectedCancellingAction(sortedCancellingActions[0]);
    }

    if (
      selectedCancellingAction &&
      !sortedCancellingActions.some(
        (cancellingAction) =>
          cancellingAction.transactionHash ===
          selectedCancellingAction.transactionHash,
      )
    ) {
      setSelectedCancellingAction(null);
    }
  }, [
    selectedCancellingAction,
    setSelectedCancellingAction,
    sortedCancellingActions,
  ]);

  const segregatedCancelActions = segregateCancelActions(expenditure);

  const getCancelItem = (
    itemIndex: number,
    actions,
  ): StepperItem<ExpenditureStep> => {
    const allCancelMotions = actions
      .map((cancelActions) => cancelActions.motionData)
      .filter(notMaybe);
    const isSelectedActionInCurrentActions = actions.some(
      (currentAction) =>
        currentAction.transactionHash ===
        selectedCancellingAction?.transactionHash,
    );
    const isSelectedMotionInCurrentActions = actions.some(
      (currentAction) =>
        currentAction.motionData?.motionId ===
        selectedCancellingMotion?.motionId,
    );
    const itemKey = `${ExpenditureStep.Cancel}-${itemIndex}`;

    return {
      key: itemKey,
      heading: {
        label: formatText({ id: 'expenditure.cancelStage.label' }),
        decor:
          selectedCancellingMotion &&
          shouldShowCancellingMotionTimer &&
          itemKey === expenditureStep ? (
            <MotionCountDownTimer
              motionState={cancellingMotionState}
              motionId={selectedCancellingMotion.motionId}
              motionStakes={selectedCancellingMotion.motionStakes}
              refetchMotionState={refetchCancellingMotionState}
            />
          ) : null,
      },
      content:
        allCancelMotions.length > 0 ? (
          <div className="flex flex-col gap-2">
            {allCancelMotions.length > 0 && (
              <CancelRequests actions={actions} />
            )}

            {selectedCancellingMotion && isSelectedMotionInCurrentActions && (
              <MotionBox
                transactionId={selectedCancellingMotion.transactionHash}
                isActionCancelled={
                  expenditure?.status === ExpenditureStatus.Cancelled
                }
              />
            )}

            {selectedCancellingAction &&
              isSelectedActionInCurrentActions &&
              !selectedCancellingMotion && (
                <ActionWithPermissionsInfo action={selectedCancellingAction} />
              )}
          </div>
        ) : (
          <ActionWithPermissionsInfo
            action={sortedCancellingActions?.[0]}
            title={formatText({ id: 'expenditure.cancelStage.info' })}
          />
        ),
      isHidden: allCancelMotions.length === 0 && !isExpenditureCanceled,
    };
  };

  const isUserStaker = walletAddress === userAddress;

  const reclaimStakeItem: StepperItem<ExpenditureStep> = {
    key: ExpenditureStep.Reclaim,
    heading: {
      label: formatText({ id: 'expenditure.reclaimStage.label' }),
    },
    content: (
      <StepDetailsBlock
        text={formatText({ id: 'expenditure.reclaimStage.title' })}
        content={
          <>
            <div className="mb-2 flex items-center justify-between gap-2">
              <h5 className="text-1">
                {formatText({ id: 'expenditure.staking.overview' })}
              </h5>
              {isUserStakeClaimed && isUserStaker && (
                <>
                  {expenditure?.userStake?.isForfeited ? (
                    <PenaliseBadge
                      text={formatText({ id: 'expenditure.penalised' })}
                      isPenalised
                    />
                  ) : (
                    <PenaliseBadge
                      text={formatText({ id: 'expenditure.noPenalty' })}
                      isPenalised={false}
                    />
                  )}
                </>
              )}
            </div>
            {isUserStaker && (
              <div className="mb-2 flex items-center justify-between gap-2 text-sm">
                <p>{formatText({ id: 'expenditure.staking.amount' })}</p>
                <p>
                  <Numeral
                    value={stakeAmount}
                    decimals={nativeToken.decimals}
                  />{' '}
                  {nativeToken.symbol}
                </p>
              </div>
            )}
            <div className="flex items-center justify-between gap-2 text-sm">
              <p>{formatText({ id: 'expenditure.staking.canceled' })}</p>
              <FormatDate value={cancellingActions?.items?.[0]?.createdAt} />
            </div>
          </>
        }
      />
    ),
    isHidden: expenditureStep !== ExpenditureStep.Reclaim,
  };

  const isStagedExpenditure = expenditure?.type === ExpenditureType.Staged;
  const isExpenditureFunded = isExpenditureFullyFunded(expenditure);

  const {
    action: fundingAction,
    loadingAction,
    motionState: fundingMotionState,
    refetchMotionState: refetchFundingMotionState,
  } = useGetColonyAction(selectedFundingAction?.transactionHash);

  const sortedFundingActions = useMemo(
    () =>
      fundingActions?.items.filter(notNull).sort(sortActionsByCreatedDate) ??
      [],
    [fundingActions?.items],
  );
  const allFundingMotions = sortedFundingActions
    .map((fundingMotionAction) => fundingMotionAction.motionData)
    .filter(notMaybe);
  const selectedFundingMotion = selectedFundingAction?.motionData;

  const isAnyFundingMotionInProgress = allFundingMotions.some(
    (motion) =>
      !motion.isFinalized && !motion.motionStateHistory.hasFailedNotFinalizable,
  );
  const hasUninstalledExtension =
    expenditure?.stagedExpenditureAddress &&
    stagedExpenditureAddress !== expenditure.stagedExpenditureAddress;

  const allFundingMultiSigs = sortedFundingActions
    .map((fundingMultiSigAction) => fundingMultiSigAction.multiSigData)
    .filter(notMaybe);
  const selectedFundingMultiSig = selectedFundingAction?.multiSigData;
  const isAnyFundingMultiSigInProgress = allFundingMultiSigs.some(
    (multiSig) => !multiSig.isExecuted && !multiSig.isRejected,
  );

  const shouldShowFundingButton =
    !isAnyFundingMotionInProgress &&
    !isAnyFundingMultiSigInProgress &&
    !isExpenditureFunded &&
    !hasUninstalledExtension;

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

  const getFundingStepContent = () => {
    if (selectedFundingMotion) {
      return (
        <MotionBox transactionId={selectedFundingMotion.transactionHash} />
      );
    }
    // since the multisig widget doesn't fetch its own action we need to handle the loader here
    if (selectedFundingMultiSig) {
      if (loadingAction || !fundingAction) {
        return <MotionWidgetSkeleton />;
      }

      if (isMultiSig(fundingAction)) {
        return (
          <MultiSigFunding
            action={fundingAction}
            onMultiSigRejected={() => {
              setExpectedStepKey(null);
            }}
          />
        );
      }

      console.warn(
        "The provided assumed multiSig action doesn't pass the type guard, something is wrong",
      );
      return null;
    }

    if (selectedFundingAction) {
      return <ActionWithPermissionsInfo action={selectedFundingAction} />;
    }
    return null;
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
            {hasUninstalledExtension ? (
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
                    isFullSize
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
    {
      key: ExpenditureStep.Funding,
      heading: {
        label: formatText({ id: 'expenditure.fundingStage.label' }),
        decor:
          selectedFundingMotion &&
          fundingMotionState &&
          getShouldShowMotionTimer(fundingMotionState) ? (
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
          {hasUninstalledExtension &&
            expenditureStep === ExpenditureStep.Funding && (
              <UninstalledExtensionBox />
            )}
          {sortedFundingActions.length > 0 && (
            <FundingRequests actions={sortedFundingActions} />
          )}
          {getFundingStepContent()}
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
    },
    {
      key: ExpenditureStep.Release,
      heading: { label: formatText({ id: 'expenditure.releaseStage.label' }) },
      content: (
        <>
          {expenditureStep === ExpenditureStep.Release ? (
            <>
              {hasUninstalledExtension ? (
                <UninstalledExtensionBox />
              ) : (
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
          )}
        </>
      ),
    },
    paymentStep,
  ];

  if (allCancelledMotions.length > 0 || isExpenditureCanceled) {
    if (
      segregatedCancelActions.beforeLocked &&
      segregatedCancelActions.beforeLocked.length > 0
    ) {
      items.splice(
        1,
        0,
        getCancelItem(0, segregatedCancelActions.beforeLocked),
      );
    }
    if (
      segregatedCancelActions.locked &&
      segregatedCancelActions.locked.length > 0
    ) {
      items.splice(2, 0, getCancelItem(1, segregatedCancelActions.locked));
    }
    if (
      segregatedCancelActions.funding &&
      segregatedCancelActions.funding.length > 0
    ) {
      const fundingItemIndex = items.findIndex(
        (item) => item.key === ExpenditureStep.Funding,
      );

      items.splice(
        fundingItemIndex + 1,
        0,
        getCancelItem(2, segregatedCancelActions.funding),
      );
    }
  }

  const currentIndex = getCancelStepIndex(expenditure, items);

  const updatedItems =
    (isExpenditureCanceled && !isAnyCancellingMotionInProgress) ||
    expenditure?.status === ExpenditureStatus.Cancelled
      ? [...items.slice(0, currentIndex), reclaimStakeItem]
      : items;

  if (loadingExpenditure) {
    return <SpinnerLoader appearance={{ size: 'medium' }} />;
  }

  return (
    <>
      <Stepper<ExpenditureStep>
        items={updatedItems}
        activeStepKey={expenditureStep}
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
          />
        </>
      )}
    </>
  );
};

export default PaymentBuilderWidget;
