import { type Expenditure } from '~types/graphql.ts';
import { type ModalProps } from '~v5/shared/Modal/types.ts';

import { type RefetchExpenditureType } from '../../types.ts';

export interface ReleasePaymentModalProps extends ModalProps {
  expenditure: Expenditure;
  refetchExpenditure: RefetchExpenditureType;
}
