import React, { useState, type FC, useEffect } from 'react';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useGetColonyExpendituresQuery } from '~gql';
import useToggle from '~hooks/useToggle/index.ts';
import { ActionTypes } from '~redux';
import { type LockExpenditurePayload } from '~redux/sagas/expenditures/lockExpenditure.ts';
import SpinnerLoader from '~shared/Preloaders/SpinnerLoader.tsx';
import { formatText } from '~utils/intl.ts';
import { getSafePollingInterval } from '~utils/queries.ts';
import { useGetExpenditureData } from '~v5/common/ActionSidebar/hooks/useGetExpenditureData.ts';
import ActionButton from '~v5/shared/Button/ActionButton.tsx';
import Button from '~v5/shared/Button/Button.tsx';
import Stepper from '~v5/shared/Stepper/index.ts';
import { type StepperItem } from '~v5/shared/Stepper/types.ts';

import FinalizeWithPermissionsInfo from '../FinalizeWithPermissionsInfo/FinalizeWithPermissionsInfo.tsx';
import FundingModal from '../FundingModal/FundingModal.tsx';
import PaymentStepDetailsBlock from '../PaymentStepDetailsBlock/PaymentStepDetailsBlock.tsx';
import ReleasePaymentModal from '../ReleasePaymentModal/ReleasePaymentModal.tsx';
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

  const [
    isFundingModalOpen,
    { toggleOn: showFundingModal, toggleOff: hideFundingModal },
  ] = useToggle();
  const [
    isReleasePaymentModalOpen,
    { toggleOn: showReleasePaymentModal, toggleOff: hideReleasePaymentModal },
  ] = useToggle();

  const { expenditureId } = action;

  const { expenditure, loadingExpenditure, startPolling, stopPolling } =
    useGetExpenditureData(expenditureId);

  const {
    fundingActions,
    finalizingActions,
    cancellingActions,
    finalizedAt,
    createdAt,
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

  const items: StepperItem<ExpenditureStep>[] = [
    {
      key: ExpenditureStep.Create,
      heading: { label: formatText({ id: 'expenditure.createStage.label' }) },
      content: (
        <FinalizeWithPermissionsInfo
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
            createdAt={expenditure?.lockingActions?.items[0]?.createdAt}
          />
        ),
    },
    {
      key: ExpenditureStep.Funding,
      heading: { label: formatText({ id: 'expenditure.fundingStage.label' }) },
      content:
        expenditureStep === ExpenditureStep.Funding ? (
          <StepDetailsBlock
            text={formatText({
              id: 'expenditure.fundingStage.info',
            })}
            content={
              <Button
                className="w-full"
                onClick={showFundingModal}
                text={formatText({
                  id: 'expenditure.fundingStage.button',
                })}
                loading={expectedStepKey === ExpenditureStep.Release}
              />
            }
          />
        ) : (
          // @todo: please update this element when other decisions methods for funding will be implemented
          <>
            {fundingActionsItems?.[0] && (
              <FinalizeWithPermissionsInfo
                userAdddress={fundingActionsItems[0].initiatorAddress}
                createdAt={fundingActionsItems[0].createdAt}
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
              <FinalizeWithPermissionsInfo
                userAdddress={finalizingActions?.items[0]?.initiatorAddress}
                createdAt={finalizingActions?.items[0]?.createdAt}
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
