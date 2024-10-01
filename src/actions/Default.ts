import Default from '~v5/common/ActionSidebar/partials/forms/Default.tsx';

import { CoreAction } from './core/types.ts';
import { type ActionDefinition } from './utils.ts';

const defaultAction: ActionDefinition = {
  component: Default,
  name: {
    id: 'actions.Default',
    defaultMessage: 'Default form',
  },
  type: CoreAction.Generic,
};

export default defaultAction;
