import React from 'react';

import { useFiltersContext } from '~frame/v5/pages/BalancePage/partials/BalanceTable/Filters/FiltersContext/index.ts';
import { formatText } from '~utils/intl.ts';
import { useChainOptions } from '~v5/common/ActionSidebar/partials/ChainSelect/hooks.ts';
import Checkbox from '~v5/common/Checkbox/index.ts';

const ChainFilters = () => {
  const { filters, handleFiltersChange } = useFiltersContext();

  const chainOptions = useChainOptions();

  return (
    <div>
      <h5 className="hidden px-3.5 pb-2 uppercase text-gray-400 text-4 sm:block">
        {formatText({ id: 'balancePage.filter.chain' })}
      </h5>
      <ul>
        {chainOptions.map(({ label, icon: Icon }) => {
          const isChecked = filters.chain[label];

          return (
            <li key={label}>
              <Checkbox
                className="subnav-button px-0 sm:px-3.5"
                name={label}
                onChange={(event) => handleFiltersChange(event, 'chain')}
                isChecked={isChecked}
              >
                {Icon && <Icon size={20} />}
                {label}
              </Checkbox>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ChainFilters;
