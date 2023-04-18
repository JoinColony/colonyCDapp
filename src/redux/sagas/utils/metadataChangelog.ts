import { DomainColor, DomainMetadataChangelogInput, ColonyMetadataChangelogInput } from '~gql';
import { ColonyMetadata, DomainMetadata } from '~types';
import { excludeTypenameKey } from '~utils/objects';

const getExistingChangelog = <T extends { __typename?: string }>(changelog?: T[] | null) =>
  changelog?.map((changelogItem) => excludeTypenameKey(changelogItem)) ?? [];

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
): ColonyMetadataChangelogInput[] => {
  const existingChangelog = getExistingChangelog(metadata.changelog);

  return [
    ...existingChangelog,
    {
      transactionHash,
      newDisplayName: newDisplayName ?? metadata.displayName,
      oldDisplayName: metadata.displayName,
      // @TODO: Actually check whether the avatar has changed
      hasAvatarChanged: false,
    },
  ];
};
