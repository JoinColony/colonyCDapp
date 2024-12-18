// @TODO
// Move this inside v5/shared/Navigation/PageLayout

import clsx from 'clsx';
import React, { type FC, type PropsWithChildren, useRef } from 'react';
import { ToastContainer } from 'react-toastify';

import { CSSCustomVariable } from '~constants/cssCustomVariables.ts';
import { usePageHeadingContext } from '~context/PageHeadingContext/PageHeadingContext.ts';
import { useTablet } from '~hooks';
import { useHeightResizeObserver } from '~hooks/useHeightResizeObserver.ts';
import CloseButton from '~shared/Extensions/Toast/partials/CloseButton.tsx';
import Breadcrumbs from '~v5/shared/Breadcrumbs/Breadcrumbs.tsx';

import PageHeader from './partials/PageHeader/PageHeader.tsx';
import { type PageLayoutProps } from './types.ts';

const displayName = 'v5.frame.PageLayout';

const PageLayout: FC<PropsWithChildren<PageLayoutProps>> = ({
  sidebar,
  header,
  headerProps,
  topContent,
  children,
  enableMobileAndDesktopLayoutBreakpoints,
}) => {
  const { title: pageTitle } = usePageHeadingContext();

  const isTablet = useTablet();
  const topContentContainerRef = useRef<HTMLDivElement | null>(null);

  useHeightResizeObserver(
    topContentContainerRef,
    CSSCustomVariable.TopContentContainer,
  );

  return (
    <>
      <ToastContainer
        autoClose={3000}
        hideProgressBar
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover
        closeButton={CloseButton}
      />
      <div className="flex h-full w-full flex-col">
        <section ref={topContentContainerRef}>{topContent}</section>
        <div className="flex h-[calc(100dvh-var(--top-content-height))] flex-row">
          <section
            className={clsx('relative md:py-4 md:pl-4', {
              'sm:py-4 sm:pl-4': enableMobileAndDesktopLayoutBreakpoints,
            })}
          >
            {sidebar}
          </section>
          <div className="flex w-full flex-col items-center overflow-hidden">
            <section
              className={clsx('w-full md:px-8 md:pt-9', {
                'sm:px-6 sm:pt-7': enableMobileAndDesktopLayoutBreakpoints,
              })}
            >
              {headerProps ? <PageHeader {...headerProps} /> : header}
            </section>
            <section
              id="main-content-container"
              className={clsx(
                'modal-blur h-full w-full overflow-auto px-6 scrollbar-gutter-stable md:p-8 md:pb-0 md:pt-2',
                {
                  'md:!pt-[1.125rem]': !pageTitle,
                },
              )}
            >
              <div
                className={clsx(
                  'mx-auto flex min-h-full max-w-[79.875rem] flex-grow flex-col pb-4 pt-6 md:pt-0',
                  {
                    '!pt-0': enableMobileAndDesktopLayoutBreakpoints,
                  },
                )}
              >
                {(pageTitle || isTablet) && (
                  <section
                    className={clsx('flex w-full flex-col md:p-0 md:pb-4', {
                      'pb-6': pageTitle,
                      'pb-3.5': !pageTitle,
                    })}
                  >
                    {isTablet && <Breadcrumbs />}
                    {pageTitle && (
                      <h3 className="pt-2 text-gray-900 heading-3 md:pt-0">
                        {pageTitle}
                      </h3>
                    )}
                  </section>
                )}
                {children}
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

PageLayout.displayName = displayName;

export default PageLayout;
