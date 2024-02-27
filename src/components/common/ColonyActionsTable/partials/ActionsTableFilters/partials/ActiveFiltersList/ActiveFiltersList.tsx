import React, { type FC } from 'react';

import ActiveFiltersBox from '../ActiveFiltersBox/index.ts';

import { useActiveFilters } from './hooks.ts';

const ActiveFiltersList: FC = () => {
  const { activeFiltersToDisplay, handleResetFilters } = useActiveFilters();

  return (
    <ul className="flex flex-wrap justify-end gap-2">
      {activeFiltersToDisplay.map(({ category, filter, items }) => (
        <li key={category}>
          <ActiveFiltersBox onClose={() => handleResetFilters(filter)}>
            <strong className="font-semibold">{category}</strong>:{' '}
            {items.join(', ')}
          </ActiveFiltersBox>
        </li>
      ))}
    </ul>
  );
};

export default ActiveFiltersList;
