import React, { type FC } from 'react';

import { type ActivityFeedColonyAction } from '~hooks/useActivityFeed/types.ts';
import { type ColonyAction } from '~types/graphql.ts';
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
      <Table<ColonyAction & ActivityFeedColonyAction>
        {...tableProps}
        renderSubComponent={renderSubComponent}
      />
    </>
  );
};

ColonyActionsTable.displayName = displayName;

export default ColonyActionsTable;
