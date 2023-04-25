import React, { FC } from 'react';
import { AccordionItemProps } from '../types';

const displayName = 'Extensions.Accordion.partials.AccordionHeader';
// @TODO: add icon
const AccordionHeader: FC<AccordionItemProps> = ({ title }) => (
  <div>
    <div className="flex justify-between items-center pb-2 pt-4">
      {title}
      <span>*</span>
    </div>
    <div className="w-full bg-gray-200 h-[1px]" />
  </div>
);

AccordionHeader.displayName = displayName;

export default AccordionHeader;
