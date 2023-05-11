/* eslint-disable max-len */

import {
  ColonyActionType,
  ColonyMotions,
  ExtendedColonyActionType,
} from '~types';

const actionsMessageDescriptors = {
  'action.title': `{actionType, select,
      ${ColonyActionType.WrongColony} {Unknown Action}
      ${ColonyActionType.Payment} {Pay {recipient} {amount} {tokenSymbol}}
      ${ColonyMotions.PaymentMotion} {Pay {recipient} {amount} {tokenSymbol}}
      ${ColonyActionType.MoveFunds} {Move {amount} {tokenSymbol} from {fromDomain} to {toDomain}}
      ${ColonyMotions.MoveFundsMotion} {Move {amount} {tokenSymbol} from {fromDomain} to {toDomain}}
      ${ColonyActionType.UnlockToken} {Unlock native token {tokenSymbol}}
      ${ColonyMotions.UnlockTokenMotion} {Unlock native token {tokenSymbol}}
      ${ColonyActionType.MintTokens} {Mint {amount} {tokenSymbol}}
      ${ColonyMotions.MintTokensMotion} {Mint {amount} {tokenSymbol}}
      ${ColonyActionType.CreateDomain} {New team: {fromDomain}}
      ${ColonyMotions.CreateDomainMotion} {New team: {fromDomain}}
      ${ColonyActionType.VersionUpgrade} {Upgrade Colony to Version {newVersion}}
      ${ColonyMotions.VersionUpgradeMotion} {Upgrade Colony to Version {newVersion}}
      ${ColonyActionType.ColonyEdit} {Colony details changed}
      ${ColonyMotions.ColonyEditMotion} {Change colony details}
      ${ColonyActionType.EditDomain} {{fromDomain} team details edited}
      ${ColonyMotions.EditDomainMotion} {Edit {fromDomain} team details}
      ${ColonyActionType.Recovery} {Recovery mode activated by {initiator}}
      ${ColonyActionType.EmitDomainReputationPenalty} {Smite {recipient} with a {reputationChangeNumeral} {reputationChange, plural, one {pt} other {pts}} reputation penalty}
      ${ColonyMotions.EmitDomainReputationPenaltyMotion} {Smite {recipient} with a {reputationChangeNumeral} {reputationChange, plural, one {pt} other {pts}} reputation penalty}
      ${ColonyActionType.EmitDomainReputationReward} {Award {recipient} with a {reputationChangeNumeral} {reputationChange, plural, one {pt} other {pts}} reputation reward}
      ${ColonyMotions.EmitDomainReputationRewardMotion} {Award {recipient} with a {reputationChangeNumeral} {reputationChange, plural, one {pt} other {pts}} reputation reward}
      ${ColonyActionType.SetUserRoles} {{rolesChanged} in {fromDomain} {direction} {recipient}}
      ${ColonyMotions.SetUserRolesMotion} {{rolesChanged} in {fromDomain} {direction} {recipient}}
      ${ExtendedColonyActionType.UpdateAddressBook} {Address book was updated}
      ${ExtendedColonyActionType.UpdateTokens} {Colony tokens were updated}    
      other {Generic action we don't have information about}
    }`,
  'action.type': `{actionType, select,
      ${ColonyActionType.WrongColony} {Not part of the Colony}
      ${ColonyActionType.Payment} {Payment}
      ${ColonyMotions.PaymentMotion} {Payment}
      ${ColonyActionType.MoveFunds} {Move Funds}
      ${ColonyMotions.MoveFundsMotion} {Move Funds}
      ${ColonyActionType.UnlockToken} {Unlock Token}
      ${ColonyMotions.UnlockTokenMotion} {Unlock Token}
      ${ColonyActionType.MintTokens} {Mint Tokens}
      ${ColonyMotions.MintTokensMotion} {Mint Tokens}
      ${ColonyActionType.CreateDomain} {Create Team}
      ${ColonyMotions.CreateDomainMotion} {Create Team}
      ${ColonyActionType.VersionUpgrade} {Version Upgrade}
      ${ColonyMotions.VersionUpgradeMotion} {Version Upgrade}
      ${ColonyActionType.ColonyEdit} {Colony Edit}
      ${ColonyMotions.ColonyEditMotion} {Colony Edit}
      ${ColonyActionType.EditDomain} {Edit Team}
      ${ColonyMotions.EditDomainMotion} {Edit Team}
      ${ColonyActionType.SetUserRoles} {Permission Management}
      ${ColonyMotions.SetUserRolesMotion} {Permission Management}
      ${ColonyActionType.Recovery} {Recovery}
      ${ColonyActionType.EmitDomainReputationPenalty} {Smite}
      ${ColonyMotions.EmitDomainReputationPenaltyMotion} {Smite}
      ${ColonyActionType.EmitDomainReputationReward} {Award}
      ${ColonyMotions.EmitDomainReputationRewardMotion} {Award}
      ${ExtendedColonyActionType.UpdateAddressBook} {Update Address Book}
      ${ExtendedColonyActionType.UpdateTokens} {Update Tokens}    
      other {Generic}
    }`,
  [`action.${ColonyActionType.ColonyEdit}.verifiedAddresses`]: `Address book was updated`,
  [`action.${ColonyActionType.ColonyEdit}.tokens`]: `Colony tokens were updated`,
};

export default actionsMessageDescriptors;
