import React, { FC } from 'react';
import { Id } from '@colony/colony-js';
import Decimal from 'decimal.js';

import Card from '~v5/shared/Card';
import Icon from '~shared/Icon';
import { TextButton } from '~v5/shared/Button';
import TitleLabel from '~v5/shared/TitleLabel';
import TeamReputationSummaryRow from './partials/TeamReputationSummaryRow';
import { useColonyContext } from '~hooks';
import Numeral from '~shared/Numeral';
import { notNull } from '~utils/arrays';
import { formatText } from '~utils/intl';
import { useActionSidebarContext } from '~context/ActionSidebarContext';
import { Actions } from '~constants/actions';

const displayName = 'v5.common.TeamReputationSummary';

const TeamReputationSummary: FC = () => {
  const { colony } = useColonyContext();
  const { domains, reputation } = colony || {};
  const { toggleActionBar, setSelectedAction } = useActionSidebarContext();

  const colonyReputation = reputation ?? '0';
  const teams = domains?.items
    .filter(notNull)
    .filter(({ nativeId }) => nativeId !== Id.RootDomain)
    .filter((team) => team.reputation);

  const sortedTeams = teams?.sort((a, b) => {
    if (a.reputation && b.reputation) {
      return new Decimal(b.reputation).comparedTo(a.reputation);
    }
    return 0;
  });

  const rootTeam = domains?.items
    .filter(notNull)
    .filter(({ nativeId }) => nativeId === Id.RootDomain)
    .map((team) => ({
      ...team,
      reputation: new Decimal(colonyReputation)
        .minus(
          sortedTeams?.reduce(
            (acc, { reputation: teamReputation }) =>
              acc.plus(teamReputation || 0),
            new Decimal(0),
          ) || 0,
        )
        .abs()
        .toString(),
    }))[0];

  const showOthers = sortedTeams && sortedTeams?.length > 5;
  const summedOtherPoints = sortedTeams
    ?.slice(5)
    .reduce((acc, { reputation: teamReputation }) => {
      if (teamReputation) {
        return acc.plus(teamReputation);
      }
      return acc;
    }, new Decimal(0));

  return (
    <Card>
      <span className="flex text-blue-400 mb-2">
        <Icon name="users-three" appearance={{ size: 'big' }} />
      </span>
      <span className="heading-4 mb-1">
        <Numeral value={new Decimal(colonyReputation).abs().toString()} />
      </span>
      <span className="text-gray-600 text-sm border-b border-gray-200 pb-6 mb-6">
        {formatText({ id: 'teamReputation.reputationPoints.label' })}
      </span>
      {rootTeam && (
        <div className="flex items-center text-sm mb-2">
          <TeamReputationSummaryRow team={rootTeam} />
        </div>
      )}
      <TitleLabel
        className="mb-2"
        text={formatText({
          id: 'label.pointsPerTeam',
        })}
      />
      {sortedTeams?.length ? (
        <>
          <ul>
            {sortedTeams?.map((team, index) => {
              const { nativeId } = team;
              return (
                index < 5 && (
                  <li
                    key={nativeId}
                    className="flex items-center text-sm mb-3 last:mb-0"
                  >
                    <TeamReputationSummaryRow team={team} />
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
              <span className="font-medium">
                <Numeral
                  value={new Decimal(summedOtherPoints ?? '0').abs().toString()}
                />
              </span>
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
            onClick={() => {
              toggleActionBar();
              setSelectedAction(Actions.CREATE_NEW_TEAM);
            }}
          >
            {formatText({
              id: 'button.createATeam',
            })}
          </TextButton>
        </>
      )}
    </Card>
  );
};

TeamReputationSummary.displayName = displayName;

export default TeamReputationSummary;
