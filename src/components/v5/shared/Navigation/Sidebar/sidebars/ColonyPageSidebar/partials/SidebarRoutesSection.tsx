import React from 'react';

import SidebarRouteItem from '~v5/shared/Navigation/Sidebar/partials/SidebarRouteItem/index.ts';

import { useSidebarRoutesScheme } from './hooks.ts';

export const SidebarRoutesSection = () => {
  const { sidebarScheme: sidebarNavigationScheme } = useSidebarRoutesScheme();

  return (
    <section className="flex w-full flex-col gap-0 md:gap-0.5">
      {sidebarNavigationScheme.map((scheme) => (
        <SidebarRouteItem key={scheme.translation.id} {...scheme} />
      ))}
    </section>
  );
};
