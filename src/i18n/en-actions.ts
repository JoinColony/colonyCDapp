/* eslint-disable max-len */

import { ColonyActionType, ExtendedColonyActionType } from '~types';

const actionsMessageDescriptors = {
  'action.title': `{actionType, select,
      ${ColonyActionType.WrongColony} {Unknown Action}
      ${ColonyActionType.Payment} {Pay {recipient} {amount} {tokenSymbol}}
      ${ColonyActionType.PaymentMotion} {Pay {recipient} {amount} {tokenSymbol}}
      ${ColonyActionType.MoveFunds} {Move {amount} {tokenSymbol} from {fromDomain} to {toDomain}}
      ${ColonyActionType.MoveFundsMotion} {Move {amount} {tokenSymbol} from {fromDomain} to {toDomain}}
      ${ColonyActionType.UnlockToken} {Unlock native token {tokenSymbol}}
      ${ColonyActionType.UnlockTokenMotion} {Unlock native token {tokenSymbol}}
      ${ColonyActionType.MintTokens} {Mint {amount} {tokenSymbol}}
      ${ColonyActionType.MintTokensMotion} {Mint {amount} {tokenSymbol}}
      ${ColonyActionType.CreateDomain} {New team: {fromDomain}}
      ${ColonyActionType.CreateDomainMotion} {New team: {fromDomain}}
      ${ColonyActionType.VersionUpgrade} {Upgrade Colony to Version {newVersion}!}
      ${ColonyActionType.VersionUpgradeMotion} {Upgrade Colony to Version {newVersion}!}
      ${ColonyActionType.ColonyEdit} {Colony details changed}
      ${ColonyActionType.ColonyEditMotion} {Change colony details}
      ${ColonyActionType.EditDomain} {{fromDomain} team details edited}
      ${ColonyActionType.EditDomainMotion} {Edit {fromDomain} team details}
      ${ColonyActionType.Recovery} {Recovery mode activated by {initiator}}
      ${ColonyActionType.EmitDomainReputationPenalty} {Smite {recipient} with a {reputationChangeNumeral} {reputationChange, plural, one {pt} other {pts}} reputation penalty}
      ${ColonyActionType.EmitDomainReputationPenaltyMotion} {Smite {recipient} with a {reputationChangeNumeral} {reputationChange, plural, one {pt} other {pts}} reputation penalty}
      ${ColonyActionType.EmitDomainReputationReward} {Award {recipient} with a {reputationChangeNumeral} {reputationChange, plural, one {pt} other {pts}} reputation reward}
      ${ColonyActionType.EmitDomainReputationRewardMotion} {Award {recipient} with a {reputationChangeNumeral} {reputationChange, plural, one {pt} other {pts}} reputation reward}
      ${ColonyActionType.SetUserRoles} {{rolesChanged} in {fromDomain} {direction} {recipient}}
      ${ColonyActionType.SetUserRolesMotion} {{rolesChanged} in {fromDomain} {direction} {recipient}}
      ${ExtendedColonyActionType.UpdateAddressBook} {Address book was updated}
      ${ExtendedColonyActionType.UpdateTokens} {Colony tokens were updated}    
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
      ${ExtendedColonyActionType.UpdateAddressBook} {Update Address Book}
      ${ExtendedColonyActionType.UpdateTokens} {Update Tokens}
      other {Generic}
    }`,
};

export default actionsMessageDescriptors;
