import { MotionStatesMap } from '~hooks';
import { ColonyAction, ColonyActionType } from '~types';
import { MotionState, getMotionState } from '~utils/colonyMotions';

export const filterActionByActionType = (
  action: ColonyAction,
  actionTypes?: ColonyActionType[],
) =>
  !actionTypes || actionTypes.length === 0 || actionTypes.includes(action.type);

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

export const getActionsByPageNumber = (
  actions: ColonyAction[],
  pageNumber: number,
  itemsPerPage: number,
) => {
  const startIndex = (pageNumber - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return actions.slice(startIndex, endIndex);
};
