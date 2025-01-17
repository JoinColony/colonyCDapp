import { MotionState as NetworkMotionState } from '@colony/colony-js';
import { createContext, useContext } from 'react';

import { type OptionalValue } from '~types';
import { type Expenditure, type ColonyAction } from '~types/graphql.ts';
import { type MotionState } from '~utils/colonyMotions.ts';

export interface IActionContext {
  transactionHash: string | null;
  action: OptionalValue<ColonyAction>;
  loadingAction: boolean;
  motionData: ColonyAction['motionData'];
  multiSigData: ColonyAction['multiSigData'];
  expenditure: OptionalValue<Expenditure>;
  loadingExpenditure: boolean;
  motionState: MotionState | undefined;
  refetchMotionState: () => void;
  isValidTransactionHash: boolean;
  networkMotionState: NetworkMotionState;
  startActionPoll: () => void;
  stopActionPoll: () => void;
  isMotion: boolean;
  isMultiSig: boolean;
  isExpenditure: boolean;
}

export const ActionContext = createContext<IActionContext>({
  transactionHash: null,
  action: null,
  loadingAction: false,
  motionData: null,
  multiSigData: null,
  expenditure: null,
  loadingExpenditure: false,
  motionState: undefined,
  refetchMotionState: () => {},
  isValidTransactionHash: false,
  networkMotionState: NetworkMotionState.Null,
  startActionPoll: () => {},
  stopActionPoll: () => {},
  isMotion: false,
  isMultiSig: false,
  isExpenditure: false,
});

export const useActionContext = () => {
  const actionContext = useContext(ActionContext);

  if (!actionContext) {
    throw new Error(
      'This hook must be used within the "ActionContext" provider',
    );
  }

  return actionContext;
};
