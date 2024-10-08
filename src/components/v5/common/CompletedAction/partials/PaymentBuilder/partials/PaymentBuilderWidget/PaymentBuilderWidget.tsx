import { SpinnerGap } from '@phosphor-icons/react';
import React, { useState, type FC, useEffect, useMemo } from 'react';

import { Action } from '~constants/actions.ts';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { usePaymentBuilderContext } from '~context/PaymentBuilderContext/PaymentBuilderContext.ts';
import { useGetColonyExpendituresQuery } from '~gql';
import { ActionTypes } from '~redux';
import { type LockExpenditurePayload } from '~redux/sagas/expenditures/lockExpenditure.ts';
import SpinnerLoader from '~shared/Preloaders/SpinnerLoader.tsx';
import { notMaybe, notNull } from '~utils/arrays/index.ts';
import { MotionState } from '~utils/colonyMotions.ts';
import { getClaimableExpenditurePayouts } from '~utils/expenditures.ts';
import { formatText } from '~utils/intl.ts';
import { getSafePollingInterval } from '~utils/queries.ts';
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
import FinalizeByPaymentCreatorInfo from '../FinalizeByPaymentCreatorInfo/FinalizeByPaymentCreatorInfo.tsx';
import FundingModal from '../FundingModal/FundingModal.tsx';
import FundingRequests from '../FundingRequests/FundingRequests.tsx';
import MotionBox from '../MotionBox/MotionBox.tsx';
import PaymentStepDetailsBlock from '../PaymentStepDetailsBlock/PaymentStepDetailsBlock.tsx';
import ReleasePaymentModal from '../ReleasePaymentModal/ReleasePaymentModal.tsx';
import { waitForDbAfterClaimingPayouts } from '../ReleasePaymentModal/utils.ts';
import StepDetailsBlock from '../StepDetailsBlock/StepDetailsBlock.tsx';

import { ExpenditureStep, type PaymentBuilderWidgetProps } from './types.ts';
import {
  getCancelStepIndex,
  getExpenditureStep,
  isExpenditureFullyFunded,
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

  const {
    isFundingModalOpen,
    toggleOffFundingModal: hideFundingModal,
    toggleOnFundingModal: showFundingModal,
    isReleaseModalOpen: isReleasePaymentModalOpen,
    toggleOffReleaseModal: hideReleasePaymentModal,
    toggleOnReleaseModal: showReleasePaymentModal,
    selectedFundingAction,
    setSelectedFundingAction,
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
    finalizedAt,
    isStaked,
    userStake,
    ownerAddress,
  } = expenditure || {};
  const { amount: stakeAmount = '' } = userStake || {};

  const expenditureStep = getExpenditureStep(expenditure);

  const [activeStepKey, setActiveStepKey] =
    useState<ExpenditureStep>(expenditureStep);
  const [expectedStepKey, setExpectedStepKey] =
    useState<ExpenditureStep | null>(null);
  const [isWaitingForClaimedPayouts, setIsWaitingForClaimedPayouts] =
    useState(false);

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
    content: <ActionWithPermissionsInfo action={cancellingActions?.items[0]} />,
    isHidden: expenditureStep !== ExpenditureStep.Cancel,
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
  const {
    motionState: fundingMotionState,
    refetchMotionState: refetchFundingMotionState,
  } = useGetColonyAction(selectedFundingAction?.transactionHash);

  const shouldShowFundingMotionTimer =
    fundingMotionState &&
    [
      MotionState.Staking,
      MotionState.Supported,
      MotionState.Voting,
      MotionState.Reveal,
    ].includes(fundingMotionState);

  const allFundingMotions = sortedFundingActions
    .map((fundingAction) => fundingAction.motionData)
    .filter(notMaybe);
  const isAnyFundingMotionInProgress = allFundingMotions.some(
    (motion) =>
      !motion.isFinalized && !motion.motionStateHistory.hasFailedNotFinalizable,
  );
  const shouldShowFundingButton =
    !isAnyFundingMotionInProgress && !isExpenditureFunded;
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
          selectedFundingMotion && shouldShowFundingMotionTimer ? (
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
          {sortedFundingActions.length > 0 && (
            <FundingRequests actions={sortedFundingActions} />
          )}

          {selectedFundingMotion && (
            <MotionBox transactionId={selectedFundingMotion.transactionHash} />
          )}

          {selectedFundingAction && !selectedFundingMotion && (
            <ActionWithPermissionsInfo action={selectedFundingAction} />
          )}

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
      content:
        expenditureStep === ExpenditureStep.Release ? (
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
        ),
    },
    {
      key: ExpenditureStep.Payment,
      heading: { label: formatText({ id: 'expenditure.paymentStage.label' }) },
      content: (
        <PaymentStepDetailsBlock
          expenditure={expenditure}
          isWaitingForClaimedPayouts={isWaitingForClaimedPayouts}
        />
      ),
    },
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
