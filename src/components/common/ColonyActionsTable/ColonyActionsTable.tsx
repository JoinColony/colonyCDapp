import React, { type FC } from 'react';

import { type ActionData } from '~actions/index.ts';
import { formatText } from '~utils/intl.ts';
import Table from '~v5/common/Table/index.ts';
import TableHeader from '~v5/common/TableHeader/TableHeader.tsx';

import { useActionsTableProps } from './hooks/useActionsTableProps.tsx';
import ActionsTableFilters from './partials/ActionsTableFilters/index.ts';
import { type ColonyActionsTableProps } from './types.ts';

const displayName = 'common.ColonyActionsTable';

const ColonyActionsTable: FC<ColonyActionsTableProps> = ({
  withHeader = true,
  ...rest
}) => {
  const { tableProps, renderSubComponent } = useActionsTableProps(rest);

  return (
    <>
      {withHeader && (
        <TableHeader
          title={formatText({ id: 'activityFeedTable.table.title' })}
        >
          <ActionsTableFilters />
        </TableHeader>
      )}
      <Table<ActionData>
        {...tableProps}
        renderSubComponent={renderSubComponent}
      />
    </>
  );
};

ColonyActionsTable.displayName = displayName;

export default ColonyActionsTable;
