import { Id } from '@colony/colony-js';
import { UsersThree } from '@phosphor-icons/react';
import clsx from 'clsx';
import Decimal from 'decimal.js';
import React, { type FC } from 'react';

import { Action } from '~constants/actions.ts';
import { DEFAULT_TOKEN_DECIMALS } from '~constants/index.ts';
import { useActionSidebarContext } from '~context/ActionSidebarContext/index.tsx';
import { useColonyContext } from '~context/ColonyContext.tsx';
import Tooltip from '~shared/Extensions/Tooltip/index.ts';
import Numeral from '~shared/Numeral/index.ts';
import { notNull } from '~utils/arrays/index.ts';
import { formatText } from '~utils/intl.ts';
import { getTeamColor } from '~utils/teams.ts';
import TextButton from '~v5/shared/Button/TextButton.tsx';
import MenuContainer from '~v5/shared/MenuContainer/index.ts';
import TitleLabel from '~v5/shared/TitleLabel/index.ts';

import { ACTION_TYPE_FIELD_NAME } from '../ActionSidebar/consts.tsx';

import TeamReputationSummaryRow from './partials/TeamReputationSummaryRow.tsx';
import { type TeamReputationSummaryProps } from './types.ts';
import { formatPercentage } from './utils.ts';

const displayName = 'v5.common.TeamReputationSummary';

const TeamReputationSummary: FC<TeamReputationSummaryProps> = ({
  className,
}) => {
  const {
    colony: { nativeToken, domains, reputation },
  } = useColonyContext();
  const {
    actionSidebarToggle: [, { toggleOn: toggleActionSidebarOn }],
  } = useActionSidebarContext();

  const colonyReputation = reputation ?? '0';
  const teams = domains?.items
    .filter(notNull)
    .filter(({ nativeId }) => nativeId !== Id.RootDomain)
    .sort((teamA, teamB) => {
      if (!teamA || !teamB) return 0;

      const { reputationPercentage: reputationA } = teamA;
      const { reputationPercentage: reputationB } = teamB;
      return new Decimal(reputationB ?? '0').sub(reputationA ?? '0').toNumber();
    });

  const showOthers = teams && teams?.length > 5;
  const otherTeamsReputation = teams
    ?.slice(5)
    .reduce(
      (acc, { reputationPercentage }) => acc.add(reputationPercentage ?? '0'),
      new Decimal(0),
    )
    .toString();

  return (
    <MenuContainer className={clsx(className, 'w-full')}>
      <span className="flex text-blue-400 mb-2">
        <UsersThree size={32} />
      </span>
      <span className="heading-4 mb-1">
        <Numeral
          value={new Decimal(colonyReputation).abs()}
          decimals={nativeToken?.decimals || DEFAULT_TOKEN_DECIMALS}
        />
      </span>
      <span className="text-gray-600 text-sm border-b border-gray-200 pb-6 mb-6">
        {formatText({ id: 'teamReputation.reputationPoints.label' })}
      </span>
      <TitleLabel
        className="mb-2"
        text={formatText({
          id: 'label.influenceByTeam',
        })}
      />
      {teams?.length ? (
        <>
          <ul>
            {teams?.map((team, index) => {
              const { nativeId } = team;
              return (
                index < 5 && (
                  <li
                    key={nativeId}
                    className="flex items-center text-sm mb-3 last:mb-0"
                  >
                    <TeamReputationSummaryRow
                      color={getTeamColor(team.metadata?.color)}
                      name={team.metadata?.name}
                      totalReputation={team.reputationPercentage}
                    />
                  </li>
                )
              );
            })}
          </ul>
          {showOthers && (
            <div className="flex items-center text-sm mt-3">
              <span className="flex items-center flex-grow">
                <span className="flex rounded-full w-[0.625rem] h-[0.625rem] mr-2 bg-gray-100" />
                <span>
                  {formatText({
                    id: 'label.allOther',
                  })}
                </span>
              </span>
              <Tooltip
                tooltipContent={`${
                  otherTeamsReputation && parseFloat(otherTeamsReputation) > 0
                    ? otherTeamsReputation
                    : '0.00'
                }%`}
                placement="top"
              >
                <span className="font-medium">
                  {formatPercentage(otherTeamsReputation)}
                </span>
              </Tooltip>
            </div>
          )}
        </>
      ) : (
        <>
          <span className="block text-gray-600 text-sm mb-2">
            {formatText({ id: 'teamReputation.noTeams' })}
          </span>
          <TextButton
            mode="underlined"
            onClick={() =>
              toggleActionSidebarOn({
                [ACTION_TYPE_FIELD_NAME]: Action.CreateNewTeam,
              })
            }
          >
            {formatText({
              id: 'button.createATeam',
            })}
          </TextButton>
        </>
      )}
    </MenuContainer>
  );
};

TeamReputationSummary.displayName = displayName;

export default TeamReputationSummary;
