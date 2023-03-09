import {
  UserFragment,
  ColonyFragment,
  WatcherFragment,
  TokenFragment,
  WatchListItemFragment,
  WatchedColonyFragment,
  ExtensionFragment,
  DomainFragment,
  ColonyActionFragment,
  ColonyActionType,
  ModelSortDirection,
  DomainColor,
  DomainMetadataFragment,
  ColonyMetadataFragment,
} from '~gql';

export type User = UserFragment;

export type Colony = ColonyFragment;

export type ColonyMetadata = ColonyMetadataFragment;

export type ColonyWatcher = WatcherFragment;

export type Domain = DomainFragment;

export type DomainMetadata = DomainMetadataFragment;

export type Token = TokenFragment;

export type WatchListItem = WatchListItemFragment;

export type WatchedColony = WatchedColonyFragment;

export type ColonyExtension = ExtensionFragment;

export type ColonyAction = ColonyActionFragment;

export { ColonyActionType };

export { ModelSortDirection as SortDirection };

export { DomainColor };
