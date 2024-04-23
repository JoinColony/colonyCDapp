import React, { type Dispatch, type SetStateAction, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { useGetTokenFromEverywhereQuery } from '~gql';
import { createAddress, isAddress } from '~utils/web3/index.ts';
import Input, { type InputProps } from '~v5/common/Fields/Input/index.ts';

const displayName = 'shared.TokenSelector';

interface Props extends Omit<InputProps, 'name'> {
  /** Name of token address input. Defaults to 'tokenAddress' */
  addressFieldName?: string;
  /** Name of token field. Defaults to 'token' */
  tokenFieldName?: string;
  /** Is loading state */
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

const TokenSelector = ({
  addressFieldName = 'tokenAddress',
  tokenFieldName = 'token',
  setIsLoading,
  ...inputProps
}: Props) => {
  const {
    watch,
    formState: { dirtyFields },
    setValue,
    clearErrors,
    trigger,
  } = useFormContext();
  const tokenAddressField = watch(addressFieldName);
  const tokenAddress = isAddress(tokenAddressField)
    ? createAddress(tokenAddressField)
    : tokenAddressField;
  const { [addressFieldName]: tokenAddressDirty } = dirtyFields;

  const {
    data,
    loading: isFetchingAddress,
    /* error: fetchingTokenError, */
  } = useGetTokenFromEverywhereQuery({
    variables: {
      input: {
        tokenAddress,
      },
    },
    skip: !isAddress(tokenAddress),
  });

  const token = data?.getTokenFromEverywhere?.items?.[0] ?? null;

  useEffect(() => {
    if (isFetchingAddress) {
      setIsLoading(true);
    }
    if (data) {
      setIsLoading(false);
    }
  }, [data, isFetchingAddress, setIsLoading]);

  useEffect(() => {
    if (isFetchingAddress) {
      return;
    }

    // When token is updated (either found or null), clear errors and set the values in hook-form
    clearErrors(addressFieldName);
    setValue(tokenFieldName, token);
    trigger(addressFieldName);
  }, [
    tokenAddressField,
    addressFieldName,
    clearErrors,
    setValue,
    token,
    tokenAddressDirty,
    tokenFieldName,
    trigger,
    isFetchingAddress,
  ]);

  return (
    <Input
      name={addressFieldName}
      {...inputProps}
      setIsTyping={setIsLoading}
      shouldFocus
    />
  );
};

TokenSelector.displayName = displayName;

export default TokenSelector;
