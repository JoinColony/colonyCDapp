/* eslint-disable max-len */
import React, { FC, useMemo } from 'react';
import { useIntl } from 'react-intl';
import ExtensionItem from '~common/Extensions/ExtensionItem';
import PageTitle from '~common/Extensions/PageTitle';
import TwoColumns from '~frame/Extensions/TwoColumns/TwoColumns';
import { useExtensionsData, useMobile } from '~hooks';
import { SpinnerLoader } from '~shared/Preloaders';

const displayName = 'common.Pages.MainExtensionPage';

const MainExtensionPage: FC = () => {
  const { loading, availableExtensionsData, installedExtensionsData } = useExtensionsData();
  const { formatMessage } = useIntl();
  const isMobile = useMobile();

  const allExtensions = useMemo(
    () => [...availableExtensionsData, ...installedExtensionsData],
    [availableExtensionsData, installedExtensionsData],
  );

  if (loading) {
    return (
      <SpinnerLoader
        loadingText={{ id: 'extensionsPage.loading' }}
        appearance={{ theme: 'primary', size: 'massive' }}
      />
    );
  }

  return (
    <div className="mb-6">
      {/* @TODO: Add sidepanel */}
      {isMobile && <div>Sidepanel</div>}
      <div className="mt-9 sm:mt-6">
        <PageTitle
          title={formatMessage({ id: 'extensionsPage.title' })}
          subtitle={formatMessage({ id: 'extensionsPage.description' })}
        />
      </div>
      <div className="flex lg:gap-[6.25rem] md:gap-12 mt-9">
        {/* @TODO: Add sidepanel */}
        <TwoColumns aside={<div>Sidepanel</div>}>
          <div>
            <h4 className="text-xl font-semibold mb-6">
              {formatMessage({ id: 'extensionsPage.availableExtensions' })}
            </h4>
            <h5 className="text-md font-semibold mb-4">{formatMessage({ id: 'extensionsPage.payments' })}</h5>
            <ul className="pb-6 border-b border-gray-100">
              {allExtensions.map((extension) => (
                <li className="mb-6" key={extension.extensionId}>
                  <ExtensionItem
                    title={extension.name}
                    description={extension.descriptionShort}
                    version={extension.availableVersion}
                    icon={extension.icon}
                    extensionId={extension.extensionId}
                  />
                </li>
              ))}
            </ul>
          </div>
        </TwoColumns>
      </div>
    </div>
  );
};

MainExtensionPage.displayName = displayName;

export default MainExtensionPage;
