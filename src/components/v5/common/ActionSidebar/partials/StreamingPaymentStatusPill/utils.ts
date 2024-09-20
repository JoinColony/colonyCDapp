import { StreamingPaymentStatus } from '~types/streamingPayments.ts';
import { formatText } from '~utils/intl.ts';

export const getStatusLabel = (paymentStatus: StreamingPaymentStatus) => {
  switch (paymentStatus) {
    case StreamingPaymentStatus.Active:
      return formatText({ id: 'streamingPayment.status.active' });
    case StreamingPaymentStatus.NotStarted:
      return formatText({ id: 'streamingPayment.status.notStarted' });
    case StreamingPaymentStatus.Ended:
      return formatText({ id: 'streamingPayment.status.ended' });
    case StreamingPaymentStatus.Cancelled:
      return formatText({ id: 'streamingPayment.status.cancelled' });
    case StreamingPaymentStatus.LimitReached:
      return formatText({ id: 'streamingPayment.status.limitReached' });
    default:
      return '';
  }
};
