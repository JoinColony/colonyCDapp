import React, { type FC } from 'react';

import { type ColonyAction } from '~types/graphql.ts';
import { formatText } from '~utils/intl.ts';
import Table from '~v5/common/Table/index.ts';
import TableHeader from '~v5/common/TableHeader/TableHeader.tsx';

import { useActionsTableProps } from './hooks/useActionsTableProps.tsx';
import { useHandleRedoAction } from './hooks/useHandleRedoAction.ts';
import ActionsTableFilters from './partials/ActionsTableFilters/index.ts';
import { type ColonyActionsTableProps } from './types.ts';

const displayName = 'common.ColonyActionsTable';

const ColonyActionsTable: FC<ColonyActionsTableProps> = ({
  withHeader = true,
  actionProps,
  ...rest
}) => {
  const { tableProps, renderSubComponent } = useActionsTableProps(
    rest,
    actionProps.setSelectedAction,
  );

  useHandleRedoAction({ actionProps });

  return (
    <>
      {withHeader && (
        <TableHeader
          title={formatText({ id: 'activityFeedTable.table.title' })}
        >
          <ActionsTableFilters />
        </TableHeader>
      )}
      <Table<ColonyAction>
        {...tableProps}
        renderSubComponent={renderSubComponent}
      />
    </>
  );
};

ColonyActionsTable.displayName = displayName;

export default ColonyActionsTable;
