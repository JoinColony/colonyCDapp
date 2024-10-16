import { type UseFormReturn } from 'react-hook-form';

import {
  type CoreActionOrGroup,
  getPermissionDomainId,
  getRequiredPermissions,
} from '~actions';
import { getAllUserRoles } from '~transformers/index.ts';
import { type Colony } from '~types/graphql.ts';
import { type Address } from '~types/index.ts';
import { addressHasRoles } from '~utils/checks/index.ts';
import { extractColonyRoles } from '~utils/colonyRoles.ts';

// FIXME: This needs to go into the individual action registrations
// export const getPermissionsNeededForAction = (
//   actionType: Action,
//   formValues: Record<string, any>,
// ): ColonyRole[][] | undefined => {
//   switch (actionType) {
//     case Action.SimplePayment:
//       return PERMISSIONS_NEEDED_FOR_ACTION.SimplePayment;
//     case Action.MintTokens:
//       return PERMISSIONS_NEEDED_FOR_ACTION.MintTokens;
//     case Action.TransferFunds:
//       return PERMISSIONS_NEEDED_FOR_ACTION.TransferFunds;
//     case Action.UnlockToken:
//       return PERMISSIONS_NEEDED_FOR_ACTION.UnlockToken;
//     case Action.ManageTokens:
//       return PERMISSIONS_NEEDED_FOR_ACTION.ManageTokens;
//     case Action.CreateNewTeam:
//       return PERMISSIONS_NEEDED_FOR_ACTION.CreateNewTeam;
//     case Action.EditExistingTeam:
//       return PERMISSIONS_NEEDED_FOR_ACTION.EditExistingTeam;
//
//    // TODO: NEXT!!!!!!!!! ADJUST THESE VALUES IN THE ACTIONDEFINITION
//     case Action.ManageReputation:
//       if (formValues.modification === ModificationOption.AwardReputation) {
//         return PERMISSIONS_NEEDED_FOR_ACTION.ManageReputationAward;
//       }
//       if (formValues.modification === ModificationOption.RemoveReputation) {
//         return PERMISSIONS_NEEDED_FOR_ACTION.ManageReputationRemove;
//       }
//       return [
//         ...PERMISSIONS_NEEDED_FOR_ACTION.ManageReputationAward,
//         ...PERMISSIONS_NEEDED_FOR_ACTION.ManageReputationRemove,
//       ];
//     case Action.ManagePermissions: {
//       const { decisionMethod, createdIn, team } = formValues;
//
//       const isMotion = decisionMethod === DecisionMethod.Reputation;
//
//       let createdInDomain;
//       if (!isMotion) {
//         createdInDomain = team;
//       } else if (team) {
//         createdInDomain = createdIn;
//       } else {
//         createdInDomain = undefined;
//       }
//
//       if (createdInDomain === undefined) {
//         return PERMISSIONS_NEEDED_FOR_ACTION.ManagePermissionsInSubDomain;
//       }
//
//       const createdInRoot = createdInDomain === Id.RootDomain;
//
//       if (decisionMethod === DecisionMethod.MultiSig) {
//         if (createdInDomain === undefined) {
//           return [
//             ...PERMISSIONS_NEEDED_FOR_ACTION.ManagePermissionsInRootDomain,
//             ...PERMISSIONS_NEEDED_FOR_ACTION.ManagePermissionsInSubDomainViaMultiSig,
//           ];
//         }
//         return createdInRoot
//           ? PERMISSIONS_NEEDED_FOR_ACTION.ManagePermissionsInRootDomain
//           : PERMISSIONS_NEEDED_FOR_ACTION.ManagePermissionsInSubDomainViaMultiSig;
//       }
//
//       if (createdInDomain === undefined) {
//         return [
//           ...PERMISSIONS_NEEDED_FOR_ACTION.ManagePermissionsInRootDomain,
//           ...PERMISSIONS_NEEDED_FOR_ACTION.ManagePermissionsInSubDomain,
//         ];
//       }
//
//       return createdInRoot
//         ? PERMISSIONS_NEEDED_FOR_ACTION.ManagePermissionsInRootDomain
//         : PERMISSIONS_NEEDED_FOR_ACTION.ManagePermissionsInSubDomain;
//     }
//     case Action.ManageVerifiedMembers: {
//       return PERMISSIONS_NEEDED_FOR_ACTION.ManageVerifiedMembers;
//     }
//     case Action.EditColonyDetails: {
//       return PERMISSIONS_NEEDED_FOR_ACTION.EditColonyDetails;
//     }
//     case Action.ManageColonyObjectives: {
//       return PERMISSIONS_NEEDED_FOR_ACTION.ManageColonyObjective;
//     }
//     case Action.UpgradeColonyVersion: {
//       return PERMISSIONS_NEEDED_FOR_ACTION.UpgradeColonyVersion;
//     }
//     case Action.EnterRecoveryMode: {
//       return PERMISSIONS_NEEDED_FOR_ACTION.EnterRecoveryMode;
//     }
//     case Action.PaymentBuilder: {
//       return PERMISSIONS_NEEDED_FOR_ACTION.PaymentBuilder;
//     }
//     default:
//       return undefined;
//   }
// };

export const getHasActionPermissions = ({
  colony,
  userAddress,
  actionType,
  form,
  isMultiSig = false,
}: {
  colony: Colony;
  userAddress: Address;
  actionType: CoreActionOrGroup;
  form: UseFormReturn;
  isMultiSig?: boolean;
}) => {
  const allUserRoles = getAllUserRoles(
    extractColonyRoles(colony.roles),
    userAddress,
    isMultiSig,
  );
  if (allUserRoles.length === 0) {
    return false;
  }

  const requiredRoles = getRequiredPermissions(actionType);

  if (!requiredRoles) {
    return undefined;
  }

  const relevantDomainId = getPermissionDomainId(actionType, form);

  const hasPermissions = addressHasRoles({
    requiredRoles,
    requiredRolesDomain: relevantDomainId,
    colony,
    address: userAddress,
    isMultiSig,
  });

  return hasPermissions;
};
