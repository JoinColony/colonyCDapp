import React, { FC, PropsWithChildren, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

import { useTablet } from '~hooks';

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

  useEffect(() => {
    if (!topContentWrapperRef.current || !wrapperRef.current) {
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
      <div className="w-full md:h-screen md:flex md:flex-col" ref={wrapperRef}>
        <AnimatePresence>
          {isTablet ? (
            <>
              <div
                className="sticky top-0 left-0 right-0 w-full z-[1] bg-white"
                ref={topContentWrapperRef}
              >
                {topContent && (
                  <div className="flex-shrink-0">{topContent}</div>
                )}
                {sidebar}
              </div>
              <div className="inner pt-6">
                {pageHeadingProps && (
                  <PageHeading {...pageHeadingProps} className="mb-6" />
                )}
                {children}
              </div>
            </>
          ) : (
            <>
              {topContent && (
                <div className="flex-shrink-0" ref={topContentWrapperRef}>
                  {topContent}
                </div>
              )}
              <div className="w-full md:h-[calc(100vh-var(--top-content-height))] md:pl-4 md:pt-4 md:flex md:gap-8">
                <div
                  className={clsx('relative z-[1]', {
                    'md:w-[5.125rem]': !hasWideSidebar,
                    'md:w-[17.5rem]': hasWideSidebar,
                  })}
                >
                  <div className="w-full md:absolute md:top-0 md:bottom-4 md:left-0">
                    {sidebar}
                  </div>
                </div>
                <div className="md:flex-grow flex flex-col gap-8">
                  <div className="flex-shrink-0 pt-5 pr-4">
                    <PageHeader {...headerProps} />
                  </div>
                  <div className="flex-grow overflow-auto pr-4">
                    <div className="max-w-[79.875rem] w-full mx-auto">
                      {children}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </AnimatePresence>
      </div>
    </NavigationSidebarContextProvider>
  );
};

PageLayout.displayName = displayName;

export default PageLayout;
