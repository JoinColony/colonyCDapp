import { Coins, CopySimple, Plus, Trash } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC } from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useTablet } from '~hooks/index.ts';
import { formatText } from '~utils/intl.ts';
import useHasNoDecisionMethods from '~v5/common/ActionSidebar/hooks/permissions/useHasNoDecisionMethods.ts';
import Table from '~v5/common/Table/index.ts';
import Button from '~v5/shared/Button/Button.tsx';

import { useRecipientsFieldTableColumns } from './hooks.tsx';
import {
  type PaymentBuilderRecipientsTableModel,
  type PaymentBuilderRecipientsFieldProps,
  type PaymentBuilderRecipientsFieldModel,
} from './types.ts';

const displayName =
  'v5.common.ActionsContent.partials.PaymentBuilderRecipientsField';

const PaymentBuilderRecipientsField: FC<PaymentBuilderRecipientsFieldProps> = ({
  name,
}) => {
  const {
    colony: { nativeToken },
  } = useColonyContext();
  const fieldArrayMethods = useFieldArray({
    name,
  });
  const hasNoDecisionMethods = useHasNoDecisionMethods();

  const data: PaymentBuilderRecipientsTableModel[] =
    fieldArrayMethods.fields.map(({ id }) => ({
      key: id,
    }));
  const value: PaymentBuilderRecipientsFieldModel[] = useWatch({ name }) || [];
  const columns = useRecipientsFieldTableColumns(name, value);
  const isTablet = useTablet();
  const getMenuProps = ({ index }) => ({
    cardClassName: 'sm:min-w-[9.625rem]',
    items: [
      {
        key: 'add-token',
        onClick: () =>
          fieldArrayMethods.insert(index + 1, {
            recipient: undefined,
            amount: '',
            tokenAddress: nativeToken?.tokenAddress || '',
            delay: undefined,
          }),
        label: formatText({ id: 'button.addRow' }),
        icon: Coins,
      },
      {
        key: 'duplicate',
        onClick: () =>
          fieldArrayMethods.insert(index + 1, {
            ...value[index],
          }),
        label: formatText({ id: 'table.row.duplicate' }),
        icon: CopySimple,
      },
      ...(value.length > 1
        ? [
            {
              key: 'remove',
              onClick: () => fieldArrayMethods.remove(index),
              label: formatText({ id: 'table.row.remove' }),
              icon: Trash,
            },
          ]
        : []),
    ],
  });
  const { getFieldState } = useFormContext();
  const fieldState = getFieldState(name);

  return (
    <div>
      <h5 className="mb-3 mt-6 text-2">
        {formatText({ id: 'actionSidebar.payments' })}
      </h5>
      {!!data.length && !hasNoDecisionMethods && (
        <Table<PaymentBuilderRecipientsTableModel>
          className={clsx('[&_tfoot_td]:py-2 [&_tfoot_td]:align-top', {
            '!border-negative-400': !!fieldState.error,
          })}
          verticalLayout={isTablet}
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
        className="mt-6 w-full sm:w-auto"
        onClick={() => {
          fieldArrayMethods.append({
            recipient: undefined,
            amount: '',
            tokenAddress: nativeToken?.tokenAddress || '',
            delay: undefined,
          });
        }}
        disabled={hasNoDecisionMethods}
      >
        {formatText({ id: 'button.addPayment' })}
      </Button>
    </div>
  );
};

PaymentBuilderRecipientsField.displayName = displayName;

export default PaymentBuilderRecipientsField;
