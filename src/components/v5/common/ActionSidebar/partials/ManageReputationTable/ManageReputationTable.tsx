import clsx from 'clsx';
import React, { type FC } from 'react';

import { useMobile } from '~hooks';
import Numeral from '~shared/Numeral/index.ts';
import { SpinnerLoader } from '~shared/Preloaders/index.ts';
import { formatText } from '~utils/intl.ts';

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

  const currentReputationContent = isLoading ? (
    <SpinnerLoader />
  ) : (
    <p className="text-md font-normal text-gray-400 flex items-center gap-x-2 flex-wrap">
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
    <p className="text-md font-normal text-gray-400 flex items-center gap-x-2 flex-wrap">
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
        className={clsx('w-full rounded-lg overflow-hidden border', {
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
                    'text-left font-normal text-gray-600 text-sm bg-gray-50 border-r px-4 pt-2 pb-1 w-[6.125rem]',
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
                <td className="pt-2 pb-1 px-4">
                  <div className="h-[2.875rem] flex items-center">
                    {currentReputationContent}
                  </div>
                </td>
              </tr>
              <tr>
                <th
                  className={clsx(
                    'text-left font-normal text-gray-600 text-sm bg-gray-50 border-r px-4 py-1',
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
                <td className="py-1 px-4">
                  <div className="h-[2.875rem] flex items-center">
                    {changeContent}
                  </div>
                </td>
              </tr>
              <tr>
                <th
                  className={clsx(
                    'text-left font-normal text-gray-600 text-sm bg-gray-50 border-r px-4 pt-1 pb-2',
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
                <td className="pt-1 pb-2 px-4">
                  <div className="h-[2.875rem] flex items-center">
                    {newReputationContent}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        ) : (
          <table className="w-full table-fixed">
            <thead className="text-gray-600 text-sm">
              <tr
                className={clsx('border-b bg-gray-50', {
                  'border-b-negative-400': isError,
                  'border-b-gray-200': !isError,
                })}
              >
                <th className="text-left font-normal py-[.6875rem] pl-4 pr-2">
                  {formatText({
                    id: 'actionSidebar.manageReputation.currentReputation',
                  })}
                </th>
                <th className="text-left font-normal py-[.6875rem] px-2">
                  {formatText({
                    id: 'actionSidebar.manageReputation.change',
                  })}
                </th>
                <th className="text-left font-normal py-[.6875rem] pl-2 pr-4">
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
                <td className="h-[3.375rem] py-1 px-2">{changeContent}</td>
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
