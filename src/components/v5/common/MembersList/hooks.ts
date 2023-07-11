import { useCallback, useEffect, useState } from 'react';
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
  const loadSize = isHomePage ? 8 : 12;
  const endIndex = Math.min(startIndex + loadSize, listLength);

  const showMembers = useCallback(() => {
    setVisibleMembers(list.slice(startIndex, endIndex));
  }, [list, startIndex, endIndex]);

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
  };
};
