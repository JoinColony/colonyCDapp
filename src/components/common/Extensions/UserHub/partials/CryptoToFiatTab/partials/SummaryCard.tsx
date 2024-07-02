import { Info } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC } from 'react';
import { defineMessages } from 'react-intl';

import { formatMessage } from '~utils/yup/tests/helpers.ts';

const displayName = 'common.Extensions.UserHub.partials.SummaryCard';

enum FeeType {
  Wire = 'Wire',
  SEPA = 'SEPA',
  ACH = 'ACH',
}

const MSG = defineMessages({
  gatewayFee: {
    id: `${displayName}.gatewayFee`,
    defaultMessage: 'Gateway fee (1%)',
  },
  receive: {
    id: `${displayName}.receive`,
    defaultMessage: 'You will receive:',
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
});

interface SummaryCardProps {
  isFormDisabled: boolean;
}

const SummaryCard: FC<SummaryCardProps> = ({ isFormDisabled }) => {
  // @TODO: Calculate proper values
  const gatewayAmount = 0;

  const feeAmount = 0;
  const feeType = FeeType.Wire;

  const receiveAmount = 0;
  const selectedCurrency = 'EUR';

  return (
    <div
      className={clsx(
        'mt-5 flex flex-col gap-2 rounded-lg border border-gray-200 px-4 py-5 text-sm',
        {
          'bg-gray-50 text-gray-300': isFormDisabled,
        },
      )}
    >
      <div className="flex justify-between">
        <p>{formatMessage(MSG.gatewayFee)}</p>
        <div className="flex items-center gap-2">
          <p className="font-semibold">{gatewayAmount} USDC</p>
          {/* @TODO: This should have a tooltip */}
          <Info
            size={12}
            className={clsx('text-gray-400', {
              'text-gray-300': isFormDisabled,
            })}
          />
        </div>
      </div>
      <div className="flex justify-between">
        <p>{formatMessage(MSG[feeType])}</p>
        <div className="flex items-center gap-2">
          <p className="font-semibold">{feeAmount} USDC</p>
          {/* @TODO: This should have a tooltip */}
          <Info
            size={12}
            className={clsx('text-gray-400', {
              'text-gray-300': isFormDisabled,
            })}
          />
        </div>
      </div>

      <div className="my-1 border-b" />

      <div className="flex justify-between">
        <p className="font-semibold">{formatMessage(MSG.receive)}</p>
        <div className="flex items-center gap-2">
          <p className="font-semibold">
            {receiveAmount} {selectedCurrency}
          </p>
          {/* @TODO: This should have a tooltip */}
          <Info
            size={12}
            className={clsx('text-gray-400', {
              'text-gray-300': isFormDisabled,
            })}
          />
        </div>
      </div>
    </div>
  );
};

SummaryCard.displayName = displayName;

export default SummaryCard;
