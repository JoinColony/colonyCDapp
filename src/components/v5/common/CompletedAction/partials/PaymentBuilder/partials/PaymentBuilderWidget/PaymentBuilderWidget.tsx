import React, { useState, type FC } from 'react';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import SpinnerLoader from '~shared/Preloaders/SpinnerLoader.tsx';
import { formatText } from '~utils/intl.ts';
import { useGetExpenditureData } from '~v5/common/ActionSidebar/hooks/useGetExpenditureData.ts';
import Stepper from '~v5/shared/Stepper/index.ts';
import { type StepperItem } from '~v5/shared/Stepper/types.ts';

import FinalizeWithPermissionsInfo from '../FinalizeWithPermissionsInfo/index.ts';
import PaymentStepDetailsBlock from '../PaymentStepDetailsBlock/index.ts';
import StepDetailsBlock from '../StepDetailsBlock/index.ts';

import { ExpenditureStep, type PaymentBuilderWidgetProps } from './types.ts';
import { getExpenditureStep } from './utils.ts';

const PaymentBuilderWidget: FC<PaymentBuilderWidgetProps> = ({ action }) => {
  const { user } = useAppContext();
  const { walletAddress } = user || {};
  const { expenditureId } = action;

  const { expenditure, loadingExpenditure } =
    useGetExpenditureData(expenditureId);

  const { status } = expenditure || {};

  const [activeStepKey, setActiveStepKey] = useState<ExpenditureStep>(
    getExpenditureStep(status),
  );

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
        activeStepKey === ExpenditureStep.Review ? (
          <StepDetailsBlock
            text={formatText({
              id: 'expenditure.reviewStage.confirmDetails.info',
            })}
            buttonProps={{
              disabled:
                !expenditure?.ownerAddress ||
                walletAddress !== expenditure?.ownerAddress,
              // @todo: replace onClick with actual functionality
              onClick: () => setActiveStepKey(ExpenditureStep.Funding),
              text: formatText({
                id: 'expenditure.reviewStage.confirmDetails.button',
              }),
            }}
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
          buttonProps={{
            // @todo: replace onClick with actual functionality
            onClick: () => setActiveStepKey(ExpenditureStep.Release),
            text: formatText({
              id: 'expenditure.fundingStage.button',
            }),
          }}
        />
      ),
    },
    {
      key: ExpenditureStep.Release,
      heading: { label: formatText({ id: 'expenditure.releaseStage.label' }) },
      // @todo: add completed state content
      content: (
        <StepDetailsBlock
          text={formatText({
            id: 'expenditure.releaseStage.info',
          })}
          buttonProps={{
            // @todo: replace onClick with actual functionality
            onClick: () => setActiveStepKey(ExpenditureStep.Payment),
            text: formatText({
              id: 'expenditure.releaseStage.button',
            }),
          }}
        />
      ),
    },
    {
      key: ExpenditureStep.Payment,
      heading: { label: formatText({ id: 'expenditure.paymentStage.label' }) },
      content: <PaymentStepDetailsBlock />,
    },
  ];

  if (loadingExpenditure) {
    return <SpinnerLoader appearance={{ size: 'medium' }} />;
  }

  return (
    <Stepper<ExpenditureStep>
      items={items}
      activeStepKey={activeStepKey}
      setActiveStepKey={setActiveStepKey}
    />
  );
};

export default PaymentBuilderWidget;
