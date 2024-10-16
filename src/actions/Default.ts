import { defineMessages } from 'react-intl';

import Default from '~v5/common/ActionSidebar/partials/forms/Default.tsx';

import { CoreAction } from './core/types.ts';
import { type ActionDefinition } from './types.ts';

const MSG = defineMessages({
  name: {
    id: 'actions.Default.name',
    defaultMessage: 'Default (empty) action',
  },
});

const defaultAction: ActionDefinition = {
  component: Default,
  name: MSG.name,
  type: CoreAction.Generic,
};

export default defaultAction;
