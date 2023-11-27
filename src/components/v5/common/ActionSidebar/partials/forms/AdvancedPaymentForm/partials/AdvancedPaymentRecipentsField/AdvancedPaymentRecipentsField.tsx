import React, { FC } from 'react';
import { FormattedMessage } from 'react-intl';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import clsx from 'clsx';

import Button from '~v5/shared/Button/Button';
import { useColonyContext, useMobile } from '~hooks';
import TableWithMeatballMenu from '~v5/common/TableWithMeatballMenu';
import { useRecipientsFieldTableColumns, useGetTableMenuProps } from './hooks';
import {
  AdvancedPaymentRecipentsTableModel,
  AdvancedPaymentRecipentsFieldProps,
  AdvancedPaymentRecipentsFieldModel,
} from './types';
import { formatText } from '~utils/intl';

const displayName =
  'v5.common.ActionsContent.partials.AdvancedPaymentRecipentsField';

const AdvancedPaymentRecipentsField: FC<AdvancedPaymentRecipentsFieldProps> = ({
  name,
}) => {
  const { nativeToken } = useColonyContext().colony || {};
  const fieldArrayMethods = useFieldArray({
    name,
  });
  const data: AdvancedPaymentRecipentsTableModel[] =
    fieldArrayMethods.fields.map(({ id }) => ({
      key: id,
    }));
  const value: AdvancedPaymentRecipentsFieldModel[] = useWatch({ name }) || [];
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
        <TableWithMeatballMenu<AdvancedPaymentRecipentsTableModel>
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

AdvancedPaymentRecipentsField.displayName = displayName;

export default AdvancedPaymentRecipentsField;
