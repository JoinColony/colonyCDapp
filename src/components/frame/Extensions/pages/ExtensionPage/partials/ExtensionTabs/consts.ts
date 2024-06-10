import { Extension } from '@colony/colony-js';
import { type FC } from 'react';

import {
  type TabItem,
  ExtensionPageTabId,
} from '~shared/Extensions/Tabs/types.ts';

import LazyConsensusSettings from '../ExtensionSettings/partials/LazyConsensusSettings/LazyConsensusSettings.tsx';
import StakedExpendituresSettings from '../ExtensionSettings/partials/StakedExpendituresSettings/index.ts';
import { type ExtensionSettingsBaseProps } from '../ExtensionSettings/types.ts';

export const extensionSettingsParamsScheme = {
  [Extension.VotingReputation]: 'votingReputation',
  [Extension.StakedExpenditure]: 'stakedExpenditure',
};

const extensionTabButtonsScheme = {
  [ExtensionPageTabId.Overview]: {
    id: ExtensionPageTabId.Overview,
    title: 'Overview',
  },
  [ExtensionPageTabId.Settings]: {
    id: ExtensionPageTabId.Settings,
    title: 'Extension settings',
  },
};

type ExtensionTabsSetScheme = Partial<{
  [k in Extension]: TabItem[];
}>;

export const extensionTabsSetScheme: ExtensionTabsSetScheme = {
  [Extension.VotingReputation]: [
    extensionTabButtonsScheme[ExtensionPageTabId.Overview],
    extensionTabButtonsScheme[ExtensionPageTabId.Settings],
  ],
  [Extension.StakedExpenditure]: [
    extensionTabButtonsScheme[ExtensionPageTabId.Overview],
    extensionTabButtonsScheme[ExtensionPageTabId.Settings],
  ],
  [Extension.OneTxPayment]: [
    extensionTabButtonsScheme[ExtensionPageTabId.Overview],
  ],
  [Extension.StagedExpenditure]: [
    extensionTabButtonsScheme[ExtensionPageTabId.Overview],
  ],
  [Extension.StreamingPayments]: [
    extensionTabButtonsScheme[ExtensionPageTabId.Overview],
  ],
};

export type ExtensionSettingsComponentsScheme = {
  [Extension.VotingReputation]: FC<ExtensionSettingsBaseProps>;
  [Extension.StakedExpenditure]: FC<ExtensionSettingsBaseProps>;
};

export const extensionSettingsComponentsScheme: ExtensionSettingsComponentsScheme =
  {
    [Extension.VotingReputation]: LazyConsensusSettings,
    [Extension.StakedExpenditure]: StakedExpendituresSettings,
  };
