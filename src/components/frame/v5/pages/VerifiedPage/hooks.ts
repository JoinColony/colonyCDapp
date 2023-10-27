import { useMemo } from 'react';

import { useMemberContext } from '~context/MemberContext';
import { useSearchContext } from '~context/SearchContext';
import { searchMembers } from '~utils/members';

export const useVerifiedPage = () => {
  const { searchValue } = useSearchContext();
  const { verifiedMembers, loadingMembers } = useMemberContext();

  const searchedVerified = useMemo(
    () => searchMembers(verifiedMembers, searchValue),
    [searchValue, verifiedMembers],
  );

  return {
    verifiedMembers: searchedVerified,
    loadingMembers,
  };
};
