import { FormValues } from '~common/ColonyMembers/MembersFilter';
import { VerificationType } from '~common/ColonyMembers/MembersFilter/filtersConfig';

import { Address, Member } from '~types';
import { isUserVerified } from '~utils/verifiedUsers';

const filterMemberBySearchTerm = (member: Member, searchTerm: string) => {
  return (
    member?.user?.profile?.displayName
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
    member?.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

const filterMemberByVerificationStatus = (
  member: Member,
  whitelistedAddresses: Address[],
  verificationType?: VerificationType,
) => {
  const isVerified = isUserVerified(member.address, whitelistedAddresses);

  if (verificationType === VerificationType.Verified) {
    return isVerified;
  }

  if (verificationType === VerificationType.Unverified) {
    return !isVerified;
  }

  return true;
};

export const filterMembers = <M extends Member>(
  members: M[],
  whitelistedAddresses: Address[],
  searchTerm?: string,
  filters?: FormValues,
): M[] => {
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
