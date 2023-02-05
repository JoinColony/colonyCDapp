import { ColonyAction, SortDirection } from '~types';

export const actionsSort =
  (actionsSortOption: SortDirection) =>
  (first: ColonyAction, second: ColonyAction) => {
    const firstCreatedAt = new Date(first.createdAt).getTime();
    const secondCreatedAt = new Date(second.createdAt).getTime();
    switch (actionsSortOption) {
      case SortDirection.Desc:
        return secondCreatedAt - firstCreatedAt;
      case SortDirection.Asc:
        return firstCreatedAt - secondCreatedAt;
      default:
        return 0;
    }
  };
