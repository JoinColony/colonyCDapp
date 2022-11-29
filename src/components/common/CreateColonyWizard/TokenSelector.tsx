import React, { useEffect, ReactNode } from 'react';
import { defineMessages, MessageDescriptor, useIntl } from 'react-intl';
import { useField, useFormikContext } from 'formik';

import { Input } from '~shared/Fields';
import { Appearance } from '~shared/Fields/Input/Input';

import { usePrevious } from '~hooks';
import { isAddress } from '~utils/web3';
import { Token, useGetTokenByAddressLazyQuery } from '~gql';
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
  statusLoading: {
    id: `${displayName}.statusLoading`,
    defaultMessage: 'Loading token data...',
  },
  notFoundError: {
    id: `${displayName}.notFoundError`,
    defaultMessage:
      'Token data not found. Please check the token contract address.',
  },
});

interface Props {
  /** Name of token address input */
  addressField?: string;
  /** Function called when query completes successfully without an error */
  handleComplete?: (data: any) => void;
  /** SetState function that gives parent access to query's error */
  setError?: React.Dispatch<React.SetStateAction<boolean>>;
  /** SetState function that gives parent access to query's loading state */
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  label?: string | MessageDescriptor;
  appearance?: Appearance;
  /** Extra node to render on the top right in the label */
  extra?: ReactNode;
  disabled?: boolean;
}

type TokenData = Partial<Pick<Token, 'name' | 'symbol'>>;

interface StatusTextProps {
  hasError: boolean;
  isFetchingAddress: boolean;
  addressFieldInput: string;
  tokenData: TokenData;
}
const getStatusText = ({
  hasError,
  isFetchingAddress,
  tokenData: { name, symbol },
  addressFieldInput,
}: StatusTextProps) => {
  if (hasError || (!name && !symbol)) {
    return {};
  }
  if (isFetchingAddress) {
    return { status: MSG.statusLoading };
  }
  if (!addressFieldInput) {
    return {
      status: MSG.hint,
      statusValues: {
        tokenExplorerLink: DEFAULT_NETWORK_INFO.tokenExplorerLink,
      },
    };
  }

  return {
    status: MSG.preview,
    statusValues: { name, symbol },
  };
};

const TokenSelector = ({
  handleComplete,
  setLoading,
  setError,
  extra,
  label,
  appearance,
  addressField = 'tokenAddress',
  disabled = false,
}: Props) => {
  const { formatMessage } = useIntl();
  const { validateField } = useFormikContext();

  const labelText =
    label && typeof label === 'object' ? formatMessage(label) : label;

  const [{ value: tokenAddress }] = useField<string>(addressField);

  const [
    getToken,
    {
      data: tokenQuery,
      loading: isFetchingAddress,
      error: fetchingTokenError,
      called: wasQueryCalled,
    },
  ] = useGetTokenByAddressLazyQuery();

  const tokenData = tokenQuery?.getTokenByAddress?.items;
  const { name, symbol } = tokenData?.[0] || {};
  const prevTokenAddress = usePrevious(tokenAddress);

  const fetchToken = (event: React.ChangeEvent<any>) => {
    const inputtedAddress = event.target.value;
    /*
     * Guard against updates that don't include a new, valid `tokenAddress`,
     * or if the form is submitting or loading.
     */
    const isTokenAddressValid =
      inputtedAddress !== prevTokenAddress &&
      !isFetchingAddress &&
      inputtedAddress &&
      isAddress(inputtedAddress);

    if (!isTokenAddressValid) {
      return;
    }
    setError?.(false);
    getToken({
      variables: {
        address: inputtedAddress,
      },
    });
  };

  const isFetchingError = !!fetchingTokenError;
  const isInputError =
    !isFetchingAddress &&
    isAddress(tokenAddress) &&
    !tokenData?.length &&
    wasQueryCalled;

  const hasError = isInputError || isFetchingError;

  /*
   * Use effect required here to keep parent in sync with TokenSelector
   * and to avoid setting parent state while rendering TokenSelector
   */
  useEffect(() => {
    setLoading?.(isFetchingAddress);
    setError?.(hasError);
    if (tokenQuery) {
      handleComplete?.(tokenQuery);
    }
    /*
     * If handleComplete includes some dependency on the FormikHelpers (e.g. setFieldValue),
     * it will be recreated on each render, resulting in an infinite loop.
     */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetchingAddress, hasError, tokenQuery, setError, setLoading]);

  return (
    /**
     * @todo Define custom input component for token addresses
     */
    <div className={styles.inputWrapper}>
      <Input
        name={addressField}
        label={labelText || MSG.label}
        extra={extra}
        {...getStatusText({
          addressFieldInput: tokenAddress,
          isFetchingAddress,
          hasError,
          tokenData: { name, symbol },
        })}
        onChange={(e) => {
          fetchToken(e);
          // Timeout ensures pesky formik validates with correct state
          setTimeout(() => validateField(addressField), 0);
        }}
        appearance={appearance}
        disabled={disabled}
        forcedFieldError={hasError ? MSG.notFoundError : undefined}
        dataTest="tokenSelectorInput"
      />
    </div>
  );
};

TokenSelector.displayName = displayName;

export default TokenSelector;
