import React, { createContext, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useAppContext } from '~hooks';
import { createDecisionAction } from '~redux/actionCreators';
import { Colony } from '~types';
import { getDraftDecisionFromLocalStorage } from '~utils/decisions';

export const ColonyDecisionContext = createContext<void>(undefined);

interface ColonyDecisionProviderProps {
  children: React.ReactNode;
  colony?: Colony;
}

export const ColonyDecisionProvider = ({
  colony,
  children,
}: ColonyDecisionProviderProps) => {
  const { user } = useAppContext();

  /*
   * Get saved decision from local storage and, if it exists, add to the store.
   */

  const decision = getDraftDecisionFromLocalStorage(
    user?.walletAddress || '',
    colony?.colonyAddress || '',
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
