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
  ColonyBalanceFragment,
  ColonyBalancesFragment,
  ColonyTokensConnectionFragment,
  ColonyMotionFragment,
  MotionMessageFragment,
  MotionStakesFragment,
  VoterRecordFragment,
  UnclaimedStakesFragment,
  AnnotationFragment,
  ColonyDecisionFragment,
  ColonyContributorFragment,
  ContributorReputationFragment,
  ContributorRolesFragment,
  TransactionStatus,
  TransactionFragment,
  ExpenditureFragment,
  ExpenditureSlotFragment,
  ExpenditurePayoutFragment,
  ColonyObjectiveFragment,
  SafeFragment,
  SafeTransactionDataFragment,
  SafeTransactionType,
  NftDataFragment,
  FunctionParamFragment,
  SafeTransactionFragment,
  UserStakeFragment,
  SearchableSortDirection,
} from '~gql';

export type AnnotationType = AnnotationFragment;

export type ColonyDecision = ColonyDecisionFragment;

export type ColonyContributor = ColonyContributorFragment;

export type ContributorReputation = ContributorReputationFragment;

export type ContributorRoles = ContributorRolesFragment;

export type User = UserFragment;

export type Colony = ColonyFragment;

export type ColonyMetadata = ColonyMetadataFragment;

export type Contributor = ContributorFragment;

export type Watcher = WatcherFragment;

export type Domain = DomainFragment;

export type DomainMetadata = DomainMetadataFragment;

export type ColonyMotion = ColonyMotionFragment;

export type MotionMessage = MotionMessageFragment;

export type Token = TokenFragment;

export type Transaction = TransactionFragment;

export type WatchListItem = WatchListItemFragment;

export type WatchedColony = WatchedColonyFragment;

export type ColonyExtension = ExtensionFragment;

export type ColonyAction = ColonyActionFragment;

export type UserTokenBalanceData = UserTokenBalanceDataFragment;

export { ColonyActionType };

export { ModelSortDirection as SortDirection, SearchableSortDirection };

export { DomainColor };

export { TransactionStatus };

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

export type ColonyBalances = ColonyBalancesFragment;

export type ColonyBalance = ColonyBalanceFragment;

export type ColonyTokensConnection = ColonyTokensConnectionFragment;

type ColonyTokensConnectionItem = ColonyTokensConnectionFragment['items'][0];

export interface UnaliasedColonyTokensItem
  extends Omit<NonNullable<ColonyTokensConnectionItem>, 'colonyTokensId'> {
  /*
   * This is aliased as "colonyTokensId" in the "ColonyTokensConnection" fragment,
   * but the cache only considers canonical field names. Therefore, to ensure type safety
   * when manually modifying the cache, we must use this custom type.
   */
  id: string;
}
export type MotionStakes = MotionStakesFragment;

export type VoterRecord = VoterRecordFragment;

export type UnclaimedStakes = UnclaimedStakesFragment;

export type Expenditure = ExpenditureFragment;

export type ExpenditureSlot = ExpenditureSlotFragment;

export type ExpenditurePayout = ExpenditurePayoutFragment;

export type Safe = SafeFragment;

export type SafeTransaction = SafeTransactionFragment;

export type SafeTransactionData = SafeTransactionDataFragment;

export type NFTData = NftDataFragment;

export type FunctionParam = FunctionParamFragment;

export { SafeTransactionType };

export type ColonyObjective = ColonyObjectiveFragment;

export type UserStake = UserStakeFragment;
