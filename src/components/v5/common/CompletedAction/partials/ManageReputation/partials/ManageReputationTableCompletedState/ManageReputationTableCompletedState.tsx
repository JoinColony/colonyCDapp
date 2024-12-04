import clsx from 'clsx';
import { BigNumber } from 'ethers';
import React, { type FC } from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useMobile } from '~hooks/index.ts';
import useUserReputation from '~hooks/useUserReputation.ts';
import Numeral from '~shared/Numeral/index.ts';
import { formatText } from '~utils/intl.ts';
import {
  calculatePercentageReputation,
  getReputationDifference,
} from '~utils/reputation.ts';
import { getTokenDecimalsWithFallback } from '~utils/tokens.ts';
import PillsBase from '~v5/common/Pills/index.ts';

import { type ManageReputationTableCompletedStateProps } from './types.ts';

const ManageReputationTableCompletedState: FC<
  ManageReputationTableCompletedStateProps
> = ({ amount, isSmite, className, domainId, recipientAddress, rootHash }) => {
  const isMobile = useMobile();
  const { colony } = useColonyContext();
  const { nativeToken } = colony;

  const {
    userReputation: oldUserReputation = '0',
    totalReputation: oldTotalReputation = '0',
  } = useUserReputation({
    colonyAddress: colony.colonyAddress,
    walletAddress: recipientAddress,
    domainId,
    rootHash,
  });

  const oldPercentageReputation =
    calculatePercentageReputation(oldUserReputation, oldTotalReputation) || 0;

  const updatedUserReputation = BigNumber.from(oldUserReputation).add(amount);
  const updatedTotalReputation = BigNumber.from(oldTotalReputation).add(amount);
  const updatedPercentageReputation =
    calculatePercentageReputation(
      updatedUserReputation.toString(),
      updatedTotalReputation.toString(),
    ) || 0;

  const UpdatedReputationPercentage = getReputationDifference(
    updatedPercentageReputation,
    oldPercentageReputation,
  );

  const pill = (
    <PillsBase
      className={clsx({
        'bg-negative-100 text-negative-400': isSmite,
        'bg-success-100 text-success-400': !isSmite,
      })}
    >
      {formatText({
        id: `actionSidebar.manageReputation.${isSmite ? 'removed' : 'awarded'}`,
      })}
    </PillsBase>
  );

  const amountContent = (
    <p className="text-md font-normal text-gray-900">
      <Numeral
        value={amount}
        decimals={getTokenDecimalsWithFallback(nativeToken.decimals)}
        suffix={` ${formatText({
          id: 'actionSidebar.manageReputation.points',
        })}`}
      />{' '}
      (
      <Numeral value={UpdatedReputationPercentage} suffix="%" />)
    </p>
  );

  return (
    <div className={clsx(className, 'w-full')}>
      <h3 className="mb-3 text-gray-900 text-2">
        {formatText({ id: 'actionSidebar.manageReputation.reputationChange' })}
      </h3>
      <div className="w-full overflow-hidden rounded-lg border border-gray-200">
        <table className="w-full table-fixed">
          {isMobile ? (
            <tbody>
              <tr>
                <th className="w-[6.125rem] border-r border-r-gray-200 bg-gray-50 p-4 text-left align-top text-sm font-normal text-gray-600">
                  {formatText({
                    id: 'actionSidebar.manageReputation.change',
                  })}
                </th>
                <td className="px-4 pb-4 pt-[.9375rem]">
                  <div className="flex flex-col items-start gap-4">
                    {amountContent}
                    {pill}
                  </div>
                </td>
              </tr>
            </tbody>
          ) : (
            <>
              <thead className="text-sm text-gray-600">
                <tr className="border-b border-b-gray-200 bg-gray-50">
                  <th
                    className="px-4 py-[.6875rem] text-left font-normal"
                    colSpan={2}
                  >
                    {formatText({
                      id: 'actionSidebar.manageReputation.change',
                    })}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="h-[3.375rem] py-1 pl-4 pr-2">
                    {amountContent}
                  </td>
                  <td className="h-[3.375rem] py-1 pl-2 pr-4 text-right">
                    {pill}
                  </td>
                </tr>
              </tbody>
            </>
          )}
        </table>
      </div>
    </div>
  );
};

export default ManageReputationTableCompletedState;
