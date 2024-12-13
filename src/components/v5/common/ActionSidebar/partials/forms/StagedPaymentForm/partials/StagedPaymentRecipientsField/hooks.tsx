import {
  type ColumnDef,
  createColumnHelper,
  type Row,
} from '@tanstack/react-table';
import React, { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import { MAX_MILESTONE_LENGTH } from '~constants';
import useWrapWithRef from '~hooks/useWrapWithRef.ts';
import { formatText } from '~utils/intl.ts';
import { FROM_FIELD_NAME } from '~v5/common/ActionSidebar/consts.ts';
import AmountField from '~v5/common/ActionSidebar/partials/AmountField/AmountField.tsx';
import PaymentBuilderPayoutsTotal from '~v5/common/ActionSidebar/partials/forms/PaymentBuilderForm/partials/PaymentBuilderPayoutsTotal/index.ts';
import { type StagedPaymentFormValues } from '~v5/common/ActionSidebar/partials/forms/StagedPaymentForm/hooks.ts';
import FormTextareaBase from '~v5/common/Fields/TextareaBase/FormTextareaBase.tsx';
import { makeMenuColumn } from '~v5/common/Table/utils.tsx';
import { type MeatBallMenuProps } from '~v5/shared/MeatBallMenu/types.ts';

import {
  type StagedPaymentRecipientsTableModel,
  type StagedPaymentRecipientsFieldModel,
} from './types.ts';

export const useStagedPaymentRecipientsTableColumns = (
  name: string,
  data: StagedPaymentRecipientsFieldModel[],
  getMenuProps: (
    row: Row<StagedPaymentRecipientsTableModel>,
  ) => MeatBallMenuProps | undefined,
) => {
  const { watch } = useFormContext<StagedPaymentFormValues>();
  const hasMoreThanOneToken = data.length > 1;
  const selectedTeam = watch(FROM_FIELD_NAME);
  const dataRef = useWrapWithRef(data);

  const columnHelper = useMemo(
    () => createColumnHelper<StagedPaymentRecipientsTableModel>(),
    [],
  );

  const menuColumn: ColumnDef<StagedPaymentRecipientsTableModel, string> =
    useMemo(
      () =>
        makeMenuColumn({
          helper: columnHelper,
          getMenuProps,
        }),
      [columnHelper, getMenuProps],
    );

  const columns: ColumnDef<StagedPaymentRecipientsTableModel, string>[] =
    useMemo(() => {
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
    }, [columnHelper, dataRef, hasMoreThanOneToken, name, selectedTeam]);

  return menuColumn ? [...columns, menuColumn] : columns;
};
