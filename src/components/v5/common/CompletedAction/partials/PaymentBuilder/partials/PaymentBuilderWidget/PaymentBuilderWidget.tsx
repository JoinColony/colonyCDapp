import React, { useState, type FC, useEffect, useMemo } from 'react';

import { Action } from '~constants/actions.ts';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { usePaymentBuilderContext } from '~context/PaymentBuilderContext/PaymentBuilderContext.ts';
import { useGetColonyExpendituresQuery, ColonyActionType } from '~gql';
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
import Stepper from '~v5/shared/Stepper/index.ts';
import { type StepperItem } from '~v5/shared/Stepper/types.ts';

import ActionWithPermissionsInfo from '../ActionWithPermissionsInfo/ActionWithPermissionsInfo.tsx';
import ActionWithStakingInfo from '../ActionWithStakingInfo/ActionWithStakingInfo.tsx';
import FinalizeByPaymentCreatorInfo from '../FinalizeByPaymentCreatorInfo/FinalizeByPaymentCreatorInfo.tsx';
import FundingModal from '../FundingModal/FundingModal.tsx';
import MotionBox from '../MotionBox/MotionBox.tsx';
import PaymentStepDetailsBlock from '../PaymentStepDetailsBlock/PaymentStepDetailsBlock.tsx';
import PermissionsBox from '../PermissionsBox/PermissionsBox.tsx';
import ReleasePaymentModal from '../ReleasePaymentModal/ReleasePaymentModal.tsx';
import RequestBox from '../RequestBox/RequestBox.tsx';
import StepDetailsBlock from '../StepDetailsBlock/StepDetailsBlock.tsx';

import { ExpenditureStep, type PaymentBuilderWidgetProps } from './types.ts';
import { getCancelStepIndex, getExpenditureStep } from './utils.ts';

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
    selectedTransaction,
    setSelectedTransaction,
    selectedPermissionAction,
  } = usePaymentBuilderContext();

  const { expenditureId } = action;

  const { expenditure, loadingExpenditure, startPolling, stopPolling } =
    useGetExpenditureData(expenditureId);

  const {
    fundingActions,
    finalizingActions,
    cancellingActions,
    finalizedAt,
    createdAt,
    isStaked,
    userStake,
    ownerAddress,
    motions,
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
    action: motionAction,
    motionState,
    refetchMotionState,
  } = useGetColonyAction(
    selectedTransaction || fundingMotions?.[0]?.transactionHash,
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

  const mappedFundingActionsItems = (fundingActionsItems || []).map((item) => ({
    createdAt: item?.createdAt || '',
    initiatorAddress: item?.initiatorAddress || '',
  }));

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
                useTxLoader
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
          motionState &&
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
            {isFundingMotion && !isFundingMotionFailed && !isFundingClaimed ? (
              <div className="flex flex-col gap-2">
                <RequestBox
                  title={formatText({ id: 'expenditure.fundingRequest.title' })}
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
                    <Button
                      className="w-full"
                      onClick={showFundingModal}
                      text={formatText({
                        id: 'expenditure.fundingStage.button',
                      })}
                      loading={expectedStepKey === ExpenditureStep.Release}
                    />
                  </>
                }
              />
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
            {fundingActionsItems && fundingActionsItems.length > 0 && (
              <>
                {fundingActionsItems.length === 1 ? (
                  <ActionWithPermissionsInfo
                    userAdddress={fundingActionsItems[0]?.initiatorAddress}
                    createdAt={fundingActionsItems[0]?.createdAt}
                  />
                ) : (
                  <div className="flex flex-col gap-2">
                    <PermissionsBox items={mappedFundingActionsItems} />
                    {selectedPermissionAction && (
                      <ActionWithPermissionsInfo
                        userAdddress={selectedPermissionAction.initiatorAddress}
                        createdAt={selectedPermissionAction.createdAt}
                      />
                    )}
                  </div>
                )}
              </>
            )}
          </>
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
    {
      key: ExpenditureStep.Payment,
      heading: { label: formatText({ id: 'expenditure.paymentStage.label' }) },
      content: <PaymentStepDetailsBlock expenditure={expenditure} />,
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
