import {
  type UserFragment,
  type ColonyFragment,
  type TokenFragment,
  type ExtensionFragment,
  type FundsClaimFragment,
  type ChainFundsClaimFragment,
  type DomainFragment,
  type ColonyActionFragment,
  ColonyActionType,
  ModelSortDirection,
  DomainColor,
  type DomainMetadataFragment,
  type ColonyMetadataFragment,
  type UserTokenBalanceDataFragment,
  type ColonyBalanceFragment,
  type ColonyBalancesFragment,
  type ColonyTokensConnectionFragment,
  type ColonyMotionFragment,
  type MotionMessageFragment,
  type MotionStakesFragment,
  type VoterRecordFragment,
  type UnclaimedStakesFragment,
  type AnnotationFragment,
  type ColonyDecisionFragment,
  type ColonyContributorFragment,
  type ContributorReputationFragment,
  type ContributorRolesFragment,
  TransactionStatus,
  type TransactionFragment,
  type ExpenditureFragment,
  type ExpenditureSlotFragment,
  type ExpenditurePayoutFragment,
  type ColonyObjectiveFragment,
  type SafeFragment,
  type SafeTransactionDataFragment,
  SafeTransactionType,
  type NftDataFragment,
  type FunctionParamFragment,
  type SafeTransactionFragment,
  type UserStakeFragment,
  SearchableSortDirection,
  type JoinedColonyFragment,
  type UserMotionStakesFragment,
  type NativeTokenStatusFragment,
  type BridgeBankAccountFragment,
  type ApprovedTokenChangesFragment,
  type BridgeDrainFragment,
  type JoinedColonyWithExtensionsFragment,
  type ColonyRoleFragment,
  type MultiSigUserSignatureFragment,
  type ColonyMultiSigFragment,
  type ExpenditureActionFragment,
  type ExpenditureStageFragment,
} from '~gql';

export type AnnotationType = AnnotationFragment;

export type ColonyDecision = ColonyDecisionFragment;

export type ColonyContributor = ColonyContributorFragment;

export type ContributorReputation = ContributorReputationFragment;

export type ContributorRoles = ContributorRolesFragment;

export type User = UserFragment;

export type Colony = ColonyFragment;

export type ColonyMetadata = ColonyMetadataFragment;

export type Domain = DomainFragment;

export type DomainMetadata = DomainMetadataFragment;

export type ColonyMotion = ColonyMotionFragment;

export type MotionMessage = MotionMessageFragment;

export type Token = TokenFragment;

export type Transaction = TransactionFragment;

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

export type ExpenditureAction = ExpenditureActionFragment;

export type ExpenditureStage = ExpenditureStageFragment;

export type Safe = SafeFragment;

export type SafeTransaction = SafeTransactionFragment;

export type SafeTransactionData = SafeTransactionDataFragment;

export type NFTData = NftDataFragment;

export type FunctionParam = FunctionParamFragment;

export { SafeTransactionType };

export type ColonyObjective = ColonyObjectiveFragment;

export type UserStake = UserStakeFragment;

export type JoinedColony = JoinedColonyFragment;

export type JoinedColonyWithExtensions = JoinedColonyWithExtensionsFragment;

export type UserMotionStakes = UserMotionStakesFragment;

export type NativeTokenStatus = NativeTokenStatusFragment;

export type BridgeBankAccount = BridgeBankAccountFragment;

export type BridgeDrain = BridgeDrainFragment;

export type ApprovedTokenChanges = ApprovedTokenChangesFragment;
export type ColonyRole = ColonyRoleFragment;

export type MultiSigUserSignature = MultiSigUserSignatureFragment;

export type ColonyMultiSig = ColonyMultiSigFragment;
