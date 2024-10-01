import { ColonyRole } from '@colony/colony-js';

import { registerAction } from '~actions/utils.ts';
import PaymentBuilderForm from '~v5/common/ActionSidebar/partials/forms/core/PaymentBuilderForm/PaymentBuilderForm.tsx';

import { CoreAction } from './types.ts';

registerAction({
  component: PaymentBuilderForm,
  name: {
    id: 'actions.core.advancedPayment',
    defaultMessage: 'Advanced payment',
  },
  requiredPermissions: [[ColonyRole.Administration]],
  type: CoreAction.MultiplePayment,
});
