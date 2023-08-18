import { useMemo } from 'react';

import { useMemberContext } from '~context/MemberContext';
import { useSearchContext } from '~context/SearchContext';
import { searchMembers } from '~utils/members';

export const useVerifiedPage = () => {
  const { searchValue } = useSearchContext();
  const { members, loadingMembers } = useMemberContext();

  const verifiedMembers = useMemo(
    () => members.filter(({ isVerified }) => isVerified),
    [members],
  );

  const searchedVerified = useMemo(
    () => searchMembers(verifiedMembers, searchValue),
    [searchValue, verifiedMembers],
  );

  return { verifiedMembers: searchedVerified, loadingMembers };
};
