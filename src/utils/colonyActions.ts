import { BigNumber } from 'ethers';
import { ReactNode } from 'react';

import { isEmpty } from '~utils/lodash';
import { MotionVote } from '~utils/colonyMotions';
import {
  Address,
  Token,
  Domain as ColonyDomain,
  ActionUserRoles,
  ColonyActionType,
} from '~types';

import { formatText } from './intl';

// type ValuesForActionTypesMap = Partial<{
//   [key in keyof FormattedAction]: FormattedAction[key];
// }>;

export enum ActionPageDetails {
  Type = 'Type',
  FromDomain = 'FromDomain',
  ToDomain = 'ToDomain',
  Domain = 'Domain',
  ToRecipient = 'ToRecipient',
  Amount = 'Amount',
  Description = 'Description',
  Name = 'Name',
  Permissions = 'Permissions',
  ReputationChange = 'ReputationChange',
  Author = 'Author',
  Generic = 'Generic',
  Motion = 'Motion',
}

const MOTION_SUFFIX = 'MOTION';
const isMotion = (actionType: ColonyActionType) =>
  actionType.includes(MOTION_SUFFIX);

export const getDetailItemsKeys = (actionType: ColonyActionType) => {
  switch (true) {
    case actionType.includes(ColonyActionType.Payment): {
      return [
        ActionPageDetails.Type,
        isMotion(actionType) ? ActionPageDetails.Motion : '',
        ActionPageDetails.FromDomain,
        ActionPageDetails.ToRecipient,
        ActionPageDetails.Amount,
      ];
    }
    case actionType.includes(ColonyActionType.MoveFunds): {
      return [
        ActionPageDetails.Type,
        isMotion(actionType) ? ActionPageDetails.Motion : '',
        ActionPageDetails.FromDomain,
        ActionPageDetails.ToDomain,
        ActionPageDetails.Amount,
      ];
    }
    case actionType.includes(ColonyActionType.UnlockToken): {
      return [
        ActionPageDetails.Type,
        isMotion(actionType)
          ? ActionPageDetails.Motion
          : ActionPageDetails.Domain,
      ];
    }
    case actionType.includes(ColonyActionType.MintTokens): {
      return [
        ActionPageDetails.Type,
        isMotion(actionType) ? ActionPageDetails.Motion : '',
        ActionPageDetails.Amount,
      ];
    }
    case actionType.includes(ColonyActionType.CreateDomain): {
      return [
        ActionPageDetails.Type,
        isMotion(actionType) ? ActionPageDetails.Motion : '',
        ActionPageDetails.Domain,
        ActionPageDetails.Description,
      ];
    }
    case actionType.includes(ColonyActionType.ColonyEdit): {
      return [ActionPageDetails.Type, ActionPageDetails.Name];
    }
    case actionType.includes(ColonyActionType.EditDomain): {
      return [
        ActionPageDetails.Type,
        isMotion(actionType) ? ActionPageDetails.Motion : '',
        ActionPageDetails.Domain,
        ActionPageDetails.Description,
      ];
    }
    case actionType.includes(ColonyActionType.SetUserRoles): {
      return [
        ActionPageDetails.Type,
        ActionPageDetails.Domain,
        ActionPageDetails.ToRecipient,
        ActionPageDetails.Permissions,
      ];
    }
    case actionType.includes(ColonyActionType.EmitDomainReputationPenalty): {
      return [
        ActionPageDetails.Type,
        isMotion(actionType) ? ActionPageDetails.Motion : '',
        ActionPageDetails.ToRecipient,
        ActionPageDetails.Domain,
        ActionPageDetails.ReputationChange,
      ];
    }
    case actionType.includes(ColonyActionType.EmitDomainReputationReward): {
      return [
        ActionPageDetails.Type,
        isMotion(actionType) ? ActionPageDetails.Motion : '',
        ActionPageDetails.ToRecipient,
        ActionPageDetails.Domain,
        ActionPageDetails.ReputationChange,
      ];
    }
    // case actionType.includes(ColonyMotions.CreateDecisionMotion): {
    //   return [ActionPageDetails.Type, ActionPageDetails.Author];
    // }
    case actionType.includes(ColonyActionType.Generic): {
      return [ActionPageDetails.Type, ActionPageDetails.Generic];
    }
    default:
      return [];
  }
};

