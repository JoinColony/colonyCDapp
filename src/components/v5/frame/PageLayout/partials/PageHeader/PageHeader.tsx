import clsx from 'clsx';
import React, { useRef, type FC } from 'react';

import { UserHubTab } from '~common/Extensions/UserHub/types.ts';
import UserHubButton from '~common/Extensions/UserHubButton/UserHubButton.tsx';
import { CSSCustomVariable } from '~constants/cssCustomVariables.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { usePageLayoutContext } from '~context/PageLayoutContext/PageLayoutContext.ts';
import { UserNavigationWrapper } from '~frame/Extensions/layouts/index.ts';
import { useTablet } from '~hooks';
import { useHeightResizeObserver } from '~hooks/useHeightResizeObserver.ts';
import JoinButton from '~v5/shared/Button/JoinButton/JoinButton.tsx';
import MobileColonySwitcherToggle from '~v5/shared/Navigation/ColonySwitcher/partials/MobileColonySwitcherToggle.tsx';
import MobileColonyPageSidebarToggle from '~v5/shared/Navigation/Sidebar/partials/MobileColonyPageSidebarToggle/MobileColonyPageSidebarToggle.tsx';
import TxButton from '~v5/shared/TxButton/TxButton.tsx';

import PageHeading from '../PageHeading/index.ts';

import { type PageHeaderProps } from './types.ts';

const displayName = 'v5.frame.PageLayout.partials.PageHeader';

const PageHeader: FC<PageHeaderProps> = ({ pageHeadingProps }) => {
  const {
    toggleTabletSidebar,
    showTabletSidebar,
    clearUserHubTab,
    setUserHubTab,
    userHubTab,
  } = usePageLayoutContext();

  const colonyContext = useColonyContext({ nullableContext: true });

  const navSectionRef = useRef<HTMLDivElement | null>(null);

  const isTablet = useTablet();

  const breadcrumbs = pageHeadingProps?.breadcrumbs;
  const title = pageHeadingProps?.title;

  useHeightResizeObserver(
    navSectionRef,
    CSSCustomVariable.HeaderNavSectionContainer,
  );

  return (
    <header className="bg-pink w-full">
      <section ref={navSectionRef}>
        <div
          className={clsx(
            'flex flex-row items-center justify-between border-b p-6',
            'md:border-none md:p-0',
            {
              'md:pb-1': !title,
            },
          )}
        >
          <div>
            {!isTablet && breadcrumbs && (
              <section className="flex-shrink-0 ">
                <PageHeading breadcrumbs={breadcrumbs} />
              </section>
            )}
            {isTablet && (
              <div className="flex items-center gap-3">
                <MobileColonySwitcherToggle />
                {colonyContext && (
                  <MobileColonyPageSidebarToggle
                    isOpen={showTabletSidebar}
                    onClick={toggleTabletSidebar}
                    label={{ id: 'menu' }}
                  />
                )}
              </div>
            )}
          </div>
          <UserNavigationWrapper
            txButton={
              colonyContext ? (
                <TxButton
                  onClick={() => setUserHubTab(UserHubTab.Transactions)}
                />
              ) : null
            }
            userHub={
              colonyContext ? (
                <UserHubButton openTab={userHubTab} onOpen={clearUserHubTab} />
              ) : null
            }
            extra={colonyContext ? <JoinButton /> : null}
            className={clsx(
              'modal-blur-navigation [.show-header-in-modal_&]:z-userNavModal',
              {
                'relative z-userNav': !isTablet,
              },
            )}
          />
        </div>
      </section>
      <section
        className={clsx('flex w-full flex-col md:p-0', {
          'md:pb-4': title,
          'px-6 pb-2 pt-6': breadcrumbs,
        })}
      >
        {isTablet && breadcrumbs && (
          <section className="flex-shrink-0">
            <PageHeading breadcrumbs={breadcrumbs} />
          </section>
        )}
        {title && (
          <h1 className="pt-2 text-gray-900 heading-3 md:pt-0">{title}</h1>
        )}
      </section>
    </header>
  );
};

PageHeader.displayName = displayName;

export default PageHeader;
