import React, { FC, useMemo } from 'react';

import { useGetUserTokenBalanceQuery } from '~gql';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import Numeral from '~shared/Numeral';
import { useColonyContext } from '~hooks';
import { formatText } from '~utils/intl';
import { useTokensModalContext } from '~context/TokensModalContext';
import { TOKENS_MODAL_TYPES } from '~v5/common/TokensModal/consts';

import { UserHubTabs } from '../../../UserHubContent/types';
import ReputationTabSection from '../ReputationTabSection';
import { BalanceProps } from './types';

const displayName =
  'common.Extensions.UserHub.partials.ReputationTab.partials.Balance';

const Balance: FC<BalanceProps> = ({
  nativeToken,
  wallet,
  className,
  onTabChange,
}) => {
  const { colony } = useColonyContext();

  const { data: tokenBalanceQueryData } = useGetUserTokenBalanceQuery({
    variables: {
      input: {
        walletAddress: wallet?.address ?? '',
        tokenAddress: nativeToken?.tokenAddress ?? '',
        colonyAddress: colony?.colonyAddress ?? '',
      },
    },
    skip: !wallet?.address || !nativeToken?.tokenAddress,
  });
  const tokenBalanceData = tokenBalanceQueryData?.getUserTokenBalance;

  const tokenDecimals = useMemo(
    () => getTokenDecimalsWithFallback(nativeToken?.decimals),
    [nativeToken],
  );

  const { toggleOnTokensModal, setTokensModalType } = useTokensModalContext();

  return (
    <ReputationTabSection
      className={className}
      title={formatText({ id: 'balance.in.colony' }) || ''}
      items={[
        {
          key: '1',
          title: formatText({ id: 'total.balance' }) || '',
          value: (
            <Numeral
              className="font-medium ml-1"
              value={tokenBalanceData?.balance ?? 0}
              decimals={tokenDecimals}
              suffix={nativeToken?.symbol || 'CLNY'}
              appearance={{ size: 'small' }}
            />
          ),
        },
        {
          key: '2',
          title: formatText({ id: 'active' }) || '',
          actions: [
            {
              key: '1',
              iconName: 'arrow-circle-down-right',
              text: formatText({ id: 'button.activate' }),
              onClick: () => {
                toggleOnTokensModal();
                setTokensModalType(TOKENS_MODAL_TYPES.activate);
              },
            },
            {
              key: '2',
              iconName: 'arrow-circle-up-right',
              text: formatText({ id: 'button.deactivate' }),
              onClick: () => {
                toggleOnTokensModal();
                setTokensModalType(TOKENS_MODAL_TYPES.deactivate);
              },
            },
          ],
          value: (
            <Numeral
              className="font-medium ml-1"
              value={tokenBalanceData?.activeBalance ?? 0}
              decimals={tokenDecimals}
              suffix={nativeToken?.symbol || 'CLNY'}
              appearance={{ size: 'small' }}
            />
          ),
        },
        {
          key: '3',
          title: formatText({ id: 'staked' }) || '',
          actions: [
            {
              // @todo: add action
              key: '1',
              iconName: 'eye',
              text: formatText({ id: 'view' }),
              onClick: () => onTabChange(UserHubTabs.Stakes),
            },
          ],
          value: (
            <Numeral
              className="font-medium ml-1"
              value={tokenBalanceData?.lockedBalance ?? 0}
              decimals={tokenDecimals}
              suffix={nativeToken?.symbol || 'CLNY'}
              appearance={{ size: 'small' }}
            />
          ),
        },
      ]}
    />
  );
};

Balance.displayName = displayName;

export default Balance;
