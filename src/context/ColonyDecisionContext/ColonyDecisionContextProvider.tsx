import React, {
  type FC,
  type PropsWithChildren,
  useEffect,
  useMemo,
} from 'react';
import { useDispatch } from 'react-redux';

import { createDecisionAction } from '~redux/actionCreators/index.ts';
import { getDraftDecisionFromLocalStorage } from '~utils/decisions.ts';

import { useAppContext } from '../AppContext/AppContext.ts';
import { useColonyContext } from '../ColonyContext/ColonyContext.ts';

import { ColonyDecisionContext } from './ColonyDecisionContext.ts';

const ColonyDecisionContextProvider: FC<PropsWithChildren> = ({ children }) => {
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

export default ColonyDecisionContextProvider;
