import { SmileyMeh } from '@phosphor-icons/react';
import React, { type FC } from 'react';
import { type MessageDescriptor, useIntl } from 'react-intl';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';

import { useColonyContext } from '~context/ColonyContext.tsx';
import { useMemberContext } from '~context/MemberContext.tsx';
import useCopyToClipboard from '~hooks/useCopyToClipboard.ts';
import { SpinnerLoader } from '~shared/Preloaders/index.ts';
import { formatText } from '~utils/intl.ts';
import { TextButton } from '~v5/shared/Button/index.ts';
import CardWithBios from '~v5/shared/CardWithBios/index.ts';

import EmptyContent from '../EmptyContent/index.ts';

import { type MembersListProps } from './types.ts';

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
  const colonyURL = `${window.location.protocol}//${process.env.HOST}/${colonyName}`;

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
          icon={SmileyMeh}
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
