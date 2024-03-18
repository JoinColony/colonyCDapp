import React, { type PropsWithChildren } from 'react';

import { AppContext } from '~context/AppContext/AppContext.ts';

import data from '../data/appContext.ts';

const displayName = 'AppContextStub';

const AppContextStub = ({ children }: PropsWithChildren) => (
  <AppContext.Provider value={data}>{children}</AppContext.Provider>
);

AppContextStub.displayName = displayName;

export default AppContextStub;
