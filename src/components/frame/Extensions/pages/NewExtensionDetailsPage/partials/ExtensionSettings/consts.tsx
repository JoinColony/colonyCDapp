import { Extension } from '@colony/colony-js';
import React from 'react';

import VotingReputationSettings from './VotingReputationSettings.tsx';

export const extensionsSettingsComponents = {
  [Extension.VotingReputation]: <VotingReputationSettings />,
};
