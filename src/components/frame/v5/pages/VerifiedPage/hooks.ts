import { useMemo } from 'react';

import { useMemberContext } from '~context/MemberContext/MemberContext.ts';
import { useSearchContext } from '~context/SearchContext/SearchContext.ts';
import { searchMembers } from '~utils/members.ts';

export const useVerifiedPage = () => {
  const { searchValue } = useSearchContext();
  const { verifiedMembers, loading } = useMemberContext();

  const searchedVerified = useMemo(
    () => searchMembers(verifiedMembers, searchValue),
    [searchValue, verifiedMembers],
  );

  return {
    verifiedMembers: searchedVerified,
    loadingMembers: loading,
  };
};
