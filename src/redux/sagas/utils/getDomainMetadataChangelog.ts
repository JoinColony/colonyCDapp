import { DomainColor, DomainMetadataChangelogInput } from '~gql';
import { DomainMetadata } from '~types';
import { excludeTypenameKey } from '~utils/objects';

export const getDomainMetadataChangelog = (
  transactionHash: string,
  metadata: DomainMetadata,
  newName?: string,
  newColor?: DomainColor,
  newDescription?: string,
): DomainMetadataChangelogInput[] => {
  const existingChangelog =
    metadata.changelog?.map((changelogItem) =>
      excludeTypenameKey(changelogItem),
    ) ?? [];

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
