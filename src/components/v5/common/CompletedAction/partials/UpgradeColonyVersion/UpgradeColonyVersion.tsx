import React from 'react';

import { ColonyAction } from '~types';

import CreatedInRow from '../rows/CreatedInRow';
import DecisionMethodRow from '../rows/DecisionMethod';
import ActionTypeRow from '../rows/ActionType';
import DescriptionRow from '../rows/Description';
import { ActionDataGrid, ActionSubtitle, ActionTitle } from '../Blocks/Blocks';

const displayName = 'v5.common.CompletedAction.partials.UpgradeColonyVersion';

interface UpgradeColonyVersionProps {
  action: ColonyAction;
}

const UpgradeColonyVersion = ({ action }: UpgradeColonyVersionProps) => {
  const { customTitle = 'Updating the colony version' } =
    action?.metadata || {};

  return (
    <>
      <ActionTitle>{customTitle}</ActionTitle>
      <ActionSubtitle>
        {/* @TODO connect actual version number */}
        Upgrade colony version by {action.initiatorUser?.profile?.displayName}
      </ActionSubtitle>
      <ActionDataGrid>
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
      </ActionDataGrid>
    </>
  );
};

UpgradeColonyVersion.displayName = displayName;
export default UpgradeColonyVersion;
