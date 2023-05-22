import React, { ReactNode, Dispatch, SetStateAction } from 'react';

import Popover from '~shared/Popover';
import TokenIcon from '~shared/TokenIcon';
import Numeral from '~shared/Numeral';
import { Address, ColonyBalances, Token } from '~types';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import { getCurrentTokenRootBalance } from './helpers';

import styles from './ColonyTotalFundsPopover.css';

interface Props {
  onSelectToken?: Dispatch<SetStateAction<Address>>;
  tokens?: Token[];
  children?: ReactNode;
  currentTokenAddress?: Address;
  balances?: ColonyBalances | null;
}

const displayName = 'common.ColonyTotalFunds.ColonyTotalFundsPopover';

const ColonyTotalFundsPopover = ({
  children,
  onSelectToken,
  tokens,
  currentTokenAddress,
  balances,
}: Props) => {
  return tokens ? (
    <Popover
      renderContent={({ close }) => (
        <ul className={styles.main}>
          {tokens.map((token) => (
            <li key={token.tokenAddress}>
              <button
                type="button"
                onClick={() => {
                  if (onSelectToken) {
                    onSelectToken(token.tokenAddress);
                  }
                  close();
                }}
              >
                <div className={styles.token}>
                  <div className={styles.tokenIconContainer}>
                    <TokenIcon className={styles.tokenIcon} token={token} />
                  </div>
                  <div
                    className={
                      token.tokenAddress === currentTokenAddress
                        ? styles.tokenInfoContainerActive
                        : styles.tokenInfoContainer
                    }
                  >
                    <span className={styles.tokenSymbol}>
                      {token.symbol || '???'}
                    </span>
                    <span className={styles.tokenBalance}>
                      <Numeral
                        decimals={getTokenDecimalsWithFallback(token.decimals)}
                        value={
                          getCurrentTokenRootBalance(
                            balances,
                            token.tokenAddress,
                          ) ?? 0
                        }
                      />
                    </span>
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
      trigger="click"
      showArrow={false}
      placement="bottom"
      popperOptions={{
        modifiers: [
          {
            name: 'offset',
            options: {
              /*
               * @NOTE Values are set manual, exactly as the ones provided in the figma spec.
               *
               * There's no logic to how they are calculated, so next time you need
               * to change them you'll either have to go by exact specs, or change
               * them until it "feels right" :)
               */
              offset: [106, 4],
            },
          },
        ],
      }}
    >
      {children}
    </Popover>
  ) : null;
};

ColonyTotalFundsPopover.displayName = displayName;

export default ColonyTotalFundsPopover;
