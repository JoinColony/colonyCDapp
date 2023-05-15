import { ADDRESS_ZERO } from '~constants';
import { Colony } from '~types';
import { createAddress } from '~utils/web3';

import { FormValues } from './TokenManagementDialog';

export const getTokenManagementDialogPayload = (
  colony: Colony,
  { tokenAddress, selectedTokenAddresses, annotationMessage }: FormValues,
) => {
  let addresses = selectedTokenAddresses ?? [];
  if (tokenAddress && !selectedTokenAddresses?.includes(tokenAddress)) {
    addresses.push(tokenAddress);
  }
  addresses = [
    ...new Set(
      addresses
        .map((address) => createAddress(address))
        .filter((address) => {
          if (
            address === ADDRESS_ZERO ||
            address === colony.nativeToken.tokenAddress
          ) {
            return false;
          }
          return true;
        }),
    ),
  ];
  return {
    colony,
    tokenAddresses: addresses,
    annotationMessage,
  };
};
