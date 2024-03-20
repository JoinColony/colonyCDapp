import { Plus, Trash } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { useMobile } from '~hooks/index.ts';
import { formatText } from '~utils/intl.ts';
import Table from '~v5/common/Table/index.ts';
import Button from '~v5/shared/Button/index.ts';

import { useBatchPaymentsTableColumns } from './hooks.tsx';
import {
  type BatchPaymentsTableModel,
  type BatchPaymentsTableProps,
} from './types.ts';

const displayName = 'v5.common.ActionsContent.partials.BatchPaymentsTable';

const BatchPaymentsTable: FC<BatchPaymentsTableProps> = ({ name }) => {
  const isMobile = useMobile();
  const fieldArrayMethods = useFieldArray({
    name,
  });
  const data: BatchPaymentsTableModel[] = fieldArrayMethods.fields.map(
    ({ id }) => ({
      key: id,
    }),
  );
  const { getFieldState } = useFormContext();
  const fieldState = getFieldState(name);
  const columns = useBatchPaymentsTableColumns();
  const getMenuProps = ({ index }) => ({
    cardClassName: 'min-w-[9.625rem] whitespace-nowrap',
    items: [
      {
        key: 'remove',
        onClick: () => fieldArrayMethods.remove(index),
        label: formatText({ id: 'table.row.remove' }),
        icon: Trash,
      },
    ],
  });

  return (
    <div>
      {!!data.length && (
        <>
          <h5 className="mb-3 mt-6 text-2">
            {formatText({ id: 'actionSidebar.payments' })}
          </h5>
          <Table<BatchPaymentsTableModel>
            className={clsx('mb-6', {
              '!border-negative-400': !!fieldState.error,
            })}
            getRowId={({ key }) => key}
            columns={columns}
            data={data}
            getMenuProps={getMenuProps}
          />
        </>
      )}
      <Button
        mode="primaryOutline"
        icon={Plus}
        size="small"
        isFullSize={isMobile}
        onClick={() => {
          // @TODO trigger open uploader modal
        }}
      >
        {formatText({ id: 'button.addBatchPayments' })}
      </Button>
    </div>
  );
};

BatchPaymentsTable.displayName = displayName;

export default BatchPaymentsTable;
