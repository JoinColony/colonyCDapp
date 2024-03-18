import clsx from 'clsx';
import React, { type FC } from 'react';

import { DEFAULT_TOKEN_DECIMALS } from '~constants';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useMobile } from '~hooks/index.ts';
import Numeral from '~shared/Numeral/index.ts';
import { formatText } from '~utils/intl.ts';
import { getTokenDecimalsWithFallback } from '~utils/tokens.ts';
import PillsBase from '~v5/common/Pills/index.ts';

import { type ManageReputationTableCompletedStateProps } from './types.ts';

const ManageReputationTableCompletedState: FC<
  ManageReputationTableCompletedStateProps
> = ({ amount, isSmite, className }) => {
  const isMobile = useMobile();
  const { colony } = useColonyContext();
  const { nativeToken } = colony;

  const amountContent = (
    <p className="text-md font-normal text-gray-900">
      <Numeral
        value={amount}
        decimals={getTokenDecimalsWithFallback(
          nativeToken.decimals,
          DEFAULT_TOKEN_DECIMALS,
        )}
        suffix={` ${formatText({
          id: 'actionSidebar.manageReputation.points',
        })}`}
      />
    </p>
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

  return (
    <div className={clsx(className, 'w-full')}>
      <h3 className="mb-3 text-gray-900 text-2">
        {formatText({ id: 'actionSidebar.manageReputation.reputationChange' })}
      </h3>
      <div className="w-full rounded-lg overflow-hidden border border-gray-200">
        <table className="w-full table-fixed">
          {isMobile ? (
            <tbody>
              <tr>
                <th className="text-left font-normal text-gray-600 text-sm bg-gray-50 border-r border-r-gray-200 p-4 align-top w-[6.125rem]">
                  {formatText({
                    id: 'actionSidebar.manageReputation.change',
                  })}
                </th>
                <td className="px-4 pt-[.9375rem] pb-4">
                  <div className="flex flex-col items-start gap-4">
                    {amountContent}
                    {pill}
                  </div>
                </td>
              </tr>
            </tbody>
          ) : (
            <>
              <thead className="text-gray-600 text-sm">
                <tr className="border-b border-b-gray-200 bg-gray-50">
                  <th
                    className="text-left font-normal py-[.6875rem] px-4"
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
