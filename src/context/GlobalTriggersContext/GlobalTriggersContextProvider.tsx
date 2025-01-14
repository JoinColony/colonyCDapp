import React, { useMemo, useState, type PropsWithChildren } from 'react';

import {
  GlobalTriggersContext,
  type GlobalTriggersContextValue,
} from './GlobalTriggersContext.ts';

const GlobalTriggersContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [actionsTableTriggers, setActionsTableTriggers] = useState<
    GlobalTriggersContextValue['actionsTableTriggers']
  >({ shouldRefetchMotionStates: false });

  const value = useMemo<GlobalTriggersContextValue>(
    () => ({
      actionsTableTriggers,
      setActionsTableTriggers,
    }),
    [actionsTableTriggers, setActionsTableTriggers],
  );

  return (
    <GlobalTriggersContext.Provider value={value}>
      {children}
    </GlobalTriggersContext.Provider>
  );
};

export default GlobalTriggersContextProvider;
