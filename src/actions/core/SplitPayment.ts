import { registerAction } from '~actions/utils.ts';
import SplitPaymentForm from '~v5/common/ActionSidebar/partials/forms/core/SplitPaymentForm/SplitPaymentForm.tsx';

import { CoreAction } from './types.ts';

registerAction({
  component: SplitPaymentForm,
  name: {
    id: 'actions.core.splitPayment',
    defaultMessage: 'Split payment',
  },
  type: CoreAction.SplitPayment,
});
