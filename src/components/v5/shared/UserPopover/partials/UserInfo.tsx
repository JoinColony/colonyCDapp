import React, { FC } from 'react';
import clsx from 'clsx';

import { UserInfoProps } from '../types';
import Icon from '~shared/Icon';
import TitleLabel from '~v5/shared/TitleLabel';
import UserAvatarDetails from '~v5/shared/UserAvatarDetails';
import UserStatus from '~v5/common/Pills/UserStatus';
import { formatText } from '~utils/intl';
import Tooltip from '~shared/Extensions/Tooltip/Tooltip';
import { getRole } from '~constants/permissions';

const displayName = 'v5.UserAvatarPopover.partials.UserInfo';

const UserInfo: FC<UserInfoProps> = ({
  userName,
  isVerified,
  walletAddress,
  aboutDescription,
  avatar,
  userStatus,
  domains,
  isContributorsList,
}) => {
  const aboutDescriptionText = formatText(aboutDescription);
  const isTopContributorType = userStatus === 'top' && isContributorsList;

  return (
    <div
      className={clsx({
        'min-w-[17rem]': !isTopContributorType,
        'min-w-[20rem]': isTopContributorType,
      })}
    >
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
            isVerified={isVerified}
            userStatus={userStatus}
            isContributorsList={isContributorsList}
          />
        </div>
        {isTopContributorType && domains && (
          <>
            <TitleLabel
              className="mb-2 text-gray-900"
              text={formatText({ id: 'userInfo.top.contributor.in' })}
            />
            <div className="flex gap-1">
              {domains?.map(({ domainName, domainId }) => (
                <UserStatus key={domainId} mode="team" text={domainName} />
              ))}
            </div>
          </>
        )}
      </div>
      {aboutDescriptionText && (
        <>
          <TitleLabel
            className={clsx('my-2', {
              'px-6': isTopContributorType,
            })}
            text={formatText({ id: 'userInfo.about.section' })}
          />
          <p
            className={clsx('text-md text-gray-600', {
              'px-6': isTopContributorType,
            })}
          >
            {aboutDescriptionText}
          </p>
          <div className="my-6 border-t border-gray-200" />
        </>
      )}
      {domains?.length ? (
        <div
          className={clsx({
            'px-6 pb-6': isTopContributorType,
          })}
        >
          <TitleLabel
            className="mt-2"
            text={formatText({
              id: 'userInfo.teamBreakdown.section',
            })}
          />
          <ul className="flex flex-col gap-2">
            {domains.map(
              ({
                domainId,
                domainName,
                permissions,
                reputationPercentage,
                reputationRaw,
              }) => {
                const permissionRole = getRole(permissions);
                return (
                  <li
                    key={domainId}
                    className="grid grid-cols-[1fr,2fr,1fr] items-center font-medium"
                  >
                    <span className="text-md">{domainName}</span>
                    {/* @TODO: add permissions pills */}
                    <span className="flex justify-end mr-2">
                      {permissionRole.name}
                    </span>
                    <span className="flex justify-end text-sm text-blue-400">
                      <Tooltip
                        className="items-center"
                        tooltipContent={<span>{reputationRaw} pts</span>}
                      >
                        <Icon name="star" appearance={{ size: 'extraTiny' }} />
                        <span className="inline-block ml-1 mr-2">
                          {reputationPercentage.toFixed(2)}%
                        </span>
                      </Tooltip>
                    </span>
                  </li>
                );
              },
            )}
          </ul>
        </div>
      ) : undefined}
    </div>
  );
};

UserInfo.displayName = displayName;

export default UserInfo;