export interface EventValues {
  actionType: ColonyActionType;
  amount?: string | ReactNode;
  token?: Token;
  tokenSymbol?: string | ReactNode;
  decimals?: number;
  fromDomain?: ColonyDomain;
  toDomain?: ColonyDomain;
  motionDomain?: ColonyDomain;
  oldVersion?: string;
  newVersion?: string;
  colonyName?: string | ReactNode;
  roles?: ActionUserRoles[];
  user?: Address;
  agent?: Address;
  creator?: Address;
  slot?: string;
  toValue?: string;
  fromValue?: string;
  initiator?: string | ReactNode;
  staker?: string;
  stakeAmount?: BigNumber;
  vote?: MotionVote;
  voter?: Address;
  motionTag?: ReactNode;
  objectionTag?: ReactNode;
  reputationChange?: string;
  isSmiteAction?: boolean;
}

/*
 * Get values for action type based on action type
 */
// export const getValuesForActionType = (
//   values: SugraphEventProcessedValues,
//   actionType: ColonyActions,
//   colonyAddress: Address,
// ): ValuesForActionTypesMap => {
//   if (Object.keys(values).length) {
//     switch (actionType) {
//       case ColonyActions.MintTokens: {
//         return {
//           initiator: values.agent,
//           recipient: values.who,
//           amount: values.amount,
//         };
//       }
//       case ColonyActions.CreateDomain: {
//         return {
//           initiator: values.agent,
//           fromDomain: values.domainId,
//         };
//       }
//       case ColonyActions.ColonyEdit: {
//         return {
//           initiator: values.agent,
//           metadata: values.metadata,
//         };
//       }
//       case ColonyActions.MoveFunds: {
//         return {
//           amount: values.amount,
//           fromDomain: values.fromDomain,
//           toDomain: values.toDomain,
//           initiator: values.agent,
//           transactionTokenAddress: values.token,
//         };
//       }
//       case ColonyActions.EditDomain: {
//         return {
//           initiator: values.agent,
//           fromDomain: values.domainId,
//           metadata: values.metadata,
//         };
//       }
//       case ColonyActions.SetUserRoles: {
//         return {
//           initiator: values.agent,
//           fromDomain: values.domainId,
//           recipient: values.user,
//           roles: [
//             {
//               id: values.role as unknown as ColonyRole,
//               setTo: values.setTo === 'true',
//             },
//           ],
//         };
//       }
//       case ColonyActions.VersionUpgrade: {
//         return {
//           initiator: values?.agent || colonyAddress,
//           oldVersion: values.oldVersion,
//           newVersion: values.newVersion,
//         };
//       }
//       case ColonyActions.Recovery: {
//         return {
//           initiator: values?.user || colonyAddress,
//         };
//       }
//       case ColonyActions.EmitDomainReputationReward:
//       case ColonyActions.EmitDomainReputationPenalty: {
//         return {
//           recipient: values.user,
//           reputationChange: values.amount,
//         };
//       }
//       default: {
//         return {};
//       }
//     }
//   }
//   return {};
// };

// export const getColonyMetadataMessageDescriptorsIds = (
//   actionType: ColonyAndExtensionsEvents,
//   {
//     nameChanged,
//     logoChanged,
//     tokensChanged,
//     verifiedAddressesChanged,
//   }: { [key: string]: boolean },
// ) => {
//   if (actionType === ColonyAndExtensionsEvents.ColonyMetadata) {
//     if (nameChanged && logoChanged) {
//       return `event.${ColonyAndExtensionsEvents.ColonyMetadata}.nameLogo`;
//     }
//     if (nameChanged) {
//       return `event.${ColonyAndExtensionsEvents.ColonyMetadata}.name`;
//     }
//     if (logoChanged) {
//       return `event.${ColonyAndExtensionsEvents.ColonyMetadata}.logo`;
//     }
//     if (tokensChanged) {
//       return `event.${ColonyAndExtensionsEvents.ColonyMetadata}.tokens`;
//     }
//     if (verifiedAddressesChanged) {
//       return `event.${ColonyAndExtensionsEvents.ColonyMetadata}.verifiedAddresses`;
//     }
//   }
//   return `event.${ColonyAndExtensionsEvents.ColonyMetadata}.fallback`;
// };

