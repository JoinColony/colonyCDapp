import React, { FC } from 'react';
import { AccordionItemProps } from '../Accordion.types';

const displayName = 'Extensions.Accordion.Partials.AccordionHeader';

const AccordionHeader: FC<AccordionItemProps> = ({ title }) => {
  /*
   * @TODO: add arrow icon
   */
  return (
    <div>
      <div className="flex justify-between items-center pb-2 pt-4">
        {title}
        <span>*</span>
      </div>
      <div className="w-full bg-gray-200 h-[1px]" />
    </div>
  );
};

AccordionHeader.displayName = displayName;

export default AccordionHeader;
