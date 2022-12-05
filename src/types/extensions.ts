import { ColonyRole, Extension } from '@colony/colony-js';
import { MessageDescriptor } from 'react-intl';
import { ColonyExtension } from '~types';

export enum WhitelistPolicy {
  KycOnly = 0,
  AgreementOnly = 1,
  KycAndAgreement = 2,
}

export interface ExtensionConfig {
  extensionId: Extension;
  name: MessageDescriptor;
  descriptionShort: MessageDescriptor;
  descriptionLong: MessageDescriptor;
  neededColonyPermissions: ColonyRole[];
}

export type InstalledExtensionData = ExtensionConfig & ColonyExtension;

export type InstallableExtensionData = ExtensionConfig & {
  availableVersion: number;
};

export type AnyExtensionData =
  | InstalledExtensionData
  | InstallableExtensionData;
