import React, { FC } from 'react';
import { AccordionItemProps } from '../types';
import Icon from '~shared/Icon';

const displayName = 'Extensions.Accordion.partials.AccordionHeader';

const AccordionHeader: FC<AccordionItemProps> = ({ title, isOpen }) => (
  <div>
    <div className="flex justify-between items-center pb-2 pt-4">
      {title}
      <Icon
        appearance={{ size: 'extraTiny' }}
        name={isOpen ? 'caret-up' : 'caret-down'}
        title={{ id: 'file-text' }}
        className="text-gray-400 min-w-[0.875rem] min-h-[0.875rem]"
      />
    </div>
    <div className="w-full bg-gray-200 h-[1px]" />
  </div>
);

AccordionHeader.displayName = displayName;

export default AccordionHeader;
