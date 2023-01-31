import { SortOptions } from '~shared/SortControls';
import { FormattedAction } from '~types';

export const actionsSort =
  (actionsSortOption: SortOptions) =>
  (first: FormattedAction, second: FormattedAction) => {
    switch (actionsSortOption) {
      case SortOptions.NEWEST:
        return second.createdAt.getTime() - first.createdAt.getTime();
      case SortOptions.OLDEST:
        return first.createdAt.getTime() - second.createdAt.getTime();
      default:
        return 0;
    }
  };
