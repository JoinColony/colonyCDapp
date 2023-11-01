import React, { FC, PropsWithChildren, useEffect, useRef } from 'react';
import { useTablet } from '~hooks';

import NavigationSidebar from '../NavigationSidebar';
import { PageLayoutProps } from './types';

const displayName = 'v5.frame.PageLayout';

const PageLayout: FC<PropsWithChildren<PageLayoutProps>> = ({
  navigationSidebarProps,
  headerContent,
  topContent,
  children,
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

  return (
    <div className="w-full md:h-screen md:flex md:flex-col" ref={wrapperRef}>
      {isTablet ? (
        <>
          <div
            className="sticky top-0 left-0 right-0 w-full z-[1] bg-white"
            ref={topContentWrapperRef}
          >
            {topContent && <div className="flex-shrink-0">{topContent}</div>}
            <NavigationSidebar {...navigationSidebarProps} />
          </div>
          <div className="inner pt-6">{children}</div>
        </>
      ) : (
        <>
          {topContent && (
            <div className="flex-shrink-0" ref={topContentWrapperRef}>
              {topContent}
            </div>
          )}
          <div className="w-full md:h-[calc(100vh-var(--top-content-height))] md:pl-4 md:pt-4 md:flex md:gap-8">
            <div className="md:w-[5.125rem] relative z-[1]">
              <div className="md:absolute md:top-0 md:bottom-4 md:left-0">
                <NavigationSidebar {...navigationSidebarProps} />
              </div>
            </div>
            <div className="md:flex-grow flex flex-col gap-8">
              <div className="flex-shrink-0 pt-5 pr-4">{headerContent}</div>
              <div className="flex-grow overflow-auto pr-4">
                <div className="max-w-[79.875rem] w-full mx-auto">
                  {children}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

PageLayout.displayName = displayName;

export default PageLayout;
