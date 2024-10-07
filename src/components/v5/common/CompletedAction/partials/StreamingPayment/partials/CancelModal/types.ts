import { type StreamingPayment } from '~types/graphql.ts';
import { type ModalProps } from '~v5/shared/Modal/types.ts';

export interface CancelModalProps extends ModalProps {
  streamingPayment: StreamingPayment;
  onSuccess: () => void;
}
