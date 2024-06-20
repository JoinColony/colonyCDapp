import { type Action } from '~constants/actions.ts';
import { type Expenditure } from '~types/graphql.ts';
import { type ModalProps } from '~v5/shared/Modal/types.ts';

export interface ReleasePaymentModalProps extends ModalProps {
  expenditure: Expenditure;
  onSuccess: () => void;
  actionType: Action;
}
