import { type ExpenditureActionStatus } from '~types/expenditures.ts';

export interface ExpenditureActionStatusBadgeProps {
  status: ExpenditureActionStatus;
  className?: string;
}
