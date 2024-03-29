import React from 'react';
import { FormattedMessage } from 'react-intl';

import { ExtendedColonyActionType } from '~types/actions.ts';

import CurrentUser from './CurrentUser.tsx';

const displayName =
  'v5.common.ActionsSidebar.partials.ActionSidebarDescription.partials.ManageTokensDescription';

export const ManageTokensDescription = () => {
  return (
    <FormattedMessage
      id="action.title"
      values={{
        actionType: ExtendedColonyActionType.UpdateTokens,
        initiator: <CurrentUser />,
      }}
    />
  );
};

ManageTokensDescription.displayName = displayName;
export default ManageTokensDescription;
