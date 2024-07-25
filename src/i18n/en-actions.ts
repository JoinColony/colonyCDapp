/* eslint-disable max-len */

import { ExtendedColonyActionType } from '~types/actions.ts';
import { ColonyActionType } from '~types/graphql.ts';

const safeActionTitle = '{Safe transaction: {safeTransactionTitle}}';

const actionsMessageDescriptors = {
  'action.title': `{actionType, select,
      ${ColonyActionType.WrongColony} {Unknown Action}
      ${ColonyActionType.Payment} {Pay {recipient} {amount} {tokenSymbol} by {initiator}}
      ${ColonyActionType.PaymentMotion} {Pay {recipient} {amount} {tokenSymbol} by {initiator}}
      ${ColonyActionType.PaymentMultisig} {Pay {recipient} {amount} {tokenSymbol} by {initiator}}
      ${ColonyActionType.MultiplePayment} {Pay {recipient} {amount} {tokenSymbol} by {initiator}}
      ${ColonyActionType.MultiplePaymentMotion} {Pay {recipient} {amount} {tokenSymbol} by {initiator}}
      ${ColonyActionType.MultiplePaymentMultisig} {Pay {recipient} {amount} {tokenSymbol} by {initiator}}
      ${ColonyActionType.CreateDecisionMotion} {New agreement by {initiator}}
      ${ColonyActionType.MoveFunds} {Move {amount} {tokenSymbol} from {fromDomain} to {toDomain} by {initiator}}
      ${ColonyActionType.MoveFundsMotion} {Move {amount} {tokenSymbol} from {fromDomain} to {toDomain} by {initiator}}
      ${ColonyActionType.MoveFundsMultisig} {Move {amount} {tokenSymbol} from {fromDomain} to {toDomain} by {initiator}}
      ${ColonyActionType.UnlockToken} {Unlock native token {tokenSymbol} by {initiator}}
      ${ColonyActionType.UnlockTokenMotion} {Unlock native token {tokenSymbol} by {initiator}}
      ${ColonyActionType.UnlockTokenMultisig} {Unlock native token {tokenSymbol} by {initiator}}
      ${ColonyActionType.MintTokens} {Mint {amount} {tokenSymbol} by {initiator}}
      ${ColonyActionType.MintTokensMotion} {Mint {amount} {tokenSymbol} by {initiator}}
      ${ColonyActionType.MintTokensMultisig} {Mint {amount} {tokenSymbol} by {initiator}}
      ${ColonyActionType.CreateDomain} {Create new team {fromDomain} by {initiator}}
      ${ColonyActionType.CreateDomainMotion} {Create new team {fromDomain} by {initiator}}
      ${ColonyActionType.CreateDomainMultisig} {Create new team {fromDomain} by {initiator}}
      ${ColonyActionType.VersionUpgrade} {Upgrade Colony version to v{newVersion} by {initiator}}
      ${ColonyActionType.VersionUpgradeMotion} {Upgrade Colony version to v{newVersion} by {initiator}}
      ${ColonyActionType.VersionUpgradeMultisig} {Upgrade Colony version to v{newVersion} by {initiator}}
      ${ColonyActionType.ColonyEdit} {Edit details of the Colony by {initiator}}
      ${ColonyActionType.ColonyEditMotion} {Edit details of the Colony by {initiator}}
      ${ColonyActionType.ColonyEditMultisig} {Edit details of the Colony by {initiator}}
      ${ColonyActionType.EditDomain} {Change {fromDomain} team details by {initiator}}
      ${ColonyActionType.EditDomainMotion} {Change {fromDomain} team details by {initiator}}
      ${ColonyActionType.EditDomainMultisig} {Change {fromDomain} team details by {initiator}}
      ${ColonyActionType.Recovery} {Enter recovery mode by {initiator}}
      ${ColonyActionType.EmitDomainReputationPenalty} {Remove {reputationChangeNumeral} reputation {reputationChange, plural, one {point} other {points}} from {recipient} by {initiator}}
      ${ColonyActionType.EmitDomainReputationPenaltyMotion} {Remove {reputationChangeNumeral} reputation {reputationChange, plural, one {point} other {points}} from {recipient} by {initiator}}
      ${ColonyActionType.EmitDomainReputationPenaltyMultisig} {Remove {reputationChangeNumeral} reputation {reputationChange, plural, one {point} other {points}} from {recipient} by {initiator}}
      ${ColonyActionType.EmitDomainReputationReward} {Add {reputationChangeNumeral} reputation {reputationChange, plural, one {point} other {points}} to {recipient} by {initiator}}
      ${ColonyActionType.EmitDomainReputationRewardMotion} {Add {reputationChangeNumeral} reputation {reputationChange, plural, one {point} other {points}} to {recipient} by {initiator}}
      ${ColonyActionType.EmitDomainReputationRewardMultisig} {Add {reputationChangeNumeral} reputation {reputationChange, plural, one {point} other {points}} to {recipient} by {initiator}}
      ${ColonyActionType.SetUserRoles} {{direction} {multiSigAuthority}permissions for {recipient} in {fromDomain} by {initiator}}
      ${ColonyActionType.SetUserRolesMotion} {{direction} {multiSigAuthority}permissions for {recipient} in {fromDomain} by {initiator}}
      ${ColonyActionType.SetUserRolesMultisig} {{direction} {multiSigAuthority}permissions for {recipient} in {fromDomain} by {initiator}}
      ${ColonyActionType.AddVerifiedMembers} {Add {members} verified {members, plural, one {member} other {members}} by {initiator}}
      ${ColonyActionType.AddVerifiedMembersMotion} {Add {members} verified {members, plural, one {member} other {members}} by {initiator}}
      ${ColonyActionType.AddVerifiedMembersMultisig} {Add {members} verified {members, plural, one {member} other {members}} by {initiator}}
      ${ColonyActionType.RemoveVerifiedMembers} {Remove {members} verified {members, plural, one {member} other {members}} by {initiator}}
      ${ColonyActionType.RemoveVerifiedMembersMotion} {Remove {members} verified {members, plural, one {member} other {members}} by {initiator}}
      ${ColonyActionType.RemoveVerifiedMembersMultisig} {Remove {members} verified {members, plural, one {member} other {members}} by {initiator}}
      ${ColonyActionType.CreateExpenditure} {Payment to {recipientsNumber} {recipientsNumber, plural, one {recipient} other {recipients}} with {tokensNumber} {tokensNumber, plural, one {token} other {tokens}} by {initiator}}
      ${ColonyActionType.ManageTokens} {Manage tokens by {initiator}}
      ${ColonyActionType.ManageTokensMotion} {Manage tokens by {initiator}}
      ${ColonyActionType.ManageTokensMultisig} {Manage tokens by {initiator}}
      ${ColonyActionType.FundExpenditureMotion} {Payment to {recipientsNumber} {recipientsNumber, plural, one {recipient} other {recipients}} with {tokensNumber} {tokensNumber, plural, one {token} other {tokens}} by {initiator}}
      ${ExtendedColonyActionType.AddSafe} {Add Safe from {chainName}}
      ${ExtendedColonyActionType.RemoveSafe} {Remove Safe}
      ${ExtendedColonyActionType.SafeMultipleTransactions} ${safeActionTitle}
      ${ExtendedColonyActionType.SafeMultipleTransactionsMotion} ${safeActionTitle}
      ${ExtendedColonyActionType.SafeTransferNft} ${safeActionTitle}
      ${ExtendedColonyActionType.SafeTransferNftMotion} ${safeActionTitle}
      ${ExtendedColonyActionType.SafeTransferFunds} ${safeActionTitle}
      ${ExtendedColonyActionType.SafeTransferFundsMotion} ${safeActionTitle}
      ${ExtendedColonyActionType.SafeRawTransaction} ${safeActionTitle}
      ${ExtendedColonyActionType.SafeRawTransactionMotion} ${safeActionTitle}
      ${ExtendedColonyActionType.SafeContractInteraction} ${safeActionTitle}
      ${ExtendedColonyActionType.SafeContractInteractionMotion} ${safeActionTitle}
      ${ExtendedColonyActionType.UpdateColonyObjective} {Manage objective by {initiator}}
      ${ExtendedColonyActionType.UpdateColonyObjectiveMotion} {Manage objective by {initiator}}
      ${ExtendedColonyActionType.UpdateColonyObjectiveMultisig} {Manage objective by {initiator}}
      ${ExtendedColonyActionType.SplitPayment} {Split Payment of {splitAmount} {tokenSymbol} by {initiator}}
      ${ExtendedColonyActionType.StagedPayment} {Staged payment to {recipient} by {initiator}}
      other {Generic action we don't have information about}
    }`,
  'action.type': `{actionType, select,
      ${ColonyActionType.WrongColony} {Not part of the Colony}
      ${ColonyActionType.Payment} {Simple payment}
      ${ColonyActionType.PaymentMotion} {Simple payment}
      ${ColonyActionType.PaymentMultisig} {Simple payment}
      ${ColonyActionType.MoveFunds} {Move Funds}
      ${ColonyActionType.MoveFundsMotion} {Move Funds}
      ${ColonyActionType.MoveFundsMultisig} {Move Funds}
      ${ColonyActionType.UnlockToken} {Unlock Token}
      ${ColonyActionType.UnlockTokenMotion} {Unlock Token}
      ${ColonyActionType.MintTokens} {Mint Tokens}
      ${ColonyActionType.MintTokensMotion} {Mint Tokens}
      ${ColonyActionType.CreateDomain} {Create new team}
      ${ColonyActionType.CreateDomainMotion} {Create new team}
      ${ColonyActionType.CreateDomainMultisig} {Create new team}
      ${ColonyActionType.VersionUpgrade} {Version Upgrade}
      ${ColonyActionType.VersionUpgradeMotion} {Version Upgrade}
      ${ColonyActionType.VersionUpgradeMultisig} {Version Upgrade}
      ${ColonyActionType.ColonyEdit} {Edit Colony details}
      ${ColonyActionType.ColonyEditMotion} {Edit Colony details}
      ${ColonyActionType.ColonyEditMultisig} {Edit Colony details}
      ${ColonyActionType.EditDomain} {Edit Team}
      ${ColonyActionType.EditDomainMotion} {Edit Team}
      ${ColonyActionType.EditDomainMultisig} {Edit Team}
      ${ColonyActionType.SetUserRoles} {Manage permissions}
      ${ColonyActionType.SetUserRolesMotion} {Manage permissions}
      ${ColonyActionType.SetUserRolesMultisig} {Manage permissions}
      ${ColonyActionType.Recovery} {Recovery}
      ${ColonyActionType.EmitDomainReputationPenalty} {Manage reputation}
      ${ColonyActionType.EmitDomainReputationPenaltyMotion} {Manage reputation}
      ${ColonyActionType.EmitDomainReputationPenaltyMultisig} {Manage reputation}
      ${ColonyActionType.EmitDomainReputationReward} {Manage reputation}
      ${ColonyActionType.EmitDomainReputationRewardMotion} {Manage reputation}
      ${ColonyActionType.EmitDomainReputationRewardMultisig} {Manage reputation}
      ${ColonyActionType.CreateDecisionMotion} {Decision}
      ${ColonyActionType.AddVerifiedMembers} {Manage verified members}
      ${ColonyActionType.AddVerifiedMembersMotion} {Manage verified members}
      ${ColonyActionType.AddVerifiedMembersMultisig} {Manage verified members}
      ${ColonyActionType.RemoveVerifiedMembers} {Manage verified members}
      ${ColonyActionType.RemoveVerifiedMembersMotion} {Manage verified members}
      ${ColonyActionType.RemoveVerifiedMembersMultisig} {Manage verified members}
      ${ColonyActionType.CreateExpenditure} {Advanced payment}
      ${ColonyActionType.ManageTokens} {Manage tokens}
      ${ColonyActionType.ManageTokensMotion} {Manage tokens}
      ${ColonyActionType.ManageTokensMultisig} {Manage tokens}
      ${ExtendedColonyActionType.StagedPayment} {Staged payment}
      ${ExtendedColonyActionType.AddSafe} {Add Safe}
      ${ExtendedColonyActionType.RemoveSafe} {Remove Safe}
      ${ExtendedColonyActionType.SafeRawTransaction} {Raw transaction}
      ${ExtendedColonyActionType.SafeRawTransactionMotion} {Raw transaction}
      ${ExtendedColonyActionType.SafeTransferFunds} {Transfer funds}
      ${ExtendedColonyActionType.SafeTransferFundsMotion} {Transfer funds}
      ${ExtendedColonyActionType.SafeTransferNft} {Transfer NFT}
      ${ExtendedColonyActionType.SafeTransferNftMotion} {Transfer NFT}
      ${ExtendedColonyActionType.SafeContractInteraction} {Contract interaction}
      ${ExtendedColonyActionType.SafeContractInteractionMotion} {Contract interaction}
      ${ExtendedColonyActionType.SafeMultipleTransactions} {Multiple transactions}
      ${ExtendedColonyActionType.SafeMultipleTransactionsMotion} {Multiple transactions}
      ${ExtendedColonyActionType.UpdateColonyObjective} {Manage objective}
      ${ExtendedColonyActionType.UpdateColonyObjectiveMotion} {Manage objective}
      ${ExtendedColonyActionType.UpdateColonyObjectiveMultisig} {Manage objective}
      ${ExtendedColonyActionType.SplitPayment} {Split payment}
      other {Generic}
    }`,
};

export default actionsMessageDescriptors;