// export const getDomainMetadataMessageDescriptorsIds = (
//   actionType: ColonyAndExtensionsEvents,
//   { nameChanged, colorChanged, descriptionChanged }: { [key: string]: boolean },
// ) => {
//   if (actionType === ColonyAndExtensionsEvents.DomainMetadata) {
//     if (nameChanged && colorChanged && descriptionChanged) {
//       return `event.${ColonyAndExtensionsEvents.DomainMetadata}.all`;
//     }
//     if (nameChanged && colorChanged) {
//       return `event.${ColonyAndExtensionsEvents.DomainMetadata}.nameColor`;
//     }
//     if (nameChanged && descriptionChanged) {
//       return `event.${ColonyAndExtensionsEvents.DomainMetadata}.nameDescription`;
//     }
//     if (colorChanged && descriptionChanged) {
//       return `event.${ColonyAndExtensionsEvents.DomainMetadata}.descriptionColor`;
//     }
//     if (nameChanged) {
//       return `event.${ColonyAndExtensionsEvents.DomainMetadata}.name`;
//     }
//     if (colorChanged) {
//       return `event.${ColonyAndExtensionsEvents.DomainMetadata}.color`;
//     }
//     if (descriptionChanged) {
//       return `event.${ColonyAndExtensionsEvents.DomainMetadata}.description`;
//     }
//   }
//   return `event.${ColonyAndExtensionsEvents.DomainMetadata}.fallback`;
// };

// export const getAssignmentEventDescriptorsIds = (
//   roleSetTo: boolean | undefined,
//   eventName: ColonyAndExtensionsEvents = ColonyAndExtensionsEvents.ColonyRoleSet,
//   eventMessageType = 'eventList',
// ) => {
//   return roleSetTo
//     ? `${eventMessageType}.${eventName}.assign`
//     : `${eventMessageType}.${eventName}.remove`;
// };

// export interface ColonyMetadata {
//   colonyDisplayName: string | null;
//   colonyAvatarHash: string | null;
//   colonyTokens: string[] | null;
//   verifiedAddresses: string[] | null;
//   isWhitelistActivated: boolean | null;
//   domainName?: string;
//   domainPurpose?: string;
//   domainColor?: string;
// }

// export const parseColonyMetadata = (jsonMetadata: string): ColonyMetadata => {
//   try {
//     if (jsonMetadata) {
//       const {
//         colonyDisplayName = null,
//         colonyAvatarHash = null,
//         colonyTokens = [],
//         verifiedAddresses = [],
//         isWhitelistActivated = null,
//       } = JSON.parse(jsonMetadata);
//       return {
//         colonyDisplayName,
//         colonyAvatarHash,
//         colonyTokens,
//         verifiedAddresses,
//         isWhitelistActivated,
//       };
//     }
//   } catch (error) {
//     console.error('Could not parse colony ipfs json blob', jsonMetadata);
//     console.error(error);
//   }
//   return {
//     colonyDisplayName: null,
//     colonyAvatarHash: null,
//     colonyTokens: [],
//     verifiedAddresses: [],
//     isWhitelistActivated: null,
//   };
// };

// export const parseDomainMetadata = (
//   jsonMetadata: string,
// ): {
//   domainName: string | null;
//   domainPurpose: string | null;
//   domainColor: string | null;
// } => {
//   try {
//     if (jsonMetadata) {
//       const {
//         domainName = null,
//         domainPurpose = null,
//         domainColor = null,
//       } = JSON.parse(jsonMetadata);
//       return {
//         domainName,
//         domainPurpose,
//         domainColor,
//       };
//     }
//   } catch (error) {
//     console.error('Could not parse domain ipfs json blob', jsonMetadata);
//     console.error(error);
//   }
//   return {
//     domainName: null,
//     domainPurpose: null,
//     domainColor: null,
//   };
// };

// export const sortMetadataHistory = (colonyMetadata) =>
//   sortBy(colonyMetadata, [
//     ({
//       transaction: {
//         block: { timestamp },
//       },
//     }) => new Date(parseInt(`${timestamp}000`, 10)).getTime(),
//   ]);

