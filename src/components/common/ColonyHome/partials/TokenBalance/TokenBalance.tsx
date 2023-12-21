import React from 'react';
import { useLocation } from 'react-router-dom';
import useColonyContext from '~hooks/useColonyContext';
import { useGetSelectedTeamFilter } from '~hooks/useTeamsBreadcrumbs';
import { COLONY_BALANCES_ROUTE } from '~routes';
import Numeral from '~shared/Numeral';
import { formatText } from '~utils/intl';
import {
  getBalanceForTokenAndDomain,
  getTokenDecimalsWithFallback,
} from '~utils/tokens';
import WidgetBox from '~v5/common/WidgetBox';

const displayName = 'common.ColonyHome.Members';

const TokenBalance = () => {
  const { search } = useLocation();

  const { colony } = useColonyContext();
  const { balances, nativeToken } = colony || {};

  const selectedTeam = useGetSelectedTeamFilter();
  const nativeTeamId = selectedTeam?.nativeId;

  const currentTokenBalance =
    getBalanceForTokenAndDomain(
      balances,
      nativeToken?.tokenAddress || '',
      nativeTeamId,
    ) || 0;

  return (
    <WidgetBox
      title={formatText({ id: 'colonyHome.funds' })}
      value={
        <div className="flex items-center gap-2 heading-4">
          <Numeral
            value={currentTokenBalance}
            decimals={getTokenDecimalsWithFallback(nativeToken?.decimals)}
          />
          <span className="text-1">{nativeToken?.symbol}</span>
        </div>
      }
      href={COLONY_BALANCES_ROUTE}
      searchParams={search}
    />
  );
};

TokenBalance.displayName = displayName;
export default TokenBalance;
