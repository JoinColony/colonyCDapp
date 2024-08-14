import { ColonyRole, Id } from '@colony/colony-js';
import { Star, User } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC } from 'react';

import { getRole } from '~constants/permissions.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { ContributorType } from '~gql';
import Tooltip from '~shared/Extensions/Tooltip/Tooltip.tsx';
import Numeral from '~shared/Numeral/index.ts';
import { formatText } from '~utils/intl.ts';
import { multiLineTextEllipsis } from '~utils/strings.ts';
import { getTokenDecimalsWithFallback } from '~utils/tokens.ts';
import PermissionsBadge from '~v5/common/Pills/PermissionsBadge/index.ts';
import UserStatus from '~v5/common/Pills/UserStatus/index.ts';
import TitleLabel from '~v5/shared/TitleLabel/index.ts';

import { type UserInfoProps } from '../types.ts';

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
  const { colony } = useColonyContext();

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
          'px-6 pt-6': !isTopContributorType,
        })}
      >
        <div
          className={clsx({
            'mb-6': isTopContributorType,
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
              {domains
                ?.slice(0, 3)
                .map(({ domainName, domainId }) => (
                  <UserStatus
                    key={domainId}
                    mode="team"
                    text={multiLineTextEllipsis(domainName, 7)}
                  />
                ))}
              {domains?.length > 3 && (
                <UserStatus mode="team" className="!w-auto !max-w-none">
                  +{domains.length - 3}
                </UserStatus>
              )}
            </div>
          </>
        )}
      </div>
      <div className="flex flex-col gap-6 p-6">
        {aboutDescriptionText && (
          <div>
            <TitleLabel
              className="mb-2"
              text={formatText({ id: 'userInfo.about.section' })}
            />
            <p className="text-md text-gray-600">{aboutDescriptionText}</p>
          </div>
        )}
        {additionalContent && <div>{additionalContent}</div>}
        {(aboutDescriptionText || additionalContent) && !!domains?.length && (
          <div className="border-t border-gray-200" />
        )}
        {domains?.length ? (
          <div>
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
                      <span className="truncate whitespace-nowrap text-md">
                        {domainName}
                      </span>
                      <div className="flex justify-end">
                        {permissionRole && (
                          <PermissionsBadge
                            text={permissionRole.name}
                            icon={User} // @TODO: add UserTree icon for multiSig
                          />
                        )}

                        <Tooltip
                          className="flex min-w-[4.5rem] items-center justify-end text-sm text-blue-400"
                          tooltipContent={
                            <Numeral
                              value={reputationRaw}
                              suffix=" pts"
                              decimals={getTokenDecimalsWithFallback(
                                colony.nativeToken.decimals,
                              )}
                            />
                          }
                        >
                          <Star size={12} />
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
