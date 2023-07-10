import React, { FC } from 'react';
import { useMobile } from '~hooks';

import Accordion from '~shared/Extensions/Accordion';
import { useAccordion } from '~shared/Extensions/Accordion/hooks';
import { FilterOptionsProps } from '../types';
import SubNavigationItem from '~v5/shared/SubNavigationItem';
import Header from '~v5/shared/SubNavigationItem/partials/Header';

const displayName = 'v5.common.Filter.partials.FilterOptions';

const FilterOptions: FC<FilterOptionsProps> = ({ options }) => {
  const isMobile = useMobile();
  const { openIndex, onOpenIndexChange } = useAccordion();
  // @TODO: add conditions when filters should be visible / not visible

  const handleClick = () => {
    // @TODO: id of selected parent filter element
  };

  const onSelectNestedOption = () => {
    // @TODO: id of selected child filter option
  };

  return (
    <div>
      <Header title={{ id: 'filters' }} />
      {isMobile ? (
        <Accordion
          items={options}
          openIndex={openIndex}
          onOpenIndexChange={onOpenIndexChange}
          mode="secondary"
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
              handleClick={handleClick}
              shouldBeActionOnHover={false}
              onSelectNestedOption={onSelectNestedOption}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

FilterOptions.displayName = displayName;

export default FilterOptions;
