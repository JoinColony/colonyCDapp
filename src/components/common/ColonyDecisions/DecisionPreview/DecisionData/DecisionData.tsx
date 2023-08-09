import React from 'react';

import { DecisionDraft } from '~utils/decisions';

import { DecisionContent, DecisionNotFound } from '../DecisionData';

const displayName = 'common.ColonyDecisions.DecisionPreview.DecisionData';

export interface DecisionDataProps {
  draftDecision?: DecisionDraft;
}

const DecisionData = ({ draftDecision }: DecisionDataProps) => {
  if (!draftDecision) {
    return <DecisionNotFound />;
  }

  return (
    <DecisionContent
      title={draftDecision.title}
      description={draftDecision.description}
    />
  );
};

DecisionData.displayName = displayName;

export default DecisionData;
