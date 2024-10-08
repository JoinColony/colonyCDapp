import { type ExpenditurePayout } from '~types/graphql.ts';

export interface PaymentOverviewProps {
  total: ExpenditurePayout[];
  paid: ExpenditurePayout[];
  payable?: ExpenditurePayout[];
  className?: string;
}
