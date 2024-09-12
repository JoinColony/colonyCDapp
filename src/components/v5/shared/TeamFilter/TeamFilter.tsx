import React from 'react';

import { useMobile } from '~hooks';

import DesktopTeamFilter from './partials/DesktopTeamFilter/DesktopTeamFilter.tsx';
import MobileTeamFilter from './partials/MobileTeamFilter.tsx';

const displayName = 'v5.shared.TeamFilter';

const TeamFilter = () => {
  const isMobile = useMobile();

  if (isMobile) {
    return <MobileTeamFilter />;
  }

  return <DesktopTeamFilter />;
};

TeamFilter.displayName = displayName;
export default TeamFilter;
