import { type Expenditure } from '~types/graphql.ts';

export enum ExpenditureActionStatus {
  Review = 'Review',
  Funding = 'Funding',
  Release = 'Release',
  Changes = 'Changes',
  Cancel = 'Cancel',
  Canceled = 'Canceled',
  Payable = 'Payable',
  Passed = 'Passed',
  Edit = 'Edit',
}

export interface ExpenditureActionStatusBadgeProps {
  expenditure: Expenditure;
  className?: string;
  withAdditionalStatuses?: boolean;
}
