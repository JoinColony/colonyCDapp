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
      className={clsx(className, 'flex-shrink-0 text-gray-900', {
        'border border-gray-900 text-gray-900': isOpen,
      })}
      mode="tertiary"
      size={size}
    >
      <FunnelSimple size={18} className="flex-shrink-0" />
      {customLabel || formatMessage({ id: 'filter' })}
      {!!numberSelectedFilters && (
        <span className="inline-flex h-[.8125rem] min-w-[.75rem] items-center rounded-sm bg-blue-100 px-1 py-0.5 text-[.5rem] font-bold leading-none text-blue-400">
          {numberSelectedFilters}
        </span>
      )}
    </Button>
  );
};

FilterButton.displayName = displayName;

export default FilterButton;
