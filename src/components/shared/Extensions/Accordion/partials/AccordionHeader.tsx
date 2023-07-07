import React, { FC } from 'react';
import clsx from 'clsx';
import { useIntl } from 'react-intl';

import { AccordionItemProps } from '../types';
import Icon from '~shared/Icon';

const displayName = 'Extensions.Accordion.partials.AccordionHeader';

const AccordionHeader: FC<AccordionItemProps> = ({
  title = '',
  isOpen,
  mode = 'primary',
}) => {
  const { formatMessage } = useIntl();
  const text = typeof title === 'string' ? formatMessage({ id: title }) : title;

  return (
    <>
      <div
        className={clsx('flex justify-between items-center pb-2 pt-4 w-full', {
          'text-gray-700': mode === 'primary',
          'text-gray-400': mode === 'secondary',
        })}
      >
        {text}
        <span
          className={clsx({
            'rotate-180': isOpen,
            'text-gray-700': mode === 'secondary',
          })}
        >
          <Icon
            appearance={{ size: 'extraTiny' }}
            name="caret-down"
            title={{ id: 'file-text' }}
          />
        </span>
      </div>
      {mode === 'primary' && <div className="w-full bg-gray-200 h-1" />}
    </>
  );
};

AccordionHeader.displayName = displayName;

export default AccordionHeader;