// /*
//  * Generates various checks based on action data and type
//  *
//  * This is to be used to generate super-specific message desciptors based on
//  * logic checks.
//  *
//  * Currently only used for the colony metadata changed action
//  */
// export const getSpecificActionValuesCheck = (
//   actionType: ColonyAndExtensionsEvents,
//   {
//     colonyDisplayName: currentColonyDisplayName,
//     colonyAvatarHash: currentColonyAvatarHash,
//     colonyTokens: currentColonyTokens,
//     domainName: currentDomainName,
//     domainPurpose: currentDomainPurpose,
//     domainColor: currentDomainColor,
//     verifiedAddresses: currentVerifiedAddresses,
//     isWhitelistActivated: currentIsWhitelistActivated,
//   }: Partial<ColonyAction> | ColonyMetadata,
//   {
//     colonyDisplayName: prevColonyDisplayName,
//     colonyAvatarHash: prevColonyAvatarHash,
//     colonyTokens: prevColonyTokens,
//     domainName: prevDomainName,
//     domainPurpose: prevDomainPurpose,
//     domainColor: prevDomainColor,
//     verifiedAddresses: prevVerifiedAddresses,
//     isWhitelistActivated: prevIsWhitelistActivated,
//   }: {
//     colonyDisplayName?: string | null;
//     colonyAvatarHash?: string | null;
//     colonyTokens?: string[] | null;
//     domainName?: string | null;
//     domainPurpose?: string | null;
//     domainColor?: string | null;
//     verifiedAddresses?: string[] | null;
//     isWhitelistActivated?: boolean | null;
//   },
// ): { [key: string]: boolean } => {
//   switch (actionType) {
//     case ColonyAndExtensionsEvents.ColonyMetadata: {
//       const nameChanged = prevColonyDisplayName !== currentColonyDisplayName;
//       const logoChanged = prevColonyAvatarHash !== currentColonyAvatarHash;

//       const verifiedAddressesChanged =
//         !isEqual(prevVerifiedAddresses, currentVerifiedAddresses) ||
//         // @NOTE casting to Boolean as IsWhitelistActivated could have a value, null, undefined.
//         Boolean(prevIsWhitelistActivated) !==
//           Boolean(currentIsWhitelistActivated);

//       /*
//        * Tokens arrays might come from a subgraph query, in which case
//        * they're not really "arrays", so we have to create a new instace of
//        * them in order to sort and compare
//        */
//       const tokensChanged = !isEqual(
//         prevColonyTokens ? prevColonyTokens.slice(0).sort() : [],
//         currentColonyTokens?.slice(0).sort() || [],
//       );
//       return {
//         nameChanged,
//         logoChanged,
//         tokensChanged,
//         verifiedAddressesChanged,
//       };
//     }
//     case ColonyAndExtensionsEvents.DomainMetadata: {
//       const nameChanged = prevDomainName !== currentDomainName;
//       const colorChanged =
//         Number(prevDomainColor) !== Number(currentDomainColor);
//       const descriptionChanged = prevDomainPurpose !== currentDomainPurpose;
//       return {
//         nameChanged,
//         colorChanged,
//         descriptionChanged,
//       };
//     }
//     default: {
//       return {
//         hasValues: false,
//       };
//     }
//   }
// };

const getFormattedRoleList = (
  roleGroupA: ActionUserRoles[],
  roleGroupB: ActionUserRoles[] | null,
) => {
  let roleList = '';

  roleGroupA.forEach((role: ActionUserRoles, i: number) => {
    const roleNameMessage = { id: `role.${role.id}` };
    const formattedRole = formatText(roleNameMessage) as string;
    roleList += ` ${formattedRole.toLowerCase()}`;

    if (
      i < roleGroupA.length - 1 ||
      (i === roleGroupA.length - 1 && !isEmpty(roleGroupB))
    ) {
      roleList += ',';
    }
  });

  return roleList;
};

export const formatRolesTitle = (roles: ActionUserRoles[]) => {
  let roleTitle = '';
  let direction = '';

  const assignedRoles = roles.filter((role) => role.setTo);
  const unassignedRoles = roles.filter((role) => !role.setTo);

  if (!isEmpty(assignedRoles)) {
    direction = 'to';
    roleTitle += `Assign the${getFormattedRoleList(
      assignedRoles,
      unassignedRoles,
    )}`;
  }

  if (!isEmpty(unassignedRoles)) {
    direction += direction ? '/from' : 'from';
    roleTitle += roleTitle ? ' and remove the' : 'Remove the';
    roleTitle += getFormattedRoleList(unassignedRoles, null);
  }

  roleTitle += roles.length > 1 ? ' permissions' : ' permission';

  return {
    roleTitle,
    direction,
  };
};

export const formatActionType = (actionType: ColonyActionType) =>
  formatText({ id: 'action.type' }, { actionType });
