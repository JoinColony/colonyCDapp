import React, { FC, useMemo } from 'react';
import { useIntl } from 'react-intl';

import ExtensionItem from '~common/Extensions/ExtensionItem';
import Navigation from '~v5/common/Navigation';
import TwoColumns from '~v5/frame/TwoColumns';
import { useExtensionsData } from '~hooks';
import Spinner from '~v5/shared/Spinner';
import { AnyExtensionData } from '~types';

const displayName = 'frame.Extensions.pages.ExtensionsPage';

const ExtensionsPage: FC = () => {
  const { availableExtensionsData, installedExtensionsData } =
    useExtensionsData();
  const { formatMessage } = useIntl();

  const allExtensions: AnyExtensionData[] = useMemo(
    () => [...availableExtensionsData, ...installedExtensionsData],
    [availableExtensionsData, installedExtensionsData],
  );

  const categorizedExtensions: Record<string, AnyExtensionData[]> =
    allExtensions.reduce(
      (acc, extension) => {
        if (!acc[extension.category]) {
          acc[extension.category] = [];
        }

        acc[extension.category].push(extension);
        return acc;
      },
      {} as Record<string, AnyExtensionData[]>, // Type assertion here
    );

  return (
    <Spinner loadingText={{ id: 'loading.extensionsPage' }}>
      <TwoColumns aside={<Navigation pageName="extensions" />}>
        <h4 className="heading-4 mb-6">
          {formatMessage({ id: 'extensionsPage.availableExtensions' })}
        </h4>
        {Object.entries(categorizedExtensions).map(([category, extensions]) => (
          <div key={category} className="pb-12">
            <h5 className="text-2 mb-4">{category}</h5>
            <ul className="flex flex-col gap-y-6 border-b border-gray-100 pb-6">
              {extensions.map((extension) => (
                <li key={extension.extensionId} className="pb-2">
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
        ))}
      </TwoColumns>
    </Spinner>
  );
};

ExtensionsPage.displayName = displayName;

export default ExtensionsPage;
