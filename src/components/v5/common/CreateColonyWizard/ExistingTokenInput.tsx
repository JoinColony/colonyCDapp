import React from 'react';
import { useFormContext } from 'react-hook-form';
import { defineMessages, useIntl } from 'react-intl';

import { Token } from '~types';
import { getNetworkByChainId } from '~utils/web3';

import TokenSelector from './TokenSelector';

const displayName = 'common.CreateColonyWizard.TokenSelector';

interface TokenSelectorInputProps {
  wizardTokenAddress: string;
}

const MSG = defineMessages({
  existingToken: {
    id: `${displayName}.existingToken`,
    defaultMessage: 'Existing token address',
  },
  existingTokenSuccess: {
    id: `${displayName}.existingTokenSuccess`,
    defaultMessage: 'Token found: {name} ({symbol}) on {chain}',
  },
});

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
  const successMessage = formatMessage(MSG.existingTokenSuccess, {
    name: token?.name,
    symbol: token?.symbol,
    chain:
      // Need to update this when multi chain is enabled
      getNetworkByChainId(100)?.name || '',
  });

  return (
    <TokenSelector
      register={register}
      isError={!!tokenAddressError}
      customErrorMessage={tokenAddressError}
      className="text-md border-gray-300"
      isDisabled={isSubmitting}
      defaultValue={wizardTokenAddress}
      labelMessage={MSG.existingToken}
      successfulMessage={token?.name ? successMessage : undefined}
      isDecoratedError
    />
  );
};

TokenSelectorInput.displayName = displayName;
export default TokenSelectorInput;
