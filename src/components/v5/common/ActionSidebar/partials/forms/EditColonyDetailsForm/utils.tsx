import { type Colony } from '~types/graphql.ts';
import { sanitizeHTML } from '~utils/strings.ts';

import { type EditColonyDetailsFormValues } from './types.ts';

export const getEditColonyDetailsPayload = (
  colony: Colony,
  values: EditColonyDetailsFormValues,
) => {
  const {
    colonyName: colonyDisplayName,
    colonyDescription,
    avatar,
    externalLinks,
    description: annotationMessage,
    title,
  } = values;
  const { image: colonyAvatarImage, thumbnail: colonyThumbnail } = avatar ?? {};

  return {
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
    colonyExternalLinks: externalLinks || [],
    annotationMessage: annotationMessage
      ? sanitizeHTML(annotationMessage)
      : undefined,
    customActionTitle: title,
  };
};
