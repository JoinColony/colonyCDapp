import { Id } from '@colony/colony-js';
import { UsersThree } from '@phosphor-icons/react';
import clsx from 'clsx';
import Decimal from 'decimal.js';
import React, { type FC } from 'react';

import { CoreAction } from '~actions';
import { DEFAULT_TOKEN_DECIMALS } from '~constants/index.ts';
import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import Tooltip from '~shared/Extensions/Tooltip/index.ts';
import Numeral from '~shared/Numeral/index.ts';
import { notNull } from '~utils/arrays/index.ts';
import { formatText } from '~utils/intl.ts';
import { getTeamColor } from '~utils/teams.ts';
import TextButton from '~v5/shared/Button/TextButton.tsx';
import MenuContainer from '~v5/shared/MenuContainer/index.ts';
import TitleLabel from '~v5/shared/TitleLabel/index.ts';

import { ACTION_TYPE_FIELD_NAME } from '../ActionSidebar/consts.ts';

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
  const { show } = useActionSidebarContext();

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
      <span className="mb-2 flex text-blue-400">
        <UsersThree size={32} />
      </span>
      <span className="mb-1 heading-4">
        <Numeral
          value={new Decimal(colonyReputation).abs()}
          decimals={nativeToken?.decimals || DEFAULT_TOKEN_DECIMALS}
        />
      </span>
      <span className="mb-6 border-b border-gray-200 pb-6 text-sm text-gray-600">
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
                    className="mb-3 flex items-center text-sm last:mb-0"
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
            <div className="mt-3 flex items-center text-sm">
              <span className="flex flex-grow items-center">
                <span className="mr-2 flex h-[0.625rem] w-[0.625rem] rounded-full bg-gray-100" />
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
          <span className="mb-2 block text-sm text-gray-600">
            {formatText({ id: 'teamReputation.noTeams' })}
          </span>
          <TextButton
            mode="underlined"
            onClick={() =>
              show({
                [ACTION_TYPE_FIELD_NAME]: CoreAction.CreateDomain,
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
