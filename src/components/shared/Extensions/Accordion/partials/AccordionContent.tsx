import React, { FC } from 'react';
import { AccordionItemProps } from '../types';
import AccordionContentItem from './AccordionContentItem';

const displayName = 'Extensions.Accordion.partials.AccordionContent';

const AccordionContent: FC<AccordionItemProps> = ({ content }) => (
  <div className="relative">
    {content?.map((item) => (
      <div key={item.id}>
        <div className="flex justify-between mt-4 items-center">
          {item.textItem && item.textItem}
          <div className="ml-6">{item.inputItem && item.inputItem}</div>
        </div>

        {item?.accordionItem &&
          item?.accordionItem.map((accordionItem) => (
            <AccordionContentItem key={accordionItem.id} accordionItem={accordionItem} />
          ))}
      </div>
    ))}
  </div>
);

AccordionContent.displayName = displayName;

export default AccordionContent;
