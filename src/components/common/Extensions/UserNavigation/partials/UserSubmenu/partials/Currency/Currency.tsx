import React from 'react';

import { useCurrencyContext } from '~context/CurrencyContext';
import { SupportedCurrencies } from '~gql';
import useMobile from '~hooks/useMobile';
import Icon from '~shared/Icon';

import { currencyIconTitles } from '../../../UserMenu/consts';
import MenuList from '../MenuList';
import MenuListItem from '../MenuListItem';

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
    <MenuList>
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
              <p className={styles.actionItemLabel}>{currency.toUpperCase()}</p>
            </button>
          </MenuListItem>
        ))}
    </MenuList>
  );
};

Currency.displayName = displayName;
export default Currency;
