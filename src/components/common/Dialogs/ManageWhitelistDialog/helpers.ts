import { Action, ActionTypes } from '~redux';
import { Address, Colony } from '~types';
import { notNull } from '~utils/arrays';
import { createAddress } from '~utils/web3';
import { difference } from '~utils/lodash';

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
    whitelistedAddresses: updatedWhitelist,
    whitelistCSVUploader,
    isWhitelistActivated,
  },
): ManageWhitelistDialogPayload => {
  const colonyTokens = colony.tokens?.items.filter(notNull) || [];
  let removedAddresses: Address[] = [];
  let verifiedAddresses: Address[];
  let whitelistActivated = false;
  if (tabIndex === TABS.WHITELISTED) {
    verifiedAddresses = updatedWhitelist;
    whitelistActivated = isWhitelistActivated;
    const oldWhitelist = colony.metadata?.whitelistedAddresses ?? [];
    // You can only remove addresses in this tab, therefore the difference
    // are the addresses that have been removed
    removedAddresses = difference(oldWhitelist, updatedWhitelist);
  } else {
    verifiedAddresses =
      whitelistAddress !== undefined
        ? [...new Set([...updatedWhitelist, createAddress(whitelistAddress)])]
        : [
            ...new Set([
              ...updatedWhitelist,
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
    removedAddresses,
    // @TODO: Connect with real title value
    customActionTitle: '',
  };
};
