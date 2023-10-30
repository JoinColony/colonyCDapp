import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import Input, { InputProps } from '~v5/common/Fields/Input';
import { createAddress, isAddress } from '~utils/web3';
import { useGetTokenFromEverywhereQuery } from '~gql';

const displayName = 'shared.TokenSelector';

interface Props extends Omit<InputProps, 'name'> {
  /** Name of token address input. Defaults to 'tokenAddress' */
  addressFieldName?: string;
  /** Name of token field. Defaults to 'token' */
  tokenFieldName?: string;
}

const TokenSelector = ({
  addressFieldName = 'tokenAddress',
  tokenFieldName = 'token',
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
    /* loading: isFetchingAddress,
     * error: fetchingTokenError, */
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
    if (!tokenAddressDirty) {
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
    tokenFieldName,
  ]);

  /* const displayLoading =
   *   isFetchingAddress || (isValidating && isAddress(tokenAddress)); */

  return <Input name={addressFieldName} {...inputProps} />;
};

TokenSelector.displayName = displayName;

export default TokenSelector;
