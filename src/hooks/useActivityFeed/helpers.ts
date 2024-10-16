import { isHexString } from 'ethers/lib/utils';

import {
  CoreAction,
  type ActionData,
  type CoreActionOrGroup,
} from '~actions';
import { DecisionMethod, type ColonyFragment } from '~gql';
import { type MotionStatesMap } from '~hooks/useNetworkMotionStates.ts';
import { type InstalledExtensionData } from '~types/extensions.ts';
import { notMaybe } from '~utils/arrays/index.ts';
import { getExtendedActionType } from '~utils/colonyActions.ts';
import { getMotionState, MotionState } from '~utils/colonyMotions.ts';
import { getMultiSigState } from '~utils/multiSig/index.ts';

import {
  type ActivityFeedFilters,
  type ActivityFeedColonyAction,
  type SearchActionsFilterVariable,
} from './types.ts';

const getActivityFeedMotionState = (
  actionData: ActionData,
  motionStatesMap: MotionStatesMap,
): MotionState | undefined => {
  if (actionData.isMultiSig) {
    return getMultiSigState(actionData.multiSigData);
  }

  if (!actionData.motionData) {
    return MotionState.Passed;
  }

  const networkMotionState = motionStatesMap.get(
    actionData.motionData.motionId,
  );

  if (networkMotionState === null) {
    return MotionState.Uninstalled;
  }

  return networkMotionState !== undefined
    ? getMotionState(networkMotionState, actionData.motionData)
    : MotionState.Invalid;
};

export const filterActionByMotionState = (
  action: ActivityFeedColonyAction,
  motionStatesFilter?: MotionState[],
) => {
  if (!motionStatesFilter) {
    return true;
  }

  return !action.motionState
    ? false
    : motionStatesFilter.includes(action.motionState);
};

export const filterBySearch = (
  action: ActivityFeedColonyAction,
  colony: ColonyFragment,
  search?: string,
) => {
  if (!search) {
    return true;
  }

  const {
    isMotion,
    pendingColonyMetadata,
    metadata,
    amount,
    token,
    initiatorUser,
    recipientUser,
    transactionHash,
    initiatorAddress,
    recipientAddress,
  } = action;

  const extendedActionType = getExtendedActionType(
    action,
    isMotion ? pendingColonyMetadata : colony.metadata,
  );

  const searchValue = search.toLowerCase();
  const searchIsAddress = isHexString(searchValue);
  const terms = searchIsAddress
    ? [transactionHash, initiatorAddress, recipientAddress, token?.tokenAddress]
    : [
        metadata?.customTitle,
        extendedActionType,
        amount,
        token?.name,
        token?.symbol,
        initiatorUser?.profile?.displayName,
        recipientUser?.profile?.displayName,
      ];

  return terms.filter(notMaybe).some((term) => {
    const lowercaseTerm = term.toLowerCase();

    return searchIsAddress
      ? lowercaseTerm === search
      : lowercaseTerm.includes(searchValue);
  });
};

const ACTION_TYPES_TO_HIDE = [
  CoreAction.CancelExpenditure,
  CoreAction.CancelExpenditureMotion,
  CoreAction.LockExpenditure,
  CoreAction.FinalizeExpenditure,
  CoreAction.FinalizeExpenditureMotion,
  CoreAction.FundExpenditureMotion,
  CoreAction.SetExpenditureStateMotion,
  CoreAction.EditExpenditure,
  CoreAction.EditExpenditureMotion,
];

export const filterByActionTypes = (
  action: ActivityFeedColonyAction,
  colony: ColonyFragment | undefined,
  actionTypes?: CoreActionOrGroup[],
) => {
  if (ACTION_TYPES_TO_HIDE.includes(action.type)) {
    return false;
  }

  if (!actionTypes || !colony || !actionTypes.length) {
    return true;
  }

  const { isMotion, pendingColonyMetadata } = action;

  const extendedActionType = getExtendedActionType(
    action,
    isMotion ? pendingColonyMetadata : colony.metadata,
  );

  return actionTypes.includes(extendedActionType);
};

/**
 * Common filtering for all action queries to ensure both listing and counting queries
 * return the same results
 */
export const getBaseSearchActionsFilterVariable = (
  colonyAddress: string,
): SearchActionsFilterVariable => ({
  colonyId: {
    eq: colonyAddress,
  },
  showInActionsList: {
    eq: true,
  },
  isMotionFinalization: {
    ne: true,
  },
});

export const getSearchActionsFilterVariable = (
  colonyAddress: string,
  { dateFrom, dateTo, decisionMethods, teamId }: ActivityFeedFilters = {},
): SearchActionsFilterVariable => {
  const dateFilter =
    dateFrom && dateTo
      ? {
          createdAt: {
            range: [dateFrom?.toISOString(), dateTo?.toISOString()],
          },
        }
      : {
          ...(dateFrom
            ? {
                createdAt: {
                  gte: dateFrom?.toISOString(),
                },
              }
            : {}),
          ...(dateTo
            ? {
                createdAt: {
                  lte: dateTo?.toISOString(),
                },
              }
            : {}),
        };
  const decisionMethodFilter =
    decisionMethods && !!decisionMethods.length
      ? {
          or: [
            ...(decisionMethods.includes(DecisionMethod.Reputation)
              ? [
                  {
                    isMotion: {
                      eq: true,
                    },
                  },
                ]
              : []),
            ...(decisionMethods.includes(DecisionMethod.MultiSig)
              ? [
                  {
                    isMultiSig: {
                      eq: true,
                    },
                  },
                ]
              : []),
            ...(decisionMethods.includes(DecisionMethod.Permissions)
              ? [
                  {
                    isMotion: {
                      ne: true,
                    },
                    isMultiSig: {
                      ne: true,
                    },
                  },
                ]
              : []),
          ],
        }
      : undefined;

  return {
    ...getBaseSearchActionsFilterVariable(colonyAddress),
    ...(teamId !== undefined ? { fromDomainId: { eq: teamId } } : {}),
    ...dateFilter,
    ...(decisionMethodFilter || {}),
  };
};

export const getActionsByPageNumber = (
  actions: ActionData[],
  pageNumber: number,
  itemsPerPage: number,
) => {
  const startIndex = (pageNumber - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return actions.slice(startIndex, endIndex);
};

export const makeWithMotionStateMapper =
  (
    motionStatesMap: MotionStatesMap,
    votingRepExtensionData: InstalledExtensionData | undefined,
    multiSigExtensionData: InstalledExtensionData | undefined,
  ) =>
  (actionData: ActionData): ActivityFeedColonyAction => {
    let motionState;
    // If the action is multi sig, and the multi sig extension was uninstalled.
    if (actionData.isMultiSig && !multiSigExtensionData) {
      motionState = MotionState.Uninstalled;
    }
    // If the action is a motion, and the voting with reputation extension was uninstalled.
    else if (actionData.isMotion && !votingRepExtensionData) {
      motionState = MotionState.Uninstalled;
    }

    // If the action is a motion, but was created with an old uninstalled extension.
    else if (
      actionData.isMotion &&
      actionData.motionData?.createdBy !== votingRepExtensionData?.address
    ) {
      motionState = MotionState.Uninstalled;
    }

    // Otherwise, get the state in a normal way.
    else {
      motionState = getActivityFeedMotionState(actionData, motionStatesMap);
    }

    return {
      ...actionData,
      motionState,
    };
  };
