import clsx from 'clsx';
import { Cardholder } from 'phosphor-react';
import React, { FC } from 'react';

import { useMobile } from '~hooks/index.ts';
import Tooltip from '~shared/Extensions/Tooltip/index.ts';
import { SpinnerLoader } from '~shared/Preloaders/index.ts';
import Card from '~v5/shared/Card/index.ts';
import Link from '~v5/shared/Link/index.ts';
import MeatBallMenu from '~v5/shared/MeatBallMenu/index.ts';
import ReputationBadge from '~v5/shared/ReputationBadge/index.ts';
import UserAvatars from '~v5/shared/UserAvatars/index.ts';

import TeamBadge from '../Pills/TeamBadge/index.ts';

import { TeamCardProps } from './types.ts';

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
  className,
}) => {
  const isMobile = useMobile();
  const descriptionClassName = 'text-sm text-gray-600 sm:line-clamp-3';
  const descriptionContent =
    typeof description === 'string' ? (
      <p className={descriptionClassName}>{description}</p>
    ) : (
      <div className={descriptionClassName}>{description}</div>
    );

  return (
    <Card
      className={clsx(
        className,
        'bg-gray-25 border-gray-200 pt-6 px-5 pb-5 h-full w-full flex flex-col min-h-[12.25rem] text-gray-600 relative',
      )}
      withPadding={false}
    >
      <div className="w-full flex-grow flex flex-col gap-3">
        <div className="text-gray-900 flex justify-between items-start gap-2">
          <div className="truncate">
            <h3 className="text-lg font-medium mb-1 truncate w-full">
              {title || teamProps.name}
            </h3>
            <div className="flex items-center gap-x-4 gap-y-1 flex-shrink-0 flex-wrap">
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
            <div className="flex-shrink-0 ml-auto min-h-[2.375rem]">
              <SpinnerLoader
                appearance={{
                  size: 'small',
                }}
              />
            </div>
          ) : (
            <>
              {!!members?.length && (
                <div className="flex-shrink-0 ml-auto">
                  <UserAvatars
                    maxAvatarsToShow={5}
                    className="[&_.placeholder]:bg-gray-200 [&_.placeholder]:text-gray-900"
                    size="xms"
                    items={members}
                  />
                </div>
              )}
            </>
          )}
        </div>
        {description ? descriptionContent : null}
      </div>
      <div className="w-full border-t border-t-gray-200 mt-4 pt-4 flex items-center justify-between gap-4">
        <div className="truncate">
          <TeamBadge
            {...teamProps}
            className={clsx(teamProps.className, 'w-full bg-base-white')}
            textClassName={clsx(teamProps.textClassName, 'truncate')}
          />
        </div>
        <div className="ml-auto flex justify-end items-center gap-4">
          {!!links?.length && (
            <ul className="flex items-center gap-4 justify-end">
              {links.map(({ key, className: linkClassName, ...restLink }) => (
                <li key={key}>
                  <Link
                    {...restLink}
                    className={clsx(
                      linkClassName,
                      'flex justify-center items-center text-4 underline text-inherit',
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
