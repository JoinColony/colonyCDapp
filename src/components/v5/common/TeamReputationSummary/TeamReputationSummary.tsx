import React, { FC } from 'react';
import { Id } from '@colony/colony-js';
import Decimal from 'decimal.js';

import { DEFAULT_TOKEN_DECIMALS } from '~constants';
import { useColonyContext } from '~hooks';
import { TextButton } from '~v5/shared/Button';
import Icon from '~shared/Icon';
import Numeral from '~shared/Numeral';
import MenuContainer from '~v5/shared/MenuContainer';
import TitleLabel from '~v5/shared/TitleLabel';
import { notNull } from '~utils/arrays';
import { formatText } from '~utils/intl';

import TeamReputationSummaryRow from './partials/TeamReputationSummaryRow';

const displayName = 'v5.common.TeamReputationSummary';

const TeamReputationSummary: FC = () => {
  const { colony } = useColonyContext();
  const { nativeToken, domains, reputation } = colony || {};

  const colonyReputation = reputation ?? '0';
  const teams = domains?.items
    .filter(notNull)
    .filter(({ nativeId }) => nativeId !== Id.RootDomain);

  const showOthers = teams && teams?.length > 5;

  return (
    <MenuContainer className="w-full">
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
          id: 'label.pointsPerTeam',
        })}
      />
      {teams?.length ? (
        <>
          <ul>
            {teams?.map((team, index) => {
              const { nativeId } = team;
              return (
                index < 5 && (
                  <li key={nativeId} className="flex items-center text-sm mb-3">
                    <TeamReputationSummaryRow team={team} suffix="%" />
                  </li>
                )
              );
            })}
          </ul>
          {showOthers && (
            <div className="flex items-center text-sm">
              <span className="flex items-center flex-grow">
                <span className="flex rounded-full w-[0.625rem] h-[0.625rem] mr-2 bg-gray-100" />
                <span>
                  {formatText({
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
            {formatText({ id: 'teamReputation.noTeams' })}
          </span>
          {/* @TODO handle action on click - creating a team */}
          <TextButton mode="underlined">
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
