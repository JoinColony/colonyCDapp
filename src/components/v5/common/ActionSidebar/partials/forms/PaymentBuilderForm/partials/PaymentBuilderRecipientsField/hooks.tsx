import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import { BigNumber } from 'ethers';
import moveDecimal from 'move-decimal-point';
import React, { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import { useColonyContext } from '~context/ColonyContext.tsx';
import useWrapWithRef from '~hooks/useWrapWithRef.ts';
import { formatText } from '~utils/intl.ts';
import { getSelectedToken } from '~utils/tokens.ts';
import AmountField from '~v5/common/ActionSidebar/partials/AmountField/index.ts';
import UserSelect from '~v5/common/ActionSidebar/partials/UserSelect/index.ts';
import FormInputBase from '~v5/common/Fields/InputBase/FormInputBase.tsx';

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
            <div key={row.id}>
              <UserSelect name={`${name}.${row.index}.recipient`} />
            </div>
          ),
          footer: hasMoreThanOneToken
            ? () => (
                <span className="flex min-h-[1.875rem] items-center text-xs text-gray-400">
                  {formatText({ id: 'table.footer.total' })}
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
            ? () => {
                const summedPayouts = dataRef.current?.reduce(
                  (result, { amount, tokenAddress }) => {
                    if (!amount) {
                      return result;
                    }

                    if (!tokenAddress) {
                      return result;
                    }

                    const tokenData = getSelectedToken(colony, tokenAddress);

                    if (!tokenData) {
                      return result;
                    }

                    return {
                      ...result,
                      [tokenAddress]: {
                        ...tokenData,
                        amount: BigNumber.from(
                          !result[tokenAddress]?.amount ||
                            result[tokenAddress]?.amount === ''
                            ? '0'
                            : result[tokenAddress]?.amount,
                        )
                          .add(
                            BigNumber.from(
                              moveDecimal(
                                amount === '' ? '0' : amount,
                                tokenData.decimals,
                              ),
                            ),
                          )
                          .toString(),
                      },
                    };
                  },
                  {},
                );

                const payouts = Object.values(summedPayouts);

                return <PaymentBuilderPayoutsTotal payouts={payouts} />;
              }
            : undefined,
        }),
        columnHelper.display({
          id: 'delay',
          staticSize: '175px',
          header: () => formatText({ id: 'table.column.claimDelay' }),
          cell: ({ row }) => (
            <FormInputBase
              message={false}
              placeholder="0"
              autoWidth
              inputWrapperClassName="flex-row flex items-center gap-2"
              min={0}
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
                      {totalHours}{' '}
                      {formatText(
                        { id: 'table.column.claimDelayFieldSuffix' },
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
      selectedTeam,
      dataRef,
      colony,
    ]);

  return columns;
};
