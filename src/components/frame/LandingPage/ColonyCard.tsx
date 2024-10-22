import { Plus } from '@phosphor-icons/react';
import clsx from 'clsx';
import React from 'react';

import LoadingSkeleton from '~common/LoadingSkeleton/LoadingSkeleton.tsx';
import { formatText } from '~utils/intl.ts';
import Button from '~v5/shared/Button/Button.tsx';

export interface ColonyCardProps {
  colonyName?: string;
  colonyAvatar?: string;
  membersCount?: number;
  invitationsRemaining?: number;
  loading?: boolean;
  onCreate?: () => void;
}

const displayName = 'frame.LandingPage';

export const ColonyCard = ({
  colonyName,
  colonyAvatar,
  invitationsRemaining,
  membersCount = 0,
  loading,
  onCreate,
}: ColonyCardProps) => {
  return (
    <div
      className={clsx(
        'flex h-[4.5rem] items-center gap-[.875rem] rounded border px-5 py-4 transition-colors duration-normal',
        {
          'cursor-pointer': colonyName && !loading,
          'hover:border-gray-900': !loading,
        },
      )}
    >
      <div className="flex h-8 w-8 items-center justify-center">
        <LoadingSkeleton isLoading={loading} className="h-8 w-8 rounded-full">
          {colonyName && colonyAvatar ? (
            <img
              src={colonyAvatar}
              alt="Colony avatar"
              className="w-8 rounded-full"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
              <Plus size={18} className="text-gray-900 " />
            </div>
          )}
        </LoadingSkeleton>
      </div>
      {loading ? (
        <div className="flex flex-col gap-1">
          <LoadingSkeleton isLoading className="h-5 w-[7.5rem] rounded" />
          <LoadingSkeleton
            isLoading
            className="h-[.6875rem] w-[4.25rem] rounded"
          />
        </div>
      ) : (
        <div className="flex w-full items-center justify-between">
          {colonyName ? (
            <p className="text-md font-medium">{colonyName}</p>
          ) : (
            <div className="flex flex-col gap-1">
              <div className="flex">
                <span className="rounded bg-blue-100 px-[.1875rem] py-[.1563rem] text-2xs font-extrabold text-blue-400">
                  {formatText(
                    {
                      id: 'landingPage.card.remaining',
                    },
                    { remaining: invitationsRemaining },
                  ).toUpperCase()}
                </span>
              </div>
              <p className="text-md font-medium">
                {formatText({
                  id: 'landingPage.card.createColony',
                })}
              </p>
            </div>
          )}

          {colonyName ? (
            <p className="text-xs font-normal">
              {formatText(
                {
                  id: 'landingPage.card.members',
                },
                { members: membersCount.toLocaleString('en-US') },
              )}
            </p>
          ) : (
            <Button icon={Plus} onClick={onCreate}>
              Create
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

ColonyCard.displayName = displayName;

export default ColonyCard;
