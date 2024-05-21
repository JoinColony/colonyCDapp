import { type ExpenditureStatus } from '~gql';

export interface ExpenditureBadgeProps {
  status?: ExpenditureStatus;
  className?: string;
}
