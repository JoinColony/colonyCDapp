import React from 'react';

// import { CREATE_COLONY_ROUTE } from '~routes';
import { formatText } from '~utils/intl.ts';
import NavigationSidebar from '~v5/frame/NavigationSidebar/index.ts';

import ColonySwitcherContent from './partials/ColonySwitcherContent/index.ts';
import UserNavigationWrapper from './partials/UserNavigationWrapper/index.ts';

const displayName = 'frame.Extensions.layouts.MainLayout.MainSidebar';

const MainSidebar = () => (
  <NavigationSidebar
    additionalMobileContent={<UserNavigationWrapper />}
    colonySwitcherProps={{
      content: {
        title: formatText({ id: 'navigation.colonySwitcher.title' }),
        content: <ColonySwitcherContent />,
        // @NOTE: Disabling for beta
        // bottomActionProps: {
        //   text: formatText({ id: 'button.createNewColony' }),
        //   icon: Plus,
        //   to: CREATE_COLONY_ROUTE,
        // },
      },
    }}
  />
);

MainSidebar.displayName = displayName;

export default MainSidebar;
