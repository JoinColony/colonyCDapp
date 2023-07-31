import { Colony } from '~types';

export const getEditColonyDetailsDialogPayload = (
  colony: Colony,
  { colonyAvatarImage, colonyDisplayName, annotationMessage, colonyThumbnail },
) => ({
  colony,
  colonyDisplayName,
  colonyAvatarImage:
    typeof colonyAvatarImage === 'string' || colonyAvatarImage === null
      ? colonyAvatarImage
      : colony.metadata?.avatar,
  colonyThumbnail:
    typeof colonyThumbnail === 'string' || colonyThumbnail === null
      ? colonyThumbnail
      : colony.metadata?.thumbnail,
  annotationMessage,
});
