import React, { FC, PropsWithChildren } from 'react';
import { useIntl } from 'react-intl';

import { FilterType, TableFilteringProps } from './types';
import { CloseButton } from '~v5/shared/Button';
import { formatText } from '~utils/intl';
import styles from './TableFiltering.module.css';
import { useFilterContext } from '~context/FilterContext';

const displayName = 'v5.common.TableFiltering';

const TableFiltering: FC<PropsWithChildren<TableFilteringProps>> = ({
  onClick,
  className,
}) => {
  const { formatMessage } = useIntl();
  const { getSelectedFilterLabels, handleClearFilters } = useFilterContext();

  const selectedFilterLabels = getSelectedFilterLabels();

  if (!selectedFilterLabels.length) {
    return null;
  }

  const handleClick = (
    e: React.SyntheticEvent<HTMLButtonElement>,
    parentFilterLabel: FilterType,
  ) => {
    onClick?.(e);
    handleClearFilters([parentFilterLabel]);
  };

  return (
    <>
      {selectedFilterLabels.reduce<JSX.Element[]>((acc, selectedFilter) => {
        const parentFilterLabel = Object.keys(selectedFilter)[0] as FilterType;
        const nestedFilters = selectedFilter[parentFilterLabel];
        const lastLabel = nestedFilters.at(-1);

        if (nestedFilters.length) {
          acc.push(
            <div
              key={parentFilterLabel}
              className={`${className} ${styles.pill}`}
            >
              <div className={styles.pillName}>{parentFilterLabel}:</div>
              {nestedFilters.map((label) => (
                <p
                  key={formatText(label)}
                  className="text-sm capitalize min-w-fit"
                >
                  {formatText(label)}
                  {lastLabel !== label ? ',' : ''}
                </p>
              ))}
              <CloseButton
                aria-label={formatMessage({ id: 'ariaLabel.closeFilter' })}
                className="shrink-0 ml-2 text-current !p-0"
                onClick={(e) => handleClick(e, parentFilterLabel)}
                iconSize="extraTiny"
              />
            </div>,
          );
        }
        return acc;
      }, [])}
    </>
  );
};

TableFiltering.displayName = displayName;

export default TableFiltering;
