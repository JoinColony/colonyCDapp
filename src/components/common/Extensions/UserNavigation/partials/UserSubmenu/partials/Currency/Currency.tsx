import React from 'react';

import { useCurrencyContext } from '~context/CurrencyContext.tsx';
import { SupportedCurrencies } from '~gql';
import ClnyTokenIcon from '~icons/ClnyTokenIcon.tsx';

import { currencyIcons } from '../../../UserMenu/consts.ts';
import CoinGeckoAttribution from '../../CoinGeckoAttribution.tsx';
import MenuList from '../MenuList/index.ts';
import MenuListItem from '../MenuListItem/index.ts';

const displayName =
  'common.Extensions.UserNavigation.partials.UserSubmenu.partials.Currency';

interface CurrencyProps {
  closeSubmenu: VoidFunction;
}

const Currency = ({ closeSubmenu }: CurrencyProps) => {
  const { updatePreferredCurrency } = useCurrencyContext();
  const iconSize = 18;

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
                  onClick={() => {
                    handleCurrencyClick(currency);
                  }}
                >
                  <CurrencyIcon size={iconSize} />
                  <p>{currency.toUpperCase()}</p>
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
