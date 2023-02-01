import { SortOptions } from '~shared/SortControls';
import { ColonyAction } from '~types';

export const actionsSort =
  (actionsSortOption: SortOptions) =>
  (first: ColonyAction, second: ColonyAction) => {
    switch (actionsSortOption) {
      case SortOptions.NEWEST:
        return second.createdAt - first.createdAt;
      case SortOptions.OLDEST:
        return first.createdAt - second.createdAt;
      default:
        return 0;
    }
  };
