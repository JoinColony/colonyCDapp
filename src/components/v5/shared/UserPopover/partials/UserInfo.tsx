import React, { FC } from 'react';
import clsx from 'clsx';

import { UserInfoProps } from '../types';
import Icon from '~shared/Icon';
import UserPermissionsBadge from '~common/Extensions/UserPermissionsBadge';
import TitleLabel from '~v5/shared/TitleLabel';
import UserAvatarDetails from '~v5/shared/UserAvatarDetails';
import UserStatus from '~v5/common/Pills/UserStatus';
import { permissionsMap } from './consts';
import { formatText } from '~utils/intl';
import Tooltip from '~shared/Extensions/Tooltip/Tooltip';

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
      <TitleLabel
        className={clsx('mt-2 mb-2', {
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
      {domains?.length ? (
        <>
          <TitleLabel
            className={clsx('pt-6 mt-6 border-t border-gray-200 mb-2', {
              'mx-6': isTopContributorType,
            })}
            text={formatText({
              id: 'userInfo.teamBreakdown.section',
            })}
          />
          <ul
            className={clsx('flex flex-col gap-2', {
              'px-6': isTopContributorType,
            })}
          >
            {domains.map(
              ({
                domainId,
                domainName,
                permissions,
                reputationPercentage,
                reputationRaw,
              }) => (
                <li
                  key={domainId}
                  className="grid grid-cols-[1fr,2fr,1fr] items-center font-medium"
                >
                  <span className="text-md">{domainName}</span>
                  {/* Note: permissions here is temporary, for illustrative purposes only */}
                  <div className="flex flex-col">
                    {permissions.map((permission) => {
                      const { text, description, name } =
                        permissionsMap[permission];

                      return (
                        <div key={name}>
                          <UserPermissionsBadge
                            text={text}
                            description={description}
                            name={name}
                          />
                        </div>
                      );
                    })}
                  </div>
                  <span className="inline-flex items-center text-sm text-blue-400">
                    <Tooltip tooltipContent={<span>{reputationRaw} pts</span>}>
                      <Icon name="star" appearance={{ size: 'extraTiny' }} />
                      <span className="inline-block ml-1 mr-2">
                        {reputationPercentage.toFixed(2)}%
                      </span>
                    </Tooltip>
                  </span>
                </li>
              ),
            )}
          </ul>
        </>
      ) : undefined}

      {/*
      @ Remove once new permissions pills are implemented
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
      )} */}
    </div>
  );
};

UserInfo.displayName = displayName;

export default UserInfo;
