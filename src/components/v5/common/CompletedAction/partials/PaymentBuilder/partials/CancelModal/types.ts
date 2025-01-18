import { type Expenditure } from '~types/graphql.ts';
import { type MotionAction } from '~types/motions.ts';
import { type RefetchExpenditureType } from '~v5/common/CompletedAction/partials/PaymentBuilder/types.ts';
import { type ModalProps } from '~v5/shared/Modal/types.ts';

export interface CancelModalProps extends ModalProps {
  expenditure: Expenditure;
  refetchExpenditure: RefetchExpenditureType;
  isActionStaked: boolean;
  onSuccess?: () => void;
  actionData: MotionAction;
}
