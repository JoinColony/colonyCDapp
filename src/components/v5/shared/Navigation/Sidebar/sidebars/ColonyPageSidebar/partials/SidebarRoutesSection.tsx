import React from 'react';

import SidebarRouteItem from '~v5/shared/Navigation/Sidebar/partials/SidebarRouteItem/index.ts';

import { sidebarNavigationScheme } from '../consts.ts';

export const SidebarRoutesSection = () => (
  <section className="flex w-full flex-col gap-0.5">
    {sidebarNavigationScheme.map((scheme) => (
      <SidebarRouteItem key={scheme.id} {...scheme} />
    ))}
  </section>
);
