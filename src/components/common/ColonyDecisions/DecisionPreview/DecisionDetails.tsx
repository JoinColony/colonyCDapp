import React from 'react';

import DetailsWidget from '~shared/DetailsWidget';
import { ColonyMotions, Decision } from '~types';
import { useColonyContext } from '~hooks';
import { getDomain } from '~utils/domains';

const displayName = 'common.ColonyDecisions.DecisionPreview.DecisionDetails';

interface DecisionDetailsProps {
  decision: Decision;
}

const DecisionDetails = ({ decision }: DecisionDetailsProps) => {
  const { colony } = useColonyContext();

  if (!colony) {
    return null;
  }

  const widgetValues = {
    actionType: ColonyMotions.CreateDecisionMotion,
    motionDomain: getDomain(colony, decision.motionDomainId),
  };

  return (
    <DetailsWidget
      recipientAddress={decision.walletAddress}
      colony={colony}
      values={widgetValues}
    />
  );
};

DecisionDetails.displayName = displayName;

export default DecisionDetails;
