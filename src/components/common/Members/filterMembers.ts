import { FormValues } from '~common/ColonyMembers/MembersFilter';
import { VerificationType } from '~common/ColonyMembers/MembersFilter/filtersConfig';

import { Contributor, Watcher } from '~types';

export const filterMembers = <M extends Contributor | Watcher>(
  data: M[],
  searchValue?: string,
  filters?: FormValues,
): M[] => {
  /* No filters */
  if (!searchValue && filters?.verificationType === VerificationType.All) {
    return data;
  }

  /* Only text filter */
  if (searchValue && filters?.verificationType === VerificationType.All) {
    return data.filter(
      ({ user }) =>
        user?.profile?.displayName
          ?.toLowerCase()
          .includes(searchValue.toLowerCase()) ||
        user?.walletAddress
          ?.toLowerCase()
          .includes(searchValue.toLowerCase()) ||
        user?.name.toLowerCase().includes(searchValue.toLowerCase()),
    );
  }

  /* All other combinations */
  return data.filter(({ user }) => {
    const textFilter =
      searchValue === undefined || searchValue === ''
        ? true
        : user?.profile?.displayName
            ?.toLowerCase()
            .includes(searchValue.toLowerCase()) ||
          user?.walletAddress
            ?.toLowerCase()
            .includes(searchValue.toLowerCase()) ||
          user?.name.toLowerCase().includes(searchValue.toLowerCase());

    // if (filters?.verificationType === VerificationType.VERIFIED) {
    //   return isWhitelisted && textFilter;
    // }

    // if (filters?.verificationType === VerificationType.UNVERIFIED) {
    //   return !isWhitelisted && textFilter;
    // }

    // return !isWhitelisted && textFilter;

    return textFilter;
  });
};
