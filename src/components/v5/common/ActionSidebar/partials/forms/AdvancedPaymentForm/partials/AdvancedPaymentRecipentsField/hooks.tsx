import React, { useMemo, useCallback } from 'react';
import pick from 'lodash/pick';
import { createColumnHelper, ColumnDef } from '@tanstack/react-table';
import { useFormContext } from 'react-hook-form';

import { formatText } from '~utils/intl';
import { useColonyContext } from '~hooks';
import useWrapWithRef from '~hooks/useWrapWithRef';
import { TableWithMeatballMenuProps } from '~v5/common/TableWithMeatballMenu/types';
import UserSelect from '~v5/common/ActionSidebar/partials/UserSelect';
import AmountField from '~v5/common/ActionSidebar/partials/AmountField';
import FormInputBase from '~v5/common/Fields/InputBase/FormInputBase';

import {
  AdvancedPaymentRecipentsFieldModel,
  AdvancedPaymentRecipentsTableModel,
} from './types';

export const useRecipientsFieldTableColumns = (
  name: string,
  data: AdvancedPaymentRecipentsFieldModel[],
): ColumnDef<AdvancedPaymentRecipentsTableModel, string>[] => {
  const { colony } = useColonyContext();
  const columnHelper = useMemo(
    () => createColumnHelper<AdvancedPaymentRecipentsTableModel>(),
    [],
  );
  const dataRef = useWrapWithRef(data);
  const expendituresGlobalClaimDelayHours = useMemo(() => {
    if (!colony || typeof colony.expendituresGlobalClaimDelay !== 'number') {
      return null;
    }

    const { expendituresGlobalClaimDelay } = colony;

    return expendituresGlobalClaimDelay / (60 * 60);
  }, [colony]);
  const { watch } = useFormContext();
  const selectedTeam = watch('from');

  const columns: ColumnDef<AdvancedPaymentRecipentsTableModel, string>[] =
    useMemo(
      () => [
        columnHelper.display({
          id: 'recipient',
          header: () => formatText({ id: 'table.row.recipient' }),
          cell: ({ row }) => (
            <UserSelect key={row.id} name={`${name}.${row.index}.recipient`} />
          ),
        }),
        columnHelper.display({
          id: 'amount',
          header: () => formatText({ id: 'table.row.amount' }),
          cell: ({ row }) => (
            <AmountField
              key={row.id}
              name={`${name}.${row.index}.amount`}
              teamId={selectedTeam}
            />
          ),
        }),
        columnHelper.display({
          id: 'delay',
          header: () => formatText({ id: 'table.column.claimDelay' }),
          cell: ({ row }) => (
            <FormInputBase
              message={false}
              autoWidth
              wrapperClassName="flex-row flex items-center"
              min={0}
              key={row.id}
              name={`${name}.${row.index}.delay`}
              type="number"
              mode="secondary"
              suffix={formatText(
                { id: 'table.column.claimDelayFieldSuffix' },
                {
                  hours: dataRef.current[row.index]?.delay || 0,
                },
              )}
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
      ],
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [
        colony?.expendituresGlobalClaimDelay,
        columnHelper,
        name,
        expendituresGlobalClaimDelayHours,
      ],
    );

  return columns;
};

export const useGetTableMenuProps = ({ insert, remove }, data) =>
  useCallback<
    TableWithMeatballMenuProps<AdvancedPaymentRecipentsTableModel>['getMenuProps']
  >(
    ({ index }) => ({
      cardClassName: 'min-w-[9.625rem] whitespace-nowrap',
      items: [
        {
          key: 'add-token',
          onClick: () =>
            insert(index + 1, {
              ...pick(data[index], ['recipient', 'delay']),
            }),
          label: formatText({ id: 'button.addToken' }),
          icon: 'coins',
        },
        {
          key: 'duplicate',
          onClick: () =>
            insert(index + 1, {
              ...data[index],
            }),
          label: formatText({ id: 'table.row.duplicate' }),
          icon: 'copy-simple',
        },
        {
          key: 'remove',
          onClick: () => remove(index),
          label: formatText({ id: 'table.row.remove' }),
          icon: 'trash',
        },
      ],
    }),
    [data, insert, remove],
  );
