import React, { FC, useMemo } from 'react';
import { useIntl } from 'react-intl';

import ExtensionItem from '~common/Extensions/ExtensionItem';
import Navigation from '~common/Extensions/Navigation';
import TwoColumns from '~frame/Extensions/TwoColumns';
import { useExtensionsData } from '~hooks';
import Spinner from '~shared/Extensions/Spinner';

const displayName = 'frame.Extensions.pages.ExtensionsPage';

const ExtensionsPage: FC = () => {
  const { availableExtensionsData, installedExtensionsData } =
    useExtensionsData();
  const { formatMessage } = useIntl();

  const allExtensions = useMemo(
    () => [...availableExtensionsData, ...installedExtensionsData],
    [availableExtensionsData, installedExtensionsData],
  );

  return (
    <Spinner loadingText={{ id: 'loading.extensionsPage' }}>
      <TwoColumns aside={<Navigation />}>
        <h4 className="text-xl font-semibold mb-6">
          {formatMessage({ id: 'extensionsPage.availableExtensions' })}
        </h4>
        <h5 className="text-md font-semibold mb-4">
          {formatMessage({ id: 'status.payments' })}
        </h5>
        <ul className="flex flex-col gap-y-6 border-b border-gray-100 pb-6">
          {allExtensions.map((extension) => (
            <li key={extension.extensionId}>
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
      </TwoColumns>
    </Spinner>
  );
};

ExtensionsPage.displayName = displayName;

export default ExtensionsPage;
