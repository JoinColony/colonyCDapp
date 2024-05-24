import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import React, { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import useWrapWithRef from '~hooks/useWrapWithRef.ts';
import { formatText } from '~utils/intl.ts';
import AmountField from '~v5/common/ActionSidebar/partials/AmountField/index.ts';
import FormInputBase from '~v5/common/Fields/InputBase/FormInputBase.tsx';

import PaymentBuilderPayoutsTotal from '../PaymentBuilderPayoutsTotal/index.ts';

import {
  type PaymentBuilderRecipientsFieldModel,
  type PaymentBuilderRecipientsTableModel,
} from './types.ts';
import { UserSelectRow } from './UserSelectRow.tsx';

export const useRecipientsFieldTableColumns = (
  name: string,
  data: PaymentBuilderRecipientsFieldModel[],
): ColumnDef<PaymentBuilderRecipientsTableModel, string>[] => {
  const { colony } = useColonyContext();
  const { expendituresGlobalClaimDelay } = colony;

  const dataRef = useWrapWithRef(data);
  const expendituresGlobalClaimDelayHours = useMemo(() => {
    if (typeof expendituresGlobalClaimDelay !== 'number') {
      return null;
    }

    return expendituresGlobalClaimDelay / (60 * 60);
  }, [expendituresGlobalClaimDelay]);
  const { watch } = useFormContext();
  const selectedTeam = watch('from');
  const hasMoreThanOneToken = data.length > 1;

  const columns: ColumnDef<PaymentBuilderRecipientsTableModel, string>[] =
    useMemo(() => {
      const columnHelper =
        createColumnHelper<PaymentBuilderRecipientsTableModel>();

      return [
        columnHelper.display({
          id: 'recipient',
          header: () => formatText({ id: 'table.row.recipient' }),
          cell: ({ row }) => (
            <UserSelectRow row={row} name={`${name}.${row.index}.recipient`} />
          ),
          footer: hasMoreThanOneToken
            ? () => (
                <span className="flex min-h-[1.875rem] items-center text-xs text-gray-400">
                  {data.length <= 7
                    ? formatText({ id: 'table.footer.total' })
                    : formatText(
                        { id: 'table.footer.totalPayments' },
                        { payments: data.length },
                      )}
                </span>
              )
            : undefined,
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
          footer: hasMoreThanOneToken
            ? () => (
                <PaymentBuilderPayoutsTotal
                  data={dataRef.current}
                  moveDecimals
                  itemClassName="justify-end md:justify-start"
                  buttonClassName="justify-end md:justify-start"
                />
              )
            : undefined,
        }),
        columnHelper.display({
          id: 'delay',
          staticSize: '175px',
          header: () => formatText({ id: 'table.column.claimDelay' }),
          cell: ({ row }) => (
            <FormInputBase
              message={false}
              placeholder={formatText({ id: 'actionSidebar.enterValue' })}
              autoWidth
              inputWrapperClassName="flex-row flex items-center gap-2"
              key={row.id}
              name={`${name}.${row.index}.delay`}
              type="number"
              mode="secondary"
              suffix={
                <span className="inline-block text-md text-gray-900">
                  {formatText(
                    { id: 'table.column.claimDelayFieldSuffix' },
                    {
                      hours: dataRef.current[row.index]?.delay || 0,
                    },
                  )}
                </span>
              }
            />
          ),
        }),
        ...(expendituresGlobalClaimDelayHours !== null
          ? [
              columnHelper.display({
                id: 'totalDelay',
                header: () => formatText({ id: 'table.column.totalDelay' }),
                cell: ({ row }) => {
                  const totalHours =
                    expendituresGlobalClaimDelayHours +
                    (dataRef.current[row.index]?.delay || 0);

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
    }, [
      hasMoreThanOneToken,
      expendituresGlobalClaimDelayHours,
      name,
      data.length,
      selectedTeam,
      dataRef,
    ]);

  return columns;
};
