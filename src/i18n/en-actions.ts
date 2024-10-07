/* eslint-disable max-len */

// FIXME: This probably also needs to go?? No idea where this is going
import { CoreAction } from '~actions/index';
import { ExtendedColonyActionType } from '~types/actions.ts';

const safeActionTitle = '{Safe transaction: {safeTransactionTitle}}';

// FIXME: @RESOLUTION:
// Get rid of xxxMotion and xxxMultisig action types and use isMotion, isMultisig flags of action
// IMPORTANT: WE NEED A MIGRATION to remove them from the database
const actionsMessageDescriptors = {
  'action.title': `{actionType, select,
      ${CoreAction.WrongColony} {Unknown Action}
      ${CoreAction.PaymentMotion} {Pay {recipient} {amount} {tokenSymbol} by {initiator}}
      ${CoreAction.PaymentMultisig} {Pay {recipient} {amount} {tokenSymbol} by {initiator}}
      ${CoreAction.MultiplePaymentMotion} {Pay {recipient} {amount} {tokenSymbol} by {initiator}}
      ${CoreAction.MultiplePaymentMultisig} {Pay {recipient} {amount} {tokenSymbol} by {initiator}}
      ${CoreAction.MoveFundsMotion} {Move {amount} {tokenSymbol} from {fromDomain} to {toDomain} by {initiator}}
      ${CoreAction.MoveFundsMultisig} {Move {amount} {tokenSymbol} from {fromDomain} to {toDomain} by {initiator}}
      ${CoreAction.UnlockTokenMotion} {Unlock native token {tokenSymbol} by {initiator}}
      ${CoreAction.UnlockTokenMultisig} {Unlock native token {tokenSymbol} by {initiator}}
      ${CoreAction.MintTokensMotion} {Mint {amount} {tokenSymbol} by {initiator}}
      ${CoreAction.MintTokensMultisig} {Mint {amount} {tokenSymbol} by {initiator}}
      ${CoreAction.CreateDomainMotion} {Create new team {fromDomain} by {initiator}}
      ${CoreAction.CreateDomainMultisig} {Create new team {fromDomain} by {initiator}}
      ${CoreAction.VersionUpgradeMotion} {Upgrade Colony version to v{newVersion} by {initiator}}
      ${CoreAction.VersionUpgradeMultisig} {Upgrade Colony version to v{newVersion} by {initiator}}
      ${CoreAction.EditColonyMotion} {Edit details of the Colony by {initiator}}
      ${CoreAction.EditColonyMultisig} {Edit details of the Colony by {initiator}}
      ${CoreAction.EditDomainMotion} {Change {fromDomain} team details by {initiator}}
      ${CoreAction.EditDomainMultisig} {Change {fromDomain} team details by {initiator}}
      ${CoreAction.EmitDomainReputationPenaltyMotion} {Remove {reputationChangeNumeral} reputation {reputationChange, plural, one {point} other {points}} from {recipient} by {initiator}}
      ${CoreAction.EmitDomainReputationPenaltyMultisig} {Remove {reputationChangeNumeral} reputation {reputationChange, plural, one {point} other {points}} from {recipient} by {initiator}}
      ${CoreAction.EmitDomainReputationRewardMotion} {Add {reputationChangeNumeral} reputation {reputationChange, plural, one {point} other {points}} to {recipient} by {initiator}}
      ${CoreAction.EmitDomainReputationRewardMultisig} {Add {reputationChangeNumeral} reputation {reputationChange, plural, one {point} other {points}} to {recipient} by {initiator}}
      ${CoreAction.SetUserRolesMotion} {{direction} {multiSigAuthority}permissions for {recipient} in {fromDomain} by {initiator}}
      ${CoreAction.SetUserRolesMultisig} {{direction} {multiSigAuthority}permissions for {recipient} in {fromDomain} by {initiator}}
      ${CoreAction.AddVerifiedMembersMotion} {Add {members} verified {members, plural, one {member} other {members}} by {initiator}}
      ${CoreAction.AddVerifiedMembersMultisig} {Add {members} verified {members, plural, one {member} other {members}} by {initiator}}
      ${CoreAction.RemoveVerifiedMembersMotion} {Remove {members} verified {members, plural, one {member} other {members}} by {initiator}}
      ${CoreAction.RemoveVerifiedMembersMultisig} {Remove {members} verified {members, plural, one {member} other {members}} by {initiator}}

      ${CoreAction.AddVerifiedMembers} {Add {members} verified {members, plural, one {member} other {members}} by {initiator}}
      ${CoreAction.RemoveVerifiedMembers} {Remove {members} verified {members, plural, one {member} other {members}} by {initiator}}

      ${CoreAction.CreateExpenditure} {Payment to {recipientsNumber} {recipientsNumber, plural, one {recipient} other {recipients}} with {tokensNumber} {tokensNumber, plural, one {token} other {tokens}} by {initiator}}
      ${CoreAction.ManageTokens} {Manage tokens by {initiator}}
      ${CoreAction.ManageTokensMotion} {Manage tokens by {initiator}}
      ${CoreAction.ManageTokensMultisig} {Manage tokens by {initiator}}
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
      other {Generic action we don't have information about}
    }`,
  'action.type': `{actionType, select,
      ${CoreAction.WrongColony} {Not part of the Colony}
      ${CoreAction.Payment} {Simple payment}
      ${CoreAction.PaymentMotion} {Simple payment}
      ${CoreAction.PaymentMultisig} {Simple payment}
      ${CoreAction.MoveFunds} {Move Funds}
      ${CoreAction.MoveFundsMotion} {Move Funds}
      ${CoreAction.MoveFundsMultisig} {Move Funds}
      ${CoreAction.UnlockToken} {Unlock Token}
      ${CoreAction.UnlockTokenMotion} {Unlock Token}
      ${CoreAction.MintTokens} {Mint Tokens}
      ${CoreAction.MintTokensMotion} {Mint Tokens}
      ${CoreAction.CreateDomain} {Create new team}
      ${CoreAction.CreateDomainMotion} {Create new team}
      ${CoreAction.CreateDomainMultisig} {Create new team}
      ${CoreAction.VersionUpgrade} {Version Upgrade}
      ${CoreAction.VersionUpgradeMotion} {Version Upgrade}
      ${CoreAction.VersionUpgradeMultisig} {Version Upgrade}
      ${CoreAction.ColonyEdit} {Edit Colony details}
      ${CoreAction.ColonyEditMotion} {Edit Colony details}
      ${CoreAction.ColonyEditMultisig} {Edit Colony details}
      ${CoreAction.EditDomain} {Edit Team}
      ${CoreAction.EditDomainMotion} {Edit Team}
      ${CoreAction.EditDomainMultisig} {Edit Team}
      ${CoreAction.SetUserRoles} {Manage permissions}
      ${CoreAction.SetUserRolesMotion} {Manage permissions}
      ${CoreAction.SetUserRolesMultisig} {Manage permissions}
      ${CoreAction.Recovery} {Recovery}
      ${CoreAction.EmitDomainReputationPenalty} {Manage reputation}
      ${CoreAction.EmitDomainReputationPenaltyMotion} {Manage reputation}
      ${CoreAction.EmitDomainReputationPenaltyMultisig} {Manage reputation}
      ${CoreAction.EmitDomainReputationReward} {Manage reputation}
      ${CoreAction.EmitDomainReputationRewardMotion} {Manage reputation}
      ${CoreAction.EmitDomainReputationRewardMultisig} {Manage reputation}
      ${CoreAction.CreateDecisionMotion} {Decision}
      ${CoreAction.AddVerifiedMembers} {Manage verified members}
      ${CoreAction.AddVerifiedMembersMotion} {Manage verified members}
      ${CoreAction.AddVerifiedMembersMultisig} {Manage verified members}
      ${CoreAction.RemoveVerifiedMembers} {Manage verified members}
      ${CoreAction.RemoveVerifiedMembersMotion} {Manage verified members}
      ${CoreAction.RemoveVerifiedMembersMultisig} {Manage verified members}
      ${CoreAction.CreateExpenditure} {Advanced payment}
      ${CoreAction.ManageTokens} {Manage tokens}
      ${CoreAction.ManageTokensMotion} {Manage tokens}
      ${CoreAction.ManageTokensMultisig} {Manage tokens}
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
      other {Generic}
    }`,
};

// export default actionsMessageDescriptors;
