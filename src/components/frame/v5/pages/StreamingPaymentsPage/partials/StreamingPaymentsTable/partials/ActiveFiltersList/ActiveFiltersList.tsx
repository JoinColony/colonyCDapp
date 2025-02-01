import { X } from '@phosphor-icons/react';
import React, { type FC } from 'react';

import { useActiveFilters } from './hooks.ts';

const ActiveFiltersList: FC = () => {
  const { activeFiltersToDisplay, handleResetFilters } = useActiveFilters();

  return (
    <ul className="flex flex-wrap justify-end gap-2">
      {activeFiltersToDisplay.map(({ filter, items, label }) => (
        <li key={filter}>
          <div className="flex items-center justify-end rounded-lg bg-blue-100 px-3 py-2 text-sm text-blue-400">
            <div>
              <strong className="font-semibold">{label}</strong>:{' '}
              {items.join(', ')}
            </div>
            <button
              type="button"
              onClick={() => handleResetFilters(filter)}
              className="ml-2 flex-shrink-0"
            >
              <X size={12} className="text-inherit" />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ActiveFiltersList;
