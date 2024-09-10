import { registerAction } from '../utils.ts';

import editTeam from './EditTeam.ts';
import simplePayment from './SimplePayment.ts';

// FIXME: Think about a way to improve this, how can we modularize this more?
export enum ActionCore {
  EditTeam = registerAction(editTeam),
  SimplePayment = registerAction(simplePayment),
  // FIXME: These need to be done still
  CreateDecision = 100,
  EditColonyDetails,
  ManageTokens,
  TransferFunds,
  CreateTeam,
  ManagePermissions,
  UpgradeColonyVersion,
  UnlockToken,
  MintTokens,
  ManageVerifiedMembers,
  ManageReputationAward,
  ManageReputationSmite,
  ManagePermissionsInRootDomain,
  ManagePermissionsInSubDomain,
  ManagePermissionsInSubDomainViaMultiSig,
}
