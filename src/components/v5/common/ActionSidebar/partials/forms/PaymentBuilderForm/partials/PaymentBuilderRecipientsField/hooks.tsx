import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import { BigNumber } from 'ethers';
import React, { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import useWrapWithRef from '~hooks/useWrapWithRef.ts';
import { convertPeriodToHours } from '~utils/extensions.ts';
import { formatText } from '~utils/intl.ts';
import AmountField from '~v5/common/ActionSidebar/partials/AmountField/index.ts';
import UserSelect from '~v5/common/ActionSidebar/partials/UserSelect/index.ts';

import ClaimDelayField from '../ClaimDelayField/ClaimDelayField.tsx';
import PaymentBuilderPayoutsTotal from '../PaymentBuilderPayoutsTotal/index.ts';

import {
  type PaymentBuilderRecipientsFieldModel,
  type PaymentBuilderRecipientsTableModel,
} from './types.ts';

export const useRecipientsFieldTableColumns = (
  name: string,
  data: PaymentBuilderRecipientsFieldModel[],
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

  const columns: ColumnDef<PaymentBuilderRecipientsTableModel, string>[] =
    useMemo(() => {
      const columnHelper =
        createColumnHelper<PaymentBuilderRecipientsTableModel>();

      return [
        columnHelper.display({
          id: 'recipient',
          header: () => formatText({ id: 'table.row.recipient' }),
          cell: ({ row }) => (
            <div key={row.id}>
              <UserSelect name={`${name}.${row.index}.recipient`} />
            </div>
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
              placeholder="0"
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
          staticSize: '10.9375rem',
          header: () => formatText({ id: 'table.column.claimDelay' }),
          cell: ({ row }) => (
            <ClaimDelayField
              name={`${name}.${row.index}.delay`}
              key={row.id}
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
