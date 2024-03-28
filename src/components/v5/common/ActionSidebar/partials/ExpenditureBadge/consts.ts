import { ExpenditureStatus } from '~gql';

export const EXPENDITURE_STATE_TO_CLASSNAME_MAP: Record<
  ExpenditureStatus,
  string
> = {
  [ExpenditureStatus.Draft]: 'text-gray-500 bg-gray-100',
  [ExpenditureStatus.Cancelled]: 'text-teams-red-600 bg-teams-pink-150',
  [ExpenditureStatus.Locked]: 'text-teams-grey-500 bg-teams-grey-50',
  [ExpenditureStatus.Finalized]: 'text-teams-grey-500 bg-teams-grey-50',
};
