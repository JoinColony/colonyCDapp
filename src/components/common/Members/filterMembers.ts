import { FormValues } from '~common/ColonyMembers/MembersFilter';
import { VerificationType } from '~common/ColonyMembers/MembersFilter/filtersConfig';

import { Address } from '~types';

const filterMemberBySearchTerm = (member: any, searchTerm: string) => {
  return (
    member?.user?.profile?.displayName
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
    member?.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

const filterMemberByVerificationStatus = (
  member: any,
  whitelistedAddresses: Address[],
  verificationType?: VerificationType,
) => {
  const isVerified = member === whitelistedAddresses[0];

  if (verificationType === VerificationType.Verified) {
    return isVerified;
  }

  if (verificationType === VerificationType.Unverified) {
    return !isVerified;
  }

  return true;
};

export const filterMembers = (
  members: any[],
  whitelistedAddresses: Address[],
  searchTerm?: string,
  filters?: FormValues,
) => {
  let filtered = members;

  if (filters?.verificationType !== VerificationType.All) {
    filtered = members.filter((member) =>
      filterMemberByVerificationStatus(
        member,
        whitelistedAddresses,
        filters?.verificationType,
      ),
    );
  }

  if (searchTerm) {
    return filtered.filter((member) =>
      filterMemberBySearchTerm(member, searchTerm),
    );
  }

  return filtered;
};
