import React, { ReactNode, Dispatch, SetStateAction } from 'react';

import Popover from '~shared/Popover';
// import TokenIcon from '~dashboard/HookedTokenIcon';
import Numeral from '~shared/Numeral';
// import { TokenBalancesForDomainsQuery } from '~data/index';
import Avatar from '~shared/Avatar';
import { Address, Token } from '~types';
// import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
import { getTokenDecimalsWithFallback } from '~utils/tokens';

import styles from './ColonyTotalFundsPopover.css';

interface Props {
  onSelectToken?: Dispatch<SetStateAction<Address>>;
  tokens?: Token[];
  children?: ReactNode;
  currentTokenAddress?: Address;
}

const displayName = 'common.ColonyTotalFunds.ColonyTotalFundsPopover';

const ColonyTotalFundsPopover = ({
  children,
  onSelectToken,
  tokens,
  currentTokenAddress,
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
                    {/* <TokenIcon
                      className={styles.tokenIcon}
                      token={token}
                      name={token.name || token.tokenAddress}
                    /> */}
                    <Avatar
                      seed={token.tokenAddress}
                      title={token.name || token.tokenAddress}
                      placeholderIcon="circle-close"
                    />
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
                        // value={
                        //   token.balances[COLONY_TOTAL_BALANCE_DOMAIN_ID].amount
                        // }
                        value={0}
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
