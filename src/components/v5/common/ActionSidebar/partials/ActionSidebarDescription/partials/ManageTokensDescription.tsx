import React from 'react';
import { FormattedMessage } from 'react-intl';

import { CoreAction } from '~actions/index.ts';

import CurrentUser from './CurrentUser.tsx';

const displayName =
  'v5.common.ActionsSidebar.partials.ActionSidebarDescription.partials.ManageTokensDescription';

export const ManageTokensDescription = () => {
  return (
    <FormattedMessage
      id="action.title"
      values={{
        actionType: CoreAction.ManageTokens,
        initiator: <CurrentUser />,
      }}
    />
  );
};

ManageTokensDescription.displayName = displayName;
export default ManageTokensDescription;
