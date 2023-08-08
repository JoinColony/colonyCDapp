import { useState } from 'react';
import { useColonyContext } from '~hooks';
import { useCopyToClipboard } from '~hooks/useCopyToClipboard';
import { Member } from '~types';

export const useMembersList = ({
  list,
  limit,
}: {
  list: Member[];
  limit: number;
}) => {
  const { colony } = useColonyContext();
  const [membersLimit, setMembersLimit] = useState(limit);
  const { name } = colony || {};
  const colonyURL = `${window.location.origin}/colony/${name}`;

  const { handleClipboardCopy } = useCopyToClipboard(colonyURL);

  const visibleMembers = list.slice(0, membersLimit);

  const canLoadMore = list.length > membersLimit;

  const loadMoreMembers = () =>
    setMembersLimit((prevLimit) => prevLimit + prevLimit);

  return {
    handleClipboardCopy,
    loadMoreMembers,
    visibleMembers,
    membersLimit,
    canLoadMore,
  };
};
