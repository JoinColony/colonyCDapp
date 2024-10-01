import { ColonyRole } from '@colony/colony-js';

import { registerAction } from '~actions/utils.ts';
import UpgradeColonyForm from '~v5/common/ActionSidebar/partials/forms/core/UpgradeColonyForm/UpgradeColonyForm.tsx';

import { CoreAction } from './types.ts';

registerAction({
  component: UpgradeColonyForm,
  name: {
    id: 'actions.core.upgradeColony',
    defaultMessage: 'Upgrade Colony version',
  },
  requiredPermissions: [[ColonyRole.Root]],
  type: CoreAction.VersionUpgrade,
});
