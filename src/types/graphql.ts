import {
  UserFragment,
  ColonyFragment,
  ContributorFragment,
  WatcherFragment,
  TokenFragment,
  WatchListItemFragment,
  WatchedColonyFragment,
  MemberUserFragment,
} from '~gql';

export type User = UserFragment;

export type Colony = ColonyFragment;

export type Contributor = ContributorFragment;

export type Watcher = WatcherFragment;

export type Token = TokenFragment;

export type WatchListItem = WatchListItemFragment;

export type WatchedColony = WatchedColonyFragment;

export type Member = Contributor | Watcher;

export type MemberUser = MemberUserFragment;
