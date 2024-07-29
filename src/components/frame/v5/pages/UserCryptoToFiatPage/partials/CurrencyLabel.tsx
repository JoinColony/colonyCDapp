import clsx from 'clsx';
import React, { type FC } from 'react';

import { type SupportedCurrencies } from '~gql';

import { currencyIcons } from '../../../../../common/Extensions/UserNavigation/partials/UserMenu/consts.ts';

interface CurrencyLabelProps {
  currency: SupportedCurrencies;
  labelClassName?: string;
}

export const CurrencyLabel: FC<CurrencyLabelProps> = ({
  currency,
  labelClassName,
}) => {
  const CurrencyIcon = currencyIcons[currency];

  return (
    <div className="flex flex-row gap-2">
      <CurrencyIcon size={18} />
      <p className={clsx('text-md font-medium', labelClassName)}>{currency}</p>
    </div>
  );
};
