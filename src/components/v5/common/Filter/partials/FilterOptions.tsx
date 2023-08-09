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
  onMobileSelectParentFilter,
  selectedChildOption,
  checkedItems,
}) => {
  const isMobile = useMobile();

  return (
    <div>
      <Header title={{ id: 'filters' }} />
      {isMobile ? (
        <Accordion
          items={options}
          onMobileSelectParentFilter={onMobileSelectParentFilter}
          onSelectNestedOption={onSelectNestedOption}
          selectedChildOption={selectedChildOption}
          checkedItems={checkedItems}
        />
      ) : (
        <ul className="flex flex-col">
          {options?.map(({ id, iconName, title, option, content }) => (
            <SubNavigationItem
              key={id}
              iconName={iconName}
              title={title}
              option={option}
              options={options}
              nestedFilters={content}
              onSelectNestedOption={onSelectNestedOption}
              selectedChildOption={selectedChildOption}
              checkedItems={checkedItems}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

FilterOptions.displayName = displayName;

export default FilterOptions;
