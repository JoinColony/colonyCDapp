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
import { DecisionMethod } from '~types/actions.ts';
import { type ColonyAction } from '~types/graphql.ts';
import { notMaybe, notNull } from '~utils/arrays/index.ts';
import { MotionState } from '~utils/colonyMotions.ts';
import {
  getClaimableExpenditurePayouts,
  getExpenditureCreatingActionId,
} from '~utils/expenditures.ts';
import { formatText } from '~utils/intl.ts';
import {
  CacheQueryKeys,
  getSafePollingInterval,
  removeCacheEntry,
} from '~utils/queries.ts';
import { getSelectedToken } from '~utils/tokens.ts';
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
import UserPopover from '~v5/shared/UserPopover/UserPopover.tsx';

import ActionWithPermissionsInfo from '../ActionWithPermissionsInfo/ActionWithPermissionsInfo.tsx';
import ActionWithStakingInfo from '../ActionWithStakingInfo/ActionWithStakingInfo.tsx';
import CancelModal from '../CancelModal/CancelModal.tsx';
import CancelRequests from '../CancelRequests/CancelRequests.tsx';
import FinalizePaymentModal from '../FinalizePaymentModal/FinalizePaymentModal.tsx';
import { waitForDbAfterClaimingPayouts } from '../FinalizePaymentModal/utils.ts';
import FundingModal from '../FundingModal/FundingModal.tsx';
import MotionBox from '../MotionBox/MotionBox.tsx';
import PaymentStepDetailsBlock from '../PaymentStepDetailsBlock/PaymentStepDetailsBlock.tsx';
import RequestsBox from '../RequestsBox/RequestsBox.tsx';
import StagedPaymentStep from '../StagedPaymentStep/StagedPaymentStep.tsx';
import StepDetailsBlock from '../StepDetailsBlock/StepDetailsBlock.tsx';
import UninstalledExtensionBox from '../UninstalledExtensionBox/UninstalledExtensionBox.tsx';

