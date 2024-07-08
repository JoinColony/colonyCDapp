import React, { type FC } from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import Numeral from '~shared/Numeral/index.ts';
import { formatText } from '~utils/intl.ts';
import { getTokenDecimalsWithFallback } from '~utils/tokens.ts';
import ManageReputationTable from '~v5/common/ActionSidebar/partials/ManageReputationTable/index.ts';

import { useManageReputationTableData } from './hooks.ts';
import { type ManageReputationTableInMotionProps } from './types.ts';

const ManageReputationTableInMotion: FC<ManageReputationTableInMotionProps> = ({
  amount,
  member,
  domainId,
  isSmite,
  className,
}) => {
  const {
    amountPercentageValue,
    formattedNewReputationPoints,
    formattedReputationPoints,
    isLoading,
    newPercentageReputation,
    percentageReputation,
  } = useManageReputationTableData({ amount, member, domainId, isSmite });
  const { colony } = useColonyContext();
  const { nativeToken } = colony;

  return (
    <ManageReputationTable
      className={className}
      formattedNewReputationPoints={formattedNewReputationPoints}
      formattedReputationPoints={formattedReputationPoints}
      isLoading={isLoading}
      newPercentageReputation={newPercentageReputation}
      percentageReputation={percentageReputation}
      changeContent={
        <p className="flex flex-wrap items-center gap-x-2 text-md font-normal text-gray-900">
          <Numeral
            value={amount}
            decimals={getTokenDecimalsWithFallback(nativeToken.decimals)}
          />
          <span className="flex-shrink-0">
            {formatText(
              {
                id: 'actionSidebar.manageReputation.points.percentage',
              },
              {
                percentage: (
                  <Numeral value={amountPercentageValue} suffix="%" />
                ),
              },
            )}
          </span>
        </p>
      }
    />
  );
};

export default ManageReputationTableInMotion;
