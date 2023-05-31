import React, { FC, PropsWithChildren, FC } from 'react';
import { useIntl } from 'react-intl';
import Header from '~frame/Extensions/Header';
import Wallet from '~frame/RouteLayouts/UserNavigation/Wallet';
import Navigation from '~common/Extensions/Navigation';
import PageTitle from '~common/Extensions/PageTitle';
import TwoColumns from '~frame/Extensions/TwoColumns';
import { useExtensionsData, useMobile } from '~hooks';
import { SpinnerLoader } from '~shared/Preloaders';

const displayName = 'frame.Extensions.layouts.ExtensionLayout';

const ExtensionLayout: FC<PropsWithChildren> = ({ children }) => {
  const { loading } = useExtensionsData();
  const { formatMessage } = useIntl();
  const isMobile = useMobile();

  if (loading) {
    return (
      <SpinnerLoader
        loadingText={{ id: 'extensionsPage.loading' }}
        appearance={{ theme: 'primary', size: 'massive' }}
      />
    );
  }

  return (
    <div>
      <Header />
      {/* @TODO: Remove wallet component when we have a proper wallet */}
      <div className="hidden">
        <Wallet />
      </div>
      <main className="mt-9">
        <div className="inner">
          {isMobile && <Navigation />}
          <div className="mt-9 sm:mt-6">
            <PageTitle
              title={formatMessage({ id: 'extensionsPage.title' })}
              subtitle={formatMessage({ id: 'extensionsPage.description' })}
            />
          </div>
          <div className="flex lg:gap-[6.25rem] md:gap-12 mt-9">
            <TwoColumns
              aside={
                <div className="-mt-0.5">
                  <Navigation />
                </div>
              }
            >
              {children}
            </TwoColumns>
          </div>
        </div>
      </main>
    </div>
  );
};

ExtensionLayout.displayName = displayName;

export default ExtensionLayout;
