import { ModelUserFilterInput } from '~gql';
import { Action, ActionTypes } from '~redux';
import { Address, Colony } from '~types';
import { notNull } from '~utils/arrays';

export enum TABS {
  ADD_ADDRESS = 0,
  WHITELISTED = 1,
}

type ManageWhitelistDialogPayload =
  Action<ActionTypes.ACTION_VERIFIED_RECIPIENTS_MANAGE>['payload'];

export const getManageWhitelistDialogPayload = (
  colony: Colony,
  tabIndex: number,
  {
    annotation: annotationMessage,
    whitelistAddress,
    whitelistedAddresses,
    whitelistCSVUploader,
    isWhitelistActivated,
  },
): ManageWhitelistDialogPayload => {
  const colonyTokens = colony.tokens?.items.filter(notNull) || [];
  let verifiedAddresses: Address[];
  let whitelistActivated = false;
  if (tabIndex === TABS.WHITELISTED) {
    verifiedAddresses = whitelistedAddresses;
    whitelistActivated = isWhitelistActivated;
  } else {
    verifiedAddresses =
      whitelistAddress !== undefined
        ? [...new Set([...whitelistedAddresses, whitelistAddress])]
        : [
            ...new Set([
              ...whitelistedAddresses,
              ...whitelistCSVUploader.parsedData,
            ]),
          ];

    if (verifiedAddresses.length) {
      whitelistActivated = true;
    }
  }
  return {
    colony,
    colonyDisplayName: colony.metadata?.displayName ?? '',
    colonyTokenAddresses: colonyTokens.map(
      (token) => token?.token.tokenAddress,
    ),
    verifiedAddresses,
    isWhitelistActivated: whitelistActivated,
    annotationMessage,
  };
};

export const getWhitelistedAddressesQueryFilter = (
  whitelistedAddresses: string[],
): ModelUserFilterInput => {
  if (whitelistedAddresses.length === 1) {
    return {
      id: {
        eq: whitelistedAddresses[0],
      },
    };
  }

  return {
    or: whitelistedAddresses.map((address) => ({ id: { eq: address } })),
  };
};
