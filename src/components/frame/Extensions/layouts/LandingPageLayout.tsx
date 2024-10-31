import React, { type PropsWithChildren } from 'react';

import LandingPageCarousel from '~frame/LandingPage/LandingPageCarousel.tsx';
import Logo from '~images/assets/landing/logo.png';
import PageHeader from '~v5/frame/PageLayout/partials/PageHeader/PageHeader.tsx';
import { BasicPageSidebar } from '~v5/shared/Navigation/Sidebar/sidebars/BasicPageSidebar.tsx';

import UserNavigationWrapper from './partials/UserNavigationWrapper/UserNavigationWrapper.tsx';

export interface LandingPageLayoutProps extends PropsWithChildren {
  rightComponent?: React.ReactNode;
}
export const LandingPageLayout = ({
  children,
  rightComponent,
}: LandingPageLayoutProps) => {
  return (
    <div className="flex h-screen w-screen flex-col md:py-4 md:pl-4">
      <div className="flex h-[calc(100vh-var(--top-content-height))] flex-row">
        <section>
          <BasicPageSidebar />
        </section>
        <div className="relative flex w-full flex-col md:flex-row">
          <div className="relative left-0 top-0 flex w-full items-center md:absolute md:px-8 md:pt-5">
            <div className="hidden h-full min-w-[7.75rem] pb-2 md:block">
              <img className="h-4" alt="colony logo" src={Logo} />
            </div>
            <PageHeader userNavigation={<UserNavigationWrapper />} />
          </div>
          <div className="md: flex h-full w-full flex-col-reverse bg-gray-50 md:flex-row md:bg-transparent">
            <div className="flex w-full flex-1 justify-end">
              <div className="flex w-full max-w-[39.375rem] justify-center">
                <div className="w-full max-w-[28.125rem]">{children}</div>
              </div>
            </div>
            <div className="flex-none bg-gray-50 md:flex-1 md:rounded-l-3xl">
              <div className="flex h-full w-full flex-col items-center justify-center md:max-w-[41.875rem]">
                <div className="block h-full w-full min-w-[7.75rem] px-6 pt-8 md:hidden">
                  <img className="h-4" alt="colony logo" src={Logo} />
                </div>
                {rightComponent ?? (
                  <div className="flex h-full items-end pt-4 md:py-[3.125rem]">
                    <LandingPageCarousel />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
