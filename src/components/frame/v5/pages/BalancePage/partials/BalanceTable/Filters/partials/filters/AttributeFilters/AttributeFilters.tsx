import React, { type FC } from 'react';

import { formatText } from '~utils/intl.ts';
import Checkbox from '~v5/common/Checkbox/index.ts';

import { useFiltersContext } from '../../../FiltersContext/FiltersContext.ts';

import { ATTRIBUTE_FILTERS } from './consts.ts';

const AttributeFilters: FC = () => {
  const { attributeFilters, handleAttributeFilterChange } = useFiltersContext();

  return (
    <div>
      <h5 className="hidden sm:block text-4 text-gray-400 px-3.5 uppercase">
        {formatText({ id: 'balancePage.filter.attributeTypes' })}
      </h5>
      <ul>
        {ATTRIBUTE_FILTERS.map(({ label, name }) => {
          const isChecked = attributeFilters[name];

          return (
            <li key={name}>
              <Checkbox
                classNames="subnav-button px-0 sm:px-3.5"
                name={name}
                onChange={handleAttributeFilterChange}
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

export default AttributeFilters;
