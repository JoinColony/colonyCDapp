import { type MessageDescriptor } from 'react-intl';

import { supportedExtensionsConfig } from '~constants';

const extensionsBreadcrumbNames = supportedExtensionsConfig.reduce(
  (names, extensionConfig) => {
    return {
      ...names,
      [extensionConfig.extensionId]: extensionConfig.name,
    };
  },
  {},
);

export const breadcrumbItemNames: Record<string, MessageDescriptor> = {
  ...extensionsBreadcrumbNames,
};
