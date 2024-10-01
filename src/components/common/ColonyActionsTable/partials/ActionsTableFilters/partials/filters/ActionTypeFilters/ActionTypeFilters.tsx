import React, { type FC } from 'react';

import { CoreAction } from '~actions/index.ts';
import { useFiltersContext } from '~common/ColonyActionsTable/FiltersContext/FiltersContext.ts';
import { formatText } from '~utils/intl.ts';
import Checkbox from '~v5/common/Checkbox/index.ts';

const ActionTypeFilters: FC = () => {
  const { actionTypesFilters, handleActionTypesFilterChange } =
    useFiltersContext();

  return (
    <div>
      <h5 className="hidden px-3.5 pb-2 uppercase text-gray-400 text-4 sm:block">
        {formatText({ id: 'activityFeedTable.filters.actionType' })}
      </h5>
      <ul>
        {/* FIXME: I broke this, get available actions in another way */}
        {/* name probably needs to be id or something like that */}
        {[{ name: CoreAction.Payment, label: 'THIS IS BROKEN!!!' }].map(
          ({ label, name }) => {
            const isChecked = actionTypesFilters.includes(name);

            return (
              <li key={name}>
                <Checkbox
                  className="subnav-button px-0 sm:px-3.5"
                  name={name}
                  onChange={handleActionTypesFilterChange}
                  isChecked={isChecked}
                >
                  {label}
                </Checkbox>
              </li>
            );
          },
        )}
      </ul>
    </div>
  );
};

export default ActionTypeFilters;
