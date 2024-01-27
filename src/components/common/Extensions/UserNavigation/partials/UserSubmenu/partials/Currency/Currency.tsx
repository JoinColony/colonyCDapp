import React from 'react';

import { useCurrencyContext } from '~context/CurrencyContext.tsx';
import { SupportedCurrencies } from '~gql';
import { useMobile } from '~hooks/index.ts';
import Icon from '~shared/Icon/index.ts';

import { currencyIconTitles } from '../../../UserMenu/consts.ts';
import CoinGeckoAttribution from '../../CoinGeckoAttribution.tsx';
import MenuList from '../MenuList/index.ts';
import MenuListItem from '../MenuListItem/index.ts';

import styles from '../Submenu.module.css';

const displayName =
  'common.Extensions.UserNavigation.partials.UserSubmenu.partials.Currency';

interface CurrencyProps {
  closeSubmenu: VoidFunction;
}

const Currency = ({ closeSubmenu }: CurrencyProps) => {
  const { updatePreferredCurrency } = useCurrencyContext();
  const isMobile = useMobile();
  const iconSize = isMobile ? 'small' : 'tiny';

  const handleCurrencyClick = (currency: SupportedCurrencies) => {
    updatePreferredCurrency(currency);
    closeSubmenu();
  };

  return (
    <>
      <MenuList className="columns-2">
        {Object.values(SupportedCurrencies)
          .reverse()
          .map((currency) => (
            <MenuListItem key={currency}>
              <button
                type="button"
                className={styles.actionItem}
                onClick={() => {
                  handleCurrencyClick(currency);
                }}
              >
                <Icon
                  name={currencyIconTitles[currency]}
                  appearance={{ size: iconSize }}
                />
                <p className={styles.actionItemLabel}>
                  {currency.toUpperCase()}
                </p>
              </button>
            </MenuListItem>
          ))}
      </MenuList>

      {/* Can be removed if/when upgrading to paid plan */}
      <CoinGeckoAttribution />
    </>
  );
};

Currency.displayName = displayName;
export default Currency;
