import React, { FC, useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import CardWithBios from '~v5/shared/CardWithBios';
import EmptyContent from '../EmptyContent';
import Link from '~v5/shared/Link';
import { MembersListProps } from './types';
import { useMembersList } from './hooks';
import { useSearchContext } from '~context/SearchContext';
import { TextButton } from '~v5/shared/Button';
import { Member } from '~types';

const displayName = 'v5.common.MembersList';

const MembersList: FC<MembersListProps> = ({
  title,
  description,
  list,
  isLoading,
  emptyTitle,
  emptyDescription,
  viewMoreUrl,
  isHomePage,
}) => {
  const { formatMessage } = useIntl();
  const { handleClipboardCopy } = useMembersList();
  const { searchValue } = useSearchContext();
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

  return (
    <div>
      <div className="flex items-center mb-2">
        <h3 className="heading-5 mr-3">{formatMessage(title)}</h3>
        <span className="text-md text-blue-400">
          {listLength} {formatMessage(title)}
        </span>
      </div>
      <p className="mb-6">{formatMessage(description)}</p>
      {/* @TODO: Add loading state */}
      {!isLoading && listLength ? (
        <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-4">
          {visibleMembers.map((item) => {
            const { user } = item;
            const { name, profile } = user || {};

            return (
              <li key={name}>
                <CardWithBios
                  userData={item}
                  description={profile?.bio || ''}
                  shouldStatusBeVisible
                  shouldBeMenuVisible
                />
              </li>
            );
          })}
        </ul>
      ) : undefined}
      {!isLoading && !listLength ? (
        <EmptyContent
          icon="smiley-meh"
          title={emptyTitle}
          description={emptyDescription}
          withBorder
          buttonText={{ id: 'members.subnav.invite' }}
          onClick={handleClipboardCopy}
        />
      ) : undefined}
      <div className="w-full flex justify-center mt-6">
        {listLength > 8 && !searchValue && (
          <Link className="text-3" to={viewMoreUrl}>
            {formatMessage({ id: 'viewMore' })}
          </Link>
        )}
        {listLength > 8 && searchValue && (
          <TextButton onClick={loadMoreMembers}>
            {formatMessage({ id: 'loadMore' })}
          </TextButton>
        )}
      </div>
    </div>
  );
};

MembersList.displayName = displayName;

export default MembersList;
