import { ColonyRole } from '@colony/colony-js';
import { type BigNumber } from 'ethers';
import { type ReactNode } from 'react';

import { getRole } from '~constants/permissions.ts';
import { type ColonyActionRoles, ColonyActionType } from '~gql';
import {
  type AnyActionType,
  ExtendedColonyActionType,
  type ActionUserRoles,
} from '~types/actions.ts';
import {
  type Token,
  type Domain as ColonyDomain,
  type ColonyMetadata,
  type ColonyAction,
} from '~types/graphql.ts';
import { type Address } from '~types/index.ts';
import { type CustomPermissionTableModel } from '~types/permissions.ts';
import { isEmpty, isEqual } from '~utils/lodash.ts';

import { type MotionVote } from './colonyMotions.ts';
import { formatText } from './intl.ts';
import { parseSafeTransactionType } from './safes/index.ts';

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
  Safe = 'Safe',
  SafeName = 'SafeName',
  ChainName = 'ChainName',
  SafeAddress = 'SafeAddress',
  ModuleAddress = 'ModuleAddress',
  SafeTransaction = 'SafeTransaction',
}

export const safeActionTypes = [
  ExtendedColonyActionType.SafeTransferFunds,
  ExtendedColonyActionType.SafeRawTransaction,
  ExtendedColonyActionType.SafeTransferNft,
  ExtendedColonyActionType.SafeContractInteraction,
  ExtendedColonyActionType.SafeMultipleTransactions,
];

const MOTION_SUFFIX = 'MOTION';
const isMotion = (actionType: AnyActionType) =>
  actionType.includes(MOTION_SUFFIX);

