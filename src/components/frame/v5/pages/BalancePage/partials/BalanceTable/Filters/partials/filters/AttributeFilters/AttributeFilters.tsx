import React, { type FC } from 'react';

import { useFiltersContext } from '~frame/v5/pages/BalancePage/partials/BalanceTable/Filters/FiltersContext/FiltersContext.ts';
import { formatText } from '~utils/intl.ts';
import Checkbox from '~v5/common/Checkbox/index.ts';

import { ATTRIBUTE_FILTERS } from './consts.ts';

const AttributeFilters: FC = () => {
  const { handleFiltersChange, filters } = useFiltersContext();

  return (
    <div>
      <h5 className="hidden px-3.5 pb-2 uppercase text-gray-400 text-4 sm:block">
        {formatText({ id: 'balancePage.filter.attributeTypes' })}
      </h5>
      <ul>
        {ATTRIBUTE_FILTERS.map(({ label, name }) => {
          const { isChecked } = filters.attribute[name] ?? {};

          return (
            <li key={name}>
              <Checkbox
                className="subnav-button px-0 sm:px-3.5"
                name={name}
                onChange={(event) => {
                  handleFiltersChange(event, 'attribute');
                }}
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
