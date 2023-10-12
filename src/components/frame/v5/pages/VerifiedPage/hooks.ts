import { useMemo, useState } from 'react';

import { useMemberContext } from '~context/MemberContext';
import { useSearchContext } from '~context/SearchContext';
import { searchMembers } from '~utils/members';

export const useVerifiedPage = () => {
  const [isSortedDesc, setIsSortedDesc] = useState(true);
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

  const onSortReputationClick = () => {
    setIsSortedDesc(!isSortedDesc);

    searchedVerified.sort((a, b) => {
      if (isSortedDesc) {
        return a.colonyReputationPercentage - b.colonyReputationPercentage;
      }

      return b.colonyReputationPercentage - a.colonyReputationPercentage;
    });
  };

  return {
    verifiedMembers: searchedVerified,
    loadingMembers,
    onSortReputationClick,
    isSortedDesc,
  };
};
