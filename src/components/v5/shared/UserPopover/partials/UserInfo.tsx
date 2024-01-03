import { ColonyRole, Id } from '@colony/colony-js';
import clsx from 'clsx';
import React, { FC } from 'react';

import { getRole } from '~constants/permissions';
import Tooltip from '~shared/Extensions/Tooltip/Tooltip';
import Icon from '~shared/Icon';
import Numeral from '~shared/Numeral';
import { formatText } from '~utils/intl';
import { multiLineTextEllipsis } from '~utils/strings';
import PermissionsBadge from '~v5/common/Pills/PermissionsBadge';
import UserStatus from '~v5/common/Pills/UserStatus';
import TitleLabel from '~v5/shared/TitleLabel';
import UserAvatarDetails from '~v5/shared/UserAvatarDetails';

import { UserInfoProps } from '../types';

const displayName = 'v5.UserAvatarPopover.partials.UserInfo';

const UserInfo: FC<UserInfoProps> = ({
  userName,
  isVerified,
  walletAddress,
  aboutDescription = '',
  avatar,
  userStatus,
  domains,
  size,
  additionalContent,
}) => {
  const aboutDescriptionText = formatText(aboutDescription);
  const isTopContributorType = userStatus === 'top';

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
          />
        </div>
        {isTopContributorType && domains && (
          <>
            <TitleLabel
              className="mb-2 text-gray-900"
              text={formatText({ id: 'userInfo.top.contributor.in' })}
            />
            <div className="flex gap-1">
              {domains?.slice(0, 3).map(({ domainName, domainId }) => (
                <UserStatus
                  key={domainId}
                  mode="team"
                  text={multiLineTextEllipsis(domainName, 7)}
                />
              ))}
              {domains?.length > 3 && (
                <UserStatus mode="team" className="!max-w-none !w-auto">
                  +{domains.length - 3}
                </UserStatus>
              )}
            </div>
          </>
        )}
      </div>
      {aboutDescriptionText && (
        <div
          className={clsx({
            'pt-6 px-6': isTopContributorType,
          })}
        >
          <TitleLabel
            className="mb-2"
            text={formatText({ id: 'userInfo.about.section' })}
          />
          <p className="text-md text-gray-600">{aboutDescriptionText}</p>
        </div>
      )}
      {additionalContent && (
        <div
          className={clsx({
            'pt-6': aboutDescriptionText,
            'px-6': isTopContributorType,
          })}
        >
          {additionalContent}
        </div>
      )}
      {domains?.length ? (
        <div
          className={clsx({
            'px-6 pb-6': isTopContributorType,
            'pt-6': !aboutDescriptionText && isTopContributorType,
          })}
        >
          <div className="my-6 border-t border-gray-200" />
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
                const finalPermissions = permissions?.length
                  ? permissions
                  : domains
                      .find(({ nativeId }) => nativeId === Id.RootDomain)
                      ?.permissions.filter(
                        (permission) =>
                          permission !== ColonyRole.Root &&
                          permission !== ColonyRole.Recovery,
                      );
                const permissionRole = finalPermissions?.length
                  ? getRole(finalPermissions)
                  : undefined;

                return (
                  <li
                    key={domainId}
                    className="grid grid-cols-[2fr,1fr] items-center font-medium"
                  >
                    <span className="text-md whitespace-nowrap truncate">
                      {domainName}
                    </span>
                    <div className="flex justify-end">
                      {permissionRole && (
                        <PermissionsBadge
                          text={permissionRole.name}
                          iconName="user" // @TODO: add user-tree icon for multiSig
                        />
                      )}

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
