import clsx from 'clsx';
import React, { type FC, type PropsWithChildren } from 'react';

import LoadingSkeleton from '~common/LoadingSkeleton/LoadingSkeleton.tsx';
import { currencySymbolMap } from '~constants/currency.ts';
import { useCurrencyContext } from '~context/CurrencyContext/CurrencyContext.ts';
import { NumeralCurrency } from '~shared/Numeral/NumeralCurrency.tsx';
import { getValuesTrend } from '~utils/balance/getValuesTrend.ts';
import { FundsTrend } from '~v5/frame/ColonyHome/partials/FundsTrend/FundsTrend.tsx';

interface TitledSectionProps extends PropsWithChildren {
  title: string;
  caption: string;
  value?: string;
  previousValue?: string;
  isLoading?: boolean;
}

export const TitledSection: FC<TitledSectionProps> = ({
  title,
  caption,
  value = '0',
  previousValue = '0',
  isLoading,
  children,
}) => {
  const { currency } = useCurrencyContext();
  const trend = getValuesTrend(value, previousValue);

  return (
    <div className="flex flex-row flex-wrap items-end justify-between gap-2">
      <div
        className={clsx({
          'flex flex-col gap-1': isLoading,
        })}
      >
        <LoadingSkeleton isLoading={isLoading} className="h-5 w-[60px] rounded">
          <div className="text-md font-normal">{title}</div>
        </LoadingSkeleton>
        <div className="flex flex-row items-center gap-2">
          <LoadingSkeleton
            isLoading={isLoading}
            className="h-[27px] w-[100px] rounded"
          >
            <div className="text-xl font-semibold">
              <NumeralCurrency
                prefix={currencySymbolMap[currency]}
                value={value}
                decimals={18}
              />
            </div>
          </LoadingSkeleton>
          <LoadingSkeleton isLoading={isLoading} className="h-5 w-10 rounded">
            <div className="mt-0.5 text-md font-medium">{currency}</div>
          </LoadingSkeleton>
        </div>
        <div className="mt-1 flex flex-row items-center gap-4">
          <LoadingSkeleton
            isLoading={isLoading}
            className="h-4 w-[70px] rounded"
          >
            <div className="text-xs uppercase text-gray-400">{caption}</div>
          </LoadingSkeleton>
          <LoadingSkeleton
            isLoading={isLoading}
            className="h-4 w-[45px] rounded"
          >
            <FundsTrend isIncrease={trend.isIncrease} value={trend.value} />
          </LoadingSkeleton>
        </div>
      </div>
      {children}
    </div>
  );
};
