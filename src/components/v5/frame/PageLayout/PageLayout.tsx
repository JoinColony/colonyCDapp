import clsx from 'clsx';
import React, { type FC, type PropsWithChildren, useRef } from 'react';
import { useMatch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { CSSCustomVariable } from '~constants/cssVariables.ts';
import { useHeightResizeObserver } from '~hooks/useResizeObserver.ts';
import { COLONY_HOME_ROUTE } from '~routes/index.ts';
import CloseButton from '~shared/Extensions/Toast/partials/CloseButton.tsx';

import PageHeader from './partials/PageHeader/index.ts';
import { type PageLayoutProps } from './types.ts';

const displayName = 'v5.frame.PageLayout';

const PageLayout: FC<PropsWithChildren<PageLayoutProps>> = ({
  sidebar,
  headerProps,
  topContent,
  children,
}) => {
  const topContentContainerRef = useRef<HTMLDivElement | null>(null);
  const dashboardRoute = useMatch(COLONY_HOME_ROUTE);

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
        className="modal-blur"
      />
      <div className="flex h-screen w-screen flex-col">
        <section ref={topContentContainerRef}>{topContent}</section>
        <div className="flex h-full flex-row">
          <section className="md:py-4 md:pl-4">{sidebar}</section>
          <div className="flex w-full flex-col items-center">
            <section className="w-full md:px-6 md:pt-8">
              <PageHeader {...headerProps} />
            </section>
            <section className="w-full overflow-auto">
              <div
                className={clsx('mx-auto max-w-[1144px] px-6', {
                  'pt-0': !!dashboardRoute,
                  'pt-4': !dashboardRoute,
                })}
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
