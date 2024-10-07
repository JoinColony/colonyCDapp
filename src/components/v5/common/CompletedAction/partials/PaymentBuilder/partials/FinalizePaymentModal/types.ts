import { type Action } from '~constants/actions.ts';
import { type Expenditure } from '~types/graphql.ts';
import { type SelectBaseOption } from '~v5/common/Fields/Select/types.ts';
import { type ModalProps } from '~v5/shared/Modal/types.ts';

export interface FinalizePaymentModalProps extends ModalProps {
  expenditure: Expenditure;
  onSuccess: (decisionMethod: SelectBaseOption) => void;
  actionType: Action;
}
