import { SortOptions } from '~shared/SortControls';
import { ColonyAction } from '~types';

export const actionsSort =
  (actionsSortOption: SortOptions) =>
  (first: ColonyAction, second: ColonyAction) => {
    const firstCreatedAt = new Date(first.createdAt).getTime();
    const secondCreatedAt = new Date(second.createdAt).getTime();
    switch (actionsSortOption) {
      case SortOptions.NEWEST:
        return secondCreatedAt - firstCreatedAt;
      case SortOptions.OLDEST:
        return firstCreatedAt - secondCreatedAt;
      default:
        return 0;
    }
  };
