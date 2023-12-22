import React from 'react';

import { ColonyAction } from '~types';

import CreatedInRow from '../rows/CreatedInRow';
import DecisionMethodRow from '../rows/DecisionMethod';
import ActionTypeRow from '../rows/ActionType';
import DescriptionRow from '../rows/Description';

const displayName = 'v5.common.CompletedAction.partials.CreateDecision';

interface CreateDecisionProps {
  action: ColonyAction;
}

const CreateDecision = ({ action }: CreateDecisionProps) => {
  const { customTitle = 'Create decision' } = action?.metadata || {};

  return (
    <div className="flex-grow overflow-y-auto px-6">
      <h3 className="heading-3 mb-2 text-gray-900">{customTitle}</h3>
      <div className="mb-7 text-md">
        Unlocking native token by {action.initiatorUser?.profile?.displayName}
      </div>
      <div className="grid grid-cols-[10rem_auto] sm:grid-cols-[12.5rem_auto] gap-y-3 text-md text-gray-900 items-center">
        <ActionTypeRow actionType={action.type} />

        <DecisionMethodRow isMotion={action.isMotion || false} />

        {action.motionData?.motionDomain.metadata && (
          <CreatedInRow
            motionDomainMetadata={action.motionData.motionDomain.metadata}
          />
        )}

        {action.annotation?.message && (
          <DescriptionRow description={action.annotation.message} />
        )}
      </div>
    </div>
  );
};

CreateDecision.displayName = displayName;
export default CreateDecision;
