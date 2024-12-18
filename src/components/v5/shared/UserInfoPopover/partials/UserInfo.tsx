import clsx from 'clsx';
import React, { type FC } from 'react';

import { ContributorType } from '~gql';
import { type DomainWithPermissionsAndReputation } from '~hooks/members/types.ts';
import Tooltip from '~shared/Extensions/Tooltip/Tooltip.tsx';
import { formatText } from '~utils/intl.ts';
import { multiLineTextEllipsis } from '~utils/strings.ts';
import UserStatus from '~v5/common/Pills/UserStatus/index.ts';
import TitleLabel from '~v5/shared/TitleLabel/index.ts';

import { type UserInfoProps } from '../types.ts';

import DomainPermissionList from './DomainPermissionList/DomainPermissionList.tsx';

const getRemainingDomainsTooltipContent = (
  domains: DomainWithPermissionsAndReputation[],
) =>
  domains.map(({ domainName, domainId }) => <p key={domainId}>{domainName}</p>);

const getDomainTooltipContent = (name: string) => {
  const truncatedName = multiLineTextEllipsis(name, 7);
  if (truncatedName === name) {
    return null;
  }

  return name;
};

const displayName = 'v5.UserInfoPopover.partials.UserInfo';

const UserInfo: FC<UserInfoProps> = ({
  aboutDescription = '',
  contributorType,
  domains,
  userDetails,
  additionalContent,
}) => {
  const aboutDescriptionText = formatText(aboutDescription);
  const isTopContributorType = contributorType === ContributorType.Top;

  return (
    <div
      data-testid="user-info"
      className={clsx('flex flex-col', {
        'sm:min-w-[17rem]': !isTopContributorType,
        'sm:min-w-[20rem]': isTopContributorType,
      })}
    >
      <div
        className={clsx({
          'bg-purple-100 px-5.5 pb-[18px] pt-6': isTopContributorType,
          'px-[23px] pt-6': !isTopContributorType,
        })}
      >
        <div
          className={clsx({
            'mb-4': isTopContributorType,
          })}
        >
          {userDetails}
        </div>
        {isTopContributorType && domains && (
          <>
            <TitleLabel
              className="mb-2 text-gray-900"
              text={formatText({ id: 'userInfo.top.contributor.in' })}
            />
            <div className="flex gap-1">
              {domains?.slice(0, 3).map(({ domainName, domainId }) => (
                <Tooltip
                  key={domainId}
                  placement="top"
                  tooltipContent={getDomainTooltipContent(domainName)}
                >
                  <UserStatus
                    mode="team"
                    text={multiLineTextEllipsis(domainName, 7)}
                    className="cursor-default"
                  />
                </Tooltip>
              ))}
              {domains?.length > 3 && (
                <Tooltip
                  placement="top"
                  tooltipContent={getRemainingDomainsTooltipContent(
                    domains.slice(3),
                  )}
                >
                  <UserStatus
                    mode="team"
                    className="!w-auto !max-w-none cursor-default"
                  >
                    +{domains.length - 3}
                  </UserStatus>
                </Tooltip>
              )}
            </div>
          </>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-6 pt-[18px] sm:overflow-hidden sm:pb-6">
        {aboutDescriptionText && (
          <div
            className={clsx({
              'px-5.5': isTopContributorType,
              'px-[23px]': !isTopContributorType,
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
              'px-5.5': isTopContributorType,
              'px-[23px]': !isTopContributorType,
            })}
          >
            {additionalContent}
          </div>
        )}
        {domains?.length ? (
          <DomainPermissionList
            domains={domains}
            isTopContributorType={isTopContributorType}
          />
        ) : undefined}
      </div>
    </div>
  );
};

UserInfo.displayName = displayName;

export default UserInfo;
