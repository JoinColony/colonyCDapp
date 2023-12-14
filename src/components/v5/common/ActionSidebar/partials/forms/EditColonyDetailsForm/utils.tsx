import { DeepPartial } from 'utility-types';

import { ColonyActionType } from '~gql';
import { Colony } from '~types';
import { DecisionMethod } from '~v5/common/ActionSidebar/hooks';
import { DescriptionMetadataGetter } from '~v5/common/ActionSidebar/types';

import { EditColonyDetailsFormValues } from './consts';

export const editColonyDetailsDescriptionMetadataGetter: DescriptionMetadataGetter<
  DeepPartial<EditColonyDetailsFormValues>
> = async ({ decisionMethod }, { getActionTitleValues }) => {
  return getActionTitleValues({
    type:
      decisionMethod === DecisionMethod.Permissions
        ? ColonyActionType.ColonyEdit
        : ColonyActionType.ColonyEditMotion,
  });
};

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
    colonyExternalLinks: externalLinks.map(({ url, linkType }) => ({
      link: url,
      name: linkType,
    })),
    annotationMessage,
    customActionTitle: title,
  };
};
