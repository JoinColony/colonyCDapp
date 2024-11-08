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
import SpinnerLoader from '~shared/Preloaders/SpinnerLoader.tsx';
import { notMaybe, notNull } from '~utils/arrays/index.ts';
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
import MultiSigWidget from '~v5/common/ActionSidebar/partials/MultiSigSidebar/partials/MultiSigWidget/MultiSigWidget.tsx';
import ActionButton from '~v5/shared/Button/ActionButton.tsx';
import Button from '~v5/shared/Button/Button.tsx';
import IconButton from '~v5/shared/Button/IconButton.tsx';
import { LoadingBehavior } from '~v5/shared/Button/types.ts';
import MotionWidgetSkeleton from '~v5/shared/MotionWidgetSkeleton/MotionWidgetSkeleton.tsx';
import Stepper from '~v5/shared/Stepper/index.ts';
import { type StepperItem } from '~v5/shared/Stepper/types.ts';

import ActionWithPermissionsInfo from '../ActionWithPermissionsInfo/ActionWithPermissionsInfo.tsx';
import ActionWithStakingInfo from '../ActionWithStakingInfo/ActionWithStakingInfo.tsx';
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
  getCancelStepIndex,
  getExpenditureStep,
  getShouldShowMotionTimer,
  isExpenditureFullyFunded,
  sortActionsByCreatedDate,
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
  } = usePaymentBuilderContext();

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

  const isStagedExpenditure = expenditure?.type === ExpenditureType.Staged;
  const isExpenditureCanceled = expenditureStep === ExpenditureStep.Cancel;
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

  useEffect(() => {
    // If the selected multisig motion was rejected we don't "expect" to get into the release step anymore
    // This has no impact on the initial render, since the expected step is set when we start the motion process
    if (selectedFundingMultiSig?.isRejected) {
      setExpectedStepKey(null);
    }
  }, [selectedFundingMultiSig?.isRejected]);

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
    if (!selectedFundingAction) {
      return null;
    }

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
        return <MultiSigWidget action={fundingAction} variant="standalone" />;
      }

      console.warn(
        "The provided assumed multiSig action doesn't pass the type guard, something is wrong",
      );
      return null;
    }

    return <ActionWithPermissionsInfo action={selectedFundingAction} />;
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
