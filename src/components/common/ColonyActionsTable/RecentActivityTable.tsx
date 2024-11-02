import React, { type FC } from 'react';

import useActionsCount from '~hooks/useActionsCount.ts';
import useGetSelectedDomainFilter from '~hooks/useGetSelectedDomainFilter.tsx';
import { type ColonyAction } from '~types/graphql.ts';
import Table from '~v5/common/Table/index.ts';

import { useActionsTableProps } from './hooks/useActionsTableProps.tsx';
import { useHandleRedoAction } from './hooks/useHandleRedoAction.ts';
import { type ColonyActionsTableProps } from './types.ts';

const displayName = 'common.RecentActivityTable';

const RecentActivityTable: FC<ColonyActionsTableProps> = ({
  actionProps,
  ...props
}) => {
  const selectedDomain = useGetSelectedDomainFilter();
  const nativeDomainId = selectedDomain?.nativeId;

  const { actionsCount: totalActions, loading: loadingActionsCount } =
    useActionsCount({
      domainId: nativeDomainId,
    });

  const pageCount = Math.ceil(totalActions / (props.pageSize ?? 10));

  const { tableProps, renderSubComponent } = useActionsTableProps(
    {
      ...props,
      showUserAvatar: false,
      showTotalPagesNumber: !loadingActionsCount,
      isRecentActivityVariant: true,
    },
    actionProps.setSelectedAction,
  );

  useHandleRedoAction({ actionProps });

  return (
    <Table<ColonyAction>
      {...tableProps}
      showTableHead={false}
      showTableBorder={false}
      renderSubComponent={renderSubComponent}
      pageCount={pageCount}
      withBorder={false}
      withNarrowBorder
      alwaysShowPagination={totalActions > 0}
      showTotalPagesNumber={pageCount > 1}
    />
  );
};

RecentActivityTable.displayName = displayName;

export default RecentActivityTable;
