import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import clsx from 'clsx';
import React, { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import { useTablet } from '~hooks';
import useWrapWithRef from '~hooks/useWrapWithRef.ts';
import { formatText } from '~utils/intl.ts';
import PillsBase from '~v5/common/Pills/PillsBase.tsx';
import { TokenStatus } from '~v5/common/types.ts';

import useHasNoDecisionMethods from '../../../../../hooks/permissions/useHasNoDecisionMethods.ts';
import TokenSelect from '../../../../TokenSelect/index.ts';
import TokenSymbol from '../../../../TokenSelect/partials/TokenSymbol/index.ts';

import { type TokensTableModel } from './types.ts';

export const useTokensTableColumns = (
  name: string,
  data,
): ColumnDef<TokensTableModel, string>[] => {
  const isTablet = useTablet();
  const columnHelper = useMemo(
    () => createColumnHelper<TokensTableModel>(),
    [],
  );
  const dataRef = useWrapWithRef(data);
  const hasNoDecisionMethods = useHasNoDecisionMethods();

  const { getFieldState } = useFormContext();

  const columns: ColumnDef<TokensTableModel, string>[] = useMemo(
    () => [
      columnHelper.display({
        id: 'token',
        staticSize: isTablet ? '7.375rem' : undefined,
        header: () => formatText({ id: 'table.row.token' }),
        cell: ({ row }) => {
          const status = dataRef.current?.[row.index]?.status;

          return (
            <div className="flex items-center text-gray-900 text-1">
              <TokenSelect
                name={`${name}.${row.index}.token`}
                disabled={hasNoDecisionMethods}
                readOnly={
                  status === TokenStatus.NotEditable ||
                  status === TokenStatus.Unaffected
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
    [columnHelper, getFieldState, hasNoDecisionMethods, isTablet, name],
  );

  return columns;
};
