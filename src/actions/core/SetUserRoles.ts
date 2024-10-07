import { ColonyRole } from '@colony/colony-js';
import { defineMessages } from 'react-intl';

import { ActionTitleKey, registerAction } from '~actions/index.ts';
import ManagePermissionsForm from '~v5/common/ActionSidebar/partials/forms/core/ManagePermissionsForm/ManagePermissionsForm.tsx';

import { CoreAction } from './types.ts';

const MSG = defineMessages({
  name: {
    id: 'actions.core.SetUserRoles.name',
    defaultMessage: 'Manage permissions',
  },
  title: {
    id: 'actions.core.SetUserRoles.title',
    defaultMessage:
      '{direction} {multiSigAuthority}permissions for {recipient} in {fromDomain} by {initiator}',
  },
});

registerAction({
  component: ManagePermissionsForm,
  name: MSG.name,
  title: MSG.title,
  titleKeys: [
    ActionTitleKey.Direction,
    ActionTitleKey.FromDomain,
    ActionTitleKey.Recipient,
    ActionTitleKey.Initiator,
    ActionTitleKey.MultiSigAuthority,
  ],
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
