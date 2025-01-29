import { Id } from '@colony/colony-js';
import { Star } from '@phosphor-icons/react';
import clsx from 'clsx';
import React from 'react';
import { type FC } from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { type DomainWithPermissionsAndReputation } from '~hooks/members/types.ts';
import useEnabledExtensions from '~hooks/useEnabledExtensions.ts';
import Tooltip from '~shared/Extensions/Tooltip/Tooltip.tsx';
import Numeral from '~shared/Numeral/Numeral.tsx';
import { formatText } from '~utils/intl.ts';
import { getTeamColor } from '~utils/teams.ts';
import { getTokenDecimalsWithFallback } from '~utils/tokens.ts';
import TitleLabel from '~v5/shared/TitleLabel/TitleLabel.tsx';

import PermissionTooltip from '../PermissionTooltip/PermissionTooltip.tsx';

import styles from './DomainPermissionList.module.css';

interface DomainPermissionListProps {
  domains: DomainWithPermissionsAndReputation[];
  isTopContributorType: boolean;
}

const displayName = 'v5.UserInfoPopover.partials.DomainPermissionList';

const DomainPermissionList: FC<DomainPermissionListProps> = ({
  domains,
  isTopContributorType,
}) => {
  const { colony } = useColonyContext();
  const { isMultiSigEnabled } = useEnabledExtensions();
  const rootDomain = domains.find(({ nativeId }) => nativeId === Id.RootDomain);

  return (
    <div
      className={clsx(`flex flex-col pr-6 sm:overflow-hidden sm:pr-3.5`, {
        'pl-5.5': isTopContributorType,
        'pl-[23px]': !isTopContributorType,
      })}
    >
      <TitleLabel
        text={formatText({
          id: 'userInfo.teamBreakdown.section',
        })}
        className="pb-2"
      />
      <ul
        className={clsx(
          `${styles.userInfoDomainsWrapper} flex flex-col gap-2 sm:max-h-[216px] sm:overflow-y-auto sm:overflow-x-hidden sm:pr-1.5`,
          {
            '-mr-1.5 pr-2': domains.length > 4,
          },
        )}
      >
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
            const isRootDomain = domainId === rootDomain?.domainId;

            return (
              <li
                key={domainId}
                className="grid h-12 min-h-12 w-full grid-cols-[2fr,1fr] items-center rounded border border-gray-100 px-[11px] font-medium sm:min-w-[18.875rem] sm:max-w-[18.875rem]"
              >
                <div className="flex flex-row items-center truncate">
                  <div
                    className={`mr-1 flex h-[0.625rem] w-[0.625rem] rounded-full ${getTeamColor(domainColor)}`}
                  />
                  <span className="truncate whitespace-nowrap text-sm">
                    {domainName}
                  </span>
                </div>
                <div className="flex justify-end gap-1">
                  <PermissionTooltip
                    userPermissionsInDomain={permissions}
                    userPermissionsInParentDomain={
                      rootDomain?.permissions || []
                    }
                    isRootDomain={isRootDomain}
                  />
                  {isMultiSigEnabled && (
                    <PermissionTooltip
                      userPermissionsInDomain={multiSigPermissions}
                      userPermissionsInParentDomain={
                        rootDomain?.multiSigPermissions || []
                      }
                      isRootDomain={isRootDomain}
                      isMultiSig
                    />
                  )}
                  <Tooltip
                    placement="top"
                    className="flex items-center justify-end text-sm font-normal text-gray-900"
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
  );
};

DomainPermissionList.displayName = displayName;
export default DomainPermissionList;
