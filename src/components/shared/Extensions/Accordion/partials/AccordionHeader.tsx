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
      <button
        type="button"
        className="flex justify-between items-center py-2 w-full group"
        aria-label={formatMessage({
          id: isOpen ? 'ariaLabel.closeAccordion' : 'ariaLabel.openAccordion',
        })}
      >
        {text}
        <span
          className={clsx(
            'flex shrink-0 text-gray-400 transition-all duration-normal group-hover:text-blue-400',
            {
              'rotate-180': isOpen,
            },
          )}
        >
          <Icon appearance={{ size: 'extraTiny' }} name="caret-down" />
        </span>
      </button>
      <div className="w-full bg-gray-200 h-px" />
    </>
  );
};

AccordionHeader.displayName = displayName;

export default AccordionHeader;
