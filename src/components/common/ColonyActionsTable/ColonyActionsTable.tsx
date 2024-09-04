import React, { type FC, useEffect } from 'react';

import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';
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
  actionProps,
  ...rest
}) => {
  const { tableProps, renderSubComponent } = useActionsTableProps(
    rest,
    actionProps.setSelectedAction,
  );
  const {
    actionSidebarToggle: [, { toggleOn: toggleActionSidebarOn }],
  } = useActionSidebarContext();

  useEffect(() => {
    if (actionProps.defaultValues && actionProps.selectedAction) {
      toggleActionSidebarOn({ ...actionProps.defaultValues });

      setTimeout(() => {
        actionProps.setSelectedAction(undefined);
      }, 50);
    }
  }, [
    actionProps.defaultValues,
    toggleActionSidebarOn,
    actionProps.selectedAction,
    actionProps,
  ]);

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
