import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  HOMEPAGE_MEMBERS_LIST_LIMIT,
  HOMEPAGE_MOBILE_MEMBERS_LIST_LIMIT,
  MEMBERS_LIST_LIMIT,
  MEMBERS_MOBILE_LIST_LIMIT,
} from '~constants';
import { useColonyContext, useMobile } from '~hooks';
import { useCopyToClipboard } from '~hooks/useCopyToClipboard';
import { Member } from '~types';

export const useMembersList = ({ list, isHomePage }) => {
  const { colony } = useColonyContext();
  const [membersLimit, setMembersLimit] = useState(MEMBERS_LIST_LIMIT);
  const isMobile = useMobile();
  const { name } = colony || {};
  const colonyURL = `${window.location.origin}/colony/${name}`;

  useEffect(() => {
    if (isHomePage) {
      setMembersLimit(
        isMobile
          ? HOMEPAGE_MOBILE_MEMBERS_LIST_LIMIT
          : HOMEPAGE_MEMBERS_LIST_LIMIT,
      );
    } else {
      setMembersLimit(
        isMobile ? MEMBERS_MOBILE_LIST_LIMIT : MEMBERS_LIST_LIMIT,
      );
    }
  }, [isHomePage, isMobile]);

  const { handleClipboardCopy } = useCopyToClipboard(colonyURL);

  const [startIndex, setStartIndex] = useState(0);
  const [visibleMembers, setVisibleMembers] = useState<Member[]>([]);

  const listLength = list.length;
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
