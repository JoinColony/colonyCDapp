import { createContext, useContext } from 'react';

import { noop } from '~utils/noop.ts';

import type React from 'react';

type ActionsTableTriggers = {
  shouldRefetchMotionStates: boolean;
};

export interface ColonyTriggersContextValue {
  actionsTableTriggers: ActionsTableTriggers;
  setActionsTableTriggers: React.Dispatch<
    React.SetStateAction<ActionsTableTriggers>
  >;
}

export const ColonyTriggersContext = createContext<ColonyTriggersContextValue>({
  actionsTableTriggers: {
    shouldRefetchMotionStates: false,
  },
  setActionsTableTriggers: noop,
});

export const useColonyTriggersContext = () => {
  const context = useContext(ColonyTriggersContext);

  if (!context) {
    throw new Error(
      'This hook must be used within the "ColonyTriggersContext" provider',
    );
  }

  return context;
};
