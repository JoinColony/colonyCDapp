import React, { type FC } from 'react';
import { useFormContext } from 'react-hook-form';

import { SplitPaymentDistributionType } from '~gql';
import { formatText } from '~utils/intl.ts';
import AmountField from '~v5/common/ActionSidebar/partials/AmountField/AmountField.tsx';

import { type SplitPaymentAmountFieldProps } from './types.ts';

const SplitPaymentAmountField: FC<SplitPaymentAmountFieldProps> = ({
  name,
  tokenAddressFieldName,
  onBlur,
  isDisabled,
}) => {
  const { watch, setValue } = useFormContext();
  const selectedTeam = watch('from');
  const distributionMethod = watch('distributionMethod');

  return (
    <AmountField
      name={name}
      tokenAddressFieldName={tokenAddressFieldName}
      domainId={selectedTeam}
      placeholder={formatText({ id: 'actionSidebar.enterAmount' })}
      isTokenSelectionDisabled
      onBlur={onBlur}
      onChange={() => {
        if (distributionMethod !== SplitPaymentDistributionType.Unequal) {
          setValue('distributionMethod', SplitPaymentDistributionType.Unequal);
        }
      }}
      isDisabled={isDisabled}
    />
  );
};

export default SplitPaymentAmountField;
