import React, { type FC } from 'react';

import AccordionItem from './partials/AccordionItem.tsx';
import { type AccordionProps } from './types.ts';

const displayName = 'Extensions.Accordion';

const Accordion: FC<AccordionProps> = ({
  items,
  openIndex,
  onOpenIndexChange,
  onInputChange,
}) => {
  const onClick = (index: number) => {
    if (!onOpenIndexChange) return;

    if (index === openIndex) {
      onOpenIndexChange(undefined);

      return;
    }

    onOpenIndexChange(index);
  };

  return (
    <div>
      {items?.map((item, index) => (
        <AccordionItem
          {...item}
          key={item.id}
          isOpen={openIndex === index}
          onClick={() => onClick(index)}
          onInputChange={onInputChange}
        />
      ))}
    </div>
  );
};

Accordion.displayName = displayName;

export default Accordion;
