import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import { MemberContextProviderWithSearchAndFilter as MemberContextProvider } from '~context/MemberContext';
import { usePageHeadingContext } from '~context/PageHeadingContext/hooks';

const ColonyMembersRoute = () => {
  const { setBreadcrumbs } = usePageHeadingContext();

  useEffect(() => {
    setBreadcrumbs([
      {
        key: 'members',
        // @todo: replace with actual teams
        dropdownOptions: [
          {
            label: 'All members',
            href: '/members',
          },
        ],
        selectedValue: '/members',
      },
    ]);

    return () => {
      setBreadcrumbs([]);
    };
  }, [setBreadcrumbs]);

  return (
    <MemberContextProvider>
      <Outlet />
    </MemberContextProvider>
  );
};

export default ColonyMembersRoute;
