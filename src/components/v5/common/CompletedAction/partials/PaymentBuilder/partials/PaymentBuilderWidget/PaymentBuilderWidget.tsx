import { SpinnerGap } from '@phosphor-icons/react';
import React, { useState, type FC, useEffect } from 'react';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { usePaymentBuilderContext } from '~context/PaymentBuilderContext/PaymentBuilderContext.ts';
import { ColonyActionType } from '~gql';
import { ActionTypes } from '~redux';
import { type LockExpenditurePayload } from '~redux/sagas/expenditures/lockExpenditure.ts';
import SpinnerLoader from '~shared/Preloaders/SpinnerLoader.tsx';
import { notNull } from '~utils/arrays/index.ts';
import { formatText } from '~utils/intl.ts';
import { getSafePollingInterval } from '~utils/queries.ts';
import useGetColonyAction from '~v5/common/ActionSidebar/hooks/useGetColonyAction.ts';
import { useGetExpenditureData } from '~v5/common/ActionSidebar/hooks/useGetExpenditureData.ts';
import MotionCountDownTimer from '~v5/common/ActionSidebar/partials/Motions/partials/MotionCountDownTimer/MotionCountDownTimer.tsx';
import ActionButton from '~v5/shared/Button/ActionButton.tsx';
import Button from '~v5/shared/Button/Button.tsx';
import TxButton from '~v5/shared/Button/TxButton.tsx';
import Stepper from '~v5/shared/Stepper/index.ts';
import { type StepperItem } from '~v5/shared/Stepper/types.ts';

import FinalizeWithPermissionsInfo from '../FinalizeWithPermissionsInfo/FinalizeWithPermissionsInfo.tsx';
import FundingModal from '../FundingModal/FundingModal.tsx';
import MotionBox from '../MotionBox/MotionBox.tsx';
import PaymentStepDetailsBlock from '../PaymentStepDetailsBlock/PaymentStepDetailsBlock.tsx';
import ReleasePaymentModal from '../ReleasePaymentModal/ReleasePaymentModal.tsx';
import RequestBox from '../RequestBox/RequestBox.tsx';
import StepDetailsBlock from '../StepDetailsBlock/StepDetailsBlock.tsx';

import { ExpenditureStep, type PaymentBuilderWidgetProps } from './types.ts';
import { getCancelStepIndex, getExpenditureStep } from './utils.ts';

const PaymentBuilderWidget: FC<PaymentBuilderWidgetProps> = ({ action }) => {
  const { colony } = useColonyContext();
  const { user } = useAppContext();
  const { walletAddress } = user || {};

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
    finalizedAt,
    motions,
  } = expenditure || {};
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
    setActiveStepKey(expenditureStep);
  }, [expenditureStep]);

  useEffect(() => {
    if (expectedStepKey === expenditureStep) {
      setExpectedStepKey(null);
    }
  }, [expectedStepKey, expenditureStep]);

  const lockExpenditurePayload: LockExpenditurePayload | null = expenditure
    ? {
        colonyAddress: colony.colonyAddress,
        nativeExpenditureId: expenditure.nativeId,
      }
    : null;

  const cancelItem: StepperItem<ExpenditureStep> = {
    key: ExpenditureStep.Cancel,
    heading: {
      label: formatText({ id: 'expenditure.cancelStage.label' }),
    },
    content: (
      <FinalizeWithPermissionsInfo
        userAdddress={cancellingActions?.items[0]?.initiatorAddress}
      />
    ),
    isHidden: expenditureStep !== ExpenditureStep.Cancel,
  };

  const isExpenditureCanceled = expenditureStep === ExpenditureStep.Cancel;
  const isFundingMotion =
    motions?.items?.length &&
    motions.items?.[0]?.action?.type === ColonyActionType.FundExpenditureMotion;
  const fundingMotions =
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
      }) || [];

  const { selectedTransaction, setSelectedTransaction } =
    usePaymentBuilderContext();

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

  const items: StepperItem<ExpenditureStep>[] = [
    {
      key: ExpenditureStep.Create,
      heading: { label: formatText({ id: 'expenditure.createStage.label' }) },
      content: (
        <FinalizeWithPermissionsInfo userAdddress={expenditure?.ownerAddress} />
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
                loadingContent={
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
          <FinalizeWithPermissionsInfo
            userAdddress={expenditure?.ownerAddress}
          />
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
              key={motionAction?.transactionHash}
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
                    {expectedStepKey === ExpenditureStep.Release ? (
                      <TxButton
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
            {fundingActionsItems && (
              <FinalizeWithPermissionsInfo
                userAdddress={fundingActionsItems[0]?.initiatorAddress}
              />
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
                  onClick={showReleasePaymentModal}
                  text={formatText({
                    id: 'expenditure.releaseStage.button',
                  })}
                />
              )
            }
          />
        ) : (
          <>
            {finalizedAt ? (
              <FinalizeWithPermissionsInfo
                userAdddress={finalizingActions?.items[0]?.initiatorAddress}
              />
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
          />
          <FundingModal
            isOpen={isFundingModalOpen}
            onClose={hideFundingModal}
            expenditure={expenditure}
            onSuccess={() => {
              setExpectedStepKey(ExpenditureStep.Release);
            }}
          />
        </>
      )}
    </>
  );
};

export default PaymentBuilderWidget;
