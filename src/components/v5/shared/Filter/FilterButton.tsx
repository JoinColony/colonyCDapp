import { FunnelSimple } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC } from 'react';
import { useIntl } from 'react-intl';

import Button from '../Button/index.ts';

import { type FilterButtonProps } from './types.ts';

const displayName = 'v5.Filter.FilterButton';

const FilterButton: FC<FilterButtonProps> = ({
  isOpen,
  numberSelectedFilters,
  setTriggerRef,
  onClick,
  customLabel,
  className,
  size = 'small',
}) => {
  const { formatMessage } = useIntl();

  return (
    <Button
      type="button"
      aria-label={formatMessage({ id: 'ariaLabel.filter' })}
      ref={setTriggerRef}
      onClick={onClick}
      className={clsx(className, 'flex-shrink-0', {
        'border border-gray-900 text-gray-900': isOpen,
      })}
      mode="tertiary"
      size={size}
    >
      <FunnelSimple size={18} className="flex-shrink-0 mr-2" />
      {customLabel || formatMessage({ id: 'filter' })}
      {!!numberSelectedFilters && (
        <span className="bg-blue-100 py-0.5 px-1 min-w-[.75rem] rounded-sm text-blue-400 h-[.8125rem] inline-flex items-center ml-2 text-[.5rem] leading-none font-bold">
          {numberSelectedFilters}
        </span>
      )}
    </Button>
  );
};

FilterButton.displayName = displayName;

export default FilterButton;
