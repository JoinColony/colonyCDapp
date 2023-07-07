import React, { FC } from 'react';
import { useIntl } from 'react-intl';

import { MembersListProps } from './types';
import CardWithBios from '~v5/shared/CardWithBios/CardWithBios';
import EmptyContent from '../EmptyContent';
import { useMembersList } from './hooks';
import Link from '~v5/shared/Link';

const displayName = 'v5.common.MembersList';

const MembersList: FC<MembersListProps> = ({
  title,
  description,
  list,
  isLoading,
  emptyTitle,
  emptyDescription,
  viewMoreUrl,
}) => {
  const { formatMessage } = useIntl();
  const { handleClipboardCopy } = useMembersList();

  const listLength = list.length;

  return (
    <div>
      <div className="flex items-center mb-2">
        <h3 className="heading-5 mr-3">{formatMessage(title)}</h3>
        <span className="text-md text-blue-400">
          {listLength} {formatMessage(title)}
        </span>
      </div>
      <p className="mb-6">{formatMessage(description)}</p>
      {!isLoading && (
        <ul>
          {listLength ? (
            list.map(({ user, ...item }) => (
              <li key={user?.name}>
                <CardWithBios
                  userData={item}
                  description={user?.profile?.bio || ''}
                  shouldStatusBeVisible
                  shouldBeMenuVisible
                />
              </li>
            ))
          ) : (
            <EmptyContent
              icon="smiley-meh"
              title={emptyTitle}
              description={emptyDescription}
              withBorder
              buttonText={{ id: 'members.subnav.invite' }}
              onClick={handleClipboardCopy}
            />
          )}
        </ul>
      )}
      {listLength > 8 && (
        <div className="w-full flex justify-center mt-6">
          <Link className="text-3" to={viewMoreUrl}>
            {formatMessage({ id: 'viewMore' })}
          </Link>
        </div>
      )}
    </div>
  );
};

MembersList.displayName = displayName;

export default MembersList;
