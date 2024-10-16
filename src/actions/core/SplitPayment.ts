import { defineMessages } from 'react-intl';

import { registerAction } from '~actions';
import SplitPaymentForm from '~v5/common/ActionSidebar/partials/forms/core/SplitPaymentForm/SplitPaymentForm.tsx';

import { CoreActionGroup } from './types.ts';

const MSG = defineMessages({
  name: {
    id: 'actions.core.SplitPayment.name',
    defaultMessage: 'Split payment',
  },
});

registerAction({
  component: SplitPaymentForm,
  name: MSG.name,
  type: CoreActionGroup.SplitPayment,
});
