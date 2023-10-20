import React from 'react';
import { Outlet } from 'react-router-dom';

import { MemberContextProviderWithSearchAndFilter as MemberContextProvider } from '~context/MemberContext';

const ColonyMembersRoute = () => (
  <MemberContextProvider>
    <Outlet />
  </MemberContextProvider>
);

export default ColonyMembersRoute;
