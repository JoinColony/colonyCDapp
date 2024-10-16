import { defineMessages } from 'react-intl';

import { registerAction } from '~actions';
import BatchPaymentForm from '~v5/common/ActionSidebar/partials/forms/core/BatchPaymentForm/BatchPaymentForm.tsx';

import { CoreActionGroup } from './types.ts';

const MSG = defineMessages({
  name: {
    id: 'actions.core.BatchPayment.name',
    defaultMessage: 'Batch payment',
  },
});

registerAction({
  component: BatchPaymentForm,
  name: MSG.name,
  type: CoreActionGroup.BatchPayment,
});
