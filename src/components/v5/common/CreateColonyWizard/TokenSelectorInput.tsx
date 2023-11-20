import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { defineMessages, useIntl } from 'react-intl';

import { Token } from '~types';
import { getNetworkByChainId } from '~utils/web3';
import Icon from '~shared/Icon';

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
    formState: { errors, isSubmitting },
  } = useFormContext();
  const { formatMessage } = useIntl();
  const [isLoading, setIsLoading] = useState(false);

  const token: Token | null = watch('token');

  const tokenAddressError = errors.tokenAddress?.message as string | undefined;
  const successMessage = formatMessage(MSG.existingTokenSuccess, {
    name: token?.name,
    symbol: token?.symbol,
    chain:
      // Need to update this when multi chain is enabled
      getNetworkByChainId(100)?.name || '',
  });

  const doesTokenExistError = errors.tokenAddress?.type === 'doesTokenExist';

  return (
    <div className="flex flex-col">
      <TokenSelector
        register={register}
        isError={!!tokenAddressError}
        customErrorMessage={tokenAddressError}
        className="text-md border-gray-300"
        isDisabled={isSubmitting}
        defaultValue={wizardTokenAddress}
        labelMessage={MSG.existingToken}
        successfulMessage={token?.name ? successMessage : undefined}
        setIsLoading={setIsLoading}
        isDecoratedError
      />

      {doesTokenExistError && isLoading === false && (
        <div className="mt-14 px-6 py-3 bg-warning-100 border rounded border-warning-200 text-gray-900">
          <p className="flex self-start items-center gap-2 text-md pb-1">
            <span className="text-warning-400 flex">
              <Icon name="warning-circle" appearance={{ size: 'small' }} />
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
