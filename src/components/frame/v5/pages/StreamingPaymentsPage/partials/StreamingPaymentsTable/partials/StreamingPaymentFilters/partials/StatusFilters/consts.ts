import { StreamingPaymentStatus } from '~types/streamingPayments.ts';
import { formatText } from '~utils/intl.ts';

export const STATUS_FILTERS = [
  {
    label: formatText({ id: 'streamingPayment.status.active' }),
    name: StreamingPaymentStatus.Active,
  },
  {
    label: formatText({ id: 'streamingPayment.status.ended' }),
    name: StreamingPaymentStatus.Ended,
  },
  {
    label: formatText({ id: 'streamingPayment.status.limitReached' }),
    name: StreamingPaymentStatus.LimitReached,
  },
  {
    label: formatText({ id: 'streamingPayment.status.cancelled' }),
    name: StreamingPaymentStatus.Cancelled,
  },
  {
    label: formatText({ id: 'streamingPayment.status.notStarted' }),
    name: StreamingPaymentStatus.NotStarted,
  },
];
