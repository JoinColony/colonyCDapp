import React, { type FC } from 'react';
import { defineMessages } from 'react-intl';

import ExtensionItem from '~common/Extensions/ExtensionItem/index.ts';
import {
  decisionMethodSupportedExtensionsConfig,
  paymentSupportedExtensionsConfig,
} from '~constants';
import { useSetPageHeadingTitle } from '~context/PageHeadingContext/PageHeadingContext.ts';
import useExtensionsData from '~hooks/useExtensionsData.ts';
import { sortExtensionByName } from '~utils/arrays/index.ts';
import { isInstalledExtensionData } from '~utils/extensions.ts';
import { formatText } from '~utils/intl.ts';

import { getExtensionData } from './utils.ts';

const displayName = 'frame.Extensions.pages.Extensions.ExtensionsListingPage';

const MSG = defineMessages({
  title: {
    id: `${displayName}.buttonYourDashboard`,
    defaultMessage: 'Extensions',
  },
  availableExtensions: {
    id: `${displayName}.availableExtensions`,
    defaultMessage: 'Available Extensions',
  },
  decisionMethods: {
    id: `${displayName}.decisionMethods`,
    defaultMessage: 'Decision methods',
  },
  payments: {
    id: `${displayName}.payments`,
    defaultMessage: 'Payments',
  },
});

const ExtensionsListingPage: FC = () => {
  const { availableExtensionsData, installedExtensionsData } =
    useExtensionsData();
  useSetPageHeadingTitle(formatText(MSG.title));

  const categorizedExtensions = [
    {
      category: formatText(MSG.decisionMethods),
      extensions: getExtensionData(
        decisionMethodSupportedExtensionsConfig,
        availableExtensionsData,
        installedExtensionsData,
      ).sort(sortExtensionByName),
    },
    {
      category: formatText(MSG.payments),
      extensions: getExtensionData(
        paymentSupportedExtensionsConfig,
        availableExtensionsData,
        installedExtensionsData,
      ).sort(sortExtensionByName),
    },
  ];

  return (
    <div>
      <h2 className="mb-6 heading-4">{formatText(MSG.availableExtensions)}</h2>
      {categorizedExtensions.map(({ category, extensions }) => (
        <div
          key={category}
          className="mb-6 border-b border-gray-100 last:mb-0 last:border-none"
        >
          <h3 className="mb-4 text-2">{category}</h3>
          <ul className="flex flex-col gap-y-6 pb-6">
            {extensions.map((extension) => (
              <li key={extension.extensionId} className="pb-2">
                <ExtensionItem
                  title={extension.name}
                  description={extension.descriptionShort}
                  version={
                    isInstalledExtensionData(extension)
                      ? extension.currentVersion
                      : extension.availableVersion
                  }
                  icon={extension.icon}
                  extensionId={extension.extensionId}
                />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

ExtensionsListingPage.displayName = displayName;

export default ExtensionsListingPage;