export const getDetailItemsKeys = (actionType: AnyActionType) => {
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
    case actionType.includes(ColonyActionType.ColonyEdit):
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
        isMotion(actionType) ? ActionPageDetails.Motion : '',
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
    case actionType.includes(ExtendedColonyActionType.RemoveSafe): {
      return [ActionPageDetails.Type, ActionPageDetails.Safe];
    }
    case actionType.includes(ExtendedColonyActionType.AddSafe): {
      return [
        ActionPageDetails.Type,
        ActionPageDetails.ChainName,
        ActionPageDetails.SafeName,
        ActionPageDetails.SafeAddress,
        ActionPageDetails.ModuleAddress,
      ];
    }
    case safeActionTypes.some((type) => actionType.includes(type)): {
      return [
        ActionPageDetails.Type,
        isMotion(actionType) ? ActionPageDetails.Motion : '',
        ActionPageDetails.SafeTransaction,
      ];
    }
    case actionType.includes(ColonyActionType.Generic): {
      return [ActionPageDetails.Type, ActionPageDetails.Generic];
    }
    case actionType.includes(ColonyActionType.CreateDecisionMotion): {
      return [
        ActionPageDetails.Type,
        ActionPageDetails.Motion,
        ActionPageDetails.Author,
      ];
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
//       } = JSON.parse(jsonMetadata);
//       return {
//         colonyDisplayName,
//         colonyAvatarHash,
//         colonyTokens,
//         verifiedAddresses,
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
//   }: Partial<ColonyAction> | ColonyMetadata,
//   {
//     colonyDisplayName: prevColonyDisplayName,
//     colonyAvatarHash: prevColonyAvatarHash,
//     colonyTokens: prevColonyTokens,
//     domainName: prevDomainName,
//     domainPurpose: prevDomainPurpose,
//     domainColor: prevDomainColor,
//     verifiedAddresses: prevVerifiedAddresses,
//   }: {
//     colonyDisplayName?: string | null;
//     colonyAvatarHash?: string | null;
//     colonyTokens?: string[] | null;
//     domainName?: string | null;
//     domainPurpose?: string | null;
//     domainColor?: string | null;
//     verifiedAddresses?: string[] | null;
//   },
// ): { [key: string]: boolean } => {
//   switch (actionType) {
//     case ColonyAndExtensionsEvents.ColonyMetadata: {
//       const nameChanged = prevColonyDisplayName !== currentColonyDisplayName;
//       const logoChanged = prevColonyAvatarHash !== currentColonyAvatarHash;

//       const verifiedAddressesChanged =
//         !isEqual(prevVerifiedAddresses, currentVerifiedAddresses)

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

export const normalizeRolesForAction = (
  roles: ColonyActionRoles,
): ActionUserRoles[] => {
  /*
   * Done manually since this list is static
   */
  const extractedRoles = [
    { id: 0, setTo: roles.role_0 },
    { id: 1, setTo: roles.role_1 },
    { id: 2, setTo: roles.role_2 },
    { id: 3, setTo: roles.role_3 },
    { id: 5, setTo: roles.role_5 },
    { id: 6, setTo: roles.role_6 },
  ];

  return extractedRoles.filter(
    (role): role is ActionUserRoles =>
      role.setTo !== null && role.setTo !== undefined,
  );
};

export const formatRolesTitle = (roles?: ColonyActionRoles | null) => {
  if (!roles) {
    return '';
  }

  const normalizedRoles = normalizeRolesForAction(roles);
  const assignedRoles = normalizedRoles.filter((role) => role.setTo);

  if (isEmpty(assignedRoles)) {
    return formatText({ id: 'action.title.rolesDirection.remove' });
  }

  const role = getRole(assignedRoles.map(({ id }) => id));

  return formatText(
    { id: 'action.title.rolesDirection.assign' },
    { roleName: role.name },
  );
};

const getChangelogItem = (
  {
    isMultiSig: actionIsMultiSig,
    isMotion: actionIsMotion,
    transactionHash,
    pendingColonyMetadata,
  }: ColonyAction,
  colonyMetadata: ColonyMetadata | null | undefined,
) => {
  const metadataObject =
    actionIsMotion || actionIsMultiSig ? pendingColonyMetadata : colonyMetadata;

  return metadataObject?.changelog?.find(
    (item) => item.transactionHash === transactionHash,
  );
};
/**
 * Function returning action type based on the action data, that can include extended action types,
 */
export const getExtendedActionType = (
  actionData: ColonyAction,
  metadata: ColonyMetadata | null | undefined,
): AnyActionType => {
  const { type } = actionData;
  const changelogItem = getChangelogItem(actionData, metadata);

  if (changelogItem?.hasObjectiveChanged) {
    /**
     * @deprecated
     * This is still needed to allow users to view existing Colony Objectives in the Completed Action component
     */
    if (actionData.isMotion) {
      return ExtendedColonyActionType.UpdateColonyObjectiveMotion;
    }
    if (actionData.isMultiSig) {
      return ExtendedColonyActionType.UpdateColonyObjectiveMultisig;
    }
    return ExtendedColonyActionType.UpdateColonyObjective;
  }

  if (!isEqual(changelogItem?.newSafes, changelogItem?.oldSafes)) {
    if (
      (changelogItem?.newSafes?.length || 0) >
      (changelogItem?.oldSafes?.length || 0)
    ) {
      return ExtendedColonyActionType.AddSafe;
    }
    return ExtendedColonyActionType.RemoveSafe;
  }

  const safeType = parseSafeTransactionType(actionData);

  if (safeType) {
    return safeType;
  }

  if (actionData.expenditure?.metadata?.distributionType) {
    return ExtendedColonyActionType.SplitPayment;
  }

  return type;
};

export const formatActionType = (actionType: AnyActionType) =>
  formatText({ id: 'action.type' }, { actionType });

export const getColonyRoleSetTitleValues = (
  encodedEvents?: string | null,
  eventId?: string,
) => {
  const role = JSON.parse(encodedEvents ?? '[]')?.find(
    ({ id }) => id === eventId,
  );
  if (role) {
    const { role: roleId, setTo } = role;
    return {
      role: formatText({ id: `role.${roleId}` }),
      roleSetAction: formatText({ id: `role.${setTo ? 'assign' : 'remove'}` }),
      roleSetDirection: formatText({ id: `role.${setTo ? 'to' : 'from'}` }),
    };
  }
  return {
    role: '',
    roleSetAction: '',
    roleSetDirection: '',
  };
};

export const AUTHORITY = {
  ViaMultiSig: 'via-multi-sig',
  Own: 'own',
} as const;

export const CUSTOM_PERMISSION_TABLE_CONTENT: CustomPermissionTableModel[] = [
  {
    key: ColonyRole.Root,
    name: ColonyRole.Root,
    overview: formatText({ id: 'permissions.custom.root.overview' }),
    type: formatText({ id: 'role.1' }),
    tooltipContent: formatText({ id: 'permissions.custom.root.tooltip' }),
  },
  {
    key: ColonyRole.Administration,
    name: ColonyRole.Administration,
    overview: formatText({ id: 'permissions.custom.administration.overview' }),
    type: formatText({ id: 'role.6' }),
    tooltipContent: formatText({
      id: 'permissions.custom.administration.tooltip',
    }),
  },
  {
    key: ColonyRole.Architecture,
    name: ColonyRole.Architecture,
    overview: formatText({ id: 'permissions.custom.architecture.overview' }),
    type: formatText({ id: 'role.3' }),
    tooltipContent: formatText({
      id: 'permissions.custom.architecture.tooltip',
    }),
  },
  {
    key: ColonyRole.Funding,
    name: ColonyRole.Funding,
    overview: formatText({ id: 'permissions.custom.funding.overview' }),
    type: formatText({ id: 'role.5' }),
    tooltipContent: formatText({ id: 'permissions.custom.funding.tooltip' }),
  },
  {
    key: ColonyRole.Recovery,
    name: ColonyRole.Recovery,
    overview: formatText({ id: 'permissions.custom.recovery.overview' }),
    type: formatText({ id: 'role.0' }),
    tooltipContent: formatText({ id: 'permissions.custom.recovery.tooltip' }),
  },
  {
    key: ColonyRole.Arbitration,
    name: ColonyRole.Arbitration,
    overview: formatText({ id: 'permissions.custom.arbitration.overview' }),
    type: formatText({ id: 'role.2' }),
    tooltipContent: formatText({
      id: 'permissions.custom.arbitration.tooltip',
    }),
  },
];
