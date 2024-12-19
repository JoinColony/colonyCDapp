import {
  createColumnHelper,
  type Row,
  type ColumnDef,
} from '@tanstack/react-table';
import { BigNumber } from 'ethers';
import React, { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import useWrapWithRef from '~hooks/useWrapWithRef.ts';
import { convertPeriodToHours } from '~utils/extensions.ts';
import { formatText } from '~utils/intl.ts';
import AmountField from '~v5/common/ActionSidebar/partials/AmountField/index.ts';
import { makeMenuColumn } from '~v5/common/Table/utils.tsx';
import { type MeatBallMenuProps } from '~v5/shared/MeatBallMenu/types.ts';

import ClaimDelayField from '../ClaimDelayField/ClaimDelayField.tsx';
import PaymentBuilderPayoutsTotal from '../PaymentBuilderPayoutsTotal/index.ts';

import {
  type PaymentBuilderRecipientsFieldModel,
  type PaymentBuilderRecipientsTableModel,
} from './types.ts';
import { UserSelectRow } from './UserSelectRow.tsx';

export const useRecipientsFieldTableColumns = (
  name: string,
  data: PaymentBuilderRecipientsFieldModel[],
  getMenuProps: (
    row: Row<PaymentBuilderRecipientsTableModel>,
  ) => MeatBallMenuProps | undefined,
): ColumnDef<PaymentBuilderRecipientsTableModel, string>[] => {
  const { colony } = useColonyContext();
  const { expendituresGlobalClaimDelay } = colony;

  const dataRef = useWrapWithRef(data);
  const expendituresGlobalClaimDelayHours = useMemo(() => {
    if (typeof expendituresGlobalClaimDelay !== 'string') {
      return null;
    }

    return convertPeriodToHours(expendituresGlobalClaimDelay);
  }, [expendituresGlobalClaimDelay]);
  const { watch } = useFormContext();
  const selectedTeam = watch('from');
  const hasMoreThanOneToken = data.length > 1;

  const columnHelper = useMemo(
    () => createColumnHelper<PaymentBuilderRecipientsTableModel>(),
    [],
  );

  const footerData = useMemo(
    () => ({
      amountFooter: hasMoreThanOneToken
        ? () => (
            <PaymentBuilderPayoutsTotal
              data={dataRef.current || []}
              convertToWEI
              itemClassName="justify-end md:justify-start"
              buttonClassName="justify-end md:justify-start"
            />
          )
        : undefined,
      recipientFooter: hasMoreThanOneToken
        ? () => (
            <span className="flex min-h-[1.875rem] items-center text-xs text-gray-400">
              {!!dataRef.current.length && dataRef.current.length <= 7
                ? formatText({ id: 'table.footer.total' })
                : formatText(
                    { id: 'table.footer.totalPayments' },
                    { payments: dataRef.current.length },
                  )}
            </span>
          )
        : undefined,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hasMoreThanOneToken],
  );

  const menuColumn = useMemo(
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

  const columns: ColumnDef<PaymentBuilderRecipientsTableModel, string>[] =
    useMemo(() => {
      return [
        columnHelper.display({
          id: 'recipient',
          header: () => formatText({ id: 'table.row.recipient' }),
          cell: ({ row }) => (
            <UserSelectRow
              key={row.id}
              name={`${name}.${row.index}.recipient`}
            />
          ),
          footer: footerData.recipientFooter,
        }),
        columnHelper.display({
          id: 'amount',
          header: () => formatText({ id: 'table.row.amount' }),
          cell: ({ row }) => (
            <AmountField
              key={row.id}
              name={`${name}.${row.index}.amount`}
              tokenAddressFieldName={`${name}.${row.index}.tokenAddress`}
              domainId={selectedTeam}
              placeholder={formatText({ id: 'actionSidebar.enterAmount' })}
            />
          ),
          footer: footerData.amountFooter,
        }),
        columnHelper.display({
          id: 'delay',
          staticSize: '10.9375rem',
          header: () => formatText({ id: 'table.column.claimDelay' }),
          cell: ({ row }) => (
            <ClaimDelayField name={`${name}.${row.index}.delay`} key={row.id} />
          ),
        }),
        ...(expendituresGlobalClaimDelayHours !== null
          ? [
              columnHelper.display({
                id: 'totalDelay',
                header: () => formatText({ id: 'table.column.totalDelay' }),
                cell: ({ row }) => {
                  const totalHours = BigNumber.from(
                    expendituresGlobalClaimDelayHours,
                  )
                    .add(BigNumber.from(dataRef.current[row.index]?.delay || 0))
                    .toString();

                  return (
                    <span className="text-gray-300">
                      {formatText(
                        { id: 'table.column.claimDelayField' },
                        {
                          hours: totalHours,
                        },
                      )}
                    </span>
                  );
                },
              }),
            ]
          : []),
      ];
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
      columnHelper,
      expendituresGlobalClaimDelayHours,
      footerData,
      name,
      selectedTeam,
    ]);

  return menuColumn ? [...columns, menuColumn] : columns;
};
