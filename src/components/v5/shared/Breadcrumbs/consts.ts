import { defineMessages, type MessageDescriptor } from 'react-intl';

import { supportedExtensionsConfig } from '~constants';
import {
  COLONY_PERMISSIONS_MULTISIG_SECTION,
  USER_CRYPTO_TO_FIAT_ROUTE,
} from '~routes/routeConstants.ts';

const displayName = 'v5.Breadcrumbs.RouteNames';

const MSG = defineMessages({
  cryptoToFiat: {
    id: `${displayName}.cryptoToFiat`,
    defaultMessage: 'Crypto to fiat',
  },
  multiSig: {
    id: `${displayName}.multisig`,
    defaultMessage: 'Multi-sig',
  },
});

const extensionsBreadcrumbNames = supportedExtensionsConfig.reduce(
  (names, extensionConfig) => {
    return {
      ...names,
      [extensionConfig.extensionId]: extensionConfig.name,
    };
  },
  {},
);

// @TODO we probably want to do it for all possible routes and refrain from automatically just capitalizing the route part
export const breadcrumbItemNames: Record<string, MessageDescriptor> = {
  ...extensionsBreadcrumbNames,
  [USER_CRYPTO_TO_FIAT_ROUTE]: MSG.cryptoToFiat,
  [COLONY_PERMISSIONS_MULTISIG_SECTION]: MSG.multiSig,
};
