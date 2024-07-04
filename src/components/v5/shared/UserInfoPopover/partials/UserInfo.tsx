import { ColonyRole, Id } from '@colony/colony-js';
import { Star, User, UsersThree } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC } from 'react';

import {
  UserRole,
  type UserRoleMeta,
  getRole,
} from '~constants/permissions.ts';
import { ContributorType } from '~gql';
import {
  type DomainWithPermissionsAndReputation,
  type AvailablePermission,
} from '~hooks/members/types.ts';
import useEnabledExtensions from '~hooks/useEnabledExtensions.ts';
import Tooltip from '~shared/Extensions/Tooltip/Tooltip.tsx';
import Numeral from '~shared/Numeral/index.ts';
import { formatText } from '~utils/intl.ts';
import { multiLineTextEllipsis } from '~utils/strings.ts';
import { getTeamColor } from '~utils/teams.ts';
import PermissionsBadge from '~v5/common/Pills/PermissionsBadge/index.ts';
import UserStatus from '~v5/common/Pills/UserStatus/index.ts';
import TitleLabel from '~v5/shared/TitleLabel/index.ts';

import { type UserInfoProps } from '../types.ts';

const getPermissionTooltipContent = ({
  role,
  isMultiSig = false,
}: {
  role: UserRoleMeta;
  isMultiSig?: boolean;
}) => {
  const roleName = isMultiSig
    ? `${formatText({ id: 'userInfo.permissions.multiSig' })}${role.name}`
    : role.name;

  return (
    <>
      <p className="font-normal">
        {formatText(
          {
            id:
              role.role === UserRole.Custom
                ? 'userInfo.permissions.custom'
                : 'userInfo.permissions.bundle',
          },
          {
            role: <span className="font-bold">{roleName}</span>,
          },
          roleName,
        )}
      </p>
      <ul className="list-disc pl-4">
        {role.permissions.map((permission) => (
          <li key={permission}>
            {isMultiSig
              ? `${formatText({ id: 'userInfo.permissions.multiSig' })}`
              : ''}
            {ColonyRole[permission]}
          </li>
        ))}
      </ul>
    </>
  );
};

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
  const { isMultiSigEnabled } = useEnabledExtensions();
  const aboutDescriptionText = formatText(aboutDescription);
  const isTopContributorType = contributorType === ContributorType.Top;

  return (
    <div
      className={clsx('flex flex-col', {
        'sm:min-w-[17rem]': !isTopContributorType,
        'sm:min-w-[20rem]': isTopContributorType,
      })}
    >
      <div
        className={clsx({
          'bg-purple-100 p-6 pb-[18px]': isTopContributorType,
          'px-6 pt-6': !isTopContributorType,
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
                  <UserStatus mode="team" className="!w-auto !max-w-none">
                    +{domains.length - 3}
                  </UserStatus>
                </Tooltip>
              )}
            </div>
          </>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-6 pb-6 pt-[18px] sm:overflow-hidden">
        {aboutDescriptionText && (
          <div className="px-6">
            <TitleLabel
              className="mb-2"
              text={formatText({ id: 'userInfo.about.section' })}
            />
            <p className="truncate whitespace-break-spaces text-md text-gray-600 sm:max-h-[100px]">
              {aboutDescriptionText}
            </p>
          </div>
        )}
        {additionalContent && <div className="px-6">{additionalContent}</div>}
        {domains?.length ? (
          <div className="flex flex-col pl-6 pr-6 sm:overflow-hidden sm:pr-2.5">
            <TitleLabel
              text={formatText({
                id: 'userInfo.teamBreakdown.section',
              })}
              className="pb-2"
            />
            <ul className="flex max-h-[216px] flex-col gap-2 sm:overflow-y-auto sm:pr-3.5">
              {domains.map(
                ({
                  domainId,
                  domainColor,
                  domainName,
                  permissions,
                  multiSigPermissions,
                  reputationPercentage,
                  reputationRaw,
                }) => {
                  const getFilteredPermissions = (
                    unfilteredPermissions: AvailablePermission[],
                  ) => {
                    if (unfilteredPermissions?.length) {
                      return unfilteredPermissions;
                    }
                    const rootDomain = domains.find(
                      ({ nativeId }) => nativeId === Id.RootDomain,
                    );
                    return rootDomain
                      ? rootDomain.permissions.filter(
                          (permission) =>
                            permission !== ColonyRole.Root &&
                            permission !== ColonyRole.Recovery,
                        )
                      : [];
                  };

                  const finalPermissions = getFilteredPermissions(permissions);
                  const finalMultiSigPermissions =
                    getFilteredPermissions(multiSigPermissions);

                  const permissionRole = finalPermissions?.length
                    ? getRole(finalPermissions)
                    : undefined;
                  const multiSigPermissionRole =
                    finalMultiSigPermissions?.length
                      ? getRole(finalMultiSigPermissions)
                      : undefined;

                  return (
                    <li
                      key={domainId}
                      className="grid h-12 min-h-12 grid-cols-[2fr,1fr] items-center rounded border border-gray-100 px-3 font-medium"
                    >
                      <div className="flex flex-row items-center truncate">
                        <div
                          className={`mr-1 flex h-[0.625rem] w-[0.625rem] rounded-full ${getTeamColor(domainColor)}`}
                        />
                        <span className="truncate whitespace-nowrap text-sm">
                          {domainName}
                        </span>
                      </div>
                      <div className="flex justify-end gap-1.5">
                        {permissionRole && (
                          <Tooltip
                            placement="top"
                            tooltipContent={getPermissionTooltipContent({
                              role: permissionRole,
                            })}
                          >
                            <PermissionsBadge icon={User} />
                          </Tooltip>
                        )}

                        {isMultiSigEnabled && multiSigPermissionRole && (
                          <Tooltip
                            placement="top"
                            tooltipContent={getPermissionTooltipContent({
                              role: multiSigPermissionRole,
                              isMultiSig: true,
                            })}
                          >
                            <PermissionsBadge icon={UsersThree} />
                          </Tooltip>
                        )}

                        <Tooltip
                          placement="top"
                          className="flex items-center justify-end text-sm font-normal text-gray-900"
                          tooltipContent={
                            <Numeral value={reputationRaw} suffix=" pts" />
                          }
                        >
                          <Star size={14} />
                          <span className="ml-1 inline-block">
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
    </div>
  );
};

UserInfo.displayName = displayName;

export default UserInfo;
