import React, { FC, PropsWithChildren } from 'react';

import { useIntl } from 'react-intl';
import { TableFilteringProps } from './types';
import Icon from '~shared/Icon/Icon';

const displayName = 'common.Extensions.TableFiltering';

const TableFiltering: FC<PropsWithChildren<TableFilteringProps>> = ({
  filterType,
  filterOptions,
  className,
  onClick,
}) => {
  const { formatMessage } = useIntl();

  return (
    <div
      className={`${className} bg-blue-100 py-2 px-3 rounded-lg flex items-center gap-1`}
    >
      <div className="text-blue-400 font-semibold text-xs capitalize">
        {filterType}:
      </div>
      {Array.isArray(filterOptions) ? (
        filterOptions.map((name) => (
          <p className="text-blue-400 text-4 capitalize">{name}</p>
        ))
      ) : (
        <p className="text-blue-400 text-4 capitalize">{filterOptions}</p>
      )}
      <button
        type="button"
        aria-label={formatMessage({ id: 'handle.close.filter' })}
        onClick={onClick}
        className="ml-auto text-blue-400"
      >
        <Icon name="x" appearance={{ size: 'extraTiny' }} />
      </button>
    </div>
  );
};

TableFiltering.displayName = displayName;

export default TableFiltering;
