import { ADDRESS_ZERO } from '~constants';
import { Colony } from '~types/graphql';
import { createAddress } from '~utils/web3';

import { ManageTokensFormValues } from './consts';

export const getManageTokensPayload = (
  colony: Colony,
  values: ManageTokensFormValues,
) => {
  const {
    selectedTokenAddresses,
    description: annotationMessage,
    title,
  } = values;

  const tokenAddresses = [
    ...new Set(
      selectedTokenAddresses
        .map(({ token }) => createAddress(token))
        .filter((address) => {
          return (
            address !== ADDRESS_ZERO &&
            address !== colony.nativeToken.tokenAddress
          );
        }),
    ),
  ];

  return {
    colony,
    tokenAddresses,
    annotationMessage,
    customActionTitle: title,
  };
};
