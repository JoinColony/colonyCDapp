import clsx from 'clsx';
import React, { type FC } from 'react';

import { useMobile } from '~hooks';
import Numeral from '~shared/Numeral/index.ts';
import { SpinnerLoader } from '~shared/Preloaders/index.ts';
import { formatText } from '~utils/intl.ts';
import useHasNoDecisionMethods from '~v5/common/ActionSidebar/hooks/permissions/useHasNoDecisionMethods.ts';

import { type ManageReputationTableProps } from './types.ts';

const ManageReputationTable: FC<ManageReputationTableProps> = ({
  changeContent,
  formattedNewReputationPoints,
  formattedReputationPoints,
  newPercentageReputation,
  percentageReputation,
  isLoading,
  isError,
  className,
}) => {
  const isMobile = useMobile();

  const hasNoDecisionMethods = useHasNoDecisionMethods();

  const currentReputationContent = isLoading ? (
    <SpinnerLoader />
  ) : (
    <p
      className={clsx(
        'flex flex-wrap items-center gap-x-2 text-md font-normal',
        {
          'text-gray-300': hasNoDecisionMethods,
          'text-gray-400': !hasNoDecisionMethods,
        },
      )}
    >
      <Numeral value={formattedReputationPoints} />
      <span className="flex-shrink-0">
        {formatText(
          {
            id: 'actionSidebar.manageReputation.points.percentage',
          },
          {
            percentage: <Numeral value={percentageReputation} suffix="%" />,
          },
        )}
      </span>
    </p>
  );

  const newReputationContent = (
    <p
      className={clsx(
        'flex flex-wrap items-center gap-x-2 text-md font-normal',
        {
          'text-gray-300': hasNoDecisionMethods,
          'text-gray-400': !hasNoDecisionMethods,
        },
      )}
    >
      <Numeral value={formattedNewReputationPoints} />
      <span className="flex-shrink-0">
        {formatText(
          {
            id: 'actionSidebar.manageReputation.points.percentage',
          },
          {
            percentage: <Numeral value={newPercentageReputation} suffix="%" />,
          },
        )}
      </span>
    </p>
  );

  return (
    <div className={clsx(className, 'w-full')}>
      <h3 className="mb-3 text-gray-900 text-2">
        {formatText({ id: 'actionSidebar.manageReputation.reputationChange' })}
      </h3>
      <div
        className={clsx('w-full overflow-hidden rounded-lg border', {
          'border-negative-400': isError,
          'border-gray-200': !isError,
        })}
      >
        {isMobile ? (
          <table className="w-full table-fixed">
            <tbody>
              <tr>
                <th
                  className={clsx(
                    'w-[6.125rem] border-r bg-gray-50 px-4 pb-1 pt-2 text-left text-sm font-normal text-gray-600',
                    {
                      'border-r-negative-400': isError,
                      'border-r-gray-200': !isError,
                    },
                  )}
                >
                  {formatText({
                    id: 'actionSidebar.manageReputation.currentReputation',
                  })}
                </th>
                <td className="px-4 pb-1 pt-2">
                  <div className="flex h-[2.875rem] items-center">
                    {currentReputationContent}
                  </div>
                </td>
              </tr>
              <tr>
                <th
                  className={clsx(
                    'border-r bg-gray-50 px-4 py-1 text-left text-sm font-normal text-gray-600',
                    {
                      'border-r-negative-400': isError,
                      'border-r-gray-200': !isError,
                    },
                  )}
                >
                  {formatText({
                    id: 'actionSidebar.manageReputation.change',
                  })}
                </th>
                <td className="px-4 py-1">
                  <div className="flex h-[2.875rem] items-center">
                    {changeContent}
                  </div>
                </td>
              </tr>
              <tr>
                <th
                  className={clsx(
                    'border-r bg-gray-50 px-4 pb-2 pt-1 text-left text-sm font-normal text-gray-600',
                    {
                      'border-r-negative-400': isError,
                      'border-r-gray-200': !isError,
                    },
                  )}
                >
                  {formatText({
                    id: 'actionSidebar.manageReputation.newReputation',
                  })}
                </th>
                <td className="px-4 pb-2 pt-1">
                  <div className="flex h-[2.875rem] items-center">
                    {newReputationContent}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        ) : (
          <table className="w-full table-fixed">
            <thead className="text-sm text-gray-600">
              <tr
                className={clsx('border-b bg-gray-50', {
                  'border-b-negative-400': isError,
                  'border-b-gray-200': !isError,
                })}
              >
                <th className="py-[.6875rem] pl-4 pr-2 text-left font-normal">
                  {formatText({
                    id: 'actionSidebar.manageReputation.currentReputation',
                  })}
                </th>
                <th className="px-2 py-[.6875rem] text-left font-normal">
                  {formatText({
                    id: 'actionSidebar.manageReputation.change',
                  })}
                </th>
                <th className="py-[.6875rem] pl-2 pr-4 text-left font-normal">
                  {formatText({
                    id: 'actionSidebar.manageReputation.newReputation',
                  })}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="h-[3.375rem] py-1 pl-4 pr-2">
                  {currentReputationContent}
                </td>
                <td className="h-[3.375rem] px-2 py-1">{changeContent}</td>
                <td className="h-[3.375rem] py-1 pl-2 pr-4">
                  {newReputationContent}
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ManageReputationTable;
