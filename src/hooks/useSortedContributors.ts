import { useState } from 'react';
import Decimal from 'decimal.js';

import { Contributor } from '~types';

import { SortingMethod } from '~gql';

const sortContributors = (sortingMethod) => (user1, user2) => {
  if (sortingMethod === SortingMethod.ByHighestRep && user1.reputationAmount && user2.reputationAmount) {
    return new Decimal(user2.reputationAmount).sub(user1.reputationAmount).toNumber();
  }
  if (sortingMethod === SortingMethod.ByLowestRep && user1.reputationAmount && user2.reputationAmount) {
    return new Decimal(user1.reputationAmount).sub(user2.reputationAmount).toNumber();
  }

  // if (sortingMethod === SORTING_METHODS.BY_MORE_PERMISSIONS) {
  //   return user2.roles.length - user1.roles.length;
  // }
  // if (sortingMethod === SORTING_METHODS.BY_LESS_PERMISSIONS) {
  //   return user1.roles.length - user2.roles.length;
  // }

  return 0;
};

const useSortedContributors = (contributors: Contributor[]) => {
  const [sortingMethod, setSortingMethod] = useState<SortingMethod>(SortingMethod.ByHighestRep);

  return {
    sortedContributors: contributors.sort(sortContributors(sortingMethod)),
    handleSortingMethodChange: setSortingMethod,
    sortingMethod,
  };
};

export default useSortedContributors;
