import React, { type FC } from 'react';

import { useFiltersContext } from '~common/ColonyActionsTable/FiltersContext/index.ts';
import { formatText } from '~utils/intl.ts';
import Checkbox from '~v5/common/Checkbox/index.ts';

import { ACTION_TYPES_FILTERS } from './consts.ts';

const ActionTypeFilters: FC = () => {
  const { actionTypesFilters, handleActionTypesFilterChange } =
    useFiltersContext();

  return (
    <div>
      <h5 className="hidden sm:block text-4 text-gray-400 px-3.5 uppercase">
        {formatText({ id: 'activityFeedTable.filters.actionType' })}
      </h5>
      <ul>
        {ACTION_TYPES_FILTERS.map(({ label, name }) => {
          const isChecked = actionTypesFilters.includes(name);

          return (
            <li key={name}>
              <Checkbox
                classNames="subnav-button px-0 sm:px-3.5"
                name={name}
                onChange={handleActionTypesFilterChange}
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

export default ActionTypeFilters;
