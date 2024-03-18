import React from 'react';
import { Outlet } from 'react-router-dom';

import { useSetPageBreadcrumbs } from '~context/PageHeadingContext/PageHeadingContext.ts';
import { useCreateTeamBreadcrumbs } from '~hooks/useTeamsBreadcrumbs.ts';

const ColonyMembersRoute = () => {
  const teamsBreadcrumbs = useCreateTeamBreadcrumbs();
  useSetPageBreadcrumbs(teamsBreadcrumbs);

  return <Outlet />;
};

export default ColonyMembersRoute;
