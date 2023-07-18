import React, { FC } from 'react';
import clsx from 'clsx';
import { useIntl } from 'react-intl';

import { AccordionItemProps } from '../types';
import Icon from '~shared/Icon';

const displayName = 'Extensions.Accordion.partials.AccordionHeader';

const AccordionHeader: FC<AccordionItemProps> = ({ title, isOpen }) => {
  const { formatMessage } = useIntl();
  const text =
    typeof title === 'string' ? title : title && formatMessage(title);

  return (
    <>
      <div className="flex justify-between items-center pb-2 pt-4 w-full text-gray-700">
        {text}
        <span
          className={clsx({
            'rotate-180': isOpen,
          })}
        >
          <Icon
            appearance={{ size: 'extraTiny' }}
            name="caret-down"
            title={{ id: 'file-text' }}
          />
        </span>
      </div>
      <div className="w-full bg-gray-200 h-px" />
    </>
  );
};

AccordionHeader.displayName = displayName;

export default AccordionHeader;
