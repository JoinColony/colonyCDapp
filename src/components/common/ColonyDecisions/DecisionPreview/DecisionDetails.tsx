import React from 'react';

import DetailsWidget from '~shared/DetailsWidget';
import { ColonyAction, ColonyActionType, ColonyDecision } from '~types';
import { useAppContext, useColonyContext } from '~hooks';

const displayName = 'common.ColonyDecisions.DecisionPreview.DecisionDetails';

interface DecisionDetailsProps {
  decision: ColonyDecision;
}

const DecisionDetails = ({ decision }: DecisionDetailsProps) => {
  const { colony } = useColonyContext();
  const { user } = useAppContext();

  if (!colony) {
    return null;
  }

  const widgetValues = {
    type: ColonyActionType.CreateDecisionMotion,
    motionData: {
      nativeMotionDomainId: String(decision.motionDomainId),
    },
    recipientAddress: user?.walletAddress,
  } as ColonyAction; // @TODO: Remove casting

  return <DetailsWidget colony={colony} actionData={widgetValues} />;
};

DecisionDetails.displayName = displayName;

export default DecisionDetails;
