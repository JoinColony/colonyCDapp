import React, { FC } from 'react';

import { useIntl } from 'react-intl';
import { useMobile } from '~hooks';
import styles from './FilterButton.module.css';

import Icon from '~shared/Icon';

const displayName = 'v5.shared.Filter.FilterButton';

const FilterButton: FC = () => {
  const isMobile = useMobile();
  const { formatMessage } = useIntl();

  return (
    <>
      {isMobile ? (
        <button
          type="button"
          aria-label={formatMessage({ id: 'filter.button' })}
          className={styles.filterButton}
        >
          <Icon name="magnifying-glass" appearance={{ size: 'tiny' }} />
        </button>
      ) : (
        <button
          type="button"
          aria-label={formatMessage({ id: 'filter.button' })}
          className={styles.filterButton}
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
