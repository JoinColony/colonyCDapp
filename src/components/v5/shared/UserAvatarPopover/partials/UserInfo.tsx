import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import clsx from 'clsx';

import { UserInfoProps } from '../types';
import Icon from '~shared/Icon';
import UserPermissionsBadge from '~common/Extensions/UserPermissionsBadge';
import TitleLabel from '~v5/shared/TitleLabel';
import UserAvatarDetails from '~v5/shared/UserAvatarDetails';
import UserStatus from '~v5/common/Pills/UserStatus';

const displayName = 'v5.UserAvatarPopover.partials.UserInfo';

const UserInfo: FC<UserInfoProps> = ({
  userName,
  walletAddress,
  aboutDescription,
  colonyReputation,
  permissions,
  avatar,
  userStatus,
  teams,
  isContributorsList,
}) => {
  const { formatMessage } = useIntl();

  const aboutDescriptionText =
    typeof aboutDescription === 'string'
      ? aboutDescription
      : aboutDescription && formatMessage(aboutDescription);

  const isTopContributorType = userStatus === 'top' && isContributorsList;

  return (
    <div className="sm:min-w-[17rem]">
      <div
        className={clsx({
          'bg-purple-100 p-6': isTopContributorType,
          'bg-base-white': !isTopContributorType,
        })}
      >
        <div className="mb-6">
          <UserAvatarDetails
            userName={userName}
            walletAddress={walletAddress}
            avatar={avatar}
            userStatus={userStatus}
            isContributorsList={isContributorsList}
          />
        </div>
        {isTopContributorType && teams && (
          <>
            <TitleLabel
              className="mb-2"
              text={formatMessage({ id: 'userInfo.top.contributor.in' })}
            />
            <div className="flex gap-1">
              {Array.isArray(teams) ? (
                teams?.map((item) => (
                  <UserStatus mode="team" text={{ id: item }} />
                ))
              ) : (
                <UserStatus mode="team" text={{ id: teams }} />
              )}
            </div>
          </>
        )}
      </div>
      <TitleLabel
        className={clsx('mt-2 mb-2', {
          'px-6': isTopContributorType,
        })}
        text={formatMessage({ id: 'userInfo.about.section' })}
      />
      <p
        className={clsx('text-md text-gray-600', {
          'px-6': isTopContributorType,
        })}
      >
        {aboutDescriptionText}
      </p>
      {colonyReputation && colonyReputation.length ? (
        <>
          <TitleLabel
            className={clsx('pt-6 mt-6 border-t border-gray-200 mb-2', {
              'mx-6': isTopContributorType,
            })}
            text={formatMessage({ id: 'userInfo.colonyReputation.section' })}
          />
          <ul
            className={clsx('flex flex-col gap-2', {
              'px-6': isTopContributorType,
            })}
          >
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
            className={clsx('pt-6 mt-6 border-t border-gray-200 mb-2', {
              'mx-6': isTopContributorType,
            })}
            text={formatMessage({ id: 'userInfo.permissions.section' })}
          />
          <ul
            className={clsx('inline-flex flex-wrap gap-x-1 gap-y-2', {
              'px-6 pb-6': isTopContributorType,
            })}
          >
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
