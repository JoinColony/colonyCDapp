import React, { FC, PropsWithChildren } from 'react';
import { useIntl } from 'react-intl';

import { TeamReputationSummaryProps } from './types';
import Card from '~v5/shared/Card';
import Icon from '~shared/Icon';
import { TextButton } from '~v5/shared/Button';
import TitleLabel from '~v5/shared/TitleLabel';
import { setTeamColor } from './utils';

const displayName = 'v5.common.TeamReputationSummary';

const TeamReputationSummary: FC<
  PropsWithChildren<TeamReputationSummaryProps>
> = ({ teams }) => {
  const { formatMessage } = useIntl();

  const totalPoints = teams.reduce((acc, object) => {
    return acc + object.points;
  }, 0);

  const summedOtherPoints = teams.reduce((acc, object, index) => {
    if (index >= 5) {
      return acc + object.points;
    }
    return acc;
  }, 0);

  return (
    <Card>
      <span className="flex text-blue-400 mb-2">
        <Icon name="users-three" appearance={{ size: 'big' }} />
      </span>
      <span className="heading-4 mb-1">
        {totalPoints}
        {totalPoints > 0 && 'M'}
      </span>
      <span className="text-gray-600 text-sm border-b border-gray-200 pb-6 mb-6">
        {formatMessage({ id: 'teamReputation.reputationPoints.label' })}
      </span>
      <TitleLabel
        className="mb-2"
        text={formatMessage({
          id: 'label.pointsPerTeam',
        })}
      />
      {totalPoints > 0 ? (
        <>
          <ul>
            {teams.map(
              ({ id, color, name, points }, index) =>
                index < 5 && (
                  <li key={id} className="flex items-center text-sm mb-3">
                    <span className="flex items-center flex-grow">
                      <span
                        className={`flex rounded-full w-[0.625rem] h-[0.625rem] mr-2 ${setTeamColor(
                          color,
                        )}`}
                      />
                      {name}
                    </span>
                    <span className="font-medium">{points}</span>
                  </li>
                ),
            )}
          </ul>
          {summedOtherPoints ? (
            <div className="flex items-center text-sm">
              <span className="flex items-center flex-grow">
                <span className="flex rounded-full w-[0.625rem] h-[0.625rem] mr-2 bg-gray-100" />
                <span>
                  {formatMessage({
                    id: 'label.allOther',
                  })}
                </span>
              </span>
              <span className="font-medium">{summedOtherPoints}</span>
            </div>
          ) : undefined}
        </>
      ) : (
        <>
          <span className="block text-gray-600 text-sm mb-2">
            {formatMessage({ id: 'teamReputation.noTeams' })}
          </span>
          {/* @TODO handle action on click - creating a team */}
          <TextButton mode="underlined">
            {formatMessage({
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
