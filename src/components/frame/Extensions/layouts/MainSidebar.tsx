import React from 'react';

import { CREATE_COLONY_ROUTE } from '~routes';
import { formatText } from '~utils/intl';

import UserNavigationWrapper from './partials/UserNavigationWrapper';
import ColonySwitcherContent from './partials/ColonySwitcherContent';
import NavigationSidebar from '~v5/frame/NavigationSidebar';

const displayName = 'frame.Extensions.layouts.MainLayout.MainSidebar';

const MainSidebar = () => (
  <NavigationSidebar
    additionalMobileContent={<UserNavigationWrapper />}
    colonySwitcherProps={{
      avatarProps: {},
      content: {
        title: formatText({ id: 'navigation.colonySwitcher.title' }) || '',
        content: <ColonySwitcherContent />,
        bottomActionProps: {
          text: formatText({ id: 'button.createNewColony' }),
          iconName: 'plus',
          to: CREATE_COLONY_ROUTE,
        },
      },
    }}
  />
);

MainSidebar.displayName = displayName;

export default MainSidebar;
