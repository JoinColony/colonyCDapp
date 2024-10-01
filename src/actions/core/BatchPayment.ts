import { registerAction } from '~actions/utils.ts';
import BatchPaymentForm from '~v5/common/ActionSidebar/partials/forms/core/BatchPaymentForm/BatchPaymentForm.tsx';

import { CoreAction } from './types.ts';

registerAction({
  component: BatchPaymentForm,
  name: {
    id: 'actions.core.batchPayment',
    defaultMessage: 'Batch payment',
  },
  type: CoreAction.BatchPayment,
});
