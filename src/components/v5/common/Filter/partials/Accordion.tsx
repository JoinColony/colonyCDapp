import React, { FC } from 'react';

import { AccordionProps } from '../types';

import AccordionItem from './AccordionItem';

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
