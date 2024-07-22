import {
  type DomainColor,
  type DomainMetadataChangelogInput,
  type ColonyMetadataChangelogInput,
  type StreamingPaymentEndCondition,
  type StreamingPaymentMetadataChangelogInput,
} from '~gql';
import {
  type StreamingPayment,
  type ColonyMetadata,
  type DomainMetadata,
  type Safe,
} from '~types/graphql.ts';
import { notNull } from '~utils/arrays/index.ts';
import { excludeTypenameKey } from '~utils/objects/index.ts';

export const getUpdatedDomainMetadataChangelog = ({
  transactionHash,
  metadata,
  newName,
  newColor,
  newDescription,
}: {
  transactionHash: string;
  metadata: DomainMetadata;
  newName?: string;
  newColor?: DomainColor;
  newDescription?: string;
}): DomainMetadataChangelogInput[] => {
  const existingChangelog = metadata.changelog ?? [];

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

export const getUpdatedColonyMetadataChangelog = ({
  transactionHash,
  metadata,
  newDisplayName,
  newAvatarImage,
  hasDescriptionChanged = false,
  haveExternalLinksChanged = false,
  newSafes,
}: {
  transactionHash: string;
  metadata: ColonyMetadata;
  newDisplayName?: string;
  newAvatarImage?: string | null;
  haveTokensChanged?: boolean;
  hasDescriptionChanged?: boolean;
  haveExternalLinksChanged?: boolean;
  newSafes?: Safe[];
}): ColonyMetadataChangelogInput[] => {
  const existingChangelog = metadata.changelog ?? [];
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
      hasDescriptionChanged,
      haveExternalLinksChanged,
      newSafes: newSafes ?? currentColonySafes,
      oldSafes: currentColonySafes,
    },
  ];
};

export const getUpdatedStreamingPaymentMetadataChangelog = ({
  transactionHash,
  metadata,
  newEndCondition,
}: {
  transactionHash: string;
  metadata: NonNullable<StreamingPayment['metadata']>;
  newEndCondition?: StreamingPaymentEndCondition;
}): StreamingPaymentMetadataChangelogInput[] => {
  const existingChangelog = metadata.changelog ?? [];

  return [
    ...existingChangelog,
    {
      transactionHash,
      newEndCondition: newEndCondition ?? metadata.endCondition,
      oldEndCondition: metadata.endCondition,
    },
  ];
};
