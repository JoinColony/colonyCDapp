import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import clsx from 'clsx';
import { useMobile } from '~hooks';

import styles from './FilterButton.module.css';
import Icon from '~shared/Icon';
import { FilterButtonProps } from './types';

const displayName = 'v5.shared.Filter.FilterButton';

const FilterButton: FC<FilterButtonProps> = ({ isOpen, ref, onClick }) => {
  const isMobile = useMobile();
  const { formatMessage } = useIntl();

  return (
    <>
      {isMobile ? (
        <button
          type="button"
          aria-label={formatMessage({ id: 'filter.button' })}
          className={clsx(styles.filterButton, {
            'border-blue-400 text-blue-400': isOpen,
            'border-gray-300 text-gray-700': !isOpen,
          })}
          ref={ref}
          onClick={onClick}
        >
          <Icon name="magnifying-glass" appearance={{ size: 'tiny' }} />
        </button>
      ) : (
        <button
          type="button"
          aria-label={formatMessage({ id: 'filter.button' })}
          className={`${styles.filterButton} ${
            isOpen && 'border border-blue-400 text-blue-400'
          }`}
          ref={ref}
          onClick={onClick}
        >
          <Icon name="funnel-simple" appearance={{ size: 'tiny' }} />
          {formatMessage({ id: 'filter' })}
        </button>
      )}
    </>
  );
};

FilterButton.displayName = displayName;

export default FilterButton;
