import { Extension } from '@colony/colony-js';
import { type FC } from 'react';

import LazyConsensusSetup from './partials/LazyConsenusSetup/LazyConsensusSetup.tsx';
import { type ExtensionSetupPageBaseProps } from './types.ts';

export type ExtensionSetupComponentScheme = {
  [Extension.VotingReputation]: FC<ExtensionSetupPageBaseProps>;
};

export const extensionSetupComponentScheme: ExtensionSetupComponentScheme = {
  [Extension.VotingReputation]: LazyConsensusSetup,
};
