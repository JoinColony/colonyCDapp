import React, { FC } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import clsx from 'clsx';

import Button from '~v5/shared/Button';
import TableWithMeatballMenu from '~v5/common/TableWithMeatballMenu';
import { formatText } from '~utils/intl';
import { useMobile } from '~hooks';

import { useBatchPaymentsTableColumns, useGetTableMenuProps } from './hooks';
import { BatchPaymentsTableModel, BatchPaymentsTableProps } from './types';

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
  const getMenuProps = useGetTableMenuProps(fieldArrayMethods);

  return (
    <div>
      {!!data.length && (
        <>
          <h5 className="text-2 mb-3 mt-6">
            {formatText({ id: 'actionSidebar.payments' })}
          </h5>
          <TableWithMeatballMenu<BatchPaymentsTableModel>
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
        iconName="plus"
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