import { useGetFinalizeStep } from './hooks.tsx';
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
    isFinalizeModalOpen: isFinalizePaymentModalOpen,
    toggleOffFinalizeModal: hideFinalizePaymentModal,
    selectedFundingAction,
    selectedReleaseAction,
    setSelectedFundingAction,
    setSelectedReleaseAction,
    selectedCancellingAction,
    setSelectedCancellingAction,
    isCancelModalOpen,
    toggleOffCancelModal,
  } = usePaymentBuilderContext();

  const { expenditureId } = action;

  const {
    expenditure,
    loadingExpenditure,
    refetchExpenditure,
    startPolling,
    stopPolling,
  } = useGetExpenditureData(expenditureId, { pollUntilUnmount: true });

  const tokenData = getSelectedToken(
    colony,
    expenditure?.slots?.[0]?.payouts?.[0]?.tokenAddress ?? '',
  );

  const {
    fundingActions,
    cancellingActions,
    releaseActions,
    isStaked,
    userStake,
    status,
  } = expenditure || {};
  const { amount: stakeAmount = '', userAddress } = userStake || {};
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

  const finalizeStep = useGetFinalizeStep({
    expectedStepKey,
    expenditure,
    expenditureStep,
    setExpectedStepKey,
  });

  const lockExpenditurePayload: LockExpenditurePayload | null = useMemo(
    () =>
      expenditure
        ? {
            colonyAddress: colony.colonyAddress,
            nativeExpenditureId: expenditure.nativeId,
            associatedActionId: getExpenditureCreatingActionId(expenditure),
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
  const isUserStaker = walletAddress === userAddress;

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
            isActionCancelled
            additionalInfo={
              isUserStaker && !expenditure?.userStake?.isForfeited ? (
                <div className="my-2 flex items-center justify-between gap-2 text-sm">
                  <p className="text-gray-600">
                    {formatText({ id: 'expenditure.staking.amount' })}
                  </p>
                  <p>
                    <Numeral
                      value={stakeAmount}
                      decimals={nativeToken.decimals}
                    />{' '}
                    {nativeToken.symbol}
                  </p>
                </div>
              ) : null
            }
            additionalBadge={
              expenditure?.status === ExpenditureStatus.Cancelled && (
                <>
                  {isUserStaker && (
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
                </>
              )
            }
          />
        ),
      isHidden: allCancelMotions.length === 0 && !isExpenditureCanceled,
    };
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

      if (fundingAction && fundingAction.multiSigData) {
        return (
          <MultiSigFunding
            action={fundingAction}
            multiSigData={fundingAction.multiSigData}
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
                  id:
                    !expenditure?.ownerAddress ||
                    walletAddress !== expenditure?.ownerAddress
                      ? 'expenditure.reviewStage.confirmDetails.info'
                      : 'expenditure.reviewStage.confirmDetails.creatorInfo',
                })}
                content={
                  !expenditure?.ownerAddress ||
                  walletAddress !== expenditure?.ownerAddress ? (
                    <div>
                      <h4 className="mb-3 flex items-center justify-between text-1">
                        {formatText({
                          id: 'expenditure.reviewStage.confirmDetails.title',
                        })}
                      </h4>

                      <div className="mb-2 flex items-center justify-between gap-2 text-sm last:mb-0">
                        <dt className="text-gray-600">
                          {formatText({
                            id: 'expenditure.reviewStage.confirmDetails.creator',
                          })}
                        </dt>
                        <dd>
                          <div className="flex w-full items-center">
                            <UserPopover
                              walletAddress={action.initiatorAddress}
                              size={18}
                            />
                          </div>
                        </dd>
                      </div>
                      {isStaked && (
                        <div className="mb-2 flex items-center justify-between gap-2 text-sm last:mb-0">
                          <dt className="text-gray-600">
                            {formatText({
                              id: 'expenditure.reviewStage.confirmDetails.stakeAmount',
                            })}
                          </dt>
                          <dd>
                            <Numeral
                              value={stakeAmount}
                              decimals={tokenData?.decimals}
                            />{' '}
                            {tokenData?.symbol}
                          </dd>
                        </div>
                      )}
                    </div>
                  ) : (
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
                      isLoading={
                        expectedStepKey === ExpenditureStep.Funding ||
                        expectedStepKey === ExpenditureStep.Cancel
                      }
                      isFullSize
                    />
                  )
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
                title={formatText({
                  id: 'expenditure.reviewStage.confirmDetails.completedInfo',
                })}
              />
            ) : (
              <ActionWithPermissionsInfo
                action={expenditure?.lockingActions?.items[0]}
                title={formatText({
                  id: 'expenditure.reviewStage.confirmDetails.completedInfo',
                })}
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
            <RequestsBox
              actions={sortedFundingActions}
              selectedAction={selectedFundingAction}
              onClick={setSelectedFundingAction}
              title={formatText({
                id: 'expenditure.fundingRequest.title',
              })}
            />
          )}
          {getFundingStepContent()}
          {shouldShowFundingButton && (
            <StepDetailsBlock
              text={formatText({
                id: 'expenditure.fundingStage.info',
              })}
              content={
                <>
                  {expectedStepKey === ExpenditureStep.Release ||
                  expectedStepKey === ExpenditureStep.Cancel ? (
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
    finalizeStep,
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
        isExpenditureFunded ? fundingItemIndex + 1 : fundingItemIndex,
        0,
        getCancelItem(
          isExpenditureFunded ? 2 : 1,
          segregatedCancelActions.funding,
        ),
      );
    }
  }

  const currentIndex = getCancelStepIndex(expenditure, items);
  const updatedItems =
    (isExpenditureCanceled && !isAnyCancellingMotionInProgress) ||
    expenditure?.status === ExpenditureStatus.Cancelled
      ? [...items.slice(0, currentIndex === 1 ? 2 : currentIndex)]
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
          <FinalizePaymentModal
            expenditure={expenditure}
            isOpen={isFinalizePaymentModalOpen}
            onClose={hideFinalizePaymentModal}
            onSuccess={async (decisionMethod) => {
              setExpectedStepKey(ExpenditureStep.Payment);

              if (decisionMethod.value === DecisionMethod.Reputation) {
                return;
              }

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
          <CancelModal
            isOpen={isCancelModalOpen}
            expenditure={expenditure}
            actionData={action.motionData as unknown as ColonyAction}
            onClose={toggleOffCancelModal}
            refetchExpenditure={refetchExpenditure}
            isActionStaked={expenditure.isStaked}
            onSuccess={() => {
              setExpectedStepKey(ExpenditureStep.Cancel);
            }}
          />
        </>
      )}
    </>
  );
};

export default PaymentBuilderWidget;
