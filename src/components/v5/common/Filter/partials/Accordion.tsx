import React, { FC } from 'react';

import AccordionItem from './AccordionItem';
import { AccordionProps } from '../types';

const displayName = 'v5.common.Filter.partials.Accordion';

const Accordion: FC<AccordionProps> = ({
  items,
  onSelectParentFilter,
  onSelectNestedOption,
  selectedChildOption,
}) => (
  <div>
    <ul className="flex flex-col gap-4">
      {items.map((item) => (
        <AccordionItem
          key={item.id}
          item={item}
          onSelectParentFilter={onSelectParentFilter}
          onSelectNestedOption={onSelectNestedOption}
          selectedChildOption={selectedChildOption}
        />
      ))}
    </ul>
  </div>
);

Accordion.displayName = displayName;

export default Accordion;
