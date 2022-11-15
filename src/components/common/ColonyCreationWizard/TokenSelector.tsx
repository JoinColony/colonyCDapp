import React, { useCallback, useEffect, ReactNode } from 'react';
import { defineMessages, MessageDescriptor, useIntl } from 'react-intl';
import { gql, useLazyQuery } from '@apollo/client';

import { Input } from '~shared/Fields';
import { Appearance } from '~shared/Fields/Input/Input';

import { usePrevious } from '~hooks';
import { isAddress } from '~utils/web3';
import {
  getTokenByAddress as getTokenByAddressDocument,
  GetTokenByAddressQuery,
  GetTokenByAddressQueryVariables,
  Token,
} from '~gql';
import { DEFAULT_NETWORK_INFO } from '~constants';

import styles from './TokenSelector.css';

const displayName = 'common.CreateColonyWizard.TokenSelector';

const MSG = defineMessages({
  inputLabel: {
    id: `${displayName}.label`,
    defaultMessage: 'Token Address',
  },
  hint: {
    id: `${displayName}.hint`,
    defaultMessage: 'You can find them here: {tokenExplorerLink}',
  },
  preview: {
    id: `${displayName}.preview`,
    defaultMessage: '{name} ({symbol})',
  },
  statusLoading: {
    id: `${displayName}.statusLoading`,
    defaultMessage: 'Loading token data...',
  },
  statusNotFound: {
    id: `${displayName}.statusNotFound`,
    defaultMessage:
      'Token data not found. Please check the token contract address.',
  },
});

interface Props {
  tokenAddress: string;
  onTokenSelect: (checkingAddress: boolean, token?: Token | null) => void;
  onTokenSelectError: (arg: boolean) => void;
  tokenSelectorHasError: boolean;
  isLoadingAddress: boolean;
  tokenData?: Token;
  label?: string | MessageDescriptor;
  appearance?: Appearance;

  /** Extra node to render on the top right in the label */
  extra?: ReactNode;
  disabled?: boolean;
}

const getStatusText = (
  hasError: boolean,
  isLoadingAddress: boolean,
  tokenData?: Token,
) => {
  if (hasError) {
    return {};
  }
  if (isLoadingAddress) {
    return { status: MSG.statusLoading };
  }
  if (tokenData === null) {
    return { status: MSG.statusNotFound };
  }
  return tokenData
    ? {
        status: MSG.preview,
        statusValues: { name: tokenData?.name, symbol: tokenData?.symbol },
      }
    : {
        status: MSG.hint,
        statusValues: {
          tokenExplorerLink: DEFAULT_NETWORK_INFO.tokenExplorerLink,
        },
      };
};

const TokenSelector = ({
  tokenAddress,
  onTokenSelect,
  onTokenSelectError,
  tokenSelectorHasError,
  isLoadingAddress,
  tokenData,
  extra,
  label,
  appearance,
  disabled = false,
}: Props) => {
  const { formatMessage } = useIntl();

  const handleGetTokenSuccess = useCallback(
    ({ getTokenByAddress }: GetTokenByAddressQuery) => {
      const token = getTokenByAddress?.items[0];
      const { name, symbol } = token || {};
      if (!name || !symbol) {
        onTokenSelect(false, null);
        onTokenSelectError(true);
        return;
      }
      onTokenSelect(false, token);
    },
    [onTokenSelect, onTokenSelectError],
  );

  const handleGetTokenError = useCallback(() => {
    onTokenSelect(false, null);
    onTokenSelectError(true);
  }, [onTokenSelect, onTokenSelectError]);

  const [getToken] = useLazyQuery<
    GetTokenByAddressQuery,
    GetTokenByAddressQueryVariables
  >(gql(getTokenByAddressDocument), {
    variables: {
      id: tokenAddress,
    },
    onCompleted: handleGetTokenSuccess,
    onError: handleGetTokenError,
  });

  const prevTokenAddress = usePrevious(tokenAddress);

  useEffect(() => {
    /*
     * Guard against updates that don't include a new, valid `tokenAddress`,
     * or if the form is submitting or loading.
     */
    if (tokenAddress === prevTokenAddress || isLoadingAddress) return;
    if (!tokenAddress || !tokenAddress.length || !isAddress(tokenAddress)) {
      onTokenSelect(false);
      return;
    }
    /*
     * For a valid address, attempt to load token info.
     * This is setting state during `componentDidUpdate`, which is
     * generally a bad idea, but we are guarding against it by checking the state first.
     */
    onTokenSelectError(false);
    onTokenSelect(true);
    // Get the token address
    getToken();
  }, [
    tokenAddress,
    getToken,
    isLoadingAddress,
    onTokenSelect,
    onTokenSelectError,
    prevTokenAddress,
    handleGetTokenSuccess,
    handleGetTokenError,
  ]);

  const labelText =
    label && typeof label === 'object' ? formatMessage(label) : label;

  return (
    /**
     * @todo Define custom input component for token addresses
     */
    <div className={styles.inputWrapper}>
      <Input
        name="tokenAddress"
        label={labelText || MSG.inputLabel}
        extra={extra}
        {...getStatusText(tokenSelectorHasError, isLoadingAddress, tokenData)}
        appearance={appearance}
        disabled={disabled}
        forcedFieldError={
          tokenSelectorHasError ? MSG.statusNotFound : undefined
        }
        dataTest="tokenSelectorInput"
      />
    </div>
  );
};

TokenSelector.displayName = displayName;

export default TokenSelector;
