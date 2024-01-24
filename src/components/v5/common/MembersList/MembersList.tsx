import React, { FC } from 'react';
import { MessageDescriptor, useIntl } from 'react-intl';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';

import { useColonyContext } from '~context/ColonyContext';
import { useMemberContext } from '~context/MemberContext';
import useCopyToClipboard from '~hooks/useCopyToClipboard';
import { SpinnerLoader } from '~shared/Preloaders';
import { formatText } from '~utils/intl';
import { TextButton } from '~v5/shared/Button';
import CardWithBios from '~v5/shared/CardWithBios';

import EmptyContent from '../EmptyContent';

import { MembersListProps } from './types';

const displayName = 'v5.common.MembersList';

const getSubTitle = (title: MessageDescriptor, count: number) => {
  if (!count) {
    return '';
  }

  const formatted = formatText(title);
  return `${count} ${formatted}`;
};

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

  const {
    colony: { name: colonyName },
  } = useColonyContext();
  const colonyURL = `${window.location.origin}/${colonyName}`;

  const { handleClipboardCopy } = useCopyToClipboard();

  const {
    loadMoreContributors,
    loadMoreMembers,
    moreMembers,
    moreContributors,
    totalContributorCount,
    totalMemberCount,
  } = useMemberContext();

  const subTitle = getSubTitle(
    title,
    isContributorsList ? totalContributorCount : totalMemberCount,
  );

  const showLoadMoreButton = isContributorsList
    ? moreContributors
    : moreMembers;

  const loadMore = isContributorsList ? loadMoreContributors : loadMoreMembers;

  return (
    <div>
      <div className="flex items-center mb-2">
        <h3 className="heading-5 mr-3">{formatMessage(title)}</h3>
        <span className="text-md text-blue-400">{subTitle}</span>
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
              const { user, contributorAddress } = item;
              const { profile } = user || {};
              return (
                <CardWithBios
                  key={contributorAddress}
                  userData={item}
                  description={profile?.bio || ''}
                  shouldStatusBeVisible
                  shouldBeMenuVisible
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
          onClick={() => handleClipboardCopy(colonyURL)}
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
