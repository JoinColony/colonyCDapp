import clsx from 'clsx';
import React, { type FC } from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';

import { useColonyContext } from '~context/ColonyContext.tsx';
import { useMobile } from '~hooks/index.ts';
import { formatText } from '~utils/intl.ts';
import { pick } from '~utils/lodash.ts';
import Table from '~v5/common/Table/index.ts';
import Button from '~v5/shared/Button/Button.tsx';

import { useRecipientsFieldTableColumns } from './hooks.tsx';
import {
  type AdvancedPaymentRecipientsTableModel,
  type AdvancedPaymentRecipientsFieldProps,
  type AdvancedPaymentRecipientsFieldModel,
} from './types.ts';

const displayName =
  'v5.common.ActionsContent.partials.AdvancedPaymentRecipientsField';

const AdvancedPaymentRecipientsField: FC<
  AdvancedPaymentRecipientsFieldProps
> = ({ name }) => {
  const {
    colony: { nativeToken },
  } = useColonyContext();
  const fieldArrayMethods = useFieldArray({
    name,
  });
  const data: AdvancedPaymentRecipientsTableModel[] =
    fieldArrayMethods.fields.map(({ id }) => ({
      key: id,
    }));
  const value: AdvancedPaymentRecipientsFieldModel[] = useWatch({ name }) || [];
  const columns = useRecipientsFieldTableColumns(name, value);
  const isMobile = useMobile();
  const getMenuProps = ({ index }) => ({
    cardClassName: 'min-w-[9.625rem] whitespace-nowrap',
    items: [
      {
        key: 'add-token',
        onClick: () =>
          fieldArrayMethods.insert(index + 1, {
            ...pick(data[index], ['recipient', 'delay']),
          }),
        label: formatText({ id: 'button.addToken' }),
        icon: 'coins',
      },
      {
        key: 'duplicate',
        onClick: () =>
          fieldArrayMethods.insert(index + 1, {
            ...data[index],
          }),
        label: formatText({ id: 'table.row.duplicate' }),
        icon: 'copy-simple',
      },
      {
        key: 'remove',
        onClick: () => fieldArrayMethods.remove(index),
        label: formatText({ id: 'table.row.remove' }),
        icon: 'trash',
      },
    ],
  });
  const { getFieldState } = useFormContext();
  const fieldState = getFieldState(name);

  return (
    <div>
      <h5 className="text-2 mb-3 mt-6">
        {formatText({ id: 'actionSidebar.additionalPayments' })}
      </h5>
      {!!data.length && (
        <Table<AdvancedPaymentRecipientsTableModel>
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
        iconName="plus"
        size="small"
        className="mt-6"
        isFullSize={isMobile}
        onClick={() => {
          fieldArrayMethods.append({
            amount: {
              // amount: '0', // Disable default value
              tokenAddress: nativeToken?.tokenAddress || '',
            },
            delay: 0,
          });
        }}
      >
        <FormattedMessage id="button.addTransaction" />
      </Button>
    </div>
  );
};

AdvancedPaymentRecipientsField.displayName = displayName;

export default AdvancedPaymentRecipientsField;
