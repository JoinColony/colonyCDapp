import { createContext, useContext } from 'react';

import { type ColonyActionType } from '~gql';
import { type ExpenditureActionStatus } from '~types/expenditures.ts';
import { type StreamingPaymentStatus } from '~types/streamingPayments.ts';
import { type MotionState } from '~utils/colonyMotions.ts';

export type ActionStatus =
  | ExpenditureActionStatus
  | StreamingPaymentStatus
  | MotionState
  | null
  | undefined;

export interface ActionStatusContextValue {
  actionType: ColonyActionType | null | undefined;
  actionStatus: ActionStatus;
  setActionStatus: (status: ActionStatus) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

export const ActionStatusContext = createContext<ActionStatusContextValue>({
  actionStatus: null,
  setActionStatus: () => {},
  actionType: null,
  isLoading: false,
  setIsLoading: () => {},
});

export const useActionStatusContext = () => useContext(ActionStatusContext);
