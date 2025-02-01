import React, { type FC } from 'react';

import { useStreamingFiltersContext } from '~frame/v5/pages/StreamingPaymentsPage/partials/StreamingPaymentsTable/FiltersContext/StreamingFiltersContext.ts';
import { formatText } from '~utils/intl.ts';
import Checkbox from '~v5/common/Checkbox/index.ts';

import { END_CONDITION_FILTERS } from './consts.ts';

const ActiveStatusFilters: FC = () => {
  const { endConditions, handleEndConditionsFilterChange } =
    useStreamingFiltersContext();

  return (
    <div>
      <h5 className="hidden px-3.5 pb-2 uppercase text-gray-400 text-4 sm:block">
        {formatText({ id: 'streamingPayment.table.filter.endCondition' })}
      </h5>
      <ul>
        {END_CONDITION_FILTERS.map(({ label, name }) => {
          const isChecked = endConditions.includes(name);

          return (
            <li key={name}>
              <Checkbox
                className="subnav-button px-0 sm:px-3.5"
                name={name}
                onChange={handleEndConditionsFilterChange}
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

export default ActiveStatusFilters;
