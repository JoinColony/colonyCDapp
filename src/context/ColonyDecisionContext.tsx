import React, { createContext, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { createDecisionAction } from '~redux/actionCreators';
import { getDraftDecisionFromLocalStorage } from '~utils/decisions';

import { useAppContext } from './AppContext';
import { useColonyContext } from './ColonyContext';

export const ColonyDecisionContext = createContext<void>(undefined);

interface ColonyDecisionProviderProps {
  children: React.ReactNode;
}

export const ColonyDecisionProvider = ({
  children,
}: ColonyDecisionProviderProps) => {
  const { user } = useAppContext();
  const {
    colony: { colonyAddress },
  } = useColonyContext();

  /*
   * Get saved decision from local storage and, if it exists, add to the store.
   */

  const decision = getDraftDecisionFromLocalStorage(
    user?.walletAddress || '',
    colonyAddress,
  );

  const dispatch = useDispatch();

  // Use of effect here avoids "bad set state" error
  useEffect(() => {
    if (decision) {
      dispatch(createDecisionAction(decision));
    }
  }, [dispatch, decision]);

  const value = useMemo(() => {}, []);

  return (
    <ColonyDecisionContext.Provider value={value}>
      {children}
    </ColonyDecisionContext.Provider>
  );
};
