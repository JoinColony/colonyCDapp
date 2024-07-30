import { CaretUp } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC } from 'react';
import { useIntl } from 'react-intl';

import { type AccordionHeaderProps } from '~shared/Extensions/Accordion/types.ts';

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
      className="group flex w-full items-center justify-between text-3"
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
        <CaretUp size={10} />
      </span>
    </button>
  );
};

AccordionNestedHeader.displayName = displayName;

export default AccordionNestedHeader;
