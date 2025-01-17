import {
  type ColonyActionFragment,
  type ColonyActionArbitraryTransaction,
} from '~gql';

export const useModifyArbitraryTransaction = (
  data: ColonyActionArbitraryTransaction[],
  action: ColonyActionFragment,
): (ColonyActionArbitraryTransaction & { action: ColonyActionFragment })[] => {
  return data?.map((transaction) => {
    return {
      ...transaction,
      action,
    };
  });
};
