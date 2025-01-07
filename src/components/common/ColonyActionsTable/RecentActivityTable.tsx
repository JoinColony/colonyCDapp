import React, { type FC } from 'react';

import useActionsCount from '~hooks/useActionsCount.ts';
import useGetSelectedDomainFilter from '~hooks/useGetSelectedDomainFilter.tsx';
import { type ColonyAction } from '~types/graphql.ts';
import { Table } from '~v5/common/Table/Table.tsx';

import { useActionsTableProps } from './hooks/useActionsTableProps.tsx';
import { useHandleRedoAction } from './hooks/useHandleRedoAction.ts';
import { type ColonyActionsTableProps } from './types.ts';

const displayName = 'common.RecentActivityTable';

const RecentActivityTable: FC<ColonyActionsTableProps> = ({
  actionProps,
  pageSize = 10,
  ...props
}) => {
  const selectedDomain = useGetSelectedDomainFilter();
  const nativeDomainId = selectedDomain?.nativeId;

  const { actionsCount: totalActions, loading: loadingActionsCount } =
    useActionsCount({
      domainId: nativeDomainId,
    });

  const pageCount = Math.ceil(totalActions / pageSize);

  const { tableProps } = useActionsTableProps(
    {
      ...props,
      pageSize,
      pagination: {
        visible: totalActions > 0,
        pageTotalVisible: !loadingActionsCount && pageCount > 1,
      },
      overrides: {
        pageCount,
      },
      showUserAvatar: false,
      isRecentActivityVariant: true,
    },
    actionProps.setSelectedAction,
  );

  useHandleRedoAction({ actionProps });

  return (
    <Table<ColonyAction>
      {...tableProps}
      showTableHead={false}
      borders={{
        type: 'narrow',
        visible: false,
      }}
    />
  );
};

RecentActivityTable.displayName = displayName;

export default RecentActivityTable;
