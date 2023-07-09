import React, { FC } from 'react';
import { useIntl } from 'react-intl';

import { UserInfoProps } from '../types';
import Icon from '~shared/Icon';
import UserPermissionsBadge from '~common/Extensions/UserPermissionsBadge';
import TitleLabel from '~v5/shared/TitleLabel';
import UserAvatarDetails from '~v5/shared/UserAvatarDetails';

const displayName = 'v5.UserAvatarPopover.partials.UserInfo';

const UserInfo: FC<UserInfoProps> = ({
  userName,
  walletAddress,
  aboutDescription,
  colonyReputation,
  permissions,
  avatar,
  userStatus,
}) => {
  const { formatMessage } = useIntl();

  const aboutDescriptionText =
    typeof aboutDescription === 'string'
      ? aboutDescription
      : aboutDescription && formatMessage(aboutDescription);

  return (
    <div className="sm:min-w-[17rem]">
      <div className="mb-6">
        <UserAvatarDetails
          userName={userName}
          walletAddress={walletAddress}
          avatar={avatar}
          userStatus={userStatus}
        />
      </div>
      <TitleLabel
        className="mt-2 mb-2"
        text={formatMessage({ id: 'userInfo.about.section' })}
      />
      <p className="text-md text-gray-600">{aboutDescriptionText}</p>
      {colonyReputation && colonyReputation.length ? (
        <>
          <TitleLabel
            className="pt-6 mt-6 border-t border-gray-200 mb-2"
            text={formatMessage({ id: 'userInfo.colonyReputation.section' })}
          />
          <ul className="flex flex-col gap-2">
            {colonyReputation?.map(({ key, title, percentage, points }) => {
              const titleText =
                typeof title === 'string'
                  ? title
                  : title && formatMessage(title);

              return (
                <li
                  key={key}
                  className="grid grid-cols-[1fr,auto] gap-x-4 font-medium"
                >
                  <span className="text-md">{titleText}</span>
                  <span className="inline-flex items-center text-sm text-blue-400">
                    <Icon name="star" appearance={{ size: 'extraTiny' }} />
                    <span className="inline-block ml-1 mr-2">
                      {percentage}%
                    </span>
                    {points && <span>{points} pts</span>}
                  </span>
                </li>
              );
            })}
          </ul>
        </>
      ) : undefined}
      {permissions && permissions.length && (
        <>
          <TitleLabel
            className="pt-6 mt-6 border-t border-gray-200 mb-2"
            text={formatMessage({ id: 'userInfo.permissions.section' })}
          />
          <ul className="inline-flex flex-wrap gap-x-1 gap-y-2">
            {permissions.map(({ key, text, description, name }) => (
              <li key={key}>
                <UserPermissionsBadge
                  text={text}
                  description={description}
                  name={name}
                />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

UserInfo.displayName = displayName;

export default UserInfo;
