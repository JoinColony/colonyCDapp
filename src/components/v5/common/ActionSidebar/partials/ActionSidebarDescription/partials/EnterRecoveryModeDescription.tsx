import React from 'react';
import { FormattedMessage } from 'react-intl';

import { ColonyActionType } from '~gql';

import CurrentUser from './CurrentUser';

const displayName =
  'v5.common.ActionsSidebar.partials.ActionSidebarDescription.partials.EnterRecoveryModeDescription';

export const EnterRecoveryModeDescription = () => {
  return (
    <FormattedMessage
      id="action.title"
      values={{
        actionType: ColonyActionType.Recovery,
        initiator: <CurrentUser />,
      }}
    />
  );
};

EnterRecoveryModeDescription.displayName = displayName;
export default EnterRecoveryModeDescription;
