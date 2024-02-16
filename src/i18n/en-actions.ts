/* eslint-disable max-len */

import { ExtendedColonyActionType } from '~types/actions.ts';
import { ColonyActionType } from '~types/graphql.ts';

const safeActionTitle = '{Safe transaction: {safeTransactionTitle}}';

const actionsMessageDescriptors = {
  'action.title': `{actionType, select,
      ${ColonyActionType.WrongColony} {Unknown Action}
      ${ColonyActionType.Payment} {Pay {recipient} {amount} {tokenSymbol} by {initiator}}
      ${ColonyActionType.PaymentMotion} {Pay {recipient} {amount} {tokenSymbol} by {initiator}}
      ${ColonyActionType.MultiplePayment} {Pay {recipient} {amount} {tokenSymbol} by {initiator}}
      ${ColonyActionType.MultiplePaymentMotion} {Pay {recipient} {amount} {tokenSymbol} by {initiator}}
      ${ColonyActionType.CreateDecisionMotion} {New agreement by {initiator}}
      ${ColonyActionType.MoveFunds} {Move {amount} {tokenSymbol} from {fromDomain} to {toDomain} by {initiator}}
      ${ColonyActionType.MoveFundsMotion} {Move {amount} {tokenSymbol} from {fromDomain} to {toDomain} by {initiator}}
      ${ColonyActionType.UnlockToken} {Unlock native token {tokenSymbol} by {initiator}}
      ${ColonyActionType.UnlockTokenMotion} {Unlock native token {tokenSymbol} by {initiator}}
      ${ColonyActionType.MintTokens} {Mint {amount} {tokenSymbol} by {initiator}}
      ${ColonyActionType.MintTokensMotion} {Mint {amount} {tokenSymbol} by {initiator}}
      ${ColonyActionType.CreateDomain} {Create new team {fromDomain} by {initiator}}
      ${ColonyActionType.CreateDomainMotion} {Create new team {fromDomain} by {initiator}}
      ${ColonyActionType.VersionUpgrade} {Upgrade Colony version to v{newVersion} by {initiator}}
      ${ColonyActionType.VersionUpgradeMotion} {Upgrade Colony version to v{newVersion} by {initiator}}
      ${ColonyActionType.ColonyEdit} {Edit details of the Colony by {initiator}}
      ${ColonyActionType.ColonyEditMotion} {Edit details of the Colony by {initiator}}
      ${ColonyActionType.EditDomain} {Change {fromDomain} team details by {initiator}}
      ${ColonyActionType.EditDomainMotion} {Change {fromDomain} team details by {initiator}}
      ${ColonyActionType.Recovery} {Enter recovery mode by {initiator}}
      ${ColonyActionType.EmitDomainReputationPenalty} {Smite {recipient} with a {reputationChangeNumeral} {reputationChange, plural, one {pt} other {pts}} reputation penalty}
      ${ColonyActionType.EmitDomainReputationPenaltyMotion} {Smite {recipient} with a {reputationChangeNumeral} {reputationChange, plural, one {pt} other {pts}} reputation penalty}
      ${ColonyActionType.EmitDomainReputationReward} {Award {recipient} with a {reputationChangeNumeral} {reputationChange, plural, one {pt} other {pts}} reputation reward}
      ${ColonyActionType.EmitDomainReputationRewardMotion} {Award {recipient} with a {reputationChangeNumeral} {reputationChange, plural, one {pt} other {pts}} reputation reward}
      ${ColonyActionType.SetUserRoles} {{direction} {rolesChanged} permissions for {recipient} in {fromDomain} by {initiator}}
      ${ColonyActionType.SetUserRolesMotion} {{direction} {rolesChanged} permissions for {recipient} in {fromDomain} by {initiator}}
      ${ColonyActionType.AddVerifiedMembers} {Add {members} verified {members, plural, one {member} other {members}} by {initiator}}
      ${ColonyActionType.RemoveVerifiedMembers} {Remove {members} verified {members, plural, one {member} other {members}} by {initiator}}
      ${ExtendedColonyActionType.UpdateAddressBook} {Address book was updated}
      ${ExtendedColonyActionType.UpdateTokens} {Manage approved tokens by {initiator}}
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
      ${ExtendedColonyActionType.UpdateColonyObjective} {Manage Colony Objective by {initiator}}
      other {Generic action we don't have information about}
    }`,
  'action.type': `{actionType, select,
      ${ColonyActionType.WrongColony} {Not part of the Colony}
      ${ColonyActionType.Payment} {Payment}
      ${ColonyActionType.PaymentMotion} {Payment}
      ${ColonyActionType.MoveFunds} {Move Funds}
      ${ColonyActionType.MoveFundsMotion} {Move Funds}
      ${ColonyActionType.UnlockToken} {Unlock Token}
      ${ColonyActionType.UnlockTokenMotion} {Unlock Token}
      ${ColonyActionType.MintTokens} {Mint Tokens}
      ${ColonyActionType.MintTokensMotion} {Mint Tokens}
      ${ColonyActionType.CreateDomain} {Create Team}
      ${ColonyActionType.CreateDomainMotion} {Create Team}
      ${ColonyActionType.VersionUpgrade} {Version Upgrade}
      ${ColonyActionType.VersionUpgradeMotion} {Version Upgrade}
      ${ColonyActionType.ColonyEdit} {Colony Edit}
      ${ColonyActionType.ColonyEditMotion} {Colony Edit}
      ${ColonyActionType.EditDomain} {Edit Team}
      ${ColonyActionType.EditDomainMotion} {Edit Team}
      ${ColonyActionType.SetUserRoles} {Permission Management}
      ${ColonyActionType.SetUserRolesMotion} {Permission Management}
      ${ColonyActionType.Recovery} {Recovery}
      ${ColonyActionType.EmitDomainReputationPenalty} {Smite}
      ${ColonyActionType.EmitDomainReputationPenaltyMotion} {Smite}
      ${ColonyActionType.EmitDomainReputationReward} {Award}
      ${ColonyActionType.EmitDomainReputationRewardMotion} {Award}
      ${ColonyActionType.CreateDecisionMotion} {Decision}
      ${ColonyActionType.AddVerifiedMembers} {Manage verified members}
      ${ColonyActionType.RemoveVerifiedMembers} {Manage verified members}
      ${ExtendedColonyActionType.UpdateAddressBook} {Update Address Book}
      ${ExtendedColonyActionType.UpdateTokens} {Update Tokens}
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
      other {Generic}
    }`,
};

export default actionsMessageDescriptors;
