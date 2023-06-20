import { FormValues } from '~common/ColonyMembers/MembersFilter';
import { VerificationType } from '~common/ColonyMembers/MembersFilter/filtersConfig';

import { Contributor, Watcher } from '~types';

const filterMemberBySearchTerm = (
  member: Contributor | Watcher,
  searchTerm?: string,
) => {
  return (
    searchTerm &&
    (member?.user?.profile?.displayName
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
      member?.user?.walletAddress
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      member?.user?.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );
};

const filterMemberByVerificationStatus = (
  member: Contributor | Watcher,
  verificationType?: VerificationType,
) => {
  if (verificationType === VerificationType.Verified) {
    return true;
    // return member.isWhitelisted;
  }

  if (verificationType === VerificationType.Unverified) {
    return true;
    // return !member.isWhitelisted;
  }

  return true;
  // return !member.isWhitelisted;
};

export const filterMembers = <M extends Contributor | Watcher>(
  members: M[],
  searchTerm?: string,
  filters?: FormValues,
): M[] => {
  /* No filters */
  if (!searchTerm && filters?.verificationType === VerificationType.All) {
    return members;
  }

  return members.filter(
    (member) =>
      filterMemberBySearchTerm(member, searchTerm) &&
      filterMemberByVerificationStatus(member, filters?.verificationType),
  );
};
