import clsx from 'clsx';
import React, { type ChangeEventHandler, type FC } from 'react';

import LoadingSkeleton from '~common/LoadingSkeleton/index.ts';
import { CurrencyLabel } from '~frame/v5/pages/UserCryptoToFiatPage/partials/CurrencyLabel.tsx';
import { type SupportedCurrencies } from '~gql';

const displayName = 'common.Extensions.UserHub.partials.CardInput';

interface CardInputProps {
  isFormDisabled: boolean;
  symbol: string;
  name: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  isLoading: boolean;
}

const CardInput: FC<CardInputProps> = ({
  isFormDisabled,
  symbol,
  name,
  value,
  onChange,
  isLoading,
}) => {
  return (
    <div className={clsx('relative flex', { 'pt-2': isLoading })}>
      <LoadingSkeleton isLoading={isLoading} className="h-5 w-[26px] rounded">
        <input
          name={name}
          value={value}
          onChange={onChange}
          className={clsx('w-full pr-16 text-xl font-semibold outline-none', {
            'bg-transparent text-gray-300': isFormDisabled,
            'bg-base-white text-gray-900': !isFormDisabled,
          })}
          disabled={isFormDisabled}
        />
      </LoadingSkeleton>
      <div
        className={clsx(
          'absolute right-0 top-1 flex items-center gap-1 text-md font-medium',
          {
            'text-gray-300': isFormDisabled,
            'text-gray-900': !isFormDisabled,
          },
        )}
      >
        <CurrencyLabel
          currency={symbol as SupportedCurrencies}
          labelClassName="font-normal"
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

CardInput.displayName = displayName;

export default CardInput;
