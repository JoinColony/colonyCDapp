import { ColonyRole, Extension } from '@colony/colony-js';
import { CleaveOptions } from 'cleave.js/options';
import { MessageDescriptor } from 'react-intl';
import { Schema } from 'yup';
import { ExtensionCategory } from '~constants';

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

export interface ExtensionInitParam {
  title: MessageDescriptor;
  description?: MessageDescriptor;
  defaultValue?: string | number;
  paramName: string;
  validation: Schema<any>;
  type: ExtensionParamType;
  complementaryLabel?: 'hours' | 'periods' | 'percent';
  formattingOptions?: CleaveOptions;
}

export interface ExtensionConfig {
  extensionId: Extension;
  category: ExtensionCategory;
  name: MessageDescriptor;
  descriptionShort: MessageDescriptor;
  descriptionLong: MessageDescriptor;
  neededColonyPermissions: ColonyRole[];
  initializationParams?: ExtensionInitParam[];
  uninstallable: boolean;
  createdAt: number;
  icon: string;
  permissions: {
    title: string;
    permissions: {
      key: string;
      text: MessageDescriptor;
      description: MessageDescriptor;
      name: string;
    }[];
  };
}

export type InstalledExtensionData = ExtensionConfig &
  ColonyExtension & {
    availableVersion: number;
    isEnabled: boolean;
    address: string;
  };

export type InstallableExtensionData = ExtensionConfig & {
  availableVersion: number;
  isEnabled?: boolean;
  isInitialized?: boolean;
  isDeprecated?: boolean;
};

export type AnyExtensionData =
  | InstalledExtensionData
  | InstallableExtensionData;
