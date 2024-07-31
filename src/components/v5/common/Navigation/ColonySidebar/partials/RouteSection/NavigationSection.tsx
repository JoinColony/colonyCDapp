import React from 'react';

import { sidebarNavigationScheme } from './consts.ts';
import NavigationItem from './partials/RouteSectionItem/index.ts';

const displayName =
  'v5.common.Navigation.ColonySidebar.partials.NavigationSection';

const NavigationSection = () => {
  return (
    <section className="flex w-full flex-col gap-0.5">
      {sidebarNavigationScheme.map((scheme) => (
        <NavigationItem key={scheme.id} {...scheme} />
      ))}
    </section>
  );
};

NavigationSection.displayName = displayName;

export default NavigationSection;
