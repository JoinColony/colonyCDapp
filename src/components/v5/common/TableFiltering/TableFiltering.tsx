import React, { FC, PropsWithChildren } from 'react';
import { useIntl } from 'react-intl';

import { TableFilteringProps } from './types';
import { CloseButton } from '~v5/shared/Button';

const displayName = 'v5.common.TableFiltering';

const TableFiltering: FC<PropsWithChildren<TableFilteringProps>> = ({
  filterType,
  filterOptions,
  className,
  onClick,
}) => {
  const { formatMessage } = useIntl();

  const lastIndex = filterOptions[filterOptions.length - 1];

  return (
    <div
      className={`${className} bg-blue-100 py-2 px-3 rounded-lg inline-flex items-center gap-1 text-blue-400`}
    >
      <div className="text-5 capitalize container">{filterType}:</div>
      {Array.isArray(filterOptions) ? (
        filterOptions.map((name) => (
          <p key={name} className="element text-4 capitalize">
            {name}
            {lastIndex !== name ? ',' : ''}
          </p>
        ))
      ) : (
        <p className="text-4 capitalize">{filterOptions}</p>
      )}
      <CloseButton
        aria-label={formatMessage({ id: 'ariaLabel.closeFilter' })}
        className="shrink-0 ml-2 text-current !p-0"
        onClick={onClick}
        iconSize="extraTiny"
      />
    </div>
  );
};

TableFiltering.displayName = displayName;

export default TableFiltering;
