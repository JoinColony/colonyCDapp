import clsx from 'clsx';
import React, { FC } from 'react';
import { useIntl } from 'react-intl';

import Icon from '~shared/Icon/index.ts';

import { AccordionHeaderProps } from '../../types.ts';

const displayName =
  'Extensions.Accordion.partials.AccordionNested.AccordionNestedHeader';

const AccordionNestedHeader: FC<AccordionHeaderProps> = ({
  title,
  isOpen,
  onClick,
  onKeyUp,
}) => {
  const { formatMessage } = useIntl();

  const titleText =
    typeof title === 'string' ? title : title && formatMessage(title);

  return (
    <button
      onClick={onClick}
      onKeyUp={onKeyUp}
      type="button"
      className="flex justify-between items-center w-full group text-3"
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

AccordionNestedHeader.displayName = displayName;

export default AccordionNestedHeader;
