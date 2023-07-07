import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import clsx from 'clsx';

import styles from './FilterButton.module.css';
import Icon from '~shared/Icon';
import { FilterButtonProps } from './types';

const displayName = 'v5.shared.Filter.FilterButton';

const FilterButton: FC<FilterButtonProps> = ({
  isOpen,
  selectedFilterNumber,
  setTriggerRef,
  onClick,
}) => {
  const { formatMessage } = useIntl();

  return (
    <button
      type="button"
      aria-label={formatMessage({ id: 'filter.button' })}
      className={clsx(styles.filterButton, {
        'border border-blue-400 text-blue-400': isOpen,
      })}
      ref={setTriggerRef}
      onClick={onClick}
    >
      <Icon name="funnel-simple" appearance={{ size: 'tiny' }} />
      {formatMessage({ id: 'filter' })}

      {!!selectedFilterNumber && (
        <span className="bg-blue-100 p-1 rounded-sm text-blue-400 text-5 h-3 flex items-center">
          {selectedFilterNumber}
        </span>
      )}
    </button>
  );
};

FilterButton.displayName = displayName;

export default FilterButton;
