import React, { FC } from 'react';
import { useMobile } from '~hooks';

import { FilterOptionsProps } from '../types';
import SubNavigationItem from '~v5/shared/SubNavigationItem';
import Header from '~v5/shared/SubNavigationItem/partials/Header';
import Accordion from './Accordion';

const displayName = 'v5.common.Filter.partials.FilterOptions';

const FilterOptions: FC<FilterOptionsProps> = ({
  options,
  onSelectNestedOption,
  onSelectParentFilter,
  selectedChildOption,
}) => {
  const isMobile = useMobile();

  return (
    <div>
      <Header title={{ id: 'filters' }} />
      {isMobile ? (
        <Accordion
          items={options}
          onSelectParentFilter={onSelectParentFilter}
          onSelectNestedOption={onSelectNestedOption}
          selectedChildOption={selectedChildOption}
        />
      ) : (
        <ul className="flex flex-col">
          {options?.map(({ id, iconName, title, option }) => (
            <SubNavigationItem
              key={id}
              iconName={iconName}
              title={title}
              option={option}
              options={options}
              onSelectParentFilter={onSelectParentFilter}
              onSelectNestedOption={onSelectNestedOption}
              shouldBeActionOnHover={false}
              selectedChildOption={selectedChildOption}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

FilterOptions.displayName = displayName;

export default FilterOptions;
