import React from 'react';

import { useCurrencyContext } from '~context/CurrencyContext.tsx';
import { SupportedCurrencies } from '~gql';
import { useMobile } from '~hooks/index.ts';
import ClnyTokenIcon from '~icons/ClnyTokenIcon.tsx';

import { currencyIcons } from '../../../UserMenu/consts.ts';
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
  const iconSize = isMobile ? 18 : 14;

  const handleCurrencyClick = (currency: SupportedCurrencies) => {
    updatePreferredCurrency(currency);
    closeSubmenu();
  };

  return (
    <>
      <MenuList className="columns-2">
        {Object.values(SupportedCurrencies)
          .reverse()
          .map((currency) => {
            const CurrencyIcon = currencyIcons[currency] || ClnyTokenIcon;
            return (
              <MenuListItem key={currency}>
                <button
                  type="button"
                  className={styles.actionItem}
                  onClick={() => {
                    handleCurrencyClick(currency);
                  }}
                >
                  <CurrencyIcon size={iconSize} />
                  <p className={styles.actionItemLabel}>
                    {currency.toUpperCase()}
                  </p>
                </button>
              </MenuListItem>
            );
          })}
      </MenuList>

      {/* Can be removed if/when upgrading to paid plan */}
      <CoinGeckoAttribution />
    </>
  );
};

Currency.displayName = displayName;
export default Currency;
