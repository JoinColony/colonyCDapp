import React from 'react';

import { ColonyActionType } from '~gql';
import { formatText } from '~utils/intl';

import CurrentUser from './CurrentUser';

const displayName =
  'v5.common.ActionsSidebar.partials.ActionSidebarDescription.partials.EnterRecoveryModeDescription';

export const EnterRecoveryModeDescription = () => {
  return (
    <>
      {formatText(
        { id: 'action.title' },
        {
          actionType: ColonyActionType.Recovery,
          initiator: <CurrentUser />,
        },
      )}
    </>
  );
};

EnterRecoveryModeDescription.displayName = displayName;
export default EnterRecoveryModeDescription;
