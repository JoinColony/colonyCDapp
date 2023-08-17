import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';

import CardWithBios from '~v5/shared/CardWithBios';
import EmptyContent from '../EmptyContent';
import { MembersListProps } from './types';
import { TextButton } from '~v5/shared/Button';
import { SpinnerLoader } from '~shared/Preloaders';

import { useColonyContext } from '~hooks';
import { useCopyToClipboard } from '~hooks/useCopyToClipboard';
import { ContributorTypeFilter } from '../TableFiltering/types';
import { useMemberContext } from '~context/MemberContext';

const displayName = 'v5.common.MembersList';

const MembersList: FC<MembersListProps> = ({
  title,
  description,
  list,
  isLoading,
  emptyTitle,
  emptyDescription,
  // viewMoreUrl,
  isContributorsList,
}) => {
  const { formatMessage } = useIntl();

  const { colony } = useColonyContext();
  const { name } = colony || {};
  const colonyURL = `${window.location.origin}/colony/${name}`;

  const { handleClipboardCopy } = useCopyToClipboard(colonyURL);

  const {
    loadMoreContributors,
    loadMoreMembers,
    moreMembers,
    moreContributors,
  } = useMemberContext();

  // const { searchValue } = useSearchContext();

  const showLoadMoreButton = isContributorsList
    ? moreContributors
    : moreMembers;

  const loadMore = isContributorsList ? loadMoreContributors : loadMoreMembers;

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
      {!isLoading && list.length ? (
        <ResponsiveMasonry columnsCountBreakPoints={{ 250: 1, 950: 2 }}>
          <Masonry gutter="1rem">
            {list.map((item) => {
              const { user, type } = item;
              const { profile, walletAddress } = user || {};
              return (
                <CardWithBios
                  key={walletAddress}
                  userData={item}
                  description={profile?.bio || ''}
                  shouldStatusBeVisible
                  shouldBeMenuVisible
                  userStatus={
                    (type?.toLowerCase() ?? undefined) as
                      | ContributorTypeFilter
                      | undefined
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
        {/* {list.length > membersLimit && !searchValue && viewMoreUrl && (
          <Link className="text-3" to={viewMoreUrl}>
            {formatMessage({ id: 'viewMore' })}
          </Link>
        )} */}
        {showLoadMoreButton && (
          <TextButton onClick={loadMore}>
            {formatMessage({ id: 'loadMore' })}
          </TextButton>
        )}
      </div>
    </div>
  );
};

MembersList.displayName = displayName;

export default MembersList;
