import clsx from 'clsx';
import React, { FC } from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';

import { useColonyContext, useMobile } from '~hooks';
import { formatText } from '~utils/intl';
import TableWithMeatballMenu from '~v5/common/TableWithMeatballMenu';
import Button from '~v5/shared/Button/Button';

import { useRecipientsFieldTableColumns, useGetTableMenuProps } from './hooks';
import {
  AdvancedPaymentRecipientsTableModel,
  AdvancedPaymentRecipientsFieldProps,
  AdvancedPaymentRecipientsFieldModel,
} from './types';

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
  const getMenuProps = useGetTableMenuProps(fieldArrayMethods, value);
  const { getFieldState } = useFormContext();
  const fieldState = getFieldState(name);

  return (
    <div>
      <h5 className="text-2 mb-3 mt-6">
        {formatText({ id: 'actionSidebar.additionalPayments' })}
      </h5>
      {!!data.length && (
        <TableWithMeatballMenu<AdvancedPaymentRecipientsTableModel>
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
