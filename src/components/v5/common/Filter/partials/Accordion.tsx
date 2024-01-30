import React, { type FC } from 'react';

import { type AccordionProps } from '../types.ts';

import AccordionItem from './AccordionItem.tsx';

const displayName = 'v5.common.Filter.partials.Accordion';

const Accordion: FC<AccordionProps> = ({ items }) => {
  return (
    <div>
      <ul className="flex flex-col gap-4">
        {items.map(({ id, title, filterType, content }) => (
          <AccordionItem
            key={id}
            title={title}
            option={filterType}
            nestedFilters={content}
          />
        ))}
      </ul>
    </div>
  );
};

Accordion.displayName = displayName;

export default Accordion;
