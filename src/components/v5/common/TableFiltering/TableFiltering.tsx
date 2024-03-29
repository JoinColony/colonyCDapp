import React, { type FC, type PropsWithChildren } from 'react';
import { useIntl } from 'react-intl';

import { useFilterContext } from '~context/FilterContext/FilterContext.ts';
import { formatText } from '~utils/intl.ts';
import { CloseButton } from '~v5/shared/Button/index.ts';

import { type FilterType, type TableFilteringProps } from './types.ts';

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
              className={`${className} inline-flex items-center gap-1 rounded-lg bg-blue-100 px-3 py-2 text-blue-400`}
            >
              <div className="container text-sm font-semibold capitalize">
                {parentFilterLabel}:
              </div>
              {nestedFilters.map((label) => (
                <p
                  key={formatText(label)}
                  className="min-w-fit text-sm capitalize"
                >
                  {formatText(label)}
                  {lastLabel !== label ? ',' : ''}
                </p>
              ))}
              <CloseButton
                aria-label={formatMessage({ id: 'ariaLabel.closeFilter' })}
                className="ml-2 shrink-0 !p-0 text-current"
                onClick={(e) => handleClick(e, parentFilterLabel)}
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
