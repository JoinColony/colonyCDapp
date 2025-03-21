import React, { type PropsWithChildren } from 'react';

import { usePageThemeContext } from '~context/PageThemeContext/PageThemeContext.ts';
import { light } from '~frame/Extensions/themes/consts.ts';
import LandingPageCarousel from '~frame/LandingPage/partials/LandingPageCarousel/LandingPageCarousel.tsx';
import { useTablet } from '~hooks';
import ColonyLogo from '~icons/ColonyLogoLandingPage.tsx';
import PageHeader from '~v5/frame/PageLayout/partials/PageHeader/PageHeader.tsx';
import { BasicPageSidebar } from '~v5/shared/Navigation/Sidebar/sidebars/BasicPageSidebar.tsx';

import UserNavigationWrapper from './partials/UserNavigationWrapper/UserNavigationWrapper.tsx';

export interface LandingPageLayoutProps extends PropsWithChildren {
  rightComponent?: React.ReactNode;
  bottomComponent?: React.ReactNode;
}
export const LandingPageLayout = ({
  children,
  rightComponent,
  bottomComponent,
}: LandingPageLayoutProps) => {
  const { isDarkMode } = usePageThemeContext();
  const isTablet = useTablet();

  return (
    <div className="flex h-screen w-screen flex-col justify-between md:py-4 md:pl-4">
      {/* 
        Using conditional rendering with isTablet instead of CSS display classes
        because PageHeader uses a ResizeObserver to set a CSS custom variable.
        If we used CSS classes to hide/show headers, both would exist in the DOM
        and their ResizeObservers would conflict, causing incorrect variable values.
        This ensures only one header (and thus one observer) is active at a time.
      */}
      {isTablet && (
        <div className="block">
          <PageHeader userNavigation={<UserNavigationWrapper />} />
        </div>
      )}
      <div className="overflow-auto md:flex md:h-full md:flex-row">
        <section>
          <BasicPageSidebar />
        </section>
        <div className="relative flex w-full flex-1 flex-col md:flex-row">
          <div className="relative left-0 top-0 flex w-full flex-1 items-center md:absolute md:px-8 md:pt-5">
            <div className="hidden h-full min-w-[7.75rem] pb-2 md:block">
              <ColonyLogo
                color={isDarkMode ? light.baseWhite : light.gray900}
              />
            </div>
            {!isTablet && (
              <div className="block w-full">
                <PageHeader userNavigation={<UserNavigationWrapper />} />
              </div>
            )}
          </div>
          <div className="flex h-full w-full flex-col-reverse overflow-hidden md:flex-row md:bg-transparent">
            <div className="flex h-full w-full flex-1 justify-center md:justify-end">
              <div className="flex w-full justify-center md:max-w-[43.75rem] md:px-8 lg:md:mx-[-25px]">
                <div className="w-full md:max-w-[28.125rem]">{children}</div>
              </div>
            </div>
            <div className="relative flex-none md:flex-1 md:rounded-l-3xl md:bg-gray-50">
              <div className="absolute left-0 top-0 h-[72%] w-full bg-gray-50 md:hidden" />
              <div className="relative flex h-full w-full flex-col items-center justify-center md:max-w-[43.75rem]">
                <div className="block h-full w-full min-w-[7.75rem] px-6 pt-8 md:hidden">
                  <ColonyLogo
                    color={isDarkMode ? light.baseWhite : light.gray900}
                  />
                </div>
                {rightComponent ?? (
                  <div className="flex h-full w-full items-center pt-4 md:max-w-[35rem] md:px-8">
                    <LandingPageCarousel />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-1 items-end justify-center">
        {bottomComponent}
      </div>
    </div>
  );
};
