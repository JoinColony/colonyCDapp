import React, { type FC } from 'react';

import { useGetStreamingPaymentData } from '~v5/common/ActionSidebar/hooks/useGetStreamingPaymentData.ts';
import StreamingPaymentStatusPill from '~v5/common/ActionSidebar/partials/StreamingPaymentStatusPill/StreamingPaymentStatusPill.tsx';

interface StatusPillProps {
  paymentId: string;
}

const StatusPill: FC<StatusPillProps> = ({ paymentId }) => {
  const { paymentStatus, loadingStreamingPayment } =
    useGetStreamingPaymentData(paymentId);

  return loadingStreamingPayment ? (
    <div className="h-6 w-[3.75rem] overflow-hidden rounded-full skeleton" />
  ) : (
    <StreamingPaymentStatusPill status={paymentStatus} />
  );
};

export default StatusPill;
