import clsx from 'clsx';
import React, { type FC, useState } from 'react';

import AccordionItem from './partials/AccordionItem/index.ts';
import { type AccordionProps } from './types.ts';

const displayName = 'v5.Accordion';

const Accordion: FC<AccordionProps> = ({
  items,
  openedItemIndexes = [],
  className,
  itemClassName,
}) => {
  const [openItemsIndexes, setOpenItemsIndexes] =
    useState<number[]>(openedItemIndexes);

  return items.length ? (
    <ul className={clsx(className, 'w-full')}>
      {items.map(({ key, content, ...item }, index) => (
        <li key={key}>
          <AccordionItem
            {...item}
            className={itemClassName}
            isOpen={openItemsIndexes.includes(index)}
            onToggle={() => {
              if (openItemsIndexes.includes(index)) {
                setOpenItemsIndexes(
                  openItemsIndexes.filter((i) => i !== index),
                );
              } else {
                setOpenItemsIndexes([...openItemsIndexes, index]);
              }
            }}
          >
            {content}
          </AccordionItem>
        </li>
      ))}
    </ul>
  ) : null;
};

Accordion.displayName = displayName;

export default Accordion;
