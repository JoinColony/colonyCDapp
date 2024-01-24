import { Id } from '@colony/colony-js';
import clsx from 'clsx';
import Decimal from 'decimal.js';
import React, { FC } from 'react';

import { DEFAULT_TOKEN_DECIMALS } from '~constants';
import { ACTION } from '~constants/actions';
import { useActionSidebarContext } from '~context/ActionSidebarContext';
import { useColonyContext } from '~context/ColonyContext';
import Tooltip from '~shared/Extensions/Tooltip';
import Icon from '~shared/Icon';
import Numeral from '~shared/Numeral';
import { notNull } from '~utils/arrays';
import { formatText } from '~utils/intl';
import { getTeamColor } from '~utils/teams';
import TextButton from '~v5/shared/Button/TextButton';
import MenuContainer from '~v5/shared/MenuContainer';
import TitleLabel from '~v5/shared/TitleLabel';

import { ACTION_TYPE_FIELD_NAME } from '../ActionSidebar/consts';

import TeamReputationSummaryRow from './partials/TeamReputationSummaryRow';
import { TeamReputationSummaryProps } from './types';
import { formatPercentage } from './utils';

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
        <Icon name="users-three" appearance={{ size: 'big' }} />
      </span>
      <span className="heading-4 mb-1">
        <Numeral
          value={new Decimal(colonyReputation).abs().toString()}
          decimals={nativeToken?.decimals || DEFAULT_TOKEN_DECIMALS}
        />
        {colonyReputation !== '0' && 'M'}
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
                [ACTION_TYPE_FIELD_NAME]: ACTION.CREATE_NEW_TEAM,
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
