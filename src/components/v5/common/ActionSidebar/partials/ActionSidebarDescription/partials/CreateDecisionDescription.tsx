import React from 'react';

import { ColonyActionType } from '~gql';
import { formatText } from '~utils/intl';

import CurrentUser from './CurrentUser';

const displayName =
  'v5.common.ActionsSidebar.partials.ActionSidebarDescription.partials.CreateDecisionDescription';

export const CreateDecisionDescription = () => {
  return (
    <>
      {formatText(
        { id: 'action.title' },
        {
          actionType: ColonyActionType.CreateDecisionMotion,
          initiator: <CurrentUser />,
        },
      )}
    </>
  );
};

CreateDecisionDescription.displayName = displayName;
export default CreateDecisionDescription;
