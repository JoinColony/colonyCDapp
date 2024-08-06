import React from 'react';

import SidebarRouteItem from '../../../partials/SidebarRouteItem/index.ts';
import { sidebarNavigationScheme } from '../consts.ts';

export const SidebarRoutesSection = () => (
  <section className="flex w-full flex-col gap-0.5">
    {sidebarNavigationScheme.map((scheme) => (
      <SidebarRouteItem key={scheme.id} {...scheme} />
    ))}
  </section>
);
