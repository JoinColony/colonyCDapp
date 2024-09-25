import React from 'react';

import { FundsTrend } from '~v5/frame/ColonyHome/partials/FundsTrend/FundsTrend.tsx';

interface FundsCardsTotalDescriptionProps {}

// @TODO create logic for this component, props etc
export const FundsCardsTotalDescription: React.FC<
  FundsCardsTotalDescriptionProps
> = () => {
  return (
    <div className="flex w-full justify-between text-xs">
      <span className="uppercase text-gray-400">Native 1.56M CLNY</span>
      <FundsTrend isIncrease value="15% Week" />
    </div>
  );
};
