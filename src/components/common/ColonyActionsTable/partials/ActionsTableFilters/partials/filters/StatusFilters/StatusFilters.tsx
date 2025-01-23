import React, { type FC } from 'react';

import { useFiltersContext } from '~common/ColonyActionsTable/FiltersContext/FiltersContext.ts';
import { formatText } from '~utils/intl.ts';
import Checkbox from '~v5/common/Checkbox/index.ts';

import { STATUS_FILTERS } from './consts.ts';

const StatusFilters: FC = () => {
  const { motionStates, handleMotionStatesFilterChange } = useFiltersContext();

  return (
    <div>
      <h5 className="hidden px-3.5 pb-2 uppercase text-gray-400 text-4 sm:block">
        {formatText({ id: 'activityFeedTable.filters.status' })}
      </h5>
      <ul>
        {STATUS_FILTERS.map(({ label, name }) => {
          const isChecked = motionStates.includes(name);

          return (
            <li key={name}>
              <Checkbox
                className="subnav-button px-0 sm:px-3.5"
                name={name}
                onChange={handleMotionStatesFilterChange}
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
