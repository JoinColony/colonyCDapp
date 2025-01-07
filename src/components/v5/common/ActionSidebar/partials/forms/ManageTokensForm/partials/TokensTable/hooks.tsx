import {
  createColumnHelper,
  type Row,
  type ColumnDef,
} from '@tanstack/react-table';
import clsx from 'clsx';
import React, { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useTablet } from '~hooks';
import useWrapWithRef from '~hooks/useWrapWithRef.ts';
import { notNull } from '~utils/arrays/index.ts';
import { formatText } from '~utils/intl.ts';
import useHasNoDecisionMethods from '~v5/common/ActionSidebar/hooks/permissions/useHasNoDecisionMethods.ts';
import TokenSymbol from '~v5/common/ActionSidebar/partials/TokenSelect/partials/TokenSymbol/TokenSymbol.tsx';
import TokenSelect from '~v5/common/ActionSidebar/partials/TokenSelect/TokenSelect.tsx';
import PillsBase from '~v5/common/Pills/PillsBase.tsx';
import { makeMenuColumn } from '~v5/common/Table/utils.tsx';
import { TokenStatus } from '~v5/common/types.ts';
import { type MeatBallMenuProps } from '~v5/shared/MeatBallMenu/types.ts';

import { type TokensTableModel } from './types.ts';

export const useTokensTableColumns = (
  name: string,
  data,
  getMenuProps: (row: Row<TokensTableModel>) => MeatBallMenuProps | undefined,
): ColumnDef<TokensTableModel, string>[] => {
  const isTablet = useTablet();
  const columnHelper = useMemo(
    () => createColumnHelper<TokensTableModel>(),
    [],
  );
  const dataRef = useWrapWithRef(data);
  const hasNoDecisionMethods = useHasNoDecisionMethods();
  const { colony } = useColonyContext();

  const colonyTokens = useMemo(
    () => colony.tokens?.items.filter(notNull) || [],
    [colony.tokens?.items],
  );

  const { getFieldState } = useFormContext();

  const menuColumn: ColumnDef<TokensTableModel, string> = useMemo(
    () =>
      makeMenuColumn({
        helper: columnHelper,
        getMenuProps,
        cellProps: {
          size: 34,
        },
      }),
    [columnHelper, getMenuProps],
  );

  const columns: ColumnDef<TokensTableModel, string>[] = useMemo(
    () => [
      columnHelper.display({
        id: 'token',
        staticSize: isTablet ? '7.375rem' : undefined,
        header: () => formatText({ id: 'table.row.token' }),
        cell: ({ row }) => {
          const status = dataRef.current?.[row.index]?.status;
          const tokenAddress = dataRef.current?.[row.index]?.token;

          return (
            <div className="flex items-center text-gray-900 text-1">
              <TokenSelect
                name={`${name}.${row.index}.token`}
                disabled={hasNoDecisionMethods}
                readOnly={
                  status === TokenStatus.NotEditable ||
                  status === TokenStatus.Unaffected ||
                  !!colonyTokens.find(
                    ({ token }) => token.tokenAddress === tokenAddress,
                  )
                }
                filterOptionsFn={({ value }) =>
                  !dataRef.current?.find(({ token }) => token === value)
                }
              />
            </div>
          );
        },
      }),
      columnHelper.display({
        id: 'symbol',
        header: () => formatText({ id: 'table.row.symbol' }),
        cell: ({ row }) => {
          const tokenAddress = dataRef.current?.[row.index]?.token;

          if (!tokenAddress) {
            return null;
          }

          const { error: fieldError } = getFieldState(name);
          const tokenError = fieldError?.[row.index]?.token;
          const isDuplicate =
            fieldError?.[row.index]?.token.type === 'duplicate';

          const status = dataRef.current?.[row.index]?.status;
          const showNewLabel = status === TokenStatus.Added && !isDuplicate;
          const showRemovedLabel = status === TokenStatus.Removed;

          const tokenSymbol = (
            <TokenSymbol
              address={tokenAddress}
              disabled={hasNoDecisionMethods}
            />
          );

          return (
            <div
              className={clsx(
                'flex w-full flex-col items-start gap-2 text-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4',
                {
                  'text-gray-900': !tokenError,
                  'text-negative-400': tokenError,
                },
              )}
            >
              {tokenSymbol}
              {(isDuplicate || showNewLabel || showRemovedLabel) && (
                <PillsBase
                  className={clsx('sm:ml-auto', {
                    'bg-negative-100 text-negative-400': showRemovedLabel,
                    'bg-warning-100 text-warning-400': isDuplicate,
                    'bg-success-100 text-success-400': showNewLabel,
                  })}
                  text={formatText({
                    id:
                      (isDuplicate && 'badge.duplicate') ||
                      (showRemovedLabel && 'badge.removed') ||
                      'badge.new',
                  })}
                />
              )}
            </div>
          );
        },
      }),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      columnHelper,
      getFieldState,
      hasNoDecisionMethods,
      isTablet,
      name,
      colonyTokens,
    ],
  );

  return menuColumn ? [...columns, menuColumn] : columns;
};
