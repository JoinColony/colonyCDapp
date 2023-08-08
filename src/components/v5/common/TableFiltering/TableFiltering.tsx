import React, { FC, PropsWithChildren } from 'react';
import { useIntl } from 'react-intl';

import { TableFilteringProps } from './types';
import { CloseButton } from '~v5/shared/Button';
import styles from './TableFiltering.module.css';

const displayName = 'v5.common.TableFiltering';

const TableFiltering: FC<PropsWithChildren<TableFilteringProps>> = ({
  selectedParentFilters,
  filterOptions,
  className,
  onClick,
}) => {
  const { formatMessage } = useIntl();

  const lastIndex = filterOptions?.[filterOptions.length - 1];

  const content = (
    <>
      {Array.isArray(filterOptions) ? (
        filterOptions.map((name) => (
          <p key={name} className="text-sm capitalize min-w-fit">
            {formatMessage({ id: `filter.pill.${name}` })}
            {lastIndex !== name ? ',' : ''}
          </p>
        ))
      ) : (
        <p className="text-sm capitalize">{filterOptions}</p>
      )}
      <CloseButton
        aria-label={formatMessage({ id: 'ariaLabel.closeFilter' })}
        className="shrink-0 ml-2 text-current !p-0"
        onClick={onClick}
        iconSize="extraTiny"
      />
    </>
  );

  return (
    <>
      {Array.isArray(selectedParentFilters) ? (
        selectedParentFilters.map((name) => (
          <div key={name} className={`${className} ${styles.pill}`}>
            <div className={styles.pillName}>{name}:</div>
            {content}
          </div>
        ))
      ) : (
        <div className={`${className} ${styles.pill}`}>
          <div className={styles.pillName}>{selectedParentFilters}:</div>
          {content}
        </div>
      )}
    </>
  );
};

TableFiltering.displayName = displayName;

export default TableFiltering;
