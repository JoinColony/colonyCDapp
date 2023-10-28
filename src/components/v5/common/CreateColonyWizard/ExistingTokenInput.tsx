import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useIntl } from 'react-intl';

import { Token } from '~types';
import { getNetworkByChainId } from '~utils/web3';
import TokenSelector from '~v5/shared/TokenSelector';

const displayName = 'common.CreateColonyWizard.TokenSelector';

interface TokenSelectorInputProps {
  wizardTokenAddress: string;
}

const TokenSelectorInput = ({
  wizardTokenAddress,
}: TokenSelectorInputProps) => {
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
    <TokenSelector
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

TokenSelectorInput.displayName = displayName;
export default TokenSelectorInput;
