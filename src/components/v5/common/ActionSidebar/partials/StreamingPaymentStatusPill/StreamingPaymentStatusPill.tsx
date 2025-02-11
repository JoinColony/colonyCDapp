import clsx from 'clsx';
import React, { type FC } from 'react';

import { StreamingPaymentStatus } from '~types/streamingPayments.ts';
import PillsBase from '~v5/common/Pills/PillsBase.tsx';

import { type StreamingPaymentStatusPillProps } from './types.ts';
import { getStatusLabel } from './utils.ts';

const StreamingPaymentStatusPill: FC<StreamingPaymentStatusPillProps> = ({
  status,
}) => (
  <PillsBase
    className={clsx('whitespace-nowrap text-sm font-medium', {
      'bg-success-100 text-success-400':
        status === StreamingPaymentStatus.Active,
      'bg-gray-100 text-gray-500': status === StreamingPaymentStatus.NotStarted,
      'bg-teams-pink-100 text-teams-pink-400':
        status === StreamingPaymentStatus.Ended,
      'bg-teams-pink-150 text-teams-red-600':
        status === StreamingPaymentStatus.Cancelled,
      'bg-teams-yellow-100 text-teams-yellow-500':
        status === StreamingPaymentStatus.LimitReached,
    })}
  >
    {getStatusLabel(status)}
  </PillsBase>
);

export default StreamingPaymentStatusPill;
