import clsx from 'clsx';
import React, { type FC } from 'react';
import { defineMessages } from 'react-intl';

import { ExtendedSupportedCurrencies } from '~gql';
import { formatMessage } from '~utils/yup/tests/helpers.ts';

import { useTransferFees } from './hooks.ts';
import SummaryAmountRow from './SummaryAmountRow.tsx';
import { FeeType } from './types.ts';

const displayName = 'common.Extensions.UserHub.partials.SummaryCard';

const MSG = defineMessages({
  gatewayFee: {
    id: `${displayName}.gatewayFee`,
    defaultMessage: 'Gateway fee ({percentage}%)',
  },
  gatewayFeeTooltip: {
    id: `${displayName}.gatewayFeeTooltip`,
    defaultMessage: 'Gateway fees are charges for processing the transaction',
  },
  receive: {
    id: `${displayName}.receive`,
    defaultMessage: 'You will receive:',
  },
  receiveTooltip: {
    id: `${displayName}.receiveTooltip`,
    defaultMessage:
      'Exact amount may vary based on currency conversion rate at the time of processing',
  },
  [FeeType.Wire]: {
    id: `${displayName}.wire`,
    defaultMessage: 'Wire fee',
  },
  [FeeType.SEPA]: {
    id: `${displayName}.SEPA`,
    defaultMessage: 'SEPA fee',
  },
  [FeeType.ACH]: {
    id: `${displayName}.ACH`,
    defaultMessage: 'ACH fee',
  },
  feeTypeTooltip: {
    id: `${displayName}.wireTooltip`,
    defaultMessage: 'Transaction costs based on your bank and currency',
  },
});

interface SummaryCardProps {
  isFormDisabled: boolean;
  isLoading: boolean;
}

const SummaryCard: FC<SummaryCardProps> = ({ isFormDisabled, isLoading }) => {
  const fromCurrency = ExtendedSupportedCurrencies.Usdc;

  const {
    gatewayPercentage,
    gatewayAmount,
    feeType,
    feeAmount,
    receiveAmount,
    selectedCurrency,
  } = useTransferFees();

  return (
    <div
      className={clsx(
        'mt-5 flex flex-col gap-2 rounded-lg border border-gray-200 px-4 py-5 text-sm',
        {
          'bg-gray-50 text-gray-300': isFormDisabled,
          'bg-transparent': isLoading,
        },
      )}
    >
      <SummaryAmountRow
        description={formatMessage(MSG.gatewayFee, {
          percentage: gatewayPercentage * 100,
        })}
        amount={gatewayAmount}
        currency={fromCurrency}
        tooltipContent={formatMessage(MSG.gatewayFeeTooltip)}
        isDisabled={isFormDisabled}
        isLoading={isLoading}
      />
      <SummaryAmountRow
        description={formatMessage(MSG[feeType])}
        amount={feeAmount}
        currency={fromCurrency}
        tooltipContent={formatMessage(MSG.feeTypeTooltip)}
        isDisabled={isFormDisabled}
        isLoading={isLoading}
      />

      <div className="my-1 border-b" />

      <SummaryAmountRow
        description={formatMessage(MSG.receive)}
        amount={receiveAmount}
        currency={selectedCurrency}
        tooltipContent={formatMessage(MSG.receiveTooltip)}
        isDisabled={isFormDisabled}
        isLoading={isLoading}
        isHighlighted
      />
    </div>
  );
};

SummaryCard.displayName = displayName;

export default SummaryCard;
