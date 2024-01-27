import { ADDRESS_ZERO } from '~constants/index.ts';
import { Colony } from '~types/graphql.ts';
import { createAddress } from '~utils/web3/index.ts';

import { ManageTokensFormValues } from './consts.ts';

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
