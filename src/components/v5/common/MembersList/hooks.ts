import { useCallback, useEffect, useMemo, useState } from 'react';
import { HOMEPAGE_MEMBERS_LIST_LIMIT, MEMBERS_LIST_LIMIT } from '~constants';
import { useColonyContext } from '~hooks';
import { useCopyToClipboard } from '~hooks/useCopyToClipboard';
import { Member } from '~types';

export const useMembersList = ({ list, isHomePage }) => {
  const { colony } = useColonyContext();
  const { name } = colony || {};
  const colonyURL = `${window.location.origin}/colony/${name}`;

  const { handleClipboardCopy } = useCopyToClipboard(colonyURL);

  const [startIndex, setStartIndex] = useState(0);
  const [visibleMembers, setVisibleMembers] = useState<Member[]>([]);

  const listLength = list.length;
  const membersLimit = isHomePage
    ? HOMEPAGE_MEMBERS_LIST_LIMIT
    : MEMBERS_LIST_LIMIT;
  const endIndex = useMemo(
    () => Math.min(startIndex + membersLimit, listLength),
    [listLength, membersLimit, startIndex],
  );
  const canLoadMore = listLength > membersLimit && endIndex < listLength;

  const showMembers = useCallback(() => {
    setVisibleMembers(list.slice(0, endIndex));
  }, [list, endIndex]);

  const loadMoreMembers = () => {
    showMembers();
    setStartIndex(endIndex);
  };

  useEffect(() => {
    showMembers();
  }, [list, showMembers]);

  return {
    handleClipboardCopy,
    loadMoreMembers,
    visibleMembers,
    listLength,
    membersLimit,
    canLoadMore,
  };
};
