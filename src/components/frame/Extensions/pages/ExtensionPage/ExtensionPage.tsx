import React, { FC, useMemo } from 'react';
import { useIntl } from 'react-intl';

import ExtensionItem from '~common/Extensions/ExtensionItem';
import { useExtensionsData } from '~hooks';
import Spinner from '~shared/Extensions/Spinner';

const displayName = 'frame.Extensions.pages.ExtensionPage';

const ExtensionPage: FC = () => {
  const { availableExtensionsData, installedExtensionsData } = useExtensionsData();
  const { formatMessage } = useIntl();

  const allExtensions = useMemo(
    () => [...availableExtensionsData, ...installedExtensionsData],
    [availableExtensionsData, installedExtensionsData],
  );

  return (
    <Spinner loadingText="incorporationPage">
      <h4 className="text-xl font-semibold mb-6">{formatMessage({ id: 'extensionsPage.availableExtensions' })}</h4>
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
    </Spinner>
  );
};

ExtensionPage.displayName = displayName;

export default ExtensionPage;
