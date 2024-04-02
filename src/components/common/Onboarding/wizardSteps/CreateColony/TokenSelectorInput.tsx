import { WarningCircle } from '@phosphor-icons/react';
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { defineMessages, useIntl } from 'react-intl';

import { DEFAULT_NETWORK_INFO } from '~constants';
import { type Token } from '~types/graphql.ts';
import { getNetworkByChainId } from '~utils/web3/index.ts';

import { getInputError } from '../shared.ts';

import TokenSelector from './TokenSelector.tsx';

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
  definitelyCorrectTitle: {
    id: `${displayName}.definitelyCorrectTitel`,
    defaultMessage: 'Is the address definitely correct?',
  },
  definitelyCorrectMessage: {
    id: `${displayName}.definitelyCorrectMessage`,
    defaultMessage:
      'If you are certain that the token address is correct, it may not exist on the Gnosis Chain, try switching your wallet’s connected blockchain or continue to the next step.',
  },
});

const TokenSelectorInput = ({
  wizardTokenAddress,
}: TokenSelectorInputProps) => {
  const {
    register,
    watch,
    formState: { errors, isSubmitting, submitCount },
  } = useFormContext();
  const { formatMessage } = useIntl();
  const [isLoading, setIsLoading] = useState(false);

  const token: Token | null = watch('token');

  const { error: tokenAddressError, showError: showTokenAddressError } =
    getInputError(errors, 'tokenAddress', submitCount);

  const successMessage = formatMessage(MSG.existingTokenSuccess, {
    name: token?.name,
    symbol: token?.symbol,
    chain:
      // Need to update this when multi chain is enabled
      getNetworkByChainId(DEFAULT_NETWORK_INFO.chainId)?.name || '',
  });

  const doesTokenExistError = errors.tokenAddress?.type === 'doesTokenExist';

  return (
    <div className="flex flex-col">
      <TokenSelector
        register={register}
        isError={showTokenAddressError}
        customErrorMessage={tokenAddressError}
        className="border-gray-300 text-md"
        isDisabled={isSubmitting}
        defaultValue={wizardTokenAddress}
        labelMessage={MSG.existingToken}
        successfulMessage={token?.name ? successMessage : undefined}
        setIsLoading={setIsLoading}
        isDecoratedError
      />

      {doesTokenExistError && isLoading === false && (
        <div className="mt-14 rounded border border-warning-200 bg-warning-100 px-6 py-3 text-gray-900">
          <p className="flex items-center gap-2 self-start pb-1 text-md">
            <span className="flex text-warning-400">
              <WarningCircle size={18} />
            </span>
            <span>{formatMessage(MSG.definitelyCorrectTitle)}</span>
          </p>
          <p className="text-sm">
            {formatMessage(MSG.definitelyCorrectMessage)}
          </p>
        </div>
      )}
    </div>
  );
};

TokenSelectorInput.displayName = displayName;
export default TokenSelectorInput;
