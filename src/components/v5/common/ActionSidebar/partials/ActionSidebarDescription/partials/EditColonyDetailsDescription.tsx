import React from 'react';
import { FormattedMessage } from 'react-intl';

import { ColonyActionType } from '~gql';

import CurrentUser from './CurrentUser';

const displayName =
  'v5.common.ActionsSidebar.partials.ActionSidebarDescription.partials.EditColonyDetailsDescription';

export const EditColonyDetailsDescription = () => {
  return (
    <FormattedMessage
      id="action.title"
      values={{
        actionType: ColonyActionType.ColonyEdit,
        initiator: <CurrentUser />,
      }}
    />
  );
};

EditColonyDetailsDescription.displayName = displayName;
export default EditColonyDetailsDescription;
