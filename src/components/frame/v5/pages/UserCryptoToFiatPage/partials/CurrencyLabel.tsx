import clsx from 'clsx';
import React, { type FC } from 'react';

import { currencyIcons } from '~common/Extensions/UserNavigation/partials/UserMenu/consts.ts';
import LoadingSkeleton from '~common/LoadingSkeleton/LoadingSkeleton.tsx';
import { type SupportedCurrencies } from '~gql';

interface CurrencyLabelProps {
  currency: SupportedCurrencies;
  labelClassName?: string;
  isLoading?: boolean;
}

export const CurrencyLabel: FC<CurrencyLabelProps> = ({
  currency,
  labelClassName,
  isLoading,
}) => {
  const CurrencyIcon = currencyIcons[currency];

  return (
    <div className="flex flex-row gap-2">
      <LoadingSkeleton
        className="aspect-square w-[18px] rounded-full"
        isLoading={isLoading}
      >
        <CurrencyIcon size={18} />
      </LoadingSkeleton>
      <LoadingSkeleton className="h-5 w-10 rounded" isLoading={isLoading}>
        <p className={clsx('text-md font-medium', labelClassName)}>
          {currency}
        </p>
      </LoadingSkeleton>
    </div>
  );
};
