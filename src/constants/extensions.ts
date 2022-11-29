import { ColonyRole, Extension } from '@colony/colony-js';
import { defineMessages, MessageDescriptor } from 'react-intl';
import { ColonyExtension } from '~types';

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

export interface ExtensionConfig {
  extensionId: Extension;
  name: MessageDescriptor;
  descriptionShort: MessageDescriptor;
  descriptionLong: MessageDescriptor;
  availableVersion: number;
  neededColonyPermissions: ColonyRole[];
}

export type InstalledExtensionData = ExtensionConfig & ColonyExtension;

export type AnyExtension = ExtensionConfig | InstalledExtensionData;

export const supportedExtensionsConfig: ExtensionConfig[] = [
  {
    extensionId: Extension.OneTxPayment,
    name: oneTransactionPaymentMessages.name,
    descriptionShort: oneTransactionPaymentMessages.description,
    descriptionLong: oneTransactionPaymentMessages.descriptionLong,
    availableVersion: 3,
    neededColonyPermissions: [ColonyRole.Administration, ColonyRole.Funding],
  },
];

export const isInstalledExtension = (
  extension: AnyExtension,
): extension is InstalledExtensionData =>
  (extension as InstalledExtensionData).address !== undefined;

export default supportedExtensionsConfig;
