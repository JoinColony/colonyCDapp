import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';

import CardWithBios from '~v5/shared/CardWithBios';
import EmptyContent from '../EmptyContent';
import Link from '~v5/shared/Link';
import { MembersListProps } from './types';
import { useMembersList } from './hooks';
import { useSearchContext } from '~context/SearchContext';
import { TextButton } from '~v5/shared/Button';
import { SpinnerLoader } from '~shared/Preloaders';
import {
  HOMEPAGE_MEMBERS_LIST_LIMIT,
  HOMEPAGE_MOBILE_MEMBERS_LIST_LIMIT,
} from '~constants';
import { useMobile } from '~hooks';

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
  const isMobile = useMobile();
  const limit = isMobile
    ? HOMEPAGE_MOBILE_MEMBERS_LIST_LIMIT
    : HOMEPAGE_MEMBERS_LIST_LIMIT;

  const {
    handleClipboardCopy,
    loadMoreMembers,
    visibleMembers,
    membersLimit,
    canLoadMore,
  } = useMembersList({ list, limit });

  const { searchValue } = useSearchContext();

  const showLoadMoreButton = isHomePage
    ? searchValue && canLoadMore
    : canLoadMore;

  return (
    <div>
      <div className="flex items-center mb-2">
        <h3 className="heading-5 mr-3">{formatMessage(title)}</h3>
        <span className="text-md text-blue-400">
          {list.length} {formatMessage(title)}
        </span>
      </div>
      <p className="mb-6 text-md text-gray-600">{formatMessage(description)}</p>
      {isLoading && (
        <div className="flex justify-center">
          <SpinnerLoader appearance={{ size: 'medium' }} />
        </div>
      )}
      {!isLoading && visibleMembers.length ? (
        <ResponsiveMasonry columnsCountBreakPoints={{ 250: 1, 950: 2 }}>
          <Masonry gutter="1rem">
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
                <CardWithBios
                  key={name}
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
              );
            })}
          </Masonry>
        </ResponsiveMasonry>
      ) : undefined}
      {!isLoading && !list.length ? (
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
        {list.length > membersLimit && !searchValue && viewMoreUrl && (
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
