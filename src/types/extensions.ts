import { type ColonyRole, type Extension } from '@colony/colony-js';
import { type Icon } from '@phosphor-icons/react';
import { type BigNumberish } from 'ethers';
import { type MessageDescriptor } from 'react-intl';
import { type Schema } from 'yup';

import { type ExtensionCategory } from '~constants/index.ts';
import { type ColonyExtension } from '~types/graphql.ts';

export interface ExtensionInitParam {
  defaultValue?: string | number;
  paramName: string;
  validation: Schema<any>;
  // Transform function that will be applied to the param value before passing it to the saga
  transformValue?: (value: string | number) => BigNumberish;
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
  icon: Icon;
  imageURLs: string[];
  autoEnableAfterInstall?: boolean;
  // Whether the extension params are configurable post-installation
  configurable?: boolean;
}

export type InstalledExtensionData = ExtensionConfig &
  ColonyExtension & {
    availableVersion: number;
    isEnabled: boolean;
    address: string;
    missingColonyPermissions: ColonyRole[];
  };

export type InstallableExtensionData = ExtensionConfig & {
  availableVersion: number;
};

export type AnyExtensionData =
  | InstalledExtensionData
  | InstallableExtensionData;
