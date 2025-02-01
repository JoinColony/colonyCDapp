import React, { type FC } from 'react';

import { useStreamingFiltersContext } from '~frame/v5/pages/StreamingPaymentsPage/partials/StreamingPaymentsTable/FiltersContext/StreamingFiltersContext.ts';
import { formatText } from '~utils/intl.ts';
import Checkbox from '~v5/common/Checkbox/index.ts';

import { TOTAL_STREAMED_FILTERS } from './consts.ts';

const TotalStreamedFilters: FC = () => {
  const { totalStreamedFilters, handleTotalStreamedFilterChange } =
    useStreamingFiltersContext();

  return (
    <div>
      <h5 className="hidden px-3.5 pb-2 uppercase text-gray-400 text-4 sm:block">
        {formatText({ id: 'streamingPayment.table.filter.status' })}
      </h5>
      <ul>
        {TOTAL_STREAMED_FILTERS.map(({ label, name }) => {
          const isChecked = totalStreamedFilters
            ? totalStreamedFilters.includes(name)
            : false;

          return (
            <li key={name}>
              <Checkbox
                className="subnav-button px-0 sm:px-3.5"
                name={name}
                onChange={handleTotalStreamedFilterChange}
                isChecked={isChecked}
              >
                {label}
              </Checkbox>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TotalStreamedFilters;
