import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import clsx from 'clsx';

import Icon from '~shared/Icon';
import { FilterButtonProps } from './types';

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
    <button
      type="button"
      aria-label={formatMessage({ id: 'ariaLabel.filter' })}
      className={clsx(
        'text-3 flex items-center gap-2 px-3 py-2 rounded-lg border sm:hover:border-gray-900 sm:hover:text-gray-900 transition-all duration-normal',
        {
          'border border-gray-900 text-gray-900': isOpen,
        },
      )}
      ref={setTriggerRef}
      onClick={onClick}
    >
      <Icon name="funnel-simple" appearance={{ size: 'tiny' }} />
      {customLabel || formatMessage({ id: 'filter' })}

      {!!numberSelectedFilters && (
        <span className="bg-blue-100 p-1 rounded-sm text-gray-900 text-6 h-3 flex items-center">
          {numberSelectedFilters}
        </span>
      )}
    </button>
  );
};

FilterButton.displayName = displayName;

export default FilterButton;
