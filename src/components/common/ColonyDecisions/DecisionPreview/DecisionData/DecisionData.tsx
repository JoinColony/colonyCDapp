import React from 'react';

import { Decision, User } from '~types';

import { DecisionContent, DecisionNotFound } from '../DecisionData';

const displayName = 'common.ColonyDecisions.DecisionPreview.DecisionData';

export interface DecisionDataProps {
  decision?: Decision;
  user: User;
}

const DecisionData = ({ decision, user }: DecisionDataProps) => {
  const decisionNotFound =
    !decision || decision.walletAddress !== user?.walletAddress;

  if (decisionNotFound) {
    return <DecisionNotFound />;
  }

  return <DecisionContent decision={decision} user={user} />;
};

DecisionData.displayName = displayName;

export default DecisionData;
