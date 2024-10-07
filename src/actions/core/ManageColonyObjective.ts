import { ColonyRole } from '@colony/colony-js';
import { defineMessages } from 'react-intl';

import { registerAction } from '~actions/index.ts';

import { CoreActionGroup } from './types.ts';

const MSG = defineMessages({
  name: {
    id: 'actions.core.ManageColonyObjective.name',
    defaultMessage: 'Manage objective',
  },
});

registerAction({
  name: MSG.name,
  requiredPermissions: [[ColonyRole.Root]],
  type: CoreActionGroup.UpdateColonyObjective,
});
