import {
  UserFragment,
  ColonyFragment,
  ContributorFragment,
  WatcherFragment,
  TokenFragment,
  WatchListItemFragment,
  WatchedColonyFragment,
  ExtensionFragment,
  FundsClaimFragment,
  ChainFundsClaimFragment,
  DomainFragment,
  ColonyActionFragment,
  ColonyActionType,
  ModelSortDirection,
  DomainColor,
  DomainMetadataFragment,
  ColonyMetadataFragment,
  UserTokenBalanceDataFragment,
  MemberUserFragment,
  MotionDataFragment,
} from '~gql';

export type User = UserFragment;

export type Colony = ColonyFragment;

export type ColonyMetadata = ColonyMetadataFragment;

export type Contributor = ContributorFragment;

export type Watcher = WatcherFragment;

export type Domain = DomainFragment;

export type DomainMetadata = DomainMetadataFragment;

export type MotionData = MotionDataFragment;

export type Token = TokenFragment;

export type WatchListItem = WatchListItemFragment;

export type WatchedColony = WatchedColonyFragment;

export type ColonyExtension = ExtensionFragment;

export type ColonyAction = ColonyActionFragment;

export type UserTokenBalanceData = UserTokenBalanceDataFragment;

export { ColonyActionType };

export { ModelSortDirection as SortDirection };

export { DomainColor };

/*
 * Funds claims
 */
export type ColonyERC20Claims = FundsClaimFragment;

export type ColonyChainClaim = ChainFundsClaimFragment;

export type ColonyChainClaimWithToken = ChainFundsClaimFragment & {
  token?: Token;
};

export type ColonyClaims = ColonyERC20Claims | ColonyChainClaimWithToken;

export type Member = Contributor | Watcher;

export type MemberUser = MemberUserFragment;
