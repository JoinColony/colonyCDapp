import { ColonyRole } from '@colony/colony-js';

import { registerAction } from '~actions/utils.ts';

import { CoreAction } from './types.ts';

registerAction({
  name: {
    id: 'actions.core.manageColonyObjective',
    defaultMessage: 'Manage objective',
  },
  requiredPermissions: [[ColonyRole.Root]],
  type: CoreAction.ManageColonyObjective,
});
