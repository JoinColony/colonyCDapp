import React from 'react';

import { ColonyActionType } from '~gql';
import { formatText } from '~utils/intl';

import CurrentUser from '../CurrentUser/CurrentUser';

const displayName =
  'v5.common.ActionsSidebar.partials.ActionSidebarDescription.partials.EditColonyDetailsDescription';

export const EditColonyDetailsDescription = () => {
  return (
    <>
      {formatText(
        { id: 'action.title' },
        {
          actionType: ColonyActionType.ColonyEdit,
          initiator: <CurrentUser />,
        },
      )}
    </>
  );
};

EditColonyDetailsDescription.displayName = displayName;
export default EditColonyDetailsDescription;
