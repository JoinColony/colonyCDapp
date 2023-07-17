import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import { Id } from '@colony/colony-js';
import Decimal from 'decimal.js';

import Card from '~v5/shared/Card';
import Icon from '~shared/Icon';
import { TextButton } from '~v5/shared/Button';
import TitleLabel from '~v5/shared/TitleLabel';
import TeamReputationSummaryRow from './partials/TeamReputationSummaryRow';
import { useTeamReputationSummary } from './hooks';
import { useColonyContext } from '~hooks';
import { DEFAULT_TOKEN_DECIMALS } from '~constants';
import Numeral from '~shared/Numeral';

const displayName = 'v5.common.TeamReputationSummary';

const TeamReputationSummary: FC = () => {
  const { colony } = useColonyContext();
  const { nativeToken } = colony || {};
  const { formatMessage } = useIntl();

  const { teams, totalPoints } = useTeamReputationSummary();
  const showOthers = teams && teams?.length > 5;

  return (
    <Card>
      <span className="flex text-blue-400 mb-2">
        <Icon name="users-three" appearance={{ size: 'big' }} />
      </span>
      <span className="heading-4 mb-1">
        <Numeral
          value={new Decimal(totalPoints).abs().toString()}
          decimals={nativeToken?.decimals || DEFAULT_TOKEN_DECIMALS}
        />
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
            {teams?.map(
              ({ nativeId, color, teamName }, index) =>
                index < 5 && (
                  <li key={nativeId} className="flex items-center text-sm mb-3">
                    <TeamReputationSummaryRow
                      color={color}
                      id={nativeId || Id.RootDomain}
                      name={teamName}
                    />
                  </li>
                ),
            )}
          </ul>
          {showOthers && (
            <div className="flex items-center text-sm">
              <span className="flex items-center flex-grow">
                <span className="flex rounded-full w-[0.625rem] h-[0.625rem] mr-2 bg-gray-100" />
                <span>
                  {formatMessage({
                    id: 'label.allOther',
                  })}
                </span>
              </span>
              {/* @TODO: Add login for this */}
              <span className="font-medium">230.32</span>
            </div>
          )}
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
