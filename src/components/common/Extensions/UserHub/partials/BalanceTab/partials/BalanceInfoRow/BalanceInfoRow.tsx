import { ArrowDownRight, ArrowUpRight } from '@phosphor-icons/react';
import React, { type FC, useMemo } from 'react';
import { defineMessages } from 'react-intl';

import UserHubInfoSection from '~common/Extensions/UserHub/partials/UserHubInfoSection/UserHubInfoSection.tsx';
import { UserHubTab } from '~common/Extensions/UserHub/types.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useTokensModalContext } from '~context/TokensModalContext/TokensModalContext.ts';
import { useGetUserTokenBalanceQuery } from '~gql';
import Numeral from '~shared/Numeral/index.ts';
import { formatText } from '~utils/intl.ts';
import { multiLineTextEllipsis } from '~utils/strings.ts';
import { getTokenDecimalsWithFallback } from '~utils/tokens.ts';
import { TokensModalType } from '~v5/common/TokensModal/consts.ts';
import Button from '~v5/shared/Button/index.ts';

import { type BalanceInfoRowProps } from './types.ts';

const displayName =
  'common.Extensions.UserHub.partials.BalanceTab.partials.BalanceInfoRow';

const MSG = defineMessages({
  title: {
    id: `${displayName}.title`,
    defaultMessage: 'Balance in this colony',
  },
  viewStakes: {
    id: `${displayName}.viewStakes`,
    defaultMessage: 'View stakes',
  },
  totalBalance: {
    id: `${displayName}.totalBalance`,
    defaultMessage: 'Total balance',
  },
  activeFunds: {
    id: `${displayName}.activeFunds`,
    defaultMessage: 'Active funds',
  },
  stakedFunds: {
    id: `${displayName}.stakedFunds`,
    defaultMessage: 'Staked funds',
  },
  depositFunds: {
    id: `${displayName}.depositFunds`,
    defaultMessage: 'Deposit funds',
  },
  withdrawalFunds: {
    id: `${displayName}.withdrawalFunds`,
    defaultMessage: 'Withdrawal funds',
  },
});

const BalanceInfoRow: FC<BalanceInfoRowProps> = ({
  nativeToken,
  wallet,
  onTabChange,
  className,
}) => {
  const {
    colony: { colonyAddress },
  } = useColonyContext();

  const { data: tokenBalanceQueryData } = useGetUserTokenBalanceQuery({
    variables: {
      input: {
        walletAddress: wallet?.address ?? '',
        tokenAddress: nativeToken?.tokenAddress ?? '',
        colonyAddress,
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
    <UserHubInfoSection
      className={className}
      title={formatText(MSG.title)}
      viewLinkProps={{
        text: formatText(MSG.viewStakes),
        onClick: () => onTabChange(UserHubTab.Stakes),
      }}
      items={[
        {
          key: '1',
          label: formatText(MSG.totalBalance),
          value: (
            <Numeral
              value={tokenBalanceData?.balance ?? 0}
              decimals={tokenDecimals}
              suffix={` ${multiLineTextEllipsis(nativeToken?.symbol ?? 'CLNY', 5)}`}
              appearance={{ size: 'small' }}
            />
          ),
        },
        {
          key: '2',
          label: formatText(MSG.activeFunds),
          value: (
            <Numeral
              value={tokenBalanceData?.activeBalance ?? 0}
              decimals={tokenDecimals}
              suffix={` ${multiLineTextEllipsis(nativeToken?.symbol ?? 'CLNY', 5)}`}
              appearance={{ size: 'small' }}
            />
          ),
        },
        {
          key: '3',
          label: formatText(MSG.stakedFunds),
          value: (
            <Numeral
              value={tokenBalanceData?.lockedBalance ?? 0}
              decimals={tokenDecimals}
              suffix={` ${multiLineTextEllipsis(nativeToken?.symbol ?? 'CLNY', 5)}`}
              appearance={{ size: 'small' }}
            />
          ),
        },
      ]}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-end sm:gap-4">
        <Button
          mode="primaryOutline"
          size="medium"
          icon={ArrowDownRight}
          iconSize={18}
          text={formatText(MSG.depositFunds)}
          onClick={() => {
            toggleOnTokensModal();
            setTokensModalType(TokensModalType.Activate);
          }}
        />
        <Button
          mode="primaryOutline"
          size="medium"
          icon={ArrowUpRight}
          iconSize={18}
          text={formatText(MSG.withdrawalFunds)}
          onClick={() => {
            toggleOnTokensModal();
            setTokensModalType(TokensModalType.Deactivate);
          }}
        />
      </div>
    </UserHubInfoSection>
  );
};

BalanceInfoRow.displayName = displayName;

export default BalanceInfoRow;
