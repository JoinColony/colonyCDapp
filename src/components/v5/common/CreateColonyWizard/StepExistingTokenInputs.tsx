import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useIntl } from 'react-intl';

import Input from '~v5/common/Fields/Input';

const displayName = 'common.CreateColonyWizard.StepExistingTokenInputs';

interface StepExistingTokenInputsProps {
  wizardTokenAddress: string;
}

const StepExistingTokenInputs = ({
  wizardTokenAddress,
}: StepExistingTokenInputsProps) => {
  const {
    register,
    formState: { errors, isSubmitting },
  } = useFormContext();
  const { formatMessage } = useIntl();

  const tokenAddressError = errors.tokenAddress?.message as string | undefined;
  const successMessage = formatMessage(
    { id: 'createColonyWizard.step.nativeToken.existingTokenSuccess' },
    // NOTE: need to get dynamically
    {
      name: 'Colony Network Token',
      symbol: 'CLNY',
      chain: 'Gnosis Chain',
    },
  );

  return (
    <Input
      name="tokenName"
      register={register}
      isError={!!tokenAddressError}
      customErrorMessage={tokenAddressError}
      className="text-md border-gray-300"
      isDisabled={isSubmitting}
      defaultValue={wizardTokenAddress}
      labelMessage={{ id: 'createColonyWizard.step.nativeToken.existingToken' }}
      successfulMessage={successMessage}
      isDecoratedError
    />
  );
};

StepExistingTokenInputs.displayName = displayName;
export default StepExistingTokenInputs;
