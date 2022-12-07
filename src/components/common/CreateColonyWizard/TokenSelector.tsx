import React from 'react';
import { defineMessages } from 'react-intl';
import { useFormContext } from 'react-hook-form';

import {
  HookFormInput as Input,
  HookFormInputProps as InputProps,
} from '~shared/Fields';
import { isAddress } from '~utils/web3';
import { formatText } from '~utils/intl';
import { connectionIs4G } from '~utils/network';
import { GetTokenByAddressQuery, Token, useGetTokenByAddressQuery } from '~gql';
import { DEFAULT_NETWORK_INFO } from '~constants';

import styles from './TokenSelector.css';

const displayName = 'common.CreateColonyWizard.TokenSelector';

const MSG = defineMessages({
  label: {
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
});

interface Props
  extends Pick<InputProps, 'label' | 'appearance' | 'extra' | 'disabled'> {
  /** Name of token address input. Defaults to 'tokenAddress' */
  addressField?: string;
  /** Function called when query completes successfully without an error */
  handleComplete?: (data: any) => void;
}

type TokenData = Partial<Pick<Token, 'name' | 'symbol'>>;

interface StatusTextProps {
  hasError: boolean;
  isDirty: boolean;
  tokenData: TokenData;
}
const getStatusText = ({
  hasError,
  tokenData: { name, symbol },
  isDirty,
}: StatusTextProps) => {
  const noTokenData = !name && !symbol;
  if (!isDirty && noTokenData) {
    return {
      status: MSG.hint,
      statusValues: {
        tokenExplorerLink: DEFAULT_NETWORK_INFO.tokenExplorerLink,
      },
    };
  }

  if (hasError || noTokenData) {
    return {};
  }

  return {
    status: MSG.preview,
    statusValues: { name, symbol },
  };
};

const getTokenData = (tokenQuery?: GetTokenByAddressQuery) => {
  const tokenData = tokenQuery?.getTokenByAddress?.items;
  const { name, symbol } = tokenData?.[0] || {};
  return { name, symbol };
};

const getLoadingState = (isLoading: boolean) =>
  // Don't show loading state if connection is 4G or unknown
  connectionIs4G() !== false ? false : isLoading;

const TokenSelector = ({
  handleComplete,
  extra,
  label,
  appearance,
  addressField = 'tokenAddress',
  disabled = false,
}: Props) => {
  const {
    watch,
    formState: { isValid, isDirty, isValidating },
  } = useFormContext();
  const tokenAddress = watch(addressField);

  const {
    data: tokenQuery,
    loading: isFetchingAddress,
    error: fetchingTokenError,
  } = useGetTokenByAddressQuery({
    variables: {
      address: tokenAddress,
    },
    skip: !isValid,
    onCompleted: handleComplete,
  });

  const displayLoading =
    isFetchingAddress || (isValidating && isAddress(tokenAddress));

  return (
    /**
     * @todo Define custom input component for token addresses
     */
    <div className={styles.inputWrapper}>
      <Input
        name={addressField}
        label={formatText(label) || MSG.label}
        extra={extra}
        {...getStatusText({
          isDirty,
          hasError: !isValid || !!fetchingTokenError,
          tokenData: getTokenData(tokenQuery),
        })}
        isLoading={getLoadingState(displayLoading)}
        appearance={appearance}
        disabled={disabled}
        dataTest="tokenSelectorInput"
      />
    </div>
  );
};

TokenSelector.displayName = displayName;

export default TokenSelector;
