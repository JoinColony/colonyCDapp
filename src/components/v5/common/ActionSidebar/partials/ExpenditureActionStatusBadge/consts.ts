import { ExpenditureActionStatus } from '~types/expenditures.ts';
import { tw } from '~utils/css/index.ts';

export const EXPENDITURE_STATUS_TO_CLASSNAME_MAP: Record<
  ExpenditureActionStatus,
  string
> = {
  [ExpenditureActionStatus.Review]: tw('bg-gray-100 text-gray-500'),
  [ExpenditureActionStatus.Cancel]: tw('bg-teams-pink-150 text-teams-red-600'),
  [ExpenditureActionStatus.Canceled]: tw(
    'bg-teams-pink-150 text-teams-red-600',
  ),
  [ExpenditureActionStatus.Passed]: tw('bg-success-100 text-success-400'),
  [ExpenditureActionStatus.Release]: tw('bg-teams-teal-50 text-teams-teal-500'),
  [ExpenditureActionStatus.Funding]: tw('bg-teams-blue-50 text-teams-blue-400'),
  [ExpenditureActionStatus.Edit]: tw('bg-orange-100 text-orange-400'),
  [ExpenditureActionStatus.Changes]: tw('bg-indigo-100 text-teams-indigo-500'),
  [ExpenditureActionStatus.Payable]: tw('bg-purple-100 text-teams-purple-500'),
};
