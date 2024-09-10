import { ColonyRole } from '@colony/colony-js';

import { type ActionDefinition } from '~actions/utils.ts';
// See this for more info on permissions
import { PERMISSIONS_NEEDED_FOR_ACTION } from '~constants/actions.ts';
import SimplePayment from '~v5/common/ActionSidebar/partials/forms/core/SimplePayment/SimplePayment.tsx';

const formDefinition: ActionDefinition = {
  component: SimplePayment,
  name: {
    id: 'actions.core.simplePayment',
    defaultMessage: 'Simple payment',
  },
  // FIXME: DOES THIS WORK???????
  requiredPermissions: [
    [ColonyRole.Funding, ColonyRole.Arbitration, ColonyRole.Administration],
  ],
  // FIXME: DOES THIS WORK???????
  permissionDomainId: ({ watch }) => watch('from'),
};

// FIXME: Also add validation schema here

export default formDefinition;
