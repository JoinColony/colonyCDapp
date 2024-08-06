// @TODO
// Move this inside v5/shared/Navigation/PageLayout

import React, { type FC, type PropsWithChildren, useRef } from 'react';
import { ToastContainer } from 'react-toastify';

import { CSSCustomVariable } from '~constants/cssCustomVariables.ts';
import { useHeightResizeObserver } from '~hooks/useHeightResizeObserver.ts';
import CloseButton from '~shared/Extensions/Toast/partials/CloseButton.tsx';

import PageHeader from './partials/PageHeader/index.ts';
import { type PageLayoutProps } from './types.ts';

const displayName = 'v5.frame.PageLayout';

const PageLayout: FC<PropsWithChildren<PageLayoutProps>> = ({
  sidebar,
  header,
  headerProps,
  topContent,
  children,
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
          <section className="md:py-4 md:pl-4">{sidebar}</section>
          <div className="flex w-full flex-col items-center">
            <section className="w-full md:px-6 md:pt-8">
              {header ?? <PageHeader {...headerProps} />}
            </section>
            <section className="w-full overflow-auto">
              <div className="mx-auto max-w-[1144px] px-6 pb-4 md:pt-4">
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
