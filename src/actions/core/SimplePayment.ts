import { ColonyRole } from '@colony/colony-js';

import { registerAction } from '~actions/utils.ts';
import SimplePaymentForm from '~v5/common/ActionSidebar/partials/forms/core/SimplePaymentForm/SimplePaymentForm.tsx';

import { CoreAction } from './types.ts';

registerAction({
  component: SimplePaymentForm,
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
  type: CoreAction.Payment,
});
