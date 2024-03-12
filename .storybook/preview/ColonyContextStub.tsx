import React, { type PropsWithChildren } from 'react';

import { ColonyContext } from '~context/ColonyContext/ColonyContext.ts';

import data from '../data/colonyContext.ts';

const displayName = 'ColonyContextStub';

const ColonyContextStub = ({ children }: PropsWithChildren) => (
  <ColonyContext.Provider value={data}>{children}</ColonyContext.Provider>
);

ColonyContextStub.displayName = displayName;

export default ColonyContextStub;
