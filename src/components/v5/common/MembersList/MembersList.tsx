import React, { FC } from 'react';
import { useIntl } from 'react-intl';

import CardWithBios from '~v5/shared/CardWithBios';
import EmptyContent from '../EmptyContent';
import Link from '~v5/shared/Link';
import { MembersListProps } from './types';
import { useMembersList } from './hooks';
import { useSearchContext } from '~context/SearchContext';
import { TextButton } from '~v5/shared/Button';
import { SpinnerLoader } from '~shared/Preloaders';

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
  isContributorsList,
}) => {
  const { formatMessage } = useIntl();
  const {
    handleClipboardCopy,
    listLength,
    loadMoreMembers,
    visibleMembers,
    membersLimit,
    canLoadMore,
  } = useMembersList({ list, isHomePage });
  const { searchValue } = useSearchContext();

  const showLoadMoreButton = isHomePage
    ? searchValue && canLoadMore
    : canLoadMore;

  return (
    <div>
      {isLoading && (
        <div className="flex justify-center">
          <SpinnerLoader appearance={{ size: 'medium' }} />
        </div>
      )}
      <div className="flex items-center mb-2">
        <h3 className="heading-5 mr-3">{formatMessage(title)}</h3>
        <span className="text-md text-blue-400">
          {listLength} {formatMessage(title)}
        </span>
      </div>
      <p className="mb-6 text-md text-gray-600">{formatMessage(description)}</p>
      {!isLoading && listLength ? (
        <ul className="sm:columns-2">
          {visibleMembers.map((item, index) => {
            const { user } = item;
            const { name, profile } = user || {};
            const membersLength = list.length;

            const incrementedIndex = index + 1;
            const top = Math.floor(membersLength * 0.2);
            const dedicated = Math.floor(membersLength * 0.4);
            const active = Math.floor(membersLength * 0.6);

            const isTopStatus = incrementedIndex <= top;
            const isDedicatedStatus =
              incrementedIndex <= dedicated && incrementedIndex > top;
            const isActiveStatus =
              incrementedIndex <= active && incrementedIndex > dedicated;
            // @TODO: implement NEW status when API will be ready

            return (
              <li key={name} className="pb-4 break-inside-avoid-column">
                <CardWithBios
                  userData={item}
                  description={profile?.bio || ''}
                  shouldStatusBeVisible
                  shouldBeMenuVisible
                  userStatus={
                    (isTopStatus && 'top') ||
                    (isDedicatedStatus && 'dedicated') ||
                    (isActiveStatus && 'active') ||
                    'general'
                  }
                  isContributorsList={isContributorsList}
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
      <div className="w-full flex justify-center mt-2">
        {listLength > membersLimit && !searchValue && viewMoreUrl && (
          <Link className="text-3" to={viewMoreUrl}>
            {formatMessage({ id: 'viewMore' })}
          </Link>
        )}
        {showLoadMoreButton && (
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
