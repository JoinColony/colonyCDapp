import clsx from 'clsx';
import React, { type FC } from 'react';

import { useFiltersContext } from '~frame/v5/pages/AgreementsPage/FiltersContext/FiltersContext.tsx';
import { useMobile } from '~hooks';
import { formatText } from '~utils/intl.ts';
import Checkbox from '~v5/common/Checkbox/index.ts';
import RangeDatepicker from '~v5/common/Fields/datepickers/RangeDatepicker/index.ts';

import { DATE_FILTERS } from './consts.ts';

const DateFilters: FC = () => {
  const isMobile = useMobile();
  const { dateFilters, handleCustomDateFilterChange, handleDateFilterChange } =
    useFiltersContext();

  const [startDate, endDate] = dateFilters.custom || [];

  return (
    <div className="pb-2">
      <h5 className="hidden sm:block text-4 text-gray-400 px-3.5 uppercase">
        {formatText({ id: 'agreementsPage.filters.date' })}
      </h5>
      <ul>
        {DATE_FILTERS.map(({ label, name }) => {
          const isChecked = dateFilters[name];

          return (
            <li key={name}>
              <Checkbox
                classNames="subnav-button px-0 sm:px-3.5"
                name={name}
                isChecked={isChecked}
                onChange={handleDateFilterChange}
              >
                {label}
              </Checkbox>
            </li>
          );
        })}
      </ul>
      <h5 className="text-4 text-gray-400 sm:px-3.5 uppercase mt-2">
        {formatText({ id: 'agreementsPage.filters.date.custom' })}
      </h5>
      <div className="mt-4 sm:px-3.5">
        <RangeDatepicker
          onChange={handleCustomDateFilterChange}
          startDate={startDate ? new Date(startDate) : undefined}
          endDate={endDate ? new Date(endDate) : undefined}
          maxDate={new Date()}
          popperClassName={clsx({
            '!fixed !top-1/2 !inset-auto !left-1/2 !-translate-x-1/2 !-translate-y-1/2 w-full':
              isMobile,
          })}
        />
      </div>
    </div>
  );
};

export default DateFilters;
