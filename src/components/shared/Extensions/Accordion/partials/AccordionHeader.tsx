import clsx from 'clsx';
import React, { FC } from 'react';

import Icon from '~shared/Icon/index.ts';
import { formatText } from '~utils/intl.ts';

import { AccordionHeaderProps } from '../types.ts';

const displayName = 'Extensions.Accordion.partials.AccordionHeader';

const AccordionHeader: FC<AccordionHeaderProps> = ({
  title,
  isOpen,
  onClick,
  onKeyUp,
}) => {
  const titleText = title ? formatText(title) : null;

  return (
    <button
      onClick={onClick}
      onKeyUp={onKeyUp}
      type="button"
      className="flex justify-between items-center py-2 w-full group border-b border-gray-200 text-1"
      aria-expanded={isOpen}
    >
      {titleText}
      <span
        className={clsx(
          'flex shrink-0 text-gray-400 transition-all duration-normal group-hover:text-blue-400',
          {
            'rotate-180': isOpen,
          },
        )}
      >
        <Icon appearance={{ size: 'extraExtraTiny' }} name="caret-up" />
      </span>
    </button>
  );
};

AccordionHeader.displayName = displayName;

export default AccordionHeader;
