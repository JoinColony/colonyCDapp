import React, { useMemo, useState, type PropsWithChildren } from 'react';

import {
  ColonyTriggersContext,
  type ColonyTriggersContextValue,
} from './ColonyTriggersContext.ts';

const ColonyTriggersContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [actionsTableTriggers, setActionsTableTriggers] = useState<
    ColonyTriggersContextValue['actionsTableTriggers']
  >({ shouldRefetchMotionStates: false });

  const value = useMemo<ColonyTriggersContextValue>(
    () => ({
      actionsTableTriggers,
      setActionsTableTriggers,
    }),
    [actionsTableTriggers, setActionsTableTriggers],
  );

  return (
    <ColonyTriggersContext.Provider value={value}>
      {children}
    </ColonyTriggersContext.Provider>
  );
};

export default ColonyTriggersContextProvider;
