import { StreamingPaymentEndCondition } from '~gql';
import { formatText } from '~utils/intl.ts';

export const END_CONDITION_FILTERS = [
  {
    label: formatText({ id: 'streamingPayment.table.filter.whenCancelled' }),
    name: StreamingPaymentEndCondition.WhenCancelled,
  },
  {
    label: formatText({ id: 'streamingPayment.table.filter.fixedDate' }),
    name: StreamingPaymentEndCondition.FixedTime,
  },
  {
    label: formatText({ id: 'streamingPayment.table.filter.limitReached' }),
    name: StreamingPaymentEndCondition.LimitReached,
  },
];
