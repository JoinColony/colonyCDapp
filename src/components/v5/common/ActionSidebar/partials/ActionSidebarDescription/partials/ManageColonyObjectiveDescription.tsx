import React from 'react';

import { ExtendedColonyActionType } from '~types';
import { formatText } from '~utils/intl';

import CurrentUser from './CurrentUser';

const displayName =
  'v5.common.ActionsSidebar.partials.ActionSidebarDescription.partials.ManageColonyObjectiveDescription';

export const ManageColonyObjectiveDescription = () => {
  return (
    <>
      {formatText(
        { id: 'action.title' },
        {
          actionType: ExtendedColonyActionType.UpdateColonyObjective,
          initiator: <CurrentUser />,
        },
      )}
    </>
  );
};

ManageColonyObjectiveDescription.displayName = displayName;
export default ManageColonyObjectiveDescription;
