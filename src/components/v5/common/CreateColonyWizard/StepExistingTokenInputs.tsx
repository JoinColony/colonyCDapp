import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useIntl } from 'react-intl';
import { Token } from '~types';
import { getNetworkByChainId } from '~utils/web3';

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
    watch,
    formState: { errors, isSubmitting },
  } = useFormContext();
  const { formatMessage } = useIntl();

  const token: Token | null = watch('token');

  const tokenAddressError = errors.tokenAddress?.message as string | undefined;
  const successMessage = formatMessage(
    { id: 'createColonyWizard.step.nativeToken.existingTokenSuccess' },
    {
      name: token?.name,
      symbol: token?.symbol,
      chain:
        // Need to update this when multi chain is enabled
        getNetworkByChainId(100)?.name || '',
    },
  );

  return (
    <Input
      name="tokenAddress"
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
