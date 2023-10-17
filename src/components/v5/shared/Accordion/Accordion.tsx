import clsx from 'clsx';
import React, { FC } from 'react';
import AccordionItem from './partials/AccordionItem';
import { AccordionProps } from './types';

const displayName = 'v5.Accordion';

const Accordion: FC<AccordionProps> = ({
  items,
  openedItemIndex = -1,
  className,
  itemClassName,
}) =>
  items.length ? (
    <ul className={clsx(className, 'w-full')}>
      {items.map(({ key, content, ...item }, index) => (
        <li key={key}>
          <AccordionItem
            {...item}
            className={itemClassName}
            isOpen={index === openedItemIndex}
          >
            {content}
          </AccordionItem>
        </li>
      ))}
    </ul>
  ) : null;

Accordion.displayName = displayName;

export default Accordion;
