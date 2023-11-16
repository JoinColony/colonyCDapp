import { QuerySearchColonyActionsArgs } from '~gql';
import { MotionStatesMap } from '~hooks';
import { ColonyAction } from '~types';
import { MotionState, getMotionState } from '~utils/colonyMotions';

import { ActivityDecisionMethod, ActivityFeedFilters } from './types';

export const filterActionByMotionState = (
  action: ColonyAction,
  motionStatesMap: MotionStatesMap,
  motionStates?: MotionState[],
) => {
  if (!motionStates) {
    return true;
  }

  // If action is not a motion, we treat it as if it had a "Forced" state
  if (!action.motionData) {
    return motionStates.includes(MotionState.Forced);
  }

  const networkMotionState = motionStatesMap.get(action.motionData.motionId);
  if (!networkMotionState) {
    return false;
  }

  const motionState = getMotionState(networkMotionState, action.motionData);
  return motionStates.includes(motionState);
};

export const getSearchActionsFilterVariable = (
  colonyAddress: string,
  filters?: ActivityFeedFilters,
): QuerySearchColonyActionsArgs['filter'] => {
  return {
    colonyId: {
      eq: colonyAddress,
    },
    showInActionsList: {
      eq: true,
    },
    colonyDecisionId: {
      exists: false,
    },
    or: filters?.actionTypes?.length
      ? filters.actionTypes.map((actionType) => ({
          type: { eq: actionType },
        }))
      : undefined,
    createdAt: {
      range: [
        filters?.dateFrom?.toISOString() ?? null,
        filters?.dateTo?.toISOString() ?? null,
      ],
    },
    isMotion: {
      eq:
        filters?.decisionMethod === ActivityDecisionMethod.Reputation
          ? true
          : undefined,
      ne:
        filters?.decisionMethod === ActivityDecisionMethod.Permissions
          ? true
          : undefined,
    },
  };
};

export const getActionsByPageNumber = (
  actions: ColonyAction[],
  pageNumber: number,
  itemsPerPage: number,
) => {
  const startIndex = (pageNumber - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return actions.slice(startIndex, endIndex);
};
