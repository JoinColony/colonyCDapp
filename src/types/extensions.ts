import { ColonyRole, Extension } from '@colony/colony-js';
import { MessageDescriptor } from 'react-intl';
import { ColonyExtension } from '~types';

export enum WhitelistPolicy {
  KycOnly = 0,
  AgreementOnly = 1,
  KycAndAgreement = 2,
}

export enum ExtensionParamType {
  Input = 'Input',
  Radio = 'Radio',
  Textarea = 'Textarea',
}

export interface ExtensionInitParams {
  title: string | MessageDescriptor;
  description?: string | MessageDescriptor;
  defaultValue?: string | number;
  paramName: string;
  // @TODO made optional for dev purposes, we are moving away from Yup validation schema
  validation?: object;
  type: ExtensionParamType;
  complementaryLabel?: 'hours' | 'periods' | 'percent';
}

export interface ExtensionConfig {
  extensionId: Extension;
  name: MessageDescriptor;
  descriptionShort: MessageDescriptor;
  descriptionLong: MessageDescriptor;
  neededColonyPermissions: ColonyRole[];
  initializationParams?: ExtensionInitParams[];
  uninstallable: boolean;
}

export type InstalledExtensionData = ExtensionConfig &
  ColonyExtension & {
    availableVersion: number;
  };

export type InstallableExtensionData = ExtensionConfig & {
  availableVersion: number;
};

export type AnyExtensionData =
  | InstalledExtensionData
  | InstallableExtensionData;
