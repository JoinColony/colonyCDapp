import { ColonyRole } from '@colony/colony-js';

import { registerAction } from '~actions/utils.ts';
import ManagePermissionsForm from '~v5/common/ActionSidebar/partials/forms/core/ManagePermissionsForm/ManagePermissionsForm.tsx';

import { CoreAction } from './types.ts';

registerAction({
  component: ManagePermissionsForm,
  name: {
    id: 'actions.core.managePermissions',
    defaultMessage: 'Manage permissions',
  },
  // FIXME: This depends on what permissions we want to manage:
  // // If assigning permissions in the root domain, the root role is required
  // ManagePermissionsInRootDomain: [[ColonyRole.Root]],
  // // If assigning permissions in any other domain, root or architecture is required
  // ManagePermissionsInSubDomain: [[ColonyRole.Root], [ColonyRole.Architecture]],
  // // Except when using multi-sig, then the architecture role is required
  // ManagePermissionsInSubDomainViaMultiSig: [[ColonyRole.Architecture]],
  requiredPermissions: [[ColonyRole.Root]],
  type: CoreAction.Recovery,
});
