import omitDeep from 'omit-deep-lodash';

import {
  DomainColor,
  DomainMetadataChangelogInput,
  ColonyMetadataChangelogInput,
} from '~gql';
import { ColonyMetadata, DomainMetadata, Safe } from '~types';
import { notNull } from '~utils/arrays';
import { excludeTypenameKey } from '~utils/objects';

const getExistingChangelog = <T extends { __typename?: string }>(
  changelog?: T[] | null,
) =>
  changelog?.map((changelogItem) => omitDeep(changelogItem, '__typename')) ??
  [];

export const getUpdatedDomainMetadataChangelog = (
  transactionHash: string,
  metadata: DomainMetadata,
  newName?: string,
  newColor?: DomainColor,
  newDescription?: string,
): DomainMetadataChangelogInput[] => {
  const existingChangelog = getExistingChangelog(metadata.changelog);

  return [
    ...existingChangelog,
    {
      transactionHash,
      newName: newName ?? metadata.name,
      oldName: metadata.name,
      newColor: newColor ?? metadata.color,
      oldColor: metadata.color,
      newDescription: newDescription ?? metadata.description,
      oldDescription: metadata.description,
    },
  ];
};

export const getUpdatedColonyMetadataChangelog = (
  transactionHash: string,
  metadata: ColonyMetadata,
  newDisplayName?: string,
  newAvatarImage?: string | null,
  hasWhitelistChanged = false,
  haveTokensChanged = false,
  hasDescriptionChanged = false,
  haveExternalLinksChanged = false,
  hasObjectiveChanged = false,
  newSafes?: Safe[],
): ColonyMetadataChangelogInput[] => {
  const existingChangelog = getExistingChangelog(metadata.changelog);
  const currentColonySafes =
    metadata.safes?.filter(notNull).map(excludeTypenameKey) || [];

  return [
    ...existingChangelog,
    {
      transactionHash,
      newDisplayName: newDisplayName ?? metadata.displayName,
      oldDisplayName: metadata.displayName,
      hasAvatarChanged:
        newAvatarImage === undefined
          ? false
          : newAvatarImage !== metadata.avatar,
      hasWhitelistChanged,
      haveTokensChanged,
      hasDescriptionChanged,
      haveExternalLinksChanged,
      hasObjectiveChanged,
      newSafes: newSafes ?? currentColonySafes,
      oldSafes: currentColonySafes,
    },
  ];
};
