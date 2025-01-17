import { type ColonyAction } from '~types/graphql.ts';
import { type UseGetStreamingPaymentDataReturnType } from '~v5/common/ActionSidebar/hooks/useGetStreamingPaymentData.ts';

export interface StreamingPaymentProps {
  action: ColonyAction;
  streamingPayment: Omit<
    UseGetStreamingPaymentDataReturnType,
    'startPolling' | 'stopPolling'
  >;
}
