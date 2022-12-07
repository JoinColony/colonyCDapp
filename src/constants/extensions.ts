import { ColonyRole, Extension } from '@colony/colony-js';
import { defineMessages } from 'react-intl';
import { ExtensionConfig } from '~types';

/**
 * @TODO: Refactor/cleanup this file
 */

const oneTransactionPaymentMessages = defineMessages({
  name: {
    id: 'extensions.OneTxPayment.name',
    defaultMessage: 'One Transaction Payment',
  },
  description: {
    id: 'extensions.OneTxPayment.description',
    defaultMessage: 'Pay a single account one type of token.',
  },
  descriptionLong: {
    id: 'extensions.OneTxPayment.descriptionLong',
    defaultMessage: 'Pay a single account one type of token.',
  },
});

export const supportedExtensionsConfig: ExtensionConfig[] = [
  {
    extensionId: Extension.OneTxPayment,
    name: oneTransactionPaymentMessages.name,
    descriptionShort: oneTransactionPaymentMessages.description,
    descriptionLong: oneTransactionPaymentMessages.descriptionLong,
    neededColonyPermissions: [ColonyRole.Administration, ColonyRole.Funding],
    // @NOTE: This is for testing only, should be set to false afterwards
    uninstallable: true,
  },
];
