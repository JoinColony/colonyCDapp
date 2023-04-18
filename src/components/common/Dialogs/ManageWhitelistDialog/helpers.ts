import { Address, Colony } from '~types';

export enum TABS {
  ADD_ADDRESS = 0,
  WHITELISTED = 1,
}

export const getManageWhitelistDialogPayload = (
  colony: Colony,
  tabIndex: number,
  {
    annotation: annotationMessage,
    // whitelistAddress,
    whitelistedAddresses,
    // whitelistCSVUploader,
    isWhitelistActivated,
  },
) => {
  const { name: colonyName, tokens, nativeToken, colonyAddress } = colony;
  const colonyTokens = tokens?.items || [];
  let verifiedAddresses: Address[];
  let whitelistActivated = false;
  if (tabIndex === TABS.WHITELISTED) {
    verifiedAddresses = whitelistedAddresses;
    whitelistActivated = isWhitelistActivated;
  } else {
    verifiedAddresses = [];
    // whitelistAddress !== undefined
    //   ? [...new Set([...storedVerifiedRecipients, whitelistAddress])]
    //   : [
    //       ...new Set([
    //         ...storedVerifiedRecipients,
    //         ...whitelistCSVUploader[0].parsedData,
    //       ]),
    //     ];
    if (verifiedAddresses.length) {
      whitelistActivated = true;
    }
  }
  return {
    colonyAddress,
    colonyDisplayName: colony.metadata?.displayName,
    colonyAvatarHash: colony.metadata?.avatar,
    verifiedAddresses,
    isWhitelistActivated: whitelistActivated,
    annotationMessage,
    colonyName,
    colonyTokens: colonyTokens.filter((token) => token?.token.tokenAddress !== nativeToken.tokenAddress),
  };
};
