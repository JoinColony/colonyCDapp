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
}) => {
  const { formatMessage } = useIntl();

  return (
    <Button
      type="button"
      aria-label={formatMessage({ id: 'ariaLabel.filter' })}
      ref={setTriggerRef}
      onClick={onClick}
      className={clsx({
        'border border-gray-900 text-gray-900': isOpen,
      })}
      mode="tertiary"
      iconName="funnel-simple"
      iconSize="tiny"
      size="small"
    >
      {customLabel || formatMessage({ id: 'filter' })}
      {!!numberSelectedFilters && (
        <span className="bg-blue-100 p-1 rounded-sm text-gray-900 text-6 h-3 flex items-center">
          {numberSelectedFilters}
        </span>
      )}
    </Button>
  );
};

FilterButton.displayName = displayName;

export default FilterButton;
