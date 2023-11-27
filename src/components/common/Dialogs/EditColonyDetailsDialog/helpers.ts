import { Colony } from '~types';

export const getEditColonyDetailsDialogPayload = (
  colony: Colony,
  {
    colonyAvatarImage,
    colonyDisplayName,
    annotationMessage,
    colonyThumbnail,
    colonyDescription,
    externalLinks,
  },
) => ({
  colony,
  colonyDisplayName,
  colonyDescription,
  colonyAvatarImage:
    typeof colonyAvatarImage === 'string' || colonyAvatarImage === null
      ? colonyAvatarImage
      : colony.metadata?.avatar,
  colonyThumbnail:
    typeof colonyThumbnail === 'string' || colonyThumbnail === null
      ? colonyThumbnail
      : colony.metadata?.thumbnail,
  // remove typename field if present
  colonyExternalLinks: externalLinks.map(({ link, name }) => ({
    link,
    name,
  })),
  annotationMessage,
  customActionTitle: '',
});
