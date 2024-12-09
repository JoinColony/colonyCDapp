import React, { type FC } from 'react';

import { useFiltersContext } from '~common/ColonyActionsTable/FiltersContext/FiltersContext.ts';
import { formatText } from '~utils/intl.ts';
import Checkbox from '~v5/common/Checkbox/index.ts';

import { DECISION_METHOD_FILTERS } from './consts.ts';

const DecisionMethodFilters: FC = () => {
  const { decisionMethods, handleDecisionMethodsFilterChange } =
    useFiltersContext();

  return (
    <div>
      <h5 className="hidden px-3.5 pb-2 uppercase text-gray-400 text-4 sm:block">
        {formatText({ id: 'activityFeedTable.filters.decisionMethod' })}
      </h5>
      <ul>
        {DECISION_METHOD_FILTERS.map(({ label, name }) => {
          const isChecked = decisionMethods.includes(name);

          return (
            <li key={name}>
              <Checkbox
                className="subnav-button px-0 sm:px-3.5"
                name={name}
                isChecked={isChecked}
                onChange={handleDecisionMethodsFilterChange}
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

export default DecisionMethodFilters;
