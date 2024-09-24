import { Extension } from '@colony/colony-js';
import React from 'react';

import StakedExpenditureSettings from './StakedExpenditureSettings.tsx';
import VotingReputationSettings from './VotingReputationSettings.tsx';

export const extensionsSettingsComponents = {
  [Extension.VotingReputation]: <VotingReputationSettings />,
  [Extension.StakedExpenditure]: <StakedExpenditureSettings />,
};
