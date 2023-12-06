import React from 'react';
import { Outlet } from 'react-router-dom';

import { MemberContextProviderWithSearchAndFilter as MemberContextProvider } from '~context/MemberContext';
import { useSetPageBreadcrumbs } from '~context/PageHeadingContext/hooks';
import { useCreateTeamBreadcrumbs } from '~hooks/useTeamsBreadcrumbs';

const ColonyMembersRoute = () => {
  const teamsBreadcrumbs = useCreateTeamBreadcrumbs();
  useSetPageBreadcrumbs(teamsBreadcrumbs);

  return <Outlet />;
};

export default ColonyMembersRoute;
