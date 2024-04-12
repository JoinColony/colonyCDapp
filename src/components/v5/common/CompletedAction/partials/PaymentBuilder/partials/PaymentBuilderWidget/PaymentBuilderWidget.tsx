import React, { useState, type FC, useEffect } from 'react';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
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
  const { colony } = useColonyContext();
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

  const {
    expenditure,
    loadingExpenditure,
    refetchExpenditure,
    startPolling,
    stopPolling,
  } = useGetExpenditureData(expenditureId);

  const { fundingActions, finalizingActions, cancellingActions } =
    expenditure || {};
  const { items: fundingActionsItems } = fundingActions || {};

  const expenditureStatus = getExpenditureStep(expenditure);

  const [activeStepKey, setActiveStepKey] =
    useState<ExpenditureStep>(expenditureStatus);

  const [isRefetching, setIsRefetching] = useState(false);

  useEffect(() => {
    startPolling(getSafePollingInterval());

    setActiveStepKey(expenditureStatus);

    return () => stopPolling();
  }, [expenditureStatus, startPolling, stopPolling]);

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
    isHidden: expenditureStatus !== ExpenditureStep.Cancel,
  };
  const isExpenditureCanceled = expenditureStatus === ExpenditureStep.Cancel;

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
        expenditureStatus === ExpenditureStep.Review ? (
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
                onSuccess={async () => {
                  setIsRefetching(true);
                  await refetchExpenditure({
                    expenditureId: expenditureId || '',
                  });
                  setIsRefetching(false);
                }}
                text={formatText({
                  id: 'expenditure.reviewStage.confirmDetails.button',
                })}
                values={lockExpenditurePayload}
                actionType={ActionTypes.EXPENDITURE_LOCK}
                mode="primarySolid"
                className="w-full"
                isLoading={isRefetching}
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
      heading: { label: formatText({ id: 'expenditure.fundingStage.label' }) },
      content:
        expenditureStatus === ExpenditureStep.Funding ? (
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
              />
            }
          />
        ) : (
          // @todo: please update this element when other decisions methods for funding will be implemented
          <>
            {fundingActionsItems?.length === 1 && (
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
        expenditureStatus === ExpenditureStep.Release ? (
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
              />
            }
          />
        ) : (
          <FinalizeWithPermissionsInfo
            userAdddress={finalizingActions?.items[0]?.initiatorAddress}
          />
        ),
    },
    {
      key: ExpenditureStep.Payment,
      heading: { label: formatText({ id: 'expenditure.paymentStage.label' }) },
      content: <PaymentStepDetailsBlock />,
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
            refetchExpenditure={refetchExpenditure}
          />
          <FundingModal
            isOpen={isFundingModalOpen}
            onClose={hideFundingModal}
            expenditure={expenditure}
            refetchExpenditure={refetchExpenditure}
          />
        </>
      )}
    </>
  );
};

export default PaymentBuilderWidget;
