import React, { type FC } from 'react';

import { useStreamingFiltersContext } from '~frame/v5/pages/StreamingPaymentsPage/partials/StreamingPaymentsTable/FiltersContext/StreamingFiltersContext.ts';
import { formatText } from '~utils/intl.ts';
import Checkbox from '~v5/common/Checkbox/index.ts';

import { STATUS_FILTERS } from './consts.ts';

const StatusFilters: FC = () => {
  const { statuses, handleStatusesFilterChange } = useStreamingFiltersContext();

  return (
    <div>
      <h5 className="hidden px-3.5 pb-2 uppercase text-gray-400 text-4 sm:block">
        {formatText({ id: 'streamingPayment.table.filter.status' })}
      </h5>
      <ul>
        {STATUS_FILTERS.map(({ label, name }) => {
          const isChecked = statuses.includes(name);

          return (
            <li key={name}>
              <Checkbox
                classNames="subnav-button px-0 sm:px-3.5"
                name={name}
                onChange={handleStatusesFilterChange}
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

export default StatusFilters;
