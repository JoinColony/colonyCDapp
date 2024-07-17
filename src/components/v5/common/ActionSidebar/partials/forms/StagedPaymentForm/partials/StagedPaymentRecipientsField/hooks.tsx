import { type ColumnDef, createColumnHelper } from '@tanstack/react-table';
import React, { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import { MAX_MILESTONE_LENGTH } from '~constants';
import useWrapWithRef from '~hooks/useWrapWithRef.ts';
import { formatText } from '~utils/intl.ts';
import { FROM_FIELD_NAME } from '~v5/common/ActionSidebar/consts.ts';
import AmountField from '~v5/common/ActionSidebar/partials/AmountField/AmountField.tsx';
import FormTextareaBase from '~v5/common/Fields/TextareaBase/FormTextareaBase.tsx';

import PaymentBuilderPayoutsTotal from '../../../PaymentBuilderForm/partials/PaymentBuilderPayoutsTotal/index.ts';
import { type StagedPaymentFormValues } from '../../hooks.ts';

import {
  type StagedPaymentRecipientsTableModel,
  type StagedPaymentRecipientsFieldModel,
} from './types.ts';

export const useStagedPaymentTableColumns = (
  name: string,
  data: StagedPaymentRecipientsFieldModel[],
) => {
  const { watch } = useFormContext<StagedPaymentFormValues>();
  const hasMoreThanOneToken = data.length > 1;
  const selectedTeam = watch(FROM_FIELD_NAME);
  const dataRef = useWrapWithRef(data);

  const columns: ColumnDef<StagedPaymentRecipientsTableModel, string>[] =
    useMemo(() => {
      const columnHelper =
        createColumnHelper<StagedPaymentRecipientsTableModel>();

      return [
        columnHelper.display({
          id: 'milestone',
          header: () => formatText({ id: 'table.row.milestone' }),
          cell: ({ row }) => (
            <div key={row.id} className="flex sm:py-4">
              <FormTextareaBase
                name={`${name}.${row.index}.milestone`}
                placeholder="Enter milestone"
                maxLength={MAX_MILESTONE_LENGTH}
                message={undefined}
                wrapperClassName="flex"
                withoutCounter
              />
            </div>
          ),
          footer: hasMoreThanOneToken
            ? ({ table }) => {
                const { length: dataLength } = table.getRowModel().rows;

                return (
                  <span className="flex min-h-[1.875rem] items-center text-xs text-gray-400">
                    {dataLength < 1
                      ? formatText({ id: 'table.footer.total' })
                      : formatText(
                          { id: 'table.footer.totalMilestones' },
                          { payments: dataLength },
                        )}
                  </span>
                );
              }
            : undefined,
        }),
        columnHelper.display({
          id: 'amount',
          staticSize: '216px',
          header: () => formatText({ id: 'table.row.amount' }),
          cell: ({ row }) => (
            <AmountField
              key={row.id}
              name={`${name}.${row.index}.amount`}
              tokenAddressFieldName={`${name}.${row.index}.tokenAddress`}
              domainId={selectedTeam}
            />
          ),
          footer: hasMoreThanOneToken
            ? () => (
                <PaymentBuilderPayoutsTotal
                  data={dataRef.current}
                  convertToWEI
                  itemClassName="justify-end md:justify-start"
                  buttonClassName="justify-end md:justify-start"
                />
              )
            : undefined,
        }),
      ];
    }, [dataRef, hasMoreThanOneToken, name, selectedTeam]);

  return columns;
};
