import React, { useMemo } from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { DEFAULT_NETWORK_INFO } from '~constants';
import { ACTION } from '~constants/actions';
import { useActionSidebarContext } from '~context/ActionSidebarContext';
import { NativeTokenStatus, TokenFragment } from '~gql';
import { getBlockExplorerLink } from '~utils/external';
import { formatText } from '~utils/intl';
import { ACTION_TYPE_FIELD_NAME } from '~v5/common/ActionSidebar/consts';
import Link from '~v5/shared/Link';
import MeatBallMenu from '~v5/shared/MeatBallMenu';
import { MeatBallMenuProps } from '~v5/shared/MeatBallMenu/types';

const displayName =
  'v5.pages.BalancePage.partials.BalanceTable.partials.TokenMeatballMenu';
const MSG = defineMessages({
  labelAddFunds: {
    id: `${displayName}.labelAddFunds`,
    defaultMessage: 'Add funds',
  },
  labelMintToken: {
    id: `${displayName}.labelMintToken`,
    defaultMessage: 'Mint tokens',
  },
  labelTransferFunds: {
    id: `${displayName}.transferFunds`,
    defaultMessage: 'Transfer funds',
  },
  labelMakePayment: {
    id: `${displayName}.makePayment`,
    defaultMessage: 'Make payment using this token',
  },
});

interface TokenMeatballMenuProps {
  token: TokenFragment;
  toggleAddFundsModalOn: () => void;
  nativeTokenStatus?: NativeTokenStatus | null;
  isTokenNative?: boolean;
}

export const TokenMeatballMenu = ({
  token,
  toggleAddFundsModalOn,
  nativeTokenStatus,
  isTokenNative = false,
}: TokenMeatballMenuProps) => {
  const { formatMessage } = useIntl();
  const {
    actionSidebarToggle: [, { toggleOn: toggleActionSidebarOn }],
  } = useActionSidebarContext();

  const menuProps = useMemo<MeatBallMenuProps>(() => {
    return {
      cardClassName: 'min-w-[9.625rem] whitespace-nowrap',
      items: [
        ...(!isTokenNative && !nativeTokenStatus?.unlocked
          ? [
              {
                key: 'add_funds',
                onClick: () => {
                  toggleAddFundsModalOn();
                },
                label: formatMessage(MSG.labelAddFunds),
                icon: 'add',
              },
            ]
          : []),
        {
          key: 'view_ethscan',
          renderItemWrapper: (props, children) => (
            <Link
              to={getBlockExplorerLink({
                linkType: 'address',
                addressOrHash: token.tokenAddress,
              })}
              {...props}
            >
              {children}
            </Link>
          ),
          label: formatText(
            { id: 'balancePage.labelEthscan.viewOn' },
            {
              networkName: DEFAULT_NETWORK_INFO.blockExplorerName,
            },
          ),
          icon: 'arrow-square-out',
        },
        ...(isTokenNative
          ? [
              {
                key: 'mint_tokens',
                onClick: () => {
                  toggleActionSidebarOn({
                    [ACTION_TYPE_FIELD_NAME]: ACTION.MINT_TOKENS,
                  });
                },
                label: formatMessage(MSG.labelMintToken),
                icon: 'bank',
              },
            ]
          : []),
        {
          key: 'transfer_funds',
          onClick: () => {
            toggleActionSidebarOn({
              [ACTION_TYPE_FIELD_NAME]: ACTION.TRANSFER_FUNDS,
              amount: {
                tokenAddress: token.tokenAddress,
              },
            });
          },
          label: formatMessage(MSG.labelTransferFunds),
          icon: 'transfer',
        },
        {
          key: 'make_payment',
          onClick: () => {
            toggleActionSidebarOn({
              [ACTION_TYPE_FIELD_NAME]: ACTION.SIMPLE_PAYMENT,
              amount: {
                tokenAddress: token.tokenAddress,
              },
            });
          },
          label: formatMessage(MSG.labelMakePayment),
          icon: 'hand-coins',
        },
      ],
    };
  }, [
    token,
    toggleActionSidebarOn,
    toggleAddFundsModalOn,
    isTokenNative,
    nativeTokenStatus,
    formatMessage,
  ]);

  return <MeatBallMenu {...menuProps} />;
};
