import React from 'react';
import { FormattedMessage } from 'react-intl';

import { ExtendedColonyActionType } from '~types';

import CurrentUser from './CurrentUser';

const displayName =
  'v5.common.ActionsSidebar.partials.ActionSidebarDescription.partials.ManageColonyObjectiveDescription';

export const ManageColonyObjectiveDescription = () => {
  return (
    <FormattedMessage
      id="action.title"
      values={{
        actionType: ExtendedColonyActionType.UpdateColonyObjective,
        initiator: <CurrentUser />,
      }}
    />
  );
};

ManageColonyObjectiveDescription.displayName = displayName;
export default ManageColonyObjectiveDescription;
