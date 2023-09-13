import { ColonyRole, Extension } from '@colony/colony-js';
import { CleaveOptions } from 'cleave.js/options';
import { BigNumberish } from 'ethers';
import { MessageDescriptor } from 'react-intl';
import { Schema } from 'yup';

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
  // Transform function that will be applied to the param value before passing it to the saga
  transformValue?: (value: string | number) => BigNumberish;
}

export interface ExtensionConfig {
  extensionId: Extension;
  name: MessageDescriptor;
  descriptionShort: MessageDescriptor;
  descriptionLong: MessageDescriptor;
  neededColonyPermissions: ColonyRole[];
  initializationParams?: ExtensionInitParam[];
  uninstallable: boolean;
  createdAt: number;
}

export type InstalledExtensionData = ExtensionConfig &
  ColonyExtension & {
    availableVersion: number;
    isEnabled: boolean;
    missingColonyPermissions: ColonyRole[];
  };

export type InstallableExtensionData = ExtensionConfig & {
  availableVersion: number;
};

export type AnyExtensionData =
  | InstalledExtensionData
  | InstallableExtensionData;
