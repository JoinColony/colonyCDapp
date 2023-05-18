import React, { FC } from 'react';
import AccordionItem from './partials/AccordionItem';
import { AccordionProps } from './types';

const displayName = 'Extensions.Accordion';

const Accordion: FC<AccordionProps> = ({ items, openIndex, onOpenIndexChange }) => {
  const onClick = (index: number) => {
    if (!onOpenIndexChange) return;

    if (index === openIndex) {
      onOpenIndexChange(undefined);

      return;
    }

    onOpenIndexChange(index);
  };

  return (
    <div className="bg-base-white">
      {items.map((item, index) => (
        <AccordionItem {...item} key={item.id} isOpen={openIndex === index} onClick={() => onClick(index)} />
      ))}
    </div>
  );
};

Accordion.displayName = displayName;

export default Accordion;
