import clsx from 'clsx';
import React, { useRef, type FC } from 'react';

import UserHubButton from '~common/Extensions/UserHubButton/UserHubButton.tsx';
import { CSSCustomVariable } from '~constants/cssVariables.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { UserNavigationWrapper } from '~frame/Extensions/layouts/index.ts';
import { useTablet } from '~hooks';
import { useHeightResizeObserver } from '~hooks/useResizeObserver.ts';
import JoinButton from '~v5/shared/Button/JoinButton/JoinButton.tsx';
import TxButton from '~v5/shared/TxButton/TxButton.tsx';

import PageHeading from '../PageHeading/index.ts';

import MobileColonySwitcherToggle from './partials/MobileColonySwitcherToggle/MobileColonySwitcherToggle.tsx';
import MobileSidebarToggle from './partials/MobileSidebarToggle/index.ts';
import { type PageHeaderProps } from './types.ts';

const displayName = 'v5.frame.PageLayout.partials.PageHeader';

const PageHeader: FC<PageHeaderProps> = ({ pageHeadingProps }) => {
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
    <header className="w-full">
      <section ref={navSectionRef}>
        <div
          className={clsx(
            'flex flex-row items-center justify-between border-b px-6 py-5',
            'md:border-none md:p-0',
            {
              'md:pb-4': !title,
            },
          )}
        >
          {!isTablet && breadcrumbs && (
            <section className="flex-shrink-0">
              <PageHeading breadcrumbs={breadcrumbs} />
            </section>
          )}
          <div className="flex items-center gap-3">
            {isTablet && <MobileColonySwitcherToggle />}
            {isTablet && colonyContext && <MobileSidebarToggle />}
          </div>
          <UserNavigationWrapper
            txButton={colonyContext ? <TxButton /> : null}
            userHub={colonyContext ? <UserHubButton /> : null}
            extra={colonyContext ? <JoinButton /> : null}
          />
        </div>
      </section>
      <section
        className={clsx('flex w-full flex-col gap-2 p-6', 'md:p-0', {
          'md:pb-4': title,
        })}
      >
        {isTablet && breadcrumbs && (
          <section className="flex-shrink-0">
            <PageHeading breadcrumbs={breadcrumbs} />
          </section>
        )}
        {title && <h1 className="text-gray-900 heading-3">{title}</h1>}
      </section>
    </header>
  );
};

PageHeader.displayName = displayName;

export default PageHeader;
