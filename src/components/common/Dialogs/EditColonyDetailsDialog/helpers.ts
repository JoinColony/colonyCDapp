import { Colony } from '~types';

export const getEditColonyDetailsDialogPayload = (
  colony: Colony,
  {
    colonyAvatarImage,
    colonyDisplayName: payloadDisplayName,
    annotationMessage,
  },
) => {
  const colonyTokens = colony.tokens?.items || [];

  return {
    colonyAddress: colony.colonyAddress,
    colonyName: colony.name,
    colonyDisplayName: payloadDisplayName,
    colonyAvatarImage:
      typeof colonyAvatarImage === 'string' || colonyAvatarImage === null
        ? colonyAvatarImage
        : colony.metadata?.thumbnail,
    colonyAvatarHash: colony.metadata?.avatar,
    hasAvatarChanged: !!(
      typeof colonyAvatarImage === 'string' || colonyAvatarImage === null
    ),
    colonyTokens: colonyTokens.filter(
      (colonyToken) =>
        colonyToken?.token.tokenAddress !== colony.nativeToken.tokenAddress,
    ),
    // verifiedAddresses: colonyData?.processedColony?.whitelistedAddresses,
    annotationMessage,
    // isWhitelistActivated:
    //   colonyData?.processedColony?.isWhitelistActivated,
  };
};
