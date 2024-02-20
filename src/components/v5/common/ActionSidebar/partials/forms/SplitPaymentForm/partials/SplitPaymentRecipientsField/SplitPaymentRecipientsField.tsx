import { CopySimple, Plus, Trash } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC } from 'react';
import { useFieldArray, useWatch, useFormContext } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';

import { useMobile } from '~hooks/index.ts';
import { formatText } from '~utils/intl.ts';
import Table from '~v5/common/Table/index.ts';
import Button from '~v5/shared/Button/Button.tsx';

import { DistributionMethod } from '../../../../consts.tsx';

import {
  useRecipientsFieldTableColumns,
  useDistributionMethodUpdate,
} from './hooks.tsx';
import {
  type SplitPaymentRecipientsFieldModel,
  type SplitPaymentRecipientsFieldProps,
  type SplitPaymentRecipientsTableModel,
} from './types.ts';

const SplitPaymentRecipientsField: FC<SplitPaymentRecipientsFieldProps> = ({
  name,
  distributionMethod = DistributionMethod.Equal,
  token,
  amount,
}) => {
  const fieldArrayMethods = useFieldArray({
    name,
  });
  const data: SplitPaymentRecipientsTableModel[] = fieldArrayMethods.fields.map(
    ({ id }) => ({
      key: id,
    }),
  );
  const value: SplitPaymentRecipientsFieldModel[] = useWatch({ name }) || [];
  const columns = useRecipientsFieldTableColumns(
    name,
    token,
    distributionMethod,
    value,
    amount,
    fieldArrayMethods,
  );
  const isMobile = useMobile();
  const getMenuProps = ({ index }) => ({
    cardClassName: 'min-w-[9.625rem] whitespace-nowrap',
    items: [
      {
        key: 'duplicate',
        onClick: () => fieldArrayMethods.insert(index + 1, data[index]),
        label: formatText({ id: 'table.row.duplicate' }),
        icon: CopySimple,
      },
      {
        key: 'remove',
        onClick: () => fieldArrayMethods.remove(index),
        label: formatText({ id: 'table.row.remove' }),
        icon: Trash,
      },
    ],
  });
  const { getFieldState } = useFormContext();
  const fieldState = getFieldState(name);

  useDistributionMethodUpdate(
    distributionMethod,
    value,
    fieldArrayMethods,
    amount,
  );

  return (
    <div>
      <h5 className="text-2 mb-3 mt-6">
        {formatText({ id: 'actionSidebar.payments' })}
      </h5>
      {!!data.length && (
        <Table<SplitPaymentRecipientsTableModel>
          className={clsx({
            '!border-negative-400': !!fieldState.error,
          })}
          getRowId={({ key }) => key}
          columns={columns}
          data={data}
          getMenuProps={getMenuProps}
        />
      )}
      <Button
        mode="primaryOutline"
        icon={Plus}
        size="small"
        className="mt-6"
        isFullSize={isMobile}
        onClick={() => {
          fieldArrayMethods.append({
            percent: 0,
          });
        }}
      >
        <FormattedMessage id="button.addRecipient" />
      </Button>
    </div>
  );
};

export default SplitPaymentRecipientsField;
