import React, { FC } from 'react';

import AccordionItem from './AccordionItem';
import { AccordionProps } from '../types';

const displayName = 'v5.common.Filter.partials.Accordion';

const Accordion: FC<AccordionProps> = ({
  items,
  onSelectParentFilter,
  onSelectNestedOption,
  selectedChildOption,
  checkedItems,
}) => (
  <div>
    <ul className="flex flex-col gap-4">
      {items.map(({ id, title, option, content }) => (
        <AccordionItem
          key={id}
          title={title}
          option={option}
          onSelectParentFilter={onSelectParentFilter}
          onSelectNestedOption={onSelectNestedOption}
          selectedChildOption={selectedChildOption}
          checkedItems={checkedItems}
          nestedFilters={content}
        />
      ))}
    </ul>
  </div>
);

Accordion.displayName = displayName;

export default Accordion;
