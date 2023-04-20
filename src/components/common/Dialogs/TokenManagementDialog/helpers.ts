import { ADDRESS_ZERO } from '~constants';
import { Colony } from '~types';
import { createAddress } from '~utils/web3';

export const getTokenManagementDialogPayload = (
  colony: Colony,
  { tokenAddress, selectedTokenAddresses, annotationMessage },
) => {
  let addresses = selectedTokenAddresses;
  if (tokenAddress && !selectedTokenAddresses.includes(tokenAddress)) {
    addresses.push(tokenAddress);
  }
  addresses = [
    ...new Set(
      addresses
        .map((address) => createAddress(address))
        .filter((address) => {
          if (address === ADDRESS_ZERO || address === colony.nativeToken.tokenAddress) {
            return false;
          }
          return true;
        }),
    ),
  ];
  return {
    colonyAddress: colony.colonyAddress,
    colonyName: colony.name,
    colonyDisplayName: colony.profile?.displayName,
    colonyAvatarImage: colony.profile?.thumbnail,
    colonyAvatarHash: colony.profile?.avatar,
    hasAvatarChanged: false,
    colonyTokens: addresses,
    // verifiedAddresses: whitelistedAddresses,
    annotationMessage,
    // isWhitelistActivated,
  };
};
