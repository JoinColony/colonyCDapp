import React, { type FC } from 'react';
import { useFormContext } from 'react-hook-form';

import { SplitPaymentDistributionType } from '~gql';
import { formatText } from '~utils/intl.ts';
import FormInputBase from '~v5/common/Fields/InputBase/FormInputBase.tsx';

import { type SplitPaymentPercentFieldProps } from './types.ts';

const SplitPaymentPercentField: FC<SplitPaymentPercentFieldProps> = ({
  name,
  disabled,
  onBlur,
}) => {
  const { watch, setValue } = useFormContext();
  const distributionMethod = watch('distributionMethod');

  return (
    <FormInputBase
      name={name}
      autoWidth
      onBlur={onBlur}
      onChange={() => {
        if (distributionMethod !== SplitPaymentDistributionType.Unequal) {
          setValue('distributionMethod', SplitPaymentDistributionType.Unequal);
        }
      }}
      wrapperClassName="flex-row flex text-md"
      inputWrapperClassName="flex items-center gap-2"
      type="text"
      shouldAllowOnlyNumbers
      mode="secondary"
      placeholder={formatText({ id: 'actionSidebar.enterValue' })}
      suffix="%"
      disabled={disabled}
      message={false}
    />
  );
};

export default SplitPaymentPercentField;
