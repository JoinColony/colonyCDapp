import React from 'react';
import { FormattedMessage } from 'react-intl';

import { ColonyActionType } from '~gql';

import CurrentUser from './CurrentUser.tsx';

const displayName =
  'v5.common.ActionsSidebar.partials.ActionSidebarDescription.partials.CreateDecisionDescription';

export const CreateDecisionDescription = () => {
  return (
    <FormattedMessage
      id="action.title"
      values={{
        actionType: ColonyActionType.CreateDecisionMotion,
        initiator: <CurrentUser />,
      }}
    />
  );
};

CreateDecisionDescription.displayName = displayName;
export default CreateDecisionDescription;
