import React, { type FC } from 'react';

import { formatText } from '~utils/intl.ts';
import Checkbox from '~v5/common/Checkbox/index.ts';

import { useFiltersContext } from '../../../FilterContext/FiltersContext.tsx';

import { useGetTokenTypeFilters } from './consts.tsx';

const TokenFilters: FC = () => {
  const { tokenTypes, handleTokenTypesFilterChange } = useFiltersContext();
  const tokenTypesFilters = useGetTokenTypeFilters();

  return (
    <div>
      <h5 className="hidden sm:block text-4 text-gray-400 px-3.5 uppercase">
        {formatText({ id: 'balancePage.filter.approvedTokenTypes' })}
      </h5>
      <ul>
        {tokenTypesFilters.map(({ label, name }) => {
          const isChecked = tokenTypes[name];

          return (
            <li key={name}>
              <Checkbox
                classNames="subnav-button px-0 sm:px-3.5"
                name={name}
                onChange={handleTokenTypesFilterChange}
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

export default TokenFilters;
