import { createColumnHelper, ColumnDef } from '@tanstack/react-table';
import clsx from 'clsx';
import React, { useMemo } from 'react';

import { useColonyContext } from '~hooks';
import useWrapWithRef from '~hooks/useWrapWithRef';
import { notNull } from '~utils/arrays';
import { formatText } from '~utils/intl';
import PillsBase from '~v5/common/Pills/PillsBase';
import { RenderCellWrapper } from '~v5/common/Table/types';
import { MEATBALL_MENU_COLUMN_ID } from '~v5/common/TableWithMeatballMenu/consts';
import { TableWithMeatballMenuProps } from '~v5/common/TableWithMeatballMenu/types';

import TokenSelect from '../TokenSelect';
import TokenSymbol from '../TokenSelect/partials/TokenSymbol';

import { TokensTableModel, TokensTableProps } from './types';

const columnHelper = createColumnHelper<TokensTableModel>();

export const useTokensTableColumns = (
  name: string,
  data,
): ColumnDef<TokensTableModel, string>[] => {
  const dataRef = useWrapWithRef(data);

  const columns: ColumnDef<TokensTableModel, string>[] = useMemo(() => {
    return [
      columnHelper.display({
        id: 'token',
        header: () => formatText({ id: 'table.row.token' }),
        cell: ({ row }) => (
          <div className="w-full py-2 sm:py-0">
            <TokenSelect name={`${name}.${row.index}.token`} />
          </div>
        ),
      }),
      columnHelper.display({
        id: 'symbol',
        header: () => formatText({ id: 'table.row.symbol' }),
        cell: ({ row }) => {
          const showNewLabel = dataRef.current?.[row.index]?.isNew;
          const showRemovedLabel = !!dataRef.current?.[row.index]?.isRemoved;

          const tokenSymbol = (
            <div className="w-full py-2 sm:py-0">
              <TokenSymbol address={dataRef.current?.[row.index]?.token} />
            </div>
          );

          return showNewLabel || showRemovedLabel ? (
            <div className="w-full flex flex-col items-start gap-2 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
              {tokenSymbol}
              <PillsBase
                className={clsx('sm:ml-auto', {
                  'text-negative-400 bg-negative-100': showRemovedLabel,
                  'text-success-400 bg-success-100': showNewLabel,
                })}
                text={formatText({
                  id: showRemovedLabel ? 'badge.removed' : 'badge.new',
                })}
              />
            </div>
          ) : (
            tokenSymbol
          );
        },
      }),
    ];
  }, [dataRef, name]);

  return columns;
};

export const useGetTableMenuProps = (
  { update, remove },
  data,
  shouldShowMenu: Exclude<TokensTableProps['shouldShowMenu'], undefined>,
) => {
  const { colony } = useColonyContext();

  const colonyTokens = useMemo(
    () => colony?.tokens?.items.filter(notNull) || [],
    [colony?.tokens?.items],
  );

  const getMenuProps: TableWithMeatballMenuProps<TokensTableModel>['getMenuProps'] =
    ({ index }) => {
      const shouldShow = shouldShowMenu(data[index]?.token);
      const editPreviouslyAddedToken = colonyTokens.find(
        ({ token }) => token.tokenAddress === data[index]?.token,
      );
      const hasRemovedLabel = data[index]?.isRemoved;

      return shouldShow
        ? {
            cardClassName: 'min-w-[9.625rem] whitespace-nowrap',
            items: [
              {
                key: 'remove',
                onClick: () =>
                  editPreviouslyAddedToken
                    ? update(index, {
                        ...data[index],
                        isRemoved: !hasRemovedLabel,
                      })
                    : remove(index),
                label: formatText({
                  id: hasRemovedLabel ? 'table.row.cancel' : 'table.row.remove',
                }),
                icon: hasRemovedLabel ? 'close' : 'trash',
              },
            ],
          }
        : undefined;
    };

  return getMenuProps;
};

export const useRenderCell = (): RenderCellWrapper<TokensTableModel> => {
  return (className, content, { cell, renderDefault }) => {
    if (cell.column.columnDef.id === MEATBALL_MENU_COLUMN_ID) {
      return <div className={clsx(className, '!pl-0')}>{content}</div>;
    }

    if (cell.column.columnDef.id === 'symbol') {
      return (
        <div className={clsx(className, '!pr-0 !py-2.5 min-h-[54px]')}>
          {content}
        </div>
      );
    }

    return renderDefault();
  };
};
