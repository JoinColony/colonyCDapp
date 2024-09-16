// @TODO
// Move this inside v5/shared/Navigation/PageLayout

import clsx from 'clsx';
import React, { type FC, type PropsWithChildren, useRef } from 'react';
import { ToastContainer } from 'react-toastify';

import { CSSCustomVariable } from '~constants/cssCustomVariables.ts';
import { useHeightResizeObserver } from '~hooks/useHeightResizeObserver.ts';
import CloseButton from '~shared/Extensions/Toast/partials/CloseButton.tsx';

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
      <div className="flex h-screen w-screen flex-col">
        <section ref={topContentContainerRef}>{topContent}</section>
        <div className="flex h-[calc(100vh-var(--top-content-height))] flex-row">
          <section
            className={clsx('md:py-4 md:pl-4', {
              'sm:py-4 sm:pl-4': enableMobileAndDesktopLayoutBreakpoints,
            })}
          >
            {sidebar}
          </section>
          <div className="flex w-full flex-col items-center overflow-hidden">
            <section
              className={clsx('w-full md:px-8 md:pt-[2.063rem]', {
                'sm:px-6 sm:pt-7': enableMobileAndDesktopLayoutBreakpoints,
              })}
            >
              {headerProps ? <PageHeader {...headerProps} /> : header}
            </section>
            <section
              className={clsx(
                'modal-blur h-full w-full overflow-auto px-6 md:px-8 md:pt-8',
                {
                  'md:!pt-[1.125rem]': !headerProps?.pageHeadingProps?.title,
                },
              )}
            >
              <div
                className={clsx(
                  'mx-auto max-w-[79.875rem] px-6 pb-4 pt-6 md:pt-0',
                  {
                    '!pt-0': enableMobileAndDesktopLayoutBreakpoints,
                  },
                )}
              >
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
