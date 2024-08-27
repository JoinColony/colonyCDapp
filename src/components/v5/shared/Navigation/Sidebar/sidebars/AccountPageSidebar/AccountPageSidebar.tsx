import {
  CreditCard,
  Faders,
  UserCircleGear,
  Wrench,
} from '@phosphor-icons/react';
import React from 'react';

import {
  USER_ADVANCED_ROUTE,
  USER_CRYPTO_TO_FIAT_ROUTE,
  USER_EDIT_PROFILE_ROUTE,
  USER_HOME_ROUTE,
  USER_PREFERENCES_ROUTE,
} from '~routes';
import SidebarRouteItem from '~v5/shared/Navigation/Sidebar/partials/SidebarRouteItem/index.ts';
import Sidebar from '~v5/shared/Navigation/Sidebar/Sidebar.tsx';

export const AccountPageSidebar = () => {
  return (
    <Sidebar
      className="!w-[216px]"
      headerClassName="mb-[27px]"
      colonySwitcherProps={{ showColonySwitcherText: true }}
    >
      <section className="flex flex-col gap-0.5">
        <SidebarRouteItem
          path={`${USER_HOME_ROUTE}/${USER_EDIT_PROFILE_ROUTE}`}
          translation={{ id: 'userProfileTab.title' }}
          icon={UserCircleGear}
        />
        <SidebarRouteItem
          path={`${USER_HOME_ROUTE}/${USER_PREFERENCES_ROUTE}`}
          translation={{ id: 'userPreferencesPage.title' }}
          icon={Faders}
        />
        <SidebarRouteItem
          path={`${USER_HOME_ROUTE}/${USER_ADVANCED_ROUTE}`}
          translation={{ id: 'advancedSettings.title' }}
          icon={Wrench}
        />
      </section>
      <div className="mx-3 my-[15px] border-b border-gray-200 md:mx-2 md:border-gray-700" />
      <SidebarRouteItem
        path={`${USER_HOME_ROUTE}/${USER_CRYPTO_TO_FIAT_ROUTE}`}
        translation={{ id: 'userCryptoToFiatPage.title' }}
        icon={CreditCard}
      />
    </Sidebar>
  );
};
