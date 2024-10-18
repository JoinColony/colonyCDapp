import { Cardholder } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC } from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useMobile } from '~hooks/index.ts';
import { COLONY_MEMBERS_ROUTE } from '~routes';
import Tooltip from '~shared/Extensions/Tooltip/index.ts';
import { SpinnerLoader } from '~shared/Preloaders/index.ts';
import Card from '~v5/shared/Card/index.ts';
import Link from '~v5/shared/Link/index.ts';
import MeatBallMenu from '~v5/shared/MeatBallMenu/index.ts';
import ReputationBadge from '~v5/shared/ReputationBadge/index.ts';
import UserAvatars from '~v5/shared/UserAvatars/index.ts';

import TeamBadge from '../Pills/TeamBadge/index.ts';

import { type TeamCardProps } from './types.ts';

const TeamCard: FC<TeamCardProps> = ({
  title,
  reputation,
  members,
  isMembersListLoading,
  description,
  teamProps,
  meatBallMenuProps,
  links,
  balance,
  searchParams,
  className,
}) => {
  const isMobile = useMobile();
  const {
    colony: { name: colonyName },
  } = useColonyContext();

  return (
    <Card
      className={clsx(
        className,
        'relative flex h-full min-h-[12.5rem] w-full flex-col border-gray-200 bg-gray-25 px-5 pb-5 pt-6 text-gray-600',
      )}
      withPadding={false}
    >
      <div className="flex w-full flex-grow flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="truncate">
            <h3 className="mb-1 w-full truncate text-lg font-medium text-gray-900">
              {title || teamProps.name}
            </h3>
            <div className="flex flex-shrink-0 flex-wrap items-center gap-x-4 gap-y-1 text-gray-600">
              <Tooltip
                placement={isMobile ? 'auto' : 'right'}
                tooltipContent="Team balance"
              >
                <div className="flex items-center gap-1 text-sm">
                  <Cardholder size={14} className="flex-shrink-0" />
                  {balance}
                </div>
              </Tooltip>
              <Tooltip
                placement={isMobile ? 'auto' : 'right'}
                tooltipContent="Reputation influence in the Colony "
              >
                <ReputationBadge reputation={reputation} fractionDigits={0} />
              </Tooltip>
            </div>
          </div>
          {isMembersListLoading ? (
            <div className="ml-auto min-h-[2.375rem] flex-shrink-0">
              <SpinnerLoader
                appearance={{
                  size: 'small',
                }}
              />
            </div>
          ) : (
            <Link
              to={{
                pathname: `/${colonyName}/${COLONY_MEMBERS_ROUTE}`,
                search: `${searchParams?.team}`,
              }}
            >
              {!!members?.length && (
                <div className="group ml-auto flex-shrink-0">
                  <UserAvatars
                    maxAvatarsToShow={4}
                    className="[&_.placeholder]:bg-gray-200 [&_.placeholder]:text-gray-900"
                    size={30}
                    items={members}
                  />
                </div>
              )}
            </Link>
          )}
        </div>
        {description ? (
          <p className="text-sm text-gray-600 break-word sm:line-clamp-3">
            {description}
          </p>
        ) : null}
      </div>
      <div className="mt-4 flex w-full items-center justify-between gap-4 border-t border-t-gray-200 pt-4">
        <div className="truncate">
          <TeamBadge
            {...teamProps}
            className={clsx(teamProps.className, 'w-full bg-base-white')}
            textClassName={clsx(teamProps.textClassName, 'truncate')}
          />
        </div>
        <div className="ml-auto flex items-center justify-end gap-4">
          {!!links?.length && (
            <ul className="flex items-center justify-end gap-4">
              {links.map(({ key, className: linkClassName, ...restLink }) => (
                <li key={key}>
                  <Link
                    {...restLink}
                    className={clsx(
                      linkClassName,
                      'text-inherit flex items-center justify-center underline text-4',
                    )}
                  />
                </li>
              ))}
            </ul>
          )}
          <MeatBallMenu
            {...meatBallMenuProps}
            withVerticalIcon
            contentWrapperClassName={clsx(
              meatBallMenuProps.contentWrapperClassName,
              'sm:min-w-[16rem]',
              { '!left-6 right-6': isMobile },
            )}
            dropdownPlacementProps={{
              top: 12,
              withAutoTopPlacement: !isMobile,
            }}
          />
        </div>
      </div>
    </Card>
  );
};

export default TeamCard;
