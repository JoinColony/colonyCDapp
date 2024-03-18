import React, { useState } from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import Numeral from '~shared/Numeral/index.ts';
import { type UserMotionStakes } from '~types/graphql.ts';
import { MotionVote } from '~utils/colonyMotions.ts';
import { formatText } from '~utils/intl.ts';
import MotionVoteBadge from '~v5/common/Pills/MotionVoteBadge/index.ts';
import UserAvatarPopover from '~v5/shared/UserAvatarPopover/index.ts';

import type { StakesListProps } from './types.ts';

const displayName =
  'v5.common.ActionSidebar.partials.Motions.steps.StakingStep.partials.StakesList';

const StakesList = ({ userStakes }: StakesListProps) => {
  const { colony } = useColonyContext();
  const { decimals: tokenDecimals, symbol: tokenSymbol } = colony.nativeToken;

  const [shouldShowMoreStakes, setShouldShowMoreStakes] = useState(false);

  const stakesByVote = userStakes.reduce<
    Record<MotionVote, UserMotionStakes[]>
  >(
    (acc, userStake) => {
      const { yay, nay } = userStake.stakes.raw;
      if (yay !== '0') {
        acc[MotionVote.Yay].push(userStake);
      }
      if (nay !== '0') {
        acc[MotionVote.Nay].push(userStake);
      }
      return acc;
    },
    {
      [MotionVote.Yay]: [],
      [MotionVote.Nay]: [],
    },
  );

  const hasMoreStakes = Object.values(stakesByVote).some(
    (stakes) => stakes.length > 3,
  );

  return (
    <>
      <ul className="w-full flex flex-col gap-6 pt-6">
        {[MotionVote.Yay, MotionVote.Nay].map((vote) => {
          if (!stakesByVote[vote].length) {
            return null;
          }

          return (
            <li key={vote} className="flex flex-col gap-3">
              <div className="w-full">
                <MotionVoteBadge vote={vote} />
              </div>

              <ul className="w-full flex flex-col gap-3">
                {stakesByVote[vote]
                  .slice(0, shouldShowMoreStakes ? undefined : 3)
                  .map((stake) => (
                    <li
                      key={stake.address}
                      className="w-full flex items-center justify-between gap-4"
                    >
                      <UserAvatarPopover walletAddress={stake.address} />
                      <div className="flex-shrink-0 text-right text-sm text-gray-900">
                        {formatText(
                          { id: 'motion.staking.staked' },
                          {
                            value: (
                              <Numeral
                                value={
                                  stake.stakes.raw[
                                    vote === MotionVote.Yay ? 'yay' : 'nay'
                                  ]
                                }
                                decimals={tokenDecimals}
                                suffix={` ${tokenSymbol}`}
                              />
                            ),
                          },
                        )}
                      </div>
                    </li>
                  ))}
              </ul>
            </li>
          );
        })}
      </ul>
      {hasMoreStakes && (
        <button
          type="button"
          onClick={() => setShouldShowMoreStakes(true)}
          className="text-gray-500 text-sm w-full text-center mt-6 transition-colors md:hover:text-blue-500"
        >
          {formatText({ id: 'button.loadMore' })}
        </button>
      )}
    </>
  );
};

StakesList.displayName = displayName;

export default StakesList;
