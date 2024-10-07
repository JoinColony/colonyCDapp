import { ColonyRole } from '@colony/colony-js';
import { defineMessages } from 'react-intl';

import { ActionTitleKey, registerAction } from '~actions/index.ts';
import UpgradeColonyForm from '~v5/common/ActionSidebar/partials/forms/core/UpgradeColonyForm/UpgradeColonyForm.tsx';

import { CoreAction } from './types.ts';

const MSG = defineMessages({
  name: {
    id: 'actions.core.VersionUpgrade.name',
    defaultMessage: 'Upgrade Colony version',
  },
  title: {
    id: 'actions.core.VersionUpgrade.title',
    defaultMessage: 'Upgrade Colony version to v{newVersion} by {initiator}',
  },
});

registerAction({
  component: UpgradeColonyForm,
  name: MSG.name,
  requiredPermissions: [[ColonyRole.Root]],
  title: MSG.title,
  titleKeys: [
    ActionTitleKey.NewVersion,
    ActionTitleKey.Version,
    ActionTitleKey.Initiator,
  ],
  type: CoreAction.VersionUpgrade,
});
