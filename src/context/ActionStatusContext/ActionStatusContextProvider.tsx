import React, {
  useMemo,
  type FC,
  type PropsWithChildren,
  useState,
} from 'react';

import { type ColonyActionType } from '~gql';
import { type MotionState } from '~utils/colonyMotions.ts';

import {
  type ActionStatus,
  ActionStatusContext,
  type ActionStatusContextValue,
} from './ActionStatusContext.ts';

const ActionStatusContextProvider: FC<
  PropsWithChildren<{
    actionType: ColonyActionType | null | undefined;
    motionState: MotionState | undefined;
  }>
> = ({ actionType, motionState, children }) => {
  const [actionStatus, setActionStatus] = useState<ActionStatus>(motionState);
  const [isLoading, setIsLoading] = useState(false);

  const value = useMemo<ActionStatusContextValue>(
    () => ({
      actionStatus,
      setActionStatus,
      actionType,
      isLoading,
      setIsLoading,
    }),
    [actionStatus, actionType, isLoading],
  );

  return (
    <ActionStatusContext.Provider value={value}>
      {children}
    </ActionStatusContext.Provider>
  );
};

export default ActionStatusContextProvider;
