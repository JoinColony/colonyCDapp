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

import FinalizeWithPermissionsInfo from '../FinalizeWithPermissionsInfo/index.ts';
import FundingModal from '../FundingModal/FundingModal.tsx';
import PaymentStepDetailsBlock from '../PaymentStepDetailsBlock/index.ts';
import ReleasePaymentModal from '../ReleasePaymentModal/ReleasePaymentModal.tsx';
import StepDetailsBlock from '../StepDetailsBlock/index.ts';

import { ExpenditureStep, type PaymentBuilderWidgetProps } from './types.ts';
import { getExpenditureStep, isExpenditureFullyFunded } from './utils.ts';

const PaymentBuilderWidget: FC<PaymentBuilderWidgetProps> = ({ action }) => {
  const { colony } = useColonyContext();
  const { user } = useAppContext();
  const { walletAddress } = user || {};
  const { expenditureId } = action;

  const [isFundingModalOpen, { toggleOn, toggleOff }] = useToggle();
  const [
    isReleasePaymentModalOpen,
    { toggleOn: releasePaymentToggleOn, toggleOff: releasePaymentToggleOff },
  ] = useToggle();

  const {
    expenditure,
    loadingExpenditure,
    refetchExpenditure,
    startPolling,
    stopPolling,
  } = useGetExpenditureData(expenditureId);

  const { status, finalizingActions } = expenditure || {};

  const expenditureStatus = getExpenditureStep(status);

  const [activeStepKey, setActiveStepKey] =
    useState<ExpenditureStep>(expenditureStatus);

  const [isRefetching, setIsRefetching] = useState(false);
  const isExpenditureFunded = isExpenditureFullyFunded(expenditure);

  useEffect(() => {
    startPolling(getSafePollingInterval());

    if (
      expenditureStatus &&
      isExpenditureFunded &&
      expenditureStatus !== ExpenditureStep.Payment
    ) {
      setActiveStepKey(ExpenditureStep.Release);
    } else {
      setActiveStepKey(expenditureStatus);
    }

    return () => stopPolling();
  }, [isExpenditureFunded, expenditureStatus, startPolling, stopPolling]);

  const lockExpenditurePayload: LockExpenditurePayload | null = expenditure
    ? {
        colonyAddress: colony.colonyAddress,
        nativeExpenditureId: expenditure.nativeId,
      }
    : null;

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
      content: (
        <StepDetailsBlock
          text={formatText({
            id: 'expenditure.fundingStage.info',
          })}
          content={
            <Button
              className="w-full"
              onClick={toggleOn}
              text={formatText({
                id: 'expenditure.fundingStage.button',
              })}
            />
          }
        />
      ),
    },
    {
      key: ExpenditureStep.Release,
      heading: { label: formatText({ id: 'expenditure.releaseStage.label' }) },
      content: (
        <>
          {expenditureStatus === ExpenditureStep.Funding && (
            <StepDetailsBlock
              text={formatText({
                id: 'expenditure.releaseStage.info',
              })}
              content={
                <Button
                  className="w-full"
                  onClick={releasePaymentToggleOn}
                  text={formatText({
                    id: 'expenditure.releaseStage.button',
                  })}
                />
              }
            />
          )}
          {isExpenditureFunded &&
            expenditureStatus !== ExpenditureStep.Funding && (
              <FinalizeWithPermissionsInfo
                userAdddress={finalizingActions?.items[0]?.initiatorAddress}
              />
            )}
        </>
      ),
    },
    {
      key: ExpenditureStep.Payment,
      heading: { label: formatText({ id: 'expenditure.paymentStage.label' }) },
      content: <PaymentStepDetailsBlock />,
    },
  ];

  const cancelItems: StepperItem<ExpenditureStep>[] = [
    {
      key: ExpenditureStep.Create,
      heading: { label: formatText({ id: 'expenditure.createStage.label' }) },
      content: (
        <FinalizeWithPermissionsInfo userAdddress={expenditure?.ownerAddress} />
      ),
    },
    {
      key: ExpenditureStep.Cancel,
      heading: { label: formatText({ id: 'expenditure.cancelStage.label' }) },
      content: (
        <FinalizeWithPermissionsInfo userAdddress={expenditure?.ownerAddress} />
      ),
    },
  ];

  if (loadingExpenditure) {
    return <SpinnerLoader appearance={{ size: 'medium' }} />;
  }

  return (
    <>
      <Stepper<ExpenditureStep>
        items={
          expenditureStatus === ExpenditureStep.Cancel ? cancelItems : items
        }
        activeStepKey={activeStepKey}
        setActiveStepKey={setActiveStepKey}
      />
      {expenditure && (
        <>
          <ReleasePaymentModal
            expenditure={expenditure}
            isOpen={isReleasePaymentModalOpen}
            onClose={releasePaymentToggleOff}
            refetchExpenditure={refetchExpenditure}
          />
          <FundingModal
            isOpen={isFundingModalOpen}
            onClose={toggleOff}
            expenditure={expenditure}
            refetchExpenditure={refetchExpenditure}
          />
        </>
      )}
    </>
  );
};

export default PaymentBuilderWidget;
