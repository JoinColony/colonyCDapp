import {
  CreditCard,
  Faders,
  UserCircleGear,
  Wrench,
} from '@phosphor-icons/react';
import React, { useContext } from 'react';

import { FeatureFlagsContext } from '~context/FeatureFlagsContext/FeatureFlagsContext.ts';
import { FeatureFlag } from '~context/FeatureFlagsContext/types.ts';
import {
  USER_ADVANCED_ROUTE,
  USER_CRYPTO_TO_FIAT_ROUTE,
  USER_EDIT_PROFILE_ROUTE,
  USER_HOME_ROUTE,
  USER_PREFERENCES_ROUTE,
} from '~routes';
import { SidebarContentDivider } from '~v5/shared/Navigation/Sidebar/partials/SidebarContentDivider.tsx';
import SidebarRouteItem from '~v5/shared/Navigation/Sidebar/partials/SidebarRouteItem/index.ts';
import Sidebar from '~v5/shared/Navigation/Sidebar/Sidebar.tsx';

export const AccountPageSidebar = () => {
  const featureFlags = useContext(FeatureFlagsContext);
  const cryptoToFiatFeatureFlag = featureFlags[FeatureFlag.CRYPTO_TO_FIAT];

  const showCryptoToFiatNavItem =
    !cryptoToFiatFeatureFlag?.isLoading && cryptoToFiatFeatureFlag?.isEnabled;

  return (
    <Sidebar
      className="!w-[216px] overflow-y-auto"
      headerClassName="mb-[27px]"
      colonySwitcherProps={{ showColonySwitcherText: true }}
      feedbackButtonProps={{ widgetPlacement: { horizontalPadding: 240 } }}
      testId="account-page-sidebar"
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
          translation={{ id: 'userAdvancedPage.title' }}
          icon={Wrench}
        />
      </section>
      {showCryptoToFiatNavItem && (
        <>
          <SidebarContentDivider className="my-[0.938rem]" />
          <SidebarRouteItem
            path={`${USER_HOME_ROUTE}/${USER_CRYPTO_TO_FIAT_ROUTE}`}
            translation={{ id: 'userCryptoToFiatPage.title' }}
            icon={CreditCard}
          />
        </>
      )}
    </Sidebar>
  );
};
