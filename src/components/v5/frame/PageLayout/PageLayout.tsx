import clsx from 'clsx';
import { AnimatePresence } from 'framer-motion';
import React, {
  type FC,
  type PropsWithChildren,
  useEffect,
  useRef,
} from 'react';
import { useMatch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { useTablet } from '~hooks/index.ts';
import { COLONY_HOME_ROUTE } from '~routes/index.ts';
import CloseButton from '~shared/Extensions/Toast/partials/CloseButton.tsx';

import NavigationSidebarContextProvider from '../NavigationSidebar/partials/NavigationSidebarContext/index.ts';

import PageHeader from './partials/PageHeader/index.ts';
import PageHeading from './partials/PageHeading/index.ts';
import { type PageLayoutProps } from './types.ts';

const displayName = 'v5.frame.PageLayout';

const PageLayout: FC<PropsWithChildren<PageLayoutProps>> = ({
  sidebar,
  headerProps,
  topContent,
  children,
  hasWideSidebar,
}) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const topContentWrapperRef = useRef<HTMLDivElement | null>(null);
  const isTablet = useTablet();
  const isOnColonyRoute = useMatch(COLONY_HOME_ROUTE);

  useEffect(() => {
    if (!topContentWrapperRef?.current || !wrapperRef?.current) {
      return undefined;
    }

    const observer = new ResizeObserver(([entry]) => {
      const {
        contentRect: { height },
      } = entry;

      // Must set this css variable on the body so that any elements rendered in portals outside of the
      // wrapper in the DOM will still have the correct variable value.
      document.body.style.setProperty('--top-content-height', `${height}px`);
    });

    observer.observe(topContentWrapperRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  const { pageHeadingProps } = headerProps;

  return (
    <NavigationSidebarContextProvider>
      <ToastContainer
        autoClose={3000}
        hideProgressBar
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover
        closeButton={CloseButton}
        className="modal-blur"
      />
      <div className="w-full md:flex md:h-screen md:flex-col" ref={wrapperRef}>
        {/* This div has to always be rendered, otherwise the height of the top content wrapper won't be calculated correctly */}
        <div
          className="z-base w-full bg-base-white sm:z-sidebar md:bg-transparent"
          ref={topContentWrapperRef}
        >
          <div className="relative w-full">
            {topContent && <div className="flex-shrink-0">{topContent}</div>}
            {isTablet && sidebar}
          </div>
        </div>
        <AnimatePresence>
          {isTablet ? (
            <div className="inner h-[calc(100vh-var(--top-content-height))] overflow-auto py-6">
              {pageHeadingProps && (
                <PageHeading {...pageHeadingProps} className="mb-2 sm:mb-6" />
              )}
              {children}
            </div>
          ) : (
            <div className="w-full md:flex md:h-[calc(100vh-var(--top-content-height))] md:gap-8 md:pl-4 md:pt-4">
              <div
                className={clsx(
                  'modal-blur relative z-sidebar md:flex-shrink-0',
                  {
                    'md:w-[5.125rem]': !hasWideSidebar,
                    'md:w-[17.5rem]': hasWideSidebar,
                  },
                )}
              >
                <div
                  className={clsx(
                    'md:absolute md:bottom-4 md:left-0 md:top-0',
                    { 'w-full': hasWideSidebar },
                  )}
                >
                  {sidebar}
                </div>
              </div>
              <div
                className={clsx('flex flex-col md:flex-grow', {
                  'gap-[1.125rem]': isOnColonyRoute,
                  'gap-8': !isOnColonyRoute,
                })}
              >
                <div className="flex-shrink-0 pr-4 pt-4">
                  <PageHeader
                    {...headerProps}
                    className={clsx({ '!items-center': isOnColonyRoute })}
                  />
                </div>
                <div
                  className="modal-blur flex-grow overflow-auto pb-4 pr-4"
                  style={{ scrollbarGutter: 'stable' }}
                >
                  <div className="w-full max-w-[79.875rem] xl:mx-auto">
                    {children}
                  </div>
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </NavigationSidebarContextProvider>
  );
};

PageLayout.displayName = displayName;

export default PageLayout;
