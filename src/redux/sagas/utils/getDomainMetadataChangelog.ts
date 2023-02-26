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
      newName,
      oldName: newName ? metadata.name : null,
      newColor,
      oldColor: newColor ? metadata.color : null,
      newDescription,
      oldDescription: newDescription ? metadata.description : null,
    },
  ];
};
