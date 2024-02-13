import React from 'react';
import { Outlet } from 'react-router-dom';

import { useSetPageBreadcrumbs } from '~context/PageHeadingContext/hooks.ts';
import { useCreateTeamBreadcrumbs } from '~hooks/useTeamsBreadcrumbs.ts';

import { uiEvents, UIEvent } from '../uiEvents/index.ts';

const ColonyMembersRoute = () => {
  const teamsBreadcrumbs = useCreateTeamBreadcrumbs();
  useSetPageBreadcrumbs(teamsBreadcrumbs);

  uiEvents.emit(UIEvent.viewPage);

  return <Outlet />;
};

export default ColonyMembersRoute;
