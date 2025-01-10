import { createContext, useContext } from 'react';

import noop from '~utils/noop.ts';

import type React from 'react';

type ActionsTableTriggers = {
  shouldRefetchMotionStates: boolean;
};

export interface GlobalTriggersContextValue {
  actionsTableTriggers: ActionsTableTriggers;
  setActionsTableTriggers: React.Dispatch<
    React.SetStateAction<ActionsTableTriggers>
  >;
}

export const GlobalTriggersContext = createContext<GlobalTriggersContextValue>({
  actionsTableTriggers: {
    shouldRefetchMotionStates: false,
  },
  setActionsTableTriggers: noop,
});

export const useGlobalTriggersContext = () => {
  const context = useContext(GlobalTriggersContext);

  if (!context) {
    throw new Error(
      'This hook must be used within the "GlobalTriggersContext" provider',
    );
  }

  return context;
};
