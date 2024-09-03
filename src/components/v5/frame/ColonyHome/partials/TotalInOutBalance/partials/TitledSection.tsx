import clsx from 'clsx';
import React, { type FC, type PropsWithChildren } from 'react';

import LoadingSkeleton from '~common/LoadingSkeleton/LoadingSkeleton.tsx';
import { currencySymbolMap } from '~constants/currency.ts';
import { useCurrencyContext } from '~context/CurrencyContext/CurrencyContext.ts';
import Numeral from '~shared/Numeral/Numeral.tsx';

interface TitledSectionProps extends PropsWithChildren {
  title: string;
  caption: string;
  value?: string;
  isLoading?: boolean;
}

export const TitledSection: FC<TitledSectionProps> = ({
  title,
  caption,
  value = '0',
  isLoading,
  children,
}) => {
  const { currency } = useCurrencyContext();

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
              <Numeral prefix={currencySymbolMap[currency]} value={value} />
            </div>
          </LoadingSkeleton>
          <LoadingSkeleton isLoading={isLoading} className="h-5 w-10 rounded">
            <div className="mt-0.5 text-md font-medium">{currency}</div>
          </LoadingSkeleton>
        </div>
        <LoadingSkeleton isLoading={isLoading} className="h-4 w-[70px] rounded">
          <div className="mt-1 text-xs uppercase text-gray-400">{caption}</div>
        </LoadingSkeleton>
      </div>
      {children}
    </div>
  );
};
