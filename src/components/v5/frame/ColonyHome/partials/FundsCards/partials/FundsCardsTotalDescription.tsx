import React from 'react';

import LoadingSkeleton from '~common/LoadingSkeleton/LoadingSkeleton.tsx';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import useGetSelectedDomainFilter from '~hooks/useGetSelectedDomainFilter.tsx';
import Numeral from '~shared/Numeral/Numeral.tsx';
import { getBalanceForTokenAndDomain } from '~utils/tokens.ts';
import { FundsTrend } from '~v5/frame/ColonyHome/partials/FundsTrend/FundsTrend.tsx';

interface FundsCardsTotalDescriptionProps {
  percent: string;
  isIncrease?: boolean;
  isLoading?: boolean;
}

// @TODO create logic for this component, props etc
export const FundsCardsTotalDescription: React.FC<
  FundsCardsTotalDescriptionProps
> = ({ percent, isIncrease, isLoading }) => {
  const selectedDomain = useGetSelectedDomainFilter();
  const {
    colony: { balances, nativeToken },
  } = useColonyContext();
  const tokenBalance = getBalanceForTokenAndDomain(
    balances,
    nativeToken.tokenAddress,
    selectedDomain ? Number(selectedDomain.nativeId) : undefined,
  );

  return (
    <div className="flex w-full justify-between text-xs">
      <LoadingSkeleton isLoading={isLoading} className="h-4 w-[114px] rounded">
        <span className="uppercase text-gray-400">
          <Numeral
            prefix="Native"
            value={tokenBalance.toString()}
            decimals={nativeToken.decimals}
            suffix={` ${nativeToken.symbol}`}
          />
        </span>
      </LoadingSkeleton>
      <LoadingSkeleton isLoading={isLoading} className="h-4 w-[30px] rounded">
        <FundsTrend isIncrease={isIncrease} value={`${percent} Week`} />
      </LoadingSkeleton>
    </div>
  );
};
