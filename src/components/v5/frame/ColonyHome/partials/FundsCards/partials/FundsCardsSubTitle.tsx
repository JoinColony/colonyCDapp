import clsx from 'clsx';
import React, { type FC } from 'react';

import LoadingSkeleton from '~common/LoadingSkeleton/LoadingSkeleton.tsx';

interface FundsCardsSubTitleProps {
  value: React.ReactNode;
  currency: string;
  isLoading?: boolean;
  className?: string;
}
export const FundsCardsSubTitle: FC<FundsCardsSubTitleProps> = ({
  value,
  currency,
  isLoading,
  className,
}) => {
  return (
    <p className={clsx(className, 'flex items-center gap-2')}>
      <LoadingSkeleton
        className="h-[27px] w-[90px] rounded"
        isLoading={isLoading}
      >
        <span>{value}</span>
      </LoadingSkeleton>

      <LoadingSkeleton isLoading={isLoading} className="h-5 w-[30px] rounded">
        <span className="uppercase text-1">{currency}</span>
      </LoadingSkeleton>
    </p>
  );
};
