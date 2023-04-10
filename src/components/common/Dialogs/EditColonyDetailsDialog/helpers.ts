import { Colony } from '~types';

export const getEditColonyDetailsDialogPayload = (
  colony: Colony,
  { colonyAvatarImage, colonyDisplayName, annotationMessage },
) => ({
  colony,
  colonyDisplayName,
  colonyAvatarImage:
    typeof colonyAvatarImage === 'string' || colonyAvatarImage === null
      ? colonyAvatarImage
      : colony.metadata?.thumbnail,
  // verifiedAddresses: colonyData?.processedColony?.whitelistedAddresses,
  annotationMessage,
  // isWhitelistActivated:
  //   colonyData?.processedColony?.isWhitelistActivated,
});
