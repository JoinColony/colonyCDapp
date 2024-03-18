import React, { type FC } from 'react';

import { useFiltersContext } from '~common/ColonyActionsTable/FiltersContext/FiltersContext.ts';
import { formatText } from '~utils/intl.ts';
import Checkbox from '~v5/common/Checkbox/index.ts';

import { DECISION_METHOD_FILTERS } from './consts.ts';

const DecisionMethodFilters: FC = () => {
  const { decisionMethod, handleDecisionMethodFilterChange } =
    useFiltersContext();

  return (
    <div>
      <h5 className="hidden sm:block text-4 text-gray-400 px-3.5 uppercase">
        {formatText({ id: 'activityFeedTable.filters.decisionMethod' })}
      </h5>
      <ul>
        {DECISION_METHOD_FILTERS.map(({ label, name }) => {
          const isChecked = decisionMethod === name;

          return (
            <li key={name}>
              <Checkbox
                classNames="subnav-button px-0 sm:px-3.5"
                name={name}
                isChecked={isChecked}
                onChange={handleDecisionMethodFilterChange}
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
