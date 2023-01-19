import React, { useState } from 'react';

import { Decision, User } from '~types';

import { DecisionContent, DecisionNotFound } from '../DecisionData';

const displayName = 'common.ColonyDecisions.DecisionPreview.DecisionData';

export interface DecisionDataProps {
  decision?: Decision;
  user: User;
  setDecision: ReturnType<typeof useState>[1];
}

const DecisionData = ({ decision, user, setDecision }: DecisionDataProps) => {
  const decisionNotFound =
    !decision || decision.walletAddress !== user?.walletAddress;

  if (decisionNotFound) {
    return <DecisionNotFound setDecision={setDecision} />;
  }

  return <DecisionContent decision={decision} user={user} />;
};

DecisionData.displayName = displayName;

export default DecisionData;
