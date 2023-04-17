import React, { FC, useState } from 'react';
import { AccordionMocksContentProps } from '../Accordion.types';
import AccordionContentItem from './AccordionContentItem';

const displayName = 'Extensions.Accordion.Partials.AccordionContent';

const AccordionContent: FC<AccordionMocksContentProps> = ({ content }) => {
  const [openIndex, setOpenIndex] = useState<number | undefined>();

  const onOpenIndexChange = (index: number | undefined) => {
    setOpenIndex(index);
  };

  return (
    <div className="relative">
      {content.map((item, index) => (
        <div key={item.id}>
          <div className="flex justify-between mt-4">
            {item.textItem && item.textItem}
            {item.inputItem && item.inputItem}
          </div>

          {item?.accordionItem &&
            item?.accordionItem.map((accordionItem) => (
              <AccordionContentItem
                key={accordionItem.id}
                accordionItem={accordionItem}
                isOpen={openIndex === index}
                onClick={() => onOpenIndexChange(index)}
              />
            ))}
        </div>
      ))}
    </div>
  );
};

AccordionContent.displayName = displayName;

export default AccordionContent;
