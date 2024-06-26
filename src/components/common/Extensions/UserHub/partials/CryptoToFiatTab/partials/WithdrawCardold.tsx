import { formatNumeral } from 'cleave-zen';
import clsx from 'clsx';
import React, { type ChangeEvent } from 'react';
import { useFormContext } from 'react-hook-form';
import { defineMessages, useIntl } from 'react-intl';

import EthereumIcon from '~icons/EthereumIcon.tsx';
import Numeral from '~shared/Numeral/index.ts';

const displayName = 'common.Extensions.UserHub.partials.ConversionCard';

const MSG = defineMessages({
  withdraw: {
    id: `${displayName}.withdraw`,
    defaultMessage: 'Withdraw',
  },
  balance: {
    id: `${displayName}.balance`,
    defaultMessage: 'Balance: ',
  },
  max: {
    id: `${displayName}.max`,
    defaultMessage: 'Max',
  },
});

const ConversionCard = ({
  isFormDisabled,
  balance,
  name,
}: {
  isFormDisabled: boolean;
  balance: number;
  name: string;
}) => {
  const { formatMessage } = useIntl();

  const { getValues, setValue, getFieldState } = useFormContext();

  const { error } = getFieldState(name);

  const amountValue = getValues(name);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const formattedAmount = formatNumeral(event.target.value);
    setValue(name, formattedAmount);
  };

  return (
    <div>
      <div
        className={clsx('rounded-lg border border-gray-200 p-4', {
          'bg-gray-50': isFormDisabled,
          'border-negative-400': error,
        })}
      >
        <div className="flex justify-between">
          <p
            className={clsx('text-sm', {
              'text-gray-600': !isFormDisabled,
              'text-gray-300': isFormDisabled,
            })}
          >
            {formatMessage(MSG.withdraw)}
          </p>
          <div className="flex gap-2 text-sm">
            <p
              className={clsx({
                'text-gray-500': !isFormDisabled,
                'text-gray-300': isFormDisabled,
              })}
            >
              <Numeral
                prefix={formatMessage(MSG.balance)}
                value={balance}
                decimals={6}
              />
            </p>
            <button
              type="button"
              // @TODO: setValue(balance)
              onClick={() => {}}
              className={clsx('font-semibold', {
                'text-blue-400': !isFormDisabled,
                'text-gray-300': isFormDisabled,
              })}
              disabled={isFormDisabled}
            >
              {formatMessage(MSG.max)}
            </button>
          </div>
        </div>
        <div className="relative flex">
          <input
            name="amount"
            value={amountValue}
            onChange={handleChange}
            className={clsx('w-full pr-16 text-xl outline-none', {
              'text-gray-300': isFormDisabled,
              'text-gray-900': !isFormDisabled,
            })}
            disabled={isFormDisabled}
          />
          {/* @TODO: Change to the USDC icon */}
          <div
            className={clsx(
              'absolute right-0 top-1 flex items-center gap-1 text-md font-medium',
              {
                'text-gray-300': isFormDisabled,
                'text-gray-900': !isFormDisabled,
              },
            )}
          >
            <EthereumIcon size={18} />
            <p>USDC</p>
          </div>
        </div>
      </div>
      {error && <p className="text-sm text-negative-400">{error.message}</p>}
    </div>
  );
};

ConversionCard.displayName = displayName;

export default ConversionCard;
