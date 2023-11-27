import React, { FC, PropsWithChildren, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { ToastContainer } from 'react-toastify';

import { useMatch } from 'react-router-dom';
import { useTablet } from '~hooks';
import CloseButton from '~shared/Extensions/Toast/partials/CloseButton';
import styles from '~shared/Extensions/Toast/Toast.module.css';
import { COLONY_HOME_ROUTE } from '~routes';

import NavigationSidebarContextProvider from '../NavigationSidebar/partials/NavigationSidebarContext';
import PageHeader from './partials/PageHeader';
import PageHeading from './partials/PageHeading';
import { PageLayoutProps } from './types';

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

      wrapperRef?.current?.style.setProperty(
        '--top-content-height',
        `${height}px`,
      );
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
        className={styles.toastNotification}
        autoClose={3000}
        hideProgressBar
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover
        closeButton={CloseButton}
      />
      <div className="w-full md:h-screen md:flex md:flex-col" ref={wrapperRef}>
        {/* This div has to always be rendered, otherwise the height of the top content wrapper won't be calculated correctly */}
        <div
          className="sticky top-0 left-0 right-0 w-full z-[1] bg-base-white md:static md:top-auto md:left-auto md:right-auto md:bg-transparent"
          ref={topContentWrapperRef}
        >
          <div className="w-full relative">
            {topContent && <div className="flex-shrink-0">{topContent}</div>}
            {isTablet && sidebar}
          </div>
        </div>
        <AnimatePresence>
          {isTablet ? (
            <div className="inner py-6">
              {pageHeadingProps && (
                <PageHeading {...pageHeadingProps} className="mb-6" />
              )}
              {children}
            </div>
          ) : (
            <div className="w-full md:h-[calc(100vh-var(--top-content-height))] md:pl-4 md:pt-4 md:flex md:gap-8">
              <div
                className={clsx('relative z-[61]', {
                  'md:w-[5.125rem]': !hasWideSidebar,
                  'md:w-[17.5rem]': hasWideSidebar,
                })}
              >
                <div
                  className={clsx(
                    'md:absolute md:top-0 md:bottom-4 md:left-0',
                    { 'w-full': hasWideSidebar },
                  )}
                >
                  {sidebar}
                </div>
              </div>
              <div
                className={clsx('md:flex-grow flex flex-col', {
                  'gap-[1.125rem]': isOnColonyRoute,
                  'gap-8': !isOnColonyRoute,
                })}
              >
                <div className="flex-shrink-0 pt-5 pr-4">
                  <PageHeader
                    {...headerProps}
                    className={clsx({ '!items-center': isOnColonyRoute })}
                  />
                </div>
                <div className="flex-grow overflow-auto pr-4 pb-4">
                  <div
                    className={clsx('w-full mx-auto', {
                      'max-w-[79.875rem]': !isOnColonyRoute,
                      'max-w-[85rem]': isOnColonyRoute,
                    })}
                  >
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
