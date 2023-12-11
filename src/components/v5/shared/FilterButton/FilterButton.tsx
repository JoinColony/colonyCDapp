import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import clsx from 'clsx';

import { FilterButtonProps } from './types';
import Button from '../Button';

const displayName = 'v5.Filter.FilterButton';

const FilterButton: FC<FilterButtonProps> = ({
  isOpen,
  numberSelectedFilters,
  setTriggerRef,
  onClick,
  customLabel,
  className,
}) => {
  const { formatMessage } = useIntl();

  return (
    <Button
      type="button"
      aria-label={formatMessage({ id: 'ariaLabel.filter' })}
      ref={setTriggerRef}
      onClick={onClick}
      className={clsx(className, 'shrink-0', {
        'border border-gray-900 text-gray-900': isOpen,
      })}
      mode="tertiary"
      iconName="funnel-simple"
      iconSize="tiny"
      size="small"
    >
      {customLabel || formatMessage({ id: 'filter' })}
      {!!numberSelectedFilters && (
        <span className="ml-1 bg-blue-100 font-bold rounded-sm text-blue-400 text-[.5rem] leading-[1em] py-0.5 h-3 px-1 min-w-[.75rem] inline-flex items-center">
          {numberSelectedFilters}
        </span>
      )}
    </Button>
  );
};

FilterButton.displayName = displayName;

export default FilterButton;
