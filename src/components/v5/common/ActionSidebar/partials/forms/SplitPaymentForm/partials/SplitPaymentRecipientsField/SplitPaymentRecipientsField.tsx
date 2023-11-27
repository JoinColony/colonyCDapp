import clsx from 'clsx';
import React, { FC } from 'react';
import { useFieldArray, useWatch, useFormContext } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { useMobile } from '~hooks';
import Button from '~v5/shared/Button/Button';
import { formatText } from '~utils/intl';
import TableWithMeatballMenu from '~v5/common/TableWithMeatballMenu';
import {
  useRecipientsFieldTableColumns,
  useGetTableMenuProps,
  useDistributionMethodUpdate,
} from './hooks';
import {
  SplitPaymentRecipientsFieldModel,
  SplitPaymentRecipientsFieldProps,
  SplitPaymentRecipientsTableModel,
} from './types';
import { DISTRIBUTION_METHOD } from '../../../../consts';

const SplitPaymentRecipientsField: FC<SplitPaymentRecipientsFieldProps> = ({
  name,
  distributionMethod = DISTRIBUTION_METHOD.Equal,
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
  const getMenuProps = useGetTableMenuProps(fieldArrayMethods, value);
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
        <TableWithMeatballMenu<SplitPaymentRecipientsTableModel>
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
