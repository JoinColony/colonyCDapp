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
import PermissionsBadge from '~v5/common/Pills/PermissionsBadge';
import Numeral from '~shared/Numeral';

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
  size,
}) => {
  const aboutDescriptionText = formatText(aboutDescription);
  const isTopContributorType = userStatus === 'top' && isContributorsList;

  return (
    <div
      className={clsx({
        'sm:min-w-[17rem]': !isTopContributorType,
        'sm:min-w-[20rem]': isTopContributorType,
      })}
    >
      <div
        className={clsx({
          'bg-purple-100 p-6': isTopContributorType,
          'bg-base-white': !isTopContributorType,
        })}
      >
        <div
          className={clsx({
            'mb-[2.4375rem]': userStatus && userStatus !== 'general',
            'mb-6': !userStatus || userStatus === 'general',
          })}
        >
          <UserAvatarDetails
            userName={userName}
            walletAddress={walletAddress}
            avatar={avatar}
            size={size}
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
            className={clsx('mb-2', {
              'px-6 pt-6': isTopContributorType,
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
            'pt-6': !aboutDescriptionText && isTopContributorType,
          })}
        >
          <TitleLabel
            text={formatText({
              id: 'userInfo.teamBreakdown.section',
            })}
          />
          <ul className="flex flex-col gap-2 pt-2">
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
                    className="grid grid-cols-[2fr,1fr] items-center font-medium"
                  >
                    <span className="text-md whitespace-nowrap truncate">
                      {domainName}
                    </span>
                    <div className="flex justify-end">
                      <PermissionsBadge
                        text={permissionRole.name}
                        iconName="user" // @TODO: add user-tree icon for multiSig
                      />

                      <Tooltip
                        className="flex justify-end text-sm text-blue-400 min-w-[4.5rem] items-center"
                        tooltipContent={
                          <Numeral value={reputationRaw} suffix="pts" />
                        }
                      >
                        <Icon name="star" appearance={{ size: 'extraTiny' }} />
                        <span className="inline-block ml-1">
                          {reputationPercentage.toFixed(2)}%
                        </span>
                      </Tooltip>
                    </div>
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
