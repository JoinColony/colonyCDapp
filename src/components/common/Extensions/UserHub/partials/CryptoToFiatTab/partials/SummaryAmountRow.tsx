import clsx from 'clsx';
import React, { type FC } from 'react';

import LoadingSkeleton from '~common/LoadingSkeleton/LoadingSkeleton.tsx';
import {
  type ExtendedSupportedCurrencies,
  type SupportedCurrencies,
} from '~gql';

import SummaryInfo from './SummaryInfo.tsx';

const displayName = 'common.Extensions.UserHub.partials.SummaryAmmountRow';

interface SummaryAmountRowProps {
  isHighlighted?: boolean;
  description: string;
  amount: number;
  currency: ExtendedSupportedCurrencies | SupportedCurrencies;
  tooltipContent: string;
  isDisabled?: boolean;
  isLoading?: boolean;
}

const SummaryAmountRow: FC<SummaryAmountRowProps> = ({
  isHighlighted,
  description,
  amount,
  currency,
  tooltipContent,
  isDisabled,
  isLoading,
}) => {
  return (
    <div className="flex justify-between">
      <LoadingSkeleton
        className="h-[18px] w-[99px] rounded"
        isLoading={isLoading}
      >
        <p
          className={clsx({
            'font-semibold': isHighlighted,
            'text-gray-600': !isHighlighted && !isDisabled,
          })}
        >
          {description}
        </p>
      </LoadingSkeleton>
      <div className="flex items-center gap-2">
        <LoadingSkeleton
          className="h-[18px] w-[59px] rounded"
          isLoading={isLoading}
        >
          <p className="font-semibold">
            {amount} {currency}
          </p>
        </LoadingSkeleton>
        <SummaryInfo tooltipContent={tooltipContent} isDisabled={isDisabled} />
      </div>
    </div>
  );
};

SummaryAmountRow.displayName = displayName;

export default SummaryAmountRow;
