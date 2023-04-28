import React, { FC, useState } from 'react';
import { AccordionItemProps, AccordionMocksItemProps } from '../types';
import AccordionContentItem from './AccordionContentItem';

const displayName = 'Extensions.Accordion.partials.AccordionContent';

const AccordionContent: FC<AccordionItemProps> = ({ content }) => {
  const [openIndex, setOpenIndex] = useState<string | undefined>();

  const onOpenIndexChange = (accordionItem: AccordionMocksItemProps) => {
    if (accordionItem.id === openIndex) {
      setOpenIndex(undefined);

      return;
    }
    setOpenIndex(accordionItem.id);
  };

  return (
    <div className="relative">
      {content?.map((item) => (
        <div key={item.id}>
          <div className="flex justify-between mt-4 items-center">
            {item.textItem && item.textItem}
            <div className="ml-6">{item.inputItem && item.inputItem}</div>
          </div>

          {item?.accordionItem &&
            item?.accordionItem.map((accordionItem) => (
              <AccordionContentItem
                key={accordionItem.id}
                accordionItem={accordionItem}
                isOpen={openIndex === accordionItem.id}
                onClick={() => onOpenIndexChange(accordionItem)}
              />
            ))}
        </div>
      ))}
    </div>
  );
};

AccordionContent.displayName = displayName;

export default AccordionContent;
